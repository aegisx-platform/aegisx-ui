import { FastifyInstance } from 'fastify';
import { IStorageAdapter } from '../../../shared/interfaces/storage-adapter.interface';

/**
 * Cleanup Task Type
 */
export enum CleanupTask {
  EXPIRED_FILES = 'expired_files', // Temporary files past expiration
  SOFT_DELETED = 'soft_deleted', // Soft-deleted files past retention
  ORPHANED_FILES = 'orphaned_files', // Files without database entries
  ORPHANED_RECORDS = 'orphaned_records', // Database entries without files
  FAILED_UPLOADS = 'failed_uploads', // Incomplete/failed uploads
  OLD_VARIANTS = 'old_variants', // Unused image variants
}

/**
 * Cleanup Result
 */
export interface CleanupResult {
  task: CleanupTask;
  startedAt: Date;
  completedAt: Date;
  duration: number; // ms
  filesScanned: number;
  filesDeleted: number;
  spaceFreed: number; // bytes
  errors: Array<{
    fileId?: string;
    path?: string;
    error: string;
  }>;
  success: boolean;
}

/**
 * Cleanup Configuration
 */
export interface CleanupConfig {
  // Retention periods (in days)
  expiredFileRetention: number; // How long to keep expired temp files
  softDeletedRetention: number; // How long to keep soft-deleted files
  failedUploadRetention: number; // How long to keep failed uploads
  oldVariantRetention: number; // How long to keep unused variants

  // Batch sizes for database queries
  batchSize: number;

  // Dry run mode (don't actually delete)
  dryRun: boolean;
}

/**
 * Cleanup Schedule
 */
export interface CleanupSchedule {
  task: CleanupTask;
  cronExpression: string; // e.g., "0 2 * * *" for daily at 2 AM
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
}

/**
 * FileCleanupService
 *
 * Provides automated and manual file cleanup operations.
 *
 * Features:
 * - Auto-delete expired temporary files
 * - Clean up soft-deleted files after retention period
 * - Remove orphaned files (physical files without DB entries)
 * - Remove orphaned records (DB entries without physical files)
 * - Clean up failed/incomplete uploads
 * - Remove unused image variants
 * - Scheduled cleanup jobs
 * - Dry-run mode for safe testing
 * - Comprehensive cleanup statistics
 *
 * Use Cases:
 * - Automated maintenance (scheduled cleanup)
 * - Storage space management
 * - Data consistency (orphaned file cleanup)
 * - Compliance (retention policy enforcement)
 * - Cost optimization (cloud storage cleanup)
 *
 * Example Usage:
 * ```typescript
 * const service = new FileCleanupService(fastify, storageAdapter);
 *
 * // Manual cleanup of expired files
 * const result = await service.cleanupExpiredFiles();
 *
 * // Cleanup soft-deleted files (30-day retention)
 * const result = await service.cleanupSoftDeletedFiles(30);
 *
 * // Dry run to preview cleanup
 * service.setConfig({ dryRun: true });
 * const preview = await service.cleanupAll();
 *
 * // Schedule automatic cleanup
 * await service.scheduleCleanup(CleanupTask.EXPIRED_FILES, "0 2 * * *");
 * ```
 */
export class FileCleanupService {
  private config: CleanupConfig = {
    expiredFileRetention: 1, // 1 day for expired temp files
    softDeletedRetention: 30, // 30 days for soft-deleted
    failedUploadRetention: 7, // 7 days for failed uploads
    oldVariantRetention: 90, // 90 days for unused variants
    batchSize: 100,
    dryRun: false,
  };

  private schedules: Map<CleanupTask, CleanupSchedule> = new Map();

  constructor(
    private fastify?: FastifyInstance,
    private storageAdapter?: IStorageAdapter,
  ) {}

  /**
   * Set cleanup configuration
   */
  setConfig(config: Partial<CleanupConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): CleanupConfig {
    return { ...this.config };
  }

