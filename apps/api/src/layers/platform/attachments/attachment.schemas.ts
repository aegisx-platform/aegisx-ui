import { Type, Static } from '@sinclair/typebox';
import {
  ApiSuccessResponseSchema,
  PaginatedResponseSchema,
} from '../../../schemas/base.schemas';

/**
 * Attachment Configuration Schema
 */
export const AttachmentConfigSchema = Type.Object({
  entityType: Type.String({ description: 'Entity type identifier' }),
  allowedTypes: Type.Optional(
    Type.Array(Type.String(), { description: 'Allowed attachment types' }),
  ),
  maxFiles: Type.Optional(
    Type.Integer({ description: 'Maximum files allowed' }),
  ),
  allowedMimeTypes: Type.Optional(
    Type.Array(Type.String(), { description: 'Allowed MIME types' }),
  ),
  maxFileSize: Type.Optional(
    Type.Integer({ description: 'Maximum file size in bytes' }),
  ),
  requireAuth: Type.Optional(
    Type.Boolean({ description: 'Authentication required' }),
  ),
  cascadeDelete: Type.Optional(
    Type.Boolean({ description: 'Delete files when entity deleted' }),
  ),
  metadata: Type.Optional(
    Type.Object({
      required: Type.Optional(Type.Array(Type.String())),
      optional: Type.Optional(Type.Array(Type.String())),
    }),
  ),
  description: Type.Optional(
    Type.String({ description: 'Configuration description' }),
  ),
});

export type AttachmentConfigType = Static<typeof AttachmentConfigSchema>;

/**
 * File info schema (from uploaded_files table)
 */
export const FileInfoSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  originalName: Type.String(),
  filePath: Type.String(),
  fileSize: Type.Integer(),
  mimeType: Type.String(),
  category: Type.String(),
  signedUrls: Type.Optional(
    Type.Object({
      view: Type.String({ format: 'uri' }),
      download: Type.String({ format: 'uri' }),
    }),
  ),
});

/**
 * Attachment schema (core entity)
 */
export const AttachmentSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  entityType: Type.String(),
  entityId: Type.String({ format: 'uuid' }),
  fileId: Type.String({ format: 'uuid' }),
  attachmentType: Type.String(),
  displayOrder: Type.Integer(),
  metadata: Type.Record(Type.String(), Type.Any()),
  createdAt: Type.String({ format: 'date-time' }),
  createdBy: Type.Optional(Type.String({ format: 'uuid' })),
  updatedAt: Type.Optional(Type.String({ format: 'date-time' })),
});

export type AttachmentType = Static<typeof AttachmentSchema>;

/**
 * Attachment with file details
 */
export const AttachmentWithFileSchema = Type.Intersect([
  AttachmentSchema,
  Type.Object({
    file: FileInfoSchema,
  }),
]);

export type AttachmentWithFileType = Static<typeof AttachmentWithFileSchema>;

/**
 * Create attachment request body
 */
export const CreateAttachmentBodySchema = Type.Object(
  {
    entityType: Type.String({
      description: 'Type of entity (e.g., receiving, patient)',
    }),
    entityId: Type.String({ format: 'uuid', description: 'ID of the entity' }),
    fileId: Type.String({
      format: 'uuid',
      description: 'ID of the uploaded file',
    }),
    attachmentType: Type.String({
      description: 'Type of attachment (e.g., photo, document)',
    }),
    metadata: Type.Optional(
      Type.Record(Type.String(), Type.Any(), {
        description: 'Additional metadata',
      }),
    ),
  },
  {
    $id: 'CreateAttachmentBody',
    description: 'Request body for creating an attachment',
  },
);

export type CreateAttachmentBody = Static<typeof CreateAttachmentBodySchema>;

/**
 * Update attachment request body
 */
