import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { cn } from '../../../core/utils/cn';

interface BaseDropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  className?: string;
}

export function BaseDropdown({ 
  trigger, 
  children, 
  align = 'end',
  sideOffset = 5,
  className 
}: BaseDropdownProps) {
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        {trigger}
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          className={cn(
            'z-[9999] min-w-[240px] overflow-hidden rounded-md border bg-white p-1 shadow-md',
            className
          )}
          sideOffset={sideOffset}
          align={align}
          forceMount
        >
          {children}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}

export const DropdownItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    destructive?: boolean;
  }
>(({ className, children, destructive, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'flex w-full cursor-pointer items-center rounded-sm px-3 py-2 text-sm',
      destructive
        ? 'text-red-600 hover:bg-red-50'
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
      className
    )}
    {...props}
  >
    {children}
  </DropdownMenuPrimitive.Item>
));
DropdownItem.displayName = 'DropdownItem';

export const DropdownHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center gap-x-3 p-3 border-b border-gray-200 bg-white',
      className
    )}
    {...props}
  />
));
DropdownHeader.displayName = 'DropdownHeader';

export const DropdownSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('bg-white p-1', className)}
    {...props}
  />
));
DropdownSection.displayName = 'DropdownSection'; 