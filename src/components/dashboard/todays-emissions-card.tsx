'use client';

import { useEffect, useRef } from 'react';
import { animate } from 'framer-motion';
import type { CategoryBreakdown } from '@/types';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface TodaysEmissionsCardProps {
  data: {
    total: number;
    breakdown: CategoryBreakdown[];
  };
}

function Counter({ from, to }: { from: number; to: number }) {
  const nodeRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const controls = animate(from, to, {
      duration: 1,
      ease: 'easeOut',
      onUpdate(value) {
        node.textContent = value.toFixed(1);
      },
    });

    return () => controls.stop();
  }, [from, to]);

  return <span ref={nodeRef} />;
}


export function TodaysEmissionsCard({ data }: TodaysEmissionsCardProps) {

  const getEmissionColor = (total: number) => {
    if (total < 10) return 'text-green-600';
    if (total < 20) return 'text-yellow-500';
    return 'text-red-600';
  }

  return (
    <Card className='text-center'>
      <CardHeader>
        <CardDescription>Today's Total Emissions</CardDescription>
        <CardTitle className={`text-6xl font-extrabold tracking-tighter ${getEmissionColor(data.total)}`}>
          <Counter from={0} to={data.total} />
          <span className="text-3xl font-medium text-muted-foreground ml-2">kg CO₂e</span>
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
