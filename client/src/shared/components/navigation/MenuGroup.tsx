import * as React from 'react';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { cn } from '../../../core/utils/cn';
import { LucideIcon } from 'lucide-react';

interface MenuGroupProps extends CollapsiblePrimitive.CollapsibleProps {
  icon?: LucideIcon;
  title: string;
  badge?: string | number;
  defaultOpen?: boolean;
  level?: number;
}

export const MenuGroup = React.forwardRef<HTMLDivElement, MenuGroupProps>(
  ({ className, icon: Icon, title, badge, children, defaultOpen = false, level = 0, ...props }, ref) => {
    return (
      <CollapsiblePrimitive.Root defaultOpen={defaultOpen} {...props}>
        <CollapsiblePrimitive.Trigger
          className={cn(
            'group flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
            level > 0 && 'ml-6',
            className
          )}
        >
          <div className="flex items-center gap-x-3">
            {Icon && (
              <Icon className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground" />
            )}
            <span>{title}</span>
          </div>
          <div className="flex items-center gap-x-2">
            {badge && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground group-hover:bg-accent-foreground/10 group-hover:text-accent-foreground">
                {badge}
              </span>
            )}
            <svg
              className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:text-accent-foreground data-[state=open]:rotate-180"
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
          </div>
        </CollapsiblePrimitive.Trigger>
        <CollapsiblePrimitive.Content className="overflow-hidden data-[state=closed]:animate-collapse data-[state=open]:animate-expand">
          <div className="py-2">{children}</div>
        </CollapsiblePrimitive.Content>
      </CollapsiblePrimitive.Root>
    );
  }
);

MenuGroup.displayName = 'MenuGroup'; 