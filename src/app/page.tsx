import {
  getDailyEmissionData,
  getMonthlySummaryData,
  getCategoryBreakdown,
  getStatCards,
  getEmissionGoal,
} from '@/lib/data';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/stat-card';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { CategoryBreakdownChart } from '@/components/dashboard/category-breakdown-chart';
import { AiSummary } from '@/components/dashboard/ai-summary';
import { AiTips } from '@/components/dashboard/ai-tips';
import { EmissionGoalProgress } from '@/components/dashboard/emission-goal-progress';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default async function DashboardPage() {
  const statCardsData = getStatCards();
  const overviewData = getDailyEmissionData();
  const categoryData = getCategoryBreakdown();
  const { monthlyDataString, userActivityString } = getMonthlySummaryData();
  const goalData = getEmissionGoal();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back!
        </h1>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/add-activity">
              <PlusCircle className="mr-2 h-4 w-4" />
              Log Activity
            </Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {statCardsData.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            change={card.change}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <EmissionGoalProgress data={goalData} />
          <Card>
            <CardHeader>
              <CardTitle>Daily Emissions Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2 h-[250px]">
              <OverviewChart data={overviewData} />
            </CardContent>
          </Card>
        </div>
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Emissions by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-[380px]">
            <CategoryBreakdownChart data={categoryData} />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Suspense fallback={<Skeleton className="h-64" />}>
          <AiSummary monthlyDataString={monthlyDataString} />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-64" />}>
          <AiTips userActivityString={userActivityString} />
        </Suspense>
      </div>
    </div>
  );
}
