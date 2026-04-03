import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader } from 'lucide-react';
import { Recipe } from '../types';

type Props = {
  onClose: () => void;
  onRecipeExtracted: (recipe: Omit<Recipe, 'id'>) => void;
};

const RECIPE_EXTRACTION_PROMPT = `Analyze the provided text and extract recipe information. Return ONLY a valid JSON object (no markdown, no extra text) with this structure:
{
  "name": "Recipe name",
  "ingredients": [
    {"name": "ingredient name", "quantity": number, "unit": "unit"}
  ],
  "steps": ["step 1", "step 2"],
  "category": "Viande|Poisson|Végétarien",
  "servings": number,
  "cookTime": number (in minutes)
}

Be strict and only return the JSON object. If data is missing, use reasonable defaults.`;

function parseIngredientLine(line: string) {
  const cleanLine = line.replace(/^[-•*\d.)\s]+/, '').trim();
  if (!cleanLine || cleanLine.length < 3) return null;

  const patterns = [
    /^(.+?)\s*[:-]\s*(\d+(?:[.,]\d+)?)\s*(g|kg|ml|l|c\.|cuillère|cuil|cc|cs|cl|dl|dl|botte|bottes|tranche|tranches|poignée|poignées|noix|noix|morceau|morceaux|feuille|feuilles|branche|branches|filet|filets|verre|verres|bol|bols|pot|pots|boîte|boîtes|baguette|baguettes|œuf|œufs|gousse|gousses|sachet|sachets|paquet|paquets|part|parts|oeuf|oeufs|bâton|bâtons|cube|cubes|tube|tubes|pincée|pincées)?/i,
    /^(.+?)\s+(\d+(?:[.,]\d+)?)\s*(g|kg|ml|l|c\.|cuillère|cuil|cc|cs|cl|dl|botte|bottes|tranche|tranches|poignée|poignées|noix|morceau|morceaux|feuille|feuilles|branche|branches|filet|filets|verre|verres|bol|bols|pot|pots|boîte|boîtes|baguette|baguettes|œuf|œufs|gousse|gousses|sachet|sachets|paquet|paquets|part|parts|oeuf|oeufs|bâton|bâtons|cube|cubes|tube|tubes|pincée|pincées)(?:\s|$)/i,
  ];

  for (const pattern of patterns) {
    const match = cleanLine.match(pattern);
    if (match && match[1] && match[2]) {
      const unit = match[3] || 'g';
      return {
        name: match[1].trim(),
        quantity: parseFloat(match[2].replace(',', '.')),
        unit: unit.toLowerCase()
      };
    }
  }

  if (cleanLine.length > 3) {
    return {
      name: cleanLine,
      quantity: 1,
      unit: ''
    };
  }

  return null;
}

