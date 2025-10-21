
'use server';
/**
 * @fileOverview A flow for generating recipes based on a list of ingredients.
 *
 * - generateRecipes - A function that handles the recipe generation process.
 * - RecipeGenerationInput - The input type for the recipe generation.
 * - RecipeGenerationOutput - The return type for the recipe generation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ImageSchema = z.object({
    imageUrl: z.string().url().describe('URL of a high-quality image for the recipe step.'),
    imageHint: z.string().describe('A two-word hint for the image content, e.g., "chopping vegetables".'),
});

const InstructionStepSchema = z.object({
    step: z.number().describe('The step number.'),
    text: z.string().describe('The instruction for this step.'),
    image: ImageSchema.describe('An image illustrating the instruction step.'),
});

const RecipeSchema = z.object({
  id: z.string().describe('A unique identifier for the recipe, in kebab-case.'),
  title: z.string().describe('The title of the recipe.'),
  description: z.string().describe('A short, enticing description of the recipe.'),
  prepTimeMinutes: z.number().describe('The estimated preparation and cook time in minutes.'),
  cuisine: z.enum(['Italian', 'Asian', 'Mexican', 'American', 'Other']).describe('The cuisine type.'),
  ingredients: z.array(z.string()).describe('A list of all ingredients required.'),
  instructions: z.array(InstructionStepSchema).describe('Step-by-step cooking instructions, each with an image.'),
  image: ImageSchema.describe('A hero image for the recipe.'),
});

const RecipeGenerationInputSchema = z.object({
  ingredients: z.array(z.string()).describe('The list of ingredients to use.'),
});
export type RecipeGenerationInput = z.infer<typeof RecipeGenerationInputSchema>;

const RecipeGenerationOutputSchema = z.array(RecipeSchema);
export type RecipeGenerationOutput = z.infer<typeof RecipeGenerationOutputSchema>;

export async function generateRecipes(input: RecipeGenerationInput): Promise<RecipeGenerationOutput> {
  return recipeGenerationFlow(input);
}

const SpoonacularRecipeInfoSchema = z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      image: z.string().url(),
      missedIngredientCount: z.number(),
      usedIngredients: z.array(z.object({ name: z.string() })),
      missedIngredients: z.array(z.object({ name: z.string() })),
    })
);

const findRecipesByIngredients = ai.defineTool(
  {
    name: 'findRecipesByIngredients',
    description: 'Finds recipes based on a list of available ingredients using the Spoonacular API.',
    inputSchema: z.object({
      ingredients: z.array(z.string()).describe('Array of ingredients.'),
    }),
    outputSchema: SpoonacularRecipeInfoSchema,
  },
  async ({ ingredients }) => {
    const apiKey = process.env.SPOONACULAR_API_KEY;
    if (!apiKey) {
      throw new Error('SPOONACULAR_API_KEY is not configured.');
    }
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients.join(',')}&number=4&ranking=2&apiKey=${apiKey}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Spoonacular API request failed: ${response.statusText}`);
    }
    return response.json();
  }
);

const searchUnsplashImage = ai.defineTool(
    {
        name: 'searchUnsplashImage',
        description: 'Searches for a relevant image on Unsplash for a given query.',
        inputSchema: z.object({
            query: z.string().describe('The search query for the image (e.g., "chopping vegetables").'),
        }),
        outputSchema: z.object({
            imageUrl: z.string().url(),
        }),
    },
    async ({ query }) => {
        const apiKey = process.env.UNSPLASH_API_KEY;
        if (!apiKey) {
            throw new Error('UNSPLASH_API_KEY is not configured.');
        }
        const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&client_id=${apiKey}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Unsplash API request failed: ${response.statusText}`);
        }
        const data = await response.json();
        const imageUrl = data.results?.[0]?.urls?.regular ?? 'https://picsum.photos/seed/placeholder/600/400';
        return { imageUrl };
    }
);


const FleshOutRecipeInputSchema = z.object({
    recipeIdeas: SpoonacularRecipeInfoSchema,
});

const recipePrompt = ai.definePrompt({
  name: 'recipePrompt',
  input: { schema: FleshOutRecipeInputSchema },
  output: { schema: RecipeGenerationOutputSchema },
  tools: [searchUnsplashImage],
  prompt: `You are a creative chef AI. Your task is to take a list of recipe ideas and flesh them out into 2-4 complete recipe objects.

For each recipe idea provided, create a delicious-sounding, concise description. Make sure the instructions are clear, simple, and broken down into logical steps.

For EACH instruction step, you MUST use the 'searchUnsplashImage' tool to find a relevant photo. Create a suitable 'imageHint' for the search query.

For the main recipe image, you can use the URL from the recipe idea or find a better one with 'searchUnsplashImage'.

Ensure the final output is an array of complete recipe objects, where each instruction has a corresponding image.

Recipe Ideas: {{{json recipeIdeas}}}`,
});

const recipeGenerationFlow = ai.defineFlow(
  {
    name: 'recipeGenerationFlow',
    inputSchema: RecipeGenerationInputSchema,
    outputSchema: RecipeGenerationOutputSchema,
  },
  async (input) => {
    // Step 1: Get recipe ideas from Spoonacular
    const recipeIdeas = await findRecipesByIngredients({ ingredients: input.ingredients });

    if (!recipeIdeas || recipeIdeas.length === 0) {
        console.warn("Spoonacular returned no recipes. Using fallback.");
    }
    
    // Step 2: Pass ideas to the AI to be fleshed out.
    // If spoonacular fails, we still try to generate something.
    const { output } = await recipePrompt({ recipeIdeas });

    // AI might hallucinate recipes with empty instructions or ingredients. Filter them out.
    if (!output) {
      console.warn("AI failed to generate valid recipes, creating a fallback.");
    }

    const validRecipes = output?.filter(
      (recipe) =>
        recipe.ingredients &&
        recipe.ingredients.length > 0 &&
        recipe.instructions &&
        recipe.instructions.length > 0
    ) ?? [];

    // Fallback to generating a simple recipe if Spoonacular/AI fails
    if (validRecipes.length === 0) {
        console.warn("AI failed to generate valid recipes or returned none, creating a fallback.");
        return [
            {
                id: 'fallback-omelette',
                title: 'Simple Kitchen Omelette',
                description: 'A quick and easy omelette with your available ingredients.',
                prepTimeMinutes: 10,
                cuisine: 'American',
                ingredients: input.ingredients.concat(['2 Eggs', 'Salt', 'Pepper']),
                instructions: [
                    { step: 1, text: 'Whisk eggs in a bowl with salt and pepper.', image: { imageUrl: 'https://picsum.photos/seed/1/600/400', imageHint: 'whisking eggs' }},
                    { step: 2, text: 'Heat a non-stick skillet over medium heat. Add a little butter or oil.', image: { imageUrl: 'https://picsum.photos/seed/2/600/400', imageHint: 'heating skillet' }},
                    { step: 3, text: 'Pour the egg mixture into the skillet.', image: { imageUrl: 'https://picsum.photos/seed/3/600/400', imageHint: 'eggs cooking' }},
                    { step: 4, text: `As the eggs set, add your ingredients (${input.ingredients.join(', ')}) to one half.`, image: { imageUrl: 'https://picsum.photos/seed/4/600/400', imageHint: 'adding fillings' }},
                    { step: 5, text: 'Fold the omelette and cook until the cheese is melted and eggs are cooked through.', image: { imageUrl: 'https://picsum.photos/seed/5/600/400', imageHint: 'folding omelette' }},
                    { step: 6, text: 'Serve immediately.', image: { imageUrl: 'https://picsum.photos/seed/6/600/400', imageHint: 'omelette served' }},
                ],
                image: {
                    imageUrl: 'https://images.unsplash.com/photo-1582823096534-325255c621d7?q=80&w=2070&auto=format&fit=crop',
                    imageHint: 'fluffy omelette'
                }
            }
        ];
    }
    
    return validRecipes;
  }
);
