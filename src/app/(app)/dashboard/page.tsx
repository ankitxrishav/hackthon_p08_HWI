import {
  getWeeklyEmissionData,
  getTodaysBreakdown,
  getEmissionGoal,
  getComparisonData
} from '@/lib/data';
import { EmissionGoalProgress } from '@/components/dashboard/emission-goal-progress';
import { WeeklyEmissionsChart } from '@/components/dashboard/weekly-emissions-chart';
import { TodaysEmissionsCard } from '@/components/dashboard/todays-emissions-card';
import { ComparisonCard } from '@/components/dashboard/comparison-card';

export default async function DashboardPage() {
  const weeklyData = getWeeklyEmissionData();
  const todaysData = getTodaysBreakdown();
  const goalData = getEmissionGoal();
  const comparisonData = getComparisonData();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <TodaysEmissionsCard data={todaysData} />
          <EmissionGoalProgress data={goalData} />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <WeeklyEmissionsChart data={weeklyData} />
          <div className="grid gap-6 sm:grid-cols-2">
            <ComparisonCard data={comparisonData.country} />
            <ComparisonCard data={comparisonData.world} />
          </div>
        </div>
      </div>
    </div>
  );
}
