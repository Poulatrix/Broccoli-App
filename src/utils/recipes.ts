import { Recipe, ShoppingListItem } from '../types';

export function consolidateIngredients(recipes: Recipe[]): ShoppingListItem[] {
  const ingredientMap = new Map<string, ShoppingListItem>();

  recipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => {
      const key = `${ingredient.name}-${ingredient.unit}`;
      const existing = ingredientMap.get(key);
      
      if (existing) {
        existing.quantity += ingredient.quantity;
      } else {
        ingredientMap.set(key, {
          name: ingredient.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          checked: false
        });
      }
    });
  });

  return Array.from(ingredientMap.values());
}

export function swapRecipePositions(recipes: Recipe[], fromId: string, toId: string): Recipe[] {
  const fromIndex = recipes.findIndex(r => r.id === fromId);
  const toIndex = recipes.findIndex(r => r.id === toId);
  
  if (fromIndex === -1 || toIndex === -1) return recipes;
  
  const newRecipes = [...recipes];
  [newRecipes[fromIndex], newRecipes[toIndex]] = [newRecipes[toIndex], newRecipes[fromIndex]];
  
  return newRecipes;
}