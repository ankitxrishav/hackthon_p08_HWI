import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Lightbulb, Clock, Trash2, Zap, Footprints, Recycle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const tips = [
  { icon: Footprints, text: "Try walking instead of driving for distances under 2km.", impact: "3.4 kg CO₂/week" },
  { icon: Zap, text: "Shift to LED lights to save up to 15kg of CO₂ per month.", impact: "15 kg CO₂/month" },
  { icon: Recycle, text: "Commit to one meat-free day a week to reduce your food footprint.", impact: "2.1 kg CO₂/week" },
  { icon: Zap, text: "Unplug electronics when not in use to cut down on phantom energy load.", impact: "1.5 kg CO₂/month" }
];

export default function RecommendationsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card className="bg-primary text-primary-foreground border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-3xl"><Lightbulb /> Smart Tips</CardTitle>
          <CardDescription className='text-primary-foreground/80'>Personalized, actionable changes to reduce your carbon footprint. Based on your activity, our AI provides tailored suggestions here.</CardDescription>
        </CardHeader>
      </Card>

       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {tips.map((tip, index) => (
            <Card key={index} className='flex flex-col'>
                <CardHeader className="flex-row items-start gap-4 space-y-0">
                    <div className='p-3 rounded-full bg-secondary'>
                        <tip.icon className="size-6 text-primary" />
                    </div>
                    <div className='flex-1'>
                        <p className="font-semibold">{tip.text}</p>
                         <Badge variant="secondary" className='mt-2'>Impact: {tip.impact}</Badge>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow flex items-end justify-end">
                  <div className="flex gap-2 shrink-0">
                    <Button variant="default" size="sm"><Check className="mr-2 h-4 w-4" /> Done</Button>
                    <Button variant="outline" size="sm"><Clock className="mr-2 h-4 w-4" /> Later</Button>
                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
            </Card>
          ))}
       </div>
    </div>
  );
}
