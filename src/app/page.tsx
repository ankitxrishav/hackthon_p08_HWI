'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      toast({
        title: 'Success!',
        description: `Welcome, ${result.user.displayName}!`,
      });
      // The auth provider will handle routing to either onboarding or dashboard
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: error.message || 'Could not sign in with Google.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/20 p-8 shadow-2xl backdrop-blur-xl dark:bg-black/20">
        <div className="flex flex-col items-center space-y-4 text-center">
          <Icons.logo className="size-24 text-primary" />
          <h1 className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl">
            Susthira
          </h1>
          <p className="max-w-md text-muted-foreground md:text-xl">
            Live light. Live long.
          </p>
        </div>
        <div className="mt-12 w-full">
          <Button onClick={handleLogin} disabled={isLoading} className="w-full" size="lg">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.google className="mr-2 h-5 w-5" />
            )}
            Continue with Google
          </Button>
          <p className="mt-4 px-8 text-center text-xs text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
