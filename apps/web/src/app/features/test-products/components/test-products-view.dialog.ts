import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { TestProduct } from '../types/test-products.types';

export interface TestProductViewDialogData {
  testProducts: TestProduct;
}

@Component({
  selector: 'app-test-products-view-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <!-- Fixed Header with theme-aware styling -->
    <h2 mat-dialog-title class="ax-header ax-header-neutral">
      <div class="ax-icon-neutral">
        <mat-icon>visibility</mat-icon>
      </div>
      <div class="header-text">
        <div class="ax-title">Test Product Details</div>
        <div class="ax-subtitle">View complete product information</div>
      </div>
      <button type="button" mat-icon-button (click)="onClose()">
        <mat-icon>close</mat-icon>
      </button>
    </h2>

    <!-- Scrollable Content -->
    <mat-dialog-content class="ax-dialog-content">
      <div class="ax-dialog-flex-column ax-dialog-gap-lg">
        <!-- Basic Information -->
        <div class="ax-dialog-section">
          <h3 class="ax-dialog-section-title">Basic Information</h3>

          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Code</div>
            <div class="ax-dialog-field-value">
              {{ data.testProducts?.code || '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Name</div>
            <div class="ax-dialog-field-value">
              {{ data.testProducts?.name || '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Slug</div>
            <div class="ax-dialog-field-value">
              {{ data.testProducts?.slug || '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Description</div>
            <div class="ax-dialog-field-value">
              {{ data.testProducts?.description || '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Is Active</div>
            <div class="ax-dialog-field-value">
              @if (data.testProducts?.is_active) {
                <span class="ax-dialog-status-success">
                  <span class="ax-dialog-status-dot"></span>
                  Yes
                </span>
              } @else {
                <span class="ax-dialog-status-neutral">
                  <span class="ax-dialog-status-dot"></span>
                  No
                </span>
              }
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Is Featured</div>
            <div class="ax-dialog-field-value">
              @if (data.testProducts?.is_featured) {
                <span class="ax-dialog-status-success">
                  <span class="ax-dialog-status-dot"></span>
                  Yes
                </span>
              } @else {
                <span class="ax-dialog-status-neutral">
                  <span class="ax-dialog-status-dot"></span>
                  No
                </span>
              }
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Display Order</div>
            <div class="ax-dialog-field-value">
              {{ data.testProducts?.display_order ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Item Count</div>
            <div class="ax-dialog-field-value">
              {{ data.testProducts?.item_count ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Discount Rate</div>
            <div class="ax-dialog-field-value">
              {{ data.testProducts?.discount_rate ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Metadata</div>
            <div class="ax-dialog-field-value">
              {{ data.testProducts?.metadata || '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Settings</div>
            <div class="ax-dialog-field-value">
              {{ data.testProducts?.settings || '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Status</div>
            <div class="ax-dialog-field-value">
              {{ data.testProducts?.status || '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Created By</div>
            <div class="ax-dialog-field-value">
              {{ data.testProducts?.created_by || '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Updated By</div>
            <div class="ax-dialog-field-value">
              {{ data.testProducts?.updated_by | date: 'mediumDate' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Deleted At</div>
            <div class="ax-dialog-field-value">
              {{ data.testProducts?.deleted_at | date: 'mediumDate' }}
            </div>
          </div>
        </div>

        <!-- Record Information -->
        <div class="ax-dialog-section-metadata">
          <h3 class="ax-dialog-section-title">Record Information</h3>

          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Id</div>
            <div class="ax-dialog-field-value">
              <code>{{ data.testProducts?.id }}</code>
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Created At</div>
            <div class="ax-dialog-field-value">
              {{ data.testProducts?.created_at | date: 'medium' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Updated At</div>
            <div class="ax-dialog-field-value">
              {{ data.testProducts?.updated_at | date: 'medium' }}
            </div>
          </div>
        </div>
      </div>
    </mat-dialog-content>

    <!-- Fixed Footer with theme-aware styling -->
    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="onClose()">Close</button>
      <button mat-flat-button color="primary" type="button" (click)="onEdit()">
        <mat-icon>edit</mat-icon>
        Edit Test Product
      </button>
    </mat-dialog-actions>
  `,
  styles: [],
})
export class TestProductViewDialogComponent {
  private dialogRef = inject(MatDialogRef<TestProductViewDialogComponent>);
  protected data = inject<TestProductViewDialogData>(MAT_DIALOG_DATA);

  onClose() {
    this.dialogRef.close();
  }

  onEdit() {
    this.dialogRef.close({ action: 'edit', data: this.data.testProducts });
  }
}
