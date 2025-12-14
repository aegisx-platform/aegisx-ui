import { Knex } from 'knex';
import {
  getAttachmentConfig,
  validateAttachment,
  validateMetadata,
} from './attachment-config';

/**
 * Attachment entity (from database)
 */
export interface Attachment {
  id: string;
  entityType: string;
  entityId: string;
  fileId: string;
  attachmentType: string;
  displayOrder: number;
  metadata: Record<string, any>;
  createdAt: Date;
  createdBy?: string;
  updatedAt?: Date;
}

/**
 * Create attachment payload
 */
export interface CreateAttachment {
  entityType: string;
  entityId: string;
  fileId: string;
  attachmentType: string;
  displayOrder?: number;
  metadata?: Record<string, any>;
  createdBy?: string;
}

/**
 * Update attachment payload
 */
export interface UpdateAttachment {
  attachmentType?: string;
  displayOrder?: number;
  metadata?: Record<string, any>;
}

/**
 * Attachment with file details (JOIN query result)
 */
export interface AttachmentWithFile extends Attachment {
  file: {
    id: string;
    originalName: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
    category: string;
    signedUrls?: {
      view: string;
      download: string;
    };
  };
}

/**
 * Generic Attachment Repository
 *
 * Handles polymorphic file attachments for ANY entity type.
 * Works with the config registry to validate attachments.
 */
export class AttachmentRepository {
  private readonly tableName = 'attachments';

  constructor(private db: Knex) {}

  /**
   * Find all attachments for a specific entity
   */
  async findByEntity(
    entityType: string,
    entityId: string,
    attachmentType?: string,
  ): Promise<Attachment[]> {
    const query = this.db(this.tableName)
      .where({ entity_type: entityType, entity_id: entityId })
      .orderBy('display_order', 'asc')
      .orderBy('created_at', 'asc');

    if (attachmentType) {
      query.where({ attachment_type: attachmentType });
    }

    const rows = await query;
    return rows.map(this.mapToAttachment);
  }

  /**
   * Find attachments with file details (JOIN with uploaded_files)
   */
  async findByEntityWithFiles(
    entityType: string,
    entityId: string,
    attachmentType?: string,
  ): Promise<AttachmentWithFile[]> {
    const query = this.db(this.tableName)
      .leftJoin(
        'uploaded_files',
        `${this.tableName}.file_id`,
        'uploaded_files.id',
      )
      .where({
        [`${this.tableName}.entity_type`]: entityType,
        [`${this.tableName}.entity_id`]: entityId,
      })
      .whereNull('uploaded_files.deleted_at')
      .select(
        `${this.tableName}.*`,
        this.db.raw(`
          jsonb_build_object(
            'id', uploaded_files.id,
            'originalName', uploaded_files.original_name,
            'filePath', uploaded_files.filepath,
            'fileSize', uploaded_files.file_size,
            'mimeType', uploaded_files.mime_type,
            'category', uploaded_files.file_category
          ) as file
        `),
      )
      .orderBy(`${this.tableName}.display_order`, 'asc')
      .orderBy(`${this.tableName}.created_at`, 'asc');

    if (attachmentType) {
      query.where({ [`${this.tableName}.attachment_type`]: attachmentType });
    }

    const rows = await query;
    return rows.map((row) => ({
      ...this.mapToAttachment(row),
      file: row.file,
    }));
  }

  /**
   * Find attachment by ID
   */
  async findById(id: string): Promise<Attachment | null> {
    const row = await this.db(this.tableName).where({ id }).first();
    return row ? this.mapToAttachment(row) : null;
  }

  /**
   * Find attachment by ID with file details
   */
  async findByIdWithFile(id: string): Promise<AttachmentWithFile | null> {
    const row = await this.db(this.tableName)
      .leftJoin(
        'uploaded_files',
        `${this.tableName}.file_id`,
        'uploaded_files.id',
      )
      .where({ [`${this.tableName}.id`]: id })
      .whereNull('uploaded_files.deleted_at')
      .select(
        `${this.tableName}.*`,
        this.db.raw(`
          jsonb_build_object(
            'id', uploaded_files.id,
            'originalName', uploaded_files.original_name,
            'filePath', uploaded_files.filepath,
            'fileSize', uploaded_files.file_size,
            'mimeType', uploaded_files.mime_type,
            'category', uploaded_files.file_category
          ) as file
        `),
      )
      .first();

    return row
      ? {
          ...this.mapToAttachment(row),
          file: row.file,
        }
      : null;
  }

  /**
   * Create a new attachment
   * Validates against config before creating
   */
  async create(data: CreateAttachment): Promise<Attachment> {
    // Get current count for validation
    const currentCount = await this.countByEntity(
      data.entityType,
      data.entityId,
    );

    // Validate against config (throws if invalid)
    validateAttachment({
      entityType: data.entityType,
      attachmentType: data.attachmentType,
      fileCount: currentCount,
    });

    // Validate metadata if provided
    if (data.metadata) {
      validateMetadata(data.entityType, data.metadata);
    }

    // Insert
    const [row] = await this.db(this.tableName)
      .insert({
        entity_type: data.entityType,
        entity_id: data.entityId,
        file_id: data.fileId,
        attachment_type: data.attachmentType,
        display_order: data.displayOrder ?? 0,
        metadata: data.metadata ?? {},
        created_by: data.createdBy,
      })
      .returning('*');

    return this.mapToAttachment(row);
  }

