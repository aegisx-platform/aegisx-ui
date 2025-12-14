import * as crypto from 'crypto';

/**
 * Encrypted Data Structure
 * Contains encrypted buffer, IV, and authentication tag
 */
export interface EncryptedData {
  encrypted: Buffer;
  iv: Buffer;
  authTag: Buffer;
}

/**
 * Encryption Configuration
 */
export interface EncryptionConfig {
  encryptionKey: string; // Base64-encoded 32-byte key
  algorithm?: string; // Default: aes-256-gcm
}

/**
 * EncryptionService
 *
 * Provides AES-256-GCM encryption for file content and sensitive metadata.
 * Uses authenticated encryption to ensure data integrity and confidentiality.
 *
 * Features:
 * - AES-256-GCM encryption (authenticated encryption)
 * - Unique IV generation for each encryption
 * - Secure key management from environment
 * - Support for both file buffers and metadata
 * - Authentication tags for data integrity verification
 *
 * Security Notes:
 * - Never reuse IVs with the same key
 * - Store IVs and auth tags alongside encrypted data
 * - Rotate encryption keys periodically
 * - Use strong, randomly generated keys (32 bytes for AES-256)
 *
 * Example Usage:
 * ```typescript
 * const service = new EncryptionService({
 *   encryptionKey: process.env.FILE_ENCRYPTION_KEY
 * });
 *
 * // Encrypt file
 * const encrypted = await service.encryptFile(fileBuffer);
 *
 * // Decrypt file
 * const decrypted = await service.decryptFile(
 *   encrypted.encrypted,
 *   encrypted.iv,
 *   encrypted.authTag
 * );
 *
 * // Encrypt metadata
 * const encryptedMeta = await service.encryptMetadata({
 *   patientId: '123',
 *   diagnosis: 'Confidential'
 * });
 * ```
 */
export class EncryptionService {
  private readonly algorithm: string;
  private readonly key: Buffer;

  constructor(private config: EncryptionConfig) {
    this.algorithm = config.algorithm || 'aes-256-gcm';

    // Decode base64 encryption key
    this.key = Buffer.from(config.encryptionKey, 'base64');

    // Validate key length (must be 32 bytes for AES-256)
    if (this.key.length !== 32) {
      throw new Error(
        `Invalid encryption key length: ${this.key.length} bytes. AES-256 requires 32 bytes.`,
      );
    }
  }

