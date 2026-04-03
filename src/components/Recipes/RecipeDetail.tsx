import React, { useState, useRef, useEffect } from 'react';
import { Recipe } from '../../types';
import { Timer } from '../Timer/Timer';
import { RecipeForm } from './RecipeForm';
import { ShoppingCart, X, ChevronRight, ChevronLeft, Check, CreditCard as Edit2, Trash2 } from 'lucide-react';
import { useRecipes } from '../../hooks/useRecipes';

type Props = {
  recipe: Recipe;
  onClose: () => void;
  onAddToShoppingList: (ingredients: Recipe['ingredients']) => void;
};

export function RecipeDetail({ recipe, onClose, onAddToShoppingList }: Props) {
  const { removeRecipe } = useRecipes();
  const [servings, setServings] = useState(recipe.servings);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(new Array(recipe.steps.length).fill(false));
  const [isEditing, setIsEditing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const calculateQuantity = (quantity: number) => {
    return (quantity * servings) / recipe.servings;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      setCurrentStep(prev => Math.min(prev + 1, recipe.steps.length - 1));
    } else if (e.key === 'ArrowLeft') {
      setCurrentStep(prev => Math.max(prev - 1, 0));
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleStepCompletion = (index: number) => {
    setCompletedSteps(prev => {
      const newSteps = [...prev];
      newSteps[index] = !newSteps[index];
      return newSteps;
    });
  };

  const handleDelete = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette recette ?')) {
      await removeRecipe(recipe.id);
      onClose();
    }
  };

  if (isEditing) {
    return (
      <RecipeForm
        recipe={recipe}
        onClose={() => {
          setIsEditing(false);
          onClose();
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div ref={modalRef} className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Image et bouton fermer */}
        <div className="relative">
          <img 
            src={recipe.image} 
            alt={recipe.name} 
            className="w-full h-64 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">{recipe.name}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8">
            <div>
              {/* Ingrédients */}
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

              {/* Instructions */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Instructions</h3>
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
                              <button
                                onClick={() => toggleStepCompletion(index)}
                                className={`p-2 rounded-full ${
                                  completedSteps[index] 
                                    ? 'bg-green-100 text-green-600' 
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                <Check className="w-5 h-5" />
                              </button>
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
              {/* Nombre de personnes */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Informations</h4>
                <dl className="space-y-2">
                  <div className="flex justify-between items-center">
                    <dt>Personnes</dt>
                    <dd className="flex items-center gap-2">
                      <button
                        onClick={() => setServings(prev => Math.max(1, prev - 1))}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{servings}</span>
                      <button
                        onClick={() => setServings(prev => prev + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                      >
                        +
                      </button>
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Préparation</dt>
                    <dd>{recipe.prepTime} min</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Cuisson</dt>
                    <dd>{recipe.cookTime} min</dd>
                  </div>
                </dl>
              </div>

              {/* Minuteur */}
              {recipe.cookTime > 0 && <Timer label="Cuisson" initialMinutes={recipe.cookTime} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}