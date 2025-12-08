import { Injectable, signal, computed, effect } from '@angular/core';
import {
  ThemeDefinition,
  ThemeColorSlots,
  ThemeDesignTokens,
  ThemePreset,
  OklchColor,
  ExportOptions,
  DEFAULT_DESIGN_TOKENS,
  DEFAULT_LIGHT_COLORS,
  DEFAULT_DARK_COLORS,
} from '../models/theme-generator.types';
import {
  generateContentColor,
  oklchToString,
  oklchToHex,
  hexToOklch,
  adjustLightness,
} from '../utils/oklch.utils';
import {
  generateExport,
  generateCSSVariables,
  getFileExtension,
  getMimeType,
} from '../utils/css-generator.utils';

const STORAGE_KEY = 'aegisx-custom-themes';
const CURRENT_THEME_KEY = 'aegisx-generator-current';

@Injectable({
  providedIn: 'root',
})
export class ThemeGeneratorService {
  // ============================================================================
  // State Signals
  // ============================================================================

  /** Current theme being edited */
  private _currentTheme = signal<ThemeDefinition>(
    this.createDefaultLightTheme(),
  );

  /** All saved custom themes */
  private _savedThemes = signal<ThemeDefinition[]>([]);

  /** Preview mode - applies theme in real-time */
  private _previewEnabled = signal(true);

  /** Selected color slot for editing */
  private _selectedSlot = signal<keyof ThemeColorSlots | null>(null);

  // ============================================================================
  // Computed Values
  // ============================================================================

  readonly currentTheme = this._currentTheme.asReadonly();
  readonly savedThemes = this._savedThemes.asReadonly();
  readonly previewEnabled = this._previewEnabled.asReadonly();
  readonly selectedSlot = this._selectedSlot.asReadonly();

  /** Get current colors */
  readonly colors = computed(() => this._currentTheme().colors);

  /** Get current design tokens */
  readonly tokens = computed(() => this._currentTheme().tokens);

  /** Is dark mode */
  readonly isDark = computed(() => this._currentTheme().colorScheme === 'dark');

  /** CSS output for current theme */
  readonly cssOutput = computed(() =>
    generateCSSVariables(this._currentTheme(), {
      includeComments: true,
      minify: false,
      variablePrefix: 'ax',
    }),
  );

  // ============================================================================
  // Preset Themes
  // ============================================================================

  readonly presets: ThemePreset[] = [
    {
      id: 'aegisx-light',
      name: 'AegisX Light',
      description: 'Default light theme with indigo primary',
      theme: this.createDefaultLightTheme(),
    },
    {
      id: 'aegisx-dark',
      name: 'AegisX Dark',
      description: 'Default dark theme',
      theme: this.createDefaultDarkTheme(),
    },
    {
      id: 'sunset',
      name: 'Sunset',
      description: 'Warm purple and yellow tones',
      theme: this.createSunsetTheme(),
    },
    {
      id: 'ocean',
      name: 'Ocean',
      description: 'Cool blue tones',
      theme: this.createOceanTheme(),
    },
    {
      id: 'forest',
      name: 'Forest',
      description: 'Natural green tones',
      theme: this.createForestTheme(),
    },
    {
      id: 'midnight',
      name: 'Midnight',
      description: 'Deep dark theme with purple accents',
      theme: this.createMidnightTheme(),
    },
  ];

  constructor() {
    // Load saved themes from localStorage
    this.loadSavedThemes();

    // Load current editing theme
    this.loadCurrentTheme();

    // Apply preview when theme changes
    effect(() => {
      if (this._previewEnabled()) {
        this.applyPreview();
      }
    });
  }

  // ============================================================================
  // Theme Creation
  // ============================================================================

  private createDefaultLightTheme(): ThemeDefinition {
    return {
      name: 'custom-light',
      displayName: 'Custom Light Theme',
      colorScheme: 'light',
      colors: { ...DEFAULT_LIGHT_COLORS },
      tokens: { ...DEFAULT_DESIGN_TOKENS },
    };
  }

