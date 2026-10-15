import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { AuthConfigEnvelope, AuthSession, TokenEnvelope } from './auth.types';

const SESSION_KEY = 'finquant.auth.session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly sessionState = signal<AuthSession | null>(this.readStoredSession());

  readonly session = computed(() => this.sessionState());
  readonly isAuthenticated = computed(() => this.hasValidSession());
  readonly username = computed(() => this.sessionState()?.username ?? 'Trader');

  login(username: string, password: string): Observable<TokenEnvelope> {
    return this.http.post<TokenEnvelope>('/api/auth/token', { username, password }).pipe(
      tap((response) => {
        const expiresAt = Date.now() + response.data.expiresIn * 1000;
        const session: AuthSession = {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          tokenType: response.data.tokenType,
          expiresAt,
          username,
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        this.sessionState.set(session);
      })
    );
  }

  loadConfig(): Observable<AuthConfigEnvelope> {
    return this.http.get<AuthConfigEnvelope>('/api/auth/config');
  }

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
    this.sessionState.set(null);
    void this.router.navigate(['/login']);
  }

  accessToken(): string | null {
    return this.hasValidSession() ? this.sessionState()?.accessToken ?? null : null;
  }

  private readStoredSession(): AuthSession | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) {
      return null;
    }
    try {
      const session = JSON.parse(raw) as AuthSession;
      return session.expiresAt > Date.now() ? session : null;
    } catch {
      return null;
    }
  }

  private hasValidSession(): boolean {
    const session = this.sessionState();
    return !!session && session.expiresAt > Date.now();
  }
}

