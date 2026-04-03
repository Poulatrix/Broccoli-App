import React from 'react';

type Props = {
  hours: number;
  minutes: number;
  onChangeHours: (hours: number) => void;
  onChangeMinutes: (minutes: number) => void;
  onClose: () => void;
};

export function TimePicker({ hours, minutes, onChangeHours, onChangeMinutes, onClose }: Props) {
  return (
    <div className="absolute top-full mt-2 bg-white rounded-lg shadow-lg p-4 flex gap-4 z-50">
      <div className="h-32 overflow-y-auto scrollbar-thin">
        {Array.from({ length: 24 }, (_, i) => (
          <div
            key={i}
            onClick={() => onChangeHours(i)}
            className={`px-4 py-2 cursor-pointer hover:bg-blue-50 rounded ${
              hours === i ? 'bg-blue-100' : ''
            }`}
          >
            {i.toString().padStart(2, '0')}
          </div>
        ))}
      </div>
      <div className="h-32 overflow-y-auto scrollbar-thin">
        {Array.from({ length: 60 }, (_, i) => (
          <div
            key={i}
            onClick={() => onChangeMinutes(i)}
            className={`px-4 py-2 cursor-pointer hover:bg-blue-50 rounded ${
              minutes === i ? 'bg-blue-100' : ''
            }`}
          >
            {i.toString().padStart(2, '0')}
          </div>
        ))}
      </div>
    </div>
  );
}