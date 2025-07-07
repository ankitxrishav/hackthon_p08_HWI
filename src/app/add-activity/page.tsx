import { ActivityForm } from '@/components/activity-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AddActivityPage() {
  return (
    <div className="flex justify-center items-start p-4 md:p-8 pt-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Log New Activity</CardTitle>
          <CardDescription>
            Enter details about your activity to calculate its carbon footprint.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityForm />
        </CardContent>
      </Card>
    </div>
  );
}
