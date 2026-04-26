'use client';

import { DollarSign, TrendingUp, TrendingDown, PieChart as PieChartIcon, BarChart, Percent } from 'lucide-react';
import { usePortfolioSummary, useNetWorth, useCashFlow, useNetWorthHistory } from '@/lib/queries';
import { formatCurrency } from '@/lib/utils';
import StatCard from '@/components/dashboard/StatCard';
import AssetAllocationChart from '@/components/charts/AssetAllocationChart';
import NetWorthChart from '@/components/charts/NetWorthChart';
import IncomeExpenseChart from '@/components/charts/IncomeExpenseChart';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AnalyticsPage() {
  const { data: summary, isLoading: summaryLoading } = usePortfolioSummary();
  const { data: netWorth, isLoading: netWorthLoading } = useNetWorth();
  const { data: cashFlow } = useCashFlow();
  const { data: history, isLoading: historyLoading } = useNetWorthHistory();

  if (summaryLoading || netWorthLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const incomeExpenseData = cashFlow
    ? [
        {
          month: `${cashFlow.year}-${String(cashFlow.month).padStart(2, '0')}`,
          income: cashFlow.totalIncome,
          expenses: cashFlow.totalExpenses,
        },
      ]
    : [];

  return (
    <div className="space-y-8">
      {/* Key metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<DollarSign size={20} />}
          label="Total Assets"
          value={formatCurrency(netWorth?.totalAssets ?? 0)}
        />
        <StatCard
          icon={<TrendingDown size={20} />}
          label="Total Liabilities"
          value={formatCurrency(netWorth?.totalLiabilities ?? 0)}
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="Net Worth"
          value={formatCurrency(netWorth?.netWorth ?? 0)}
        />
        <StatCard
          icon={<Percent size={20} />}
          label="Debt to Income"
          value={`${(summary?.debtToIncomeRatio ?? 0).toFixed(1)}%`}
        />
      </div>

      {/* Asset breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
              <TrendingUp size={18} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-sm text-stone-500 dark:text-stone-400">Stocks</span>
          </div>
          <p className="text-xl font-bold text-stone-900 dark:text-stone-100">{formatCurrency(netWorth?.stocksValue ?? 0)}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-500/10">
              <PieChartIcon size={18} className="text-violet-600 dark:text-violet-400" />
            </div>
            <span className="text-sm text-stone-500 dark:text-stone-400">Real Estate</span>
          </div>
          <p className="text-xl font-bold text-stone-900 dark:text-stone-100">{formatCurrency(netWorth?.realEstateValue ?? 0)}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10">
              <DollarSign size={18} className="text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm text-stone-500 dark:text-stone-400">Cash</span>
          </div>
          <p className="text-xl font-bold text-stone-900 dark:text-stone-100">{formatCurrency(netWorth?.cashValue ?? 0)}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-red-50 dark:bg-rose-500/10">
              <BarChart size={18} className="text-red-600 dark:text-rose-400" />
            </div>
            <span className="text-sm text-stone-500 dark:text-stone-400">Loans Total</span>
          </div>
          <p className="text-xl font-bold text-red-600 dark:text-rose-400">{formatCurrency(netWorth?.loansTotal ?? 0)}</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Net Worth Over Time">
          {historyLoading ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner />
            </div>
          ) : (
            <NetWorthChart data={history ?? []} />
          )}
        </Card>
        <Card title="Asset Allocation">
          <AssetAllocationChart data={summary?.assetAllocation ?? []} />
        </Card>
      </div>

      <Card title="Income vs Expenses">
        <IncomeExpenseChart data={incomeExpenseData} />
      </Card>

      {/* Cash flow breakdown */}
      {cashFlow && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Income by Category">
            <div className="space-y-3">
              {Object.entries(cashFlow.incomeByCategory || {}).map(([category, amount]) => (
                <div key={category} className="flex items-center justify-between py-2">
                  <span className="text-sm text-stone-600 dark:text-stone-300">{category}</span>
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">+{formatCurrency(amount)}</span>
                </div>
              ))}
              {Object.keys(cashFlow.incomeByCategory || {}).length === 0 && (
                <p className="text-sm text-stone-400 dark:text-stone-500 text-center py-4">No income data</p>
              )}
            </div>
          </Card>
          <Card title="Expenses by Category">
            <div className="space-y-3">
              {Object.entries(cashFlow.expensesByCategory || {}).map(([category, amount]) => (
                <div key={category} className="flex items-center justify-between py-2">
                  <span className="text-sm text-stone-600 dark:text-stone-300">{category}</span>
                  <span className="text-sm font-semibold text-red-600 dark:text-rose-400">-{formatCurrency(amount)}</span>
                </div>
              ))}
              {Object.keys(cashFlow.expensesByCategory || {}).length === 0 && (
                <p className="text-sm text-stone-400 dark:text-stone-500 text-center py-4">No expense data</p>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
