/**
 * Card Header Component Type Definitions
 *
 * Untitled UI "Card Headers" style section header for AegisX UI.
 */

/**
 * Padding / spacing size for the card header.
 *
 * - sm: Compact padding for dense layouts (p-4)
 * - md: Default balanced spacing (p-6) — Untitled UI default
 * - lg: Generous padding for prominent display (p-8)
 */
export type CardHeaderSize = 'sm' | 'md' | 'lg';

/**
 * Content alignment inside the header row.
 *
 * - start: Left-aligned (default)
 * - center: Horizontally centered — used for empty-state-like headers
 */
export type CardHeaderAlign = 'start' | 'center';

/**
 * Color palette for the optional built-in "featured icon" circle.
 *
 * Mirrors Untitled UI's semantic color roles — maps to AegisX `--ax-*` tokens
 * so the icon auto-flips in dark mode.
 */
export type CardHeaderIconColor =
  | 'brand'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral';
