import { Route } from '@angular/router';

export const PLAYGROUND_ROUTES: Route[] = [
  {
    path: 'pages/login',
    loadComponent: () =>
      import('../../pages/playground/pages/login/login.component').then(
        (m) => m.LoginComponent,
      ),
    data: {
      title: 'Login Template',
      description: 'Login page template',
    },
  },
  {
    path: 'pages/dashboard',
    loadComponent: () =>
      import('../../pages/playground/pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
    data: {
      title: 'Dashboard Template',
      description: 'Dashboard page template',
    },
  },
  {
    path: 'pages/user-management',
    loadComponent: () =>
      import(
        '../../pages/playground/pages/user-management/user-management.component'
      ).then((m) => m.UserManagementComponent),
    data: {
      title: 'User Management',
      description: 'User management page template',
    },
  },
  {
    path: 'experiments/components',
    loadComponent: () =>
      import(
        '../../pages/playground/experiments/components-demo/components-demo.component'
      ).then((m) => m.ComponentsDemoComponent),
    data: {
      title: 'Components Demo',
      description: 'Components demonstration',
    },
  },
  {
    path: 'experiments/cards',
    loadComponent: () =>
      import(
        '../../pages/playground/experiments/card-examples/card-examples.component'
      ).then((m) => m.CardExamplesComponent),
    data: {
      title: 'Card Examples',
      description: 'Card component examples',
    },
  },
  {
    path: 'experiments/prose',
    loadComponent: () =>
      import(
        '../../pages/playground/experiments/prose-demo/prose-demo.component'
      ).then((m) => m.ProseDemoComponent),
    data: {
      title: 'Prose Demo',
      description: 'Prose typography demonstration',
    },
  },
  {
    path: 'experiments/charts',
    loadComponent: () =>
      import(
        '../../pages/playground/experiments/spark-charts/spark-charts.component'
      ).then((m) => m.SparkChartsComponent),
    data: {
      title: 'Spark Charts',
      description: 'Spark charts demonstration',
    },
  },
];
