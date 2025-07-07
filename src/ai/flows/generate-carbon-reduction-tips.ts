// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview An AI agent that suggests personalized carbon reduction tips based on user activities.
 *
 * - generateCarbonReductionTips - A function that generates personalized carbon reduction tips.
 * - CarbonReductionTipsInput - The input type for the generateCarbonReductionTips function.
 * - CarbonReductionTipsOutput - The return type for the generateCarbonReductionTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CarbonReductionTipsInputSchema = z.object({
  travel: z
    .string()
    .describe(
      'Description of travel habits, including modes of transportation and frequency.'
    ),
  food: z
    .string()
    .describe(
      'Description of food consumption habits, including diet and frequency of eating out.'
    ),
  shopping: z
    .string()
    .describe(
      'Description of shopping habits, including types of purchases and frequency.'
    ),
  energyUsage: z
    .string()
    .describe(
      'Description of energy usage habits, including electricity and gas consumption.'
    ),
});
export type CarbonReductionTipsInput = z.infer<typeof CarbonReductionTipsInputSchema>;

const CarbonReductionTipsOutputSchema = z.object({
  tips: z
    .array(z.string())
    .describe(
      'A list of personalized tips to reduce carbon footprint based on the user activities.'
    ),
});
export type CarbonReductionTipsOutput = z.infer<typeof CarbonReductionTipsOutputSchema>;

export async function generateCarbonReductionTips(
  input: CarbonReductionTipsInput
): Promise<CarbonReductionTipsOutput> {
  return generateCarbonReductionTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'carbonReductionTipsPrompt',
  input: {schema: CarbonReductionTipsInputSchema},
  output: {schema: CarbonReductionTipsOutputSchema},
  prompt: `Based on the following user activities, provide personalized tips on how to reduce their carbon footprint.

Travel: {{{travel}}}
Food: {{{food}}}
Shopping: {{{shopping}}}
Energy Usage: {{{energyUsage}}}

Tips:`,
});

const generateCarbonReductionTipsFlow = ai.defineFlow(
  {
    name: 'generateCarbonReductionTipsFlow',
    inputSchema: CarbonReductionTipsInputSchema,
    outputSchema: CarbonReductionTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
