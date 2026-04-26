'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearError();
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch {
      // error is set in the store
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-stone-900 dark:bg-white mb-4">
            <span className="text-2xl font-bold text-white dark:text-stone-900">G</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Welcome back</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">Sign in to your GetDue account</p>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400">
                {error}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" loading={isLoading} className="w-full" size="lg">
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-stone-500 dark:text-stone-400 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-stone-900 hover:text-stone-700 dark:text-stone-100 dark:hover:text-stone-300 font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
