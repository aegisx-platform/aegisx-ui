/**
 * File Category Configuration
 *
 * Defines category-specific settings for file uploads including:
 * - Allowed MIME types
 * - File size limits
 * - Processing options (compression, encryption, thumbnails)
 * - Access control defaults
 * - Storage configuration
 */

/**
 * File Category
 */
export enum FileCategory {
  // General categories
  AVATAR = 'avatar',
  DOCUMENT = 'document',
  IMAGE = 'image',
  MEDIA = 'media',

  // HIS (Hospital Information System) categories
  MEDICAL_IMAGE = 'medical_image', // X-rays, CT scans, MRI, etc.
  LAB_RESULT = 'lab_result', // Laboratory test results
  PRESCRIPTION = 'prescription', // Prescription documents
  PATIENT_RECORD = 'patient_record', // General patient documents
  CONSENT_FORM = 'consent_form', // Patient consent forms
  DISCHARGE_SUMMARY = 'discharge_summary', // Discharge summaries

  // Inventory categories
  PRODUCT_IMAGE = 'product_image', // Product photos
  BARCODE = 'barcode', // Barcode images
  INVOICE = 'invoice', // Invoice documents
  PURCHASE_ORDER = 'purchase_order', // Purchase order documents
  RECEIPT = 'receipt', // Receipt images/documents
}

/**
 * Category Configuration
 */
export interface CategoryConfig {
  // Basic info
  category: FileCategory;
  label: string;
  description: string;

  // Validation
  allowedMimeTypes: string[];
  maxFileSize: number; // bytes
  minFileSize?: number; // bytes

  // Processing options
  requireCompression: boolean; // Auto-compress images
  requireEncryption: boolean; // Encrypt file content
  generateThumbnails: boolean; // Generate image thumbnails
  thumbnailSizes?: number[]; // Thumbnail sizes in pixels

  // Access control defaults
  defaultPublic: boolean; // Files public by default?
  defaultTemporary: boolean; // Files temporary by default?
  defaultExpiresIn?: number; // Default expiration (seconds)
  requireAuth: boolean; // Require authentication to access

  // Storage
  storagePrefix: string; // Prefix for storage path
  retentionDays?: number; // How long to keep files (0 = forever)

  // HIS-specific
  isPHI?: boolean; // Protected Health Information (requires extra security)
  requireAuditLog?: boolean; // All operations must be audited
  restrictedToRoles?: string[]; // Only specific roles can upload
}

/**
 * Category configuration registry
 */
