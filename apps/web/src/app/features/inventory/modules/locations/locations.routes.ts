import { Routes } from '@angular/router';

export const locationsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/locations-list.component').then(
        (m) => m.LocationsListComponent,
      ),
    title: 'Locations',
  },
];
