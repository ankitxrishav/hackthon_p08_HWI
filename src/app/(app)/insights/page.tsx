import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Trophy, PieChart, TrendingUp, Target } from 'lucide-react';
import { WeeklyEmissionsChart } from '@/components/dashboard/weekly-emissions-chart';
import { CategoryBreakdownChart } from '@/components/dashboard/category-breakdown-chart';
import {
  getWeeklyEmissionData,
  getCategoryBreakdown,
  getEmissionGoal,
  getComparisonData
} from '@/lib/data';
import { EmissionGoalProgress } from '@/components/dashboard/emission-goal-progress';
import { ComparisonCard } from '@/components/dashboard/comparison-card';

const achievements = [
    { icon: Trophy, title: "Eco-Beginner", description: "Logged your first activity.", color: "text-amber-500" },
    { icon: Trophy, title: "Low Meat Week", description: "Completed a week with low meat consumption.", color: "text-amber-500" },
    { icon: Trophy, title: "Commuter Champ", description: "Walked 5 days in a row.", color: "text-slate-400" },
    { icon: Trophy, title: "Energy Saver", description: "Reduced energy use by 10%.", color: "text-slate-400" },
]

export default function InsightsPage() {
    const weeklyData = getWeeklyEmissionData();
    const categoryData = getCategoryBreakdown();
    const dailyGoalData = getEmissionGoal();
    const weeklyGoalData = {...dailyGoalData, current: 85, goal: 140, label: "Weekly Goal" };
    const comparisonData = getComparisonData();

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'><PieChart className='text-primary' /> Emission Sources</CardTitle>
            <CardDescription>Breakdown of your emissions by category.</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px]">
            <CategoryBreakdownChart data={categoryData} />
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'><TrendingUp className='text-primary' /> Weekly Trend</CardTitle>
                 <CardDescription>Your carbon emissions over the last 7 days.</CardDescription>
            </CardHeader>
            <CardContent>
                 <WeeklyEmissionsChart data={weeklyData} />
            </CardContent>
        </Card>
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
