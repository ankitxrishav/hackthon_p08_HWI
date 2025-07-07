// Summarize monthly emissions.
'use server';

/**
 * @fileOverview Summarizes monthly carbon emissions and provides insights.
 *
 * - summarizeMonthlyEmissions - A function that generates a summary of monthly emissions.
 * - SummarizeMonthlyEmissionsInput - The input type for the summarizeMonthlyEmissions function.
 * - SummarizeMonthlyEmissionsOutput - The return type for the summarizeMonthlyEmissions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMonthlyEmissionsInputSchema = z.object({
  monthlyEmissionsData: z
    .string()
    .describe(
      'A string representing the monthly emissions data, including emission categories (e.g., food, transport, energy) and their corresponding values (kg CO₂e).'
    ),
});

export type SummarizeMonthlyEmissionsInput = z.infer<
  typeof SummarizeMonthlyEmissionsInputSchema
>;

const SummarizeMonthlyEmissionsOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the monthly carbon emissions, highlighting key trends, categories with the highest emissions, and any significant changes compared to previous months.'
    ),
  insights: z
    .string()
    .describe(
      'Personalized insights and recommendations based on the emissions data, such as potential areas for reduction and suggestions for adopting sustainable habits.'
    ),
});

export type SummarizeMonthlyEmissionsOutput = z.infer<
  typeof SummarizeMonthlyEmissionsOutputSchema
>;

export async function summarizeMonthlyEmissions(
  input: SummarizeMonthlyEmissionsInput
): Promise<SummarizeMonthlyEmissionsOutput> {
  return summarizeMonthlyEmissionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeMonthlyEmissionsPrompt',
  input: {schema: SummarizeMonthlyEmissionsInputSchema},
  output: {schema: SummarizeMonthlyEmissionsOutputSchema},
  prompt: `You are an AI assistant that analyzes carbon emissions data and provides summaries and insights to help users track their environmental impact.

  Based on the following monthly emissions data, generate a concise summary highlighting key trends, categories with the highest emissions, and any significant changes compared to previous months. Also, provide personalized insights and recommendations based on the emissions data, such as potential areas for reduction and suggestions for adopting sustainable habits.

  Monthly Emissions Data:
  {{monthlyEmissionsData}}

  Summary:
  Insights: `,
});

const summarizeMonthlyEmissionsFlow = ai.defineFlow(
  {
    name: 'summarizeMonthlyEmissionsFlow',
    inputSchema: SummarizeMonthlyEmissionsInputSchema,
    outputSchema: SummarizeMonthlyEmissionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