export const UpdateAttachmentBodySchema = Type.Object(
  {
    attachmentType: Type.Optional(Type.String()),
    displayOrder: Type.Optional(Type.Integer()),
    metadata: Type.Optional(Type.Record(Type.String(), Type.Any())),
  },
  {
    $id: 'UpdateAttachmentBody',
    description: 'Request body for updating an attachment',
  },
);

export type UpdateAttachmentBody = Static<typeof UpdateAttachmentBodySchema>;

/**
 * Bulk attach request body
 */
export const BulkAttachBodySchema = Type.Object(
  {
    entityType: Type.String(),
    entityId: Type.String({ format: 'uuid' }),
    files: Type.Array(
      Type.Object({
        fileId: Type.String({ format: 'uuid' }),
        attachmentType: Type.String(),
        metadata: Type.Optional(Type.Record(Type.String(), Type.Any())),
      }),
    ),
  },
  {
    $id: 'BulkAttachBody',
    description: 'Request body for bulk attaching files',
  },
);

export type BulkAttachBody = Static<typeof BulkAttachBodySchema>;

/**
 * Reorder request body
 */
export const ReorderAttachmentsBodySchema = Type.Object(
  {
    fileIds: Type.Array(Type.String({ format: 'uuid' }), {
      description: 'Array of file IDs in desired order',
    }),
  },
  {
    $id: 'ReorderAttachmentsBody',
    description: 'Request body for reordering attachments',
  },
);

export type ReorderAttachmentsBody = Static<
  typeof ReorderAttachmentsBodySchema
>;

/**
 * Path parameters
 */
export const EntityParamsSchema = Type.Object(
  {
    entityType: Type.String({ description: 'Entity type' }),
    entityId: Type.String({ format: 'uuid', description: 'Entity ID' }),
  },
  {
    $id: 'EntityParams',
  },
);

export type EntityParams = Static<typeof EntityParamsSchema>;

export const EntityTypeParamSchema = Type.Object(
  {
    entityType: Type.String({ description: 'Entity type' }),
  },
  {
    $id: 'EntityTypeParam',
  },
);

export type EntityTypeParam = Static<typeof EntityTypeParamSchema>;

export const AttachmentIdParamSchema = Type.Object(
  {
    attachmentId: Type.String({ format: 'uuid', description: 'Attachment ID' }),
  },
  {
    $id: 'AttachmentIdParam',
  },
);

export type AttachmentIdParam = Static<typeof AttachmentIdParamSchema>;

/**
 * Query parameters
 */
export const GetAttachmentsQuerySchema = Type.Object(
  {
    attachmentType: Type.Optional(
      Type.String({ description: 'Filter by attachment type' }),
    ),
  },
  {
    $id: 'GetAttachmentsQuery',
  },
);

export type GetAttachmentsQuery = Static<typeof GetAttachmentsQuerySchema>;

/**
 * Response schemas
 */
export const AttachmentResponseSchema =
  ApiSuccessResponseSchema(AttachmentSchema);

export const AttachmentWithFileResponseSchema = ApiSuccessResponseSchema(
  AttachmentWithFileSchema,
);

export const AttachmentListResponseSchema = ApiSuccessResponseSchema(
  Type.Array(AttachmentWithFileSchema),
);

export const AttachmentConfigResponseSchema = ApiSuccessResponseSchema(
  AttachmentConfigSchema,
);

export const BulkAttachResponseSchema = ApiSuccessResponseSchema(
  Type.Array(AttachmentSchema),
);

/**
 * Export types
 */
export type AttachmentResponse = Static<typeof AttachmentResponseSchema>;
export type AttachmentWithFileResponse = Static<
  typeof AttachmentWithFileResponseSchema
>;
export type AttachmentListResponse = Static<
  typeof AttachmentListResponseSchema
>;
export type AttachmentConfigResponse = Static<
  typeof AttachmentConfigResponseSchema
>;
export type BulkAttachResponse = Static<typeof BulkAttachResponseSchema>;
