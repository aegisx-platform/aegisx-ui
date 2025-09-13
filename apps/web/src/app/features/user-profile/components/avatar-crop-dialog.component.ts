import {
  Component,
  Inject,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { ImageCroppedEvent, ImageTransform, LoadedImage } from 'ngx-image-cropper';
import { ImageCropperComponent } from 'ngx-image-cropper';

export interface AvatarCropDialogData {
  file: File;
  aspectRatio: number;
  resizeToWidth: number;
  resizeToHeight: number;
}

@Component({
  selector: 'ax-avatar-crop-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSliderModule,
    MatTooltipModule,
    FormsModule,
    ImageCropperComponent,
  ],
  template: `
    <div class="avatar-crop-dialog">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Crop Profile Picture
        </h2>
        <button
          mat-icon-button
          (click)="onCancel()"
          matTooltip="Cancel"
          [attr.aria-label]="'Cancel avatar cropping'"
        >
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Cropper Container -->
      <div class="flex-1 p-6 min-h-0">
        <div class="relative w-full h-full flex flex-col">
          <!-- Image Cropper -->
          <div class="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
            <image-cropper
              [imageFile]="data.file"
              [maintainAspectRatio]="true"
              [aspectRatio]="data.aspectRatio"
              [resizeToWidth]="data.resizeToWidth"
              [resizeToHeight]="data.resizeToHeight"
              [cropperMinWidth]="128"
              [cropperMinHeight]="128"
              [onlyScaleDown]="false"
              [roundCropper]="true"
              [canvasRotation]="canvasRotation()"
              [transform]="transform()"
              [hideResizeSquares]="false"
              [cropper]="cropper()"
              [imageQuality]="90"
              [format]="'png'"
              [backgroundColor]="'transparent'"
              [containWithinAspectRatio]="false"
              [alignImage]="'center'"
              (imageCropped)="imageCropped($event)"
              (imageLoaded)="imageLoaded($event)"
              (cropperReady)="cropperReady()"
              (loadImageFailed)="loadImageFailed()"
              class="w-full h-full"
              style="max-height: 400px;"
            ></image-cropper>
          </div>

          <!-- Controls -->
          <div class="mt-4 space-y-4">
            <!-- Zoom Control -->
            <div class="flex items-center space-x-4">
              <mat-icon class="text-gray-600 dark:text-gray-400">zoom_out</mat-icon>
              <mat-slider
                class="flex-1"
                [min]="0.1"
                [max]="3"
                [step]="0.1"
                [discrete]="false"
                [showTickMarks]="false"
                [(ngModel)]="scale"
                (ngModelChange)="onScaleChange($event)"
                [attr.aria-label]="'Zoom level'"
                matTooltip="Adjust zoom level"
              >
                <input matSliderThumb />
              </mat-slider>
              <mat-icon class="text-gray-600 dark:text-gray-400">zoom_in</mat-icon>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-center space-x-2">
              <button
                mat-icon-button
                (click)="rotateLeft()"
                matTooltip="Rotate left"
                [attr.aria-label]="'Rotate image left'"
                [disabled]="isProcessing()"
              >
                <mat-icon>rotate_left</mat-icon>
              </button>

              <button
                mat-icon-button
                (click)="rotateRight()"
                matTooltip="Rotate right"
                [attr.aria-label]="'Rotate image right'"
                [disabled]="isProcessing()"
              >
                <mat-icon>rotate_right</mat-icon>
              </button>

              <button
                mat-icon-button
                (click)="resetImage()"
                matTooltip="Reset to original"
                [attr.aria-label]="'Reset image to original state'"
                [disabled]="isProcessing()"
              >
                <mat-icon>refresh</mat-icon>
              </button>

              <button
                mat-icon-button
                (click)="flipHorizontal()"
                matTooltip="Flip horizontal"
                [attr.aria-label]="'Flip image horizontally'"
                [disabled]="isProcessing()"
              >
                <mat-icon>flip</mat-icon>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          @if (imageWidth() && imageHeight()) {
            Original: {{ imageWidth() }} × {{ imageHeight() }}px
          }
          @if (croppedImage()) {
            | Cropped: {{ data.resizeToWidth }} × {{ data.resizeToHeight }}px
          }
        </div>

        <div class="flex space-x-2">
          <button
            mat-button
            (click)="onCancel()"
            [disabled]="isProcessing()"
          >
            Cancel
          </button>
          
          <button
            mat-raised-button
            color="primary"
            (click)="onSave()"
            [disabled]="!croppedImage() || isProcessing()"
          >
            @if (isProcessing()) {
              <ng-container>
                <mat-icon class="mr-2 animate-spin text-sm">sync</mat-icon>
                Processing...
              </ng-container>
            } @else {
              <ng-container>
                <mat-icon class="mr-2">save</mat-icon>
                Save Avatar
              </ng-container>
            }
          </button>
        </div>
      </div>

      <!-- Loading Overlay -->
      @if (isProcessing()) {
        <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <mat-icon class="text-primary text-4xl animate-spin mb-2">sync</mat-icon>
            <p class="text-gray-900 dark:text-gray-100">Processing image...</p>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .avatar-crop-dialog {
        display: flex;
        flex-direction: column;
        height: 100%;
        max-height: 90vh;
      }

      ::ng-deep .mat-mdc-dialog-container .mdc-dialog__surface {
        padding: 0 !important;
      }

      ::ng-deep .avatar-crop-dialog .mat-mdc-dialog-container {
        padding: 0;
      }

      .animate-spin {
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      /* Image cropper overrides */
      ::ng-deep image-cropper {
        text-align: center;
      }

      ::ng-deep image-cropper .ng2-img-cropper {
        border-radius: 8px;
        overflow: hidden;
      }

      /* Slider styling */
      ::ng-deep mat-slider {
        --mdc-slider-active-track-color: var(--mat-primary-main);
        --mdc-slider-inactive-track-color: var(--mat-primary-main);
        --mdc-slider-handle-color: var(--mat-primary-main);
      }
    `,
  ],
})
export class AvatarCropDialogComponent implements OnInit, OnDestroy {
  // State signals
  isProcessing = signal(false);
  imageLoading = signal(true);
  croppedImage = signal<string | null>(null);
  canvasRotation = signal(0);
  scale = 1;
  imageWidth = signal<number | null>(null);
  imageHeight = signal<number | null>(null);