  private createDefaultDarkTheme(): ThemeDefinition {
    return {
      name: 'custom-dark',
      displayName: 'Custom Dark Theme',
      colorScheme: 'dark',
      colors: { ...DEFAULT_DARK_COLORS },
      tokens: { ...DEFAULT_DESIGN_TOKENS },
    };
  }

  private createSunsetTheme(): ThemeDefinition {
    return {
      name: 'sunset',
      displayName: 'Sunset',
      colorScheme: 'light',
      colors: {
        'base-100': { l: 98, c: 0.001, h: 106 },
        'base-200': { l: 97, c: 0.001, h: 106 },
        'base-300': { l: 92, c: 0.003, h: 48 },
        'base-content': { l: 21, c: 0.006, h: 56 },
        primary: { l: 82, c: 0.119, h: 306 },
        'primary-content': { l: 29, c: 0.149, h: 302 },
        secondary: { l: 0, c: 0, h: 0 },
        'secondary-content': { l: 100, c: 0, h: 0 },
        accent: { l: 87, c: 0.169, h: 91 },
        'accent-content': { l: 27, c: 0.077, h: 45 },
        neutral: { l: 14, c: 0.004, h: 49 },
        'neutral-content': { l: 98, c: 0.001, h: 106 },
        info: { l: 71, c: 0.143, h: 215 },
        'info-content': { l: 98, c: 0.019, h: 200 },
        success: { l: 76, c: 0.233, h: 130 },
        'success-content': { l: 98, c: 0.031, h: 120 },
        warning: { l: 79, c: 0.184, h: 86 },
        'warning-content': { l: 98, c: 0.026, h: 102 },
        error: { l: 63, c: 0.237, h: 25 },
        'error-content': { l: 97, c: 0.013, h: 17 },
      },
      tokens: { ...DEFAULT_DESIGN_TOKENS, 'radius-selector': '1rem' },
    };
  }

  private createOceanTheme(): ThemeDefinition {
    return {
      name: 'ocean',
      displayName: 'Ocean',
      colorScheme: 'light',
      colors: {
        'base-100': { l: 98, c: 0.005, h: 220 },
        'base-200': { l: 95, c: 0.01, h: 220 },
        'base-300': { l: 90, c: 0.015, h: 220 },
        'base-content': { l: 20, c: 0.03, h: 220 },
        primary: { l: 55, c: 0.2, h: 220 },
        'primary-content': { l: 98, c: 0.01, h: 220 },
        secondary: { l: 60, c: 0.15, h: 180 },
        'secondary-content': { l: 15, c: 0.02, h: 180 },
        accent: { l: 70, c: 0.18, h: 170 },
        'accent-content': { l: 15, c: 0.03, h: 170 },
        neutral: { l: 25, c: 0.02, h: 220 },
        'neutral-content': { l: 95, c: 0.01, h: 220 },
        info: { l: 65, c: 0.15, h: 230 },
        'info-content': { l: 98, c: 0.02, h: 230 },
        success: { l: 70, c: 0.2, h: 150 },
        'success-content': { l: 98, c: 0.02, h: 150 },
        warning: { l: 80, c: 0.18, h: 80 },
        'warning-content': { l: 20, c: 0.05, h: 80 },
        error: { l: 60, c: 0.22, h: 25 },
        'error-content': { l: 98, c: 0.02, h: 25 },
      },
      tokens: { ...DEFAULT_DESIGN_TOKENS },
    };
  }

