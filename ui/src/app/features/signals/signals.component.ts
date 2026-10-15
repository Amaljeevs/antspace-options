import { DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';

@Component({
  selector: 'app-signals',
  standalone: true,
  imports: [DecimalPipe],
  template: `
    <div class="space-y-5">
      <div class="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 class="text-3xl font-semibold">Market Data</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">Live market primitives from the backend APIs</p>
        </div>
        <button type="button" class="rounded-full bg-[#0A1A5F] px-5 py-2.5 text-sm font-semibold text-white" (click)="load()">Refresh</button>
      </div>

      <div class="grid md:grid-cols-3 gap-4">
        <div class="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white to-slate-50 shadow-sm dark:border-slate-700/70 dark:from-slate-900 dark:to-slate-900/70 p-5">
          <p class="text-sm text-slate-500 dark:text-slate-400">Instruments</p>
          <p class="text-3xl font-semibold mt-2">{{ instruments().length }}</p>
        </div>
        <div class="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white to-slate-50 shadow-sm dark:border-slate-700/70 dark:from-slate-900 dark:to-slate-900/70 p-5">
          <p class="text-sm text-slate-500 dark:text-slate-400">Option Legs</p>
          <p class="text-3xl font-semibold mt-2">{{ optionChain()?.legs?.length ?? 0 }}</p>
        </div>
        <div class="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white to-slate-50 shadow-sm dark:border-slate-700/70 dark:from-slate-900 dark:to-slate-900/70 p-5">
          <p class="text-sm text-slate-500 dark:text-slate-400">Spot</p>
          <p class="text-3xl font-semibold mt-2">{{ optionChain()?.spot ?? 0 | number:'1.0-2' }}</p>
        </div>
      </div>

      <section class="rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/70 p-5">
        <h2 class="text-lg font-semibold mb-4">Instruments</h2>
        <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          @for (instrument of instruments(); track instrument.symbol) {
            <div class="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <p class="font-semibold">{{ instrument.symbol }}</p>
              <p class="text-sm text-slate-500 dark:text-slate-400">{{ instrument.exchange }} · {{ instrument.instrument_type }}</p>
              <p class="text-xs text-slate-400 mt-2">Lot size {{ instrument.lot_size }} · Tick {{ instrument.tick_size }}</p>
            </div>
          }
        </div>
      </section>

      <section class="rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/70 p-5">
        <h2 class="text-lg font-semibold mb-4">NIFTY Option Chain Snapshot</h2>
        @if (optionChain()) {
          <div class="space-y-3">
            @for (leg of optionChain()!.legs; track leg.symbol) {
              <div class="rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between gap-3">
                <div>
                  <p class="font-semibold">{{ leg.symbol }}</p>
                  <p class="text-sm text-slate-500 dark:text-slate-400">Strike {{ leg.strike }} · {{ leg.option_type }}</p>
                </div>
                <div class="text-right">
                  <p class="font-semibold">Rs {{ leg.last_price | number:'1.0-2' }}</p>
                  <p class="text-sm text-slate-500 dark:text-slate-400">IV {{ leg.implied_volatility }}%</p>
                </div>
              </div>
            }
          </div>
        }
      </section>
    </div>
  `,
})
export class SignalsComponent {
  private readonly http = inject(HttpClient);
  readonly instruments = signal<any[]>([]);
  readonly optionChain = signal<any | null>(null);

  constructor() {
    this.load();
  }

  load(): void {
    this.http.get<{ data: any[] }>('/api/market/instruments').subscribe((response) => this.instruments.set(response.data));
    this.http.get<{ data: any }>('/api/market/option-chain/NIFTY').subscribe((response) => this.optionChain.set(response.data));
  }
}

