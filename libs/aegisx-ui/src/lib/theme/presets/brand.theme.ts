/**
 * AegisX UI - Brand Theme Preset
 *
 * Customizable brand theme for hospital/organization branding.
 *
 * @packageDocumentation
 */

import {
  lightColorTokens,
  SemanticColorPalette,
} from '../../foundations/colors/color-tokens';
import { typographyTokens } from '../../foundations/typography/typography-tokens';
import { spacingTokens } from '../../foundations/spacing/spacing-tokens';
import { radiusTokens } from '../../foundations/borders/radius-tokens';
import { shadowTokens } from '../../foundations/shadows/elevation-tokens';

/**
 * Brand theme options
 */
export interface BrandThemeOptions {
  /**
   * Primary brand color
   */
  primaryColor: string;

  /**
   * Secondary brand color (optional)
   */
  secondaryColor?: string;

  /**
   * Organization name
   */
  organizationName?: string;

  /**
   * Use dark mode
   */
  darkMode?: boolean;
}

/**
 * Generate brand color palette from primary color
 */
function generateBrandPalette(primaryColor: string): SemanticColorPalette {
  // Simple palette generation (can be enhanced with color manipulation)
  return {
    faint: primaryColor + '10', // 10% opacity
    muted: primaryColor + '30', // 30% opacity
    subtle: primaryColor + '60', // 60% opacity
    default: primaryColor,
    emphasis: primaryColor, // Could darken/lighten
    inverted: '#ffffff',
  };
}

/**
 * Create brand theme
 */
export function createBrandTheme(options: BrandThemeOptions) {
  const baseColors = options.darkMode
    ? require('../../foundations/colors/color-tokens').darkColorTokens
    : lightColorTokens;

  return {
    name: 'brand',
    organizationName: options.organizationName || 'AegisX',
    colors: {
      ...baseColors,
      brand: generateBrandPalette(options.primaryColor),
      // Override primary with brand colors
      primary: generateBrandPalette(options.primaryColor),
    },
    typography: typographyTokens,
    spacing: spacingTokens,
    radius: radiusTokens,
    shadows: shadowTokens,

    /**
     * Generate CSS variables for brand theme
     */
    toCSSVariables(): Record<string, string> {
      return {
        // Colors
        '--ax-bg': this.colors.background.default,
        '--ax-bg-muted': this.colors.background.muted,
        '--ax-bg-subtle': this.colors.background.subtle,
        '--ax-bg-emphasis': this.colors.background.emphasis,

        '--ax-text': this.colors.text.primary,
        '--ax-text-secondary': this.colors.text.secondary,
        '--ax-text-subtle': this.colors.text.subtle,
        '--ax-text-disabled': this.colors.text.disabled,
        '--ax-text-heading': this.colors.text.heading,
        '--ax-text-inverted': this.colors.text.inverted,

        '--ax-border': this.colors.border.default,
        '--ax-border-muted': this.colors.border.muted,
        '--ax-border-emphasis': this.colors.border.emphasis,

        // Brand colors (custom)
        '--ax-primary': this.colors.brand.default,
        '--ax-primary-faint': this.colors.brand.faint,
        '--ax-primary-muted': this.colors.brand.muted,
        '--ax-primary-subtle': this.colors.brand.subtle,
        '--ax-primary-emphasis': this.colors.brand.emphasis,
        '--ax-primary-inverted': this.colors.brand.inverted,

        // Semantic colors
        '--ax-success': this.colors.success.default,
        '--ax-warning': this.colors.warning.default,
        '--ax-error': this.colors.error.default,
        '--ax-info': this.colors.info.default,
      };
    },
  };
}

/**
 * Default brand theme (uses indigo)
 */
export const brandTheme = createBrandTheme({
  primaryColor: '#6366f1', // Indigo-500
  organizationName: 'AegisX',
  darkMode: false,
});

export type BrandTheme = typeof brandTheme;
