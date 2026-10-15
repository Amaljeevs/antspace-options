import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

type ApiEnvelope<T> = { status: string; data: T };

type TokenPayload = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
};

type JwtClaims = {
  sub?: unknown;
  name?: unknown;
};

export interface Session {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresAt: number;
  email: string;
  name: string;
}

export interface User {
  email: string;
  name: string;
}

const SESSION_KEY = 'flowx_session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly sessionState = signal<Session | null>(this.readSession());

  readonly currentUser = computed<User | null>(() => {
    const session = this.sessionState();
    if (!session) {
      return null;
    }
    return {
      email: session.email,
      name: session.name,
    };
  });

  readonly isAuthenticated = computed(() => {
    const session = this.sessionState();
    return !!session && session.expiresAt > Date.now();
  });

  register(name: string, email: string, password: string): Observable<void> {
    return this.http.post<ApiEnvelope<TokenPayload>>('/api/auth/register', { name, email, password }).pipe(
      tap((response) => this.storeSession(response.data)),
      map(() => void 0)
    );
  }

  login(email: string, password: string): Observable<void> {
    return this.http.post<ApiEnvelope<TokenPayload>>('/api/auth/token', { username: email, password }).pipe(
      tap((response) => this.storeSession(response.data)),
      map(() => void 0)
    );
  }

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
    this.sessionState.set(null);
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  getAccessToken(): string | null {
    const session = this.sessionState();
    if (!session || session.expiresAt <= Date.now()) {
      return null;
    }
    return session.accessToken;
  }

  private readSession(): Session | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw) as Session;
      return parsed.expiresAt > Date.now() ? parsed : null;
    } catch {
      return null;
    }
  }

  private storeSession(payload: TokenPayload): void {
    const claims = this.decodeJwt(payload.accessToken);
    const session: Session = {
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
      tokenType: payload.tokenType,
      expiresAt: Date.now() + payload.expiresIn * 1000,
      email: typeof claims['sub'] === 'string' ? claims['sub'] : 'user@flowx.app',
      name: typeof claims['name'] === 'string' ? claims['name'] : 'Flowx User',
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    this.sessionState.set(session);
  }

  private decodeJwt(token: string): JwtClaims {
    try {
      const payload = token.split('.')[1];
      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = atob(normalized);
      return JSON.parse(decoded) as JwtClaims;
    } catch {
      return {};
    }
  }
}
