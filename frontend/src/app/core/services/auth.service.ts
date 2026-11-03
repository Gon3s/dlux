import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/v1/auth';

  readonly authenticated = signal(false);

  login(token: string): Observable<void> {
    return this.http
      .post<void>(`${this.base}/login`, { token })
      .pipe(tap(() => this.authenticated.set(true)));
  }

  checkSession(): Observable<boolean> {
    return this.http.get<void>(`${this.base}/session`).pipe(
      tap(() => this.authenticated.set(true)),
      map(() => true),
      catchError(() => {
        this.authenticated.set(false);
        return of(false);
      }),
    );
  }

  logout(): Observable<void> {
    return this.http
      .post<void>(`${this.base}/logout`, {})
      .pipe(tap(() => this.authenticated.set(false)));
  }
}
