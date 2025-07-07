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
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // While auth state is resolving, do nothing. The skeleton will show.
    if (authLoading) {
      return;
    }

    // If auth is resolved and there's no user, redirect to the login page.
    if (!user) {
      router.push('/');
      return;
    }

    // At this point, user is authenticated.
    // Check session storage to see if onboarding is complete for this session.
    // This enforces the survey on every new login.
    const onboardingCompleteInSession = sessionStorage.getItem('onboardingComplete');
    
    // If user is on the onboarding page, let them be. This prevents redirect loops.
    if (pathname === '/onboarding') {
      setIsVerified(true);
      return;
    }
    
    // If onboarding is NOT complete for this session, redirect them to it.
    if (!onboardingCompleteInSession) {
      router.push('/onboarding');
      return;
    }

    // If we've reached here, user is logged in and onboarding is complete for the session.
    // They can see the page they requested.
    setIsVerified(true);
    
  }, [user, authLoading, router, pathname]);

  // Show a skeleton while we verify auth and onboarding status.
  if (!isVerified) {
    return <AppLayoutSkeleton />;
  }
  
  // All checks passed, render the main app shell with its children.
  return (
    <AppShell>
      {children}
    </AppShell>
  );
}
