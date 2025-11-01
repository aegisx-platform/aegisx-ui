import { Injectable, signal, inject } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap, finalize } from 'rxjs/operators';
import {
  LoginAttempt,
  LoginAttemptsQuery,
  LoginAttemptsStats,
  CleanupQuery,
  LoginAttemptsState,
  LoginAttemptsResponse,
  LoginAttemptResponse,
  LoginAttemptsStatsResponse,
  CleanupResponse,
  ApiErrorResponse,
} from '../models/audit.types';

/**
 * Login Attempts Service
 *
 * Provides methods to manage and view login attempts including:
 * - Query login attempts with filters
 * - Get login attempt statistics
 * - Delete login attempts
 * - Cleanup old login attempts
 * - Export login attempts
 */
@Injectable({
  providedIn: 'root',
})
export class LoginAttemptsService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/login-attempts';

  // Signal-based state management
  private _state = signal<LoginAttemptsState>({
    loginAttempts: [],
    stats: null,
    loading: false,
    error: null,
    pagination: null,
  });

  // Read-only state signals
  readonly state = this._state.asReadonly();
  readonly loginAttempts = () => this._state().loginAttempts;
  readonly stats = () => this._state().stats;
  readonly loading = () => this._state().loading;
  readonly error = () => this._state().error;
  readonly pagination = () => this._state().pagination;

  /**
   * Get login attempts with optional filters
   */
  getLoginAttempts(query?: LoginAttemptsQuery): Observable<{
    data: LoginAttempt[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    this.setLoading(true);
    this.clearError();

    let params = new HttpParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http
      .get<LoginAttemptsResponse>(`${this.baseUrl}`, { params })
      .pipe(
        map((response) => ({
          data: response.data,
          pagination: response.pagination,
        })),
        tap(({ data, pagination }) => {
          this.updateState({
            loginAttempts: data,
            pagination: pagination || null,
            loading: false,
          });
        }),
        catchError((error) => this.handleError(error)),
        finalize(() => this.setLoading(false)),
      );
  }

  /**
   * Get login attempt statistics
   */
  getStats(): Observable<LoginAttemptsStats> {
    this.setLoading(true);
    this.clearError();

    return this.http
      .get<LoginAttemptsStatsResponse>(`${this.baseUrl}/stats`)
      .pipe(
        map((response) => response.data),
        tap((stats) => {
          this.updateState({
            stats: stats,
            loading: false,
          });
        }),
        catchError((error) => this.handleError(error)),
        finalize(() => this.setLoading(false)),
      );
  }

  /**
   * Get a single login attempt by ID
   */
  getLoginAttempt(id: string): Observable<LoginAttempt> {
    this.setLoading(true);
    this.clearError();

    return this.http.get<LoginAttemptResponse>(`${this.baseUrl}/${id}`).pipe(
      map((response) => response.data),
      catchError((error) => this.handleError(error)),
      finalize(() => this.setLoading(false)),
    );
  }

  /**
   * Delete a single login attempt
   */
  deleteLoginAttempt(id: string): Observable<void> {
    this.setLoading(true);
    this.clearError();

    return this.http
      .delete<{ success: true; message: string }>(`${this.baseUrl}/${id}`)
      .pipe(
        map(() => undefined),
        tap(() => {
          // Remove from state
          const currentAttempts = this.loginAttempts();
          const updatedAttempts = currentAttempts.filter((a) => a.id !== id);
          this.updateState({
            loginAttempts: updatedAttempts,
            loading: false,
          });
        }),
        catchError((error) => this.handleError(error)),
        finalize(() => this.setLoading(false)),
      );
  }

  /**
   * Cleanup old login attempts
   */
  cleanupAttempts(query: CleanupQuery): Observable<{ deletedCount: number }> {
    this.setLoading(true);
    this.clearError();

    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });

    return this.http
      .delete<CleanupResponse>(`${this.baseUrl}/cleanup`, { params })
      .pipe(
        map((response) => response.data),
        tap(({ deletedCount }) => {
          console.log(`Deleted ${deletedCount} login attempts`);
          this.updateState({ loading: false });
        }),
        catchError((error) => this.handleError(error)),
        finalize(() => this.setLoading(false)),
      );
  }

  /**
   * Export login attempts (returns blob for download)
   */
  exportAttempts(query?: LoginAttemptsQuery): Observable<Blob> {
    this.setLoading(true);
    this.clearError();

    let params = new HttpParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http
      .get(`${this.baseUrl}/export`, {
        params,
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(
        map((response) => {
          // Extract filename from Content-Disposition header if available
          const contentDisposition = response.headers.get(
            'Content-Disposition',
          );
          let filename = 'login-attempts.csv';
          if (contentDisposition) {
            const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(
              contentDisposition,
            );
            if (matches && matches[1]) {
              filename = matches[1].replace(/['"]/g, '');
            }
          }

          // Create download link
          const blob = response.body!;
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          link.click();
          window.URL.revokeObjectURL(url);

          return blob;
        }),
        catchError((error) => this.handleError(error)),
        finalize(() => this.setLoading(false)),
      );
  }

  /**
   * Refresh login attempts
   */
  refresh(query?: LoginAttemptsQuery): void {
    this.getLoginAttempts(query).subscribe({
      next: () => console.log('Login attempts refreshed'),
      error: (error) =>
        console.error('Failed to refresh login attempts:', error),
    });
  }

  // Private helper methods

  private updateState(partialState: Partial<LoginAttemptsState>): void {
    this._state.update((current) => ({ ...current, ...partialState }));
  }

  private setLoading(loading: boolean): void {
    this.updateState({ loading });
  }

  private clearError(): void {
    this.updateState({ error: null });
  }

  private setError(error: string): void {
    this.updateState({ error, loading: false });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string;

    if (error.error && typeof error.error === 'object') {
      const apiError = error.error as ApiErrorResponse;
      errorMessage = apiError.error?.message || 'An unexpected error occurred';
    } else if (error.message) {
      errorMessage = error.message;
    } else {
      errorMessage = `HTTP ${error.status}: ${error.statusText || 'Unknown error'}`;
    }

    this.setError(errorMessage);

    console.error('Login Attempts API Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
