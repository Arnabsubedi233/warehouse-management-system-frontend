import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPageComponent } from './features/dashboard/dashboard-page';
import { FinancePageComponent } from './features/finance/finance-page';
import { InventoryPageComponent } from './features/inventory/inventory-page';
import { OrdersPageComponent } from './features/orders/orders-page';
import { SuppliersPageComponent } from './features/suppliers/suppliers-page';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardPageComponent, title: 'Dashboard' },
  { path: 'suppliers', component: SuppliersPageComponent, title: 'Suppliers' },
  { path: 'inventory', component: InventoryPageComponent, title: 'Inventory' },
  { path: 'orders', component: OrdersPageComponent, title: 'Orders' },
  { path: 'finance', component: FinancePageComponent, title: 'Finance' },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
