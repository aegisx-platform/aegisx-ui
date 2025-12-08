import { Routes } from '@angular/router';

export const budgetRequestsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/budget-requests-list.component').then(
        (m) => m.BudgetRequestsListComponent,
      ),
    title: 'Budget Requests',
  },
];
