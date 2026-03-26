import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import {
  FinanceReportFilter,
  FinanceSummary,
  FinancialTransaction,
} from '../../interface/finance.interface';
import { WarehouseApiService } from '../../services/warehouse-api/warehouse-api.service';

@Component({
  selector: 'app-finance-page',
  templateUrl: './finance-page.html',
  standalone: false,
  styleUrl: './finance-page.scss'
})
export class FinancePageComponent implements OnInit {
  protected summary: FinanceSummary | null = null;
  protected transactions: FinancialTransaction[] = [];
  protected filters: FinanceReportFilter = this.createDefaultFilters();
  protected loading = true;
  protected error = '';

  constructor(private readonly warehouseApiService: WarehouseApiService) {}

  ngOnInit(): void {
    this.loadFinance();
  }

  protected loadFinance(): void {
    if (this.filters.from && this.filters.to && this.filters.from > this.filters.to) {
      this.error = 'The report start date must be on or before the end date.';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.error = '';
    forkJoin({
      summary: this.warehouseApiService.getFinanceSummary(this.filters),
      transactions: this.warehouseApiService.listFinancialTransactions(this.filters)
    }).subscribe({
      next: ({ summary, transactions }) => {
        this.summary = summary;
        this.transactions = transactions;
        this.loading = false;
      },
      error: () => {
        this.error = 'Finance data could not be loaded.';
        this.loading = false;
      }
    });
  }

  protected applyFilters(): void {
    this.loadFinance();
  }

  protected resetFilters(): void {
    this.filters = this.createDefaultFilters();
    this.loadFinance();
  }

  protected get filterDescription(): string {
    const typeLabel = this.filters.transactionType === 'ALL'
      ? 'All transaction types'
      : `${this.filters.transactionType} only`;

    return `${this.filters.from} to ${this.filters.to} • ${typeLabel}`;
  }

  private createDefaultFilters(): FinanceReportFilter {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return {
      from: this.toDateInputValue(startOfMonth),
      to: this.toDateInputValue(endOfMonth),
      transactionType: 'ALL'
    };
  }

  private toDateInputValue(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
