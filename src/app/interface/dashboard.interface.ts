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
