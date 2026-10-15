import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PortfolioRepository } from '../../core/repositories/portfolio.repository';
import { PortfolioSummary, PositionSnapshot, RiskAllocation, VirtualAccount } from '../../core/models/trading.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl space-y-6">
      <div class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 class="text-3xl font-semibold">Portfolio & virtual accounts</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">Create paper trading accounts, track margin, and evaluate risk against available capital.</p>
        </div>
        <div class="rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 text-sm shadow-sm dark:border-slate-700/80 dark:bg-slate-900/70">
          Signed in as <span class="font-semibold">{{ currentUserName }}</span>
        </div>
      </div>

      @if (error) {
        <div class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">{{ error }}</div>
      }

      <div class="grid gap-4 md:grid-cols-3">
        <div class="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/70">
          <p class="text-sm text-slate-500 dark:text-slate-400">Open positions</p>
          <p class="mt-3 text-3xl font-semibold">{{ summary?.openPositions ?? 0 }}</p>
        </div>
        <div class="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/70">
          <p class="text-sm text-slate-500 dark:text-slate-400">Mark to market</p>
          <p class="mt-3 text-3xl font-semibold">{{ formatCurrency(summary?.markToMarket ?? 0) }}</p>
        </div>
        <div class="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/70">
          <p class="text-sm text-slate-500 dark:text-slate-400">Virtual accounts</p>
          <p class="mt-3 text-3xl font-semibold">{{ accounts.length }}</p>
        </div>
      </div>

      <div class="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section class="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/70">
          <h2 class="text-lg font-semibold">Virtual accounts</h2>
          <div class="mt-5 grid gap-4 md:grid-cols-2">
            @for (account of accounts; track account.id) {
              <article class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-950/30">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="text-lg font-semibold">{{ account.ownerName }}</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">{{ account.id }}</p>
                  </div>
                  <button type="button" class="rounded-lg border border-slate-300 px-3 py-1.5 text-xs hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800" (click)="selectAccount(account)">
                    {{ selectedAccount?.id === account.id ? 'Selected' : 'Use account' }}
                  </button>
                </div>
                <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div><p class="text-slate-500 dark:text-slate-400">Equity</p><p class="font-semibold">{{ formatCurrency(account.equity) }}</p></div>
                  <div><p class="text-slate-500 dark:text-slate-400">Free margin</p><p class="font-semibold">{{ formatCurrency(account.freeMargin) }}</p></div>
                  <div><p class="text-slate-500 dark:text-slate-400">Used margin</p><p class="font-semibold">{{ formatCurrency(account.usedMargin) }}</p></div>
                  <div><p class="text-slate-500 dark:text-slate-400">Available cash</p><p class="font-semibold">{{ formatCurrency(account.availableCash) }}</p></div>
                </div>
              </article>
            } @empty {
              <div class="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400 md:col-span-2">No paper trading account exists yet. Create one with your starting capital.</div>
            }
          </div>
        </section>

        <section class="space-y-6">
          <div class="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/70">
            <h2 class="text-lg font-semibold">Create virtual account</h2>
            <form class="mt-5 space-y-4" (ngSubmit)="createAccount()">
              <label class="block text-sm text-slate-500 dark:text-slate-400">Account owner name
                <input type="text" [(ngModel)]="ownerName" name="ownerName" required class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-950/40" />
              </label>
              <label class="block text-sm text-slate-500 dark:text-slate-400">Initial capital
                <input type="number" [(ngModel)]="initialCapital" name="initialCapital" min="1" required class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-950/40" />
              </label>
              <button type="submit" class="w-full rounded-xl bg-[#2563EB] px-4 py-2.5 font-medium text-white hover:bg-blue-700">Create account</button>
            </form>
          </div>

          <div class="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/70">
            <h2 class="text-lg font-semibold">Risk allocation preview</h2>
            <form class="mt-5 space-y-4" (ngSubmit)="calculateRisk()">
              <label class="block text-sm text-slate-500 dark:text-slate-400">Estimated margin
                <input type="number" [(ngModel)]="estimatedMargin" name="estimatedMargin" min="0" required class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-slate-700 dark:bg-slate-950/40" />
              </label>
              <label class="block text-sm text-slate-500 dark:text-slate-400">Maximum loss
                <input type="number" [(ngModel)]="maximumLoss" name="maximumLoss" min="0" required class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-slate-700 dark:bg-slate-950/40" />
              </label>
              <button type="submit" [disabled]="!selectedAccount" class="w-full rounded-xl bg-emerald-600 px-4 py-2.5 font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">Check allocation</button>
            </form>

            @if (risk) {
              <div class="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm dark:border-emerald-900/50 dark:bg-emerald-950/20">
                <p class="font-semibold text-emerald-700 dark:text-emerald-300">{{ risk.recommendation }}</p>
                <div class="mt-3 grid grid-cols-2 gap-3">
                  <div><p class="text-slate-500 dark:text-slate-400">Risk % of capital</p><p class="font-semibold">{{ risk.riskPctOfCapital | number:'1.2-2' }}%</p></div>
                  <div><p class="text-slate-500 dark:text-slate-400">Margin utilization</p><p class="font-semibold">{{ risk.marginUtilizationPct | number:'1.2-2' }}%</p></div>
                  <div><p class="text-slate-500 dark:text-slate-400">Free margin after trade</p><p class="font-semibold">{{ formatCurrency(risk.freeMarginAfterTrade) }}</p></div>
                  <div><p class="text-slate-500 dark:text-slate-400">Available capital</p><p class="font-semibold">{{ formatCurrency(risk.availableCapital) }}</p></div>
                </div>
              </div>
            }
          </div>
        </section>
      </div>

      <section class="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/70">
        <h2 class="text-lg font-semibold">Open positions snapshot</h2>
        <div class="mt-5 overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="border-b border-slate-200 text-left text-slate-500 dark:border-slate-700 dark:text-slate-400">
                <th class="pb-3 pr-4 font-medium">Symbol</th>
                <th class="pb-3 pr-4 font-medium">Net Qty</th>
                <th class="pb-3 pr-4 font-medium">MTM</th>
                <th class="pb-3 font-medium">Recorded At</th>
              </tr>
            </thead>
            <tbody>
              @for (position of positions; track position.id) {
                <tr class="border-b border-slate-100 dark:border-slate-800">
                  <td class="py-3 pr-4 font-medium">{{ position.symbol }}</td>
                  <td class="py-3 pr-4">{{ position.netQuantity }}</td>
                  <td class="py-3 pr-4">{{ formatCurrency(position.mtm) }}</td>
                  <td class="py-3">{{ position.recordedAt | date:'medium' }}</td>
                </tr>
              } @empty {
                <tr><td colspan="4" class="py-6 text-center text-slate-500 dark:text-slate-400">No positions recorded yet.</td></tr>
              }
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `,
})
export class PortfolioComponent implements OnInit {
  private readonly portfolioRepository = inject(PortfolioRepository);
  private readonly auth = inject(AuthService);

  summary: PortfolioSummary | null = null;
  positions: PositionSnapshot[] = [];
  accounts: VirtualAccount[] = [];
  selectedAccount: VirtualAccount | null = null;
  risk: RiskAllocation | null = null;
  error = '';
  ownerName = '';
  initialCapital = 100000;
  estimatedMargin = 15000;
  maximumLoss = 4000;

  get currentUserName(): string {
    return this.auth.getCurrentUser()?.name ?? 'Trader';
  }

  ngOnInit(): void {
    this.ownerName = this.currentUserName;
    this.loadData();
  }

  loadData(): void {
    this.error = '';
    this.portfolioRepository.getSummary().subscribe({ next: (summary) => (this.summary = summary), error: () => (this.error = 'Unable to load portfolio summary.') });
    this.portfolioRepository.getPositions().subscribe({ next: (positions) => (this.positions = positions), error: () => (this.error = 'Unable to load position snapshots.') });
    this.portfolioRepository.listAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.selectedAccount = accounts[0] ?? null;
      },
      error: () => (this.error = 'Unable to load virtual accounts.'),
    });
  }

  selectAccount(account: VirtualAccount): void {
    this.selectedAccount = account;
    this.risk = null;
  }

  createAccount(): void {
    this.error = '';
    this.portfolioRepository.createAccount(this.ownerName, this.initialCapital).subscribe({
      next: (account) => {
        this.accounts = [account, ...this.accounts];
        this.selectedAccount = account;
        this.risk = null;
      },
      error: (error) => {
        this.error = error?.error?.data?.message ?? 'Unable to create virtual account.';
      },
    });
  }

  calculateRisk(): void {
    if (!this.selectedAccount) {
      this.error = 'Select an account before checking allocation.';
      return;
    }
    this.error = '';
    this.portfolioRepository.getRiskAllocation(this.selectedAccount.id, this.estimatedMargin, this.maximumLoss).subscribe({
      next: (risk) => (this.risk = risk),
      error: (error) => {
        this.error = error?.error?.data?.message ?? 'Unable to calculate trade risk allocation.';
      },
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value ?? 0);
  }
}
