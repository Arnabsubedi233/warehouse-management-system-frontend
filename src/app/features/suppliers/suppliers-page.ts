import { Component, OnInit } from '@angular/core';
import { WarehouseApiService } from '../../core/warehouse-api.service';
import { CreateSupplierRequest, Supplier } from '../../core/warehouse-models';

@Component({
  selector: 'app-suppliers-page',
  templateUrl: './suppliers-page.html',
  standalone: false,
  styleUrl: './suppliers-page.scss'
})
export class SuppliersPageComponent implements OnInit {
  protected suppliers: Supplier[] = [];
  protected loading = true;
  protected saving = false;
  protected busySupplierId = '';
  protected error = '';
  protected success = '';
  protected draft: CreateSupplierRequest = {
    name: '',
    contactName: '',
    email: '',
    phoneNumber: ''
  };

  constructor(private readonly warehouseApiService: WarehouseApiService) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  protected loadSuppliers(): void {
    this.loading = true;
    this.error = '';
    this.warehouseApiService.listSuppliers().subscribe({
      next: (suppliers) => {
        this.suppliers = suppliers;
        this.loading = false;
      },
      error: () => {
        this.error = 'Supplier data could not be loaded.';
        this.loading = false;
      }
    });
  }

  protected submitSupplier(): void {
    this.saving = true;
    this.error = '';
    this.success = '';
    this.warehouseApiService.createSupplier(this.draft).subscribe({
      next: () => {
        this.draft = {
          name: '',
          contactName: '',
          email: '',
          phoneNumber: ''
        };
        this.success = 'Supplier saved successfully.';
        this.saving = false;
        this.loadSuppliers();
      },
      error: () => {
        this.error = 'The supplier could not be saved.';
        this.saving = false;
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
        this.loadSuppliers();
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
        this.loadSuppliers();
      },
      error: () => {
        this.error = 'The supplier could not be deleted. It may still be linked to stock items.';
        this.busySupplierId = '';
      }
    });
  }
}
