import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-strategies-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="space-y-5">
      <div class="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-3xl font-semibold">Strategies</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">Backend-backed catalog for paper trading strategy selection</p>
        </div>
        <a routerLink="/app/plans" class="inline-flex items-center justify-center rounded-full bg-[#0A1A5F] px-5 py-2.5 text-sm font-semibold text-white">Open Paper Trading</a>
      </div>

      <div class="rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/70 p-3 flex items-center justify-between gap-3 flex-wrap">
        <div class="inline-flex rounded-full bg-slate-100 dark:bg-slate-800 p-1.5">
          @for (tab of tabs; track tab) {
            <button type="button" class="px-5 py-1.5 text-sm rounded-full transition font-medium" [class.bg-[#0A1A5F]]="activeTab() === tab" [class.text-white]="activeTab() === tab" (click)="activeTab.set(tab)">
              {{ tab }}
            </button>
          }
        </div>
        <div class="relative w-full md:w-80">
          <input type="search" placeholder="Search Strategy" [(ngModel)]="searchQuery" class="w-full rounded-full border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-900 pl-10 pr-4" />
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg>
          </span>
        </div>
      </div>

      <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        @for (strategy of filteredStrategies(); track strategy.key) {
          <article class="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white to-slate-50 shadow-sm dark:border-slate-700/70 dark:from-slate-900 dark:to-slate-900/70 p-4 hover:shadow-md transition">
            <div class="flex items-center justify-between gap-2 mb-3">
              <div>
                <h3 class="font-semibold">{{ strategy.label }}</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase">{{ strategy.category }}</p>
              </div>
              <span class="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs">{{ strategy.risk_profile }}</span>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">{{ strategy.description }}</p>
            <div class="flex justify-end">
              <a routerLink="/app/plans" class="rounded-full bg-indigo-100 dark:bg-slate-700 px-4 py-1.5 text-sm font-semibold text-indigo-700 dark:text-slate-100">
                Use in paper trade
              </a>
            </div>
          </article>
        }
      </div>
    </div>
  `,
})
export class StrategiesListComponent {
  private readonly http = inject(HttpClient);

  readonly tabs = ['All', 'income', 'premium-selling', 'volatility'];
  readonly activeTab = signal('All');
  readonly strategies = signal<any[]>([]);
  searchQuery = '';

  readonly filteredStrategies = computed(() => {
    const query = this.searchQuery.trim().toLowerCase();
    return this.strategies().filter((strategy) => {
      const matchesTab = this.activeTab() === 'All' || strategy.category === this.activeTab();
      const matchesQuery = !query || strategy.label.toLowerCase().includes(query) || strategy.description.toLowerCase().includes(query);
      return matchesTab && matchesQuery;
    });
  });

  constructor() {
    this.http.get<{ data: any[] }>('/api/strategy/catalog').subscribe((response) => this.strategies.set(response.data));
  }
}

