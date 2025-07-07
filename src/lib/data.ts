import type { DailyEmission, CategoryBreakdown, StatCardData } from '@/types';
import { Leaf, Zap, Footprints, ShoppingCart } from 'lucide-react';

export function getDailyEmissionData(): DailyEmission[] {
  const data: DailyEmission[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      totalEmissions: Math.floor(Math.random() * (25 - 5 + 1) + 5),
    });
  }
  return data;
}

export function getCategoryBreakdown(): CategoryBreakdown[] {
  return [
    { name: 'Travel', emissions: 400, fill: 'var(--chart-1)' },
    { name: 'Food', emissions: 300, fill: 'var(--chart-2)' },
    { name: 'Energy', emissions: 200, fill: 'var(--chart-3)' },
    { name: 'Shopping', emissions: 278, fill: 'var(--chart-4)' },
  ];
}

export function getStatCards(): StatCardData[] {
  return [
    {
      title: 'Total Emissions (Month)',
      value: '1,178 kg CO₂e',
      icon: Leaf,
      change: '+20.1% from last month',
    },
    {
      title: 'Avg. Daily Emissions',
      value: '39.2 kg CO₂e',
      icon: Footprints,
      change: '+12.2% from last month',
    },
    {
      title: 'Top Category',
      value: 'Travel',
      icon: Zap,
      change: '400 kg CO₂e',
    },
    {
      title: 'Lowest Category',
      value: 'Energy',
      icon: ShoppingCart,
      change: '200 kg CO₂e',
    },
  ];
}

export function getMonthlySummaryData() {
  const categoryData = getCategoryBreakdown();
  const totalEmissions = categoryData.reduce((sum, cat) => sum + cat.emissions, 0);

  const monthlyDataString = `Total emissions: ${totalEmissions} kg CO₂e. Breakdown: ${categoryData
    .map((cat) => `${cat.name}: ${cat.emissions} kg`)
    .join(', ')}.`;

  const userActivityString = {
    travel: 'Mix of driving a personal car for daily commute and one short-haul flight.',
    food: 'Omnivore diet, eats out 3-4 times a week, some local produce.',
    shopping: 'Regular online purchases, including electronics and clothing.',
    energyUsage: 'Average electricity consumption for a 3-bedroom house, standard appliances.',
  };
  
  return { monthlyDataString, userActivityString };
}
