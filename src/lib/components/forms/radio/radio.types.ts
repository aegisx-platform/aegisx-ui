/**
 * AegisX UI - Radio Component Types
 */

/**
 * Radio sizes
 */
export type RadioSize = 'sm' | 'md' | 'lg';

/**
 * Radio validation states
 */
export type RadioState = 'default' | 'success' | 'warning' | 'error';

/**
 * Radio option interface
 */
export interface RadioOption<T = any> {
  /**
   * Option label to display
   */
  label: string;

  /**
   * Option value
   */
  value: T;

  /**
   * Whether the option is disabled
   */
  disabled?: boolean;

  /**
   * Optional description text
   */
  description?: string;
}

/**
 * Radio component configuration
 */
export interface RadioConfig {
  /**
   * Radio size
   * @default 'md'
   */
  size?: RadioSize;

  /**
   * Validation state
   * @default 'default'
   */
  state?: RadioState;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Required field
   * @default false
   */
  required?: boolean;
}
