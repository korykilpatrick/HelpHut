import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import clsx from 'clsx';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  registration?: Partial<UseFormRegisterReturn>;
  containerClassName?: string;
}

export function Textarea({
  label,
  error,
  registration,
  containerClassName,
  className,
  rows = 3,
  ...props
}: TextareaProps) {
  return (
    <div className={clsx('w-full', containerClassName)}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        rows={rows}
        {...registration}
        {...props}
        className={clsx(
          'block w-full rounded-md border-gray-300 shadow-sm transition-colors',
          'focus:border-blue-500 focus:ring-blue-500',
          'disabled:bg-gray-50 disabled:text-gray-500',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
          className
        )}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
} 