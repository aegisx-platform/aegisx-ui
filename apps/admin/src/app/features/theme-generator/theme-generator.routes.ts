import { Routes } from '@angular/router';

export const THEME_GENERATOR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './pages/theme-generator-page/theme-generator-page.component'
      ).then((m) => m.ThemeGeneratorPageComponent),
    title: 'Theme Generator - AegisX',
  },
];
