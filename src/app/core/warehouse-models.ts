export interface DashboardLowStockAlert {
  sku: string;
  itemName: string;
  quantityOnHand: number;
  reorderThreshold: number;
  status: string;
}

export interface DashboardSummary {
  activeSuppliers: number;
  trackedItems: number;
  lowStockItems: number;
  openOrders: number;
  openOrderValue: number;
  netCashPosition: number;
  lowStockAlerts: DashboardLowStockAlert[];
}

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phoneNumber: string;
  active: boolean;
}

export interface CreateSupplierRequest {
  name: string;
  contactName: string;
  email: string;
  phoneNumber: string;
}

export interface UpdateSupplierRequest extends CreateSupplierRequest {
  active: boolean;
}

export interface StockItem {
  id: string;
  sku: string;
  name: string;
  supplierId: string;
  supplierName: string;
  unitCost: number;
  quantityOnHand: number;
  reorderThreshold: number;
  status: string;
}

export interface LowStockAlert {
  id: string;
  sku: string;
  name: string;
  quantityOnHand: number;
  reorderThreshold: number;
  status: string;
}

export interface CreateStockItemRequest {
  sku: string;
  name: string;
  supplierId: string;
  unitCost: number;
  quantityOnHand: number;
  reorderThreshold: number;
}

export interface UpdateStockItemRequest {
  name: string;
  supplierId: string;
  unitCost: number;
  reorderThreshold: number;
}

