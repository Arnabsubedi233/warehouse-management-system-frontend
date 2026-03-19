import { Component, OnInit } from '@angular/core';
import { WarehouseApiService } from '../../core/warehouse-api.service';
import { DashboardSummary } from '../../core/warehouse-models';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.html',
  standalone: false,
  styleUrl: './dashboard-page.scss'
})
export class DashboardPageComponent implements OnInit {
  protected summary: DashboardSummary | null = null;
  protected loading = true;
  protected error = '';

  constructor(private readonly warehouseApiService: WarehouseApiService) {}

  ngOnInit(): void {
    this.loadSummary();
  }

  protected loadSummary(): void {
    this.loading = true;
    this.error = '';
    this.warehouseApiService.getDashboardSummary().subscribe({
      next: (summary) => {
        this.summary = summary;
        this.loading = false;
      },
      error: () => {
        this.error = 'The dashboard could not load data from the service.';
        this.loading = false;
      }
    });
  }
}
