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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StreakCard } from '@/components/dashboard/streak-card';
import { Skeleton } from '@/components/ui/skeleton';

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
       <div className="lg:col-span-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className='lg:col-span-2'>
               <Skeleton className="h-[150px] w-full" />
            </div>
            <Skeleton className="h-[150px] w-full" />
            <Skeleton className="h-[150px] w-full" />
        </div>
    </div>
  </div>
);


export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  const [weeklyData, setWeeklyData] = useState<WeeklyEmission[]>([]);
  const [todaysData, setTodaysData] = useState<{ total: number; breakdown: CategoryBreakdown[] }>({ total: 0, breakdown: [] });
  const [goalData, setGoalData] = useState<EmissionGoal | null>(null);
  const [comparisonData, setComparisonData] = useState<Record<string, ComparisonData> | null>(null);
  const [streakData, setStreakData] = useState<StreakData | null>(null);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [
            fetchedWeekly,
            fetchedTodays,
            fetchedGoal,
            fetchedComparison,
            fetchedStreak
          ] = await Promise.all([
            DataService.getWeeklyEmissionData(user.uid),
            DataService.getTodaysBreakdown(user.uid),
            DataService.getEmissionGoal(user.uid),
            DataService.getComparisonData(),
            DataService.getStreakData(user.uid),
          ]);
          setWeeklyData(fetchedWeekly);
          setTodaysData(fetchedTodays);
          setGoalData(fetchedGoal);
          setComparisonData(fetchedComparison);
          setStreakData(fetchedStreak);
        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
          // Handle error state in UI if necessary
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
        // Handle case where user is not logged in, though layout should prevent this.
        setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <DashboardSkeleton />;
  }
  
  if (!user || !goalData || !comparisonData || !streakData) {
      return <div>Could not load dashboard data. Please try again later.</div>
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-4">
            <TodaysEmissionsCard data={todaysData} />
        </div>
        <div className="lg:col-span-2">
           <WeeklyEmissionsChart data={weeklyData} />
        </div>
        <div className="lg:col-span-2">
             <Card className='h-full'>
                <CardHeader>
                    <CardTitle>Today's Breakdown</CardTitle>
                </CardHeader>
                <CardContent className='h-[300px]'>
                    <CategoryBreakdownChart data={todaysData.breakdown} />
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className='lg:col-span-2'>
                <EmissionGoalProgress data={goalData} />
            </div>
            <ComparisonCard data={comparisonData.country} />
            <StreakCard data={streakData} />
        </div>
      </div>
    </div>
  );
}
