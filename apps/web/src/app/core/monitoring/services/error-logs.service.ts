import { Injectable, signal, inject } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap, finalize } from 'rxjs/operators';
import {
  ErrorLog,
  ErrorLogsQuery,
  ErrorStats,
  CleanupQuery,
  ErrorLogsState,
  ErrorLogsListResponse,
  ErrorStatsResponse,
  CleanupResponse,
  ApiErrorResponse,
} from '../models/monitoring.types';

/**
 * Error Logs Service
 *
 * Provides methods to manage and view error logs including:
 * - Query error logs with filters
 * - Get error statistics
 * - Delete error logs
 * - Cleanup old error logs
 * - Export error logs
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorLogsService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/error-logs';

  // Signal-based state management
  private _state = signal<ErrorLogsState>({
    errorLogs: [],
    errorStats: null,
    loading: false,
    error: null,
    pagination: null,
  });

  // Read-only state signals
  readonly state = this._state.asReadonly();
  readonly errorLogs = () => this._state().errorLogs;
  readonly errorStats = () => this._state().errorStats;
  readonly loading = () => this._state().loading;
  readonly error = () => this._state().error;
  readonly pagination = () => this._state().pagination;

  /**
   * Get error logs with optional filters
   */
  getErrorLogs(query?: ErrorLogsQuery): Observable<{
    data: ErrorLog[];
    pagination?: { total: number; limit: number; offset: number };
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
      .get<ErrorLogsListResponse>(`${this.baseUrl}`, { params })
      .pipe(
        map((response) => ({
          data: response.data,
          pagination: response.pagination,
        })),
        tap(({ data, pagination }) => {
          this.updateState({
            errorLogs: data,
            pagination: pagination || null,
            loading: false,
          });
        }),
        catchError((error) => this.handleError(error)),
        finalize(() => this.setLoading(false)),
      );
  }

  /**
   * Get error statistics
   */
  getErrorStats(): Observable<ErrorStats> {
    this.setLoading(true);
    this.clearError();

    return this.http.get<ErrorStatsResponse>(`${this.baseUrl}/stats`).pipe(
      map((response) => response.data),
      tap((stats) => {
        this.updateState({
          errorStats: stats,
          loading: false,
        });
      }),
      catchError((error) => this.handleError(error)),
      finalize(() => this.setLoading(false)),
    );
  }

  /**
   * Get a single error log by ID
   */
  getErrorLog(id: string): Observable<ErrorLog> {
    this.setLoading(true);
    this.clearError();

    return this.http
      .get<{
        success: true;
        data: ErrorLog;
        message: string;
      }>(`${this.baseUrl}/${id}`)
      .pipe(
        map((response) => response.data),
        catchError((error) => this.handleError(error)),
        finalize(() => this.setLoading(false)),
      );
  }

  /**
   * Delete a single error log
   */
  deleteErrorLog(id: string): Observable<void> {
    this.setLoading(true);
    this.clearError();

    return this.http
      .delete<{ success: true; message: string }>(`${this.baseUrl}/${id}`)
      .pipe(
        map(() => undefined),
        tap(() => {
          // Remove from state
          const currentLogs = this.errorLogs();
          const updatedLogs = currentLogs.filter((log) => log.id !== id);
          this.updateState({
            errorLogs: updatedLogs,
            loading: false,
          });
        }),
        catchError((error) => this.handleError(error)),
        finalize(() => this.setLoading(false)),
      );
  }

  /**
   * Cleanup old error logs
   */
  cleanupLogs(query: CleanupQuery): Observable<{ deleted: number }> {
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
        tap(({ deleted }) => {
          console.log(`Deleted ${deleted} error logs`);
          this.updateState({ loading: false });
        }),
        catchError((error) => this.handleError(error)),
        finalize(() => this.setLoading(false)),
      );
  }

  /**
   * Export error logs (returns blob for download)
   */
  exportLogs(query?: ErrorLogsQuery): Observable<Blob> {
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
          let filename = 'error-logs.csv';
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
   * Refresh error logs
   */
  refresh(query?: ErrorLogsQuery): void {
    this.getErrorLogs(query).subscribe({
      next: () => console.log('Error logs refreshed'),
      error: (error) => console.error('Failed to refresh error logs:', error),
    });
  }

  // Private helper methods

  private updateState(partialState: Partial<ErrorLogsState>): void {
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

    console.error('Error Logs API Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
