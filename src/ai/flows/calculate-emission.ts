'use server';

/**
 * @fileOverview An AI agent that calculates carbon emissions for various activities.
 *
 * - calculateEmission - A function that calculates carbon emissions.
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
  return calculateEmissionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'emissionCalculationPrompt',
  input: { schema: CalculateEmissionInputSchema },
  output: { schema: CalculateEmissionOutputSchema },
  prompt: `You are a carbon footprint calculation expert. Based on the provided activity, calculate the estimated carbon emission in kg CO₂e using the specific emission factors provided below.

  Activity Category: {{{category}}}
  Primary Value: {{{value}}}
  Details: {{jsonStringify details}}

  Use these exact emission factors for your calculation:
  - Car (gasoline): 0.192 kg CO₂e/km
  - Plane (short-haul): 0.25 kg CO₂e/km
  - Metro/Train: 0.045 kg CO₂e/km
  - Bus: 0.10 kg CO₂e/km
  - Bike/Walk: 0 kg CO₂e/km
  - High-meat meal ('non-veg'): 3.5 kg CO₂e/day (assume 1 meal if not specified)
  - Mixed meal: 2.5 kg CO₂e/day
  - Vegetarian meal ('veg'): 1.5 kg CO₂e/day
  - Electricity (standard grid): 0.82 kg CO₂e/kWh
  - Shopping (based on spend): 0.4 kg CO₂e per 1000₹ spent (or 0.0004 per ₹)

  The 'value' field corresponds to the primary metric for each category:
  - For Shopping, 'value' is the amount spent in rupees (₹).
  - For Travel, 'value' is the distance in km.
  - For Food, 'value' is the number of meals (default to 1 if not specified). Use the details to determine meal type.
  - For Energy, 'value' is the kWh consumed.

  Example calculation: If a user spent ₹1500 on clothes, the emission is 1500 * 0.0004 = 0.6 kg CO₂e.
  
  Return only the calculated numeric emission value.`,
});

const calculateEmissionFlow = ai.defineFlow(
  {
    name: 'calculateEmissionFlow',
    inputSchema: CalculateEmissionInputSchema,
    outputSchema: CalculateEmissionOutputSchema,
  },
  async (input) => {
    // For simple cases, we can apply a direct factor without calling the LLM to save cost/latency.
    if (input.category === 'Travel' && input.details?.mode === 'bike') {
        return { emission: 0 };
    }
    
    const { output } = await prompt(input);
    return output!;
  }
);
