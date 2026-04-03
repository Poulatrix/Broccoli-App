import React from 'react';

type Props = {
  activeTab: 'recipes' | 'calendar' | 'shopping';
  onTabChange: (tab: 'recipes' | 'calendar' | 'shopping') => void;
};

export function AppHeader({ activeTab, onTabChange }: Props) {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Mes Recettes</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onTabChange('recipes')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'recipes' ? 'bg-blue-500 text-white' : 'text-gray-600'
              }`}
            >
              Recettes
            </button>
            <button
              onClick={() => onTabChange('calendar')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'calendar' ? 'bg-blue-500 text-white' : 'text-gray-600'
              }`}
            >
              Planning
            </button>
            <button
              onClick={() => onTabChange('shopping')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'shopping' ? 'bg-blue-500 text-white' : 'text-gray-600'
              }`}
            >
              Courses
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}