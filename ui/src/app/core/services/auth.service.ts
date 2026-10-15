import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

const SESSION_KEY = 'finquant.flowx.session';

interface ApiEnvelope<T> {
  data: T;
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

interface AuthConfigResponse {
  demoUser: string;
  demoPassword: string;
}

interface JwtPayload {
  sub?: string;
  name?: string;
  exp?: number;
}

export interface Session {
  userId: string;
  email: string;
  name: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  loadConfig(): Observable<AuthConfigResponse> {
    return this.http.get<ApiEnvelope<AuthConfigResponse>>('/api/auth/config').pipe(
      map((response) => response.data),
    );
  }

  register(email: string, password: string, name: string): Observable<Session> {
    return this.http.post<ApiEnvelope<TokenResponse>>('/api/auth/register', { email, password, name }).pipe(
      map((response) => this.toSession(response.data)),
      tap((session) => this.setSession(session)),
    );
  }

  login(email: string, password: string): Observable<Session> {
    return this.http.post<ApiEnvelope<TokenResponse>>('/api/auth/token', { username: email, password }).pipe(
      map((response) => this.toSession(response.data)),
      tap((session) => this.setSession(session)),
    );
  }

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
  }

  getCurrentUser(): Session | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) {
        return null;
      }
      const session = JSON.parse(raw) as Session;
      if (session.expiresAt <= Date.now()) {
        this.logout();
        return null;
      }
      return session;
    } catch {
      return null;
    }
  }

  accessToken(): string | null {
    return this.getCurrentUser()?.accessToken ?? null;
  }

  private setSession(session: Session): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  private toSession(tokenResponse: TokenResponse): Session {
    const payload = this.decodeJwt(tokenResponse.accessToken);
    const expiresAt = payload.exp ? payload.exp * 1000 : Date.now() + tokenResponse.expiresIn * 1000;
    return {
      userId: payload.sub ?? 'unknown',
      email: payload.sub ?? 'unknown',
      name: payload.name ?? payload.sub ?? 'Trader',
      accessToken: tokenResponse.accessToken,
      refreshToken: tokenResponse.refreshToken,
      expiresAt,
    };
  }

  private decodeJwt(token: string): JwtPayload {
    try {
      const [, payload] = token.split('.');
      if (!payload) {
        return {};
      }
      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
      return JSON.parse(atob(padded)) as JwtPayload;
    } catch {
      return {};
    }
  }
}
