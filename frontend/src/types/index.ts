// ─── Enum Union Types ───────────────────────────────────────────────────────

export type TransactionType = 'Income' | 'Expense' | 'Transfer';

export type TransactionCategory =
  | 'Salary'
  | 'Investment'
  | 'Dividend'
  | 'Rental'
  | 'Freelance'
  | 'Food'
  | 'Transport'
  | 'Housing'
  | 'Utilities'
  | 'Entertainment'
  | 'Healthcare'
  | 'Education'
  | 'Shopping'
  | 'Insurance'
  | 'Tax'
  | 'LoanPayment'
  | 'Other';

export type LoanType = 'Mortgage' | 'Personal' | 'Auto' | 'Student' | 'Business' | 'Other';

export type DividendFrequency = 'Monthly' | 'Quarterly' | 'SemiAnnual' | 'Annual';

export type RecurringFrequency = 'Daily' | 'Weekly' | 'BiWeekly' | 'Monthly' | 'Quarterly' | 'Annual';

export type CalendarEventType = 'Payment' | 'Dividend' | 'LoanPayment' | 'Custom';

// ─── Auth ───────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  defaultCurrency: string;
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
}

// ─── Stocks ─────────────────────────────────────────────────────────────────

export interface Dividend {
  id: string;
  stockId: string;
  amount: number;
  paymentDate: string;
  frequency: DividendFrequency;
}

export interface Stock {
  id: string;
  ticker: string;
  companyName: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  currency: string;
  totalValue: number;
  gainLoss: number;
  gainLossPercent: number;
  notes?: string;
  dividends: Dividend[];
}

// ─── Properties ─────────────────────────────────────────────────────────────

export interface PropertyValuation {
  id: string;
  propertyId: string;
  value: number;
  valuationDate: string;
  source: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  purchasePrice: number;
  currentValue: number;
  purchaseDate: string;
  currency: string;
  notes?: string;
  valuations: PropertyValuation[];
}

// ─── Cash Accounts ──────────────────────────────────────────────────────────

export interface CashAccount {
  id: string;
  name: string;
  institution: string;
  balance: number;
  currency: string;
  accountNumber: string;
}

// ─── Transactions ───────────────────────────────────────────────────────────

export interface Transaction {
  id: string;
  cashAccountId: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  transactionDate: string;
  currency: string;
}

// ─── Loans ──────────────────────────────────────────────────────────────────

export interface LoanPayment {
  id: string;
  loanId: string;
  amount: number;
  principalPortion: number;
  interestPortion: number;
  paymentDate: string;
}

export interface Loan {
  id: string;
  name: string;
  loanType: LoanType;
  principal: number;
  interestRate: number;
  monthlyPayment: number;
  remainingBalance: number;
  startDate: string;
  endDate: string;
  currency: string;
  notes?: string;
  payments: LoanPayment[];
}

// ─── Recurring Payments ─────────────────────────────────────────────────────

export interface RecurringPayment {
  id: string;
  name: string;
  amount: number;
  frequency: RecurringFrequency;
  category: TransactionCategory;
  nextPaymentDate: string;
  currency: string;
  isActive: boolean;
  notes?: string;
}

// ─── Calendar Events ────────────────────────────────────────────────────────

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  eventType: CalendarEventType;
  relatedEntityId?: string;
  isCompleted: boolean;
}

// ─── Analytics ──────────────────────────────────────────────────────────────

export interface AssetAllocation {
  category: string;
  value: number;
  percentage: number;
}

export interface PortfolioSummary {
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  assetAllocation: AssetAllocation[];
  monthlyIncome: number;
  monthlyExpenses: number;
  passiveIncome: number;
  debtToIncomeRatio: number;
}

export interface NetWorth {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  stocksValue: number;
  realEstateValue: number;
  cashValue: number;
  loansTotal: number;
}

export interface CashFlow {
  year: number;
  month: number;
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  incomeByCategory: Record<string, number>;
  expensesByCategory: Record<string, number>;
}

export interface NetWorthHistoryPoint {
  date: string;
  label: string;
  netWorth: number;
}

// ─── Pagination ─────────────────────────────────────────────────────────────

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
