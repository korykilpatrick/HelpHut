import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import clsx from 'clsx';
import { tokens } from '@/shared/styles/tokens';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
  registration?: Partial<UseFormRegisterReturn>;
  containerClassName?: string;
  description?: string;
}

export function Checkbox({
  label,
  error,
  registration,
  containerClassName,
  className,
  description,
  ...props
}: CheckboxProps) {
  const checkboxId = React.useId();

  return (
    <div className={clsx('relative flex', containerClassName)}>
      <div className="flex h-6 items-center">
        <input
          id={checkboxId}
          type="checkbox"
          {...registration}
          {...props}
          className={clsx(
            'h-5 w-5 rounded-md border-2 border-gray-200',
            'text-blue-500 transition-all duration-200',
            'hover:border-gray-300',
            'focus:ring-2 focus:ring-blue-100 focus:ring-offset-0',
            'checked:border-blue-500 checked:bg-blue-500',
            'disabled:opacity-50',
            error && 'border-red-300',
            className
          )}
        />
      </div>
      <div className="ml-3">
        <label
          htmlFor={checkboxId}
          className={clsx(
            'text-sm font-medium',
            error ? 'text-red-500' : 'text-gray-700'
          )}
        >
          {label}
        </label>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        )}
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
} 