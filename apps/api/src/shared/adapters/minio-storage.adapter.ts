import * as Minio from 'minio';
import {
  IStorageAdapter,
  StorageType,
  FileMetadata,
  ViewUrlOptions,
  DownloadUrlOptions,
  ThumbnailUrlOptions,
  SignedUrlOptions,
  SignedUrlResult,
  UploadResult,
  ConfigurationError,
  AccessError,
  UploadError,
} from '../interfaces/storage-adapter.interface';

export interface MinIOStorageConfig {
  endpoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
  bucket: string;
  region?: string;
  defaultExpirySeconds?: number;
  maxExpirySeconds?: number;
}

/**
 * MinIO Storage Adapter
 *
 * Implements file storage using MinIO (S3-compatible object storage).
 * Supports self-hosted object storage with S3 API compatibility.
 */
export class MinIOStorageAdapter implements IStorageAdapter {
  private client: Minio.Client;
  private config: MinIOStorageConfig;

  constructor(config: MinIOStorageConfig) {
    this.config = {
      defaultExpirySeconds: 3600, // 1 hour
      maxExpirySeconds: 604800, // 7 days
      region: 'us-east-1', // Default region
      ...config,
    };

    this.client = new Minio.Client({
      endPoint: this.config.endpoint,
      port: this.config.port,
      useSSL: this.config.useSSL,
      accessKey: this.config.accessKey,
      secretKey: this.config.secretKey,
      region: this.config.region,
    });
  }

  async uploadFile(
    buffer: Buffer,
    key: string,
    metadata: Record<string, any> = {},
  ): Promise<UploadResult> {
    try {
      // Ensure bucket exists
      const bucketExists = await this.client.bucketExists(this.config.bucket);
      if (!bucketExists) {
        await this.client.makeBucket(this.config.bucket, this.config.region!);
      }

      // Upload file to MinIO
      await this.client.putObject(
        this.config.bucket,
        key,
        buffer,
        buffer.length,
        {
          'Content-Type': metadata.mimeType || 'application/octet-stream',
          ...this.sanitizeMetadata(metadata),
        },
      );

      return {
        storageKey: key,
        metadata: {
          storageType: StorageType.MINIO,
          bucket: this.config.bucket,
          endpoint: this.config.endpoint,
          fileSize: buffer.length,
          uploadedAt: new Date().toISOString(),
          ...metadata,
        },
      };
    } catch (error) {
      throw new UploadError(
        `Failed to upload file to MinIO: ${error.message}`,
        StorageType.MINIO,
        error,
      );
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      await this.client.removeObject(this.config.bucket, key);
    } catch (error) {
      throw new AccessError(
        `Failed to delete file from MinIO: ${error.message}`,
        StorageType.MINIO,
        error,
      );
    }
  }

  async generateViewUrl(
    fileKey: string,
    options: ViewUrlOptions = {},
  ): Promise<string> {
    try {
      const expiresIn = this.validateExpiryTime(options.expiresIn);

      // MinIO presigned GET URL
      return await this.client.presignedGetObject(
        this.config.bucket,
        fileKey,
        expiresIn,
      );
    } catch (error) {
      throw new AccessError(
        `Failed to generate view URL: ${error.message}`,
        StorageType.MINIO,
        error,
      );
    }
  }

  async generateDownloadUrl(
    fileKey: string,
    options: DownloadUrlOptions = {},
  ): Promise<string> {
    try {
      const expiresIn = this.validateExpiryTime(options.expiresIn);

      // MinIO presigned GET URL with Content-Disposition header
      const respHeaders: Record<string, string> = {
        'response-content-disposition': options.inline
          ? 'inline'
          : 'attachment',
      };

      return await this.client.presignedGetObject(
        this.config.bucket,
        fileKey,
        expiresIn,
        respHeaders,
      );
    } catch (error) {
      throw new AccessError(
        `Failed to generate download URL: ${error.message}`,
        StorageType.MINIO,
        error,
      );
    }
  }

