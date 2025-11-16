/**
 * AegisX UI - Color Design Tokens
 *
 * Comprehensive color system for enterprise applications.
 * All colors are defined with semantic naming for easy theming.
 *
 * @packageDocumentation
 */

/**
 * Semantic color variants for different UI states
 */
export type ColorVariant =
  | 'faint'
  | 'muted'
  | 'subtle'
  | 'default'
  | 'emphasis'
  | 'inverted';

/**
 * Semantic color categories
 */
export type ColorCategory =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'cyan'
  | 'purple'
  | 'indigo'
  | 'pink'
  | 'brand'
  | 'primary';

/**
 * Background variants
 */
export type BackgroundVariant = 'muted' | 'subtle' | 'default' | 'emphasis';

/**
 * Text hierarchy levels
 */
export type TextLevel =
  | 'disabled'
  | 'subtle'
  | 'secondary'
  | 'primary'
  | 'heading'
  | 'inverted';

/**
 * Border variants
 */
export type BorderVariant = 'muted' | 'default' | 'emphasis';

/**
 * Semantic color palette with 6 variants each
 */
export interface SemanticColorPalette {
  faint: string;
  muted: string;
  subtle: string;
  default: string;
  emphasis: string;
  inverted: string;
}

/**
 * Complete color token system
 */
export interface ColorTokens {
  // Semantic Colors
  success: SemanticColorPalette;
  warning: SemanticColorPalette;
  error: SemanticColorPalette;
  info: SemanticColorPalette;

  // Extended Colors
  cyan: SemanticColorPalette;
  purple: SemanticColorPalette;
  indigo: SemanticColorPalette;
  pink: SemanticColorPalette;

  // Brand/Primary Colors
  brand: SemanticColorPalette;

  // Background Colors
  background: {
    muted: string;
    subtle: string;
    default: string;
    emphasis: string;
  };

  // Text Colors
  text: {
    disabled: string;
    subtle: string;
    secondary: string;
    primary: string;
    heading: string;
    inverted: string;
  };

  // Border Colors
  border: {
    muted: string;
    default: string;
    emphasis: string;
  };
}

/**
 * Light theme color tokens
 */
export const lightColorTokens: ColorTokens = {
  // Success Colors (Green)
  success: {
    faint: '#f0fdf4', // green-50
    muted: '#dcfce7', // green-100
    subtle: '#86efac', // green-300
    default: '#22c55e', // green-500
    emphasis: '#16a34a', // green-600
    inverted: '#ffffff',
  },

  // Warning Colors (Amber)
  warning: {
    faint: '#fffbeb', // amber-50
    muted: '#fef3c7', // amber-100
    subtle: '#fcd34d', // amber-300
    default: '#f59e0b', // amber-500
    emphasis: '#d97706', // amber-600
    inverted: '#ffffff',
  },

  // Error Colors (Red)
  error: {
    faint: '#fef2f2', // red-50
    muted: '#fee2e2', // red-100
    subtle: '#fca5a5', // red-300
    default: '#ef4444', // red-500
    emphasis: '#dc2626', // red-600
    inverted: '#ffffff',
  },

  // Info Colors (Blue)
  info: {
    faint: '#eff6ff', // blue-50
    muted: '#dbeafe', // blue-100
    subtle: '#93c5fd', // blue-300
    default: '#3b82f6', // blue-500
    emphasis: '#2563eb', // blue-600
    inverted: '#ffffff',
  },

  // Cyan
  cyan: {
    faint: '#ecfeff', // cyan-50
    muted: '#cffafe', // cyan-100
    subtle: '#67e8f9', // cyan-300
    default: '#06b6d4', // cyan-500
    emphasis: '#0891b2', // cyan-600
    inverted: '#ffffff',
  },

  // Purple
  purple: {
    faint: '#faf5ff', // purple-50
    muted: '#f3e8ff', // purple-100
    subtle: '#d8b4fe', // purple-300
    default: '#a855f7', // purple-500
    emphasis: '#9333ea', // purple-600
    inverted: '#ffffff',
  },

  // Indigo
  indigo: {
    faint: '#eef2ff', // indigo-50
    muted: '#e0e7ff', // indigo-100
    subtle: '#a5b4fc', // indigo-300
    default: '#6366f1', // indigo-500
    emphasis: '#4f46e5', // indigo-600
    inverted: '#ffffff',
  },

  // Pink
  pink: {
    faint: '#fdf2f8', // pink-50
    muted: '#fce7f3', // pink-100
    subtle: '#f9a8d4', // pink-300
    default: '#ec4899', // pink-500
    emphasis: '#db2777', // pink-600
    inverted: '#ffffff',
  },

  // Brand/Primary (Indigo based)
  brand: {
    faint: '#eef2ff', // indigo-50
    muted: '#e0e7ff', // indigo-100
    subtle: '#a5b4fc', // indigo-300
    default: '#6366f1', // indigo-500
    emphasis: '#4f46e5', // indigo-600
    inverted: '#ffffff',
  },

  // Backgrounds (Tremor-inspired)
  background: {
    muted: '#f9fafb', // gray-50
    subtle: '#f3f4f6', // gray-100
    default: '#ffffff', // white
    emphasis: '#111827', // gray-900
  },

  // Text Hierarchy
  text: {
    disabled: '#d1d5db', // gray-300
    subtle: '#9ca3af', // gray-400
    secondary: '#6b7280', // gray-500
    primary: '#374151', // gray-700
    heading: '#111827', // gray-900
    inverted: '#ffffff', // white
  },

  // Borders
  border: {
    muted: '#f3f4f6', // gray-100
    default: '#e5e7eb', // gray-200
    emphasis: '#d1d5db', // gray-300
  },
};

