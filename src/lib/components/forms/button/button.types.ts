/**
 * AegisX UI - Button Component Types
 */

/**
 * Button visual variants
 */
export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link';

/**
 * Button color schemes
 */
export type ButtonColor =
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'neutral';

/**
 * Button sizes
 */
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Button component configuration
 */
export interface ButtonConfig {
  /**
   * Visual variant
   * @default 'solid'
   */
  variant?: ButtonVariant;

  /**
   * Color scheme
   * @default 'primary'
   */
  color?: ButtonColor;

  /**
   * Size
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Loading state (shows spinner)
   * @default false
   */
  loading?: boolean;

  /**
   * Full width button
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Icon only mode (no text)
   * @default false
   */
  iconOnly?: boolean;

  /**
   * Button HTML type
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';
}
