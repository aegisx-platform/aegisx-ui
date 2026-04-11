/**
 * AegisX UI - Shadow/Elevation Design Tokens
 *
 * Box shadow scale for elevation and depth.
 * Based on Material Design 3 elevation system.
 *
 * @packageDocumentation
 */

/**
 * Elevation levels
 */
export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Shadow size keys
 */
export type ShadowSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Shadow token system
 */
export interface ShadowTokens {
  none: string;
  xs: string; // Subtle shadow
  sm: string; // Small shadow
  md: string; // Medium shadow
  lg: string; // Large shadow
  xl: string; // Extra large shadow
}

/**
 * Material 3 Elevation tokens
 */
export interface ElevationTokens {
  0: string; // No elevation
  1: string; // Level 1 - Cards, buttons
  2: string; // Level 2 - Raised buttons, chips
  3: string; // Level 3 - Menus, dropdowns
  4: string; // Level 4 - Modals, dialogs
  5: string; // Level 5 - Maximum elevation
}

/**
 * Default shadow tokens (Tailwind-based)
 */
export const shadowTokens: ShadowTokens = {
  none: 'none',
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.04)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
  md: '0 4px 8px -2px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
  lg: '0 12px 20px -4px rgb(0 0 0 / 0.08), 0 4px 8px -4px rgb(0 0 0 / 0.04)',
  xl: '0 24px 32px -8px rgb(0 0 0 / 0.08), 0 8px 16px -6px rgb(0 0 0 / 0.04)',
};

/**
 * Material 3 Elevation tokens
 */
export const elevationTokens: ElevationTokens = {
  0: 'none',
  1: '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
  2: '0 2px 6px 0 rgb(0 0 0 / 0.08), 0 1px 4px -1px rgb(0 0 0 / 0.06)',
  3: '0 4px 12px -2px rgb(0 0 0 / 0.08), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
  4: '0 8px 16px -4px rgb(0 0 0 / 0.1), 0 2px 6px -2px rgb(0 0 0 / 0.06)',
  5: '0 12px 24px -6px rgb(0 0 0 / 0.1), 0 4px 8px -2px rgb(0 0 0 / 0.06)',
};

/**
 * Generate CSS custom properties for shadow tokens
 */
export function generateShadowCSSVariables(
  tokens: ShadowTokens,
  prefix = 'ax',
): Record<string, string> {
  const variables: Record<string, string> = {};

  Object.entries(tokens).forEach(([key, value]) => {
    variables[`--${prefix}-shadow-${key}`] = value;
  });

  return variables;
}

/**
 * Generate CSS custom properties for elevation tokens
 */
export function generateElevationCSSVariables(
  tokens: ElevationTokens,
  prefix = 'ax',
): Record<string, string> {
  const variables: Record<string, string> = {};

  Object.entries(tokens).forEach(([level, value]) => {
    variables[`--${prefix}-elevation-${level}`] = value;
  });

  return variables;
}
