'use client';

import type { CategoryBreakdown } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface TodaysEmissionsCardProps {
  data: {
    total: number;
    breakdown: CategoryBreakdown[];
  };
}

export function TodaysEmissionsCard({ data }: TodaysEmissionsCardProps) {

  const getEmissionColor = (total: number) => {
    if (total < 10) return 'text-green-600';
    if (total < 20) return 'text-yellow-500';
    return 'text-red-600';
  }

  return (
    <Card className='text-center'>
      <CardHeader>
        <CardDescription>Today's Total Emissions</CardDescription>
        <CardTitle className={`text-6xl font-extrabold tracking-tighter ${getEmissionColor(data.total)}`}>
          {data.total.toFixed(1)}
          <span className="text-3xl font-medium text-muted-foreground ml-2">kg CO₂e</span>
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
