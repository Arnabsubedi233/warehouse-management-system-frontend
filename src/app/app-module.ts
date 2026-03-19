import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { DashboardPageComponent } from './features/dashboard/dashboard-page';
import { FinancePageComponent } from './features/finance/finance-page';
import { InventoryPageComponent } from './features/inventory/inventory-page';
import { OrdersPageComponent } from './features/orders/orders-page';
import { SuppliersPageComponent } from './features/suppliers/suppliers-page';

@NgModule({
  declarations: [
    App,
    DashboardPageComponent,
    SuppliersPageComponent,
    InventoryPageComponent,
    OrdersPageComponent,
    FinancePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
