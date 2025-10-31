import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { ErrorLogsController } from './error-logs.controller';
import { ErrorLogsService } from './error-logs.service';
import { ErrorLogsRepository } from './error-logs.repository';
import errorLogsRoutes from './error-logs.routes';
import { errorLogsSchemas } from './error-logs.schemas';

export default fp(
  async function errorLogsPlugin(
    fastify: FastifyInstance,
    opts: FastifyPluginOptions,
  ) {
    // 1. Register schemas
    if (fastify.hasDecorator('schemaRegistry')) {
      (fastify as any).schemaRegistry.registerModuleSchemas(
        'error-logs',
        errorLogsSchemas,
      );
    }

    // 2. Create service instances with dependency injection
    const errorLogsRepository = new ErrorLogsRepository(fastify.knex);
    const errorLogsService = new ErrorLogsService(fastify.knex);
    const errorLogsController = new ErrorLogsController(errorLogsService);

    // 3. Register routes with controller
    await fastify.register(errorLogsRoutes, {
      controller: errorLogsController,
      prefix: opts.prefix || '/error-logs',
    });

    // 4. Decorate Fastify instance for cross-module access
    fastify.decorate('errorLogsService', errorLogsService);

    // 5. Lifecycle hooks
    fastify.addHook('onReady', async () => {
      fastify.log.info('Error Logs module registered successfully');
    });
  },
  {
    name: 'error-logs-plugin',
    dependencies: ['knex-plugin', 'jwt-auth-plugin', 'auth-strategies-plugin'],
  },
);

// Fastify module declaration for TypeScript
declare module 'fastify' {
  interface FastifyInstance {
    errorLogsService: ErrorLogsService;
  }
}
