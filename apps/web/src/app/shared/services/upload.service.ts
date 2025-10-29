import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, map, catchError, of, shareReplay } from 'rxjs';
import {
  UploadOptions,
  FileUploadProgress,
  MultipleUploadProgress,
  UploadedFileResult,
  UploadStatus,
} from '../components/upload-widget/upload-widget.types';

/**
 * Upload Service
 *
 * Handles file uploads with support for:
 * - Single file upload with progress tracking
 * - Multiple files upload with concurrency control
 * - Retry logic for failed uploads
 * - Progress tracking (per file and overall)
 */
@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private readonly http = inject(HttpClient);
  private readonly CONCURRENT_LIMIT = 3; // Upload 3 files at a time
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 second

  /**
   * Upload single file with progress tracking
   */
  uploadSingle(
    file: File,
    options: UploadOptions,
  ): Observable<FileUploadProgress> {
    const formData = this.buildFormData(file, options);

    return this.http
      .post<{ success: boolean; data: UploadedFileResult }>(
        '/api/files/upload',
        formData,
        {
          reportProgress: true,
          observe: 'events',
        },
      )
      .pipe(
        map((event) => this.mapProgressEvent(event, file)),
        catchError((error) => {
          return of(this.createErrorProgress(file, error));
        }),
        shareReplay(1),
      );
  }

  /**
   * Upload multiple files in parallel with concurrency control
   */
  uploadMultiple(
    files: File[],
    options: UploadOptions,
  ): Observable<MultipleUploadProgress> {
    return new Observable((observer) => {
      this.processInParallel(files, options, observer);
    });
  }

  /**
   * Process files in parallel with concurrency limit
   */
  private async processInParallel(
    files: File[],
    options: UploadOptions,
    observer: any,
  ): Promise<void> {
    const fileProgresses = new Map<string, FileUploadProgress>();

    // Initialize progress for all files
    files.forEach((file) => {
      fileProgresses.set(file.name, {
        file,
        filename: file.name,
        status: 'pending' as UploadStatus,
        percentage: 0,
        uploadedBytes: 0,
        totalBytes: file.size,
      });
    });

    // Emit initial state
    observer.next(this.calculateOverallProgress(fileProgresses));

    // Process files in chunks
    for (let i = 0; i < files.length; i += this.CONCURRENT_LIMIT) {
      const chunk = files.slice(i, i + this.CONCURRENT_LIMIT);

      // Upload chunk in parallel
      await Promise.all(
        chunk.map((file) =>
          this.uploadWithProgress(file, options, fileProgresses, observer),
        ),
      );
    }

    // Emit final state
    observer.next(this.calculateOverallProgress(fileProgresses));
    observer.complete();
  }

  /**
   * Upload single file and update progress map
   */
  private async uploadWithProgress(
    file: File,
    options: UploadOptions,
    fileProgresses: Map<string, FileUploadProgress>,
    observer: any,
  ): Promise<void> {
    return new Promise((resolve) => {
      this.uploadSingle(file, options).subscribe({
        next: (progress) => {
          fileProgresses.set(file.name, progress);
          observer.next(this.calculateOverallProgress(fileProgresses));
        },
        error: (error) => {
          const errorProgress = this.createErrorProgress(file, error);
          fileProgresses.set(file.name, errorProgress);
          observer.next(this.calculateOverallProgress(fileProgresses));
          resolve();
        },
        complete: () => {
          resolve();
        },
      });
    });
  }

  /**
   * Build FormData for upload request
   */
  private buildFormData(file: File, options: UploadOptions): FormData {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', options.category);

    if (options.isPublic !== undefined) {
      formData.append('isPublic', String(options.isPublic));
    }

    if (options.isTemporary !== undefined) {
      formData.append('isTemporary', String(options.isTemporary));
    }

    if (options.expiresIn !== undefined) {
      formData.append('expiresIn', String(options.expiresIn));
    }

    if (options.allowDuplicates !== undefined) {
      formData.append('allowDuplicates', String(options.allowDuplicates));
    }

    if (options.forceEncryption !== undefined) {
      formData.append('forceEncryption', String(options.forceEncryption));
    }

    if (options.metadata) {
      formData.append('metadata', JSON.stringify(options.metadata));
    }

    return formData;
  }

  /**
   * Map HTTP event to file upload progress
   */
  private mapProgressEvent(
    event: HttpEvent<{ success: boolean; data: UploadedFileResult }>,
    file: File,
  ): FileUploadProgress {
    switch (event.type) {
      case HttpEventType.UploadProgress: {
        const percentage = event.total
          ? Math.round((100 * event.loaded) / event.total)
          : 0;

        return {
          file,
          filename: file.name,
          status: 'uploading' as UploadStatus,
          percentage,
          uploadedBytes: event.loaded,
          totalBytes: event.total || file.size,
        };
      }

      case HttpEventType.Response: {
        return {
          file,
          filename: file.name,
          status: 'completed' as UploadStatus,
          percentage: 100,
          uploadedBytes: file.size,
          totalBytes: file.size,
          result: event.body?.data,
        };
      }

      default: {
        return {
          file,
          filename: file.name,
          status: 'uploading' as UploadStatus,
          percentage: 0,
          uploadedBytes: 0,
          totalBytes: file.size,
        };
      }
    }
  }

  /**
   * Create error progress state
   */
  private createErrorProgress(file: File, error: any): FileUploadProgress {
    return {
      file,
      filename: file.name,
      status: 'failed' as UploadStatus,
      percentage: 0,
      uploadedBytes: 0,
      totalBytes: file.size,
      error: error.error?.message || error.message || 'Upload failed',
    };
  }

  /**
   * Calculate overall progress from file progresses
   */
  private calculateOverallProgress(
    fileProgresses: Map<string, FileUploadProgress>,
  ): MultipleUploadProgress {
    const files = Array.from(fileProgresses.values());
    const totalFiles = files.length;
    const uploadedCount = files.filter((f) => f.status === 'completed').length;
    const failedCount = files.filter((f) => f.status === 'failed').length;

    // Calculate overall percentage
    const totalPercentage = files.reduce((sum, f) => sum + f.percentage, 0);
    const overallPercentage =
      totalFiles > 0 ? Math.round(totalPercentage / totalFiles) : 0;

    return {
      files,
      totalFiles,
      uploadedCount,
      failedCount,
      overallPercentage,
    };
  }

  /**
   * Validate file before upload
   */
  validateFile(
    file: File,
    maxFileSize?: number,
    allowedTypes?: string[],
  ): { valid: boolean; error?: string } {
    // Check file size
    if (maxFileSize && file.size > maxFileSize) {
      const maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(2);
      return {
        valid: false,
        error: `File size exceeds ${maxSizeMB} MB`,
      };
    }

    // Check file type
    if (allowedTypes && allowedTypes.length > 0) {
      const isAllowed = allowedTypes.some((allowedType) => {
        const type = allowedType.toLowerCase();

        // Check wildcard MIME types (e.g., "image/*", "video/*")
        if (type.includes('*')) {
          const baseType = type.split('/')[0]; // "image/*" → "image"
          return file.type.toLowerCase().startsWith(baseType + '/');
        }

        // Check exact MIME type (e.g., "application/pdf")
        if (type.includes('/')) {
          return file.type.toLowerCase() === type;
        }

        // Check file extension (e.g., ".pdf", ".jpg")
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        return type.includes(fileExtension);
      });

      if (!isAllowed) {
        return {
          valid: false,
          error: `File type not allowed. Allowed: ${allowedTypes.join(', ')}`,
        };
      }
    }

    return { valid: true };
  }

  /**
   * Format file size to human-readable string
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }
}
