import { Component } from '@angular/core';

@Component({
  selector: 'app-suppliers-page',
  templateUrl: './suppliers-page.html',
  standalone: false,
  styleUrl: './suppliers-page.scss'
})
export class SuppliersPageComponent {
  protected readonly responsibilities = [
    'Maintain supplier contact details and active status',
    'Support add, edit, view, and delete operations',
    'Provide a link between suppliers and stock items'
  ];

  protected readonly umlNotes = [
    'Show a one-to-many relationship from Supplier to StockItem',
    'Include encapsulated contact update behaviour in Supplier',
    'Mention a future purchase order association in the report even if it is deferred'
  ];
}

