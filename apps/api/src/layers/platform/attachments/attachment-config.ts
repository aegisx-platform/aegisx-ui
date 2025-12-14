/**
 * Attachment Configuration Registry
 *
 * This is a config-driven system where you can add new entity types
 * by simply adding a new entry to ATTACHMENT_CONFIGS.
 *
 * No need to create new tables, repositories, or services!
 */

export interface AttachmentConfig {
  /** Entity type identifier (must be unique) */
  entityType: string;

  /** Allowed attachment types for this entity */
  allowedTypes?: string[];

  /** Maximum number of files allowed per entity */
  maxFiles?: number;

  /** Allowed MIME types (e.g., ['image/*', 'application/pdf']) */
  allowedMimeTypes?: string[];

  /** Maximum file size in bytes */
  maxFileSize?: number;

  /** Require authentication to attach files */
  requireAuth?: boolean;

  /** Delete files from storage when entity is deleted */
  cascadeDelete?: boolean;

  /** Metadata configuration */
  metadata?: {
    /** Required metadata fields */
    required?: string[];
    /** Optional metadata fields */
    optional?: string[];
  };

  /** Description of this entity type (for documentation) */
  description?: string;
}

/**
 * ✨ ATTACHMENT CONFIGURATION REGISTRY
 *
 * Add new entity types here to enable file attachments for them.
 * Everything else (repository, service, routes) is already generic!
 */
