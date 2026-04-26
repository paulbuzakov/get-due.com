'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { NetWorthHistoryPoint } from '@/types';
import { useChartColors } from '@/stores/themeStore';

interface NetWorthChartProps {
  data: NetWorthHistoryPoint[];
}

function CustomTooltipInner({ active, payload, label, colors }: { active?: boolean; payload?: Array<{ value: number }>; label?: string; colors: ReturnType<typeof useChartColors> }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl px-3 py-2 shadow-lg border" style={{ background: colors.tooltipBg, borderColor: colors.tooltipBorder }}>
        <p className="text-sm font-medium" style={{ color: colors.tooltipText }}>{label}</p>
        <p className="text-sm font-semibold text-emerald-500">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
}

export default function NetWorthChart({ data }: NetWorthChartProps) {
  const colors = useChartColors();

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-stone-400 dark:text-stone-500 text-sm">
        No net worth history available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
        <XAxis
          dataKey="label"
          tick={{ fill: colors.tick, fontSize: 12 }}
          axisLine={{ stroke: colors.axis }}
        />
        <YAxis
          tick={{ fill: colors.tick, fontSize: 12 }}
          axisLine={{ stroke: colors.axis }}
          tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltipInner colors={colors} />} />
        <Area
          type="monotone"
          dataKey="netWorth"
          stroke="#10b981"
          strokeWidth={2}
          fill="url(#netWorthGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
