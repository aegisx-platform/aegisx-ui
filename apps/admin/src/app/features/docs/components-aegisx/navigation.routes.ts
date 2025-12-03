import { Route } from '@angular/router';

const BASE_PATH = '../../pages/docs/components/aegisx';

export const NAVIGATION_ROUTES: Route[] = [
  {
    path: 'navigation/breadcrumb',
    loadComponent: () =>
      import(
        `${BASE_PATH}/navigation/breadcrumb/breadcrumb-doc.component`
      ).then((m) => m.BreadcrumbDocComponent),
    data: {
      title: 'Breadcrumb',
      description: 'Breadcrumb navigation component',
    },
  },
  {
    path: 'navigation/stepper',
    loadComponent: () =>
      import(`${BASE_PATH}/navigation/stepper/stepper-doc.component`).then(
        (m) => m.StepperDocComponent,
      ),
    data: {
      title: 'Stepper',
      description: 'Stepper component',
    },
  },
  {
    path: 'navigation/launcher',
    loadComponent: () =>
      import(`${BASE_PATH}/navigation/launcher/launcher-doc.component`).then(
        (m) => m.LauncherDocComponent,
      ),
    data: {
      title: 'Launcher',
      description: 'App launcher component',
    },
  },
  {
    path: 'navigation/navigation-menu',
    loadComponent: () =>
      import(
        `${BASE_PATH}/navigation/navigation-menu/navigation-menu-doc.component`
      ).then((m) => m.NavigationMenuDocComponent),
    data: {
      title: 'Navigation Menu',
      description: 'Navigation menu component',
    },
  },
  {
    path: 'navigation/navbar',
    loadComponent: () =>
      import(`${BASE_PATH}/navigation/navbar/navbar-doc.component`).then(
        (m) => m.NavbarDocComponent,
      ),
    data: {
      title: 'Navbar',
      description: 'Enterprise navigation bar component',
    },
  },
  {
    path: 'navigation/command-palette',
    loadComponent: () =>
      import(
        `${BASE_PATH}/navigation/command-palette/command-palette-doc.component`
      ).then((m) => m.CommandPaletteDocComponent),
    data: {
      title: 'Command Palette',
      description: 'Keyboard-first command search and execution',
    },
  },
];
