import { supabase } from '../lib/supabase';
import { ShoppingList, ShoppingListItem } from '../types';

export async function createShareableList(name: string): Promise<ShoppingList> {
  const shareToken = crypto.randomUUID().replace(/-/g, '').slice(0, 16);

  const { data, error } = await supabase
    .from('shopping_lists')
    .insert({
      name,
      share_token: shareToken,
      is_public: true,
    })
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getSharedListByToken(token: string): Promise<ShoppingList | null> {
  const { data, error } = await supabase
    .from('shopping_lists')
    .select('*')
    .eq('share_token', token)
    .eq('is_public', true)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getSharedListItems(listId: string): Promise<ShoppingListItem[]> {
  const { data, error } = await supabase
    .from('shopping_list_items')
    .select('*')
    .eq('shopping_list_id', listId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function addItemToSharedList(
  listId: string,
  item: Omit<ShoppingListItem, 'id' | 'created_at' | 'updated_at'>
): Promise<ShoppingListItem> {
  const { data, error } = await supabase
    .from('shopping_list_items')
    .insert({
      shopping_list_id: listId,
      ...item,
    })
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateSharedListItem(
  itemId: string,
  updates: Partial<ShoppingListItem>
): Promise<ShoppingListItem> {
  const { data, error } = await supabase
    .from('shopping_list_items')
    .update(updates)
    .eq('id', itemId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function deleteSharedListItem(itemId: string): Promise<void> {
  const { error } = await supabase
    .from('shopping_list_items')
    .delete()
    .eq('id', itemId);

  if (error) throw error;
}

export function generateShareUrl(token: string): string {
  return `${window.location.origin}/share/${token}`;
}

export async function copyShareLink(token: string): Promise<void> {
  const url = generateShareUrl(token);
  await navigator.clipboard.writeText(url);
}
