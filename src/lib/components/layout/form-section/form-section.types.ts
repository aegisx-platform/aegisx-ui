/**
 * Configuration for AxFormSection component.
 */
export interface AxFormSectionConfig {
  /** Section title text */
  title: string;
  /** Material icon name (optional) */
  icon?: string;
  /** Icon color CSS class, e.g. 'text-blue-600' (optional) */
  iconClass?: string;
  /** Field count badge text, e.g. '6 ฟิลด์' (optional) */
  fieldCount?: string;
  /** Whether the section is collapsible (default: true) */
  collapsible?: boolean;
  /** Whether to show a divider line under the header (default: true) */
  divider?: boolean;
  /** Whether the section starts collapsed (default: false) */
  collapsed?: boolean;
}
