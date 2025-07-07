'use client';

import * as React from 'react';
import type { CategoryBreakdown } from '@/types';
import { Pie, PieChart, Cell, Tooltip } from 'recharts';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  Travel: { label: 'Travel', color: 'hsl(var(--chart-1))' },
  Food: { label: 'Food', color: 'hsl(var(--chart-2))' },
  Energy: { label: 'Energy', color: 'hsl(var(--chart-3))' },
  Shopping: { label: 'Shopping', color: 'hsl(var(--chart-4))' },
} satisfies ChartConfig;

interface CategoryBreakdownChartProps {
  data: CategoryBreakdown[];
}

export function CategoryBreakdownChart({ data }: CategoryBreakdownChartProps) {
  const chartData = React.useMemo(
    () =>
      data.map((item) => ({
        ...item,
        fill: `var(--color-${item.name})`,
      })),
    [data]
  );

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
      <PieChart>
        <Tooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="emissions"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          strokeWidth={2}
        >
          {chartData.map((entry) => (
            <Cell
              key={`cell-${entry.name}`}
              fill={entry.fill}
              stroke={'hsl(var(--background))'}
            />
          ))}
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="name" />}
          className="-translate-y-2 [&_.recharts-legend-item-text]:text-muted-foreground"
        />
      </PieChart>
    </ChartContainer>
  );
}
