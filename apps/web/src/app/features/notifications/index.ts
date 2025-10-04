// Notifications Feature Module Exports

// Services
export { NotificationService } from './services/notifications.service';

// Types
export * from './types/notification.types';

// Components
export { NotificationListComponent } from './components/notifications-list.component';
export { NotificationCreateDialogComponent } from './components/notifications-create.dialog';
export { NotificationEditDialogComponent } from './components/notifications-edit.dialog';
export { NotificationViewDialogComponent } from './components/notifications-view.dialog';

// Feature Module Name
export const FEATURE_NAME = 'notifications' as const;
