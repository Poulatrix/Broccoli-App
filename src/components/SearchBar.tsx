import React, { useState } from 'react';
import { Search } from 'lucide-react';

type Props = {
  onSearch: (query: string) => void;
  onFocus?: () => void;
};

export function SearchBar({ onSearch, onFocus }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative flex items-center">
      <div
        className={`flex items-center transition-all duration-300 ${
          isExpanded ? 'w-64' : 'w-10'
        }`}
      >
        <input
          type="text"
          placeholder="Rechercher..."
          className={`w-full py-2 pl-3 pr-10 border rounded-lg transition-all duration-300 ${
            isExpanded ? 'opacity-100' : 'opacity-0 w-0'
          }`}
          onChange={(e) => onSearch(e.target.value)}
          onFocus={() => {
            setIsExpanded(true);
            onFocus?.();
          }}
        />
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`absolute right-2 p-1 text-gray-500 hover:text-gray-700 ${
            isExpanded ? '' : 'right-0'
          }`}
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}