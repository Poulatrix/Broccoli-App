import React from 'react';
import { Recipe } from '../../types';
import { RecipeCard } from './RecipeCard';
import { Search } from 'lucide-react';

type Props = {
  recipes: Recipe[];
  onRecipeClick: (recipe: Recipe) => void;
  searchQuery: string;
};

export function RecipeGrid({ recipes, onRecipeClick, searchQuery }: Props) {
  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_ly7jZxy4WzwS3AIJYQhpGgxrc6tXs9zVFg&s"
          alt="No results"
          className="w-32 h-32 mb-4"
        />
        <p className="text-gray-500 text-center">
          {searchQuery 
            ? `Aucune recette ne correspond à "${searchQuery}"`
            : "Aucune recette disponible"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onClick={() => onRecipeClick(recipe)}
        />
      ))}
    </div>
  );
}