import { Routes } from '@angular/router';

export const budgetTypesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/budget-types-list.component').then(
        (m) => m.BudgetTypesListComponent,
      ),
    title: 'Budget Types',
  },
];
