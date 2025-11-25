import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Confirm Dialog Example
 *
 * Demonstrates:
 * - Custom confirmation dialog with warning styling
 * - Using header gradient classes
 * - Icon with gradient background
 * - Warning box for additional context
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title class="ax-header ax-header-gradient-error">
      <div class="ax-icon-error">
        <mat-icon>warning</mat-icon>
      </div>
      <div class="header-text">
        <div class="ax-title">Delete Confirmation</div>
        <div class="ax-subtitle">This action cannot be undone</div>
      </div>
    </h2>

    <mat-dialog-content>
      <p class="text-md text-secondary mb-4">
        Are you sure you want to permanently delete this item? All associated
        data will be lost.
      </p>

      <!-- Warning Box -->
      <div
        class="p-4 bg-warning-faint border border-warning-muted rounded-lg flex gap-3"
      >
        <mat-icon class="text-warning flex-shrink-0">info</mat-icon>
        <div>
          <p class="text-sm font-semibold text-heading m-0 mb-2">
            This will permanently delete:
          </p>
          <ul class="text-sm text-secondary space-y-1 m-0 pl-5">
            <li>All associated data and files</li>
            <li>User access permissions</li>
            <li>Historical records and logs</li>
          </ul>
        </div>
      </div>

      <p class="text-sm text-secondary mt-4 mb-0">
        <strong>Note:</strong> You can export your data before deletion from the
        settings page.
      </p>
    </mat-dialog-content>

    <div mat-dialog-actions align="end" class="flex gap-2">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-flat-button color="warn" (click)="onConfirm()">
        <mat-icon>delete_forever</mat-icon>
        Delete Permanently
      </button>
    </div>
  `,
  styles: [], // No styles needed! Global dialog styles handle everything
})
export class ConfirmDialogComponent {
  private dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
