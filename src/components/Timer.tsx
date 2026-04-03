import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

type Props = {
  label: string;
  initialMinutes?: number;
};

export function Timer({ label, initialMinutes = 0 }: Props) {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(initialMinutes.toString());

  useEffect(() => {
    let interval: number;
    if (isRunning && totalSeconds > 0) {
      interval = window.setInterval(() => {
        setTotalSeconds(s => {
          if (s <= 1) {
            setIsRunning(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const minutes = Math.floor(totalSeconds / 60);

  const handleTimeChange = (value: string) => {
    const newMinutes = parseInt(value, 10);
    if (!isNaN(newMinutes) && newMinutes >= 0) {
      setTotalSeconds(newMinutes * 60);
      setEditValue(newMinutes.toString());
    }
  };

  const reset = () => {
    setTotalSeconds(initialMinutes * 60);
    setIsRunning(false);
    setEditValue(initialMinutes.toString());
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="text-sm font-medium text-gray-600 mb-2">{label}</div>
      <div className="relative w-full flex items-center justify-between">
        {isEditing ? (
          <input
            type="number"
            value={editValue}
            onChange={(e) => handleTimeChange(e.target.value)}
            onBlur={() => setIsEditing(false)}
            className="w-20 border rounded px-2 py-1 text-xl"
            autoFocus
          />
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="text-2xl font-mono"
          >
            {minutes}:00
          </button>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`p-2 rounded-full ${
              isRunning ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
            }`}
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button
            onClick={reset}
            className="p-2 rounded-full bg-gray-100 text-gray-600"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}