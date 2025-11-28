import { Injectable, signal, computed, effect } from '@angular/core';
import {
  ThemeOption,
  ThemeConfig,
  ColorScheme,
  ThemeMode,
} from './ax-theme.types';

/**
 * AxThemeService
 *
 * Manages dynamic theme switching for AegisX applications.
 * Supports multiple color schemes (aegisx, verus) and theme modes (light, dark).
 *
 * Theme switching is done via data-theme attribute on document root.
 * All themes are included in the main CSS bundle via _all-themes.scss.
 */
@Injectable({
  providedIn: 'root',
})
export class AxThemeService {
  private readonly STORAGE_KEY = 'ax-theme-config';
  private readonly THEME_LINK_ID = 'ax-theme-link';

  // Available color schemes
  readonly colorSchemes: { id: ColorScheme; name: string }[] = [
    { id: 'aegisx', name: 'AegisX' },
    { id: 'verus', name: 'Verus' },
  ];

  // Available themes (for backward compatibility)
  readonly themes: ThemeOption[] = [
    // AegisX Themes
    {
      id: 'aegisx-light',
      name: 'AegisX Light',
      path: 'aegisx-light.css',
      colorScheme: 'aegisx',
      mode: 'light',
      dataTheme: 'aegisx',
    },
    {
      id: 'aegisx-dark',
      name: 'AegisX Dark',
      path: 'aegisx-dark.css',
      colorScheme: 'aegisx',
      mode: 'dark',
      dataTheme: 'aegisx-dark',
    },
    // Verus Themes
    {
      id: 'verus-light',
      name: 'Verus Light',
      path: 'verus-light.css',
      colorScheme: 'verus',
      mode: 'light',
      dataTheme: 'verus',
    },
    {
      id: 'verus-dark',
      name: 'Verus Dark',
      path: 'verus-dark.css',
      colorScheme: 'verus',
      mode: 'dark',
      dataTheme: 'verus-dark',
    },
  ];

  // Reactive state - separate color scheme and mode
  private _colorScheme = signal<ColorScheme>('aegisx');
  private _mode = signal<ThemeMode>('light');

  // Public readonly signals
  readonly colorScheme = this._colorScheme.asReadonly();
  readonly mode = this._mode.asReadonly();

  // Computed theme ID and config
  readonly themeId = computed(() => {
    const scheme = this._colorScheme();
    const mode = this._mode();
    return `${scheme}-${mode}`; // Always include mode: aegisx-light, aegisx-dark, etc.
  });

  readonly dataTheme = computed(() => {
    const scheme = this._colorScheme();
    const mode = this._mode();
    return mode === 'light' ? scheme : `${scheme}-dark`;
  });

  readonly currentTheme = computed(() =>
    this.themes.find((t) => t.id === this.themeId()),
  );

  readonly config = computed<ThemeConfig>(() => ({
    colorScheme: this._colorScheme(),
    mode: this._mode(),
    themeId: this.themeId(),
    dataTheme: this.dataTheme(),
  }));

  // Legacy support
  private currentThemeId = computed(() => this.themeId());

  constructor() {
    // Initialize theme from storage or use default
    this.initializeTheme();

    // Effect to apply theme when it changes
    effect(() => {
      const dataTheme = this.dataTheme();
      this.applyDataTheme(dataTheme);
    });
  }

  /**
   * Set color scheme (aegisx, verus)
   */
  setColorScheme(scheme: ColorScheme): void {
    if (!this.colorSchemes.find((s) => s.id === scheme)) {
      console.warn(
        `Color scheme "${scheme}" not found. Available:`,
        this.colorSchemes.map((s) => s.id),
      );
      return;
    }

    this._colorScheme.set(scheme);

    // Apply theme immediately
    const mode = this._mode();
    const dataTheme = mode === 'light' ? scheme : `${scheme}-dark`;
    this.applyDataTheme(dataTheme);

    this.saveConfig();
  }

