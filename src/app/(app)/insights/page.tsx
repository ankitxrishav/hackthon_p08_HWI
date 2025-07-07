import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, PieChart, TrendingUp } from 'lucide-react';

export default function InsightsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'><PieChart className='text-primary' /> CO₂ Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">A pie chart showing the breakdown of your emissions by category (Transport, Food, etc.) will be displayed here.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'><BarChart className='text-primary' /> Emission Stats</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-muted-foreground">Detailed daily, weekly, and monthly emission statistics will appear here.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'><TrendingUp className='text-primary' /> Green Streaks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Track the number of consecutive days you've stayed below your CO₂ limit.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
