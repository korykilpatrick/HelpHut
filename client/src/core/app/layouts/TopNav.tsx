import * as React from 'react';
import { Menu } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleSidebar } from '../../store/slices/navigationSlice';
import { BaseButton } from '../../../shared/components/base/BaseButton';
import BaseCard from '../../../shared/components/base/BaseCard';
import { NotificationCenter } from '../../../shared/components/navigation/NotificationCenter';
import { UserMenu } from '../../../shared/components/navigation/UserMenu';
import { PortalSwitcher } from '../../../shared/components/navigation/PortalSwitcher';

interface TopNavProps {
  className?: string;
}

// TODO: Replace with actual user data from auth context
const mockUser = {
  name: 'John Doe',
  email: 'john@example.com',
};

export function TopNav({ className }: TopNavProps) {
  const dispatch = useAppDispatch();

  return (
    <BaseCard 
      variant="ghost"
      className={cn('sticky top-0 z-10 flex h-16 shrink-0 items-center border-b bg-background', className)}
    >
      <div className="px-4 flex w-full items-center">
        <BaseButton
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => dispatch(toggleSidebar())}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </BaseButton>

        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-x-4">
            <PortalSwitcher />
          </div>

          <div className="flex items-center gap-x-4">
            <NotificationCenter />
            <UserMenu user={mockUser} />
          </div>
        </div>
      </div>
    </BaseCard>
  );
} 