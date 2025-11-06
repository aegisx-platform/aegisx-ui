import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { TestCategoriesController } from './controllers/test-categories.controller';
import { TestCategoriesService } from './services/test-categories.service';
import { TestCategoriesRepository } from './repositories/test-categories.repository';
import { testCategoriesRoutes } from './routes/index';
import { testCategoriesImportRoutes } from './routes/test-categories-import.routes';
import { TestCategoriesImportService } from './services/test-categories-import.service';

// Note: FastifyInstance eventService type is declared in websocket.plugin.ts

/**
 * TestCategories Domain Plugin
 *
 * Following Fastify best practices:
 * - Service instantiation with proper dependency injection
 * - Encapsulation through plugin scoping
 * - Lifecycle management with hooks
 * - Schema registration through Fastify's schema registry
 */
export default fp(
  async function testCategoriesDomainPlugin(
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
  ) {
    // Register schemas using Fastify's built-in schema registry
    if (fastify.hasDecorator('schemaRegistry')) {
      (fastify as any).schemaRegistry.registerModuleSchemas(
        'testCategories',
        {}, // schemas will be imported automatically
      );
    }

    // Service instantiation following Fastify DI pattern
    // Dependencies are accessed from Fastify instance decorators
    const testCategoriesRepository = new TestCategoriesRepository(
      (fastify as any).knex,
    );
    const testCategoriesService = new TestCategoriesService(
      testCategoriesRepository,
      (fastify as any).eventService,
    );
    const testCategoriesImportService = new TestCategoriesImportService(
      (fastify as any).knex,
      testCategoriesRepository,
      (fastify as any).eventService, // Pass eventService for import progress events
    );

    // Controller instantiation with proper dependencies
    const testCategoriesController = new TestCategoriesController(
      testCategoriesService,
      testCategoriesImportService,
      (fastify as any).eventService,
    );

    // Optional: Decorate Fastify instance with service for cross-plugin access
    // fastify.decorate('testCategoriesService', testCategoriesService);

    // ⚠️ IMPORTANT: Register import routes FIRST (before main routes)
    // Import routes have static paths like /export, /import/template
    // They must be registered before dynamic routes like /:id
    // Otherwise /:id will match everything including /export
    await fastify.register(testCategoriesImportRoutes, {
      controller: testCategoriesController,
      prefix: options.prefix || '/test-categories',
    });

    // Register main CRUD routes (includes dynamic /:id route)
    await fastify.register(testCategoriesRoutes, {
      controller: testCategoriesController,
      prefix: options.prefix || '/test-categories',
    });

    // Lifecycle hooks for monitoring
    fastify.addHook('onReady', async () => {
      fastify.log.info(`TestCategories domain module registered successfully`);
    });

    // Cleanup event listeners on close
    fastify.addHook('onClose', async () => {
      fastify.log.info(`Cleaning up TestCategories domain module resources`);
      // Add any cleanup logic here
    });
  },
  {
    name: 'testCategories-domain-plugin',
    dependencies: ['knex-plugin', 'websocket-plugin'],
  },
);

// Re-exports for external consumers
export * from './schemas/test-categories.schemas';
export * from './types/test-categories.types';
export { TestCategoriesRepository } from './repositories/test-categories.repository';
export { TestCategoriesService } from './services/test-categories.service';
export { TestCategoriesController } from './controllers/test-categories.controller';

// Re-export commonly used types for external use
export type {
  TestCategories,
  CreateTestCategories,
  UpdateTestCategories,
  TestCategoriesIdParam,
  GetTestCategoriesQuery,
  ListTestCategoriesQuery,
  TestCategoriesCreatedEvent,
  TestCategoriesUpdatedEvent,
  TestCategoriesDeletedEvent,
} from './schemas/test-categories.schemas';

// Event type definitions for external consumers
import { TestCategories } from './schemas/test-categories.schemas';

export interface TestCategoriesEventHandlers {
  onCreated?: (data: TestCategories) => void | Promise<void>;
  onUpdated?: (data: TestCategories) => void | Promise<void>;
  onDeleted?: (data: { id: number | string }) => void | Promise<void>;
}

export interface TestCategoriesWebSocketSubscription {
  subscribe(handlers: TestCategoriesEventHandlers): void;
  unsubscribe(): void;
}

// Module name constant
export const MODULE_NAME = 'testCategories' as const;
