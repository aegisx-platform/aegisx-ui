import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, BehaviorSubject, map, tap, filter } from 'rxjs';

/**
 * Upload context types - determines how files are organized and accessed
 */
export type UploadContext =
  | { type: 'user'; userId?: string } // User-specific files
  | { type: 'patient'; patientId: string } // HIS: Patient medical records
  | { type: 'product'; productId: string } // Inventory: Product images
  | { type: 'order'; orderId: string } // Inventory: Order documents
  | { type: 'system' }; // System-wide files (no owner)

/**
 * File category (matches backend categories)
 */
export type FileCategory =
  | 'image'
  | 'document'
  | 'media'
  | 'general'
  | 'his-patient'
  | 'his-medical'
  | 'his-lab'
  | 'his-pharmacy'
  | 'his-radiology'
  | 'inventory-product'
  | 'inventory-supplier'
  | 'inventory-order';

/**
 * Upload options for FileManager
 */
export interface FileManagerUploadOptions {
  category: FileCategory;
  context?: UploadContext;
  isPublic?: boolean;
  isTemporary?: boolean;
  expiresIn?: number; // Hours
  allowDuplicates?: boolean;
  metadata?: Record<string, any>;
}

/**
 * List files options
 */
export interface FileManagerListOptions {
  context?: UploadContext;
  category?: FileCategory;
  isPublic?: boolean;
  isTemporary?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * Upload progress event
 */
export interface UploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  response?: any;
  error?: string;
}

/**
 * File metadata response from API
 */
