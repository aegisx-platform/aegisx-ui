import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cleanup-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title>
      <div class="flex items-center gap-2">
        <mat-icon class="text-orange-600">delete_sweep</mat-icon>
        <span>Cleanup Old Error Logs</span>
      </div>
    </h2>

    <mat-dialog-content class="py-6">
      <p class="text-slate-600 mb-4">
        Delete error logs older than a specified number of days. This action
        cannot be undone.
      </p>

      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Delete logs older than (days)</mat-label>
        <input
          matInput
          type="number"
          [formControl]="daysControl"
          placeholder="Enter number of days"
          min="1"
          max="365"
        />
        <mat-icon matPrefix>calendar_today</mat-icon>
        <mat-hint>Between 1 and 365 days</mat-hint>
        @if (daysControl.invalid && daysControl.touched) {
          <mat-error>
            @if (daysControl.errors?.['required']) {
              Number of days is required
            }
            @if (daysControl.errors?.['min']) {
              Minimum value is 1 day
            }
            @if (daysControl.errors?.['max']) {
              Maximum value is 365 days
            }
          </mat-error>
        }
      </mat-form-field>

      <div class="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <div class="flex items-start gap-2">
          <mat-icon class="text-amber-600 text-lg mt-0.5">warning</mat-icon>
          <div class="text-sm text-amber-800">
            <strong>Warning:</strong> This will permanently delete all error
            logs older than {{ daysControl.value || 0 }} days. This action
            cannot be undone.
          </div>
        </div>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="gap-2 pb-4 px-6">
      <button mat-stroked-button (click)="onCancel()" class="border-slate-300">
        Cancel
      </button>
      <button
        mat-flat-button
        color="warn"
        (click)="onConfirm()"
        [disabled]="daysControl.invalid"
        class="bg-red-600 hover:bg-red-700 text-white"
      >
        <mat-icon>delete_forever</mat-icon>
        Delete Old Logs
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      mat-dialog-content {
        min-width: 400px;
        max-width: 500px;
      }
    `,
  ],
})
export class CleanupDialogComponent {
  private dialogRef = inject(MatDialogRef<CleanupDialogComponent>);

  daysControl = new FormControl<number>(30, [
    Validators.required,
    Validators.min(1),
    Validators.max(365),
  ]);

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.daysControl.valid && this.daysControl.value !== null) {
      this.dialogRef.close(this.daysControl.value);
    }
  }
}
