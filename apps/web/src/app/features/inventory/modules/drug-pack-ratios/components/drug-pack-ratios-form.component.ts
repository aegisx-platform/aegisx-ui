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
  DrugPackRatio,
  CreateDrugPackRatioRequest,
  UpdateDrugPackRatioRequest,
} from '../types/drug-pack-ratios.types';
// CRUD-GENERATOR-TAG: Foreign Key Service Import

export type DrugPackRatioFormMode = 'create' | 'edit';

export interface DrugPackRatioFormData {
  drug_id: string;
  company_id?: string;
  pack_size: unknown;
  pack_unit: string;
  unit_per_pack: unknown;
  pack_price?: unknown;
  is_default?: boolean;
  is_active?: boolean;
}

@Component({
  selector: 'app-drug-pack-ratios-form',
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
      <form [formGroup]="drugPackRatiosForm" class="drug-pack-ratios-form">
        <!-- Form Fields Section -->
        <div class="ax-dialog-section">
          <h3 class="ax-dialog-section-title">DrugPackRatio Information</h3>
          <div class="ax-dialog-section-content">
            <div class="form-grid">
              <!-- drug_id Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Drug Id</mat-label>
                <input
                  matInput
                  type="dropdown"
                  formControlName="drug_id"
                  placeholder="Enter drug id"
                />
                <mat-error
                  *ngIf="
                    drugPackRatiosForm.get('drug_id')?.hasError('required')
                  "
                >
                  Drug Id is required
                </mat-error>
              </mat-form-field>

              <!-- company_id Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Company Id</mat-label>
                <input
                  matInput
                  type="dropdown"
                  formControlName="company_id"
                  placeholder="Enter company id"
                />
              </mat-form-field>

              <!-- pack_size Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Pack Size</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="pack_size"
                  placeholder="Enter pack size"
                />
                <mat-error
                  *ngIf="
                    drugPackRatiosForm.get('pack_size')?.hasError('required')
                  "
                >
                  Pack Size is required
                </mat-error>
              </mat-form-field>

              <!-- pack_unit Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Pack Unit</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="pack_unit"
                  placeholder="Enter pack unit"
                />
                <mat-error
                  *ngIf="
                    drugPackRatiosForm.get('pack_unit')?.hasError('required')
                  "
                >
                  Pack Unit is required
                </mat-error>
              </mat-form-field>

              <!-- unit_per_pack Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Unit Per Pack</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="unit_per_pack"
                  placeholder="Enter unit per pack"
                />
                <mat-error
                  *ngIf="
                    drugPackRatiosForm
                      .get('unit_per_pack')
                      ?.hasError('required')
                  "
                >
                  Unit Per Pack is required
                </mat-error>
              </mat-form-field>

              <!-- pack_price Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Pack Price</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="pack_price"
                  placeholder="Enter pack price"
                />
              </mat-form-field>

              <!-- is_default Field -->
              <div class="checkbox-field">
                <mat-checkbox formControlName="is_default">
                  Is Default
                </mat-checkbox>
              </div>

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
          drugPackRatiosForm.invalid ||
          loading ||
          (mode === 'edit' && !hasChanges())
        "
      >
        @if (loading) {
          <mat-spinner diameter="20" class="inline-spinner"></mat-spinner>
        }
        {{ mode === 'create' ? 'Create' : 'Update' }} DrugPackRatio
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      /* Form Container */
      .drug-pack-ratios-form {
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
export class DrugPackRatioFormComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);
  // CRUD-GENERATOR-TAG: Foreign Key Service Injection

  @Input() mode: DrugPackRatioFormMode = 'create';
  @Input() initialData?: DrugPackRatio;
  @Input() loading = false;

  @Output() formSubmit = new EventEmitter<DrugPackRatioFormData>();
  @Output() formCancel = new EventEmitter<void>();

  private originalFormValue: any;
  // CRUD-GENERATOR-TAG: Foreign Key Options State

  drugPackRatiosForm: FormGroup = this.fb.group({
    drug_id: ['', [Validators.required]],
    company_id: ['', []],
    pack_size: ['', [Validators.required]],
    pack_unit: ['', [Validators.required]],
    unit_per_pack: ['', [Validators.required]],
    pack_price: ['', []],
    is_default: [false, []],
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

  private populateForm(drugPackRatios: DrugPackRatio) {
    const formValue = {
      drug_id: drugPackRatios.drug_id,
      company_id: drugPackRatios.company_id,
      pack_size: drugPackRatios.pack_size,
      pack_unit: drugPackRatios.pack_unit,
      unit_per_pack: drugPackRatios.unit_per_pack,
      pack_price: drugPackRatios.pack_price,
      is_default: drugPackRatios.is_default,
      is_active: drugPackRatios.is_active,
    };

    this.drugPackRatiosForm.patchValue(formValue);
    this.originalFormValue = this.drugPackRatiosForm.value;
  }

  hasChanges(): boolean {
    if (this.mode === 'create') return true;
    const currentValue = this.drugPackRatiosForm.value;
    return (
      JSON.stringify(currentValue) !== JSON.stringify(this.originalFormValue)
    );
  }

  onSubmit() {
    if (this.drugPackRatiosForm.valid) {
      const formData = {
        ...this.drugPackRatiosForm.value,
      } as DrugPackRatioFormData;

      // Convert number fields from string to number (TypeBox expects number, not string)
      if (formData.pack_size !== undefined) {
        const pack_sizeVal = formData.pack_size;
        formData.pack_size =
          pack_sizeVal === '' || pack_sizeVal === null
            ? null
            : Number(pack_sizeVal);
      }
      if (formData.unit_per_pack !== undefined) {
        const unit_per_packVal = formData.unit_per_pack;
        formData.unit_per_pack =
          unit_per_packVal === '' || unit_per_packVal === null
            ? null
            : Number(unit_per_packVal);
      }
      if (formData.pack_price !== undefined) {
        const pack_priceVal = formData.pack_price;
        formData.pack_price =
          pack_priceVal === '' || pack_priceVal === null
            ? null
            : Number(pack_priceVal);
      }

      this.formSubmit.emit(formData);
    }
  }

  onCancel() {
    this.formCancel.emit();
  }
}
