import { Routes } from '@angular/router';

export const hospitalsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/hospitals-list.component').then(
        (m) => m.HospitalsListComponent,
      ),
    title: 'Hospitals',
  },
];
