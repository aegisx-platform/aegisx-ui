import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TestProductStateManager } from '../services/test-products-state-manager.service';
import { TestProductService } from '../services/test-products.service';
import {
  TestProduct,
  UpdateTestProductRequest,
} from '../types/test-products.types';
import {
  TestProductFormComponent,
  TestProductFormData,
} from './test-products-form.component';

export interface TestProductEditDialogData {
  testProducts: TestProduct;
}

@Component({
  selector: 'app-test-products-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    TestProductFormComponent,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title class="ax-header ax-header-warning">
      <div class="ax-icon-warning">
        <mat-icon>edit</mat-icon>
      </div>
      <div class="header-text">
        <div class="ax-title">แก้ไขข้อมูล</div>
        <div class="ax-subtitle">แก้ไข Test Product</div>
      </div>
      <button
        type="button"
        mat-icon-button
        [mat-dialog-close]="false"
        [disabled]="loading()"
      >
        <mat-icon>close</mat-icon>
      </button>
    </h2>

    <mat-dialog-content>
      <app-test-products-form
        mode="edit"
        [initialData]="data.testProducts"
        [loading]="loading()"
        (formSubmit)="onFormSubmit($event)"
        (formCancel)="onCancel()"
      />
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button
        mat-button
        type="button"
        (click)="onCancel()"
        [disabled]="loading()"
      >
        ยกเลิก
      </button>
      <button
        mat-flat-button
        color="primary"
        type="button"
        (click)="onSubmit()"
        [disabled]="
          !formComponent?.testProductsForm?.valid ||
          !formComponent?.hasChanges() ||
          loading()
        "
      >
        บันทึก
      </button>
    </mat-dialog-actions>
  `,
  styles: [],
})
export class TestProductEditDialogComponent implements OnInit {
  private testProductsService = inject(TestProductService);
  private testProductStateManager = inject(TestProductStateManager);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<TestProductEditDialogComponent>);
  public data = inject<TestProductEditDialogData>(MAT_DIALOG_DATA);

  @ViewChild(TestProductFormComponent) formComponent?: TestProductFormComponent;

  loading = signal<boolean>(false);

  ngOnInit() {
    // No additional setup needed since shared form handles data population
  }

  onSubmit() {
    if (this.formComponent) {
      this.formComponent.onSubmit();
    }
  }

  async onFormSubmit(formData: TestProductFormData) {
    // Call API directly - WebSocket events will handle real-time sync
    this.loading.set(true);

    try {
      const updateRequest = formData as UpdateTestProductRequest;

      // Call API to update
      const result = await this.testProductsService.updateTestProduct(
        this.data.testProducts.id,
        updateRequest,
      );

      // Show success message and close
      this.snackBar.open('TestProduct updated successfully', 'Close', {
        duration: 3000,
      });
      this.dialogRef.close(true); // Close with success flag
    } catch (error: any) {
      const errorMessage = this.testProductsService.permissionError()
        ? 'You do not have permission to update testproduct'
        : error?.message || 'Failed to update testproduct';
      this.snackBar.open(errorMessage, 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
    } finally {
      this.loading.set(false);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
