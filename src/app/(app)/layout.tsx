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
    
    // Check if the user's session status has already been verified and a landing page shown.
    // If so, allow free navigation.
    const sessionVerified = sessionStorage.getItem('userStatusVerified');
    if (sessionVerified) {
        setIsVerified(true);
        return;
    }

    // If the router is in the process of redirecting to the designated landing page,
    // we should allow it to render. This prevents a redirect loop where this effect
    // runs again before the page has mounted and set the 'sessionVerified' flag.
    if (pathname === '/onboarding' || pathname === '/add-activity') {
        setIsVerified(true);
        return;
    }

    // This is the first check for this session.
    // Determine where to send the user based on whether they have a profile.
    const checkUserStatus = async () => {
        try {
            const profile = await getUserProfile(user.uid);
            if (!profile) {
                // New user: Send them to the onboarding survey.
                router.push('/onboarding');
            } else {
                // Returning user: Send them to the Add Activity page.
                router.push('/add-activity');
            }
        } catch (error) {
            console.error("Error checking user profile status:", error);
            // In case of error, assume they are verified to avoid getting stuck.
            setIsVerified(true);
        }
    };

    checkUserStatus();
    
  }, [user, authLoading, router, pathname]);

  // Show a skeleton while we verify auth and profile status.
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
