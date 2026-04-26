'use client';

import { CalendarDays } from 'lucide-react';
import { useRecurringPayments } from '@/lib/queries';
import { formatCurrency, formatDate } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';

export default function UpcomingPayments() {
  const { data: payments, isLoading } = useRecurringPayments();

  if (isLoading) {
    return (
      <Card title="Upcoming Payments">
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      </Card>
    );
  }

  const activePayments = (payments || [])
    .filter((p) => p.isActive)
    .sort((a, b) => new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime())
    .slice(0, 5);

  if (activePayments.length === 0) {
    return (
      <Card title="Upcoming Payments">
        <EmptyState
          icon={<CalendarDays size={40} />}
          title="No upcoming payments"
          description="Add recurring payments to track them here"
        />
      </Card>
    );
  }

  return (
    <Card title="Upcoming Payments">
      <div className="space-y-3">
        {activePayments.map((payment) => (
          <div
            key={payment.id}
            className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[var(--elevated)]">
                <CalendarDays size={16} className="text-stone-500 dark:text-stone-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-800 dark:text-stone-200">{payment.name}</p>
                <p className="text-xs text-stone-400 dark:text-stone-500">{formatDate(payment.nextPaymentDate)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-red-600 dark:text-rose-400">
                -{formatCurrency(payment.amount, payment.currency)}
              </p>
              <Badge variant="default">{payment.frequency}</Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
