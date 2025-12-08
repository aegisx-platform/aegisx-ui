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
  BudgetReservation,
  CreateBudgetReservationRequest,
  UpdateBudgetReservationRequest,
} from '../types/budget-reservations.types';
// CRUD-GENERATOR-TAG: Foreign Key Service Import

export type BudgetReservationFormMode = 'create' | 'edit';

export interface BudgetReservationFormData {
  allocation_id: string;
  pr_id: unknown;
  reserved_amount: unknown;
  quarter: unknown;
  reservation_date?: string;
  expires_date: string;
  is_released?: boolean;
  released_at?: string;
}

@Component({
  selector: 'app-budget-reservations-form',
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
      <form
        [formGroup]="budgetReservationsForm"
        class="budget-reservations-form"
      >
        <!-- Form Fields Section -->
        <div class="ax-dialog-section">
          <h3 class="ax-dialog-section-title">BudgetReservation Information</h3>
          <div class="ax-dialog-section-content">
            <div class="form-grid">
              <!-- allocation_id Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Allocation Id</mat-label>
                <input
                  matInput
                  type="dropdown"
                  formControlName="allocation_id"
                  placeholder="Enter allocation id"
                />
                <mat-error
                  *ngIf="
                    budgetReservationsForm
                      .get('allocation_id')
                      ?.hasError('required')
                  "
                >
                  Allocation Id is required
                </mat-error>
              </mat-form-field>

              <!-- pr_id Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Pr Id</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="pr_id"
                  placeholder="Enter pr id"
                />
                <mat-error
                  *ngIf="
                    budgetReservationsForm.get('pr_id')?.hasError('required')
                  "
                >
                  Pr Id is required
                </mat-error>
              </mat-form-field>

              <!-- reserved_amount Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Reserved Amount</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="reserved_amount"
                  placeholder="Enter reserved amount"
                />
                <mat-error
                  *ngIf="
                    budgetReservationsForm
                      .get('reserved_amount')
                      ?.hasError('required')
                  "
                >
                  Reserved Amount is required
                </mat-error>
              </mat-form-field>

              <!-- quarter Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Quarter</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="quarter"
                  placeholder="Enter quarter"
                />
                <mat-error
                  *ngIf="
                    budgetReservationsForm.get('quarter')?.hasError('required')
                  "
                >
                  Quarter is required
                </mat-error>
              </mat-form-field>

              <!-- reservation_date Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Reservation Date</mat-label>
                <input
                  matInput
                  type="datetime-local"
                  formControlName="reservation_date"
                  placeholder="Enter reservation date"
                />
              </mat-form-field>

              <!-- expires_date Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Expires Date</mat-label>
                <input
                  matInput
                  type="datetime-local"
                  formControlName="expires_date"
                  placeholder="Enter expires date"
                />
                <mat-error
                  *ngIf="
                    budgetReservationsForm
                      .get('expires_date')
                      ?.hasError('required')
                  "
                >
                  Expires Date is required
                </mat-error>
              </mat-form-field>

              <!-- is_released Field -->
              <div class="checkbox-field">
                <mat-checkbox formControlName="is_released">
                  Is Released
                </mat-checkbox>
              </div>

              <!-- released_at Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Released At</mat-label>
                <input
                  matInput
                  type="datetime-local"
                  formControlName="released_at"
                  placeholder="Enter released at"
                />
              </mat-form-field>
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
          budgetReservationsForm.invalid ||
          loading ||
          (mode === 'edit' && !hasChanges())
        "
      >
        @if (loading) {
          <mat-spinner diameter="20" class="inline-spinner"></mat-spinner>
        }
        {{ mode === 'create' ? 'Create' : 'Update' }} BudgetReservation
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      /* Form Container */
      .budget-reservations-form {
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
export class BudgetReservationFormComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);
  // CRUD-GENERATOR-TAG: Foreign Key Service Injection

  @Input() mode: BudgetReservationFormMode = 'create';
  @Input() initialData?: BudgetReservation;
  @Input() loading = false;

  @Output() formSubmit = new EventEmitter<BudgetReservationFormData>();
  @Output() formCancel = new EventEmitter<void>();

  private originalFormValue: any;
  // CRUD-GENERATOR-TAG: Foreign Key Options State

  budgetReservationsForm: FormGroup = this.fb.group({
    allocation_id: ['', [Validators.required]],
    pr_id: ['', [Validators.required]],
    reserved_amount: ['', [Validators.required]],
    quarter: ['', [Validators.required]],
    reservation_date: ['', []],
    expires_date: ['', [Validators.required]],
    is_released: [false, []],
    released_at: ['', []],
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

  private populateForm(budgetReservations: BudgetReservation) {
    const formValue = {
      allocation_id: budgetReservations.allocation_id,
      pr_id: budgetReservations.pr_id,
      reserved_amount: budgetReservations.reserved_amount,
      quarter: budgetReservations.quarter,
      reservation_date: budgetReservations.reservation_date,
      expires_date: budgetReservations.expires_date,
      is_released: budgetReservations.is_released,
      released_at: budgetReservations.released_at,
    };

    this.budgetReservationsForm.patchValue(formValue);
    this.originalFormValue = this.budgetReservationsForm.value;
  }

  hasChanges(): boolean {
    if (this.mode === 'create') return true;
    const currentValue = this.budgetReservationsForm.value;
    return (
      JSON.stringify(currentValue) !== JSON.stringify(this.originalFormValue)
    );
  }

  onSubmit() {
    if (this.budgetReservationsForm.valid) {
      const formData = {
        ...this.budgetReservationsForm.value,
      } as BudgetReservationFormData;

      // Convert number fields from string to number (TypeBox expects number, not string)
      if (formData.pr_id !== undefined) {
        const pr_idVal = formData.pr_id;
        formData.pr_id =
          pr_idVal === '' || pr_idVal === null ? null : Number(pr_idVal);
      }
      if (formData.reserved_amount !== undefined) {
        const reserved_amountVal = formData.reserved_amount;
        formData.reserved_amount =
          reserved_amountVal === '' || reserved_amountVal === null
            ? null
            : Number(reserved_amountVal);
      }
      if (formData.quarter !== undefined) {
        const quarterVal = formData.quarter;
        formData.quarter =
          quarterVal === '' || quarterVal === null ? null : Number(quarterVal);
      }

      this.formSubmit.emit(formData);
    }
  }

  onCancel() {
    this.formCancel.emit();
  }
}
