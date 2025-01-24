import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const statusVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        error: 'bg-red-100 text-red-800',
        info: 'bg-blue-100 text-blue-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface StatusBadgeProps extends VariantProps<typeof statusVariants> {
  label: string;
  className?: string;
}

export function StatusBadge({ label, variant, className }: StatusBadgeProps) {
  return (
    <span className={cn(statusVariants({ variant }), className)}>
      {label}
    </span>
  );
} 
