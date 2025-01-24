import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import clsx from 'clsx';
import { tokens } from '@/shared/styles/tokens';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  registration?: Partial<UseFormRegisterReturn>;
  containerClassName?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  registration,
  containerClassName,
  className,
  type = 'text',
  helperText,
  ...props
}: InputProps) {
  const inputId = React.useId();
  
  return (
    <div className={clsx('w-full space-y-1.5', containerClassName)}>
      <div className="flex justify-between">
        <label 
          htmlFor={inputId}
          className={clsx(
            'text-sm font-medium transition-colors duration-200',
            error ? 'text-red-500' : 'text-gray-700'
          )}
        >
          {label}
        </label>
        {helperText && (
          <span className="text-xs text-gray-500">{helperText}</span>
        )}
      </div>
      <div className="relative">
        <input
          id={inputId}
          type={type}
          {...registration}
          {...props}
          className={clsx(
            'block w-full appearance-none rounded-lg bg-white/75 px-3 py-2',
            'border border-gray-200 text-gray-900 text-sm',
            'transition-all duration-200 ease-out',
            'hover:border-gray-300 hover:bg-white',
            'focus:border-transparent focus:outline-none focus:ring-2',
            error
              ? 'border-red-300 focus:ring-red-100'
              : 'focus:ring-blue-100',
            'disabled:bg-gray-50 disabled:text-gray-500',
            'placeholder:text-gray-400 placeholder:text-sm',
            className
          )}
        />
        {error && (
          <div className="mt-1 text-xs text-red-500">{error}</div>
        )}
      </div>
    </div>
  );
} 