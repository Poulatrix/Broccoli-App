import React, { useState } from 'react';
import { CalendarEvent, Recipe } from '../../types';
import { CalendarDay } from './CalendarDay';
import { EventModal } from './EventModal';
import { CalendarSuggestions } from './CalendarSuggestions';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

type Props = {
  events: CalendarEvent[];
  recipes: Recipe[];
  onAddToShoppingList: (ingredients: Recipe['ingredients']) => void;
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => Promise<string | undefined>;
  onUpdateEvent: (id: string, event: Partial<CalendarEvent>) => Promise<void>;
  onRemoveEvent: (id: string) => Promise<void>;
};

export function Calendar({ events, recipes, onAddToShoppingList, onAddEvent, onUpdateEvent, onRemoveEvent }: Props) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const today = new Date();

  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i);
    return date;
  });

  const weeks = dates.reduce((acc, date) => {
    const weekIndex = Math.floor(dates.indexOf(date) / 7);
    if (!acc[weekIndex]) acc[weekIndex] = [];
    acc[weekIndex].push(date);
    return acc;
  }, [] as Date[][]);

  const handleMoveEvent = async (fromDate: string, toDate: string) => {
    const fromEvent = events.find(e => e.date === fromDate);
    const toEvent = events.find(e => e.date === toDate);

    if (fromEvent && toEvent) {
      await onUpdateEvent(fromEvent.id, { date: toEvent.date });
      await onUpdateEvent(toEvent.id, { date: fromDate });
    } else if (fromEvent) {
      await onUpdateEvent(fromEvent.id, { date: toDate });
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Planning des 2 prochaines semaines</h2>
        <div className="space-y-4">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-2">
              {week.map((date) => {
                const dateStr = date.toISOString().split('T')[0];
                const event = events.find(e => e.date === dateStr);
                const recipe = event ? recipes.find(r => r.id === event.recipeId) : null;

                return (
                  <CalendarDay
                    key={dateStr}
                    date={date}
                    event={event}
                    recipe={recipe}
                    onAddClick={() => setSelectedDate(dateStr)}
                    onDoubleClick={() => event && setEditingEvent(event)}
                    onDrop={(fromDate) => handleMoveEvent(fromDate, dateStr)}
                    onDelete={() => event && onRemoveEvent(event.id)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <CalendarSuggestions
        recipes={recipes}
        onAddSuggestion={async (recipe) => {
          console.log('Suggestion added:', recipe.name);
        }}
      />

      {(selectedDate || editingEvent) && (
        <EventModal
          date={selectedDate || editingEvent?.date || ''}
          event={editingEvent}
          recipes={recipes}
          onClose={() => {
            setSelectedDate(null);
            setEditingEvent(null);
          }}
          onSave={async (recipeId, servings) => {
            if (editingEvent) {
              await onUpdateEvent(editingEvent.id, { recipeId, servings });
            } else if (selectedDate) {
              await onAddEvent({ date: selectedDate, recipeId, servings });
            }
            setSelectedDate(null);
            setEditingEvent(null);
          }}
        />
      )}
    </div>
  );
}