/**
 * Theme Generator Types
 * Based on DaisyUI theme structure with backward compatibility for AegisX
 */

// ============================================================================
// OKLCH Color Type
// ============================================================================

export interface OklchColor {
  /** Lightness: 0-100% */
  l: number;
  /** Chroma: 0-0.4 (saturation) */
  c: number;
  /** Hue: 0-360 degrees */
  h: number;
  /** Alpha: 0-1 (optional) */
  a?: number;
}

// ============================================================================
// Theme Color Slots (matching DaisyUI structure)
// ============================================================================

export interface ThemeColorSlots {
  // Base colors (backgrounds)
  'base-100': OklchColor; // Default background
  'base-200': OklchColor; // Slightly darker
  'base-300': OklchColor; // Even darker
  'base-content': OklchColor; // Text on base

  // Primary
  primary: OklchColor;
  'primary-content': OklchColor;

  // Secondary
  secondary: OklchColor;
  'secondary-content': OklchColor;

  // Accent
  accent: OklchColor;
  'accent-content': OklchColor;

  // Neutral
  neutral: OklchColor;
  'neutral-content': OklchColor;

  // State colors
  info: OklchColor;
  'info-content': OklchColor;
  success: OklchColor;
  'success-content': OklchColor;
  warning: OklchColor;
  'warning-content': OklchColor;
  error: OklchColor;
  'error-content': OklchColor;
}

// ============================================================================
// Design Tokens
// ============================================================================

export interface ThemeDesignTokens {
  // Border radius
  'radius-selector': string; // For selectors, badges
  'radius-field': string; // For inputs, buttons
  'radius-box': string; // For cards, modals

  // Size tokens
  'size-selector': string;
  'size-field': string;

  // Border width
  border: string;

  // Visual effects
  depth: number; // Shadow depth 0-1
  noise: number; // Texture noise 0-1
}

// ============================================================================
// Complete Theme Definition
// ============================================================================

export interface ThemeDefinition {
  name: string;
  displayName: string;
  colors: ThemeColorSlots;
  tokens: ThemeDesignTokens;
  colorScheme: 'light' | 'dark';
  isDefault?: boolean;
  prefersDark?: boolean;
}

// ============================================================================
// Theme Preset (for quick selection)
// ============================================================================

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  theme: ThemeDefinition;
}

// ============================================================================
// Color Palette for Picker
// ============================================================================

export interface ColorPaletteItem {
  name: string;
  oklch: OklchColor;
  hex?: string;
  label?: string; // Display label like "P", "S", "A"
}

export interface ColorPaletteRow {
  baseHue: number;
  colors: ColorPaletteItem[];
}

// ============================================================================
// Export Formats
// ============================================================================

export type ExportFormat = 'css' | 'scss' | 'tailwind' | 'json';

export interface ExportOptions {
  format: ExportFormat;
  includeComments: boolean;
  minify: boolean;
  variablePrefix: string; // Default: 'ax'
}

// ============================================================================
// Backward Compatibility Mapping
// ============================================================================

/**
 * Maps new theme slots to existing --ax-* CSS variables
 * This ensures backward compatibility with existing components
 */
export interface AxVariableMapping {
  slot: keyof ThemeColorSlots;
  axVariables: string[]; // e.g., ['--ax-primary', '--ax-brand-default']
}

