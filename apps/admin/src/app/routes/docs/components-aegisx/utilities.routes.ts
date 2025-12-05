import { Route } from '@angular/router';

const BASE_PATH = '../../../pages/docs/components/aegisx';

export const UTILITIES_ROUTES: Route[] = [
  {
    path: 'utilities/theme-switcher',
    loadComponent: () =>
      import(
        `${BASE_PATH}/utilities/theme-switcher/theme-switcher-doc.component`
      ).then((m) => m.ThemeSwitcherDocComponent),
    data: {
      title: 'Theme Switcher',
      description: 'Theme switcher utility',
    },
  },
  {
    path: 'utilities/layout-switcher',
    loadComponent: () =>
      import(
        `${BASE_PATH}/utilities/layout-switcher/layout-switcher-doc.component`
      ).then((m) => m.LayoutSwitcherDocComponent),
    data: {
      title: 'Layout Switcher',
      description: 'Layout switcher utility',
    },
  },
  {
    path: 'utilities/theme-builder',
    loadComponent: () =>
      import(
        `${BASE_PATH}/utilities/theme-builder/theme-builder-doc.component`
      ).then((m) => m.ThemeBuilderDocComponent),
    data: {
      title: 'Theme Builder Doc',
      description: 'Theme builder utility documentation',
    },
  },
];

export const DASHBOARD_ROUTES: Route[] = [
  {
    path: 'dashboard/widget-framework',
    loadComponent: () =>
      import(
        `${BASE_PATH}/dashboard/widget-framework/widget-framework-doc.component`
      ).then((m) => m.WidgetFrameworkDocComponent),
    data: {
      title: 'Widget Framework',
      description: 'Widget framework documentation',
    },
  },
];
