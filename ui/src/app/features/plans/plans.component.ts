import { DecimalPipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-semibold">Paper Trading Desk</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Create virtual accounts, estimate margin, and place simulated paper trades.</p>
      </div>

      <div class="grid xl:grid-cols-2 gap-4">
        <section class="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 p-5 shadow-sm">
          <h2 class="text-lg font-semibold mb-4">Create Virtual Account</h2>
          <div class="space-y-3">
            <label class="block text-xs text-slate-500">Owner Name
              <input [(ngModel)]="accountForm.ownerName" class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900" />
            </label>
            <label class="block text-xs text-slate-500">Initial Capital
              <input [(ngModel)]="accountForm.initialCapital" type="number" class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900" />
            </label>
            <button type="button" class="rounded-full bg-[#0A1A5F] px-5 py-2.5 text-sm font-semibold text-white" (click)="createAccount()">Create Account</button>
          </div>
        </section>

        <section class="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 p-5 shadow-sm">
          <h2 class="text-lg font-semibold mb-4">Current Accounts</h2>
          <div class="space-y-3 max-h-[320px] overflow-auto">
            @for (account of accounts(); track account.id) {
              <button type="button" class="w-full rounded-xl border px-4 py-3 text-left" [class.border-blue-500]="selectedAccountId() === account.id" [class.border-slate-200]="selectedAccountId() !== account.id" (click)="selectAccount(account)">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-semibold">{{ account.ownerName }}</p>
                    <p class="text-sm text-slate-500 dark:text-slate-400">{{ account.id }}</p>
                  </div>
                  <div class="text-right text-sm">
                    <p>Free Margin: Rs {{ account.freeMargin | number:'1.0-0' }}</p>
                    <p class="text-slate-500 dark:text-slate-400">Equity: Rs {{ account.equity | number:'1.0-0' }}</p>
                  </div>
                </div>
              </button>
            }
          </div>
        </section>
      </div>

      <section class="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 p-5 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Estimate and Place Paper Trade</h2>
        <div class="grid xl:grid-cols-4 md:grid-cols-2 gap-3">
          <label class="block text-xs text-slate-500">Strategy
            <select [(ngModel)]="tradeForm.strategyKey" class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900">
              @for (strategy of strategies(); track strategy.key) {
                <option [value]="strategy.key">{{ strategy.label }}</option>
              }
            </select>
          </label>
          <label class="block text-xs text-slate-500">Symbol
            <input [(ngModel)]="tradeForm.symbol" class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900" />
          </label>
          <label class="block text-xs text-slate-500">Side
            <select [(ngModel)]="tradeForm.side" class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900">
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
            </select>
          </label>
          <label class="block text-xs text-slate-500">Mode
            <select [(ngModel)]="tradeForm.mode" class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900">
              <option value="PAPER">PAPER</option>
            </select>
          </label>
          <label class="block text-xs text-slate-500">Quantity
            <input [(ngModel)]="tradeForm.quantity" type="number" class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900" />
          </label>
          <label class="block text-xs text-slate-500">Entry Price
            <input [(ngModel)]="tradeForm.entryPrice" type="number" class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900" />
          </label>
          <label class="block text-xs text-slate-500">Lot Size
            <input [(ngModel)]="tradeForm.lotSize" type="number" class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900" />
          </label>
          <label class="block text-xs text-slate-500">Margin Multiplier
            <input [(ngModel)]="tradeForm.marginMultiplier" type="number" step="0.01" class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900" />
          </label>
          <label class="block text-xs text-slate-500">Max Loss Multiplier
            <input [(ngModel)]="tradeForm.maxLossMultiplier" type="number" step="0.01" class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900" />
          </label>
        </div>

        <div class="mt-4 flex flex-wrap gap-3">
          <button type="button" class="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white" (click)="estimateTrade()">Estimate</button>
          <button type="button" class="rounded-full bg-[#0A1A5F] px-5 py-2.5 text-sm font-semibold text-white" (click)="placeTrade()">Place Paper Trade</button>
        </div>

        @if (estimate()) {
          <div class="mt-5 grid md:grid-cols-3 gap-3">
            <div class="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <p class="text-xs text-slate-500 dark:text-slate-400">Estimated Margin</p>
              <p class="text-xl font-semibold mt-1">Rs {{ estimate()!.estimatedMargin | number:'1.0-2' }}</p>
            </div>
            <div class="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <p class="text-xs text-slate-500 dark:text-slate-400">Maximum Loss</p>
              <p class="text-xl font-semibold mt-1">Rs {{ estimate()!.maximumLoss | number:'1.0-2' }}</p>
            </div>
            <div class="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <p class="text-xs text-slate-500 dark:text-slate-400">Risk Recommendation</p>
              <p class="text-xl font-semibold mt-1">{{ riskAllocation()?.recommendation ?? estimate()!.recommendation }}</p>
            </div>
          </div>
        }
      </section>

      <section class="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 p-5 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Paper Orders</h2>
        <div class="space-y-3">
          @for (order of orders(); track order.id) {
            <div class="rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between gap-3">
              <div>
                <p class="font-semibold">{{ order.strategyKey }} · {{ order.symbol }}</p>
                <p class="text-sm text-slate-500 dark:text-slate-400">{{ order.side }} · Qty {{ order.quantity }} · {{ order.mode }}</p>
              </div>
              <div class="text-right text-sm">
                <p>Margin Rs {{ order.estimatedMargin | number:'1.0-2' }}</p>
                <p class="text-slate-500 dark:text-slate-400">Risk {{ order.riskPctOfCapital }}%</p>
              </div>
            </div>
          }
        </div>
      </section>
    </div>
  `,
})
export class PlansComponent {
  private readonly http = inject(HttpClient);

  readonly accounts = signal<any[]>([]);
  readonly selectedAccountId = signal('');
  readonly strategies = signal<any[]>([]);
  readonly orders = signal<any[]>([]);
  readonly estimate = signal<any | null>(null);
  readonly riskAllocation = signal<any | null>(null);

  readonly accountForm = {
    ownerName: 'Primary Trader',
    initialCapital: 500000,
  };

  readonly tradeForm = {
    strategyKey: 'weekly-iron-condor',
    symbol: 'NIFTY28AUG24600CE',
    side: 'SELL',
    quantity: 1,
    mode: 'PAPER',
    entryPrice: 142.2,
    lotSize: 50,
    marginMultiplier: 0.22,
    maxLossMultiplier: 1.35,
  };

  constructor() {
    this.refreshAll();
  }

  refreshAll(): void {
    this.http.get<{ data: any[] }>('/api/portfolio/accounts').subscribe((response) => {
      this.accounts.set(response.data);
      if (!this.selectedAccountId() && response.data.length > 0) {
        this.selectedAccountId.set(response.data[0].id);
      }
    });
    this.http.get<{ data: any[] }>('/api/strategy/catalog').subscribe((response) => this.strategies.set(response.data));
    this.http.get<{ data: any[] }>('/api/orders').subscribe((response) => this.orders.set(response.data));
  }

  selectAccount(account: any): void {
    this.selectedAccountId.set(account.id);
  }

  createAccount(): void {
    this.http.post<{ data: any }>('/api/portfolio/accounts', this.accountForm).subscribe(() => this.refreshAll());
  }

  estimateTrade(): void {
    const account = this.selectedAccount();
    if (!account) {
      return;
    }
    const payload = {
      accountId: account.id,
      strategyKey: this.tradeForm.strategyKey,
      symbol: this.tradeForm.symbol,
      side: this.tradeForm.side,
      quantity: this.tradeForm.quantity,
      mode: this.tradeForm.mode,
      entryPrice: this.tradeForm.entryPrice,
      lotSize: this.tradeForm.lotSize,
      availableCapital: account.freeMargin,
      marginMultiplier: this.tradeForm.marginMultiplier,
      maxLossMultiplier: this.tradeForm.maxLossMultiplier,
    };
    this.http.post<{ data: any }>('/api/orders/estimate', payload).subscribe((response) => {
      this.estimate.set(response.data);
      const params = new HttpParams()
        .set('estimatedMargin', String(response.data.estimatedMargin))
        .set('maximumLoss', String(response.data.maximumLoss));
      this.http.get<{ data: any }>(`/api/portfolio/accounts/${account.id}/risk-allocation`, { params }).subscribe((riskResponse) => {
        this.riskAllocation.set(riskResponse.data);
      });
    });
  }

  placeTrade(): void {
    const account = this.selectedAccount();
    if (!account) {
      return;
    }
    const payload = {
      accountId: account.id,
      strategyKey: this.tradeForm.strategyKey,
      symbol: this.tradeForm.symbol,
      side: this.tradeForm.side,
      quantity: this.tradeForm.quantity,
      mode: this.tradeForm.mode,
      entryPrice: this.tradeForm.entryPrice,
      lotSize: this.tradeForm.lotSize,
      availableCapital: account.freeMargin,
      marginMultiplier: this.tradeForm.marginMultiplier,
      maxLossMultiplier: this.tradeForm.maxLossMultiplier,
    };
    this.http.post('/api/orders', payload).subscribe(() => this.refreshAll());
  }

  private selectedAccount(): any | undefined {
    return this.accounts().find((account) => account.id === this.selectedAccountId());
  }
}

