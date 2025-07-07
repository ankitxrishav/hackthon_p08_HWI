'use server';

/**
 * @fileOverview A deterministic function to calculate carbon emissions for various activities.
 *
 * - calculateEmission - A function that calculates carbon emissions based on a set of rules.
 * - CalculateEmissionInput - The input type for the calculateEmission function.
 * - CalculateEmissionOutput - The return type for the calculateEmission function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CalculateEmissionInputSchema = z.object({
  category: z.enum(['Travel', 'Food', 'Energy', 'Shopping']),
  value: z.number().describe('The primary value for the calculation (e.g., distance in km, energy in kWh, amount in INR).'),
  details: z.record(z.any()).optional().describe('Additional details about the activity (e.g., transport mode, meal type).'),
});
export type CalculateEmissionInput = z.infer<typeof CalculateEmissionInputSchema>;

const CalculateEmissionOutputSchema = z.object({
  emission: z.number().describe('The calculated carbon emission in kg CO₂e.'),
});
export type CalculateEmissionOutput = z.infer<typeof CalculateEmissionOutputSchema>;


export async function calculateEmission(
  input: CalculateEmissionInput
): Promise<CalculateEmissionOutput> {
  // This is a Genkit flow, but it now executes deterministic logic instead of calling an LLM.
  return calculateEmissionFlow(input);
}

// Emission factors based on IPCC, DEFRA, and other standard datasets.
// This is the "Carbon Engine"
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

const calculateEmissionFlow = ai.defineFlow(
  {
    name: 'calculateEmissionFlow',
    inputSchema: CalculateEmissionInputSchema,
    outputSchema: CalculateEmissionOutputSchema,
  },
  async (input) => {
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
    
    // The flow must return an object matching the output schema.
    return { emission };
  }
);
