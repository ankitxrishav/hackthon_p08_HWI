import type { StreakData } from '@/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function StreakCard({ data }: { data: StreakData }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>{data.label}</span>
          <data.icon className="h-4 w-4 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold text-amber-500">
            {data.count}
          </p>
           <span className='text-sm text-muted-foreground'>days</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Keep up the great work!
        </p>
      </CardContent>
    </Card>
  );
}
