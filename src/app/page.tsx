import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Icons.logo className="size-16 text-primary" />
          </div>
          <CardTitle className="text-3xl">Welcome to CarbonWise</CardTitle>
          <CardDescription>
            Your personal guide to a lighter footprint.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/onboarding">Continue with Google</Link>
          </Button>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            By continuing, you agree to our Terms of Service.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
