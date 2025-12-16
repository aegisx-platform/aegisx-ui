/**
 * Table Column Configuration Interface
 * Defines the structure and behavior of a table column
 */
export interface TableColumn<T = any> {
  /** Property name to bind to data object */
  key: keyof T | string;

  /** Display header text */
  header: string;

  /** Column type for determining rendering behavior */
  type?: 'text' | 'date' | 'badge' | 'actions' | 'custom';

  /** Enable column sorting */
  sortable?: boolean;

  /** Custom formatter function to transform values */
  format?: (value: any) => string;

  /** Custom CSS classes for cell styling */
  cssClass?: string;

  /** Actions available in this column (for type 'actions') */
  actions?: TableAction[];

  /** Custom template reference for complex rendering */
  templateRef?: any;

  /** Column width (CSS value) */
  width?: string;
}

/**
 * Table Action Definition
 * Defines an action button/icon in an actions column
 */
export interface TableAction {
  /** Action label (for tooltip) */
  label: string;

  /** Material icon name */
  icon?: string;

  /** Action identifier */
  action: string;

  /** Button color theme */
  color?: 'primary' | 'accent' | 'warn';

  /** Disable action based on condition */
  disabled?: (row: any) => boolean;

  /** Show/hide action based on condition */
  visible?: (row: any) => boolean;
}

/**
 * Badge styling configuration
 */
export interface BadgeStyle {
  /** CSS class for badge styling */
  class: string;

  /** Label to display */
  label: string;
}

/**
 * Badge configuration mapping
 */
export type BadgeStyleMap = Record<string, BadgeStyle>;
