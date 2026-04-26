'use client';

import { useState, type FormEvent } from 'react';
import { Plus, CreditCard, Trash2 } from 'lucide-react';
import { useLoans, useCreateLoan, useDeleteLoan } from '@/lib/queries';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';

export default function LiabilitiesPage() {
  const { data: loans, isLoading } = useLoans();
  const createLoan = useCreateLoan();
  const deleteLoan = useDeleteLoan();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    loanType: 'Personal',
    principal: '',
    interestRate: '',
    monthlyPayment: '',
    remainingBalance: '',
    startDate: '',
    endDate: '',
    currency: 'USD',
    notes: '',
  });

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await createLoan.mutateAsync({
      name: form.name,
      loanType: form.loanType as 'Mortgage' | 'Personal' | 'Auto' | 'Student' | 'Business' | 'Other',
      principal: Number(form.principal),
      interestRate: Number(form.interestRate),
      monthlyPayment: Number(form.monthlyPayment),
      remainingBalance: Number(form.remainingBalance),
      startDate: form.startDate,
      endDate: form.endDate,
      currency: form.currency,
      notes: form.notes || undefined,
    });
    setShowModal(false);
    setForm({ name: '', loanType: 'Personal', principal: '', interestRate: '', monthlyPayment: '', remainingBalance: '', startDate: '', endDate: '', currency: 'USD', notes: '' });
  }

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this loan?')) {
      await deleteLoan.mutateAsync(id);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const totalDebt = (loans || []).reduce((sum, l) => sum + l.remainingBalance, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">Liabilities</h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Total Outstanding: <span className="font-semibold text-red-600 dark:text-rose-400">{formatCurrency(totalDebt)}</span>
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={16} className="mr-2" />
          Add Loan
        </Button>
      </div>

      {(!loans || loans.length === 0) ? (
        <Card>
          <EmptyState
            icon={<CreditCard size={48} />}
            title="No loans yet"
            description="Track your mortgages, personal loans, and other liabilities"
            actionLabel="Add Loan"
            onAction={() => setShowModal(true)}
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {loans.map((loan) => {
            const paidAmount = loan.principal - loan.remainingBalance;
            const progressPercent = loan.principal > 0 ? (paidAmount / loan.principal) * 100 : 0;
            return (
              <Card key={loan.id}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">{loan.name}</h3>
                      <Badge variant="info">{loan.loanType}</Badge>
                    </div>
                    <p className="text-sm text-stone-500 dark:text-stone-400">
                      {formatDate(loan.startDate)} - {formatDate(loan.endDate)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(loan.id)}
                    className="p-2 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 dark:text-stone-500 dark:hover:text-rose-400 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-stone-400 dark:text-stone-500 mb-1.5">
                    <span>Paid: {formatCurrency(paidAmount, loan.currency)}</span>
                    <span>{progressPercent.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-[var(--elevated)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(progressPercent, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-stone-400 dark:text-stone-500">Principal</p>
                    <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">{formatCurrency(loan.principal, loan.currency)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 dark:text-stone-500">Interest Rate</p>
                    <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">{loan.interestRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 dark:text-stone-500">Monthly Payment</p>
                    <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">{formatCurrency(loan.monthlyPayment, loan.currency)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 dark:text-stone-500">Remaining</p>
                    <p className={cn('text-sm font-semibold', 'text-red-600 dark:text-rose-400')}>{formatCurrency(loan.remainingBalance, loan.currency)}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Loan">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Loan Name" placeholder="Home Mortgage" value={form.name} onChange={(e) => handleChange('name', e.target.value)} required />
            <Select
              label="Loan Type"
              value={form.loanType}
              onChange={(e) => handleChange('loanType', e.target.value)}
              options={[
                { value: 'Mortgage', label: 'Mortgage' },
                { value: 'Personal', label: 'Personal' },
                { value: 'Auto', label: 'Auto' },
                { value: 'Student', label: 'Student' },
                { value: 'Business', label: 'Business' },
                { value: 'Other', label: 'Other' },
              ]}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Principal" type="number" placeholder="300000" value={form.principal} onChange={(e) => handleChange('principal', e.target.value)} required min="0" step="0.01" />
            <Input label="Interest Rate (%)" type="number" placeholder="4.5" value={form.interestRate} onChange={(e) => handleChange('interestRate', e.target.value)} required min="0" step="0.01" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Monthly Payment" type="number" placeholder="1500" value={form.monthlyPayment} onChange={(e) => handleChange('monthlyPayment', e.target.value)} required min="0" step="0.01" />
            <Input label="Remaining Balance" type="number" placeholder="250000" value={form.remainingBalance} onChange={(e) => handleChange('remainingBalance', e.target.value)} required min="0" step="0.01" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" value={form.startDate} onChange={(e) => handleChange('startDate', e.target.value)} required />
            <Input label="End Date" type="date" value={form.endDate} onChange={(e) => handleChange('endDate', e.target.value)} required />
          </div>
          <Input label="Notes" placeholder="Optional notes..." value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" loading={createLoan.isPending}>Add Loan</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
