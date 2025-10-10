import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PdfTemplateService } from '../services/pdf-templates.service';
import { PdfTemplate, UpdatePdfTemplateRequest } from '../types/pdf-templates.types';
import { PdfTemplateFormComponent, PdfTemplateFormData } from './pdf-templates-form.component';

export interface PdfTemplateEditDialogData {
  pdfTemplates: PdfTemplate;
}

@Component({
  selector: 'app-pdf-templates-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    PdfTemplateFormComponent,
  ],
  template: `
    <div class="edit-dialog">
      <h2 mat-dialog-title>Edit Pdf Templates</h2>
      
      <mat-dialog-content>
        <app-pdf-templates-form
          mode="edit"
          [initialData]="data.pdfTemplates"
          [loading]="loading()"
          (formSubmit)="onFormSubmit($event)"
          (formCancel)="onCancel()"
        ></app-pdf-templates-form>
      </mat-dialog-content>
    </div>
  `,
  styles: [`
    .edit-dialog {
      min-width: 500px;
      max-width: 800px;
    }

    mat-dialog-content {
      max-height: 70vh;
      overflow-y: auto;
    }

    @media (max-width: 768px) {
      .edit-dialog {
        min-width: 90vw;
      }
    }
  `]
})
export class PdfTemplateEditDialogComponent implements OnInit {
  private pdfTemplatesService = inject(PdfTemplateService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<PdfTemplateEditDialogComponent>);
  public data = inject<PdfTemplateEditDialogData>(MAT_DIALOG_DATA);

  loading = signal<boolean>(false);

  ngOnInit() {
    // No additional setup needed since shared form handles data population
  }

  async onFormSubmit(formData: PdfTemplateFormData) {
    this.loading.set(true);
    
    try {
      const updateRequest = formData as UpdatePdfTemplateRequest;
      const result = await this.pdfTemplatesService.updatePdfTemplate(
        this.data.pdfTemplates.id, 
        updateRequest
      );
      
      if (result) {
        this.snackBar.open('Pdf Templates updated successfully', 'Close', {
          duration: 3000,
        });
        this.dialogRef.close(result);
      } else {
        this.snackBar.open('Failed to update Pdf Templates', 'Close', {
          duration: 5000,
        });
      }
    } catch (error: any) {
      const errorMessage = this.pdfTemplatesService.permissionError()
        ? 'You do not have permission to update Pdf Templates'
        : error?.message || 'Failed to update Pdf Templates';
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