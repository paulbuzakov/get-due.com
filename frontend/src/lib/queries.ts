import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type {
  Stock,
  Property,
  CashAccount,
  Transaction,
  Loan,
  LoanPayment,
  RecurringPayment,
  CalendarEvent,
  PortfolioSummary,
  AssetAllocation,
  NetWorth,
  CashFlow,
  NetWorthHistoryPoint,
  PagedResult,
} from '@/types';

// ─── Query Keys ─────────────────────────────────────────────────────────────

export const queryKeys = {
  portfolioSummary: ['analytics', 'summary'] as const,
  netWorth: ['analytics', 'net-worth'] as const,
  cashFlow: (year?: number, month?: number) => ['analytics', 'cash-flow', year, month] as const,
  netWorthHistory: ['analytics', 'net-worth-history'] as const,
  stocks: ['stocks'] as const,
  stock: (id: string) => ['stocks', id] as const,
  properties: ['properties'] as const,
  property: (id: string) => ['properties', id] as const,
  cashAccounts: ['cash-accounts'] as const,
  cashAccount: (id: string) => ['cash-accounts', id] as const,
  transactions: (params?: TransactionParams) => ['transactions', params] as const,
  loans: ['loans'] as const,
  loan: (id: string) => ['loans', id] as const,
  loanPayments: (id: string) => ['loans', id, 'payments'] as const,
  loanSchedule: (id: string) => ['loans', id, 'schedule'] as const,
  recurringPayments: ['recurring-payments'] as const,
  calendarEvents: (startDate?: string, endDate?: string) => ['calendar', startDate, endDate] as const,
};

// ─── Analytics ──────────────────────────────────────────────────────────────

export function usePortfolioSummary() {
  return useQuery<PortfolioSummary>({
    queryKey: queryKeys.portfolioSummary,
    queryFn: async () => {
      const { data } = await api.get('/analytics/summary');
      const raw = (data?.assetAllocation ?? {}) as Record<string, number> | AssetAllocation[];
      const entries: Array<[string, number]> = Array.isArray(raw)
        ? raw.map((a) => [a.category, a.value])
        : Object.entries(raw);
      const total = entries.reduce((sum, [, value]) => sum + (value ?? 0), 0);
      const assetAllocation: AssetAllocation[] = entries
        .filter(([, value]) => (value ?? 0) > 0)
        .map(([category, value]) => ({
          category,
          value,
          percentage: total > 0 ? (value / total) * 100 : 0,
        }));
      return { ...data, assetAllocation };
    },
  });
}

export function useNetWorth() {
  return useQuery<NetWorth>({
    queryKey: queryKeys.netWorth,
    queryFn: async () => {
      const { data } = await api.get('/analytics/net-worth');
      return data;
    },
  });
}

export function useCashFlow(year?: number, month?: number) {
  return useQuery<CashFlow>({
    queryKey: queryKeys.cashFlow(year, month),
    queryFn: async () => {
      const params: Record<string, number> = {};
      if (year) params.year = year;
      if (month) params.month = month;
      const { data } = await api.get('/analytics/cash-flow', { params });
      return data;
    },
  });
}

export function useNetWorthHistory() {
  return useQuery<NetWorthHistoryPoint[]>({
    queryKey: queryKeys.netWorthHistory,
    queryFn: async () => {
      const { data } = await api.get('/analytics/net-worth-history');
      return data;
    },
  });
}

// ─── Stocks ─────────────────────────────────────────────────────────────────

export function useStocks() {
  return useQuery<Stock[]>({
    queryKey: queryKeys.stocks,
    queryFn: async () => {
      const { data } = await api.get('/stocks');
      return data;
    },
  });
}

export function useStock(id: string) {
  return useQuery<Stock>({
    queryKey: queryKeys.stock(id),
    queryFn: async () => {
      const { data } = await api.get(`/stocks/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (stock: Partial<Stock>) => {
      const { data } = await api.post('/stocks', stock);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stocks });
    },
  });
}

export function useUpdateStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...stock }: Partial<Stock> & { id: string }) => {
      const { data } = await api.put(`/stocks/${id}`, stock);
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stocks });
      queryClient.invalidateQueries({ queryKey: queryKeys.stock(variables.id) });
    },
  });
}

export function useDeleteStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/stocks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stocks });
    },
  });
}

export function useCreateDividend(stockId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dividend: { amount: number; paymentDate: string; frequency: string }) => {
      const { data } = await api.post(`/stocks/${stockId}/dividends`, dividend);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stock(stockId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.stocks });
    },
  });
}

// ─── Properties ─────────────────────────────────────────────────────────────

export function useProperties() {
  return useQuery<Property[]>({
    queryKey: queryKeys.properties,
    queryFn: async () => {
      const { data } = await api.get('/properties');
      return data;
    },
  });
}

export function useProperty(id: string) {
  return useQuery<Property>({
    queryKey: queryKeys.property(id),
    queryFn: async () => {
      const { data } = await api.get(`/properties/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (property: Partial<Property>) => {
      const { data } = await api.post('/properties', property);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties });
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...property }: Partial<Property> & { id: string }) => {
      const { data } = await api.put(`/properties/${id}`, property);
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties });
      queryClient.invalidateQueries({ queryKey: queryKeys.property(variables.id) });
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/properties/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties });
    },
  });
}

