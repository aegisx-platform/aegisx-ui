import { Routes } from '@angular/router';

export const drugFocusListsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/drug-focus-lists-list.component').then(
        (m) => m.DrugFocusListsListComponent,
      ),
    title: 'Drug Focus Lists',
  },
];
