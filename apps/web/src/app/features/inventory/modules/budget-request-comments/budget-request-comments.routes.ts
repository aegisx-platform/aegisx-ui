import { Routes } from '@angular/router';

export const budgetRequestCommentsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/budget-request-comments-list.component').then(
        (m) => m.BudgetRequestCommentsListComponent,
      ),
    title: 'Budget Request Comments',
  },
];
