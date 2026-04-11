/**
 * Image Preview (Lightbox) Component Type Definitions
 *
 * Full-screen image gallery with navigation, thumbnails, and keyboard support.
 */

/** Image item for the gallery */
export interface PreviewImage {
  /** Unique identifier */
  id: number | string;
  /** Image URL or path (relative paths prefixed automatically) */
  url: string;
  /** Optional alt text / caption */
  caption?: string;
}
