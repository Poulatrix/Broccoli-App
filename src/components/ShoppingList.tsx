import React, { useState } from 'react';
import { Check, Trash2, Printer, Share2 } from 'lucide-react';
import { ShoppingListItem } from '../types';
import { printShoppingList, generateShoppingListEmail } from '../utils/shoppingList';

type Props = {
  items: ShoppingListItem[];
  onToggleItem: (index: number) => void;
  onRemoveItem: (index: number) => void;
  onUpdateItem: (index: number, item: ShoppingListItem) => void;
  onClearList: () => void;
};

export function ShoppingList({ items, onToggleItem, onRemoveItem, onUpdateItem, onClearList }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handlePrint = () => {
    printShoppingList(items);
  };

  const handleShare = () => {
    window.location.href = generateShoppingListEmail(items);
  };

  const consolidatedItems = items.reduce((acc, item) => {
    const existingItem = acc.find(i =>
      i.name.toLowerCase() === item.name.toLowerCase() &&
      i.unit.toLowerCase() === item.unit.toLowerCase()
    );

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      acc.push({ ...item });
    }
    return acc;
  }, [] as ShoppingListItem[]);

  const handleQuantityChange = (item: ShoppingListItem, newQuantity: number) => {
    if (newQuantity <= 0) return;
    const originalIndex = items.findIndex(i =>
      i.name.toLowerCase() === item.name.toLowerCase() &&
      i.unit.toLowerCase() === item.unit.toLowerCase()
    );
    if (originalIndex !== -1) {
      onUpdateItem(originalIndex, { ...item, quantity: newQuantity });
    }
  };

  const getItemIndex = (item: ShoppingListItem): number => {
    return items.findIndex(i =>
      i.name.toLowerCase() === item.name.toLowerCase() &&
      i.unit.toLowerCase() === item.unit.toLowerCase()
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Liste de courses</h2>
        <div className="flex gap-3">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Partager
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Imprimer
          </button>
          <button
            onClick={onClearList}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Vider la liste
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <div className="grid grid-cols-[auto,1fr,1fr,1fr,auto] gap-4 pb-2 border-b font-medium">
          <div className="w-6"></div>
          <div>Quantité</div>
          <div>Unité</div>
          <div>Description</div>
          <div className="w-10"></div>
        </div>
        {consolidatedItems.map((item) => {
          const itemIndex = getItemIndex(item);
          return (
            <div
              key={item.id}
              className="grid grid-cols-[auto,1fr,1fr,1fr,auto] gap-4 items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <button
                onClick={() => itemIndex !== -1 && onToggleItem(itemIndex)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer
                  ${item.checked ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-500'}`}
              >
                {item.checked && <Check className="w-4 h-4 text-white" />}
              </button>

              <div className={`flex items-center gap-2 ${item.checked ? 'line-through text-gray-500' : ''}`}>
                {editingId === item.id ? (
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item, parseFloat(e.target.value))}
                    className="w-full border rounded px-2 py-1"
                    step="0.1"
                    min="0"
                    onBlur={() => setEditingId(null)}
                    autoFocus
                  />
                ) : (
                  <span onClick={() => setEditingId(item.id)} className="cursor-pointer hover:text-blue-600">
                    {item.quantity}
                  </span>
                )}
              </div>

              <div className={item.checked ? 'line-through text-gray-500' : ''}>
                {item.unit}
              </div>

              <div className={item.checked ? 'line-through text-gray-500' : ''}>
                {item.name}
              </div>

              <button
                onClick={() => itemIndex !== -1 && onRemoveItem(itemIndex)}
                className="text-red-500 hover:text-red-700 transition-colors p-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
        {items.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            Votre liste de courses est vide
          </p>
        )}
      </div>
    </div>
  );
}
