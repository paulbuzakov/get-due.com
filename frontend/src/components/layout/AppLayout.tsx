'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import Sidebar from './Sidebar';
import Header from './Header';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, hydrate } = useAuthStore();
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!stored && !token) {
      router.replace('/login');
    }
  }, [token, router]);

  if (!isAuthenticated && typeof window !== 'undefined' && !localStorage.getItem('accessToken')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Sidebar />
      <Header />
      <main className="ml-60 pt-16 min-h-screen">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
