'use client';
import { AppShell } from '@/components/layout/app-shell';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

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
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user) {
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
