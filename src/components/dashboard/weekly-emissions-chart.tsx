'use client';

import type { WeeklyEmission } from '@/types';
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

const chartConfig = {
  emissions: {
    label: 'Emissions',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

interface WeeklyEmissionsChartProps {
  data: WeeklyEmission[];
}

export function WeeklyEmissionsChart({ data }: WeeklyEmissionsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Chart</CardTitle>
        <CardDescription>Your carbon emissions over the last 7 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value} kg`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Line
              dataKey="emissions"
              type="monotone"
              stroke="var(--color-emissions)"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
