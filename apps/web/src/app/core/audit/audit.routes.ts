import { Routes } from '@angular/router';
import { authGuard } from '../auth/guards/auth.guard';

export const auditRoutes: Routes = [
  {
    path: 'login-attempts',
    loadComponent: () =>
      import('./pages/login-attempts/login-attempts.component').then(
        (m) => m.LoginAttemptsComponent,
      ),
    canActivate: [authGuard],
    title: 'Login Attempts',
  },
  {
    path: 'file-audit',
    loadComponent: () =>
      import('./pages/file-audit/file-audit.component').then(
        (m) => m.FileAuditComponent,
      ),
    canActivate: [authGuard],
    title: 'File Activity',
  },
];
