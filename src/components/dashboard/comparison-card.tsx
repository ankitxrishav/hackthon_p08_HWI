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
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>{data.label}</span>
          <data.icon className="h-4 w-4 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1">
          <p className={`text-2xl font-bold ${colorClass}`}>
            {Math.abs(data.percentage)}%
          </p>
          <ArrowIcon className={`h-4 w-4 ${colorClass}`} />
        </div>
        <p className="text-xs text-muted-foreground">
          {isLower ? 'Lower' : 'Higher'} than average
        </p>
      </CardContent>
    </Card>
  );
}
