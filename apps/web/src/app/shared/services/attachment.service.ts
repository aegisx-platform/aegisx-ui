import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

/**
 * ============================================
 * TYPESCRIPT INTERFACES
 * ============================================
 */

/**
 * Base Attachment Interface (from database)
 */
export interface Attachment {
  id: string;
  entityType: string;
  entityId: string;
  fileId: string;
  attachmentType: string;
  displayOrder: number;
  metadata: Record<string, any>;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string | null;
}

/**
 * Attachment with File Details (joined with uploaded_files table)
 */
export interface AttachmentWithFile extends Attachment {
  file: {
    id: string;
    originalName: string;
    storedName: string;
    mimeType: string;
    fileSize: number;
    storagePath: string;
    uploadedBy: string | null;
    uploadContext: string;
    category: string | null;
    createdAt: string;
    signedUrls?: {
      view: string;
      download: string;
      thumbnail?: string;
    };
  };
}

/**
 * Attachment Configuration (from attachment-config.ts)
 */
export interface AttachmentConfig {
  entityType: string;
  allowedTypes?: string[];
  maxFiles?: number;
  allowedMimeTypes?: string[];
  maxFileSize?: number;
  requireAuth?: boolean;
  cascadeDelete?: boolean;
  metadata?: {
    required?: string[];
    optional?: string[];
  };
  description?: string;
}

/**
 * ============================================
 * REQUEST/RESPONSE INTERFACES
 * ============================================
 */

/**
 * Request to attach a file to an entity
 */
export interface AttachFileRequest {
  entityType: string;
  entityId: string;
  fileId: string;
  attachmentType: string;
  metadata?: Record<string, any>;
}

/**
 * Request to bulk attach files to an entity
 */
export interface BulkAttachRequest {
  entityType: string;
  entityId: string;
  files: Array<{
    fileId: string;
    attachmentType: string;
    metadata?: Record<string, any>;
  }>;
}

/**
 * Request to update an attachment
 */
export interface UpdateAttachmentRequest {
  attachmentType?: string;
  displayOrder?: number;
  metadata?: Record<string, any>;
}

/**
 * Attachment Statistics
 */
export interface AttachmentStatistics {
  totalFiles: number;
  filesWithAttachments: number;
  filesWithoutAttachments: number;
  totalAttachments: number;
}

