import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface BacktestRequest {
  ticker: string;
  start_date: string;
  end_date: string;
  short_ma: number;
  long_ma: number;
}

export interface BacktestResult {
  total_return_pct: number;
  trade_count: number;
}

@Injectable({ providedIn: 'root' })
export class BacktestService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  run(req: BacktestRequest): Observable<BacktestResult> {
    return this.http.post<BacktestResult>(`${this.baseUrl}/api/backtest/run`, req);
  }
}
