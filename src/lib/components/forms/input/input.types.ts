/**
 * AegisX UI - Input Component Types
 */

/**
 * Input types
 */
export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search';

/**
 * Input sizes
 */
export type InputSize = 'sm' | 'md' | 'lg';

/**
 * Input validation states
 */
export type InputState = 'default' | 'success' | 'warning' | 'error';

/**
 * Input component configuration
 */
export interface InputConfig {
  /**
   * Input type
   * @default 'text'
   */
  type?: InputType;

  /**
   * Input size
   * @default 'md'
   */
  size?: InputSize;

  /**
   * Validation state
   * @default 'default'
   */
  state?: InputState;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Readonly state
   * @default false
   */
  readonly?: boolean;

  /**
   * Required field
   * @default false
   */
  required?: boolean;

  /**
   * Full width input
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Show clear button
   * @default false
   */
  clearable?: boolean;
}
