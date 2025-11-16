/**
 * AegisX UI - Design Foundations
 *
 * Complete design token system for building consistent UIs.
 *
 * @packageDocumentation
 */

// Color Tokens
export * from './colors/color-tokens';

// Typography Tokens
export * from './typography/typography-tokens';

// Spacing Tokens
export * from './spacing/spacing-tokens';

// Border Tokens
export * from './borders/radius-tokens';
export * from './borders/width-tokens';

// Shadow Tokens
export * from './shadows/elevation-tokens';

// Motion Tokens
export * from './motion/duration-tokens';
export * from './motion/easing-tokens';

// Breakpoint Tokens
export * from './breakpoints/breakpoint-tokens';

/**
 * Re-export commonly used types
 */
export type {
  ColorTokens,
  SemanticColorPalette,
  ColorVariant,
  ColorCategory,
} from './colors/color-tokens';

export type {
  TypographyTokens,
  TypographyStyle,
  FontSize,
  FontWeight,
  M3TypographyRole,
} from './typography/typography-tokens';

export type {
  SpacingTokens,
  SpacingScale,
  SemanticSpacingTokens,
} from './spacing/spacing-tokens';

export type { RadiusTokens, RadiusScale } from './borders/radius-tokens';

export type {
  BorderWidthTokens,
  BorderWidthScale,
} from './borders/width-tokens';

export type {
  ShadowTokens,
  ElevationTokens,
  ElevationLevel,
  ShadowSize,
} from './shadows/elevation-tokens';

export type {
  DurationTokens,
  M3DurationTokens,
  DurationScale,
  M3DurationScale,
} from './motion/duration-tokens';

export type {
  EasingTokens,
  M3EasingTokens,
  EasingCurve,
  M3EasingCurve,
} from './motion/easing-tokens';

export type {
  BreakpointTokens,
  BreakpointPixels,
  ContainerTokens,
  BreakpointKey,
} from './breakpoints/breakpoint-tokens';

/**
 * Re-export token values
 */
export {
  lightColorTokens,
  darkColorTokens,
  colorUtils,
} from './colors/color-tokens';

export {
  typographyTokens,
  typographyUtils,
} from './typography/typography-tokens';

export {
  spacingTokens,
  semanticSpacingTokens,
  spacingUtils,
} from './spacing/spacing-tokens';

export { radiusTokens } from './borders/radius-tokens';

export { borderWidthTokens } from './borders/width-tokens';

export { shadowTokens, elevationTokens } from './shadows/elevation-tokens';

export { durationTokens, m3DurationTokens } from './motion/duration-tokens';

export { easingTokens, m3EasingTokens } from './motion/easing-tokens';

export {
  breakpointTokens,
  breakpointPixels,
  containerTokens,
  breakpointUtils,
} from './breakpoints/breakpoint-tokens';
