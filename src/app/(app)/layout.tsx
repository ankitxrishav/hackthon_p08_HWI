'use client';
import { AppShell } from '@/components/layout/app-shell';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getUserProfile } from '@/lib/firestore';

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
    
    // If the user is on the onboarding page, let them be. This prevents redirect loops
    // for new users who are sent there.
    if (pathname === '/onboarding') {
      setIsVerified(true);
      return;
    }

    // Check if we've already determined the user's status for this session.
    const sessionVerified = sessionStorage.getItem('userStatusVerified');
    if (sessionVerified) {
        setIsVerified(true);
        return;
    }

    // This is the first check for this session.
    // Determine if the user is new or returning by checking for a profile in Firestore.
    const checkUserStatus = async () => {
        try {
            const profile = await getUserProfile(user.uid);
            if (!profile) {
                // No profile found, this is a new user. Redirect to onboarding.
                router.push('/onboarding');
            } else {
                // Profile found, this is a returning user.
                // Mark as verified for this session and allow them to proceed.
                sessionStorage.setItem('userStatusVerified', 'true');
                setIsVerified(true);
            }
        } catch (error) {
            console.error("Error checking user profile status:", error);
            // In case of error, assume they are verified to avoid getting stuck.
            // The dashboard will show a specific error if it can't load data.
            setIsVerified(true);
        }
    };

    checkUserStatus();
    
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
