import { Routes } from '@angular/router';
import { PermissionGuard } from '../rbac/guards/permission.guard';

export const apiKeysRoutes: Routes = [
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/api-keys-detail/api-keys-detail.page').then(
        (m) => m.ApiKeysDetailPage,
      ),
    canActivate: [PermissionGuard],
    data: {
      title: 'API Key Details',
      description: 'View detailed information about an API key',
      permissions: ['api-keys:read', '*:*'],
    },
  },
];
