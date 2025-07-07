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
  Loader2,
  PlusCircle,
} from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import type { CalculateEmissionInput, EmissionCategory } from '@/types';
import { calculateEmission } from '@/ai/flows/calculate-emission';
import { useAuth } from '@/hooks/use-auth';
import { addActivityLog } from '@/lib/firestore';
import { cn } from '@/lib/utils';

export default function AddActivityPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Form state for each category
  const [travelMode, setTravelMode] = useState('car');
  const [distance, setDistance] = useState('');
  
  const [mealType, setMealType] = useState('home');
  const [dietType, setDietType] = useState('veg');

  const [energyConsumed, setEnergyConsumed] = useState('');
  const [acHours, setAcHours] = useState('');
  const [heaterHours, setHeaterHours] = useState('');

  const [productCategory, setProductCategory] = useState('clothing');
  const [amountSpent, setAmountSpent] = useState('');

  const handleAddActivity = async (category: EmissionCategory) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not Signed In',
        description: 'You must be signed in to log an activity.',
      });
      return;
    }

    setIsLoading(true);
    let input: CalculateEmissionInput | null = null;
    let description = '';

    try {
      switch (category) {
        case 'Travel':
          if (!distance || parseFloat(distance) <= 0) throw new Error('Please enter a valid distance.');
          input = { category, value: parseFloat(distance), details: { mode: travelMode } };
          description = `${travelMode.charAt(0).toUpperCase() + travelMode.slice(1)} ride for ${distance} km`;
          break;
        case 'Food':
           input = { category, value: 1, details: { dietType } }; // mealType is not in factors
           description = `${dietType} meal`;
          break;
        case 'Energy':
          const energy = parseFloat(energyConsumed) || 0;
          const ac = parseFloat(acHours) || 0;
          const heater = parseFloat(heaterHours) || 0;
          if (energy <= 0 && ac <= 0 && heater <= 0) throw new Error('Please enter energy consumption or appliance usage.');
          input = { category, value: energy, details: { acHours: ac, heaterHours: heater } };
          description = `Energy consumption`;
          break;
        case 'Shopping':
          if (!amountSpent || parseFloat(amountSpent) <= 0) throw new Error('Please enter a valid amount spent.');
          input = { category, value: parseFloat(amountSpent), details: { product: productCategory } };
          description = `Shopping for ${productCategory}`;
          break;
        default:
          throw new Error('Invalid activity category.');
      }
      
      const { emission } = await calculateEmission(input);

      await addActivityLog(user.uid, {
        category,
        emissions: parseFloat(emission.toFixed(2)),
        description,
        date: new Date().toISOString(),
      });
      
      toast({
        title: 'Success!',
        description: 'Your activity has been logged.',
      });

      // Reset form fields after logging
      switch (category) {
        case 'Travel': setDistance(''); break;
        case 'Food': break; // No fields to clear for food
        case 'Energy': setEnergyConsumed(''); setAcHours(''); setHeaterHours(''); break;
        case 'Shopping': setAmountSpent(''); break;
      }

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Logging Error',
        description: error.message || 'Could not log your activity.',
      });
    } finally {
      setIsLoading(false);
    }
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
          <Tabs defaultValue="travel" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="travel"><Car className="mr-2 h-4 w-4" /> Travel</TabsTrigger>
              <TabsTrigger value="food"><Utensils className="mr-2 h-4 w-4" /> Food</TabsTrigger>
              <TabsTrigger value="energy"><Bolt className="mr-2 h-4 w-4" /> Energy</TabsTrigger>
              <TabsTrigger value="shopping"><ShoppingCart className="mr-2 h-4 w-4" /> Shopping</TabsTrigger>
            </TabsList>

            {/* Travel Tab */}
            <TabsContent value="travel" className="mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Mode of Transport</Label>
                   <RadioGroup value={travelMode} onValueChange={setTravelMode} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Label htmlFor="car" className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-muted/30 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:shadow-md">
                        <RadioGroupItem value="car" id="car" className="sr-only" />
                        <Car className="mb-2"/> Car
                      </Label>
                       <Label htmlFor="bike" className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-muted/30 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:shadow-md">
                        <RadioGroupItem value="bike" id="bike" className="sr-only" />
                        <Bike className="mb-2"/> Bike
                      </Label>
                      <Label htmlFor="metro" className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-muted/30 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:shadow-md">
                        <RadioGroupItem value="metro" id="metro" className="sr-only" />
                        <Train className="mb-2"/> Metro
                      </Label>
                       <Label htmlFor="plane" className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-muted/30 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:shadow-md">
                        <RadioGroupItem value="plane" id="plane" className="sr-only" />
                        <Plane className="mb-2"/> Plane
                      </Label>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distance">Distance (km)</Label>
                  <Input id="distance" type="number" placeholder="e.g., 25" value={distance} onChange={(e) => setDistance(e.target.value)} />
                </div>
                <Button onClick={() => handleAddActivity('Travel')} disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                  Add Activity
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="food" className="mt-6">
               <div className="space-y-4">
                 <div className="space-y-2">
                  <Label>Meal Type</Label>
                    <RadioGroup value={mealType} onValueChange={setMealType} className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <Label htmlFor="home" className="text-center rounded-lg border-2 border-muted bg-muted/30 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:shadow-md">
                        <RadioGroupItem value="home" id="home" className="sr-only" />
                         Home-cooked
                      </Label>
                       <Label htmlFor="takeout" className="text-center rounded-lg border-2 border-muted bg-muted/30 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:shadow-md">
                        <RadioGroupItem value="takeout" id="takeout" className="sr-only" />
                         Takeout
                      </Label>
                      <Label htmlFor="restaurant" className="text-center rounded-lg border-2 border-muted bg-muted/30 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:shadow-md">
                        <RadioGroupItem value="restaurant" id="restaurant" className="sr-only" />
                         Restaurant
                      </Label>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>Diet Type</Label>
                  <RadioGroup value={dietType} onValueChange={setDietType} className='flex gap-2'>
                      <Label htmlFor="veg" className={cn("rounded-full border px-3 py-1 cursor-pointer transition-all", dietType === 'veg' ? 'bg-primary/20 border-primary text-primary-foreground' : 'bg-transparent')}>
                        <RadioGroupItem value="veg" id="veg" className="sr-only" />
                         Veg
                      </Label>
                       <Label htmlFor="non-veg" className={cn("rounded-full border px-3 py-1 cursor-pointer transition-all", dietType === 'non-veg' ? 'bg-primary/20 border-primary text-primary-foreground' : 'bg-transparent')}>
                        <RadioGroupItem value="non-veg" id="non-veg" className="sr-only" />
                         Non-Veg
                      </Label>
                       <Label htmlFor="processed" className={cn("rounded-full border px-3 py-1 cursor-pointer transition-all", dietType === 'processed' ? 'bg-primary/20 border-primary text-primary-foreground' : 'bg-transparent')}>
                        <RadioGroupItem value="processed" id="processed" className="sr-only" />
                         Processed
                      </Label>
                  </RadioGroup>
                </div>
                <Button onClick={() => handleAddActivity('Food')} disabled={isLoading}>
                   {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                  Add Activity
                </Button>
              </div>
            </TabsContent>
           
             <TabsContent value="energy" className="mt-6">
               <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="appliance">Electricity Consumed (kWh)</Label>
                  <Input id="appliance" type="number" placeholder="e.g., 5" value={energyConsumed} onChange={e => setEnergyConsumed(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Or Hours of Usage for Major Appliances</Label>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                     <Label htmlFor="ac-hours" className='font-normal'>Air Conditioner</Label>
                     <Input id="ac-hours" type="number" placeholder="e.g., 3 hours" value={acHours} onChange={e => setAcHours(e.target.value)} />
                     <Label htmlFor="heater-hours" className='font-normal'>Heater</Label>
                     <Input id="heater-hours" type="number" placeholder="e.g., 1 hour" value={heaterHours} onChange={e => setHeaterHours(e.target.value)} />
                  </div>
                </div>
                <Button onClick={() => handleAddActivity('Energy')} disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                  Add Activity
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="shopping" className="mt-6">
               <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Product Category</Label>
                  <RadioGroup value={productCategory} onValueChange={setProductCategory} className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <Label htmlFor="clothing" className="text-center rounded-lg border-2 border-muted bg-muted/30 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:shadow-md">
                        <RadioGroupItem value="clothing" id="clothing" className="sr-only" />
                         Clothing
                      </Label>
                       <Label htmlFor="electronics" className="text-center rounded-lg border-2 border-muted bg-muted/30 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:shadow-md">
                        <RadioGroupItem value="electronics" id="electronics" className="sr-only" />
                         Electronics
                      </Label>
                      <Label htmlFor="other" className="text-center rounded-lg border-2 border-muted bg-muted/30 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:shadow-md">
                        <RadioGroupItem value="other" id="other" className="sr-only" />
                         Other
                      </Label>
                  </RadioGroup>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="price">Amount Spent (₹)</Label>
                  <Input id="price" type="number" placeholder="e.g., 5000" value={amountSpent} onChange={e => setAmountSpent(e.target.value)} />
                </div>
                <Button onClick={() => handleAddActivity('Shopping')} disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                  Add Activity
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
