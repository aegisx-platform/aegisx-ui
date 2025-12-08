import { Route } from '@angular/router';

export const PATTERNS_ROUTES: Route[] = [
  {
    path: 'form-sizes',
    loadComponent: () =>
      import(
        '../../pages/docs/patterns/form-sizes/form-sizes-doc.component'
      ).then((m) => m.FormSizesDocComponent),
    data: {
      title: 'Form Sizes',
      description: 'Form sizes and layout patterns',
    },
  },
  {
    path: 'form-layouts',
    loadComponent: () =>
      import(
        '../../pages/docs/patterns/form-layouts/form-layouts-doc.component'
      ).then((m) => m.FormLayoutsDocComponent),
    data: {
      title: 'Form Layouts',
      description: 'Form layout patterns',
    },
  },
];

export const ARCHITECTURE_ROUTES: Route[] = [
  {
    path: 'multi-app',
    loadComponent: () =>
      import(
        '../../pages/docs/architecture/multi-app/multi-app-doc.component'
      ).then((m) => m.MultiAppDocComponent),
    data: {
      title: 'Multi-App Architecture',
      description: 'Multi-app architecture patterns',
    },
  },
  {
    path: 'shell-pattern',
    loadComponent: () =>
      import(
        '../../pages/docs/architecture/shell-pattern/shell-pattern-doc.component'
      ).then((m) => m.ShellPatternDocComponent),
    data: {
      title: 'Shell Pattern',
      description: 'Shell pattern architecture',
    },
  },
];
