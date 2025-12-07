import { Route } from '@angular/router';
import { AuthGuard } from '../../core/auth';

/**
 * Inventory Routes
 *
 * Route structure:
 * /inventory                    -> Main page (ax-launcher with all modules)
 * /inventory/dashboard          -> Dashboard (analytics, KPIs)
 * /inventory/master-data        -> Master Data page (ax-launcher for section)
 * /inventory/master-data/drugs  -> Drugs CRUD module
 *
 * CRUD modules are auto-registered at the marked section below.
 */
export const INVENTORY_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./inventory-shell.component').then(
        (m) => m.InventoryShellComponent,
      ),
    canActivate: [AuthGuard],
    children: [
      // Main page - ax-launcher with all modules
      {
        path: '',
        loadComponent: () =>
          import('./pages/main/main.page').then((m) => m.MainPage),
        data: {
          title: 'Inventory',
          description: 'Inventory modules',
        },
      },

      // Dashboard page
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.page').then(
            (m) => m.DashboardPage,
          ),
        data: {
          title: 'Dashboard',
          description: 'Inventory Dashboard',
        },
      },

      // Master Data Section (with children for CRUD modules)
      {
        path: 'master-data',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/master-data/master-data.page').then(
                (m) => m.MasterDataPage,
              ),
            data: {
              title: 'Master Data',
            },
          },
          // === MASTER-DATA ROUTES START ===
          // Drugs (Generated CRUD)
          {
            path: 'drugs',
            loadChildren: () =>
              import('./modules/drugs/drugs.routes').then((m) => m.drugsRoutes),
            data: {
              title: 'Drugs',
              description: 'Drugs Management System',
              requiredPermissions: ['drugs.read', 'admin.*'],
            },
          },
          // CRUD modules will be auto-registered here by the generator
          // === MASTER-DATA ROUTES END ===
        ],
      },

      // === AUTO-GENERATED ROUTES START ===
      // CRUD modules will be auto-registered here by the generator
      // === AUTO-GENERATED ROUTES END ===
    ],
  },
];
