import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { StockItem } from '../../interface/inventory.interface';
import {
  CreateSupplierPurchaseOrderLineRequest,
  CreateSupplierRequest,
  Supplier,
  SupplierPurchaseOrder,
} from '../../interface/supplier.interface';
import { WarehouseApiService } from '../../services/warehouse-api/warehouse-api.service';

@Component({
  selector: 'app-suppliers-page',
  templateUrl: './suppliers-page.html',
  standalone: false,
  styleUrl: './suppliers-page.scss'
})
export class SuppliersPageComponent implements OnInit {
  protected suppliers: Supplier[] = [];
  protected stockItems: StockItem[] = [];
  protected purchaseOrders: SupplierPurchaseOrder[] = [];
  protected loading = true;
  protected savingSupplier = false;
  protected savingPurchaseOrder = false;
  protected busySupplierId = '';
  protected busyPurchaseOrderId = '';
  protected selectedSupplierId = '';
  protected error = '';
  protected success = '';
  protected supplierDraft: CreateSupplierRequest = {
    name: '',
    contactName: '',
    email: '',
    phoneNumber: ''
  };
  protected purchaseOrderDraft = {
    orderLines: [this.createEmptyPurchaseOrderLine()]
  };

  constructor(private readonly warehouseApiService: WarehouseApiService) {}

  ngOnInit(): void {
    this.loadData();
  }

  protected loadData(): void {
    this.loading = true;
    this.error = '';
    forkJoin({
      suppliers: this.warehouseApiService.listSuppliers(),
      stockItems: this.warehouseApiService.listStockItems(),
      purchaseOrders: this.warehouseApiService.listPurchaseOrders()
    }).subscribe({
      next: ({ suppliers, stockItems, purchaseOrders }) => {
        this.suppliers = suppliers;
        this.stockItems = stockItems;
        this.purchaseOrders = [...purchaseOrders].sort((left, right) =>
          right.orderedOn.localeCompare(left.orderedOn)
        );
        this.ensureSelectedSupplier();
        this.loading = false;
      },
      error: () => {
        this.error = 'Supplier data could not be loaded.';
        this.loading = false;
      }
    });
  }

  protected submitSupplier(): void {
    this.savingSupplier = true;
    this.error = '';
    this.success = '';
    this.warehouseApiService.createSupplier(this.supplierDraft).subscribe({
      next: () => {
        this.supplierDraft = {
          name: '',
          contactName: '',
          email: '',
          phoneNumber: ''
        };
        this.success = 'Supplier saved successfully.';
        this.savingSupplier = false;
        this.loadData();
      },
      error: () => {
        this.error = 'The supplier could not be saved.';
        this.savingSupplier = false;
      }
    });
  }

  protected toggleStatus(supplier: Supplier): void {
    this.busySupplierId = supplier.id;
    this.error = '';
    this.success = '';
    this.warehouseApiService.updateSupplier(supplier.id, {
      name: supplier.name,
      contactName: supplier.contactName,
      email: supplier.email,
      phoneNumber: supplier.phoneNumber,
      active: !supplier.active
    }).subscribe({
      next: () => {
        this.success = 'Supplier status updated.';
        this.busySupplierId = '';
        this.loadData();
      },
      error: () => {
        this.error = 'The supplier status could not be updated.';
        this.busySupplierId = '';
      }
    });
  }

  protected deleteSupplier(supplier: Supplier): void {
    if (!window.confirm(`Delete supplier "${supplier.name}"?`)) {
      return;
    }

    this.busySupplierId = supplier.id;
    this.error = '';
    this.success = '';
    this.warehouseApiService.deleteSupplier(supplier.id).subscribe({
      next: () => {
        this.success = 'Supplier deleted successfully.';
        this.busySupplierId = '';
        this.loadData();
      },
      error: () => {
        this.error = 'The supplier could not be deleted. It may still be linked to stock items.';
        this.busySupplierId = '';
      }
    });
  }

  protected get selectedSupplier(): Supplier | undefined {
    return this.suppliers.find((supplier) => supplier.id === this.selectedSupplierId);
  }

  protected get selectedSupplierStockItems(): StockItem[] {
    return this.stockItems.filter((stockItem) => stockItem.supplierId === this.selectedSupplierId);
  }

  protected get selectedSupplierPurchaseOrders(): SupplierPurchaseOrder[] {
    return this.purchaseOrders.filter((purchaseOrder) => purchaseOrder.supplierId === this.selectedSupplierId);
  }

