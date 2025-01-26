import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { User, Settings, LogOut } from 'lucide-react';
import { cn } from '../../../core/utils/cn';
import { useAuth } from '../../../core/auth/useAuth';

interface UserMenuProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
          aria-label="Open user menu"
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <User className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          className="z-[9999] min-w-[240px] overflow-hidden rounded-md border bg-white p-1 shadow-md"
          sideOffset={5}
          align="end"
          forceMount
        >
          <div className="flex items-center gap-x-3 p-3 border-b border-gray-200 bg-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-gray-600" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">{user.name}</span>
              <span className="text-xs text-gray-500">{user.email}</span>
            </div>
          </div>
          <div className="bg-white p-1">
            <DropdownMenuPrimitive.Item
              className="flex w-full cursor-pointer items-center rounded-sm px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <Settings className="mr-3 h-4 w-4 text-gray-500" />
              <span>Settings</span>
            </DropdownMenuPrimitive.Item>
            <DropdownMenuPrimitive.Item
              onClick={handleLogout}
              className="flex w-full cursor-pointer items-center rounded-sm px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="mr-3 h-4 w-4 text-red-500" />
              <span>Log out</span>
            </DropdownMenuPrimitive.Item>
          </div>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
} 