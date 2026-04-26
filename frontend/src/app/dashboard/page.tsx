'use client';

import { DollarSign, TrendingUp, TrendingDown, Coins } from 'lucide-react';
import { usePortfolioSummary, useNetWorthHistory } from '@/lib/queries';
import { formatCurrency } from '@/lib/utils';
import StatCard from '@/components/dashboard/StatCard';
import UpcomingPayments from '@/components/dashboard/UpcomingPayments';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import AssetAllocationChart from '@/components/charts/AssetAllocationChart';
import NetWorthChart from '@/components/charts/NetWorthChart';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DashboardPage() {
  const { data: summary, isLoading: summaryLoading } = usePortfolioSummary();
  const { data: netWorthHistory, isLoading: historyLoading } = useNetWorthHistory();

  if (summaryLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stat cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<DollarSign size={20} />}
          label="Net Worth"
          value={formatCurrency(summary?.netWorth ?? 0)}
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="Monthly Income"
          value={formatCurrency(summary?.monthlyIncome ?? 0)}
        />
        <StatCard
          icon={<TrendingDown size={20} />}
          label="Monthly Expenses"
          value={formatCurrency(summary?.monthlyExpenses ?? 0)}
        />
        <StatCard
          icon={<Coins size={20} />}
          label="Passive Income"
          value={formatCurrency(summary?.passiveIncome ?? 0)}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Asset Allocation">
          <AssetAllocationChart data={summary?.assetAllocation ?? []} />
        </Card>
        <Card title="Net Worth Trend">
          {historyLoading ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner />
            </div>
          ) : (
            <NetWorthChart data={netWorthHistory ?? []} />
          )}
        </Card>
      </div>

      {/* Payments & Transactions row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingPayments />
        <RecentTransactions />
      </div>
    </div>
  );
}
