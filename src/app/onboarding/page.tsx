'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller, type SubmitHandler, type FieldValues } from 'react-hook-form';
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
import { Progress } from '@/components/ui/progress';
import { Car, CookingPot, Zap, ShoppingCart, Users, Leaf, Check, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { setUserProfile, getUserProfile } from '@/lib/firestore';
import { useToast } from '@/hooks/use-toast';
import { AnimatePresence, motion } from 'framer-motion';
import type { UserProfile, TransportMode, TransportDetail } from '@/types';
import { calculateBaselineEmissions } from '@/lib/calculations';

const steps = [
  { id: 1, title: 'Welcome', icon: Leaf, fields: [] },
  { id: 2, title: 'Travel Habits', icon: Car, fields: ['transportModes'] },
  { id: 3, title: 'Food Habits', icon: CookingPot, fields: ['diet', 'mealsPerDay', 'householdSize'] },
  { id: 4, title: 'Home Energy', icon: Zap, fields: ['monthlyKwh', 'usesRenewable', 'usesAcHeater'] },
  { id: 5, title: 'Shopping', icon: ShoppingCart, fields: ['monthlySpend'] },
  { id: 6, title: 'Review & Finish', icon: Check, fields: [] },
];

const transportOptions: TransportMode[] = ['car', 'bike', 'metro', 'bus', 'walk', 'flights'];

const defaultProfileValues: Omit<UserProfile, 'id' | 'baselineEmissions'> = {
    transportModes: { car: { km_per_week: 50 } },
    diet: 'mixed',
    monthlyKwh: 150,
    usesRenewable: false,
    usesAcHeater: true,
    monthlySpend: 4000,
    householdSize: 2,
    mealsPerDay: 3,
};


export default function OnboardingPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    
    const { control, trigger, handleSubmit, watch, getValues, reset } = useForm<UserProfile>({
        defaultValues: defaultProfileValues
    });

    useEffect(() => {
        const checkForProfile = async () => {
            if (user?.uid) {
                const existingProfile = await getUserProfile(user.uid);
                if (existingProfile) {
                    setIsUpdateMode(true);
                    const cleanProfile = Object.fromEntries(Object.entries(existingProfile).filter(([_, v]) => v != null));
                    reset({ ...defaultProfileValues, ...cleanProfile });
                }
            }
        };
        checkForProfile();
    }, [user, reset]);

    const formValues = watch();

    const handleNext = async () => {
        const fields = steps[currentStep-1].fields;
        const isValid = await trigger(fields as any);
        if(isValid || fields.length === 0) {
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
          const cleanedTransportModes = Object.entries(data.transportModes || {}).reduce((acc, [key, value]) => {
            if (value !== undefined) {
              acc[key as TransportMode] = { km_per_week: Number(value.km_per_week) || 0 };
            }
            return acc;
          }, {} as Partial<Record<TransportMode, TransportDetail>>);

          const dataToSave: Omit<UserProfile, 'id' | 'baselineEmissions'> = {
            diet: data.diet || 'mixed',
            householdSize: Number(data.householdSize) || 1,
            mealsPerDay: Number(data.mealsPerDay) || 1,
            monthlyKwh: Number(data.monthlyKwh) || 0,
            monthlySpend: Number(data.monthlySpend) || 0,
            transportModes: cleanedTransportModes,
            usesAcHeater: data.usesAcHeater ?? false,
            usesRenewable: data.usesRenewable ?? false,
          };
          
          const baselineEmissions = calculateBaselineEmissions(dataToSave as UserProfile);
          const profileData: UserProfile = { ...dataToSave, baselineEmissions };
          
          await setUserProfile(user.uid, profileData);
          
          sessionStorage.setItem('onboardingComplete', 'true');

          toast({ title: 'Success!', description: `Your carbon profile has been ${isUpdateMode ? 'updated' : 'created'}.` });
          router.push('/dashboard');
        } catch (error: any) {
          toast({ variant: 'destructive', title: 'Error', description: error.message || 'Could not save your profile.' });
          setIsLoading(false);
        }
    };

    const progress = (currentStep / steps.length) * 100;
    const CurrentIcon = steps[currentStep-1].icon;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <Progress value={progress} className="mb-4 h-2" />
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <CurrentIcon className="size-5" />
            </div>
            <CardTitle>{steps[currentStep-1].title}</CardTitle>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="min-h-[350px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        {currentStep === 1 && (
                            <div>
                                {isUpdateMode ? (
                                <>
                                    <h2 className="text-2xl font-semibold">Welcome Back!</h2>
                                    <p className="text-muted-foreground mt-2">Let’s update your carbon profile to ensure your insights are accurate. Please review and adjust your lifestyle details below.</p>
                                </>
                                ) : (
                                <>
                                    <h2 className="text-2xl font-semibold">Welcome to CarbonWise!</h2>
                                    <p className="text-muted-foreground mt-2">Let’s understand your lifestyle to build your personalized carbon profile. This will help us give you accurate insights and recommendations.</p>
                                </>
                                )}
                            </div>
                        )}
                        {currentStep === 2 && (
                             <div>
                                <Label>What are your primary modes of transport?</Label>
                                <p className="text-sm text-muted-foreground mb-4">Select all that apply and enter the average distance per week.</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                  {transportOptions.map(mode => (
                                    <Controller
                                        key={mode}
                                        name={`transportModes.${mode}`}
                                        control={control}
                                        render={({ field }) => (
                                          <div className="space-y-2">
                                            <div className="flex items-center gap-2 rounded-md border p-3">
                                              <Switch id={mode} checked={!!field.value} onCheckedChange={(checked) => field.onChange(checked ? { km_per_week: 0 } : undefined)} />
                                              <Label htmlFor={mode} className="capitalize text-base">{mode}</Label>
                                            </div>
                                            {field.value && <Input type="number" placeholder='km/week' {...field} value={field.value.km_per_week ?? ''} onChange={e => field.onChange({km_per_week: e.target.value === '' ? undefined : parseInt(e.target.value, 10)})} />}
                                          </div>
                                        )}
                                    />
                                  ))}
                                </div>
                            </div>
                        )}
                        {currentStep === 3 && (
                             <div className="grid md:grid-cols-2 gap-8">
                                <Controller
                                    name="diet"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="space-y-2">
                                            <Label>What best describes your diet?</Label>
                                            <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-1 gap-2">
                                                <Label className="flex items-center justify-start rounded-md border p-4 cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                                    <RadioGroupItem value="vegetarian" id="veg" className="peer" /> <span className="ml-4">🥗 Vegetarian</span>
                                                </Label>
                                                <Label className="flex items-center justify-start rounded-md border p-4 cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                                    <RadioGroupItem value="mixed" id="mixed" className="peer" /> <span className="ml-4">🍜 Mixed</span>
                                                </Label>
                                                <Label className="flex items-center justify-start rounded-md border p-4 cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                                    <RadioGroupItem value="meat-heavy" id="heavy" className="peer" /> <span className="ml-4">🥩 Meat-heavy</span>
                                                </Label>
                                            </RadioGroup>
                                        </div>
                                    )} />
                                 <div className="space-y-4">
                                     <Controller
                                        name="mealsPerDay"
                                        control={control}
                                        render={({ field }) => (
                                            <div className="space-y-2">
                                                <Label htmlFor="meals">Average meals per day</Label>
                                                <Input id="meals" type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))} />
                                            </div>
                                        )}
                                    />
                                     <Controller
                                        name="householdSize"
                                        control={control}
                                        render={({ field }) => (
                                            <div className="space-y-2">
                                                <Label htmlFor="household">Number of people in household</Label>
                                                <Input id="household" type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))} />
                                            </div>
                                        )}
                                    />
                                 </div>
                            </div>
                        )}
                        {currentStep === 4 && (
                            <div className="space-y-6">
                                <Controller name="monthlyKwh" control={control} render={({ field }) => (
                                    <div className="space-y-2">
                                        <Label htmlFor="energy">Monthly electricity use (kWh)</Label>
                                        <Input id="energy" type="number" placeholder="e.g., 300" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))} />
                                    </div>
                                )}/>
                                <Controller name="usesRenewable" control={control} render={({ field }) => (
                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <Label htmlFor="renewable" className="text-base">Do you use renewable energy (e.g., solar)?</Label>
                                        <Switch id="renewable" checked={field.value} onCheckedChange={field.onChange} />
                                    </div>
                                )}/>
                                 <Controller name="usesAcHeater" control={control} render={({ field }) => (
                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <Label htmlFor="ac" className="text-base">Do you use AC or a heater regularly?</Label>
                                        <Switch id="ac" checked={field.value} onCheckedChange={field.onChange} />
                                    </div>
                                )}/>
                            </div>
                        )}
                        {currentStep === 5 && (
                             <Controller
                                name="monthlySpend"
                                control={control}
                                render={({ field }) => (
                                    <div className="space-y-2">
                                        <Label>Monthly spend on non-essentials (fashion, electronics) (₹)</Label>
                                        <Input type="number" placeholder="e.g., 2500" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))} />
                                    </div>
                                )}/>
                        )}
                        {currentStep === 6 && (
                            <div>
                               <h2 className="text-2xl font-semibold">Ready to Go!</h2>
                               <p className="text-muted-foreground mt-2">Here's a summary of your lifestyle. This will be used to calculate your initial carbon footprint. You can change this anytime in your profile.</p>
                               <Card className="mt-4">
                                   <CardContent className="pt-6 grid grid-cols-2 gap-4 text-sm">
                                        <div><strong className="font-medium text-muted-foreground block">Diet</strong> {getValues('diet')}</div>
                                        <div><strong className="font-medium text-muted-foreground block">Household</strong> {getValues('householdSize')} people</div>
                                        <div><strong className="font-medium text-muted-foreground block">Energy</strong> {getValues('monthlyKwh')} kWh/month</div>
                                        <div><strong className="font-medium text-muted-foreground block">Shopping Spend</strong> ₹{getValues('monthlySpend')}/month</div>
                                        <div><strong className="font-medium text-muted-foreground block">Renewable?</strong> {getValues('usesRenewable') ? 'Yes' : 'No'}</div>
                                        <div><strong className="font-medium text-muted-foreground block">AC/Heater?</strong> {getValues('usesAcHeater') ? 'Yes' : 'No'}</div>
                                        <div className="col-span-2"><strong className="font-medium text-muted-foreground block">Travel</strong> 
                                            <ul className="list-disc pl-5">
                                            {Object.entries(getValues('transportModes')).map(([mode, details]) => (
                                                details && <li key={mode} className="capitalize">{mode}: {details.km_per_week} km/week</li>
                                            ))}
                                            </ul>
                                        </div>
                                   </CardContent>
                               </Card>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </CardContent>

            <CardFooter className="justify-between">
            {currentStep > 1 ? (
                <Button type="button" variant="outline" onClick={handleBack}>Back</Button>
            ) : <div />}
            {currentStep < steps.length ? (
                <Button type="button" onClick={handleNext}>{currentStep === 1 ? 'Get Started' : 'Next'}</Button>
            ) : (
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isUpdateMode ? 'Update My Carbon Profile' : 'Create My Carbon Profile'}
                </Button>
            )}
            </CardFooter>
        </form>
      </Card>
    </div>
  );
}
