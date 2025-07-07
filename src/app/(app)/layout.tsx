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
    // While auth state is resolving, show a skeleton.
    if (authLoading) {
      return;
    }

    // If auth is resolved and there's no user, redirect to the login page.
    if (!user) {
      router.push('/');
      return;
    }

    // Check if the user's destination for this session has already been determined.
    // This prevents redirect loops.
    const sessionVerified = sessionStorage.getItem('userStatusVerified');
    if (sessionVerified) {
        setIsVerified(true);
        return;
    }

    // If we are already on the correct path, allow it to render before checking.
    // This helps prevent race conditions.
    if (pathname === '/onboarding' || pathname === '/dashboard') {
        setIsVerified(true);
        return;
    }

    // Determine where to send the user based on whether they have a profile.
    const checkUserStatusAndRedirect = async () => {
        try {
            const profile = await getUserProfile(user.uid);
            if (profile) {
                // Returning user: Send them to the dashboard.
                router.push('/dashboard');
            } else {
                // New user: Send them to the onboarding survey.
                router.push('/onboarding');
            }
        } catch (error) {
            console.error("Error checking user profile status:", error);
            // In case of error, default to the dashboard to avoid getting stuck.
            router.push('/dashboard');
        } finally {
            // Once the redirect is issued, mark this session as verified.
            sessionStorage.setItem('userStatusVerified', 'true');
        }
    };

    checkUserStatusAndRedirect();
    
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
