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
  BudgetPlan,
  CreateBudgetPlanRequest,
  UpdateBudgetPlanRequest,
} from '../types/budget-plans.types';
// CRUD-GENERATOR-TAG: Foreign Key Service Import

export type BudgetPlanFormMode = 'create' | 'edit';

export interface BudgetPlanFormData {
  fiscal_year: unknown;
  department_id: string;
  plan_name?: string;
  total_planned_amount?: unknown;
  status?: string;
  approved_at?: string;
  approved_by?: string;
  is_active?: boolean;
}

@Component({
  selector: 'app-budget-plans-form',
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
      <form [formGroup]="budgetPlansForm" class="budget-plans-form">
        <!-- Form Fields Section -->
        <div class="ax-dialog-section">
          <h3 class="ax-dialog-section-title">BudgetPlan Information</h3>
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
                    budgetPlansForm.get('fiscal_year')?.hasError('required')
                  "
                >
                  Fiscal Year is required
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
                    budgetPlansForm.get('department_id')?.hasError('required')
                  "
                >
                  Department Id is required
                </mat-error>
              </mat-form-field>

              <!-- plan_name Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Plan Name</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="plan_name"
                  placeholder="Enter plan name"
                />
              </mat-form-field>

              <!-- total_planned_amount Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Total Planned Amount</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="total_planned_amount"
                  placeholder="Enter total planned amount"
                />
              </mat-form-field>

              <!-- status Field -->
              <!-- FK reference not found, render as plain text input -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Status</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="status"
                  placeholder="Enter status"
                />
              </mat-form-field>

              <!-- approved_at Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Approved At</mat-label>
                <input
                  matInput
                  type="datetime-local"
                  formControlName="approved_at"
                  placeholder="Enter approved at"
                />
              </mat-form-field>

              <!-- approved_by Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Approved By</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="approved_by"
                  placeholder="Enter approved by"
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
          budgetPlansForm.invalid ||
          loading ||
          (mode === 'edit' && !hasChanges())
        "
      >
        @if (loading) {
          <mat-spinner diameter="20" class="inline-spinner"></mat-spinner>
        }
        {{ mode === 'create' ? 'Create' : 'Update' }} BudgetPlan
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      /* Form Container */
      .budget-plans-form {
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
export class BudgetPlanFormComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);
  // CRUD-GENERATOR-TAG: Foreign Key Service Injection

  @Input() mode: BudgetPlanFormMode = 'create';
  @Input() initialData?: BudgetPlan;
  @Input() loading = false;

  @Output() formSubmit = new EventEmitter<BudgetPlanFormData>();
  @Output() formCancel = new EventEmitter<void>();

  private originalFormValue: any;
  // CRUD-GENERATOR-TAG: Foreign Key Options State

  budgetPlansForm: FormGroup = this.fb.group({
    fiscal_year: ['', [Validators.required]],
    department_id: ['', [Validators.required]],
    plan_name: ['', []],
    total_planned_amount: ['', []],
    status: ['', [Validators.maxLength(20)]],
    approved_at: ['', []],
    approved_by: ['', []],
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

  private populateForm(budgetPlans: BudgetPlan) {
    const formValue = {
      fiscal_year: budgetPlans.fiscal_year,
      department_id: budgetPlans.department_id,
      plan_name: budgetPlans.plan_name,
      total_planned_amount: budgetPlans.total_planned_amount,
      status: budgetPlans.status,
      approved_at: budgetPlans.approved_at,
      approved_by: budgetPlans.approved_by,
      is_active: budgetPlans.is_active,
    };

    this.budgetPlansForm.patchValue(formValue);
    this.originalFormValue = this.budgetPlansForm.value;
  }

  hasChanges(): boolean {
    if (this.mode === 'create') return true;
    const currentValue = this.budgetPlansForm.value;
    return (
      JSON.stringify(currentValue) !== JSON.stringify(this.originalFormValue)
    );
  }

  onSubmit() {
    if (this.budgetPlansForm.valid) {
      const formData = { ...this.budgetPlansForm.value } as BudgetPlanFormData;

      // Convert number fields from string to number (TypeBox expects number, not string)
      if (formData.fiscal_year !== undefined) {
        const fiscal_yearVal = formData.fiscal_year;
        formData.fiscal_year =
          fiscal_yearVal === '' || fiscal_yearVal === null
            ? null
            : Number(fiscal_yearVal);
      }
      if (formData.total_planned_amount !== undefined) {
        const total_planned_amountVal = formData.total_planned_amount;
        formData.total_planned_amount =
          total_planned_amountVal === '' || total_planned_amountVal === null
            ? null
            : Number(total_planned_amountVal);
      }

      this.formSubmit.emit(formData);
    }
  }

  onCancel() {
    this.formCancel.emit();
  }
}
