import { CalendarEvent, Recipe, ShoppingListItem } from '../types';

export function calculateIngredients(events: CalendarEvent[], recipes: Recipe[]): ShoppingListItem[] {
  const ingredientMap = new Map<string, ShoppingListItem>();

  events.forEach(event => {
    const recipe = recipes.find(r => r.id === event.recipeId);
    if (!recipe) return;

    const ratio = event.servings / recipe.servings;
    recipe.ingredients.forEach(ingredient => {
      const key = `${ingredient.name.toLowerCase()}-${ingredient.unit.toLowerCase()}`;
      const existing = ingredientMap.get(key);
      
      if (existing) {
        existing.quantity += ingredient.quantity * ratio;
      } else {
        ingredientMap.set(key, {
          name: ingredient.name,
          quantity: ingredient.quantity * ratio,
          unit: ingredient.unit,
          checked: false
        });
      }
    });
  });

  return Array.from(ingredientMap.values())
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(item => ({
      ...item,
      quantity: Math.round(item.quantity * 100) / 100 // Round to 2 decimal places
    }));
}