  protected onSupplierSelectionChange(supplierId: string): void {
    this.selectedSupplierId = supplierId;
    this.resetPurchaseOrderDraft();
  }

  protected addPurchaseOrderLine(): void {
    this.purchaseOrderDraft.orderLines = [
      ...this.purchaseOrderDraft.orderLines,
      this.createEmptyPurchaseOrderLine()
    ];
  }

  protected removePurchaseOrderLine(index: number): void {
    if (this.purchaseOrderDraft.orderLines.length === 1) {
      return;
    }
    this.purchaseOrderDraft.orderLines = this.purchaseOrderDraft.orderLines.filter((_, lineIndex) => lineIndex !== index);
  }

  protected updatePurchaseOrderLineStockItem(index: number, stockItemId: string): void {
    const stockItem = this.selectedSupplierStockItems.find((item) => item.id === stockItemId);
    this.purchaseOrderDraft.orderLines = this.purchaseOrderDraft.orderLines.map((line, lineIndex) => {
      if (lineIndex !== index) {
        return line;
      }
      return {
        ...line,
        stockItemId,
        unitCost: stockItem ? Number(stockItem.unitCost) : line.unitCost
      };
    });
  }

  protected submitPurchaseOrder(): void {
    if (!this.selectedSupplierId) {
      return;
    }

    this.savingPurchaseOrder = true;
    this.error = '';
    this.success = '';
    this.warehouseApiService.createSupplierPurchaseOrder(this.selectedSupplierId, {
      orderLines: this.purchaseOrderDraft.orderLines.map((line) => ({
        stockItemId: line.stockItemId,
        quantity: Number(line.quantity),
        unitCost: Number(line.unitCost)
      }))
    }).subscribe({
      next: () => {
        this.resetPurchaseOrderDraft();
        this.success = 'Purchase order created successfully.';
        this.savingPurchaseOrder = false;
        this.loadData();
      },
      error: () => {
        this.error = 'The purchase order could not be created.';
        this.savingPurchaseOrder = false;
      }
    });
  }

  protected dispatchPurchaseOrder(purchaseOrder: SupplierPurchaseOrder): void {
    this.busyPurchaseOrderId = purchaseOrder.id;
    this.error = '';
    this.success = '';
    this.warehouseApiService.dispatchPurchaseOrder(purchaseOrder.id).subscribe({
      next: () => {
        this.success = 'Purchase order moved into transit.';
        this.busyPurchaseOrderId = '';
        this.loadData();
      },
      error: () => {
        this.error = 'The purchase order could not be updated.';
        this.busyPurchaseOrderId = '';
      }
    });
  }

  protected receiveDelivery(purchaseOrder: SupplierPurchaseOrder): void {
    this.busyPurchaseOrderId = purchaseOrder.id;
    this.error = '';
    this.success = '';
    this.warehouseApiService.receivePurchaseOrderDelivery(purchaseOrder.id).subscribe({
      next: () => {
        this.success = 'Delivery received successfully.';
        this.busyPurchaseOrderId = '';
        this.loadData();
      },
      error: () => {
        this.error = 'The delivery could not be received.';
        this.busyPurchaseOrderId = '';
      }
    });
  }

  protected canSubmitPurchaseOrder(): boolean {
    return this.selectedSupplier?.active === true
      && this.purchaseOrderDraft.orderLines.every((line) =>
        line.stockItemId !== ''
        && Number(line.quantity) > 0
        && Number(line.unitCost) > 0
      );
  }

  protected formatPurchaseOrderSummary(purchaseOrder: SupplierPurchaseOrder): string {
    return purchaseOrder.orderLines
      .map((line) => `${line.productName} x${line.quantity}`)
      .join(', ');
  }

  private ensureSelectedSupplier(): void {
    if (this.suppliers.some((supplier) => supplier.id === this.selectedSupplierId)) {
      return;
    }
    this.selectedSupplierId = this.suppliers[0]?.id ?? '';
    this.resetPurchaseOrderDraft();
  }

  private resetPurchaseOrderDraft(): void {
    this.purchaseOrderDraft = {
      orderLines: [this.createEmptyPurchaseOrderLine()]
    };
  }

  private createEmptyPurchaseOrderLine(): CreateSupplierPurchaseOrderLineRequest {
    return {
      stockItemId: '',
      quantity: 1,
      unitCost: 0
    };
  }
}