export const CATEGORY_CONFIGS: Record<FileCategory, CategoryConfig> = {
  // ===== GENERAL CATEGORIES =====

  [FileCategory.AVATAR]: {
    category: FileCategory.AVATAR,
    label: 'Profile Picture',
    description: 'User profile pictures and avatars',
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSize: 5 * 1024 * 1024, // 5 MB
    minFileSize: 1024, // 1 KB
    requireCompression: true,
    requireEncryption: false,
    generateThumbnails: true,
    thumbnailSizes: [48, 96, 192, 384], // Small, medium, large, xlarge
    defaultPublic: true,
    defaultTemporary: false,
    requireAuth: false,
    storagePrefix: 'avatar',
    retentionDays: 0, // Keep forever
  },

  [FileCategory.DOCUMENT]: {
    category: FileCategory.DOCUMENT,
    label: 'Document',
    description: 'General document files (PDF, Word, Excel, etc.)',
    allowedMimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'text/csv',
    ],
    maxFileSize: 50 * 1024 * 1024, // 50 MB
    requireCompression: false,
    requireEncryption: false,
    generateThumbnails: false,
    defaultPublic: false,
    defaultTemporary: false,
    requireAuth: true,
    storagePrefix: 'document',
    retentionDays: 0,
  },

  [FileCategory.IMAGE]: {
    category: FileCategory.IMAGE,
    label: 'Image',
    description: 'General image files',
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ],
    maxFileSize: 20 * 1024 * 1024, // 20 MB
    requireCompression: true,
    requireEncryption: false,
    generateThumbnails: true,
    thumbnailSizes: [200, 400, 800], // Thumbnail, medium, large
    defaultPublic: false,
    defaultTemporary: false,
    requireAuth: true,
    storagePrefix: 'image',
    retentionDays: 0,
  },

  [FileCategory.MEDIA]: {
    category: FileCategory.MEDIA,
    label: 'Media',
    description: 'Video and audio files',
    allowedMimeTypes: [
      'video/mp4',
      'video/mpeg',
      'video/quicktime',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
    ],
    maxFileSize: 500 * 1024 * 1024, // 500 MB
    requireCompression: false,
    requireEncryption: false,
    generateThumbnails: false,
    defaultPublic: false,
    defaultTemporary: false,
    requireAuth: true,
    storagePrefix: 'media',
    retentionDays: 0,
  },

  // ===== HIS CATEGORIES =====

  [FileCategory.MEDICAL_IMAGE]: {
    category: FileCategory.MEDICAL_IMAGE,
    label: 'Medical Image',
    description: 'Medical imaging files (X-ray, CT, MRI, ultrasound)',
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'application/dicom', // DICOM format for medical images
      'image/tiff',
    ],
    maxFileSize: 100 * 1024 * 1024, // 100 MB (medical images can be large)
    requireCompression: false, // Don't compress medical images (preserve quality)
    requireEncryption: true, // PHI - must be encrypted
    generateThumbnails: true,
    thumbnailSizes: [200, 400],
    defaultPublic: false,
    defaultTemporary: false,
    requireAuth: true,
    storagePrefix: 'medical-image',
    retentionDays: 3650, // 10 years (HIPAA requirement)
    isPHI: true,
    requireAuditLog: true,
    restrictedToRoles: ['doctor', 'nurse', 'radiologist', 'admin'],
  },

  [FileCategory.LAB_RESULT]: {
    category: FileCategory.LAB_RESULT,
    label: 'Lab Result',
    description: 'Laboratory test results and reports',
    allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxFileSize: 10 * 1024 * 1024, // 10 MB
    requireCompression: false,
    requireEncryption: true, // PHI - must be encrypted
    generateThumbnails: true,
    thumbnailSizes: [200],
    defaultPublic: false,
    defaultTemporary: false,
    requireAuth: true,
    storagePrefix: 'lab-result',
    retentionDays: 3650, // 10 years
    isPHI: true,
    requireAuditLog: true,
    restrictedToRoles: ['doctor', 'nurse', 'lab_technician', 'admin'],
  },

  [FileCategory.PRESCRIPTION]: {
    category: FileCategory.PRESCRIPTION,
    label: 'Prescription',
    description: 'Medical prescriptions',
    allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxFileSize: 5 * 1024 * 1024, // 5 MB
    requireCompression: false,
    requireEncryption: true, // PHI - must be encrypted
    generateThumbnails: true,
    thumbnailSizes: [200],
    defaultPublic: false,
    defaultTemporary: false,
    requireAuth: true,
    storagePrefix: 'prescription',
    retentionDays: 2555, // 7 years (pharmacy requirement)
    isPHI: true,
    requireAuditLog: true,
    restrictedToRoles: ['doctor', 'pharmacist', 'admin'],
  },

  [FileCategory.PATIENT_RECORD]: {
    category: FileCategory.PATIENT_RECORD,
    label: 'Patient Record',
    description: 'General patient medical records',
    allowedMimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
    ],
    maxFileSize: 25 * 1024 * 1024, // 25 MB
    requireCompression: false,
    requireEncryption: true, // PHI - must be encrypted
    generateThumbnails: false,
    defaultPublic: false,
    defaultTemporary: false,
    requireAuth: true,
    storagePrefix: 'patient-record',
    retentionDays: 3650, // 10 years
    isPHI: true,
    requireAuditLog: true,
    restrictedToRoles: ['doctor', 'nurse', 'admin'],
  },

  [FileCategory.CONSENT_FORM]: {
    category: FileCategory.CONSENT_FORM,
    label: 'Consent Form',
    description: 'Patient consent and authorization forms',
    allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxFileSize: 10 * 1024 * 1024, // 10 MB
    requireCompression: false,
    requireEncryption: true, // PHI - must be encrypted
    generateThumbnails: true,
    thumbnailSizes: [200],
    defaultPublic: false,
    defaultTemporary: false,
    requireAuth: true,
    storagePrefix: 'consent-form',
    retentionDays: 3650, // 10 years
    isPHI: true,
    requireAuditLog: true,
    restrictedToRoles: ['doctor', 'nurse', 'admin'],
  },

  [FileCategory.DISCHARGE_SUMMARY]: {
    category: FileCategory.DISCHARGE_SUMMARY,
    label: 'Discharge Summary',
    description: 'Hospital discharge summaries',
    allowedMimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    maxFileSize: 10 * 1024 * 1024, // 10 MB
    requireCompression: false,
    requireEncryption: true, // PHI - must be encrypted
    generateThumbnails: false,
    defaultPublic: false,
    defaultTemporary: false,
    requireAuth: true,
    storagePrefix: 'discharge-summary',
    retentionDays: 3650, // 10 years
    isPHI: true,
    requireAuditLog: true,
    restrictedToRoles: ['doctor', 'nurse', 'admin'],
  },

  // ===== INVENTORY CATEGORIES =====

  [FileCategory.PRODUCT_IMAGE]: {
    category: FileCategory.PRODUCT_IMAGE,
    label: 'Product Image',
    description: 'Product photos for inventory',
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSize: 10 * 1024 * 1024, // 10 MB
    requireCompression: true,
    requireEncryption: false,
    generateThumbnails: true,
    thumbnailSizes: [100, 300, 600], // Thumbnail, medium, large
    defaultPublic: true,
    defaultTemporary: false,
    requireAuth: false,
    storagePrefix: 'product-image',
    retentionDays: 0,
  },

  [FileCategory.BARCODE]: {
    category: FileCategory.BARCODE,
    label: 'Barcode',
    description: 'Barcode images for products',
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml'],
    maxFileSize: 2 * 1024 * 1024, // 2 MB
    requireCompression: false, // Don't compress barcodes
    requireEncryption: false,
    generateThumbnails: false,
    defaultPublic: false,
    defaultTemporary: false,
    requireAuth: true,
    storagePrefix: 'barcode',
    retentionDays: 0,
  },

  [FileCategory.INVOICE]: {
    category: FileCategory.INVOICE,
    label: 'Invoice',
    description: 'Invoice documents',
    allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxFileSize: 10 * 1024 * 1024, // 10 MB
    requireCompression: false,
    requireEncryption: false,
    generateThumbnails: true,
    thumbnailSizes: [200],
    defaultPublic: false,
    defaultTemporary: false,
    requireAuth: true,
    storagePrefix: 'invoice',
    retentionDays: 2555, // 7 years (tax requirement)
    requireAuditLog: true,
  },

  [FileCategory.PURCHASE_ORDER]: {
    category: FileCategory.PURCHASE_ORDER,
    label: 'Purchase Order',
    description: 'Purchase order documents',
    allowedMimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    maxFileSize: 10 * 1024 * 1024, // 10 MB
    requireCompression: false,
    requireEncryption: false,
    generateThumbnails: false,
    defaultPublic: false,
    defaultTemporary: false,
    requireAuth: true,
    storagePrefix: 'purchase-order',
    retentionDays: 2555, // 7 years
    requireAuditLog: true,
  },

  [FileCategory.RECEIPT]: {
    category: FileCategory.RECEIPT,
    label: 'Receipt',
    description: 'Receipt images and documents',
    allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxFileSize: 5 * 1024 * 1024, // 5 MB
    requireCompression: false,
    requireEncryption: false,
    generateThumbnails: true,
    thumbnailSizes: [200],
    defaultPublic: false,
    defaultTemporary: false,
    requireAuth: true,
    storagePrefix: 'receipt',
    retentionDays: 2555, // 7 years
    requireAuditLog: true,
  },
};

