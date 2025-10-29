import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { AttachmentItemComponent } from '../attachment-item/attachment-item.component';
import { AttachmentWithFile } from '../../../services/attachment.service';

/**
 * AttachmentListComponent (Presentation Component)
 *
 * Displays a list of attachments with support for:
 * - Drag-and-drop reordering
 * - Empty state when no attachments
 * - Grid or list layout
 * - Actions delegated to attachment items
 *
 * This is a pure presentation component - it receives data and emits events only.
 *
 * @example
 * ```html
 * <app-attachment-list
 *   [attachments]="attachments"
 *   [enableReorder]="true"
 *   [layout]="'grid'"
 *   (reorder)="onReorder($event)"
 *   (view)="onView($event)"
 *   (download)="onDownload($event)"
 *   (delete)="onDelete($event)"
 * />
 * ```
 */
@Component({
  selector: 'app-attachment-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    DragDropModule,
    AttachmentItemComponent,
  ],
  templateUrl: './attachment-list.component.html',
  styleUrl: './attachment-list.component.scss',
})
export class AttachmentListComponent {
  /**
   * List of attachments to display
   */
  attachments = input.required<AttachmentWithFile[]>();

  /**
   * Enable drag-and-drop reordering
   * @default false
   */
  enableReorder = input<boolean>(false);

  /**
   * Layout mode
   * @default 'list'
   */
  layout = input<'list' | 'grid'>('list');

  /**
   * Show empty state
   * @default true
   */
  showEmptyState = input<boolean>(true);

  /**
   * Readonly mode (no actions)
   * @default false
   */
  readonly = input<boolean>(false);

  /**
   * Loading state
   * @default false
   */
  loading = input<boolean>(false);

  /**
   * Emitted when attachments are reordered
   * Returns new order of file IDs
   */
  reorder = output<string[]>();

  /**
   * Emitted when user views an attachment
   */
  view = output<AttachmentWithFile>();

  /**
   * Emitted when user downloads an attachment
   */
  download = output<AttachmentWithFile>();

  /**
   * Emitted when user deletes an attachment
   */
  delete = output<AttachmentWithFile>();

  /**
   * Handle drag-drop reorder
   */
  onDrop(event: CdkDragDrop<AttachmentWithFile[]>): void {
    if (!this.enableReorder()) return;

    const items = [...this.attachments()];
    moveItemInArray(items, event.previousIndex, event.currentIndex);

    // Emit new order as array of file IDs
    const fileIds = items.map((item) => item.fileId);
    this.reorder.emit(fileIds);
  }

  /**
   * Handle view action
   */
  onView(attachment: AttachmentWithFile): void {
    this.view.emit(attachment);
  }

  /**
   * Handle download action
   */
  onDownload(attachment: AttachmentWithFile): void {
    this.download.emit(attachment);
  }

  /**
   * Handle delete action
   */
  onDelete(attachment: AttachmentWithFile): void {
    this.delete.emit(attachment);
  }

  /**
   * Track by function for ngFor
   */
  trackByAttachmentId(index: number, item: AttachmentWithFile): string {
    return item.id;
  }
}
