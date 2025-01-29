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
import { useAuth } from '../../auth/useAuth';

interface TopNavProps {
  className?: string;
}

export function TopNav({ className }: TopNavProps) {
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  console.log('=== TopNav Render ===');
  console.log('User state:', user);
  console.log('User name:', user?.name);
  console.log('User organization name:', user?.organizationName);
  console.log('Full user object:', JSON.stringify(user, null, 2));

  if (!user) {
    console.log('No user found, returning null');
    return null;
  }

  return (
    <BaseCard 
      variant="ghost"
      className={cn('sticky top-0 z-[100] flex h-16 shrink-0 items-center border-b bg-background shadow-sm', className)}
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

        <div className="flex flex-1 items-center">
          <div className="flex items-center gap-x-4">
            <PortalSwitcher />
          </div>
        </div>

        <div className="flex items-center gap-x-2">
          <NotificationCenter />
          <UserMenu user={{
            name: user.name,
            email: user.email
          }} />
          <div className="hidden md:flex items-center ml-4 text-sm">
            <span className="font-medium text-gray-700">{user.name || user.email}</span>
            {user.organizationName && (
              <>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-gray-600">{user.organizationName}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </BaseCard>
  );
} 