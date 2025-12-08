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
  DrugFocusList,
  CreateDrugFocusListRequest,
  UpdateDrugFocusListRequest,
} from '../types/drug-focus-lists.types';
// CRUD-GENERATOR-TAG: Foreign Key Service Import

export type DrugFocusListFormMode = 'create' | 'edit';

export interface DrugFocusListFormData {
  list_code: string;
  list_name: string;
  description?: string;
  generic_id?: string;
  drug_id?: string;
  is_active?: boolean;
}

@Component({
  selector: 'app-drug-focus-lists-form',
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
      <form [formGroup]="drugFocusListsForm" class="drug-focus-lists-form">
        <!-- Form Fields Section -->
        <div class="ax-dialog-section">
          <h3 class="ax-dialog-section-title">DrugFocusList Information</h3>
          <div class="ax-dialog-section-content">
            <div class="form-grid">
              <!-- list_code Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>List Code</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="list_code"
                  placeholder="Enter list code"
                />
                <mat-error
                  *ngIf="
                    drugFocusListsForm.get('list_code')?.hasError('required')
                  "
                >
                  List Code is required
                </mat-error>
              </mat-form-field>

              <!-- list_name Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>List Name</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="list_name"
                  placeholder="Enter list name"
                />
                <mat-error
                  *ngIf="
                    drugFocusListsForm.get('list_name')?.hasError('required')
                  "
                >
                  List Name is required
                </mat-error>
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
                    drugFocusListsForm.get('description')?.hasError('maxlength')
                  "
                >
                  Description must be less than 1000 characters
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
              </mat-form-field>

              <!-- drug_id Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Drug Id</mat-label>
                <input
                  matInput
                  type="dropdown"
                  formControlName="drug_id"
                  placeholder="Enter drug id"
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
          drugFocusListsForm.invalid ||
          loading ||
          (mode === 'edit' && !hasChanges())
        "
      >
        @if (loading) {
          <mat-spinner diameter="20" class="inline-spinner"></mat-spinner>
        }
        {{ mode === 'create' ? 'Create' : 'Update' }} DrugFocusList
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      /* Form Container */
      .drug-focus-lists-form {
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
export class DrugFocusListFormComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);
  // CRUD-GENERATOR-TAG: Foreign Key Service Injection

  @Input() mode: DrugFocusListFormMode = 'create';
  @Input() initialData?: DrugFocusList;
  @Input() loading = false;

  @Output() formSubmit = new EventEmitter<DrugFocusListFormData>();
  @Output() formCancel = new EventEmitter<void>();

  private originalFormValue: any;
  // CRUD-GENERATOR-TAG: Foreign Key Options State

  drugFocusListsForm: FormGroup = this.fb.group({
    list_code: ['', [Validators.required]],
    list_name: ['', [Validators.required]],
    description: ['', [Validators.maxLength(1000)]],
    generic_id: ['', []],
    drug_id: ['', []],
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

  private populateForm(drugFocusLists: DrugFocusList) {
    const formValue = {
      list_code: drugFocusLists.list_code,
      list_name: drugFocusLists.list_name,
      description: drugFocusLists.description,
      generic_id: drugFocusLists.generic_id,
      drug_id: drugFocusLists.drug_id,
      is_active: drugFocusLists.is_active,
    };

    this.drugFocusListsForm.patchValue(formValue);
    this.originalFormValue = this.drugFocusListsForm.value;
  }

  hasChanges(): boolean {
    if (this.mode === 'create') return true;
    const currentValue = this.drugFocusListsForm.value;
    return (
      JSON.stringify(currentValue) !== JSON.stringify(this.originalFormValue)
    );
  }

  onSubmit() {
    if (this.drugFocusListsForm.valid) {
      const formData = {
        ...this.drugFocusListsForm.value,
      } as DrugFocusListFormData;

      this.formSubmit.emit(formData);
    }
  }

  onCancel() {
    this.formCancel.emit();
  }
}
