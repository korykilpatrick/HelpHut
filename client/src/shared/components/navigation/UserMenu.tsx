import * as React from 'react';
import { User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../../core/auth/useAuth';
import { BaseDropdown, DropdownHeader, DropdownSection, DropdownItem } from '../base/BaseDropdown';

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

  const trigger = (
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
  );

  return (
    <BaseDropdown trigger={trigger}>
      <DropdownHeader>
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
      </DropdownHeader>
      <DropdownSection>
        <DropdownItem>
          <Settings className="mr-3 h-4 w-4 text-gray-500" />
          <span>Settings</span>
        </DropdownItem>
        <DropdownItem destructive onClick={handleLogout}>
          <LogOut className="mr-3 h-4 w-4 text-red-500" />
          <span>Log out</span>
        </DropdownItem>
      </DropdownSection>
    </BaseDropdown>
  );
} 