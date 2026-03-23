export type FinanceTransactionType = 'PURCHASE' | 'SALE';

export interface FinanceSummary {
  salesTotal: number;
  purchaseTotal: number;
  netCashPosition: number;
  transactionCount: number;
}

export interface FinancialTransaction {
  id: string;
  description: string;
  occurredOn: string;
  amount: number;
  signedAmount: number;
  transactionType: FinanceTransactionType;
}

export interface FinanceReportFilter {
  from: string;
  to: string;
  transactionType: FinanceTransactionType | 'ALL';
}
