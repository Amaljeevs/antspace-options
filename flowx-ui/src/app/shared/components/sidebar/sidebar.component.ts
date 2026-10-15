import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="fixed inset-y-0 left-0 z-20 w-24 h-screen border-r border-slate-200 dark:border-[#374151] bg-white dark:bg-[#111827] py-5 px-3 flex flex-col items-center gap-2">
      <div class="mb-4 text-center">
        <div class="font-phonk text-[17px] leading-none text-[#0A1A5F] dark:text-blue-300">Flowx</div>
        <div class="text-[10px] mt-1 text-slate-400">Antspace</div>
      </div>
      @for (item of navItems; track item.route) {
        <a
          [routerLink]="item.route"
          routerLinkActive="bg-[#2563EB] text-white"
          class="flex flex-col items-center justify-center gap-1 w-full h-16 rounded-xl text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100 transition"
        >
          <span class="text-lg">{{ item.icon }}</span>
          <small>{{ item.label }}</small>
        </a>
      }
    </aside>
  `,
})
export class SidebarComponent {
  navItems = [
    { route: '/app/home', label: 'Home', icon: 'H' },
    { route: '/app/market', label: 'Market', icon: 'M' },
    { route: '/app/strategies', label: 'Strategy', icon: 'S' },
    { route: '/app/orders', label: 'Orders', icon: 'O' },
    { route: '/app/portfolio', label: 'Portfolio', icon: 'P' },
    { route: '/app/broker', label: 'Broker', icon: 'B' },
    { route: '/app/analytics', label: 'Analysis', icon: 'A' },
    { route: '/app/profile', label: 'Profile', icon: 'U' },
  ];
}
