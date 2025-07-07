'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Car,
  Utensils,
  Bolt,
  ShoppingCart,
  Bike,
  Train,
  Plane,
} from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';

type ActivityResult = {
  category: string;
  value: number;
} | null;

export default function AddActivityPage() {
  const [result, setResult] = useState<ActivityResult>(null);

  const handleCalculate = (category: string) => {
    // Dummy calculation
    const emissionValue = parseFloat((Math.random() * 5).toFixed(2));
    setResult({ category, value: emissionValue });
  };

  const ActivityResult = ({ result }: { result: ActivityResult }) => {
    if (!result) return null;

    return (
      <div className="mt-6 rounded-lg border bg-green-50 border-green-200 p-4 text-center">
        <p className="text-sm text-green-700">Estimated Emission:</p>
        <p className="text-2xl font-bold text-primary">
          {result.value} kg CO₂e
        </p>
        <Button size="sm" className="mt-2">Add to Log</Button>
      </div>
    );
  };

  return (
    <div className="flex justify-center items-start p-4 md:p-8 pt-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Log New Activity</CardTitle>
          <CardDescription>
            Select a category and log your activity to see its impact.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="travel" className="w-full" onValueChange={() => setResult(null)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="travel">
                <Car className="mr-2 h-4 w-4" /> Travel
              </TabsTrigger>
              <TabsTrigger value="food">
                <Utensils className="mr-2 h-4 w-4" /> Food
              </TabsTrigger>
              <TabsTrigger value="energy">
                <Bolt className="mr-2 h-4 w-4" /> Energy
              </TabsTrigger>
              <TabsTrigger value="shopping">
                <ShoppingCart className="mr-2 h-4 w-4" /> Shopping
              </TabsTrigger>
            </TabsList>
            <TabsContent value="travel" className="mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Mode of Transport</Label>
                  <RadioGroup defaultValue="car" className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Label htmlFor="car" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        <RadioGroupItem value="car" id="car" className="sr-only" />
                        <Car className="mb-2"/> Car
                      </Label>
                       <Label htmlFor="bike" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        <RadioGroupItem value="bike" id="bike" className="sr-only" />
                        <Bike className="mb-2"/> Bike
                      </Label>
                      <Label htmlFor="metro" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        <RadioGroupItem value="metro" id="metro" className="sr-only" />
                        <Train className="mb-2"/> Metro
                      </Label>
                       <Label htmlFor="plane" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        <RadioGroupItem value="plane" id="plane" className="sr-only" />
                        <Plane className="mb-2"/> Plane
                      </Label>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distance">Distance (km)</Label>
                  <Input id="distance" type="number" placeholder="e.g., 25" />
                </div>
                <Button onClick={() => handleCalculate('Travel')}>Calculate Emission</Button>
                <ActivityResult result={result} />
              </div>
            </TabsContent>
            <TabsContent value="food" className="mt-6">
               <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Meal Type</Label>
                    <RadioGroup defaultValue="home" className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <Label htmlFor="home" className="text-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        <RadioGroupItem value="home" id="home" className="sr-only" />
                         Home-cooked
                      </Label>
                       <Label htmlFor="takeout" className="text-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        <RadioGroupItem value="takeout" id="takeout" className="sr-only" />
                         Takeout
                      </Label>
                      <Label htmlFor="restaurant" className="text-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        <RadioGroupItem value="restaurant" id="restaurant" className="sr-only" />
                         Restaurant
                      </Label>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>Diet Type</Label>
                  <div className='flex gap-2'>
                    <Badge variant='secondary'>Veg</Badge>
                    <Badge variant='outline'>Non-Veg</Badge>
                     <Badge variant='outline'>Processed</Badge>
                  </div>
                </div>
                <Button onClick={() => handleCalculate('Food')}>Calculate Emission</Button>
                 <ActivityResult result={result} />
              </div>
            </TabsContent>
             <TabsContent value="energy" className="mt-6">
               <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="appliance">Electricity Consumed (kWh)</Label>
                  <Input id="appliance" type="number" placeholder="e.g., 5" />
                </div>
                <div className="space-y-2">
                  <Label>Or Hours of Usage for Major Appliances</Label>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                     <Label htmlFor="ac-hours" className='font-normal'>Air Conditioner</Label>
                     <Input id="ac-hours" type="number" placeholder="e.g., 3 hours" />
                     <Label htmlFor="heater-hours" className='font-normal'>Heater</Label>
                     <Input id="heater-hours" type="number" placeholder="e.g., 1 hour" />
                  </div>
                </div>
                <Button onClick={() => handleCalculate('Energy')}>Calculate Emission</Button>
                 <ActivityResult result={result} />
              </div>
            </TabsContent>
            <TabsContent value="shopping" className="mt-6">
               <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Product Category</Label>
                  <RadioGroup defaultValue="clothing" className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <Label htmlFor="clothing" className="text-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        <RadioGroupItem value="clothing" id="clothing" className="sr-only" />
                         Clothing
                      </Label>
                       <Label htmlFor="electronics" className="text-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        <RadioGroupItem value="electronics" id="electronics" className="sr-only" />
                         Electronics
                      </Label>
                      <Label htmlFor="other" className="text-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        <RadioGroupItem value="other" id="other" className="sr-only" />
                         Other
                      </Label>
                  </RadioGroup>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="price">Amount Spent ($)</Label>
                  <Input id="price" type="number" placeholder="e.g., 50" />
                </div>
                <Button onClick={() => handleCalculate('Shopping')}>Calculate Emission</Button>
                 <ActivityResult result={result} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
