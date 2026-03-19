import { Component } from '@angular/core';

@Component({
  selector: 'app-finance-page',
  templateUrl: './finance-page.html',
  standalone: false,
  styleUrl: './finance-page.scss'
})
export class FinancePageComponent {
  protected readonly ooHighlights = [
    'Use an abstract FinancialTransaction base class for shared data',
    'Model PurchaseTransaction and SaleTransaction as concrete subclasses',
    'Use polymorphism when calculating signed values for reporting'
  ];

  protected readonly reportOutputs = [
    'Monthly sales total',
    'Monthly purchase total',
    'Net cash position based on transaction type'
  ];
}

