import type { UserProfile } from '@/types';

// Emission factors (in kg CO₂e)
const EMISSION_FACTORS = {
  transport: {
    car: 0.192,     // per km
    metro: 0.04,    // per km
    bus: 0.10,      // per km
    flights: 0.25,  // per km
    bike: 0,
    walk: 0,
  },
  diet: {
    'meat-heavy': 3.3, // per day
    mixed: 2.5,        // per day
    vegetarian: 1.2,   // per day
  },
  energy: {
    kwh: 0.82, // per kWh (India average)
  },
  shopping: {
    weekly: 40 / 4.3, // kg CO2e per week
    monthly: 40 / 4.3,
    rarely: 10 / 4.3,
  }
};

/**
 * Calculates the baseline weekly and daily carbon emissions based on user profile data.
 * @param profile - The user's profile data from onboarding.
 * @returns An object containing the daily and weekly baseline emissions in kg CO₂e.
 */
export function calculateBaselineEmissions(profile: UserProfile): { daily: number; weekly: number } {
  let weeklyEmissions = 0;

  // 1. Transport Emissions
  if (profile.transportModes) {
    for (const [mode, details] of Object.entries(profile.transportModes)) {
      if (details && EMISSION_FACTORS.transport[mode as keyof typeof EMISSION_FACTORS.transport] !== undefined) {
        const factor = EMISSION_FACTORS.transport[mode as keyof typeof EMISSION_FACTORS.transport];
        weeklyEmissions += details.km_per_week * factor;
      }
    }
  }

  // 2. Diet Emissions
  const dailyDietEmissions = EMISSION_FACTORS.diet[profile.diet] || EMISSION_FACTORS.diet.mixed;
  weeklyEmissions += dailyDietEmissions * 7;
  
  // 3. Energy Emissions
  const monthlyKwh = profile.monthlyKwh || 0;
  let energyEmissions = monthlyKwh * EMISSION_FACTORS.energy.kwh;
  if(profile.usesRenewable) {
      energyEmissions *= 0.5; // Assume 50% reduction for renewables for simplicity
  }
  if(profile.usesAcHeater) {
      energyEmissions *= 1.2; // Assume 20% increase for AC/heater
  }
  const weeklyEnergyEmissions = energyEmissions / 4.3; // Avg weeks in a month
  weeklyEmissions += weeklyEnergyEmissions;

  // 4. Shopping Emissions
  const shoppingFactor = EMISSION_FACTORS.shopping[profile.shoppingFrequency] || 0;
  weeklyEmissions += shoppingFactor;
  
  // 5. Household Size Adjustment
  // The per-capita emissions are what we care about.
  const householdSize = profile.householdSize > 0 ? profile.householdSize : 1;
  // We assume energy is for the whole household, so we divide it. Other factors are personal.
  const personalWeeklyEmissions = weeklyEmissions - (weeklyEnergyEmissions);
  const perCapitaWeeklyEmissions = (weeklyEnergyEmissions / householdSize) + personalWeeklyEmissions;


  const finalWeekly = parseFloat(perCapitaWeeklyEmissions.toFixed(2));
  const finalDaily = parseFloat((perCapitaWeeklyEmissions / 7).toFixed(2));

  return {
    weekly: finalWeekly,
    daily: finalDaily,
  };
}
