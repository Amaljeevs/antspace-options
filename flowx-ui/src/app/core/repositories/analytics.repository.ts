import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { AnalyticsSummary } from '../models/analytics.model';

@Injectable({ providedIn: 'root' })
export class AnalyticsRepository {
  private readonly http = inject(HttpClient);

  getSummary(): Observable<AnalyticsSummary> {
    return this.http.get<{ data: AnalyticsSummary }>('/api/analytics/summary').pipe(
      map((response) => response.data)
    );
  }
}
