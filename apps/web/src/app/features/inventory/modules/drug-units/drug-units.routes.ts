import { Routes } from '@angular/router';

export const drugUnitsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/drug-units-list.component').then(
        (m) => m.DrugUnitsListComponent,
      ),
    title: 'Drug Units',
  },
];
