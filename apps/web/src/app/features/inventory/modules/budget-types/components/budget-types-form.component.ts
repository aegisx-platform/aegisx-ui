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
  BudgetType,
  CreateBudgetTypeRequest,
  UpdateBudgetTypeRequest,
} from '../types/budget-types.types';

export type BudgetTypeFormMode = 'create' | 'edit';

export interface BudgetTypeFormData {
  type_code: string;
  type_name: string;
  budget_class: string;
  description?: string;
  is_active?: boolean;
}

@Component({
  selector: 'app-budget-types-form',
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
      <form [formGroup]="budgetTypesForm" class="budget-types-form">
        <!-- Form Fields Section -->
        <div class="ax-dialog-section">
          <h3 class="ax-dialog-section-title">BudgetType Information</h3>
          <div class="ax-dialog-section-content">
            <div class="form-grid">
              <!-- type_code Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Type Code</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="type_code"
                  placeholder="Enter type code"
                />
                <mat-error
                  *ngIf="budgetTypesForm.get('type_code')?.hasError('required')"
                >
                  Type Code is required
                </mat-error>
              </mat-form-field>

              <!-- type_name Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Type Name</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="type_name"
                  placeholder="Enter type name"
                />
                <mat-error
                  *ngIf="budgetTypesForm.get('type_name')?.hasError('required')"
                >
                  Type Name is required
                </mat-error>
              </mat-form-field>

              <!-- budget_class Field -->
              <!-- FK reference not found, render as plain text input -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Budget Class</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="budget_class"
                  placeholder="Enter budget class"
                />
                <mat-error
                  *ngIf="
                    budgetTypesForm.get('budget_class')?.hasError('required')
                  "
                >
                  Budget Class is required
                </mat-error>
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
                    budgetTypesForm.get('description')?.hasError('maxlength')
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
          budgetTypesForm.invalid ||
          loading ||
          (mode === 'edit' && !hasChanges())
        "
      >
        @if (loading) {
          <mat-spinner diameter="20" class="inline-spinner"></mat-spinner>
        }
        {{ mode === 'create' ? 'Create' : 'Update' }} BudgetType
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      /* Form Container */
      .budget-types-form {
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
export class BudgetTypeFormComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);

  @Input() mode: BudgetTypeFormMode = 'create';
  @Input() initialData?: BudgetType;
  @Input() loading = false;

  @Output() formSubmit = new EventEmitter<BudgetTypeFormData>();
  @Output() formCancel = new EventEmitter<void>();

  private originalFormValue: any;

  budgetTypesForm: FormGroup = this.fb.group({
    type_code: ['', [Validators.required]],
    type_name: ['', [Validators.required]],
    budget_class: ['', [Validators.required]],
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

  private populateForm(budgetTypes: BudgetType) {
    const formValue = {
      type_code: budgetTypes.type_code,
      type_name: budgetTypes.type_name,
      budget_class: budgetTypes.budget_class,
      description: budgetTypes.description,
      is_active: budgetTypes.is_active,
    };

    this.budgetTypesForm.patchValue(formValue);
    this.originalFormValue = this.budgetTypesForm.value;
  }

  hasChanges(): boolean {
    if (this.mode === 'create') return true;
    const currentValue = this.budgetTypesForm.value;
    return (
      JSON.stringify(currentValue) !== JSON.stringify(this.originalFormValue)
    );
  }

  onSubmit() {
    if (this.budgetTypesForm.valid) {
      const formData = { ...this.budgetTypesForm.value } as BudgetTypeFormData;

      this.formSubmit.emit(formData);
    }
  }

  onCancel() {
    this.formCancel.emit();
  }
}
