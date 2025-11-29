// Export all types
export * from './config.types';
export * from './layout.types';
export * from './theme.types';

// Unified navigation types (primary source)
export * from './ax-navigation.types';

// Legacy types (for backward compatibility - will be deprecated)
export * from './ax-navigation-legacy.types';

// Backward compatibility: AegisxNavigation from navigation.types.ts
export type { AegisxNavigation } from './navigation.types';
