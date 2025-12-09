import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Import types from the shared types file
import {
  BudgetRequestComment,
  CreateBudgetRequestCommentRequest,
  UpdateBudgetRequestCommentRequest,
  ListBudgetRequestCommentQuery,
  ApiResponse,
  BulkResponse,
  PaginatedResponse,
  ImportOptions,
  ValidateImportResponse,
  ExecuteImportRequest,
  ImportJob,
} from '../types/budget-request-comments.types';

@Injectable({
  providedIn: 'root',
})
export class BudgetRequestCommentService {
  private http = inject(HttpClient);
  private baseUrl = '/inventory/budget/budget-request-comments';

  // ===== SIGNALS FOR STATE MANAGEMENT =====

  private budgetRequestCommentsListSignal = signal<BudgetRequestComment[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  private permissionErrorSignal = signal<boolean>(false);
  private lastErrorStatusSignal = signal<number | null>(null);
  private selectedBudgetRequestCommentSignal =
    signal<BudgetRequestComment | null>(null);
  private currentPageSignal = signal<number>(1);
  private pageSizeSignal = signal<number>(10);
  private totalBudgetRequestCommentSignal = signal<number>(0);

  // ===== PUBLIC READONLY SIGNALS =====

  readonly budgetRequestCommentsList =
    this.budgetRequestCommentsListSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly permissionError = this.permissionErrorSignal.asReadonly();
  readonly lastErrorStatus = this.lastErrorStatusSignal.asReadonly();
  readonly selectedBudgetRequestComment =
    this.selectedBudgetRequestCommentSignal.asReadonly();
  readonly currentPage = this.currentPageSignal.asReadonly();
  readonly totalBudgetRequestComment =
    this.totalBudgetRequestCommentSignal.asReadonly();
  readonly pageSize = this.pageSizeSignal.asReadonly();

  // ===== COMPUTED SIGNALS =====

  readonly totalPages = computed(() => {
    const total = this.totalBudgetRequestCommentSignal();
    const size = this.pageSizeSignal();
    return Math.ceil(total / size);
  });

  readonly hasNextPage = computed(() => {
    return this.currentPageSignal() < this.totalPages();
  });

  readonly hasPreviousPage = computed(() => {
    return this.currentPageSignal() > 1;
  });

  // ===== ERROR HANDLING HELPER =====

  /**
   * Handle HTTP errors and set appropriate error signals
   * - 400 errors: Don't set error state (validation errors should show toast only)
   * - 403 errors: Set permission error for access denied
   * - 5xx errors: Set error state for server errors (show full page error)
   */
  private handleError(error: any, defaultMessage: string): void {
    const status = error?.status || null;
    this.lastErrorStatusSignal.set(status);

    // Check if error is 403 Forbidden
    if (status === 403) {
      this.permissionErrorSignal.set(true);
      this.errorSignal.set('You do not have permission to perform this action');
    } else if (
      status === 400 ||
      status === 404 ||
      status === 409 ||
      status === 422
    ) {
      // Client errors (validation, not found, conflict) - don't set error state
      // These should be handled by the component showing a toast
      this.permissionErrorSignal.set(false);
      // Don't set errorSignal - let component handle with toast
    } else {
      // Server errors (5xx) or unknown errors - show full page error
      this.permissionErrorSignal.set(false);
      this.errorSignal.set(error.message || defaultMessage);
    }
  }

  /**
   * Clear permission error state
   */
  clearPermissionError(): void {
    this.permissionErrorSignal.set(false);
    this.lastErrorStatusSignal.set(null);
  }

  // ===== STANDARD CRUD OPERATIONS =====

  /**
   * Load budgetRequestComments list with pagination and filters
   */
  async loadBudgetRequestCommentList(
    params?: ListBudgetRequestCommentQuery,
  ): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      // Build HTTP params
      let httpParams = new HttpParams();
      if (params?.page)
        httpParams = httpParams.set('page', params.page.toString());
      if (params?.limit)
        httpParams = httpParams.set('limit', params.limit.toString());
      if (params?.sort) httpParams = httpParams.set('sort', params.sort);

      // Handle fields array parameter (multiple values)
      if (params?.fields && params.fields.length > 0) {
        params.fields.forEach((field: string) => {
          httpParams = httpParams.append('fields', field);
        });
      }

      // Add smart filter parameters based on table schema
      // Numeric filtering for budget_request_id
      if (params?.budget_request_id !== undefined)
        httpParams = httpParams.set(
          'budget_request_id',
          params.budget_request_id.toString(),
        );
      if (params?.budget_request_id_min !== undefined)
        httpParams = httpParams.set(
          'budget_request_id_min',
          params.budget_request_id_min.toString(),
        );
      if (params?.budget_request_id_max !== undefined)
        httpParams = httpParams.set(
          'budget_request_id_max',
          params.budget_request_id_max.toString(),
        );
      // Numeric filtering for parent_id
      if (params?.parent_id !== undefined)
        httpParams = httpParams.set('parent_id', params.parent_id.toString());
      if (params?.parent_id_min !== undefined)
        httpParams = httpParams.set(
          'parent_id_min',
          params.parent_id_min.toString(),
        );
      if (params?.parent_id_max !== undefined)
        httpParams = httpParams.set(
          'parent_id_max',
          params.parent_id_max.toString(),
        );
      // String filtering for comment
      if (params?.comment)
        httpParams = httpParams.set('comment', params.comment);
      // String filtering for created_by
      if (params?.created_by)
        httpParams = httpParams.set('created_by', params.created_by);
      // Date/DateTime filtering for created_at
      if (params?.created_at)
        httpParams = httpParams.set('created_at', params.created_at);
      if (params?.created_at_min)
        httpParams = httpParams.set('created_at_min', params.created_at_min);
      if (params?.created_at_max)
        httpParams = httpParams.set('created_at_max', params.created_at_max);
      // Date/DateTime filtering for updated_at
      if (params?.updated_at)
        httpParams = httpParams.set('updated_at', params.updated_at);
      if (params?.updated_at_min)
        httpParams = httpParams.set('updated_at_min', params.updated_at_min);
      if (params?.updated_at_max)
        httpParams = httpParams.set('updated_at_max', params.updated_at_max);

      const response = await this.http
        .get<
          PaginatedResponse<BudgetRequestComment>
        >(this.baseUrl, { params: httpParams })
        .toPromise();

      if (response) {
        this.budgetRequestCommentsListSignal.set(response.data);

        if (response.pagination) {
          this.totalBudgetRequestCommentSignal.set(response.pagination.total);
          this.currentPageSignal.set(response.pagination.page);
          this.pageSizeSignal.set(response.pagination.limit);
        }
      }
    } catch (error: any) {
      this.handleError(error, 'Failed to load budgetRequestComments list');
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Load single budgetRequestComments by ID
   */
  async loadBudgetRequestCommentById(
    id: number,
  ): Promise<BudgetRequestComment | null> {
    this.loadingSignal.set(true);

    try {
      const response = await this.http
        .get<ApiResponse<BudgetRequestComment>>(`${this.baseUrl}/${id}`)
        .toPromise();

      if (response) {
        this.selectedBudgetRequestCommentSignal.set(response.data);
        return response.data;
      }
      return null;
    } catch (error: any) {
      this.handleError(error, 'Failed to load budgetRequestComments');
      return null;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Create new budgetRequestComments
   */
  async createBudgetRequestComment(
    data: CreateBudgetRequestCommentRequest,
  ): Promise<BudgetRequestComment | null> {
    this.loadingSignal.set(true);

    try {
      const response = await this.http
        .post<ApiResponse<BudgetRequestComment>>(`${this.baseUrl}`, data)
        .toPromise();

      if (response) {
        // ✅ Return data without optimistic update
        // List component will refresh via reloadTrigger
        return response.data;
      }
      return null;
    } catch (error: any) {
      this.handleError(error, 'Failed to create budgetRequestComments');
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Update existing budgetRequestComments
   */
  async updateBudgetRequestComment(
    id: number,
    data: UpdateBudgetRequestCommentRequest,
  ): Promise<BudgetRequestComment | null> {
    this.loadingSignal.set(true);

    try {
      const response = await this.http
        .put<ApiResponse<BudgetRequestComment>>(`${this.baseUrl}/${id}`, data)
        .toPromise();

      if (response) {
        // ✅ Return data without optimistic update
        // List component will refresh via reloadTrigger
        return response.data;
      }
      return null;
    } catch (error: any) {
      this.handleError(error, 'Failed to update budgetRequestComments');
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Delete budgetRequestComments by ID
   */
  async deleteBudgetRequestComment(id: number): Promise<boolean> {
    this.loadingSignal.set(true);

    try {
      const response = await this.http
        .delete<ApiResponse<{ id: string }>>(`${this.baseUrl}/${id}`)
        .toPromise();

      if (response?.success) {
        // ✅ Return success without optimistic update
        // List component will refresh via reloadTrigger
        return true;
      }
      return false;
    } catch (error: any) {
      this.handleError(error, 'Failed to delete budgetRequestComments');
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  // ===== ENHANCED OPERATIONS (BULK & DROPDOWN) =====

  /**
   * Get dropdown options for budgetRequestComments
   */
  async getDropdownOptions(
    params: { search?: string; limit?: number } = {},
  ): Promise<Array<{ value: string; label: string }>> {
    try {
      let httpParams = new HttpParams();
      if (params.search) httpParams = httpParams.set('search', params.search);
      if (params.limit)
        httpParams = httpParams.set('limit', params.limit.toString());

      const response = await this.http
        .get<
          ApiResponse<{
            options: Array<{ value: string; label: string }>;
            total: number;
          }>
        >(`${this.baseUrl}/dropdown`, { params: httpParams })
        .toPromise();

      if (response?.success && response.data?.options) {
        return response.data.options;
      }
      return [];
    } catch (error: any) {
      console.error(
        'Failed to fetch budgetRequestComments dropdown options:',
        error,
      );
      return [];
    }
  }

  /**
   * Get budget_requests dropdown options for budget_request_id field
   */
  async getBudgetRequestsDropdown(
    params: { search?: string; limit?: number } = {},
  ): Promise<Array<{ value: string; label: string; disabled?: boolean }>> {
    try {
      let httpParams = new HttpParams();
      if (params.search) httpParams = httpParams.set('search', params.search);
      if (params.limit)
        httpParams = httpParams.set('limit', params.limit.toString());

      const response = await this.http
        .get<
          ApiResponse<{
            options: Array<{
              value: string;
              label: string;
              disabled?: boolean;
            }>;
            total: number;
          }>
        >('/budget_requests/dropdown', { params: httpParams })
        .toPromise();

      if (response?.success && response.data?.options) {
        return response.data.options;
      }
      return [];
    } catch (error: any) {
      console.error('Failed to fetch budget_requests dropdown options:', error);
      return [];
    }
  }

  /**
   * Get budget_request_comments dropdown options for parent_id field
   */
  async getBudgetRequestCommentsDropdown(
    params: { search?: string; limit?: number } = {},
  ): Promise<Array<{ value: string; label: string; disabled?: boolean }>> {
    try {
      let httpParams = new HttpParams();
      if (params.search) httpParams = httpParams.set('search', params.search);
      if (params.limit)
        httpParams = httpParams.set('limit', params.limit.toString());

      const response = await this.http
        .get<
          ApiResponse<{
            options: Array<{
              value: string;
              label: string;
              disabled?: boolean;
            }>;
            total: number;
          }>
        >('/budget_request_comments/dropdown', { params: httpParams })
        .toPromise();

      if (response?.success && response.data?.options) {
        return response.data.options;
      }
      return [];
    } catch (error: any) {
      console.error(
        'Failed to fetch budget_request_comments dropdown options:',
        error,
      );
      return [];
    }
  }

  /**
   * Bulk create budgetRequestCommentss
   */
  async bulkCreateBudgetRequestComment(
    items: CreateBudgetRequestCommentRequest[],
  ): Promise<BulkResponse | null> {
    this.loadingSignal.set(true);

    try {
      const response = await this.http
        .post<BulkResponse>(`${this.baseUrl}/bulk`, { items })
        .toPromise();

      if (response) {
        // Refresh list after bulk operation
        await this.loadBudgetRequestCommentList();
        return response;
      }
      return null;
    } catch (error: any) {
      this.handleError(error, 'Failed to bulk create budgetRequestCommentss');
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Bulk update budgetRequestCommentss
   */
  async bulkUpdateBudgetRequestComment(
    items: Array<{ id: number; data: UpdateBudgetRequestCommentRequest }>,
  ): Promise<BulkResponse | null> {
    this.loadingSignal.set(true);

    try {
      const response = await this.http
        .put<BulkResponse>(`${this.baseUrl}/bulk`, { items })
        .toPromise();

      if (response) {
        // Refresh list after bulk operation
        await this.loadBudgetRequestCommentList();
        return response;
      }
      return null;
    } catch (error: any) {
      this.handleError(error, 'Failed to bulk update budgetRequestCommentss');
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Bulk delete budgetRequestCommentss
   */
  async bulkDeleteBudgetRequestComment(
    ids: number[],
  ): Promise<BulkResponse | null> {
    this.loadingSignal.set(true);

    try {
      const response = await this.http
        .delete<BulkResponse>(`${this.baseUrl}/bulk`, { body: { ids } })
        .toPromise();

      if (response) {
        // Refresh list after bulk operation
        await this.loadBudgetRequestCommentList();
        return response;
      }
      return null;
    } catch (error: any) {
      this.handleError(error, 'Failed to bulk delete budgetRequestCommentss');
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  // ===== BULK IMPORT OPERATIONS =====

  /**
   * Download import template
   */
  downloadImportTemplate(
    format: 'csv' | 'excel' = 'excel',
    includeExample: boolean = true,
  ): Observable<Blob> {
    const httpParams = new HttpParams()
      .set('format', format)
      .set('includeExample', includeExample.toString());

    return this.http.get(`${this.baseUrl}/import/template`, {
      params: httpParams,
      responseType: 'blob',
    });
  }

  /**
   * Validate import file
   */
  async validateImportFile(
    file: File,
    options?: ImportOptions,
  ): Promise<ApiResponse<ValidateImportResponse> | null> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      if (options) {
        formData.append('options', JSON.stringify(options));
      }

      const response = await this.http
        .post<
          ApiResponse<ValidateImportResponse>
        >(`${this.baseUrl}/import/validate`, formData)
        .toPromise();

      return response || null;
    } catch (error: any) {
      this.handleError(error, 'Failed to validate import file');
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Execute import with validated session
   */
  async executeImport(
    sessionId: string,
    options?: ImportOptions,
  ): Promise<ApiResponse<ImportJob> | null> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const requestBody: ExecuteImportRequest = {
        sessionId,
        options,
      };

      const response = await this.http
        .post<
          ApiResponse<ImportJob>
        >(`${this.baseUrl}/import/execute`, requestBody)
        .toPromise();

      return response || null;
    } catch (error: any) {
      this.handleError(error, 'Failed to execute import');
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Get import job status
   */
  async getImportStatus(jobId: string): Promise<ApiResponse<ImportJob> | null> {
    try {
      const response = await this.http
        .get<ApiResponse<ImportJob>>(`${this.baseUrl}/import/status/${jobId}`)
        .toPromise();

      return response || null;
    } catch (error: any) {
      console.error('Failed to get import status:', error);
      throw error;
    }
  }

  // ===== UTILITY METHODS =====

  /**
   * Set current page
   */
  setCurrentPage(page: number): void {
    this.currentPageSignal.set(page);
  }

  /**
   * Set page size and reset to first page
   */
  setPageSize(size: number): void {
    this.pageSizeSignal.set(size);
    this.currentPageSignal.set(1);
  }

  /**
   * Select budgetRequestComments
   */
  selectBudgetRequestComment(
    budgetRequestComments: BudgetRequestComment | null,
  ): void {
    this.selectedBudgetRequestCommentSignal.set(budgetRequestComments);
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this.errorSignal.set(null);
    this.clearPermissionError();
  }

  /**
   * Reset service state
   */
  reset(): void {
    this.budgetRequestCommentsListSignal.set([]);
    this.selectedBudgetRequestCommentSignal.set(null);
    this.currentPageSignal.set(1);
    this.errorSignal.set(null);
    this.clearPermissionError();
    this.totalBudgetRequestCommentSignal.set(0);
  }
}
