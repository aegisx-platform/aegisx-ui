import { Routes } from '@angular/router';

export const drugComponentsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/drug-components-list.component').then(
        (m) => m.DrugComponentsListComponent,
      ),
    title: 'Drug Components',
  },
];
