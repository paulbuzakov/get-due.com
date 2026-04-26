'use client';

import { useState, useMemo, type FormEvent } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
  parseISO,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, CalendarDays, CheckCircle2, Circle } from 'lucide-react';
import { useCalendarEvents, useCreateCalendarEvent, useUpdateCalendarEvent } from '@/lib/queries';
import { formatDate } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const eventTypeColors: Record<string, string> = {
  Payment: 'bg-amber-500',
  Dividend: 'bg-emerald-500',
  LoanPayment: 'bg-red-500',
  Custom: 'bg-blue-500',
};

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const { data: events, isLoading } = useCalendarEvents(
    format(monthStart, 'yyyy-MM-dd'),
    format(monthEnd, 'yyyy-MM-dd')
  );
  const createEvent = useCreateCalendarEvent();
  const updateEvent = useUpdateCalendarEvent();

  const [form, setForm] = useState({
    title: '',
    description: '',
    eventDate: '',
    eventType: 'Custom',
  });

  const days = useMemo(() => {
    const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startPadding = getDay(monthStart);
    return { allDays, startPadding };
  }, [monthStart, monthEnd]);

  function getEventsForDay(date: Date) {
    if (!events) return [];
    return events.filter((e) => isSameDay(parseISO(e.eventDate), date));
  }

  const selectedDayEvents = selectedDate
    ? getEventsForDay(selectedDate)
    : [];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await createEvent.mutateAsync({
      title: form.title,
      description: form.description,
      eventDate: form.eventDate,
      eventType: form.eventType as 'Payment' | 'Dividend' | 'LoanPayment' | 'Custom',
      isCompleted: false,
    });
    setShowModal(false);
    setForm({ title: '', description: '', eventDate: '', eventType: 'Custom' });
  }

  async function toggleComplete(event: { id: string; isCompleted: boolean }) {
    await updateEvent.mutateAsync({
      id: event.id,
      isCompleted: !event.isCompleted,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">Calendar</h2>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={16} className="mr-2" />
          Add Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-[var(--elevated)] dark:text-stone-500 dark:hover:text-stone-300 dark:hover:bg-[var(--elevated)] transition-colors cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-[var(--elevated)] dark:text-stone-500 dark:hover:text-stone-300 dark:hover:bg-[var(--elevated)] transition-colors cursor-pointer"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-7 gap-px mb-2">
                {WEEKDAYS.map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-stone-400 dark:text-stone-500 py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-px">
                {Array.from({ length: days.startPadding }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}
                {days.allDays.map((day) => {
                  const dayEvents = getEventsForDay(day);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isToday = isSameDay(day, new Date());
                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => setSelectedDate(day)}
                      className={`aspect-square rounded-xl p-1 flex flex-col items-center justify-start text-sm transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 border border-transparent'
                          : isToday
                          ? 'bg-[var(--elevated)] border border-[var(--border)]'
                          : 'hover:bg-[var(--elevated)] border border-transparent'
                      } ${!isSelected && isSameMonth(day, currentMonth) ? 'text-stone-800 dark:text-stone-200' : !isSelected ? 'text-stone-300 dark:text-stone-600' : ''}`}
                    >
                      <span className={`text-xs font-medium ${isToday && !isSelected ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                        {format(day, 'd')}
                      </span>
                      {dayEvents.length > 0 && (
                        <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                          {dayEvents.slice(0, 3).map((ev) => (
                            <div
                              key={ev.id}
                              className={`w-1.5 h-1.5 rounded-full ${eventTypeColors[ev.eventType] || 'bg-stone-400'}`}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </Card>

        {/* Event Sidebar */}
        <Card>
          <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
            {selectedDate ? format(selectedDate, 'EEEE, MMM d') : 'Upcoming Events'}
          </h3>
          {selectedDate ? (
            selectedDayEvents.length === 0 ? (
              <div className="text-center py-8">
                <CalendarDays size={32} className="mx-auto text-stone-300 dark:text-stone-600 mb-2" />
                <p className="text-sm text-stone-400 dark:text-stone-500">No events on this day</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 bg-[var(--elevated)] rounded-xl"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleComplete(event)}
                          className="text-stone-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                        >
                          {event.isCompleted ? (
                            <CheckCircle2 size={16} className="text-emerald-500 dark:text-emerald-400" />
                          ) : (
                            <Circle size={16} />
                          )}
                        </button>
                        <span className={`text-sm font-medium ${event.isCompleted ? 'text-stone-400 dark:text-stone-500 line-through' : 'text-stone-800 dark:text-stone-200'}`}>
                          {event.title}
                        </span>
                      </div>
                      <Badge
                        variant={
                          event.eventType === 'Dividend'
                            ? 'success'
                            : event.eventType === 'LoanPayment'
                            ? 'danger'
                            : event.eventType === 'Payment'
                            ? 'warning'
                            : 'info'
                        }
                      >
                        {event.eventType}
                      </Badge>
                    </div>
                    {event.description && (
                      <p className="text-xs text-stone-400 dark:text-stone-500 ml-6">{event.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="space-y-3">
              {(events || [])
                .filter((e) => !e.isCompleted)
                .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
                .slice(0, 10)
                .map((event) => (
                  <div key={event.id} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
                    <div>
                      <p className="text-sm font-medium text-stone-800 dark:text-stone-200">{event.title}</p>
                      <p className="text-xs text-stone-400 dark:text-stone-500">{formatDate(event.eventDate)}</p>
                    </div>
                    <Badge
                      variant={
                        event.eventType === 'Dividend'
                          ? 'success'
                          : event.eventType === 'LoanPayment'
                          ? 'danger'
                          : event.eventType === 'Payment'
                          ? 'warning'
                          : 'info'
                      }
                    >
                      {event.eventType}
                    </Badge>
                  </div>
                ))}
            </div>
          )}
        </Card>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Calendar Event">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            placeholder="Dividend payment"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            required
          />
          <Input
            label="Description"
            placeholder="Optional description..."
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Event Date"
              type="date"
              value={form.eventDate}
              onChange={(e) => setForm((p) => ({ ...p, eventDate: e.target.value }))}
              required
            />
            <Select
              label="Event Type"
              value={form.eventType}
              onChange={(e) => setForm((p) => ({ ...p, eventType: e.target.value }))}
              options={[
                { value: 'Custom', label: 'Custom' },
                { value: 'Payment', label: 'Payment' },
                { value: 'Dividend', label: 'Dividend' },
                { value: 'LoanPayment', label: 'Loan Payment' },
              ]}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" loading={createEvent.isPending}>Add Event</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
