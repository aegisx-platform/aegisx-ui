import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Import types from the shared types file
import {
  BudgetAllocation,
  CreateBudgetAllocationRequest,
  UpdateBudgetAllocationRequest,
  ListBudgetAllocationQuery,
  ApiResponse,
  BulkResponse,
  PaginatedResponse,
  ImportOptions,
  ValidateImportResponse,
  ExecuteImportRequest,
  ImportJob,
} from '../types/budget-allocations.types';

@Injectable({
  providedIn: 'root',
})
export class BudgetAllocationService {
  private http = inject(HttpClient);
  private baseUrl = '/inventory/operations/budget-allocations';

  // ===== SIGNALS FOR STATE MANAGEMENT =====

  private budgetAllocationsListSignal = signal<BudgetAllocation[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  private permissionErrorSignal = signal<boolean>(false);
  private lastErrorStatusSignal = signal<number | null>(null);
  private selectedBudgetAllocationSignal = signal<BudgetAllocation | null>(
    null,
  );
  private currentPageSignal = signal<number>(1);
  private pageSizeSignal = signal<number>(10);
  private totalBudgetAllocationSignal = signal<number>(0);

  // ===== PUBLIC READONLY SIGNALS =====

  readonly budgetAllocationsList =
    this.budgetAllocationsListSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly permissionError = this.permissionErrorSignal.asReadonly();
  readonly lastErrorStatus = this.lastErrorStatusSignal.asReadonly();
  readonly selectedBudgetAllocation =
    this.selectedBudgetAllocationSignal.asReadonly();
  readonly currentPage = this.currentPageSignal.asReadonly();
  readonly totalBudgetAllocation =
    this.totalBudgetAllocationSignal.asReadonly();
  readonly pageSize = this.pageSizeSignal.asReadonly();

  // ===== COMPUTED SIGNALS =====

  readonly totalPages = computed(() => {
    const total = this.totalBudgetAllocationSignal();
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
   * Load budgetAllocations list with pagination and filters
   */
  async loadBudgetAllocationList(
    params?: ListBudgetAllocationQuery,
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
      // Numeric filtering for fiscal_year
      if (params?.fiscal_year !== undefined)
        httpParams = httpParams.set(
          'fiscal_year',
          params.fiscal_year.toString(),
        );
      if (params?.fiscal_year_min !== undefined)
        httpParams = httpParams.set(
          'fiscal_year_min',
          params.fiscal_year_min.toString(),
        );
      if (params?.fiscal_year_max !== undefined)
        httpParams = httpParams.set(
          'fiscal_year_max',
          params.fiscal_year_max.toString(),
        );
      // Numeric filtering for budget_id
      if (params?.budget_id !== undefined)
        httpParams = httpParams.set('budget_id', params.budget_id.toString());
      if (params?.budget_id_min !== undefined)
        httpParams = httpParams.set(
          'budget_id_min',
          params.budget_id_min.toString(),
        );
      if (params?.budget_id_max !== undefined)
        httpParams = httpParams.set(
          'budget_id_max',
          params.budget_id_max.toString(),
        );
      // Numeric filtering for department_id
      if (params?.department_id !== undefined)
        httpParams = httpParams.set(
          'department_id',
          params.department_id.toString(),
        );
      if (params?.department_id_min !== undefined)
        httpParams = httpParams.set(
          'department_id_min',
          params.department_id_min.toString(),
        );
      if (params?.department_id_max !== undefined)
        httpParams = httpParams.set(
          'department_id_max',
          params.department_id_max.toString(),
        );
      // Numeric filtering for total_budget
      if (params?.total_budget !== undefined)
        httpParams = httpParams.set(
          'total_budget',
          params.total_budget.toString(),
        );
      if (params?.total_budget_min !== undefined)
        httpParams = httpParams.set(
          'total_budget_min',
          params.total_budget_min.toString(),
        );
      if (params?.total_budget_max !== undefined)
        httpParams = httpParams.set(
          'total_budget_max',
          params.total_budget_max.toString(),
        );
      // Numeric filtering for q1_budget
      if (params?.q1_budget !== undefined)
        httpParams = httpParams.set('q1_budget', params.q1_budget.toString());
      if (params?.q1_budget_min !== undefined)
        httpParams = httpParams.set(
          'q1_budget_min',
          params.q1_budget_min.toString(),
        );
      if (params?.q1_budget_max !== undefined)
        httpParams = httpParams.set(
          'q1_budget_max',
          params.q1_budget_max.toString(),
        );
      // Numeric filtering for q2_budget
      if (params?.q2_budget !== undefined)
        httpParams = httpParams.set('q2_budget', params.q2_budget.toString());
      if (params?.q2_budget_min !== undefined)
        httpParams = httpParams.set(
          'q2_budget_min',
          params.q2_budget_min.toString(),
        );
      if (params?.q2_budget_max !== undefined)
        httpParams = httpParams.set(
          'q2_budget_max',
          params.q2_budget_max.toString(),
        );
      // Numeric filtering for q3_budget
      if (params?.q3_budget !== undefined)
        httpParams = httpParams.set('q3_budget', params.q3_budget.toString());
      if (params?.q3_budget_min !== undefined)
        httpParams = httpParams.set(
          'q3_budget_min',
          params.q3_budget_min.toString(),
        );
      if (params?.q3_budget_max !== undefined)
        httpParams = httpParams.set(
          'q3_budget_max',
          params.q3_budget_max.toString(),
        );
      // Numeric filtering for q4_budget
      if (params?.q4_budget !== undefined)
        httpParams = httpParams.set('q4_budget', params.q4_budget.toString());
      if (params?.q4_budget_min !== undefined)
        httpParams = httpParams.set(
          'q4_budget_min',
          params.q4_budget_min.toString(),
        );
      if (params?.q4_budget_max !== undefined)
        httpParams = httpParams.set(
          'q4_budget_max',
          params.q4_budget_max.toString(),
        );
      // Numeric filtering for q1_spent
      if (params?.q1_spent !== undefined)
        httpParams = httpParams.set('q1_spent', params.q1_spent.toString());
      if (params?.q1_spent_min !== undefined)
        httpParams = httpParams.set(
          'q1_spent_min',
          params.q1_spent_min.toString(),
        );
      if (params?.q1_spent_max !== undefined)
        httpParams = httpParams.set(
          'q1_spent_max',
          params.q1_spent_max.toString(),
        );
      // Numeric filtering for q2_spent
      if (params?.q2_spent !== undefined)
        httpParams = httpParams.set('q2_spent', params.q2_spent.toString());
      if (params?.q2_spent_min !== undefined)
        httpParams = httpParams.set(
          'q2_spent_min',
          params.q2_spent_min.toString(),
        );
      if (params?.q2_spent_max !== undefined)
        httpParams = httpParams.set(
          'q2_spent_max',
          params.q2_spent_max.toString(),
        );
      // Numeric filtering for q3_spent
      if (params?.q3_spent !== undefined)
        httpParams = httpParams.set('q3_spent', params.q3_spent.toString());
      if (params?.q3_spent_min !== undefined)
        httpParams = httpParams.set(
          'q3_spent_min',
          params.q3_spent_min.toString(),
        );
      if (params?.q3_spent_max !== undefined)
        httpParams = httpParams.set(
          'q3_spent_max',
          params.q3_spent_max.toString(),
        );
      // Numeric filtering for q4_spent
      if (params?.q4_spent !== undefined)
        httpParams = httpParams.set('q4_spent', params.q4_spent.toString());
      if (params?.q4_spent_min !== undefined)
        httpParams = httpParams.set(
          'q4_spent_min',
          params.q4_spent_min.toString(),
        );
      if (params?.q4_spent_max !== undefined)
        httpParams = httpParams.set(
          'q4_spent_max',
          params.q4_spent_max.toString(),
        );
      // Numeric filtering for total_spent
      if (params?.total_spent !== undefined)
        httpParams = httpParams.set(
          'total_spent',
          params.total_spent.toString(),
        );
      if (params?.total_spent_min !== undefined)
        httpParams = httpParams.set(
          'total_spent_min',
          params.total_spent_min.toString(),
        );
      if (params?.total_spent_max !== undefined)
        httpParams = httpParams.set(
          'total_spent_max',
          params.total_spent_max.toString(),
        );
      // Numeric filtering for remaining_budget
      if (params?.remaining_budget !== undefined)
        httpParams = httpParams.set(
          'remaining_budget',
          params.remaining_budget.toString(),
        );
      if (params?.remaining_budget_min !== undefined)
        httpParams = httpParams.set(
          'remaining_budget_min',
          params.remaining_budget_min.toString(),
        );
      if (params?.remaining_budget_max !== undefined)
        httpParams = httpParams.set(
          'remaining_budget_max',
          params.remaining_budget_max.toString(),
        );
      // Boolean filtering for is_active
      if (params?.is_active !== undefined)
        httpParams = httpParams.set('is_active', params.is_active.toString());
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
          PaginatedResponse<BudgetAllocation>
        >(this.baseUrl, { params: httpParams })
        .toPromise();

      if (response) {
        this.budgetAllocationsListSignal.set(response.data);

        if (response.pagination) {
          this.totalBudgetAllocationSignal.set(response.pagination.total);
          this.currentPageSignal.set(response.pagination.page);
          this.pageSizeSignal.set(response.pagination.limit);
        }
      }
    } catch (error: any) {
      this.handleError(error, 'Failed to load budgetAllocations list');
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Load single budgetAllocations by ID
   */
  async loadBudgetAllocationById(id: number): Promise<BudgetAllocation | null> {
    this.loadingSignal.set(true);

    try {
      const response = await this.http
        .get<ApiResponse<BudgetAllocation>>(`${this.baseUrl}/${id}`)
        .toPromise();

      if (response) {
        this.selectedBudgetAllocationSignal.set(response.data);
        return response.data;
      }
      return null;
    } catch (error: any) {
      this.handleError(error, 'Failed to load budgetAllocations');
      return null;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Create new budgetAllocations
   */
  async createBudgetAllocation(
    data: CreateBudgetAllocationRequest,
  ): Promise<BudgetAllocation | null> {
    this.loadingSignal.set(true);

    try {
      const response = await this.http
        .post<ApiResponse<BudgetAllocation>>(`${this.baseUrl}`, data)
        .toPromise();

      if (response) {
        // ✅ Return data without optimistic update
        // List component will refresh via reloadTrigger
        return response.data;
      }
      return null;
    } catch (error: any) {
      this.handleError(error, 'Failed to create budgetAllocations');
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Update existing budgetAllocations
   */
  async updateBudgetAllocation(
    id: number,
    data: UpdateBudgetAllocationRequest,
  ): Promise<BudgetAllocation | null> {
    this.loadingSignal.set(true);

    try {
      const response = await this.http
        .put<ApiResponse<BudgetAllocation>>(`${this.baseUrl}/${id}`, data)
        .toPromise();

      if (response) {
        // ✅ Return data without optimistic update
        // List component will refresh via reloadTrigger
        return response.data;
      }
      return null;
    } catch (error: any) {
      this.handleError(error, 'Failed to update budgetAllocations');
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Delete budgetAllocations by ID
   */
  async deleteBudgetAllocation(id: number): Promise<boolean> {
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
      this.handleError(error, 'Failed to delete budgetAllocations');
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  // ===== EXPORT OPERATIONS =====

  /**
   * Export budgetAllocations data
   */
  async exportBudgetAllocation(options: {
    format: 'csv' | 'excel' | 'pdf';
    ids?: number[];
    filters?: Record<string, any>;
    fields?: string[];
    filename?: string;
    applyFilters?: boolean;
    includeMetadata?: boolean;
  }): Promise<Blob> {
    try {
      let httpParams = new HttpParams().set('format', options.format);

      if (options.ids && options.ids.length > 0) {
        options.ids.forEach((id) => {
          httpParams = httpParams.append('ids', id);
        });
      }

      if (options.filters && options.applyFilters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            httpParams = httpParams.set(`filters[${key}]`, String(value));
          }
        });
      }

      if (options.fields && options.fields.length > 0) {
        options.fields.forEach((field) => {
          httpParams = httpParams.append('fields', field);
        });
      }

      if (options.filename) {
        httpParams = httpParams.set('filename', options.filename);
      }

      if (options.applyFilters !== undefined) {
        httpParams = httpParams.set(
          'applyFilters',
          String(options.applyFilters),
        );
      }

      if (options.includeMetadata !== undefined) {
        httpParams = httpParams.set(
          'includeMetadata',
          String(options.includeMetadata),
        );
      }

      const response = await this.http
        .get(`${this.baseUrl}/export`, {
          params: httpParams,
          responseType: 'blob',
        })
        .toPromise();

      if (response) {
        return response;
      }

      throw new Error('Export failed - no response received');
    } catch (error: any) {
      console.error('Failed to export budgetAllocations data:', error);
      throw error;
    }
  }

  // ===== ENHANCED OPERATIONS (BULK & DROPDOWN) =====

  /**
   * Get dropdown options for budgetAllocations
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
        'Failed to fetch budgetAllocations dropdown options:',
        error,
      );
      return [];
    }
  }

  /**
   * Get budgets dropdown options for budget_id field
   */
  async getBudgetsDropdown(
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
        >('/budgets/dropdown', { params: httpParams })
        .toPromise();

      if (response?.success && response.data?.options) {
        return response.data.options;
      }
      return [];
    } catch (error: any) {
      console.error('Failed to fetch budgets dropdown options:', error);
      return [];
    }
  }

  /**
   * Get departments dropdown options for department_id field
   */
  async getDepartmentsDropdown(
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
        >('/departments/dropdown', { params: httpParams })
        .toPromise();

      if (response?.success && response.data?.options) {
        return response.data.options;
      }
      return [];
    } catch (error: any) {
      console.error('Failed to fetch departments dropdown options:', error);
      return [];
    }
  }

  /**
   * Bulk create budgetAllocationss
   */
  async bulkCreateBudgetAllocation(
    items: CreateBudgetAllocationRequest[],
  ): Promise<BulkResponse | null> {
    this.loadingSignal.set(true);

    try {
      const response = await this.http
        .post<BulkResponse>(`${this.baseUrl}/bulk`, { items })
        .toPromise();

      if (response) {
        // Refresh list after bulk operation
        await this.loadBudgetAllocationList();
        return response;
      }
      return null;
    } catch (error: any) {
      this.handleError(error, 'Failed to bulk create budgetAllocationss');
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Bulk update budgetAllocationss
   */
  async bulkUpdateBudgetAllocation(
    items: Array<{ id: number; data: UpdateBudgetAllocationRequest }>,
  ): Promise<BulkResponse | null> {
    this.loadingSignal.set(true);

    try {
      const response = await this.http
        .put<BulkResponse>(`${this.baseUrl}/bulk`, { items })
        .toPromise();

      if (response) {
        // Refresh list after bulk operation
        await this.loadBudgetAllocationList();
        return response;
      }
      return null;
    } catch (error: any) {
      this.handleError(error, 'Failed to bulk update budgetAllocationss');
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Bulk delete budgetAllocationss
   */
  async bulkDeleteBudgetAllocation(
    ids: number[],
  ): Promise<BulkResponse | null> {
    this.loadingSignal.set(true);

    try {
      const response = await this.http
        .delete<BulkResponse>(`${this.baseUrl}/bulk`, { body: { ids } })
        .toPromise();

      if (response) {
        // Refresh list after bulk operation
        await this.loadBudgetAllocationList();
        return response;
      }
      return null;
    } catch (error: any) {
      this.handleError(error, 'Failed to bulk delete budgetAllocationss');
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  // ===== ADVANCED OPERATIONS (FULL PACKAGE) =====

  /**
   * Validate budgetAllocations data before save
   */
  async validateBudgetAllocation(
    data: CreateBudgetAllocationRequest,
  ): Promise<{ valid: boolean; errors?: any[] }> {
    try {
      const response = await this.http
        .post<
          ApiResponse<{ valid: boolean; errors?: any[] }>
        >(`${this.baseUrl}/validate`, { data })
        .toPromise();

      if (response) {
        return response.data;
      }
      return { valid: false, errors: ['Validation failed'] };
    } catch (error: any) {
      console.error('Failed to validate budgetAllocations:', error);
      return { valid: false, errors: [error.message || 'Validation error'] };
    }
  }

  /**
   * Check field uniqueness
   */
  async checkUniqueness(
    field: string,
    value: string,
    excludeId?: number,
  ): Promise<{ unique: boolean }> {
    try {
      let params = new HttpParams().set('value', value);

      if (excludeId) {
        params = params.set('excludeId', excludeId);
      }

      const response = await this.http
        .get<
          ApiResponse<{ unique: boolean }>
        >(`${this.baseUrl}/check/${field}`, { params })
        .toPromise();

      if (response) {
        return response.data;
      }
      return { unique: false };
    } catch (error: any) {
      console.error('Failed to check uniqueness:', error);
      return { unique: false };
    }
  }

  /**
   * Get budgetAllocations statistics
   */
  async getStats(): Promise<{ total: number } | null> {
    try {
      const response = await this.http
        .get<ApiResponse<{ total: number }>>(`${this.baseUrl}/stats`)
        .toPromise();

      if (response) {
        return response.data;
      }
      return null;
    } catch (error: any) {
      console.error('Failed to get budgetAllocations stats:', error);
      return null;
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
   * Select budgetAllocations
   */
  selectBudgetAllocation(budgetAllocations: BudgetAllocation | null): void {
    this.selectedBudgetAllocationSignal.set(budgetAllocations);
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
    this.budgetAllocationsListSignal.set([]);
    this.selectedBudgetAllocationSignal.set(null);
    this.currentPageSignal.set(1);
    this.errorSignal.set(null);
    this.clearPermissionError();
    this.totalBudgetAllocationSignal.set(0);
  }
}
