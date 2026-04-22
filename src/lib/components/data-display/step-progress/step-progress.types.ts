/**
 * State of a single step in the progress timeline.
 * Drives marker color, border, and connector styling.
 */
export type StepProgressStatus =
  | 'completed'
  | 'current'
  | 'upcoming'
  | 'cancelled'
  | 'error';

/** Visual density of the component. */
export type StepProgressSize = 'sm' | 'md' | 'lg';

/** How to handle step lists that exceed the available width. */
export type StepProgressOverflow = 'scroll' | 'collapse' | 'none';

/** A single step in the timeline. */
export interface StepProgressItem {
  /** Unique key (trackBy, aria identifiers). */
  code: string;
  /** Human-readable step name. Tooltip content + visible label at md/lg. */
  label: string;
  /** Material icon name. Falls back to a numeric index when undefined. */
  icon?: string;
  /** Step state — drives color and connector style. */
  status: StepProgressStatus;
  /** ISO-8601 timestamp. Rendered under label at size=lg. */
  timestamp?: string;
  /** Name of the person who completed this step (tooltip only). */
  actor?: string;
  /** Free-form passthrough value — emitted by (stepClick). */
  data?: unknown;
}
