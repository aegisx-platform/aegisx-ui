import { Routes } from '@angular/router';

export const budgetPlansRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/budget-plans-list.component').then(
        (m) => m.BudgetPlansListComponent,
      ),
    title: 'Budget Plans',
  },
];
