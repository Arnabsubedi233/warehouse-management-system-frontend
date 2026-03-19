import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = 'Warehouse Management System';
  protected readonly subtitle = 'Service Interface';

  protected readonly navigation = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      hint: 'Overview and live totals'
    },
    {
      label: 'Suppliers',
      route: '/suppliers',
      hint: 'Manage supplier records'
    },
    {
      label: 'Inventory',
      route: '/inventory',
      hint: 'Track stock and receipts'
    },
    {
      label: 'Orders',
      route: '/orders',
      hint: 'Order screens'
    },
    {
      label: 'Finance',
      route: '/finance',
      hint: 'Finance screens'
    }
  ];

  protected readonly summary = 'Use the navigation to work with warehouse data through the backend service.';
}
