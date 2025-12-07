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
  DrugComponent,
  CreateDrugComponentRequest,
  UpdateDrugComponentRequest,
} from '../types/drug-components.types';
// CRUD-GENERATOR-TAG: Foreign Key Service Import

export type DrugComponentFormMode = 'create' | 'edit';

export interface DrugComponentFormData {
  generic_id: string;
  component_name: string;
  strength?: string;
  strength_value?: unknown;
  strength_unit?: string;
  is_active?: boolean;
}

@Component({
  selector: 'app-drug-components-form',
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
      <form [formGroup]="drugComponentsForm" class="drug-components-form">
        <!-- Form Fields Section -->
        <div class="ax-dialog-section">
          <h3 class="ax-dialog-section-title">DrugComponent Information</h3>
          <div class="ax-dialog-section-content">
            <div class="form-grid">
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
                    drugComponentsForm.get('generic_id')?.hasError('required')
                  "
                >
                  Generic Id is required
                </mat-error>
              </mat-form-field>

              <!-- component_name Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Component Name</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="component_name"
                  placeholder="Enter component name"
                />
                <mat-error
                  *ngIf="
                    drugComponentsForm
                      .get('component_name')
                      ?.hasError('required')
                  "
                >
                  Component Name is required
                </mat-error>
              </mat-form-field>

              <!-- strength Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Strength</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="strength"
                  placeholder="Enter strength"
                />
              </mat-form-field>

              <!-- strength_value Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Strength Value</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="strength_value"
                  placeholder="Enter strength value"
                />
              </mat-form-field>

              <!-- strength_unit Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Strength Unit</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="strength_unit"
                  placeholder="Enter strength unit"
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
          drugComponentsForm.invalid ||
          loading ||
          (mode === 'edit' && !hasChanges())
        "
      >
        @if (loading) {
          <mat-spinner diameter="20" class="inline-spinner"></mat-spinner>
        }
        {{ mode === 'create' ? 'Create' : 'Update' }} DrugComponent
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      /* Form Container */
      .drug-components-form {
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
export class DrugComponentFormComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);
  // CRUD-GENERATOR-TAG: Foreign Key Service Injection

  @Input() mode: DrugComponentFormMode = 'create';
  @Input() initialData?: DrugComponent;
  @Input() loading = false;

  @Output() formSubmit = new EventEmitter<DrugComponentFormData>();
  @Output() formCancel = new EventEmitter<void>();

  private originalFormValue: any;
  // CRUD-GENERATOR-TAG: Foreign Key Options State

  drugComponentsForm: FormGroup = this.fb.group({
    generic_id: ['', [Validators.required]],
    component_name: ['', [Validators.required]],
    strength: ['', []],
    strength_value: ['', []],
    strength_unit: ['', []],
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

  private populateForm(drugComponents: DrugComponent) {
    const formValue = {
      generic_id: drugComponents.generic_id,
      component_name: drugComponents.component_name,
      strength: drugComponents.strength,
      strength_value: drugComponents.strength_value,
      strength_unit: drugComponents.strength_unit,
      is_active: drugComponents.is_active,
    };

    this.drugComponentsForm.patchValue(formValue);
    this.originalFormValue = this.drugComponentsForm.value;
  }

  hasChanges(): boolean {
    if (this.mode === 'create') return true;
    const currentValue = this.drugComponentsForm.value;
    return (
      JSON.stringify(currentValue) !== JSON.stringify(this.originalFormValue)
    );
  }

  onSubmit() {
    if (this.drugComponentsForm.valid) {
      const formData = {
        ...this.drugComponentsForm.value,
      } as DrugComponentFormData;

      // Convert number fields from string to number (TypeBox expects number, not string)
      if (formData.strength_value !== undefined) {
        const strength_valueVal = formData.strength_value;
        formData.strength_value =
          strength_valueVal === '' || strength_valueVal === null
            ? null
            : Number(strength_valueVal);
      }

      this.formSubmit.emit(formData);
    }
  }

  onCancel() {
    this.formCancel.emit();
  }
}
