import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { BrokerRepository } from '../../core/repositories/broker.repository';
import { BrokerSummary } from '../../core/models/trading.model';

@Component({
  selector: 'app-broker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-5">
      <div>
        <h1 class="text-3xl font-semibold">Broker Integrations</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Available adapters exposed by the broker service.</p>
      </div>

      <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        @for (broker of brokers; track broker.brokerId) {
          <article class="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/70">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold uppercase">{{ broker.brokerId }}</h3>
              <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700">Adapter Ready</span>
            </div>
            <div class="space-y-2 text-sm text-slate-500">
              @for (entry of capabilityEntries(broker); track entry.key) {
                <div class="flex items-center justify-between">
                  <span>{{ entry.key }}</span>
                  <span class="font-medium" [class.text-emerald-500]="entry.value" [class.text-rose-500]="!entry.value">
                    {{ entry.value ? 'Yes' : 'No' }}
                  </span>
                </div>
              }
            </div>
          </article>
        }
      </div>
    </div>
  `,
})
export class BrokerComponent {
  private readonly repo = inject(BrokerRepository);
  brokers: BrokerSummary[] = [];

  constructor() {
    this.repo.list().subscribe((data) => (this.brokers = data));
  }

  capabilityEntries(broker: BrokerSummary): Array<{ key: string; value: boolean }> {
    return Object.entries(broker.capabilities).map(([key, value]) => ({ key, value }));
  }
}
