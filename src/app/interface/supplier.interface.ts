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
