'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import * as DataService from '@/lib/data';
import type { WeeklyEmission, CategoryBreakdown, EmissionGoal, ComparisonData, StreakData } from '@/types';
import { EmissionGoalProgress } from '@/components/dashboard/emission-goal-progress';
import { WeeklyEmissionsChart } from '@/components/dashboard/weekly-emissions-chart';
import { TodaysEmissionsCard } from '@/components/dashboard/todays-emissions-card';
import { ComparisonCard } from '@/components/dashboard/comparison-card';
import { CategoryBreakdownChart } from '@/components/dashboard/category-breakdown-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StreakCard } from '@/components/dashboard/streak-card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';


const DashboardSkeleton = () => (
  <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div className="lg:col-span-4">
        <Skeleton className="h-[125px] w-full" />
      </div>
      <div className="lg:col-span-2">
        <Skeleton className="h-[350px] w-full" />
      </div>
      <div className="lg:col-span-2">
        <Skeleton className="h-[350px] w-full" />
      </div>
       <div className="lg:col-span-4 grid gap-6 md:grid-cols-3">
          <Skeleton className="h-[280px] w-full" />
          <Skeleton className="h-[280px] w-full" />
          <Skeleton className="h-[280px] w-full" />
      </div>
    </div>
  </div>
);


export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for data from ACTUAL logged activities
  const [weeklyData, setWeeklyData] = useState<WeeklyEmission[]>([]);
  const [goalData, setGoalData] = useState<EmissionGoal | null>(null);
  const [comparisonData, setComparisonData] = useState<Record<string, ComparisonData> | null>(null);
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  
  // State for data from the user's PROFILE (survey)
  const [baselineData, setBaselineData] = useState<{ dailyTotal: number; breakdown: CategoryBreakdown[]; weeklyChartData: WeeklyEmission[], updatedAt: string | null } | null>(null);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          const [
            fetchedWeekly,
            fetchedGoal,
            fetchedComparison,
            fetchedStreak,
            fetchedBaseline
          ] = await Promise.all([
            DataService.getWeeklyEmissionData(user.uid),
            DataService.getEmissionGoal(user.uid),
            DataService.getComparisonData(),
            DataService.getStreakData(user.uid),
            DataService.getBaselineProfileData(user.uid)
          ]);

          setWeeklyData(fetchedWeekly);
          setGoalData(fetchedGoal);
          setComparisonData(fetchedComparison);
          setStreakData(fetchedStreak);
          setBaselineData(fetchedBaseline);
        } catch (err: any) {
          console.error("Failed to fetch dashboard data:", err);
          if (err.code === 'permission-denied' || err.message.includes('permission-denied')) {
            setError("You have a permissions error in your database. Please check your Firestore security rules in the Firebase Console.");
          } else {
            setError("Could not load dashboard data. Please try again later.");
          }
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
        setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        </div>
    );
  }
  
  if (!user || !goalData || !comparisonData || !streakData || !baselineData) {
      return <div className='p-8 text-center'>Could not load dashboard data. Please complete your profile to get started.</div>
  }
  
  // This is based on ACTUAL activities and is used for the goal progress bar
  const weeklyGoalData: EmissionGoal = {
    ...goalData, 
    current: parseFloat(weeklyData.reduce((acc, day) => acc + day.emissions, 0).toFixed(2)), 
    goal: goalData.goal * 7, 
    label: "Weekly Goal" 
  };


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-4">
            <TodaysEmissionsCard data={{ total: baselineData.dailyTotal, breakdown: baselineData.breakdown }} />
        </div>
        <div className="lg:col-span-2">
           <WeeklyEmissionsChart data={baselineData.weeklyChartData} />
        </div>
        <div className="lg:col-span-2">
             <Card className='h-full'>
                <CardHeader>
                    <CardTitle>Daily Baseline Breakdown</CardTitle>
                    <CardDescription>
                        Your estimated daily footprint from your profile.
                        {baselineData.updatedAt && (
                           <span className="block text-xs mt-1">
                                Last updated: {format(new Date(baselineData.updatedAt), 'PPP')}
                           </span>
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent className='h-[300px]'>
                    <CategoryBreakdownChart data={baselineData.breakdown} />
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-4 grid gap-6 md:grid-cols-3">
            <Card className="h-full flex flex-col">
                <CardHeader>
                    <CardTitle>Activity vs. Goal</CardTitle>
                    <CardDescription>Your logged activity against your daily & weekly goals.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 flex-grow">
                    <EmissionGoalProgress data={goalData} />
                    <EmissionGoalProgress data={weeklyGoalData} />
                </CardContent>
            </Card>
            <div className="space-y-6">
                <ComparisonCard data={comparisonData.country} />
                <ComparisonCard data={comparisonData.world} />
            </div>
            <StreakCard data={streakData} className="h-full" />
        </div>
      </div>
    </div>
  );
}
