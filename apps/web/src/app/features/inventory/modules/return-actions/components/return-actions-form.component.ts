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
  ReturnAction,
  CreateReturnActionRequest,
  UpdateReturnActionRequest,
} from '../types/return-actions.types';

export type ReturnActionFormMode = 'create' | 'edit';

export interface ReturnActionFormData {
  action_code: string;
  action_name: string;
  action_type?: string;
  requires_vendor_approval?: boolean;
  description?: string;
  is_active?: boolean;
}

@Component({
  selector: 'app-return-actions-form',
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
      <form [formGroup]="returnActionsForm" class="return-actions-form">
        <!-- Form Fields Section -->
        <div class="ax-dialog-section">
          <h3 class="ax-dialog-section-title">ReturnAction Information</h3>
          <div class="ax-dialog-section-content">
            <div class="form-grid">
              <!-- action_code Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Action Code</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="action_code"
                  placeholder="Enter action code"
                />
                <mat-error
                  *ngIf="
                    returnActionsForm.get('action_code')?.hasError('required')
                  "
                >
                  Action Code is required
                </mat-error>
              </mat-form-field>

              <!-- action_name Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Action Name</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="action_name"
                  placeholder="Enter action name"
                />
                <mat-error
                  *ngIf="
                    returnActionsForm.get('action_name')?.hasError('required')
                  "
                >
                  Action Name is required
                </mat-error>
              </mat-form-field>

              <!-- action_type Field -->
              <!-- FK reference not found, render as plain text input -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Action Type</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="action_type"
                  placeholder="Enter action type"
                />
              </mat-form-field>

              <!-- requires_vendor_approval Field -->
              <div class="checkbox-field">
                <mat-checkbox formControlName="requires_vendor_approval">
                  Requires Vendor Approval
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
                    returnActionsForm.get('description')?.hasError('maxlength')
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
          returnActionsForm.invalid ||
          loading ||
          (mode === 'edit' && !hasChanges())
        "
      >
        @if (loading) {
          <mat-spinner diameter="20" class="inline-spinner"></mat-spinner>
        }
        {{ mode === 'create' ? 'Create' : 'Update' }} ReturnAction
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      /* Form Container */
      .return-actions-form {
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
export class ReturnActionFormComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);

  @Input() mode: ReturnActionFormMode = 'create';
  @Input() initialData?: ReturnAction;
  @Input() loading = false;

  @Output() formSubmit = new EventEmitter<ReturnActionFormData>();
  @Output() formCancel = new EventEmitter<void>();

  private originalFormValue: any;

  returnActionsForm: FormGroup = this.fb.group({
    action_code: ['', [Validators.required]],
    action_name: ['', [Validators.required]],
    action_type: ['', []],
    requires_vendor_approval: [false, []],
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

  private populateForm(returnActions: ReturnAction) {
    const formValue = {
      action_code: returnActions.action_code,
      action_name: returnActions.action_name,
      action_type: returnActions.action_type,
      requires_vendor_approval: returnActions.requires_vendor_approval,
      description: returnActions.description,
      is_active: returnActions.is_active,
    };

    this.returnActionsForm.patchValue(formValue);
    this.originalFormValue = this.returnActionsForm.value;
  }

  hasChanges(): boolean {
    if (this.mode === 'create') return true;
    const currentValue = this.returnActionsForm.value;
    return (
      JSON.stringify(currentValue) !== JSON.stringify(this.originalFormValue)
    );
  }

  onSubmit() {
    if (this.returnActionsForm.valid) {
      const formData = {
        ...this.returnActionsForm.value,
      } as ReturnActionFormData;

      this.formSubmit.emit(formData);
    }
  }

  onCancel() {
    this.formCancel.emit();
  }
}
