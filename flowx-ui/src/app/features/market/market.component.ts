import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MarketRepository } from '../../core/repositories/market.repository';
import { CandlePoint, MarketInstrument, OptionChain } from '../../core/models/trading.model';

@Component({
  selector: 'app-market',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  template: `
    <div class="space-y-5">
      <div class="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-3xl font-semibold">Market Data</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">Option chain, instruments, and candle data from the market data service.</p>
        </div>
        <div class="flex gap-3">
          <select [(ngModel)]="selectedSymbol" (ngModelChange)="loadCandles()" class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
            @for (instrument of instruments; track instrument.symbol) {
              <option [ngValue]="instrument.symbol">{{ instrument.symbol }}</option>
            }
          </select>
          <button type="button" class="rounded-lg bg-[#0A1A5F] px-4 py-2 text-sm text-white" (click)="loadOptionChain()">Load NIFTY Chain</button>
        </div>
      </div>

      <div class="grid xl:grid-cols-[0.9fr_1.1fr] gap-5">
        <section class="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/70">
          <h2 class="text-xl font-semibold mb-4">Instruments</h2>
          <div class="space-y-3 max-h-[32rem] overflow-auto">
            @for (instrument of instruments; track instrument.symbol) {
              <div class="rounded-xl border border-slate-200/70 p-4 dark:border-slate-700/70">
                <p class="font-semibold">{{ instrument.symbol }}</p>
                <p class="text-sm text-slate-500">{{ instrument.exchange }} • {{ instrument.instrument_type }}</p>
                <p class="text-sm text-slate-500">Lot Size: {{ instrument.lot_size }} • Tick: {{ instrument.tick_size }}</p>
              </div>
            }
          </div>
        </section>

        <section class="space-y-5">
          <div class="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/70">
            <h2 class="text-xl font-semibold mb-4">Option Chain Snapshot</h2>
            @if (optionChain) {
              <p class="text-sm text-slate-500 mb-4">{{ optionChain.underlying }} spot: {{ optionChain.spot | number:'1.0-2' }}</p>
              <div class="space-y-3">
                @for (leg of optionChain.legs; track leg.symbol) {
                  <div class="rounded-xl border border-slate-200/70 p-4 dark:border-slate-700/70 flex items-center justify-between gap-3">
                    <div>
                      <p class="font-semibold">{{ leg.symbol }}</p>
                      <p class="text-sm text-slate-500">{{ leg.option_type }} • Strike {{ leg.strike }}</p>
                    </div>
                    <div class="text-right">
                      <p class="font-semibold">Rs {{ leg.last_price | number:'1.0-2' }}</p>
                      <p class="text-sm text-slate-500">IV {{ leg.implied_volatility | number:'1.0-2' }}%</p>
                    </div>
                  </div>
                }
              </div>
            }
          </div>

          <div class="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/70">
            <h2 class="text-xl font-semibold mb-4">Recent Candles</h2>
            <div class="space-y-3">
              @for (candle of candles; track candle.ts) {
                <div class="rounded-xl border border-slate-200/70 p-4 dark:border-slate-700/70 grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p class="text-slate-500">Time</p>
                    <p>{{ candle.ts | date:'shortTime' }}</p>
                  </div>
                  <div>
                    <p class="text-slate-500">OHLC</p>
                    <p>{{ candle.open }}/{{ candle.high }}/{{ candle.low }}/{{ candle.close }}</p>
                  </div>
                  <div>
                    <p class="text-slate-500">Volume</p>
                    <p>{{ candle.volume | number:'1.0-0' }}</p>
                  </div>
                </div>
              }
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class MarketComponent {
  private readonly repo = inject(MarketRepository);
  instruments: MarketInstrument[] = [];
  candles: CandlePoint[] = [];
  optionChain: OptionChain | null = null;
  selectedSymbol = 'NIFTY';

  constructor() {
    this.repo.listInstruments().subscribe((data) => {
      this.instruments = data;
      if (data.length) {
        this.selectedSymbol = data[0].symbol;
        this.loadCandles();
      }
    });
    this.loadOptionChain();
  }

  loadCandles(): void {
    if (!this.selectedSymbol) {
      return;
    }
    this.repo.getCandles(this.selectedSymbol).subscribe((data) => (this.candles = data));
  }

  loadOptionChain(): void {
    this.repo.getOptionChain('NIFTY').subscribe((data) => (this.optionChain = data));
  }
}