/**
 * Dark theme color tokens
 */
export const darkColorTokens: ColorTokens = {
  // Success Colors (Lighter for dark backgrounds)
  success: {
    faint: '#14532d', // green-900
    muted: '#166534', // green-800
    subtle: '#15803d', // green-700
    default: '#22c55e', // green-500
    emphasis: '#4ade80', // green-400
    inverted: '#000000',
  },

  // Warning Colors
  warning: {
    faint: '#78350f', // amber-900
    muted: '#92400e', // amber-800
    subtle: '#b45309', // amber-700
    default: '#f59e0b', // amber-500
    emphasis: '#fbbf24', // amber-400
    inverted: '#000000',
  },

  // Error Colors
  error: {
    faint: '#7f1d1d', // red-900
    muted: '#991b1b', // red-800
    subtle: '#b91c1c', // red-700
    default: '#ef4444', // red-500
    emphasis: '#f87171', // red-400
    inverted: '#000000',
  },

  // Info Colors
  info: {
    faint: '#1e3a8a', // blue-900
    muted: '#1e40af', // blue-800
    subtle: '#1d4ed8', // blue-700
    default: '#3b82f6', // blue-500
    emphasis: '#60a5fa', // blue-400
    inverted: '#000000',
  },

  // Cyan
  cyan: {
    faint: '#164e63', // cyan-900
    muted: '#155e75', // cyan-800
    subtle: '#0e7490', // cyan-700
    default: '#06b6d4', // cyan-500
    emphasis: '#22d3ee', // cyan-400
    inverted: '#000000',
  },

  // Purple
  purple: {
    faint: '#581c87', // purple-900
    muted: '#6b21a8', // purple-800
    subtle: '#7e22ce', // purple-700
    default: '#a855f7', // purple-500
    emphasis: '#c084fc', // purple-400
    inverted: '#000000',
  },

  // Indigo
  indigo: {
    faint: '#312e81', // indigo-900
    muted: '#3730a3', // indigo-800
    subtle: '#4338ca', // indigo-700
    default: '#6366f1', // indigo-500
    emphasis: '#818cf8', // indigo-400
    inverted: '#000000',
  },

  // Pink
  pink: {
    faint: '#831843', // pink-900
    muted: '#9f1239', // pink-800
    subtle: '#be123c', // pink-700
    default: '#ec4899', // pink-500
    emphasis: '#f472b6', // pink-400
    inverted: '#000000',
  },

  // Brand/Primary (Lighter for dark theme)
  brand: {
    faint: '#312e81', // indigo-900
    muted: '#3730a3', // indigo-800
    subtle: '#4338ca', // indigo-700
    default: '#6366f1', // indigo-500
    emphasis: '#818cf8', // indigo-400
    inverted: '#000000',
  },

  // Backgrounds (Dark theme)
  background: {
    muted: '#030712', // gray-950
    subtle: '#111827', // gray-900
    default: '#1f2937', // gray-800
    emphasis: '#f9fafb', // gray-50 (inverted)
  },

  // Text Hierarchy (Lighter for dark backgrounds)
  text: {
    disabled: '#4b5563', // gray-600
    subtle: '#6b7280', // gray-500
    secondary: '#9ca3af', // gray-400
    primary: '#d1d5db', // gray-300
    heading: '#f9fafb', // gray-50
    inverted: '#000000', // black
  },

  // Borders (Dark theme)
  border: {
    muted: '#1f2937', // gray-800
    default: '#374151', // gray-700
    emphasis: '#4b5563', // gray-600
  },
};

/**
 * Generate CSS custom properties for color tokens
 */
export function generateColorCSSVariables(
  tokens: ColorTokens,
  prefix = 'ax',
): Record<string, string> {
  const variables: Record<string, string> = {};

  // Semantic colors
  const semanticColors: Array<
    keyof Pick<
      ColorTokens,
      | 'success'
      | 'warning'
      | 'error'
      | 'info'
      | 'cyan'
      | 'purple'
      | 'indigo'
      | 'pink'
      | 'brand'
    >
  > = [
    'success',
    'warning',
    'error',
    'info',
    'cyan',
    'purple',
    'indigo',
    'pink',
    'brand',
  ];

  semanticColors.forEach((category) => {
    const palette = tokens[category] as SemanticColorPalette;
    Object.entries(palette).forEach(([variant, value]) => {
      variables[`--${prefix}-${category}-${variant}`] = value;
    });
  });

  // Background colors
  Object.entries(tokens.background).forEach(([variant, value]) => {
    variables[`--${prefix}-bg-${variant}`] = value;
  });

  // Text colors
  Object.entries(tokens.text).forEach(([level, value]) => {
    variables[`--${prefix}-text-${level}`] = value;
  });

  // Border colors
  Object.entries(tokens.border).forEach(([variant, value]) => {
    variables[`--${prefix}-border-${variant}`] = value;
  });

  return variables;
}

/**
 * Color utilities
 */
export const colorUtils = {
  /**
   * Get color value from semantic palette
   */
  getColor(palette: SemanticColorPalette, variant: ColorVariant): string {
    return palette[variant];
  },

  /**
   * Check if color is light or dark
   */
  isLightColor(hex: string): boolean {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma > 128;
  },
};
