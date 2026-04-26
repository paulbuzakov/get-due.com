'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Plus, Trash2, TrendingUp } from 'lucide-react';
import { useStocks, useCreateStock, useDeleteStock } from '@/lib/queries';
import { formatCurrency, formatPercent, cn } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';

export default function StocksPage() {
  const { data: stocks, isLoading } = useStocks();
  const createStock = useCreateStock();
  const deleteStock = useDeleteStock();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    ticker: '',
    companyName: '',
    quantity: '',
    buyPrice: '',
    currentPrice: '',
    currency: 'USD',
    notes: '',
  });

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await createStock.mutateAsync({
      ticker: form.ticker,
      companyName: form.companyName,
      quantity: Number(form.quantity),
      buyPrice: Number(form.buyPrice),
      currentPrice: Number(form.currentPrice),
      currency: form.currency,
      notes: form.notes || undefined,
    });
    setShowModal(false);
    setForm({ ticker: '', companyName: '', quantity: '', buyPrice: '', currentPrice: '', currency: 'USD', notes: '' });
  }

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this stock?')) {
      await deleteStock.mutateAsync(id);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">Stock Portfolio</h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {stocks?.length ?? 0} holding{(stocks?.length ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={16} className="mr-2" />
          Add Stock
        </Button>
      </div>

      {(!stocks || stocks.length === 0) ? (
        <Card>
          <EmptyState
            icon={<TrendingUp size={48} />}
            title="No stocks yet"
            description="Add your first stock to start tracking your portfolio"
            actionLabel="Add Stock"
            onAction={() => setShowModal(true)}
          />
        </Card>
      ) : (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-4 px-6 text-xs font-medium text-stone-400 dark:text-stone-500 uppercase tracking-wider">Ticker</th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-stone-400 dark:text-stone-500 uppercase tracking-wider">Company</th>
                  <th className="text-right py-4 px-6 text-xs font-medium text-stone-400 dark:text-stone-500 uppercase tracking-wider">Qty</th>
                  <th className="text-right py-4 px-6 text-xs font-medium text-stone-400 dark:text-stone-500 uppercase tracking-wider">Buy Price</th>
                  <th className="text-right py-4 px-6 text-xs font-medium text-stone-400 dark:text-stone-500 uppercase tracking-wider">Current</th>
                  <th className="text-right py-4 px-6 text-xs font-medium text-stone-400 dark:text-stone-500 uppercase tracking-wider">Gain/Loss</th>
                  <th className="text-right py-4 px-6 text-xs font-medium text-stone-400 dark:text-stone-500 uppercase tracking-wider">Value</th>
                  <th className="text-right py-4 px-6 text-xs font-medium text-stone-400 dark:text-stone-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => (
                  <tr
                    key={stock.id}
                    className="border-b border-[var(--border)] hover:bg-[var(--elevated)]/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <Link
                        href={`/dashboard/stocks/${stock.id}`}
                        className="font-semibold text-stone-900 hover:text-stone-600 dark:text-emerald-400 dark:hover:text-emerald-300"
                      >
                        {stock.ticker}
                      </Link>
                    </td>
                    <td className="py-4 px-6 text-stone-600 dark:text-stone-300">{stock.companyName}</td>
                    <td className="py-4 px-6 text-right text-stone-600 dark:text-stone-300">{stock.quantity}</td>
                    <td className="py-4 px-6 text-right text-stone-600 dark:text-stone-300">{formatCurrency(stock.buyPrice, stock.currency)}</td>
                    <td className="py-4 px-6 text-right text-stone-600 dark:text-stone-300">{formatCurrency(stock.currentPrice, stock.currency)}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <span className={cn(stock.gainLoss >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-rose-400', 'font-medium')}>
                          {formatCurrency(stock.gainLoss, stock.currency)}
                        </span>
                        <Badge variant={stock.gainLossPercent >= 0 ? 'success' : 'danger'}>
                          {formatPercent(stock.gainLossPercent)}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right font-semibold text-stone-900 dark:text-stone-100">
                      {formatCurrency(stock.totalValue, stock.currency)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(stock.id)}
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
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Stock">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Ticker" placeholder="AAPL" value={form.ticker} onChange={(e) => handleChange('ticker', e.target.value)} required />
            <Input label="Company Name" placeholder="Apple Inc." value={form.companyName} onChange={(e) => handleChange('companyName', e.target.value)} required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Quantity" type="number" placeholder="100" value={form.quantity} onChange={(e) => handleChange('quantity', e.target.value)} required min="0" step="any" />
            <Input label="Buy Price" type="number" placeholder="150.00" value={form.buyPrice} onChange={(e) => handleChange('buyPrice', e.target.value)} required min="0" step="0.01" />
            <Input label="Current Price" type="number" placeholder="175.00" value={form.currentPrice} onChange={(e) => handleChange('currentPrice', e.target.value)} required min="0" step="0.01" />
          </div>
          <Input label="Notes" placeholder="Optional notes..." value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" loading={createStock.isPending}>Add Stock</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
