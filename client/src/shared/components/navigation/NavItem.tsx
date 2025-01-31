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
          'group flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
          isActive
            ? 'bg-blue-50 text-blue-700 shadow-sm'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
          level > 0 && 'ml-6',
          className
        )}
        {...props}
      >
        {Icon && (
          <Icon
            className={cn(
              'h-5 w-5 flex-shrink-0 transition-colors duration-200',
              isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
            )}
          />
        )}
        <span className="flex-1">{label}</span>
        {badge && (
          <span
            className={cn(
              'ml-auto rounded-full px-2 py-0.5 text-xs font-medium transition-colors duration-200',
              isActive
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200 group-hover:text-gray-900'
            )}
          >
            {badge}
          </span>
        )}
        {hasChildren && (
          <svg
            className={cn(
              'h-4 w-4 transition-transform duration-200',
              isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600',
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