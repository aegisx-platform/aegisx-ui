import { randomBytes } from 'crypto';
import { hash, compare } from 'bcrypt';

/**
 * Crypto Service for API Keys
 *
 * Handles secure cryptographic operations for API key management:
 * - Generating secure random API keys
 * - Hashing keys for storage
 * - Verifying keys against stored hashes
 *
 * Security features:
 * - Uses crypto.randomBytes() for cryptographically secure random generation
 * - Uses bcrypt with cost factor 12 for key hashing
 * - Base64URL encoding (no padding characters for URL safety)
 * - Key format: pk_live_{32_random_bytes_base64url}
 */

export interface GeneratedApiKey {
  key: string; // Full API key: pk_live_{base64url}
  prefix: string; // Display prefix: pk_live_abc...
}

export class CryptoService {
  // API key prefix for identification
  private readonly KEY_PREFIX = 'pk_live';

  // Size of random bytes to generate (32 bytes = 256 bits)
  private readonly RANDOM_BYTES_SIZE = 32;

  // Bcrypt cost factor for hashing (higher = more secure but slower)
  // Cost factor 12 provides good security/performance balance
  private readonly BCRYPT_COST_FACTOR = 12;

  // Length of prefix to display (e.g., "pk_live_abc...")
  private readonly DISPLAY_PREFIX_LENGTH = 16;

  /**
   * Generate a secure API key
   *
   * Returns an object with:
   * - key: The full API key (only shown once at creation)
   * - prefix: Display prefix for UI (shows first 16 chars)
   *
   * Format: pk_live_{base64url_encoded_32_bytes}
   *
   * @returns {GeneratedApiKey} Generated key and prefix
   */
  async generateApiKey(): Promise<GeneratedApiKey> {
    // Generate 32 cryptographically secure random bytes
    const randomBuffer = randomBytes(this.RANDOM_BYTES_SIZE);

    // Convert to base64url (no +, /, = characters for URL safety)
    const base64url = this.toBase64Url(randomBuffer);

    // Construct full key: pk_live_{base64url}
    const fullKey = `${this.KEY_PREFIX}_${base64url}`;

    // Extract prefix for display (first 16 characters)
    const displayPrefix = fullKey.substring(0, this.DISPLAY_PREFIX_LENGTH);

    return {
      key: fullKey,
      prefix: displayPrefix,
    };
  }

  /**
   * Hash an API key using bcrypt
   *
   * The hashed key is stored in the database. The plain key is never stored.
   * Cost factor 12 balances security with performance.
   *
   * @param {string} key - The plain API key to hash
   * @returns {Promise<string>} The bcrypt hash
   * @throws {Error} If hashing fails
   */
  async hashKey(key: string): Promise<string> {
    try {
      const hashedKey = await hash(key, this.BCRYPT_COST_FACTOR);
      return hashedKey;
    } catch (error) {
      throw new Error(
        `Failed to hash API key: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Verify if a provided key matches the stored hash
   *
   * Uses bcrypt.compare() for constant-time comparison to prevent timing attacks.
   *
   * @param {string} key - The plain API key to verify
   * @param {string} hash - The stored bcrypt hash
   * @returns {Promise<boolean>} True if key matches hash, false otherwise
   * @throws {Error} If verification fails
   */
  async verifyKey(key: string, keyHash: string): Promise<boolean> {
    try {
      const matches = await compare(key, keyHash);
      return matches;
    } catch (error) {
      throw new Error(
        `Failed to verify API key: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Convert buffer to base64url encoding
   *
   * Base64url is URL-safe (no +, /, or = characters).
   * This is commonly used for tokens and keys in APIs.
   *
   * @private
   * @param {Buffer} buffer - The buffer to encode
   * @returns {string} Base64url encoded string
   */
  private toBase64Url(buffer: Buffer): string {
    // Convert to base64
    const base64 = buffer.toString('base64');

    // Convert to base64url:
    // - Replace + with -
    // - Replace / with _
    // - Remove = padding
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  /**
   * Convert base64url back to buffer
   *
   * Utility method to decode base64url encoded strings.
   * Useful if we need to parse or manipulate the key.
   *
   * @private
   * @param {string} base64url - The base64url encoded string
   * @returns {Buffer} The decoded buffer
   */
  private fromBase64Url(base64url: string): Buffer {
    // Add padding if needed
    const padded =
      base64url + '==='.substring(0, (4 - (base64url.length % 4)) % 4);

    // Convert back to base64
    const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');

    // Convert to buffer
    return Buffer.from(base64, 'base64');
  }

  /**
   * Extract display prefix from a full API key
   *
   * Used to identify a key without exposing the full secret.
   * Shows first 16 characters (e.g., "pk_live_abc...")
   *
   * @param {string} key - The full API key
   * @returns {string} The display prefix
   */
  extractPrefix(key: string): string {
    return key.substring(0, this.DISPLAY_PREFIX_LENGTH);
  }
}

// Export singleton instance
export const cryptoService = new CryptoService();
