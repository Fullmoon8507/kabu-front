import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BacktestService, BacktestResult } from './backtest.service';

@Component({
  selector: 'app-backtest',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './backtest.component.html',
  styleUrl: './backtest.component.scss',
})
export class BacktestComponent {
  private readonly backtestService = inject(BacktestService);

  ticker = '';
  startDate = '';
  endDate = '';
  shortMa = 25;
  longMa = 75;

  isLoading = signal(false);
  result = signal<BacktestResult | null>(null);
  errorMessage = signal('');

  canRun(): boolean {
    return (
      this.ticker.trim() !== '' &&
      this.startDate !== '' &&
      this.endDate !== ''
    );
  }

  run() {
    this.isLoading.set(true);
    this.result.set(null);
    this.errorMessage.set('');

    this.backtestService
      .run({
        ticker: this.ticker.trim(),
        start_date: this.startDate,
        end_date: this.endDate,
        short_ma: this.shortMa,
        long_ma: this.longMa,
      })
      .subscribe({
        next: (data) => {
          this.result.set(data);
          this.isLoading.set(false);
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage.set(err.error?.detail ?? 'バックテストの実行に失敗しました');
          this.isLoading.set(false);
        },
      });
  }
}
