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
 * - `trend-corner`: hero layout + corner sparkline (60×24, 50% opacity).
 *   Variant tuned for Manage.City-style KPI tiles — delta chip top,
 *   big value middle, caption + corner sparkline bottom. Needs `trendData`.
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
  | 'trend-corner'
  | 'ring'
  | 'comparison'
  | 'breakdown'
  | 'bars'
  | 'status'
  | 'gauge'
  | 'stacked-bar'
  | 'billboard'
  | 'dual-metric'
  | 'inline-bars'
  | 'compare-period'
  | 'threshold'
  | 'progress-steps'
  | 'heatmap'
  | 'metric-grid'
  | 'ranking'
  | 'journey'
  | 'donut-legend'
  | 'gauge-split'
  | 'category-browser';

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

/**
 * One segment of the `stacked-bar` variant. Segments are rendered as
 * proportional slices of a single horizontal bar, with a color-dot
 * legend below (label + percent of total).
 */
export interface StatCardSegment {
  /** Human label shown in the legend (e.g., 'Sick leave'). */
  label: string;
  /** Numeric share — percentages auto-computed from the segment sum. */
  value: number;
  /** Semantic color for the segment swatch + legend dot. */
  color?: StatCardColor;
}

/**
 * One metric row inside the `dual-metric` variant — used for 2-way
 * ratios like "pass / fail", "visitor / buyer".
 */
export interface StatCardMetric {
  /** Primary value (e.g., '75.3%' or 1420). */
  value: string | number;
  /** Delta label shown after the value (e.g., '↗ 2,424' or '-213'). */
  delta?: string;
  /** Optional delta direction — drives color (up=success, down=error). */
  deltaDirection?: 'up' | 'down';
  /** Human label for this row (e.g., 'Visitors'). */
  label: string;
  /** Semantic color for the left stripe + split-bar segment. */
  color?: StatCardColor;
}

/**
 * One period box in the `compare-period` variant. The first entry is
 * rendered as the "current" side (emphasised), subsequent entries are
 * rendered as "baseline" boxes (muted bg, smaller value).
 */
export interface StatCardPeriod {
  /** Period label (e.g., 'This month', 'Last month'). */
  label: string;
  /** Primary value (string or number). */
  value: string | number;
  /** Delta relative to the baseline (shown on the current side only). */
  delta?: string;
  /** Direction for delta coloring. */
  deltaDirection?: 'up' | 'down';
}

/**
 * One threshold marker on the `threshold` variant's horizontal scale.
 * Positions between `min` and `max` are auto-computed.
 */
export interface StatCardThreshold {
  /** Human label shown under the marker (e.g., 'Reorder', 'Max'). */
  label: string;
  /** Numeric value — placed proportionally between `min` and `max`. */
  value: number;
  /** Semantic color for the marker dot. */
  color?: StatCardColor;
}

/**
 * Lifecycle state for a single step in the `progress-steps` variant.
 */
export type StatCardStepState = 'done' | 'active' | 'pending';

/**
 * One step entry for the `progress-steps` variant.
 */
export interface StatCardStep {
  /** Step label (e.g., 'Draft', 'Inspect', 'Accept'). */
  label: string;
  /** Optional count shown under the label (e.g., '10'). */
  count?: number | string;
  /** Pipeline state — drives the dot color. */
  state?: StatCardStepState;
}

/**
 * One mini metric inside the `metric-grid` variant's 2×2 grid.
 */
export interface StatCardGridCell {
  /** Mini value. */
  value: string | number;
  /** Mini label shown under the value. */
  label: string;
  /** Optional delta chip (e.g., '+12'). */
  delta?: string;
  /** Delta direction — drives color. */
  deltaDirection?: 'up' | 'down';
  /** Optional icon rendered above the value. */
  icon?: string;
}

/**
 * One row in the `ranking` variant's top-N list.
 */
export interface StatCardRankItem {
  /** Human label (e.g., 'Paracetamol 500mg'). */
  label: string;
  /** Metric value shown on the right. */
  value: string | number;
  /** Optional delta chip (e.g., '↗ 12%'). */
  delta?: string;
  /** Delta direction — drives color. */
  deltaDirection?: 'up' | 'down' | 'flat';
}

/**
 * One segment of the `donut-legend` / `gauge-split` variants' arc chart.
 * Each segment contributes to a 360° donut (or 180° gauge) and shows up
 * in the legend on the right side.
 */
export interface StatCardDonutSegment {
  /** Legend label (e.g., 'Premium', 'Data 1'). */
  label: string;
  /** Numeric value shown on the legend. */
  value: string | number;
  /** Percent of the whole — sizes the arc segment. */
  percent: number;
  /** Semantic color for the arc segment + legend dot. */
  color?: StatCardColor;
}

/**
 * One browseable category for the `category-browser` variant. The card
 * shows one entry at a time with prev/next navigation controls.
 */
export interface StatCardCategory {
  /** Main label shown above the bars (e.g., 'Accessories'). */
  label: string;
  /** Main metric value (e.g., '58%'). */
  value: string | number;
  /** Delta for the main metric (e.g., '+2.1%'). */
  delta?: string;
  /** Delta direction — drives color. */
  deltaDirection?: 'up' | 'down';
  /** Subtitle for the delta line (e.g., 'vs last week'). */
  deltaLabel?: string;
  /** Optional secondary metric (e.g., '45 products'). */
  subValue?: string | number;
  /** Delta for the secondary metric. */
  subDelta?: string;
  /** Direction for the secondary delta. */
  subDeltaDirection?: 'up' | 'down';
  /** Dense bar-chart data rendered behind / above the footer row. */
  barData?: readonly number[];
}
