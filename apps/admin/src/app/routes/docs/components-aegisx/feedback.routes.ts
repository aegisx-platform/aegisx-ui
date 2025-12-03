import { Route } from '@angular/router';

const BASE_PATH = '../../pages/docs/components/aegisx';

export const FEEDBACK_ROUTES: Route[] = [
  {
    path: 'feedback/alert',
    loadComponent: () =>
      import(`${BASE_PATH}/feedback/alert/alert-doc.component`).then(
        (m) => m.AlertDocComponent,
      ),
    data: {
      title: 'Alert Component',
      description: 'Alert component documentation',
    },
  },
  {
    path: 'feedback/inner-loading',
    loadComponent: () =>
      import(
        `${BASE_PATH}/feedback/inner-loading/inner-loading-doc.component`
      ).then((m) => m.InnerLoadingDocComponent),
    data: {
      title: 'Inner Loading',
      description: 'Inner loading component',
    },
  },
  {
    path: 'feedback/loading-bar',
    loadComponent: () =>
      import(
        `${BASE_PATH}/feedback/loading-bar/loading-bar-doc.component`
      ).then((m) => m.LoadingBarDocComponent),
    data: {
      title: 'Loading Bar',
      description: 'Loading bar component',
    },
  },
  {
    path: 'feedback/dialogs',
    loadComponent: () =>
      import(`${BASE_PATH}/feedback/dialogs/dialogs-doc.component`).then(
        (m) => m.DialogsDocComponent,
      ),
    data: {
      title: 'Dialogs',
      description: 'Dialog components',
    },
  },
  {
    path: 'feedback/toast',
    loadComponent: () =>
      import(`${BASE_PATH}/feedback/toast/toast-doc.component`).then(
        (m) => m.ToastDocComponent,
      ),
    data: {
      title: 'Toast',
      description: 'Toast notification component',
    },
  },
  {
    path: 'feedback/skeleton',
    loadComponent: () =>
      import(`${BASE_PATH}/feedback/skeleton/skeleton-doc.component`).then(
        (m) => m.SkeletonDocComponent,
      ),
    data: {
      title: 'Skeleton',
      description: 'Skeleton loading component',
    },
  },
  {
    path: 'feedback/empty-state',
    loadComponent: () =>
      import(
        `${BASE_PATH}/feedback/empty-state/empty-state-doc.component`
      ).then((m) => m.EmptyStateDocComponent),
    data: {
      title: 'Empty State',
      description: 'Empty state component',
    },
  },
  {
    path: 'feedback/error-state',
    loadComponent: () =>
      import(
        `${BASE_PATH}/feedback/error-state/error-state-doc.component`
      ).then((m) => m.ErrorStateDocComponent),
    data: {
      title: 'Error State',
      description: 'Error state component',
    },
  },
  {
    path: 'feedback/splash-screen',
    loadComponent: () =>
      import(
        `${BASE_PATH}/feedback/splash-screen/splash-screen-doc.component`
      ).then((m) => m.SplashScreenDocComponent),
    data: {
      title: 'Splash Screen',
      description: 'Splash screen component',
    },
  },
];
