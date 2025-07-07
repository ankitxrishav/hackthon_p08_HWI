'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart2, Leaf, Lightbulb, PlusCircle, User, Settings, LogOut, History } from 'lucide-react';
import { Icons } from '../icons';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

const navItems = [
  { href: '/dashboard', icon: Leaf, label: 'Dashboard' },
  { href: '/add-activity', icon: PlusCircle, label: 'Add Activity' },
  { href: '/insights', icon: BarChart2, label: 'Insights' },
  { href: '/history', icon: History, label: 'History' },
  { href: '/recommendations', icon: Lightbulb, label: 'Recommendations' },
  { href: '/profile', icon: User, label: 'Profile' }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };
  
  const getGreeting = () => {
      if (!user?.displayName) return 'Hello!';
      return `Hello, ${user.displayName.split(' ')[0]}!`;
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border/20 bg-background/70 px-4 backdrop-blur-lg sm:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 mr-auto">
            <Icons.logo className="size-8 text-primary" />
            <span className="text-xl font-semibold hidden sm:inline-block">
              Susthira
            </span>
          </Link>
          <div className="flex items-center gap-4 ml-auto">
              <h1 className="text-lg font-semibold hidden md:block">
                {getGreeting()}
              </h1>
              <Button asChild size="sm" className="hidden sm:flex">
                  <Link href="/add-activity">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Log Activity
                  </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar>
                        <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'User'} />
                        <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                   </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link href="/profile"><User className="mr-2 h-4 w-4" />Profile</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/profile"><Settings className="mr-2 h-4 w-4" />Settings</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-700 focus:bg-red-50">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
          </div>
      </header>

      {/* Main content with padding for bottom nav */}
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="flex-1 pb-28"
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {/* Responsive Floating Bottom Nav */}
      <nav className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
        <div className="mx-auto flex h-16 items-center space-x-1 rounded-full border border-white/20 bg-background/70 p-2 shadow-lg backdrop-blur-lg sm:space-x-2">
            {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                     <Link key={item.href} href={item.href} className={cn("relative flex h-14 min-w-16 flex-col items-center justify-center rounded-full px-2 text-center group transition-colors sm:min-w-20", isActive ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
                        <item.icon className="size-6 transition-transform group-hover:scale-110" />
                        <span className="mt-1 text-xs font-medium">{item.label}</span>
                        {isActive && <motion.div layoutId="active-nav-pill" className='absolute inset-0 -z-10 rounded-full bg-primary/10' />}
                     </Link>
                )
            })}
        </div>
      </nav>
    </div>
  );
}
