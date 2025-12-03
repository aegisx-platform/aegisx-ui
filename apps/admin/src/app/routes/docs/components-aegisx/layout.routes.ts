import { Route } from '@angular/router';

const BASE_PATH = '../../pages/docs/components/aegisx';

export const LAYOUT_ROUTES: Route[] = [
  {
    path: 'layout/drawer',
    loadComponent: () =>
      import(`${BASE_PATH}/layout/drawer/drawer-doc.component`).then(
        (m) => m.DrawerDocComponent,
      ),
    data: {
      title: 'Drawer',
      description: 'Drawer layout component',
    },
  },
  {
    path: 'layout/splitter',
    loadComponent: () =>
      import(`${BASE_PATH}/layout/splitter/splitter-doc.component`).then(
        (m) => m.SplitterDocComponent,
      ),
    data: {
      title: 'Splitter',
      description: 'Splitter layout component',
    },
  },
  {
    path: 'layout/enterprise',
    loadComponent: () =>
      import(
        `${BASE_PATH}/layout/enterprise/enterprise-layout-doc.component`
      ).then((m) => m.EnterpriseLayoutDocComponent),
    data: {
      title: 'Enterprise Layout',
      description: 'Enterprise layout component',
    },
  },
  {
    path: 'layout/compact',
    loadComponent: () =>
      import(`${BASE_PATH}/layout/compact/compact-layout-doc.component`).then(
        (m) => m.CompactLayoutDocComponent,
      ),
    data: {
      title: 'Compact Layout',
      description: 'Compact layout component',
    },
  },
  {
    path: 'layout/empty',
    loadComponent: () =>
      import(`${BASE_PATH}/layout/empty/empty-layout-doc.component`).then(
        (m) => m.EmptyLayoutDocComponent,
      ),
    data: {
      title: 'Empty Layout',
      description: 'Empty layout component',
    },
  },
];
