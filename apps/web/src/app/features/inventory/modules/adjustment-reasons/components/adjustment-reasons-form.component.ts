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
  AdjustmentReason,
  CreateAdjustmentReasonRequest,
  UpdateAdjustmentReasonRequest,
} from '../types/adjustment-reasons.types';

export type AdjustmentReasonFormMode = 'create' | 'edit';

export interface AdjustmentReasonFormData {
  reason_code: string;
  reason_name: string;
  adjustment_type?: string;
  requires_approval?: boolean;
  description?: string;
  is_active?: boolean;
}

@Component({
  selector: 'app-adjustment-reasons-form',
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
      <form [formGroup]="adjustmentReasonsForm" class="adjustment-reasons-form">
        <!-- Form Fields Section -->
        <div class="ax-dialog-section">
          <h3 class="ax-dialog-section-title">AdjustmentReason Information</h3>
          <div class="ax-dialog-section-content">
            <div class="form-grid">
              <!-- reason_code Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Reason Code</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="reason_code"
                  placeholder="Enter reason code"
                />
                <mat-error
                  *ngIf="
                    adjustmentReasonsForm
                      .get('reason_code')
                      ?.hasError('required')
                  "
                >
                  Reason Code is required
                </mat-error>
              </mat-form-field>

              <!-- reason_name Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Reason Name</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="reason_name"
                  placeholder="Enter reason name"
                />
                <mat-error
                  *ngIf="
                    adjustmentReasonsForm
                      .get('reason_name')
                      ?.hasError('required')
                  "
                >
                  Reason Name is required
                </mat-error>
              </mat-form-field>

              <!-- adjustment_type Field -->
              <!-- FK reference not found, render as plain text input -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Adjustment Type</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="adjustment_type"
                  placeholder="Enter adjustment type"
                />
              </mat-form-field>

              <!-- requires_approval Field -->
              <div class="checkbox-field">
                <mat-checkbox formControlName="requires_approval">
                  Requires Approval
                </mat-checkbox>
              </div>

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
                    adjustmentReasonsForm
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
          adjustmentReasonsForm.invalid ||
          loading ||
          (mode === 'edit' && !hasChanges())
        "
      >
        @if (loading) {
          <mat-spinner diameter="20" class="inline-spinner"></mat-spinner>
        }
        {{ mode === 'create' ? 'Create' : 'Update' }} AdjustmentReason
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      /* Form Container */
      .adjustment-reasons-form {
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
export class AdjustmentReasonFormComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);

  @Input() mode: AdjustmentReasonFormMode = 'create';
  @Input() initialData?: AdjustmentReason;
  @Input() loading = false;

  @Output() formSubmit = new EventEmitter<AdjustmentReasonFormData>();
  @Output() formCancel = new EventEmitter<void>();

  private originalFormValue: any;

  adjustmentReasonsForm: FormGroup = this.fb.group({
    reason_code: ['', [Validators.required]],
    reason_name: ['', [Validators.required]],
    adjustment_type: ['', []],
    requires_approval: [false, []],
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

  private populateForm(adjustmentReasons: AdjustmentReason) {
    const formValue = {
      reason_code: adjustmentReasons.reason_code,
      reason_name: adjustmentReasons.reason_name,
      adjustment_type: adjustmentReasons.adjustment_type,
      requires_approval: adjustmentReasons.requires_approval,
      description: adjustmentReasons.description,
      is_active: adjustmentReasons.is_active,
    };

    this.adjustmentReasonsForm.patchValue(formValue);
    this.originalFormValue = this.adjustmentReasonsForm.value;
  }

  hasChanges(): boolean {
    if (this.mode === 'create') return true;
    const currentValue = this.adjustmentReasonsForm.value;
    return (
      JSON.stringify(currentValue) !== JSON.stringify(this.originalFormValue)
    );
  }

  onSubmit() {
    if (this.adjustmentReasonsForm.valid) {
      const formData = {
        ...this.adjustmentReasonsForm.value,
      } as AdjustmentReasonFormData;

      this.formSubmit.emit(formData);
    }
  }

  onCancel() {
    this.formCancel.emit();
  }
}
