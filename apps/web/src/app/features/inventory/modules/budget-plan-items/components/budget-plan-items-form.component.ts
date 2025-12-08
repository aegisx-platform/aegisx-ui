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
  BudgetPlanItem,
  CreateBudgetPlanItemRequest,
  UpdateBudgetPlanItemRequest,
} from '../types/budget-plan-items.types';
// CRUD-GENERATOR-TAG: Foreign Key Service Import

export type BudgetPlanItemFormMode = 'create' | 'edit';

export interface BudgetPlanItemFormData {
  budget_plan_id: string;
  generic_id: string;
  last_year_qty?: unknown;
  two_years_ago_qty?: unknown;
  three_years_ago_qty?: unknown;
  planned_quantity: unknown;
  estimated_unit_price: unknown;
  total_planned_value: unknown;
  q1_planned_qty?: unknown;
  q2_planned_qty?: unknown;
  q3_planned_qty?: unknown;
  q4_planned_qty?: unknown;
  q1_purchased_qty?: unknown;
  q2_purchased_qty?: unknown;
  q3_purchased_qty?: unknown;
  q4_purchased_qty?: unknown;
  total_purchased_qty?: unknown;
  total_purchased_value?: unknown;
  notes?: string;
}

@Component({
  selector: 'app-budget-plan-items-form',
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
      <form [formGroup]="budgetPlanItemsForm" class="budget-plan-items-form">
        <!-- Form Fields Section -->
        <div class="ax-dialog-section">
          <h3 class="ax-dialog-section-title">BudgetPlanItem Information</h3>
          <div class="ax-dialog-section-content">
            <div class="form-grid">
              <!-- budget_plan_id Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Budget Plan Id</mat-label>
                <input
                  matInput
                  type="dropdown"
                  formControlName="budget_plan_id"
                  placeholder="Enter budget plan id"
                />
                <mat-error
                  *ngIf="
                    budgetPlanItemsForm
                      .get('budget_plan_id')
                      ?.hasError('required')
                  "
                >
                  Budget Plan Id is required
                </mat-error>
              </mat-form-field>

              <!-- generic_id Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Generic Id</mat-label>
                <input
                  matInput
                  type="dropdown"
                  formControlName="generic_id"
                  placeholder="Enter generic id"
                />
                <mat-error
                  *ngIf="
                    budgetPlanItemsForm.get('generic_id')?.hasError('required')
                  "
                >
                  Generic Id is required
                </mat-error>
              </mat-form-field>

              <!-- last_year_qty Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Last Year Qty</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="last_year_qty"
                  placeholder="Enter last year qty"
                />
              </mat-form-field>

              <!-- two_years_ago_qty Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Two Years Ago Qty</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="two_years_ago_qty"
                  placeholder="Enter two years ago qty"
                />
              </mat-form-field>

              <!-- three_years_ago_qty Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Three Years Ago Qty</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="three_years_ago_qty"
                  placeholder="Enter three years ago qty"
                />
              </mat-form-field>

              <!-- planned_quantity Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Planned Quantity</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="planned_quantity"
                  placeholder="Enter planned quantity"
                />
                <mat-error
                  *ngIf="
                    budgetPlanItemsForm
                      .get('planned_quantity')
                      ?.hasError('required')
                  "
                >
                  Planned Quantity is required
                </mat-error>
              </mat-form-field>

              <!-- estimated_unit_price Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Estimated Unit Price</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="estimated_unit_price"
                  placeholder="Enter estimated unit price"
                />
                <mat-error
                  *ngIf="
                    budgetPlanItemsForm
                      .get('estimated_unit_price')
                      ?.hasError('required')
                  "
                >
                  Estimated Unit Price is required
                </mat-error>
              </mat-form-field>

              <!-- total_planned_value Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Total Planned Value</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="total_planned_value"
                  placeholder="Enter total planned value"
                />
                <mat-error
                  *ngIf="
                    budgetPlanItemsForm
                      .get('total_planned_value')
                      ?.hasError('required')
                  "
                >
                  Total Planned Value is required
                </mat-error>
              </mat-form-field>

              <!-- q1_planned_qty Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Q1 Planned Qty</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="q1_planned_qty"
                  placeholder="Enter q1 planned qty"
                />
              </mat-form-field>

              <!-- q2_planned_qty Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Q2 Planned Qty</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="q2_planned_qty"
                  placeholder="Enter q2 planned qty"
                />
              </mat-form-field>

              <!-- q3_planned_qty Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Q3 Planned Qty</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="q3_planned_qty"
                  placeholder="Enter q3 planned qty"
                />
              </mat-form-field>

              <!-- q4_planned_qty Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Q4 Planned Qty</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="q4_planned_qty"
                  placeholder="Enter q4 planned qty"
                />
              </mat-form-field>

              <!-- q1_purchased_qty Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Q1 Purchased Qty</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="q1_purchased_qty"
                  placeholder="Enter q1 purchased qty"
                />
              </mat-form-field>

              <!-- q2_purchased_qty Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Q2 Purchased Qty</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="q2_purchased_qty"
                  placeholder="Enter q2 purchased qty"
                />
              </mat-form-field>

              <!-- q3_purchased_qty Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Q3 Purchased Qty</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="q3_purchased_qty"
                  placeholder="Enter q3 purchased qty"
                />
              </mat-form-field>

              <!-- q4_purchased_qty Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Q4 Purchased Qty</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="q4_purchased_qty"
                  placeholder="Enter q4 purchased qty"
                />
              </mat-form-field>

              <!-- total_purchased_qty Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Total Purchased Qty</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="total_purchased_qty"
                  placeholder="Enter total purchased qty"
                />
              </mat-form-field>

              <!-- total_purchased_value Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Total Purchased Value</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="total_purchased_value"
                  placeholder="Enter total purchased value"
                />
              </mat-form-field>

              <!-- notes Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Notes</mat-label>
                <textarea
                  matInput
                  formControlName="notes"
                  placeholder="Enter notes"
                  rows="3"
                ></textarea>
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
          budgetPlanItemsForm.invalid ||
          loading ||
          (mode === 'edit' && !hasChanges())
        "
      >
        @if (loading) {
          <mat-spinner diameter="20" class="inline-spinner"></mat-spinner>
        }
        {{ mode === 'create' ? 'Create' : 'Update' }} BudgetPlanItem
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      /* Form Container */
      .budget-plan-items-form {
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
export class BudgetPlanItemFormComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);
  // CRUD-GENERATOR-TAG: Foreign Key Service Injection

  @Input() mode: BudgetPlanItemFormMode = 'create';
  @Input() initialData?: BudgetPlanItem;
  @Input() loading = false;

  @Output() formSubmit = new EventEmitter<BudgetPlanItemFormData>();
  @Output() formCancel = new EventEmitter<void>();

  private originalFormValue: any;
  // CRUD-GENERATOR-TAG: Foreign Key Options State

  budgetPlanItemsForm: FormGroup = this.fb.group({
    budget_plan_id: ['', [Validators.required]],
    generic_id: ['', [Validators.required]],
    last_year_qty: ['', []],
    two_years_ago_qty: ['', []],
    three_years_ago_qty: ['', []],
    planned_quantity: ['', [Validators.required]],
    estimated_unit_price: ['', [Validators.required]],
    total_planned_value: ['', [Validators.required]],
    q1_planned_qty: ['', []],
    q2_planned_qty: ['', []],
    q3_planned_qty: ['', []],
    q4_planned_qty: ['', []],
    q1_purchased_qty: ['', []],
    q2_purchased_qty: ['', []],
    q3_purchased_qty: ['', []],
    q4_purchased_qty: ['', []],
    total_purchased_qty: ['', []],
    total_purchased_value: ['', []],
    notes: ['', []],
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

  private populateForm(budgetPlanItems: BudgetPlanItem) {
    const formValue = {
      budget_plan_id: budgetPlanItems.budget_plan_id,
      generic_id: budgetPlanItems.generic_id,
      last_year_qty: budgetPlanItems.last_year_qty,
      two_years_ago_qty: budgetPlanItems.two_years_ago_qty,
      three_years_ago_qty: budgetPlanItems.three_years_ago_qty,
      planned_quantity: budgetPlanItems.planned_quantity,
      estimated_unit_price: budgetPlanItems.estimated_unit_price,
      total_planned_value: budgetPlanItems.total_planned_value,
      q1_planned_qty: budgetPlanItems.q1_planned_qty,
      q2_planned_qty: budgetPlanItems.q2_planned_qty,
      q3_planned_qty: budgetPlanItems.q3_planned_qty,
      q4_planned_qty: budgetPlanItems.q4_planned_qty,
      q1_purchased_qty: budgetPlanItems.q1_purchased_qty,
      q2_purchased_qty: budgetPlanItems.q2_purchased_qty,
      q3_purchased_qty: budgetPlanItems.q3_purchased_qty,
      q4_purchased_qty: budgetPlanItems.q4_purchased_qty,
      total_purchased_qty: budgetPlanItems.total_purchased_qty,
      total_purchased_value: budgetPlanItems.total_purchased_value,
      notes: budgetPlanItems.notes,
    };

    this.budgetPlanItemsForm.patchValue(formValue);
    this.originalFormValue = this.budgetPlanItemsForm.value;
  }

  hasChanges(): boolean {
    if (this.mode === 'create') return true;
    const currentValue = this.budgetPlanItemsForm.value;
    return (
      JSON.stringify(currentValue) !== JSON.stringify(this.originalFormValue)
    );
  }

  onSubmit() {
    if (this.budgetPlanItemsForm.valid) {
      const formData = {
        ...this.budgetPlanItemsForm.value,
      } as BudgetPlanItemFormData;

      // Convert number fields from string to number (TypeBox expects number, not string)
      if (formData.last_year_qty !== undefined) {
        const last_year_qtyVal = formData.last_year_qty;
        formData.last_year_qty =
          last_year_qtyVal === '' || last_year_qtyVal === null
            ? null
            : Number(last_year_qtyVal);
      }
      if (formData.two_years_ago_qty !== undefined) {
        const two_years_ago_qtyVal = formData.two_years_ago_qty;
        formData.two_years_ago_qty =
          two_years_ago_qtyVal === '' || two_years_ago_qtyVal === null
            ? null
            : Number(two_years_ago_qtyVal);
      }
      if (formData.three_years_ago_qty !== undefined) {
        const three_years_ago_qtyVal = formData.three_years_ago_qty;
        formData.three_years_ago_qty =
          three_years_ago_qtyVal === '' || three_years_ago_qtyVal === null
            ? null
            : Number(three_years_ago_qtyVal);
      }
      if (formData.planned_quantity !== undefined) {
        const planned_quantityVal = formData.planned_quantity;
        formData.planned_quantity =
          planned_quantityVal === '' || planned_quantityVal === null
            ? null
            : Number(planned_quantityVal);
      }
      if (formData.estimated_unit_price !== undefined) {
        const estimated_unit_priceVal = formData.estimated_unit_price;
        formData.estimated_unit_price =
          estimated_unit_priceVal === '' || estimated_unit_priceVal === null
            ? null
            : Number(estimated_unit_priceVal);
      }
      if (formData.total_planned_value !== undefined) {
        const total_planned_valueVal = formData.total_planned_value;
        formData.total_planned_value =
          total_planned_valueVal === '' || total_planned_valueVal === null
            ? null
            : Number(total_planned_valueVal);
      }
      if (formData.q1_planned_qty !== undefined) {
        const q1_planned_qtyVal = formData.q1_planned_qty;
        formData.q1_planned_qty =
          q1_planned_qtyVal === '' || q1_planned_qtyVal === null
            ? null
            : Number(q1_planned_qtyVal);
      }
      if (formData.q2_planned_qty !== undefined) {
        const q2_planned_qtyVal = formData.q2_planned_qty;
        formData.q2_planned_qty =
          q2_planned_qtyVal === '' || q2_planned_qtyVal === null
            ? null
            : Number(q2_planned_qtyVal);
      }
      if (formData.q3_planned_qty !== undefined) {
        const q3_planned_qtyVal = formData.q3_planned_qty;
        formData.q3_planned_qty =
          q3_planned_qtyVal === '' || q3_planned_qtyVal === null
            ? null
            : Number(q3_planned_qtyVal);
      }
      if (formData.q4_planned_qty !== undefined) {
        const q4_planned_qtyVal = formData.q4_planned_qty;
        formData.q4_planned_qty =
          q4_planned_qtyVal === '' || q4_planned_qtyVal === null
            ? null
            : Number(q4_planned_qtyVal);
      }
      if (formData.q1_purchased_qty !== undefined) {
        const q1_purchased_qtyVal = formData.q1_purchased_qty;
        formData.q1_purchased_qty =
          q1_purchased_qtyVal === '' || q1_purchased_qtyVal === null
            ? null
            : Number(q1_purchased_qtyVal);
      }
      if (formData.q2_purchased_qty !== undefined) {
        const q2_purchased_qtyVal = formData.q2_purchased_qty;
        formData.q2_purchased_qty =
          q2_purchased_qtyVal === '' || q2_purchased_qtyVal === null
            ? null
            : Number(q2_purchased_qtyVal);
      }
      if (formData.q3_purchased_qty !== undefined) {
        const q3_purchased_qtyVal = formData.q3_purchased_qty;
        formData.q3_purchased_qty =
          q3_purchased_qtyVal === '' || q3_purchased_qtyVal === null
            ? null
            : Number(q3_purchased_qtyVal);
      }
      if (formData.q4_purchased_qty !== undefined) {
        const q4_purchased_qtyVal = formData.q4_purchased_qty;
        formData.q4_purchased_qty =
          q4_purchased_qtyVal === '' || q4_purchased_qtyVal === null
            ? null
            : Number(q4_purchased_qtyVal);
      }
      if (formData.total_purchased_qty !== undefined) {
        const total_purchased_qtyVal = formData.total_purchased_qty;
        formData.total_purchased_qty =
          total_purchased_qtyVal === '' || total_purchased_qtyVal === null
            ? null
            : Number(total_purchased_qtyVal);
      }
      if (formData.total_purchased_value !== undefined) {
        const total_purchased_valueVal = formData.total_purchased_value;
        formData.total_purchased_value =
          total_purchased_valueVal === '' || total_purchased_valueVal === null
            ? null
            : Number(total_purchased_valueVal);
      }

      this.formSubmit.emit(formData);
    }
  }

  onCancel() {
    this.formCancel.emit();
  }
}
