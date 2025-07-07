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

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Lifestyle Setup</CardTitle>
          <CardDescription>
            Help us understand your habits to create your personalized carbon
            profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Travel & Food</h3>
            <div className="space-y-2">
              <Label htmlFor="travel">How do you usually travel?</Label>
              <Select>
                <SelectTrigger id="travel">
                  <SelectValue placeholder="Select travel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="bike">Bike</SelectItem>
                  <SelectItem value="public">Public Transport</SelectItem>
                  <SelectItem value="walk">Walk</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="diet">What best describes your diet?</Label>
              <Select>
                <SelectTrigger id="diet">
                  <SelectValue placeholder="Select diet type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="veg">Vegetarian</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                  <SelectItem value="non-veg">Non-Veg</SelectItem>
                  <SelectItem value="high-meat">High-Meat</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Home & Shopping</h3>
            <div className="space-y-2">
              <Label htmlFor="energy">Monthly electricity use (kWh)</Label>
              <Input id="energy" type="number" placeholder="e.g., 300" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="shopping">How often do you shop for new items?</Label>
              <Select>
                <SelectTrigger id="shopping">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="rarely">Rarely</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label htmlFor="renewable" className="flex flex-col space-y-1">
                <span>Use renewable energy?</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  e.g. solar panels
                </span>
              </Label>
              <Switch id="renewable" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="ml-auto">
            <Link href="/dashboard">Complete Setup & Go to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
