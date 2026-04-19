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
 * Layout variant for the stat card. The first three are "text-only" — value
 * + label ± icon ± subtitle. The last six add a **visual data payload**
 * (sparkline / ring / bar / chips / status dot) for dashboards that need
 * to tell a richer story than a single number.
 *
 * Text-only
 * - `compact` (default): label top-right with small icon badge, big value
 *   below. Dense KPI dashboards where numeric insight is primary.
 * - `icon-leading`: 48px icon badge on the left, value + label stacked
 *   on the right. Workflow status cards — users scan by icon first.
 * - `hero`: uppercase label + 32px icon badge top row, oversized 32px
 *   value, subtle inline delta chip. Landing/dashboard headers where the
 *   number is the hero and the icon is a secondary scanning cue.
 *
 * With visual data
 * - `trend`: hero layout + sparkline line chart below. Needs `trendData`.
 *   Shows movement over time (receipts/day, revenue trend, etc).
 * - `ring`: circular progress (left) + value/label/subtitle (right).
 *   Needs `progress`. Shows proportion reached — budget, quota, goal.
 * - `comparison`: hero layout + actual-vs-target horizontal bar.
 *   Needs `target` + `targetLabel`. Shows progress toward a known target.
 * - `breakdown`: hero layout + secondary breakdown chips below.
 *   Needs `breakdown[]`. Shows total + its constituent parts.
 * - `bars`: hero layout + 7-bar mini chart. Needs `barData` +
 *   optional `barLabels`. Shows daily/weekly rhythm.
 * - `status`: live status dot + value + last-updated line. Needs
 *   `status`. Shows service/stock health with freshness.
 */
export type StatCardVariant =
  | 'compact'
  | 'icon-leading'
  | 'hero'
  | 'trend'
  | 'ring'
  | 'comparison'
  | 'breakdown'
  | 'bars'
  | 'status';

/**
 * Semantic status level for the `status` variant's live indicator dot.
 */
export type StatCardStatus = 'healthy' | 'warning' | 'critical';

/**
 * One entry in the `breakdown` variant's chip list.
 */
export interface StatCardBreakdownItem {
  /** Chip label text (e.g., 'Pending', 'Done'). */
  label: string;
  /** Number or formatted string to show after the label. */
  value: number | string;
  /** Semantic color of the dot. Defaults to neutral if omitted. */
  color?: StatCardColor;
}
