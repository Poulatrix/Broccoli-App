import { useSupabase } from './useSupabase';
import { Recipe } from '../types';

type RecipeDB = {
  id: string;
  name: string;
  image: string;
  category: string;
  servings: number;
  prep_time: number;
  cook_time: number;
  ingredients: Array<{ name: string; quantity: number; unit: string }>;
  steps: string[];
  tags?: string[];
};

function mapFromDB(recipe: RecipeDB): Recipe {
  return {
    id: recipe.id,
    name: recipe.name,
    image: recipe.image,
    category: recipe.category as Recipe['category'],
    servings: recipe.servings,
    prepTime: recipe.prep_time,
    cookTime: recipe.cook_time,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    tags: recipe.tags,
  };
}

function mapToDB(recipe: Omit<Recipe, 'id'>): Omit<RecipeDB, 'id'> {
  return {
    name: recipe.name,
    image: recipe.image,
    category: recipe.category,
    servings: recipe.servings,
    prep_time: recipe.prepTime,
    cook_time: recipe.cookTime,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    tags: recipe.tags,
  };
}

export function useRecipes() {
  const {
    data: recipesDB,
    loading,
    error,
    add,
    update,
    remove,
  } = useSupabase<RecipeDB>('recipes');

  const recipes = recipesDB.map(mapFromDB);

  const addRecipe = async (recipe: Omit<Recipe, 'id'>) => {
    return add(mapToDB(recipe) as Omit<RecipeDB, 'id'>);
  };

  const updateRecipe = async (id: string, recipe: Partial<Recipe>) => {
    const dbRecipe: Partial<RecipeDB> = {};
    if (recipe.name !== undefined) dbRecipe.name = recipe.name;
    if (recipe.image !== undefined) dbRecipe.image = recipe.image;
    if (recipe.category !== undefined) dbRecipe.category = recipe.category;
    if (recipe.servings !== undefined) dbRecipe.servings = recipe.servings;
    if (recipe.prepTime !== undefined) dbRecipe.prep_time = recipe.prepTime;
    if (recipe.cookTime !== undefined) dbRecipe.cook_time = recipe.cookTime;
    if (recipe.ingredients !== undefined) dbRecipe.ingredients = recipe.ingredients;
    if (recipe.steps !== undefined) dbRecipe.steps = recipe.steps;
    if (recipe.tags !== undefined) dbRecipe.tags = recipe.tags;
    return update(id, dbRecipe);
  };

  const removeRecipe = async (id: string) => {
    return remove(id);
  };

  return {
    recipes,
    loading,
    error,
    addRecipe,
    updateRecipe,
    removeRecipe,
  };
}
