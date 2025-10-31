import { Route } from '@angular/router';

export const monitoringRoutes: Route[] = [
  {
    path: 'system',
    loadComponent: () =>
      import('./pages/system-monitoring/system-monitoring.component').then(
        (m) => m.SystemMonitoringComponent,
      ),
    data: {
      title: 'System Monitoring',
      description: 'Real-time system metrics and performance monitoring',
    },
  },
  {
    path: 'error-logs',
    loadComponent: () =>
      import('./pages/error-logs/error-logs.component').then(
        (m) => m.ErrorLogsComponent,
      ),
    data: {
      title: 'Error Logs',
      description: 'View and manage application error logs',
    },
  },
  {
    path: '',
    redirectTo: 'system',
    pathMatch: 'full',
  },
];
