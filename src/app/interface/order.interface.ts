export interface OrderLine {
  stockItemId: string;
  productName: string;
  quantity: number;
  unitSalePrice: number;
  lineTotal: number;
}

export interface CustomerOrder {
  id: string;
  customerName: string;
  status: 'DRAFT' | 'CONFIRMED' | 'FULFILLED';
  totalValue: number;
  orderLines: OrderLine[];
}

export interface CreateOrderLineRequest {
  stockItemId: string;
  quantity: number;
  unitSalePrice: number;
}

export interface CreateCustomerOrderRequest {
  customerName: string;
  orderLines: CreateOrderLineRequest[];
}
