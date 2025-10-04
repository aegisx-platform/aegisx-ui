import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';

import { Notification } from '../types/notification.types';

export interface NotificationViewDialogData {
  notifications: Notification;
}

@Component({
  selector: 'app-notifications-view-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatTooltipModule,
    MatBadgeModule,
  ],
  template: `
    <div class="view-dialog">
      <!-- Dialog Header -->
      <div class="dialog-header">
        <div class="header-content">
          <div class="header-icon">
            <mat-icon [ngClass]="getNotificationIconClass()">{{
              getNotificationIcon()
            }}</mat-icon>
          </div>
          <div class="header-text">
            <h2 mat-dialog-title>Notification Details</h2>
            <p class="header-subtitle">
              {{ data.notifications.type | titlecase }} notification
            </p>
          </div>
          <div class="header-status">
            <mat-chip [ngClass]="getStatusChipClass()" selected>
              <mat-icon>{{ getStatusIcon() }}</mat-icon>
              {{ getStatusText() }}
            </mat-chip>
          </div>
        </div>
        <button
          mat-icon-button
          (click)="onClose()"
          class="close-button"
          matTooltip="Close dialog"
        >
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Dialog Content -->
      <mat-dialog-content class="dialog-content">
        <div class="details-container">
          <!-- Main Information Card -->
          <mat-card class="info-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>info</mat-icon>
                Basic Information
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="info-grid">
                <div class="info-item">
                  <label class="info-label">Title</label>
                  <div class="info-value primary-text">
                    {{ data.notifications.title }}
                  </div>
                </div>

                <div class="info-item">
                  <label class="info-label">Type</label>
                  <div class="info-value">
                    <mat-chip [ngClass]="getTypeChipClass()" selected>
                      <mat-icon>{{ getTypeIcon() }}</mat-icon>
                      {{ data.notifications.type | titlecase }}
                    </mat-chip>
                  </div>
                </div>

                <div class="info-item">
                  <label class="info-label">Priority</label>
                  <div class="info-value">
                    <mat-chip [ngClass]="getPriorityChipClass()" selected>
                      <mat-icon>{{ getPriorityIcon() }}</mat-icon>
                      {{ data.notifications.priority || 'Normal' | titlecase }}
                    </mat-chip>
                  </div>
                </div>

                <div class="info-item">
                  <label class="info-label">User ID</label>
                  <div class="info-value">
                    <code class="user-id">{{
                      data.notifications.user_id
                    }}</code>
                  </div>
                </div>
              </div>

              <mat-divider class="section-divider"></mat-divider>

              <div class="info-item full-width">
                <label class="info-label">Message</label>
                <div class="info-value message-content">
                  {{ data.notifications.message }}
                </div>
              </div>

              <div
                class="info-item full-width"
                *ngIf="data.notifications.action_url"
              >
                <label class="info-label">Action URL</label>
                <div class="info-value">
                  <a
                    [href]="data.notifications.action_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="action-link"
                    matTooltip="Open in new tab"
                  >
                    <mat-icon>link</mat-icon>
                    {{ data.notifications.action_url }}
                    <mat-icon class="external-icon">open_in_new</mat-icon>
                  </a>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Status Information Card -->
          <mat-card class="status-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>timeline</mat-icon>
                Status & Timestamps
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="status-grid">
                <div class="status-item">
                  <div class="status-header">
                    <mat-icon
                      [ngClass]="
                        data.notifications.read ? 'read-icon' : 'unread-icon'
                      "
                    >
                      {{
                        data.notifications.read
                          ? 'mark_email_read'
                          : 'mark_email_unread'
                      }}
                    </mat-icon>
                    <span class="status-label">Read Status</span>
                  </div>
                  <div class="status-value">
                    <strong>{{
                      data.notifications.read ? 'Read' : 'Unread'
                    }}</strong>
                    <div class="timestamp" *ngIf="data.notifications.read_at">
                      {{ data.notifications.read_at | date: 'medium' }}
                    </div>
                  </div>
                </div>

                <div class="status-item">
                  <div class="status-header">
                    <mat-icon
                      [ngClass]="
                        data.notifications.archived
                          ? 'archived-icon'
                          : 'active-icon'
                      "
                    >
                      {{ data.notifications.archived ? 'archive' : 'inbox' }}
                    </mat-icon>
                    <span class="status-label">Archive Status</span>
                  </div>
                  <div class="status-value">
                    <strong>{{
                      data.notifications.archived ? 'Archived' : 'Active'
                    }}</strong>
                    <div
                      class="timestamp"
                      *ngIf="data.notifications.archived_at"
                    >
                      {{ data.notifications.archived_at | date: 'medium' }}
                    </div>
                  </div>
                </div>

                <div class="status-item" *ngIf="data.notifications.expires_at">
                  <div class="status-header">
                    <mat-icon
                      [ngClass]="isExpired() ? 'expired-icon' : 'active-icon'"
                    >
                      {{ isExpired() ? 'event_busy' : 'schedule' }}
                    </mat-icon>
                    <span class="status-label">Expiration</span>
                  </div>
                  <div class="status-value">
                    <strong>{{ isExpired() ? 'Expired' : 'Active' }}</strong>
                    <div class="timestamp">
                      {{ data.notifications.expires_at | date: 'medium' }}
                    </div>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Additional Data Card -->
          <mat-card class="data-card" *ngIf="data.notifications.data">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>data_object</mat-icon>
                Additional Data
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="json-viewer">
                <pre>{{ data.notifications.data | json }}</pre>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- System Information Card -->
          <mat-card class="system-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>settings</mat-icon>
                System Information
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="system-grid">
                <div class="system-item">
                  <label class="system-label">Notification ID</label>
                  <div class="system-value">
                    <code class="id-code">{{ data.notifications.id }}</code>
                    <button
                      mat-icon-button
                      (click)="copyToClipboard(data.notifications.id)"
                      matTooltip="Copy to clipboard"
                      class="copy-btn"
                    >
                      <mat-icon>content_copy</mat-icon>
                    </button>
                  </div>
                </div>

                <div class="system-item">
                  <label class="system-label">Created At</label>
                  <div class="system-value">
                    <span class="timestamp-full">{{
                      data.notifications.created_at | date: 'full'
                    }}</span>
                  </div>
                </div>

                <div class="system-item">
                  <label class="system-label">Last Updated</label>
                  <div class="system-value">
                    <span class="timestamp-full">{{
                      data.notifications.updated_at | date: 'full'
                    }}</span>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </mat-dialog-content>

      <!-- Dialog Actions -->
      <mat-dialog-actions class="dialog-actions">
        <button mat-button (click)="onClose()" class="close-action">
          <mat-icon>close</mat-icon>
          Close
        </button>
        <button
          mat-raised-button
          color="primary"
          (click)="onEdit()"
          class="edit-action"
        >
          <mat-icon>edit</mat-icon>
          Edit Notification
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    `
      .view-dialog {
        min-width: 700px;
        max-width: 1000px;
        padding: 0;
        background: #fafafa;
      }

      /* Dialog Header */
      .dialog-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 24px 24px 16px;
        background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
        color: white;
        border-radius: 4px 4px 0 0;
      }

      .header-content {
        display: flex;
        align-items: center;
        gap: 16px;
        flex: 1;
      }

      .header-icon {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .header-icon mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
      }

      .header-icon .info-icon {
        color: #2196f3;
      }
      .header-icon .warning-icon {
        color: #ff9800;
      }
      .header-icon .error-icon {
        color: #f44336;
      }
      .header-icon .success-icon {
        color: #4caf50;
      }

      .header-text h2 {
        margin: 0;
        font-size: 24px;
        font-weight: 500;
      }

      .header-subtitle {
        margin: 4px 0 0 0;
        opacity: 0.9;
        font-size: 14px;
      }

      .header-status .read-status {
        background-color: #4caf50;
      }
      .header-status .unread-status {
        background-color: #ff9800;
      }
      .header-status .archived-status {
        background-color: #9e9e9e;
      }

      .close-button {
        color: white;
        margin-top: -8px;
      }

      .close-button:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      /* Dialog Content */
      .dialog-content {
        padding: 24px;
        max-height: 70vh;
        overflow-y: auto;
        background: white;
        margin: 0;
      }

      .details-container {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      /* Card Styles */
      mat-card {
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      mat-card-header {
        background: #f8f9fa;
        margin: -16px -16px 16px -16px;
        padding: 16px;
        border-radius: 8px 8px 0 0;
      }

      mat-card-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        font-weight: 500;
        color: #333;
      }

      mat-card-title mat-icon {
        color: #1976d2;
        font-size: 20px;
      }

      /* Info Grid */
      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 20px;
      }

      .info-item {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .info-item.full-width {
        grid-column: 1 / -1;
      }

      .info-label {
        font-weight: 500;
        color: #666;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .info-value {
        font-size: 14px;
        line-height: 1.5;
      }

      .info-value.primary-text {
        font-weight: 500;
        color: #1976d2;
        font-size: 16px;
      }

      .message-content {
        background: #f5f5f5;
        padding: 12px;
        border-radius: 4px;
        border-left: 4px solid #1976d2;
        white-space: pre-wrap;
        word-break: break-word;
      }

      .user-id {
        background: #e3f2fd;
        padding: 4px 8px;
        border-radius: 4px;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        color: #1976d2;
      }

      .action-link {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: #1976d2;
        text-decoration: none;
        padding: 8px 12px;
        background: #f5f5f5;
        border-radius: 4px;
        border: 1px solid #e0e0e0;
        transition: all 0.2s ease;
      }

      .action-link:hover {
        background: #e3f2fd;
        border-color: #1976d2;
        text-decoration: none;
      }

      .external-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      .section-divider {
        margin: 20px 0;
      }

      /* Status Grid */
      .status-grid {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .status-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 16px;
        background: #f8f9fa;
        border-radius: 8px;
        border-left: 4px solid #ddd;
      }

      .status-header {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .status-label {
        font-weight: 500;
        color: #666;
      }

      .status-value {
        text-align: right;
      }

      .status-value strong {
        display: block;
        margin-bottom: 4px;
      }

      .timestamp {
        font-size: 12px;
        color: #999;
      }

      .read-icon {
        color: #4caf50;
      }
      .unread-icon {
        color: #ff9800;
      }
      .archived-icon {
        color: #9e9e9e;
      }
      .active-icon {
        color: #2196f3;
      }
      .expired-icon {
        color: #f44336;
      }

      /* Chip Styles */
      .type-info {
        background-color: #2196f3;
        color: white;
      }
      .type-warning {
        background-color: #ff9800;
        color: white;
      }
      .type-error {
        background-color: #f44336;
        color: white;
      }
      .type-success {
        background-color: #4caf50;
        color: white;
      }

      .priority-low {
        background-color: #4caf50;
        color: white;
      }
      .priority-normal {
        background-color: #2196f3;
        color: white;
      }
      .priority-high {
        background-color: #ff9800;
        color: white;
      }
      .priority-urgent {
        background-color: #f44336;
        color: white;
      }

      .status-read {
        background-color: #4caf50;
        color: white;
      }
      .status-unread {
        background-color: #ff9800;
        color: white;
      }
      .status-archived {
        background-color: #9e9e9e;
        color: white;
      }

      /* JSON Viewer */
      .json-viewer {
        background: #f5f5f5;
        border-radius: 4px;
        padding: 16px;
        border-left: 4px solid #ff9800;
        overflow-x: auto;
      }

      .json-viewer pre {
        margin: 0;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        color: #333;
      }

      /* System Grid */
      .system-grid {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .system-item {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .system-label {
        font-weight: 500;
        color: #666;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .system-value {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .id-code {
        background: #e8eaf6;
        padding: 6px 12px;
        border-radius: 4px;
        font-family: 'Courier New', monospace;
        font-size: 11px;
        color: #3f51b5;
        flex: 1;
      }

      .copy-btn {
        width: 32px;
        height: 32px;
      }

      .copy-btn mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      .timestamp-full {
        font-size: 13px;
        color: #555;
      }

      /* Dialog Actions */
      .dialog-actions {
        padding: 16px 24px;
        background: #f8f9fa;
        border-top: 1px solid #e0e0e0;
        gap: 12px;
        margin: 0;
      }

      .close-action,
      .edit-action {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 24px;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .view-dialog {
          min-width: 95vw;
          max-width: 95vw;
        }

        .dialog-header {
          padding: 16px;
        }

        .header-content {
          gap: 12px;
        }

        .header-icon {
          width: 48px;
          height: 48px;
        }

        .header-icon mat-icon {
          font-size: 24px;
          width: 24px;
          height: 24px;
        }

        .dialog-content {
          padding: 16px;
          max-height: 60vh;
        }

        .info-grid {
          grid-template-columns: 1fr;
        }

        .status-item {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }

        .status-value {
          text-align: left;
        }

        .dialog-actions {
          padding: 12px 16px;
          flex-direction: column;
        }

        .close-action,
        .edit-action {
          width: 100%;
          justify-content: center;
        }
      }

      @media (max-width: 480px) {
        .view-dialog {
          min-width: 100vw;
          max-width: 100vw;
          margin: 0;
          max-height: 100vh;
        }

        .dialog-content {
          max-height: calc(100vh - 200px);
        }
      }
    `,
  ],
})
export class NotificationViewDialogComponent {
  private dialogRef = inject(MatDialogRef<NotificationViewDialogComponent>);
  protected data = inject<NotificationViewDialogData>(MAT_DIALOG_DATA);

  onClose() {
    this.dialogRef.close();
  }

  onEdit() {
    this.dialogRef.close({ action: 'edit', data: this.data.notifications });
  }

  getNotificationIcon(): string {
    switch (this.data.notifications.type?.toLowerCase()) {
      case 'info':
        return 'info';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'success':
        return 'check_circle';
      default:
        return 'notifications';
    }
  }

  getNotificationIconClass(): string {
    switch (this.data.notifications.type?.toLowerCase()) {
      case 'info':
        return 'info-icon';
      case 'warning':
        return 'warning-icon';
      case 'error':
        return 'error-icon';
      case 'success':
        return 'success-icon';
      default:
        return 'info-icon';
    }
  }

  getStatusIcon(): string {
    if (this.data.notifications.archived) return 'archive';
    return this.data.notifications.read
      ? 'mark_email_read'
      : 'mark_email_unread';
  }

  getStatusText(): string {
    if (this.data.notifications.archived) return 'Archived';
    return this.data.notifications.read ? 'Read' : 'Unread';
  }

  getStatusChipClass(): string {
    if (this.data.notifications.archived) return 'status-archived';
    return this.data.notifications.read ? 'status-read' : 'status-unread';
  }

  getTypeIcon(): string {
    switch (this.data.notifications.type?.toLowerCase()) {
      case 'info':
        return 'info';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'success':
        return 'check_circle';
      default:
        return 'notifications';
    }
  }

  getTypeChipClass(): string {
    switch (this.data.notifications.type?.toLowerCase()) {
      case 'info':
        return 'type-info';
      case 'warning':
        return 'type-warning';
      case 'error':
        return 'type-error';
      case 'success':
        return 'type-success';
      default:
        return 'type-info';
    }
  }

  getPriorityIcon(): string {
    switch (this.data.notifications.priority?.toLowerCase()) {
      case 'low':
        return 'keyboard_arrow_down';
      case 'normal':
        return 'remove';
      case 'high':
        return 'keyboard_arrow_up';
      case 'urgent':
        return 'priority_high';
      default:
        return 'remove';
    }
  }

  getPriorityChipClass(): string {
    switch (this.data.notifications.priority?.toLowerCase()) {
      case 'low':
        return 'priority-low';
      case 'normal':
        return 'priority-normal';
      case 'high':
        return 'priority-high';
      case 'urgent':
        return 'priority-urgent';
      default:
        return 'priority-normal';
    }
  }

  isExpired(): boolean {
    if (!this.data.notifications.expires_at) return false;
    return new Date(this.data.notifications.expires_at) < new Date();
  }

  async copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      // Could show a snackbar notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }
}
