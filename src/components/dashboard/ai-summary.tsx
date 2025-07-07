import { summarizeMonthlyEmissions } from '@/ai/flows/summarize-monthly-emissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

export async function AiSummary({ monthlyDataString }: { monthlyDataString: string }) {
  const result = await summarizeMonthlyEmissions({ monthlyEmissionsData: monthlyDataString });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="text-accent h-5 w-5" />
          <span>Monthly Summary & Insights</span>
        </CardTitle>
        <CardDescription>AI-powered analysis of your recent activity.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <h3 className="font-semibold mb-1 text-foreground/90">Summary</h3>
          <p className="text-muted-foreground">{result.summary}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-1 text-foreground/90">Insights</h3>
          <p className="text-muted-foreground">{result.insights}</p>
        </div>
      </CardContent>
    </Card>
  );
}
