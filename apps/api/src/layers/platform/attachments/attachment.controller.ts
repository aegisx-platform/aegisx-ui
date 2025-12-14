import { FastifyRequest, FastifyReply } from 'fastify';
import { AttachmentService } from './attachment.service';
import {
  CreateAttachmentBody,
  UpdateAttachmentBody,
  BulkAttachBody,
  ReorderAttachmentsBody,
  EntityParams,
  EntityTypeParam,
  AttachmentIdParam,
  GetAttachmentsQuery,
} from './attachment.schemas';

/**
 * Attachment Controller
 *
 * Handles HTTP requests for the attachment system.
 * Works with any entity type - completely generic!
 */
export class AttachmentController {
  constructor(private service: AttachmentService) {}

  /**
   * POST /attachments
   * Attach a file to an entity
   */
  async create(
    request: FastifyRequest<{ Body: CreateAttachmentBody }>,
    reply: FastifyReply,
  ) {
    try {
      const userId = request.user?.id;
      const { entityType, entityId, fileId, attachmentType, metadata } =
        request.body;

      const attachment = await this.service.attachFile({
        entityType,
        entityId,
        fileId,
        attachmentType,
        metadata,
        userId,
      });

      return reply.code(201).send({
        success: true,
        data: attachment,
        message: 'File attached successfully',
      });
    } catch (error: any) {
      request.log.error({ error }, 'Failed to attach file');
      return reply.code(400).send({
        success: false,
        error: {
          code: 'ATTACH_FAILED',
          message: error.message || 'Failed to attach file',
        },
      });
    }
  }

  /**
   * GET /attachments/:entityType/:entityId
   * Get all attachments for an entity
   */
  async listByEntity(
    request: FastifyRequest<{
      Params: EntityParams;
      Querystring: GetAttachmentsQuery;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { entityType, entityId } = request.params;
      const { attachmentType } = request.query;

      const attachments = await this.service.getEntityAttachments(
        entityType,
        entityId,
        attachmentType,
      );

      return reply.send({
        success: true,
        data: attachments,
      });
    } catch (error: any) {
      request.log.error({ error }, 'Failed to get attachments');
      return reply.code(400).send({
        success: false,
        error: {
          code: 'GET_ATTACHMENTS_FAILED',
          message: error.message || 'Failed to get attachments',
        },
      });
    }
  }

