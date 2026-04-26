'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearError();
    try {
      await register(email, password, firstName, lastName);
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
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Create an account</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">Start managing your portfolio with GetDue</p>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <Input
                label="Last Name"
                type="text"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

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
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />

            <Button type="submit" loading={isLoading} className="w-full" size="lg">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-stone-500 dark:text-stone-400 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-stone-900 hover:text-stone-700 dark:text-stone-100 dark:hover:text-stone-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
