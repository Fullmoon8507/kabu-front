import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ApiHealthResponse {
  status: string;
  message: string;
}

export interface Stock {
  ticker_code: string;
  company_name: string;
  sector: string | null;
  is_active: boolean;
}

export interface StockCreate {
  ticker_code: string;
  company_name: string;
  sector?: string;
}

export interface Holding {
  id: number;
  ticker_code: string;
  company_name: string;
  purchase_date: string;
  purchase_price: number;
  quantity: number;
  note: string | null;
}

export interface HoldingCreate {
  ticker_code: string;
  purchase_date: string;
  purchase_price: number;
  quantity: number;
  note?: string;
}

export interface HoldingUpdate {
  ticker_code?: string;
  purchase_date?: string;
  purchase_price?: number;
  quantity?: number;
  note?: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getHealth(): Observable<ApiHealthResponse> {
    return this.http.get<ApiHealthResponse>(`${this.baseUrl}/`);
  }

  getStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.baseUrl}/stocks`);
  }

  createStock(body: StockCreate): Observable<Stock> {
    return this.http.post<Stock>(`${this.baseUrl}/stocks`, body);
  }

  getHoldings(): Observable<Holding[]> {
    return this.http.get<Holding[]>(`${this.baseUrl}/holdings`);
  }

  createHolding(body: HoldingCreate): Observable<Holding> {
    return this.http.post<Holding>(`${this.baseUrl}/holdings`, body);
  }

  updateHolding(id: number, body: HoldingUpdate): Observable<Holding> {
    return this.http.put<Holding>(`${this.baseUrl}/holdings/${id}`, body);
  }

  deleteHolding(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/holdings/${id}`);
  }
}
