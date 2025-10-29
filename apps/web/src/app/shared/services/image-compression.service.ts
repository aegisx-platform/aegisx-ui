import { Injectable } from '@angular/core';

/**
 * Image Compression Options
 */
export interface CompressionOptions {
  /** Maximum width in pixels (maintains aspect ratio) */
  maxWidth?: number;
  /** Maximum height in pixels (maintains aspect ratio) */
  maxHeight?: number;
  /** Image quality (0-1), default: 0.8 */
  quality?: number;
  /** Output format: 'jpeg' | 'png' | 'webp', default: 'jpeg' */
  format?: 'jpeg' | 'png' | 'webp';
  /** Maximum file size in bytes (optional, will adjust quality to meet) */
  maxSizeBytes?: number;
}

/**
 * Compression Result
 */
export interface CompressionResult {
  /** Compressed image blob */
  blob: Blob;
  /** Original file size */
  originalSize: number;
  /** Compressed file size */
  compressedSize: number;
  /** Compression ratio (0-1) */
  compressionRatio: number;
  /** Final dimensions */
  width: number;
  height: number;
}

/**
 * Image Compression Service
 *
 * Compresses images before upload to reduce bandwidth and storage.
 * Particularly useful for mobile devices with high-resolution cameras.
 *
 * Features:
 * - Resize images to maximum dimensions
 * - Adjust quality to meet target file size
 * - Convert formats (JPEG, PNG, WebP)
 * - Maintain aspect ratio
 * - Progressive compression for large files
 */
@Injectable({
  providedIn: 'root',
})
export class ImageCompressionService {
  /**
   * Default compression options
   */
  private readonly DEFAULT_OPTIONS: CompressionOptions = {
    maxWidth: 1920,
    maxHeight: 1920,
    quality: 0.8,
    format: 'jpeg',
  };

  /**
   * Compress an image file or blob
   */
  async compressImage(
    file: File | Blob,
    options: CompressionOptions = {},
  ): Promise<CompressionResult> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    const originalSize = file.size;

    // Load image
    const img = await this.loadImage(file);

    // Calculate new dimensions
    const { width, height } = this.calculateDimensions(
      img.width,
      img.height,
      opts.maxWidth,
      opts.maxHeight,
    );

    // Get final options with defaults
    const quality = opts.quality ?? this.DEFAULT_OPTIONS.quality ?? 0.8;
    const format = opts.format ?? this.DEFAULT_OPTIONS.format ?? 'jpeg';

    // Initial compression
    let blob = await this.compressToBlob(img, width, height, quality, format);

    // If max size is specified and not met, progressively reduce quality
    if (opts.maxSizeBytes && blob.size > opts.maxSizeBytes) {
      blob = await this.compressToSize(
        img,
        width,
        height,
        opts.maxSizeBytes,
        format,
      );
    }

    return {
      blob,
      originalSize,
      compressedSize: blob.size,
      compressionRatio: blob.size / originalSize,
      width,
      height,
    };
  }

  /**
   * Compress multiple images in parallel
   */
  async compressMultiple(
    files: (File | Blob)[],
    options: CompressionOptions = {},
  ): Promise<CompressionResult[]> {
    return Promise.all(files.map((file) => this.compressImage(file, options)));
  }

  /**
   * Check if file is an image
   */
  isImage(file: File | Blob): boolean {
    if (file instanceof File) {
      return file.type.startsWith('image/');
    }
    // Blob type check
    return file.type.startsWith('image/');
  }

  /**
   * Load image from file/blob
   */
  private loadImage(file: File | Blob): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };

      img.src = url;
    });
  }

  /**
   * Calculate new dimensions maintaining aspect ratio
   */
  private calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth?: number,
    maxHeight?: number,
  ): { width: number; height: number } {
    let width = originalWidth;
    let height = originalHeight;

    // Apply max width constraint
    if (maxWidth && width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }

    // Apply max height constraint
    if (maxHeight && height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }

    return {
      width: Math.round(width),
      height: Math.round(height),
    };
  }

  /**
   * Compress image to blob with specified dimensions and quality
   */
  private compressToBlob(
    img: HTMLImageElement,
    width: number,
    height: number,
    quality: number,
    format: 'jpeg' | 'png' | 'webp',
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      // Draw image
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Use better image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        `image/${format}`,
        quality,
      );
    });
  }

  /**
   * Compress image to meet target file size
   * Uses binary search to find optimal quality
   */
  private async compressToSize(
    img: HTMLImageElement,
    width: number,
    height: number,
    maxSizeBytes: number,
    format: 'jpeg' | 'png' | 'webp',
  ): Promise<Blob> {
    let minQuality = 0.1;
    let maxQuality = 0.9;
    let bestBlob: Blob | null = null;

    // Binary search for optimal quality (max 10 iterations)
    for (let i = 0; i < 10; i++) {
      const quality = (minQuality + maxQuality) / 2;
      const blob = await this.compressToBlob(
        img,
        width,
        height,
        quality,
        format,
      );

      if (blob.size <= maxSizeBytes) {
        bestBlob = blob;
        minQuality = quality; // Try higher quality
      } else {
        maxQuality = quality; // Reduce quality
      }

      // If we're within 5% of target, accept it
      if (blob.size <= maxSizeBytes && blob.size >= maxSizeBytes * 0.95) {
        return blob;
      }
    }

    // If we couldn't meet size, return best attempt
    if (!bestBlob) {
      bestBlob = await this.compressToBlob(img, width, height, 0.1, format);
    }

    return bestBlob;
  }

  /**
   * Get compression statistics for display
   */
  getCompressionStats(result: CompressionResult): string {
    const savedBytes = result.originalSize - result.compressedSize;
    const savedPercent = ((1 - result.compressionRatio) * 100).toFixed(1);
    const originalMB = (result.originalSize / (1024 * 1024)).toFixed(2);
    const compressedMB = (result.compressedSize / (1024 * 1024)).toFixed(2);

    return `Compressed ${originalMB} MB → ${compressedMB} MB (${savedPercent}% reduction, saved ${(savedBytes / (1024 * 1024)).toFixed(2)} MB)`;
  }

  /**
   * Format file size to human-readable string
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }
}
