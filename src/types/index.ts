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

// Detailed User Profile for Onboarding and Personalization
export type DietType = 'vegetarian' | 'mixed' | 'meat-heavy';
export type TransportMode = 'car' | 'bike' | 'metro' | 'bus' | 'walk' | 'flights';

export interface TransportDetail {
  km_per_week: number;
}

export interface UserProfile {
  id?: string;
  updatedAt?: string;
  
  // Onboarding data
  transportModes: Partial<Record<TransportMode, TransportDetail>>;
  diet: DietType;
  monthlyKwh: number;
  usesRenewable: boolean;
  usesAcHeater: boolean;
  monthlySpend: number;
  householdSize: number;
  mealsPerDay: number;
  
  // Optional detailed fields from onboarding
  eatOutFrequency?: 'rarely' | 'monthly' | 'weekly';

  // Calculated baseline from onboarding
  baselineEmissions?: {
    daily: number;
    weekly: number;
  };
}
