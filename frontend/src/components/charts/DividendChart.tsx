'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useChartColors } from '@/stores/themeStore';

interface DividendData {
  month: string;
  amount: number;
}

interface DividendChartProps {
  data: DividendData[];
}

function CustomTooltipInner({ active, payload, label, colors }: { active?: boolean; payload?: Array<{ value: number }>; label?: string; colors: ReturnType<typeof useChartColors> }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl px-3 py-2 shadow-lg border" style={{ background: colors.tooltipBg, borderColor: colors.tooltipBorder }}>
        <p className="text-sm font-medium" style={{ color: colors.tooltipText }}>{label}</p>
        <p className="text-sm font-semibold text-blue-500">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
}

export default function DividendChart({ data }: DividendChartProps) {
  const colors = useChartColors();

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-stone-400 dark:text-stone-500 text-sm">
        No dividend data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
        <XAxis
          dataKey="month"
          tick={{ fill: colors.tick, fontSize: 12 }}
          axisLine={{ stroke: colors.axis }}
        />
        <YAxis
          tick={{ fill: colors.tick, fontSize: 12 }}
          axisLine={{ stroke: colors.axis }}
        />
        <Tooltip content={<CustomTooltipInner colors={colors} />} />
        <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
