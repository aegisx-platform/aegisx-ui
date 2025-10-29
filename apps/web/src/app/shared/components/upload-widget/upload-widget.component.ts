import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UploadService } from '../../services/upload.service';
import { CameraService } from '../../services/camera.service';
import {
  ImageCompressionService,
  CompressionOptions,
} from '../../services/image-compression.service';
import {
  FileManagerService,
  UploadContext,
} from '../../services/file-manager.service';
import { CameraCaptureComponent } from '../camera-capture/camera-capture.component';
import {
  UploadOptions,
  MultipleUploadProgress,
  UploadStartEvent,
  UploadProgressEvent,
  UploadCompleteEvent,
  UploadErrorEvent,
  DragDropState,
  FileCategory,
} from './upload-widget.types';

/**
 * Upload Widget Component
 *
 * Core upload component with support for:
 * - Single/multiple file uploads
 * - Drag and drop
 * - Camera capture with compression
 * - Progress tracking
 * - Context-aware uploads (user, patient, product, etc.)
 * - Category-based configuration
 * - Optional authentication (works with FileManagerService)
 */
@Component({
  selector: 'app-upload-widget',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
    MatDialogModule,
  ],
  templateUrl: './upload-widget.component.html',
  styleUrls: ['./upload-widget.component.scss'],
})
export class UploadWidgetComponent implements OnInit {
  private uploadService = inject(UploadService);
  private fileManager = inject(FileManagerService);
  private cameraService = inject(CameraService);
  private imageCompressionService = inject(ImageCompressionService);
  private dialog = inject(MatDialog);

  // Inputs
  @Input() mode: 'single' | 'multiple' = 'single';
  @Input() category: FileCategory = 'document';
  @Input() maxFiles = 10;
  @Input() maxFileSize = 10 * 1024 * 1024; // 10 MB
  @Input() accept = '*';
  @Input() enableDragDrop = true;
  @Input() enableImagePreview = true;
  @Input() enableCropping = false;
  @Input() enableCamera = true;
  @Input() enableCompression = true;
  @Input() compressionOptions: CompressionOptions = {
    maxWidth: 1920,
    maxHeight: 1920,
    quality: 0.8,
    format: 'jpeg',
  };
  @Input() concurrent = 3;

  // NEW: Core upload system inputs
  @Input() useFileManager = true; // Use new FileManagerService (default)
  @Input() uploadContext?: UploadContext; // Upload context (user, patient, product, etc.)
  @Input() isPublic?: boolean; // Public/private file
  @Input() isTemporary?: boolean; // Temporary file
  @Input() expiresIn?: number; // Expiration time in hours
  @Input() allowDuplicates = true; // Allow duplicate files
  @Input() metadata?: Record<string, any>; // Additional metadata

  // Outputs
  @Output() onUploadStart = new EventEmitter<UploadStartEvent>();
  @Output() onUploadProgress = new EventEmitter<UploadProgressEvent>();
  @Output() onUploadComplete = new EventEmitter<UploadCompleteEvent>();
  @Output() onUploadError = new EventEmitter<UploadErrorEvent>();

  // Signals
  selectedFiles = signal<File[]>([]);
  uploadProgress = signal<MultipleUploadProgress | null>(null);
  dragDropState = signal<DragDropState>({
    isDragging: false,
    isValidDrop: false,
  });
  isUploading = signal(false);

  // Computed
  hasFiles = computed(() => this.selectedFiles().length > 0);
  canUpload = computed(() => this.hasFiles() && !this.isUploading());
  progressPercentage = computed(() => {
    const progress = this.uploadProgress();
    return progress ? progress.overallPercentage : 0;
  });
  isCameraSupported = computed(() => this.cameraService.isCameraSupported());
  showCameraButton = computed(
    () =>
      this.enableCamera &&
      this.isCameraSupported() &&
      (this.accept === '*' || this.accept.includes('image/')),
  );

  ngOnInit(): void {
    // Initialize component
  }