  /**
   * Clean up expired temporary files
   *
   * Deletes files that have passed their expiration date.
   */
  async cleanupExpiredFiles(): Promise<CleanupResult> {
    const startedAt = new Date();
    const startTime = Date.now();

    this.log('info', 'Starting cleanup: Expired files');

    const result: CleanupResult = {
      task: CleanupTask.EXPIRED_FILES,
      startedAt,
      completedAt: new Date(),
      duration: 0,
      filesScanned: 0,
      filesDeleted: 0,
      spaceFreed: 0,
      errors: [],
      success: true,
    };

    try {
      // TODO: Query database for expired files
      // const expiredFiles = await this.findExpiredFiles();
      const expiredFiles: any[] = []; // Placeholder

      result.filesScanned = expiredFiles.length;

      for (const file of expiredFiles) {
        try {
          if (!this.config.dryRun) {
            // Delete from storage
            await this.storageAdapter?.deleteFile(file.storageKey);

            // Delete from database (hard delete)
            // await this.deleteFileFromDatabase(file.id);

            result.filesDeleted++;
            result.spaceFreed += file.fileSize || 0;
          }
        } catch (error: any) {
          result.errors.push({
            fileId: file.id,
            error: error.message,
          });
        }
      }

      result.success = result.errors.length === 0;
    } catch (error: any) {
      result.success = false;
      result.errors.push({
        error: `Cleanup failed: ${error.message}`,
      });
    }

    result.completedAt = new Date();
    result.duration = Date.now() - startTime;

    this.log(
      'info',
      `Cleanup completed: ${result.filesDeleted}/${result.filesScanned} files deleted`,
    );

    return result;
  }

  /**
   * Clean up soft-deleted files
   *
   * Permanently deletes files that have been soft-deleted for longer than retention period.
   *
   * @param retentionDays - Number of days to retain soft-deleted files
   */
  async cleanupSoftDeletedFiles(
    retentionDays?: number,
  ): Promise<CleanupResult> {
    const retention = retentionDays ?? this.config.softDeletedRetention;
    // TODO: Use cutoffDate when implementing database query
    // const cutoffDate = new Date(Date.now() - retention * 24 * 60 * 60 * 1000);

    const startedAt = new Date();
    const startTime = Date.now();

    this.log(
      'info',
      `Starting cleanup: Soft-deleted files (${retention} days retention)`,
    );

    const result: CleanupResult = {
      task: CleanupTask.SOFT_DELETED,
      startedAt,
      completedAt: new Date(),
      duration: 0,
      filesScanned: 0,
      filesDeleted: 0,
      spaceFreed: 0,
      errors: [],
      success: true,
    };

    try {
      // TODO: Query database for soft-deleted files older than cutoff
      // const softDeletedFiles = await this.findSoftDeletedFiles(cutoffDate);
      const softDeletedFiles: any[] = []; // Placeholder

      result.filesScanned = softDeletedFiles.length;

      for (const file of softDeletedFiles) {
        try {
          if (!this.config.dryRun) {
            // Delete from storage
            await this.storageAdapter?.deleteFile(file.storageKey);

            // Delete variants if any
            if (file.variants) {
              for (const variant of file.variants) {
                await this.storageAdapter?.deleteFile(variant.storageKey);
              }
            }

            // Delete from database (hard delete)
            // await this.deleteFileFromDatabase(file.id);

            result.filesDeleted++;
            result.spaceFreed += file.fileSize || 0;
          }
        } catch (error: any) {
          result.errors.push({
            fileId: file.id,
            error: error.message,
          });
        }
      }

      result.success = result.errors.length === 0;
    } catch (error: any) {
      result.success = false;
      result.errors.push({
        error: `Cleanup failed: ${error.message}`,
      });
    }

    result.completedAt = new Date();
    result.duration = Date.now() - startTime;

    this.log(
      'info',
      `Cleanup completed: ${result.filesDeleted}/${result.filesScanned} files deleted`,
    );

    return result;
  }

