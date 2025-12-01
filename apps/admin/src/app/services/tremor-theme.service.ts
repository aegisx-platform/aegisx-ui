import { Injectable, signal, computed } from '@angular/core';

export interface ThemeOption {
  id: string;
  name: string;
  path: string;
  dataTheme?: string; // data-theme attribute value
}

/**
 * TremorThemeService
 *
 * Manages dynamic theme switching for the admin application.
 * Supports both Tremor custom themes and Material prebuilt themes.
 *
 * All themes are loaded dynamically via <link> tags - no static imports.
 * This ensures only one theme is active at a time, preventing CSS conflicts.
 */
@Injectable({
  providedIn: 'root',
})
export class TremorThemeService {
  private readonly STORAGE_KEY = 'selected-theme';
  private readonly THEME_LINK_ID = 'aegisx-theme-link';

  // Available themes (AegisX and Verus themes - bundled via all-themes.scss)
  readonly themes: ThemeOption[] = [
    // AegisX Themes (Indigo/Zinc - Tailwind inspired)
    {
      id: 'aegisx-light',
      name: 'AegisX Light',
      path: 'aegisx-light.css',
      dataTheme: 'aegisx',
    },
    {
      id: 'aegisx-dark',
      name: 'AegisX Dark',
      path: 'aegisx-dark.css',
      dataTheme: 'aegisx-dark',
    },
    // Verus Themes (NFT Marketplace inspired)
    {
      id: 'verus-light',
      name: 'Verus Light',
      path: 'verus-light.css',
      dataTheme: 'verus',
    },
    {
      id: 'verus-dark',
      name: 'Verus Dark',
      path: 'verus-dark.css',
      dataTheme: 'verus-dark',
    },
  ];

  // Reactive state
  private currentThemeId = signal<string>('aegisx-light');

  // Public readonly signals
  readonly themeId = this.currentThemeId.asReadonly();
  readonly currentTheme = computed(() =>
    this.themes.find((t) => t.id === this.currentThemeId()),
  );

  constructor() {
    // Initialize theme from storage or use default
    this.initializeTheme();
  }

  /**
   * Set theme by ID
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

    // Update reactive state
    this.currentThemeId.set(themeId);

    // Apply theme (load CSS dynamically)
    this.applyTheme(theme);

    // Save to localStorage
    this.saveTheme(themeId);
  }

  /**
   * Initialize theme from localStorage or use default
   */
  private initializeTheme(): void {
    const savedThemeId = this.loadTheme();

    if (savedThemeId && this.themes.find((t) => t.id === savedThemeId)) {
      this.setTheme(savedThemeId);
    } else {
      // Use default theme
      this.setTheme('aegisx-light');
    }
  }

  /**
   * Apply theme via data-theme attribute
   * Themes are bundled via all-themes.scss, no dynamic CSS loading needed.
   */
  private applyTheme(theme: ThemeOption): void {
    const root = document.documentElement;

    // Set data-theme attribute (used by CSS selectors [data-theme="..."])
    const dataTheme = theme.dataTheme || theme.id.replace('-light', '');
    root.setAttribute('data-theme', dataTheme);

    // Remove all theme classes and add current theme class
    root.classList.remove(
      'theme-aegisx',
      'theme-aegisx-dark',
      'theme-verus',
      'theme-verus-dark',
    );
    root.classList.add(`theme-${dataTheme}`);

    // Apply dark/light class to HTML root for TailwindCSS dark mode
    if (theme.id.includes('dark')) {
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }

    console.log(
      `[TremorThemeService] Applied theme: ${theme.id}, data-theme="${dataTheme}"`,
    );
  }

  /**
   * Save theme preference to localStorage
   */
  private saveTheme(themeId: string): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, themeId);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }

  /**
   * Load theme preference from localStorage
   */
  private loadTheme(): string | null {
    try {
      return localStorage.getItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
      return null;
    }
  }
}
