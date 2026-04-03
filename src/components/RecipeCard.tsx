import React from 'react';
import { Clock } from 'lucide-react';
import { Recipe } from '../types';

type Props = {
  recipe: Recipe;
  onClick: () => void;
};

export function RecipeCard({ recipe, onClick }: Props) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
    >
      <img 
        src={recipe.image} 
        alt={recipe.name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{recipe.name}</h3>
        <div className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-1" />
          <span>{recipe.prepTime + recipe.cookTime} min</span>
        </div>
        <div className="mt-2">
          <span className={`
            px-2 py-1 rounded-full text-sm
            ${recipe.category === 'vegetarian' ? 'bg-green-100 text-green-800' : 
              recipe.category === 'fish' ? 'bg-blue-100 text-blue-800' : 
              'bg-red-100 text-red-800'}
          `}>
            {recipe.category}
          </span>
        </div>
      </div>
    </div>
  );
}