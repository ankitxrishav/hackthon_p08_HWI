'use client';

import type { DailyEmission } from '@/types';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  totalEmissions: {
    label: 'Emissions',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

interface OverviewChartProps {
  data: DailyEmission[];
}

export function OverviewChart({ data }: OverviewChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <BarChart accessibilityLayer data={data}>
        <XAxis
          dataKey="date"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value} kg`}
        />
        <ChartTooltip
          cursor={{ fill: 'hsl(var(--muted))' }}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar
          dataKey="totalEmissions"
          fill="var(--color-totalEmissions)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}
