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
  CheckCircle
} from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import type { CalculateEmissionInput, EmissionCategory } from '@/types';
import { calculateEmission } from '@/ai/flows/calculate-emission';
import { useAuth } from '@/hooks/use-auth';
import { addActivityLog } from '@/lib/firestore';
import { cn } from '@/lib/utils';

type ActivityResult = {
  category: string;
  value: number;
} | null;

export default function AddActivityPage() {
  const { user } = useAuth();
  const [result, setResult] = useState<ActivityResult>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const { toast } = useToast();

  const [travelMode, setTravelMode] = useState('car');
  const [distance, setDistance] = useState('');
  
  const [mealType, setMealType] = useState('home');
  const [dietType, setDietType] = useState('veg');

  const [energyConsumed, setEnergyConsumed] = useState('');
  const [acHours, setAcHours] = useState('');
  const [heaterHours, setHeaterHours] = useState('');

  const [productCategory, setProductCategory] = useState('clothing');
  const [amountSpent, setAmountSpent] = useState('');

  const handleCalculate = async (category: CalculateEmissionInput['category']) => {
    setIsCalculating(true);
    setResult(null);

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
           input = { category, value: 1, details: { mealType, dietType } };
           description = `${dietType} meal (${mealType})`;
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
      setResult({ category, value: parseFloat(emission.toFixed(2)) });

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Calculation Error',
        description: error.message || 'Could not calculate emissions.',
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleLogActivity = async () => {
    if (!result || !user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No result to log or you are not signed in.',
      });
      return;
    }

    setIsLogging(true);
    try {
      await addActivityLog(user.uid, {
        category: result.category as EmissionCategory,
        emissions: result.value,
        description: `Logged ${result.category} activity`, // This could be more detailed
        date: new Date().toISOString(),
      });
      toast({
        title: 'Success!',
        description: 'Your activity has been logged.',
        className: 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700'
      });
      setResult(null); // Clear result after logging
    } catch (error: any) {
       toast({
        variant: 'destructive',
        title: 'Logging Error',
        description: error.message || 'Could not log your activity.',
      });
    } finally {
      setIsLogging(false);
    }
  };

  const ActivityResultDisplay = ({ result, onLog, isLogging }: { result: ActivityResult, onLog: () => void, isLogging: boolean }) => {
    if (!result) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 rounded-lg border bg-green-50 border-green-200 p-4 text-center dark:bg-green-900/20 dark:border-green-700/30"
      >
        <p className="text-sm text-green-700 dark:text-green-300">Estimated Emission:</p>
        <p className="text-2xl font-bold text-primary">
          {result.value} kg CO₂e
        </p>
        <Button size="sm" className="mt-2" onClick={onLog} disabled={isLogging}>
          {isLogging ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle className="mr-2 h-4 w-4" />
          )}
          Add to Log
        </Button>
      </motion.div>
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
                  <Input id="distance" type="number" placeholder="e.g., 25" value={distance} onChange={(e) => setDistance(e.target.value)} />
                </div>
                <Button onClick={() => handleCalculate('Travel')} disabled={isCalculating}>
                  {isCalculating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Calculate Emission
                </Button>
                <AnimatePresence>
                  {result && result.category === 'Travel' && <ActivityResultDisplay result={result} onLog={handleLogActivity} isLogging={isLogging} />}
                </AnimatePresence>
              </div>
            </TabsContent>

            {/* Food Tab */}
            <TabsContent value="food" className="mt-6">
               <div className="space-y-4">
                 <div className="space-y-2">
                  <Label>Meal Type</Label>
                    <RadioGroup value={mealType} onValueChange={setMealType} className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                  <RadioGroup value={dietType} onValueChange={setDietType} className='flex gap-2'>
                      <Label htmlFor="veg" className={cn("rounded-full border px-3 py-1 cursor-pointer", dietType === 'veg' ? 'bg-secondary text-secondary-foreground border-transparent' : 'bg-transparent')}>
                        <RadioGroupItem value="veg" id="veg" className="sr-only" />
                         Veg
                      </Label>
                       <Label htmlFor="non-veg" className={cn("rounded-full border px-3 py-1 cursor-pointer", dietType === 'non-veg' ? 'bg-secondary text-secondary-foreground border-transparent' : 'bg-transparent')}>
                        <RadioGroupItem value="non-veg" id="non-veg" className="sr-only" />
                         Non-Veg
                      </Label>
                       <Label htmlFor="processed" className={cn("rounded-full border px-3 py-1 cursor-pointer", dietType === 'processed' ? 'bg-secondary text-secondary-foreground border-transparent' : 'bg-transparent')}>
                        <RadioGroupItem value="processed" id="processed" className="sr-only" />
                         Processed
                      </Label>
                  </RadioGroup>
                </div>
                <Button onClick={() => handleCalculate('Food')} disabled={isCalculating}>
                   {isCalculating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Calculate Emission
                </Button>
                <AnimatePresence>
                  {result && result.category === 'Food' && <ActivityResultDisplay result={result} onLog={handleLogActivity} isLogging={isLogging} />}
                </AnimatePresence>
              </div>
            </TabsContent>

            {/* Energy Tab */}
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
                <Button onClick={() => handleCalculate('Energy')} disabled={isCalculating}>
                  {isCalculating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Calculate Emission
                </Button>
                <AnimatePresence>
                  {result && result.category === 'Energy' && <ActivityResultDisplay result={result} onLog={handleLogActivity} isLogging={isLogging} />}
                </AnimatePresence>
              </div>
            </TabsContent>

            {/* Shopping Tab */}
            <TabsContent value="shopping" className="mt-6">
               <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Product Category</Label>
                  <RadioGroup value={productCategory} onValueChange={setProductCategory} className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                  <Input id="price" type="number" placeholder="e.g., 50" value={amountSpent} onChange={e => setAmountSpent(e.target.value)} />
                </div>
                <Button onClick={() => handleCalculate('Shopping')} disabled={isCalculating}>
                  {isCalculating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Calculate Emission
                </Button>
                 <AnimatePresence>
                  {result && result.category === 'Shopping' && <ActivityResultDisplay result={result} onLog={handleLogActivity} isLogging={isLogging} />}
                </AnimatePresence>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
