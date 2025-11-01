import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';

/**
 * Global Error Hooks Plugin
 *
 * Captures process-level errors that escape the Fastify error handler:
 * - uncaughtException: Synchronous errors not caught by try/catch
 * - unhandledRejection: Async errors (promises) without .catch()
 *
 * These errors are logged to the error queue and the database for monitoring.
 *
 * ⚠️ CRITICAL: uncaughtException requires process restart for safety.
 * After logging, the process will gracefully shutdown.
 *
 * @example
 * // These errors will be caught and logged:
 * throw new Error('Sync error');  // uncaughtException
 * Promise.reject('Async error');  // unhandledRejection
 */
async function globalErrorHooksPlugin(fastify: FastifyInstance) {
  /**
   * Handle uncaught exceptions (synchronous errors)
   *
   * According to Node.js docs, the process is in an undefined state after
   * an uncaughtException. We MUST exit gracefully.
   *
   * @see https://nodejs.org/api/process.html#event-uncaughtexception
   */
  const uncaughtExceptionHandler = (error: Error) => {
    // Log to Fastify logger (critical level)
    fastify.log.fatal(
      {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      },
      '❌ UNCAUGHT EXCEPTION - Process will restart',
    );

    // Log to error queue (if available)
    if (fastify.errorQueue) {
      fastify.errorQueue.enqueue({
        timestamp: new Date(),
        level: 'error',
        message: `Uncaught Exception: ${error.message}`,
        stack: error.stack,
        type: 'system',
        context: {
          errorType: 'uncaughtException',
          name: error.name,
          env: process.env.NODE_ENV,
        },
      });
    }

    // Graceful shutdown (allow error queue to flush)
    fastify
      .close()
      .then(() => {
        fastify.log.info('Server closed successfully');
        process.exit(1);
      })
      .catch((err) => {
        fastify.log.error({ error: err }, 'Error during graceful shutdown');
        process.exit(1);
      });

    // Force exit after 10 seconds if graceful shutdown hangs
    setTimeout(() => {
      fastify.log.error('Graceful shutdown timeout - forcing exit');
      process.exit(1);
    }, 10000).unref();
  };

  /**
   * Handle unhandled promise rejections (async errors)
   *
   * While not immediately fatal like uncaughtException, these indicate
   * bugs in async code and should be logged for investigation.
   */
  const unhandledRejectionHandler = (reason: any, promise: Promise<any>) => {
    const errorMessage =
      reason instanceof Error
        ? reason.message
        : typeof reason === 'string'
          ? reason
          : JSON.stringify(reason);

    const stack =
      reason instanceof Error
        ? reason.stack
        : new Error('Unhandled Rejection').stack;

    // Log to Fastify logger (error level)
    fastify.log.error(
      {
        reason,
        promise,
        errorMessage,
      },
      '⚠️ UNHANDLED PROMISE REJECTION',
    );

    // Log to error queue (if available)
    if (fastify.errorQueue) {
      fastify.errorQueue.enqueue({
        timestamp: new Date(),
        level: 'error',
        message: `Unhandled Rejection: ${errorMessage}`,
        stack,
        type: 'system',
        context: {
          errorType: 'unhandledRejection',
          reason:
            reason instanceof Error
              ? {
                  name: reason.name,
                  message: reason.message,
                }
              : reason,
          env: process.env.NODE_ENV,
        },
      });
    }

    // In production, log and continue
    // In development, you might want to exit for debugging:
    if (
      process.env.NODE_ENV === 'development' &&
      process.env.EXIT_ON_UNHANDLED_REJECTION === 'true'
    ) {
      fastify.log.warn('EXIT_ON_UNHANDLED_REJECTION enabled - shutting down');
      process.exit(1);
    }
  };

  /**
   * Handle SIGTERM signal (graceful shutdown)
   *
   * Triggered by process managers (PM2, Kubernetes, Docker, etc.)
   * when requesting graceful shutdown.
   */
  const sigTermHandler = async () => {
    fastify.log.info('SIGTERM received - starting graceful shutdown');

    try {
      await fastify.close();
      fastify.log.info('Server closed successfully');
      process.exit(0);
    } catch (err) {
      fastify.log.error({ error: err }, 'Error during graceful shutdown');
      process.exit(1);
    }
  };

  /**
   * Handle SIGINT signal (Ctrl+C)
   *
   * Allow graceful shutdown when developer stops server locally.
   */
  const sigIntHandler = async () => {
    fastify.log.info('SIGINT received (Ctrl+C) - starting graceful shutdown');

    try {
      await fastify.close();
      fastify.log.info('Server closed successfully');
      process.exit(0);
    } catch (err) {
      fastify.log.error({ error: err }, 'Error during graceful shutdown');
      process.exit(1);
    }
  };

  // Register process-level error handlers
  process.on('uncaughtException', uncaughtExceptionHandler);
  process.on('unhandledRejection', unhandledRejectionHandler);
  process.on('SIGTERM', sigTermHandler);
  process.on('SIGINT', sigIntHandler);

  fastify.log.info('Global error hooks registered');

  // Cleanup on Fastify close
  fastify.addHook('onClose', async () => {
    process.removeListener('uncaughtException', uncaughtExceptionHandler);
    process.removeListener('unhandledRejection', unhandledRejectionHandler);
    process.removeListener('SIGTERM', sigTermHandler);
    process.removeListener('SIGINT', sigIntHandler);
    fastify.log.info('Global error hooks removed');
  });
}

export default fp(globalErrorHooksPlugin, {
  name: 'global-error-hooks',
  dependencies: ['logging-plugin'], // Requires logging to be initialized
  fastify: '>=4.x',
});
