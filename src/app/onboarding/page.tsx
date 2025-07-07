'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Car, CookingPot, Zap, ShoppingCart, Users, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { setUserProfile } from '@/lib/firestore';
import { useToast } from '@/hooks/use-toast';
import { AnimatePresence, motion } from 'framer-motion';
import type { UserProfile } from '@/types';


const steps = [
  { id: 1, title: 'Travel Habits', icon: Car, fields: ['travelMode', 'weeklyDistance'] },
  { id: 2, title: 'Food Habits', icon: CookingPot, fields: ['diet'] },
  { id: 3, title: 'Home Energy', icon: Zap, fields: ['monthlyKwh', 'usesRenewable'] },
  { id: 4, title: 'Shopping', icon: ShoppingCart, fields: ['shoppingFrequency'] },
  { id: 5, title: 'Household', icon: Users, fields: ['householdSize'] },
];

export default function OnboardingPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    
    const { control, trigger, handleSubmit, watch } = useForm<UserProfile>({
        defaultValues: {
            travelMode: 'car',
            weeklyDistance: 50,
            diet: 'mixed',
            monthlyKwh: 100,
            usesRenewable: false,
            shoppingFrequency: 'monthly',
            householdSize: 2,
        }
    });

    const weeklyDistance = watch('weeklyDistance');

    const handleNext = async () => {
        const fields = steps[currentStep-1].fields;
        const isValid = await trigger(fields as any);
        if(isValid) {
            setCurrentStep((prev) => Math.min(prev + 1, steps.length));
        }
    };
    
    const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
    
    const onSubmit: SubmitHandler<UserProfile> = async (data) => {
        if (!user) {
          toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
          return;
        }
        setIsLoading(true);
        try {
          await setUserProfile(user.uid, data);
          toast({ title: 'Success!', description: 'Your profile has been created.' });
          router.push('/dashboard');
        } catch (error) {
          toast({ variant: 'destructive', title: 'Error', description: 'Could not save your profile.' });
          setIsLoading(false);
        }
    };

    const progress = (currentStep / steps.length) * 100;
    const CurrentIcon = steps[currentStep-1].icon;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <Progress value={progress} className="mb-4 h-2" />
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <CurrentIcon className="size-5" />
            </div>
            <CardTitle>{steps[currentStep-1].title}</CardTitle>
          </div>
          <CardDescription>
            Help us understand your habits to create your personalized carbon profile.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="min-h-[250px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        {currentStep === 1 && (
                            <div className="space-y-6">
                            <Controller
                                name="travelMode"
                                control={control}
                                render={({ field }) => (
                                    <div className="space-y-2">
                                        <Label>How do you usually travel?</Label>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger><SelectValue placeholder="Select travel type" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="car">Car</SelectItem>
                                                <SelectItem value="bike">Bike</SelectItem>
                                                <SelectItem value="public">Public Transport</SelectItem>
                                                <SelectItem value="walk">Walk</SelectItem>
                                                <SelectItem value="flights">Flights</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )} />
                                <Controller
                                    name="weeklyDistance"
                                    control={control}
                                    render={({ field }) => (
                                         <div className="space-y-2">
                                            <Label htmlFor="distance">Average distance per week</Label>
                                            <div className="flex items-center gap-4">
                                            <Slider
                                                id="distance"
                                                value={[field.value]}
                                                onValueChange={(vals) => field.onChange(vals[0])}
                                                max={500}
                                                step={10}
                                            />
                                            <div className="font-bold w-20 text-center">{weeklyDistance} km</div>
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                        )}
                        {currentStep === 2 && (
                             <Controller
                                name="diet"
                                control={control}
                                render={({ field }) => (
                                    <div className="space-y-2">
                                        <Label>What best describes your diet?</Label>
                                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 gap-4">
                                            <Label htmlFor="veg" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                                <RadioGroupItem value="veg" id="veg" className="peer sr-only" /> 🥗 Vegetarian
                                            </Label>
                                            <Label htmlFor="mixed" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                                <RadioGroupItem value="mixed" id="mixed" className="peer sr-only" /> 🍜 Mixed
                                            </Label>
                                            <Label htmlFor="non-veg" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                                <RadioGroupItem value="non-veg" id="non-veg" className="peer sr-only" /> 🍗 Non-Veg
                                            </Label>
                                            <Label htmlFor="high-meat" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                                <RadioGroupItem value="high-meat" id="high-meat" className="peer sr-only" /> 🥩 High-Meat
                                            </Label>
                                        </RadioGroup>
                                    </div>
                                )} />
                        )}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <Controller
                                    name="monthlyKwh"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="space-y-2">
                                            <Label htmlFor="energy">Monthly electricity use (kWh)</Label>
                                            <Input id="energy" type="number" placeholder="e.g., 300" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} />
                                        </div>
                                    )}
                                />
                                <Controller
                                    name="usesRenewable"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex items-center justify-between rounded-lg border p-4">
                                            <Label htmlFor="renewable" className="flex flex-col space-y-1">
                                            <span>Use renewable energy?</span>
                                            <span className="font-normal leading-snug text-muted-foreground">e.g. solar panels</span>
                                            </Label>
                                            <Switch id="renewable" checked={field.value} onCheckedChange={field.onChange} />
                                        </div>
                                    )}
                                />
                            </div>
                        )}
                        {currentStep === 4 && (
                            <Controller
                                name="shoppingFrequency"
                                control={control}
                                render={({ field }) => (
                                    <div className="space-y-2">
                                        <Label>How often do you shop for new items?</Label>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger><SelectValue placeholder="Select frequency" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="weekly">Weekly</SelectItem>
                                                <SelectItem value="monthly">Monthly</SelectItem>
                                                <SelectItem value="rarely">Rarely</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            />
                        )}
                        {currentStep === 5 && (
                             <Controller
                                name="householdSize"
                                control={control}
                                render={({ field }) => (
                                    <div className="space-y-2">
                                        <Label htmlFor="household">Number of people in household</Label>
                                        <Input id="household" type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 1)} />
                                    </div>
                                )}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </CardContent>

            <CardFooter className="justify-between">
            {currentStep > 1 ? (
                <Button type="button" variant="outline" onClick={handleBack}>Back</Button>
            ) : <div />}
            {currentStep < steps.length ? (
                <Button type="button" onClick={handleNext}>Next</Button>
            ) : (
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create My Carbon Profile
                </Button>
            )}
            </CardFooter>
        </form>
      </Card>
    </div>
  );
}
