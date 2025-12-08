import { Routes } from '@angular/router';

export const budgetAllocationsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/budget-allocations-list.component').then(
        (m) => m.BudgetAllocationsListComponent,
      ),
    title: 'Budget Allocations',
  },
];
