import { Component, OnInit, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DecimalPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService, Holding, HoldingCreate, HoldingUpdate } from '../services/api.service';
import { HoldingDialogComponent } from './holding-dialog/holding-dialog.component';
import { HoldingDetailDialogComponent } from './holding-detail-dialog/holding-detail-dialog.component';

@Component({
  selector: 'app-holdings',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    DecimalPipe,
    DatePipe,
  ],
  templateUrl: './holdings.component.html',
  styleUrl: './holdings.component.scss',
})
export class HoldingsComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  holdings = signal<Holding[]>([]);
  isLoading = signal(true);
  displayedColumns = ['ticker_code', 'company_name', 'purchase_date', 'purchase_price', 'quantity', 'total', 'note', 'actions'];

  ngOnInit() {
    this.loadHoldings();
  }

  loadHoldings() {
    this.isLoading.set(true);
    this.api.getHoldings().subscribe({
      next: (data) => {
        this.holdings.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.snackBar.open('データの取得に失敗しました', '閉じる', { duration: 4000 });
        this.isLoading.set(false);
      },
    });
  }

  openDetailDialog(holding: Holding) {
    const ref = this.dialog.open(HoldingDetailDialogComponent, {
      data: holding,
      width: '360px',
    });
    ref.afterClosed().subscribe((result) => {
      if (result === 'edit') this.openDialog(holding);
    });
  }

  openDialog(holding?: Holding) {
    const ref = this.dialog.open(HoldingDialogComponent, {
      data: holding ?? null,
      width: '420px',
      disableClose: true,
    });

    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      if (holding) {
        this.api.updateHolding(holding.id, result as HoldingUpdate).subscribe({
          next: () => {
            this.snackBar.open('更新しました', '', { duration: 2000 });
            this.loadHoldings();
          },
          error: (err: HttpErrorResponse) => {
            const msg = err.error?.detail ?? '更新に失敗しました';
            this.snackBar.open(msg, '閉じる', { duration: 5000 });
          },
        });
      } else {
        this.api.createHolding(result as HoldingCreate).subscribe({
          next: () => {
            this.snackBar.open('追加しました', '', { duration: 2000 });
            this.loadHoldings();
          },
          error: (err: HttpErrorResponse) => {
            const msg = err.error?.detail ?? '追加に失敗しました';
            this.snackBar.open(msg, '閉じる', { duration: 5000 });
          },
        });
      }
    });
  }

  deleteHolding(id: number) {
    if (!confirm('この取引を削除しますか？')) return;
    this.api.deleteHolding(id).subscribe({
      next: () => {
        this.snackBar.open('削除しました', '', { duration: 2000 });
        this.loadHoldings();
      },
      error: (err: HttpErrorResponse) => {
        const msg = err.error?.detail ?? '削除に失敗しました';
        this.snackBar.open(msg, '閉じる', { duration: 5000 });
      },
    });
  }

  totalValue(h: Holding): number {
    return h.purchase_price * h.quantity;
  }
}
