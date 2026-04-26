'use client';

import { useState, type FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, MapPin } from 'lucide-react';
import { useProperty, useUpdateProperty, useCreateValuation } from '@/lib/queries';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: property, isLoading } = useProperty(id);
  const updateProperty = useUpdateProperty();
  const createValuation = useCreateValuation(id);
  const [editing, setEditing] = useState(false);
  const [showValuationModal, setShowValuationModal] = useState(false);

  const [form, setForm] = useState({
    name: '',
    address: '',
    purchasePrice: '',
    currentValue: '',
    purchaseDate: '',
    notes: '',
  });

  const [valuationForm, setValuationForm] = useState({
    value: '',
    valuationDate: '',
    source: '',
  });

  function startEdit() {
    if (!property) return;
    setForm({
      name: property.name,
      address: property.address,
      purchasePrice: String(property.purchasePrice),
      currentValue: String(property.currentValue),
      purchaseDate: property.purchaseDate.split('T')[0],
      notes: property.notes || '',
    });
    setEditing(true);
  }

  async function handleUpdate(e: FormEvent) {
    e.preventDefault();
    await updateProperty.mutateAsync({
      id,
      name: form.name,
      address: form.address,
      purchasePrice: Number(form.purchasePrice),
      currentValue: Number(form.currentValue),
      purchaseDate: form.purchaseDate,
      notes: form.notes || undefined,
    });
    setEditing(false);
  }

  async function handleAddValuation(e: FormEvent) {
    e.preventDefault();
    await createValuation.mutateAsync({
      value: Number(valuationForm.value),
      valuationDate: valuationForm.valuationDate,
      source: valuationForm.source,
    });
    setShowValuationModal(false);
    setValuationForm({ value: '', valuationDate: '', source: '' });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-32">
        <p className="text-stone-500 dark:text-stone-400">Property not found</p>
        <Button variant="ghost" onClick={() => router.push('/dashboard/properties')} className="mt-4">
          Back to Properties
        </Button>
      </div>
    );
  }

  const gain = property.currentValue - property.purchasePrice;
  const gainPercent = property.purchasePrice > 0 ? (gain / property.purchasePrice) * 100 : 0;

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.push('/dashboard/properties')}
        className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to Properties
      </button>

      <Card>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-1">{property.name}</h2>
            <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
              <MapPin size={16} />
              <span>{property.address}</span>
            </div>
          </div>
          <Badge variant={gain >= 0 ? 'success' : 'danger'}>
            {gain >= 0 ? '+' : ''}{gainPercent.toFixed(1)}%
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[var(--elevated)] rounded-xl p-4">
            <p className="text-xs text-stone-400 dark:text-stone-500 mb-1">Purchase Price</p>
            <p className="text-lg font-semibold text-stone-800 dark:text-stone-200">{formatCurrency(property.purchasePrice, property.currency)}</p>
          </div>
          <div className="bg-[var(--elevated)] rounded-xl p-4">
            <p className="text-xs text-stone-400 dark:text-stone-500 mb-1">Current Value</p>
            <p className="text-lg font-semibold text-stone-900 dark:text-stone-100">{formatCurrency(property.currentValue, property.currency)}</p>
          </div>
          <div className="bg-[var(--elevated)] rounded-xl p-4">
            <p className="text-xs text-stone-400 dark:text-stone-500 mb-1">Gain / Loss</p>
            <p className={cn('text-lg font-semibold', gain >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-rose-400')}>
              {gain >= 0 ? '+' : ''}{formatCurrency(gain, property.currency)}
            </p>
          </div>
          <div className="bg-[var(--elevated)] rounded-xl p-4">
            <p className="text-xs text-stone-400 dark:text-stone-500 mb-1">Purchase Date</p>
            <p className="text-lg font-semibold text-stone-800 dark:text-stone-200">{formatDate(property.purchaseDate)}</p>
          </div>
        </div>

        {property.notes && (
          <p className="mt-4 text-sm text-stone-500 dark:text-stone-400 bg-[var(--elevated)] rounded-xl p-3">{property.notes}</p>
        )}

        <div className="mt-4">
          <Button variant="secondary" onClick={startEdit}>Edit Property</Button>
        </div>
      </Card>

      {editing && (
        <Card title="Edit Property">
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
              <Input label="Address" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} required />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Input label="Purchase Price" type="number" value={form.purchasePrice} onChange={(e) => setForm((p) => ({ ...p, purchasePrice: e.target.value }))} required />
              <Input label="Current Value" type="number" value={form.currentValue} onChange={(e) => setForm((p) => ({ ...p, currentValue: e.target.value }))} required />
              <Input label="Purchase Date" type="date" value={form.purchaseDate} onChange={(e) => setForm((p) => ({ ...p, purchaseDate: e.target.value }))} required />
            </div>
            <Input label="Notes" value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
            <div className="flex gap-3">
              <Button type="submit" loading={updateProperty.isPending}>Save Changes</Button>
              <Button type="button" variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">Valuation History</h3>
          <Button size="sm" onClick={() => setShowValuationModal(true)}>
            <Plus size={14} className="mr-1" />
            Add Valuation
          </Button>
        </div>
        {(!property.valuations || property.valuations.length === 0) ? (
          <EmptyState title="No valuations recorded" description="Add property valuations to track value over time" />
        ) : (
          <div className="space-y-2">
            {property.valuations
              .sort((a, b) => new Date(b.valuationDate).getTime() - new Date(a.valuationDate).getTime())
              .map((val) => (
                <div key={val.id} className="flex items-center justify-between py-3 px-4 bg-[var(--elevated)] rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-stone-800 dark:text-stone-200">{formatDate(val.valuationDate)}</p>
                    <p className="text-xs text-stone-400 dark:text-stone-500">{val.source}</p>
                  </div>
                  <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{formatCurrency(val.value, property.currency)}</p>
                </div>
              ))}
          </div>
        )}
      </Card>

      <Modal open={showValuationModal} onClose={() => setShowValuationModal(false)} title="Add Valuation">
        <form onSubmit={handleAddValuation} className="space-y-4">
          <Input
            label="Value"
            type="number"
            placeholder="600000"
            value={valuationForm.value}
            onChange={(e) => setValuationForm((p) => ({ ...p, value: e.target.value }))}
            required
            min="0"
            step="0.01"
          />
          <Input
            label="Valuation Date"
            type="date"
            value={valuationForm.valuationDate}
            onChange={(e) => setValuationForm((p) => ({ ...p, valuationDate: e.target.value }))}
            required
          />
          <Input
            label="Source"
            placeholder="e.g. Zillow, Appraisal"
            value={valuationForm.source}
            onChange={(e) => setValuationForm((p) => ({ ...p, source: e.target.value }))}
            required
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowValuationModal(false)}>Cancel</Button>
            <Button type="submit" loading={createValuation.isPending}>Add Valuation</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
