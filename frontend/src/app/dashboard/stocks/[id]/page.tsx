'use client';

import { useState, type FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';
import { useStock, useUpdateStock, useCreateDividend } from '@/lib/queries';
import { formatCurrency, formatDate } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';

export default function StockDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: stock, isLoading } = useStock(id);
  const updateStock = useUpdateStock();
  const createDividend = useCreateDividend(id);
  const [showDividendModal, setShowDividendModal] = useState(false);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    ticker: '',
    companyName: '',
    quantity: '',
    buyPrice: '',
    currentPrice: '',
    notes: '',
  });

  const [dividendForm, setDividendForm] = useState({
    amount: '',
    paymentDate: '',
    frequency: 'Quarterly',
  });

  function startEdit() {
    if (!stock) return;
    setForm({
      ticker: stock.ticker,
      companyName: stock.companyName,
      quantity: String(stock.quantity),
      buyPrice: String(stock.buyPrice),
      currentPrice: String(stock.currentPrice),
      notes: stock.notes || '',
    });
    setEditing(true);
  }

  async function handleUpdate(e: FormEvent) {
    e.preventDefault();
    await updateStock.mutateAsync({
      id,
      ticker: form.ticker,
      companyName: form.companyName,
      quantity: Number(form.quantity),
      buyPrice: Number(form.buyPrice),
      currentPrice: Number(form.currentPrice),
      notes: form.notes || undefined,
    });
    setEditing(false);
  }

  async function handleAddDividend(e: FormEvent) {
    e.preventDefault();
    await createDividend.mutateAsync({
      amount: Number(dividendForm.amount),
      paymentDate: dividendForm.paymentDate,
      frequency: dividendForm.frequency,
    });
    setShowDividendModal(false);
    setDividendForm({ amount: '', paymentDate: '', frequency: 'Quarterly' });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!stock) {
    return (
      <div className="text-center py-32">
        <p className="text-stone-500 dark:text-stone-400">Stock not found</p>
        <Button variant="ghost" onClick={() => router.push('/dashboard/stocks')} className="mt-4">
          Back to Stocks
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.push('/dashboard/stocks')}
        className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to Stocks
      </button>

      {/* Stock Info */}
      <Card>
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">{stock.ticker}</h2>
              <Badge variant={stock.gainLoss >= 0 ? 'success' : 'danger'}>
                {stock.gainLossPercent >= 0 ? '+' : ''}{stock.gainLossPercent.toFixed(2)}%
              </Badge>
            </div>
            <p className="text-stone-500 dark:text-stone-400">{stock.companyName}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">{formatCurrency(stock.totalValue, stock.currency)}</p>
            <p className={`text-sm font-medium ${stock.gainLoss >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-rose-400'}`}>
              {stock.gainLoss >= 0 ? '+' : ''}{formatCurrency(stock.gainLoss, stock.currency)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[var(--elevated)] rounded-xl p-4">
            <p className="text-xs text-stone-400 dark:text-stone-500 mb-1">Quantity</p>
            <p className="text-lg font-semibold text-stone-800 dark:text-stone-200">{stock.quantity}</p>
          </div>
          <div className="bg-[var(--elevated)] rounded-xl p-4">
            <p className="text-xs text-stone-400 dark:text-stone-500 mb-1">Buy Price</p>
            <p className="text-lg font-semibold text-stone-800 dark:text-stone-200">{formatCurrency(stock.buyPrice, stock.currency)}</p>
          </div>
          <div className="bg-[var(--elevated)] rounded-xl p-4">
            <p className="text-xs text-stone-400 dark:text-stone-500 mb-1">Current Price</p>
            <p className="text-lg font-semibold text-stone-800 dark:text-stone-200">{formatCurrency(stock.currentPrice, stock.currency)}</p>
          </div>
          <div className="bg-[var(--elevated)] rounded-xl p-4">
            <p className="text-xs text-stone-400 dark:text-stone-500 mb-1">Currency</p>
            <p className="text-lg font-semibold text-stone-800 dark:text-stone-200">{stock.currency}</p>
          </div>
        </div>

        {stock.notes && (
          <p className="mt-4 text-sm text-stone-500 dark:text-stone-400 bg-[var(--elevated)] rounded-xl p-3">{stock.notes}</p>
        )}

        <div className="mt-4">
          <Button variant="secondary" onClick={startEdit}>Edit Stock</Button>
        </div>
      </Card>

      {/* Edit form */}
      {editing && (
        <Card title="Edit Stock">
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Ticker" value={form.ticker} onChange={(e) => setForm((p) => ({ ...p, ticker: e.target.value }))} required />
              <Input label="Company Name" value={form.companyName} onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))} required />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Input label="Quantity" type="number" value={form.quantity} onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))} required min="0" step="any" />
              <Input label="Buy Price" type="number" value={form.buyPrice} onChange={(e) => setForm((p) => ({ ...p, buyPrice: e.target.value }))} required min="0" step="0.01" />
              <Input label="Current Price" type="number" value={form.currentPrice} onChange={(e) => setForm((p) => ({ ...p, currentPrice: e.target.value }))} required min="0" step="0.01" />
            </div>
            <Input label="Notes" value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
            <div className="flex gap-3">
              <Button type="submit" loading={updateStock.isPending}>Save Changes</Button>
              <Button type="button" variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Dividends */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">Dividend History</h3>
          <Button size="sm" onClick={() => setShowDividendModal(true)}>
            <Plus size={14} className="mr-1" />
            Add Dividend
          </Button>
        </div>
        {(!stock.dividends || stock.dividends.length === 0) ? (
          <EmptyState title="No dividends recorded" description="Track dividend payments for this stock" />
        ) : (
          <div className="space-y-2">
            {stock.dividends.map((div) => (
              <div key={div.id} className="flex items-center justify-between py-3 px-4 bg-[var(--elevated)] rounded-xl">
                <div>
                  <p className="text-sm font-medium text-stone-800 dark:text-stone-200">{formatDate(div.paymentDate)}</p>
                  <Badge variant="info">{div.frequency}</Badge>
                </div>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">+{formatCurrency(div.amount)}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal open={showDividendModal} onClose={() => setShowDividendModal(false)} title="Add Dividend">
        <form onSubmit={handleAddDividend} className="space-y-4">
          <Input
            label="Amount"
            type="number"
            placeholder="50.00"
            value={dividendForm.amount}
            onChange={(e) => setDividendForm((p) => ({ ...p, amount: e.target.value }))}
            required
            min="0"
            step="0.01"
          />
          <Input
            label="Payment Date"
            type="date"
            value={dividendForm.paymentDate}
            onChange={(e) => setDividendForm((p) => ({ ...p, paymentDate: e.target.value }))}
            required
          />
          <Select
            label="Frequency"
            value={dividendForm.frequency}
            onChange={(e) => setDividendForm((p) => ({ ...p, frequency: e.target.value }))}
            options={[
              { value: 'Monthly', label: 'Monthly' },
              { value: 'Quarterly', label: 'Quarterly' },
              { value: 'SemiAnnual', label: 'Semi-Annual' },
              { value: 'Annual', label: 'Annual' },
            ]}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowDividendModal(false)}>Cancel</Button>
            <Button type="submit" loading={createDividend.isPending}>Add Dividend</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
