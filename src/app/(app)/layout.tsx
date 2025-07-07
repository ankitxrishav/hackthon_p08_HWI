'use client';
import { AppShell } from '@/components/layout/app-shell';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getUserProfile } from '@/lib/firestore';

const AppLayoutSkeleton = () => (
  <div className="flex h-screen w-full">
    <Skeleton className="hidden md:block w-64 h-full" />
    <div className="flex-1 flex flex-col">
       <Skeleton className="h-16 w-full border-b" />
       <div className="flex-1 p-8 space-y-4">
         <Skeleton className="h-32 w-full" />
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
  const pathname = usePathname();
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

    // User is logged in, check for profile
    getUserProfile(user.uid)
      .then((profile) => {
        if (!profile && pathname !== '/onboarding') {
          // No profile and not on the onboarding page, redirect
          router.push('/onboarding');
        } else {
          // User has a profile OR is on the onboarding page, allow access
          setIsVerified(true);
        }
      })
      .catch((err) => {
        console.error("Failed to verify user profile", err);
        // Handle error, maybe redirect to an error page or show a toast
        router.push('/');
      });

  }, [user, authLoading, pathname, router]);

  // Show a skeleton while we verify the user's auth state and profile status
  if (!isVerified) {
    return <AppLayoutSkeleton />;
  }

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="flex-1 pb-16 md:pb-0"
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </AppShell>
  );
}