  /**
   * Update attachment
   */
  async update(id: string, data: UpdateAttachment): Promise<Attachment> {
    const updateData: any = {
      updated_at: this.db.fn.now(),
    };

    if (data.attachmentType !== undefined) {
      updateData.attachment_type = data.attachmentType;
    }
    if (data.displayOrder !== undefined) {
      updateData.display_order = data.displayOrder;
    }
    if (data.metadata !== undefined) {
      updateData.metadata = data.metadata;
    }

    const [row] = await this.db(this.tableName)
      .where({ id })
      .update(updateData)
      .returning('*');

    return this.mapToAttachment(row);
  }

  /**
   * Delete attachment by ID
   */
  async delete(id: string): Promise<void> {
    await this.db(this.tableName).where({ id }).delete();
  }

  /**
   * Delete all attachments for an entity
   * Used when entity is deleted
   */
  async deleteByEntity(entityType: string, entityId: string): Promise<number> {
    return this.db(this.tableName)
      .where({ entity_type: entityType, entity_id: entityId })
      .delete();
  }

  /**
   * Count attachments for an entity
   */
  async countByEntity(
    entityType: string,
    entityId: string,
    attachmentType?: string,
  ): Promise<number> {
    const query = this.db(this.tableName)
      .where({ entity_type: entityType, entity_id: entityId })
      .count('* as count');

    if (attachmentType) {
      query.where({ attachment_type: attachmentType });
    }

    const result = await query.first();
    return parseInt(String(result?.count || '0'), 10);
  }

  /**
   * Reorder attachments for an entity
   * @param fileIds - Array of file IDs in desired order
   */
  async reorder(
    entityType: string,
    entityId: string,
    fileIds: string[],
  ): Promise<void> {
    await this.db.transaction(async (trx) => {
      for (let i = 0; i < fileIds.length; i++) {
        await trx(this.tableName)
          .where({
            entity_type: entityType,
            entity_id: entityId,
            file_id: fileIds[i],
          })
          .update({ display_order: i });
      }
    });
  }

  /**
   * Find all attachments for a specific file
   * Useful for File Management to see where a file is being used
   */
  async findByFileId(fileId: string): Promise<Attachment[]> {
    const rows = await this.db(this.tableName)
      .where({ file_id: fileId })
      .orderBy('created_at', 'desc');

    return rows.map(this.mapToAttachment);
  }

  /**
   * Count attachments for a specific file
   */
  async countByFileId(fileId: string): Promise<number> {
    const result = await this.db(this.tableName)
      .where({ file_id: fileId })
      .count('* as count')
      .first();

    return parseInt(String(result?.count || '0'), 10);
  }

  /**
   * Check if file is already attached to entity
   */
  async isFileAttached(
    entityType: string,
    entityId: string,
    fileId: string,
  ): Promise<boolean> {
    const count = await this.db(this.tableName)
      .where({
        entity_type: entityType,
        entity_id: entityId,
        file_id: fileId,
      })
      .count('* as count')
      .first();

    return parseInt(String(count?.count || '0'), 10) > 0;
  }

  /**
   * Get all file IDs for an entity
   */
  async getFileIds(entityType: string, entityId: string): Promise<string[]> {
    const rows = await this.db(this.tableName)
      .where({ entity_type: entityType, entity_id: entityId })
      .select('file_id')
      .orderBy('display_order', 'asc');

    return rows.map((row) => row.file_id);
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
    // Get total files for user
    const totalFilesResult = await this.db('uploaded_files')
      .where({ uploaded_by: userId })
      .whereNull('deleted_at')
      .count('* as count')
      .first();
    const totalFiles = parseInt(String(totalFilesResult?.count || '0'), 10);

    // Get files with attachments count
    const filesWithAttachmentsResult = await this.db('uploaded_files')
      .where({ 'uploaded_files.uploaded_by': userId })
      .whereNull('uploaded_files.deleted_at')
      .whereExists(
        this.db(this.tableName).whereRaw(
          'attachments.file_id = uploaded_files.id',
        ),
      )
      .count('* as count')
      .first();
    const filesWithAttachments = parseInt(
      String(filesWithAttachmentsResult?.count || '0'),
      10,
    );

    // Get total attachments for user's files
    const totalAttachmentsResult = await this.db(this.tableName)
      .join('uploaded_files', 'attachments.file_id', 'uploaded_files.id')
      .where({ 'uploaded_files.uploaded_by': userId })
      .whereNull('uploaded_files.deleted_at')
      .count('* as count')
      .first();
    const totalAttachments = parseInt(
      String(totalAttachmentsResult?.count || '0'),
      10,
    );

    return {
      totalFiles,
      filesWithAttachments,
      filesWithoutAttachments: totalFiles - filesWithAttachments,
      totalAttachments,
    };
  }

  /**
   * Map database row to Attachment entity
   */
  private mapToAttachment(row: any): Attachment {
    return {
      id: row.id,
      entityType: row.entity_type,
      entityId: row.entity_id,
      fileId: row.file_id,
      attachmentType: row.attachment_type,
      displayOrder: row.display_order,
      metadata: row.metadata || {},
      createdAt: row.created_at,
      createdBy: row.created_by,
      updatedAt: row.updated_at,
    };
  }
}
