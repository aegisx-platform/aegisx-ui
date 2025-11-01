import { Injectable, signal, inject } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap, finalize } from 'rxjs/operators';
import {
  FileAuditLog,
  FileAuditQuery,
  FileAuditStats,
  CleanupQuery,
  FileAuditState,
  FileAuditResponse,
  FileAuditLogResponse,
  FileAuditStatsResponse,
  CleanupResponse,
  ApiErrorResponse,
} from '../models/audit.types';

/**
 * File Audit Service
 *
 * Provides methods to manage and view file audit logs including:
 * - Query file audit logs with filters
 * - Get file audit statistics
 * - Delete file audit logs
 * - Cleanup old file audit logs
 * - Export file audit logs
 */
@Injectable({
  providedIn: 'root',
})
export class FileAuditService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/file-audit';

  // Signal-based state management
  private _state = signal<FileAuditState>({
    fileAuditLogs: [],
    stats: null,
    loading: false,
    error: null,
    pagination: null,
  });

  // Read-only state signals
  readonly state = this._state.asReadonly();
  readonly fileAuditLogs = () => this._state().fileAuditLogs;
  readonly stats = () => this._state().stats;
  readonly loading = () => this._state().loading;
  readonly error = () => this._state().error;
  readonly pagination = () => this._state().pagination;

  /**
   * Get file audit logs with optional filters
   */
  getFileAuditLogs(query?: FileAuditQuery): Observable<{
    data: FileAuditLog[];
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

    return this.http.get<FileAuditResponse>(`${this.baseUrl}`, { params }).pipe(
      map((response) => ({
        data: response.data,
        pagination: response.pagination,
      })),
      tap(({ data, pagination }) => {
        this.updateState({
          fileAuditLogs: data,
          pagination: pagination || null,
          loading: false,
        });
      }),
      catchError((error) => this.handleError(error)),
      finalize(() => this.setLoading(false)),
    );
  }

  /**
   * Get file audit statistics
   */
  getStats(): Observable<FileAuditStats> {
    this.setLoading(true);
    this.clearError();

    return this.http.get<FileAuditStatsResponse>(`${this.baseUrl}/stats`).pipe(
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
   * Get a single file audit log by ID
   */
  getFileAuditLog(id: string): Observable<FileAuditLog> {
    this.setLoading(true);
    this.clearError();

    return this.http.get<FileAuditLogResponse>(`${this.baseUrl}/${id}`).pipe(
      map((response) => response.data),
      catchError((error) => this.handleError(error)),
      finalize(() => this.setLoading(false)),
    );
  }

  /**
   * Delete a single file audit log
   */
  deleteFileAuditLog(id: string): Observable<void> {
    this.setLoading(true);
    this.clearError();

    return this.http
      .delete<{ success: true; message: string }>(`${this.baseUrl}/${id}`)
      .pipe(
        map(() => undefined),
        tap(() => {
          // Remove from state
          const currentLogs = this.fileAuditLogs();
          const updatedLogs = currentLogs.filter((log) => log.id !== id);
          this.updateState({
            fileAuditLogs: updatedLogs,
            loading: false,
          });
        }),
        catchError((error) => this.handleError(error)),
        finalize(() => this.setLoading(false)),
      );
  }

  /**
   * Cleanup old file audit logs
   */
  cleanupLogs(query: CleanupQuery): Observable<{ deletedCount: number }> {
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
          console.log(`Deleted ${deletedCount} file audit logs`);
          this.updateState({ loading: false });
        }),
        catchError((error) => this.handleError(error)),
        finalize(() => this.setLoading(false)),
      );
  }

  /**
   * Export file audit logs (returns blob for download)
   */
  exportLogs(query?: FileAuditQuery): Observable<Blob> {
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
          let filename = 'file-audit.csv';
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
   * Refresh file audit logs
   */
  refresh(query?: FileAuditQuery): void {
    this.getFileAuditLogs(query).subscribe({
      next: () => console.log('File audit logs refreshed'),
      error: (error) =>
        console.error('Failed to refresh file audit logs:', error),
    });
  }

  // Private helper methods

  private updateState(partialState: Partial<FileAuditState>): void {
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

    console.error('File Audit API Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
