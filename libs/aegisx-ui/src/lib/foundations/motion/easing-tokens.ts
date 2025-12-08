/**
 * AegisX UI - Motion Easing Design Tokens
 *
 * Easing curves for smooth animations and transitions.
 * Based on Material Design 3 motion system.
 *
 * @packageDocumentation
 */

/**
 * Easing curve keys
 */
export type EasingCurve =
  | 'linear'
  | 'ease'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut';

/**
 * Material 3 easing curve keys
 */
export type M3EasingCurve =
  | 'standard'
  | 'standardAccelerate'
  | 'standardDecelerate'
  | 'emphasized'
  | 'emphasizedAccelerate'
  | 'emphasizedDecelerate';

/**
 * Easing token system
 */
export interface EasingTokens {
  linear: string;
  ease: string;
  easeIn: string;
  easeOut: string;
  easeInOut: string;
}

/**
 * Material 3 Easing tokens
 */
export interface M3EasingTokens {
  standard: string; // Standard easing
  standardAccelerate: string; // Accelerate from rest
  standardDecelerate: string; // Decelerate to rest
  emphasized: string; // Emphasized easing
  emphasizedAccelerate: string; // Emphasized accelerate
  emphasizedDecelerate: string; // Emphasized decelerate
}

/**
 * Default easing tokens
 */
export const easingTokens: EasingTokens = {
  linear: 'linear',
  ease: 'ease',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
};

/**
 * Material 3 easing tokens
 */
export const m3EasingTokens: M3EasingTokens = {
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  standardAccelerate: 'cubic-bezier(0.3, 0, 1, 1)',
  standardDecelerate: 'cubic-bezier(0, 0, 0, 1)',
  emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
  emphasizedAccelerate: 'cubic-bezier(0.3, 0, 0.8, 0.15)',
  emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
};

/**
 * Generate CSS custom properties for easing tokens
 */
export function generateEasingCSSVariables(
  tokens: EasingTokens,
  prefix = 'ax',
): Record<string, string> {
  const variables: Record<string, string> = {};

  Object.entries(tokens).forEach(([key, value]) => {
    variables[`--${prefix}-easing-${key}`] = value;
  });

  return variables;
}

/**
 * Generate CSS custom properties for M3 easing tokens
 */
export function generateM3EasingCSSVariables(
  tokens: M3EasingTokens,
  prefix = 'ax',
): Record<string, string> {
  const variables: Record<string, string> = {};

  Object.entries(tokens).forEach(([key, value]) => {
    variables[`--${prefix}-m3-easing-${key}`] = value;
  });

  return variables;
}
