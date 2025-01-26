import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useAppSelector } from '../../store/hooks';
import { NavItem } from '../../../shared/components/navigation/NavItem';
import { Settings, type LucideIcon } from 'lucide-react';
import { volunteerPortalConfig } from '../../../portals/volunteer/config';
import { donorPortalConfig } from '../../../portals/donor/config';
import { partnerPortalConfig } from '../../../portals/partner/config';
import { type PortalConfig } from '../../../portals/types';
import { useAuth } from '../../auth/useAuth';

interface SidebarProps {
  className?: string;
}

interface PortalFeature {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
}

// Group features by section
const groupFeatures = (features: PortalFeature[]) => {
  const groups = {
    overview: features.filter(f => ['dashboard', 'inventory', 'requests'].includes(f.id)),
    planning: features.filter(f => ['schedule', 'impact'].includes(f.id)),
    relationships: features.filter(f => ['donors', 'requirements'].includes(f.id)),
    foodRescue: features.filter(f => ['available-pickups', 'active-deliveries', 'delivery-history', 'quick-donate', 'donation-history'].includes(f.id)),
    schedule: features.filter(f => ['availability', 'coverage-areas'].includes(f.id)),
    impact: features.filter(f => ['impact', 'leaderboard', 'recipients'].includes(f.id)),
  };

  return Object.entries(groups).filter(([_, items]) => items.length > 0);
};

const portalConfigs: Record<'donor' | 'volunteer' | 'partner', PortalConfig> = {
  donor: donorPortalConfig,
  volunteer: volunteerPortalConfig,
  partner: partnerPortalConfig,
};

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();
  
  const portalConfig = user && (user.role === 'donor' || user.role === 'volunteer' || user.role === 'partner') 
    ? portalConfigs[user.role] 
    : null;
  const features = (portalConfig?.features || []) as PortalFeature[];
  const groupedFeatures = groupFeatures(features);

  return (
    <aside className={cn('flex flex-col gap-y-4 p-4', className)}>
      <div className="flex h-12 items-center px-2">
        <span className="text-xl font-bold">HelpHut</span>
      </div>

      <nav className="flex flex-1 flex-col gap-y-6">
        {groupedFeatures.map(([section, items]) => (
          <div key={section} className="space-y-1">
            <div className="px-2 py-1">
              <h3 className="text-sm font-medium text-muted-foreground capitalize">
                {section.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
            </div>
            {items.map((feature) => {
              const Icon = feature.icon;
              return (
                <NavItem
                  key={feature.id}
                  icon={Icon}
                  label={feature.title}
                  to={feature.path}
                  isActive={location.pathname === feature.path}
                />
              );
            })}
          </div>
        ))}
      </nav>

      <div className="mt-auto">
        <NavItem
          icon={Settings}
          label="Settings"
          to="/settings"
          isActive={location.pathname === '/settings'}
        />
      </div>
    </aside>
  );
} 