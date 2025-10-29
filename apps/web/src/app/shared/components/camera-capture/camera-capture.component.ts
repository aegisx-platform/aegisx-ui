import {
  Component,
  Output,
  EventEmitter,
  signal,
  inject,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CameraService } from '../../services/camera.service';

/**
 * Camera Capture Component
 *
 * Provides camera capture UI with:
 * - Live camera preview
 * - Photo capture
 * - Camera switching (front/back)
 * - Error handling
 */
@Component({
  selector: 'app-camera-capture',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './camera-capture.component.html',
  styleUrls: ['./camera-capture.component.scss'],
})
export class CameraCaptureComponent implements OnInit, OnDestroy {
  private cameraService = inject(CameraService);

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  @Input() facingMode: 'user' | 'environment' = 'environment';
  @Input() captureFormat: 'jpeg' | 'png' | 'webp' = 'jpeg';
  @Input() captureQuality = 0.92;
  @Input() maxWidth?: number;
  @Input() maxHeight?: number;

  @Output() onCapture = new EventEmitter<Blob>();
  @Output() onClose = new EventEmitter<void>();
  @Output() onError = new EventEmitter<string>();

  // State
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  hasMultipleCameras = signal(false);
  capturedPhoto = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    await this.initializeCamera();
    this.hasMultipleCameras.set(await this.cameraService.hasMultipleCameras());
  }

  ngOnDestroy(): void {
    this.cameraService.stopCamera();
  }

  /**
   * Initialize camera
   */
  private async initializeCamera(): Promise<void> {
    try {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      const stream = await this.cameraService.startCamera(this.facingMode);

      // Wait for video element to be available
      setTimeout(() => {
        if (this.videoElement?.nativeElement) {
          this.videoElement.nativeElement.srcObject = stream;
          this.isLoading.set(false);
        }
      }, 100);
    } catch (error: any) {
      this.isLoading.set(false);
      const message = error.message || 'Failed to access camera';
      this.errorMessage.set(message);
      this.onError.emit(message);
    }
  }

  /**
   * Capture photo
   */
  async capture(): Promise<void> {
    if (!this.videoElement?.nativeElement) {
      return;
    }

    try {
      const blob = await this.cameraService.capturePhoto(
        this.videoElement.nativeElement,
        {
          quality: this.captureQuality,
          format: this.captureFormat,
          maxWidth: this.maxWidth,
          maxHeight: this.maxHeight,
        },
      );

      // Show preview
      const url = URL.createObjectURL(blob);
      this.capturedPhoto.set(url);

      // Emit capture event
      this.onCapture.emit(blob);
    } catch (error: any) {
      const message = error.message || 'Failed to capture photo';
      this.errorMessage.set(message);
      this.onError.emit(message);
    }
  }

  /**
   * Switch camera (front/back)
   */
  async switchCamera(): Promise<void> {
    try {
      this.isLoading.set(true);
      const stream = await this.cameraService.switchCamera();

      if (this.videoElement?.nativeElement) {
        this.videoElement.nativeElement.srcObject = stream;
        this.isLoading.set(false);
      }
    } catch (error: any) {
      this.isLoading.set(false);
      const message = error.message || 'Failed to switch camera';
      this.errorMessage.set(message);
      this.onError.emit(message);
    }
  }

  /**
   * Retake photo
   */
  retake(): void {
    this.capturedPhoto.set(null);
  }

  /**
   * Close camera
   */
  close(): void {
    this.cameraService.stopCamera();
    this.onClose.emit();
  }

  /**
   * Retry camera initialization
   */
  retry(): void {
    this.initializeCamera();
  }
}
