/**
 * AegisX UI - Border Radius Design Tokens
 *
 * Border radius scale for rounded corners.
 *
 * @packageDocumentation
 */

/**
 * Border radius scale keys
 */
export type RadiusScale = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

/**
 * Border radius token system
 */
export interface RadiusTokens {
  none: string; // 0
  sm: string; // 4px
  md: string; // 8px
  lg: string; // 12px
  xl: string; // 16px
  '2xl': string; // 24px
  full: string; // 9999px (pill shape)
}

/**
 * Default border radius tokens
 */
export const radiusTokens: RadiusTokens = {
  none: '0',
  sm: '0.25rem', // 4px
  md: '0.5rem', // 8px
  lg: '0.75rem', // 12px
  xl: '1rem', // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px', // Pill shape
};

/**
 * Generate CSS custom properties for radius tokens
 */
export function generateRadiusCSSVariables(
  tokens: RadiusTokens,
  prefix = 'ax',
): Record<string, string> {
  const variables: Record<string, string> = {};

  Object.entries(tokens).forEach(([key, value]) => {
    variables[`--${prefix}-radius-${key}`] = value;
  });

  return variables;
}
