import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import type { Recipe } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const searchParams = useSearchParams();
  const recipes = searchParams.get('recipes');

  const href = `/dashboard/recipe/${recipe.id}${recipes ? `?recipes=${encodeURIComponent(recipes)}` : ''}`;

  return (
    <Link href={href} className="group">
      <Card className="h-full overflow-hidden transition-all group-hover:shadow-xl group-hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={recipe.image.imageUrl}
              alt={recipe.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              data-ai-hint={recipe.image.imageHint}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="font-headline text-xl leading-tight mb-2">
            {recipe.title}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {recipe.description}
          </CardDescription>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            <span>{recipe.prepTimeMinutes} min prep</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
