'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '@/hooks/use-auth';
import { getUserProfile, setUserProfile, getProfileHistory } from '@/lib/firestore';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile, TransportMode, TransportDetail } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Loader2, History } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { calculateBaselineEmissions } from '@/lib/calculations';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from 'date-fns';


const transportOptions: TransportMode[] = ['car', 'bike', 'metro', 'bus', 'walk', 'flights'];

const ProfileSkeleton = () => (
  <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
    {[...Array(5)].map((_, i) => ( // Increased to 5 for the new card
      <Card key={i}>
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
            <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
          </div>
          <Skeleton className="h-10 w-24" />
        </CardContent>
      </Card>
    ))}
  </div>
);

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileHistory, setProfileHistory] = useState<UserProfile[]>([]);

  const { control, handleSubmit, reset, watch } = useForm<UserProfile>();

  const selectedTransportModes = watch('transportModes') || {};

  useEffect(() => {
    if (user?.uid) {
      setIsLoading(true);
      Promise.all([
          getUserProfile(user.uid),
          getProfileHistory(user.uid)
      ]).then(([profile, history]) => {
          if (profile) {
            reset(profile);
          }
          setProfileHistory(history);
      }).catch(() => toast({ variant: 'destructive', title: 'Error', description: 'Could not load your profile data.' }))
        .finally(() => setIsLoading(false));
    }
  }, [user, reset, toast]);

  const onSubmit = async (data: UserProfile) => {
    if (!user) return;
    setIsSaving(true);
    try {
      const cleanedTransportModes = Object.entries(data.transportModes || {}).reduce((acc, [key, value]) => {
        if (value !== undefined) {
           acc[key as TransportMode] = { km_per_week: Number(value.km_per_week) || 0 };
        }
        return acc;
      }, {} as Partial<Record<TransportMode, TransportDetail>>);
      
      const dataToSave: Omit<UserProfile, 'id' | 'baselineEmissions' | 'updatedAt'> = {
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
      const profileToSave: UserProfile = { ...dataToSave, baselineEmissions };
      
      await setUserProfile(user.uid, profileToSave);

      // Fetch new history after saving
      const newHistory = await getProfileHistory(user.uid);
      setProfileHistory(newHistory);

      reset({ ...profileToSave, updatedAt: new Date().toISOString() }); // update form state with new baseline and timestamp
      toast({
        title: 'Success!',
        description: 'Your profile has been updated.',
      });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'Could not save your profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <ProfileSkeleton />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>
            This information helps personalize your carbon tracking. Your baseline emission is calculated from this data.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
           <div className="space-y-2">
              <Label>Name</Label>
              <Input value={user?.displayName || 'User'} disabled />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ''} disabled />
            </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>Travel Habits</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Label>Which transport modes do you use?</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {transportOptions.map(mode => (
                  <Controller
                      key={mode}
                      name={`transportModes.${mode}`}
                      control={control}
                      render={({ field }) => (
                          <div className="flex items-center gap-2 rounded-md border p-2">
                              <Switch
                                  id={mode}
                                  checked={!!field.value}
                                  onCheckedChange={(checked) => field.onChange(checked ? { km_per_week: 0 } : undefined)}
                              />
                              <Label htmlFor={mode} className="capitalize">{mode}</Label>
                          </div>
                      )}
                  />
              ))}
          </div>
          <div className="grid md:grid-cols-2 gap-4 pt-4">
              {Object.entries(selectedTransportModes).map(([mode, details]) => (
                details && (
                  <div key={mode} className="space-y-2">
                      <Label className="capitalize">Weekly Distance for {mode} (km)</Label>
                      <Controller
                          name={`transportModes.${mode as TransportMode}.km_per_week`}
                          control={control}
                          render={({ field }) => (
                              <Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))} />
                          )}
                      />
                  </div>
                )
              ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Food & Diet</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
           <div className="space-y-2">
              <Label>Primary Diet</Label>
              <Controller name="diet" control={control} render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select diet" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                      <SelectItem value="meat-heavy">Meat-heavy</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
             <div className="space-y-2">
              <Label>Household Size</Label>
              <Controller name="householdSize" control={control} render={({ field }) => (
                  <Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))} />
                )}
              />
            </div>
             <div className="space-y-2">
              <Label>Meals Per Day</Label>
              <Controller name="mealsPerDay" control={control} render={({ field }) => (
                  <Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))} />
                )}
              />
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Home & Shopping</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Monthly Electricity (kWh)</Label>
               <Controller name="monthlyKwh" control={control} render={({ field }) => (
                  <Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))} />
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Monthly Spend on Non-essentials (₹)</Label>
               <Controller name="monthlySpend" control={control} render={({ field }) => (
                  <Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))} />
                )}
              />
            </div>
            <Controller name="usesRenewable" control={control} render={({ field }) => (
              <div className="flex items-center justify-between rounded-lg border p-4">
                  <Label htmlFor="renewable" className="flex flex-col space-y-1"><span>Use renewable energy?</span></Label>
                  <Switch id="renewable" checked={field.value} onCheckedChange={field.onChange} />
              </div>
            )} />
            <Controller name="usesAcHeater" control={control} render={({ field }) => (
              <div className="flex items-center justify-between rounded-lg border p-4">
                  <Label htmlFor="ac" className="flex flex-col space-y-1"><span>Regularly use AC/Heater?</span></Label>
                  <Switch id="ac" checked={field.value} onCheckedChange={field.onChange} />
              </div>
            )} />
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
          <Button type="submit" disabled={isSaving} size="lg">
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="size-5" /> Profile Update History
          </CardTitle>
          <CardDescription>
            Review your previous profile submissions. Each update recalculates your baseline emissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {profileHistory.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {profileHistory.map((p, index) => (
                <AccordionItem value={`item-${index}`} key={p.id || index}>
                  <AccordionTrigger>
                    Profile from {p.updatedAt ? format(new Date(p.updatedAt), 'PPP') : 'Previous update'}
                  </AccordionTrigger>
                  <AccordionContent>
                     <div className="pt-2 grid grid-cols-2 gap-4 text-sm">
                        <div><strong className="font-medium text-muted-foreground block">Diet</strong> {p.diet}</div>
                        <div><strong className="font-medium text-muted-foreground block">Household</strong> {p.householdSize} people</div>
                        <div><strong className="font-medium text-muted-foreground block">Energy</strong> {p.monthlyKwh} kWh/month</div>
                        <div><strong className="font-medium text-muted-foreground block">Shopping Spend</strong> ₹{p.monthlySpend}/month</div>
                        <div><strong className="font-medium text-muted-foreground block">Renewable?</strong> {p.usesRenewable ? 'Yes' : 'No'}</div>
                        <div><strong className="font-medium text-muted-foreground block">AC/Heater?</strong> {p.usesAcHeater ? 'Yes' : 'No'}</div>
                        <div className="col-span-2"><strong className="font-medium text-muted-foreground block">Travel</strong> 
                            {Object.keys(p.transportModes || {}).length > 0 ? (
                                <ul className="list-disc pl-5">
                                {Object.entries(p.transportModes).map(([mode, details]) => (
                                    details && <li key={mode} className="capitalize">{mode}: {details.km_per_week} km/week</li>
                                ))}
                                </ul>
                            ) : (<p>No travel modes logged.</p>)}
                        </div>
                        {p.baselineEmissions && (
                             <div className="col-span-2 mt-2 pt-2 border-t">
                                <strong className="font-medium text-muted-foreground block">Calculated Daily Baseline</strong>
                                <p className="text-lg font-bold">{p.baselineEmissions.daily} kg CO₂e</p>
                             </div>
                        )}
                   </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-muted-foreground text-sm">No update history found.</p>
          )}
        </CardContent>
      </Card>

    </form>
  );
}
