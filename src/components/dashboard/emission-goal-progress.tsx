import type { EmissionGoal } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface EmissionGoalProgressProps {
  data: EmissionGoal;
}

export function EmissionGoalProgress({ data }: EmissionGoalProgressProps) {
  const { current, goal, label } = data;
  const progressPercentage = (current / goal) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
        <CardDescription>
          You've used {progressPercentage.toFixed(0)}% of your monthly carbon emission goal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Progress value={progressPercentage} />
          <div className="flex justify-between text-sm font-medium text-muted-foreground">
            <span>{current.toLocaleString()} kg CO₂e</span>
            <span className="text-foreground">{goal.toLocaleString()} kg CO₂e Goal</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
