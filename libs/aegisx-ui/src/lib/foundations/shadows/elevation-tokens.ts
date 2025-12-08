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
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
};

/**
 * Material 3 Elevation tokens
 */
export const elevationTokens: ElevationTokens = {
  0: 'none',
  1: '0 1px 2px 0 rgb(0 0 0 / 0.3), 0 1px 3px 1px rgb(0 0 0 / 0.15)',
  2: '0 1px 2px 0 rgb(0 0 0 / 0.3), 0 2px 6px 2px rgb(0 0 0 / 0.15)',
  3: '0 4px 8px 3px rgb(0 0 0 / 0.15), 0 1px 3px 0 rgb(0 0 0 / 0.3)',
  4: '0 6px 10px 4px rgb(0 0 0 / 0.15), 0 2px 3px 0 rgb(0 0 0 / 0.3)',
  5: '0 8px 12px 6px rgb(0 0 0 / 0.15), 0 4px 4px 0 rgb(0 0 0 / 0.3)',
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
