/**
 * Platform File Upload Module
 *
 * Exports:
 * - Plugin: Default export for Fastify registration
 * - Repository: Database operations for file metadata
 * - Service: Business logic for file upload and management
 * - Controller: Route handlers
 * - Schemas: TypeBox validation schemas
 */

export { default } from './file-upload.plugin';
export { default as platformFileUploadPlugin } from './file-upload.plugin';
export { FileUploadRepository } from './file-upload.repository';
export { FileUploadService } from './file-upload.service';
export { FileUploadController } from './file-upload.controller';
export * from './file-upload.schemas';
export { fileUploadRoutes } from './file-upload.routes';
