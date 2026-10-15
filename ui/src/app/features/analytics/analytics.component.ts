import { DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type HeatCellValue = -1 | 1;
interface HeatMapMonth {
  name: string;
  cells: HeatCellValue[];
  pnlLabel: string;
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [DecimalPipe, FormsModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-semibold">Analytics</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Live analytics summary from the backend APIs</p>
      </div>

      <div class="grid md:grid-cols-4 gap-4">
        <div class="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-900">
          <p class="text-xs text-slate-500 dark:text-slate-400">Total P&L</p>
          <p class="text-2xl font-semibold mt-1">Rs {{ summary()?.total_pnl ?? 0 | number:'1.0-0' }}</p>
        </div>
        <div class="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-900">
          <p class="text-xs text-slate-500 dark:text-slate-400">Used Margin</p>
          <p class="text-2xl font-semibold mt-1">Rs {{ summary()?.used_margin ?? 0 | number:'1.0-0' }}</p>
        </div>
        <div class="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-900">
          <p class="text-xs text-slate-500 dark:text-slate-400">Free Cash</p>
          <p class="text-2xl font-semibold mt-1">Rs {{ summary()?.free_cash ?? 0 | number:'1.0-0' }}</p>
        </div>
        <div class="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-900">
          <p class="text-xs text-slate-500 dark:text-slate-400">Win Rate</p>
          <p class="text-2xl font-semibold mt-1">{{ ((summary()?.win_rate ?? 0) * 100) | number:'1.0-1' }}%</p>
        </div>
      </div>

      <section class="rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/70 p-4 md:p-5 space-y-4">
        <div class="flex items-center justify-between gap-3 flex-wrap">
          <h2 class="text-lg font-semibold">Synthetic Day P/L Heat Map</h2>
          <select [ngModel]="selectedYear()" (ngModelChange)="selectedYear.set($event)" class="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm">
            @for (y of yearOptions; track y) {
              <option [ngValue]="y">{{ y }}</option>
            }
          </select>
        </div>

        <div class="rounded-xl border border-slate-200 dark:border-slate-700 p-3 overflow-x-auto">
          <div class="min-w-[920px] grid grid-cols-12 gap-3">
            @for (month of heatMapMonths(); track month.name) {
              <div>
                <p class="text-xs text-slate-500 dark:text-slate-400 mb-2">{{ month.name }} {{ month.pnlLabel }}</p>
                <div class="grid grid-cols-7 gap-1">
                  @for (cell of month.cells; track $index) {
                    <span [class]="heatCellClass(cell)"></span>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      </section>
    </div>
  `,
})
export class AnalyticsComponent {
  private readonly http = inject(HttpClient);
  readonly summary = signal<any | null>(null);
  readonly selectedYear = signal(new Date().getFullYear());
  readonly yearOptions = [new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2];
  readonly monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  readonly heatMapMonths = computed(() => this.buildHeatMap(this.selectedYear()));

  constructor() {
    this.http.get<{ data: any }>('/api/analytics/summary').subscribe((response) => this.summary.set(response.data));
  }

  heatCellClass(value: HeatCellValue): string {
    const base = 'inline-block h-3.5 w-3.5 rounded-[3px]';
    return value === 1 ? `${base} bg-emerald-500/80` : `${base} bg-rose-400/80`;
  }

  private buildHeatMap(year: number): HeatMapMonth[] {
    return this.monthNames.map((name, monthIndex) => {
      const cells: HeatCellValue[] = [];
      for (let index = 0; index < 35; index++) {
        const score = (year * 19 + monthIndex * 23 + index * 11) % 100;
        cells.push(score >= 50 ? 1 : -1);
      }
      const monthPnl = cells.reduce((acc, cell) => acc + (cell === 1 ? 1 : -1), 0);
      return { name, cells, pnlLabel: monthPnl > 0 ? `+${monthPnl}` : `${monthPnl}` };
    });
  }
}

