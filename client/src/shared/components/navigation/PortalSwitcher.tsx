import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Users, Building2, ShieldCheck } from 'lucide-react';
import { cn } from '../../../core/utils/cn';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { setCurrentPortal } from '../../../core/store/slices/navigationSlice';
import type { NavigationState } from '../../../core/store/slices/navigationSlice';
import { useAuth } from '../../../core/auth/useAuth';
import type { UserRole } from '../../../core/auth/types';

const portals = [
  {
    id: 'donor',
    label: 'Donor Portal',
    icon: Package,
    description: 'Manage your food donations',
    path: '/donor',
    allowedRoles: ['admin', 'donor'] as UserRole[]
  },
  {
    id: 'volunteer',
    label: 'Volunteer Portal',
    icon: Users,
    description: 'Sign up for delivery shifts',
    path: '/volunteer',
    allowedRoles: ['admin', 'volunteer'] as UserRole[]
  },
  {
    id: 'partner',
    label: 'Partner Portal',
    icon: Building2,
    description: 'Request and receive donations',
    path: '/partner',
    allowedRoles: ['admin', 'partner'] as UserRole[]
  },
  {
    id: 'admin',
    label: 'Admin Portal',
    icon: ShieldCheck,
    description: 'System administration',
    path: '/admin',
    allowedRoles: ['admin'] as UserRole[]
  },
] as const;

export function PortalSwitcher() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentPortal = useAppSelector((state) => state.navigation.currentPortal);
  const { user } = useAuth();

  // Filter portals based on user role
  const availablePortals = portals.filter(
    portal => user && portal.allowedRoles.includes(user.role)
  );

  const handlePortalSelect = (portalId: NavigationState['currentPortal'], path: string) => {
    dispatch(setCurrentPortal(portalId));
    navigate(path);
  };

  if (availablePortals.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {availablePortals.map((portal) => {
        const isActive = portal.id === currentPortal;
        const Icon = portal.icon;
        
        return (
          <button
            key={portal.id}
            onClick={() => handlePortalSelect(portal.id as NavigationState['currentPortal'], portal.path)}
            className={cn(
              'flex items-center gap-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-accent hover:text-accent-foreground',
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{portal.label}</span>
          </button>
        );
      })}
    </div>
  );
} 