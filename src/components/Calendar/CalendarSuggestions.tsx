import React, { useState } from 'react';
import { Recipe } from '../../types';
import { Plus, Trash2 } from 'lucide-react';

type Props = {
  recipes: Recipe[];
  onAddSuggestion: (suggestion: Recipe) => Promise<void>;
};

export function CalendarSuggestions({ recipes, onAddSuggestion }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState('');
  const [suggestions, setSuggestions] = useState<Recipe[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSuggestion = async () => {
    if (!selectedRecipeId) return;

    const recipe = recipes.find(r => r.id === selectedRecipeId);
    if (recipe) {
      try {
        setIsAdding(true);
        setSuggestions(prev => [...prev, recipe]);
        setSelectedRecipeId('');
        await onAddSuggestion(recipe);
      } finally {
        setIsAdding(false);
      }
    }
  };

  const handleRemoveSuggestion = (recipeId: string) => {
    setSuggestions(prev => prev.filter(r => r.id !== recipeId));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Suggestions de repas</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter une suggestion
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Choisir une recette à suggérer
              </label>
              <select
                value={selectedRecipeId}
                onChange={(e) => setSelectedRecipeId(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Sélectionner une recette</option>
                {recipes.map((recipe) => (
                  <option key={recipe.id} value={recipe.id}>
                    {recipe.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAddSuggestion}
                disabled={!selectedRecipeId || isAdding}
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {isAdding ? 'Ajout...' : 'Ajouter'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-200 text-gray-600 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {suggestions.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            Aucune suggestion pour le moment. Ajoutez des recettes à suggérer!
          </p>
        ) : (
          suggestions.map((recipe) => (
            <div
              key={recipe.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {recipe.image && (
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-medium">{recipe.name}</p>
                  <p className="text-sm text-gray-500">
                    {recipe.cookTime}min • {recipe.category}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveSuggestion(recipe.id)}
                className="text-red-500 hover:text-red-700 transition-colors p-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
