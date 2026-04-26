import { cn } from '@/lib/utils';
import type { SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
}

export default function Select({ label, options, error, placeholder, className, id, ...props }: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          'w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-sm text-stone-900 dark:text-stone-100',
          'focus:outline-none focus:ring-2 focus:ring-stone-400/40 focus:border-stone-400 dark:focus:ring-stone-500/40 dark:focus:border-stone-500 transition-colors',
          'appearance-none cursor-pointer',
          error && 'border-red-500 focus:ring-red-500/40 focus:border-red-500',
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" className="text-stone-400">
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-red-500 dark:text-rose-400">{error}</p>}
    </div>
  );
}
