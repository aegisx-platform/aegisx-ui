import { FastifyInstance } from 'fastify';
import { Knex } from 'knex';
import { createHash } from 'crypto';

/**
 * Error Log Entry Interface
 * Matches the error_logs table schema
 */
export interface ErrorLogEntry {
  id?: string;
  timestamp: Date;
  level: 'error' | 'warn' | 'info';
  message: string;
  url?: string;
  stack?: string;
  context?: Record<string, any>;
  type: 'javascript' | 'http' | 'angular' | 'custom' | 'backend' | 'system';
  user_id?: string;
  session_id?: string;
  user_agent?: string;
  correlation_id?: string;
  ip_address?: string;
  referer?: string;
}

/**
 * Error Queue Statistics
 */
export interface ErrorQueueStats {
  queueSize: number;
  totalEnqueued: number;
  totalFlushed: number;
  totalDropped: number;
  flushCount: number;
  lastFlushTime: Date | null;
  lastFlushSize: number;
}

/**
 * Error signature for deduplication
 */
interface ErrorSignatureEntry {
  count: number;
  lastSeen: Date;
  firstSeen: Date;
}

/**
 * Error Queue Configuration
 */
export interface ErrorQueueConfig {
  batchSize: number;
  flushIntervalMs: number;
  maxQueueSize: number;
  enableRateLimiting: boolean;
  maxSameErrorPerMinute: number;
  samplingThreshold: number;
  samplingRate: number; // 1 in N after threshold
}

/**
 * Error Queue Service
 *
 * High-performance, non-blocking error logging service with:
 * - Batch processing for optimal database performance
 * - Error deduplication and rate limiting
 * - Automatic periodic flushing
 * - Graceful shutdown handling
 * - Zero overhead on request processing
 *
 * @example
 * ```typescript
 * // Non-blocking enqueue (fire-and-forget)
 * fastify.errorQueue.enqueue({
 *   timestamp: new Date(),
 *   level: 'error',
 *   message: 'Something went wrong',
 *   type: 'backend',
 * });
 * ```
 */
