// Export plugin
export { default as userProfilePlugin } from './user-profile.plugin';

// Export types
export * from './user-profile.types';

// Export services (for testing or external use)
export { UserProfileService } from './services/user-profile.service';
export { AvatarService } from './services/avatar.service';
export { UserProfileRepository } from './user-profile.repository';
export { UserProfileController } from './user-profile.controller';

// Export schemas
export * from './user-profile.schemas';