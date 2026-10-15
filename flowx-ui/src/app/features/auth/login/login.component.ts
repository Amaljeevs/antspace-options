import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="relative min-h-screen bg-[#F9FAFB] dark:bg-[#111827] flex items-center justify-center p-6 overflow-hidden">
      <section class="relative z-10 w-full max-w-md">
        <button type="button" class="absolute -top-2 -right-2 w-9 h-9 rounded-full border border-slate-300 dark:border-[#374151] bg-white/90 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 shadow flex items-center justify-center" (click)="theme.toggle()">
          <span class="text-slate-600 dark:text-slate-200">T</span>
        </button>
        <div class="rounded-2xl border border-slate-200 dark:border-[#374151] bg-white dark:bg-[#111827] shadow-xl p-7 md:p-8">
          <div class="mb-6">
            <p class="font-phonk text-3xl leading-none text-[#0A1A5F] dark:text-blue-300">Flowx</p>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">powered by Antspace</p>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-4">Sign in to your paper trading workspace.</p>
          </div>

          <h2 class="text-2xl font-bold mb-1">Log in to your account</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-5">Use your registered account or the demo login.</p>

          @if (error) {
            <p class="text-sm text-red-500 mb-3">{{ error }}</p>
          }

          <form (ngSubmit)="onSubmit()" class="space-y-4">
            <label for="username" class="block text-xs text-slate-500 dark:text-slate-400">
              Email or username
              <input id="username" type="text" [(ngModel)]="email" name="email" required autocomplete="username" class="mt-1 w-full rounded-lg border border-slate-200 dark:border-[#374151] bg-white dark:bg-[#111827] px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/40" />
            </label>
            <label for="password" class="block text-xs text-slate-500 dark:text-slate-400">
              Password
              <input id="password" type="password" [(ngModel)]="password" name="password" required autocomplete="current-password" class="mt-1 w-full rounded-lg border border-slate-200 dark:border-[#374151] bg-white dark:bg-[#111827] px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/40" />
            </label>
            <button type="button" class="text-xs text-slate-400" (click)="useDemo()">Use demo credentials</button>
            <button type="submit" class="w-full rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white font-semibold py-2.5 shadow-lg shadow-blue-500/20 transition">
              Log In
            </button>
          </form>

          <p class="mt-5 text-sm text-center text-slate-500 dark:text-slate-400">
            Don't have an account?
            <a routerLink="/auth/register" class="text-[#2563EB] font-medium">Register</a>
          </p>
        </div>
      </section>
    </div>
  `,
})
export class LoginComponent {
  theme: ThemeService;
  email = '';
  password = '';
  error = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    theme: ThemeService
  ) {
    this.theme = theme;
  }

  useDemo(): void {
    this.email = 'demo';
    this.password = 'demo123';
  }

  onSubmit(): void {
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/app/home']),
      error: (error) => {
        this.error = error?.error?.data?.message ?? 'Login failed';
      },
    });
  }
}
