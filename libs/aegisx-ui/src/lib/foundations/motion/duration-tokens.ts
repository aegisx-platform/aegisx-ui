/**
 * AegisX UI - Motion Duration Design Tokens
 *
 * Animation and transition duration scale.
 * Based on Material Design 3 motion system.
 *
 * @packageDocumentation
 */

/**
 * Duration scale keys
 */
export type DurationScale = 'instant' | 'fast' | 'normal' | 'slow' | 'slower';

/**
 * Material 3 duration scale keys
 */
export type M3DurationScale =
  | 'short1'
  | 'short2'
  | 'short3'
  | 'short4'
  | 'medium1'
  | 'medium2'
  | 'medium3'
  | 'medium4'
  | 'long1'
  | 'long2'
  | 'long3'
  | 'long4';

/**
 * Duration token system
 */
export interface DurationTokens {
  instant: string; // 75ms - Instant feedback
  fast: string; // 150ms - Quick transitions
  normal: string; // 250ms - Standard transitions
  slow: string; // 350ms - Deliberate transitions
  slower: string; // 500ms - Slow, emphasized transitions
}

/**
 * Material 3 Duration tokens
 */
export interface M3DurationTokens {
  short1: string; // 50ms
  short2: string; // 100ms
  short3: string; // 150ms
  short4: string; // 200ms
  medium1: string; // 250ms
  medium2: string; // 300ms
  medium3: string; // 350ms
  medium4: string; // 400ms
  long1: string; // 450ms
  long2: string; // 500ms
  long3: string; // 550ms
  long4: string; // 600ms
}

/**
 * Default duration tokens
 */
export const durationTokens: DurationTokens = {
  instant: '75ms',
  fast: '150ms',
  normal: '250ms',
  slow: '350ms',
  slower: '500ms',
};

/**
 * Material 3 duration tokens
 */
export const m3DurationTokens: M3DurationTokens = {
  short1: '50ms',
  short2: '100ms',
  short3: '150ms',
  short4: '200ms',
  medium1: '250ms',
  medium2: '300ms',
  medium3: '350ms',
  medium4: '400ms',
  long1: '450ms',
  long2: '500ms',
  long3: '550ms',
  long4: '600ms',
};

/**
 * Generate CSS custom properties for duration tokens
 */
export function generateDurationCSSVariables(
  tokens: DurationTokens,
  prefix = 'ax',
): Record<string, string> {
  const variables: Record<string, string> = {};

  Object.entries(tokens).forEach(([key, value]) => {
    variables[`--${prefix}-duration-${key}`] = value;
  });

  return variables;
}

/**
 * Generate CSS custom properties for M3 duration tokens
 */
export function generateM3DurationCSSVariables(
  tokens: M3DurationTokens,
  prefix = 'ax',
): Record<string, string> {
  const variables: Record<string, string> = {};

  Object.entries(tokens).forEach(([key, value]) => {
    variables[`--${prefix}-m3-duration-${key}`] = value;
  });

  return variables;
}
