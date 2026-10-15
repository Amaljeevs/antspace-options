import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';

@Component({
  selector: 'app-broker',
  standalone: true,
  template: `
    <div class="space-y-5">
      <div>
        <h1 class="text-3xl font-semibold">Broker Layer</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Connected broker adapters from the backend catalog</p>
      </div>

      <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        @for (broker of brokers(); track broker.brokerId) {
          <article class="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white to-slate-50 shadow-sm dark:border-slate-700/70 dark:from-slate-900 dark:to-slate-900/70 p-5">
            <div class="flex items-center justify-between mb-4">
              <div>
                <p class="font-semibold text-lg capitalize">{{ broker.brokerId }}</p>
                <p class="text-sm text-slate-500 dark:text-slate-400">Adapter ready</p>
              </div>
              <span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Available</span>
            </div>
            <div class="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              @for (capability of capabilityEntries(broker.capabilities); track capability.key) {
                <div class="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2">
                  <span>{{ capability.key }}</span>
                  <span class="font-semibold">{{ capability.value }}</span>
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
  private readonly http = inject(HttpClient);
  readonly brokers = signal<any[]>([]);

  constructor() {
    this.http.get<{ data: any[] }>('/api/brokers').subscribe((response) => this.brokers.set(response.data));
  }

  capabilityEntries(capabilities: Record<string, unknown>): Array<{ key: string; value: string }> {
    return Object.entries(capabilities).map(([key, value]) => ({ key, value: String(value) }));
  }
}

