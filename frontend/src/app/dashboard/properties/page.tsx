'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Plus, Home, MapPin } from 'lucide-react';
import { useProperties, useCreateProperty } from '@/lib/queries';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';

export default function PropertiesPage() {
  const { data: properties, isLoading } = useProperties();
  const createProperty = useCreateProperty();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    address: '',
    purchasePrice: '',
    currentValue: '',
    purchaseDate: '',
    currency: 'USD',
    notes: '',
  });

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await createProperty.mutateAsync({
      name: form.name,
      address: form.address,
      purchasePrice: Number(form.purchasePrice),
      currentValue: Number(form.currentValue),
      purchaseDate: form.purchaseDate,
      currency: form.currency,
      notes: form.notes || undefined,
    });
    setShowModal(false);
    setForm({ name: '', address: '', purchasePrice: '', currentValue: '', purchaseDate: '', currency: 'USD', notes: '' });
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
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">Real Estate</h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {properties?.length ?? 0} propert{(properties?.length ?? 0) !== 1 ? 'ies' : 'y'}
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={16} className="mr-2" />
          Add Property
        </Button>
      </div>

      {(!properties || properties.length === 0) ? (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
          <EmptyState
            icon={<Home size={48} />}
            title="No properties yet"
            description="Add your real estate holdings to track their value"
            actionLabel="Add Property"
            onAction={() => setShowModal(true)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => {
            const gain = property.currentValue - property.purchasePrice;
            const gainPercent = property.purchasePrice > 0 ? (gain / property.purchasePrice) * 100 : 0;
            return (
              <Link
                key={property.id}
                href={`/dashboard/properties/${property.id}`}
                className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm transition-all duration-200 hover:shadow-md block"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-500/10">
                    <Home size={20} className="text-violet-600 dark:text-violet-400" />
                  </div>
                  <Badge variant={gain >= 0 ? 'success' : 'danger'}>
                    {gain >= 0 ? '+' : ''}{gainPercent.toFixed(1)}%
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-1">{property.name}</h3>
                <div className="flex items-center gap-1.5 text-sm text-stone-500 dark:text-stone-400 mb-4">
                  <MapPin size={14} />
                  <span className="truncate">{property.address}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-stone-400 dark:text-stone-500">Purchase Price</p>
                    <p className="text-sm font-semibold text-stone-600 dark:text-stone-300">{formatCurrency(property.purchasePrice, property.currency)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 dark:text-stone-500">Current Value</p>
                    <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{formatCurrency(property.currentValue, property.currency)}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-[var(--border)]">
                  <p className={cn('text-sm font-medium', gain >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-rose-400')}>
                    {gain >= 0 ? '+' : ''}{formatCurrency(gain, property.currency)} gain
                  </p>
                  <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">Purchased {formatDate(property.purchaseDate)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Property">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Property Name" placeholder="Beach House" value={form.name} onChange={(e) => handleChange('name', e.target.value)} required />
          <Input label="Address" placeholder="123 Main St, City" value={form.address} onChange={(e) => handleChange('address', e.target.value)} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Purchase Price" type="number" placeholder="500000" value={form.purchasePrice} onChange={(e) => handleChange('purchasePrice', e.target.value)} required min="0" step="0.01" />
            <Input label="Current Value" type="number" placeholder="550000" value={form.currentValue} onChange={(e) => handleChange('currentValue', e.target.value)} required min="0" step="0.01" />
          </div>
          <Input label="Purchase Date" type="date" value={form.purchaseDate} onChange={(e) => handleChange('purchaseDate', e.target.value)} required />
          <Input label="Notes" placeholder="Optional notes..." value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" loading={createProperty.isPending}>Add Property</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
