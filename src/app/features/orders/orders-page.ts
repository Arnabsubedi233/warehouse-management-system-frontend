import { Component } from '@angular/core';

@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.html',
  standalone: false,
  styleUrl: './orders-page.scss'
})
export class OrdersPageComponent {
  protected readonly statusMessage =
    'The current service build already supports dashboard, supplier, and inventory features.';
}
