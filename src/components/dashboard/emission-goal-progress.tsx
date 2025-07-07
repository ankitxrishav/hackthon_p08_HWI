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
    <Card className='h-full'>
      <CardHeader>
        <CardTitle className='text-base font-medium'>{label}</CardTitle>
        <CardDescription className='text-xs'>
          {current.toLocaleString()} kg of {goal.toLocaleString()} kg CO₂e used.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Progress value={progressPercentage} className='h-3' />
          <div className="flex justify-between text-sm font-medium text-muted-foreground">
            <span className='text-xs'>{progressPercentage.toFixed(0)}% of goal</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
