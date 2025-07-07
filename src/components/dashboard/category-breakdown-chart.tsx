'use client';

import * as React from 'react';
import type { CategoryBreakdown } from '@/types';
import { Pie, PieChart, ResponsiveContainer, Cell, Legend } from 'recharts';
import {
  ChartTooltipContent,
} from '@/components/ui/chart';

interface CategoryBreakdownChartProps {
  data: CategoryBreakdown[];
}

export function CategoryBreakdownChart({ data }: CategoryBreakdownChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
         <ChartTooltipContent />
        <Pie
          data={data}
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
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} />
          ))}
        </Pie>
        <Legend
          iconSize={10}
          wrapperStyle={{
            paddingTop: '20px',
            fontSize: '0.875rem'
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
