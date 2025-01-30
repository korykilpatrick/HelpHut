import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const inputVariants = cva(
  'flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-input shadow-warm-sm hover:shadow-warm-md',
        error: 'border-destructive shadow-warm-sm focus-visible:ring-destructive',
        success: 'border-success shadow-warm-sm focus-visible:ring-success',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const labelVariants = cva('text-sm font-medium', {
  variants: {
    variant: {
      default: 'text-foreground',
      error: 'text-destructive',
      success: 'text-success',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const helperTextVariants = cva('mt-1.5 text-sm', {
  variants: {
    variant: {
      default: 'text-muted-foreground',
      error: 'text-destructive',
      success: 'text-success',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface BaseInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'>,
    VariantProps<typeof inputVariants> {
  error?: boolean;
  success?: boolean;
  label?: string;
  helperText?: string;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const BaseInput = React.forwardRef<HTMLInputElement, BaseInputProps>(
  (
    {
      className,
      type = 'text',
      variant,
      error,
      success,
      disabled,
      label,
      helperText,
      id,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    // Generate an ID if none provided
    const inputId = id || `input-${React.useId()}`;
    
    // Determine variant based on state
    const inputVariant = error ? 'error' : success ? 'success' : variant;
    
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(labelVariants({ variant: inputVariant }))}
          >
            {label}
          </label>
        )}
        <div className="relative mt-1.5">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              inputVariants({ variant: inputVariant }),
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            ref={ref}
            disabled={disabled}
            id={inputId}
            {...props}
          />
          {rightIcon && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>
        {helperText && (
          <p className={cn(helperTextVariants({ variant: inputVariant }))}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

BaseInput.displayName = 'BaseInput';

export default BaseInput; 
