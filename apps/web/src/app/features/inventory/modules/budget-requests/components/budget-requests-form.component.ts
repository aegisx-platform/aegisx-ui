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
  BudgetRequest,
  CreateBudgetRequestRequest,
  UpdateBudgetRequestRequest,
} from '../types/budget-requests.types';
// CRUD-GENERATOR-TAG: Foreign Key Service Import

export type BudgetRequestFormMode = 'create' | 'edit';

export interface BudgetRequestFormData {
  request_number: string;
  fiscal_year: unknown;
  department_id: string;
  status?: string;
  total_requested_amount?: unknown;
  justification?: string;
  submitted_by?: string;
  submitted_at?: string;
  dept_reviewed_by?: string;
  dept_reviewed_at?: string;
  dept_comments?: string;
  finance_reviewed_by?: string;
  finance_reviewed_at?: string;
  finance_comments?: string;
  rejection_reason?: string;
  is_active?: boolean;
}

@Component({
  selector: 'app-budget-requests-form',
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
      <form [formGroup]="budgetRequestsForm" class="budget-requests-form">
        <!-- Form Fields Section -->
        <div class="ax-dialog-section">
          <h3 class="ax-dialog-section-title">BudgetRequest Information</h3>
          <div class="ax-dialog-section-content">
            <div class="form-grid">
              <!-- request_number Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Request Number</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="request_number"
                  placeholder="Enter request number"
                />
                <mat-error
                  *ngIf="
                    budgetRequestsForm
                      .get('request_number')
                      ?.hasError('required')
                  "
                >
                  Request Number is required
                </mat-error>
              </mat-form-field>

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
                    budgetRequestsForm.get('fiscal_year')?.hasError('required')
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
                    budgetRequestsForm
                      .get('department_id')
                      ?.hasError('required')
                  "
                >
                  Department Id is required
                </mat-error>
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

              <!-- total_requested_amount Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Total Requested Amount</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="total_requested_amount"
                  placeholder="Enter total requested amount"
                />
              </mat-form-field>

              <!-- justification Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Justification</mat-label>
                <textarea
                  matInput
                  formControlName="justification"
                  placeholder="Enter justification"
                  rows="3"
                ></textarea>
              </mat-form-field>

              <!-- submitted_by Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Submitted By</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="submitted_by"
                  placeholder="Enter submitted by"
                />
              </mat-form-field>

              <!-- submitted_at Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Submitted At</mat-label>
                <input
                  matInput
                  type="datetime-local"
                  formControlName="submitted_at"
                  placeholder="Enter submitted at"
                />
              </mat-form-field>

              <!-- dept_reviewed_by Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Dept Reviewed By</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="dept_reviewed_by"
                  placeholder="Enter dept reviewed by"
                />
              </mat-form-field>

              <!-- dept_reviewed_at Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Dept Reviewed At</mat-label>
                <input
                  matInput
                  type="datetime-local"
                  formControlName="dept_reviewed_at"
                  placeholder="Enter dept reviewed at"
                />
              </mat-form-field>

              <!-- dept_comments Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Dept Comments</mat-label>
                <textarea
                  matInput
                  formControlName="dept_comments"
                  placeholder="Enter dept comments"
                  rows="3"
                ></textarea>
              </mat-form-field>

              <!-- finance_reviewed_by Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Finance Reviewed By</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="finance_reviewed_by"
                  placeholder="Enter finance reviewed by"
                />
              </mat-form-field>

              <!-- finance_reviewed_at Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Finance Reviewed At</mat-label>
                <input
                  matInput
                  type="datetime-local"
                  formControlName="finance_reviewed_at"
                  placeholder="Enter finance reviewed at"
                />
              </mat-form-field>

              <!-- finance_comments Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Finance Comments</mat-label>
                <textarea
                  matInput
                  formControlName="finance_comments"
                  placeholder="Enter finance comments"
                  rows="3"
                ></textarea>
              </mat-form-field>

              <!-- rejection_reason Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Rejection Reason</mat-label>
                <textarea
                  matInput
                  formControlName="rejection_reason"
                  placeholder="Enter rejection reason"
                  rows="3"
                ></textarea>
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
          budgetRequestsForm.invalid ||
          loading ||
          (mode === 'edit' && !hasChanges())
        "
      >
        @if (loading) {
          <mat-spinner diameter="20" class="inline-spinner"></mat-spinner>
        }
        {{ mode === 'create' ? 'Create' : 'Update' }} BudgetRequest
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      /* Form Container */
      .budget-requests-form {
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
export class BudgetRequestFormComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);
  // CRUD-GENERATOR-TAG: Foreign Key Service Injection

  @Input() mode: BudgetRequestFormMode = 'create';
  @Input() initialData?: BudgetRequest;
  @Input() loading = false;

  @Output() formSubmit = new EventEmitter<BudgetRequestFormData>();
  @Output() formCancel = new EventEmitter<void>();

  private originalFormValue: any;
  // CRUD-GENERATOR-TAG: Foreign Key Options State

  budgetRequestsForm: FormGroup = this.fb.group({
    request_number: ['', [Validators.required]],
    fiscal_year: ['', [Validators.required]],
    department_id: ['', [Validators.required]],
    status: ['', [Validators.maxLength(20)]],
    total_requested_amount: ['', []],
    justification: ['', []],
    submitted_by: ['', []],
    submitted_at: ['', []],
    dept_reviewed_by: ['', []],
    dept_reviewed_at: ['', []],
    dept_comments: ['', []],
    finance_reviewed_by: ['', []],
    finance_reviewed_at: ['', []],
    finance_comments: ['', []],
    rejection_reason: ['', []],
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

  private populateForm(budgetRequests: BudgetRequest) {
    const formValue = {
      request_number: budgetRequests.request_number,
      fiscal_year: budgetRequests.fiscal_year,
      department_id: budgetRequests.department_id,
      status: budgetRequests.status,
      total_requested_amount: budgetRequests.total_requested_amount,
      justification: budgetRequests.justification,
      submitted_by: budgetRequests.submitted_by,
      submitted_at: budgetRequests.submitted_at,
      dept_reviewed_by: budgetRequests.dept_reviewed_by,
      dept_reviewed_at: budgetRequests.dept_reviewed_at,
      dept_comments: budgetRequests.dept_comments,
      finance_reviewed_by: budgetRequests.finance_reviewed_by,
      finance_reviewed_at: budgetRequests.finance_reviewed_at,
      finance_comments: budgetRequests.finance_comments,
      rejection_reason: budgetRequests.rejection_reason,
      is_active: budgetRequests.is_active,
    };

    this.budgetRequestsForm.patchValue(formValue);
    this.originalFormValue = this.budgetRequestsForm.value;
  }

  hasChanges(): boolean {
    if (this.mode === 'create') return true;
    const currentValue = this.budgetRequestsForm.value;
    return (
      JSON.stringify(currentValue) !== JSON.stringify(this.originalFormValue)
    );
  }

  onSubmit() {
    if (this.budgetRequestsForm.valid) {
      const formData = {
        ...this.budgetRequestsForm.value,
      } as BudgetRequestFormData;

      // Convert number fields from string to number (TypeBox expects number, not string)
      if (formData.fiscal_year !== undefined) {
        const fiscal_yearVal = formData.fiscal_year;
        formData.fiscal_year =
          fiscal_yearVal === '' || fiscal_yearVal === null
            ? null
            : Number(fiscal_yearVal);
      }
      if (formData.total_requested_amount !== undefined) {
        const total_requested_amountVal = formData.total_requested_amount;
        formData.total_requested_amount =
          total_requested_amountVal === '' || total_requested_amountVal === null
            ? null
            : Number(total_requested_amountVal);
      }

      this.formSubmit.emit(formData);
    }
  }

  onCancel() {
    this.formCancel.emit();
  }
}
