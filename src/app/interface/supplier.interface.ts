export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phoneNumber: string;
  active: boolean;
}

export type SupplierPurchaseOrderStatus = 'PLACED' | 'IN_TRANSIT' | 'DELIVERED';

export interface SupplierPurchaseOrderLine {
  stockItemId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  lineTotal: number;
}

export interface SupplierPurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  orderedOn: string;
  deliveredOn: string | null;
  status: SupplierPurchaseOrderStatus;
  totalValue: number;
  orderLines: SupplierPurchaseOrderLine[];
}

export interface CreateSupplierRequest {
  name: string;
  contactName: string;
  email: string;
  phoneNumber: string;
}

export interface CreateSupplierPurchaseOrderLineRequest {
  stockItemId: string;
  quantity: number;
  unitCost: number;
}

export interface CreateSupplierPurchaseOrderRequest {
  orderLines: CreateSupplierPurchaseOrderLineRequest[];
}

export interface UpdateSupplierRequest extends CreateSupplierRequest {
  active: boolean;
}
