import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useAppSelector } from '../../store/hooks';
import { NavItem } from '../../../shared/components/navigation/NavItem';
import { MenuGroup } from '../../../shared/components/navigation/MenuGroup';
import {
  Home,
  Package,
  Calendar,
  Users,
  BarChart,
  Settings,
  Truck,
  MapPin,
  Clock,
  type LucideIcon
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

interface NavSection {
  title: string;
  items: Array<{
    icon: LucideIcon;
    label: string;
    to: string;
    badge?: string | number;
    items?: Array<{
      label: string;
      to: string;
      badge?: string | number;
    }>;
  }>;
}

const portalNavigation: Record<string, NavSection[]> = {
  donor: [
    {
      title: 'Overview',
      items: [
        { icon: Home, label: 'Dashboard', to: '/donor/dashboard' },
        { icon: Package, label: 'My Donations', to: '/donor/donations' },
        { icon: Calendar, label: 'Schedule', to: '/donor/schedule' },
      ],
    },
    {
      title: 'Reports',
      items: [
        { icon: BarChart, label: 'Impact', to: '/donor/impact' },
        { icon: Users, label: 'Recipients', to: '/donor/recipients' },
      ],
    },
  ],
  volunteer: [
    {
      title: 'Food Rescue',
      items: [
        { icon: Home, label: 'Dashboard', to: '/volunteer/dashboard' },
        { icon: Truck, label: 'Available Pickups', to: '/volunteer/pickups' },
        { icon: Clock, label: 'Active Deliveries', to: '/volunteer/active' },
      ],
    },
    {
      title: 'Schedule',
      items: [
        { icon: Calendar, label: 'My Schedule', to: '/volunteer/schedule' },
        { icon: MapPin, label: 'Coverage Area', to: '/volunteer/coverage' },
      ],
    },
    {
      title: 'Reports',
      items: [
        { icon: BarChart, label: 'My Impact', to: '/volunteer/impact' },
      ],
    },
  ],
};

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const currentPortal = useAppSelector((state) => state.navigation.currentPortal);
  
  const navigation = currentPortal ? portalNavigation[currentPortal] : [];

  return (
    <aside className={cn('flex flex-col gap-y-4 p-4', className)}>
      <div className="flex h-12 items-center px-2">
        <span className="text-xl font-bold">HelpHut</span>
      </div>

      <nav className="flex flex-1 flex-col gap-y-6">
        {navigation.map((section) => (
          <div key={section.title} className="flex flex-col gap-y-2">
            <div className="px-3 text-xs font-medium text-muted-foreground">
              {section.title}
            </div>
            {section.items.map((item) => (
              item.items ? (
                <MenuGroup
                  key={item.to}
                  icon={item.icon}
                  title={item.label}
                  badge={item.badge}
                >
                  {item.items.map((subItem) => (
                    <NavItem
                      key={subItem.to}
                      label={subItem.label}
                      to={subItem.to}
                      badge={subItem.badge}
                      level={1}
                      isActive={location.pathname === subItem.to}
                    />
                  ))}
                </MenuGroup>
              ) : (
                <NavItem
                  key={item.to}
                  icon={item.icon}
                  label={item.label}
                  to={item.to}
                  badge={item.badge}
                  isActive={location.pathname === item.to}
                />
              )
            ))}
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