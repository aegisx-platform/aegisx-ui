import { Route } from '@angular/router';

/**
 * Tools Routes
 *
 * Administrative tools and utilities
 * Base path: /tools
 */
export const TOOLS_ROUTES: Route[] = [
  {
    path: 'theme-builder',
    loadComponent: () =>
      import(
        '../../pages/tools/theme-builder/theme-builder-tool.component'
      ).then((m) => m.ThemeBuilderToolComponent),
    data: {
      title: 'Theme Builder',
      description: 'Customize and build themes for the AegisX design system',
    },
  },
];
