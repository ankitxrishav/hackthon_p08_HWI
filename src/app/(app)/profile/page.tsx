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

export default function ProfilePage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile & Settings</CardTitle>
          <CardDescription>View and edit your personal lifestyle data and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Your Name</Label>
            <Input defaultValue="Alex Doe" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input defaultValue="alex.doe@example.com" disabled />
          </div>
          <div className="space-y-2">
            <Label>Your CO₂ Target</Label>
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
           <div className="space-y-2">
            <h3 className="text-base font-medium">Carbon Offset (Coming Soon)</h3>
            <p className="text-sm text-muted-foreground">
              Soon you'll be able to offset your carbon footprint by supporting verified environmental projects.
            </p>
          </div>
          <div className="flex justify-between items-center">
             <h3 className="text-base font-medium">Export Report</h3>
            <Button variant="outline">Download PDF/CSV</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
