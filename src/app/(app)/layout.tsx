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
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (authLoading) {
      return; // Wait until Firebase auth state is resolved
    }
    if (!user) {
      router.push('/'); // Not logged in, send to login page
      return;
    }

    // New logic: Check if onboarding has been completed for this session.
    // If not, redirect to the onboarding page.
    const onboardingCompleteInSession = sessionStorage.getItem('onboardingComplete');
    if (!onboardingCompleteInSession) {
      router.push('/onboarding');
    } else {
      // Onboarding has been completed in this session, allow access to the app.
      setIsVerified(true);
    }
  }, [user, authLoading, router]);

  // Show a skeleton while we verify the user's auth state and session status
  if (!isVerified) {
    return <AppLayoutSkeleton />;
  }

  return (
    <AppShell>
      {children}
    </AppShell>
  );
}
