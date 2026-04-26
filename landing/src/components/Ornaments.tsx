import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export function StocksIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 38 L14 26 L22 32 L34 14 L44 22" />
      <circle cx="14" cy="26" r="1.6" fill="currentColor" />
      <circle cx="22" cy="32" r="1.6" fill="currentColor" />
      <circle cx="34" cy="14" r="1.6" fill="currentColor" />
      <path d="M34 14 L42 14 L42 22" strokeDasharray="2 2" />
    </svg>
  );
}

export function PropertyIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 22 L24 8 L42 22" />
      <path d="M10 22 L10 40 L38 40 L38 22" />
      <rect x="20" y="28" width="8" height="12" />
      <path d="M14 26 H18 V30 H14 Z" />
      <path d="M30 26 H34 V30 H30 Z" />
      <path d="M22 6 L22 11 L26 11" />
    </svg>
  );
}

export function CashIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="6" y="14" width="36" height="22" rx="1" />
      <circle cx="24" cy="25" r="5" />
      <path d="M24 21 V29 M22 23 H26 M22 27 H26" />
      <circle cx="11" cy="19" r="0.9" fill="currentColor" />
      <circle cx="37" cy="31" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function LoanIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 6 L36 6 L40 14 L40 42 L8 42 L8 14 Z" />
      <path d="M12 6 L8 14 L40 14" />
      <path d="M14 22 H34 M14 28 H34 M14 34 H26" />
      <path d="M30 36 L34 40 L40 32" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function RecurringIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10 24 A14 14 0 0 1 38 24" />
      <path d="M38 24 A14 14 0 0 1 10 24" strokeDasharray="2 3" />
      <path d="M34 12 L38 12 L38 16" />
      <path d="M14 36 L10 36 L10 32" />
      <text x="24" y="28" textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize="11" fill="currentColor" stroke="none">$</text>
    </svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="6" y="10" width="36" height="32" />
      <path d="M6 18 H42" />
      <path d="M14 6 V14 M34 6 V14" />
      <circle cx="16" cy="26" r="1" fill="currentColor" />
      <circle cx="24" cy="26" r="1" fill="currentColor" />
      <circle cx="32" cy="26" r="1" fill="currentColor" />
      <circle cx="16" cy="34" r="1" fill="currentColor" />
      <path d="M22 32 L26 36 L30 30" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function Fleuron({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 24" className={className} fill="currentColor" aria-hidden>
      <path d="M40 12 c-4 -4 -10 -8 -16 -8 c4 4 8 6 8 8 c0 2 -4 4 -8 8 c6 0 12 -4 16 -8 z" />
      <path d="M40 12 c4 -4 10 -8 16 -8 c-4 4 -8 6 -8 8 c0 2 4 4 8 8 c-6 0 -12 -4 -16 -8 z" />
      <circle cx="40" cy="12" r="2" />
      <path d="M2 12 H20" stroke="currentColor" strokeWidth="0.8" />
      <path d="M60 12 H78" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  );
}
