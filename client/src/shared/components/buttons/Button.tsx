import React from 'react';
import clsx from 'clsx';
import { tokens } from '@/shared/styles/tokens';

const variants = {
  primary: 'bg-gradient-to-b from-blue-400 to-blue-500 text-white shadow-blue-200/50',
  secondary: 'bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900 shadow-gray-200/50',
  danger: 'bg-gradient-to-b from-red-400 to-red-500 text-white shadow-red-200/50',
  success: 'bg-gradient-to-b from-green-400 to-green-500 text-white shadow-green-200/50',
  glass: 'bg-white/80 backdrop-blur-sm border border-white/20 text-gray-900 shadow-gray-200/50',
} as const;

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
} as const;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  isLoading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  startIcon,
  endIcon,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={isLoading || disabled}
      className={clsx(
        'relative inline-flex items-center justify-center font-medium',
        'rounded-xl shadow-lg',
        'transition-all duration-200 ease-out',
        'hover:translate-y-[-1px] hover:shadow-xl active:translate-y-[1px]',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none',
        variants[variant],
        sizes[size],
        variant === 'primary' && 'focus:ring-blue-200',
        variant === 'secondary' && 'focus:ring-gray-200',
        variant === 'danger' && 'focus:ring-red-200',
        variant === 'success' && 'focus:ring-green-200',
        variant === 'glass' && 'focus:ring-gray-200',
        className
      )}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {startIcon && <span className="mr-2 -ml-1">{startIcon}</span>}
          {children}
          {endIcon && <span className="ml-2 -mr-1">{endIcon}</span>}
        </>
      )}
    </button>
  );
} 