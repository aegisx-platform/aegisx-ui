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
  Article,
  CreateArticleRequest,
  UpdateArticleRequest,
} from '../types/articles.types';
import {
  formatDateTimeForInput,
  formatDateTimeForSubmission,
} from '../../../shared/utils/datetime.utils';

export type ArticleFormMode = 'create' | 'edit';

export interface ArticleFormData {
  title: string;
  content?: string;
  author_id: string;
  published?: boolean;
  published_at?: string;
  view_count?: number;
}

@Component({
  selector: 'app-articles-form',
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
    <form [formGroup]="articlesForm" class="-form">
      <!-- title Field -->
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Title</mat-label>
        <input
          matInput
          type="text"
          formControlName="title"
          placeholder="Enter article title"
        />
        <mat-error *ngIf="articlesForm.get('title')?.hasError('required')">
          Title is required
        </mat-error>
      </mat-form-field>

      <!-- content Field -->
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Content</mat-label>
        <textarea
          matInput
          formControlName="content"
          placeholder="Enter article content"
          rows="3"
        ></textarea>
      </mat-form-field>

      <!-- author_id Field -->
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Author ID</mat-label>
        <input
          matInput
          type="text"
          formControlName="author_id"
          placeholder="Enter author ID"
        />
        <mat-error *ngIf="articlesForm.get('author_id')?.hasError('required')">
          Author ID is required
        </mat-error>
      </mat-form-field>

      <!-- published Field -->
      <div class="checkbox-field">
        <mat-checkbox formControlName="published"> Published </mat-checkbox>
      </div>

      <!-- published_at Field -->
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Published At</mat-label>
        <input
          matInput
          type="datetime-local"
          formControlName="published_at"
          placeholder=""
        />
      </mat-form-field>

      <!-- view_count Field -->
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>View Count</mat-label>
        <input
          matInput
          type="number"
          formControlName="view_count"
          placeholder=""
        />
      </mat-form-field>

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
            articlesForm.invalid ||
            loading ||
            (mode === 'edit' && !hasChanges())
          "
        >
          <mat-spinner
            diameter="20"
            class="inline-spinner"
            *ngIf="loading"
          ></mat-spinner>
          {{ mode === 'create' ? 'Create' : 'Update' }} Articles
        </button>
      </div>
    </form>
  `,
  styles: [
    `
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
    `,
  ],
})
export class ArticleFormComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);

  @Input() mode: ArticleFormMode = 'create';
  @Input() initialData?: Article;
  @Input() loading = false;

  @Output() formSubmit = new EventEmitter<ArticleFormData>();
  @Output() formCancel = new EventEmitter<void>();

  private originalFormValue: any;

  articlesForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    content: ['', []],
    author_id: ['', [Validators.required]],
    published: [false, []],
    published_at: ['', []],
    view_count: ['', []],
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

  private populateForm(articles: Article) {
    const formValue = {
      title: articles.title,
      content: articles.content,
      author_id: articles.author_id,
      published: articles.published,
      published_at: formatDateTimeForInput(articles.published_at),
      view_count: articles.view_count,
    };

    this.articlesForm.patchValue(formValue);
    this.originalFormValue = this.articlesForm.value;
  }

  hasChanges(): boolean {
    if (this.mode === 'create') return true;
    const currentValue = this.articlesForm.value;
    return (
      JSON.stringify(currentValue) !== JSON.stringify(this.originalFormValue)
    );
  }

  onSubmit() {
    if (this.articlesForm.valid) {
      const formData = { ...this.articlesForm.value } as ArticleFormData;

      // Convert datetime-local format back to ISO strings for submission
      if (formData.published_at) {
        formData.published_at = formatDateTimeForSubmission(
          formData.published_at,
        );
      }

      this.formSubmit.emit(formData);
    }
  }

  onCancel() {
    this.formCancel.emit();
  }
}
