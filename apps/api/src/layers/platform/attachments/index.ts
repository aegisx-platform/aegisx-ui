/**
 * Platform Attachments Module
 *
 * Exports:
 * - Plugin: Default export for Fastify registration
 * - Repository: Database operations for attachments
 * - Service: Business logic for attachment management
 * - Controller: Route handlers
 * - Schemas: TypeBox validation schemas
 * - Config: Entity type configuration
 */

export { default } from './attachment.plugin';
export { default as platformAttachmentPlugin } from './attachment.plugin';
export { AttachmentRepository } from './attachment.repository';
export { AttachmentService } from './attachment.service';
export { AttachmentController } from './attachment.controller';
export * from './attachment.schemas';
export * from './attachment-config';
