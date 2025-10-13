import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import {
  AbstractControl,
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
import { MonacoEditorComponent } from '../../../shared/components/monaco-editor/monaco-editor.component';
import { FileUploadService } from '../../../shared/ui/components/file-upload/file-upload.service';

import { PdfTemplate } from '../types/pdf-templates.types';

export type PdfTemplateFormMode = 'create' | 'edit';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-empty-interface
export interface PdfTemplateFormData {
  // Dynamic form data based on database schema
}

/**
 * Quick Insert Template Definition
 */
export interface InsertTemplate {
  icon: string;
  label: string;
  description: string;
  tooltip: string;
  template?: any;
  getTemplate?: () => any;
  requiresLogo?: boolean;
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
    MonacoEditorComponent,
  ],
  template: `
    <form [formGroup]="pdfTemplatesForm" class="pdf-templates-form">
      <!-- Basic Information -->
      <h3 class="section-title">Basic Information</h3>

      <mat-form-field class="full-width">
        <mat-label>Name (Unique Identifier)</mat-label>
        <input
          matInput
          formControlName="name"
          placeholder="e.g., invoice-template"
        />
        <mat-hint
          >Lowercase alphanumeric with hyphens/underscores only</mat-hint
        >
        @if (pdfTemplatesForm.get('name')?.hasError('required')) {
          <mat-error>Name is required</mat-error>
        }
        @if (pdfTemplatesForm.get('name')?.hasError('pattern')) {
          <mat-error
            >Only lowercase letters, numbers, hyphens, and underscores
            allowed</mat-error
          >
        }
      </mat-form-field>

      <mat-form-field class="full-width">
        <mat-label>Display Name</mat-label>
        <input
          matInput
          formControlName="display_name"
          placeholder="e.g., Invoice Template"
        />
        @if (pdfTemplatesForm.get('display_name')?.hasError('required')) {
          <mat-error>Display name is required</mat-error>
        }
      </mat-form-field>

      <mat-form-field class="full-width">
        <mat-label>Description</mat-label>
        <textarea
          matInput
          formControlName="description"
          placeholder="Describe the purpose of this template"
          rows="3"
        ></textarea>
      </mat-form-field>

      <!-- Category -->
      <mat-form-field class="full-width">
        <mat-label>Category</mat-label>
        <mat-select formControlName="category">
          <mat-option value="invoice">Invoice</mat-option>
          <mat-option value="receipt">Receipt</mat-option>
          <mat-option value="report">Report</mat-option>
          <mat-option value="letter">Letter</mat-option>
          <mat-option value="certificate">Certificate</mat-option>
          <mat-option value="other">Other</mat-option>
        </mat-select>
      </mat-form-field>

      <!-- Page Settings -->
      <h3 class="section-title">Page Settings</h3>

      <div class="form-row">
        <mat-form-field class="half-width">
          <mat-label>Page Size</mat-label>
          <mat-select formControlName="page_size">
            <mat-option value="A4">A4</mat-option>
            <mat-option value="A5">A5</mat-option>
            <mat-option value="Letter">Letter</mat-option>
            <mat-option value="Legal">Legal</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field class="half-width">
          <mat-label>Orientation</mat-label>
          <mat-select formControlName="orientation">
            <mat-option value="portrait">Portrait</mat-option>
            <mat-option value="landscape">Landscape</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <mat-form-field class="full-width">
        <mat-label>Version</mat-label>
        <input matInput formControlName="version" placeholder="e.g., 1.0.0" />
        <mat-hint>Semantic versioning recommended (e.g., 1.0.0)</mat-hint>
      </mat-form-field>

      <!-- Template Data (JSON) -->
      <h3 class="section-title">Template Content</h3>

      <!-- Quick Insert Toolbar -->
      <div class="quick-insert-toolbar">
        <div class="toolbar-header">
          <mat-icon class="toolbar-icon">auto_awesome</mat-icon>
          <span class="toolbar-title">Quick Insert</span>
          <span class="toolbar-subtitle">Add common template structures</span>
        </div>
        <div class="toolbar-buttons">
          @for (template of insertTemplates; track template.label) {
            <button
              mat-stroked-button
              type="button"
              (click)="insertTemplate(template)"
              [disabled]="
                template.requiresLogo &&
                !uploadedLogo() &&
                !pdfTemplatesForm.value.logo_file_id
              "
              [matTooltip]="template.tooltip"
              class="insert-btn"
            >
              <mat-icon>{{ template.icon }}</mat-icon>
              <span>{{ template.label }}</span>
            </button>
          }
        </div>
      </div>

      <app-monaco-editor
        #templateDataEditor
        label="Template Data (JSON/Handlebars)"
        hint="Enter your template in JSON format with Handlebars placeholders"
        height="700px"
        [required]="true"
        [allowHandlebars]="true"
        formControlName="template_data_raw"
      ></app-monaco-editor>

      <!-- Sample Data Section with Generate Button -->
      <div class="sample-data-section">
        <div class="sample-data-header">
          <h4 class="sample-data-title">Sample Data (JSON)</h4>
          <button
            mat-button
            color="primary"
            type="button"
            (click)="generateSampleDataFromTemplate()"
            [disabled]="!pdfTemplatesForm.get('template_data_raw')?.value"
            matTooltip="Extract variables from template and generate sample data structure"
            class="generate-sample-btn"
          >
            <mat-icon>auto_fix_high</mat-icon>
            Generate from Template
          </button>
        </div>

        <app-monaco-editor
          label=""
          hint="Sample data for testing the template"
          height="700px"
          formControlName="sample_data_raw"
        ></app-monaco-editor>
      </div>

      <!-- Schema Section with Generate Button -->
      <div class="schema-section">
        <div class="schema-header">
          <h4 class="schema-title">Schema (JSON)</h4>
          <button
            mat-button
            color="accent"
            type="button"
            (click)="generateSchemaFromSampleData()"
            [disabled]="!pdfTemplatesForm.get('sample_data_raw')?.value"
            matTooltip="Auto-generate JSON Schema from sample data above"
            class="generate-schema-btn"
          >
            <mat-icon>auto_awesome</mat-icon>
            Generate from Sample Data
          </button>
        </div>

        <app-monaco-editor
          label=""
          hint="JSON Schema for template validation"
          height="700px"
          formControlName="schema_raw"
        ></app-monaco-editor>
      </div>

      <!-- Styles & Fonts -->
      <h3 class="section-title">Styling</h3>

      <app-monaco-editor
        label="Custom Styles (JSON)"
        hint="Custom CSS styles in JSON format"
        height="300px"
        formControlName="styles_raw"
      ></app-monaco-editor>

      <app-monaco-editor
        label="Fonts Configuration (JSON)"
        hint="Font configurations for Thai and other languages"
        height="250px"
        formControlName="fonts_raw"
      ></app-monaco-editor>

      <!-- Logo Upload -->
      <h3 class="section-title">Logo Settings</h3>

      <div class="logo-upload-section">
        <div class="upload-area">
          <input
            type="file"
            #fileInput
            accept="image/*"
            (change)="onLogoFileSelected($event)"
            style="display: none"
          />
          <button
            mat-raised-button
            color="accent"
            type="button"
            (click)="fileInput.click()"
            [disabled]="uploadingLogo()"
          >
            <mat-icon>cloud_upload</mat-icon>
            {{ uploadedLogo() ? 'Change Logo' : 'Upload Logo' }}
          </button>
          @if (uploadingLogo()) {
            <mat-spinner diameter="24" class="upload-spinner"></mat-spinner>
          }
        </div>

        @if (logoPreviewUrl()) {
          <div class="logo-preview-container">
            <div class="logo-preview">
              <img [src]="logoPreviewUrl()" alt="Logo preview" />
              <button
                mat-icon-button
                color="warn"
                type="button"
                (click)="removeLogo()"
                class="remove-logo-btn"
                matTooltip="Remove logo"
              >
                <mat-icon>close</mat-icon>
              </button>
            </div>
            @if (uploadedLogo()) {
              <div class="logo-info">
                <p><strong>File:</strong> {{ uploadedLogo()?.originalName }}</p>
                <p>
                  <strong>Size:</strong>
                  {{ formatFileSize(uploadedLogo()?.fileSize || 0) }}
                </p>
                <p><strong>Type:</strong> {{ uploadedLogo()?.mimeType }}</p>
              </div>
            }
          </div>
        }

        @if (logoError()) {
          <mat-error class="logo-error">{{ logoError() }}</mat-error>
        }

        <mat-hint class="logo-hint">
          Upload a logo image (PNG, JPG, SVG). Use
          <code>{{ logoHelperExample }}</code> in your template to display it.
        </mat-hint>
      </div>

      <!-- Status & Settings -->
      <h3 class="section-title">Status & Settings</h3>

      <div class="checkbox-group">
        <mat-checkbox formControlName="is_active" class="checkbox-field">
          Active Template
        </mat-checkbox>
        <mat-checkbox
          formControlName="is_template_starter"
          class="checkbox-field"
        >
          Template Starter (Show in template selection when creating new
          templates)
        </mat-checkbox>
      </div>

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
          [disabled]="
            pdfTemplatesForm.invalid ||
            loading ||
            (mode === 'edit' && !hasChanges())
          "
        >
          @if (loading) {
            <mat-spinner diameter="20" class="inline-spinner"></mat-spinner>
          }
          {{ mode === 'create' ? 'Create' : 'Update' }} Template
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      .pdf-templates-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 16px 0;
      }

      .section-title {
        margin: 24px 0 12px 0;
        color: rgba(0, 0, 0, 0.87);
        font-size: 16px;
        font-weight: 500;
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
        padding-bottom: 8px;
      }

      .section-title:first-child {
        margin-top: 0;
      }

      .full-width {
        width: 100%;
      }

      .form-row {
        display: flex;
        gap: 16px;
        width: 100%;
      }

      .half-width {
        flex: 1;
        min-width: 0;
      }

      .checkbox-field {
        margin: 8px 0;
      }

      .checkbox-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin: 8px 0;
      }

      app-monaco-editor {
        margin-bottom: 16px;
      }

      .sample-data-section {
        margin-bottom: 16px;
      }

      .sample-data-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        padding: 12px 16px;
        background: rgba(33, 150, 243, 0.05);
        border-radius: 8px 8px 0 0;
        border-bottom: 2px solid rgba(33, 150, 243, 0.2);
      }

      .sample-data-title {
        margin: 0;
        font-size: 14px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.87);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .generate-sample-btn {
        min-width: 240px;
      }

      .generate-sample-btn mat-icon {
        margin-right: 4px;
      }

      .schema-section {
        margin-bottom: 16px;
      }

      .schema-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        padding: 12px 16px;
        background: rgba(103, 58, 183, 0.05);
        border-radius: 8px 8px 0 0;
        border-bottom: 2px solid rgba(103, 58, 183, 0.2);
      }

      .schema-title {
        margin: 0;
        font-size: 14px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.87);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .generate-schema-btn {
        min-width: 220px;
      }

      .generate-schema-btn mat-icon {
        margin-right: 4px;
      }

      .quick-insert-toolbar {
        margin-bottom: 16px;
        padding: 16px;
        background: linear-gradient(
          135deg,
          rgba(103, 58, 183, 0.05) 0%,
          rgba(63, 81, 181, 0.05) 100%
        );
        border: 1px solid rgba(103, 58, 183, 0.2);
        border-radius: 12px;
      }

      .toolbar-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        padding-bottom: 12px;
        border-bottom: 1px solid rgba(103, 58, 183, 0.15);
      }

      .toolbar-icon {
        color: rgba(103, 58, 183, 0.8);
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      .toolbar-title {
        font-size: 14px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.87);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .toolbar-subtitle {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.54);
        margin-left: auto;
      }

      .toolbar-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }

      .insert-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        border-color: rgba(103, 58, 183, 0.3);
        transition: all 0.2s ease;
      }

      .insert-btn:hover:not(:disabled) {
        background: rgba(103, 58, 183, 0.08);
        border-color: rgba(103, 58, 183, 0.5);
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(103, 58, 183, 0.15);
      }

      .insert-btn mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        color: rgba(103, 58, 183, 0.8);
      }

      .insert-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 16px;
        padding: 12px 0;
        border-top: 1px solid rgba(0, 0, 0, 0.12);
      }

      .inline-spinner {
        margin-right: 8px;
      }

      .logo-upload-section {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 16px;
        background: rgba(0, 0, 0, 0.02);
        border-radius: 8px;
        border: 1px dashed rgba(0, 0, 0, 0.12);
      }

      .upload-area {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .upload-spinner {
        display: inline-block;
      }

      .logo-preview-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .logo-preview {
        position: relative;
        width: fit-content;
        max-width: 400px;
        padding: 16px;
        background: white;
        border: 1px solid rgba(0, 0, 0, 0.12);
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .logo-preview img {
        max-width: 100%;
        max-height: 200px;
        display: block;
        object-fit: contain;
      }

      .remove-logo-btn {
        position: absolute;
        top: 8px;
        right: 8px;
        background: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      .logo-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.6);
      }

      .logo-info p {
        margin: 0;
      }

      .logo-error {
        color: #f44336;
        font-size: 12px;
      }

      .logo-hint {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.6);
      }

      .logo-hint code {
        background: rgba(0, 0, 0, 0.05);
        padding: 2px 6px;
        border-radius: 4px;
        font-family: 'Courier New', monospace;
        font-size: 11px;
      }

      @media (max-width: 768px) {
        .form-row {
          flex-direction: column;
        }

        .half-width {
          width: 100%;
        }

        .form-actions {
          flex-direction: column;
          gap: 8px;
        }

        .logo-preview {
          max-width: 100%;
        }
      }
    `,
  ],
})
export class PdfTemplateFormComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);
  private fileUploadService = inject(FileUploadService);

  @Input() mode: PdfTemplateFormMode = 'create';
  @Input() initialData?: Partial<PdfTemplate>;
  @Input() loading = false;

  @Output() formSubmit = new EventEmitter<PdfTemplateFormData>();
  @Output() formCancel = new EventEmitter<void>();
  @Output() logoChanged = new EventEmitter<void>();

  // ViewChild for Monaco Editor (template_data editor)
  @ViewChild('templateDataEditor') templateDataEditor?: MonacoEditorComponent;

  private originalFormValue: any;

  // Logo upload state
  uploadingLogo = signal(false);
  uploadedLogo = signal<any>(null);
  logoPreviewUrl = signal<string | null>(null);
  logoError = signal<string | null>(null);

  // Example text for handlebars helper
  readonly logoHelperExample = '{{logo logo_file_id}}';

  // Quick Insert Templates
  readonly insertTemplates: InsertTemplate[] = [
    // === STARTER TEMPLATE ===
    {
      icon: 'add_circle',
      label: 'Starter',
      description: 'Complete starter template',
      tooltip: 'Insert complete starter template with all basic structures',
      getTemplate: () => this.getStarterTemplate(),
    },

    // === STRUCTURE & LAYOUT ===
    {
      icon: 'image',
      label: 'Logo',
      description: 'Insert logo image',
      tooltip: 'Insert centered logo (requires uploaded logo)',
      requiresLogo: true,
      getTemplate: () => this.getLogoTemplate(),
    },
    {
      icon: 'title',
      label: 'Header',
      description: 'Insert document header',
      tooltip: 'Insert styled header text',
      template: {
        text: '{{documentTitle}}',
        style: 'header',
        alignment: 'center',
        margin: [0, 0, 0, 20],
      },
    },
    {
      icon: 'view_column',
      label: 'Columns',
      description: 'Insert column layout',
      tooltip: 'Insert 2-column layout',
      template: {
        columns: [
          {
            width: '*',
            text: '{{leftColumn}}',
            style: 'body',
          },
          {
            width: '*',
            text: '{{rightColumn}}',
            style: 'body',
          },
        ],
        columnGap: 10,
        margin: [0, 5, 0, 5],
      },
    },
    {
      icon: 'layers',
      label: 'Stack',
      description: 'Insert stacked elements',
      tooltip: 'Insert vertical stack of elements',
      template: {
        stack: [
          { text: '{{line1}}', style: 'body' },
          { text: '{{line2}}', style: 'body' },
          { text: '{{line3}}', style: 'body' },
        ],
        margin: [0, 5, 0, 5],
      },
    },

    // === TEXT & CONTENT ===
    {
      icon: 'text_fields',
      label: 'Text',
      description: 'Insert text block',
      tooltip: 'Insert text block with Handlebars placeholder',
      template: {
        text: '{{variableName}}',
        style: 'body',
        margin: [0, 5, 0, 5],
      },
    },
    {
      icon: 'format_bold',
      label: 'Styled Text',
      description: 'Insert styled text',
      tooltip: 'Insert text with inline styles',
      template: {
        text: [
          { text: 'Bold ', bold: true },
          { text: 'Italic ', italics: true },
          { text: 'Underline', decoration: 'underline' },
        ],
        margin: [0, 5, 0, 5],
      },
    },
    {
      icon: 'link',
      label: 'Link',
      description: 'Insert hyperlink',
      tooltip: 'Insert clickable link',
      template: {
        text: '{{linkText}}',
        link: '{{url}}',
        color: 'blue',
        decoration: 'underline',
      },
    },

    // === TABLES ===
    {
      icon: 'table_chart',
      label: 'Table',
      description: 'Insert table structure',
      tooltip: 'Insert table with header and data rows',
      template: {
        table: {
          headerRows: 1,
          widths: ['*', '*', '*'],
          body: [
            [
              { text: 'Header 1', style: 'tableHeader' },
              { text: 'Header 2', style: 'tableHeader' },
              { text: 'Header 3', style: 'tableHeader' },
            ],
            ['{{row.col1}}', '{{row.col2}}', '{{row.col3}}'],
          ],
        },
        layout: 'lightHorizontalLines',
        margin: [0, 10, 0, 10],
      },
    },
    {
      icon: 'table_rows',
      label: 'Table (No Border)',
      description: 'Insert borderless table',
      tooltip: 'Insert table without borders',
      template: {
        table: {
          widths: ['auto', '*'],
          body: [
            ['{{label1}}:', '{{value1}}'],
            ['{{label2}}:', '{{value2}}'],
            ['{{label3}}:', '{{value3}}'],
          ],
        },
        layout: 'noBorders',
        margin: [0, 5, 0, 5],
      },
    },
    {
      icon: 'view_headline',
      label: 'Table (Multiple Rows)',
      description: 'Insert table with multiple rows using {{#each}}',
      tooltip: 'Insert table that renders multiple rows from array data',
      getTemplate: () => ({
        table: {
          headerRows: 1,
          widths: ['auto', '*', 'auto', 'auto'],
          body: '__HANDLEBARS_BODY_PLACEHOLDER__',
        },
        layout: 'lightHorizontalLines',
        margin: [0, 10, 0, 10],
        __handlebarsBody: `[
  [
    { "text": "No.", "style": "tableHeader" },
    { "text": "Description", "style": "tableHeader" },
    { "text": "Qty", "style": "tableHeader" },
    { "text": "Amount", "style": "tableHeader" }
  ],
  {{#each items}}
  [
    "{{@index + 1}}",
    "{{this.description}}",
    "{{this.qty}}",
    "{{this.amount}}"
  ]{{#unless @last}},{{/unless}}
  {{/each}}
]`,
      }),
    },
    {
      icon: 'style',
      label: 'Table (Styled Rows)',
      description: 'Insert table with styled cells',
      tooltip: 'Insert table with alignment and styling in each cell',
      getTemplate: () => ({
        table: {
          headerRows: 1,
          widths: ['auto', '*', 80, 100],
          body: '__HANDLEBARS_BODY_PLACEHOLDER__',
        },
        layout: {
          hLineWidth:
            'function(i, node) { return (i === 0 || i === 1 || i === node.table.body.length) ? 1 : 0.5; }',
          vLineWidth: 'function(i) { return 0; }',
          hLineColor: 'function(i) { return "#cccccc"; }',
        },
        margin: [0, 10, 0, 10],
        __handlebarsBody: `[
  [
    { "text": "No.", "style": "tableHeader", "alignment": "center" },
    { "text": "Description", "style": "tableHeader" },
    { "text": "Quantity", "style": "tableHeader", "alignment": "center" },
    { "text": "Amount", "style": "tableHeader", "alignment": "right" }
  ],
  {{#each items}}
  [
    { "text": "{{@index + 1}}", "alignment": "center" },
    { "text": "{{this.description}}" },
    { "text": "{{this.qty}}", "alignment": "center" },
    { "text": "{{this.amount}}", "alignment": "right", "bold": true }
  ]{{#unless @last}},{{/unless}}
  {{/each}}
]`,
      }),
    },
    {
      icon: 'receipt_long',
      label: 'Invoice Table',
      description: 'Insert invoice table with totals',
      tooltip: 'Insert complete invoice table with items and summary',
      getTemplate: () => [
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto', 'auto'],
            body: '__HANDLEBARS_BODY_PLACEHOLDER__',
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 20],
          __handlebarsBody: `[
  [
    { "text": "No.", "style": "tableHeader" },
    { "text": "Item Description", "style": "tableHeader" },
    { "text": "Qty", "style": "tableHeader" },
    { "text": "Unit Price", "style": "tableHeader" },
    { "text": "Total", "style": "tableHeader" }
  ],
  {{#each items}}
  [
    "{{@index + 1}}",
    "{{this.description}}",
    { "text": "{{this.qty}}", "alignment": "center" },
    { "text": "{{this.unitPrice}}", "alignment": "right" },
    { "text": "{{this.total}}", "alignment": "right", "bold": true }
  ]{{#unless @last}},{{/unless}}
  {{/each}}
]`,
        },
        {
          columns: [
            { width: '*', text: '' },
            {
              width: 'auto',
              table: {
                widths: [120, 100],
                body: [
                  ['Subtotal:', { text: '{{subtotal}}', alignment: 'right' }],
                  ['Tax (7%):', { text: '{{tax}}', alignment: 'right' }],
                  ['Discount:', { text: '{{discount}}', alignment: 'right' }],
                  [
                    { text: 'Total:', bold: true, fontSize: 12 },
                    {
                      text: '{{total}}',
                      bold: true,
                      fontSize: 12,
                      alignment: 'right',
                      color: '#2196F3',
                    },
                  ],
                ],
              },
              layout: 'noBorders',
            },
          ],
        },
      ],
    },

    // === LISTS ===
    {
      icon: 'format_list_bulleted',
      label: 'List',
      description: 'Insert bulleted list',
      tooltip: 'Insert unordered list with items',
      template: {
        ul: ['{{item1}}', '{{item2}}', '{{item3}}'],
        margin: [0, 5, 0, 5],
      },
    },
    {
      icon: 'format_list_numbered',
      label: 'Numbered List',
      description: 'Insert numbered list',
      tooltip: 'Insert ordered list with items',
      template: {
        ol: ['{{item1}}', '{{item2}}', '{{item3}}'],
        margin: [0, 5, 0, 5],
      },
    },

    // === IMAGES ===
    {
      icon: 'photo',
      label: 'Image',
      description: 'Insert image placeholder',
      tooltip: 'Insert image with fit options',
      template: {
        image: '{{imageUrl}}',
        width: 200,
        height: 200,
        fit: [200, 200],
        margin: [0, 10, 0, 10],
      },
    },
    {
      icon: 'crop_portrait',
      label: 'QR Code',
      description: 'Insert QR code',
      tooltip: 'Insert QR code placeholder',
      template: {
        qr: '{{qrData}}',
        fit: 100,
        margin: [0, 10, 0, 10],
      },
    },

    // === CANVAS & GRAPHICS ===
    {
      icon: 'horizontal_rule',
      label: 'Line',
      description: 'Insert horizontal line',
      tooltip: 'Insert separator line',
      template: {
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 0,
            x2: 515,
            y2: 0,
            lineWidth: 1,
            lineColor: '#cccccc',
          },
        ],
        margin: [0, 10, 0, 10],
      },
    },
    {
      icon: 'rectangle',
      label: 'Rectangle',
      description: 'Insert rectangle shape',
      tooltip: 'Insert rectangle with fill',
      template: {
        canvas: [
          {
            type: 'rect',
            x: 0,
            y: 0,
            w: 100,
            h: 50,
            lineWidth: 1,
            lineColor: '#000000',
            color: '#f0f0f0',
          },
        ],
        margin: [0, 10, 0, 10],
      },
    },
    {
      icon: 'circle',
      label: 'Circle',
      description: 'Insert circle shape',
      tooltip: 'Insert circle',
      template: {
        canvas: [
          {
            type: 'ellipse',
            x: 50,
            y: 50,
            r1: 40,
            r2: 40,
            lineWidth: 1,
            lineColor: '#000000',
          },
        ],
        margin: [0, 10, 0, 10],
      },
    },
    {
      icon: 'polyline',
      label: 'Polyline',
      description: 'Insert polyline',
      tooltip: 'Insert connected line segments',
      template: {
        canvas: [
          {
            type: 'polyline',
            points: [
              { x: 0, y: 0 },
              { x: 50, y: 30 },
              { x: 100, y: 0 },
            ],
            lineWidth: 2,
            lineColor: '#000000',
          },
        ],
        margin: [0, 10, 0, 10],
      },
    },

    // === SVG ===
    {
      icon: 'code',
      label: 'SVG',
      description: 'Insert SVG graphic',
      tooltip: 'Insert SVG element',
      template: {
        svg: '<svg width="100" height="100"><circle cx="50" cy="50" r="40" fill="blue"/></svg>',
        width: 100,
        height: 100,
        margin: [0, 10, 0, 10],
      },
    },

    // === TOC & REFERENCE ===
    {
      icon: 'toc',
      label: 'TOC',
      description: 'Insert table of contents',
      tooltip: 'Insert table of contents placeholder',
      template: {
        toc: {
          title: { text: 'Table of Contents', style: 'header' },
          textStyle: { fontSize: 12 },
        },
        margin: [0, 10, 0, 20],
      },
    },
    {
      icon: 'bookmark',
      label: 'Anchor',
      description: 'Insert anchor point',
      tooltip: 'Insert anchor for internal links',
      template: {
        text: '{{anchorText}}',
        id: '{{anchorId}}',
        margin: [0, 5, 0, 5],
      },
    },

    // === LAYOUT CONTROLS ===
    {
      icon: 'space_bar',
      label: 'Spacer',
      description: 'Insert vertical space',
      tooltip: 'Insert empty space between elements',
      template: {
        text: '',
        margin: [0, 20, 0, 0],
      },
    },
    {
      icon: 'description',
      label: 'Page Break',
      description: 'Insert page break',
      tooltip: 'Force new page',
      template: {
        text: '',
        pageBreak: 'after',
      },
    },
    {
      icon: 'vertical_align_top',
      label: 'Absolute Position',
      description: 'Insert absolutely positioned element',
      tooltip: 'Insert element at specific position',
      template: {
        text: '{{content}}',
        absolutePosition: { x: 40, y: 40 },
      },
    },
    {
      icon: 'flip_to_front',
      label: 'Relative Position',
      description: 'Insert relatively positioned element',
      tooltip: 'Insert element with relative positioning',
      template: {
        text: '{{content}}',
        relativePosition: { x: 10, y: 10 },
      },
    },
  ];

  // JSON validator
  private jsonValidator(
    control: AbstractControl,
  ): { [key: string]: any } | null {
    if (!control.value) {
      return null; // Allow empty for optional fields
    }

    try {
      JSON.parse(control.value);
      return null;
    } catch (e) {
      return { invalidJson: true };
    }
  }

  /**
   * Detect if content contains Handlebars syntax
   */
  private detectHandlebars(content: string): boolean {
    if (!content) return false;

    const handlebarsPatterns = [
      /\{\{[^}]+\}\}/, // Variables: {{variable}}
      /\{\{#each\s+[^}]+\}\}/, // Each loop: {{#each items}}
      /\{\{\/each\}\}/, // End each: {{/each}}
      /\{\{#if\s+[^}]+\}\}/, // If statement: {{#if condition}}
      /\{\{\/if\}\}/, // End if: {{/if}}
      /\{\{#unless\s+[^}]+\}\}/, // Unless: {{#unless condition}}
      /\{\{\/unless\}\}/, // End unless: {{/unless}}
      /\{\{else\}\}/, // Else: {{else}}
      /\{\{@[^}]+\}\}/, // Special variables: {{@index}}, {{@first}}, etc.
    ];

    return handlebarsPatterns.some((pattern) => pattern.test(content));
  }

  pdfTemplatesForm: FormGroup = this.fb.group({
    // Required fields
    name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_-]+$/)]],
    display_name: ['', [Validators.required]],
    template_data_raw: [
      '',
      [Validators.required], // ✅ เอา jsonValidator ออก เพราะ Monaco Editor validate แล้ว
    ],

    // Optional fields
    description: [''],
    category: ['general'],
    type: ['handlebars'],
    page_size: ['A4'],
    orientation: ['portrait'],
    version: ['1.0.0', [Validators.pattern(/^\d+\.\d+\.\d+$/)]],

    // JSON fields (as raw strings for textarea)
    sample_data_raw: ['', [this.jsonValidator.bind(this)]],
    schema_raw: ['', [this.jsonValidator.bind(this)]],
    styles_raw: ['', [this.jsonValidator.bind(this)]],
    fonts_raw: ['', [this.jsonValidator.bind(this)]],

    // Logo field
    logo_file_id: [''],

    // Boolean fields
    is_active: [true],
    is_template_starter: [false],
  });

  ngOnInit() {
    if (this.initialData) {
      this.populateForm(this.initialData);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialData'] && this.initialData) {
      this.populateForm(this.initialData);
    }
  }

  private populateForm(pdfTemplates: Partial<PdfTemplate>) {
    console.log('[PDF Template Form] Populating form with data:', pdfTemplates);

    const formValue = {
      name: pdfTemplates.name || '',
      display_name: pdfTemplates.display_name || '',
      description: pdfTemplates.description || '',
      category: pdfTemplates.category || 'general',
      type: pdfTemplates.type || 'handlebars',
      page_size: pdfTemplates.page_size || 'A4',
      orientation: pdfTemplates.orientation || 'portrait',
      version: pdfTemplates.version || '1.0.0',

      // Convert JSON objects to strings for textareas
      // Special handling: if template_data is already a string (Handlebars template), use it directly
      template_data_raw: pdfTemplates.template_data
        ? typeof pdfTemplates.template_data === 'string'
          ? pdfTemplates.template_data // Already a string, don't stringify again
          : JSON.stringify(pdfTemplates.template_data, null, 2) // Object, stringify it
        : '',
      sample_data_raw: pdfTemplates.sample_data
        ? JSON.stringify(pdfTemplates.sample_data, null, 2)
        : '',
      schema_raw: pdfTemplates.schema
        ? JSON.stringify(pdfTemplates.schema, null, 2)
        : '',
      styles_raw: pdfTemplates.styles
        ? JSON.stringify(pdfTemplates.styles, null, 2)
        : '',
      fonts_raw: pdfTemplates.fonts
        ? JSON.stringify(pdfTemplates.fonts, null, 2)
        : '',

      // Logo field
      logo_file_id: pdfTemplates.logo_file_id || '',

      is_active: pdfTemplates.is_active ?? true,
      is_template_starter: pdfTemplates.is_template_starter ?? false,
    };

    console.log('[PDF Template Form] Form value to patch:', formValue);
    this.pdfTemplatesForm.patchValue(formValue);

    // Load existing logo if present
    if (pdfTemplates.logo_file_id) {
      this.fileUploadService.getFile(pdfTemplates.logo_file_id).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.uploadedLogo.set(response.data);

            // Use signed URL from API response (like file-management component)
            // This bypasses proxy issues with long JWT tokens
            if (response.data.signedUrls?.view) {
              this.logoPreviewUrl.set(response.data.signedUrls.view);
            } else if (response.data.signedUrls?.thumbnail) {
              this.logoPreviewUrl.set(response.data.signedUrls.thumbnail);
            }
          }
        },
        error: (error) => {
          console.error('Failed to load logo file:', error);
        },
      });
    }

    console.log('[PDF Template Form] Form valid:', this.pdfTemplatesForm.valid);
    console.log(
      '[PDF Template Form] Form errors:',
      this.pdfTemplatesForm.errors,
    );
    this.originalFormValue = this.pdfTemplatesForm.value;
  }

  hasChanges(): boolean {
    if (this.mode === 'create') return true;
    const currentValue = this.pdfTemplatesForm.value;
    return (
      JSON.stringify(currentValue) !== JSON.stringify(this.originalFormValue)
    );
  }

  onSubmit() {
    console.log('[PDF Template Form] Submit called');
    console.log('[PDF Template Form] Form valid:', this.pdfTemplatesForm.valid);
    console.log('[PDF Template Form] Form value:', this.pdfTemplatesForm.value);

    if (!this.pdfTemplatesForm.valid) {
      console.error('[PDF Template Form] Form is invalid. Field errors:');
      Object.keys(this.pdfTemplatesForm.controls).forEach((key) => {
        const control = this.pdfTemplatesForm.get(key);
        if (control?.errors) {
          console.error(`  ${key}:`, control.errors);
        }
      });
      return;
    }

    if (this.pdfTemplatesForm.valid) {
      const rawFormData = this.pdfTemplatesForm.value;

      // Parse JSON strings back to objects
      const formData: any = {
        name: rawFormData.name,
        display_name: rawFormData.display_name,
        description: rawFormData.description || undefined,
        category: rawFormData.category || undefined,
        type: rawFormData.type || undefined,
        page_size: rawFormData.page_size || undefined,
        orientation: rawFormData.orientation || undefined,
        version: rawFormData.version || undefined,
        // Allow null to be sent (for deleting logo)
        logo_file_id:
          rawFormData.logo_file_id === null
            ? null
            : rawFormData.logo_file_id || undefined,
        is_active: rawFormData.is_active,
        is_template_starter: rawFormData.is_template_starter,
      };

      // Parse template_data (required)
      // If it contains Handlebars directives outside strings, send as string
      // Otherwise parse as JSON object
      try {
        if (this.detectHandlebars(rawFormData.template_data_raw)) {
          // Has Handlebars - send as string (backend will handle compilation)
          formData.template_data = rawFormData.template_data_raw;
        } else {
          // Pure JSON - parse and send as object
          formData.template_data = JSON.parse(rawFormData.template_data_raw);
        }
      } catch (_e) {
        console.error('Failed to parse template_data:', _e);
        return;
      }

      // Parse optional JSON fields
      if (rawFormData.sample_data_raw) {
        try {
          formData.sample_data = JSON.parse(rawFormData.sample_data_raw);
        } catch (e) {
          console.warn('Failed to parse sample_data:', e);
        }
      }

      if (rawFormData.schema_raw) {
        try {
          formData.schema = JSON.parse(rawFormData.schema_raw);
        } catch (e) {
          console.warn('Failed to parse schema:', e);
        }
      }

      if (rawFormData.styles_raw) {
        try {
          formData.styles = JSON.parse(rawFormData.styles_raw);
        } catch (e) {
          console.warn('Failed to parse styles:', e);
        }
      }

      if (rawFormData.fonts_raw) {
        try {
          formData.fonts = JSON.parse(rawFormData.fonts_raw);
        } catch (e) {
          console.warn('Failed to parse fonts:', e);
        }
      }

      console.log('[PDF Template Form] Final form data to emit:', formData);
      this.formSubmit.emit(formData as PdfTemplateFormData);
    }
  }

  onCancel() {
    this.formCancel.emit();
  }

  /**
   * Generate Sample Data from Template by extracting Handlebars variables
   */
  generateSampleDataFromTemplate() {
    const templateDataRaw =
      this.pdfTemplatesForm.get('template_data_raw')?.value;

    if (!templateDataRaw) {
      console.warn('[Sample Data Generator] No template data provided');
      return;
    }

    try {
      // Extract all Handlebars variables from template
      // Matches: {{variable}}, {{helper arg1}}, {{object.property}}, etc.
      const handlebarsRegex = /\{\{([^}]+)\}\}/g;
      const matches = templateDataRaw.matchAll(handlebarsRegex);

      const variables = new Set<string>();
      const nestedObjects = new Map<string, Set<string>>();
      const helperCalls = new Map<string, string[]>(); // Track helper calls like {{logo logo_file_id}}

      // List of known helpers that take arguments
      const knownHelpers = [
        'add',
        'subtract',
        'multiply',
        'divide',
        'formatDate',
        'formatCurrency',
        'formatNumber',
        'formatPercent',
        'uppercase',
        'lowercase',
        'truncate',
        'eq',
        'gt',
        'lt',
        'gte',
        'lte',
        'ne',
        'or',
        'and',
        'not',
        'logo',
        'default',
        'json',
      ];

      for (const match of matches) {
        const content = match[1].trim();

        // Skip control structures
        if (
          content.startsWith('/') ||
          content.startsWith('else') ||
          content.startsWith('!') ||
          content.startsWith('^')
        ) {
          continue;
        }

        // Handle #each, #if, #unless
        if (content.startsWith('#')) {
          const helperMatch = content.match(/^#(\w+)\s+(.+)/);
          if (helperMatch) {
            const helperName = helperMatch[1]; // each, if, unless
            const variable = helperMatch[2].trim();

            if (helperName === 'each') {
              // Mark as array
              if (!nestedObjects.has(variable)) {
                nestedObjects.set(variable, new Set());
              }
            } else {
              // Conditional - add as boolean variable
              variables.add(variable);
            }
          }
          continue;
        }

        // Check if it's a helper call (e.g., "logo logo_file_id", "add @index 1")
        const parts = content.split(/\s+/);
        if (parts.length >= 2 && knownHelpers.includes(parts[0])) {
          const helperName = parts[0];
          const args = parts.slice(1).filter(
            (arg: string) =>
              !arg.startsWith('@') && // Skip @index, @first, etc.
              !arg.match(/^[\d.]+$/), // Skip numeric literals
          );

          if (!helperCalls.has(helperName)) {
            helperCalls.set(helperName, []);
          }

          for (const arg of args) {
            helperCalls.get(helperName)?.push(arg);
            // Add the argument as a variable
            if (arg.includes('.')) {
              const [obj, prop] = arg.split('.');
              if (!nestedObjects.has(obj)) {
                nestedObjects.set(obj, new Set());
              }
              nestedObjects.get(obj)?.add(prop);
            } else {
              variables.add(arg);
            }
          }
          continue;
        }

        // Handle nested properties (e.g., this.description, row.col1)
        if (content.includes('.')) {
          const parts = content.split('.');
          let rootObject = parts[0];

          // Handle "this.property" in #each loops
          if (rootObject === 'this') {
            // Find the parent array from #each
            const eachMatch = templateDataRaw.match(/\{\{#each\s+(\w+)\}\}/);
            if (eachMatch) {
              rootObject = eachMatch[1];
            } else {
              continue;
            }
          }

          const property = parts.slice(1).join('.');

          if (!nestedObjects.has(rootObject)) {
            nestedObjects.set(rootObject, new Set());
          }
          nestedObjects.get(rootObject)?.add(property);
        } else {
          // Simple variable
          variables.add(content);
        }
      }

      // Build sample data structure
      const sampleData: Record<string, unknown> = {};

      // Add simple variables
      for (const variable of variables) {
        // Skip if this variable is also a nested object
        if (nestedObjects.has(variable)) {
          continue;
        }

        // Skip built-in helpers and special variables
        if (variable.startsWith('@') || knownHelpers.includes(variable)) {
          continue;
        }

        // Skip logo_file_id (injected automatically by template)
        if (variable === 'logo_file_id') {
          continue;
        }

        // Generate sample value based on variable name
        sampleData[variable] = this.generateSampleValue(variable);
      }

      // Add nested objects (arrays with properties)
      for (const [objectName, properties] of nestedObjects.entries()) {
        const objectData: Record<string, unknown> = {};

        for (const property of properties) {
          objectData[property] = this.generateSampleValue(property);
        }

        // Always create array for objects found in nestedObjects
        // (they came from #each or this.property)
        if (Object.keys(objectData).length > 0) {
          sampleData[objectName] = [
            { ...objectData },
            { ...objectData },
            { ...objectData }, // 3 sample items
          ];
        }
      }

      // Update the sample_data field with pretty-printed JSON
      this.pdfTemplatesForm.patchValue({
        sample_data_raw: JSON.stringify(sampleData, null, 2),
      });

      console.log('[Sample Data Generator] Generated sample data:', sampleData);
      console.log('[Sample Data Generator] Variables:', Array.from(variables));
      console.log(
        '[Sample Data Generator] Nested objects:',
        Array.from(nestedObjects.entries()),
      );
      console.log(
        '[Sample Data Generator] Helper calls:',
        Array.from(helperCalls.entries()),
      );
    } catch (error) {
      console.error(
        '[Sample Data Generator] Failed to generate sample data:',
        error,
      );
    }
  }

  /**
   * Generate sample value based on variable name heuristics
   *
   * Note: logo_file_id is NOT generated here - it's injected automatically by the template system
   */
  private generateSampleValue(variableName: string): string {
    const lower = variableName.toLowerCase();

    // Note: We don't generate logo_file_id here - it's handled by the template itself
    // The template's logo_file_id is automatically injected during preview/render

    // File ID patterns (for other file uploads, not logo)
    if (
      lower.includes('file') &&
      lower.includes('id') &&
      !lower.includes('logo')
    ) {
      return 'sample-file-uuid-5678';
    }

    if (lower.includes('logo')) {
      // Fallback base64 image for other logo fields
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    }

    // Date patterns
    if (lower.includes('date') || lower === 'd' || lower === 'dt') {
      return '2024-01-15';
    }

    // Number patterns
    if (
      lower.includes('number') ||
      lower.includes('no') ||
      lower.includes('id') ||
      lower.includes('qty') ||
      lower.includes('quantity') ||
      lower.includes('amount') ||
      lower.includes('price') ||
      lower.includes('total') ||
      lower.includes('subtotal') ||
      lower.includes('tax')
    ) {
      if (
        lower.includes('amount') ||
        lower.includes('price') ||
        lower.includes('total') ||
        lower.includes('tax')
      ) {
        return '1,000.00';
      }
      if (lower.includes('id')) {
        return 'uuid-' + Math.random().toString(36).substring(7);
      }
      return '001';
    }

    // Email pattern
    if (lower.includes('email')) {
      return 'example@email.com';
    }

    // Phone pattern
    if (
      lower.includes('phone') ||
      lower.includes('tel') ||
      lower.includes('mobile')
    ) {
      return '02-123-4567';
    }

    // Name patterns
    if (lower.includes('name')) {
      if (lower.includes('company') || lower.includes('business')) {
        return 'บริษัท ตัวอย่าง จำกัด';
      }
      return 'ชื่อตัวอย่าง';
    }

    // Address pattern
    if (lower.includes('address')) {
      return '123 ถนนตัวอย่าง กรุงเทพฯ 10110';
    }

    // Title pattern
    if (lower.includes('title') || lower.includes('header')) {
      return 'หัวข้อเอกสาร';
    }

    // Description/Content pattern
    if (
      lower.includes('description') ||
      lower.includes('content') ||
      lower.includes('detail') ||
      lower.includes('note') ||
      lower.includes('remark')
    ) {
      return 'ข้อความตัวอย่าง';
    }

    // Reference pattern
    if (lower.includes('ref') || lower.includes('reference')) {
      return 'REF-001';
    }

    // Column/Row/Item patterns (for tables)
    if (lower.includes('col') || lower.includes('item')) {
      return 'รายการ';
    }

    // Default
    return `ค่าตัวอย่าง ${variableName}`;
  }

  /**
   * Generate JSON Schema from sample data
   */
  generateSchemaFromSampleData() {
    const sampleDataRaw = this.pdfTemplatesForm.get('sample_data_raw')?.value;

    if (!sampleDataRaw) {
      console.warn('[Schema Generator] No sample data provided');
      return;
    }

    try {
      const sampleData = JSON.parse(sampleDataRaw);
      const schema = this.inferSchemaFromData(sampleData);

      // Update the schema field with pretty-printed JSON
      this.pdfTemplatesForm.patchValue({
        schema_raw: JSON.stringify(schema, null, 2),
      });

      console.log('[Schema Generator] Schema generated successfully:', schema);
    } catch (error) {
      console.error('[Schema Generator] Failed to parse sample data:', error);
    }
  }

  /**
   * Infer JSON Schema from data object
   */
  private inferSchemaFromData(data: any): any {
    if (data === null) {
      return { type: 'null' };
    }

    if (Array.isArray(data)) {
      if (data.length === 0) {
        return {
          type: 'array',
          items: {},
        };
      }
      // Infer schema from first item (assumes homogeneous array)
      return {
        type: 'array',
        items: this.inferSchemaFromData(data[0]),
      };
    }

    const type = typeof data;

    switch (type) {
      case 'string':
        // Check if it's a date string
        if (this.isDateString(data)) {
          return {
            type: 'string',
            format: 'date',
          };
        }
        return { type: 'string' };

      case 'number':
        return {
          type: Number.isInteger(data) ? 'integer' : 'number',
        };

      case 'boolean':
        return { type: 'boolean' };

      case 'object': {
        const properties: Record<string, any> = {};
        const required: string[] = [];

        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            properties[key] = this.inferSchemaFromData(data[key]);
            // Mark non-null values as required
            if (data[key] !== null && data[key] !== undefined) {
              required.push(key);
            }
          }
        }

        return {
          type: 'object',
          properties,
          required: required.length > 0 ? required : undefined,
        };
      }

      default:
        return {};
    }
  }

  /**
   * Check if a string is a date format
   */
  private isDateString(value: string): boolean {
    // Match common date patterns
    const datePatterns = [
      /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
      /^\d{2}\/\d{2}\/\d{4}$/, // DD/MM/YYYY or MM/DD/YYYY
      /^\d{1,2}\s+[ก-๙]+\s+\d{4}$/, // Thai date format (15 มกราคม 2567)
    ];

    return datePatterns.some((pattern) => pattern.test(value));
  }

  /**
   * Handle logo file selection
   */
  async onLogoFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    // Validate file
    const validation = this.fileUploadService.validateFiles([file], {
      allowedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'],
      maxFileSize: 5 * 1024 * 1024, // 5MB
      maxFiles: 1,
    });

    if (!validation[0].valid) {
      this.logoError.set(validation[0].errors.join(', '));
      return;
    }

    this.logoError.set(null);

    // Generate preview
    const preview = await this.fileUploadService.generateFilePreview(file);
    if (preview) {
      this.logoPreviewUrl.set(preview);
    }

    // Upload file
    this.uploadingLogo.set(true);
    this.fileUploadService
      .uploadFile(file, {
        category: 'logo',
        isPublic: true,
      })
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.uploadedLogo.set(response.data);
            this.pdfTemplatesForm.patchValue({
              logo_file_id: response.data.id,
            });

            // Use signed URL from API response (like file-management component)
            // This bypasses proxy issues with long JWT tokens
            if (response.data.signedUrls?.view) {
              this.logoPreviewUrl.set(response.data.signedUrls.view);
            } else if (response.data.signedUrls?.thumbnail) {
              this.logoPreviewUrl.set(response.data.signedUrls.thumbnail);
            }

            this.uploadingLogo.set(false);
            console.log('Logo uploaded successfully:', response.data);

            // Emit event to trigger preview refresh in dialog
            this.logoChanged.emit();
          }
        },
        error: (error) => {
          this.uploadingLogo.set(false);
          this.logoError.set(error.message || 'Failed to upload logo');
          console.error('Logo upload error:', error);
        },
      });
  }

  /**
   * Remove logo
   */
  removeLogo() {
    this.uploadedLogo.set(null);
    this.logoPreviewUrl.set(null);
    this.logoError.set(null);
    this.pdfTemplatesForm.patchValue({
      logo_file_id: null,
    });
    // Emit event to trigger preview refresh in dialog
    this.logoChanged.emit();
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    return this.fileUploadService.formatFileSize(bytes);
  }

  /**
   * Get complete starter template with all basic structures
   */
  private getStarterTemplate(): any {
    const hasLogo =
      this.uploadedLogo() || this.pdfTemplatesForm.value.logo_file_id;

    return {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [40, 60, 40, 60],

      // Header (appears on every page)
      header: (_currentPage: number, _pageCount: number) => ({
        text: '{{headerText}}',
        alignment: 'center',
        margin: [0, 20, 0, 0],
        fontSize: 10,
        color: '#666666',
      }),

      // Footer (appears on every page)
      footer: (currentPage: number, pageCount: number) => ({
        columns: [
          {
            text: '{{footerLeft}}',
            alignment: 'left',
            fontSize: 10,
            color: '#666666',
          },
          {
            text: `Page ${currentPage} of ${pageCount}`,
            alignment: 'right',
            fontSize: 10,
            color: '#666666',
          },
        ],
        margin: [40, 0, 40, 20],
      }),

      // Main content
      content: [
        // Logo (if uploaded)
        ...(hasLogo
          ? [
              {
                columns: [
                  { width: '*', text: '' },
                  {
                    image: '{{logo logo_file_id}}',
                    width: 80,
                    height: 80,
                    fit: [80, 80],
                  },
                  { width: '*', text: '' },
                ],
                margin: [0, 0, 0, 20],
              },
            ]
          : []),

        // Document Title
        {
          text: '{{documentTitle}}',
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },

        // Metadata section
        {
          columns: [
            {
              width: '*',
              table: {
                widths: ['auto', '*'],
                body: [
                  ['Document No.:', '{{documentNumber}}'],
                  ['Date:', '{{date}}'],
                  ['Reference:', '{{reference}}'],
                ],
              },
              layout: 'noBorders',
            },
          ],
          margin: [0, 0, 0, 20],
        },

        // Separator line
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 515,
              y2: 0,
              lineWidth: 1,
              lineColor: '#cccccc',
            },
          ],
          margin: [0, 0, 0, 20],
        },

        // Main content area
        {
          text: '{{mainContent}}',
          style: 'body',
          margin: [0, 0, 0, 20],
        },

        // Sample table
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto'],
            body: [
              [
                { text: 'No.', style: 'tableHeader' },
                { text: 'Description', style: 'tableHeader' },
                { text: 'Quantity', style: 'tableHeader' },
                { text: 'Amount', style: 'tableHeader' },
              ],
              [
                '{{row.no}}',
                '{{row.description}}',
                '{{row.qty}}',
                '{{row.amount}}',
              ],
            ],
          },
          layout: {
            hLineWidth: (i: number) => (i === 0 || i === 1 ? 1 : 0.5),
            vLineWidth: () => 0,
            hLineColor: () => '#cccccc',
            paddingLeft: () => 8,
            paddingRight: () => 8,
            paddingTop: () => 4,
            paddingBottom: () => 4,
          },
          margin: [0, 0, 0, 20],
        },

        // Summary section
        {
          columns: [
            { width: '*', text: '' },
            {
              width: 'auto',
              table: {
                widths: ['auto', 80],
                body: [
                  ['Subtotal:', { text: '{{subtotal}}', alignment: 'right' }],
                  ['Tax (7%):', { text: '{{tax}}', alignment: 'right' }],
                  [
                    { text: 'Total:', bold: true },
                    { text: '{{total}}', bold: true, alignment: 'right' },
                  ],
                ],
              },
              layout: 'noBorders',
            },
          ],
          margin: [0, 0, 0, 40],
        },

        // Signature section
        {
          columns: [
            {
              width: '*',
              stack: [
                { text: 'Prepared By:', fontSize: 10, margin: [0, 0, 0, 40] },
                { text: '_______________________', alignment: 'center' },
                { text: '({{preparedBy}})', alignment: 'center', fontSize: 10 },
                {
                  text: '{{preparedByTitle}}',
                  alignment: 'center',
                  fontSize: 9,
                  color: '#666666',
                },
              ],
            },
            {
              width: '*',
              stack: [
                { text: 'Approved By:', fontSize: 10, margin: [0, 0, 0, 40] },
                { text: '_______________________', alignment: 'center' },
                { text: '({{approvedBy}})', alignment: 'center', fontSize: 10 },
                {
                  text: '{{approvedByTitle}}',
                  alignment: 'center',
                  fontSize: 9,
                  color: '#666666',
                },
              ],
            },
          ],
          margin: [0, 20, 0, 0],
        },
      ],

      // Styles
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          color: '#333333',
        },
        subheader: {
          fontSize: 16,
          bold: true,
          color: '#666666',
        },
        body: {
          fontSize: 12,
          lineHeight: 1.5,
          color: '#333333',
        },
        tableHeader: {
          bold: true,
          fontSize: 11,
          color: '#333333',
          fillColor: '#f5f5f5',
        },
        footer: {
          fontSize: 10,
          color: '#999999',
        },
      },

      // Default style
      defaultStyle: {
        font: 'THSarabunNew',
        fontSize: 14,
      },
    };
  }

  /**
   * Get logo template with current logo_file_id
   */
  private getLogoTemplate(): any {
    return {
      columns: [
        { width: '*', text: '' },
        {
          image: '{{logo logo_file_id}}',
          width: 80,
          height: 80,
        },
        { width: '*', text: '' },
      ],
      margin: [0, 0, 0, 20],
    };
  }

  /**
   * Insert template structure at cursor position using Monaco Editor API
   */
  insertTemplate(insertTemplate: InsertTemplate) {
    console.log('[Insert Template] Button clicked:', insertTemplate.label);

    // Check if editor is available
    if (!this.templateDataEditor) {
      console.error('[Insert Template] Template data editor not available');
      this.logoError.set('Editor not ready. Please try again.');
      return;
    }

    // Check if logo is required but not uploaded
    if (
      insertTemplate.requiresLogo &&
      !this.uploadedLogo() &&
      !this.pdfTemplatesForm.value.logo_file_id
    ) {
      console.warn('[Insert Template] Logo required but not uploaded');
      this.logoError.set(
        'Please upload a logo first before inserting logo template',
      );
      return;
    }

    // Get template structure
    const templateStructure = insertTemplate.getTemplate
      ? insertTemplate.getTemplate()
      : insertTemplate.template;

    if (!templateStructure) {
      console.error('[Insert Template] No template structure found');
      return;
    }

    // Convert template structure to pretty-printed JSON string
    let templateText = JSON.stringify(templateStructure, null, 2);

    // Process special templates with __bodyTemplate
    templateText = this.processHandlebarsBodyTemplate(templateText);

    // Check if this is a starter template (has root-level content/pageSize)
    const isStarterTemplate =
      insertTemplate.label === 'Starter' &&
      (templateStructure.content || templateStructure.pageSize);

    const currentValue =
      this.pdfTemplatesForm.get('template_data_raw')?.value || '';
    let textToInsert = templateText;

    if (!currentValue || currentValue.trim() === '') {
      // Empty editor
      if (isStarterTemplate) {
        // Starter template has complete structure - insert as-is
        textToInsert = templateText;
      } else {
        // Regular template - wrap in content array
        textToInsert = `{\n  "content": [\n${templateText
          .split('\n')
          .map((line) => '    ' + line)
          .join('\n')}\n  ]\n}`;
      }
    } else {
      // Editor has content
      if (isStarterTemplate) {
        // Starter template should replace everything - confirm first
        if (confirm('Starter template will replace all content. Continue?')) {
          // Clear editor and insert starter template
          this.pdfTemplatesForm.patchValue({ template_data_raw: templateText });
          console.log(
            '[Insert Template] Replaced with starter template:',
            insertTemplate.label,
          );
          this.logoError.set(null);
          return;
        } else {
          return;
        }
      } else {
        // Regular template - insert at cursor with comma
        textToInsert = `,\n${templateText}`;
      }
    }

    // Insert at cursor position using Monaco Editor API
    this.templateDataEditor.insertTextAtCursor(textToInsert);

    console.log(
      '[Insert Template] Inserted template at cursor:',
      insertTemplate.label,
    );
    this.logoError.set(null);
  }

  /**
   * Process template with __handlebarsBody placeholder
   * Replaces "body": "__HANDLEBARS_BODY_PLACEHOLDER__" with actual Handlebars template
   */
  private processHandlebarsBodyTemplate(templateText: string): string {
    // Check if we have the placeholder
    if (!templateText.includes('__HANDLEBARS_BODY_PLACEHOLDER__')) {
      return templateText; // No placeholder found, return as-is
    }

    // Find the __handlebarsBody field value
    // Pattern: "__handlebarsBody": "..." where ... can contain escaped quotes
    const handlebarsBodyRegex = /"__handlebarsBody":\s*"((?:[^"\\]|\\.)*)"/s;
    const match = templateText.match(handlebarsBodyRegex);

    if (!match) {
      console.warn(
        '[processHandlebarsBodyTemplate] No __handlebarsBody field found',
      );
      return templateText;
    }

    // Extract and unescape the handlebars body
    let handlebarsBody = match[1];

    // Unescape JSON string escapes
    handlebarsBody = handlebarsBody
      .replace(/\\n/g, '\n')
      .replace(/\\"/g, '"')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '  ')
      .replace(/\\\\/g, '\\');

    // Replace the placeholder with the actual body (no quotes around it)
    let result = templateText.replace(
      '"__HANDLEBARS_BODY_PLACEHOLDER__"',
      handlebarsBody,
    );

    // Remove the __handlebarsBody field entirely
    // Match: , "__handlebarsBody": "..." or "__handlebarsBody": "..." ,
    result = result.replace(
      /,?\s*"__handlebarsBody":\s*"(?:[^"\\]|\\.)*"\s*,?/s,
      '',
    );

    // Clean up any double commas that might result
    result = result.replace(/,\s*,/g, ',');

    // Clean up trailing commas before closing braces/brackets
    result = result.replace(/,(\s*[}\]])/g, '$1');

    return result;
  }
}
