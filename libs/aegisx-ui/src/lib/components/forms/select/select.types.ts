/**
 * AegisX UI - Select Component Types
 */

/**
 * Select sizes
 */
export type SelectSize = 'sm' | 'md' | 'lg';

/**
 * Select validation states
 */
export type SelectState = 'default' | 'success' | 'warning' | 'error';

/**
 * Select option interface
 */
export interface SelectOption<T = any> {
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
   * Optional icon name (Material icon or custom)
   */
  icon?: string;

  /**
   * Optional description text
   */
  description?: string;

  /**
   * Optional group name for grouping options
   */
  group?: string;
}

/**
 * Select option group interface
 */
export interface SelectOptionGroup<T = any> {
  /**
   * Group label
   */
  label: string;

  /**
   * Options in this group
   */
  options: SelectOption<T>[];

  /**
   * Whether the entire group is disabled
   */
  disabled?: boolean;
}

/**
 * Select component configuration
 */
export interface SelectConfig<T = any> {
  /**
   * Select size
   * @default 'md'
   */
  size?: SelectSize;

  /**
   * Validation state
   * @default 'default'
   */
  state?: SelectState;

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
   * Multiple selection mode
   * @default false
   */
  multiple?: boolean;

  /**
   * Searchable/filterable dropdown
   * @default false
   */
  searchable?: boolean;

  /**
   * Clearable (show clear button)
   * @default false
   */
  clearable?: boolean;

  /**
   * Maximum number of items to show when multiple
   */
  maxTagCount?: number;

  /**
   * Custom compare function for option equality
   */
  compareWith?: (o1: T, o2: T) => boolean;
}
