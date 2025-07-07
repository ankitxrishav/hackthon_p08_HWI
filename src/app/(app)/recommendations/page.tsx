import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Snooze, Trash2, Lightbulb } from 'lucide-react';

const tips = [
  "Try walking instead of driving for distances under 2km.",
  "Shift to LED lights to save up to 15kg of CO₂ per month.",
  "Commit to one meat-free day a week to reduce your food footprint.",
  "Unplug electronics when not in use to cut down on phantom energy load."
];

export default function RecommendationsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Lightbulb className="text-accent" /> Smart Tips</CardTitle>
          <CardDescription>Personalized, actionable changes to reduce your carbon footprint. Based on your activity, our AI will provide tailored suggestions here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {tips.map((tip, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border p-4 gap-4">
              <p className="text-sm flex-1">{tip}</p>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="icon"><Check className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><Snooze className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
