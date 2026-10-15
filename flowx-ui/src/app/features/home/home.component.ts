import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { AnalyticsRepository } from '../../core/repositories/analytics.repository';
import { BrokerRepository } from '../../core/repositories/broker.repository';
import { PortfolioRepository } from '../../core/repositories/portfolio.repository';
import { StrategyRepository } from '../../core/repositories/strategy.repository';
import { AuthService } from '../../core/services/auth.service';
import { AnalyticsSummary } from '../../core/models/analytics.model';
import { PortfolioSummary, VirtualAccount } from '../../core/models/trading.model';
import { Strategy } from '../../core/models/strategy.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-semibold">Welcome {{ auth.getCurrentUser()?.name ?? 'Trader' }}</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Monitor broker-fed paper trading activity from one workspace.</p>
      </div>

      <div class="grid lg:grid-cols-4 md:grid-cols-2 gap-4">
        <div class="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/70">
          <p class="text-sm text-slate-500">Total P&L</p>
          <p class="text-3xl font-bold text-emerald-500 mt-2">Rs {{ analytics?.total_pnl ?? 0 | number:'1.0-0' }}</p>
        </div>
        <div class="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/70">
          <p class="text-sm text-slate-500">Free Cash</p>
          <p class="text-3xl font-bold mt-2">Rs {{ analytics?.free_cash ?? 0 | number:'1.0-0' }}</p>
        </div>
        <div class="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/70">
          <p class="text-sm text-slate-500">Open Positions</p>
          <p class="text-3xl font-bold mt-2">{{ portfolioSummary?.openPositions ?? 0 }}</p>
        </div>
        <div class="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/70">
          <p class="text-sm text-slate-500">Connected Brokers</p>
          <p class="text-3xl font-bold mt-2">{{ brokerCount }}</p>
        </div>
      </div>

      <div class="grid xl:grid-cols-[1.2fr_0.8fr] gap-5">
        <section class="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/70">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-xl font-semibold">Strategy Catalog</h2>
              <p class="text-sm text-slate-500">Live strategy definitions available for paper trades</p>
            </div>
            <span class="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700">{{ strategies.length }} strategies</span>
          </div>
          <div class="space-y-3">
            @for (strategy of strategies; track strategy.key) {
              <div class="rounded-xl border border-slate-200/70 p-4 dark:border-slate-700/70">
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <p class="font-semibold">{{ strategy.label }}</p>
                    <p class="text-sm text-slate-500">{{ strategy.description }}</p>
                  </div>
                  <span class="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase dark:bg-slate-800">{{ strategy.risk_profile }}</span>
                </div>
              </div>
            }
          </div>
        </section>

        <section class="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/70">
          <h2 class="text-xl font-semibold mb-4">Virtual Accounts</h2>
          <div class="space-y-3">
            @for (account of accounts; track account.id) {
              <div class="rounded-xl border border-slate-200/70 p-4 dark:border-slate-700/70">
                <p class="font-semibold">{{ account.ownerName }}</p>
                <p class="text-sm text-slate-500">Equity: Rs {{ account.equity | number:'1.0-0' }}</p>
                <p class="text-sm text-slate-500">Free Margin: Rs {{ account.freeMargin | number:'1.0-0' }}</p>
              </div>
            }
            @if (!accounts.length) {
              <div class="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-700">Create your first virtual account from the Portfolio screen.</div>
            }
          </div>
        </section>
      </div>
    </div>
  `,
})
export class HomeComponent {
  readonly auth = inject(AuthService);
  private readonly analyticsRepo = inject(AnalyticsRepository);
  private readonly strategyRepo = inject(StrategyRepository);
  private readonly brokerRepo = inject(BrokerRepository);
  private readonly portfolioRepo = inject(PortfolioRepository);

  analytics: AnalyticsSummary | null = null;
  strategies: Strategy[] = [];
  accounts: VirtualAccount[] = [];
  portfolioSummary: PortfolioSummary | null = null;
  brokerCount = 0;

  constructor() {
    this.analyticsRepo.getSummary().subscribe((data) => (this.analytics = data));
    this.strategyRepo.getCatalog().subscribe((data) => (this.strategies = data));
    this.brokerRepo.list().subscribe((data) => (this.brokerCount = data.length));
    this.portfolioRepo.listAccounts().subscribe((data) => (this.accounts = data));
    this.portfolioRepo.getSummary().subscribe((data) => (this.portfolioSummary = data));
  }
}
