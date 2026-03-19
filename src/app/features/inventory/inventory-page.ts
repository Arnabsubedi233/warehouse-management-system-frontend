import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CreateStockItemRequest, LowStockAlert, StockItem } from '../../interface/inventory.interface';
import { Supplier } from '../../interface/supplier.interface';
import { WarehouseApiService } from '../../services/warehouse-api/warehouse-api.service';

@Component({
  selector: 'app-inventory-page',
  templateUrl: './inventory-page.html',
  standalone: false,
  styleUrl: './inventory-page.scss'
})
export class InventoryPageComponent implements OnInit {
  protected stockItems: StockItem[] = [];
  protected suppliers: Supplier[] = [];
  protected lowStockAlerts: LowStockAlert[] = [];
  protected loading = true;
  protected saving = false;
  protected error = '';
  protected success = '';
  protected receiptQuantities: Record<string, number> = {};
  protected draft: CreateStockItemRequest = {
    sku: '',
    name: '',
    supplierId: '',
    unitCost: 0,
    quantityOnHand: 0,
    reorderThreshold: 0
  };

  constructor(private readonly warehouseApiService: WarehouseApiService) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  protected loadInventory(): void {
    this.loading = true;
    this.error = '';
    forkJoin({
      stockItems: this.warehouseApiService.listStockItems(),
      suppliers: this.warehouseApiService.listSuppliers(),
      lowStockAlerts: this.warehouseApiService.listLowStockAlerts()
    }).subscribe({
      next: ({ stockItems, suppliers, lowStockAlerts }) => {
        this.stockItems = stockItems;
        this.suppliers = suppliers;
        this.lowStockAlerts = lowStockAlerts;
        this.loading = false;
      },
      error: () => {
        this.error = 'Inventory data could not be loaded.';
        this.loading = false;
      }
    });
  }

  protected submitStockItem(): void {
    this.saving = true;
    this.error = '';
    this.success = '';
    this.warehouseApiService.createStockItem({
      ...this.draft,
      unitCost: Number(this.draft.unitCost),
      quantityOnHand: Number(this.draft.quantityOnHand),
      reorderThreshold: Number(this.draft.reorderThreshold)
    }).subscribe({
      next: () => {
        this.draft = {
          sku: '',
          name: '',
          supplierId: '',
          unitCost: 0,
          quantityOnHand: 0,
          reorderThreshold: 0
        };
        this.success = 'Stock item saved successfully.';
        this.saving = false;
        this.loadInventory();
      },
      error: () => {
        this.error = 'The stock item could not be saved.';
        this.saving = false;
      }
    });
  }

  protected receiveStock(stockItem: StockItem): void {
    const quantity = Number(this.receiptQuantities[stockItem.id] ?? 0);
    if (quantity < 1) {
      this.error = 'Receipt quantity must be at least 1.';
      this.success = '';
      return;
    }

    this.error = '';
    this.success = '';
    this.warehouseApiService.receiveStock(stockItem.id, quantity).subscribe({
      next: () => {
        this.receiptQuantities[stockItem.id] = 0;
        this.success = `Received ${quantity} units into ${stockItem.name}.`;
        this.loadInventory();
      },
      error: () => {
        this.error = 'The stock receipt could not be processed.';
      }
    });
  }
}
