/**
 * AegisX UI - Spacing Design Tokens
 *
 * 8px-based spacing scale for consistent layout and spacing.
 *
 * @packageDocumentation
 */

/**
 * Spacing scale keys
 */
export type SpacingScale =
  | 'xs' // 4px
  | 'sm' // 8px
  | 'md' // 12px
  | 'lg' // 16px
  | 'xl' // 24px
  | '2xl' // 32px
  | '3xl' // 48px
  | '4xl'; // 64px

/**
 * Spacing token system
 */
export interface SpacingTokens {
  xs: string; // 0.25rem / 4px
  sm: string; // 0.5rem / 8px
  md: string; // 0.75rem / 12px
  lg: string; // 1rem / 16px
  xl: string; // 1.5rem / 24px
  '2xl': string; // 2rem / 32px
  '3xl': string; // 3rem / 48px
  '4xl': string; // 4rem / 64px
}

/**
 * Default spacing tokens (8px grid system)
 */
export const spacingTokens: SpacingTokens = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '0.75rem', // 12px
  lg: '1rem', // 16px
  xl: '1.5rem', // 24px
  '2xl': '2rem', // 32px
  '3xl': '3rem', // 48px
  '4xl': '4rem', // 64px
};

/**
 * Semantic spacing tokens for specific use cases
 */
export interface SemanticSpacingTokens {
  // Component internal spacing
  component: {
    xs: string; // Tight spacing inside small components
    sm: string; // Normal spacing inside components
    md: string; // Comfortable spacing inside components
    lg: string; // Spacious spacing inside components
  };

  // Layout spacing
  layout: {
    xs: string; // Minimal gap between elements
    sm: string; // Small gap between elements
    md: string; // Normal gap between sections
    lg: string; // Large gap between sections
    xl: string; // Extra large gap between major sections
  };

  // Container spacing
  container: {
    xs: string; // Minimal container padding
    sm: string; // Small container padding
    md: string; // Normal container padding
    lg: string; // Large container padding
    xl: string; // Extra large container padding
  };

  // Inset spacing (all sides)
  inset: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };

  // Stack spacing (vertical)
  stack: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

/**
 * Default semantic spacing tokens
 */
export const semanticSpacingTokens: SemanticSpacingTokens = {
  component: {
    xs: spacingTokens.xs, // 4px
    sm: spacingTokens.sm, // 8px
    md: spacingTokens.md, // 12px
    lg: spacingTokens.lg, // 16px
  },

  layout: {
    xs: spacingTokens.sm, // 8px
    sm: spacingTokens.lg, // 16px
    md: spacingTokens.xl, // 24px
    lg: spacingTokens['2xl'], // 32px
    xl: spacingTokens['3xl'], // 48px
  },

  container: {
    xs: spacingTokens.sm, // 8px
    sm: spacingTokens.lg, // 16px
    md: spacingTokens.xl, // 24px
    lg: spacingTokens['2xl'], // 32px
    xl: spacingTokens['3xl'], // 48px
  },

  inset: {
    xs: spacingTokens.xs, // 4px
    sm: spacingTokens.sm, // 8px
    md: spacingTokens.lg, // 16px
    lg: spacingTokens.xl, // 24px
    xl: spacingTokens['2xl'], // 32px
  },

  stack: {
    xs: spacingTokens.xs, // 4px
    sm: spacingTokens.sm, // 8px
    md: spacingTokens.lg, // 16px
    lg: spacingTokens.xl, // 24px
    xl: spacingTokens['2xl'], // 32px
  },
};

/**
 * Generate CSS custom properties for spacing tokens
 */
export function generateSpacingCSSVariables(
  tokens: SpacingTokens,
  prefix = 'ax',
): Record<string, string> {
  const variables: Record<string, string> = {};

  Object.entries(tokens).forEach(([key, value]) => {
    variables[`--${prefix}-spacing-${key}`] = value;
  });

  return variables;
}

/**
 * Generate CSS custom properties for semantic spacing tokens
 */
export function generateSemanticSpacingCSSVariables(
  tokens: SemanticSpacingTokens,
  prefix = 'ax',
): Record<string, string> {
  const variables: Record<string, string> = {};

  Object.entries(tokens).forEach(([category, sizes]) => {
    Object.entries(sizes).forEach(([size, value]) => {
      variables[`--${prefix}-${category}-${size}`] = value;
    });
  });

  return variables;
}

/**
 * Spacing utility functions
 */
export const spacingUtils = {
  /**
   * Convert rem to pixels
   */
  remToPixels(rem: string, baseFontSize = 16): number {
    const value = parseFloat(rem.replace('rem', ''));
    return value * baseFontSize;
  },

  /**
   * Get spacing value in pixels
   */
  getPixelValue(scale: SpacingScale, baseFontSize = 16): number {
    return this.remToPixels(spacingTokens[scale], baseFontSize);
  },

  /**
   * Generate spacing scale array
   */
  getScaleArray(): number[] {
    return Object.values(spacingTokens).map((value) => this.remToPixels(value));
  },
};