  private createForestTheme(): ThemeDefinition {
    return {
      name: 'forest',
      displayName: 'Forest',
      colorScheme: 'light',
      colors: {
        'base-100': { l: 98, c: 0.005, h: 120 },
        'base-200': { l: 95, c: 0.01, h: 120 },
        'base-300': { l: 90, c: 0.02, h: 120 },
        'base-content': { l: 20, c: 0.03, h: 120 },
        primary: { l: 50, c: 0.18, h: 145 },
        'primary-content': { l: 98, c: 0.02, h: 145 },
        secondary: { l: 45, c: 0.12, h: 80 },
        'secondary-content': { l: 98, c: 0.01, h: 80 },
        accent: { l: 70, c: 0.15, h: 50 },
        'accent-content': { l: 20, c: 0.03, h: 50 },
        neutral: { l: 25, c: 0.02, h: 120 },
        'neutral-content': { l: 95, c: 0.01, h: 120 },
        info: { l: 65, c: 0.12, h: 200 },
        'info-content': { l: 98, c: 0.02, h: 200 },
        success: { l: 65, c: 0.22, h: 145 },
        'success-content': { l: 98, c: 0.03, h: 145 },
        warning: { l: 75, c: 0.18, h: 70 },
        'warning-content': { l: 20, c: 0.05, h: 70 },
        error: { l: 55, c: 0.2, h: 25 },
        'error-content': { l: 98, c: 0.02, h: 25 },
      },
      tokens: { ...DEFAULT_DESIGN_TOKENS },
    };
  }

  private createMidnightTheme(): ThemeDefinition {
    return {
      name: 'midnight',
      displayName: 'Midnight',
      colorScheme: 'dark',
      colors: {
        'base-100': { l: 12, c: 0.02, h: 280 },
        'base-200': { l: 8, c: 0.02, h: 280 },
        'base-300': { l: 5, c: 0.015, h: 280 },
        'base-content': { l: 92, c: 0.01, h: 280 },
        primary: { l: 70, c: 0.2, h: 280 },
        'primary-content': { l: 10, c: 0.03, h: 280 },
        secondary: { l: 60, c: 0.15, h: 320 },
        'secondary-content': { l: 10, c: 0.02, h: 320 },
        accent: { l: 75, c: 0.18, h: 200 },
        'accent-content': { l: 10, c: 0.02, h: 200 },
        neutral: { l: 80, c: 0.02, h: 280 },
        'neutral-content': { l: 15, c: 0.01, h: 280 },
        info: { l: 65, c: 0.15, h: 230 },
        'info-content': { l: 10, c: 0.02, h: 230 },
        success: { l: 65, c: 0.2, h: 150 },
        'success-content': { l: 10, c: 0.02, h: 150 },
        warning: { l: 70, c: 0.18, h: 80 },
        'warning-content': { l: 15, c: 0.05, h: 80 },
        error: { l: 60, c: 0.22, h: 25 },
        'error-content': { l: 98, c: 0.02, h: 25 },
      },
      tokens: { ...DEFAULT_DESIGN_TOKENS, depth: 1 },
    };
  }

  // ============================================================================
  // Color Manipulation
  // ============================================================================

  /**
   * Update a single color slot
   */
  setColor(slot: keyof ThemeColorSlots, color: OklchColor): void {
    const current = this._currentTheme();
    const newColors = { ...current.colors, [slot]: color };

    // Auto-generate content color if main color changed
    if (!slot.includes('-content')) {
      const contentSlot = `${slot}-content` as keyof ThemeColorSlots;
      if (contentSlot in current.colors) {
        newColors[contentSlot] = generateContentColor(color);
      }
    }

    this._currentTheme.set({
      ...current,
      colors: newColors,
    });

    this.saveCurrentTheme();
  }

  /**
   * Update color from hex value
   */
  setColorFromHex(slot: keyof ThemeColorSlots, hex: string): void {
    const color = hexToOklch(hex);
    this.setColor(slot, color);
  }

  /**
   * Update color from OKLCH values
   */
  setColorFromOklch(
    slot: keyof ThemeColorSlots,
    l: number,
    c: number,
    h: number,
  ): void {
    this.setColor(slot, { l, c, h });
  }

  /**
   * Get color as hex string
   */
  getColorHex(slot: keyof ThemeColorSlots): string {
    return oklchToHex(this._currentTheme().colors[slot]);
  }

  /**
   * Get color as OKLCH string
   */
  getColorOklch(slot: keyof ThemeColorSlots): string {
    return oklchToString(this._currentTheme().colors[slot]);
  }

  // ============================================================================
  // Design Tokens
  // ============================================================================

