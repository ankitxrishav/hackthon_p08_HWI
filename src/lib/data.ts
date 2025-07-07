import type { WeeklyEmission, CategoryBreakdown, EmissionGoal, ComparisonData, StreakData, Activity } from '@/types';
import { Globe, Flag, Flame } from 'lucide-react';
import { getActivitiesForDateRange, getTodaysActivities } from './firestore';
import { subDays, format, startOfDay, endOfDay, isWithinInterval } from 'date-fns';

export async function getWeeklyEmissionData(userId: string): Promise<WeeklyEmission[]> {
  const today = new Date();
  const sevenDaysAgo = subDays(today, 6);
  
  const activities = await getActivitiesForDateRange(userId, sevenDaysAgo, today);

  const days = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(today, 6 - i);
    return {
      day: format(date, 'E'), // 'Mon', 'Tue', etc.
      date,
      emissions: 0,
    };
  });

  activities.forEach(activity => {
    const activityDate = new Date(activity.date);
    const dayData = days.find(d => 
        isWithinInterval(activityDate, { start: startOfDay(d.date), end: endOfDay(d.date) })
    );
    if (dayData) {
      dayData.emissions += activity.emissions;
    }
  });

  return days.map(({ day, emissions }) => ({ day, emissions: parseFloat(emissions.toFixed(2)) }));
}

export async function getTodaysBreakdown(userId: string): Promise<{ total: number; breakdown: CategoryBreakdown[] }> {
    const activities = await getTodaysActivities(userId);
    
    const breakdown: { [key: string]: number } = {
        Travel: 0,
        Food: 0,
        Energy: 0,
        Shopping: 0,
    };

    activities.forEach(activity => {
        if (breakdown[activity.category] !== undefined) {
            breakdown[activity.category] += activity.emissions;
        }
    });

    const total = activities.reduce((sum, item) => sum + item.emissions, 0);

    const chartData: CategoryBreakdown[] = [
        { name: 'Travel', emissions: parseFloat(breakdown.Travel.toFixed(2)), fill: 'hsl(var(--chart-1))' },
        { name: 'Food', emissions: parseFloat(breakdown.Food.toFixed(2)), fill: 'hsl(var(--chart-2))' },
        { name: 'Energy', emissions: parseFloat(breakdown.Energy.toFixed(2)), fill: 'hsl(var(--chart-3))' },
        { name: 'Shopping', emissions: parseFloat(breakdown.Shopping.toFixed(2)), fill: 'hsl(var(--chart-4))' },
    ];
    
    return { total: parseFloat(total.toFixed(2)), breakdown: chartData };
}

export async function getEmissionGoal(userId: string): Promise<EmissionGoal> {
  // In a real app, this goal would be user-configurable and stored in Firestore
  const goal = 20; // Static daily goal for now
  const { total } = await getTodaysBreakdown(userId);
  return {
    current: total,
    goal,
    label: "Today's Goal",
  };
}

// This can remain static or be fetched from a remote config
export function getComparisonData(): Record<string, ComparisonData> {
    return {
        country: {
            label: 'vs. National Avg.',
            percentage: -15, // This would be calculated based on real data
            icon: Flag,
        },
        world: {
            label: 'vs. World Avg.',
            percentage: -24, // This would be calculated based on real data
            icon: Globe,
        }
    }
}

export async function getStreakData(userId: string): Promise<StreakData> {
     // This is a simplified streak calculation. A real one would be more complex.
    let streak = 0;
    const dailyGoal = 20; // kg CO2e

    for (let i = 0; i < 30; i++) { // Check last 30 days
        const date = subDays(new Date(), i);
        const activities = await getActivitiesForDateRange(userId, startOfDay(date), endOfDay(date));
        const totalEmissions = activities.reduce((sum, a) => sum + a.emissions, 0);
        if (totalEmissions > 0 && totalEmissions <= dailyGoal) {
            streak++;
        } else if (i > 0) {
            // Break streak if a day was missed (and it's not today) or over the limit
             if (totalEmissions > dailyGoal) break;
        }
    }
    
    return {
        count: streak,
        label: "Low-Carbon Streak",
        icon: Flame
    }
}
