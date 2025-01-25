import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset transition-colors',
  {
    variants: {
      variant: {
        default:
          'bg-gray-50 text-gray-700 ring-gray-200/50 hover:bg-gray-100',
        primary:
          'bg-blue-50 text-blue-700 ring-blue-200/50 hover:bg-blue-100',
        success:
          'bg-green-50 text-green-700 ring-green-200/50 hover:bg-green-100',
        warning:
          'bg-yellow-50 text-yellow-700 ring-yellow-200/50 hover:bg-yellow-100',
        error:
          'bg-red-50 text-red-700 ring-red-200/50 hover:bg-red-100',
        info:
          'bg-sky-50 text-sky-700 ring-sky-200/50 hover:bg-sky-100',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-sm',
        lg: 'px-3 py-1 text-sm',
      },
      interactive: {
        true: 'cursor-pointer',
      },
      removable: {
        true: 'pr-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BaseBadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'className'>,
    VariantProps<typeof badgeVariants> {
  className?: string;
  icon?: React.ReactNode;
  onRemove?: () => void;
}

const BaseBadge = React.forwardRef<HTMLSpanElement, BaseBadgeProps>(
  (
    {
      children,
      className,
      variant,
      size,
      interactive,
      removable,
      icon,
      onRemove,
      ...props
    },
    ref
  ) => {
    const isRemovable = Boolean(onRemove);
    const isInteractive = Boolean(interactive || isRemovable);

    return (
      <span
        ref={ref}
        className={cn(
          badgeVariants({
            variant,
            size,
            interactive: isInteractive,
            removable: isRemovable,
            className,
          })
        )}
        {...props}
      >
        {icon && (
          <span className="mr-1 -ml-0.5 inline-block h-3.5 w-3.5">
            {icon}
          </span>
        )}
        {children}
        {isRemovable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            className="ml-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-black/10"
          >
            <span className="sr-only">Remove</span>
            <svg
              className="h-3 w-3"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 3L3 9M3 3L9 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

BaseBadge.displayName = 'BaseBadge';

export default BaseBadge; 
