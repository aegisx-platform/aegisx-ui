/**
 * Type definitions for ax-metadata-grid.
 *
 * A semantic definition list used in record headers, detail panes,
 * and anywhere a compact label/value table is needed.
 */

/** One row in the metadata grid. */
export interface MetadataGridItem {
  /** Uppercase label displayed above the value. */
  readonly label: string;
  /** Value — accepts number (will be coerced to string) or pre-formatted string. */
  readonly value: string | number | null | undefined;
}

/** Layout density — affects row gap and value font size. */
export type MetadataGridDensity = 'comfortable' | 'compact';
