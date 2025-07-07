import type { UserProfile, CategoryBreakdown } from '@/types';

// Emission factors (in kg CO₂e) based on standard datasets like IPCC & DEFRA.
// Aligned with the app's carbon-engine for consistency.
const EMISSION_FACTORS = {
  transport: {
    car: 0.192,       // per km
    metro: 0.045,     // per km
    bus: 0.10,        // per km
    flights: 0.145,   // per km (economy)
    bike: 0,
    walk: 0,
  },
  diet: { // Factors are per meal
    'meat-heavy': 3.5, // kg CO₂e/meal
    mixed: 2.5,        // kg CO₂e/meal
    vegetarian: 1.2,   // kg CO₂e/meal
  },
  energy: {
    kwh: 0.82, // per kWh (India average)
  },
  shopping: {
    per_rupee: 0.0004, // kg CO2e per rupee (equivalent to 0.4kg per 1000 INR)
  }
};

/**
 * Calculates the baseline weekly and daily carbon emissions based on user profile data.
 * This uses the survey data to create a personalized emission goal for the dashboard.
 * @param profile - The user's profile data from onboarding or profile page.
 * @returns An object containing the daily and weekly baseline emissions in kg CO₂e.
 */
export function calculateBaselineEmissions(profile: UserProfile): { daily: number; weekly: number } {
  // Personal emissions are calculated directly
  let personalWeeklyEmissions = 0;

  // 1. Transport Emissions (Weekly) - This is a personal activity
  if (profile.transportModes) {
    for (const [mode, details] of Object.entries(profile.transportModes)) {
      if (details && EMISSION_FACTORS.transport[mode as keyof typeof EMISSION_FACTORS.transport] !== undefined) {
        const factor = EMISSION_FACTORS.transport[mode as keyof typeof EMISSION_FACTORS.transport];
        personalWeeklyEmissions += (details.km_per_week || 0) * factor;
      }
    }
  }

  // 2. Diet Emissions (Weekly) - This is a personal activity
  const mealsPerDay = profile.mealsPerDay > 0 ? profile.mealsPerDay : 1;
  const dietFactorPerMeal = EMISSION_FACTORS.diet[profile.diet] || EMISSION_FACTORS.diet.mixed;
  const dailyDietEmissions = dietFactorPerMeal * mealsPerDay;
  personalWeeklyEmissions += dailyDietEmissions * 7;
  
  // Shared emissions are calculated for the household and then divided
  let sharedWeeklyEmissions = 0;
  
  // 3. Energy Emissions (Weekly) - This is a shared household resource
  const monthlyKwh = profile.monthlyKwh || 0;
  let monthlyEnergyEmissions = monthlyKwh * EMISSION_FACTORS.energy.kwh;
  if (profile.usesRenewable) {
      monthlyEnergyEmissions *= 0.5; // 50% reduction for renewables
  }
  if (profile.usesAcHeater) {
      monthlyEnergyEmissions *= 1.2; // 20% increase for AC/heater
  }
  const weeklyEnergyEmissions = monthlyEnergyEmissions / 4.3; // Avg weeks in a month
  sharedWeeklyEmissions += weeklyEnergyEmissions;
  
  // 4. Shopping Emissions (Weekly) - This is treated as a shared household resource
  const monthlySpend = profile.monthlySpend || 0;
  const monthlyShoppingEmissions = monthlySpend * EMISSION_FACTORS.shopping.per_rupee;
  const weeklyShoppingEmissions = monthlyShoppingEmissions / 4.3;
  sharedWeeklyEmissions += weeklyShoppingEmissions;

  // 5. Household Size Adjustment
  // Divide shared emissions by the number of people to get the per-capita share.
  const householdSize = profile.householdSize > 0 ? profile.householdSize : 1;
  const perCapitaWeeklySharedEmissions = sharedWeeklyEmissions / householdSize;

  // 6. Total Emissions
  const totalWeeklyEmissions = personalWeeklyEmissions + perCapitaWeeklySharedEmissions;

  const finalWeekly = parseFloat(totalWeeklyEmissions.toFixed(2));
  const finalDaily = parseFloat((totalWeeklyEmissions / 7).toFixed(2));

  return {
    weekly: finalWeekly,
    daily: finalDaily,
  };
}


/**
 * Calculates a daily breakdown of baseline emissions by category from a user profile.
 * @param profile - The user's profile data.
 * @returns An object with the total daily emission and an array for the category breakdown.
 */
export function calculateBaselineBreakdown(profile: UserProfile): { total: number; breakdown: CategoryBreakdown[] } {
  // Personal emissions (weekly)
  let transportEmissions = 0;
  if (profile.transportModes) {
    for (const [mode, details] of Object.entries(profile.transportModes)) {
      if (details && EMISSION_FACTORS.transport[mode as keyof typeof EMISSION_FACTORS.transport] !== undefined) {
        const factor = EMISSION_FACTORS.transport[mode as keyof typeof EMISSION_FACTORS.transport];
        transportEmissions += (details.km_per_week || 0) * factor;
      }
    }
  }

  const mealsPerDay = profile.mealsPerDay > 0 ? profile.mealsPerDay : 1;
  const dietFactorPerMeal = EMISSION_FACTORS.diet[profile.diet] || EMISSION_FACTORS.diet.mixed;
  const foodEmissions = (dietFactorPerMeal * mealsPerDay) * 7;

  // Shared emissions (weekly)
  const monthlyKwh = profile.monthlyKwh || 0;
  let monthlyEnergyEmissions = monthlyKwh * EMISSION_FACTORS.energy.kwh;
  if (profile.usesRenewable) {
      monthlyEnergyEmissions *= 0.5;
  }
  if (profile.usesAcHeater) {
      monthlyEnergyEmissions *= 1.2;
  }
  const energyEmissions = monthlyEnergyEmissions / 4.3;
  
  const monthlySpend = profile.monthlySpend || 0;
  const shoppingEmissions = (monthlySpend * EMISSION_FACTORS.shopping.per_rupee) / 4.3;

  // Per-capita weekly emissions for each category
  const householdSize = profile.householdSize > 0 ? profile.householdSize : 1;
  const weeklyBreakdown = {
    Travel: transportEmissions,
    Food: foodEmissions,
    Energy: energyEmissions / householdSize,
    Shopping: shoppingEmissions / householdSize,
  };

  // Convert to daily breakdown
  const dailyBreakdown = {
      Travel: weeklyBreakdown.Travel / 7,
      Food: weeklyBreakdown.Food / 7,
      Energy: weeklyBreakdown.Energy / 7,
      Shopping: weeklyBreakdown.Shopping / 7,
  };
  
  const totalDailyEmissions = Object.values(dailyBreakdown).reduce((sum, val) => sum + val, 0);

  const chartData: CategoryBreakdown[] = [
    { name: 'Travel', emissions: parseFloat(dailyBreakdown.Travel.toFixed(2)), fill: 'hsl(var(--chart-1))' },
    { name: 'Food', emissions: parseFloat(dailyBreakdown.Food.toFixed(2)), fill: 'hsl(var(--chart-2))' },
    { name: 'Energy', emissions: parseFloat(dailyBreakdown.Energy.toFixed(2)), fill: 'hsl(var(--chart-3))' },
    { name: 'Shopping', emissions: parseFloat(dailyBreakdown.Shopping.toFixed(2)), fill: 'hsl(var(--chart-4))' },
  ];

  return {
    total: parseFloat(totalDailyEmissions.toFixed(2)),
    breakdown: chartData,
  };
}
