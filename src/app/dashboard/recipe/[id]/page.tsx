'use client'

import { recipes as staticRecipes, Recipe } from '@/lib/data';
import Image from 'next/image';
import { notFound, useSearchParams, useParams } from 'next/navigation';
import { Clock, Flame, UtensilsCrossed, ChefHat, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import NutritionChart from '@/components/charts/nutrition-chart';
import InstructionsCarousel from '@/components/instructions-carousel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function RecipeDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const searchParams = useSearchParams();
  const recipesFromParams = searchParams.get('recipes');
  
  let recipe: Recipe | undefined;

  if (recipesFromParams) {
    try {
      const allRecipes = JSON.parse(recipesFromParams);
      recipe = allRecipes.find((r: Recipe) => r.id === id);
    } catch (e) {
      console.error("Failed to parse recipes from search params", e);
    }
  }

  if (!recipe) {
    recipe = staticRecipes.find((r) => r.id === id);
  }

  if (!recipe) {
    notFound();
  }

  return (
    <div className="bg-secondary/30">
      <div className="container mx-auto max-w-5xl py-12">
        <header className="mb-8">
          <Badge variant="secondary" className="mb-2">{recipe.cuisine}</Badge>
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight mb-4">{recipe.title}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">{recipe.description}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl mb-8 shadow-lg">
              <Image
                src={recipe.image.imageUrl}
                alt={recipe.title}
                fill
                className="object-cover"
                data-ai-hint={recipe.image.imageHint}
                priority
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <Clock className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-semibold">Prep Time</p>
                    <p className="text-muted-foreground">{recipe.prepTimeMinutes} minutes</p>
                  </div>
                </div>
                {recipe.nutrients && (
                  <div className="flex items-center gap-4">
                    <Flame className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-semibold">Calories</p>
                      <p className="text-muted-foreground">{recipe.nutrients.calories} kcal</p>
                    </div>
                  </div>
                )}
                 <div className="flex items-center gap-4">
                  <UtensilsCrossed className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-semibold">Cuisine</p>
                    <p className="text-muted-foreground">{recipe.cuisine}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-12">
                <section>
                    <h2 className="font-headline text-3xl font-bold mb-4">Ingredients</h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-lg">
                        {recipe.ingredients.map((ingredient) => (
                            <li key={ingredient} className="list-disc list-inside">{ingredient}</li>
                        ))}
                    </ul>
                </section>

                <Separator />

                <section>
                    <h2 className="font-headline text-3xl font-bold mb-4">Step-by-Step Instructions</h2>
                    {recipe.instructions.length > 0 ? (
                        <InstructionsCarousel instructions={recipe.instructions} />
                    ) : (
                      <Alert>
                        <ChefHat className="h-4 w-4" />
                        <AlertTitle>Coming Soon!</AlertTitle>
                        <AlertDescription>
                          Detailed instructions for this recipe are being perfected by our AI chefs.
                        </AlertDescription>
                      </Alert>
                    )}
                </section>
            </div>

            <div className="md:col-span-1 space-y-8">
               {recipe.nutrients ? (
                  <Card>
                      <CardHeader>
                          <CardTitle className="font-headline text-2xl">Nutritional Breakdown</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <NutritionChart nutrients={recipe.nutrients} />
                      </CardContent>
                  </Card>
                ) : (
                  <Alert variant="default" className="bg-accent/50">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Nutrition Info</AlertTitle>
                    <AlertDescription>
                      Nutritional information is not available for this AI-generated recipe.
                    </AlertDescription>
                  </Alert>
                )}


                {recipe.substitutions && recipe.substitutions.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">Ingredient Substitutions</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ul className="space-y-3">
                                {recipe.substitutions.map((sub, index) => (
                                    <li key={index} className="text-sm">
                                        <strong className="font-semibold">{sub.original}:</strong>
                                        <span className="text-muted-foreground ml-1">{sub.substitute}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>

        <Separator className="my-12"/>
        
        <footer className="text-center">
            <h2 className="font-headline text-3xl font-bold mb-4">Finished Cooking?</h2>
            <div className="flex justify-center gap-4">
                <Button size="lg">Mark as Made</Button>
                <Button size="lg" variant="outline">I had to discard some ingredients</Button>
            </div>
        </footer>
      </div>
    </div>
  );
}
