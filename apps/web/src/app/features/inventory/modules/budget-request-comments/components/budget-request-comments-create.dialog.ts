import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BudgetRequestCommentService } from '../services/budget-request-comments.service';
import { CreateBudgetRequestCommentRequest } from '../types/budget-request-comments.types';
import {
  BudgetRequestCommentFormComponent,
  BudgetRequestCommentFormData,
} from './budget-request-comments-form.component';

@Component({
  selector: 'app-budget-request-comments-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    BudgetRequestCommentFormComponent,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <!-- Dialog Header -->
    <h2 mat-dialog-title class="ax-header ax-header-info">
      <div class="ax-icon-info">
        <mat-icon>add_circle</mat-icon>
      </div>
      <div class="header-text">
        <div class="ax-title">Create New BudgetRequestComment</div>
        <div class="ax-subtitle">
          Add a new budgetrequestcomment to your collection
        </div>
      </div>
      <button
        type="button"
        mat-icon-button
        [mat-dialog-close]="false"
        aria-label="Close dialog"
      >
        <mat-icon>close</mat-icon>
      </button>
    </h2>

    <!-- Dialog Content - Form component handles mat-dialog-content and mat-dialog-actions -->
    <app-budget-request-comments-form
      mode="create"
      [loading]="loading()"
      (formSubmit)="onFormSubmit($event)"
      (formCancel)="onCancel()"
    ></app-budget-request-comments-form>
  `,
  styles: [
    `
      /* Header text wrapper for flex layout */
      .header-text {
        flex: 1;
        min-width: 0;
      }
    `,
  ],
})
export class BudgetRequestCommentCreateDialogComponent {
  private budgetRequestCommentsService = inject(BudgetRequestCommentService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(
    MatDialogRef<BudgetRequestCommentCreateDialogComponent>,
  );

  loading = signal<boolean>(false);

  async onFormSubmit(formData: BudgetRequestCommentFormData) {
    this.loading.set(true);

    try {
      // Cast through unknown to handle form data type conversion (form values may be strings)
      const createRequest =
        formData as unknown as CreateBudgetRequestCommentRequest;
      const result =
        await this.budgetRequestCommentsService.createBudgetRequestComment(
          createRequest,
        );

      if (result) {
        this.snackBar.open(
          'BudgetRequestComment created successfully',
          'Close',
          {
            duration: 3000,
          },
        );
        this.dialogRef.close(result);
      } else {
        this.snackBar.open('Failed to create budgetrequestcomment', 'Close', {
          duration: 5000,
        });
      }
    } catch (error: any) {
      const errorMessage = this.budgetRequestCommentsService.permissionError()
        ? 'You do not have permission to create budgetrequestcomment'
        : error?.message || 'Failed to create budgetrequestcomment';
      this.snackBar.open(errorMessage, 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
    } finally {
      this.loading.set(false);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
