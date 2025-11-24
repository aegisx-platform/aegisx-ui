import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TestProductStateManager } from '../services/test-products-state-manager.service';
import { TestProductService } from '../services/test-products.service';
import { CreateTestProductRequest } from '../types/test-products.types';
import {
  TestProductFormComponent,
  TestProductFormData,
} from './test-products-form.component';

@Component({
  selector: 'app-test-products-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    TestProductFormComponent,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title class="ax-header ax-header-info">
      <div class="ax-icon-info">
        <mat-icon>add_circle</mat-icon>
      </div>
      <div class="header-text">
        <div class="ax-title">ข้อมูลเอกสาร</div>
        <div class="ax-subtitle">เพิ่ม Test Product ใหม่</div>
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
        mode="create"
        [loading]="loading()"
        (formSubmit)="onFormSubmit($event)"
        (formCancel)="onCancel()"
      />
    </mat-dialog-content>

    <div mat-dialog-actions align="end">
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
        [disabled]="!formComponent?.testProductsForm?.valid || loading()"
      >
        บันทึก
      </button>
    </div>
  `,
  styles: [],
})
export class TestProductCreateDialogComponent {
  private testProductsService = inject(TestProductService);
  private testProductStateManager = inject(TestProductStateManager);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<TestProductCreateDialogComponent>);

  @ViewChild(TestProductFormComponent) formComponent?: TestProductFormComponent;

  loading = signal<boolean>(false);

  onSubmit() {
    if (this.formComponent) {
      this.formComponent.onSubmit();
    }
  }

  async onFormSubmit(formData: TestProductFormData) {
    // Call API directly - WebSocket events will handle real-time sync
    this.loading.set(true);

    try {
      const createRequest = formData as CreateTestProductRequest;

      // Call API to create
      const result =
        await this.testProductsService.createTestProduct(createRequest);

      // Show success message and close
      this.snackBar.open('TestProduct created successfully', 'Close', {
        duration: 3000,
      });
      this.dialogRef.close(true); // Close with success flag
    } catch (error: any) {
      const errorMessage = this.testProductsService.permissionError()
        ? 'You do not have permission to create testproduct'
        : error?.message || 'Failed to create testproduct';
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