/**
 * API Response Wrapper
 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * ============================================
 * ATTACHMENT SERVICE
 * ============================================
 *
 * Frontend service for managing file attachments.
 * Provides methods to attach files to entities, retrieve attachments,
 * reorder, delete, and manage attachment configurations.
 *
 * @example
 * ```typescript
 * // Inject service
 * private attachmentService = inject(AttachmentService);
 *
 * // Attach a file to a patient
 * this.attachmentService.attachFile({
 *   entityType: 'patient',
 *   entityId: 'patient-uuid',
 *   fileId: 'file-uuid',
 *   attachmentType: 'xray',
 *   metadata: { patientId: 'PT-001', recordType: 'imaging' }
 * }).subscribe(attachment => {
 *   console.log('File attached:', attachment);
 * });
 *
 * // Get all patient attachments
 * this.attachmentService.getEntityAttachments('patient', 'patient-uuid')
 *   .subscribe(attachments => {
 *     console.log('Patient files:', attachments);
 *   });
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class AttachmentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/attachments'; // baseUrlInterceptor will add /api prefix

  /**
   * Extract data from API response wrapper
   */
  private extractData<T>(response: ApiResponse<T>): T {
    return response.data;
  }

  /**
   * Attach a single file to an entity
   *
   * @example
   * ```typescript
   * attachmentService.attachFile({
   *   entityType: 'receiving',
   *   entityId: 'rcv-uuid',
   *   fileId: 'file-uuid',
   *   attachmentType: 'delivery-note',
   *   metadata: { receivingNumber: 'RCV-001' }
   * }).subscribe(attachment => {
   *   console.log('Attached:', attachment);
   * });
   * ```
   */
  attachFile(request: AttachFileRequest): Observable<Attachment> {
    return this.http
      .post<ApiResponse<Attachment>>(this.apiUrl, request)
      .pipe(map((response) => this.extractData(response)));
  }

  /**
   * Get all attachments for an entity
   *
   * @param entityType - Entity type (e.g., 'patient', 'receiving')
   * @param entityId - Entity ID
   * @param attachmentType - Optional filter by attachment type
   *
   * @example
   * ```typescript
   * // Get all patient files
   * attachmentService.getEntityAttachments('patient', 'pt-uuid')
   *   .subscribe(files => console.log(files));
   *
   * // Get only xray files
   * attachmentService.getEntityAttachments('patient', 'pt-uuid', 'xray')
   *   .subscribe(xrays => console.log(xrays));
   * ```
   */
  getEntityAttachments(
    entityType: string,
    entityId: string,
    attachmentType?: string,
  ): Observable<AttachmentWithFile[]> {
    let url = `${this.apiUrl}/${entityType}/${entityId}`;
    if (attachmentType) {
      url += `?attachmentType=${attachmentType}`;
    }
    return this.http
      .get<ApiResponse<AttachmentWithFile[]>>(url)
      .pipe(map((response) => this.extractData(response)));
  }

  /**
   * Get a single attachment by ID
   *
   * @example
   * ```typescript
   * attachmentService.getAttachment('attachment-uuid')
   *   .subscribe(attachment => console.log(attachment));
   * ```
   */
  getAttachment(attachmentId: string): Observable<AttachmentWithFile | null> {
    return this.http
      .get<
        ApiResponse<AttachmentWithFile | null>
      >(`${this.apiUrl}/${attachmentId}`)
      .pipe(map((response) => this.extractData(response)));
  }

  /**
   * Update an attachment
   *
   * @example
   * ```typescript
   * attachmentService.updateAttachment('attachment-uuid', {
   *   attachmentType: 'updated-type',
   *   metadata: { notes: 'Updated notes' }
   * }).subscribe(updated => console.log(updated));
   * ```
   */
  updateAttachment(
    attachmentId: string,
    data: UpdateAttachmentRequest,
  ): Observable<Attachment> {
    return this.http
      .put<ApiResponse<Attachment>>(`${this.apiUrl}/${attachmentId}`, data)
      .pipe(map((response) => this.extractData(response)));
  }

  /**
   * Remove an attachment
   * Note: This only deletes the attachment record, not the file itself
   *
   * @example
   * ```typescript
   * attachmentService.removeAttachment('attachment-uuid')
   *   .subscribe(() => console.log('Removed'));
   * ```
   */
  removeAttachment(attachmentId: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.apiUrl}/${attachmentId}`)
      .pipe(map((response) => this.extractData(response)));
  }

  /**
   * Bulk attach multiple files to an entity
   *
   * @example
   * ```typescript
   * attachmentService.bulkAttach({
   *   entityType: 'product',
   *   entityId: 'prod-uuid',
   *   files: [
   *     { fileId: 'file-1', attachmentType: 'image' },
   *     { fileId: 'file-2', attachmentType: 'manual' },
   *   ]
   * }).subscribe(attachments => {
   *   console.log('Attached', attachments.length, 'files');
   * });
   * ```
   */
  bulkAttach(request: BulkAttachRequest): Observable<Attachment[]> {
    return this.http
      .post<ApiResponse<Attachment[]>>(`${this.apiUrl}/bulk`, request)
      .pipe(map((response) => this.extractData(response)));
  }

  /**
   * Reorder attachments for an entity
   *
   * @example
   * ```typescript
   * // After drag-and-drop reorder
   * const fileIds = ['file-3', 'file-1', 'file-2']; // New order
   * attachmentService.reorderAttachments(
   *   'patient',
   *   'pt-uuid',
   *   fileIds
   * ).subscribe(() => console.log('Reordered'));
   * ```
   */
  reorderAttachments(
    entityType: string,
    entityId: string,
    fileIds: string[],
  ): Observable<void> {
    return this.http
      .put<
        ApiResponse<void>
      >(`${this.apiUrl}/${entityType}/${entityId}/reorder`, { fileIds })
      .pipe(map((response) => this.extractData(response)));
  }

  /**
   * Clean up all attachments for an entity
   * Called when entity is deleted
   *
   * @example
   * ```typescript
   * attachmentService.cleanupEntity('product', 'prod-uuid')
   *   .subscribe(() => console.log('Cleaned up'));
   * ```
   */
  cleanupEntity(entityType: string, entityId: string): Observable<void> {
    return this.http
      .delete<
        ApiResponse<void>
      >(`${this.apiUrl}/entity/${entityType}/${entityId}`)
      .pipe(map((response) => this.extractData(response)));
  }

  /**
   * Get attachment configuration for an entity type
   * Useful for frontend validation
   *
   * @example
   * ```typescript
   * attachmentService.getConfig('patient').subscribe(config => {
   *   console.log('Max files:', config.maxFiles);
   *   console.log('Allowed types:', config.allowedTypes);
   * });
   * ```
   */
  getConfig(entityType: string): Observable<AttachmentConfig> {
    return this.http
      .get<ApiResponse<AttachmentConfig>>(`${this.apiUrl}/config/${entityType}`)
      .pipe(map((response) => this.extractData(response)));
  }

  /**
   * Get attachment count for an entity
   *
   * @example
   * ```typescript
   * attachmentService.getAttachmentCount('patient', 'pt-uuid')
   *   .subscribe(count => console.log('Total files:', count));
   *
   * // Count specific type
   * attachmentService.getAttachmentCount('patient', 'pt-uuid', 'xray')
   *   .subscribe(count => console.log('Xrays:', count));
   * ```
   */
  getAttachmentCount(
    entityType: string,
    entityId: string,
    attachmentType?: string,
  ): Observable<number> {
    let url = `${this.apiUrl}/${entityType}/${entityId}/count`;
    if (attachmentType) {
      url += `?attachmentType=${attachmentType}`;
    }
    return this.http
      .get<ApiResponse<{ count: number }>>(url)
      .pipe(map((response) => this.extractData(response).count));
  }

  /**
   * Get all attachments for a specific file
   * Useful for File Management to see where a file is being used
   *
   * @example
   * ```typescript
   * attachmentService.getAttachmentsByFileId('file-uuid')
   *   .subscribe(attachments => {
   *     console.log('This file is used in:', attachments);
   *   });
   * ```
   */
  getAttachmentsByFileId(fileId: string): Observable<Attachment[]> {
    return this.http
      .get<ApiResponse<Attachment[]>>(`${this.apiUrl}/by-file/${fileId}`)
      .pipe(map((response) => this.extractData(response)));
  }

  /**
   * Get attachment count for a specific file
   * Shows how many times a file is attached to entities
   *
   * @example
   * ```typescript
   * attachmentService.getAttachmentCountByFileId('file-uuid')
   *   .subscribe(count => {
   *     console.log('File is attached', count, 'times');
   *   });
   * ```
   */
  getAttachmentCountByFileId(fileId: string): Observable<number> {
    return this.http
      .get<
        ApiResponse<{ count: number }>
      >(`${this.apiUrl}/by-file/${fileId}/count`)
      .pipe(map((response) => this.extractData(response).count));
  }

  /**
   * Get attachment statistics for current user's files
   * Returns information about file usage and attachments
   *
   * @example
   * ```typescript
   * attachmentService.getStatistics().subscribe(stats => {
   *   console.log('Total files:', stats.totalFiles);
   *   console.log('Files in use:', stats.filesWithAttachments);
   *   console.log('Unused files:', stats.filesWithoutAttachments);
   *   console.log('Total attachments:', stats.totalAttachments);
   * });
   * ```
   */
  getStatistics(): Observable<AttachmentStatistics> {
    return this.http
      .get<{
        success: boolean;
        data: AttachmentStatistics;
      }>(`${this.apiUrl}/stats`)
      .pipe(map((response) => response.data));
  }
}
