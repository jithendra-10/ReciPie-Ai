import ImageUploader from '@/components/image-uploader';

export default function IngredientDetectionPage() {
  return (
    <div className="container py-8">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight mb-2">
          What's In Your Fridge?
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload a photo of your ingredients, and our AI will help you find the perfect recipe.
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
        <ImageUploader />
      </div>
    </div>
  );
}
