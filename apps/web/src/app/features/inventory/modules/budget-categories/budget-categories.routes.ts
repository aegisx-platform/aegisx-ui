import { Routes } from '@angular/router';

export const budgetCategoriesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/budget-categories-list.component').then(
        (m) => m.BudgetCategoriesListComponent,
      ),
    title: 'Budget Categories',
  },
];
