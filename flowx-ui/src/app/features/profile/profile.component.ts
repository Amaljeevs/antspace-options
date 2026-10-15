import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { AuthService, User } from '../../core/services/auth.service';
import { PortfolioRepository } from '../../core/repositories/portfolio.repository';
import { OrderRepository } from '../../core/repositories/order.repository';
import { PaperOrder, VirtualAccount } from '../../core/models/trading.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-6xl space-y-6">
      <div>
        <h1 class="text-3xl font-semibold">My profile</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Identity, paper trading accounts, and a quick view of how this workspace is being used.</p>
      </div>

      @if (error) {
        <div class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">{{ error }}</div>
      }

      <div class="grid gap-4 md:grid-cols-3">
        <div class="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/70 md:col-span-2">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-sm text-slate-500 dark:text-slate-400">Logged in user</p>
              <h2 class="mt-1 text-2xl font-semibold">{{ user?.name ?? 'Trader' }}</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ user?.email ?? 'No email available' }}</p>
            </div>
            <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#DBEAFE] text-xl font-semibold text-[#1D4ED8] dark:bg-blue-950/40 dark:text-blue-300">
              {{ initials }}
            </div>
          </div>
          <div class="mt-6 grid gap-4 md:grid-cols-3 text-sm">
            <div class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-950/30"><p class="text-slate-500 dark:text-slate-400">Virtual accounts</p><p class="mt-2 text-2xl font-semibold">{{ accounts.length }}</p></div>
            <div class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-950/30"><p class="text-slate-500 dark:text-slate-400">Paper orders</p><p class="mt-2 text-2xl font-semibold">{{ orders.length }}</p></div>
            <div class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-950/30"><p class="text-slate-500 dark:text-slate-400">Total simulated equity</p><p class="mt-2 text-2xl font-semibold">{{ formatCurrency(totalEquity) }}</p></div>
          </div>
        </div>
        <div class="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/70">
          <p class="text-sm font-medium">Workspace notes</p>
          <p class="mt-3 text-sm text-slate-500 dark:text-slate-400">Register and login are backed by the auth service, and paper trading capital is sourced from your virtual accounts.</p>
        </div>
      </div>

      <div class="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section class="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/70">
          <h2 class="text-lg font-semibold">Virtual accounts</h2>
          <div class="mt-5 space-y-3">
            @for (account of accounts; track account.id) {
              <article class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-950/30">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="font-semibold">{{ account.ownerName }}</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">{{ account.createdAt | date:'mediumDate' }}</p>
                  </div>
                  <span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/30 dark:text-blue-300">{{ formatCurrency(account.equity) }}</span>
                </div>
                <div class="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div><p class="text-slate-500 dark:text-slate-400">Available cash</p><p class="font-medium">{{ formatCurrency(account.availableCash) }}</p></div>
                  <div><p class="text-slate-500 dark:text-slate-400">Free margin</p><p class="font-medium">{{ formatCurrency(account.freeMargin) }}</p></div>
                </div>
              </article>
            } @empty {
              <p class="text-sm text-slate-500 dark:text-slate-400">No virtual accounts created yet.</p>
            }
          </div>
        </section>

        <section class="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/70">
          <h2 class="text-lg font-semibold">Recent paper orders</h2>
          <div class="mt-5 space-y-3">
            @for (order of recentOrders; track order.id) {
              <article class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-950/30">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="font-semibold">{{ order.symbol }}</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">{{ order.strategyKey }} · {{ order.side }} · {{ order.mode }}</p>
                  </div>
                  <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">{{ order.status }}</span>
                </div>
                <div class="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div><p class="text-slate-500 dark:text-slate-400">Estimated margin</p><p class="font-medium">{{ formatCurrency(order.estimatedMargin) }}</p></div>
                  <div><p class="text-slate-500 dark:text-slate-400">Maximum loss</p><p class="font-medium">{{ formatCurrency(order.maximumLoss) }}</p></div>
                </div>
              </article>
            } @empty {
              <p class="text-sm text-slate-500 dark:text-slate-400">No paper orders found yet.</p>
            }
          </div>
        </section>
      </div>
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly portfolioRepository = inject(PortfolioRepository);
  private readonly orderRepository = inject(OrderRepository);

  user: User | null = null;
  accounts: VirtualAccount[] = [];
  orders: PaperOrder[] = [];
  error = '';

  get initials(): string {
    const name = this.user?.name?.trim() ?? 'Trader';
    return name.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('');
  }

  get totalEquity(): number {
    return this.accounts.reduce((sum, account) => sum + Number(account.equity ?? 0), 0);
  }

  get recentOrders(): PaperOrder[] {
    return this.orders.slice(0, 5);
  }

  ngOnInit(): void {
    this.user = this.auth.getCurrentUser();
    this.portfolioRepository.listAccounts().subscribe({ next: (accounts) => (this.accounts = accounts), error: () => (this.error = 'Unable to load account profile data.') });
    this.orderRepository.list().subscribe({ next: (orders) => (this.orders = orders), error: () => (this.error = 'Unable to load paper order activity.') });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value ?? 0);
  }
}
