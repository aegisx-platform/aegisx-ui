/**
 * AegisX UI - Custom Theme Builder
 *
 * Utility for creating fully custom themes.
 *
 * @packageDocumentation
 */

import {
  ColorTokens,
  SemanticColorPalette,
} from '../../foundations/colors/color-tokens';
import { TypographyTokens } from '../../foundations/typography/typography-tokens';
import { SpacingTokens } from '../../foundations/spacing/spacing-tokens';
import { RadiusTokens } from '../../foundations/borders/radius-tokens';
import { ShadowTokens } from '../../foundations/shadows/elevation-tokens';

/**
 * Custom theme configuration
 */
export interface CustomThemeConfig {
  /**
   * Theme name
   */
  name: string;

  /**
   * Color tokens (partial - will merge with defaults)
   */
  colors?: Partial<ColorTokens>;

  /**
   * Typography tokens (partial - will merge with defaults)
   */
  typography?: Partial<TypographyTokens>;

  /**
   * Spacing tokens (partial - will merge with defaults)
   */
  spacing?: Partial<SpacingTokens>;

  /**
   * Border radius tokens (partial - will merge with defaults)
   */
  radius?: Partial<RadiusTokens>;

  /**
   * Shadow tokens (partial - will merge with defaults)
   */
  shadows?: Partial<ShadowTokens>;

  /**
   * Primary brand color (auto-generates palette)
   */
  primaryColor?: string;

  /**
   * Success color
   */
  successColor?: string;

  /**
   * Warning color
   */
  warningColor?: string;

  /**
   * Error color
   */
  errorColor?: string;
}

/**
 * Generate color palette from single color
 * (Simplified version - in production, use proper color manipulation library)
 */
function generatePalette(baseColor: string): SemanticColorPalette {
  return {
    faint: baseColor + '10',
    muted: baseColor + '30',
    subtle: baseColor + '60',
    default: baseColor,
    emphasis: baseColor,
    inverted: '#ffffff',
  };
}

/**
 * Create custom theme
 *
 * @example
 * ```typescript
 * import { createCustomTheme } from '@aegisx/ui/theme';
 *
 * const hospitalTheme = createCustomTheme({
 *   name: 'hospital-blue',
 *   primaryColor: '#2563eb',
 *   spacing: {
 *     lg: '2rem' // Override default spacing
 *   }
 * });
 * ```
 */
export function createCustomTheme(config: CustomThemeConfig) {
  // Import defaults
  const { lightColorTokens } = require('../../foundations/colors/color-tokens');
  const {
    typographyTokens,
  } = require('../../foundations/typography/typography-tokens');
  const { spacingTokens } = require('../../foundations/spacing/spacing-tokens');
  const { radiusTokens } = require('../../foundations/borders/radius-tokens');
  const {
    shadowTokens,
  } = require('../../foundations/shadows/elevation-tokens');

  // Build color tokens
  const colors: ColorTokens = {
    ...lightColorTokens,
    ...config.colors,
  };

  // Override with auto-generated palettes if colors provided
  if (config.primaryColor) {
    colors.brand = generatePalette(config.primaryColor);
  }
  if (config.successColor) {
    colors.success = generatePalette(config.successColor);
  }
  if (config.warningColor) {
    colors.warning = generatePalette(config.warningColor);
  }
  if (config.errorColor) {
    colors.error = generatePalette(config.errorColor);
  }

  return {
    name: config.name,
    colors,
    typography: {
      ...typographyTokens,
      ...config.typography,
    },
    spacing: {
      ...spacingTokens,
      ...config.spacing,
    },
    radius: {
      ...radiusTokens,
      ...config.radius,
    },
    shadows: {
      ...shadowTokens,
      ...config.shadows,
    },

    /**
     * Generate CSS variables
     */
    toCSSVariables(): Record<string, string> {
      const vars: Record<string, string> = {};

      // Generate color variables
      vars['--ax-primary'] = this.colors.brand.default;
      vars['--ax-primary-faint'] = this.colors.brand.faint;
      vars['--ax-primary-emphasis'] = this.colors.brand.emphasis;

      vars['--ax-success'] = this.colors.success.default;
      vars['--ax-warning'] = this.colors.warning.default;
      vars['--ax-error'] = this.colors.error.default;
      vars['--ax-info'] = this.colors.info.default;

      vars['--ax-bg'] = this.colors.background.default;
      vars['--ax-text'] = this.colors.text.primary;
      vars['--ax-border'] = this.colors.border.default;

      // Add spacing variables
      Object.entries(this.spacing).forEach(([key, value]) => {
        vars[`--ax-spacing-${key}`] = value;
      });

      // Add radius variables
      Object.entries(this.radius).forEach(([key, value]) => {
        vars[`--ax-radius-${key}`] = value;
      });

      return vars;
    },

    /**
     * Apply theme to document
     */
    apply(): void {
      const vars = this.toCSSVariables();
      const root = document.documentElement;

      Object.entries(vars).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });

      // Add theme class
      root.classList.add(`theme-${this.name}`);
    },
  };
}

/**
 * Predefined custom theme examples
 */
export const customThemeExamples = {
  /**
   * Hospital theme with blue primary
   */
  hospital: createCustomTheme({
    name: 'hospital',
    primaryColor: '#2563eb',
    successColor: '#10b981',
    warningColor: '#f59e0b',
    errorColor: '#ef4444',
  }),

  /**
   * Inventory theme with purple primary
   */
  inventory: createCustomTheme({
    name: 'inventory',
    primaryColor: '#7c3aed',
    spacing: {
      lg: '1.5rem',
    },
  }),

  /**
   * Marketplace theme with teal primary
   */
  marketplace: createCustomTheme({
    name: 'marketplace',
    primaryColor: '#14b8a6',
  }),
};
