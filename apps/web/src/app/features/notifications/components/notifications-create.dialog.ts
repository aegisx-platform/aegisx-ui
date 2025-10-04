import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { NotificationService } from '../services/notifications.service';
import { CreateNotificationRequest } from '../types/notification.types';
import {
  NotificationFormComponent,
  NotificationFormData,
} from './notifications-form.component';

@Component({
  selector: 'app-notifications-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NotificationFormComponent,
  ],
  template: `
    <div class="create-dialog">
      <!-- Dialog Header -->
      <div class="dialog-header">
        <div class="header-content">
          <div class="header-icon">
            <mat-icon>add_alert</mat-icon>
          </div>
          <div class="header-text">
            <h2 mat-dialog-title>Create New Notification</h2>
            <p class="header-subtitle">Add a new notification to the system</p>
          </div>
        </div>
        <button
          mat-icon-button
          (click)="onCancel()"
          [disabled]="loading()"
          class="close-button"
          matTooltip="Close dialog"
        >
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Dialog Content -->
      <mat-dialog-content class="dialog-content">
        <!-- Loading Overlay -->
        <div *ngIf="loading()" class="loading-overlay">
          <mat-progress-spinner mode="indeterminate" diameter="40">
          </mat-progress-spinner>
          <p>Creating notification...</p>
        </div>

        <!-- Form -->
        <app-notifications-form
          mode="create"
          [loading]="loading()"
          (formSubmit)="onFormSubmit($event)"
          (formCancel)="onCancel()"
          class="notification-form"
        ></app-notifications-form>
      </mat-dialog-content>
    </div>
  `,
  styles: [
    `
      .create-dialog {
        min-width: 600px;
        max-width: 900px;
        padding: 0;
        background: #fafafa;
      }

      /* Dialog Header */
      .dialog-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 24px 24px 16px;
        background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
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
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .header-icon mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
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

      .close-button {
        color: white;
        margin-top: -8px;
      }

      .close-button:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      /* Dialog Content */
      .dialog-content {
        position: relative;
        padding: 24px;
        max-height: 70vh;
        overflow-y: auto;
        background: white;
        margin: 0;
      }

      /* Loading Overlay */
      .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 16px;
        z-index: 10;
        backdrop-filter: blur(2px);
      }

      .loading-overlay p {
        margin: 0;
        color: #666;
        font-weight: 500;
      }

      /* Form Styling */
      .notification-form {
        width: 100%;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .create-dialog {
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
          width: 40px;
          height: 40px;
        }

        .header-icon mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }

        .header-text h2 {
          font-size: 20px;
        }

        .header-subtitle {
          font-size: 13px;
        }

        .dialog-content {
          padding: 16px;
          max-height: 60vh;
        }
      }

      @media (max-width: 480px) {
        .create-dialog {
          min-width: 100vw;
          max-width: 100vw;
          margin: 0;
          max-height: 100vh;
        }

        .dialog-content {
          max-height: calc(100vh - 120px);
        }
      }
    `,
  ],
})
export class NotificationCreateDialogComponent {
  private notificationsService = inject(NotificationService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<NotificationCreateDialogComponent>);

  loading = signal<boolean>(false);

  async onFormSubmit(formData: NotificationFormData) {
    this.loading.set(true);

    try {
      const createRequest = formData as CreateNotificationRequest;
      const result =
        await this.notificationsService.createNotification(createRequest);

      if (result) {
        this.snackBar.open('Notification created successfully', 'Close', {
          duration: 3000,
        });
        this.dialogRef.close(result);
      } else {
        this.snackBar.open('Failed to create notification', 'Close', {
          duration: 5000,
        });
      }
    } catch (error: any) {
      this.snackBar.open(
        error.message || 'Failed to create notification',
        'Close',
        { duration: 5000 },
      );
    } finally {
      this.loading.set(false);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
