'use server';

import type { CalculateEmissionInput } from '@/types';

// Emission factors based on IPCC, DEFRA, and other standard datasets.
const EMISSION_FACTORS = {
  travel: {
    car: 0.192,           // kg CO₂e/km (Petrol)
    plane: 0.145,         // kg CO₂e/km (Economy)
    metro: 0.045,         // kg CO₂e/km
    bus: 0.10,            // kg CO₂e/km
    bike: 0,
    walk: 0,
  },
  food: { // Per meal
    veg: 1.2,
    mixed: 2.5,
    'non-veg': 2.5,       // Treating mixed and non-veg similarly per meal
    processed: 3.5,       // Higher impact for processed/junk food
  },
  energy: {
    kwh: 0.82,            // kg CO₂e/kWh (India avg)
    ac_per_hour: 1.23,    // kg CO₂e/hr (1.5kW * 0.82)
    heater_per_hour: 1.23, // Assuming similar to AC for now
  },
  shopping: {
    per_rupee: 0.0004,    // 0.4 kg per 1000 INR
  }
};

/**
 * A deterministic function to calculate carbon emissions for various activities.
 * This is the "Carbon Engine" and does not use AI.
 * @param input - The activity details.
 * @returns The calculated emission in kg CO₂e.
 */
export async function calculateActivityEmission(
  input: CalculateEmissionInput
): Promise<{ emission: number }> {
    let emission = 0;

    try {
        switch (input.category) {
        case 'Travel': {
            const mode = input.details?.mode as keyof typeof EMISSION_FACTORS.travel || 'car';
            const distance = input.value; // distance in km
            const factor = EMISSION_FACTORS.travel[mode] ?? 0;
            emission = distance * factor;
            break;
        }
        
        case 'Food': {
            const dietType = input.details?.dietType as keyof typeof EMISSION_FACTORS.food || 'mixed';
            // 'value' for food is number of meals, defaulting to 1
            const numMeals = input.value > 0 ? input.value : 1;
            const factor = EMISSION_FACTORS.food[dietType] ?? EMISSION_FACTORS.food.mixed;
            emission = numMeals * factor;
            break;
        }
        
        case 'Energy': {
            let kwhEmission = 0;
            if (input.value > 0) { // Direct kWh input
                kwhEmission = input.value * EMISSION_FACTORS.energy.kwh;
            }

            let applianceEmission = 0;
            const acHours = input.details?.acHours || 0;
            const heaterHours = input.details?.heaterHours || 0;
            applianceEmission += acHours * EMISSION_FACTORS.energy.ac_per_hour;
            applianceEmission += heaterHours * EMISSION_FACTORS.energy.heater_per_hour;

            emission = kwhEmission + applianceEmission;
            break;
        }
            
        case 'Shopping': {
            const amountSpent = input.value; // amount in rupees
            emission = amountSpent * EMISSION_FACTORS.shopping.per_rupee;
            break;
        }

        default:
            // Return 0 if category is unknown
            emission = 0;
            break;
        }
    } catch (error) {
        console.error("Error during emission calculation:", error);
        // In case of any error in the logic, return 0 to avoid breaking the app
        return { emission: 0 };
    }
    
    return { emission };
}
