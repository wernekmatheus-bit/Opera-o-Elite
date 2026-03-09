'use client';

import { usePathname } from 'next/navigation';
import { Navigation } from '@/components/navigation';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMarketing = pathname === '/';
  const isOnboarding = pathname === '/onboarding';
  
  const hideNav = isMarketing || isOnboarding;

  return (
    <div className={hideNav ? '' : 'pb-16 pt-16 md:pt-0 md:pb-0 md:pl-64'}>
      {!hideNav && <Navigation />}
      <main className={hideNav ? '' : 'min-h-screen p-4 md:p-8 max-w-7xl mx-auto'}>
        {children}
      </main>
    </div>
  );
}
