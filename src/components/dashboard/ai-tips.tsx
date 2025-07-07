import { generateCarbonReductionTips } from '@/ai/flows/generate-carbon-reduction-tips';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

type UserActivity = {
  travel: string;
  food: string;
  shopping: string;
  energyUsage: string;
}

export async function AiTips({ userActivityString }: { userActivityString: UserActivity }) {
  const result = await generateCarbonReductionTips(userActivityString);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <CheckCircle2 className="text-primary h-5 w-5" />
          <span>Personalized Reduction Tips</span>
        </CardTitle>
        <CardDescription>Suggestions from our AI to lower your impact.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {result.tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-primary mt-1 shrink-0" />
              <span className="text-sm text-muted-foreground">{tip}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
