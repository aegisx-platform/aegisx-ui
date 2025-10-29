import {
  Component,
  inject,
  input,
  OnInit,
  signal,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import {
  AttachmentService,
  AttachmentWithFile,
  AttachmentConfig,
} from '../../services/attachment.service';
import { AttachmentListComponent } from './attachment-list/attachment-list.component';
import { UploadWidgetComponent } from '../upload-widget/upload-widget.component';
import { UploadCompleteEvent } from '../upload-widget/upload-widget.types';

/**
 * EntityAttachmentsComponent (Smart/Container Component)
 *
 * Complete attachment management for any entity type.
 * Handles data fetching, state management, and business logic.
 *
 * Features:
 * - Config-driven validation
 * - File upload with camera & drag-drop
 * - Attachment list with reordering
 * - View, download, delete actions
 * - Delete confirmation dialog
 * - Error handling & user feedback
 *
 * @example
 * ```html
 * <!-- In receiving page -->
 * <app-entity-attachments
 *   entityType="receiving"
 *   [entityId]="receivingId"
 *   [metadata]="{ receivingNumber: 'RCV-001', supplierName: 'ABC Corp' }"
 * />
 *
 * <!-- In patient record page -->
 * <app-entity-attachments
 *   entityType="patient"
 *   [entityId]="patientId"
 *   [metadata]="{ patientId: 'PT-001', recordType: 'medical-record' }"
 * />
 * ```
 */
@Component({
  selector: 'app-entity-attachments',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTabsModule,
    AttachmentListComponent,
    UploadWidgetComponent,
  ],
  templateUrl: './entity-attachments.component.html',
  styleUrl: './entity-attachments.component.scss',
})
export class EntityAttachmentsComponent implements OnInit {
  // Injected services
  private readonly attachmentService = inject(AttachmentService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  /**
   * Entity type (must be configured in attachment-config.ts)
   * Examples: 'receiving', 'patient', 'product', 'order'
   */
  entityType = input.required<string>();

  /**
   * Entity ID
   */
  entityId = input.required<string>();

  /**
   * Metadata to attach with files
   * Should include required fields based on entity config
   */
  metadata = input<Record<string, any>>({});

  /**
   * Default attachment type
   */
  defaultAttachmentType = input<string>('other');

  /**
   * Enable reordering
   * @default true
   */
  enableReorder = input<boolean>(true);

  /**
   * Layout mode for attachment list
   * @default 'list'
   */
  layout = input<'list' | 'grid'>('list');

  /**
   * Show upload section
   * @default true
   */
  showUpload = input<boolean>(true);

  // State signals
  attachments = signal<AttachmentWithFile[]>([]);
  config = signal<AttachmentConfig | null>(null);
  loading = signal<boolean>(false);
  uploading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor() {
    // Reload when entity changes
    effect(() => {
      const entityType = this.entityType();
      const entityId = this.entityId();
      if (entityType && entityId) {
        this.loadAttachments();
        this.loadConfig();
      }
    });
  }

  ngOnInit(): void {
    this.loadAttachments();
    this.loadConfig();
  }

  /**
   * Load entity configuration
   */
  private loadConfig(): void {
    this.attachmentService.getConfig(this.entityType()).subscribe({
      next: (config) => {
        this.config.set(config);
      },
      error: (err) => {
        console.error('Failed to load attachment config:', err);
        this.showError('Failed to load configuration');
      },
    });
  }

  /**
   * Load attachments for entity
   */
  loadAttachments(): void {
    this.loading.set(true);
    this.error.set(null);

    this.attachmentService
      .getEntityAttachments(this.entityType(), this.entityId())
      .subscribe({
        next: (attachments) => {
          this.attachments.set(attachments);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Failed to load attachments:', err);
          this.error.set('Failed to load attachments');
          this.loading.set(false);
        },
      });
  }

  /**
   * Handle file upload completion
   */
  onUploadComplete(event: UploadCompleteEvent): void {
    if (!event.uploaded || event.uploaded.length === 0) {
      this.showError('No files were uploaded');
      return;
    }

    this.uploading.set(true);

    // Bulk attach files
    const files = event.uploaded.map((file) => ({
      fileId: file.id,
      attachmentType: this.defaultAttachmentType(),
      metadata: this.metadata(),
    }));

    this.attachmentService
      .bulkAttach({
        entityType: this.entityType(),
        entityId: this.entityId(),
        files,
      })
      .subscribe({
        next: () => {
          this.uploading.set(false);
          this.showSuccess(`${files.length} file(s) attached successfully`);
          this.loadAttachments(); // Refresh list
        },
        error: (err) => {
          console.error('Failed to attach files:', err);
          this.uploading.set(false);
          this.showError('Failed to attach files');
        },
      });
  }

  /**
   * Handle view attachment
   */
  onView(attachment: AttachmentWithFile): void {
    if (attachment.file.signedUrls?.view) {
      window.open(attachment.file.signedUrls.view, '_blank');
    }
  }

  /**
   * Handle download attachment
   */
  onDownload(attachment: AttachmentWithFile): void {
    if (attachment.file.signedUrls?.download) {
      const link = document.createElement('a');
      link.href = attachment.file.signedUrls.download;
      link.download = attachment.file.originalName;
      link.click();
    }
  }

  /**
   * Handle delete attachment
   */
  onDelete(attachment: AttachmentWithFile): void {
    // Show confirmation dialog
    const confirmed = confirm(
      `Are you sure you want to delete "${attachment.file.originalName}"?\n\nThis will remove the attachment but keep the file in storage.`,
    );

    if (!confirmed) return;

    this.attachmentService.removeAttachment(attachment.id).subscribe({
      next: () => {
        this.showSuccess('Attachment deleted successfully');
        this.loadAttachments(); // Refresh list
      },
      error: (err) => {
        console.error('Failed to delete attachment:', err);
        this.showError('Failed to delete attachment');
      },
    });
  }

  /**
   * Handle reorder attachments
   */
  onReorder(fileIds: string[]): void {
    this.attachmentService
      .reorderAttachments(this.entityType(), this.entityId(), fileIds)
      .subscribe({
        next: () => {
          this.showSuccess('Attachments reordered successfully');
          this.loadAttachments(); // Refresh to show new order
        },
        error: (err) => {
          console.error('Failed to reorder attachments:', err);
          this.showError('Failed to reorder attachments');
          this.loadAttachments(); // Reload original order
        },
      });
  }

  /**
   * Show success message
   */
  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

  /**
   * Show error message
   */
  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }

  /**
   * Get upload context string for file manager
   */
  getUploadContext(): string {
    return this.entityType();
  }

  /**
   * Get allowed MIME types from config
   */
  getAllowedMimeTypes(): string {
    return this.config()?.allowedMimeTypes?.join(',') || '*';
  }

  /**
   * Get max file size from config
   */
  getMaxFileSize(): number {
    return this.config()?.maxFileSize || 10 * 1024 * 1024; // Default 10MB
  }

  /**
   * Get max files from config
   */
  getMaxFiles(): number {
    const configMax = this.config()?.maxFiles || 10;
    const currentCount = this.attachments().length;
    return Math.max(0, configMax - currentCount);
  }

  /**
   * Check if max files reached
   */
  isMaxFilesReached(): boolean {
    const config = this.config();
    if (!config?.maxFiles) return false;
    return this.attachments().length >= config.maxFiles;
  }
}
