import { Injectable, signal } from '@angular/core';

/**
 * Camera Service
 *
 * Handles camera access and photo capture using Web MediaDevices API.
 *
 * Features:
 * - Camera access (front/back)
 * - Photo capture
 * - Camera switching
 * - Auto-orientation fix
 * - Permission handling
 */
@Injectable({
  providedIn: 'root',
})
export class CameraService {
  // Camera state
  private stream = signal<MediaStream | null>(null);
  private currentFacingMode = signal<'user' | 'environment'>('environment');

  // Permission state
  isCameraSupported = signal(this.checkCameraSupport());
  isCameraActive = signal(false);

  /**
   * Check if camera is supported
   */
  private checkCameraSupport(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  /**
   * Start camera with specified facing mode
   */
  async startCamera(
    facingMode: 'user' | 'environment' = 'environment',
  ): Promise<MediaStream> {
    if (!this.isCameraSupported()) {
      throw new Error('Camera not supported in this browser');
    }

    // Stop existing stream if any
    await this.stopCamera();

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const mediaStream =
        await navigator.mediaDevices.getUserMedia(constraints);

      this.stream.set(mediaStream);
      this.currentFacingMode.set(facingMode);
      this.isCameraActive.set(true);

      return mediaStream;
    } catch (error: any) {
      this.isCameraActive.set(false);
      throw new Error(this.getCameraErrorMessage(error));
    }
  }

  /**
   * Stop camera and release resources
   */
  async stopCamera(): Promise<void> {
    const currentStream = this.stream();

    if (currentStream) {
      currentStream.getTracks().forEach((track) => track.stop());
      this.stream.set(null);
      this.isCameraActive.set(false);
    }
  }

  /**
   * Switch between front and back camera
   */
  async switchCamera(): Promise<MediaStream> {
    const newFacingMode =
      this.currentFacingMode() === 'user' ? 'environment' : 'user';
    return this.startCamera(newFacingMode);
  }

  /**
   * Capture photo from video stream
   */
  capturePhoto(
    videoElement: HTMLVideoElement,
    options: {
      quality?: number; // 0-1, default: 0.92
      format?: 'jpeg' | 'png' | 'webp'; // default: 'jpeg'
      maxWidth?: number;
      maxHeight?: number;
    } = {},
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      try {
        const {
          quality = 0.92,
          format = 'jpeg',
          maxWidth,
          maxHeight,
        } = options;

        // Create canvas
        const canvas = document.createElement('canvas');
        const video = videoElement;

        let { videoWidth, videoHeight } = video;

        // Apply max dimensions if specified
        if (maxWidth && videoWidth > maxWidth) {
          videoHeight = (videoHeight * maxWidth) / videoWidth;
          videoWidth = maxWidth;
        }

        if (maxHeight && videoHeight > maxHeight) {
          videoWidth = (videoWidth * maxHeight) / videoHeight;
          videoHeight = maxHeight;
        }

        canvas.width = videoWidth;
        canvas.height = videoHeight;

        // Draw video frame to canvas
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(video, 0, 0, videoWidth, videoHeight);

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to capture photo'));
            }
          },
          `image/${format}`,
          quality,
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get available cameras
   */
  async getAvailableCameras(): Promise<MediaDeviceInfo[]> {
    if (!this.isCameraSupported()) {
      return [];
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter((device) => device.kind === 'videoinput');
    } catch {
      return [];
    }
  }

  /**
   * Check if device has multiple cameras
   */
  async hasMultipleCameras(): Promise<boolean> {
    const cameras = await this.getAvailableCameras();
    return cameras.length > 1;
  }

  /**
   * Request camera permission
   */
  async requestPermission(): Promise<boolean> {
    if (!this.isCameraSupported()) {
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      // Stop stream immediately
      stream.getTracks().forEach((track) => track.stop());

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get camera error message
   */
  private getCameraErrorMessage(error: any): string {
    if (
      error.name === 'NotAllowedError' ||
      error.name === 'PermissionDeniedError'
    ) {
      return 'Camera permission denied. Please allow camera access in your browser settings.';
    }

    if (
      error.name === 'NotFoundError' ||
      error.name === 'DevicesNotFoundError'
    ) {
      return 'No camera found on this device.';
    }

    if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      return 'Camera is already in use by another application.';
    }

    if (error.name === 'OverconstrainedError') {
      return 'Camera does not support the requested settings.';
    }

    return error.message || 'Failed to access camera';
  }

  /**
   * Get current stream
   */
  getStream(): MediaStream | null {
    return this.stream();
  }

  /**
   * Get current facing mode
   */
  getFacingMode(): 'user' | 'environment' {
    return this.currentFacingMode();
  }

  /**
   * Cleanup on service destroy
   */
  ngOnDestroy(): void {
    this.stopCamera();
  }
}
