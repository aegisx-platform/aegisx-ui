import { Routes } from '@angular/router';

export const returnActionsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/return-actions-list.component').then(
        (m) => m.ReturnActionsListComponent,
      ),
    title: 'Return Actions',
  },
];
