/**
 * AegisX UI - Light Theme Preset
 *
 * Default light theme using design tokens.
 *
 * @packageDocumentation
 */

import { lightColorTokens } from '../../foundations/colors/color-tokens';
import { typographyTokens } from '../../foundations/typography/typography-tokens';
import { spacingTokens } from '../../foundations/spacing/spacing-tokens';
import { radiusTokens } from '../../foundations/borders/radius-tokens';
import { shadowTokens } from '../../foundations/shadows/elevation-tokens';

/**
 * Light theme configuration
 */
export const lightTheme = {
  name: 'light',
  colors: lightColorTokens,
  typography: typographyTokens,
  spacing: spacingTokens,
  radius: radiusTokens,
  shadows: shadowTokens,

  /**
   * Generate CSS variables for light theme
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

      // Brand colors
      '--ax-primary': this.colors.brand.default,
      '--ax-primary-faint': this.colors.brand.faint,
      '--ax-primary-muted': this.colors.brand.muted,
      '--ax-primary-subtle': this.colors.brand.subtle,
      '--ax-primary-emphasis': this.colors.brand.emphasis,
      '--ax-primary-inverted': this.colors.brand.inverted,

      // Semantic colors
      '--ax-success': this.colors.success.default,
      '--ax-success-faint': this.colors.success.faint,
      '--ax-success-emphasis': this.colors.success.emphasis,

      '--ax-warning': this.colors.warning.default,
      '--ax-warning-faint': this.colors.warning.faint,
      '--ax-warning-emphasis': this.colors.warning.emphasis,

      '--ax-error': this.colors.error.default,
      '--ax-error-faint': this.colors.error.faint,
      '--ax-error-emphasis': this.colors.error.emphasis,

      '--ax-info': this.colors.info.default,
      '--ax-info-faint': this.colors.info.faint,
      '--ax-info-emphasis': this.colors.info.emphasis,
    };
  },
};

export type LightTheme = typeof lightTheme;
