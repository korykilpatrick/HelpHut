import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const textVariants = cva('text-gray-900', {
  variants: {
    variant: {
      default: '',
      muted: 'text-gray-500',
      success: 'text-green-600',
      warning: 'text-yellow-600',
      error: 'text-red-600',
    },
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
    },
    weight: {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
    leading: {
      none: 'leading-none',
      tight: 'leading-tight',
      normal: 'leading-normal',
      relaxed: 'leading-relaxed',
    },
    transform: {
      none: '',
      uppercase: 'uppercase',
      lowercase: 'lowercase',
      capitalize: 'capitalize',
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'base',
    weight: 'normal',
    align: 'left',
    leading: 'normal',
    transform: 'none',
  },
});

export interface BaseTextProps
  extends Omit<React.HTMLAttributes<HTMLParagraphElement>, 'className'>,
    VariantProps<typeof textVariants> {
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  truncate?: boolean;
  className?: string;
}

const BaseText = React.forwardRef<HTMLParagraphElement, BaseTextProps>(
  (
    {
      as: Component = 'p',
      children,
      className,
      variant,
      size,
      weight,
      align,
      leading,
      transform,
      truncate,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          textVariants({
            variant,
            size,
            weight,
            align,
            leading,
            transform,
          }),
          truncate && 'truncate',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

BaseText.displayName = 'BaseText';

export default BaseText; 