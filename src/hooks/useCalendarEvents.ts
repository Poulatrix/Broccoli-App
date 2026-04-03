import { useSupabase } from './useSupabase';
import { CalendarEvent } from '../types';

type CalendarEventDB = {
  id: string;
  date: string;
  recipe_id: string;
  servings: number;
};

function mapFromDB(event: CalendarEventDB): CalendarEvent {
  return {
    id: event.id,
    date: event.date,
    recipeId: event.recipe_id,
    servings: event.servings,
  };
}

function mapToDB(event: Omit<CalendarEvent, 'id'>): Omit<CalendarEventDB, 'id'> {
  return {
    date: event.date,
    recipe_id: event.recipeId,
    servings: event.servings,
  };
}

export function useCalendarEvents() {
  const {
    data: eventsDB,
    loading,
    error,
    add,
    update,
    remove,
  } = useSupabase<CalendarEventDB>('calendar_events');

  const events = eventsDB.map(mapFromDB);

  const addEvent = async (event: Omit<CalendarEvent, 'id'>) => {
    return add(mapToDB(event) as Omit<CalendarEventDB, 'id'>);
  };

  const updateEvent = async (id: string, event: Partial<CalendarEvent>) => {
    const dbEvent: Partial<CalendarEventDB> = {};
    if (event.date !== undefined) dbEvent.date = event.date;
    if (event.recipeId !== undefined) dbEvent.recipe_id = event.recipeId;
    if (event.servings !== undefined) dbEvent.servings = event.servings;
    return update(id, dbEvent);
  };

  const removeEvent = async (id: string) => {
    return remove(id);
  };

  return {
    events,
    loading,
    error,
    addEvent,
    updateEvent,
    removeEvent,
  };
}
