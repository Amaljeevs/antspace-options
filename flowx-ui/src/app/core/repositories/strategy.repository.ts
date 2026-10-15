import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Strategy } from '../models/strategy.model';

@Injectable({ providedIn: 'root' })
export class StrategyRepository {
  private readonly http = inject(HttpClient);

  getCatalog(): Observable<Strategy[]> {
    return this.http.get<{ data: Strategy[] }>('/api/strategy/catalog').pipe(
      map((response) => response.data)
    );
  }
}
