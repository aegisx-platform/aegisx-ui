// Core Module
export * from './aegisx-core.module';

// Core Services (re-export from main services)
export * from '../services/config/config.service';
export { AegisxNavigationService } from '../services/navigation/navigation.service';
export * from '../services/media-watcher/media-watcher.service';

// Core Types
export * from '../types/config.types';
// Note: AegisxNavigation and AegisxNavigationItem are exported from ../types/index.ts
