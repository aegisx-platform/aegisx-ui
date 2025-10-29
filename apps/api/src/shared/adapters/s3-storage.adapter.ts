import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
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

export interface S3StorageConfig {
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  endpoint?: string; // For S3-compatible services (e.g., LocalStack)
  forcePathStyle?: boolean; // Required for some S3-compatible services
  defaultExpirySeconds?: number;
  maxExpirySeconds?: number;
}

/**
 * AWS S3 Storage Adapter
 *
 * Implements file storage using Amazon S3 with presigned URLs.
 * Supports encryption, versioning, and lifecycle policies.
 */
export class S3StorageAdapter implements IStorageAdapter {
  private client: S3Client;
  private config: S3StorageConfig;

  constructor(config: S3StorageConfig) {
    this.config = {
      defaultExpirySeconds: 3600, // 1 hour
      maxExpirySeconds: 604800, // 7 days (S3 presigned URL max)
      ...config,
    };

    this.client = new S3Client({
      region: this.config.region,
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      },
      endpoint: this.config.endpoint,
      forcePathStyle: this.config.forcePathStyle,
    });
  }

  async uploadFile(
    buffer: Buffer,
    key: string,
    metadata: Record<string, any> = {},
  ): Promise<UploadResult> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
        Body: buffer,
        Metadata: this.sanitizeMetadata(metadata),
        ContentType: metadata.mimeType || 'application/octet-stream',
        // Server-side encryption (optional)
        ServerSideEncryption: 'AES256',
      });

      await this.client.send(command);

      return {
        storageKey: key,
        metadata: {
          storageType: StorageType.AWS_S3,
          bucket: this.config.bucket,
          region: this.config.region,
          fileSize: buffer.length,
          uploadedAt: new Date().toISOString(),
          ...metadata,
        },
      };
    } catch (error) {
      throw new UploadError(
        `Failed to upload file to S3: ${error.message}`,
        StorageType.AWS_S3,
        error,
      );
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
      });

      await this.client.send(command);
    } catch (error) {
      throw new AccessError(
        `Failed to delete file from S3: ${error.message}`,
        StorageType.AWS_S3,
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

      const command = new GetObjectCommand({
        Bucket: this.config.bucket,
        Key: fileKey,
        ResponseContentDisposition: 'inline',
      });

      return await getSignedUrl(this.client, command, { expiresIn });
    } catch (error) {
      throw new AccessError(
        `Failed to generate view URL: ${error.message}`,
        StorageType.AWS_S3,
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

      const command = new GetObjectCommand({
        Bucket: this.config.bucket,
        Key: fileKey,
        ResponseContentDisposition: options.inline ? 'inline' : 'attachment',
      });

      return await getSignedUrl(this.client, command, { expiresIn });
    } catch (error) {
      throw new AccessError(
        `Failed to generate download URL: ${error.message}`,
        StorageType.AWS_S3,
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

      const command = new GetObjectCommand({
        Bucket: this.config.bucket,
        Key: thumbKey,
      });

      return await getSignedUrl(this.client, command, { expiresIn });
    } catch (error) {
      throw new AccessError(
        `Failed to generate thumbnail URL: ${error.message}`,
        StorageType.AWS_S3,
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
          storageType: StorageType.AWS_S3,
          bucket: this.config.bucket,
          region: this.config.region,
        },
      };
    } catch (error) {
      throw new AccessError(
        `Failed to generate multiple URLs: ${error.message}`,
        StorageType.AWS_S3,
        error,
      );
    }
  }

  getStorageType(): StorageType {
    return StorageType.AWS_S3;
  }

  async validateConfiguration(): Promise<boolean> {
    try {
      // Test S3 access by checking if bucket exists
      const command = new HeadObjectCommand({
        Bucket: this.config.bucket,
        Key: '_health_check_test',
      });

      try {
        await this.client.send(command);
      } catch (error) {
        // 404 is OK - just means test object doesn't exist
        if (error.name !== 'NotFound') {
          throw error;
        }
      }

      return true;
    } catch (error) {
      throw new ConfigurationError(
        `S3 configuration validation failed: ${error.message}`,
        StorageType.AWS_S3,
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
      type: StorageType.AWS_S3,
      version: '1.0.0',
      region: this.config.region,
      bucket: this.config.bucket,
      endpoint: this.config.endpoint,
    };
  }

  /**
   * Sanitize metadata for S3 (must be strings)
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
