import { Component } from '@angular/core';

@Component({
  selector: 'app-finance-page',
  templateUrl: './finance-page.html',
  standalone: false,
  styleUrl: './finance-page.scss'
})
export class FinancePageComponent {
  protected readonly statusMessage =
    'Finance summaries are already reflected on the dashboard in the current service build.';
}
