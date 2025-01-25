import * as React from 'react';
import { cn } from '../../utils/cn';
import { useAppSelector } from '../../store/hooks';
import { TopNav } from './TopNav';
import { Sidebar } from './Sidebar';
import BaseCard from '../../../shared/components/base/BaseCard';

interface MainLayoutProps {
  children?: React.ReactNode;
  className?: string;
}

export function MainLayout({ children, className }: MainLayoutProps) {
  const isSidebarOpen = useAppSelector((state) => state.navigation.isSidebarOpen);

  return (
    <div className="relative flex h-screen overflow-hidden">
      <BaseCard 
        variant="ghost"
        className={cn(
          'fixed left-0 top-0 z-20 h-full w-64 shrink-0 border-r bg-background transition-transform duration-300 lg:static',
          !isSidebarOpen && '-translate-x-full lg:translate-x-0'
        )}
      >
        <Sidebar />
      </BaseCard>
      
      <div className="flex flex-1 flex-col">
        <BaseCard variant="ghost" className="shrink-0">
          <TopNav />
        </BaseCard>
        <main className={cn('flex-1 overflow-y-auto px-4 pb-4', className)}>
          {children}
        </main>
      </div>
    </div>
  );
} 