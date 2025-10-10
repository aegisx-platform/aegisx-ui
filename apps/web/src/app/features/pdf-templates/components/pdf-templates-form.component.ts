import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
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

import { PdfTemplate, CreatePdfTemplateRequest, UpdatePdfTemplateRequest } from '../types/pdf-templates.types';

export type PdfTemplateFormMode = 'create' | 'edit';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-empty-interface
export interface PdfTemplateFormData {
  // Dynamic form data based on database schema
}

@Component({
  selector: 'app-pdf-templates-form',
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
    <form [formGroup]="pdfTemplatesForm" class="-form">

      <!-- Form Actions -->
      <div class="form-actions">
        <button 
          mat-button 
          type="button"
          (click)="onCancel()"
          [disabled]="loading"
        >
          Cancel
        </button>
        <button 
          mat-raised-button 
          color="primary" 
          type="button"
          (click)="onSubmit()"
          [disabled]="pdfTemplatesForm.invalid || loading || (mode === 'edit' && !hasChanges())"
        >
          <mat-spinner diameter="20" class="inline-spinner" *ngIf="loading"></mat-spinner>
          {{ mode === 'create' ? 'Create' : 'Update' }} Pdf Templates
        </button>
      </div>
    </form>
  `,
  styles: [`
    .-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px 0;
    }

    .full-width {
      width: 100%;
    }

    .checkbox-field {
      margin: 8px 0;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid rgba(0, 0, 0, 0.12);
    }

    .inline-spinner {
      margin-right: 8px;
    }

    @media (max-width: 768px) {
      .form-actions {
        flex-direction: column;
        gap: 8px;
      }
    }
  `]
})
export class PdfTemplateFormComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);

  @Input() mode: PdfTemplateFormMode = 'create';
  @Input() initialData?: PdfTemplate;
  @Input() loading = false;

  @Output() formSubmit = new EventEmitter<PdfTemplateFormData>();
  @Output() formCancel = new EventEmitter<void>();

  private originalFormValue: any;


  pdfTemplatesForm: FormGroup = this.fb.group({
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

  private populateForm(pdfTemplates: PdfTemplate) {
    const formValue = {
    };
    
    this.pdfTemplatesForm.patchValue(formValue);
    this.originalFormValue = this.pdfTemplatesForm.value;
  }

  hasChanges(): boolean {
    if (this.mode === 'create') return true;
    const currentValue = this.pdfTemplatesForm.value;
    return JSON.stringify(currentValue) !== JSON.stringify(this.originalFormValue);
  }

  onSubmit() {
    if (this.pdfTemplatesForm.valid) {
      const formData = { ...this.pdfTemplatesForm.value } as PdfTemplateFormData;
      


      
      this.formSubmit.emit(formData);
    }
  }

  onCancel() {
    this.formCancel.emit();
  }

}