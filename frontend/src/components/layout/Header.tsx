'use client';

import { usePathname } from 'next/navigation';
import { Bell, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/stocks': 'Stocks',
  '/dashboard/properties': 'Real Estate',
  '/dashboard/accounts': 'Cash Accounts',
  '/dashboard/liabilities': 'Liabilities',
  '/dashboard/transactions': 'Transactions',
  '/dashboard/calendar': 'Calendar',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/settings': 'Settings',
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith('/dashboard/stocks/')) return 'Stock Details';
  if (pathname.startsWith('/dashboard/properties/')) return 'Property Details';
  return 'Dashboard';
}

export default function Header() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { theme, toggle } = useThemeStore();
  const title = getPageTitle(pathname);

  return (
    <header className="fixed top-0 right-0 left-60 h-16 bg-[var(--card)]/80 backdrop-blur-md border-b border-[var(--border)] z-30 flex items-center justify-between px-8">
      <h1 className="text-xl font-semibold text-stone-900 dark:text-stone-100">{title}</h1>
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="p-2 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-[var(--elevated)] dark:text-stone-500 dark:hover:text-stone-300 dark:hover:bg-[var(--elevated)] transition-colors cursor-pointer"
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <button className="relative p-2 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-[var(--elevated)] dark:text-stone-500 dark:hover:text-stone-300 dark:hover:bg-[var(--elevated)] transition-colors cursor-pointer">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-[var(--border)]">
          <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-sm font-medium text-stone-600 dark:text-stone-200">
            {user?.firstName?.[0] || 'U'}
          </div>
          <span className="text-sm text-stone-600 dark:text-stone-300 hidden sm:block">
            {user ? `${user.firstName} ${user.lastName}` : 'User'}
          </span>
        </div>
      </div>
    </header>
  );
}
