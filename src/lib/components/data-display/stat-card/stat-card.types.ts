/**
 * Stat Card Component Type Definitions
 *
 * Type definitions for the Stat Card component (@aegisx/ui).
 * Designed for list page headers — icon + value + label with clickable filter mode.
 */

/**
 * Semantic color for the stat card.
 * Controls icon background color and active border color.
 */
export type StatCardColor =
  | 'primary'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

/**
 * Whether the value text follows the semantic `color` prop or stays neutral.
 *
 * - `neutral` (default): value uses `--ax-text-heading` (near-black light /
 *   white dark, with a `#09090b` fallback when no theme is applied). The
 *   icon badge still carries the accent. Right for dashboards where the
 *   number is data, not a warning — the Untitled UI / enterprise-SaaS look.
 * - `accent`: value inherits the tint from `color` (blue/amber/red/green).
 *   Right for cards whose sole purpose is to scream an urgent number.
 *
 * Breaking change note: this default flipped from accent → neutral so new
 * dashboards look cohesive without extra props. Existing pages that relied
 * on tinted values must opt back in with `valueColor="accent"`.
 */
export type StatCardValueColor = 'accent' | 'neutral';

/**
 * Layout variant for the stat card.
 *
 * - `compact` (default): label top-right with small icon badge, big value below.
 *   Good for dense KPI dashboards where numeric insight is primary.
 * - `icon-leading`: large 48px icon badge on the left, value + label stacked
 *   on the right. Good for workflow status cards where the icon carries
 *   meaning (draft/inspecting/accepted) and users scan by icon first.
 * - `hero`: small uppercase label top, oversized 32px value, subtle delta
 *   chip, and a ghost icon watermarked in the bottom-right corner. Active
 *   state adds a colored ring + colored value/icon (no bg tint). Good for
 *   landing/dashboard headers where the number is the hero and the icon is
 *   a secondary scanning cue.
 */
export type StatCardVariant = 'compact' | 'icon-leading' | 'hero';