  /**
   * Open camera to capture photo
   */
  openCamera(): void {
    const dialogRef = this.dialog.open(CameraCaptureComponent, {
      width: '100%',
      maxWidth: '800px',
      height: '80vh',
      panelClass: 'camera-dialog',
      data: {
        facingMode: 'environment',
        captureFormat: 'jpeg',
        captureQuality: 0.92,
      },
    });

    dialogRef.componentInstance.onCapture.subscribe(async (blob: Blob) => {
      // Convert blob to File
      const file = new File([blob], `photo_${Date.now()}.jpg`, {
        type: 'image/jpeg',
      });
      await this.addFiles([file]);
      dialogRef.close();
    });

    dialogRef.componentInstance.onClose.subscribe(() => {
      dialogRef.close();
    });
  }

  /**
   * Handle file selection from input
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const files = Array.from(input.files);
    this.addFiles(files);

    // Clear input
    input.value = '';
  }

  /**
   * Handle drag over event
   */
  onDragOver(event: DragEvent): void {
    if (!this.enableDragDrop) return;

    event.preventDefault();
    event.stopPropagation();

    this.dragDropState.set({
      isDragging: true,
      isValidDrop: this.isValidDragEvent(event),
    });
  }

  /**
   * Handle drag leave event
   */
  onDragLeave(event: DragEvent): void {
    if (!this.enableDragDrop) return;

    event.preventDefault();
    event.stopPropagation();

    this.dragDropState.set({
      isDragging: false,
      isValidDrop: false,
    });
  }

  /**
   * Handle drop event
   */
  onDrop(event: DragEvent): void {
    if (!this.enableDragDrop) return;

    event.preventDefault();
    event.stopPropagation();

    this.dragDropState.set({
      isDragging: false,
      isValidDrop: false,
    });

    const files = event.dataTransfer?.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    this.addFiles(fileArray);
  }

  /**
   * Add files to selection (with optional compression)
   */
  private async addFiles(files: File[]): Promise<void> {
    const currentFiles = this.selectedFiles();

    // Filter valid files
    const validFiles = files.filter((file) => {
      const validation = this.uploadService.validateFile(
        file,
        this.maxFileSize,
        this.accept !== '*' ? this.accept.split(',') : undefined,
      );

      if (!validation.valid) {
        this.onUploadError.emit({
          filename: file.name,
          error: validation.error || 'Invalid file',
        });
        return false;
      }

      return true;
    });

    // Compress images if enabled
    const processedFiles: File[] = [];
    for (const file of validFiles) {
      if (
        this.enableCompression &&
        this.imageCompressionService.isImage(file)
      ) {
        try {
          const result = await this.imageCompressionService.compressImage(
            file,
            this.compressionOptions,
          );

          // Convert blob to File with original filename
          const compressedFile = new File([result.blob], file.name, {
            type: result.blob.type,
          });

          processedFiles.push(compressedFile);

          // Log compression stats (optional)
          console.log(
            `Compressed ${file.name}:`,
            this.imageCompressionService.getCompressionStats(result),
          );
        } catch (error) {
          console.error(`Failed to compress ${file.name}:`, error);
          // Use original file if compression fails
          processedFiles.push(file);
        }
      } else {
        // Non-image or compression disabled
        processedFiles.push(file);
      }
    }

    // Check max files limit
    if (this.mode === 'single') {
      this.selectedFiles.set(processedFiles.slice(0, 1));
    } else {
      const newFiles = [...currentFiles, ...processedFiles].slice(
        0,
        this.maxFiles,
      );
      this.selectedFiles.set(newFiles);
    }
  }

  /**
   * Remove file from selection
   */
  removeFile(index: number): void {
    const files = this.selectedFiles();
    files.splice(index, 1);
    this.selectedFiles.set([...files]);
  }

  /**
   * Clear all selected files
   */
  clearFiles(): void {
    this.selectedFiles.set([]);
    this.uploadProgress.set(null);
  }

