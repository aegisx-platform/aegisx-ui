/**
 * AegisX UI - Theme Provider (Angular 17+)
 *
 * Provider function for configuring the theme system.
 *
 * @packageDocumentation
 */

import { Provider, ENVIRONMENT_INITIALIZER, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * Theme configuration options
 */
export interface ThemeConfig {
  /**
   * Default theme name
   * @default 'light'
   */
  defaultTheme?: 'light' | 'dark' | 'brand' | 'auto';

  /**
   * Enable automatic dark mode detection
   * @default true
   */
  autoDetectDarkMode?: boolean;

  /**
   * Persist theme selection in localStorage
   * @default true
   */
  persistTheme?: boolean;

  /**
   * LocalStorage key for theme persistence
   * @default 'ax-theme'
   */
  storageKey?: string;

  /**
   * Enable smooth theme transitions
   * @default true
   */
  enableTransitions?: boolean;

  /**
   * Custom theme CSS URL (optional)
   */
  customThemeUrl?: string;
}

/**
 * Default theme configuration
 */
const DEFAULT_THEME_CONFIG: Required<ThemeConfig> = {
  defaultTheme: 'light',
  autoDetectDarkMode: true,
  persistTheme: true,
  storageKey: 'ax-theme',
  enableTransitions: true,
  customThemeUrl: '',
};

/**
 * Theme service for managing theme state
 */
export class ThemeService {
  private currentTheme: string;
  private document: Document;

  constructor(config: Required<ThemeConfig>) {
    this.document = inject(DOCUMENT);
    this.currentTheme = this.getInitialTheme(config);
    this.applyTheme(this.currentTheme, config.enableTransitions);
  }

  /**
   * Get initial theme from localStorage or config
   */
  private getInitialTheme(config: Required<ThemeConfig>): string {
    if (config.persistTheme) {
      const stored = localStorage.getItem(config.storageKey);
      if (stored) return stored;
    }

    if (config.defaultTheme === 'auto' && config.autoDetectDarkMode) {
      return this.prefersDarkMode() ? 'dark' : 'light';
    }

    return config.defaultTheme;
  }

  /**
   * Check if user prefers dark mode
   */
  private prefersDarkMode(): boolean {
    return (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  }

  /**
   * Apply theme to document
   */
  private applyTheme(theme: string, enableTransitions: boolean): void {
    const html = this.document.documentElement;

    // Add transition class if enabled
    if (enableTransitions) {
      html.classList.add('ax-theme-transition');
    }

    // Remove old theme classes
    html.classList.remove(
      'light',
      'dark',
      'theme-brand',
      'theme-teal',
      'theme-rose',
      'theme-purple',
      'theme-amber',
    );

    // Add new theme class
    if (theme === 'light' || theme === 'dark') {
      html.classList.add(theme);
    } else {
      html.classList.add('theme-' + theme);
    }

    // Remove transition class after animation
    if (enableTransitions) {
      setTimeout(() => {
        html.classList.remove('ax-theme-transition');
      }, 300);
    }
  }

  /**
   * Set theme
   */
  setTheme(theme: string, persist = true): void {
    this.currentTheme = theme;
    this.applyTheme(theme, true);

    if (persist) {
      localStorage.setItem('ax-theme', theme);
    }
  }

  /**
   * Get current theme
   */
  getTheme(): string {
    return this.currentTheme;
  }

  /**
   * Toggle between light and dark
   */
  toggle(): void {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
}

/**
 * Provide AegisX UI Theme System
 *
 * @example
 * ```typescript
 * import { provideAegisxTheme } from '@aegisx/ui/theme';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideAegisxTheme({
 *       defaultTheme: 'light',
 *       autoDetectDarkMode: true
 *     })
 *   ]
 * };
 * ```
 */
export function provideAegisxTheme(config: ThemeConfig = {}): Provider[] {
  const mergedConfig: Required<ThemeConfig> = {
    ...DEFAULT_THEME_CONFIG,
    ...config,
  };

  return [
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => {
        const themeService = new ThemeService(mergedConfig);

        // Make service globally accessible
        if (typeof window !== 'undefined') {
          (window as any).aegisxTheme = themeService;
        }

        // Listen for system dark mode changes
        if (mergedConfig.autoDetectDarkMode && window.matchMedia) {
          const darkModeQuery = window.matchMedia(
            '(prefers-color-scheme: dark)',
          );
          darkModeQuery.addEventListener('change', (e) => {
            if (mergedConfig.defaultTheme === 'auto') {
              themeService.setTheme(e.matches ? 'dark' : 'light', false);
            }
          });
        }
      },
    },
  ];
}

/**
 * Legacy: Create theme service instance (for backward compatibility)
 * @deprecated Use provideAegisxTheme() instead
 */
export function createThemeService(config: ThemeConfig = {}): ThemeService {
  const mergedConfig: Required<ThemeConfig> = {
    ...DEFAULT_THEME_CONFIG,
    ...config,
  };

  return new ThemeService(mergedConfig);
}
