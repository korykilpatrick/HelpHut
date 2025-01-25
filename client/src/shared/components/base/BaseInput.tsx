import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const inputVariants = cva(
  'w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white transition-colors disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2',
        error:
          'border-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BaseInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'>,
    VariantProps<typeof inputVariants> {
  error?: boolean;
  label?: string;
  helperText?: string;
  className?: string;
}

const BaseInput = React.forwardRef<HTMLInputElement, BaseInputProps>(
  (
    {
      className,
      type = 'text',
      variant,
      error,
      disabled,
      label,
      helperText,
      id,
      ...props
    },
    ref
  ) => {
    // Generate an ID if none provided
    const inputId = id || `input-${React.useId()}`;
    
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            inputVariants({
              variant: error ? 'error' : variant,
              className,
            })
          )}
          ref={ref}
          disabled={disabled}
          id={inputId}
          {...props}
        />
        {helperText && (
          <p
            className={cn(
              'mt-2 text-sm',
              error ? 'text-red-500' : 'text-gray-500'
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

BaseInput.displayName = 'BaseInput';

export default BaseInput; 
