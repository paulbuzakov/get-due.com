'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  TrendingUp,
  Home,
  Wallet,
  CreditCard,
  ArrowLeftRight,
  CalendarDays,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/stocks', label: 'Stocks', icon: TrendingUp },
  { href: '/dashboard/properties', label: 'Real Estate', icon: Home },
  { href: '/dashboard/accounts', label: 'Cash', icon: Wallet },
  { href: '/dashboard/liabilities', label: 'Liabilities', icon: CreditCard },
  { href: '/dashboard/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { href: '/dashboard/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-[var(--card)] border-r border-[var(--border)] flex flex-col z-40 transition-all duration-200',
        expanded ? 'w-60' : 'w-16'
      )}
    >
      {/* Logo / User */}
      <div className="p-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-stone-900 dark:bg-white flex items-center justify-center text-white dark:text-stone-900 font-bold text-sm">
            {user?.firstName?.[0] || 'G'}
          </div>
          {expanded && (
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">
                {user ? `${user.firstName} ${user.lastName}` : 'GetDue'}
              </p>
              <p className="text-xs text-stone-400 dark:text-stone-500 truncate">{user?.email || 'Portfolio'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-[var(--elevated)] dark:text-stone-400 dark:hover:text-stone-100 dark:hover:bg-[var(--elevated)]'
              )}
            >
              <Icon size={20} className="flex-shrink-0" />
              {expanded && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-2 border-t border-[var(--border)] space-y-1">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-500 hover:text-stone-900 hover:bg-[var(--elevated)] dark:text-stone-400 dark:hover:text-stone-100 dark:hover:bg-[var(--elevated)] transition-colors"
        >
          <Settings size={20} className="flex-shrink-0" />
          {expanded && <span>Settings</span>}
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-500 hover:text-red-600 hover:bg-red-50 dark:text-stone-400 dark:hover:text-rose-400 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
        >
          <LogOut size={20} className="flex-shrink-0" />
          {expanded && <span>Sign Out</span>}
        </button>
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center p-2 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-[var(--elevated)] dark:text-stone-500 dark:hover:text-stone-300 dark:hover:bg-[var(--elevated)] transition-colors cursor-pointer"
        >
          {expanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
    </aside>
  );
}
