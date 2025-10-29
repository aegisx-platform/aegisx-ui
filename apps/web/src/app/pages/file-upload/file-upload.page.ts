import { Component, ViewChild, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import {
  FileManagementComponent,
  UploadedFile,
  FileUploadService,
} from '../../shared/ui/components/file-upload';

import { UploadWidgetComponent } from '../../shared/components/upload-widget/upload-widget.component';

@Component({
  selector: 'app-file-upload-page',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatSnackBarModule,
    FileManagementComponent,
    UploadWidgetComponent,
  ],
  templateUrl: './file-upload.page.html',
  styleUrls: ['./file-upload.page.scss'],
})
export class FileUploadPage implements OnInit {
  @ViewChild(FileManagementComponent) fileManagement!: FileManagementComponent;

  private fileUploadService = inject(FileUploadService);
  private snackBar = inject(MatSnackBar);

  // Legacy file stats
  readonly fileStats = this.fileUploadService.fileStats;

  // Tab state
  selectedTab: 'upload' | 'management' = 'upload';

  ngOnInit(): void {
    // No initialization needed for simple upload
  }

  /**
   * Handle upload completion
   */
  onUploadComplete(event: { uploaded: any[]; failed: any[] }): void {
    console.log('Upload Complete Event:', event);
    const { uploaded, failed } = event;

    if (uploaded.length > 0) {
      this.snackBar.open(
        `Successfully uploaded ${uploaded.length} file(s)`,
        'Close',
        { duration: 3000 },
      );
    }

    if (failed.length > 0) {
      this.snackBar.open(`Failed to upload ${failed.length} file(s)`, 'Close', {
        duration: 5000,
      });
    }
  }

  /**
   * Handle upload error
   */
  onUploadError(event: { filename: string; error: string }): void {
    console.error('Upload Error Event:', event);
    this.snackBar.open(`Upload failed: ${event.error}`, 'Close', {
      duration: 5000,
    });
  }

  onFilesDeleted(files: UploadedFile[]): void {
    console.log('Files deleted:', files);
  }
}
