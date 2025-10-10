import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PdfTemplateService } from '../services/pdf-templates.service';
import { CreatePdfTemplateRequest } from '../types/pdf-templates.types';
import { PdfTemplateFormComponent, PdfTemplateFormData } from './pdf-templates-form.component';

@Component({
  selector: 'app-pdf-templates-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    PdfTemplateFormComponent,
  ],
  template: `
    <div class="create-dialog">
      <h2 mat-dialog-title>Create Pdf Templates</h2>
      
      <mat-dialog-content>
        <app-pdf-templates-form
          mode="create"
          [loading]="loading()"
          (formSubmit)="onFormSubmit($event)"
          (formCancel)="onCancel()"
        ></app-pdf-templates-form>
      </mat-dialog-content>
    </div>
  `,
  styles: [`
    .create-dialog {
      min-width: 500px;
      max-width: 800px;
    }

    mat-dialog-content {
      max-height: 70vh;
      overflow-y: auto;
    }

    @media (max-width: 768px) {
      .create-dialog {
        min-width: 90vw;
      }
    }
  `]
})
export class PdfTemplateCreateDialogComponent {
  private pdfTemplatesService = inject(PdfTemplateService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<PdfTemplateCreateDialogComponent>);

  loading = signal<boolean>(false);

  async onFormSubmit(formData: PdfTemplateFormData) {
    this.loading.set(true);
    
    try {
      const createRequest = formData as CreatePdfTemplateRequest;
      const result = await this.pdfTemplatesService.createPdfTemplate(createRequest);
      
      if (result) {
        this.snackBar.open('Pdf Templates created successfully', 'Close', {
          duration: 3000,
        });
        this.dialogRef.close(result);
      } else {
        this.snackBar.open('Failed to create Pdf Templates', 'Close', {
          duration: 5000,
        });
      }
    } catch (error: any) {
      const errorMessage = this.pdfTemplatesService.permissionError()
        ? 'You do not have permission to create Pdf Templates'
        : error?.message || 'Failed to create Pdf Templates';
      this.snackBar.open(
        errorMessage,
        'Close',
        {
          duration: 5000,
          panelClass: ['error-snackbar']
        }
      );
    } finally {
      this.loading.set(false);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}