import React from 'react';
import { Link } from 'react-router-dom';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const linkVariants = cva(
  'inline-flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'text-gray-900 hover:text-gray-700',
        muted: 'text-gray-500 hover:text-gray-900',
        primary: 'text-blue-600 hover:text-blue-700',
        destructive: 'text-red-600 hover:text-red-700',
      },
      underline: {
        true: 'underline-offset-4 hover:underline',
        false: 'no-underline',
      },
    },
    defaultVariants: {
      variant: 'default',
      underline: false,
    },
  }
);

export interface BaseLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'className'>,
    VariantProps<typeof linkVariants> {
  to?: string;
  external?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const BaseLink = React.forwardRef<HTMLAnchorElement, BaseLinkProps>(
  (
    {
      children,
      to,
      external,
      className,
      variant,
      underline,
      icon,
      ...props
    },
    ref
  ) => {
    const linkClass = cn(
      linkVariants({
        variant,
        underline,
        className,
      })
    );

    // External link
    if (external || !to) {
      return (
        <a
          ref={ref}
          className={linkClass}
          href={to}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
          {icon && <span className="inline-block">{icon}</span>}
        </a>
      );
    }

    // Internal link (react-router)
    return (
      <Link ref={ref} to={to} className={linkClass} {...props}>
        {children}
        {icon && <span className="inline-block">{icon}</span>}
      </Link>
    );
  }
);

BaseLink.displayName = 'BaseLink';

export default BaseLink; 