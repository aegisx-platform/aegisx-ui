import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ArticleService } from '../services/articles.service';
import { CreateArticleRequest } from '../types/articles.types';
import {
  ArticleFormComponent,
  ArticleFormData,
} from './articles-form.component';

@Component({
  selector: 'app-articles-create-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ArticleFormComponent],
  template: `
    <div class="create-dialog">
      <h2 mat-dialog-title>Create Articles</h2>

      <mat-dialog-content>
        <app-articles-form
          mode="create"
          [loading]="loading()"
          (formSubmit)="onFormSubmit($event)"
          (formCancel)="onCancel()"
        ></app-articles-form>
      </mat-dialog-content>
    </div>
  `,
  styles: [
    `
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
    `,
  ],
})
export class ArticleCreateDialogComponent {
  private articlesService = inject(ArticleService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<ArticleCreateDialogComponent>);

  loading = signal<boolean>(false);

  async onFormSubmit(formData: ArticleFormData) {
    this.loading.set(true);

    try {
      const createRequest = formData as CreateArticleRequest;
      const result = await this.articlesService.createArticle(createRequest);

      if (result) {
        this.snackBar.open('Articles created successfully', 'Close', {
          duration: 3000,
        });
        this.dialogRef.close(result);
      } else {
        this.snackBar.open('Failed to create Articles', 'Close', {
          duration: 5000,
        });
      }
    } catch (error: any) {
      this.snackBar.open(
        error.message || 'Failed to create Articles',
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
