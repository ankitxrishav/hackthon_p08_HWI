import type { WeeklyEmission, CategoryBreakdown, EmissionGoal, ComparisonData, StreakData } from '@/types';
import { Globe, Flag, Flame } from 'lucide-react';

export function getWeeklyEmissionData(): WeeklyEmission[] {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
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
    { name: 'Travel', emissions: 8.2, fill: 'hsl(var(--chart-1))' },
    { name: 'Food', emissions: 6.5, fill: 'hsl(var(--chart-2))' },
    { name: 'Energy', emissions: 4.1, fill: 'hsl(var(--chart-3))' },
    { name: 'Shopping', emissions: 2.3, fill: 'hsl(var(--chart-4))' },
  ];
}

export function getTodaysBreakdown() {
    const breakdown = getCategoryBreakdown();
    const total = breakdown.reduce((sum, item) => sum + item.emissions, 0);
    return { total, breakdown };
}

export function getEmissionGoal(): EmissionGoal {
  const goal = 20; // Daily goal
  return {
    current: 12.5,
    goal,
    label: "Today's Goal",
  };
}

export function getComparisonData(): Record<string, ComparisonData> {
    return {
        country: {
            label: 'vs. National Avg.',
            percentage: -15,
            icon: Flag,
        },
        world: {
            label: 'vs. World Avg.',
            percentage: -24,
            icon: Globe,
        }
    }
}

export function getStreakData(): StreakData {
    return {
        count: 3,
        label: "Low-Carbon Streak",
        icon: Flame
    }
}
