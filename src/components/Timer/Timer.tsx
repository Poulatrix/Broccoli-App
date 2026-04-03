import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

type Props = {
  label: string;
  initialMinutes: number;
};

export function Timer({ label, initialMinutes }: Props) {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(initialMinutes.toString());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/timer-alert.mp3');
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    let interval: number;
    if (isRunning && totalSeconds > 0) {
      interval = window.setInterval(() => {
        setTotalSeconds(s => {
          if (s <= 1) {
            setIsRunning(false);
            if (audioRef.current) {
              audioRef.current.play();
            }
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

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
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl text-white">
      <div className="text-sm font-medium mb-2">{label}</div>
      <div className="flex items-center justify-between">
        {isEditing ? (
          <input
            type="number"
            value={editValue}
            onChange={(e) => handleTimeChange(e.target.value)}
            onBlur={() => setIsEditing(false)}
            className="w-20 border rounded px-2 py-1 text-xl text-gray-800"
            autoFocus
          />
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="text-2xl font-mono tracking-wider hover:opacity-80 transition-opacity"
          >
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </button>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`p-2 rounded-full transition-colors ${
              isRunning ? 'bg-red-400 hover:bg-red-500' : 'bg-green-400 hover:bg-green-500'
            }`}
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button
            onClick={reset}
            className="p-2 rounded-full bg-blue-400 hover:bg-blue-500 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}