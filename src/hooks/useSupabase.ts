import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type SupabaseTable = 'recipes' | 'calendar_events' | 'shopping_list';

export function useSupabase<T extends { id: string }>(tableName: SupabaseTable) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel(`${tableName}_changes`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tableName },
        (payload: RealtimePostgresChangesPayload<T>) => {
          if (payload.eventType === 'INSERT') {
            setData(current => [...current, payload.new as T]);
          } else if (payload.eventType === 'UPDATE') {
            setData(current =>
              current.map(item =>
                item.id === (payload.new as T).id ? (payload.new as T) : item
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setData(current =>
              current.filter(item => item.id !== (payload.old as T).id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName]);

  async function fetchData() {
    try {
      setLoading(true);
      const { data: items, error: fetchError } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setData(items || []);
    } catch (err) {
      setError(err as Error);
      console.error(`Error fetching ${tableName}:`, err);
    } finally {
      setLoading(false);
    }
  }

  async function add(item: Omit<T, 'id'>) {
    try {
      const { data: newItem, error: addError } = await supabase
        .from(tableName)
        .insert([item])
        .select()
        .single();

      if (addError) throw addError;
      return newItem.id;
    } catch (err) {
      console.error(`Error adding to ${tableName}:`, err);
      throw err;
    }
  }

  async function update(id: string, item: Partial<T>) {
    try {
      const { error: updateError } = await supabase
        .from(tableName)
        .update(item)
        .eq('id', id);

      if (updateError) throw updateError;
    } catch (err) {
      console.error(`Error updating ${tableName}:`, err);
      throw err;
    }
  }

  async function remove(id: string) {
    try {
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
    } catch (err) {
      console.error(`Error deleting from ${tableName}:`, err);
      throw err;
    }
  }

  return {
    data,
    loading,
    error,
    add,
    update,
    remove,
    refresh: fetchData,
  };
}
