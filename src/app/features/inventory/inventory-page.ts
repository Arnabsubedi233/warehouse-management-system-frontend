import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CreateStockItemRequest, LowStockAlert, StockItem, UpdateStockItemRequest } from '../../interface/inventory.interface';
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
  protected editingStockItemId = '';
  protected busyStockItemId = '';
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
        if (this.editingStockItemId && !stockItems.some((stockItem) => stockItem.id === this.editingStockItemId)) {
          this.resetDraft();
        }
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
    const editingStockItem = this.editingStockItem;
    const request = editingStockItem
      ? this.warehouseApiService.updateStockItem(editingStockItem.id, this.toUpdateRequest())
      : this.warehouseApiService.createStockItem({
          ...this.draft,
          unitCost: Number(this.draft.unitCost),
          quantityOnHand: Number(this.draft.quantityOnHand),
          reorderThreshold: Number(this.draft.reorderThreshold)
        });

    request.subscribe({
      next: () => {
        this.success = editingStockItem
          ? 'Stock item updated successfully.'
          : 'Stock item saved successfully.';
        this.saving = false;
        this.resetDraft();
        this.loadInventory();
      },
      error: () => {
        this.error = editingStockItem
          ? 'The stock item could not be updated.'
          : 'The stock item could not be saved.';
        this.saving = false;
      }
    });
  }

  protected beginEditStockItem(stockItem: StockItem): void {
    this.editingStockItemId = stockItem.id;
    this.error = '';
    this.success = '';
    this.draft = {
      sku: stockItem.sku,
      name: stockItem.name,
      supplierId: stockItem.supplierId,
      unitCost: Number(stockItem.unitCost),
      quantityOnHand: stockItem.quantityOnHand,
      reorderThreshold: stockItem.reorderThreshold
    };
  }

  protected cancelEditStockItem(): void {
    this.resetDraft();
    this.error = '';
    this.success = '';
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
    this.busyStockItemId = stockItem.id;
    this.warehouseApiService.receiveStock(stockItem.id, quantity).subscribe({
      next: () => {
        this.receiptQuantities[stockItem.id] = 0;
        this.success = `Received ${quantity} units into ${stockItem.name}.`;
        this.busyStockItemId = '';
        this.loadInventory();
      },
      error: () => {
        this.error = 'The stock receipt could not be processed.';
        this.busyStockItemId = '';
      }
    });
  }

  protected get isEditingStockItem(): boolean {
    return this.editingStockItemId !== '';
  }

  protected get editingStockItem(): StockItem | undefined {
    return this.stockItems.find((stockItem) => stockItem.id === this.editingStockItemId);
  }

  private toUpdateRequest(): UpdateStockItemRequest {
    return {
      name: this.draft.name,
      supplierId: this.draft.supplierId,
      unitCost: Number(this.draft.unitCost),
      reorderThreshold: Number(this.draft.reorderThreshold)
    };
  }

  private resetDraft(): void {
    this.editingStockItemId = '';
    this.draft = {
      sku: '',
      name: '',
      supplierId: '',
      unitCost: 0,
      quantityOnHand: 0,
      reorderThreshold: 0
    };
  }
}
