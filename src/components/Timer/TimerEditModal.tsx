import React, { useState } from 'react';

type Props = {
  initialMinutes: number;
  initialSeconds: number;
  onSave: (minutes: number, seconds: number) => void;
  onClose: () => void;
};

export function TimerEditModal({
  initialMinutes,
  initialSeconds,
  onSave,
  onClose,
}: Props) {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);

  const handleSave = () => {
    onSave(minutes, seconds);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-4">Régler le minuteur</h3>
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minutes
            </label>
            <input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Secondes
            </label>
            <input
              type="number"
              min="0"
              max="59"
              value={seconds}
              onChange={(e) => setSeconds(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Enregistrer
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
  );
}