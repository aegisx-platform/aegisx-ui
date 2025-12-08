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
  BudgetAllocation,
  CreateBudgetAllocationRequest,
  UpdateBudgetAllocationRequest,
} from '../types/budget-allocations.types';
// CRUD-GENERATOR-TAG: Foreign Key Service Import

export type BudgetAllocationFormMode = 'create' | 'edit';

export interface BudgetAllocationFormData {
  fiscal_year: unknown;
  budget_id: string;
  department_id: string;
  total_budget: unknown;
  q1_budget?: unknown;
  q2_budget?: unknown;
  q3_budget?: unknown;
  q4_budget?: unknown;
  q1_spent?: unknown;
  q2_spent?: unknown;
  q3_spent?: unknown;
  q4_spent?: unknown;
  total_spent?: unknown;
  remaining_budget?: unknown;
  is_active?: boolean;
}

@Component({
  selector: 'app-budget-allocations-form',
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
      <form [formGroup]="budgetAllocationsForm" class="budget-allocations-form">
        <!-- Form Fields Section -->
        <div class="ax-dialog-section">
          <h3 class="ax-dialog-section-title">BudgetAllocation Information</h3>
          <div class="ax-dialog-section-content">
            <div class="form-grid">
              <!-- fiscal_year Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Fiscal Year</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="fiscal_year"
                  placeholder="Enter fiscal year"
                />
                <mat-error
                  *ngIf="
                    budgetAllocationsForm
                      .get('fiscal_year')
                      ?.hasError('required')
                  "
                >
                  Fiscal Year is required
                </mat-error>
              </mat-form-field>

              <!-- budget_id Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Budget Id</mat-label>
                <input
                  matInput
                  type="dropdown"
                  formControlName="budget_id"
                  placeholder="Enter budget id"
                />
                <mat-error
                  *ngIf="
                    budgetAllocationsForm.get('budget_id')?.hasError('required')
                  "
                >
                  Budget Id is required
                </mat-error>
              </mat-form-field>

              <!-- department_id Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Department Id</mat-label>
                <input
                  matInput
                  type="dropdown"
                  formControlName="department_id"
                  placeholder="Enter department id"
                />
                <mat-error
                  *ngIf="
                    budgetAllocationsForm
                      .get('department_id')
                      ?.hasError('required')
                  "
                >
                  Department Id is required
                </mat-error>
              </mat-form-field>

              <!-- total_budget Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Total Budget</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="total_budget"
                  placeholder="Enter total budget"
                />
                <mat-error
                  *ngIf="
                    budgetAllocationsForm
                      .get('total_budget')
                      ?.hasError('required')
                  "
                >
                  Total Budget is required
                </mat-error>
              </mat-form-field>

              <!-- q1_budget Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Q1 Budget</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="q1_budget"
                  placeholder="Enter q1 budget"
                />
              </mat-form-field>

              <!-- q2_budget Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Q2 Budget</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="q2_budget"
                  placeholder="Enter q2 budget"
                />
              </mat-form-field>

              <!-- q3_budget Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Q3 Budget</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="q3_budget"
                  placeholder="Enter q3 budget"
                />
              </mat-form-field>

              <!-- q4_budget Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Q4 Budget</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="q4_budget"
                  placeholder="Enter q4 budget"
                />
              </mat-form-field>

              <!-- q1_spent Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Q1 Spent</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="q1_spent"
                  placeholder="Enter q1 spent"
                />
              </mat-form-field>

              <!-- q2_spent Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Q2 Spent</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="q2_spent"
                  placeholder="Enter q2 spent"
                />
              </mat-form-field>

              <!-- q3_spent Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Q3 Spent</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="q3_spent"
                  placeholder="Enter q3 spent"
                />
              </mat-form-field>

              <!-- q4_spent Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Q4 Spent</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="q4_spent"
                  placeholder="Enter q4 spent"
                />
              </mat-form-field>

              <!-- total_spent Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Total Spent</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="total_spent"
                  placeholder="Enter total spent"
                />
              </mat-form-field>

              <!-- remaining_budget Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Remaining Budget</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="remaining_budget"
                  placeholder="Enter remaining budget"
                />
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
          budgetAllocationsForm.invalid ||
          loading ||
          (mode === 'edit' && !hasChanges())
        "
      >
        @if (loading) {
          <mat-spinner diameter="20" class="inline-spinner"></mat-spinner>
        }
        {{ mode === 'create' ? 'Create' : 'Update' }} BudgetAllocation
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      /* Form Container */
      .budget-allocations-form {
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
export class BudgetAllocationFormComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);
  // CRUD-GENERATOR-TAG: Foreign Key Service Injection

  @Input() mode: BudgetAllocationFormMode = 'create';
  @Input() initialData?: BudgetAllocation;
  @Input() loading = false;

  @Output() formSubmit = new EventEmitter<BudgetAllocationFormData>();
  @Output() formCancel = new EventEmitter<void>();

  private originalFormValue: any;
  // CRUD-GENERATOR-TAG: Foreign Key Options State

  budgetAllocationsForm: FormGroup = this.fb.group({
    fiscal_year: ['', [Validators.required]],
    budget_id: ['', [Validators.required]],
    department_id: ['', [Validators.required]],
    total_budget: ['', [Validators.required]],
    q1_budget: ['', []],
    q2_budget: ['', []],
    q3_budget: ['', []],
    q4_budget: ['', []],
    q1_spent: ['', []],
    q2_spent: ['', []],
    q3_spent: ['', []],
    q4_spent: ['', []],
    total_spent: ['', []],
    remaining_budget: ['', []],
    is_active: [false, []],
  });

  ngOnInit() {
    // CRUD-GENERATOR-TAG: Load Foreign Key Options
    if (this.mode === 'edit' && this.initialData) {
      this.populateForm(this.initialData);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialData'] && this.initialData && this.mode === 'edit') {
      this.populateForm(this.initialData);
    }
  }

  private populateForm(budgetAllocations: BudgetAllocation) {
    const formValue = {
      fiscal_year: budgetAllocations.fiscal_year,
      budget_id: budgetAllocations.budget_id,
      department_id: budgetAllocations.department_id,
      total_budget: budgetAllocations.total_budget,
      q1_budget: budgetAllocations.q1_budget,
      q2_budget: budgetAllocations.q2_budget,
      q3_budget: budgetAllocations.q3_budget,
      q4_budget: budgetAllocations.q4_budget,
      q1_spent: budgetAllocations.q1_spent,
      q2_spent: budgetAllocations.q2_spent,
      q3_spent: budgetAllocations.q3_spent,
      q4_spent: budgetAllocations.q4_spent,
      total_spent: budgetAllocations.total_spent,
      remaining_budget: budgetAllocations.remaining_budget,
      is_active: budgetAllocations.is_active,
    };

    this.budgetAllocationsForm.patchValue(formValue);
    this.originalFormValue = this.budgetAllocationsForm.value;
  }

  hasChanges(): boolean {
    if (this.mode === 'create') return true;
    const currentValue = this.budgetAllocationsForm.value;
    return (
      JSON.stringify(currentValue) !== JSON.stringify(this.originalFormValue)
    );
  }

  onSubmit() {
    if (this.budgetAllocationsForm.valid) {
      const formData = {
        ...this.budgetAllocationsForm.value,
      } as BudgetAllocationFormData;

      // Convert number fields from string to number (TypeBox expects number, not string)
      if (formData.fiscal_year !== undefined) {
        const fiscal_yearVal = formData.fiscal_year;
        formData.fiscal_year =
          fiscal_yearVal === '' || fiscal_yearVal === null
            ? null
            : Number(fiscal_yearVal);
      }
      if (formData.total_budget !== undefined) {
        const total_budgetVal = formData.total_budget;
        formData.total_budget =
          total_budgetVal === '' || total_budgetVal === null
            ? null
            : Number(total_budgetVal);
      }
      if (formData.q1_budget !== undefined) {
        const q1_budgetVal = formData.q1_budget;
        formData.q1_budget =
          q1_budgetVal === '' || q1_budgetVal === null
            ? null
            : Number(q1_budgetVal);
      }
      if (formData.q2_budget !== undefined) {
        const q2_budgetVal = formData.q2_budget;
        formData.q2_budget =
          q2_budgetVal === '' || q2_budgetVal === null
            ? null
            : Number(q2_budgetVal);
      }
      if (formData.q3_budget !== undefined) {
        const q3_budgetVal = formData.q3_budget;
        formData.q3_budget =
          q3_budgetVal === '' || q3_budgetVal === null
            ? null
            : Number(q3_budgetVal);
      }
      if (formData.q4_budget !== undefined) {
        const q4_budgetVal = formData.q4_budget;
        formData.q4_budget =
          q4_budgetVal === '' || q4_budgetVal === null
            ? null
            : Number(q4_budgetVal);
      }
      if (formData.q1_spent !== undefined) {
        const q1_spentVal = formData.q1_spent;
        formData.q1_spent =
          q1_spentVal === '' || q1_spentVal === null
            ? null
            : Number(q1_spentVal);
      }
      if (formData.q2_spent !== undefined) {
        const q2_spentVal = formData.q2_spent;
        formData.q2_spent =
          q2_spentVal === '' || q2_spentVal === null
            ? null
            : Number(q2_spentVal);
      }
      if (formData.q3_spent !== undefined) {
        const q3_spentVal = formData.q3_spent;
        formData.q3_spent =
          q3_spentVal === '' || q3_spentVal === null
            ? null
            : Number(q3_spentVal);
      }
      if (formData.q4_spent !== undefined) {
        const q4_spentVal = formData.q4_spent;
        formData.q4_spent =
          q4_spentVal === '' || q4_spentVal === null
            ? null
            : Number(q4_spentVal);
      }
      if (formData.total_spent !== undefined) {
        const total_spentVal = formData.total_spent;
        formData.total_spent =
          total_spentVal === '' || total_spentVal === null
            ? null
            : Number(total_spentVal);
      }
      if (formData.remaining_budget !== undefined) {
        const remaining_budgetVal = formData.remaining_budget;
        formData.remaining_budget =
          remaining_budgetVal === '' || remaining_budgetVal === null
            ? null
            : Number(remaining_budgetVal);
      }

      this.formSubmit.emit(formData);
    }
  }

  onCancel() {
    this.formCancel.emit();
  }
}
