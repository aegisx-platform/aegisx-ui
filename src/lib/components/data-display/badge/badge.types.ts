/**
 * Badge Component Type Definitions — Untitled UI aligned
 */

/** Badge Visual Variant */
export type BadgeVariant = 'outlined' | 'soft' | 'outlined-strong';

/**
 * Badge Semantic Color
 * 5 core + 7 extended (matching Untitled UI 12-color system)
 */
export type BadgeType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'neutral'
  // Extended palette (Untitled UI)
  | 'brand'
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'pink'
  | 'orange'
  | 'sky';

/** Badge Size */
export type BadgeSize = 'sm' | 'md' | 'lg';

/** Badge Border Radius */
export type BadgeRounded = 'none' | 'sm' | 'md' | 'lg' | 'full';

/** Icon position */
export type BadgeIconPosition = 'leading' | 'trailing';
