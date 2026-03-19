import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = 'Warehouse Management System';
  protected readonly subtitle = 'BNU Industry Solutions Ltd';

  protected readonly navigation = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      hint: 'Architecture and delivery overview'
    },
    {
      label: 'Suppliers',
      route: '/suppliers',
      hint: 'Supplier management design notes'
    },
    {
      label: 'Inventory',
      route: '/inventory',
      hint: 'Stock control and low-stock rules'
    },
    {
      label: 'Orders',
      route: '/orders',
      hint: 'Order lifecycle and fulfilment flow'
    },
    {
      label: 'Finance',
      route: '/finance',
      hint: 'Transaction hierarchy and reporting'
    }
  ];

  protected readonly branchSummary = 'Current branch: setup, proposal, architecture, and application shells.';
}
