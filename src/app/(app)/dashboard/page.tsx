import {
  getWeeklyEmissionData,
  getTodaysBreakdown,
  getEmissionGoal,
  getComparisonData,
  getStreakData
} from '@/lib/data';
import { EmissionGoalProgress } from '@/components/dashboard/emission-goal-progress';
import { WeeklyEmissionsChart } from '@/components/dashboard/weekly-emissions-chart';
import { TodaysEmissionsCard } from '@/components/dashboard/todays-emissions-card';
import { ComparisonCard } from '@/components/dashboard/comparison-card';
import { CategoryBreakdownChart } from '@/components/dashboard/category-breakdown-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StreakCard } from '@/components/dashboard/streak-card';

export default async function DashboardPage() {
  const weeklyData = getWeeklyEmissionData();
  const todaysData = getTodaysBreakdown();
  const goalData = getEmissionGoal();
  const comparisonData = getComparisonData();
  const streakData = getStreakData();

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
