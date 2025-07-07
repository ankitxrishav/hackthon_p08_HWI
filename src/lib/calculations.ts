import type { UserProfile } from '@/types';

// Emission factors (in kg CO₂e) based on user-provided logic
const EMISSION_FACTORS = {
  transport: {
    car: 0.192,     // per km
    metro: 0.045,   // per km
    bus: 0.10,      // per km
    flights: 0.25,  // per km
    bike: 0,
    walk: 0,
  },
  diet: {
    'meat-heavy': 3.5, // per day
    mixed: 2.5,        // per day
    vegetarian: 1.5,   // per day
  },
  energy: {
    kwh: 0.82, // per kWh (India average)
  },
  shopping: {
    per_1000_rupees: 0.4, // kg CO2e per 1000 INR
  }
};

/**
 * Calculates the baseline weekly and daily carbon emissions based on user profile data.
 * @param profile - The user's profile data from onboarding.
 * @returns An object containing the daily and weekly baseline emissions in kg CO₂e.
 */
export function calculateBaselineEmissions(profile: UserProfile): { daily: number; weekly: number } {
  let weeklyEmissions = 0;

  // 1. Transport Emissions (Weekly)
  if (profile.transportModes) {
    for (const [mode, details] of Object.entries(profile.transportModes)) {
      if (details && EMISSION_FACTORS.transport[mode as keyof typeof EMISSION_FACTORS.transport] !== undefined) {
        const factor = EMISSION_FACTORS.transport[mode as keyof typeof EMISSION_FACTORS.transport];
        weeklyEmissions += details.km_per_week * factor;
      }
    }
  }

  // 2. Diet Emissions (Weekly)
  const dailyDietEmissions = EMISSION_FACTORS.diet[profile.diet] || EMISSION_FACTORS.diet.mixed;
  weeklyEmissions += dailyDietEmissions * 7;
  
  // 3. Energy Emissions (Weekly)
  const monthlyKwh = profile.monthlyKwh || 0;
  let monthlyEnergyEmissions = monthlyKwh * EMISSION_FACTORS.energy.kwh;
  if (profile.usesRenewable) {
      monthlyEnergyEmissions *= 0.5; // 50% reduction for renewables
  }
  if (profile.usesAcHeater) {
      monthlyEnergyEmissions *= 1.2; // 20% increase for AC/heater
  }
  const weeklyEnergyEmissions = monthlyEnergyEmissions / 4.3; // Avg weeks in a month
  

  // 4. Shopping Emissions (Weekly)
  const monthlySpend = profile.monthlySpend || 0;
  const monthlyShoppingEmissions = (monthlySpend / 1000) * EMISSION_FACTORS.shopping.per_1000_rupees;
  const weeklyShoppingEmissions = monthlyShoppingEmissions / 4.3;
  
  // 5. Household Size Adjustment for shared resources (Energy)
  const householdSize = profile.householdSize > 0 ? profile.householdSize : 1;
  const perCapitaWeeklyEnergyEmissions = weeklyEnergyEmissions / householdSize;

  // Summing up personal emissions with per-capita shared emissions
  weeklyEmissions += perCapitaWeeklyEnergyEmissions + weeklyShoppingEmissions;


  const finalWeekly = parseFloat(weeklyEmissions.toFixed(2));
  const finalDaily = parseFloat((weeklyEmissions / 7).toFixed(2));

  return {
    weekly: finalWeekly,
    daily: finalDaily,
  };
}