  /**
   * Clean up orphaned files
   *
   * Removes physical files that don't have corresponding database entries.
   */
  async cleanupOrphanedFiles(): Promise<CleanupResult> {
    const startedAt = new Date();
    const startTime = Date.now();

    this.log('info', 'Starting cleanup: Orphaned files');

    const result: CleanupResult = {
      task: CleanupTask.ORPHANED_FILES,
      startedAt,
      completedAt: new Date(),
      duration: 0,
      filesScanned: 0,
      filesDeleted: 0,
      spaceFreed: 0,
      errors: [],
      success: true,
    };

    try {
      // TODO: Implement orphaned file detection
      // 1. List all physical files from storage
      // 2. Query database for corresponding entries
      // 3. Delete files without database entries

      // This requires storage adapter support for listing files
      // Not all adapters (S3, MinIO) efficiently support this

      result.success = true;
    } catch (error: any) {
      result.success = false;
      result.errors.push({
        error: `Cleanup failed: ${error.message}`,
      });
    }

    result.completedAt = new Date();
    result.duration = Date.now() - startTime;

    return result;
  }

  /**
   * Clean up orphaned database records
   *
   * Removes database entries that don't have corresponding physical files.
   */
  async cleanupOrphanedRecords(): Promise<CleanupResult> {
    const startedAt = new Date();
    const startTime = Date.now();

    this.log('info', 'Starting cleanup: Orphaned database records');

    const result: CleanupResult = {
      task: CleanupTask.ORPHANED_RECORDS,
      startedAt,
      completedAt: new Date(),
      duration: 0,
      filesScanned: 0,
      filesDeleted: 0,
      spaceFreed: 0,
      errors: [],
      success: true,
    };

    try {
      // TODO: Implement orphaned record detection
      // 1. Query all file records from database
      // 2. Check if physical files exist in storage
      // 3. Delete records without physical files

      result.success = true;
    } catch (error: any) {
      result.success = false;
      result.errors.push({
        error: `Cleanup failed: ${error.message}`,
      });
    }

    result.completedAt = new Date();
    result.duration = Date.now() - startTime;

    return result;
  }

  /**
   * Clean up failed uploads
   *
   * Removes incomplete/failed upload records and files.
   */
  async cleanupFailedUploads(): Promise<CleanupResult> {
    const retention = this.config.failedUploadRetention;
    // TODO: Use cutoffDate when implementing database query
    // const cutoffDate = new Date(Date.now() - retention * 24 * 60 * 60 * 1000);

    const startedAt = new Date();
    const startTime = Date.now();

    this.log(
      'info',
      `Starting cleanup: Failed uploads (${retention} days retention)`,
    );

    const result: CleanupResult = {
      task: CleanupTask.FAILED_UPLOADS,
      startedAt,
      completedAt: new Date(),
      duration: 0,
      filesScanned: 0,
      filesDeleted: 0,
      spaceFreed: 0,
      errors: [],
      success: true,
    };

    try {
      // TODO: Query database for failed upload records older than cutoff
      // const failedUploads = await this.findFailedUploads(cutoffDate);

      result.success = true;
    } catch (error: any) {
      result.success = false;
      result.errors.push({
        error: `Cleanup failed: ${error.message}`,
      });
    }

    result.completedAt = new Date();
    result.duration = Date.now() - startTime;

    return result;
  }

