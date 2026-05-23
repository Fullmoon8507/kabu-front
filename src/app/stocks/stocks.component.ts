import { Component, OnInit, inject, signal, ViewChild } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService, Stock, StockCreate } from '../services/api.service';
import { StockDialogComponent } from './stock-dialog/stock-dialog.component';

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
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './stocks.component.html',
  styleUrl: './stocks.component.scss',
})
export class StocksComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<Stock>([]);
  isLoading = signal(true);
  displayedColumns = ['ticker_code', 'company_name', 'sector'];

  ngOnInit() {
    this.loadStocks();
  }

  loadStocks() {
    this.isLoading.set(true);
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

  openAddDialog() {
    const ref = this.dialog.open(StockDialogComponent, {
      width: '400px',
      disableClose: true,
    });

    ref.afterClosed().subscribe((result: StockCreate | undefined) => {
      if (!result) return;
      this.api.createStock(result).subscribe({
        next: () => {
          this.snackBar.open('銘柄を登録しました', '', { duration: 2000 });
          this.loadStocks();
        },
        error: (err: HttpErrorResponse) => {
          const msg = err.error?.detail ?? '登録に失敗しました';
          this.snackBar.open(msg, '閉じる', { duration: 5000 });
        },
      });
    });
  }
}
