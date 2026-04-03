import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, ShoppingCart } from 'lucide-react';
import { Recipe } from '../types';
import { Timer } from './Timer/Timer';

type Props = {
  recipe: Recipe;
  onClose: () => void;
  onAddToShoppingList: (ingredients: Recipe['ingredients']) => void;
};

export function RecipeDetail({ recipe, onClose, onAddToShoppingList }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [servings, setServings] = useState(recipe.servings);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const calculateQuantity = (quantity: number) => {
    return (quantity * servings) / recipe.servings;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div ref={modalRef} className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img 
            src={recipe.image} 
            alt={recipe.name} 
            className="w-full h-64 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">{recipe.name}</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8">
            <div>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Ingrédients</h3>
                  <button
                    onClick={() => onAddToShoppingList(recipe.ingredients)}
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Ajouter à la liste
                  </button>
                </div>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{ingredient.name}</span>
                      <span>
                        {calculateQuantity(ingredient.quantity)} {ingredient.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Étapes</h3>
                <div className="relative">
                  {recipe.steps.map((step, index) => (
                    <div
                      key={index}
                      className={`transform transition-all duration-500 ${
                        index === currentStep
                          ? 'opacity-100 translate-x-0'
                          : index < currentStep
                          ? 'opacity-0 -translate-x-full absolute'
                          : 'opacity-0 translate-x-full absolute'
                      }`}
                    >
                      {index === currentStep && (
                        <div className="p-4 rounded-lg border bg-white">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Étape {index + 1}/{recipe.steps.length}</span>
                            <div className="flex gap-2">
                              {currentStep > 0 && (
                                <button
                                  onClick={() => setCurrentStep(currentStep - 1)}
                                  className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg flex items-center gap-2"
                                >
                                  <ChevronLeft className="w-4 h-4" />
                                  Précédent
                                </button>
                              )}
                              {currentStep < recipe.steps.length - 1 && (
                                <button
                                  onClick={() => setCurrentStep(currentStep + 1)}
                                  className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                >
                                  Suivant
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="mt-2">{step}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nombre de personnes
                </label>
                <input
                  type="number"
                  min="1"
                  value={servings}
                  onChange={(e) => setServings(Number(e.target.value))}
                  className="border rounded px-3 py-2"
                />
              </div>

              <Timer label="Préparation" initialMinutes={recipe.prepTime} />
              <Timer label="Cuisson" initialMinutes={recipe.cookTime} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}