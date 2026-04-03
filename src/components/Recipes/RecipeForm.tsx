import React, { useState, useRef, useEffect } from 'react';
import { Recipe } from '../../types';
import { Plus, X, Upload, Wand2 } from 'lucide-react';
import { useRecipes } from '../../hooks/useRecipes';

type Props = {
  recipe?: Recipe;
  onClose: () => void;
};

const COOKING_TIME_PATTERNS = [
  { pattern: /(\d+)\s*(?:min|minutes?|h|heure|heures)\s+(?:de\s+)?cuisson/gi, multiplier: 1 },
  { pattern: /cuire?.*?(\d+)\s*(?:min|minutes?|h|heure|heures)/gi, multiplier: 1 },
  { pattern: /(\d+)\s*(?:min|minutes?|h|heure|heures)\s+à\s+(?:la|au)/gi, multiplier: 1 },
  { pattern: /(\d+)\s*(?:min|minutes?|h|heure|heures)\s+(?:four|température)/gi, multiplier: 1 },
];

function detectCookingTime(text: string): number {
  for (const { pattern } of COOKING_TIME_PATTERNS) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const time = parseInt(match[1]);
      if (time > 0 && time < 1000) {
        return time;
      }
    }
  }
  return 0;
}

export function RecipeForm({ recipe, onClose }: Props) {
  const { addRecipe, updateRecipe } = useRecipes();
  const [formData, setFormData] = useState<Omit<Recipe, 'id'>>({
    name: recipe?.name || '',
    image: recipe?.image || '',
    category: recipe?.category || 'Viande',
    servings: recipe?.servings || 4,
    prepTime: recipe?.prepTime || 0,
    cookTime: recipe?.cookTime || 0,
    ingredients: recipe?.ingredients || [],
    steps: recipe?.steps || [],
    tags: recipe?.tags || []
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(recipe?.image || '');

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setFormData(prev => ({ ...prev, image: base64 }));
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetectCookingTime = () => {
    const allText = [formData.name, ...formData.steps].join(' ');
    const detectedTime = detectCookingTime(allText);
    if (detectedTime > 0) {
      setFormData(prev => ({ ...prev, cookTime: detectedTime }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      if (recipe?.id) {
        await updateRecipe(recipe.id, formData);
      } else {
        await addRecipe(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving recipe:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', quantity: 0, unit: '' }]
    }));
  };

  const updateIngredient = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) =>
        i === index ? { ...ing, [field]: value } : ing
      )
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, '']
    }));
  };

  const updateStep = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => i === index ? value : step)
    }));
  };

  const removeStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div ref={modalRef} className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{recipe ? 'Modifier' : 'Nouvelle'} Recette</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Nom</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Image</label>
            <div className="flex gap-3 items-start">
              <div className="flex-1">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Cliquez pour importer une photo</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Aperçu"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Catégorie</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Recipe['category'] }))}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="Viande">Viande</option>
                <option value="Poisson">Poisson</option>
                <option value="Végétarien">Végétarien</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Personnes</label>
              <input
                type="number"
                value={formData.servings}
                onChange={(e) => setFormData(prev => ({ ...prev, servings: Number(e.target.value) }))}
                className="w-full border rounded-lg px-3 py-2"
                min="1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Préparation (min)</label>
              <input
                type="number"
                value={formData.prepTime}
                onChange={(e) => setFormData(prev => ({ ...prev, prepTime: Number(e.target.value) }))}
                className="w-full border rounded-lg px-3 py-2"
                min="0"
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">Cuisson (min)</label>
                <button
                  type="button"
                  onClick={handleDetectCookingTime}
                  className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                >
                  <Wand2 className="w-4 h-4" />
                  Détecter
                </button>
              </div>
              <input
                type="number"
                value={formData.cookTime}
                onChange={(e) => setFormData(prev => ({ ...prev, cookTime: Number(e.target.value) }))}
                className="w-full border rounded-lg px-3 py-2"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ingrédients</label>
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={ingredient.name}
                  onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2"
                  placeholder="Nom"
                  required
                />
                <input
                  type="number"
                  value={ingredient.quantity}
                  onChange={(e) => updateIngredient(index, 'quantity', Number(e.target.value))}
                  className="w-24 border rounded-lg px-3 py-2"
                  placeholder="Quantité"
                  step="0.1"
                  required
                />
                <input
                  type="text"
                  value={ingredient.unit}
                  onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                  className="w-24 border rounded-lg px-3 py-2"
                  placeholder="Unité"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addIngredient}
              className="flex items-center gap-2 text-blue-500 hover:text-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Ajouter un ingrédient
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Étapes</label>
            {formData.steps.map((step, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={step}
                  onChange={(e) => updateStep(index, e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2"
                  placeholder={`Étape ${index + 1}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addStep}
              className="flex items-center gap-2 text-blue-500 hover:text-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Ajouter une étape
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 rounded-lg transition-colors ${
              isSubmitting
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isSubmitting ? 'Sauvegarde en cours...' : (recipe ? 'Mettre à jour' : 'Créer') + ' la recette'}
          </button>
        </form>
      </div>
    </div>
  );
}
