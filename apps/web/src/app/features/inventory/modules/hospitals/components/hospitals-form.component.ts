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
  Hospital,
  CreateHospitalRequest,
  UpdateHospitalRequest,
} from '../types/hospitals.types';

export type HospitalFormMode = 'create' | 'edit';

export interface HospitalFormData {
  hospital_code: string;
  hospital_name: string;
  hospital_type?: string;
  province?: string;
  region?: string;
  is_active?: boolean;
}

@Component({
  selector: 'app-hospitals-form',
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
      <form [formGroup]="hospitalsForm" class="hospitals-form">
        <!-- Form Fields Section -->
        <div class="ax-dialog-section">
          <h3 class="ax-dialog-section-title">Hospital Information</h3>
          <div class="ax-dialog-section-content">
            <div class="form-grid">
              <!-- hospital_code Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Hospital Code</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="hospital_code"
                  placeholder="Enter hospital code"
                />
                <mat-error
                  *ngIf="
                    hospitalsForm.get('hospital_code')?.hasError('required')
                  "
                >
                  Hospital Code is required
                </mat-error>
              </mat-form-field>

              <!-- hospital_name Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Hospital Name</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="hospital_name"
                  placeholder="Enter hospital name"
                />
                <mat-error
                  *ngIf="
                    hospitalsForm.get('hospital_name')?.hasError('required')
                  "
                >
                  Hospital Name is required
                </mat-error>
              </mat-form-field>

              <!-- hospital_type Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Hospital Type</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="hospital_type"
                  placeholder="Enter hospital type"
                />
              </mat-form-field>

              <!-- province Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Province</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="province"
                  placeholder="Enter province"
                />
              </mat-form-field>

              <!-- region Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Region</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="region"
                  placeholder="Enter region"
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
          hospitalsForm.invalid || loading || (mode === 'edit' && !hasChanges())
        "
      >
        @if (loading) {
          <mat-spinner diameter="20" class="inline-spinner"></mat-spinner>
        }
        {{ mode === 'create' ? 'Create' : 'Update' }} Hospital
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      /* Form Container */
      .hospitals-form {
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
export class HospitalFormComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);

  @Input() mode: HospitalFormMode = 'create';
  @Input() initialData?: Hospital;
  @Input() loading = false;

  @Output() formSubmit = new EventEmitter<HospitalFormData>();
  @Output() formCancel = new EventEmitter<void>();

  private originalFormValue: any;

  hospitalsForm: FormGroup = this.fb.group({
    hospital_code: ['', [Validators.required]],
    hospital_name: ['', [Validators.required]],
    hospital_type: ['', []],
    province: ['', []],
    region: ['', []],
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

  private populateForm(hospitals: Hospital) {
    const formValue = {
      hospital_code: hospitals.hospital_code,
      hospital_name: hospitals.hospital_name,
      hospital_type: hospitals.hospital_type,
      province: hospitals.province,
      region: hospitals.region,
      is_active: hospitals.is_active,
    };

    this.hospitalsForm.patchValue(formValue);
    this.originalFormValue = this.hospitalsForm.value;
  }

  hasChanges(): boolean {
    if (this.mode === 'create') return true;
    const currentValue = this.hospitalsForm.value;
    return (
      JSON.stringify(currentValue) !== JSON.stringify(this.originalFormValue)
    );
  }

  onSubmit() {
    if (this.hospitalsForm.valid) {
      const formData = { ...this.hospitalsForm.value } as HospitalFormData;

      this.formSubmit.emit(formData);
    }
  }

  onCancel() {
    this.formCancel.emit();
  }
}
