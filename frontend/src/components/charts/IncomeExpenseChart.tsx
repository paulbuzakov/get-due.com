'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useChartColors } from '@/stores/themeStore';

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
}

interface IncomeExpenseChartProps {
  data: MonthlyData[];
}

function CustomTooltipInner({ active, payload, label, colors }: { active?: boolean; payload?: Array<{ value: number; dataKey: string }>; label?: string; colors: ReturnType<typeof useChartColors> }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl px-3 py-2 shadow-lg border" style={{ background: colors.tooltipBg, borderColor: colors.tooltipBorder }}>
        <p className="text-sm font-medium mb-1" style={{ color: colors.tooltipText }}>{label}</p>
        {payload.map((entry) => (
          <p key={entry.dataKey} className="text-xs" style={{ color: colors.tooltipMuted }}>
            <span className={entry.dataKey === 'income' ? 'text-emerald-500' : 'text-red-500'}>
              {entry.dataKey === 'income' ? 'Income' : 'Expenses'}
            </span>
            : ${entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  const colors = useChartColors();

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-stone-400 dark:text-stone-500 text-sm">
        No cash flow data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
        <XAxis dataKey="month" tick={{ fill: colors.tick, fontSize: 12 }} axisLine={{ stroke: colors.axis }} />
        <YAxis tick={{ fill: colors.tick, fontSize: 12 }} axisLine={{ stroke: colors.axis }} />
        <Tooltip content={<CustomTooltipInner colors={colors} />} />
        <Legend
          formatter={(value: string) => (
            <span className="text-xs text-stone-500 dark:text-stone-400 capitalize">{value}</span>
          )}
        />
        <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
