// Main plugin export
export { userProfileModulePlugin } from './user-profile.plugin';

// Schemas and types re-exports
export * from './schemas/profile.schemas';

// Repository exports (for testing/advanced usage)
export { ProfileRepository } from './repositories/profile.repository';

// Service exports (for testing/advanced usage)
export { ProfileService } from './services/profile.service';
export { AvatarService } from './services/avatar.service';

// Controller exports (for testing/advanced usage)
export { ProfileController } from './controllers/profile.controller';
export { AvatarController } from './controllers/avatar.controller';
export { PreferencesController } from './controllers/preferences.controller';
export { ActivityController } from './controllers/activity.controller';

// Routes export (for custom mounting)
export { registerProfileRoutes } from './routes/profile.routes';

// Module name constant
export const MODULE_NAME = 'user-profile' as const;
