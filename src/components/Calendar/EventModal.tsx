import React, { useState, useRef, useEffect } from 'react';
import { CalendarEvent, Recipe } from '../../types';

type Props = {
  date: string;
  event: CalendarEvent | null;
  recipes: Recipe[];
  onClose: () => void;
  onSave: (recipeId: string, servings: number) => Promise<void>;
};

export function EventModal({ date, event, recipes, onClose, onSave }: Props) {
  const [recipeId, setRecipeId] = useState(event?.recipeId || '');
  const [servings, setServings] = useState(event?.servings || 4);
  const [isSaving, setIsSaving] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleSave = async () => {
    if (!recipeId) return;
    try {
      setIsSaving(true);
      await onSave(recipeId, servings);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div ref={modalRef} className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {event ? 'Modifier le plat' : 'Ajouter une recette'}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nombre de personnes
            </label>
            <input
              type="number"
              min="1"
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Choisir une recette
            </label>
            <select
              value={recipeId}
              onChange={(e) => setRecipeId(e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              <option value="">Sélectionner une recette</option>
              {recipes.map((recipe) => (
                <option key={recipe.id} value={recipe.id}>
                  {recipe.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              disabled={!recipeId || isSaving}
            >
              {isSaving ? 'Sauvegarde...' : (event ? 'Modifier' : 'Ajouter')}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}