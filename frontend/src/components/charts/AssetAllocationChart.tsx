'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useChartColors } from '@/stores/themeStore';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'];

interface AssetAllocationData {
  category: string;
  value: number;
  percentage: number;
}

interface AssetAllocationChartProps {
  data: AssetAllocationData[];
}

function CustomTooltipInner({ active, payload, colors }: { active?: boolean; payload?: Array<{ payload: AssetAllocationData }>; colors: ReturnType<typeof useChartColors> }) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="rounded-xl px-3 py-2 shadow-lg border" style={{ background: colors.tooltipBg, borderColor: colors.tooltipBorder }}>
        <p className="text-sm font-medium" style={{ color: colors.tooltipText }}>{item.category}</p>
        <p className="text-xs" style={{ color: colors.tooltipMuted }}>
          {item.percentage.toFixed(1)}% - ${item.value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderLabel(props: any) {
  const { percentage } = props as AssetAllocationData;
  if (!percentage || percentage < 5) return null;
  return `${percentage.toFixed(0)}%`;
}

export default function AssetAllocationChart({ data }: AssetAllocationChartProps) {
  const colors = useChartColors();

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-stone-400 dark:text-stone-500 text-sm">
        No allocation data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
          nameKey="category"
          label={renderLabel}
          labelLine={false}
        >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltipInner colors={colors} />} />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value: string) => <span className="text-xs text-stone-500 dark:text-stone-400">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
