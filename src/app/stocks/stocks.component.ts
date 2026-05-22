import { Component, OnInit, inject, signal, ViewChild } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService, Stock } from '../services/api.service';

@Component({
  selector: 'app-stocks',
  standalone: true,
  imports: [
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './stocks.component.html',
  styleUrl: './stocks.component.scss',
})
export class StocksComponent implements OnInit {
  private readonly api = inject(ApiService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<Stock>([]);
  isLoading = signal(true);
  displayedColumns = ['ticker_code', 'company_name', 'sector'];

  ngOnInit() {
    this.api.getStocks().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.filterPredicate = (row, filter) => {
          const q = filter.trim().toLowerCase();
          return (
            row.ticker_code.toLowerCase().includes(q) ||
            row.company_name.toLowerCase().includes(q)
          );
        };
        this.isLoading.set(false);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        });
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
