import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'GetDue - Investment Portfolio Management',
  description: 'Track and manage your investment portfolio, real estate, and cash flow with GetDue.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.className} ${GeistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col text-stone-900 dark:text-stone-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
