import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { StrategyRepository } from '../../../core/repositories/strategy.repository';
import { Strategy } from '../../../core/models/strategy.model';

@Component({
  selector: 'app-strategies-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-5">
      <div>
        <h1 class="text-3xl font-semibold">Strategies</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Broker-agnostic strategies currently exposed by the backend catalog.</p>
      </div>

      <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        @for (strategy of strategies; track strategy.key) {
          <article class="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/70">
            <div class="flex items-center justify-between gap-3 mb-3">
              <h3 class="font-semibold">{{ strategy.label }}</h3>
              <span class="rounded-full bg-blue-50 px-3 py-1 text-xs uppercase text-blue-700">{{ strategy.category }}</span>
            </div>
            <p class="text-sm text-slate-500 mb-4">{{ strategy.description }}</p>
            <div class="flex items-center justify-between">
              <span class="text-xs text-slate-400">Key: {{ strategy.key }}</span>
              <span class="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase dark:bg-slate-800">{{ strategy.risk_profile }}</span>
            </div>
          </article>
        }
      </div>
    </div>
  `,
})
export class StrategiesListComponent {
  private readonly repo = inject(StrategyRepository);
  strategies: Strategy[] = [];

  constructor() {
    this.repo.getCatalog().subscribe((data) => (this.strategies = data));
  }
}
