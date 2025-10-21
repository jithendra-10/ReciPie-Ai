"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider, Controller, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Logo } from './logo';
import { dietaryOptions, skillLevels, cuisineOptions } from '@/lib/data';
import { Progress } from './ui/progress';

const formSchema = z.object({
  dietary: z.array(z.string()).default([]),
  skillLevel: z.string().min(1, "Please select your skill level."),
  cuisines: z.array(z.string()).default([]),
});

type OnboardingFormValues = z.infer<typeof formSchema>;

export default function OnboardingForm() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const { toast } = useToast();

  const methods = useForm<OnboardingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dietary: [],
      skillLevel: '',
      cuisines: [],
    },
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const onSubmit = (data: OnboardingFormValues) => {
    console.log('Onboarding data:', data);
    toast({
      title: 'Preferences Saved!',
      description: 'Your recipe feed is now personalized.',
    });
    router.push('/dashboard');
  };

  const totalSteps = 4;
  const progress = ((step + 1) / totalSteps) * 100;

  const steps = [
    <WelcomeStep key="welcome" nextStep={nextStep} />,
    <DietaryStep key="dietary" />,
    <SkillLevelStep key="skill" />,
    <CuisineStep key="cuisine" />,
  ];

  return (
    <FormProvider {...methods}>
      <Card className="overflow-hidden">
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {steps[step]}
            </motion.div>
          </AnimatePresence>
          
          {step > 0 && (
            <CardFooter className="flex justify-between border-t pt-6">
              <Button type="button" variant="ghost" onClick={prevStep}>
                Previous
              </Button>
              <div className="flex-1 px-8">
                <Progress value={progress} />
              </div>
              {step < steps.length - 1 ? (
                <Button type="button" onClick={nextStep}>Next</Button>
              ) : (
                <Button type="submit">Finish</Button>
              )}
            </CardFooter>
          )}
        </form>
      </Card>
    </FormProvider>
  );
}

const WelcomeStep = ({ nextStep }: { nextStep: () => void }) => (
  <>
    <CardHeader className="items-center text-center">
      <Logo className="mb-4" />
      <CardTitle className="font-headline text-4xl">Welcome to ReciPie AI</CardTitle>
      <CardDescription className="max-w-md">
        Discover personalized recipes, reduce food waste, and unlock your culinary potential. Let's get your taste profile set up!
      </CardDescription>
    </CardHeader>
    <CardContent className="flex justify-center">
       <Button size="lg" type="button" onClick={nextStep}>Get Started</Button>
    </CardContent>
  </>
);

const DietaryStep = () => {
  const { control } = useFormContext();
  return (
    <>
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Dietary Preferences</CardTitle>
        <CardDescription>Select any dietary needs. This will help us filter recipes for you.</CardDescription>
      </CardHeader>
      <CardContent>
        <Controller
          name="dietary"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-4">
              {dietaryOptions.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={item.id}
                    checked={field.value?.includes(item.id)}
                    onCheckedChange={(checked) => {
                      return checked
                        ? field.onChange([...(field.value || []), item.id])
                        : field.onChange(field.value?.filter((value) => value !== item.id));
                    }}
                  />
                  <Label htmlFor={item.id} className="text-base font-normal">
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>
          )}
        />
      </CardContent>
    </>
  );
};

const SkillLevelStep = () => {
  const { control } = useFormContext();
  return (
    <>
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Cooking Skill Level</CardTitle>
        <CardDescription>How comfortable are you in the kitchen?</CardDescription>
      </CardHeader>
      <CardContent>
        <Controller
          name="skillLevel"
          control={control}
          render={({ field }) => (
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 gap-4">
              {skillLevels.map((level) => (
                <Label
                  key={level}
                  htmlFor={level}
                  className="flex items-center space-x-4 rounded-md border p-4 hover:bg-accent hover:text-accent-foreground has-[input:checked]:border-primary has-[input:checked]:ring-2 has-[input:checked]:ring-primary"
                >
                  <RadioGroupItem value={level} id={level} />
                  <span className="text-base font-normal">{level}</span>
                </Label>
              ))}
            </RadioGroup>
          )}
        />
      </CardContent>
    </>
  );
};

const CuisineStep = () => {
  const { control } = useFormContext();
  return (
    <>
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Favorite Cuisines</CardTitle>
        <CardDescription>What are some of your go-to flavors? (Select as many as you like)</CardDescription>
      </CardHeader>
      <CardContent>
        <Controller
          name="cuisines"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-4">
              {cuisineOptions.map((cuisine) => (
                <div key={cuisine} className="flex items-center space-x-2">
                  <Checkbox
                    id={cuisine}
                    checked={field.value?.includes(cuisine)}
                    onCheckedChange={(checked) => {
                      return checked
                        ? field.onChange([...(field.value || []), cuisine])
                        : field.onChange(field.value?.filter((value) => value !== cuisine));
                    }}
                  />
                  <Label htmlFor={cuisine} className="text-base font-normal">
                    {cuisine}
                  </Label>
                </div>
              ))}
            </div>
          )}
        />
      </CardContent>
    </>
  );
};
