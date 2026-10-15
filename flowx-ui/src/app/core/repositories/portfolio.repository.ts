import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { PortfolioSummary, PositionSnapshot, RiskAllocation, VirtualAccount } from '../models/trading.model';

@Injectable({ providedIn: 'root' })
export class PortfolioRepository {
  private readonly http = inject(HttpClient);

  getSummary(): Observable<PortfolioSummary> {
    return this.http.get<{ data: PortfolioSummary }>('/api/portfolio/summary').pipe(
      map((response) => response.data)
    );
  }

  getPositions(): Observable<PositionSnapshot[]> {
    return this.http.get<{ data: PositionSnapshot[] }>('/api/portfolio/positions').pipe(
      map((response) => response.data)
    );
  }

  listAccounts(): Observable<VirtualAccount[]> {
    return this.http.get<{ data: VirtualAccount[] }>('/api/portfolio/accounts').pipe(
      map((response) => response.data)
    );
  }

  createAccount(ownerName: string, initialCapital: number): Observable<VirtualAccount> {
    return this.http.post<{ data: VirtualAccount }>('/api/portfolio/accounts', { ownerName, initialCapital }).pipe(
      map((response) => response.data)
    );
  }

  getRiskAllocation(accountId: string, estimatedMargin: number, maximumLoss: number): Observable<RiskAllocation> {
    const params = new HttpParams()
      .set('estimatedMargin', estimatedMargin)
      .set('maximumLoss', maximumLoss);
    return this.http.get<{ data: RiskAllocation }>(`/api/portfolio/accounts/${accountId}/risk-allocation`, { params }).pipe(
      map((response) => response.data)
    );
  }
}
