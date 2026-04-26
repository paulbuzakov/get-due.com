'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
}

export default function StatCard({ icon, label, value, change, changeLabel }: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-xl bg-[var(--elevated)] text-stone-500 dark:text-stone-400">{icon}</div>
        {change !== undefined && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
              isPositive
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                : 'bg-red-50 text-red-700 dark:bg-rose-500/10 dark:text-rose-400'
            )}
          >
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-1">{value}</p>
      <p className="text-sm text-stone-500 dark:text-stone-400">
        {label}
        {changeLabel && <span className="ml-1 text-stone-400 dark:text-stone-500">{changeLabel}</span>}
      </p>
    </div>
  );
}
