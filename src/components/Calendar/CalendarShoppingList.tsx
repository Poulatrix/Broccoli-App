import React from 'react';
import { CalendarEvent, Recipe, ShoppingListItem } from '../../types';
import { calculateIngredients } from '../../utils/calendar';

type Props = {
  events: CalendarEvent[];
  recipes: Recipe[];
  onClose: () => void;
  onAddToShoppingList: (items: ShoppingListItem[]) => void;
};

export function CalendarShoppingList({ events, recipes, onClose, onAddToShoppingList }: Props) {
  const ingredients = calculateIngredients(events, recipes);

  const handleAddToList = () => {
    onAddToShoppingList(ingredients);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h3 className="text-lg font-semibold mb-4">Liste de courses du planning</h3>
        <div className="max-h-[60vh] overflow-y-auto mb-4">
          {ingredients.map((ingredient, index) => (
            <div
              key={index}
              className="flex justify-between py-2 border-b"
            >
              <span>{ingredient.name}</span>
              <span>
                {ingredient.quantity} {ingredient.unit}
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleAddToList}
            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Ajouter à ma liste de courses
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}