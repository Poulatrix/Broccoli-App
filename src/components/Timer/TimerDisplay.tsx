import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

type Props = {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  onToggleRunning: () => void;
  onReset: () => void;
  onEdit: () => void;
};

export function TimerDisplay({
  minutes,
  seconds,
  isRunning,
  onToggleRunning,
  onReset,
  onEdit,
}: Props) {
  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl text-white">
      <button
        onClick={onEdit}
        className="text-2xl font-mono tracking-wider hover:opacity-80 transition-opacity"
      >
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </button>
      <div className="flex gap-2">
        <button
          onClick={onToggleRunning}
          className={`p-2 rounded-full transition-colors ${
            isRunning 
              ? 'bg-red-400 hover:bg-red-500' 
              : 'bg-green-400 hover:bg-green-500'
          }`}
        >
          {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        <button
          onClick={onReset}
          className="p-2 rounded-full bg-blue-400 hover:bg-blue-500 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}