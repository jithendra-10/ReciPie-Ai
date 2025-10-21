import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string): ImagePlaceholder => {
  const img = PlaceHolderImages.find((p) => p.id === id);
  if (!img) {
    // Return a default/fallback image if not found, to prevent crashes
    return {
      id: 'fallback',
      description: 'A delicious meal',
      imageUrl: 'https://picsum.photos/seed/fallback/600/400',
      imageHint: 'food meal'
    };
  }
  return img;
};

export interface NutrientInfo {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface InstructionStep {
  step: number;
  text: string;
  image: { imageUrl: string, imageHint: string };
}

export interface Substitution {
  original: string;
  substitute: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTimeMinutes: number;
  image: { imageUrl: string, imageHint: string };
  cuisine: 'Italian' | 'Asian' | 'Mexican' | 'American' | 'Other';
  dietaryTags?: ('Vegan' | 'Vegetarian' | 'Gluten-Free' | 'Dairy-Free')[];
  ingredients: string[];
  nutrients?: NutrientInfo;
  instructions: InstructionStep[];
  substitutions?: Substitution[];
}


export const recipes: Recipe[] = [
  {
    id: 'broccoli-cheddar-soup',
    title: 'Creamy Broccoli Cheddar Soup',
    description: 'A rich and comforting soup, perfect for a chilly day. Ready in under an hour!',
    prepTimeMinutes: 45,
    image: getImage('recipeBroccoliCheddarSoup'),
    cuisine: 'American',
    dietaryTags: ['Vegetarian'],
    ingredients: [
      'Broccoli',
      'Cheddar Cheese',
      'Heavy Cream',
      'Onion',
      'Garlic',
      'Vegetable Broth',
      'Butter',
      'Flour',
    ],
    nutrients: {
      calories: 450,
      protein: 18,
      fat: 35,
      carbs: 25,
    },
    instructions: [
      {
        step: 1,
        text: 'Chop the onion and garlic. Cut the broccoli into small florets.',
        image: getImage('stepChopBroccoli'),
      },
      {
        step: 2,
        text: 'In a large pot, melt butter over medium heat. Sauté onion and garlic until softened.',
        image: getImage('stepSauteOnions'),
      },
      {
        step: 3,
        text: 'Stir in flour to create a roux. Gradually whisk in vegetable broth until smooth.',
        image: getImage('stepAddBroth'),
      },
      {
        step: 4,
        text: 'Add broccoli florets. Bring to a boil, then reduce heat and simmer until broccoli is tender, about 15-20 minutes.',
        image: getImage('stepSimmerSoup'),
      },
      {
        step: 5,
        text: 'Reduce heat to low. Use an immersion blender to partially blend the soup, leaving some texture.',
        image: getImage('stepBlendSoup'),
      },
      {
        step: 6,
        text: 'Slowly stir in the heavy cream and shredded cheddar cheese until the cheese is melted and the soup is creamy. Do not let it boil. Season with salt and pepper to taste.',
        image: getImage('stepAddCreamCheese'),
      },
    ],
    substitutions: [
      { original: 'Heavy Cream', substitute: 'Coconut Cream (for a dairy-free twist)' },
      { original: 'Cheddar Cheese', substitute: 'Nutritional Yeast & Cashew Blend' },
    ],
  },
  {
    id: 'veggie-stir-fry',
    title: 'Quick Veggie & Tofu Stir-Fry',
    description: 'A vibrant and healthy stir-fry that\'s packed with flavor and comes together in minutes.',
    prepTimeMinutes: 25,
    image: getImage('recipeVeggieStirFry'),
    cuisine: 'Asian',
    dietaryTags: ['Vegan', 'Gluten-Free', 'Dairy-Free'],
    ingredients: ['Tofu', 'Broccoli', 'Bell Peppers', 'Carrots', 'Soy Sauce', 'Ginger', 'Garlic'],
    nutrients: {
      calories: 380,
      protein: 22,
      fat: 15,
      carbs: 30,
    },
    instructions: [],
    substitutions: [],
  },
  {
    id: 'chicken-alfredo',
    title: 'Classic Chicken Alfredo',
    description: 'Indulgent, creamy, and satisfying. A timeless Italian-American classic.',
    prepTimeMinutes: 30,
    image: getImage('recipeChickenAlfredo'),
    cuisine: 'Italian',
    dietaryTags: [],
    ingredients: ['Fettuccine', 'Chicken Breast', 'Heavy Cream', 'Parmesan Cheese', 'Garlic', 'Butter'],
    nutrients: {
      calories: 720,
      protein: 45,
      fat: 48,
      carbs: 55,
    },
    instructions: [],
    substitutions: [],
  },
  {
    id: 'carne-asada-tacos',
    title: 'Carne Asada Tacos',
    description: 'Juicy, marinated steak grilled to perfection and served in warm corn tortillas.',
    prepTimeMinutes: 35,
    image: getImage('recipeTacos'),
    cuisine: 'Mexican',
    dietaryTags: ['Gluten-Free'],
    ingredients: ['Skirt Steak', 'Corn Tortillas', 'Onion', 'Cilantro', 'Lime', 'Salsa'],
    nutrients: {
      calories: 550,
      protein: 35,
      fat: 28,
      carbs: 32,
    },
    instructions: [],
    substitutions: [],
  },
];

export const dietaryOptions = [
  { id: 'vegan', label: 'Vegan' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'gluten-free', label: 'Gluten-Free' },
  { id: 'dairy-free', label: 'Dairy-Free' },
];

export const skillLevels = ['Beginner', 'Intermediate', 'Expert'];

export const cuisineOptions = ['Italian', 'Asian', 'Mexican', 'American'];

export const wasteTrackingData = {
  totalSavedKg: 2.5,
  periodData: {
    weekly: [
      { name: 'Used', value: 70, fill: 'hsl(var(--chart-1))' },
      { name: 'Wasted', value: 30, fill: 'hsl(var(--chart-3))' },
    ],
    monthly: [
      { name: 'Used', value: 85, fill: 'hsl(var(--chart-1))' },
      { name: 'Wasted', value: 15, fill: 'hsl(var(--chart-3))' },
    ],
  },
  topSaved: ['Broccoli', 'Onions', 'Carrots'],
  topWasted: ['Fresh Herbs', 'Lettuce', 'Bread'],
};
