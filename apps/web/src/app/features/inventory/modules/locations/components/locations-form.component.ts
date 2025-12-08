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
  Location,
  CreateLocationRequest,
  UpdateLocationRequest,
} from '../types/locations.types';
// CRUD-GENERATOR-TAG: Foreign Key Service Import

export type LocationFormMode = 'create' | 'edit';

export interface LocationFormData {
  location_code: string;
  location_name: string;
  location_type: string;
  parent_id?: string;
  address?: string;
  responsible_person?: string;
  is_active?: boolean;
}

@Component({
  selector: 'app-locations-form',
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
      <form [formGroup]="locationsForm" class="locations-form">
        <!-- Form Fields Section -->
        <div class="ax-dialog-section">
          <h3 class="ax-dialog-section-title">Location Information</h3>
          <div class="ax-dialog-section-content">
            <div class="form-grid">
              <!-- location_code Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Location Code</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="location_code"
                  placeholder="Enter location code"
                />
                <mat-error
                  *ngIf="
                    locationsForm.get('location_code')?.hasError('required')
                  "
                >
                  Location Code is required
                </mat-error>
              </mat-form-field>

              <!-- location_name Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Location Name</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="location_name"
                  placeholder="Enter location name"
                />
                <mat-error
                  *ngIf="
                    locationsForm.get('location_name')?.hasError('required')
                  "
                >
                  Location Name is required
                </mat-error>
              </mat-form-field>

              <!-- location_type Field -->
              <!-- FK reference not found, render as plain text input -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Location Type</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="location_type"
                  placeholder="Enter location type"
                />
                <mat-error
                  *ngIf="
                    locationsForm.get('location_type')?.hasError('required')
                  "
                >
                  Location Type is required
                </mat-error>
              </mat-form-field>

              <!-- parent_id Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Parent Id</mat-label>
                <input
                  matInput
                  type="dropdown"
                  formControlName="parent_id"
                  placeholder="Enter parent id"
                />
              </mat-form-field>

              <!-- address Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Address</mat-label>
                <textarea
                  matInput
                  formControlName="address"
                  placeholder="Enter address"
                  rows="3"
                ></textarea>
              </mat-form-field>

              <!-- responsible_person Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Responsible Person</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="responsible_person"
                  placeholder="Enter responsible person"
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
          locationsForm.invalid || loading || (mode === 'edit' && !hasChanges())
        "
      >
        @if (loading) {
          <mat-spinner diameter="20" class="inline-spinner"></mat-spinner>
        }
        {{ mode === 'create' ? 'Create' : 'Update' }} Location
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      /* Form Container */
      .locations-form {
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
export class LocationFormComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);
  // CRUD-GENERATOR-TAG: Foreign Key Service Injection

  @Input() mode: LocationFormMode = 'create';
  @Input() initialData?: Location;
  @Input() loading = false;

  @Output() formSubmit = new EventEmitter<LocationFormData>();
  @Output() formCancel = new EventEmitter<void>();

  private originalFormValue: any;
  // CRUD-GENERATOR-TAG: Foreign Key Options State

  locationsForm: FormGroup = this.fb.group({
    location_code: ['', [Validators.required]],
    location_name: ['', [Validators.required]],
    location_type: ['', [Validators.required]],
    parent_id: ['', []],
    address: ['', []],
    responsible_person: ['', []],
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

  private populateForm(locations: Location) {
    const formValue = {
      location_code: locations.location_code,
      location_name: locations.location_name,
      location_type: locations.location_type,
      parent_id: locations.parent_id,
      address: locations.address,
      responsible_person: locations.responsible_person,
      is_active: locations.is_active,
    };

    this.locationsForm.patchValue(formValue);
    this.originalFormValue = this.locationsForm.value;
  }

  hasChanges(): boolean {
    if (this.mode === 'create') return true;
    const currentValue = this.locationsForm.value;
    return (
      JSON.stringify(currentValue) !== JSON.stringify(this.originalFormValue)
    );
  }

  onSubmit() {
    if (this.locationsForm.valid) {
      const formData = { ...this.locationsForm.value } as LocationFormData;

      this.formSubmit.emit(formData);
    }
  }

  onCancel() {
    this.formCancel.emit();
  }
}
