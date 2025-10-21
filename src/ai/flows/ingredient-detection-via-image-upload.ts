'use server';

/**
 * @fileOverview Detects ingredients from an image using Google Vision API.
 *
 * - detectIngredientsFromImage - A function that handles the ingredient detection process.
 * - DetectIngredientsFromImageInput - The input type for the detectIngredientsFromImage function.
 * - DetectIngredientsFromImageOutput - The return type for the detectIngredientsFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectIngredientsFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of ingredients, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectIngredientsFromImageInput = z.infer<typeof DetectIngredientsFromImageInputSchema>;

const DetectIngredientsFromImageOutputSchema = z.object({
  ingredients: z.array(z.string()).describe('List of detected ingredients.'),
});
export type DetectIngredientsFromImageOutput = z.infer<typeof DetectIngredientsFromImageOutputSchema>;

export async function detectIngredientsFromImage(
  input: DetectIngredientsFromImageInput
): Promise<DetectIngredientsFromImageOutput> {
  return detectIngredientsFromImageFlow(input);
}

const detectIngredientsPrompt = ai.definePrompt({
  name: 'detectIngredientsPrompt',
  input: {schema: DetectIngredientsFromImageInputSchema},
  output: {schema: DetectIngredientsFromImageOutputSchema},
  prompt: `You are an AI assistant that detects ingredients from a photo. Return a list of the ingredients that are visible in the photo.\n\nPhoto: {{media url=photoDataUri}}`,
});

const detectIngredientsFromImageFlow = ai.defineFlow(
  {
    name: 'detectIngredientsFromImageFlow',
    inputSchema: DetectIngredientsFromImageInputSchema,
    outputSchema: DetectIngredientsFromImageOutputSchema,
  },
  async input => {
    const {output} = await detectIngredientsPrompt(input);
    return output!;
  }
);
