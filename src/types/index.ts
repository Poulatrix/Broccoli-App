export type Ingredient = {
  name: string;
  quantity: number;
  unit: string;
};

export type Recipe = {
  id: string;
  name: string;
  image: string;
  category: 'Viande' | 'Poisson' | 'Végétarien';
  servings: number;
  ingredients: Ingredient[];
  steps: string[];
  prepTime: number;
  cookTime: number;
  tags?: string[];
};

export type CalendarEvent = {
  id: string;
  date: string;
  recipeId: string;
  servings: number;
};

export type ShoppingListItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
  shopping_list_id?: string;
  created_at?: string;
  updated_at?: string;
};

export type ShoppingList = {
  id: string;
  user_id?: string;
  name: string;
  share_token?: string;
  is_public: boolean;
  created_at?: string;
  updated_at?: string;
};

export type SharedShoppingList = ShoppingList & {
  items: ShoppingListItem[];
};
