import { DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DecimalPipe, RouterLink],
  template: `
    <div class="space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="text-3xl font-semibold">Welcome {{ user?.name ?? 'Trader' }}</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">Your backend-connected paper trading workspace is active.</p>
        </div>
        <a routerLink="/app/plans" class="rounded-full bg-[#0A1A5F] px-5 py-2.5 text-sm font-semibold text-white">Open Paper Trading</a>
      </div>

      <div class="grid lg:grid-cols-4 md:grid-cols-2 gap-4">
        <div class="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white to-slate-50 shadow-sm dark:border-slate-700/70 dark:from-slate-900 dark:to-slate-900/70 p-5">
          <p class="text-sm text-slate-500 dark:text-slate-400">Total P&L</p>
          <p class="text-3xl font-bold text-emerald-500 mt-2">Rs {{ analytics()?.total_pnl ?? 0 | number:'1.0-0' }}</p>
          <p class="text-sm text-slate-400 mt-1">Capital utilization {{ analytics()?.capital_utilization ?? 0 }}%</p>
        </div>
        <div class="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white to-slate-50 shadow-sm dark:border-slate-700/70 dark:from-slate-900 dark:to-slate-900/70 p-5">
          <p class="text-sm text-slate-500 dark:text-slate-400">Free Cash</p>
          <p class="text-3xl font-bold mt-2">Rs {{ analytics()?.free_cash ?? 0 | number:'1.0-0' }}</p>
          <p class="text-sm text-slate-400 mt-1">Used margin Rs {{ analytics()?.used_margin ?? 0 | number:'1.0-0' }}</p>
        </div>
        <div class="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white to-slate-50 shadow-sm dark:border-slate-700/70 dark:from-slate-900 dark:to-slate-900/70 p-5">
          <p class="text-sm text-slate-500 dark:text-slate-400">Strategy Catalog</p>
          <p class="text-3xl font-bold mt-2">{{ strategies().length }}</p>
          <p class="text-sm text-slate-400 mt-1">Broker-agnostic options playbooks</p>
        </div>
        <div class="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white to-slate-50 shadow-sm dark:border-slate-700/70 dark:from-slate-900 dark:to-slate-900/70 p-5">
          <p class="text-sm text-slate-500 dark:text-slate-400">Broker Adapters</p>
          <p class="text-3xl font-bold mt-2">{{ brokers().length }}</p>
          <p class="text-sm text-slate-400 mt-1">Zerodha and Dhan ready in catalog</p>
        </div>
      </div>

      <div class="grid xl:grid-cols-[1.15fr_0.85fr] gap-4">
        <section class="rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/70 p-5">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">Built-in Strategy Catalog</h2>
            <a routerLink="/app/strategies" class="text-sm text-blue-600">View all</a>
          </div>
          <div class="space-y-3">
            @for (strategy of strategies().slice(0, 4); track strategy.key) {
              <div class="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <p class="font-semibold">{{ strategy.label }}</p>
                    <p class="text-sm text-slate-500 dark:text-slate-400">{{ strategy.description }}</p>
                  </div>
                  <span class="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs">{{ strategy.risk_profile }}</span>
                </div>
              </div>
            }
          </div>
        </section>

        <section class="rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/70 p-5">
          <h2 class="text-lg font-semibold mb-4">Paper Trading Snapshot</h2>
          <div class="space-y-3">
            <div class="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <p class="text-xs text-slate-500 dark:text-slate-400">Virtual Accounts</p>
              <p class="text-2xl font-semibold mt-1">{{ accounts().length }}</p>
            </div>
            <div class="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <p class="text-xs text-slate-500 dark:text-slate-400">Paper Orders</p>
              <p class="text-2xl font-semibold mt-1">{{ orders().length }}</p>
            </div>
            <div class="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <p class="text-xs text-slate-500 dark:text-slate-400">System Health</p>
              <p class="text-sm mt-2 text-emerald-500">Gateway, auth, broker, portfolio, and order APIs are connected.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class HomeComponent {
  private readonly http = inject(HttpClient);
  readonly user = inject(AuthService).getCurrentUser();

  readonly analytics = signal<any | null>(null);
  readonly strategies = signal<any[]>([]);
  readonly brokers = signal<any[]>([]);
  readonly accounts = signal<any[]>([]);
  readonly orders = signal<any[]>([]);

  constructor() {
    this.http.get<{ data: any }>('/api/analytics/summary').subscribe((response) => this.analytics.set(response.data));
    this.http.get<{ data: any[] }>('/api/strategy/catalog').subscribe((response) => this.strategies.set(response.data));
    this.http.get<{ data: any[] }>('/api/brokers').subscribe((response) => this.brokers.set(response.data));
    this.http.get<{ data: any[] }>('/api/portfolio/accounts').subscribe((response) => this.accounts.set(response.data));
    this.http.get<{ data: any[] }>('/api/orders').subscribe((response) => this.orders.set(response.data));
  }
}

