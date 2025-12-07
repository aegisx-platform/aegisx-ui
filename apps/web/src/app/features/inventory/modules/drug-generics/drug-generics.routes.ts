import { Routes } from '@angular/router';

export const drugGenericsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/drug-generics-list.component').then(
        (m) => m.DrugGenericsListComponent,
      ),
    title: 'Drug Generics',
  },
];
