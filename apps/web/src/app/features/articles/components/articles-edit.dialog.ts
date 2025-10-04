import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ArticleService } from '../services/articles.service';
import { Article, UpdateArticleRequest } from '../types/articles.types';
import {
  ArticleFormComponent,
  ArticleFormData,
} from './articles-form.component';

export interface ArticleEditDialogData {
  articles: Article;
}

@Component({
  selector: 'app-articles-edit-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ArticleFormComponent],
  template: `
    <div class="edit-dialog">
      <h2 mat-dialog-title>Edit Articles</h2>

      <mat-dialog-content>
        <app-articles-form
          mode="edit"
          [initialData]="data.articles"
          [loading]="loading()"
          (formSubmit)="onFormSubmit($event)"
          (formCancel)="onCancel()"
        ></app-articles-form>
      </mat-dialog-content>
    </div>
  `,
  styles: [
    `
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
    `,
  ],
})
export class ArticleEditDialogComponent implements OnInit {
  private articlesService = inject(ArticleService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<ArticleEditDialogComponent>);
  public data = inject<ArticleEditDialogData>(MAT_DIALOG_DATA);

  loading = signal<boolean>(false);

  ngOnInit() {
    // No additional setup needed since shared form handles data population
  }

  async onFormSubmit(formData: ArticleFormData) {
    this.loading.set(true);

    try {
      const updateRequest = formData as UpdateArticleRequest;
      const result = await this.articlesService.updateArticle(
        this.data.articles.id,
        updateRequest,
      );

      if (result) {
        this.snackBar.open('Articles updated successfully', 'Close', {
          duration: 3000,
        });
        this.dialogRef.close(result);
      } else {
        this.snackBar.open('Failed to update Articles', 'Close', {
          duration: 5000,
        });
      }
    } catch (error: any) {
      this.snackBar.open(
        error.message || 'Failed to update Articles',
        'Close',
        { duration: 5000 },
      );
    } finally {
      this.loading.set(false);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
