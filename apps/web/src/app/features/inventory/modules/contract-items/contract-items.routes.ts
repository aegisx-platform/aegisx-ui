import { Routes } from '@angular/router';

export const contractItemsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/contract-items-list.component').then(
        (m) => m.ContractItemsListComponent,
      ),
    title: 'Contract Items',
  },
];
