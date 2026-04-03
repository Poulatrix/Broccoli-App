export const recipes = [
  {
    id: '1',
    name: 'Ratatouille Provençale',
    image: 'https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?auto=format&fit=crop&w=1000&q=80',
    category: 'vegetarian',
    servings: 4,
    ingredients: [
      { name: 'Aubergine', quantity: 2, unit: 'pcs' },
      { name: 'Courgette', quantity: 2, unit: 'pcs' },
      { name: 'Tomates', quantity: 4, unit: 'pcs' },
      { name: 'Poivron', quantity: 2, unit: 'pcs' },
      { name: "Huile d'olive", quantity: 4, unit: 'tbsp' },
    ],
    steps: [
      'Couper tous les légumes en rondelles',
      'Faire revenir l\'oignon dans l\'huile d\'olive',
      'Ajouter les légumes et laisser mijoter',
      'Assaisonner et laisser cuire 45 minutes',
    ],
    prepTime: 20,
    cookTime: 45,
  },
  // Add more recipes here
] as Recipe[];