  /**
   * Start upload (using core FileManagerService or legacy UploadService)
   */
  startUpload(): void {
    const files = this.selectedFiles();
    if (files.length === 0) return;

    this.isUploading.set(true);

    // Emit upload start event
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    this.onUploadStart.emit({ files, totalSize });

    if (this.useFileManager) {
      // NEW: Use core FileManagerService
      this.uploadWithFileManager(files);
    } else {
      // LEGACY: Use old UploadService
      this.uploadWithLegacyService(files);
    }
  }

  /**
   * Upload using new core FileManagerService
   */
  private uploadWithFileManager(files: File[]): void {
    const uploadedFiles: any[] = [];
    const failedFiles: any[] = [];
    let completed = 0;

    files.forEach((file) => {
      this.fileManager
        .upload(file, {
          category: this.category,
          context: this.uploadContext,
          isPublic: this.isPublic,
          isTemporary: this.isTemporary,
          expiresIn: this.expiresIn,
          allowDuplicates: this.allowDuplicates,
          metadata: this.metadata,
        })
        .subscribe({
          next: (result) => {
            uploadedFiles.push(result);
            completed++;

            if (completed === files.length) {
              this.handleUploadComplete(uploadedFiles, failedFiles);
            }
          },
          error: (error) => {
            failedFiles.push({
              filename: file.name,
              error: error.message || 'Upload failed',
            });
            completed++;

            if (completed === files.length) {
              this.handleUploadComplete(uploadedFiles, failedFiles);
            }
          },
        });
    });
  }

  /**
   * Upload using legacy UploadService
   */
  private uploadWithLegacyService(files: File[]): void {
    const options: UploadOptions = {
      category: this.category,
    };

    this.uploadService.uploadMultiple(files, options).subscribe({
      next: (progress) => {
        this.uploadProgress.set(progress);
        this.onUploadProgress.emit({ progress });
      },
      error: (error) => {
        this.isUploading.set(false);
        this.onUploadError.emit({
          filename: 'Multiple files',
          error: error.message || 'Upload failed',
        });
      },
      complete: () => {
        this.isUploading.set(false);
        const progress = this.uploadProgress();

        if (progress) {
          const uploaded = progress.files
            .filter((f) => f.status === 'completed' && f.result)
            .map((f) => f.result)
            .filter((r): r is NonNullable<typeof r> => r !== undefined);

          const failed = progress.files
            .filter((f) => f.status === 'failed')
            .map((f) => ({
              filename: f.filename,
              error: f.error || 'Unknown error',
            }));

          this.onUploadComplete.emit({ uploaded, failed });
        }
      },
    });
  }

  /**
   * Handle upload completion (for FileManagerService)
   */
  private handleUploadComplete(uploaded: any[], failed: any[]): void {
    this.isUploading.set(false);
    this.onUploadComplete.emit({ uploaded, failed });

    // Clear selected files after successful upload
    if (failed.length === 0) {
      this.clearFiles();
    }
  }

  /**
   * Check if drag event contains valid files
   */
  private isValidDragEvent(event: DragEvent): boolean {
    const items = event.dataTransfer?.items;
    if (!items) return false;

    // Check if all items are files
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind !== 'file') {
        return false;
      }
    }

    return true;
  }

  /**
   * Get file preview URL (for images)
   */
  getFilePreview(file: File): string {
    if (!file.type.startsWith('image/')) {
      return '';
    }

    return URL.createObjectURL(file);
  }

  /**
   * Get file icon based on MIME type
   */
  getFileIcon(file: File): string {
    const type = file.type;

    if (type.startsWith('image/')) return 'image';
    if (type.startsWith('video/')) return 'videocam';
    if (type.startsWith('audio/')) return 'audiotrack';
    if (type === 'application/pdf') return 'picture_as_pdf';
    if (
      type === 'application/msword' ||
      type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
      return 'description';
    if (
      type === 'application/vnd.ms-excel' ||
      type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
      return 'table_chart';

    return 'insert_drive_file';
  }

  /**
   * Format file size to human-readable string
   */
  formatFileSize(bytes: number): string {
    return this.uploadService.formatFileSize(bytes);
  }
}
