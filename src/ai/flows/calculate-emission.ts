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
  value: z.number().describe('The primary value for the calculation (e.g., distance in km, energy in kWh).'),
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
  prompt: `You are a carbon footprint calculation expert. Based on the provided activity, calculate the estimated carbon emission in kg CO₂e. Use standard emission factors.
  
  Activity Category: {{{category}}}
  Primary Value: {{{value}}}
  Details: {{jsonStringify details}}
  
  Here are some example emission factors to guide you:
  - Car (gasoline): 0.18 kg CO₂e/km
  - Plane (short-haul): 0.25 kg CO₂e/km
  - Metro/Train: 0.04 kg CO₂e/km
  - Bike/Walk: 0 kg CO₂e/km
  - Red meat meal: 7 kg CO₂e/meal
  - Vegetarian meal: 1.5 kg CO₂e/meal
  - Processed food: 3 kg CO₂e/meal
  - Electricity (standard grid): 0.45 kg CO₂e/kWh
  - Clothing: 10 kg CO₂e per item ($50 spent ~ 1 item)
  - Electronics: 50 kg CO₂e per item ($200 spent ~ 1 item)
  
  Return only the calculated emission value.`,
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
