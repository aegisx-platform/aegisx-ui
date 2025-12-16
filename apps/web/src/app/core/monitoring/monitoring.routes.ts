import { Route } from '@angular/router';
import { PermissionGuard } from '../rbac/guards/permission.guard';

export const monitoringRoutes: Route[] = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/system-dashboard/system-dashboard.component').then(
        (m) => m.DashboardPage,
      ),
    canActivate: [PermissionGuard],
    data: {
      title: 'System Dashboard',
      description:
        'Comprehensive system monitoring dashboard with real-time widgets',
      permissions: ['system:monitoring:read', '*:*'], // Admin or users with monitoring permission
    },
  },
  {
    path: 'system',
    loadComponent: () =>
      import('./pages/system-monitoring/system-monitoring.component').then(
        (m) => m.SystemMonitoringComponent,
      ),
    canActivate: [PermissionGuard],
    data: {
      title: 'System Monitoring',
      description: 'Real-time system metrics and performance monitoring',
      permissions: ['system:monitoring:read', '*:*'], // Admin or users with monitoring permission
    },
  },
  {
    path: 'error-logs',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/error-logs/error-logs.component').then(
            (m) => m.ErrorLogsComponent,
          ),
        canActivate: [PermissionGuard],
        data: {
          title: 'Error Logs',
          description: 'View and manage application error logs',
          permissions: ['error-logs:read', '*:*'], // Admin or users with error-logs read permission
        },
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/error-logs/error-logs-detail.page').then(
            (m) => m.ErrorLogsDetailPage,
          ),
        canActivate: [PermissionGuard],
        data: {
          title: 'Error Log Details',
          description: 'View detailed error log information',
          permissions: ['error-logs:read', '*:*'],
        },
      },
    ],
  },
  {
    path: 'activity-logs',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/activity-logs/activity-logs.component').then(
            (m) => m.ActivityLogsComponent,
          ),
        data: {
          title: 'Activity Logs',
          description: 'View and manage all user activity logs',
        },
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/activity-logs/activity-logs-detail.page').then(
            (m) => m.ActivityLogsDetailPage,
          ),
        canActivate: [PermissionGuard],
        data: {
          title: 'Activity Log Details',
          description: 'View detailed activity log information',
          permissions: ['monitoring:read', '*:*'],
        },
      },
    ],
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