  /**
   * Encrypt file buffer
   *
   * @param fileBuffer - File content to encrypt
   * @returns Encrypted data with IV and auth tag
   */
  async encryptFile(fileBuffer: Buffer): Promise<EncryptedData> {
    // Generate unique IV (12 bytes for GCM mode)
    const iv = crypto.randomBytes(12);

    // Create cipher
    const cipher = crypto.createCipheriv(
      this.algorithm,
      this.key,
      iv,
    ) as crypto.CipherGCM;

    // Encrypt data
    const encrypted = Buffer.concat([
      cipher.update(fileBuffer),
      cipher.final(),
    ]);

    // Get authentication tag (16 bytes for GCM)
    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      iv,
      authTag,
    };
  }

  /**
   * Decrypt file buffer
   *
   * @param encryptedBuffer - Encrypted file content
   * @param iv - Initialization vector used during encryption
   * @param authTag - Authentication tag for verification
   * @returns Decrypted file buffer
   * @throws Error if authentication fails or decryption fails
   */
  async decryptFile(
    encryptedBuffer: Buffer,
    iv: Buffer,
    authTag: Buffer,
  ): Promise<Buffer> {
    // Create decipher
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.key,
      iv,
    ) as crypto.DecipherGCM;

    // Set authentication tag
    decipher.setAuthTag(authTag);

    try {
      // Decrypt data
      const decrypted = Buffer.concat([
        decipher.update(encryptedBuffer),
        decipher.final(),
      ]);

      return decrypted;
    } catch (error) {
      throw new Error(
        `Decryption failed: ${error.message}. Data may be corrupted or tampered.`,
      );
    }
  }

  /**
   * Encrypt metadata object
   *
   * @param metadata - Metadata object to encrypt
   * @returns Encrypted metadata string (base64-encoded)
   */
  async encryptMetadata(metadata: Record<string, any>): Promise<string> {
    // Convert metadata to JSON
    const metadataJson = JSON.stringify(metadata);
    const metadataBuffer = Buffer.from(metadataJson, 'utf8');

    // Encrypt
    const { encrypted, iv, authTag } = await this.encryptFile(metadataBuffer);

    // Combine IV + authTag + encrypted data
    const combined = Buffer.concat([iv, authTag, encrypted]);

    // Return as base64 string
    return combined.toString('base64');
  }

  /**
   * Decrypt metadata string
   *
   * @param encryptedMetadata - Base64-encoded encrypted metadata
   * @returns Decrypted metadata object
   */
  async decryptMetadata(
    encryptedMetadata: string,
  ): Promise<Record<string, any>> {
    // Decode base64
    const combined = Buffer.from(encryptedMetadata, 'base64');

    // Extract IV (12 bytes), authTag (16 bytes), and encrypted data
    const iv = combined.subarray(0, 12);
    const authTag = combined.subarray(12, 28);
    const encrypted = combined.subarray(28);

    // Decrypt
    const decrypted = await this.decryptFile(encrypted, iv, authTag);

    // Parse JSON
    const metadataJson = decrypted.toString('utf8');
    return JSON.parse(metadataJson);
  }

  /**
   * Encrypt specific metadata fields
   *
   * Useful for encrypting only sensitive fields while keeping others in plain text.
   *
   * @param metadata - Full metadata object
   * @param fieldsToEncrypt - Array of field names to encrypt
   * @returns Metadata object with encrypted fields
   */
  async encryptMetadataFields(
    metadata: Record<string, any>,
    fieldsToEncrypt: string[],
  ): Promise<Record<string, any>> {
    const result = { ...metadata };

    for (const field of fieldsToEncrypt) {
      if (metadata[field] !== undefined && metadata[field] !== null) {
        // Encrypt the field value
        const value = String(metadata[field]);
        const encrypted = await this.encryptMetadata({ [field]: value });
        result[field] = encrypted;
      }
    }

    return result;
  }

  /**
   * Decrypt specific metadata fields
   *
   * @param metadata - Metadata object with encrypted fields
   * @param fieldsToDecrypt - Array of field names to decrypt
   * @returns Metadata object with decrypted fields
   */
  async decryptMetadataFields(
    metadata: Record<string, any>,
    fieldsToDecrypt: string[],
  ): Promise<Record<string, any>> {
    const result = { ...metadata };

    for (const field of fieldsToDecrypt) {
      if (metadata[field] !== undefined && metadata[field] !== null) {
        try {
          // Decrypt the field value
          const decrypted = await this.decryptMetadata(String(metadata[field]));
          result[field] = decrypted[field];
        } catch (_error) {
          // Keep encrypted value if decryption fails
          result[field] = metadata[field];
        }
      }
    }

    return result;
  }

  /**
   * Generate a new encryption key (32 bytes for AES-256)
   *
   * @returns Base64-encoded encryption key
   */
  static generateKey(): string {
    const key = crypto.randomBytes(32);
    return key.toString('base64');
  }

  /**
   * Validate encryption key format
   *
   * @param key - Base64-encoded key to validate
   * @returns true if valid, false otherwise
   */
  static validateKey(key: string): boolean {
    try {
      const buffer = Buffer.from(key, 'base64');
      return buffer.length === 32;
    } catch {
      return false;
    }
  }

  /**
   * Check if encryption is enabled
   *
   * @returns true if encryption key is configured
   */
  isEnabled(): boolean {
    return this.key.length === 32;
  }
}

/**
 * Create EncryptionService instance from environment
 *
 * @returns EncryptionService instance or null if encryption is disabled
 */
export function createEncryptionService(): EncryptionService | null {
  const encryptionKey = process.env.FILE_ENCRYPTION_KEY;

  if (!encryptionKey) {
    return null;
  }

  return new EncryptionService({ encryptionKey });
}
