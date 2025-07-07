'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import * as DataService from '@/lib/data';
import type { WeeklyEmission, CategoryBreakdown, EmissionGoal, ComparisonData } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, PieChart, TrendingUp, Target, AlertCircle } from 'lucide-react';
import { WeeklyEmissionsChart } from '@/components/dashboard/weekly-emissions-chart';
import { CategoryBreakdownChart } from '@/components/dashboard/category-breakdown-chart';
import { EmissionGoalProgress } from '@/components/dashboard/emission-goal-progress';
import { ComparisonCard } from '@/components/dashboard/comparison-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const achievements = [
    { icon: Trophy, title: "Eco-Beginner", description: "Logged your first activity.", color: "text-amber-500" },
    { icon: Trophy, title: "Low Meat Week", description: "Completed a week with low meat consumption.", color: "text-amber-500" },
    { icon: Trophy, title: "Commuter Champ", description: "Walked 5 days in a row.", color: "text-slate-400" },
    { icon: Trophy, title: "Energy Saver", description: "Reduced energy use by 10%.", color: "text-slate-400" },
];

const InsightsSkeleton = () => (
  <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
    <div className="grid gap-6 md:grid-cols-2">
      <Skeleton className="h-[350px] w-full" />
      <Skeleton className="h-[350px] w-full" />
    </div>
    <Skeleton className="h-[200px] w-full" />
    <div className="grid gap-6 md:grid-cols-2">
      <Skeleton className="h-[125px] w-full" />
      <Skeleton className="h-[125px] w-full" />
    </div>
    <Skeleton className="h-[200px] w-full" />
  </div>
);

export default function InsightsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [weeklyData, setWeeklyData] = useState<WeeklyEmission[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryBreakdown[]>([]);
  const [dailyGoalData, setDailyGoalData] = useState<EmissionGoal | null>(null);
  const [comparisonData, setComparisonData] = useState<Record<string, ComparisonData> | null>(null);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          const [
            fetchedWeekly,
            fetchedTodays,
            fetchedGoal,
            fetchedComparison
          ] = await Promise.all([
            DataService.getWeeklyEmissionData(user.uid),
            DataService.getTodaysBreakdown(user.uid),
            DataService.getEmissionGoal(user.uid),
            DataService.getComparisonData(),
          ]);
          setWeeklyData(fetchedWeekly);
          setCategoryData(fetchedTodays.breakdown);
          setDailyGoalData(fetchedGoal);
          setComparisonData(fetchedComparison);
        } catch (err: any) {
          console.error("Failed to fetch insights data:", err);
           if (err.code === 'permission-denied') {
            setError("You have a permissions error in your database. Please check your Firestore security rules in the Firebase Console.");
          } else {
            setError("Could not load insights data. Please try again later.");
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
    return <InsightsSkeleton />;
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

  if (!user || !dailyGoalData || !comparisonData) {
      return <div className="p-8 text-center">Could not load insights data. Please try again later.</div>
  }

  const weeklyGoalData = {
    ...dailyGoalData, 
    current: parseFloat(weeklyData.reduce((acc, day) => acc + day.emissions, 0).toFixed(2)), 
    goal: dailyGoalData.goal * 7, 
    label: "Weekly Goal" 
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'><PieChart className='text-primary' /> Todays Emission Sources</CardTitle>
            <CardDescription>Breakdown of your emissions by category for today.</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px]">
            <CategoryBreakdownChart data={categoryData} />
          </CardContent>
        </Card>
        <WeeklyEmissionsChart data={weeklyData} />
      </div>

       <Card>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'><Target className='text-primary' /> Goal Progress</CardTitle>
                <CardDescription>Track your progress against your emission goals.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
                 <EmissionGoalProgress data={dailyGoalData} />
                 <EmissionGoalProgress data={weeklyGoalData} />
            </CardContent>
        </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <ComparisonCard data={comparisonData.country} />
        <ComparisonCard data={comparisonData.world} />
      </div>

       <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'><Trophy className='text-primary' /> Achievements</CardTitle>
            <CardDescription>Milestones you've unlocked on your eco-journey.</CardDescription>
          </CardHeader>
          <CardContent className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            {achievements.map((ach, index) => (
                <div key={index} className='flex items-center gap-4 rounded-lg border p-4'>
                    <ach.icon className={`size-8 ${ach.color}`} />
                    <div>
                        <p className='font-semibold'>{ach.title}</p>
                        <p className='text-xs text-muted-foreground'>{ach.description}</p>
                    </div>
                </div>
            ))}
          </CardContent>
        </Card>
    </div>
  );
}
