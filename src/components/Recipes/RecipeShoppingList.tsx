import React from 'react';
import { Recipe, ShoppingListItem } from '../../types';
import { consolidateIngredients } from '../../utils/recipes';

type Props = {
  recipe: Recipe;
  onClose: () => void;
  onAddToShoppingList: (items: ShoppingListItem[]) => void;
};

export function RecipeShoppingList({ recipe, onClose, onAddToShoppingList }: Props) {
  const ingredients = consolidateIngredients([recipe]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Liste d'ingrédients</h3>
        <div className="max-h-[60vh] overflow-y-auto mb-4">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="py-2 border-b">
              <span>{ingredient.name}</span>
              <span className="float-right">
                {ingredient.quantity} {ingredient.unit}
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              onAddToShoppingList(ingredients);
              onClose();
            }}
            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Ajouter à la liste de courses
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}