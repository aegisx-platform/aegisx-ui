import { Route } from '@angular/router';

export const GETTING_STARTED_ROUTES: Route[] = [
  {
    path: 'introduction',
    loadComponent: () =>
      import(
        '../../pages/docs/getting-started/introduction/introduction-doc.component'
      ).then((m) => m.IntroductionDocComponent),
    data: {
      title: 'Introduction',
      description: 'Getting started with AegisX Design System',
    },
  },
  {
    path: 'installation',
    loadComponent: () =>
      import(
        '../../pages/docs/getting-started/installation/installation-doc.component'
      ).then((m) => m.InstallationDocComponent),
    data: {
      title: 'Installation',
      description: 'Install and set up AegisX components',
    },
  },
  {
    path: 'quick-start',
    loadComponent: () =>
      import(
        '../../pages/docs/getting-started/quick-start/quick-start-doc.component'
      ).then((m) => m.QuickStartDocComponent),
    data: {
      title: 'Quick Start',
      description: 'Quick start guide for AegisX',
    },
  },
];
