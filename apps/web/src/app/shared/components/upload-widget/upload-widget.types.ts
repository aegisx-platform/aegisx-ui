/**
 * Upload Widget Types
 *
 * Defines interfaces and types for the unified upload widget component.
 */

/**
 * Upload mode
 */
export type UploadMode = 'single' | 'multiple';

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
 * Upload status
 */
export type UploadStatus = 'pending' | 'uploading' | 'completed' | 'failed';

/**
 * Upload options
 */
export interface UploadOptions {
  category: FileCategory;
  isPublic?: boolean;
  isTemporary?: boolean;
  expiresIn?: number; // Hours
  allowDuplicates?: boolean;
  forceEncryption?: boolean;
  metadata?: Record<string, any>;
}

/**
 * Compression options
 */
export interface CompressionOptions {
  enabled: boolean;
  maxWidth: number; // Default: 1920px
  maxHeight: number; // Default: 1080px
  quality: number; // Default: 0.8 (80%)
  format: 'jpeg' | 'webp';
}

/**
 * Upload configuration
 */
export interface UploadConfig {
  mode: UploadMode;
  category: FileCategory;
  maxFiles?: number;
  maxFileSize?: number; // Bytes
  accept?: string; // File extensions, e.g., '.jpg,.png,.pdf'
  enableDragDrop?: boolean;
  enableImagePreview?: boolean;
  enableCropping?: boolean;
  enableCamera?: boolean;
  cameraMode?: 'environment' | 'user'; // Back camera or front camera
  concurrent?: number; // Max concurrent uploads (default: 3)
  compression?: CompressionOptions;
}

/**
 * File upload progress
 */
export interface FileUploadProgress {
  file: File;
  filename: string;
  status: UploadStatus;
  percentage: number; // 0-100
  uploadedBytes: number;
  totalBytes: number;
  error?: string;
  result?: UploadedFileResult;
}

/**
 * Multiple files upload progress
 */
export interface MultipleUploadProgress {
  files: FileUploadProgress[];
  totalFiles: number;
  uploadedCount: number;
  failedCount: number;
  overallPercentage: number; // 0-100
}

/**
 * Uploaded file result (from API)
 */
export interface UploadedFileResult {
  id: string;
  originalName: string;
  filename: string;
  filepath: string;
  mimeType: string;
  fileSize: number;
  fileHash: string;
  storageAdapter: string;
  storageKey: string;
  fileCategory: string;
  isPublic: boolean;
  isTemporary: boolean;
  expiresAt?: string;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Upload events
 */
export interface UploadStartEvent {
  files: File[];
  totalSize: number;
}

export interface UploadProgressEvent {
  progress: MultipleUploadProgress;
}

export interface UploadCompleteEvent {
  uploaded: UploadedFileResult[];
  failed: Array<{ filename: string; error: string }>;
}

export interface UploadErrorEvent {
  filename: string;
  error: string;
  code?: string;
}

/**
 * Drag and drop state
 */
export interface DragDropState {
  isDragging: boolean;
  isValidDrop: boolean;
}

/**
 * Category configuration (from backend)
 */
export interface CategoryConfig {
  category: FileCategory;
  label: string;
  description: string;
  allowedMimeTypes: string[];
  maxFileSize: number;
  minFileSize?: number;
  requireCompression: boolean;
  requireEncryption: boolean;
  generateThumbnails: boolean;
  thumbnailSizes?: number[];
  defaultPublic: boolean;
  defaultTemporary: boolean;
  defaultExpiresIn?: number;
  requireAuth: boolean;
  isPHI?: boolean;
  requireAuditLog?: boolean;
  restrictedToRoles?: string[];
}
