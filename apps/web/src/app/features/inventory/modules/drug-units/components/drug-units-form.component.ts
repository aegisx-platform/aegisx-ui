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
  DrugUnit,
  CreateDrugUnitRequest,
  UpdateDrugUnitRequest,
} from '../types/drug-units.types';

export type DrugUnitFormMode = 'create' | 'edit';

export interface DrugUnitFormData {
  unit_code: string;
  unit_name: string;
  unit_name_en?: string;
  unit_type?: string;
  description?: string;
  is_active?: boolean;
}

@Component({
  selector: 'app-drug-units-form',
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
      <form [formGroup]="drugUnitsForm" class="drug-units-form">
        <!-- Form Fields Section -->
        <div class="ax-dialog-section">
          <h3 class="ax-dialog-section-title">DrugUnit Information</h3>
          <div class="ax-dialog-section-content">
            <div class="form-grid">
              <!-- unit_code Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Unit Code</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="unit_code"
                  placeholder="Enter unit code"
                />
                <mat-error
                  *ngIf="drugUnitsForm.get('unit_code')?.hasError('required')"
                >
                  Unit Code is required
                </mat-error>
              </mat-form-field>

              <!-- unit_name Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Unit Name</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="unit_name"
                  placeholder="Enter unit name"
                />
                <mat-error
                  *ngIf="drugUnitsForm.get('unit_name')?.hasError('required')"
                >
                  Unit Name is required
                </mat-error>
              </mat-form-field>

              <!-- unit_name_en Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Unit Name En</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="unit_name_en"
                  placeholder="Enter unit name en"
                />
              </mat-form-field>

              <!-- unit_type Field -->
              <!-- FK reference not found, render as plain text input -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Unit Type</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="unit_type"
                  placeholder="Enter unit type"
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
                    drugUnitsForm.get('description')?.hasError('maxlength')
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
          drugUnitsForm.invalid || loading || (mode === 'edit' && !hasChanges())
        "
      >
        @if (loading) {
          <mat-spinner diameter="20" class="inline-spinner"></mat-spinner>
        }
        {{ mode === 'create' ? 'Create' : 'Update' }} DrugUnit
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      /* Form Container */
      .drug-units-form {
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
export class DrugUnitFormComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);

  @Input() mode: DrugUnitFormMode = 'create';
  @Input() initialData?: DrugUnit;
  @Input() loading = false;

  @Output() formSubmit = new EventEmitter<DrugUnitFormData>();
  @Output() formCancel = new EventEmitter<void>();

  private originalFormValue: any;

  drugUnitsForm: FormGroup = this.fb.group({
    unit_code: ['', [Validators.required]],
    unit_name: ['', [Validators.required]],
    unit_name_en: ['', []],
    unit_type: ['', []],
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

  private populateForm(drugUnits: DrugUnit) {
    const formValue = {
      unit_code: drugUnits.unit_code,
      unit_name: drugUnits.unit_name,
      unit_name_en: drugUnits.unit_name_en,
      unit_type: drugUnits.unit_type,
      description: drugUnits.description,
      is_active: drugUnits.is_active,
    };

    this.drugUnitsForm.patchValue(formValue);
    this.originalFormValue = this.drugUnitsForm.value;
  }

  hasChanges(): boolean {
    if (this.mode === 'create') return true;
    const currentValue = this.drugUnitsForm.value;
    return (
      JSON.stringify(currentValue) !== JSON.stringify(this.originalFormValue)
    );
  }

  onSubmit() {
    if (this.drugUnitsForm.valid) {
      const formData = { ...this.drugUnitsForm.value } as DrugUnitFormData;

      this.formSubmit.emit(formData);
    }
  }

  onCancel() {
    this.formCancel.emit();
  }
}
