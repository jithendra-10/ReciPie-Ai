"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "./ui/card";
import { InstructionStep } from "@/lib/data";

interface InstructionsCarouselProps {
  instructions: InstructionStep[];
}

export default function InstructionsCarousel({ instructions }: InstructionsCarouselProps) {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {instructions.map((step, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className="overflow-hidden">
                <div className="relative aspect-video w-full">
                  <Image
                    src={step.image.imageUrl}
                    alt={`Step ${step.step}`}
                    fill
                    className="object-cover"
                    data-ai-hint={step.image.imageHint}
                  />
                </div>
                <CardContent className="p-6">
                  <p className="text-sm font-bold text-primary mb-2">
                    Step {step.step} of {instructions.length}
                  </p>
                  <p className="text-lg">{step.text}</p>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-4 md:-left-12" />
      <CarouselNext className="-right-4 md:-right-12" />
    </Carousel>
  );
}
