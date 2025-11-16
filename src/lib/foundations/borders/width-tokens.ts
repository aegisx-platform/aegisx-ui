/**
 * AegisX UI - Border Width Design Tokens
 *
 * Border width scale for consistent borders.
 *
 * @packageDocumentation
 */

/**
 * Border width scale keys
 */
export type BorderWidthScale = 'none' | 'thin' | 'default' | 'thick';

/**
 * Border width token system
 */
export interface BorderWidthTokens {
  none: string; // 0
  thin: string; // 1px
  default: string; // 2px
  thick: string; // 4px
}

/**
 * Default border width tokens
 */
export const borderWidthTokens: BorderWidthTokens = {
  none: '0',
  thin: '1px',
  default: '2px',
  thick: '4px',
};

/**
 * Generate CSS custom properties for border width tokens
 */
export function generateBorderWidthCSSVariables(
  tokens: BorderWidthTokens,
  prefix = 'ax',
): Record<string, string> {
  const variables: Record<string, string> = {};

  Object.entries(tokens).forEach(([key, value]) => {
    variables[`--${prefix}-border-width-${key}`] = value;
  });

  return variables;
}
