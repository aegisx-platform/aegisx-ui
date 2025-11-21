import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TestProduct } from '../types/test-products.types';

export type TestProductFormMode = 'create' | 'edit';

export interface TestProductFormData {
  code: string;
  name: string;
  slug: string;
  description?: string;
  is_active?: boolean;
  is_featured?: boolean;
  display_order?: number;
  item_count?: number;
  discount_rate?: number;
  metadata?: string;
  settings?: string;
  status?: string;
  deleted_at?: string;
  updated_by?: string;
}

@Component({
  selector: 'app-test-products-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
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
    <form [formGroup]="testProductsForm" class="test-products-form">
      <!-- ============================================
           Basic Information Section
           ============================================ -->
      <div class="ax-dialog-section">
        <h3 class="ax-dialog-section-title">Basic Information</h3>
        <div class="ax-dialog-section-content">
          <div class="form-grid">
            <!-- code Field -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Code</mat-label>
              <input
                matInput
                type="text"
                formControlName="code"
                placeholder="Enter code"
              />
              <mat-error
                *ngIf="testProductsForm.get('code')?.hasError('required')"
              >
                Code is required
              </mat-error>
            </mat-form-field>

            <!-- name Field -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Name</mat-label>
              <input
                matInput
                type="text"
                formControlName="name"
                placeholder="Enter name"
              />
              <mat-error
                *ngIf="testProductsForm.get('name')?.hasError('required')"
              >
                Name is required
              </mat-error>
              <mat-error
                *ngIf="testProductsForm.get('name')?.hasError('maxlength')"
              >
                Name must be less than 255 characters
              </mat-error>
            </mat-form-field>

            <!-- slug Field -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Slug</mat-label>
              <input
                matInput
                type="text"
                formControlName="slug"
                placeholder="Enter slug"
              />
              <mat-error
                *ngIf="testProductsForm.get('slug')?.hasError('required')"
              >
                Slug is required
              </mat-error>
            </mat-form-field>
          </div>

          <!-- description Field (full width) -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description</mat-label>
            <textarea
              matInput
              formControlName="description"
              placeholder="Enter description"
              rows="3"
            ></textarea>
            <mat-error
              *ngIf="testProductsForm.get('description')?.hasError('maxlength')"
            >
              Description must be less than 1000 characters
            </mat-error>
          </mat-form-field>
        </div>
      </div>

      <!-- ============================================
           Status & Display Section
           ============================================ -->
      <div class="ax-dialog-section">
        <h3 class="ax-dialog-section-title">Status & Display</h3>
        <div class="ax-dialog-section-content">
          <div class="form-grid">
            <!-- is_active Field -->
            <div class="checkbox-field">
              <mat-checkbox formControlName="is_active">
                Is Active
              </mat-checkbox>
            </div>

            <!-- is_featured Field -->
            <div class="checkbox-field">
              <mat-checkbox formControlName="is_featured">
                Is Featured
              </mat-checkbox>
            </div>

            <!-- display_order Field -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Display Order</mat-label>
              <input
                matInput
                type="number"
                formControlName="display_order"
                placeholder="Enter display order"
              />
            </mat-form-field>

            <!-- item_count Field -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Item Count</mat-label>
              <input
                matInput
                type="number"
                formControlName="item_count"
                placeholder="Enter item count"
              />
            </mat-form-field>

            <!-- discount_rate Field -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Discount Rate</mat-label>
              <input
                matInput
                type="number"
                formControlName="discount_rate"
                placeholder="Enter discount rate"
              />
            </mat-form-field>

            <!-- status Field -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Status</mat-label>
              <input
                matInput
                type="text"
                formControlName="status"
                placeholder="Enter status"
              />
              <mat-error
                *ngIf="testProductsForm.get('status')?.hasError('maxlength')"
              >
                Status must be less than 20 characters
              </mat-error>
            </mat-form-field>
          </div>
        </div>
      </div>

      <!-- ============================================
           Metadata & Settings Section
           ============================================ -->
      <div class="ax-dialog-section">
        <h3 class="ax-dialog-section-title">Metadata & Settings</h3>
        <div class="ax-dialog-section-content">
          <div class="form-grid">
            <!-- metadata Field -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Metadata</mat-label>
              <input
                matInput
                type="text"
                formControlName="metadata"
                placeholder="Enter metadata"
              />
            </mat-form-field>

            <!-- settings Field -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Settings</mat-label>
              <input
                matInput
                type="text"
                formControlName="settings"
                placeholder="Enter settings"
              />
            </mat-form-field>
          </div>
        </div>
      </div>

      <!-- ============================================
           Audit Information Section (Edit Mode Only)
           ============================================ -->
      @if (mode === 'edit') {
        <div class="ax-dialog-section">
          <h3 class="ax-dialog-section-title">Audit Information</h3>
          <div class="ax-dialog-section-metadata">
            <div class="form-grid">
              <!-- deleted_at Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Deleted At</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="deleted_at"
                  placeholder="Enter deleted at"
                />
              </mat-form-field>

              <!-- updated_by Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Updated By</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="updated_by"
                  placeholder="Enter updated by"
                />
              </mat-form-field>
            </div>
          </div>
        </div>
      }
    </form>
  `,
  styles: [
    `
      /* Form Container - No conflicting styles, shared styles handle sections */
      .test-products-form {
        display: flex;
        flex-direction: column;
      }

      /* Grid Layout for Fields */
      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--ax-spacing-md);
      }

      .full-width {
        width: 100%;
      }

      /* Checkbox Field */
      .checkbox-field {
        display: flex;
        align-items: center;
        min-height: 56px;
        padding: var(--ax-spacing-sm) 0;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .form-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class TestProductFormComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);

  @Input() mode: TestProductFormMode = 'create';
  @Input() initialData?: TestProduct;
  @Input() loading = false;

  @Output() formSubmit = new EventEmitter<TestProductFormData>();
  @Output() formCancel = new EventEmitter<void>();

  private originalFormValue: any;

  testProductsForm: FormGroup = this.fb.group({
    code: ['', [Validators.required]],
    name: ['', [Validators.required, Validators.maxLength(255)]],
    slug: ['', [Validators.required]],
    description: ['', [Validators.maxLength(1000)]],
    is_active: [false, []],
    is_featured: [false, []],
    display_order: ['', []],
    item_count: ['', []],
    discount_rate: ['', []],
    metadata: ['', []],
    settings: ['', []],
    status: ['', [Validators.maxLength(20)]],
    deleted_at: ['', []],
    updated_by: ['', []],
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

  private populateForm(testProducts: TestProduct) {
    const formValue = {
      code: testProducts.code,
      name: testProducts.name,
      slug: testProducts.slug,
      description: testProducts.description,
      is_active: testProducts.is_active,
      is_featured: testProducts.is_featured,
      display_order: testProducts.display_order,
      item_count: testProducts.item_count,
      discount_rate: testProducts.discount_rate,
      metadata: testProducts.metadata,
      settings: testProducts.settings,
      status: testProducts.status,
      deleted_at: testProducts.deleted_at,
      updated_by: testProducts.updated_by,
    };

    this.testProductsForm.patchValue(formValue);
    this.originalFormValue = this.testProductsForm.value;
  }

  hasChanges(): boolean {
    if (this.mode === 'create') return true;
    const currentValue = this.testProductsForm.value;
    return (
      JSON.stringify(currentValue) !== JSON.stringify(this.originalFormValue)
    );
  }

  onSubmit() {
    if (this.testProductsForm.valid) {
      const formData = {
        ...this.testProductsForm.value,
      } as TestProductFormData;

      this.formSubmit.emit(formData);
    }
  }

  onCancel() {
    this.formCancel.emit();
  }
}
