import { Routes } from '@angular/router';

export const budgetPlanItemsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/budget-plan-items-list.component').then(
        (m) => m.BudgetPlanItemsListComponent,
      ),
    title: 'Budget Plan Items',
  },
];
