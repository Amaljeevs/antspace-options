import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { AnalyticsRepository } from '../../core/repositories/analytics.repository';
import { AnalyticsSummary } from '../../core/models/analytics.model';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-semibold">Analytics</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Live performance snapshot from the analytics service.</p>
      </div>

      @if (summary) {
        <div class="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div class="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/70">
            <p class="text-sm text-slate-500">Total P&L</p>
            <p class="text-3xl font-semibold text-emerald-500 mt-2">Rs {{ summary.total_pnl | number:'1.0-0' }}</p>
          </div>
          <div class="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/70">
            <p class="text-sm text-slate-500">Sharpe</p>
            <p class="text-3xl font-semibold mt-2">{{ summary.sharpe | number:'1.2-2' }}</p>
          </div>
          <div class="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/70">
            <p class="text-sm text-slate-500">Win Rate</p>
            <p class="text-3xl font-semibold mt-2">{{ summary.win_rate * 100 | number:'1.0-1' }}%</p>
          </div>
          <div class="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/70">
            <p class="text-sm text-slate-500">Max Drawdown</p>
            <p class="text-3xl font-semibold mt-2">{{ summary.max_drawdown * 100 | number:'1.0-1' }}%</p>
          </div>
        </div>

        <div class="grid md:grid-cols-3 gap-4">
          <div class="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/70">
            <p class="text-sm text-slate-500">Used Margin</p>
            <p class="text-2xl font-semibold mt-2">Rs {{ summary.used_margin | number:'1.0-0' }}</p>
          </div>
          <div class="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/70">
            <p class="text-sm text-slate-500">Free Cash</p>
            <p class="text-2xl font-semibold mt-2">Rs {{ summary.free_cash | number:'1.0-0' }}</p>
          </div>
          <div class="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/70">
            <p class="text-sm text-slate-500">Capital Utilization</p>
            <p class="text-2xl font-semibold mt-2">{{ summary.capital_utilization | number:'1.0-1' }}%</p>
          </div>
        </div>
      }
    </div>
  `,
})
export class AnalyticsComponent {
  private readonly repo = inject(AnalyticsRepository);
  summary: AnalyticsSummary | null = null;

  constructor() {
    this.repo.getSummary().subscribe((data) => (this.summary = data));
  }
}
