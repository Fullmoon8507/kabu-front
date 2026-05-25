import { Component, inject, signal, effect, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Chart, registerables } from 'chart.js';
import { BacktestService, BacktestResult } from './backtest.service';

Chart.register(...registerables);

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
export class BacktestComponent implements OnDestroy {
  @ViewChild('chartCanvas') chartCanvas?: ElementRef<HTMLCanvasElement>;

  private readonly backtestService = inject(BacktestService);
  private chartInstance: Chart | null = null;

  ticker = '';
  startDate = '';
  endDate = '';
  shortMa = 25;
  longMa = 75;

  isLoading = signal(false);
  result = signal<BacktestResult | null>(null);
  errorMessage = signal('');

  constructor() {
    effect(() => {
      const r = this.result();
      if (r) {
        setTimeout(() => this.renderChart(r), 0);
      }
    });
  }

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

  private renderChart(result: BacktestResult): void {
    if (!this.chartCanvas) return;
    this.chartInstance?.destroy();
    this.chartInstance = null;

    const { dates, prices, short_ma, long_ma, trades } = result.chart;

    const buyData: (number | null)[] = dates.map(d => {
      const t = trades.find(tr => tr.date === d && tr.type === 'buy');
      return t ? t.price : null;
    });
    const sellData: (number | null)[] = dates.map(d => {
      const t = trades.find(tr => tr.date === d && tr.type === 'sell');
      return t ? t.price : null;
    });

    this.chartInstance = new Chart(this.chartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: '終値',
            data: prices,
            borderColor: '#9e9e9e',
            borderWidth: 1,
            pointRadius: 0,
            tension: 0,
            order: 3,
          },
          {
            label: `短期MA(${this.shortMa})`,
            data: short_ma,
            borderColor: '#ff9800',
            borderWidth: 1.5,
            pointRadius: 0,
            tension: 0,
            spanGaps: false,
            order: 2,
          },
          {
            label: `長期MA(${this.longMa})`,
            data: long_ma,
            borderColor: '#2196f3',
            borderWidth: 1.5,
            pointRadius: 0,
            tension: 0,
            spanGaps: false,
            order: 1,
          },
          {
            label: '買い ▲',
            data: buyData,
            borderColor: 'transparent',
            backgroundColor: '#4caf50',
            pointStyle: 'triangle',
            pointRadius: buyData.map(v => (v !== null ? 10 : 0)),
            pointHoverRadius: buyData.map(v => (v !== null ? 12 : 0)),
            showLine: false,
            order: 0,
          },
          {
            label: '売り ▼',
            data: sellData,
            borderColor: 'transparent',
            backgroundColor: '#f44336',
            pointStyle: 'triangle',
            pointRotation: 180,
            pointRadius: sellData.map(v => (v !== null ? 10 : 0)),
            pointHoverRadius: sellData.map(v => (v !== null ? 12 : 0)),
            showLine: false,
            order: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'top',
            labels: { boxWidth: 12, font: { size: 11 } },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                if (ctx.parsed.y === null) return '';
                return `${ctx.dataset.label}: ¥${ctx.parsed.y.toLocaleString()}`;
              },
            },
          },
        },
        scales: {
          x: {
            ticks: {
              maxTicksLimit: 8,
              maxRotation: 30,
              callback: (_val, index) => {
                const label = dates[index];
                if (!label) return '';
                const d = new Date(label);
                return `${d.getMonth() + 1}/${d.getDate()}`;
              },
            },
          },
          y: {
            ticks: {
              callback: (v) => `¥${Number(v).toLocaleString()}`,
            },
          },
        },
      },
    });
  }

  ngOnDestroy(): void {
    this.chartInstance?.destroy();
  }
}
