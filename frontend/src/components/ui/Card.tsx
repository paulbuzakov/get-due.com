import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

export default function Card({ title, subtitle, children, className, padding = true }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm transition-shadow duration-200 hover:shadow-md',
        padding && 'p-6',
        className
      )}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">{title}</h3>}
          {subtitle && <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
