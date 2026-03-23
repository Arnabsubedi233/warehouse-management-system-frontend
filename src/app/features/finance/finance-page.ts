import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { FinanceSummary, FinancialTransaction } from '../../interface/finance.interface';
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
  protected loading = true;
  protected error = '';

  constructor(private readonly warehouseApiService: WarehouseApiService) {}

  ngOnInit(): void {
    this.loadFinance();
  }

  protected loadFinance(): void {
    this.loading = true;
    this.error = '';
    forkJoin({
      summary: this.warehouseApiService.getFinanceSummary(),
      transactions: this.warehouseApiService.listFinancialTransactions()
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
}
