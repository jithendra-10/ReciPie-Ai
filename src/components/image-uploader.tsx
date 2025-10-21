
"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { UploadCloud, X, Loader2, Sparkles, Wand2 } from "lucide-react";
import { detectIngredientsFromImage } from "@/ai/flows/ingredient-detection-via-image-upload";
import { generateRecipes } from "@/ai/flows/recipe-generation-flow";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";

export default function ImageUploader() {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([]);
  const [manualIngredient, setManualIngredient] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        handleDetectIngredients(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };
  
  const handleDetectIngredients = async (photoDataUri: string) => {
    setIsDetecting(true);
    setDetectedIngredients([]);
    try {
      const result = await detectIngredientsFromImage({ photoDataUri });
      setDetectedIngredients(result.ingredients);
    } catch (error) {
      console.error("Error detecting ingredients:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem analyzing your image. Please try again.",
      });
    } finally {
      setIsDetecting(false);
    }
  };

  const handleGenerateRecipes = async () => {
    if (detectedIngredients.length === 0) return;
    setIsGenerating(true);
    try {
      const recipes = await generateRecipes({ ingredients: detectedIngredients });
      const recipesJson = JSON.stringify(recipes);
      router.push(`/dashboard?recipes=${encodeURIComponent(recipesJson)}`);
    } catch (error) {
      console.error("Error generating recipes:", error);
      toast({
        variant: "destructive",
        title: "Recipe Generation Failed",
        description: "Could not generate recipes from the ingredients. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };
  
  const handleRemoveIngredient = (ingredientToRemove: string) => {
    setDetectedIngredients(prev => prev.filter(ing => ing !== ingredientToRemove));
  };
  
  const handleAddManualIngredient = () => {
    if(manualIngredient.trim() && !detectedIngredients.includes(manualIngredient.trim())) {
      setDetectedIngredients(prev => [...prev, manualIngredient.trim()]);
      setManualIngredient("");
    }
  };

  const reset = () => {
    setPreview(null);
    setDetectedIngredients([]);
    setIsDetecting(false);
    setIsGenerating(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isLoading = isDetecting || isGenerating;

  return (
    <Card>
      <CardContent className="p-6">
        {!preview && (
          <div
            className="relative flex flex-col items-center justify-center w-full p-12 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold">
              Drag & drop a photo, or click to browse
            </p>
            <p className="text-muted-foreground">
              Our AI will identify what's in your fridge.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
              className="hidden"
              accept="image/*"
            />
          </div>
        )}

        {preview && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
              <Image src={preview} alt="Ingredients preview" fill className="object-cover" />
              <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8" onClick={reset}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-col">
              <h3 className="font-headline text-2xl mb-4 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Detected Ingredients
              </h3>
              {isDetecting && (
                <div className="flex flex-col items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                  <p className="font-semibold">Analyzing ingredients...</p>
                  <p className="text-sm text-muted-foreground">Please wait.</p>
                </div>
              )}
              
              {!isDetecting && (
                <div className="flex-grow flex flex-col">
                  <div className="flex-grow">
                    <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
                      {detectedIngredients.map((ingredient, index) => (
                        <Badge key={index} variant="secondary" className="text-base py-1 pl-3 pr-2">
                          {ingredient}
                          <button onClick={() => handleRemoveIngredient(ingredient)} className="ml-2 rounded-full hover:bg-muted-foreground/20 p-0.5">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2 mb-6">
                      <Input 
                        placeholder="Add an ingredient..." 
                        value={manualIngredient}
                        onChange={(e) => setManualIngredient(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddManualIngredient()}
                        disabled={isLoading}
                      />
                      <Button onClick={handleAddManualIngredient} disabled={isLoading}>Add</Button>
                    </div>
                  </div>

                  <Button size="lg" className="w-full" disabled={isLoading || detectedIngredients.length === 0} onClick={handleGenerateRecipes}>
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating Recipes...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-5 w-5" />
                        Find Recipes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
