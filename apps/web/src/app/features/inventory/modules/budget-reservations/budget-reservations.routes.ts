import { Routes } from '@angular/router';

export const budgetReservationsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/budget-reservations-list.component').then(
        (m) => m.BudgetReservationsListComponent,
      ),
    title: 'Budget Reservations',
  },
];
