import type { WeeklyEmission, CategoryBreakdown, EmissionGoal, ComparisonData } from '@/types';
import { Globe, Flag } from 'lucide-react';

export function getWeeklyEmissionData(): WeeklyEmission[] {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date().getDay();
  const data: WeeklyEmission[] = [];
  for (let i = 0; i < 7; i++) {
    const dayIndex = (today - 6 + i + 7) % 7;
    data.push({
      day: days[dayIndex],
      emissions: Math.floor(Math.random() * (25 - 5 + 1) + 5),
    });
  }
  return data;
}

export function getCategoryBreakdown(): CategoryBreakdown[] {
  return [
    { name: 'Travel', emissions: 4, fill: 'hsl(var(--chart-1))' },
    { name: 'Food', emissions: 6, fill: 'hsl(var(--chart-2))' },
    { name: 'Energy', emissions: 2.5, fill: 'hsl(var(--chart-3))' },
    { name: 'Shopping', emissions: 1.5, fill: 'hsl(var(--chart-4))' },
  ];
}

export function getTodaysBreakdown() {
    const breakdown = getCategoryBreakdown();
    const total = breakdown.reduce((sum, item) => sum + item.emissions, 0);
    return { total, breakdown };
}

export function getEmissionGoal(): EmissionGoal {
  const { total } = getTodaysBreakdown();
  return {
    current: total,
    goal: 20, // Daily goal
    label: "Today's Emission Goal",
  };
}

export function getComparisonData() {
    return {
        country: {
            label: 'Country',
            percentage: -15,
            icon: Flag,
        },
        world: {
            label: 'World',
            percentage: -24,
            icon: Globe,
        }
    }
}
