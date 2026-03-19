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
