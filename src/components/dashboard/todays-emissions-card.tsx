import type { CategoryBreakdown } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CategoryBreakdownChart } from './category-breakdown-chart';

interface TodaysEmissionsCardProps {
  data: {
    total: number;
    breakdown: CategoryBreakdown[];
  };
}

export function TodaysEmissionsCard({ data }: TodaysEmissionsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>Today's CO₂ Emission</CardDescription>
        <CardTitle className="text-4xl">
          {data.total.toFixed(1)} <span className="text-xl font-medium text-muted-foreground">kg CO₂e</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[200px]">
        <CategoryBreakdownChart data={data.breakdown} />
      </CardContent>
    </Card>
  );
}
