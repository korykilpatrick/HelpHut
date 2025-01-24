import React from 'react';
import clsx from 'clsx';
import { tokens } from '@/shared/styles/tokens';

interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  rightElement?: React.ReactNode;
}

export function FormSection({
  title,
  description,
  children,
  className,
  rightElement,
}: FormSectionProps) {
  return (
    <div className={clsx(
      'rounded-2xl bg-white/50 backdrop-blur-sm p-5',
      'border border-gray-100',
      'transition-all duration-200 ease-out',
      'hover:shadow-lg hover:bg-white/80',
      className
    )}>
      {(title || description || rightElement) && (
        <div className="mb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              {title && (
                <h3 className="text-base font-semibold leading-6 text-gray-900 tracking-tight">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-sm text-gray-500">
                  {description}
                </p>
              )}
            </div>
            {rightElement && (
              <div className="ml-4">{rightElement}</div>
            )}
          </div>
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
} 