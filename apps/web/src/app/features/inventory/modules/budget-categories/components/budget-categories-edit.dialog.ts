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

import { BudgetCategorieService } from '../services/budget-categories.service';
import {
  BudgetCategorie,
  UpdateBudgetCategorieRequest,
} from '../types/budget-categories.types';
import {
  BudgetCategorieFormComponent,
  BudgetCategorieFormData,
} from './budget-categories-form.component';

export interface BudgetCategorieEditDialogData {
  budgetCategories: BudgetCategorie;
}

@Component({
  selector: 'app-budget-categories-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    BudgetCategorieFormComponent,
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
        <div class="ax-title">Edit BudgetCategorie</div>
        <div class="ax-subtitle">Update budgetcategorie information</div>
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
    <app-budget-categories-form
      mode="edit"
      [initialData]="data.budgetCategories"
      [loading]="loading()"
      (formSubmit)="onFormSubmit($event)"
      (formCancel)="onCancel()"
    ></app-budget-categories-form>
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
export class BudgetCategorieEditDialogComponent implements OnInit {
  private budgetCategoriesService = inject(BudgetCategorieService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<BudgetCategorieEditDialogComponent>);
  public data = inject<BudgetCategorieEditDialogData>(MAT_DIALOG_DATA);

  loading = signal<boolean>(false);

  ngOnInit() {
    // No additional setup needed since shared form handles data population
  }

  async onFormSubmit(formData: BudgetCategorieFormData) {
    this.loading.set(true);

    try {
      // Cast through unknown to handle form data type conversion (form values may be strings)
      const updateRequest = formData as unknown as UpdateBudgetCategorieRequest;
      const result = await this.budgetCategoriesService.updateBudgetCategorie(
        this.data.budgetCategories.id,
        updateRequest,
      );

      if (result) {
        this.snackBar.open('BudgetCategorie updated successfully', 'Close', {
          duration: 3000,
        });
        this.dialogRef.close(result);
      } else {
        this.snackBar.open('Failed to update budgetcategorie', 'Close', {
          duration: 5000,
        });
      }
    } catch (error: any) {
      const errorMessage = this.budgetCategoriesService.permissionError()
        ? 'You do not have permission to update budgetcategorie'
        : error?.message || 'Failed to update budgetcategorie';
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