function parseRecipeFromText(text: string): Omit<Recipe, 'id'> | null {
  const lines = text.split('\n').filter(l => l.trim());
  if (lines.length < 3) return null;

  const recipe: Omit<Recipe, 'id'> = {
    name: 'Nouvelle recette',
    image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&h=500&fit=crop',
    category: 'Viande',
    servings: 4,
    prepTime: 0,
    cookTime: 0,
    ingredients: [],
    steps: [],
    tags: []
  };

  let inIngredients = false;
  let inSteps = false;
  let recipeNameSet = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim().toLowerCase();

    if (!recipeNameSet && (trimmed.includes('recette') || trimmed.includes('titre') || i === 0) && !inIngredients && !inSteps) {
      recipe.name = line.replace(/^(recette|titre|recipe|nom|name)[\s:]*[-–]?\s*/i, '').trim();
      recipeNameSet = true;
      if (recipe.name.length > 50) {
        recipe.name = recipe.name.substring(0, 50);
      }
      continue;
    }

    if (trimmed.match(/^[#*]*\s*(ingrédients|ingredients|ingr|liste.*ingrédients)/i) || trimmed.match(/^pour\s+\d+/i)) {
      inIngredients = true;
      inSteps = false;
      continue;
    }

    if (trimmed.match(/^[#*]*\s*(préparation|preparation|étapes|etapes|instructions|mode|cuisson|cooking|steps)/i)) {
      inSteps = true;
      inIngredients = false;
      continue;
    }

    if (trimmed.match(/\b(viande|beef|chicken|porc|veau|agneau|poisson|fish|salmon|trout|vegetarian|végétarien|vegan|légumes)\b/i)) {
      if (trimmed.match(/\b(viande|beef|chicken|porc|veau|agneau)\b/i)) {
        recipe.category = 'Viande';
      } else if (trimmed.match(/\b(poisson|fish|salmon|trout)\b/i)) {
        recipe.category = 'Poisson';
      } else if (trimmed.match(/\b(vegetarian|végétarien|vegan|légumes)\b/i)) {
        recipe.category = 'Végétarien';
      }
    }

    const timeMatch = trimmed.match(/(\d+)\s*(?:min|minutes?|h|heures?)\s+(?:de\s+)?(cuisson|préparation|prep|cooking)/i);
    if (timeMatch) {
      const time = parseInt(timeMatch[1]);
      if (timeMatch[3]?.includes('cuisson') || timeMatch[3]?.includes('cooking')) {
        recipe.cookTime = Math.max(recipe.cookTime, time);
      } else {
        recipe.prepTime = Math.max(recipe.prepTime, time);
      }
    }

    if (inIngredients && trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('*')) {
      const ingredient = parseIngredientLine(line);
      if (ingredient && !recipe.ingredients.find(i => i.name.toLowerCase() === ingredient.name.toLowerCase())) {
        recipe.ingredients.push(ingredient);
      }
    }

    if (inSteps && trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('*') && trimmed.length > 10) {
      const step = line.trim().replace(/^[\d.)\-*]\s+/, '');
      if (step.length > 10 && !recipe.steps.includes(step)) {
        recipe.steps.push(step);
      }
    }
  }

  if (recipe.ingredients.length < 2 || recipe.steps.length === 0) {
    return null;
  }

  return recipe;
}

export function RecipeImportChat({ onClose, onRecipeExtracted }: Props) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: 'Bonjour! Je peux vous aider à ajouter une recette. Vous pouvez:\n\n1. Copier-coller une recette (texte)\n2. Me la décrire verbalement\n3. Me donner les ingrédients et étapes\n\nQu\'allez-vous faire?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [extractedRecipe, setExtractedRecipe] = useState<Omit<Recipe, 'id'> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setIsLoading(true);

    try {
      const recipe = parseRecipeFromText(text);

      if (recipe && recipe.ingredients.length > 0 && recipe.steps.length > 0) {
        setExtractedRecipe(recipe);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `J'ai extrait une recette: "${recipe.name}" avec ${recipe.ingredients.length} ingrédients et ${recipe.steps.length} étapes. Voulez-vous la valider et l'ajouter?`
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Je n\'ai pas pu extraire une recette complète. Pouvez-vous être plus spécifique? Veuillez inclure:\n\n- Le nom de la recette\n- Les ingrédients (avec quantités)\n- Les étapes de préparation'
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Désolé, je n\'ai pas pu traiter votre message. Essayez à nouveau.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmRecipe = () => {
    if (extractedRecipe) {
      onRecipeExtracted(extractedRecipe);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md h-[600px] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Assistant Recette</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                <Loader className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {extractedRecipe && (
          <div className="border-t bg-blue-50 p-4 space-y-2">
            <p className="text-sm font-medium">Recette extraite: <strong>{extractedRecipe.name}</strong></p>
            <div className="flex gap-2">
              <button
                onClick={handleConfirmRecipe}
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Ajouter la recette
              </button>
              <button
                onClick={() => setExtractedRecipe(null)}
                className="flex-1 bg-gray-200 text-gray-600 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Modifier
              </button>
            </div>
          </div>
        )}

        <div className="border-t p-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(input)}
            placeholder="Collez votre recette ici..."
            className="flex-1 border rounded-lg px-3 py-2 text-sm"
          />
          <button
            onClick={() => handleSendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
