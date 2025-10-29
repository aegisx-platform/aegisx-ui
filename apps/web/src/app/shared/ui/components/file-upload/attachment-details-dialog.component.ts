import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { Attachment } from '../../../services/attachment.service';

export interface AttachmentDetailsData {
  fileName: string;
  fileId: string;
  attachments: Attachment[];
}

/**
 * Dialog แสดงรายละเอียดว่าไฟล์ถูก attach ไปที่ไหนบ้าง
 */
@Component({
  selector: 'app-attachment-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
  ],
  template: `
    <div class="attachment-details-dialog">
      <!-- Header -->
      <h2 mat-dialog-title class="flex items-center gap-2">
        <mat-icon class="text-blue-600">link</mat-icon>
        <span>File Usage Details</span>
      </h2>

      <mat-dialog-content class="space-y-4">
        <!-- File Info -->
        <div class="file-info rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div class="mb-2 flex items-center gap-2">
            <mat-icon class="icon-size-5 text-gray-600 dark:text-gray-400"
              >insert_drive_file</mat-icon
            >
            <span class="font-medium text-gray-900 dark:text-gray-100">{{
              data.fileName
            }}</span>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            This file is currently attached to
            <strong class="text-blue-600">{{ data.attachments.length }}</strong>
            {{ data.attachments.length === 1 ? 'entity' : 'entities' }}
          </p>
        </div>

        <mat-divider></mat-divider>

        <!-- Attachments List -->
        @if (data.attachments.length === 0) {
          <div class="empty-state py-8 text-center">
            <mat-icon
              class="mb-2 text-gray-400"
              style="font-size: 48px; width: 48px; height: 48px;"
              >link_off</mat-icon
            >
            <p class="text-gray-600 dark:text-gray-400">
              This file is not attached to any entities
            </p>
          </div>
        } @else {
          <div class="space-y-3">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Attached To:
            </h3>

            @for (attachment of data.attachments; track attachment.id) {
              <div
                class="attachment-item flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900"
              >
                <!-- Entity Type Icon -->
                <div
                  class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
                  [class]="getEntityTypeClass(attachment.entityType)"
                >
                  <mat-icon class="icon-size-5">{{
                    getEntityTypeIcon(attachment.entityType)
                  }}</mat-icon>
                </div>

                <!-- Details -->
                <div class="flex-1 min-w-0">
                  <!-- Entity Type -->
                  <div class="mb-1 flex items-center gap-2">
                    <span
                      class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                      [class]="getEntityTypeBadgeClass(attachment.entityType)"
                    >
                      {{ attachment.entityType | titlecase }}
                    </span>
                    <span
                      class="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    >
                      {{ attachment.attachmentType }}
                    </span>
                  </div>

                  <!-- Entity ID -->
                  <p class="truncate text-xs text-gray-600 dark:text-gray-400">
                    ID: {{ attachment.entityId }}
                  </p>

                  <!-- Metadata -->
                  @if (
                    attachment.metadata &&
                    getMetadataKeys(attachment.metadata).length > 0
                  ) {
                    <div class="mt-2 flex flex-wrap gap-1">
                      @for (
                        key of getMetadataKeys(attachment.metadata);
                        track key
                      ) {
                        <span
                          class="inline-flex items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        >
                          <span class="font-medium">{{ key }}:</span>
                          <span>{{ attachment.metadata[key] }}</span>
                        </span>
                      }
                    </div>
                  }

                  <!-- Created Date -->
                  <p class="mt-2 text-xs text-gray-500 dark:text-gray-500">
                    Attached: {{ attachment.createdAt | date: 'short' }}
                  </p>
                </div>
              </div>
            }
          </div>
        }
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="close()">Close</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    `
      .attachment-details-dialog {
        min-width: 500px;
        max-width: 600px;
      }

      ::ng-deep .mat-mdc-dialog-content {
        max-height: 60vh;
        overflow-y: auto;
      }

      .attachment-item {
        transition: all 0.2s ease;
      }

      .attachment-item:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      /* Dark mode adjustments */
      :host-context(.dark) .file-info {
        background-color: #1f2937;
      }

      :host-context(.dark) .attachment-item {
        background-color: #111827;
      }
    `,
  ],
})
export class AttachmentDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AttachmentDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AttachmentDetailsData,
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  getEntityTypeIcon(entityType: string): string {
    const icons: Record<string, string> = {
      receiving: 'local_shipping',
      order: 'shopping_cart',
      product: 'inventory_2',
      patient: 'local_hospital',
      visit: 'medical_services',
      document: 'description',
      'user-profile': 'person',
      supplier: 'business',
    };
    return icons[entityType] || 'folder';
  }

  getEntityTypeClass(entityType: string): string {
    const classes: Record<string, string> = {
      receiving:
        'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      order: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      product:
        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      patient: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
      visit: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
      document: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      'user-profile':
        'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
      supplier:
        'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    };
    return classes[entityType] || 'bg-gray-100 text-gray-700';
  }

  getEntityTypeBadgeClass(entityType: string): string {
    const classes: Record<string, string> = {
      receiving:
        'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200',
      order: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
      product:
        'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
      patient: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
      visit: 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-200',
      document: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      'user-profile':
        'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200',
      supplier:
        'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200',
    };
    return classes[entityType] || 'bg-gray-100 text-gray-800';
  }

  getMetadataKeys(metadata: Record<string, any>): string[] {
    return Object.keys(metadata).filter(
      (key) => metadata[key] !== null && metadata[key] !== undefined,
    );
  }
}
