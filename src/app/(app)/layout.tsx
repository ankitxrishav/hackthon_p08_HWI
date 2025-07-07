'use client';
import { AppShell } from '@/components/layout/app-shell';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const AppLayoutSkeleton = () => (
   <div className="flex h-screen w-full flex-col bg-background/80">
    <Skeleton className="h-16 w-full" />
    <div className="flex-1 p-4 md:p-8 space-y-4">
      <Skeleton className="h-32 w-full" />
      <div className='grid md:grid-cols-2 gap-4'>
         <Skeleton className="h-64 w-full" />
         <Skeleton className="h-64 w-full" />
      </div>
    </div>
  </div>
);


export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  useEffect(() => {
    if (authLoading) {
      return; // Wait for the auth state to be determined
    }

    if (!user) {
      router.push('/'); // If no user, redirect to login page.
      return;
    }

    // User is logged in, now check for session onboarding status.
    const onboardingCompleteInSession = sessionStorage.getItem('onboardingComplete');

    if (!onboardingCompleteInSession) {
      // If onboarding is not complete for this session, redirect to onboarding page.
      router.push('/onboarding');
    } else {
      // Onboarding is complete for this session, allow access to the app.
      setOnboardingChecked(true);
    }
  }, [user, authLoading, router, pathname]);

  // Show a skeleton while we verify auth and onboarding status.
  // This prevents content from flashing before redirects happen.
  if (!onboardingChecked || authLoading || !user) {
    return <AppLayoutSkeleton />;
  }
  
  // All checks passed, render the main app shell.
  return (
    <AppShell>
      {children}
    </AppShell>
  );
}