export class ErrorQueueService {
  private queue: ErrorLogEntry[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private isShuttingDown = false;

  // Statistics
  private stats: ErrorQueueStats = {
    queueSize: 0,
    totalEnqueued: 0,
    totalFlushed: 0,
    totalDropped: 0,
    flushCount: 0,
    lastFlushTime: null,
    lastFlushSize: 0,
  };

  // Error rate limiting
  private errorSignatures = new Map<string, ErrorSignatureEntry>();
  private signatureCleanupTimer: NodeJS.Timeout | null = null;

  private readonly config: ErrorQueueConfig;

  constructor(
    private readonly fastify: FastifyInstance,
    private readonly knex: Knex,
    config?: Partial<ErrorQueueConfig>,
  ) {
    // Default configuration
    this.config = {
      batchSize: Number(process.env.ERROR_QUEUE_BATCH_SIZE) || 50,
      flushIntervalMs: Number(process.env.ERROR_QUEUE_FLUSH_INTERVAL) || 5000,
      maxQueueSize: Number(process.env.ERROR_QUEUE_MAX_SIZE) || 500,
      enableRateLimiting: process.env.ERROR_SAMPLING_ENABLED !== 'false',
      maxSameErrorPerMinute: Number(process.env.ERROR_SAMPLING_THRESHOLD) || 10,
      samplingThreshold: 10,
      samplingRate: 10, // 1 in 10
      ...config,
    };

    this.startAutoFlush();
    this.setupShutdownHook();
    this.startSignatureCleanup();

    this.fastify.log.info(
      {
        batchSize: this.config.batchSize,
        flushInterval: this.config.flushIntervalMs,
        maxQueueSize: this.config.maxQueueSize,
      },
      'Error Queue Service initialized',
    );
  }

  /**
   * Enqueue an error for logging (non-blocking, fire-and-forget)
   *
   * This method is designed to have ZERO impact on request processing:
   * - Synchronous operation (no await)
   * - In-memory queue (fast)
   * - Returns immediately
   *
   * @param error - Error log entry
   */
  enqueue(error: ErrorLogEntry): void {
    try {
      // Check if shutting down
      if (this.isShuttingDown) {
        this.fastify.log.warn('Error queue is shutting down, dropping error');
        this.stats.totalDropped++;
        return;
      }

      // Check queue size limit
      if (this.queue.length >= this.config.maxQueueSize) {
        this.fastify.log.warn(
          { queueSize: this.queue.length },
          'Error queue is full, dropping oldest error',
        );
        this.queue.shift(); // Drop oldest error
        this.stats.totalDropped++;
      }

      // Rate limiting check (if enabled)
      if (this.config.enableRateLimiting && !this.shouldLogError(error)) {
        this.stats.totalDropped++;
        return;
      }

      // Generate UUID if not provided
      if (!error.id) {
        error.id = this.generateUUID();
      }

      // Add to queue
      this.queue.push(error);
      this.stats.totalEnqueued++;
      this.stats.queueSize = this.queue.length;

      // Force flush if batch size reached (async, non-blocking)
      if (this.queue.length >= this.config.batchSize) {
        // Use setImmediate to avoid blocking
        setImmediate(() => {
          this.flush().catch((err) => {
            this.fastify.log.error(
              { error: err.message },
              'Failed to flush error queue',
            );
          });
        });
      }
    } catch (err: any) {
      // Never throw errors from enqueue (fail silently)
      this.fastify.log.error(
        { error: err.message },
        'Error in error queue enqueue',
      );
    }
  }

  /**
   * Force flush errors to database
   *
   * @returns Number of errors flushed
   */
  async flush(): Promise<number> {
    if (this.queue.length === 0) {
      return 0;
    }

    const batch = this.queue.splice(0, this.config.batchSize);
    const batchSize = batch.length;

    try {
      // Bulk insert with ON CONFLICT IGNORE for idempotency
      await this.knex('error_logs')
        .insert(
          batch.map((error) => ({
            id: error.id,
            timestamp: error.timestamp,
            level: error.level,
            message: error.message.substring(0, 10000), // Prevent huge messages
            url: error.url?.substring(0, 2048),
            stack: error.stack?.substring(0, 10000),
            context: error.context ? JSON.stringify(error.context) : null,
            type: error.type,
            user_id: error.user_id,
            session_id: error.session_id,
            user_agent: error.user_agent?.substring(0, 512),
            correlation_id: error.correlation_id,
            ip_address: error.ip_address,
            referer: error.referer?.substring(0, 2048),
            server_timestamp: new Date(),
            created_at: new Date(),
            updated_at: new Date(),
          })),
        )
        .onConflict('id')
        .ignore(); // Idempotent (safe to retry)

      // Update statistics
      this.stats.totalFlushed += batchSize;
      this.stats.flushCount++;
      this.stats.lastFlushTime = new Date();
      this.stats.lastFlushSize = batchSize;
      this.stats.queueSize = this.queue.length;

      this.fastify.log.debug(
        { flushed: batchSize, remaining: this.queue.length },
        'Error queue flushed',
      );

      return batchSize;
    } catch (err: any) {
      // On failure, put batch back at front of queue
      this.queue.unshift(...batch);
      this.fastify.log.error(
        {
          error: err.message,
          batchSize,
          queueSize: this.queue.length,
        },
        'Failed to flush error queue to database',
      );
      throw err;
    }
  }

  /**
   * Get queue statistics
   */
  getStats(): ErrorQueueStats {
    return {
      ...this.stats,
      queueSize: this.queue.length,
    };
  }

  /**
   * Graceful shutdown - flush all pending errors
   */
  async shutdown(): Promise<void> {
    this.isShuttingDown = true;

    this.fastify.log.info(
      { queueSize: this.queue.length },
      'Shutting down error queue service',
    );

    // Stop timers
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }

    if (this.signatureCleanupTimer) {
      clearInterval(this.signatureCleanupTimer);
      this.signatureCleanupTimer = null;
    }

    // Flush all remaining errors
    let totalFlushed = 0;
    while (this.queue.length > 0) {
      const flushed = await this.flush();
      totalFlushed += flushed;
    }

    this.fastify.log.info(
      { totalFlushed },
      'Error queue service shutdown complete',
    );
  }

