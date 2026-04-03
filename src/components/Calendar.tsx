import React, { useState } from 'react';
import { CalendarEvent, Recipe } from '../types';
import { ChevronDown } from 'lucide-react';
import { useCalendarEvents } from '../hooks/useCalendarEvents';

type Props = {
  events: CalendarEvent[];
  recipes: Recipe[];
  onAddEvent: (date: string, recipeId: string, servings: number) => void;
};

export function Calendar({ events, recipes, onAddEvent }: Props) {
  const { addEvent } = useCalendarEvents();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedServings, setSelectedServings] = useState(4);

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

  const handleAddEvent = async (date: string, recipeId: string) => {
    try {
      await addEvent({ date, recipeId });
      setSelectedDate(null);
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  return (
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
                <div key={dateStr} className="border rounded-lg p-2 min-h-[120px] relative">
                  <div className="text-sm font-medium">
                    {date.toLocaleDateString('fr-FR', { weekday: 'short' })}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {date.getDate()}
                  </div>
                  {recipe ? (
                    <div className="space-y-2">
                      <img 
                        src={recipe.image} 
                        alt={recipe.name}
                        className="w-full h-20 object-cover rounded"
                      />
                      <div className="text-xs font-medium truncate">{recipe.name}</div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedDate(dateStr)}
                      className="absolute inset-0 flex items-center justify-center text-gray-400 hover:bg-gray-50 rounded-lg"
                    >
                      +
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Ajouter une recette</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nombre de personnes
                </label>
                <input
                  type="number"
                  min="1"
                  value={selectedServings}
                  onChange={(e) => setSelectedServings(Number(e.target.value))}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Choisir une recette
                </label>
                <select
                  className="w-full border rounded-lg p-2"
                  onChange={(e) => {
                    handleAddEvent(selectedDate, e.target.value);
                  }}
                  defaultValue=""
                >
                  <option value="">Sélectionner une recette</option>
                  {recipes.map((recipe) => (
                    <option key={recipe.id} value={recipe.id}>
                      {recipe.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                className="w-full bg-gray-100 text-gray-600 py-2 rounded-lg mt-4"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}