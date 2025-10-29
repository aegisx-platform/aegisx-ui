import {
  AttachmentRepository,
  CreateAttachment,
  UpdateAttachment,
  Attachment,
  AttachmentWithFile,
} from './attachment.repository';
import { getAttachmentConfig, AttachmentConfig } from './attachment-config';

/**
 * Attach file request
 */
export interface AttachFileRequest {
  entityType: string;
  entityId: string;
  fileId: string;
  attachmentType: string;
  metadata?: Record<string, any>;
  userId?: string;
}

/**
 * Attachment Service
 *
 * Handles business logic for file attachments.
 * Works with any entity type configured in attachment-config.ts
 */
export class AttachmentService {
  constructor(private repository: AttachmentRepository) {}

  /**
   * Attach a file to an entity
   */
  async attachFile(request: AttachFileRequest): Promise<Attachment> {
    // Validate that entity type is configured
    const config = getAttachmentConfig(request.entityType);

    // Check if file is already attached
    const isAttached = await this.repository.isFileAttached(
      request.entityType,
      request.entityId,
      request.fileId,
    );

    if (isAttached) {
      throw new Error(
        `File ${request.fileId} is already attached to ${request.entityType} ${request.entityId}`,
      );
    }

    // Get current count for display order
    const currentCount = await this.repository.countByEntity(
      request.entityType,
      request.entityId,
    );

    // Create attachment
    return this.repository.create({
      entityType: request.entityType,
      entityId: request.entityId,
      fileId: request.fileId,
      attachmentType: request.attachmentType,
      displayOrder: currentCount, // Append to end
      metadata: request.metadata,
      createdBy: request.userId,
    });
  }

  /**
   * Get all attachments for an entity
   */
  async getEntityAttachments(
    entityType: string,
    entityId: string,
    attachmentType?: string,
  ): Promise<AttachmentWithFile[]> {
    // Validate entity type
    getAttachmentConfig(entityType);

    return this.repository.findByEntityWithFiles(
      entityType,
      entityId,
      attachmentType,
    );
  }

  /**
   * Get a single attachment by ID
   */
  async getAttachment(
    attachmentId: string,
  ): Promise<AttachmentWithFile | null> {
    return this.repository.findByIdWithFile(attachmentId);
  }

  /**
   * Update attachment
   */
  async updateAttachment(
    attachmentId: string,
    data: UpdateAttachment,
  ): Promise<Attachment> {
    const existing = await this.repository.findById(attachmentId);
    if (!existing) {
      throw new Error(`Attachment ${attachmentId} not found`);
    }

    return this.repository.update(attachmentId, data);
  }

  /**
   * Remove an attachment
   * Note: This only deletes the attachment record, not the file itself
   */
  async removeAttachment(attachmentId: string): Promise<void> {
    const attachment = await this.repository.findById(attachmentId);
    if (!attachment) {
      throw new Error(`Attachment ${attachmentId} not found`);
    }

    await this.repository.delete(attachmentId);

    // TODO: Optionally delete the file from storage based on config.cascadeDelete
    // This would require injecting FileUploadService or FileRepository
  }

  /**
   * Reorder attachments for an entity
   */
  async reorderAttachments(
    entityType: string,
    entityId: string,
    fileIds: string[],
  ): Promise<void> {
    // Validate entity type
    getAttachmentConfig(entityType);

    await this.repository.reorder(entityType, entityId, fileIds);
  }

  /**
   * Clean up all attachments for an entity
   * Called when the entity is deleted
   */
  async cleanupEntity(entityType: string, entityId: string): Promise<void> {
    const config = getAttachmentConfig(entityType);

    if (config.cascadeDelete) {
      // Get all attachments with file details
      const attachments = await this.repository.findByEntityWithFiles(
        entityType,
        entityId,
      );

      // TODO: Delete files from storage
      // This would require injecting FileUploadService
      // for (const attachment of attachments) {
      //   await this.fileService.deleteFile(attachment.fileId);
      // }
    }

    // Delete attachment records
    await this.repository.deleteByEntity(entityType, entityId);
  }

  /**
   * Get attachment configuration for an entity type
   * Useful for frontend validation
   */
  getEntityConfig(entityType: string): AttachmentConfig {
    return getAttachmentConfig(entityType);
  }

  /**
   * Get all attachments for a specific file
   * Useful for File Management to see where a file is being used
   */
  async getAttachmentsByFileId(fileId: string): Promise<Attachment[]> {
    return this.repository.findByFileId(fileId);
  }

  /**
   * Get attachment count for a specific file
   */
  async getAttachmentCountByFileId(fileId: string): Promise<number> {
    return this.repository.countByFileId(fileId);
  }

  /**
   * Get attachment count for an entity
   */
  async getAttachmentCount(
    entityType: string,
    entityId: string,
    attachmentType?: string,
  ): Promise<number> {
    return this.repository.countByEntity(entityType, entityId, attachmentType);
  }

  /**
   * Check if an entity has reached its attachment limit
   */
  async hasReachedLimit(
    entityType: string,
    entityId: string,
  ): Promise<boolean> {
    const config = getAttachmentConfig(entityType);
    if (!config.maxFiles) {
      return false; // No limit configured
    }

    const count = await this.repository.countByEntity(entityType, entityId);
    return count >= config.maxFiles;
  }

  /**
   * Bulk attach multiple files to an entity
   */
  async bulkAttachFiles(
    entityType: string,
    entityId: string,
    files: Array<{
      fileId: string;
      attachmentType: string;
      metadata?: Record<string, any>;
    }>,
    userId?: string,
  ): Promise<Attachment[]> {
    const config = getAttachmentConfig(entityType);

    // Check if bulk operation would exceed limit
    if (config.maxFiles) {
      const currentCount = await this.repository.countByEntity(
        entityType,
        entityId,
      );
      if (currentCount + files.length > config.maxFiles) {
        throw new Error(
          `Cannot attach ${files.length} files. ` +
            `Limit is ${config.maxFiles}, current count is ${currentCount}`,
        );
      }
    }

    const attachments: Attachment[] = [];
    for (const file of files) {
      const attachment = await this.attachFile({
        entityType,
        entityId,
        fileId: file.fileId,
        attachmentType: file.attachmentType,
        metadata: file.metadata,
        userId,
      });
      attachments.push(attachment);
    }

    return attachments;
  }

  /**
   * Get attachment statistics for a user's files
   */
  async getStatistics(userId: string): Promise<{
    totalFiles: number;
    filesWithAttachments: number;
    filesWithoutAttachments: number;
    totalAttachments: number;
  }> {
    return this.repository.getStatistics(userId);
  }
}
