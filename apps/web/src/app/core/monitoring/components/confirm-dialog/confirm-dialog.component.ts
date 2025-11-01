import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'accent' | 'warn';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>
      <div class="flex items-center gap-2">
        <mat-icon [class]="iconClass">{{ icon }}</mat-icon>
        <span>{{ data.title }}</span>
      </div>
    </h2>

    <mat-dialog-content class="py-6">
      <p class="text-slate-600">{{ data.message }}</p>
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="gap-2 pb-4 px-6">
      <button mat-stroked-button (click)="onCancel()" class="border-slate-300">
        {{ data.cancelText || 'Cancel' }}
      </button>
      <button
        mat-flat-button
        [color]="data.confirmColor || 'warn'"
        (click)="onConfirm()"
      >
        {{ data.confirmText || 'Confirm' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      mat-dialog-content {
        min-width: 350px;
      }
    `,
  ],
})
export class ConfirmDialogComponent {
  private dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData) {}

  get icon(): string {
    return this.data.confirmColor === 'warn' ? 'warning' : 'help_outline';
  }

  get iconClass(): string {
    return this.data.confirmColor === 'warn'
      ? 'text-orange-600'
      : 'text-blue-600';
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
