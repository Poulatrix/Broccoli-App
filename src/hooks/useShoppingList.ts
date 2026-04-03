import { useSupabase } from './useSupabase';
import { ShoppingListItem } from '../types';

export function useShoppingList() {
  const {
    data: items,
    loading,
    error,
    add: addItem,
    update: updateItem,
    remove: removeItem,
  } = useSupabase<ShoppingListItem>('shopping_list');

  return {
    items,
    loading,
    error,
    addItem,
    updateItem,
    removeItem,
  };
}
