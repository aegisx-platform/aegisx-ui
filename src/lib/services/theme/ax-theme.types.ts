/**
 * AegisX Theme Types
 *
 * Type definitions for the AegisX theme system.
 */

export type ColorScheme = 'aegisx' | 'verus';
export type ThemeMode = 'light' | 'dark';

export interface ThemeOption {
  id: string;
  name: string;
  path: string;
  /** Color scheme identifier (aegisx, verus) */
  colorScheme?: ColorScheme;
  /** Theme mode (light or dark) */
  mode?: ThemeMode;
  /** data-theme attribute value */
  dataTheme?: string;
}

export interface ThemeConfig {
  /** Current color scheme */
  colorScheme: ColorScheme;
  /** Current theme mode */
  mode: ThemeMode;
  /** Combined theme ID */
  themeId: string;
  /** data-theme attribute value */
  dataTheme: string;
}
