import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Users, Building2, ShieldCheck } from 'lucide-react';
import { useAppDispatch } from '../../../core/store/hooks';
import { setCurrentPortal } from '../../../core/store/slices/navigationSlice';
import type { NavigationState } from '../../../core/store/slices/navigationSlice';

const portals = [
  {
    id: 'donor',
    label: 'Donor Portal',
    icon: Package,
    description: 'Manage your food donations and track your impact',
    path: '/donor/dashboard',
  },
  {
    id: 'volunteer',
    label: 'Volunteer Portal',
    icon: Users,
    description: 'Sign up for delivery shifts and manage your schedule',
    path: '/volunteer/dashboard',
  },
  {
    id: 'partner',
    label: 'Partner Portal',
    icon: Building2,
    description: 'Request and receive donations, manage inventory',
    path: '/partner/dashboard',
  },
  {
    id: 'admin',
    label: 'Admin Portal',
    icon: ShieldCheck,
    description: 'System administration and oversight',
    path: '/admin/dashboard',
  },
] as const;

export function HomePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handlePortalSelect = (portalId: NavigationState['currentPortal'], path: string) => {
    dispatch(setCurrentPortal(portalId));
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Welcome to HelpHut</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Select a portal to get started
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <button
                key={portal.id}
                onClick={() => handlePortalSelect(portal.id as NavigationState['currentPortal'], portal.path)}
                className="group relative overflow-hidden rounded-lg border bg-card p-6 text-left shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-x-4">
                  <div className="rounded-lg border bg-background p-2 group-hover:border-primary group-hover:text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{portal.label}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {portal.description}
                    </p>
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-primary transition-transform group-hover:scale-x-100" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
} 