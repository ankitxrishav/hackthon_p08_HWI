import type { LucideIcon } from "lucide-react";

export type EmissionCategory = 'Travel' | 'Food' | 'Energy' | 'Shopping';

export interface Activity {
  id: string;
  category: EmissionCategory;
  description: string;
  emissions: number; // in kg CO2e
  date: string; // ISO string
}

export interface DailyEmission {
  date: string;
  totalEmissions: number;
}

export interface CategoryBreakdown {
  name: EmissionCategory;
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
