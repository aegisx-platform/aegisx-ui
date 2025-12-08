import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

import {
  BudgetCategorie,
  CreateBudgetCategorieRequest,
  UpdateBudgetCategorieRequest,
} from '../types/budget-categories.types';

export type BudgetCategorieFormMode = 'create' | 'edit';

export interface BudgetCategorieFormData {
  category_code: string;
  category_name: string;
  accounting_code?: string;
  description?: string;
  is_active?: boolean;
}

@Component({
  selector: 'app-budget-categories-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatOptionModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  template: `
    <!-- Dialog Content -->
    <mat-dialog-content>
      <form [formGroup]="budgetCategoriesForm" class="budget-categories-form">
        <!-- Form Fields Section -->
        <div class="ax-dialog-section">
          <h3 class="ax-dialog-section-title">BudgetCategorie Information</h3>
          <div class="ax-dialog-section-content">
            <div class="form-grid">
              <!-- category_code Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Category Code</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="category_code"
                  placeholder="Enter category code"
                />
                <mat-error
                  *ngIf="
                    budgetCategoriesForm
                      .get('category_code')
                      ?.hasError('required')
                  "
                >
                  Category Code is required
                </mat-error>
              </mat-form-field>

              <!-- category_name Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Category Name</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="category_name"
                  placeholder="Enter category name"
                />
                <mat-error
                  *ngIf="
                    budgetCategoriesForm
                      .get('category_name')
                      ?.hasError('required')
                  "
                >
                  Category Name is required
                </mat-error>
              </mat-form-field>

              <!-- accounting_code Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Accounting Code</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="accounting_code"
                  placeholder="Enter accounting code"
                />
              </mat-form-field>

              <!-- description Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Description</mat-label>
                <textarea
                  matInput
                  formControlName="description"
                  placeholder="Enter description"
                  rows="3"
                ></textarea>
                <mat-error
                  *ngIf="
                    budgetCategoriesForm
                      .get('description')
                      ?.hasError('maxlength')
                  "
                >
                  Description must be less than 1000 characters
                </mat-error>
              </mat-form-field>

              <!-- is_active Field -->
              <div class="checkbox-field">
                <mat-checkbox formControlName="is_active">
                  Is Active
                </mat-checkbox>
              </div>
            </div>
          </div>
        </div>
      </form>
    </mat-dialog-content>

    <!-- Form Actions - Outside mat-dialog-content, proper mat-dialog-actions -->
    <mat-dialog-actions align="end">
      <button
        mat-button
        type="button"
        (click)="onCancel()"
        [disabled]="loading"
      >
        Cancel
      </button>
      <button
        mat-flat-button
        color="primary"
        type="button"
        (click)="onSubmit()"
        [disabled]="
          budgetCategoriesForm.invalid ||
          loading ||
          (mode === 'edit' && !hasChanges())
        "
      >
        @if (loading) {
          <mat-spinner diameter="20" class="inline-spinner"></mat-spinner>
        }
        {{ mode === 'create' ? 'Create' : 'Update' }} BudgetCategorie
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      /* Form Container */
      .budget-categories-form {
        display: flex;
        flex-direction: column;
      }

      /* Responsive Grid Layout for Form Fields */
      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--ax-spacing-md, 16px);
      }

      .full-width {
        width: 100%;
      }

      /* Checkbox Field */
      .checkbox-field {
        display: flex;
        align-items: center;
        min-height: 56px;
        padding: var(--ax-spacing-sm, 8px) 0;
      }

      .inline-spinner {
        margin-right: 8px;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .form-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class BudgetCategorieFormComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);

  @Input() mode: BudgetCategorieFormMode = 'create';
  @Input() initialData?: BudgetCategorie;
  @Input() loading = false;

  @Output() formSubmit = new EventEmitter<BudgetCategorieFormData>();
  @Output() formCancel = new EventEmitter<void>();

  private originalFormValue: any;

  budgetCategoriesForm: FormGroup = this.fb.group({
    category_code: ['', [Validators.required]],
    category_name: ['', [Validators.required]],
    accounting_code: ['', []],
    description: ['', [Validators.maxLength(1000)]],
    is_active: [false, []],
  });

  ngOnInit() {
    if (this.mode === 'edit' && this.initialData) {
      this.populateForm(this.initialData);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialData'] && this.initialData && this.mode === 'edit') {
      this.populateForm(this.initialData);
    }
  }

  private populateForm(budgetCategories: BudgetCategorie) {
    const formValue = {
      category_code: budgetCategories.category_code,
      category_name: budgetCategories.category_name,
      accounting_code: budgetCategories.accounting_code,
      description: budgetCategories.description,
      is_active: budgetCategories.is_active,
    };

    this.budgetCategoriesForm.patchValue(formValue);
    this.originalFormValue = this.budgetCategoriesForm.value;
  }

  hasChanges(): boolean {
    if (this.mode === 'create') return true;
    const currentValue = this.budgetCategoriesForm.value;
    return (
      JSON.stringify(currentValue) !== JSON.stringify(this.originalFormValue)
    );
  }

  onSubmit() {
    if (this.budgetCategoriesForm.valid) {
      const formData = {
        ...this.budgetCategoriesForm.value,
      } as BudgetCategorieFormData;

      this.formSubmit.emit(formData);
    }
  }

  onCancel() {
    this.formCancel.emit();
  }
}
