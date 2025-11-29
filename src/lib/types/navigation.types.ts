/**
 * @deprecated This file is deprecated. Import from './ax-navigation.types' instead.
 *
 * Re-exports for backward compatibility:
 * - AegisxNavigationItem -> AxNavigationItem
 * - AegisxNavigation -> Use AegisxNavigation from navigation.service.ts
 */
export type { AegisxNavigationItem } from './ax-navigation.types';

/**
 * @deprecated Use AxNavigationItem[] directly instead
 */
export interface AegisxNavigation {
  default: import('./ax-navigation.types').AxNavigationItem[];
  compact: import('./ax-navigation.types').AxNavigationItem[];
  horizontal?: import('./ax-navigation.types').AxNavigationItem[];
  mobile?: import('./ax-navigation.types').AxNavigationItem[];
}
