import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Recipe } from './types';
import { RecipeGrid } from './components/Recipes/RecipeGrid';
import { Calendar } from './components/Calendar/Calendar';
import { ShoppingList } from './components/ShoppingList';
import { SearchBar } from './components/SearchBar';
import { RecipeForm } from './components/Recipes/RecipeForm';
import { RecipeDetail } from './components/Recipes/RecipeDetail';
import { RecipeImportChat } from './components/RecipeImportChat';
import { Plus, MessageCircle } from 'lucide-react';
import { useRecipes } from './hooks/useRecipes';
import { useCalendarEvents } from './hooks/useCalendarEvents';
import { useShoppingList } from './hooks/useShoppingList';
import { RecipeFilters } from './components/Recipes/RecipeFilters';

function App() {
  const { recipes, loading: recipesLoading } = useRecipes();
  const { events: calendarEvents, loading: eventsLoading, addEvent, updateEvent, removeEvent } = useCalendarEvents();
  const { items: shoppingList, loading: shoppingLoading, addItem, removeItem, updateItem } = useShoppingList();

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'recipes' | 'calendar' | 'shopping'>('recipes');
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [showImportChat, setShowImportChat] = useState(false);
  const { addRecipe } = useRecipes();

  const filteredRecipes = recipes.filter(
    recipe => (
      (selectedCategory === 'all' || recipe.category === selectedCategory) &&
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleAddToShoppingList = (ingredients: Recipe['ingredients']) => {
    ingredients.forEach(ingredient => {
      addItem({
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        checked: false,
      });
    });
  };

  const handleToggleItem = (index: number) => {
    const item = shoppingList[index];
    if (item) {
      updateItem(item.id, { ...item, checked: !item.checked });
    }
  };

  const handleUpdateItem = (index: number, item: Recipe['ingredients'][0] & { checked: boolean; id: string }) => {
    updateItem(item.id, item);
  };

  const handleRemoveItem = (index: number) => {
    const item = shoppingList[index];
    if (item) {
      removeItem(item.id);
    }
  };

  const handleClearList = () => {
    shoppingList.forEach(item => removeItem(item.id));
  };

  const handleSearchFocus = () => {
    setSelectedCategory('all');
  };

  if (recipesLoading || eventsLoading || shoppingLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold">Mes Recettes</h1>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveTab('recipes')}
                  className={`px-4 py-2 rounded-lg ${
                    activeTab === 'recipes' ? 'bg-blue-500 text-white' : 'text-gray-600'
                  }`}
                >
                  Recettes
                </button>
                <button
                  onClick={() => setActiveTab('calendar')}
                  className={`px-4 py-2 rounded-lg ${
                    activeTab === 'calendar' ? 'bg-blue-500 text-white' : 'text-gray-600'
                  }`}
                >
                  Planning
                </button>
                <button
                  onClick={() => setActiveTab('shopping')}
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

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'recipes' && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <RecipeFilters
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                  />
                  <SearchBar 
                    onSearch={setSearchQuery} 
                    onFocus={handleSearchFocus}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowImportChat(true)}
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Assistant IA
                  </button>
                  <button
                    onClick={() => setShowRecipeForm(true)}
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Nouvelle recette
                  </button>
                </div>
              </div>

              <RecipeGrid
                recipes={filteredRecipes}
                onRecipeClick={setSelectedRecipe}
                searchQuery={searchQuery}
              />

              {selectedRecipe && (
                <RecipeDetail
                  recipe={selectedRecipe}
                  onClose={() => setSelectedRecipe(null)}
                  onAddToShoppingList={handleAddToShoppingList}
                />
              )}

              {showRecipeForm && (
                <RecipeForm
                  onClose={() => setShowRecipeForm(false)}
                />
              )}

              {showImportChat && (
                <RecipeImportChat
                  onClose={() => setShowImportChat(false)}
                  onRecipeExtracted={async (recipe) => {
                    await addRecipe(recipe);
                  }}
                />
              )}
            </>
          )}

          {activeTab === 'calendar' && (
            <Calendar
              events={calendarEvents}
              recipes={recipes}
              onAddToShoppingList={handleAddToShoppingList}
              onAddEvent={addEvent}
              onUpdateEvent={updateEvent}
              onRemoveEvent={removeEvent}
            />
          )}

          {activeTab === 'shopping' && (
            <ShoppingList
              items={shoppingList}
              onToggleItem={handleToggleItem}
              onUpdateItem={handleUpdateItem}
              onRemoveItem={handleRemoveItem}
              onClearList={handleClearList}
            />
          )}
        </main>
      </div>
    </DndProvider>
  );
}

export default App;