export interface FileMetadata {
  id: string;
  originalName: string;
  filename: string;
  filepath: string;
  mimeType: string;
  fileSize: number;
  fileCategory: string;
  uploadedBy?: string;
  isPublic: boolean;
  isTemporary: boolean;
  metadata?: Record<string, any>;
  signedUrls?: {
    view: string;
    download: string;
    thumbnail?: string;
    expiresAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Central File Manager Service
 *
 * Purpose: Provide a unified, context-aware file upload/management system
 * that works across different modules (User files, HIS, Inventory, etc.)
 *
 * Key Features:
 * - Optional authentication (works with or without user login)
 * - Context-aware (associates files with user, patient, product, etc.)
 * - Category-based organization
 * - Reusable across all modules
 * - Progress tracking
 *
 * Usage Examples:
 *
 * // User profile photo (user-bound)
 * fileManager.upload(file, {
 *   category: 'image',
 *   context: { type: 'user', userId: currentUser.id }
 * });
 *
 * // Patient medical record (HIS module)
 * fileManager.upload(file, {
 *   category: 'his-medical',
 *   context: { type: 'patient', patientId: 'PT123' },
 *   metadata: { recordType: 'lab_result' }
 * });
 *
 * // Product image (Inventory module)
 * fileManager.upload(file, {
 *   category: 'inventory-product',
 *   context: { type: 'product', productId: 'PROD456' }
 * });
 *
 * // System-wide file (no owner)
 * fileManager.upload(file, {
 *   category: 'document',
 *   context: { type: 'system' },
 *   isPublic: true
 * });
 */
@Injectable({
  providedIn: 'root',
})
export class FileManagerService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/files'; // Interceptor adds /api prefix → /api/files

  // Upload progress tracking
  private uploadProgressSubject = new BehaviorSubject<
    Map<string, UploadProgress>
  >(new Map());
  uploadProgress$ = this.uploadProgressSubject.asObservable();

  // Statistics signal
  stats = signal<{
    totalFiles: number;
    totalSize: number;
    uploading: number;
  }>({
    totalFiles: 0,
    totalSize: 0,
    uploading: 0,
  });

  /**
   * Upload a single file with context
   */
  upload(
    file: File,
    options: FileManagerUploadOptions,
  ): Observable<FileMetadata> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', options.category);

    // Add context to metadata
    const metadata = {
      ...options.metadata,
      ...(options.context && this.contextToMetadata(options.context)),
    };

    if (options.isPublic !== undefined) {
      formData.append('isPublic', options.isPublic.toString());
    }
    if (options.isTemporary !== undefined) {
      formData.append('isTemporary', options.isTemporary.toString());
    }
    if (options.expiresIn) {
      formData.append('expiresIn', options.expiresIn.toString());
    }
    if (options.allowDuplicates !== undefined) {
      formData.append('allowDuplicates', options.allowDuplicates.toString());
    }
    if (metadata && Object.keys(metadata).length > 0) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    // Track upload progress
    const fileId = this.generateFileId(file);
    this.updateProgress(fileId, {
      file,
      progress: 0,
      status: 'uploading',
    });

    return this.http
      .post<{ success: boolean; data: FileMetadata }>(
        `${this.apiUrl}/upload`,
        formData,
        {
          reportProgress: true,
          observe: 'events',
        },
      )
      .pipe(
        tap((event: HttpEvent<any>) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            const progress = Math.round((100 * event.loaded) / event.total);
            this.updateProgress(fileId, {
              file,
              progress,
              status: 'uploading',
            });
          }
        }),
        filter(
          (event: HttpEvent<any>) => event.type === HttpEventType.Response,
        ),
        map((event: any) => {
          this.updateProgress(fileId, {
            file,
            progress: 100,
            status: 'completed',
            response: event.body.data,
          });
          return event.body.data;
        }),
      );
  }

  /**
   * Upload multiple files with context (parallel upload)
   */
  uploadMultiple(
    files: File[],
    options: FileManagerUploadOptions,
  ): Observable<FileMetadata[]> {
    const uploads = files.map((file) => this.upload(file, options));
    return new Observable((observer) => {
      const results: FileMetadata[] = [];
      let completed = 0;

      uploads.forEach((upload) => {
        upload.subscribe({
          next: (result) => {
            results.push(result);
            completed++;
            if (completed === files.length) {
              observer.next(results);
              observer.complete();
            }
          },
          error: (error) => observer.error(error),
        });
      });
    });
  }

  /**
   * List files with optional context filtering
   */
  list(options: FileManagerListOptions = {}): Observable<{
    data: FileMetadata[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  }> {
    const params: any = {
      page: options.page || 1,
      limit: options.limit || 20,
      sort: options.sort || 'created_at',
      order: options.order || 'desc',
    };

    if (options.category) params.category = options.category;
    if (options.isPublic !== undefined) params.isPublic = options.isPublic;
    if (options.isTemporary !== undefined)
      params.isTemporary = options.isTemporary;
    if (options.search) params.search = options.search;

    // Add context filtering to search
    if (options.context) {
      const contextMetadata = this.contextToMetadata(options.context);
      if (contextMetadata) {
        // Backend should support metadata filtering
        // For now, we'll filter client-side or extend backend API
        params.metadata = JSON.stringify(contextMetadata);
      }
    }

    return this.http
      .get<{
        success: boolean;
        data: FileMetadata[];
        pagination: any;
      }>(`${this.apiUrl}`, { params })
      .pipe(
        map((response) => ({
          data: response.data,
          pagination: response.pagination,
        })),
      );
  }

  /**
   * Get file by ID
   */
  getFile(fileId: string): Observable<FileMetadata> {
    return this.http
      .get<{ success: boolean; data: FileMetadata }>(`${this.apiUrl}/${fileId}`)
      .pipe(map((response) => response.data));
  }

  /**
   * Delete file
   */
  delete(fileId: string, force = false): Observable<void> {
    const params: Record<string, string> = {};
    if (force) {
      params['force'] = 'true';
    }
    return this.http
      .delete<{ success: boolean }>(`${this.apiUrl}/${fileId}`, { params })
      .pipe(map(() => undefined));
  }

  /**
   * Generate signed URLs for file access
   */
  generateSignedUrls(
    fileId: string,
    expiresIn = 3600,
  ): Observable<{
    urls: {
      view: string;
      download: string;
      thumbnail?: string;
    };
    expiresAt: string;
  }> {
    return this.http
      .post<{
        success: boolean;
        data: {
          urls: { view: string; download: string; thumbnail?: string };
          expiresAt: string;
        };
      }>(`${this.apiUrl}/${fileId}/signed-urls`, { expiresIn })
      .pipe(map((response) => response.data));
  }

  /**
   * Get user statistics (requires authentication)
   */
  getUserStats(): Observable<{
    totalFiles: number;
    totalSize: number;
    filesByCategory: Record<string, number>;
  }> {
    return this.http
      .get<{
        success: boolean;
        data: {
          totalFiles: number;
          totalSize: number;
          filesByCategory: Record<string, number>;
        };
      }>(`${this.apiUrl}/stats`)
      .pipe(map((response) => response.data));
  }

  /**
   * Convert context to metadata for storage
   */
  private contextToMetadata(context: UploadContext): Record<string, string> {
    switch (context.type) {
      case 'user':
        return context.userId
          ? { contextType: 'user', contextId: context.userId }
          : {};
      case 'patient':
        return { contextType: 'patient', contextId: context.patientId };
      case 'product':
        return { contextType: 'product', contextId: context.productId };
      case 'order':
        return { contextType: 'order', contextId: context.orderId };
      case 'system':
        return { contextType: 'system' };
      default:
        return {};
    }
  }

  /**
   * Generate unique file ID for progress tracking
   */
  private generateFileId(file: File): string {
    return `${file.name}_${file.size}_${Date.now()}`;
  }

  /**
   * Update upload progress
   */
  private updateProgress(fileId: string, progress: UploadProgress): void {
    const currentProgress = this.uploadProgressSubject.value;
    currentProgress.set(fileId, progress);
    this.uploadProgressSubject.next(currentProgress);

    // Update stats
    const stats = this.stats();
    const uploading = Array.from(currentProgress.values()).filter(
      (p) => p.status === 'uploading',
    ).length;
    this.stats.set({ ...stats, uploading });
  }

  /**
   * Clear completed uploads from progress tracking
   */
  clearCompletedUploads(): void {
    const currentProgress = this.uploadProgressSubject.value;
    const activeUploads = new Map(
      Array.from(currentProgress.entries()).filter(
        ([, progress]) =>
          progress.status === 'uploading' || progress.status === 'pending',
      ),
    );
    this.uploadProgressSubject.next(activeUploads);
  }
}
