/**
 * Priority Alert Component — Type Definitions
 *
 * A featured-icon alert surface for calling out urgent work on a dashboard
 * or list header. Distinct from <ax-alert> which is a banner-style
 * notification — PriorityAlert is a denser actionable card with chip-style
 * breakdown items and trailing CTAs.
 */

/** Semantic color variant — drives icon bg, left border, default chip colors. */
export type PriorityAlertVariant = 'error' | 'warning' | 'info' | 'success';

/** One breakdown chip inside the alert. */
export interface PriorityAlertChip {
  /** Chip label (e.g. "ค้างจ่าย 2"). */
  label: string;
  /** Color of the indicator dot. Defaults to the alert's variant color. */
  color?: 'error' | 'warning' | 'info' | 'success' | 'neutral';
  /** Optional Angular router link — if set the chip becomes <a>. */
  link?: string | string[];
  /** Optional click handler — alternative to routerLink. */
  onClick?: () => void;
}
