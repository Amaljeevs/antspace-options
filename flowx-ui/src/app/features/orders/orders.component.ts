import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { OrderPayload, OrderRepository } from '../../core/repositories/order.repository';
import { PortfolioRepository } from '../../core/repositories/portfolio.repository';
import { StrategyRepository } from '../../core/repositories/strategy.repository';
import { MarginEstimate, PaperOrder, VirtualAccount } from '../../core/models/trading.model';
import { Strategy } from '../../core/models/strategy.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl space-y-6">
      <div>
        <h1 class="text-3xl font-semibold">Paper order desk</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Estimate margin, validate maximum loss, and place simulated option trades into the paper book.</p>
      </div>

      @if (error) {
        <div class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">{{ error }}</div>
      }
      @if (successMessage) {
        <div class="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300">{{ successMessage }}</div>
      }

      <div class="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section class="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/70">
          <h2 class="text-lg font-semibold">Create paper trade</h2>
          <form class="mt-5 grid gap-4 md:grid-cols-2" (ngSubmit)="submitOrder()">
            <label class="block text-sm text-slate-500 dark:text-slate-400 md:col-span-2">Virtual account
              <select [(ngModel)]="form.accountId" name="accountId" required class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-950/40">
                <option value="" disabled>Select account</option>
                @for (account of accounts; track account.id) {
                  <option [value]="account.id">{{ account.ownerName }} · {{ formatCurrency(account.equity) }} equity</option>
                }
              </select>
            </label>
            <label class="block text-sm text-slate-500 dark:text-slate-400">Strategy
              <select [(ngModel)]="form.strategyKey" name="strategyKey" required class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-950/40">
                <option value="" disabled>Select strategy</option>
                @for (strategy of strategies; track strategy.key) {
                  <option [value]="strategy.key">{{ strategy.label }}</option>
                }
              </select>
            </label>
            <label class="block text-sm text-slate-500 dark:text-slate-400">Symbol
              <input type="text" [(ngModel)]="form.symbol" name="symbol" required class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-950/40" />
            </label>
            <label class="block text-sm text-slate-500 dark:text-slate-400">Side
              <select [(ngModel)]="form.side" name="side" required class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-950/40"><option value="BUY">BUY</option><option value="SELL">SELL</option></select>
            </label>
            <label class="block text-sm text-slate-500 dark:text-slate-400">Mode
              <select [(ngModel)]="form.mode" name="mode" required class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-950/40"><option value="PAPER">PAPER</option></select>
            </label>
            <label class="block text-sm text-slate-500 dark:text-slate-400">Quantity
              <input type="number" [(ngModel)]="form.quantity" name="quantity" min="1" required class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-950/40" />
            </label>
            <label class="block text-sm text-slate-500 dark:text-slate-400">Lot size
              <input type="number" [(ngModel)]="form.lotSize" name="lotSize" min="1" required class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-950/40" />
            </label>
            <label class="block text-sm text-slate-500 dark:text-slate-400">Entry price
              <input type="number" [(ngModel)]="form.entryPrice" name="entryPrice" min="0" step="0.01" required class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-950/40" />
            </label>
            <label class="block text-sm text-slate-500 dark:text-slate-400">Margin multiplier
              <input type="number" [(ngModel)]="form.marginMultiplier" name="marginMultiplier" min="0" step="0.01" required class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-950/40" />
            </label>
            <label class="block text-sm text-slate-500 dark:text-slate-400">Max loss multiplier
              <input type="number" [(ngModel)]="form.maxLossMultiplier" name="maxLossMultiplier" min="0" step="0.01" required class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-950/40" />
            </label>
            <label class="block text-sm text-slate-500 dark:text-slate-400 md:col-span-2">Available capital
              <input type="number" [(ngModel)]="form.availableCapital" name="availableCapital" min="1" step="0.01" required class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-950/40" />
            </label>
            <div class="md:col-span-2 flex flex-wrap gap-3 pt-2">
              <button type="button" class="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800" (click)="estimateOrder()">Estimate margin</button>
              <button type="submit" class="rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700">Place paper order</button>
            </div>
          </form>
        </section>

        <section class="space-y-6">
          <div class="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/70">
            <h2 class="text-lg font-semibold">Margin estimate</h2>
            @if (estimate) {
              <div class="mt-5 grid gap-3 text-sm">
                <div class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-950/30"><p class="text-slate-500 dark:text-slate-400">Estimated margin</p><p class="mt-1 text-2xl font-semibold">{{ formatCurrency(estimate.estimatedMargin) }}</p></div>
                <div class="grid grid-cols-2 gap-3">
                  <div class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-950/30"><p class="text-slate-500 dark:text-slate-400">Maximum loss</p><p class="mt-1 font-semibold">{{ formatCurrency(estimate.maximumLoss) }}</p></div>
                  <div class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-950/30"><p class="text-slate-500 dark:text-slate-400">Capital required</p><p class="mt-1 font-semibold">{{ estimate.capitalRequiredPct | number:'1.2-2' }}%</p></div>
                </div>
                <div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20"><p class="font-semibold text-emerald-700 dark:text-emerald-300">{{ estimate.recommendation }}</p></div>
              </div>
            } @else {
              <div class="mt-5 rounded-2xl border border-dashed border-slate-300 p-5 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">Run an estimate to preview required margin and loss exposure.</div>
            }
          </div>

          <div class="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/70">
            <h2 class="text-lg font-semibold">Account snapshot</h2>
            @if (selectedAccount) {
              <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div><p class="text-slate-500 dark:text-slate-400">Owner</p><p class="font-semibold">{{ selectedAccount.ownerName }}</p></div>
                <div><p class="text-slate-500 dark:text-slate-400">Equity</p><p class="font-semibold">{{ formatCurrency(selectedAccount.equity) }}</p></div>
                <div><p class="text-slate-500 dark:text-slate-400">Free margin</p><p class="font-semibold">{{ formatCurrency(selectedAccount.freeMargin) }}</p></div>
                <div><p class="text-slate-500 dark:text-slate-400">Used margin</p><p class="font-semibold">{{ formatCurrency(selectedAccount.usedMargin) }}</p></div>
              </div>
            } @else {
              <p class="mt-4 text-sm text-slate-500 dark:text-slate-400">Create or select a virtual account to place trades.</p>
            }
          </div>
        </section>
      </div>

      <section class="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/70">
        <h2 class="text-lg font-semibold">Paper order history</h2>
        <div class="mt-5 overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead><tr class="border-b border-slate-200 text-left text-slate-500 dark:border-slate-700 dark:text-slate-400"><th class="pb-3 pr-4 font-medium">Strategy</th><th class="pb-3 pr-4 font-medium">Symbol</th><th class="pb-3 pr-4 font-medium">Qty</th><th class="pb-3 pr-4 font-medium">Margin</th><th class="pb-3 pr-4 font-medium">Max loss</th><th class="pb-3 pr-4 font-medium">Status</th><th class="pb-3 font-medium">Created</th></tr></thead>
            <tbody>
              @for (order of orders; track order.id) {
                <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-3 pr-4 font-medium">{{ order.strategyKey }}</td><td class="py-3 pr-4">{{ order.symbol }}</td><td class="py-3 pr-4">{{ order.quantity }}</td><td class="py-3 pr-4">{{ formatCurrency(order.estimatedMargin) }}</td><td class="py-3 pr-4">{{ formatCurrency(order.maximumLoss) }}</td><td class="py-3 pr-4">{{ order.status }}</td><td class="py-3">{{ order.createdAt | date:'medium' }}</td></tr>
              } @empty {
                <tr><td colspan="7" class="py-6 text-center text-slate-500 dark:text-slate-400">No paper orders placed yet.</td></tr>
              }
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `,
})
export class OrdersComponent implements OnInit {
  private readonly orderRepository = inject(OrderRepository);
  private readonly portfolioRepository = inject(PortfolioRepository);
  private readonly strategyRepository = inject(StrategyRepository);

  accounts: VirtualAccount[] = [];
  strategies: Strategy[] = [];
  orders: PaperOrder[] = [];
  estimate: MarginEstimate | null = null;
  error = '';
  successMessage = '';

  form: OrderPayload = { accountId: '', strategyKey: '', symbol: 'NIFTY26AUG22500CE', side: 'BUY', quantity: 1, mode: 'PAPER', entryPrice: 125.5, lotSize: 50, availableCapital: 100000, marginMultiplier: 0.2, maxLossMultiplier: 0.08 };

  get selectedAccount(): VirtualAccount | null {
    return this.accounts.find((account) => account.id === this.form.accountId) ?? null;
  }

  ngOnInit(): void {
    this.loadDependencies();
    this.loadOrders();
  }

  loadDependencies(): void {
    this.portfolioRepository.listAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        if (!this.form.accountId && accounts.length > 0) {
          this.form.accountId = accounts[0].id;
          this.form.availableCapital = Number(accounts[0].equity ?? accounts[0].availableCash ?? 100000);
        }
      },
      error: () => (this.error = 'Unable to load virtual accounts.'),
    });

    this.strategyRepository.getCatalog().subscribe({
      next: (strategies) => {
        this.strategies = strategies;
        if (!this.form.strategyKey && strategies.length > 0) {
          this.form.strategyKey = strategies[0].key;
        }
      },
      error: () => (this.error = 'Unable to load strategy catalog.'),
    });
  }

  loadOrders(): void {
    this.orderRepository.list().subscribe({ next: (orders) => (this.orders = orders), error: () => (this.error = 'Unable to load paper order history.') });
  }

  estimateOrder(): void {
    this.error = '';
    this.successMessage = '';
    this.syncCapitalFromSelectedAccount();
    this.orderRepository.estimate(this.form).subscribe({
      next: (estimate) => (this.estimate = estimate),
      error: (error) => {
        this.error = error?.error?.data?.message ?? 'Unable to estimate margin for this order.';
      },
    });
  }

  submitOrder(): void {
    this.error = '';
    this.successMessage = '';
    this.syncCapitalFromSelectedAccount();
    this.orderRepository.create(this.form).subscribe({
      next: (order) => {
        this.orders = [order, ...this.orders];
        this.successMessage = 'Paper order created successfully.';
        this.estimate = null;
      },
      error: (error) => {
        this.error = error?.error?.data?.message ?? 'Unable to create paper order.';
      },
    });
  }

  private syncCapitalFromSelectedAccount(): void {
    const account = this.selectedAccount;
    if (account) {
      this.form.availableCapital = Number(account.equity ?? account.availableCash ?? this.form.availableCapital);
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value ?? 0);
  }
}
