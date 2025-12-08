/**
 * AegisX UI - Breakpoint Design Tokens
 *
 * Responsive breakpoint system for mobile-first design.
 *
 * @packageDocumentation
 */

/**
 * Breakpoint keys
 */
export type BreakpointKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Breakpoint token system
 */
export interface BreakpointTokens {
  xs: string; // 0px - Mobile (portrait)
  sm: string; // 600px - Mobile (landscape) / Small tablet
  md: string; // 960px - Tablet
  lg: string; // 1280px - Desktop
  xl: string; // 1440px - Large desktop
  '2xl': string; // 1920px - Extra large desktop
}

/**
 * Breakpoint values in pixels
 */
export interface BreakpointPixels {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

/**
 * Default breakpoint tokens (Material Design + Tailwind)
 */
export const breakpointTokens: BreakpointTokens = {
  xs: '0px', // Mobile (portrait)
  sm: '600px', // Mobile (landscape) / Small tablet
  md: '960px', // Tablet
  lg: '1280px', // Desktop
  xl: '1440px', // Large desktop
  '2xl': '1920px', // Extra large desktop
};

/**
 * Breakpoint values in pixels
 */
export const breakpointPixels: BreakpointPixels = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1440,
  '2xl': 1920,
};

/**
 * Container max-widths for each breakpoint
 */
export interface ContainerTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

/**
 * Default container tokens
 */
export const containerTokens: ContainerTokens = {
  sm: '640px',
  md: '960px',
  lg: '1280px',
  xl: '1440px',
  '2xl': '1728px',
};

/**
 * Generate CSS custom properties for breakpoint tokens
 */
export function generateBreakpointCSSVariables(
  tokens: BreakpointTokens,
  prefix = 'ax',
): Record<string, string> {
  const variables: Record<string, string> = {};

  Object.entries(tokens).forEach(([key, value]) => {
    variables[`--${prefix}-breakpoint-${key}`] = value;
  });

  return variables;
}

/**
 * Generate CSS custom properties for container tokens
 */
export function generateContainerCSSVariables(
  tokens: ContainerTokens,
  prefix = 'ax',
): Record<string, string> {
  const variables: Record<string, string> = {};

  Object.entries(tokens).forEach(([key, value]) => {
    variables[`--${prefix}-container-${key}`] = value;
  });

  return variables;
}

/**
 * Breakpoint utility functions
 */
export const breakpointUtils = {
  /**
   * Check if current viewport matches breakpoint
   */
  isBreakpoint(breakpoint: BreakpointKey, width: number): boolean {
    return width >= breakpointPixels[breakpoint];
  },

  /**
   * Get current breakpoint
   */
  getCurrentBreakpoint(width: number): BreakpointKey {
    if (width >= breakpointPixels['2xl']) return '2xl';
    if (width >= breakpointPixels.xl) return 'xl';
    if (width >= breakpointPixels.lg) return 'lg';
    if (width >= breakpointPixels.md) return 'md';
    if (width >= breakpointPixels.sm) return 'sm';
    return 'xs';
  },

  /**
   * Generate media query for breakpoint
   */
  mediaQuery(breakpoint: BreakpointKey): string {
    return `@media (min-width: ${breakpointTokens[breakpoint]})`;
  },

  /**
   * Generate max-width media query for breakpoint
   */
  mediaQueryMax(breakpoint: BreakpointKey): string {
    const pixels = breakpointPixels[breakpoint];
    return `@media (max-width: ${pixels - 1}px)`;
  },
};
