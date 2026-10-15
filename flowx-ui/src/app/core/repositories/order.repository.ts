import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { MarginEstimate, PaperOrder } from '../models/trading.model';

export interface OrderPayload {
  accountId: string;
  strategyKey: string;
  symbol: string;
  side: string;
  quantity: number;
  mode: string;
  entryPrice: number;
  lotSize: number;
  availableCapital: number;
  marginMultiplier: number;
  maxLossMultiplier: number;
}

@Injectable({ providedIn: 'root' })
export class OrderRepository {
  private readonly http = inject(HttpClient);

  estimate(payload: OrderPayload): Observable<MarginEstimate> {
    return this.http.post<{ data: MarginEstimate }>('/api/orders/estimate', payload).pipe(
      map((response) => response.data)
    );
  }

  create(payload: OrderPayload): Observable<PaperOrder> {
    return this.http.post<{ data: PaperOrder }>('/api/orders', payload).pipe(
      map((response) => response.data)
    );
  }

  list(): Observable<PaperOrder[]> {
    return this.http.get<{ data: PaperOrder[] }>('/api/orders').pipe(
      map((response) => response.data)
    );
  }
}
