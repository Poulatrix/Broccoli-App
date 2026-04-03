import React from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { CalendarEvent, Recipe } from '../../types';
import { X } from 'lucide-react';

type Props = {
  date: Date;
  event: CalendarEvent | undefined;
  recipe: Recipe | null;
  onAddClick: () => void;
  onDoubleClick: () => void;
  onDrop: (fromDate: string) => void;
  onDelete: () => void;
};

export function CalendarDay({ 
  date, 
  event, 
  recipe, 
  onAddClick, 
  onDoubleClick, 
  onDrop,
  onDelete 
}: Props) {
  const dateStr = date.toISOString().split('T')[0];

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CALENDAR_EVENT',
    item: { fromDate: dateStr },
    canDrag: !!event,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'CALENDAR_EVENT',
    drop: (item: { fromDate: string }) => {
      if (item.fromDate !== dateStr) {
        onDrop(item.fromDate);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`border rounded-lg p-2 min-h-[120px] relative ${
        isOver ? 'bg-blue-50' : ''
      }`}
    >
      <div className="text-sm font-medium">
        {date.toLocaleDateString('fr-FR', { weekday: 'short' })}
      </div>
      <div className="text-xs text-gray-500 mb-2">
        {date.getDate()}
      </div>
      {recipe ? (
        <div
          ref={drag}
          className={`relative space-y-2 cursor-move ${isDragging ? 'opacity-50' : ''}`}
          onDoubleClick={onDoubleClick}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="absolute top-0 right-0 p-1 bg-red-100 rounded-full hover:bg-red-200 transition-colors"
          >
            <X className="w-4 h-4 text-red-600" />
          </button>
          <img 
            src={recipe.image} 
            alt={recipe.name}
            className="w-full h-20 object-cover rounded"
          />
          <div className="text-xs font-medium truncate">{recipe.name}</div>
          <div className="text-xs text-gray-500">{event?.servings} pers.</div>
        </div>
      ) : (
        <button
          onClick={onAddClick}
          className="absolute inset-0 flex items-center justify-center text-gray-400 hover:bg-gray-50 rounded-lg"
        >
          +
        </button>
      )}
    </div>
  );
}