  /**
   * Start automatic periodic flushing
   */
  private startAutoFlush(): void {
    this.flushTimer = setInterval(() => {
      if (this.queue.length > 0) {
        this.flush().catch((err) => {
          this.fastify.log.error({ error: err.message }, 'Auto-flush failed');
        });
      }
    }, this.config.flushIntervalMs);

    // Prevent timer from keeping process alive
    this.flushTimer.unref?.();
  }

  /**
   * Setup graceful shutdown hook
   */
  private setupShutdownHook(): void {
    this.fastify.addHook('onClose', async () => {
      await this.shutdown();
    });
  }

  /**
   * Start periodic cleanup of error signatures map
   * (Prevent memory leak from unbounded map growth)
   */
  private startSignatureCleanup(): void {
    this.signatureCleanupTimer = setInterval(
      () => {
        const now = new Date();
        const cutoff = new Date(now.getTime() - 5 * 60 * 1000); // 5 minutes

        for (const [signature, entry] of this.errorSignatures.entries()) {
          if (entry.lastSeen < cutoff) {
            this.errorSignatures.delete(signature);
          }
        }

        this.fastify.log.debug(
          { signatures: this.errorSignatures.size },
          'Cleaned up error signatures',
        );
      },
      5 * 60 * 1000,
    ); // Every 5 minutes

    this.signatureCleanupTimer.unref?.();
  }

  /**
   * Check if error should be logged (rate limiting & sampling)
   *
   * @param error - Error to check
   * @returns true if should log, false if should drop
   */
  private shouldLogError(error: ErrorLogEntry): boolean {
    const signature = this.getErrorSignature(error);
    const now = new Date();

    const entry = this.errorSignatures.get(signature);

    if (!entry) {
      // First occurrence - always log
      this.errorSignatures.set(signature, {
        count: 1,
        lastSeen: now,
        firstSeen: now,
      });
      return true;
    }

    // Check if 1 minute has passed since first occurrence
    const minutesAgo = (now.getTime() - entry.firstSeen.getTime()) / 60000;

    if (minutesAgo >= 1) {
      // Reset counter after 1 minute
      entry.count = 1;
      entry.firstSeen = now;
      entry.lastSeen = now;
      return true;
    }

    // Increment counter
    entry.count++;
    entry.lastSeen = now;

    // Check threshold
    if (entry.count <= this.config.maxSameErrorPerMinute) {
      return true;
    }

    // After threshold, use sampling (1 in N)
    const shouldSample = entry.count % this.config.samplingRate === 0;

    if (shouldSample) {
      this.fastify.log.debug(
        {
          signature: signature.substring(0, 16),
          count: entry.count,
          sampled: true,
        },
        'Sampling high-frequency error',
      );
    }

    return shouldSample;
  }

  /**
   * Generate error signature for deduplication
   * Hash of: message + first 3 lines of stack trace
   *
   * @param error - Error to generate signature for
   * @returns 16-character hex signature
   */
  private getErrorSignature(error: ErrorLogEntry): string {
    const stackLines = error.stack?.split('\n').slice(0, 3).join('\n') || '';
    const signatureInput = error.message + stackLines + error.type;

    return createHash('sha256')
      .update(signatureInput)
      .digest('hex')
      .substring(0, 16);
  }

  /**
   * Generate UUID v4
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}

/**
 * Create and initialize error queue service
 */
export function createErrorQueueService(
  fastify: FastifyInstance,
  config?: Partial<ErrorQueueConfig>,
): ErrorQueueService {
  return new ErrorQueueService(fastify, fastify.knex, config);
}