export const ATTACHMENT_CONFIGS: Record<string, AttachmentConfig> = {
  // ========================================
  // INVENTORY MODULE
  // ========================================

  /**
   * Inventory Receiving Attachments
   * Used for: delivery photos, delivery notes, signatures, etc.
   */
  receiving: {
    entityType: 'receiving',
    allowedTypes: [
      'photo',
      'delivery-note',
      'signature',
      'packing-slip',
      'other',
    ],
    maxFiles: 20,
    allowedMimeTypes: ['image/*', 'application/pdf'],
    maxFileSize: 10 * 1024 * 1024, // 10MB
    requireAuth: true,
    cascadeDelete: false, // Keep for audit trail
    metadata: {
      required: ['receivingNumber'],
      optional: ['supplierName', 'warehouseLocation', 'notes'],
    },
    description: 'Attachments for inventory receiving documents',
  },

  /**
   * Purchase Order Attachments
   * Used for: PO documents, vendor quotes, contracts
   */
  order: {
    entityType: 'order',
    allowedTypes: ['purchase-order', 'quote', 'contract', 'invoice', 'receipt'],
    maxFiles: 10,
    allowedMimeTypes: [
      'application/pdf',
      'image/*',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    maxFileSize: 20 * 1024 * 1024, // 20MB
    requireAuth: true,
    cascadeDelete: false,
    metadata: {
      required: ['orderNumber'],
      optional: ['supplierName', 'totalAmount', 'approvalStatus'],
    },
    description: 'Attachments for purchase orders',
  },

  /**
   * Product Attachments
   * Used for: product images, manuals, certificates
   */
  product: {
    entityType: 'product',
    allowedTypes: ['image', 'manual', 'certificate', 'specification', 'other'],
    maxFiles: 15,
    allowedMimeTypes: ['image/*', 'application/pdf'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    requireAuth: true,
    cascadeDelete: true, // Delete with product
    metadata: {
      optional: ['productSku', 'productName', 'category'],
    },
    description: 'Attachments for products',
  },

  // ========================================
  // HIS (Hospital Information System) MODULE
  // ========================================

  /**
   * Patient File Attachments
   * Used for: medical records, lab results, x-rays, etc.
   * HIPAA/Privacy sensitive
   */
  patient: {
    entityType: 'patient',
    allowedTypes: [
      'medical-record',
      'lab-result',
      'xray',
      'ct-scan',
      'mri',
      'ultrasound',
      'prescription',
      'consent-form',
      'insurance-card',
      'photo',
      'other',
    ],
    maxFiles: 100, // Patients can have many files
    allowedMimeTypes: [
      'image/*',
      'application/pdf',
      'application/dicom', // Medical imaging format
    ],
    maxFileSize: 50 * 1024 * 1024, // 50MB for medical imaging
    requireAuth: true,
    cascadeDelete: false, // NEVER delete patient files
    metadata: {
      required: ['patientId', 'recordType'],
      optional: ['visitId', 'doctorId', 'department', 'recordDate', 'notes'],
    },
    description: 'Medical attachments for patients (HIPAA compliant)',
  },

  /**
   * Doctor/Visit Notes Attachments
   */
  visit: {
    entityType: 'visit',
    allowedTypes: ['note', 'prescription', 'lab-order', 'referral', 'photo'],
    maxFiles: 20,
    allowedMimeTypes: ['image/*', 'application/pdf'],
    maxFileSize: 10 * 1024 * 1024,
    requireAuth: true,
    cascadeDelete: false,
    metadata: {
      required: ['visitId', 'patientId'],
      optional: ['doctorId', 'visitDate'],
    },
    description: 'Attachments for doctor visits',
  },

  // ========================================
  // GENERAL/SYSTEM MODULE
  // ========================================

  /**
   * Document Attachments (Generic)
   * Used for: general documents, forms, etc.
   */
  document: {
    entityType: 'document',
    allowedTypes: ['form', 'image', 'spreadsheet', 'presentation', 'other'],
    maxFiles: 50,
    allowedMimeTypes: ['*'], // Allow all file types
    maxFileSize: 25 * 1024 * 1024, // 25MB
    requireAuth: true,
    cascadeDelete: true,
    metadata: {
      optional: ['documentTitle', 'category', 'tags'],
    },
    description: 'Generic document attachments',
  },

  /**
   * User Profile Attachments
   * Used for: avatar/profile picture (single file)
   */
  'user-profile': {
    entityType: 'user-profile',
    allowedTypes: ['avatar'],
    maxFiles: 1, // Single file only
    allowedMimeTypes: ['image/*'],
    maxFileSize: 2 * 1024 * 1024, // 2MB
    requireAuth: true,
    cascadeDelete: true,
    description: 'User profile avatar (single file)',
  },

  /**
   * Supplier Attachments
   * Used for: contracts, licenses, certificates
   */
  supplier: {
    entityType: 'supplier',
    allowedTypes: [
      'contract',
      'license',
      'certificate',
      'tax-document',
      'other',
    ],
    maxFiles: 15,
    allowedMimeTypes: ['application/pdf', 'image/*'],
    maxFileSize: 10 * 1024 * 1024,
    requireAuth: true,
    cascadeDelete: false,
    metadata: {
      required: ['supplierId'],
      optional: ['supplierName', 'documentType', 'expiryDate'],
    },
    description: 'Supplier-related documents',
  },

  // ========================================
  // ✨ ADD MORE ENTITY TYPES BELOW
  // ========================================
  //
  // Example:
  // 'appointment': {
  //   entityType: 'appointment',
  //   allowedTypes: ['confirmation', 'reminder', 'note'],
  //   maxFiles: 5,
  //   ...
  // },
};

/**
 * Get configuration for an entity type
 * @throws Error if entity type not found
 */
export function getAttachmentConfig(entityType: string): AttachmentConfig {
  const config = ATTACHMENT_CONFIGS[entityType];
  if (!config) {
    throw new Error(
      `Unknown entity type: "${entityType}". ` +
        `Available types: ${Object.keys(ATTACHMENT_CONFIGS).join(', ')}`,
    );
  }
  return config;
}

/**
 * Check if an entity type is configured
 */
export function isEntityTypeSupported(entityType: string): boolean {
  return entityType in ATTACHMENT_CONFIGS;
}

/**
 * Get all configured entity types
 */
export function getAllEntityTypes(): string[] {
  return Object.keys(ATTACHMENT_CONFIGS);
}

/**
 * Validate attachment against config
 * @throws Error if validation fails
 */
export function validateAttachment(params: {
  entityType: string;
  attachmentType: string;
  fileCount: number;
  fileSize?: number;
  mimeType?: string;
}): void {
  const config = getAttachmentConfig(params.entityType);

  // Validate attachment type
  if (
    config.allowedTypes &&
    !config.allowedTypes.includes(params.attachmentType)
  ) {
    throw new Error(
      `Invalid attachment type "${params.attachmentType}" for entity "${params.entityType}". ` +
        `Allowed types: ${config.allowedTypes.join(', ')}`,
    );
  }

  // Validate max files
  if (config.maxFiles !== undefined && params.fileCount >= config.maxFiles) {
    throw new Error(
      `Maximum ${config.maxFiles} files allowed for entity type "${params.entityType}"`,
    );
  }

  // Validate file size
  if (
    params.fileSize &&
    config.maxFileSize &&
    params.fileSize > config.maxFileSize
  ) {
    const maxSizeMB = (config.maxFileSize / (1024 * 1024)).toFixed(2);
    throw new Error(
      `File size exceeds maximum allowed (${maxSizeMB}MB) for entity type "${params.entityType}"`,
    );
  }

  // Validate MIME type
  if (
    params.mimeType &&
    config.allowedMimeTypes &&
    config.allowedMimeTypes.length > 0
  ) {
    // Skip validation if '*' is allowed
    if (!config.allowedMimeTypes.includes('*')) {
      const isAllowed = config.allowedMimeTypes.some((allowed) => {
        // Handle wildcards (e.g., 'image/*')
        if (allowed.includes('*')) {
          const baseType = allowed.split('/')[0];
          return params.mimeType!.startsWith(baseType + '/');
        }
        return params.mimeType === allowed;
      });

      if (!isAllowed) {
        throw new Error(
          `File type "${params.mimeType}" not allowed for entity "${params.entityType}". ` +
            `Allowed types: ${config.allowedMimeTypes.join(', ')}`,
        );
      }
    }
  }
}

/**
 * Validate required metadata fields
 * @throws Error if required fields are missing
 */
export function validateMetadata(
  entityType: string,
  metadata: Record<string, any>,
): void {
  const config = getAttachmentConfig(entityType);

  if (config.metadata?.required) {
    const missingFields = config.metadata.required.filter(
      (field) =>
        !metadata ||
        !(field in metadata) ||
        metadata[field] === undefined ||
        metadata[field] === null,
    );

    if (missingFields.length > 0) {
      throw new Error(
        `Missing required metadata fields for entity "${entityType}": ${missingFields.join(', ')}`,
      );
    }
  }
}
