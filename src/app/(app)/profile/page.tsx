'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { getUserProfile, setUserProfile } from '@/lib/firestore';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/types';
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
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const profileSchema = z.object({
  travelMode: z.string(),
  diet: z.string(),
});

const ProfileSkeleton = () => (
  <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <Skeleton className="h-10 w-24" />
      </CardContent>
    </Card>
  </div>
);

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { control, handleSubmit, reset, watch } = useForm<UserProfile>({
    defaultValues: {
      travelMode: '',
      weeklyDistance: 0,
      diet: '',
      monthlyKwh: 0,
      usesRenewable: false,
      shoppingFrequency: '',
      householdSize: 1,
    }
  });

  useEffect(() => {
    if (user?.uid) {
      setIsLoading(true);
      getUserProfile(user.uid)
        .then((profile) => {
          if (profile) {
            reset(profile);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [user, reset]);

  const onSubmit = async (data: UserProfile) => {
    if (!user) return;
    setIsSaving(true);
    try {
      await setUserProfile(user.uid, data);
      toast({
        title: 'Success!',
        description: 'Your profile has been updated.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not save your profile.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>View and edit your personal lifestyle data and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Your Name</Label>
              <Input value={user?.displayName || 'User'} disabled />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ''} disabled />
            </div>
             <div className="space-y-2">
              <Label>Primary Diet</Label>
              <Controller
                name="diet"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select diet type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="veg">Vegetarian</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                        <SelectItem value="non-veg">Non-Veg</SelectItem>
                        <SelectItem value="high-meat">High-Meat</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
             <div className="space-y-2">
              <Label>Primary Travel Mode</Label>
               <Controller
                name="travelMode"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select travel type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="bike">Bike</SelectItem>
                        <SelectItem value="public">Public Transport</SelectItem>
                        <SelectItem value="walk">Walk</SelectItem>
                        <SelectItem value="flights">Flights</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <Button type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Lifestyle Details</CardTitle>
          <CardDescription>More details about your lifestyle for better accuracy.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Weekly Distance (km)</Label>
               <Controller
                  name="weeklyDistance"
                  control={control}
                  render={({ field }) => ( <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} /> )}
              />
            </div>
             <div className="space-y-2">
              <Label>Monthly Electricity (kWh)</Label>
               <Controller
                  name="monthlyKwh"
                  control={control}
                  render={({ field }) => ( <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} /> )}
              />
            </div>
             <div className="space-y-2">
              <Label>Shopping Frequency</Label>
               <Controller
                  name="shoppingFrequency"
                  control={control}
                  render={({ field }) => (
                     <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger><SelectValue placeholder="Select frequency" /></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="rarely">Rarely</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
              />
            </div>
             <div className="space-y-2">
              <Label>Household Size</Label>
              <Controller
                  name="householdSize"
                  control={control}
                  render={({ field }) => ( <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 1)} /> )}
              />
            </div>
          </div>
           <Separator />
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
          <Button type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your application data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex justify-between items-center rounded-lg border p-4">
             <h3 className="text-base font-medium">Export Report</h3>
            <Button variant="outline">Download PDF/CSV</Button>
          </div>
          <div className="flex justify-between items-center rounded-lg border border-destructive/50 p-4">
            <div>
             <h3 className="text-base font-medium text-destructive">Delete Account</h3>
             <p className="text-sm text-muted-foreground">Permanently delete your account and all data.</p>
             </div>
            <Button variant="destructive">Delete</Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
