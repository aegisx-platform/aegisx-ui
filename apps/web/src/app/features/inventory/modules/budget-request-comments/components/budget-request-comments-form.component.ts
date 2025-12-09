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
  BudgetRequestComment,
  CreateBudgetRequestCommentRequest,
  UpdateBudgetRequestCommentRequest,
} from '../types/budget-request-comments.types';
// CRUD-GENERATOR-TAG: Foreign Key Service Import

export type BudgetRequestCommentFormMode = 'create' | 'edit';

export interface BudgetRequestCommentFormData {
  budget_request_id: string;
  parent_id?: string;
  comment: string;
}

@Component({
  selector: 'app-budget-request-comments-form',
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
        [formGroup]="budgetRequestCommentsForm"
        class="budget-request-comments-form"
      >
        <!-- Form Fields Section -->
        <div class="ax-dialog-section">
          <h3 class="ax-dialog-section-title">
            BudgetRequestComment Information
          </h3>
          <div class="ax-dialog-section-content">
            <div class="form-grid">
              <!-- budget_request_id Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Budget Request Id</mat-label>
                <input
                  matInput
                  type="dropdown"
                  formControlName="budget_request_id"
                  placeholder="Enter budget request id"
                />
                <mat-error
                  *ngIf="
                    budgetRequestCommentsForm
                      .get('budget_request_id')
                      ?.hasError('required')
                  "
                >
                  Budget Request Id is required
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

              <!-- comment Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Comment</mat-label>
                <textarea
                  matInput
                  formControlName="comment"
                  placeholder="Enter comment"
                  rows="3"
                ></textarea>
                <mat-error
                  *ngIf="
                    budgetRequestCommentsForm
                      .get('comment')
                      ?.hasError('required')
                  "
                >
                  Comment is required
                </mat-error>
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
          budgetRequestCommentsForm.invalid ||
          loading ||
          (mode === 'edit' && !hasChanges())
        "
      >
        @if (loading) {
          <mat-spinner diameter="20" class="inline-spinner"></mat-spinner>
        }
        {{ mode === 'create' ? 'Create' : 'Update' }} BudgetRequestComment
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      /* Form Container */
      .budget-request-comments-form {
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
export class BudgetRequestCommentFormComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);
  // CRUD-GENERATOR-TAG: Foreign Key Service Injection

  @Input() mode: BudgetRequestCommentFormMode = 'create';
  @Input() initialData?: BudgetRequestComment;
  @Input() loading = false;

  @Output() formSubmit = new EventEmitter<BudgetRequestCommentFormData>();
  @Output() formCancel = new EventEmitter<void>();

  private originalFormValue: any;
  // CRUD-GENERATOR-TAG: Foreign Key Options State

  budgetRequestCommentsForm: FormGroup = this.fb.group({
    budget_request_id: ['', [Validators.required]],
    parent_id: ['', []],
    comment: ['', [Validators.required]],
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

  private populateForm(budgetRequestComments: BudgetRequestComment) {
    const formValue = {
      budget_request_id: budgetRequestComments.budget_request_id,
      parent_id: budgetRequestComments.parent_id,
      comment: budgetRequestComments.comment,
    };

    this.budgetRequestCommentsForm.patchValue(formValue);
    this.originalFormValue = this.budgetRequestCommentsForm.value;
  }

  hasChanges(): boolean {
    if (this.mode === 'create') return true;
    const currentValue = this.budgetRequestCommentsForm.value;
    return (
      JSON.stringify(currentValue) !== JSON.stringify(this.originalFormValue)
    );
  }

  onSubmit() {
    if (this.budgetRequestCommentsForm.valid) {
      const formData = {
        ...this.budgetRequestCommentsForm.value,
      } as BudgetRequestCommentFormData;

      this.formSubmit.emit(formData);
    }
  }

  onCancel() {
    this.formCancel.emit();
  }
}