/**
 * Get category configuration
 */
export function getCategoryConfig(category: FileCategory): CategoryConfig {
  const config = CATEGORY_CONFIGS[category];

  if (!config) {
    throw new Error(`Unknown file category: ${category}`);
  }

  return config;
}

/**
 * Validate if MIME type is allowed for category
 */
export function isAllowedMimeType(
  category: FileCategory,
  mimeType: string,
): boolean {
  const config = getCategoryConfig(category);
  return config.allowedMimeTypes.includes(mimeType);
}

/**
 * Validate file size for category
 */
export function isValidFileSize(
  category: FileCategory,
  fileSize: number,
): boolean {
  const config = getCategoryConfig(category);

  if (fileSize > config.maxFileSize) {
    return false;
  }

  if (config.minFileSize && fileSize < config.minFileSize) {
    return false;
  }

  return true;
}

/**
 * Get all available categories
 */
export function getAllCategories(): FileCategory[] {
  return Object.values(FileCategory);
}

/**
 * Get categories by use case
 */
export function getCategoriesByUseCase(
  useCase: 'general' | 'his' | 'inventory',
): FileCategory[] {
  switch (useCase) {
    case 'general':
      return [
        FileCategory.AVATAR,
        FileCategory.DOCUMENT,
        FileCategory.IMAGE,
        FileCategory.MEDIA,
      ];

    case 'his':
      return [
        FileCategory.MEDICAL_IMAGE,
        FileCategory.LAB_RESULT,
        FileCategory.PRESCRIPTION,
        FileCategory.PATIENT_RECORD,
        FileCategory.CONSENT_FORM,
        FileCategory.DISCHARGE_SUMMARY,
      ];

    case 'inventory':
      return [
        FileCategory.PRODUCT_IMAGE,
        FileCategory.BARCODE,
        FileCategory.INVOICE,
        FileCategory.PURCHASE_ORDER,
        FileCategory.RECEIPT,
      ];

    default:
      return getAllCategories();
  }
}

/**
 * Get PHI (Protected Health Information) categories
 */
export function getPHICategories(): FileCategory[] {
  return getAllCategories().filter((cat) => {
    const config = getCategoryConfig(cat);
    return config.isPHI === true;
  });
}

/**
 * Check if category requires encryption
 */
export function requiresEncryption(category: FileCategory): boolean {
  const config = getCategoryConfig(category);
  return config.requireEncryption;
}

/**
 * Check if category requires audit logging
 */
export function requiresAuditLog(category: FileCategory): boolean {
  const config = getCategoryConfig(category);
  return config.requireAuditLog === true;
}