  /**
   * GET /attachments/:attachmentId
   * Get a single attachment by ID
   */
  async getOne(
    request: FastifyRequest<{ Params: AttachmentIdParam }>,
    reply: FastifyReply,
  ) {
    try {
      const { attachmentId } = request.params;

      const attachment = await this.service.getAttachment(attachmentId);

      if (!attachment) {
        return reply.code(404).send({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Attachment not found',
          },
        });
      }

      return reply.send({
        success: true,
        data: attachment,
      });
    } catch (error: any) {
      request.log.error({ error }, 'Failed to get attachment');
      return reply.code(400).send({
        success: false,
        error: {
          code: 'GET_ATTACHMENT_FAILED',
          message: error.message || 'Failed to get attachment',
        },
      });
    }
  }

  /**
   * PATCH /attachments/:attachmentId
   * Update an attachment
   */
  async update(
    request: FastifyRequest<{
      Params: AttachmentIdParam;
      Body: UpdateAttachmentBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { attachmentId } = request.params;
      const data = request.body;

      const attachment = await this.service.updateAttachment(
        attachmentId,
        data,
      );

      return reply.send({
        success: true,
        data: attachment,
        message: 'Attachment updated successfully',
      });
    } catch (error: any) {
      request.log.error({ error }, 'Failed to update attachment');
      return reply.code(400).send({
        success: false,
        error: {
          code: 'UPDATE_FAILED',
          message: error.message || 'Failed to update attachment',
        },
      });
    }
  }

  /**
   * DELETE /attachments/:attachmentId
   * Delete an attachment
   */
  async delete(
    request: FastifyRequest<{ Params: AttachmentIdParam }>,
    reply: FastifyReply,
  ) {
    try {
      const { attachmentId } = request.params;

      await this.service.removeAttachment(attachmentId);

      return reply.send({
        success: true,
        message: 'Attachment deleted successfully',
      });
    } catch (error: any) {
      request.log.error({ error }, 'Failed to delete attachment');
      return reply.code(400).send({
        success: false,
        error: {
          code: 'DELETE_FAILED',
          message: error.message || 'Failed to delete attachment',
        },
      });
    }
  }

  /**
   * POST /attachments/bulk
   * Bulk attach multiple files to an entity
   */
  async bulkAttach(
    request: FastifyRequest<{ Body: BulkAttachBody }>,
    reply: FastifyReply,
  ) {
    try {
      const userId = request.user?.id;
      const { entityType, entityId, files } = request.body;

      const attachments = await this.service.bulkAttachFiles(
        entityType,
        entityId,
        files,
        userId,
      );

      return reply.code(201).send({
        success: true,
        data: attachments,
        message: `Successfully attached ${attachments.length} files`,
      });
    } catch (error: any) {
      request.log.error({ error }, 'Failed to bulk attach files');
      return reply.code(400).send({
        success: false,
        error: {
          code: 'BULK_ATTACH_FAILED',
          message: error.message || 'Failed to bulk attach files',
        },
      });
    }
  }

  /**
   * PUT /attachments/:entityType/:entityId/reorder
   * Reorder attachments for an entity
   */
  async reorder(
    request: FastifyRequest<{
      Params: EntityParams;
      Body: ReorderAttachmentsBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { entityType, entityId } = request.params;
      const { fileIds } = request.body;

      await this.service.reorderAttachments(entityType, entityId, fileIds);

      return reply.send({
        success: true,
        message: 'Attachments reordered successfully',
      });
    } catch (error: any) {
      request.log.error({ error }, 'Failed to reorder attachments');
      return reply.code(400).send({
        success: false,
        error: {
          code: 'REORDER_FAILED',
          message: error.message || 'Failed to reorder attachments',
        },
      });
    }
  }

  /**
   * GET /attachments/config/:entityType
   * Get configuration for an entity type
   */
  async getConfig(
    request: FastifyRequest<{ Params: EntityTypeParam }>,
    reply: FastifyReply,
  ) {
    try {
      const { entityType } = request.params;

      const config = this.service.getEntityConfig(entityType);

      return reply.send({
        success: true,
        data: config,
      });
    } catch (error: any) {
      request.log.error({ error }, 'Failed to get config');
      return reply.code(404).send({
        success: false,
        error: {
          code: 'CONFIG_NOT_FOUND',
          message: error.message || 'Configuration not found for entity type',
        },
      });
    }
  }

  /**
   * GET /attachments/:entityType/:entityId/count
   * Get attachment count for an entity
   */
  async getCount(
    request: FastifyRequest<{
      Params: EntityParams;
      Querystring: GetAttachmentsQuery;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { entityType, entityId } = request.params;
      const { attachmentType } = request.query;

      const count = await this.service.getAttachmentCount(
        entityType,
        entityId,
        attachmentType,
      );

      return reply.send({
        success: true,
        data: { count },
      });
    } catch (error: any) {
      request.log.error({ error }, 'Failed to get count');
      return reply.code(400).send({
        success: false,
        error: {
          code: 'COUNT_FAILED',
          message: error.message || 'Failed to get attachment count',
        },
      });
    }
  }

  /**
   * DELETE /attachments/:entityType/:entityId
   * Clean up all attachments for an entity (when entity is deleted)
   */
  async cleanup(
    request: FastifyRequest<{ Params: EntityParams }>,
    reply: FastifyReply,
  ) {
    try {
      const { entityType, entityId } = request.params;

      await this.service.cleanupEntity(entityType, entityId);

      return reply.send({
        success: true,
        message: 'Entity attachments cleaned up successfully',
      });
    } catch (error: any) {
      request.log.error({ error }, 'Failed to cleanup attachments');
      return reply.code(400).send({
        success: false,
        error: {
          code: 'CLEANUP_FAILED',
          message: error.message || 'Failed to cleanup attachments',
        },
      });
    }
  }

  /**
   * GET /attachments/by-file/:fileId
   * Get all attachments for a specific file
   * Useful for File Management to see where a file is being used
   */
  async getByFileId(
    request: FastifyRequest<{ Params: { fileId: string } }>,
    reply: FastifyReply,
  ) {
    try {
      const { fileId } = request.params;

      const attachments = await this.service.getAttachmentsByFileId(fileId);

      return reply.send({
        success: true,
        data: attachments,
      });
    } catch (error: any) {
      request.log.error({ error }, 'Failed to get attachments by file');
      return reply.code(400).send({
        success: false,
        error: {
          code: 'GET_BY_FILE_FAILED',
          message: error.message || 'Failed to get attachments for file',
        },
      });
    }
  }

  /**
   * GET /attachments/by-file/:fileId/count
   * Get attachment count for a specific file
   */
  async getCountByFileId(
    request: FastifyRequest<{ Params: { fileId: string } }>,
    reply: FastifyReply,
  ) {
    try {
      const { fileId } = request.params;

      const count = await this.service.getAttachmentCountByFileId(fileId);

      return reply.send({
        success: true,
        data: { count },
      });
    } catch (error: any) {
      request.log.error({ error }, 'Failed to get count by file');
      return reply.code(400).send({
        success: false,
        error: {
          code: 'COUNT_BY_FILE_FAILED',
          message: error.message || 'Failed to get attachment count for file',
        },
      });
    }
  }

  /**
   * GET /attachments/stats
   * Get attachment statistics for current user's files
   */
  async getStatistics(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.id;

      if (!userId) {
        return reply.code(401).send({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'User not authenticated',
          },
        });
      }

      const stats = await this.service.getStatistics(userId);

      return reply.send({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      request.log.error({ error }, 'Failed to get attachment statistics');
      return reply.code(400).send({
        success: false,
        error: {
          code: 'STATS_FAILED',
          message: error.message || 'Failed to get attachment statistics',
        },
      });
    }
  }
}
