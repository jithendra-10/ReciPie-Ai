import Image from 'next/image';
import { wasteTrackingData } from '@/lib/data';
import WasteChart from '@/components/charts/waste-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const visual = PlaceHolderImages.find(p => p.id === 'wasteTrackingVisual');

export default function WasteTrackingPage() {
  return (
    <div className="container py-8">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight mb-2">
          Your Sustainability Scoreboard
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Track your progress, reduce waste, and make a positive impact with every meal.
        </p>
      </header>

      <Card className="mb-8 flex flex-col md:flex-row items-center gap-6 p-8 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="flex-1">
          <CardTitle className="text-primary text-lg font-semibold mb-2">This Month's Impact</CardTitle>
          <p className="font-headline text-5xl font-bold text-foreground mb-2">
            You've saved {wasteTrackingData.totalSavedKg} kg of food!
          </p>
          <p className="text-muted-foreground">
            That's an amazing effort. Keep up the great work in reducing food waste.
          </p>
        </div>
        {visual && (
            <div className="relative h-40 w-40">
                <Image src={visual.imageUrl} alt={visual.description} fill className="object-contain" data-ai-hint={visual.imageHint} />
            </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Used vs. Wasted Ingredients</CardTitle>
              <CardDescription>Visualize your ingredient usage over time.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="monthly">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
                <TabsContent value="weekly">
                  <WasteChart data={wasteTrackingData.periodData.weekly} />
                </TabsContent>
                <TabsContent value="monthly">
                  <WasteChart data={wasteTrackingData.periodData.monthly} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Top Saved Ingredients</CardTitle>
              <CardDescription>Ingredients you're great at using up.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {wasteTrackingData.topSaved.map((item, index) => (
                  <li key={item} className="flex items-center">
                    <span className="text-lg font-semibold text-primary mr-3">{index + 1}.</span>
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Waste-Reduction Tips</CardTitle>
            </CardHeader>
            <CardContent>
               <ul className="space-y-3 text-muted-foreground list-disc list-inside">
                    <li>Use fresh herbs in pestos or infused oils.</li>
                    <li>Revive wilted lettuce by soaking it in ice water for 15-30 minutes.</li>
                    <li>Turn stale bread into croutons, breadcrumbs, or bread pudding.</li>
                </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
