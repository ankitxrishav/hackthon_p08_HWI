import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>View and edit your personal lifestyle data and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Your Name</Label>
              <Input defaultValue="Alex Doe" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue="alex.doe@example.com" disabled />
            </div>
             <div className="space-y-2">
              <Label>Primary Diet</Label>
              <Select defaultValue="mixed">
                <SelectTrigger>
                  <SelectValue placeholder="Select diet type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="veg">Vegetarian</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                  <SelectItem value="non-veg">Non-Veg</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label>Primary Travel Mode</Label>
              <Select defaultValue="car">
                <SelectTrigger>
                  <SelectValue placeholder="Select travel type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="bike">Bike</SelectItem>
                    <SelectItem value="public">Public Transport</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Settings & Goals</CardTitle>
          <CardDescription>Customize your targets and notifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Your CO₂ Reduction Target</Label>
            <Select defaultValue="moderate">
              <SelectTrigger>
                <SelectValue placeholder="Choose your target" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aggressive">Aggressive (10% reduction)</SelectItem>
                <SelectItem value="moderate">Moderate (5% reduction)</SelectItem>
                <SelectItem value="easy">Easy (2% reduction)</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <Separator />
           <div className="flex items-center justify-between rounded-lg border p-4">
              <Label htmlFor="weekly-summary" className="flex flex-col space-y-1">
                <span>Weekly Summary Email</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Receive a summary of your impact every week.
                </span>
              </Label>
              <Switch id="weekly-summary" defaultChecked />
            </div>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Data & Export</CardTitle>
          <CardDescription>Manage your application data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex justify-between items-center rounded-lg border p-4">
             <h3 className="text-base font-medium">Export Report</h3>
            <Button variant="outline">Download PDF/CSV</Button>
          </div>
          <div className="flex justify-between items-center rounded-lg border border-destructive/50 p-4">
            <div>
             <h3 className="text-base font-medium text-destructive">Delete Account</h3>
             <p className="text-sm text-muted-foreground">Permanently delete your account and all data.</p>
             </div>
            <Button variant="destructive">Delete</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
