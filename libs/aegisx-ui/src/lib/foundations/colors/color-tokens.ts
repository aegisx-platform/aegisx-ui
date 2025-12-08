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
 * Color levels (50-900)
 */
export type ColorLevel =
  | 50
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900;

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
 * Enhanced color scale with levels (50-900)
 */
export interface ColorScale {
  50: string; // Lightest
  100: string;
  200: string;
  300: string;
  400: string;
  500: string; // Main color
  600: string;
  700: string;
  800: string;
  900: string; // Darkest

  // Semantic aliases (for backwards compatibility)
  faint: string; // → 50
  muted: string; // → 200
  subtle: string; // → 300
  default: string; // → 500 (main)
  emphasis: string; // → 700
  inverted: string; // → contrast (white/black)

  // Standard aliases
  main: string; // → 500
  light: string; // → 300
  dark: string; // → 700
  contrast: string; // White or black for text
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
 * Enhanced color token system with levels (50-900)
 */
export interface EnhancedColorTokens {
  // Semantic Colors with full scale
  success: ColorScale;
  warning: ColorScale;
  error: ColorScale;
  info: ColorScale;

  // Extended Colors with full scale
  cyan: ColorScale;
  purple: ColorScale;
  indigo: ColorScale;
  pink: ColorScale;

  // Brand/Primary Colors with full scale
  brand: ColorScale;

  // Background Colors (unchanged)
  background: {
    muted: string;
    subtle: string;
    default: string;
    emphasis: string;
  };

  // Text Colors (unchanged)
  text: {
    disabled: string;
    subtle: string;
    secondary: string;
    primary: string;
    heading: string;
    inverted: string;
  };

  // Border Colors (unchanged)
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
 * Enhanced light theme color tokens with levels (50-900)
 */
export const enhancedLightColorTokens: EnhancedColorTokens = {
  // Success Colors - Green (Tailwind Green palette)
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // Main
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    // Semantic aliases
    faint: '#f0fdf4', // → 50
    muted: '#bbf7d0', // → 200
    subtle: '#86efac', // → 300
    default: '#22c55e', // → 500
    emphasis: '#15803d', // → 700
    inverted: '#ffffff', // → white
    // Standard aliases
    main: '#22c55e', // → 500
    light: '#86efac', // → 300
    dark: '#15803d', // → 700
    contrast: '#ffffff',
  },

  // Warning Colors - Amber (Tailwind Amber palette)
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Main
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    // Semantic aliases
    faint: '#fffbeb', // → 50
    muted: '#fde68a', // → 200
    subtle: '#fcd34d', // → 300
    default: '#f59e0b', // → 500
    emphasis: '#b45309', // → 700
    inverted: '#ffffff', // → white
    // Standard aliases
    main: '#f59e0b', // → 500
    light: '#fcd34d', // → 300
    dark: '#b45309', // → 700
    contrast: '#ffffff',
  },

