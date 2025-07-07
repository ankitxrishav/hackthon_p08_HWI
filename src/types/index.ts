import type { LucideIcon } from "lucide-react";

export type EmissionCategory = 'Travel' | 'Food' | 'Energy' | 'Shopping';

export interface Activity {
  id: string;
  category: EmissionCategory;
  description: string;
  emissions: number; // in kg CO2e
  date: string; // ISO string
}

export type CalculateEmissionInput = {
    category: EmissionCategory;
    value: number;
    details?: Record<string, any>;
}

export interface WeeklyEmission {
  day: string;
  emissions: number;
}

export interface CategoryBreakdown {
  name: EmissionCategory | string;
  emissions: number;
  fill: string;
}

export interface StatCardData {
  title: string;
  value: string;
  icon: LucideIcon;
  change?: string;
}

export interface EmissionGoal {
  current: number;
  goal: number;
  label: string;
}

export interface ComparisonData {
    label: string;
    percentage: number;
    icon: LucideIcon;
}

export interface StreakData {
    count: number;
    label: string;
    icon: LucideIcon;
}
