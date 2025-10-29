import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { AttachmentWithFile } from '../../../services/attachment.service';

/**
 * AttachmentItemComponent (Presentation Component)
 *
 * Displays a single attachment file with thumbnail, metadata, and actions.
 * This is a pure presentation component - no business logic or data fetching.
 *
 * Features:
 * - File thumbnail or icon based on MIME type
 * - File metadata display (name, size, date)
 * - Action menu (view, download, delete)
 * - Drag handle for reordering
 * - Responsive card layout
 *
 * @example
 * ```html
 * <app-attachment-item
 *   [attachment]="attachment"
 *   [showDragHandle]="true"
 *   (view)="onView($event)"
 *   (download)="onDownload($event)"
 *   (delete)="onDelete($event)"
 * />
 * ```
 */
@Component({
  selector: 'app-attachment-item',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
  ],
  templateUrl: './attachment-item.component.html',
  styleUrl: './attachment-item.component.scss',
})
export class AttachmentItemComponent {
  /**
   * Attachment data to display
   */
  attachment = input.required<AttachmentWithFile>();

  /**
   * Show drag handle for reordering
   * @default false
   */
  showDragHandle = input<boolean>(false);

  /**
   * Disable all actions (view-only mode)
   * @default false
   */
  readonly = input<boolean>(false);

  /**
   * Emitted when user clicks view button
   */
  view = output<AttachmentWithFile>();

  /**
   * Emitted when user clicks download button
   */
  download = output<AttachmentWithFile>();

  /**
   * Emitted when user clicks delete button
   */
  delete = output<AttachmentWithFile>();

  /**
   * Get icon for file type
   */
  getFileIcon(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'movie';
    if (mimeType.startsWith('audio/')) return 'audiotrack';
    if (mimeType === 'application/pdf') return 'picture_as_pdf';
    if (
      mimeType === 'application/msword' ||
      mimeType ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      return 'description';
    }
    if (
      mimeType === 'application/vnd.ms-excel' ||
      mimeType ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return 'table_chart';
    }
    if (
      mimeType === 'application/vnd.ms-powerpoint' ||
      mimeType ===
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ) {
      return 'slideshow';
    }
    if (
      mimeType === 'application/zip' ||
      mimeType === 'application/x-zip-compressed'
    ) {
      return 'folder_zip';
    }
    return 'insert_drive_file';
  }

  /**
   * Get icon color based on file type
   */
  getIconColor(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'text-blue-500';
    if (mimeType.startsWith('video/')) return 'text-purple-500';
    if (mimeType.startsWith('audio/')) return 'text-green-500';
    if (mimeType === 'application/pdf') return 'text-red-500';
    if (
      mimeType === 'application/msword' ||
      mimeType ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      return 'text-blue-600';
    }
    if (
      mimeType === 'application/vnd.ms-excel' ||
      mimeType ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return 'text-green-600';
    }
    return 'text-gray-500';
  }

  /**
   * Format file size to human-readable string
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Format date to locale string
   */
  formatDate(dateString: string | null | undefined): string {
    if (!dateString) {
      return '-';
    }

    const date = new Date(dateString);

    // Check if date is invalid
    if (isNaN(date.getTime())) {
      return '-';
    }

    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  /**
   * Check if file is an image
   */
  isImage(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  }

  /**
   * Get metadata keys (for template iteration)
   */
  getMetadataKeys(metadata: Record<string, any>): string[] {
    return Object.keys(metadata).filter(
      (key) => metadata[key] !== null && metadata[key] !== undefined,
    );
  }

  /**
   * Handle view action
   */
  onView(): void {
    if (!this.readonly()) {
      this.view.emit(this.attachment());
    }
  }

  /**
   * Handle download action
   */
  onDownload(): void {
    if (!this.readonly()) {
      this.download.emit(this.attachment());
    }
  }

  /**
   * Handle delete action
   */
  onDelete(): void {
    if (!this.readonly()) {
      this.delete.emit(this.attachment());
    }
  }
}
