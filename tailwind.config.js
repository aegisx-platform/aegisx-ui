const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/**
 * AegisX UI - Enhanced Tailwind Configuration
 *
 * Maps all design tokens to Tailwind utilities for consistent theming.
 * Integrates with TypeScript design tokens from foundations/.
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // ============================================
      // COLORS (CSS custom properties for runtime theming)
      // ============================================
      colors: {
        // Brand/Primary Colors
        brand: {
          faint: 'var(--ax-brand-faint)',
          muted: 'var(--ax-brand-muted)',
          subtle: 'var(--ax-brand-subtle)',
          DEFAULT: 'var(--ax-brand-default)',
          emphasis: 'var(--ax-brand-emphasis)',
          strong: 'var(--ax-brand-strong)',
          inverted: 'var(--ax-brand-inverted)',
        },

        // Success Colors
        success: {
          faint: 'var(--ax-success-faint)',
          muted: 'var(--ax-success-muted)',
          subtle: 'var(--ax-success-subtle)',
          DEFAULT: 'var(--ax-success-default)',
          emphasis: 'var(--ax-success-emphasis)',
          inverted: 'var(--ax-success-inverted)',
        },

        // Warning Colors
        warning: {
          faint: 'var(--ax-warning-faint)',
          muted: 'var(--ax-warning-muted)',
          subtle: 'var(--ax-warning-subtle)',
          DEFAULT: 'var(--ax-warning-default)',
          emphasis: 'var(--ax-warning-emphasis)',
          inverted: 'var(--ax-warning-inverted)',
        },

        // Error/Danger Colors
        error: {
          faint: 'var(--ax-error-faint)',
          muted: 'var(--ax-error-muted)',
          subtle: 'var(--ax-error-subtle)',
          DEFAULT: 'var(--ax-error-default)',
          emphasis: 'var(--ax-error-emphasis)',
          inverted: 'var(--ax-error-inverted)',
        },

        // Info Colors
        info: {
          faint: 'var(--ax-info-faint)',
          muted: 'var(--ax-info-muted)',
          subtle: 'var(--ax-info-subtle)',
          DEFAULT: 'var(--ax-info-default)',
          emphasis: 'var(--ax-info-emphasis)',
          inverted: 'var(--ax-info-inverted)',
        },

        // Cyan Colors
        cyan: {
          faint: 'var(--ax-cyan-faint)',
          muted: 'var(--ax-cyan-muted)',
          subtle: 'var(--ax-cyan-subtle)',
          DEFAULT: 'var(--ax-cyan-default)',
          emphasis: 'var(--ax-cyan-emphasis)',
          inverted: 'var(--ax-cyan-inverted)',
        },

        // Purple Colors
        purple: {
          faint: 'var(--ax-purple-faint)',
          muted: 'var(--ax-purple-muted)',
          subtle: 'var(--ax-purple-subtle)',
          DEFAULT: 'var(--ax-purple-default)',
          emphasis: 'var(--ax-purple-emphasis)',
          inverted: 'var(--ax-purple-inverted)',
        },

        // Indigo Colors
        indigo: {
          faint: 'var(--ax-indigo-faint)',
          muted: 'var(--ax-indigo-muted)',
          subtle: 'var(--ax-indigo-subtle)',
          DEFAULT: 'var(--ax-indigo-default)',
          emphasis: 'var(--ax-indigo-emphasis)',
          inverted: 'var(--ax-indigo-inverted)',
        },

        // Pink Colors
        pink: {
          faint: 'var(--ax-pink-faint)',
          muted: 'var(--ax-pink-muted)',
          subtle: 'var(--ax-pink-subtle)',
          DEFAULT: 'var(--ax-pink-default)',
          emphasis: 'var(--ax-pink-emphasis)',
          inverted: 'var(--ax-pink-inverted)',
        },

        // Background Colors
        background: {
          muted: 'var(--ax-background-muted)',
          subtle: 'var(--ax-background-subtle)',
          DEFAULT: 'var(--ax-background-default)',
          emphasis: 'var(--ax-background-emphasis)',
        },

        // Text Colors
        text: {
          disabled: 'var(--ax-text-disabled)',
          subtle: 'var(--ax-text-subtle)',
          secondary: 'var(--ax-text-secondary)',
          primary: 'var(--ax-text-primary)',
          heading: 'var(--ax-text-heading)',
          inverted: 'var(--ax-text-inverted)',
        },

        // Border Colors
        border: {
          muted: 'var(--ax-border-muted)',
          DEFAULT: 'var(--ax-border-default)',
          emphasis: 'var(--ax-border-emphasis)',
        },

        // Backward compatibility (using CSS variables)
        primary: {
          DEFAULT: 'var(--ax-brand-default)',
        },
        accent: {
          DEFAULT: 'var(--ax-purple-default)',
        },
        warn: {
          DEFAULT: 'var(--ax-error-default)',
        },
      },

      // ============================================
      // SPACING (8px grid system from design tokens)
      // ============================================
      spacing: {
        xs: '0.25rem', // 4px
        sm: '0.5rem', // 8px
        md: '0.75rem', // 12px
        lg: '1rem', // 16px
        xl: '1.5rem', // 24px
        '2xl': '2rem', // 32px
        '3xl': '3rem', // 48px
        '4xl': '4rem', // 64px
      },

      // ============================================
      // TYPOGRAPHY (from design tokens)
      // Single Source of Truth: _aegisx-tokens.scss
      // ============================================
      fontFamily: {
        sans: [
          'Inter',
          '"Noto Sans Thai"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"',
          '"Fira Code"',
          'ui-monospace',
          'SFMono-Regular',
          '"SF Mono"',
          'Menlo',
          'Consolas',
          'monospace',
        ],
      },

      fontSize: {
        xs: '0.625rem', // 10px
        sm: '0.75rem', // 12px
        md: '0.8125rem', // 13px
        base: '0.875rem', // 14px
        lg: '1rem', // 16px
        xl: '1.125rem', // 18px
        '2xl': '1.25rem', // 20px
        '3xl': '1.5rem', // 24px
        '4xl': '2rem', // 32px
        '5xl': '2.25rem', // 36px
        '6xl': '2.5rem', // 40px
        '7xl': '3rem', // 48px
        '8xl': '4rem', // 64px
        '9xl': '6rem', // 96px
        '10xl': '8rem', // 128px
      },

      // ============================================
      // BORDER RADIUS (from design tokens)
      // ============================================
      borderRadius: {
        none: '0',
        sm: '0.25rem', // 4px
        md: '0.5rem', // 8px
        lg: '0.75rem', // 12px
        xl: '1rem', // 16px
        '2xl': '1.5rem', // 24px
        full: '9999px',
      },

      // ============================================
      // SHADOWS (from design tokens)
      // ============================================
      boxShadow: {
        xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',

        // Material 3 Elevation
        'elevation-1':
          '0 1px 2px 0 rgb(0 0 0 / 0.3), 0 1px 3px 1px rgb(0 0 0 / 0.15)',
        'elevation-2':
          '0 1px 2px 0 rgb(0 0 0 / 0.3), 0 2px 6px 2px rgb(0 0 0 / 0.15)',
        'elevation-3':
          '0 4px 8px 3px rgb(0 0 0 / 0.15), 0 1px 3px 0 rgb(0 0 0 / 0.3)',
      },

      // ============================================
      // MOTION (from design tokens)
      // ============================================
      transitionDuration: {
        instant: '75ms',
        fast: '150ms',
        normal: '250ms',
        slow: '350ms',
        slower: '500ms',
      },

      transitionTimingFunction: {
        'ease-standard': 'cubic-bezier(0.2, 0, 0, 1)',
        'ease-emphasized': 'cubic-bezier(0.2, 0, 0, 1)',
      },

      // ============================================
      // BREAKPOINTS (from design tokens)
      // ============================================
      screens: {
        xs: '0px',
        sm: '600px', // Mobile landscape / Small tablet
        md: '960px', // Tablet
        lg: '1280px', // Desktop
        xl: '1440px', // Large desktop
        '2xl': '1920px', // Extra large desktop
      },

      // ============================================
      // ANIMATIONS (enhanced)
      // ============================================
      animation: {
        'fade-in': 'fadeIn 150ms ease-out',
        'fade-out': 'fadeOut 150ms ease-in',
        'slide-in-left': 'slideInLeft 250ms ease-out',
        'slide-in-right': 'slideInRight 250ms ease-out',
        'slide-in-top': 'slideInTop 250ms ease-out',
        'slide-in-bottom': 'slideInBottom 250ms ease-out',
        'scale-in': 'scaleIn 150ms ease-out',
        'bounce-subtle': 'bounceSubtle 300ms ease-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInTop: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInBottom: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5%)' },
        },
      },

      // ============================================
      // OTHER UTILITIES
      // ============================================
      width: {
        128: '32rem',
        256: '64rem',
      },
      maxWidth: {
        128: '32rem',
        256: '64rem',
      },
    },
  },
  plugins: [
    // Custom plugin for AegisX UI utilities
    function ({ addUtilities, addComponents, theme }) {
      // Component utilities
      addComponents({
        '.ax-card': {
          backgroundColor: 'var(--ax-card-bg, white)',
          borderRadius: theme('borderRadius.lg'),
          boxShadow: theme('boxShadow.md'),
        },
        '.ax-card-header': {
          padding: `${theme('spacing.4')} ${theme('spacing.6')}`,
          borderBottom: `1px solid var(--ax-border)`,
        },
        '.ax-card-body': {
          padding: theme('spacing.6'),
        },
        '.ax-card-footer': {
          padding: `${theme('spacing.4')} ${theme('spacing.6')}`,
          borderTop: `1px solid var(--ax-border)`,
        },
      });

      // Utility classes
      addUtilities({
        '.ax-container': {
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.4'),
          paddingRight: theme('spacing.4'),
        },
        '.ax-transition': {
          transition: `all ${theme('transitionDuration.fast')} ${theme('transitionTimingFunction.ease-standard')}`,
        },
      });
    },
  ],
};
