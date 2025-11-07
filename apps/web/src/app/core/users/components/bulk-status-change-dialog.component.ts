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
      <p class="mb-4">
        You are about to change the status of
        <strong>{{ data.selectedUserCount }} user(s)</strong>.
      </p>

      <form [formGroup]="statusForm">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>New Status</mat-label>
          <mat-select formControlName="status">
            <mat-option value="active">
              <mat-icon class="text-green-600 mr-2">check_circle</mat-icon>
              Active
            </mat-option>
            <mat-option value="inactive">
              <mat-icon class="text-gray-500 mr-2">cancel</mat-icon>
              Inactive
            </mat-option>
            <mat-option value="suspended">
              <mat-icon class="text-red-600 mr-2">block</mat-icon>
              Suspended
            </mat-option>
            <mat-option value="pending">
              <mat-icon class="text-yellow-600 mr-2">schedule</mat-icon>
              Pending
            </mat-option>
          </mat-select>
          <mat-error *ngIf="statusForm.get('status')?.hasError('required')">
            Status is required
          </mat-error>
        </mat-form-field>
      </form>

      <div class="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-sm">
        <mat-icon class="text-amber-600 align-top">info</mat-icon>
        <span class="ml-2"
          >Please note: Some operations may fail if users cannot be
          transitioned to the selected status.</span
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
        mat-raised-button
        color="primary"
        (click)="onSubmit()"
        [disabled]="statusForm.invalid || isSubmitting()"
      >
        @if (isSubmitting()) {
          <mat-spinner diameter="20" class="inline mr-2"></mat-spinner>
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
        padding: 24px;
        min-width: 400px;
      }

      @media (max-width: 768px) {
        .mat-dialog-content {
          min-width: auto;
        }
      }

      mat-form-field {
        margin-bottom: 8px;
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
