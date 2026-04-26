'use client';

import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from 'lucide-react';
import { useTransactions } from '@/lib/queries';
import { formatCurrency, formatDate } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';

export default function RecentTransactions() {
  const { data, isLoading } = useTransactions({ page: 1, pageSize: 5 });

  if (isLoading) {
    return (
      <Card title="Recent Transactions">
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      </Card>
    );
  }

  const transactions = data?.items || [];

  if (transactions.length === 0) {
    return (
      <Card title="Recent Transactions">
        <EmptyState
          icon={<ArrowLeftRight size={40} />}
          title="No transactions yet"
          description="Record your first transaction to see it here"
        />
      </Card>
    );
  }

  function getIcon(type: string) {
    if (type === 'Income') return <ArrowDownLeft size={16} className="text-emerald-600 dark:text-emerald-400" />;
    if (type === 'Expense') return <ArrowUpRight size={16} className="text-red-600 dark:text-rose-400" />;
    return <ArrowLeftRight size={16} className="text-blue-600 dark:text-blue-400" />;
  }

  return (
    <Card title="Recent Transactions">
      <div className="space-y-3">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[var(--elevated)]">{getIcon(tx.type)}</div>
              <div>
                <p className="text-sm font-medium text-stone-800 dark:text-stone-200">{tx.description}</p>
                <p className="text-xs text-stone-400 dark:text-stone-500">{formatDate(tx.transactionDate)}</p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`text-sm font-semibold ${
                  tx.type === 'Income'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : tx.type === 'Expense'
                    ? 'text-red-600 dark:text-rose-400'
                    : 'text-blue-600 dark:text-blue-400'
                }`}
              >
                {tx.type === 'Income' ? '+' : tx.type === 'Expense' ? '-' : ''}
                {formatCurrency(tx.amount, tx.currency)}
              </p>
              <Badge variant={tx.type === 'Income' ? 'success' : tx.type === 'Expense' ? 'danger' : 'info'}>
                {tx.category}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
