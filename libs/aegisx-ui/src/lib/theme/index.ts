/**
 * AegisX UI - Theme System
 *
 * Complete theming solution for Angular applications.
 *
 * @packageDocumentation
 */

// Core theme functionality
export * from './core/theme-provider';

// Theme presets
export * from './presets/light.theme';
export * from './presets/dark.theme';
export * from './presets/brand.theme';
export * from './presets/custom.theme';

// Re-export commonly used
export {
  provideAegisxTheme,
  type ThemeConfig,
  ThemeService,
} from './core/theme-provider';
export { lightTheme } from './presets/light.theme';
export { darkTheme } from './presets/dark.theme';
export {
  brandTheme,
  createBrandTheme,
  type BrandThemeOptions,
} from './presets/brand.theme';
export {
  createCustomTheme,
  customThemeExamples,
  type CustomThemeConfig,
} from './presets/custom.theme';
