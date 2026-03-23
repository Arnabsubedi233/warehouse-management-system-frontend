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
  transactionType: 'PURCHASE' | 'SALE';
}