  // Transform and cropper state
  transform = signal<ImageTransform>({
    scale: 1,
    rotate: 0,
    flipH: false,
    flipV: false,
  });

  cropper = signal({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });

  constructor(
    public dialogRef: MatDialogRef<AvatarCropDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AvatarCropDialogData
  ) {}

  ngOnInit(): void {
    // Set initial scale from transform
    this.scale = this.transform().scale || 1;
  }

  ngOnDestroy(): void {
    // Cleanup any resources if needed
  }

  imageCropped(event: ImageCroppedEvent): void {
    if (event.objectUrl) {
      this.croppedImage.set(event.objectUrl);
    }
  }

  imageLoaded(image: LoadedImage): void {
    this.imageLoading.set(false);
    this.imageWidth.set(image.original.size.width);
    this.imageHeight.set(image.original.size.height);
    console.log('Image loaded:', image);
  }

  cropperReady(): void {
    console.log('Cropper ready');
    this.imageLoading.set(false);
  }

  loadImageFailed(): void {
    console.error('Load image failed');
    this.imageLoading.set(false);
  }

  onScaleChange(scale: number): void {
    this.transform.update(current => ({
      ...current,
      scale: scale,
    }));
  }

  rotateLeft(): void {
    this.canvasRotation.update(rotation => rotation - 90);
    if (this.canvasRotation() < -360) {
      this.canvasRotation.set(this.canvasRotation() + 360);
    }
  }

  rotateRight(): void {
    this.canvasRotation.update(rotation => rotation + 90);
    if (this.canvasRotation() > 360) {
      this.canvasRotation.set(this.canvasRotation() - 360);
    }
  }

  flipHorizontal(): void {
    this.transform.update(current => ({
      ...current,
      flipH: !current.flipH,
    }));
  }

  resetImage(): void {
    this.canvasRotation.set(0);
    this.scale = 1;
    this.transform.set({
      scale: 1,
      rotate: 0,
      flipH: false,
      flipV: false,
    });
  }

  async onSave(): Promise<void> {
    const croppedImageUrl = this.croppedImage();
    if (!croppedImageUrl) {
      return;
    }

    this.isProcessing.set(true);

    try {
      // Convert data URL to File
      const response = await fetch(croppedImageUrl);
      const blob = await response.blob();
      
      // Generate filename with proper extension
      const timestamp = Date.now();
      const fileName = `avatar_${timestamp}.png`;
      
      const croppedFile = new File([blob], fileName, {
        type: 'image/png',
        lastModified: timestamp,
      });

      // Close dialog with the cropped file
      this.dialogRef.close(croppedFile);
    } catch (error) {
      console.error('Error processing cropped image:', error);
      // Could show an error message here
    } finally {
      this.isProcessing.set(false);
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}