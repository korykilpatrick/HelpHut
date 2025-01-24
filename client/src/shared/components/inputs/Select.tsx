import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import clsx from 'clsx';
import { tokens } from '@/shared/styles/tokens';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  error?: string;
  registration?: Partial<UseFormRegisterReturn>;
  containerClassName?: string;
  helperText?: string;
  placeholder?: string;
}

export function Select({
  label,
  options,
  error,
  registration,
  containerClassName,
  className,
  helperText,
  placeholder,
  ...props
}: SelectProps) {
  const selectId = React.useId();

  return (
    <div className={clsx('w-full space-y-1.5', containerClassName)}>
      <div className="flex justify-between">
        <label
          htmlFor={selectId}
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
        <select
          id={selectId}
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
            className
          )}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <svg
            className={clsx(
              'h-4 w-4 transition-colors duration-200',
              error ? 'text-red-400' : 'text-gray-400'
            )}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        {error && (
          <div className="mt-1 text-xs text-red-500">{error}</div>
        )}
      </div>
    </div>
  );
} 