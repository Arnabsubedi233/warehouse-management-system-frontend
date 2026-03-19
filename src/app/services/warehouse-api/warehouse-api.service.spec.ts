import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { WarehouseApiService } from './warehouse-api.service';
import { DashboardSummary } from '../../interface/dashboard.interface';
import { CreateSupplierRequest } from '../../interface/supplier.interface';
import { CreateStockItemRequest } from '../../interface/inventory.interface';

describe('WarehouseApiService', () => {
  let service: WarehouseApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        WarehouseApiService,
      ],
    });

    service = TestBed.inject(WarehouseApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should request the dashboard summary', () => {
    const response: DashboardSummary = {
      activeSuppliers: 2,
      trackedItems: 4,
      lowStockItems: 1,
      openOrders: 2,
      openOrderValue: 725,
      netCashPosition: 525,
      lowStockAlerts: [],
    };

    service.getDashboardSummary().subscribe((result) => {
      expect(result).toEqual(response);
    });

    const request = httpTestingController.expectOne('/api/dashboard/summary');
    expect(request.request.method).toBe('GET');
    request.flush(response);
  });

  it('should create a supplier', () => {
    const requestBody: CreateSupplierRequest = {
      name: 'Acme Supplies',
      contactName: 'Jane Smith',
      email: 'jane@acme.test',
      phoneNumber: '01234567890',
    };

    service.createSupplier(requestBody).subscribe();

    const request = httpTestingController.expectOne('/api/suppliers');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(requestBody);
    request.flush({ id: 'sup-1', ...requestBody, active: true });
  });

  it('should request the supplier list', () => {
    service.listSuppliers().subscribe();

    const request = httpTestingController.expectOne('/api/suppliers');
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('should update a supplier', () => {
    const requestBody = {
      name: 'Acme Supplies',
      contactName: 'Jane Smith',
      email: 'jane@acme.test',
      phoneNumber: '01234567890',
      active: false,
    };

    service.updateSupplier('sup-1', requestBody).subscribe();

    const request = httpTestingController.expectOne('/api/suppliers/sup-1');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(requestBody);
    request.flush({ id: 'sup-1', ...requestBody });
  });

  it('should delete a supplier', () => {
    service.deleteSupplier('sup-1').subscribe();

    const request = httpTestingController.expectOne('/api/suppliers/sup-1');
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });

  it('should create a stock item', () => {
    const requestBody: CreateStockItemRequest = {
      sku: 'BNU-001',
      name: 'Steel Bolts',
      supplierId: 'sup-1',
      unitCost: 4.5,
      quantityOnHand: 18,
      reorderThreshold: 20,
    };

    service.createStockItem(requestBody).subscribe();

    const request = httpTestingController.expectOne('/api/inventory');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(requestBody);
    request.flush({
      id: 'stock-1',
      ...requestBody,
      supplierName: 'Acme Supplies',
      status: 'LOW',
    });
  });

  it('should request the stock item list', () => {
    service.listStockItems().subscribe();

    const request = httpTestingController.expectOne('/api/inventory');
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('should request the low-stock alerts', () => {
    service.listLowStockAlerts().subscribe();

    const request = httpTestingController.expectOne('/api/inventory/alerts/low-stock');
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('should update a stock item', () => {
    const requestBody = {
      name: 'Steel Bolts',
      supplierId: 'sup-1',
      unitCost: 4.5,
      reorderThreshold: 20,
    };

    service.updateStockItem('stock-1', requestBody).subscribe();

    const request = httpTestingController.expectOne('/api/inventory/stock-1');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(requestBody);
    request.flush({
      id: 'stock-1',
      sku: 'BNU-001',
      supplierName: 'Acme Supplies',
      quantityOnHand: 18,
      status: 'LOW',
      ...requestBody,
    });
  });

  it('should receive stock for an item', () => {
    service.receiveStock('stock-1', 12).subscribe();

    const request = httpTestingController.expectOne(
      '/api/inventory/stock-1/receipts',
    );
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ quantity: 12 });
    request.flush({
      id: 'stock-1',
      sku: 'BNU-001',
      name: 'Steel Bolts',
      supplierId: 'sup-1',
      supplierName: 'Acme Supplies',
      unitCost: 4.5,
      quantityOnHand: 30,
      reorderThreshold: 20,
      status: 'NORMAL',
    });
  });
});
