import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const cardVariants = cva(
  'rounded-lg bg-white shadow-sm transition-shadow',
  {
    variants: {
      variant: {
        default: 'border border-gray-200',
        elevated: 'shadow-md hover:shadow-lg',
        ghost: 'shadow-none border-0',
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
);

const headerVariants = cva('', {
  variants: {
    padding: {
      none: '',
      sm: 'px-4 py-3',
      md: 'px-6 py-4',
      lg: 'px-8 py-6',
    },
  },
  defaultVariants: {
    padding: 'md',
  },
});

const footerVariants = cva('', {
  variants: {
    padding: {
      none: '',
      sm: 'px-4 py-3',
      md: 'px-6 py-4',
      lg: 'px-8 py-6',
    },
  },
  defaultVariants: {
    padding: 'md',
  },
});

export interface BaseCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  headerClassName?: string;
  footerClassName?: string;
  contentClassName?: string;
  noDivider?: boolean;
}

const BaseCard = React.forwardRef<HTMLDivElement, BaseCardProps>(
  (
    {
      className,
      children,
      variant,
      padding,
      header,
      footer,
      headerClassName,
      footerClassName,
      contentClassName,
      noDivider = false,
      ...props
    },
    ref
  ) => {
    const hasHeader = Boolean(header);
    const hasFooter = Boolean(footer);
    const showDividers = !noDivider && (hasHeader || hasFooter);

    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding: 'none', className }))}
        {...props}
      >
        {header && (
          <div
            className={cn(
              headerVariants({ padding }),
              showDividers && 'border-b border-gray-200',
              headerClassName
            )}
          >
            {header}
          </div>
        )}
        
        <div
          className={cn(
            padding && padding !== 'none' ? headerVariants({ padding }) : '',
            contentClassName
          )}
        >
          {children}
        </div>

        {footer && (
          <div
            className={cn(
              footerVariants({ padding }),
              showDividers && 'border-t border-gray-200',
              footerClassName
            )}
          >
            {footer}
          </div>
        )}
      </div>
    );
  }
);

BaseCard.displayName = 'BaseCard';

export default BaseCard; 