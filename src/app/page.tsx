import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center space-y-4 text-center">
        <Icons.logo className="size-24 text-primary" />
        <h1 className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl">
          CarbonWise
        </h1>
        <p className="max-w-md text-muted-foreground md:text-xl">
          Track. Reduce. Impact.
        </p>
      </div>
      <div className="mt-12 w-full max-w-sm">
        <Button asChild className="w-full" size="lg">
          <Link href="/onboarding">Continue with Google</Link>
        </Button>
        <p className="mt-4 px-8 text-center text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
