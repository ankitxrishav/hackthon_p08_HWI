import type { ComparisonData } from '@/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowDown, ArrowUp } from 'lucide-react';

export function ComparisonCard({ data }: { data: ComparisonData }) {
  const isLower = data.percentage < 0;
  const ArrowIcon = isLower ? ArrowDown : ArrowUp;
  const colorClass = isLower ? 'text-green-600' : 'text-red-600';

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center justify-between">
          <span>vs. {data.label} Avg.</span>
          <data.icon className="h-5 w-5 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <p className={`text-2xl font-bold ${colorClass}`}>
            {Math.abs(data.percentage)}%
          </p>
          <ArrowIcon className={`h-5 w-5 ${colorClass}`} />
        </div>
        <p className="text-xs text-muted-foreground">
          {isLower ? 'Lower' : 'Higher'} than the average.
        </p>
      </CardContent>
    </Card>
  );
}
