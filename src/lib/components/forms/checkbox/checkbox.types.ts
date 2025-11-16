/**
 * AegisX UI - Checkbox Component Types
 */

/**
 * Checkbox sizes
 */
export type CheckboxSize = 'sm' | 'md' | 'lg';

/**
 * Checkbox validation states
 */
export type CheckboxState = 'default' | 'success' | 'warning' | 'error';

/**
 * Checkbox component configuration
 */
export interface CheckboxConfig {
  /**
   * Checkbox size
   * @default 'md'
   */
  size?: CheckboxSize;

  /**
   * Validation state
   * @default 'default'
   */
  state?: CheckboxState;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Indeterminate state (for "select all" scenarios)
   * @default false
   */
  indeterminate?: boolean;

  /**
   * Required field
   * @default false
   */
  required?: boolean;
}