  /**
   * Set theme mode (light, dark)
   */
  setMode(mode: ThemeMode): void {
    this._mode.set(mode);

    // Apply theme immediately
    const scheme = this._colorScheme();
    const dataTheme = mode === 'light' ? scheme : `${scheme}-dark`;
    this.applyDataTheme(dataTheme);

    this.saveConfig();
  }

  /**
   * Toggle between light and dark modes
   */
  toggleMode(): void {
    const newMode = this._mode() === 'light' ? 'dark' : 'light';
    this.setMode(newMode);
  }

  /**
   * Set theme by ID (backward compatible)
   */
  setTheme(themeId: string): void {
    const theme = this.themes.find((t) => t.id === themeId);

    if (!theme) {
      console.warn(
        `Theme "${themeId}" not found. Available themes:`,
        this.themes.map((t) => t.id),
      );
      return;
    }

    // Update both scheme and mode
    if (theme.colorScheme) {
      this._colorScheme.set(theme.colorScheme);
    }
    if (theme.mode) {
      this._mode.set(theme.mode);
    }

    // Apply theme immediately (don't rely on effect which may not trigger)
    const dataTheme =
      theme.dataTheme ||
      (theme.mode === 'light'
        ? theme.colorScheme
        : `${theme.colorScheme}-dark`);
    if (dataTheme) {
      this.applyDataTheme(dataTheme);
    }

    this.saveConfig();
  }

  /**
   * Initialize theme from localStorage or use default
   */
  private initializeTheme(): void {
    const savedConfig = this.loadConfig();

    if (savedConfig) {
      this._colorScheme.set(savedConfig.colorScheme);
      this._mode.set(savedConfig.mode);
      // Apply theme immediately on load!
      this.applyDataTheme(savedConfig.dataTheme);
    } else {
      // Use system preference for mode
      const prefersDark = window.matchMedia?.(
        '(prefers-color-scheme: dark)',
      ).matches;
      this._mode.set(prefersDark ? 'dark' : 'light');
      // Apply default theme
      const dataTheme = prefersDark ? 'aegisx-dark' : 'aegisx';
      this.applyDataTheme(dataTheme);
    }
  }

  /**
   * Apply theme via data-theme attribute
   */
  private applyDataTheme(dataTheme: string): void {
    const root = document.documentElement;

    // Set data-theme attribute
    root.setAttribute('data-theme', dataTheme);

    // Also set class for compatibility
    root.classList.remove(
      'theme-aegisx',
      'theme-aegisx-dark',
      'theme-verus',
      'theme-verus-dark',
    );
    root.classList.add(`theme-${dataTheme}`);

    // Apply dark/light class for TailwindCSS dark mode
    if (dataTheme.includes('dark')) {
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }

    console.log(`[AxThemeService] Applied theme: data-theme="${dataTheme}"`);
  }

  /**
   * Apply theme by dynamically loading CSS file (backward compatible)
   */
  private applyThemeLink(theme: ThemeOption): void {
    // Only apply link for Material prebuilt themes
    if (!theme.path.startsWith('themes/')) {
      return;
    }

    // Remove existing theme link if any
    const existingLink = document.getElementById(this.THEME_LINK_ID);
    if (existingLink) {
      existingLink.remove();
    }

    // Create and append new theme link
    const linkElement = document.createElement('link');
    linkElement.id = this.THEME_LINK_ID;
    linkElement.rel = 'stylesheet';
    linkElement.href = theme.path;

    // Add to document head
    document.head.appendChild(linkElement);
  }

  /**
   * Save theme config to localStorage
   */
  private saveConfig(): void {
    try {
      const config: ThemeConfig = {
        colorScheme: this._colorScheme(),
        mode: this._mode(),
        themeId: this.themeId(),
        dataTheme: this.dataTheme(),
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.warn('Failed to save theme config to localStorage:', error);
    }
  }

  /**
   * Load theme config from localStorage
   */
  private loadConfig(): ThemeConfig | null {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved) as ThemeConfig;
      }
      return null;
    } catch (error) {
      console.warn('Failed to load theme config from localStorage:', error);
      return null;
    }
  }
}