export const AX_VARIABLE_MAPPINGS: AxVariableMapping[] = [
  // Primary/Brand
  {
    slot: 'primary',
    axVariables: ['--ax-primary', '--ax-brand-default', '--ax-brand'],
  },
  {
    slot: 'primary-content',
    axVariables: ['--ax-primary-content', '--ax-brand-inverted'],
  },

  // Secondary
  { slot: 'secondary', axVariables: ['--ax-secondary'] },
  { slot: 'secondary-content', axVariables: ['--ax-secondary-content'] },

  // Accent
  { slot: 'accent', axVariables: ['--ax-accent'] },
  { slot: 'accent-content', axVariables: ['--ax-accent-content'] },

  // Neutral
  { slot: 'neutral', axVariables: ['--ax-neutral', '--ax-text-default'] },
  { slot: 'neutral-content', axVariables: ['--ax-neutral-content'] },

  // Base/Background
  {
    slot: 'base-100',
    axVariables: ['--ax-background-default', '--ax-background'],
  },
  { slot: 'base-200', axVariables: ['--ax-background-muted'] },
  { slot: 'base-300', axVariables: ['--ax-background-subtle'] },
  { slot: 'base-content', axVariables: ['--ax-text-default', '--ax-content'] },

  // State: Info
  { slot: 'info', axVariables: ['--ax-info', '--ax-info-default'] },
  {
    slot: 'info-content',
    axVariables: ['--ax-info-content', '--ax-info-inverted'],
  },

  // State: Success
  { slot: 'success', axVariables: ['--ax-success', '--ax-success-default'] },
  {
    slot: 'success-content',
    axVariables: ['--ax-success-content', '--ax-success-inverted'],
  },

  // State: Warning
  { slot: 'warning', axVariables: ['--ax-warning', '--ax-warning-default'] },
  {
    slot: 'warning-content',
    axVariables: ['--ax-warning-content', '--ax-warning-inverted'],
  },

  // State: Error
  { slot: 'error', axVariables: ['--ax-error', '--ax-error-default'] },
  {
    slot: 'error-content',
    axVariables: ['--ax-error-content', '--ax-error-inverted'],
  },
];

// ============================================================================
// Default Values
// ============================================================================

export const DEFAULT_DESIGN_TOKENS: ThemeDesignTokens = {
  'radius-selector': '1rem',
  'radius-field': '0.5rem',
  'radius-box': '0.5rem',
  'size-selector': '0.25rem',
  'size-field': '0.25rem',
  border: '1px',
  depth: 0,
  noise: 0,
};

// Default light theme (similar to DaisyUI's light)
export const DEFAULT_LIGHT_COLORS: ThemeColorSlots = {
  'base-100': { l: 100, c: 0, h: 0 },
  'base-200': { l: 96, c: 0.001, h: 264 },
  'base-300': { l: 92, c: 0.002, h: 264 },
  'base-content': { l: 20, c: 0.02, h: 264 },

  primary: { l: 55, c: 0.25, h: 264 }, // Indigo-ish
  'primary-content': { l: 98, c: 0.01, h: 264 },

  secondary: { l: 45, c: 0.03, h: 264 },
  'secondary-content': { l: 98, c: 0.01, h: 264 },

  accent: { l: 75, c: 0.15, h: 85 }, // Yellow-ish
  'accent-content': { l: 20, c: 0.05, h: 85 },

  neutral: { l: 25, c: 0.02, h: 264 },
  'neutral-content': { l: 98, c: 0.01, h: 264 },

  info: { l: 70, c: 0.15, h: 230 },
  'info-content': { l: 98, c: 0.02, h: 230 },

  success: { l: 72, c: 0.22, h: 142 },
  'success-content': { l: 98, c: 0.03, h: 142 },

  warning: { l: 80, c: 0.18, h: 85 },
  'warning-content': { l: 20, c: 0.05, h: 85 },

  error: { l: 65, c: 0.25, h: 25 },
  'error-content': { l: 98, c: 0.02, h: 25 },
};

// Default dark theme
export const DEFAULT_DARK_COLORS: ThemeColorSlots = {
  'base-100': { l: 15, c: 0.01, h: 264 },
  'base-200': { l: 12, c: 0.01, h: 264 },
  'base-300': { l: 8, c: 0.01, h: 264 },
  'base-content': { l: 90, c: 0.01, h: 264 },

  primary: { l: 65, c: 0.2, h: 264 },
  'primary-content': { l: 10, c: 0.02, h: 264 },

  secondary: { l: 55, c: 0.03, h: 264 },
  'secondary-content': { l: 10, c: 0.01, h: 264 },

  accent: { l: 70, c: 0.15, h: 85 },
  'accent-content': { l: 15, c: 0.05, h: 85 },

  neutral: { l: 75, c: 0.02, h: 264 },
  'neutral-content': { l: 15, c: 0.01, h: 264 },

  info: { l: 65, c: 0.15, h: 230 },
  'info-content': { l: 10, c: 0.02, h: 230 },

  success: { l: 68, c: 0.2, h: 142 },
  'success-content': { l: 10, c: 0.03, h: 142 },

  warning: { l: 75, c: 0.18, h: 85 },
  'warning-content': { l: 15, c: 0.05, h: 85 },

  error: { l: 60, c: 0.22, h: 25 },
  'error-content': { l: 98, c: 0.02, h: 25 },
};
