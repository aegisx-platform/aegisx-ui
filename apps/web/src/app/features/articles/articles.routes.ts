import { Routes } from '@angular/router';

export const articlesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/articles-list.component').then(
        (m) => m.ArticleListComponent,
      ),
    title: 'Articles',
  },
];
