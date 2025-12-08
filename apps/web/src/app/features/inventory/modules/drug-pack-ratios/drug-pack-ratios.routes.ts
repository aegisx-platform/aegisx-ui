import { Routes } from '@angular/router';

export const drugPackRatiosRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/drug-pack-ratios-list.component').then(
        (m) => m.DrugPackRatiosListComponent,
      ),
    title: 'Drug Pack Ratios',
  },
];
