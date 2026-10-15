import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { CandlePoint, MarketInstrument, OptionChain } from '../models/trading.model';

@Injectable({ providedIn: 'root' })
export class MarketRepository {
  private readonly http = inject(HttpClient);

  listInstruments(): Observable<MarketInstrument[]> {
    return this.http.get<{ data: MarketInstrument[] }>('/api/market/instruments').pipe(
      map((response) => response.data)
    );
  }

  getCandles(symbol: string): Observable<CandlePoint[]> {
    return this.http.get<{ data: CandlePoint[] }>(`/api/market/candles/${symbol}`).pipe(
      map((response) => response.data)
    );
  }

  getOptionChain(underlying: string): Observable<OptionChain> {
    return this.http.get<{ data: OptionChain }>(`/api/market/option-chain/${underlying}`).pipe(
      map((response) => response.data)
    );
  }
}
