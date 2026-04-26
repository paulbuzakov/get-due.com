'use client';

import { useState, type FormEvent } from 'react';
import { Plus, Wallet, Trash2, Pencil } from 'lucide-react';
import { useCashAccounts, useCreateCashAccount, useDeleteCashAccount, useUpdateCashAccount } from '@/lib/queries';
import { formatCurrency } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';

export default function AccountsPage() {
  const { data: accounts, isLoading } = useCashAccounts();
  const createAccount = useCreateCashAccount();
  const deleteAccount = useDeleteCashAccount();
  const updateAccount = useUpdateCashAccount();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    institution: '',
    balance: '',
    currency: 'USD',
    accountNumber: '',
  });

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function openEdit(account: { id: string; name: string; institution: string; balance: number; currency: string; accountNumber: string }) {
    setForm({
      name: account.name,
      institution: account.institution,
      balance: String(account.balance),
      currency: account.currency,
      accountNumber: account.accountNumber,
    });
    setEditId(account.id);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditId(null);
    setForm({ name: '', institution: '', balance: '', currency: 'USD', accountNumber: '' });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = {
      name: form.name,
      institution: form.institution,
      balance: Number(form.balance),
      currency: form.currency,
      accountNumber: form.accountNumber,
    };
    if (editId) {
      await updateAccount.mutateAsync({ id: editId, ...payload });
    } else {
      await createAccount.mutateAsync(payload);
    }
    closeModal();
  }

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this account?')) {
      await deleteAccount.mutateAsync(id);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const totalBalance = (accounts || []).reduce((sum, a) => sum + a.balance, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">Cash Accounts</h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Total Balance: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(totalBalance)}</span>
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={16} className="mr-2" />
          Add Account
        </Button>
      </div>

      {(!accounts || accounts.length === 0) ? (
        <Card>
          <EmptyState
            icon={<Wallet size={48} />}
            title="No cash accounts yet"
            description="Add your bank accounts, savings, and other cash holdings"
            actionLabel="Add Account"
            onAction={() => setShowModal(true)}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <Card key={account.id}>
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10">
                  <Wallet size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(account)}
                    className="p-2 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-[var(--elevated)] dark:text-stone-500 dark:hover:text-stone-300 dark:hover:bg-[var(--elevated)] transition-colors cursor-pointer"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(account.id)}
                    className="p-2 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 dark:text-stone-500 dark:hover:text-rose-400 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-0.5">{account.name}</h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 mb-3">{account.institution}</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(account.balance, account.currency)}</p>
              {account.accountNumber && (
                <p className="text-xs text-stone-400 dark:text-stone-500 mt-2 font-mono">
                  ****{account.accountNumber.slice(-4)}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={closeModal} title={editId ? 'Edit Account' : 'Add Cash Account'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Account Name" placeholder="Checking Account" value={form.name} onChange={(e) => handleChange('name', e.target.value)} required />
          <Input label="Institution" placeholder="Bank of America" value={form.institution} onChange={(e) => handleChange('institution', e.target.value)} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Balance" type="number" placeholder="10000" value={form.balance} onChange={(e) => handleChange('balance', e.target.value)} required step="0.01" />
            <Input label="Account Number" placeholder="1234567890" value={form.accountNumber} onChange={(e) => handleChange('accountNumber', e.target.value)} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit" loading={createAccount.isPending || updateAccount.isPending}>
              {editId ? 'Update' : 'Add Account'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
