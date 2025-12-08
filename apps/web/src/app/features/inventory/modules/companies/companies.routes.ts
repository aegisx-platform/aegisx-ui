import { Routes } from '@angular/router';

export const companiesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/companies-list.component').then(
        (m) => m.CompaniesListComponent,
      ),
    title: 'Companies',
  },
];
