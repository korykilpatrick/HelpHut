import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { Package, Users, Building2, ShieldCheck } from 'lucide-react';
import { cn } from '../../../core/utils/cn';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { setCurrentPortal } from '../../../core/store/slices/navigationSlice';
import type { NavigationState } from '../../../core/store/slices/navigationSlice';

const portals = [
  {
    id: 'donor',
    label: 'Donor Portal',
    icon: Package,
    description: 'Manage your food donations',
    path: '/donor',
  },
  {
    id: 'volunteer',
    label: 'Volunteer Portal',
    icon: Users,
    description: 'Sign up for delivery shifts',
    path: '/volunteer',
  },
  {
    id: 'partner',
    label: 'Partner Portal',
    icon: Building2,
    description: 'Request and receive donations',
    path: '/partner',
  },
  {
    id: 'admin',
    label: 'Admin Portal',
    icon: ShieldCheck,
    description: 'System administration',
    path: '/admin',
  },
] as const;

export function PortalSwitcher() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentPortal = useAppSelector((state) => state.navigation.currentPortal);

  const currentPortalData = portals.find((p) => p.id === currentPortal);
  const Icon = currentPortalData?.icon || Package;

  const handlePortalSelect = (portalId: NavigationState['currentPortal'], path: string) => {
    dispatch(setCurrentPortal(portalId));
    navigate(path);
  };

  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        <button
          className={cn(
            'flex items-center gap-x-2 rounded-md px-3 py-2 text-sm font-medium',
            'hover:bg-accent hover:text-accent-foreground',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
          )}
        >
          <Icon className="h-5 w-5" />
          <span>{currentPortalData?.label || 'Select Portal'}</span>
        </button>
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          className={cn(
            'z-50 min-w-[240px] rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[side=bottom]:slide-in-from-top-2',
            'data-[side=left]:slide-in-from-right-2',
            'data-[side=right]:slide-in-from-left-2',
            'data-[side=top]:slide-in-from-bottom-2',
          )}
          sideOffset={5}
          align="end"
        >
          {portals.map((portal) => (
            <DropdownMenuPrimitive.Item
              key={portal.id}
              className={cn(
                'relative flex cursor-default select-none items-center gap-x-2 rounded-sm p-2 text-sm outline-none transition-colors',
                'focus:bg-accent focus:text-accent-foreground',
                'data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
              )}
              onClick={() => handlePortalSelect(portal.id as NavigationState['currentPortal'], portal.path)}
            >
              <portal.icon className="h-5 w-5" />
              <div className="flex flex-col">
                <span>{portal.label}</span>
                <span className="text-xs text-muted-foreground">{portal.description}</span>
              </div>
            </DropdownMenuPrimitive.Item>
          ))}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
} 