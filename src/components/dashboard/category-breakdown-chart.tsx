'use client';

import * as React from 'react';
import type { CategoryBreakdown } from '@/types';
import { Pie, PieChart, Cell } from 'recharts';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
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
    <ChartContainer config={chartConfig} className="mx-auto aspect-square h-full">
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" nameKey="name" />}
        />
        <Pie
          data={chartData}
          dataKey="emissions"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          labelLine={false}
          label={({
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            percent,
          }) => {
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
            const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

            return (
              <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                className="text-xs font-medium"
              >
                {`${(percent * 100).toFixed(0)}%`}
              </text>
            );
          }}
        >
          {chartData.map((entry) => (
            <Cell
              key={`cell-${entry.name}`}
              fill={entry.fill}
              stroke={entry.fill}
            />
          ))}
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="name" />}
          className="[&_.recharts-legend-item-text]:text-muted-foreground"
        />
      </PieChart>
    </ChartContainer>
  );
}
