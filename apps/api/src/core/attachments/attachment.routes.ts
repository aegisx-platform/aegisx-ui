import { FastifyPluginAsync } from 'fastify';
import { AttachmentController } from './attachment.controller';
import { AttachmentService } from './attachment.service';
import { AttachmentRepository } from './attachment.repository';
import { createOptionalAuthHandler } from '../../shared/helpers/optional-auth.helper';
import {
  CreateAttachmentBodySchema,
  UpdateAttachmentBodySchema,
  BulkAttachBodySchema,
  ReorderAttachmentsBodySchema,
  EntityParamsSchema,
  EntityTypeParamSchema,
  AttachmentIdParamSchema,
  GetAttachmentsQuerySchema,
  AttachmentResponseSchema,
  AttachmentWithFileResponseSchema,
  AttachmentListResponseSchema,
  AttachmentConfigResponseSchema,
  BulkAttachResponseSchema,
} from './attachment.schemas';

/**
 * Attachment Routes
 *
 * RESTful API for the generic file attachment system.
 * Works with ANY entity type configured in attachment-config.ts
 */
export const attachmentRoutes: FastifyPluginAsync = async (fastify) => {
  // Initialize repository, service, and controller
  const repository = new AttachmentRepository(fastify.knex);
  const service = new AttachmentService(repository);
  const controller = new AttachmentController(service);

  // ========================================
  // CREATE ATTACHMENT
  // ========================================

  fastify.post(
    '/',
    {
      schema: {
        tags: ['Attachments'],
        summary: 'Attach a file to an entity',
        description:
          'Creates a new attachment linking a file to any entity type',
        body: CreateAttachmentBodySchema,
        response: {
          201: AttachmentResponseSchema,
        },
      },
      preHandler: [createOptionalAuthHandler(fastify)],
    },
    controller.create.bind(controller),
  );

  // ========================================
  // BULK ATTACH
  // ========================================

  fastify.post(
    '/bulk',
    {
      schema: {
        tags: ['Attachments'],
        summary: 'Bulk attach multiple files to an entity',
        description: 'Attach multiple files to an entity in one request',
        body: BulkAttachBodySchema,
        response: {
          201: BulkAttachResponseSchema,
        },
      },
      preHandler: [createOptionalAuthHandler(fastify)],
    },
    controller.bulkAttach.bind(controller),
  );

  // ========================================
  // GET CONFIGURATION
  // ========================================

  fastify.get(
    '/config/:entityType',
    {
      schema: {
        tags: ['Attachments'],
        summary: 'Get attachment configuration for entity type',
        description:
          'Returns configuration (allowed types, max files, etc.) for validation',
        params: EntityTypeParamSchema,
        response: {
          200: AttachmentConfigResponseSchema,
        },
      },
    },
    controller.getConfig.bind(controller),
  );

  // ========================================
  // GET ATTACHMENT STATISTICS
  // ========================================

  fastify.get(
    '/stats',
    {
      schema: {
        tags: ['Attachments'],
        summary: 'Get attachment statistics for current user',
        description:
          'Returns statistics about file usage and attachments for current user',
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  totalFiles: {
                    type: 'number',
                    description: 'Total files owned by user',
                  },
                  filesWithAttachments: {
                    type: 'number',
                    description: 'Files that are attached to entities',
                  },
                  filesWithoutAttachments: {
                    type: 'number',
                    description: 'Files not attached to any entity',
                  },
                  totalAttachments: {
                    type: 'number',
                    description: 'Total number of attachments',
                  },
                },
              },
            },
          },
        },
      },
      preHandler: [fastify.authenticate],
    },
    controller.getStatistics.bind(controller),
  );

  // ========================================
  // GET ATTACHMENTS BY ENTITY
  // ========================================

  fastify.get(
    '/:entityType/:entityId',
    {
      schema: {
        tags: ['Attachments'],
        summary: 'Get all attachments for an entity',
        description:
          'Returns all files attached to a specific entity with file details',
        params: EntityParamsSchema,
        querystring: GetAttachmentsQuerySchema,
        response: {
          200: AttachmentListResponseSchema,
        },
      },
      preHandler: [createOptionalAuthHandler(fastify)],
    },
    controller.listByEntity.bind(controller),
  );

  // ========================================
  // GET ATTACHMENT COUNT
  // ========================================

  fastify.get(
    '/:entityType/:entityId/count',
    {
      schema: {
        tags: ['Attachments'],
        summary: 'Get attachment count for an entity',
        description: 'Returns the number of files attached to an entity',
        params: EntityParamsSchema,
        querystring: GetAttachmentsQuerySchema,
      },
      preHandler: [createOptionalAuthHandler(fastify)],
    },
    controller.getCount.bind(controller),
  );

  // ========================================
  // REORDER ATTACHMENTS
  // ========================================

  fastify.put(
    '/:entityType/:entityId/reorder',
    {
      schema: {
        tags: ['Attachments'],
        summary: 'Reorder attachments for an entity',
        description: 'Update the display order of attachments',
        params: EntityParamsSchema,
        body: ReorderAttachmentsBodySchema,
      },
      preHandler: [createOptionalAuthHandler(fastify)],
    },
    controller.reorder.bind(controller),
  );

  // ========================================
  // CLEANUP ENTITY ATTACHMENTS
  // ========================================

  fastify.delete(
    '/:entityType/:entityId',
    {
      schema: {
        tags: ['Attachments'],
        summary: 'Clean up all attachments for an entity',
        description:
          'Deletes all attachments when entity is deleted (cleanup operation)',
        params: EntityParamsSchema,
      },
      preHandler: [fastify.authenticate],
    },
    controller.cleanup.bind(controller),
  );

  // ========================================
  // GET SINGLE ATTACHMENT
  // ========================================

  fastify.get(
    '/:attachmentId',
    {
      schema: {
        tags: ['Attachments'],
        summary: 'Get a single attachment by ID',
        description: 'Returns attachment with file details',
        params: AttachmentIdParamSchema,
        response: {
          200: AttachmentWithFileResponseSchema,
        },
      },
      preHandler: [createOptionalAuthHandler(fastify)],
    },
    controller.getOne.bind(controller),
  );

  // ========================================
  // UPDATE ATTACHMENT
  // ========================================

  fastify.patch(
    '/:attachmentId',
    {
      schema: {
        tags: ['Attachments'],
        summary: 'Update an attachment',
        description: 'Update attachment metadata or type',
        params: AttachmentIdParamSchema,
        body: UpdateAttachmentBodySchema,
        response: {
          200: AttachmentResponseSchema,
        },
      },
      preHandler: [createOptionalAuthHandler(fastify)],
    },
    controller.update.bind(controller),
  );

  // ========================================
  // DELETE ATTACHMENT
  // ========================================

  fastify.delete(
    '/:attachmentId',
    {
      schema: {
        tags: ['Attachments'],
        summary: 'Delete an attachment',
        description:
          'Removes the attachment (does not delete the file from storage)',
        params: AttachmentIdParamSchema,
      },
      preHandler: [createOptionalAuthHandler(fastify)],
    },
    controller.delete.bind(controller),
  );

  // ========================================
  // GET ATTACHMENTS BY FILE ID
  // ========================================

  fastify.get(
    '/by-file/:fileId',
    {
      schema: {
        tags: ['Attachments'],
        summary: 'Get all attachments for a specific file',
        description:
          'Returns all attachments using this file (useful for File Management)',
        params: {
          type: 'object',
          required: ['fileId'],
          properties: {
            fileId: {
              type: 'string',
              format: 'uuid',
              description: 'File ID',
            },
          },
        },
      },
      preHandler: [createOptionalAuthHandler(fastify)],
    },
    controller.getByFileId.bind(controller),
  );

  // ========================================
  // GET ATTACHMENT COUNT BY FILE ID
  // ========================================

  fastify.get(
    '/by-file/:fileId/count',
    {
      schema: {
        tags: ['Attachments'],
        summary: 'Get attachment count for a specific file',
        description:
          'Returns number of times this file is attached to entities',
        params: {
          type: 'object',
          required: ['fileId'],
          properties: {
            fileId: {
              type: 'string',
              format: 'uuid',
              description: 'File ID',
            },
          },
        },
      },
      preHandler: [createOptionalAuthHandler(fastify)],
    },
    controller.getCountByFileId.bind(controller),
  );
};
