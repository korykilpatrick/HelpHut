import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const cardVariants = cva(
  'rounded-lg bg-card text-card-foreground transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'border border-border shadow-soft-sm hover:shadow-soft-md',
        elevated: 'shadow-soft-md hover:shadow-soft-lg hover:-translate-y-0.5',
        ghost: 'shadow-none border-0',
        glass: 'glass-panel shadow-soft-sm',
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
      variant,
      padding,
      header,
      footer,
      headerClassName,
      footerClassName,
      contentClassName,
      noDivider = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, className }))}
        {...props}
      >
        {header && (
          <>
            <div
              className={cn(
                headerVariants({ padding }),
                'font-medium',
                headerClassName
              )}
            >
              {header}
            </div>
            {!noDivider && <div className="border-b border-border" />}
          </>
        )}
        <div className={cn('', contentClassName)}>{children}</div>
        {footer && (
          <>
            {!noDivider && <div className="border-t border-border" />}
            <div
              className={cn(
                footerVariants({ padding }),
                'text-sm text-muted-foreground',
                footerClassName
              )}
            >
              {footer}
            </div>
          </>
        )}
      </div>
    );
  }
);

BaseCard.displayName = 'BaseCard';

export default BaseCard; 