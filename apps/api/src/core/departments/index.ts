import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { DepartmentsRepository } from './departments.repository';
import { departmentsRoutes } from './departments.routes';

/**
 * Core Departments Plugin
 *
 * Central plugin for managing the organization structure and hierarchy.
 * Provides CRUD operations for departments with real-time WebSocket events.
 *
 * Features:
 * - Standard CRUD operations (Create, Read, Update, Delete)
 * - Department hierarchy management
 * - Real-time WebSocket events for all operations
 * - Dropdown and hierarchical tree endpoints
 *
 * Following Fastify best practices:
 * - Service instantiation with proper dependency injection
 * - Encapsulation through plugin scoping
 * - Lifecycle management with hooks
 * - Schema registration through Fastify's schema registry
 */
export default fp(
  async function coreDepartmentsPlugin(
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
  ) {
    // Create repository with Knex connection
    const departmentsRepository = new DepartmentsRepository(
      (fastify as any).knex,
    );

    // Create service with repository
    const departmentsService = new DepartmentsService(departmentsRepository);

    // Create controller with service and event service for real-time updates
    const departmentsController = new DepartmentsController(
      departmentsService,
      (fastify as any).eventService,
    );

    // Register routes under the specified prefix or /core/departments
    await fastify.register(departmentsRoutes, {
      controller: departmentsController,
      prefix: options.prefix || '/core/departments',
    });

    // Lifecycle hooks for monitoring
    fastify.addHook('onReady', async () => {
      fastify.log.info(`Core departments module registered successfully`);
    });
  },
  {
    name: 'core-departments-plugin',
    dependencies: ['knex-plugin', 'websocket-plugin'],
  },
);

// ===== RE-EXPORTS FOR EXTERNAL CONSUMERS =====

// Schemas - All TypeBox schema definitions
export * from './departments.schemas';

// Types - All TypeScript interfaces and types
export * from './departments.types';

// Classes - Core service classes
export { DepartmentsRepository } from './departments.repository';
export { DepartmentsService } from './departments.service';
export { DepartmentsController } from './departments.controller';

// Routes - Export routes for custom mounting
export { departmentsRoutes } from './departments.routes';

// Convenient re-export of commonly used schema types
export type {
  Departments,
  CreateDepartments,
  UpdateDepartments,
  DepartmentsIdParam,
  GetDepartmentsQuery,
  ListDepartmentsQuery,
  PartialDepartments,
  FlexibleDepartmentsList,
} from './departments.schemas';

// Module name constant
export const MODULE_NAME = 'departments' as const;