  // Error Colors - Red (Tailwind Red palette)
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444', // Main
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    // Semantic aliases
    faint: '#fef2f2', // → 50
    muted: '#fecaca', // → 200
    subtle: '#fca5a5', // → 300
    default: '#ef4444', // → 500
    emphasis: '#b91c1c', // → 700
    inverted: '#ffffff', // → white
    // Standard aliases
    main: '#ef4444', // → 500
    light: '#fca5a5', // → 300
    dark: '#b91c1c', // → 700
    contrast: '#ffffff',
  },

  // Info Colors - Blue (Tailwind Blue palette)
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Main
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    // Semantic aliases
    faint: '#eff6ff', // → 50
    muted: '#bfdbfe', // → 200
    subtle: '#93c5fd', // → 300
    default: '#3b82f6', // → 500
    emphasis: '#1d4ed8', // → 700
    inverted: '#ffffff', // → white
    // Standard aliases
    main: '#3b82f6', // → 500
    light: '#93c5fd', // → 300
    dark: '#1d4ed8', // → 700
    contrast: '#ffffff',
  },

  // Cyan Colors (Tailwind Cyan palette)
  cyan: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4', // Main
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
    // Semantic aliases
    faint: '#ecfeff', // → 50
    muted: '#a5f3fc', // → 200
    subtle: '#67e8f9', // → 300
    default: '#06b6d4', // → 500
    emphasis: '#0e7490', // → 700
    inverted: '#ffffff', // → white
    // Standard aliases
    main: '#06b6d4', // → 500
    light: '#67e8f9', // → 300
    dark: '#0e7490', // → 700
    contrast: '#ffffff',
  },

  // Purple Colors (Tailwind Purple palette)
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7', // Main
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
    // Semantic aliases
    faint: '#faf5ff', // → 50
    muted: '#e9d5ff', // → 200
    subtle: '#d8b4fe', // → 300
    default: '#a855f7', // → 500
    emphasis: '#7e22ce', // → 700
    inverted: '#ffffff', // → white
    // Standard aliases
    main: '#a855f7', // → 500
    light: '#d8b4fe', // → 300
    dark: '#7e22ce', // → 700
    contrast: '#ffffff',
  },

  // Indigo Colors (Tailwind Indigo palette)
  indigo: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1', // Main
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    // Semantic aliases
    faint: '#eef2ff', // → 50
    muted: '#c7d2fe', // → 200
    subtle: '#a5b4fc', // → 300
    default: '#6366f1', // → 500
    emphasis: '#4338ca', // → 700
    inverted: '#ffffff', // → white
    // Standard aliases
    main: '#6366f1', // → 500
    light: '#a5b4fc', // → 300
    dark: '#4338ca', // → 700
    contrast: '#ffffff',
  },

  // Pink Colors (Tailwind Pink palette)
  pink: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899', // Main
    600: '#db2777',
    700: '#be185d',
    800: '#9f1239',
    900: '#831843',
    // Semantic aliases
    faint: '#fdf2f8', // → 50
    muted: '#fbcfe8', // → 200
    subtle: '#f9a8d4', // → 300
    default: '#ec4899', // → 500
    emphasis: '#be185d', // → 700
    inverted: '#ffffff', // → white
    // Standard aliases
    main: '#ec4899', // → 500
    light: '#f9a8d4', // → 300
    dark: '#be185d', // → 700
    contrast: '#ffffff',
  },

  // Brand Colors - Indigo (Material Indigo + Tailwind Indigo)
  brand: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1', // Main (Tailwind Indigo 500)
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    // Semantic aliases
    faint: '#eef2ff', // → 50
    muted: '#c7d2fe', // → 200
    subtle: '#a5b4fc', // → 300
    default: '#6366f1', // → 500
    emphasis: '#4338ca', // → 700
    inverted: '#ffffff', // → white
    // Standard aliases
    main: '#6366f1', // → 500
    light: '#a5b4fc', // → 300
    dark: '#4338ca', // → 700
    contrast: '#ffffff',
  },

  // Background Colors (same as before)
  background: {
    muted: '#f9fafb',
    subtle: '#f3f4f6',
    default: '#ffffff',
    emphasis: '#111827',
  },

  // Text Colors (same as before)
  text: {
    disabled: '#d1d5db',
    subtle: '#9ca3af',
    secondary: '#6b7280',
    primary: '#374151',
    heading: '#111827',
    inverted: '#ffffff',
  },

  // Border Colors (same as before)
  border: {
    muted: '#f3f4f6',
    default: '#e5e7eb',
    emphasis: '#d1d5db',
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
 * Enhanced dark theme color tokens with levels (50-900)
 * Note: Dark theme inverts the scale (900 → 50 for backgrounds)
 */
export const enhancedDarkColorTokens: EnhancedColorTokens = {
  // Success Colors - Green (Inverted for dark theme)
  success: {
    50: '#14532d', // Darkest (for subtle backgrounds)
    100: '#166534',
    200: '#15803d',
    300: '#16a34a',
    400: '#22c55e',
    500: '#22c55e', // Main (stays same)
    600: '#4ade80',
    700: '#86efac',
    800: '#bbf7d0',
    900: '#dcfce7', // Lightest (for emphasis)
    // Semantic aliases
    faint: '#14532d', // → 50 (dark)
    muted: '#15803d', // → 200
    subtle: '#16a34a', // → 300
    default: '#22c55e', // → 500
    emphasis: '#86efac', // → 700 (lighter)
    inverted: '#000000', // → black
    // Standard aliases
    main: '#22c55e', // → 500
    light: '#86efac', // → 700
    dark: '#16a34a', // → 300
    contrast: '#000000',
  },

  // Warning Colors - Amber (Inverted for dark theme)
  warning: {
    50: '#78350f', // Darkest
    100: '#92400e',
    200: '#b45309',
    300: '#d97706',
    400: '#f59e0b',
    500: '#f59e0b', // Main
    600: '#fbbf24',
    700: '#fcd34d',
    800: '#fde68a',
    900: '#fef3c7', // Lightest
    // Semantic aliases
    faint: '#78350f', // → 50 (dark)
    muted: '#b45309', // → 200
    subtle: '#d97706', // → 300
    default: '#f59e0b', // → 500
    emphasis: '#fcd34d', // → 700 (lighter)
    inverted: '#000000', // → black
    // Standard aliases
    main: '#f59e0b', // → 500
    light: '#fcd34d', // → 700
    dark: '#d97706', // → 300
    contrast: '#000000',
  },

  // Error Colors - Red (Inverted for dark theme)
  error: {
    50: '#7f1d1d', // Darkest
    100: '#991b1b',
    200: '#b91c1c',
    300: '#dc2626',
    400: '#ef4444',
    500: '#ef4444', // Main
    600: '#f87171',
    700: '#fca5a5',
    800: '#fecaca',
    900: '#fee2e2', // Lightest
    // Semantic aliases
    faint: '#7f1d1d', // → 50 (dark)
    muted: '#b91c1c', // → 200
    subtle: '#dc2626', // → 300
    default: '#ef4444', // → 500
    emphasis: '#fca5a5', // → 700 (lighter)
    inverted: '#000000', // → black
    // Standard aliases
    main: '#ef4444', // → 500
    light: '#fca5a5', // → 700
    dark: '#dc2626', // → 300
    contrast: '#000000',
  },

  // Info Colors - Blue (Inverted for dark theme)
  info: {
    50: '#1e3a8a', // Darkest
    100: '#1e40af',
    200: '#1d4ed8',
    300: '#2563eb',
    400: '#3b82f6',
    500: '#3b82f6', // Main
    600: '#60a5fa',
    700: '#93c5fd',
    800: '#bfdbfe',
    900: '#dbeafe', // Lightest
    // Semantic aliases
    faint: '#1e3a8a', // → 50 (dark)
    muted: '#1d4ed8', // → 200
    subtle: '#2563eb', // → 300
    default: '#3b82f6', // → 500
    emphasis: '#93c5fd', // → 700 (lighter)
    inverted: '#000000', // → black
    // Standard aliases
    main: '#3b82f6', // → 500
    light: '#93c5fd', // → 700
    dark: '#2563eb', // → 300
    contrast: '#000000',
  },

  // Cyan Colors (Inverted for dark theme)
  cyan: {
    50: '#164e63', // Darkest
    100: '#155e75',
    200: '#0e7490',
    300: '#0891b2',
    400: '#06b6d4',
    500: '#06b6d4', // Main
    600: '#22d3ee',
    700: '#67e8f9',
    800: '#a5f3fc',
    900: '#cffafe', // Lightest
    // Semantic aliases
    faint: '#164e63', // → 50 (dark)
    muted: '#0e7490', // → 200
    subtle: '#0891b2', // → 300
    default: '#06b6d4', // → 500
    emphasis: '#67e8f9', // → 700 (lighter)
    inverted: '#000000', // → black
    // Standard aliases
    main: '#06b6d4', // → 500
    light: '#67e8f9', // → 700
    dark: '#0891b2', // → 300
    contrast: '#000000',
  },

  // Purple Colors (Inverted for dark theme)
  purple: {
    50: '#581c87', // Darkest
    100: '#6b21a8',
    200: '#7e22ce',
    300: '#9333ea',
    400: '#a855f7',
    500: '#a855f7', // Main
    600: '#c084fc',
    700: '#d8b4fe',
    800: '#e9d5ff',
    900: '#f3e8ff', // Lightest
    // Semantic aliases
    faint: '#581c87', // → 50 (dark)
    muted: '#7e22ce', // → 200
    subtle: '#9333ea', // → 300
    default: '#a855f7', // → 500
    emphasis: '#d8b4fe', // → 700 (lighter)
    inverted: '#000000', // → black
    // Standard aliases
    main: '#a855f7', // → 500
    light: '#d8b4fe', // → 700
    dark: '#9333ea', // → 300
    contrast: '#000000',
  },

  // Indigo Colors (Inverted for dark theme)
  indigo: {
    50: '#312e81', // Darkest
    100: '#3730a3',
    200: '#4338ca',
    300: '#4f46e5',
    400: '#6366f1',
    500: '#6366f1', // Main
    600: '#818cf8',
    700: '#a5b4fc',
    800: '#c7d2fe',
    900: '#e0e7ff', // Lightest
    // Semantic aliases
    faint: '#312e81', // → 50 (dark)
    muted: '#4338ca', // → 200
    subtle: '#4f46e5', // → 300
    default: '#6366f1', // → 500
    emphasis: '#a5b4fc', // → 700 (lighter)
    inverted: '#000000', // → black
    // Standard aliases
    main: '#6366f1', // → 500
    light: '#a5b4fc', // → 700
    dark: '#4f46e5', // → 300
    contrast: '#000000',
  },

  // Pink Colors (Inverted for dark theme)
  pink: {
    50: '#831843', // Darkest
    100: '#9f1239',
    200: '#be185d',
    300: '#db2777',
    400: '#ec4899',
    500: '#ec4899', // Main
    600: '#f472b6',
    700: '#f9a8d4',
    800: '#fbcfe8',
    900: '#fce7f3', // Lightest
    // Semantic aliases
    faint: '#831843', // → 50 (dark)
    muted: '#be185d', // → 200
    subtle: '#db2777', // → 300
    default: '#ec4899', // → 500
    emphasis: '#f9a8d4', // → 700 (lighter)
    inverted: '#000000', // → black
    // Standard aliases
    main: '#ec4899', // → 500
    light: '#f9a8d4', // → 700
    dark: '#db2777', // → 300
    contrast: '#000000',
  },

  // Brand Colors - Indigo (Inverted for dark theme)
  brand: {
    50: '#312e81', // Darkest
    100: '#3730a3',
    200: '#4338ca',
    300: '#4f46e5',
    400: '#6366f1',
    500: '#6366f1', // Main
    600: '#818cf8',
    700: '#a5b4fc',
    800: '#c7d2fe',
    900: '#e0e7ff', // Lightest
    // Semantic aliases
    faint: '#312e81', // → 50 (dark)
    muted: '#4338ca', // → 200
    subtle: '#4f46e5', // → 300
    default: '#6366f1', // → 500
    emphasis: '#a5b4fc', // → 700 (lighter)
    inverted: '#000000', // → black
    // Standard aliases
    main: '#6366f1', // → 500
    light: '#a5b4fc', // → 700
    dark: '#4f46e5', // → 300
    contrast: '#000000',
  },

  // Background Colors (dark theme)
  background: {
    muted: '#030712',
    subtle: '#111827',
    default: '#1f2937',
    emphasis: '#f9fafb',
  },

  // Text Colors (lighter for dark backgrounds)
  text: {
    disabled: '#4b5563',
    subtle: '#6b7280',
    secondary: '#9ca3af',
    primary: '#d1d5db',
    heading: '#f9fafb',
    inverted: '#000000',
  },

  // Border Colors (dark theme)
  border: {
    muted: '#1f2937',
    default: '#374151',
    emphasis: '#4b5563',
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
 * Generate CSS custom properties for enhanced color tokens with levels (50-900)
 */
export function generateEnhancedColorCSSVariables(
  tokens: EnhancedColorTokens,
  prefix = 'ax',
): Record<string, string> {
  const variables: Record<string, string> = {};

  // Color categories with full scale
  const colorCategories: Array<
    keyof Pick<
      EnhancedColorTokens,
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

  colorCategories.forEach((category) => {
    const scale = tokens[category] as ColorScale;

    // Generate numeric levels (50-900)
    [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].forEach((level) => {
      variables[`--${prefix}-${category}-${level}`] =
        scale[level as ColorLevel];
    });

    // Generate semantic aliases
    variables[`--${prefix}-${category}-faint`] = scale.faint;
    variables[`--${prefix}-${category}-muted`] = scale.muted;
    variables[`--${prefix}-${category}-subtle`] = scale.subtle;
    variables[`--${prefix}-${category}-default`] = scale.default;
    variables[`--${prefix}-${category}-emphasis`] = scale.emphasis;
    variables[`--${prefix}-${category}-inverted`] = scale.inverted;

    // Generate standard aliases
    variables[`--${prefix}-${category}-main`] = scale.main;
    variables[`--${prefix}-${category}-light`] = scale.light;
    variables[`--${prefix}-${category}-dark`] = scale.dark;
    variables[`--${prefix}-${category}-contrast`] = scale.contrast;

    // Shorthand alias (main color)
    variables[`--${prefix}-${category}`] = scale.main;
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
   * Get color at specific level from enhanced color scale
   */
  getColorLevel(
    scale: ColorScale,
    level: ColorLevel,
    fallback?: string,
  ): string {
    return scale[level] || fallback || scale[500];
  },

  /**
   * Get lighter shade (decrease by 1-2 levels)
   */
  getLighterShade(
    scale: ColorScale,
    currentLevel: ColorLevel,
    steps = 1,
  ): string {
    const levels: ColorLevel[] = [
      50, 100, 200, 300, 400, 500, 600, 700, 800, 900,
    ];
    const currentIndex = levels.indexOf(currentLevel);
    const newIndex = Math.max(0, currentIndex - steps);
    return scale[levels[newIndex]];
  },

  /**
   * Get darker shade (increase by 1-2 levels)
   */
  getDarkerShade(
    scale: ColorScale,
    currentLevel: ColorLevel,
    steps = 1,
  ): string {
    const levels: ColorLevel[] = [
      50, 100, 200, 300, 400, 500, 600, 700, 800, 900,
    ];
    const currentIndex = levels.indexOf(currentLevel);
    const newIndex = Math.min(levels.length - 1, currentIndex + steps);
    return scale[levels[newIndex]];
  },

  /**
   * Generate hover state color (one level darker)
   */
  getHoverColor(scale: ColorScale, baseLevel: ColorLevel = 500): string {
    return this.getDarkerShade(scale, baseLevel, 1);
  },

  /**
   * Generate active state color (two levels darker)
   */
  getActiveColor(scale: ColorScale, baseLevel: ColorLevel = 500): string {
    return this.getDarkerShade(scale, baseLevel, 2);
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

  /**
   * Get contrast text color (white or black)
   */
  getContrastText(backgroundColor: string): string {
    return this.isLightColor(backgroundColor) ? '#111827' : '#ffffff';
  },
};
