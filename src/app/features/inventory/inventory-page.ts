import { Component } from '@angular/core';

@Component({
  selector: 'app-inventory-page',
  templateUrl: './inventory-page.html',
  standalone: false,
  styleUrl: './inventory-page.scss'
})
export class InventoryPageComponent {
  protected readonly businessRules = [
    'Stock quantity must never drop below zero',
    'Low stock should trigger when quantity reaches or falls below the reorder threshold',
    'Receiving stock and allocating stock should be separate domain behaviours'
  ];

  protected readonly testingIdeas = [
    'Allocating more than available stock should raise an error',
    'Receiving stock should increase the quantity on hand',
    'Status should move between NORMAL, LOW, and OUT_OF_STOCK correctly'
  ];
}

