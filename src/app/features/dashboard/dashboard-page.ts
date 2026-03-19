import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.html',
  standalone: false,
  styleUrl: './dashboard-page.scss'
})
export class DashboardPageComponent {
  protected readonly milestoneCards = [
    {
      title: 'Design',
      detail: 'Architecture notes, UML candidates, and project proposal are prepared first so later code has a defensible rationale.'
    },
    {
      title: 'Implementation',
      detail: 'The first backend slice already demonstrates encapsulation, composition, inheritance, and repository abstraction.'
    },
    {
      title: 'Testing',
      detail: 'Domain rules are being covered early so the report can reference concrete automated evidence.'
    }
  ];

  protected readonly nextPrs = [
    'Supplier and inventory CRUD workflows',
    'Order processing and financial reporting services',
    'Angular forms and backend integration'
  ];
}

