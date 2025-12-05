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
  {
    path: 'theme-generator',
    loadChildren: () =>
      import('../../features/theme-generator/theme-generator.routes').then(
        (m) => m.THEME_GENERATOR_ROUTES,
      ),
    data: {
      title: 'Theme Generator',
      description: 'Visual theme generator with color picker like DaisyUI',
    },
  },
  {
    path: 'crud-generator',
    loadComponent: () =>
      import(
        '../../pages/tools/crud-generator/crud-generator-tool.component'
      ).then((m) => m.CrudGeneratorToolComponent),
    data: {
      title: 'CRUD Generator',
      description: 'Generate full-stack CRUD modules with CLI',
    },
  },
];
