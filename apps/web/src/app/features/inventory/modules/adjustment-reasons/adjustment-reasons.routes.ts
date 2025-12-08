import { Routes } from '@angular/router';

export const adjustmentReasonsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/adjustment-reasons-list.component').then(
        (m) => m.AdjustmentReasonsListComponent,
      ),
    title: 'Adjustment Reasons',
  },
];