  /**
   * Update design token
   */
  setToken<K extends keyof ThemeDesignTokens>(
    key: K,
    value: ThemeDesignTokens[K],
  ): void {
    const current = this._currentTheme();
    this._currentTheme.set({
      ...current,
      tokens: { ...current.tokens, [key]: value },
    });
    this.saveCurrentTheme();
  }

  /**
   * Update radius values
   */
  setRadius(type: 'selector' | 'field' | 'box', value: string): void {
    this.setToken(`radius-${type}` as keyof ThemeDesignTokens, value);
  }

  // ============================================================================
  // Theme Management
  // ============================================================================

  /**
   * Load a preset theme
   */
  loadPreset(presetId: string): void {
    const preset = this.presets.find((p) => p.id === presetId);
    if (preset) {
      this._currentTheme.set({ ...preset.theme });
      this.saveCurrentTheme();
    }
  }

  /**
   * Set theme name
   */
  setThemeName(name: string): void {
    const current = this._currentTheme();
    this._currentTheme.set({
      ...current,
      name: name.toLowerCase().replace(/\s+/g, '-'),
      displayName: name,
    });
    this.saveCurrentTheme();
  }

  /**
   * Toggle between light and dark
   */
  toggleColorScheme(): void {
    const current = this._currentTheme();
    const newScheme = current.colorScheme === 'light' ? 'dark' : 'light';

    // Adjust colors for new scheme
    const newColors = { ...current.colors };
    if (newScheme === 'dark') {
      // Darken backgrounds, lighten text
      newColors['base-100'] = adjustLightness(current.colors['base-100'], -85);
      newColors['base-200'] = adjustLightness(current.colors['base-200'], -85);
      newColors['base-300'] = adjustLightness(current.colors['base-300'], -80);
      newColors['base-content'] = adjustLightness(
        current.colors['base-content'],
        70,
      );
    } else {
      // Lighten backgrounds, darken text
      newColors['base-100'] = adjustLightness(current.colors['base-100'], 85);
      newColors['base-200'] = adjustLightness(current.colors['base-200'], 85);
      newColors['base-300'] = adjustLightness(current.colors['base-300'], 80);
      newColors['base-content'] = adjustLightness(
        current.colors['base-content'],
        -70,
      );
    }

    this._currentTheme.set({
      ...current,
      colorScheme: newScheme,
      colors: newColors,
    });
    this.saveCurrentTheme();
  }

  /**
   * Reset to default theme
   */
  resetToDefault(): void {
    const current = this._currentTheme();
    if (current.colorScheme === 'dark') {
      this._currentTheme.set(this.createDefaultDarkTheme());
    } else {
      this._currentTheme.set(this.createDefaultLightTheme());
    }
    this.saveCurrentTheme();
  }

  /**
   * Randomize colors
   */
  randomizeColors(): void {
    const current = this._currentTheme();
    const randomHue = () => Math.random() * 360;
    const primaryHue = randomHue();

    const newColors: ThemeColorSlots = {
      ...current.colors,
      primary: {
        l: current.colorScheme === 'dark' ? 65 : 55,
        c: 0.2 + Math.random() * 0.1,
        h: primaryHue,
      },
      secondary: {
        l: current.colorScheme === 'dark' ? 55 : 45,
        c: 0.1 + Math.random() * 0.05,
        h: (primaryHue + 180) % 360,
      },
      accent: {
        l: current.colorScheme === 'dark' ? 70 : 75,
        c: 0.15 + Math.random() * 0.1,
        h: (primaryHue + 90) % 360,
      },
    };

    // Auto-generate content colors
    newColors['primary-content'] = generateContentColor(newColors.primary);
    newColors['secondary-content'] = generateContentColor(newColors.secondary);
    newColors['accent-content'] = generateContentColor(newColors.accent);

    this._currentTheme.set({
      ...current,
      colors: newColors,
    });
    this.saveCurrentTheme();
  }

  // ============================================================================
  // Save/Load
  // ============================================================================

