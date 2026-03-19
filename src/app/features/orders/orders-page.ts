import { Component } from '@angular/core';

@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.html',
  standalone: false,
  styleUrl: './orders-page.scss'
})
export class OrdersPageComponent {
  protected readonly lifecycle = [
    'Draft order is created with one or more order lines',
    'Confirmed order becomes ready for stock allocation',
    'Fulfilled order reduces stock and triggers finance recording'
  ];

  protected readonly sequenceDiagramNotes = [
    'Show Angular calling the order controller rather than the domain objects directly',
    'Show the application service coordinating inventory and finance',
    'Use the sequence diagram to prove UI-business decoupling'
  ];
}

