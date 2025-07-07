'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Lightbulb, Clock, Trash2, Zap, Footprints, Recycle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  generateCarbonReductionTips,
  type CarbonReductionTipsInput,
  type CarbonReductionTipsOutput,
} from '@/ai/flows/generate-carbon-reduction-tips';
import { AnimatePresence, motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

// In a real app, this would come from the user's profile/onboarding.
const sampleUserInput: CarbonReductionTipsInput = {
  travel: 'Drives a gasoline car for 50km daily, rarely uses public transport.',
  food: 'Eats meat 4-5 times a week, often gets takeout.',
  shopping: 'Buys new clothes monthly and electronics every few months.',
  energyUsage: 'Uses standard electricity, has AC on for 4 hours a day in summer.',
};

const iconMap: Record<string, React.ElementType> = {
  drive: Footprints,
  walk: Footprints,
  led: Zap,
  light: Zap,
  unplug: Zap,
  electronic: Zap,
  meat: Recycle,
  food: Recycle,
  transport: Footprints,
  default: Lightbulb,
};

const getIconForTip = (tip: string) => {
  const lowerTip = tip.toLowerCase();
  for (const key in iconMap) {
    if (lowerTip.includes(key)) {
      return iconMap[key];
    }
  }
  return iconMap.default;
};

export default function RecommendationsPage() {
  const [tips, setTips] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        setIsLoading(true);
        const result = await generateCarbonReductionTips(sampleUserInput);
        setTips(result.tips);
      } catch (error) {
        console.error('Failed to fetch tips:', error);
        setTips(['Could not load tips. Please try again later.']);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTips();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card className="bg-primary text-primary-foreground border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-3xl">
            <Lightbulb /> Smart Tips
          </CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Personalized, actionable changes to reduce your carbon footprint. Based on your activity, our AI provides tailored suggestions here.
          </CardDescription>
        </CardHeader>
      </Card>
      
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {[...Array(4)].map((_, i) => (
                 <Card key={i} className='flex flex-col h-[180px]'>
                    <CardHeader className="flex-row items-start gap-4 space-y-0">
                        <Skeleton className="size-12 rounded-full" />
                        <div className='flex-1 space-y-2'>
                           <Skeleton className="h-4 w-full" />
                           <Skeleton className="h-4 w-4/5" />
                        </div>
                    </CardHeader>
                     <CardContent className="flex-grow flex items-end justify-between">
                         <Skeleton className="h-6 w-24" />
                         <div className="flex gap-2">
                            <Skeleton className="h-9 w-24" />
                            <Skeleton className="h-9 w-24" />
                         </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      ) : (
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {tips.map((tip, index) => {
              const Icon = getIconForTip(tip);
              return (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="flex flex-col h-full">
                    <CardHeader className="flex-row items-start gap-4 space-y-0">
                      <div className="p-3 rounded-full bg-secondary">
                        <Icon className="size-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{tip}</p>
                        <Badge variant="secondary" className="mt-2">High Impact</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow flex items-end justify-end">
                      <div className="flex gap-2 shrink-0">
                        <Button variant="default" size="sm">
                          <Check className="mr-2 h-4 w-4" /> Done
                        </Button>
                        <Button variant="outline" size="sm">
                          <Clock className="mr-2 h-4 w-4" /> Later
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
