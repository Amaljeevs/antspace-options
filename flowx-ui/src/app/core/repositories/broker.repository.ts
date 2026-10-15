import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { BrokerSummary } from '../models/trading.model';

@Injectable({ providedIn: 'root' })
export class BrokerRepository {
  private readonly http = inject(HttpClient);

  list(): Observable<BrokerSummary[]> {
    return this.http.get<{ data: BrokerSummary[] }>('/api/brokers').pipe(
      map((response) => response.data)
    );
  }
}
