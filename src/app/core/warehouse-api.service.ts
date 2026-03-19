import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CreateStockItemRequest,
  CreateSupplierRequest,
  DashboardSummary,
  LowStockAlert,
  StockItem,
  Supplier,
  UpdateStockItemRequest,
  UpdateSupplierRequest,
} from './warehouse-models';

@Injectable({
  providedIn: 'root'
})
export class WarehouseApiService {

  private readonly apiBaseUrl = '/api';

  constructor(private readonly http: HttpClient) {}

  getDashboardSummary() {
    return this.http.get<DashboardSummary>(`${this.apiBaseUrl}/dashboard/summary`);
  }

  listSuppliers() {
    return this.http.get<Supplier[]>(`${this.apiBaseUrl}/suppliers`);
  }

  createSupplier(request: CreateSupplierRequest) {
    return this.http.post<Supplier>(`${this.apiBaseUrl}/suppliers`, request);
  }

  updateSupplier(supplierId: string, request: UpdateSupplierRequest) {
    return this.http.put<Supplier>(`${this.apiBaseUrl}/suppliers/${supplierId}`, request);
  }

  deleteSupplier(supplierId: string) {
    return this.http.delete<void>(`${this.apiBaseUrl}/suppliers/${supplierId}`);
  }

  listStockItems() {
    return this.http.get<StockItem[]>(`${this.apiBaseUrl}/inventory`);
  }

  listLowStockAlerts() {
    return this.http.get<LowStockAlert[]>(`${this.apiBaseUrl}/inventory/alerts/low-stock`);
  }

  createStockItem(request: CreateStockItemRequest) {
    return this.http.post<StockItem>(`${this.apiBaseUrl}/inventory`, request);
  }

  updateStockItem(stockItemId: string, request: UpdateStockItemRequest) {
    return this.http.put<StockItem>(`${this.apiBaseUrl}/inventory/${stockItemId}`, request);
  }

  receiveStock(stockItemId: string, quantity: number) {
    return this.http.post<StockItem>(`${this.apiBaseUrl}/inventory/${stockItemId}/receipts`, { quantity });
  }
}

