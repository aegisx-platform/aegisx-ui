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
      // COLORS (mapped from design tokens)
      // ============================================
      colors: {
        // Brand/Primary (Indigo)
        primary: {
          50: '#eef2ff', // indigo-50
          100: '#e0e7ff', // indigo-100
          200: '#c7d2fe', // indigo-200
          300: '#a5b4fc', // indigo-300
          400: '#818cf8', // indigo-400
          500: '#6366f1', // indigo-500
          600: '#4f46e5', // indigo-600
          700: '#4338ca', // indigo-700
          800: '#3730a3', // indigo-800
          900: '#312e81', // indigo-900
          DEFAULT: '#6366f1',
        },

        // Success (Green)
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          300: '#86efac',
          500: '#22c55e',
          600: '#16a34a',
          DEFAULT: '#22c55e',
        },

        // Warning (Amber)
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          300: '#fcd34d',
          500: '#f59e0b',
          600: '#d97706',
          DEFAULT: '#f59e0b',
        },

        // Error (Red)
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          300: '#fca5a5',
          500: '#ef4444',
          600: '#dc2626',
          DEFAULT: '#ef4444',
        },

        // Info (Blue)
        info: {
          50: '#eff6ff',
          100: '#dbeafe',
          300: '#93c5fd',
          500: '#3b82f6',
          600: '#2563eb',
          DEFAULT: '#3b82f6',
        },

        // Backward compatibility
        accent: {
          500: '#a855f7', // purple-500
          DEFAULT: '#a855f7',
        },
        warn: {
          500: '#ef4444', // red-500
          DEFAULT: '#ef4444',
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
      // ============================================
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          '"SF Mono"',
          'Menlo',
          'Consolas',
          'monospace',
        ],
      },

      fontSize: {
        xs: '0.75rem', // 12px
        sm: '0.875rem', // 14px
        base: '1rem', // 16px
        lg: '1.125rem', // 18px
        xl: '1.25rem', // 20px
        '2xl': '1.5rem', // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem', // 36px
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