  /**
   * Clean up old/unused image variants
   *
   * Removes image variants that haven't been accessed for a long time.
   */
  async cleanupOldVariants(): Promise<CleanupResult> {
    const retention = this.config.oldVariantRetention;
    // TODO: Use cutoffDate when implementing database query
    // const cutoffDate = new Date(Date.now() - retention * 24 * 60 * 60 * 1000);

    const startedAt = new Date();
    const startTime = Date.now();

    this.log(
      'info',
      `Starting cleanup: Old variants (${retention} days retention)`,
    );

    const result: CleanupResult = {
      task: CleanupTask.OLD_VARIANTS,
      startedAt,
      completedAt: new Date(),
      duration: 0,
      filesScanned: 0,
      filesDeleted: 0,
      spaceFreed: 0,
      errors: [],
      success: true,
    };

    try {
      // TODO: Query database for variants not accessed since cutoff
      // const oldVariants = await this.findOldVariants(cutoffDate);

      result.success = true;
    } catch (error: any) {
      result.success = false;
      result.errors.push({
        error: `Cleanup failed: ${error.message}`,
      });
    }

    result.completedAt = new Date();
    result.duration = Date.now() - startTime;

    return result;
  }

  /**
   * Run all cleanup tasks
   *
   * @returns Combined cleanup results
   */
  async cleanupAll(): Promise<CleanupResult[]> {
    this.log('info', 'Starting comprehensive cleanup (all tasks)');

    const results: CleanupResult[] = [];

    results.push(await this.cleanupExpiredFiles());
    results.push(await this.cleanupSoftDeletedFiles());
    results.push(await this.cleanupFailedUploads());
    results.push(await this.cleanupOldVariants());
    results.push(await this.cleanupOrphanedRecords());

    const totalDeleted = results.reduce((sum, r) => sum + r.filesDeleted, 0);
    const totalFreed = results.reduce((sum, r) => sum + r.spaceFreed, 0);

    this.log(
      'info',
      `Comprehensive cleanup completed: ${totalDeleted} files, ${this.formatBytes(totalFreed)} freed`,
    );

    return results;
  }

  /**
   * Schedule automatic cleanup
   *
   * @param task - Cleanup task to schedule
   * @param cronExpression - Cron expression (e.g., "0 2 * * *" for daily at 2 AM)
   */
  async scheduleCleanup(
    task: CleanupTask,
    cronExpression: string,
  ): Promise<void> {
    const schedule: CleanupSchedule = {
      task,
      cronExpression,
      enabled: true,
    };

    this.schedules.set(task, schedule);

    // TODO: Implement actual cron scheduling
    // Use a library like node-cron or bull for job scheduling

    this.log(
      'info',
      `Scheduled cleanup: ${task} with cron "${cronExpression}"`,
    );
  }

  /**
   * Unschedule cleanup task
   */
  async unscheduleCleanup(task: CleanupTask): Promise<void> {
    this.schedules.delete(task);
    this.log('info', `Unscheduled cleanup: ${task}`);
  }

  /**
   * Get all scheduled cleanups
   */
  getSchedules(): CleanupSchedule[] {
    return Array.from(this.schedules.values());
  }

  /**
   * Get cleanup statistics
   *
   * @param startDate - Start date for statistics
   * @param endDate - End date for statistics
   */
  async getCleanupStats(
    _startDate: Date,
    _endDate: Date,
  ): Promise<{
    totalRuns: number;
    totalFilesDeleted: number;
    totalSpaceFreed: number;
    taskStats: Record<
      CleanupTask,
      { runs: number; deleted: number; freed: number }
    >;
  }> {
    // TODO: Query cleanup history from database
    // Return aggregated statistics

    return {
      totalRuns: 0,
      totalFilesDeleted: 0,
      totalSpaceFreed: 0,
      taskStats: {} as Record<
        CleanupTask,
        { runs: number; deleted: number; freed: number }
      >,
    };
  }

  /**
   * Log message
   */
  private log(level: 'info' | 'warn' | 'error', message: string): void {
    if (this.fastify) {
      this.fastify.log[level](message);
    } else {
      console.log(`[${level.toUpperCase()}] ${message}`);
    }
  }

  /**
   * Format bytes to human-readable string
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }
}
