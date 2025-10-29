import { FastifyInstance } from 'fastify';
import {
  IStorageAdapter,
  IStorageAdapterFactory,
  StorageType,
  StorageConfiguration,
  ConfigurationError,
} from '../interfaces/storage-adapter.interface';
import {
  LocalStorageAdapter,
  LocalStorageConfig,
} from '../adapters/local-storage.adapter';
import {
  S3StorageAdapter,
  S3StorageConfig,
} from '../adapters/s3-storage.adapter';
import {
  MinIOStorageAdapter,
  MinIOStorageConfig,
} from '../adapters/minio-storage.adapter';

/**
 * Storage Adapter Factory
 *
 * Creates storage adapters based on configuration.
 * Supports multiple storage providers and can be extended for cloud providers.
 */
export class StorageAdapterFactory implements IStorageAdapterFactory {
  private static instance: StorageAdapterFactory;
  private adapters: Map<StorageType, IStorageAdapter> = new Map();

  constructor(private fastify?: FastifyInstance) {}

  static getInstance(fastify?: FastifyInstance): StorageAdapterFactory {
    if (!StorageAdapterFactory.instance) {
      StorageAdapterFactory.instance = new StorageAdapterFactory(fastify);
    }
    return StorageAdapterFactory.instance;
  }

  async create(config: StorageConfiguration): Promise<IStorageAdapter> {
    // Check if adapter already exists in cache
    const existingAdapter = this.adapters.get(config.type);
    if (existingAdapter) {
      return existingAdapter;
    }

    let adapter: IStorageAdapter;

    switch (config.type) {
      case StorageType.LOCAL:
        adapter = await this.createLocalAdapter(
          config.options as LocalStorageConfig,
        );
        break;

      case StorageType.AWS_S3:
        adapter = await this.createS3Adapter(config.options as S3StorageConfig);
        break;

      case StorageType.MINIO:
        adapter = await this.createMinIOAdapter(
          config.options as MinIOStorageConfig,
        );
        break;

      case StorageType.GOOGLE_CLOUD:
        throw new ConfigurationError(
          'Google Cloud Storage adapter not yet implemented. Coming soon!',
          StorageType.GOOGLE_CLOUD,
        );

      case StorageType.AZURE_BLOB:
        throw new ConfigurationError(
          'Azure Blob Storage adapter not yet implemented. Coming soon!',
          StorageType.AZURE_BLOB,
        );

      default:
        throw new ConfigurationError(
          `Unsupported storage type: ${config.type}`,
          config.type as StorageType,
        );
    }

    // Validate the adapter configuration
    await adapter.validateConfiguration();

    // Cache the adapter for reuse
    this.adapters.set(config.type, adapter);

    return adapter;
  }

  getSupportedTypes(): StorageType[] {
    return [
      StorageType.LOCAL,
      StorageType.AWS_S3,
      StorageType.MINIO,
      // Future implementations:
      // StorageType.GOOGLE_CLOUD,
      // StorageType.AZURE_BLOB,
    ];
  }

  /**
   * Get the default storage adapter (Local)
   */
  async getDefaultAdapter(): Promise<IStorageAdapter> {
    const defaultConfig: StorageConfiguration = {
      type: StorageType.LOCAL,
      options: {
        jwtSecret: process.env.JWT_SECRET || 'fallback-secret-for-development',
        baseUrl: process.env.BASE_URL || 'http://localhost:4200',
        defaultExpirySeconds: 3600,
        maxExpirySeconds: 86400,
      },
    };

    return this.create(defaultConfig);
  }

  /**
   * Clear cached adapters (useful for testing)
   */
  clearCache(): void {
    this.adapters.clear();
  }

  /**
   * Health check all cached adapters
   */
  async healthCheckAll(): Promise<Record<StorageType, boolean>> {
    const results: Record<StorageType, boolean> = {} as any;

    // Convert Map entries to array for iteration
    const entries = Array.from(this.adapters.entries());

    for (const [type, adapter] of entries) {
      try {
        results[type] = await adapter.healthCheck();
      } catch (error) {
        results[type] = false;
      }
    }

    return results;
  }

  /**
   * Create Local Storage Adapter
   */
  private async createLocalAdapter(
    config: LocalStorageConfig,
  ): Promise<LocalStorageAdapter> {
    // Validate required configuration
    if (!config.jwtSecret) {
      throw new ConfigurationError(
        'JWT secret is required for local storage adapter',
        StorageType.LOCAL,
      );
    }

    if (!config.baseUrl) {
      throw new ConfigurationError(
        'Base URL is required for local storage adapter',
        StorageType.LOCAL,
      );
    }

    // Set defaults
    const adapterConfig: LocalStorageConfig = {
      defaultExpirySeconds: 3600,
      maxExpirySeconds: 86400,
      ...config,
    };

    return new LocalStorageAdapter(adapterConfig, this.fastify);
  }

  /**
   * Create AWS S3 Adapter
   */
  private async createS3Adapter(
    config: S3StorageConfig,
  ): Promise<S3StorageAdapter> {
    // Validate required configuration
    if (!config.region) {
      throw new ConfigurationError(
        'AWS region is required for S3 storage adapter',
        StorageType.AWS_S3,
      );
    }

    if (!config.bucket) {
      throw new ConfigurationError(
        'S3 bucket is required for S3 storage adapter',
        StorageType.AWS_S3,
      );
    }

    if (!config.accessKeyId || !config.secretAccessKey) {
      throw new ConfigurationError(
        'AWS credentials are required for S3 storage adapter',
        StorageType.AWS_S3,
      );
    }

    return new S3StorageAdapter(config);
  }

  /**
   * Create MinIO Adapter
   */
  private async createMinIOAdapter(
    config: MinIOStorageConfig,
  ): Promise<MinIOStorageAdapter> {
    // Validate required configuration
    if (!config.endpoint) {
      throw new ConfigurationError(
        'MinIO endpoint is required for MinIO storage adapter',
        StorageType.MINIO,
      );
    }

    if (!config.bucket) {
      throw new ConfigurationError(
        'MinIO bucket is required for MinIO storage adapter',
        StorageType.MINIO,
      );
    }

    if (!config.accessKey || !config.secretKey) {
      throw new ConfigurationError(
        'MinIO credentials are required for MinIO storage adapter',
        StorageType.MINIO,
      );
    }

    return new MinIOStorageAdapter(config);
  }

  /**
   * Get adapter by type (if cached)
   */
  getAdapter(type: StorageType): IStorageAdapter | undefined {
    return this.adapters.get(type);
  }

  /**
   * Check if adapter type is supported
   */
  isSupported(type: StorageType): boolean {
    return this.getSupportedTypes().includes(type);
  }
}

/**
 * Global factory instance for easy access
 */
export const storageAdapterFactory = StorageAdapterFactory.getInstance();

/**
 * Re-export configuration types for convenience
 */
export type { LocalStorageConfig, S3StorageConfig, MinIOStorageConfig };

/**
 * Future storage provider configuration types
 */
export interface GoogleCloudStorageConfig {
  projectId: string;
  keyFilename?: string;
  bucket: string;
  credentials?: object;
}

export interface AzureBlobStorageConfig {
  accountName: string;
  accountKey: string;
  containerName: string;
  endpoint?: string;
}
