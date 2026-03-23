import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { StockItem } from '../../interface/inventory.interface';
import { CreateCustomerOrderRequest, CreateOrderLineRequest, CustomerOrder } from '../../interface/order.interface';
import { WarehouseApiService } from '../../services/warehouse-api/warehouse-api.service';

@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.html',
  standalone: false,
  styleUrl: './orders-page.scss'
})
export class OrdersPageComponent implements OnInit {
  protected orders: CustomerOrder[] = [];
  protected stockItems: StockItem[] = [];
  protected loading = true;
  protected saving = false;
  protected busyOrderId = '';
  protected error = '';
  protected success = '';
  protected draft: CreateCustomerOrderRequest = {
    customerName: '',
    orderLines: [this.createEmptyLine()]
  };

  constructor(private readonly warehouseApiService: WarehouseApiService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  protected loadOrders(): void {
    this.loading = true;
    this.error = '';
    forkJoin({
      orders: this.warehouseApiService.listOrders(),
      stockItems: this.warehouseApiService.listStockItems()
    }).subscribe({
      next: ({ orders, stockItems }) => {
        this.orders = orders;
        this.stockItems = stockItems;
        this.loading = false;
      },
      error: () => {
        this.error = 'Order data could not be loaded.';
        this.loading = false;
      }
    });
  }

  protected addLine(): void {
    this.draft.orderLines = [...this.draft.orderLines, this.createEmptyLine()];
  }

  protected removeLine(index: number): void {
    if (this.draft.orderLines.length === 1) {
      return;
    }
    this.draft.orderLines = this.draft.orderLines.filter((_, lineIndex) => lineIndex !== index);
  }

  protected updateDraftLineStockItem(index: number, stockItemId: string): void {
    const stockItem = this.stockItems.find((item) => item.id === stockItemId);
    this.draft.orderLines = this.draft.orderLines.map((line, lineIndex) => {
      if (lineIndex !== index) {
        return line;
      }
      return {
        ...line,
        stockItemId,
        unitSalePrice: stockItem ? Number(stockItem.unitCost) : line.unitSalePrice
      };
    });
  }

  protected submitOrder(): void {
    this.saving = true;
    this.error = '';
    this.success = '';
    this.warehouseApiService.createOrder({
      customerName: this.draft.customerName,
      orderLines: this.draft.orderLines.map((line) => ({
        stockItemId: line.stockItemId,
        quantity: Number(line.quantity),
        unitSalePrice: Number(line.unitSalePrice)
      }))
    }).subscribe({
      next: () => {
        this.draft = {
          customerName: '',
          orderLines: [this.createEmptyLine()]
        };
        this.success = 'Order created successfully.';
        this.saving = false;
        this.loadOrders();
      },
      error: () => {
        this.error = 'The order could not be created.';
        this.saving = false;
      }
    });
  }

  protected confirmOrder(order: CustomerOrder): void {
    this.busyOrderId = order.id;
    this.error = '';
    this.success = '';
    this.warehouseApiService.confirmOrder(order.id).subscribe({
      next: () => {
        this.success = 'Order confirmed successfully.';
        this.busyOrderId = '';
        this.loadOrders();
      },
      error: () => {
        this.error = 'The order could not be confirmed.';
        this.busyOrderId = '';
      }
    });
  }

  protected fulfillOrder(order: CustomerOrder): void {
    this.busyOrderId = order.id;
    this.error = '';
    this.success = '';
    this.warehouseApiService.fulfillOrder(order.id).subscribe({
      next: () => {
        this.success = 'Order fulfilled successfully.';
        this.busyOrderId = '';
        this.loadOrders();
      },
      error: () => {
        this.error = 'The order could not be fulfilled.';
        this.busyOrderId = '';
      }
    });
  }

  protected canSubmitOrder(): boolean {
    return this.draft.customerName.trim().length > 0
      && this.draft.orderLines.every((line) =>
        line.stockItemId !== ''
        && Number(line.quantity) > 0
        && Number(line.unitSalePrice) > 0
      );
  }

  protected formatLineSummary(order: CustomerOrder): string {
    return order.orderLines
      .map((line) => `${line.productName} x${line.quantity}`)
      .join(', ');
  }

  private createEmptyLine(): CreateOrderLineRequest {
    return {
      stockItemId: '',
      quantity: 1,
      unitSalePrice: 0
    };
  }
}
