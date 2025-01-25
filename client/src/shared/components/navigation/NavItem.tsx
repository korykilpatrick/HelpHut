import * as React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../../core/utils/cn';
import { LucideIcon } from 'lucide-react';

export interface NavItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  icon?: LucideIcon;
  label: string;
  to: string;
  isActive?: boolean;
  badge?: string | number;
  hasChildren?: boolean;
  level?: number;
}

export const NavItem = React.forwardRef<HTMLAnchorElement, NavItemProps>(
  ({ className, icon: Icon, label, to, isActive, badge, hasChildren, level = 0, ...props }, ref) => {
    return (
      <Link
        ref={ref}
        to={to}
        className={cn(
          'group flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-accent text-accent-foreground'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          level > 0 && 'ml-6',
          className
        )}
        {...props}
      >
        {Icon && (
          <Icon
            className={cn(
              'h-4 w-4',
              isActive ? 'text-accent-foreground' : 'text-muted-foreground group-hover:text-accent-foreground'
            )}
          />
        )}
        <span className="flex-1">{label}</span>
        {badge && (
          <span
            className={cn(
              'ml-auto rounded-full px-2 py-0.5 text-xs font-medium',
              isActive
                ? 'bg-accent-foreground/10 text-accent-foreground'
                : 'bg-muted text-muted-foreground group-hover:bg-accent-foreground/10 group-hover:text-accent-foreground'
            )}
          >
            {badge}
          </span>
        )}
        {hasChildren && (
          <svg
            className={cn(
              'h-4 w-4 transition-transform',
              isActive ? 'text-accent-foreground' : 'text-muted-foreground group-hover:text-accent-foreground',
              hasChildren && 'rotate-180'
            )}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
      </Link>
    );
  }
);

NavItem.displayName = 'NavItem'; 