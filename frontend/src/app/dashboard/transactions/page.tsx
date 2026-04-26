'use client';

import { useState, type FormEvent } from 'react';
import { Plus, Trash2, ArrowLeftRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTransactions, useCreateTransaction, useDeleteTransaction, useCashAccounts } from '@/lib/queries';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import type { TransactionParams } from '@/lib/queries';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';

const typeOptions = [
  { value: '', label: 'All Types' },
  { value: 'Income', label: 'Income' },
  { value: 'Expense', label: 'Expense' },
  { value: 'Transfer', label: 'Transfer' },
];

const categoryOptions = [
  { value: '', label: 'All Categories' },
  { value: 'Salary', label: 'Salary' },
  { value: 'Investment', label: 'Investment' },
  { value: 'Dividend', label: 'Dividend' },
  { value: 'Rental', label: 'Rental' },
  { value: 'Freelance', label: 'Freelance' },
  { value: 'Food', label: 'Food' },
  { value: 'Transport', label: 'Transport' },
  { value: 'Housing', label: 'Housing' },
  { value: 'Utilities', label: 'Utilities' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Education', label: 'Education' },
  { value: 'Shopping', label: 'Shopping' },
  { value: 'Insurance', label: 'Insurance' },
  { value: 'Tax', label: 'Tax' },
  { value: 'LoanPayment', label: 'Loan Payment' },
  { value: 'Other', label: 'Other' },
];

export default function TransactionsPage() {
  const [filters, setFilters] = useState<TransactionParams>({
    page: 1,
    pageSize: 10,
  });
  const { data, isLoading } = useTransactions(filters);
  const { data: cashAccounts } = useCashAccounts();
  const createTransaction = useCreateTransaction();
  const deleteTransaction = useDeleteTransaction();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    cashAccountId: '',
    amount: '',
    type: 'Expense',
    category: 'Other',
    description: '',
    transactionDate: '',
    currency: 'USD',
  });

  function handleFilterChange(field: string, value: string) {
    setFilters((prev) => ({ ...prev, [field]: value || undefined, page: 1 }));
  }

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await createTransaction.mutateAsync({
      cashAccountId: form.cashAccountId,
      amount: Number(form.amount),
      type: form.type as 'Income' | 'Expense' | 'Transfer',
      category: form.category as any,
      description: form.description,
      transactionDate: form.transactionDate,
      currency: form.currency,
    });
    setShowModal(false);
    setForm({ cashAccountId: '', amount: '', type: 'Expense', category: 'Other', description: '', transactionDate: '', currency: 'USD' });
  }

  async function handleDelete(id: string) {
    if (confirm('Delete this transaction?')) {
      await deleteTransaction.mutateAsync(id);
    }
  }

  const transactions = data?.items || [];
  const totalPages = data?.totalPages || 1;
  const currentPage = filters.page || 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">Transactions</h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">{data?.totalCount ?? 0} total transactions</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={16} className="mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Input
            label="Start Date"
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
          />
          <Input
            label="End Date"
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
          />
          <Select
            label="Type"
            value={filters.type || ''}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            options={typeOptions}
          />
          <Select
            label="Category"
            value={filters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            options={categoryOptions}
          />
        </div>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : transactions.length === 0 ? (
        <Card>
          <EmptyState
            icon={<ArrowLeftRight size={48} />}
            title="No transactions found"
            description="Try adjusting your filters or add a new transaction"
            actionLabel="Add Transaction"
            onAction={() => setShowModal(true)}
          />
        </Card>
      ) : (
        <>
          <Card padding={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left py-4 px-6 text-xs font-medium text-stone-400 dark:text-stone-500 uppercase tracking-wider">Date</th>
                    <th className="text-left py-4 px-6 text-xs font-medium text-stone-400 dark:text-stone-500 uppercase tracking-wider">Description</th>
                    <th className="text-left py-4 px-6 text-xs font-medium text-stone-400 dark:text-stone-500 uppercase tracking-wider">Category</th>
                    <th className="text-left py-4 px-6 text-xs font-medium text-stone-400 dark:text-stone-500 uppercase tracking-wider">Type</th>
                    <th className="text-right py-4 px-6 text-xs font-medium text-stone-400 dark:text-stone-500 uppercase tracking-wider">Amount</th>
                    <th className="text-right py-4 px-6 text-xs font-medium text-stone-400 dark:text-stone-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-[var(--border)] hover:bg-[var(--elevated)]/50 transition-colors">
                      <td className="py-4 px-6 text-stone-600 dark:text-stone-300">{formatDate(tx.transactionDate)}</td>
                      <td className="py-4 px-6 text-stone-800 dark:text-stone-200 font-medium">{tx.description}</td>
                      <td className="py-4 px-6">
                        <Badge variant="default">{tx.category}</Badge>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant={tx.type === 'Income' ? 'success' : tx.type === 'Expense' ? 'danger' : 'info'}>
                          {tx.type}
                        </Badge>
                      </td>
                      <td className={cn('py-4 px-6 text-right font-semibold', tx.type === 'Income' ? 'text-emerald-600 dark:text-emerald-400' : tx.type === 'Expense' ? 'text-red-600 dark:text-rose-400' : 'text-blue-600 dark:text-blue-400')}>
                        {tx.type === 'Income' ? '+' : tx.type === 'Expense' ? '-' : ''}
                        {formatCurrency(tx.amount, tx.currency)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDelete(tx.id)}
                          className="p-2 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 dark:text-stone-500 dark:hover:text-rose-400 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-stone-400 dark:text-stone-500">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setFilters((p) => ({ ...p, page: (p.page || 1) - 1 }))}
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setFilters((p) => ({ ...p, page: (p.page || 1) + 1 }))}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Transaction">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Description" placeholder="Grocery shopping" value={form.description} onChange={(e) => handleChange('description', e.target.value)} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Amount" type="number" placeholder="50.00" value={form.amount} onChange={(e) => handleChange('amount', e.target.value)} required min="0" step="0.01" />
            <Input label="Date" type="date" value={form.transactionDate} onChange={(e) => handleChange('transactionDate', e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Type"
              value={form.type}
              onChange={(e) => handleChange('type', e.target.value)}
              options={typeOptions.filter((o) => o.value !== '')}
            />
            <Select
              label="Category"
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value)}
              options={categoryOptions.filter((o) => o.value !== '')}
            />
          </div>
          {cashAccounts && cashAccounts.length > 0 && (
            <Select
              label="Cash Account"
              value={form.cashAccountId}
              onChange={(e) => handleChange('cashAccountId', e.target.value)}
              placeholder="Select an account"
              options={cashAccounts.map((a) => ({ value: a.id, label: `${a.name} (${a.institution})` }))}
            />
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" loading={createTransaction.isPending}>Add Transaction</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