export function useCreateValuation(propertyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (valuation: { value: number; valuationDate: string; source: string }) => {
      const { data } = await api.post(`/properties/${propertyId}/valuations`, valuation);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.property(propertyId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.properties });
    },
  });
}

// ─── Cash Accounts ──────────────────────────────────────────────────────────

export function useCashAccounts() {
  return useQuery<CashAccount[]>({
    queryKey: queryKeys.cashAccounts,
    queryFn: async () => {
      const { data } = await api.get('/cash-accounts');
      return data;
    },
  });
}

export function useCreateCashAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (account: Partial<CashAccount>) => {
      const { data } = await api.post('/cash-accounts', account);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cashAccounts });
    },
  });
}

export function useUpdateCashAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...account }: Partial<CashAccount> & { id: string }) => {
      const { data } = await api.put(`/cash-accounts/${id}`, account);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cashAccounts });
    },
  });
}

export function useDeleteCashAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/cash-accounts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cashAccounts });
    },
  });
}

// ─── Transactions ───────────────────────────────────────────────────────────

export interface TransactionParams {
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
  type?: string;
  category?: string;
}

export function useTransactions(params?: TransactionParams) {
  return useQuery<PagedResult<Transaction>>({
    queryKey: queryKeys.transactions(params),
    queryFn: async () => {
      const { data } = await api.get('/transactions', { params });
      return data;
    },
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (transaction: Partial<Transaction>) => {
      const { data } = await api.post('/transactions', transaction);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.cashAccounts });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/transactions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.cashAccounts });
    },
  });
}

// ─── Loans ──────────────────────────────────────────────────────────────────

export function useLoans() {
  return useQuery<Loan[]>({
    queryKey: queryKeys.loans,
    queryFn: async () => {
      const { data } = await api.get('/loans');
      return data;
    },
  });
}

export function useLoan(id: string) {
  return useQuery<Loan>({
    queryKey: queryKeys.loan(id),
    queryFn: async () => {
      const { data } = await api.get(`/loans/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (loan: Partial<Loan>) => {
      const { data } = await api.post('/loans', loan);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.loans });
    },
  });
}

export function useUpdateLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...loan }: Partial<Loan> & { id: string }) => {
      const { data } = await api.put(`/loans/${id}`, loan);
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.loans });
      queryClient.invalidateQueries({ queryKey: queryKeys.loan(variables.id) });
    },
  });
}

export function useDeleteLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/loans/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.loans });
    },
  });
}

export function useLoanPayments(loanId: string) {
  return useQuery<LoanPayment[]>({
    queryKey: queryKeys.loanPayments(loanId),
    queryFn: async () => {
      const { data } = await api.get(`/loans/${loanId}/payments`);
      return data;
    },
    enabled: !!loanId,
  });
}

export function useCreateLoanPayment(loanId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payment: { amount: number; principalPortion: number; interestPortion: number; paymentDate: string }) => {
      const { data } = await api.post(`/loans/${loanId}/payments`, payment);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.loanPayments(loanId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.loan(loanId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.loans });
    },
  });
}

// ─── Recurring Payments ─────────────────────────────────────────────────────

export function useRecurringPayments() {
  return useQuery<RecurringPayment[]>({
    queryKey: queryKeys.recurringPayments,
    queryFn: async () => {
      const { data } = await api.get('/recurring-payments');
      return data;
    },
  });
}

export function useCreateRecurringPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payment: Partial<RecurringPayment>) => {
      const { data } = await api.post('/recurring-payments', payment);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recurringPayments });
    },
  });
}

export function useUpdateRecurringPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payment }: Partial<RecurringPayment> & { id: string }) => {
      const { data } = await api.put(`/recurring-payments/${id}`, payment);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recurringPayments });
    },
  });
}

export function useDeleteRecurringPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/recurring-payments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recurringPayments });
    },
  });
}

// ─── Calendar Events ────────────────────────────────────────────────────────

export function useCalendarEvents(startDate?: string, endDate?: string) {
  return useQuery<CalendarEvent[]>({
    queryKey: queryKeys.calendarEvents(startDate, endDate),
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const { data } = await api.get('/calendar', { params });
      return data;
    },
  });
}

export function useCreateCalendarEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (event: Partial<CalendarEvent>) => {
      const { data } = await api.post('/calendar', event);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    },
  });
}

export function useUpdateCalendarEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...event }: Partial<CalendarEvent> & { id: string }) => {
      const { data } = await api.put(`/calendar/${id}`, event);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    },
  });
}

export function useDeleteCalendarEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/calendar/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    },
  });
}
