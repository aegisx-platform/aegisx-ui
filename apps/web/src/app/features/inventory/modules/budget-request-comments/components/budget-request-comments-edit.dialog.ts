import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { BudgetRequestCommentService } from '../services/budget-request-comments.service';
import {
  BudgetRequestComment,
  UpdateBudgetRequestCommentRequest,
} from '../types/budget-request-comments.types';
import {
  BudgetRequestCommentFormComponent,
  BudgetRequestCommentFormData,
} from './budget-request-comments-form.component';

export interface BudgetRequestCommentEditDialogData {
  budgetRequestComments: BudgetRequestComment;
}

@Component({
  selector: 'app-budget-request-comments-edit-dialog',
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
    <h2 mat-dialog-title class="ax-header ax-header-warning">
      <div class="ax-icon-warning">
        <mat-icon>edit</mat-icon>
      </div>
      <div class="header-text">
        <div class="ax-title">Edit BudgetRequestComment</div>
        <div class="ax-subtitle">Update budgetrequestcomment information</div>
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
      mode="edit"
      [initialData]="data.budgetRequestComments"
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
export class BudgetRequestCommentEditDialogComponent implements OnInit {
  private budgetRequestCommentsService = inject(BudgetRequestCommentService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(
    MatDialogRef<BudgetRequestCommentEditDialogComponent>,
  );
  public data = inject<BudgetRequestCommentEditDialogData>(MAT_DIALOG_DATA);

  loading = signal<boolean>(false);

  ngOnInit() {
    // No additional setup needed since shared form handles data population
  }

  async onFormSubmit(formData: BudgetRequestCommentFormData) {
    this.loading.set(true);

    try {
      // Cast through unknown to handle form data type conversion (form values may be strings)
      const updateRequest =
        formData as unknown as UpdateBudgetRequestCommentRequest;
      const result =
        await this.budgetRequestCommentsService.updateBudgetRequestComment(
          this.data.budgetRequestComments.id,
          updateRequest,
        );

      if (result) {
        this.snackBar.open(
          'BudgetRequestComment updated successfully',
          'Close',
          {
            duration: 3000,
          },
        );
        this.dialogRef.close(result);
      } else {
        this.snackBar.open('Failed to update budgetrequestcomment', 'Close', {
          duration: 5000,
        });
      }
    } catch (error: any) {
      const errorMessage = this.budgetRequestCommentsService.permissionError()
        ? 'You do not have permission to update budgetrequestcomment'
        : error?.message || 'Failed to update budgetrequestcomment';
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
