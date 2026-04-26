import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import LoadingSpinner from './LoadingSpinner';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-stone-900 text-white hover:bg-stone-800 focus:ring-stone-500/40 active:bg-stone-950 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-100 dark:active:bg-stone-200 dark:focus:ring-stone-400/40',
  secondary:
    'bg-[var(--elevated)] text-stone-700 hover:bg-stone-200 focus:ring-stone-400/40 border border-[var(--border)] dark:text-stone-300 dark:hover:bg-stone-700',
  danger:
    'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500/40 active:bg-red-700 dark:bg-rose-600 dark:hover:bg-rose-500',
  ghost:
    'bg-transparent text-stone-600 hover:bg-stone-100 hover:text-stone-900 focus:ring-stone-400/40 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, children, className, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading && (
          <span className="mr-2">
            <LoadingSpinner size="sm" />
          </span>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