  /**
   * Save current theme to saved list
   */
  saveTheme(): void {
    const current = this._currentTheme();
    const saved = this._savedThemes();

    // Check if theme with same name exists
    const existingIndex = saved.findIndex((t) => t.name === current.name);
    if (existingIndex >= 0) {
      saved[existingIndex] = { ...current };
    } else {
      saved.push({ ...current });
    }

    this._savedThemes.set([...saved]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  }

  /**
   * Load a saved theme
   */
  loadTheme(themeName: string): void {
    const saved = this._savedThemes();
    const theme = saved.find((t) => t.name === themeName);
    if (theme) {
      this._currentTheme.set({ ...theme });
      this.saveCurrentTheme();
    }
  }

  /**
   * Delete a saved theme
   */
  deleteTheme(themeName: string): void {
    const saved = this._savedThemes().filter((t) => t.name !== themeName);
    this._savedThemes.set(saved);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  }

  private loadSavedThemes(): void {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        this._savedThemes.set(JSON.parse(data));
      }
    } catch {
      console.warn('Failed to load saved themes');
    }
  }

  private saveCurrentTheme(): void {
    try {
      localStorage.setItem(
        CURRENT_THEME_KEY,
        JSON.stringify(this._currentTheme()),
      );
    } catch {
      console.warn('Failed to save current theme');
    }
  }

  private loadCurrentTheme(): void {
    try {
      const data = localStorage.getItem(CURRENT_THEME_KEY);
      if (data) {
        this._currentTheme.set(JSON.parse(data));
      }
    } catch {
      console.warn('Failed to load current theme');
    }
  }

  // ============================================================================
  // Preview
  // ============================================================================

  /**
   * Toggle preview mode
   */
  togglePreview(): void {
    this._previewEnabled.update((v) => !v);
    if (!this._previewEnabled()) {
      this.removePreview();
    }
  }

  /**
   * Apply theme preview to document
   */
  private applyPreview(): void {
    const theme = this._currentTheme();
    const css = generateCSSVariables(theme, {
      includeComments: false,
      minify: true,
      variablePrefix: 'ax',
    });

    // Create or update style element
    let styleEl = document.getElementById('theme-generator-preview');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'theme-generator-preview';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = css;

    // Set data-theme attribute
    document.documentElement.setAttribute('data-theme', theme.name);
  }

  /**
   * Remove preview styles
   */
  private removePreview(): void {
    const styleEl = document.getElementById('theme-generator-preview');
    if (styleEl) {
      styleEl.remove();
    }
  }

  // ============================================================================
  // Export
  // ============================================================================

  /**
   * Export theme in specified format
   */
  exportTheme(options: ExportOptions): string {
    return generateExport(this._currentTheme(), options);
  }

  /**
   * Download theme as file
   */
  downloadTheme(options: ExportOptions): void {
    const content = this.exportTheme(options);
    const theme = this._currentTheme();
    const extension = getFileExtension(options.format);
    const mimeType = getMimeType(options.format);

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${theme.name}${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Copy theme CSS to clipboard
   */
  async copyToClipboard(options: ExportOptions): Promise<void> {
    const content = this.exportTheme(options);
    await navigator.clipboard.writeText(content);
  }

  // ============================================================================
  // UI Helpers
  // ============================================================================

  /**
   * Select a color slot for editing
   */
  selectSlot(slot: keyof ThemeColorSlots | null): void {
    this._selectedSlot.set(slot);
  }

  /**
   * Get all color slot keys grouped by category
   */
  getColorSlotGroups(): { name: string; slots: (keyof ThemeColorSlots)[] }[] {
    return [
      {
        name: 'Base',
        slots: ['base-100', 'base-200', 'base-300', 'base-content'],
      },
      { name: 'Primary', slots: ['primary', 'primary-content'] },
      { name: 'Secondary', slots: ['secondary', 'secondary-content'] },
      { name: 'Accent', slots: ['accent', 'accent-content'] },
      { name: 'Neutral', slots: ['neutral', 'neutral-content'] },
      { name: 'Info', slots: ['info', 'info-content'] },
      { name: 'Success', slots: ['success', 'success-content'] },
      { name: 'Warning', slots: ['warning', 'warning-content'] },
      { name: 'Error', slots: ['error', 'error-content'] },
    ];
  }
}
