import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/20',
  danger: 'bg-red-50 text-red-700 border-red-200 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/20',
  warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/20',
  info: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/20',
  default: 'bg-stone-100 text-stone-600 border-stone-200 dark:bg-stone-500/15 dark:text-stone-400 dark:border-stone-500/20',
};

export default function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
