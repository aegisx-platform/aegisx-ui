import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService, UserStatus } from '../services/user.service';

interface BulkStatusChangeDialogData {
  selectedUserCount: number;
}

@Component({
  selector: 'ax-bulk-status-change-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  template: `
    <h2 mat-dialog-title>Change User Status</h2>

    <mat-dialog-content class="mat-dialog-content">
      <p class="dialog-description">
        You are about to change the status of
        <strong>{{ data.selectedUserCount }} user(s)</strong>.
      </p>

      <form [formGroup]="statusForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>New Status</mat-label>
          <mat-select formControlName="status">
            <mat-option value="active">
              <mat-icon class="status-icon-active">check_circle</mat-icon>
              Active
            </mat-option>
            <mat-option value="inactive">
              <mat-icon class="status-icon-inactive">cancel</mat-icon>
              Inactive
            </mat-option>
            <mat-option value="suspended">
              <mat-icon class="status-icon-suspended">block</mat-icon>
              Suspended
            </mat-option>
            <mat-option value="pending">
              <mat-icon class="status-icon-pending">schedule</mat-icon>
              Pending
            </mat-option>
          </mat-select>
          <mat-error *ngIf="statusForm.get('status')?.hasError('required')">
            Status is required
          </mat-error>
        </mat-form-field>
      </form>

      <div class="dialog-info-box">
        <mat-icon class="info-icon">info</mat-icon>
        <span class="info-text"
          >Please note: Some operations may fail if users cannot be transitioned
          to the selected status.</span
        >
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button
        mat-button
        type="button"
        (click)="onCancel()"
        [disabled]="isSubmitting()"
      >
        Cancel
      </button>
      <button
        mat-flat-button
        color="primary"
        (click)="onSubmit()"
        [disabled]="statusForm.invalid || isSubmitting()"
      >
        @if (isSubmitting()) {
          <mat-spinner diameter="20" class="spinner-inline"></mat-spinner>
        }
        Change Status
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .mat-dialog-content {
        max-height: 80vh;
        overflow-y: auto;
        padding: var(--ax-spacing-xl);
        min-width: 400px;
      }

      .dialog-description {
        margin-bottom: var(--ax-spacing-lg);
        color: var(--ax-text-default);
      }

      .full-width {
        width: 100%;
        margin-bottom: var(--ax-spacing-sm);
      }

      .dialog-info-box {
        margin-top: var(--ax-spacing-lg);
        padding: var(--ax-spacing-md);
        background-color: var(--ax-warning-subtle);
        border: 1px solid var(--ax-warning-muted);
        border-radius: var(--ax-radius-md);
        font-size: var(--ax-font-size-sm);
        display: flex;
        align-items: flex-start;
        gap: var(--ax-spacing-sm);
      }

      .info-icon {
        color: var(--ax-warning-emphasis);
        flex-shrink: 0;
      }

      .info-text {
        flex: 1;
        color: var(--ax-text-default);
      }

      .status-icon-active {
        color: var(--ax-success-emphasis);
        margin-right: var(--ax-spacing-sm);
      }

      .status-icon-inactive {
        color: var(--ax-text-subtle);
        margin-right: var(--ax-spacing-sm);
      }

      .status-icon-suspended {
        color: var(--ax-error-emphasis);
        margin-right: var(--ax-spacing-sm);
      }

      .status-icon-pending {
        color: var(--ax-warning-emphasis);
        margin-right: var(--ax-spacing-sm);
      }

      .spinner-inline {
        display: inline-block;
        margin-right: var(--ax-spacing-sm);
      }

      @media (max-width: 768px) {
        .mat-dialog-content {
          min-width: auto;
        }
      }
    `,
  ],
})
export class BulkStatusChangeDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<BulkStatusChangeDialogComponent>);
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);

  data = inject<BulkStatusChangeDialogData>(MAT_DIALOG_DATA);

  isSubmitting = () => false; // Will be updated dynamically

  statusForm = this.fb.group({
    status: ['', Validators.required],
  });

  async onSubmit() {
    if (this.statusForm.invalid) return;

    const status = this.statusForm.value.status as UserStatus;
    // Note: selected user IDs should be passed from the list component
    // This dialog component is responsible for status selection only
    this.dialogRef.close(status);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
