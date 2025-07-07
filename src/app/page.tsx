import {
  getDailyEmissionData,
  getMonthlySummaryData,
  getCategoryBreakdown,
  getStatCards,
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
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default async function DashboardPage() {
  const statCardsData = getStatCards();
  const overviewData = getDailyEmissionData();
  const categoryData = getCategoryBreakdown();
  const { monthlyDataString, userActivityString } = getMonthlySummaryData();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart data={overviewData} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Emissions by Category</CardTitle>
          </CardHeader>
          <CardContent>
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
