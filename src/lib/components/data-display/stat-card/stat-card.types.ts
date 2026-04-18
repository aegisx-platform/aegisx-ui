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
 * Layout variant for the stat card.
 *
 * - `compact` (default): label top-right with small icon badge, big value below.
 *   Good for dense KPI dashboards where numeric insight is primary.
 * - `icon-leading`: large 48px icon badge on the left, value + label stacked
 *   on the right. Good for workflow status cards where the icon carries
 *   meaning (draft/inspecting/accepted) and users scan by icon first.
 */
export type StatCardVariant = 'compact' | 'icon-leading';
