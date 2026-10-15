import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="grid min-h-screen lg:grid-cols-[0.92fr_1.08fr]">
      <section class="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(34,167,106,0.30),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.20),_transparent_30%),linear-gradient(160deg,_#0f172a,_#111827_42%,_#1e293b)] px-8 py-10 text-white lg:px-14 lg:py-14">
        <div class="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.04)_50%,transparent_100%)]"></div>
        <div class="relative z-10 flex h-full flex-col justify-between">
          <div class="flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-xl font-bold text-white">M</div>
            <div>
              <p class="font-display text-2xl font-semibold">FinQuant</p>
              <p class="text-sm text-slate-300">Options Paper Trading Desk</p>
            </div>
          </div>

          <div class="max-w-xl space-y-5">
            <span class="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">
              Broker-fed simulation
            </span>
            <h1 class="font-display text-4xl leading-tight lg:text-5xl">Login to your 30-day virtual trading workspace</h1>
            <p class="text-base text-slate-300 lg:text-lg">
              Monitor option chains from Zerodha or Dhan, calculate margin before every paper trade, and track virtual capital without risking real money.
            </p>
          </div>

          <div class="grid gap-4 md:grid-cols-3">
            <div class="rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p class="text-sm text-slate-300">Paper account</p>
              <p class="mt-2 text-2xl font-semibold">Virtual capital</p>
            </div>
            <div class="rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p class="text-sm text-slate-300">Trade checks</p>
              <p class="mt-2 text-2xl font-semibold">Margin aware</p>
            </div>
            <div class="rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p class="text-sm text-slate-300">Market pricing</p>
              <p class="mt-2 text-2xl font-semibold">Option chain MTM</p>
            </div>
          </div>
        </div>
      </section>

      <section class="flex items-center justify-center bg-mist px-6 py-10 lg:px-12">
        <div class="w-full max-w-md rounded-[32px] bg-white p-8 shadow-soft lg:p-10">
          <div class="mb-8">
            <p class="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Secure sign in</p>
            <h2 class="mt-3 font-display text-3xl font-semibold text-slate-900">Welcome back</h2>
            <p class="mt-2 text-sm text-slate-500">
              Use the demo credentials from the auth service to access the trading desk.
            </p>
          </div>

          <form class="space-y-5" [formGroup]="form" (ngSubmit)="submit()">
            <label class="block space-y-2">
              <span class="text-sm font-semibold text-slate-700">Username</span>
              <input class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-400 focus:bg-white" formControlName="username" />
            </label>

            <label class="block space-y-2">
              <span class="text-sm font-semibold text-slate-700">Password</span>
              <input type="password" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-400 focus:bg-white" formControlName="password" />
            </label>

            <div class="rounded-2xl bg-brand-50 px-4 py-4 text-sm text-brand-800" *ngIf="demoCredentials() as demo">
              Demo login: <strong>{{ demo.demoUser }}</strong> / <strong>{{ demo.demoPassword }}</strong>
            </div>

            <div class="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700" *ngIf="errorMessage()">
              {{ errorMessage() }}
            </div>

            <button
              type="submit"
              class="w-full rounded-2xl bg-brand-500 px-5 py-3 font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
              [disabled]="form.invalid || submitting()"
            >
              {{ submitting() ? 'Signing in...' : 'Sign in' }}
            </button>
          </form>
        </div>
      </section>
    </div>
  `,
})
export class LoginPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly submitting = signal(false);
  readonly errorMessage = signal('');
  readonly demoCredentials = signal<{ demoUser: string; demoPassword: string } | null>(null);

  readonly form = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  constructor() {
    this.authService.loadConfig()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.demoCredentials.set(response.data);
          this.form.patchValue({
            username: response.data.demoUser,
            password: response.data.demoPassword,
          });
        },
        error: () => {
          this.errorMessage.set('Auth service is unavailable right now. Check the API stack and try again.');
        },
      });
  }

  submit(): void {
    if (this.form.invalid || this.submitting()) {
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set('');

    const { username, password } = this.form.getRawValue();
    this.authService.login(username, password)
      .pipe(
        finalize(() => this.submitting.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          void this.router.navigate(['/app']);
        },
        error: () => {
          this.errorMessage.set('Login failed. Verify the credentials or restart the auth and gateway services.');
        },
      });
  }
}