  async generateThumbnailUrl(
    fileKey: string,
    options: ThumbnailUrlOptions = {},
  ): Promise<string> {
    try {
      const expiresIn = this.validateExpiryTime(options.expiresIn);

      // For thumbnails, try to access _thumb variant first
      const thumbKey = this.getThumbnailKey(fileKey, options.size);

      return await this.client.presignedGetObject(
        this.config.bucket,
        thumbKey,
        expiresIn,
      );
    } catch (error) {
      throw new AccessError(
        `Failed to generate thumbnail URL: ${error.message}`,
        StorageType.MINIO,
        error,
      );
    }
  }

  async generateMultipleUrls(
    fileMetadata: FileMetadata,
    options: SignedUrlOptions = {},
  ): Promise<SignedUrlResult> {
    try {
      const expiresIn = this.validateExpiryTime(options.expiresIn);
      const expiresAt = new Date(Date.now() + expiresIn * 1000);

      // Generate all URLs in parallel
      const [viewUrl, downloadUrl, thumbnailUrl] = await Promise.all([
        this.generateViewUrl(fileMetadata.storageKey, { expiresIn }),
        this.generateDownloadUrl(fileMetadata.storageKey, { expiresIn }),
        this.generateThumbnailUrl(fileMetadata.storageKey, {
          ...options.thumbnailOptions,
          expiresIn,
        }),
      ]);

      return {
        urls: {
          view: viewUrl,
          download: downloadUrl,
          thumbnail: thumbnailUrl,
        },
        expiresAt,
        metadata: {
          storageType: StorageType.MINIO,
          bucket: this.config.bucket,
          endpoint: this.config.endpoint,
        },
      };
    } catch (error) {
      throw new AccessError(
        `Failed to generate multiple URLs: ${error.message}`,
        StorageType.MINIO,
        error,
      );
    }
  }

  getStorageType(): StorageType {
    return StorageType.MINIO;
  }

  async validateConfiguration(): Promise<boolean> {
    try {
      // Test MinIO access by checking if bucket exists
      const bucketExists = await this.client.bucketExists(this.config.bucket);

      if (!bucketExists) {
        throw new ConfigurationError(
          `Bucket ${this.config.bucket} does not exist`,
          StorageType.MINIO,
        );
      }

      return true;
    } catch (error) {
      throw new ConfigurationError(
        `MinIO configuration validation failed: ${error.message}`,
        StorageType.MINIO,
        error,
      );
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.validateConfiguration();
      return true;
    } catch (error) {
      return false;
    }
  }

  getProviderInfo() {
    return {
      type: StorageType.MINIO,
      version: '1.0.0',
      endpoint: this.config.endpoint,
      bucket: this.config.bucket,
      port: this.config.port,
      useSSL: this.config.useSSL,
    };
  }

  /**
   * Sanitize metadata for MinIO (must be strings)
   */
  private sanitizeMetadata(
    metadata: Record<string, any>,
  ): Record<string, string> {
    const sanitized: Record<string, string> = {};

    for (const [key, value] of Object.entries(metadata)) {
      if (typeof value === 'string') {
        sanitized[key] = value;
      } else if (value !== null && value !== undefined) {
        sanitized[key] = String(value);
      }
    }

    return sanitized;
  }

  /**
   * Get thumbnail key based on original file key
   */
  private getThumbnailKey(fileKey: string, size?: string): string {
    // If size is specified, use it in the path
    if (size) {
      const parts = fileKey.split('/');
      const filename = parts.pop()!;
      const basePath = parts.join('/');
      return `${basePath}/variants/${filename}_${size}`;
    }

    // Default thumbnail key
    const parts = fileKey.split('/');
    const filename = parts.pop()!;
    const basePath = parts.join('/');
    return `${basePath}/variants/${filename}_thumbnail`;
  }

  /**
   * Validate and normalize expiry time
   */
  private validateExpiryTime(expiresIn?: number): number {
    if (!expiresIn) {
      return this.config.defaultExpirySeconds!;
    }

    if (expiresIn < 300) {
      // Minimum 5 minutes
      return 300;
    }

    if (expiresIn > this.config.maxExpirySeconds!) {
      return this.config.maxExpirySeconds!;
    }

    return expiresIn;
  }
}
