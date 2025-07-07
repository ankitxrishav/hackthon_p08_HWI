'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Car, CookingPot, Zap, ShoppingCart, Users } from 'lucide-react';

const steps = [
  { id: 1, title: 'Travel Habits', icon: Car },
  { id: 2, title: 'Food Habits', icon: CookingPot },
  { id: 3, title: 'Home Energy', icon: Zap },
  { id: 4, title: 'Shopping', icon: ShoppingCart },
  { id: 5, title: 'Household', icon: Users },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [distance, setDistance] = useState([50]);

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <Progress value={progress} className="mb-4 h-2" />
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              {steps[currentStep-1].icon({className: "size-5"})}
            </div>
            <CardTitle>{steps[currentStep-1].title}</CardTitle>
          </div>
          <CardDescription>
            Help us understand your habits to create your personalized carbon profile.
          </CardDescription>
        </CardHeader>

        <CardContent className="min-h-[250px]">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>How do you usually travel?</Label>
                <Select defaultValue="car">
                  <SelectTrigger>
                    <SelectValue placeholder="Select travel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="bike">Bike</SelectItem>
                    <SelectItem value="public">Public Transport</SelectItem>
                    <SelectItem value="walk">Walk</SelectItem>
                    <SelectItem value="flights">Flights</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="distance">Average distance per week</Label>
                 <div className="flex items-center gap-4">
                  <Slider
                    id="distance"
                    defaultValue={distance}
                    onValueChange={setDistance}
                    max={500}
                    step={10}
                  />
                  <div className="font-bold w-16 text-center">{distance[0]} km</div>
                 </div>
              </div>
            </div>
          )}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>What best describes your diet?</Label>
                <RadioGroup defaultValue="mixed" className="grid grid-cols-2 gap-4">
                    <div>
                        <RadioGroupItem value="veg" id="veg" className="peer sr-only" />
                        <Label htmlFor="veg" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                            🥗 Vegetarian
                        </Label>
                    </div>
                    <div>
                        <RadioGroupItem value="mixed" id="mixed" className="peer sr-only" />
                        <Label htmlFor="mixed" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                            🍜 Mixed
                        </Label>
                    </div>
                    <div>
                        <RadioGroupItem value="non-veg" id="non-veg" className="peer sr-only" />
                        <Label htmlFor="non-veg" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                            🍗 Non-Veg
                        </Label>
                    </div>
                     <div>
                        <RadioGroupItem value="high-meat" id="high-meat" className="peer sr-only" />
                        <Label htmlFor="high-meat" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                            🥩 High-Meat
                        </Label>
                    </div>
                </RadioGroup>
              </div>
            </div>
          )}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="energy">Monthly electricity use (kWh)</Label>
                <Input id="energy" type="number" placeholder="e.g., 300" />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <Label htmlFor="renewable" className="flex flex-col space-y-1">
                  <span>Use renewable energy?</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    e.g. solar panels
                  </span>
                </Label>
                <Switch id="renewable" />
              </div>
            </div>
          )}
           {currentStep === 4 && (
            <div className="space-y-6">
                <div className="space-y-2">
                    <Label>How often do you shop for new items?</Label>
                    <Select defaultValue="monthly">
                    <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="rarely">Rarely</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
            </div>
          )}
           {currentStep === 5 && (
            <div className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="household">Number of people in household</Label>
                    <Input id="household" type="number" defaultValue="2" />
                </div>
                 <div className="space-y-2">
                    <Label>Primary water heating source</Label>
                    <Select defaultValue="electric">
                    <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="electric">Electric Heater</SelectItem>
                        <SelectItem value="gas">Gas Heater</SelectItem>
                        <SelectItem value="solar">Solar Heater</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="justify-between">
          {currentStep > 1 ? (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          ) : <div />}
          {currentStep < steps.length ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button asChild>
              <Link href="/dashboard">Create My Carbon Profile</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
