
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import RecipeCard from '@/components/recipe-card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Search, Utensils } from 'lucide-react';
import { Recipe } from '@/lib/data';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const recipesData = searchParams.get('recipes');
    if (recipesData) {
      try {
        const parsedRecipes = JSON.parse(recipesData);
        setRecipes(parsedRecipes);
      } catch (error) {
        console.error("Failed to parse recipes from URL", error);
        setRecipes([]);
      }
    }
    setIsLoading(false);
  }, [searchParams]);

  return (
    <div className="container py-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight mb-2">
          Your Personalized Recipe Ideas
        </h1>
        <p className="text-lg text-muted-foreground">
          Discover meals tailored to your taste and the ingredients you have.
        </p>
      </header>

      <div className="mb-8 flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search for recipes..." className="pl-10" />
        </div>
        <div className="flex gap-4">
          <Select>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Dietary Needs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vegan">Vegan</SelectItem>
              <SelectItem value="vegetarian">Vegetarian</SelectItem>
              <SelectItem value="gluten-free">Gluten-Free</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Prep Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under-15">Under 15 min</SelectItem>
              <SelectItem value="under-30">Under 30 min</SelectItem>
              <SelectItem value="under-60">Under 60 min</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Cuisine" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="italian">Italian</SelectItem>
              <SelectItem value="asian">Asian</SelectItem>
              <SelectItem value="mexican">Mexican</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center text-center h-64 gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <h2 className="font-headline text-2xl">Loading Recipes...</h2>
        </div>
      ) : recipes.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center h-64 gap-4 border border-dashed rounded-lg">
          <Utensils className="h-12 w-12 text-muted-foreground" />
          <h2 className="font-headline text-2xl">No Recipes Found</h2>
          <p className="text-muted-foreground max-w-md">
            Upload a photo of your ingredients to get started or try a different search.
          </p>
        </div>
      )}
    </div>
  );
}
