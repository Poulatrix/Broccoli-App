import React from 'react';

type Props = {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
};

export function RecipeFilters({ selectedCategory, onCategoryChange }: Props) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onCategoryChange('all')}
        className={`px-4 py-2 rounded-lg transition-colors ${
          selectedCategory === 'all' 
            ? 'bg-blue-500 text-white' 
            : 'bg-white text-gray-600 hover:bg-gray-50'
        }`}
      >
        Tous
      </button>
      <button
        onClick={() => onCategoryChange('Viande')}
        className={`px-4 py-2 rounded-lg transition-colors ${
          selectedCategory === 'Viande' 
            ? 'bg-blue-500 text-white' 
            : 'bg-white text-gray-600 hover:bg-gray-50'
        }`}
      >
        Viandes
      </button>
      <button
        onClick={() => onCategoryChange('Poisson')}
        className={`px-4 py-2 rounded-lg transition-colors ${
          selectedCategory === 'Poisson' 
            ? 'bg-blue-500 text-white' 
            : 'bg-white text-gray-600 hover:bg-gray-50'
        }`}
      >
        Poissons
      </button>
      <button
        onClick={() => onCategoryChange('Végétarien')}
        className={`px-4 py-2 rounded-lg transition-colors ${
          selectedCategory === 'Végétarien' 
            ? 'bg-blue-500 text-white' 
            : 'bg-white text-gray-600 hover:bg-gray-50'
        }`}
      >
        Végétarien
      </button>
    </div>
  );
}