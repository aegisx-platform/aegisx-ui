import { Routes } from '@angular/router';

export const contractsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/contracts-list.component').then(
        (m) => m.ContractsListComponent,
      ),
    title: 'Contracts',
  },
];
