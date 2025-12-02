import { Route } from '@angular/router';

export const STANDALONE_ROUTES: Route[] = [
  {
    path: 'login',
    loadComponent: () =>
      import('../../pages/playground/pages/login/login.component').then(
        (m) => m.LoginComponent,
      ),
    data: {
      title: 'Login',
      description: 'Standalone login page',
    },
  },
  {
    path: 'enterprise-demo',
    loadComponent: () =>
      import('../../pages/enterprise-demo/enterprise-demo.component').then(
        (m) => m.EnterpriseDemoComponent,
      ),
    data: {
      title: 'Enterprise Demo',
      description: 'Enterprise layout demonstration',
    },
  },
  {
    path: 'inventory-demo',
    loadComponent: () =>
      import('../../pages/inventory-demo/inventory-shell.component').then(
        (m) => m.InventoryShellComponent,
      ),
    data: {
      title: 'Inventory Demo',
      description: 'Inventory management system demo',
    },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../../pages/inventory-demo/pages/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: 'stock',
        loadComponent: () =>
          import('../../pages/inventory-demo/pages/stock.component').then(
            (m) => m.StockComponent,
          ),
      },
      {
        path: 'purchase',
        loadComponent: () =>
          import('../../pages/inventory-demo/pages/purchase.component').then(
            (m) => m.PurchaseComponent,
          ),
      },
      {
        path: 'suppliers',
        loadComponent: () =>
          import('../../pages/inventory-demo/pages/suppliers.component').then(
            (m) => m.SuppliersComponent,
          ),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('../../pages/inventory-demo/pages/reports.component').then(
            (m) => m.ReportsComponent,
          ),
      },
    ],
  },
  {
    path: 'his-demo',
    loadComponent: () =>
      import('../../pages/his-demo/his-shell.component').then(
        (m) => m.HisShellComponent,
      ),
    data: {
      title: 'HIS Demo',
      description: 'Hospital Information System demo',
    },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../../pages/his-demo/pages/dashboard.component').then(
            (m) => m.HisDashboardComponent,
          ),
      },
      {
        path: 'patients',
        loadComponent: () =>
          import('../../pages/his-demo/pages/patients.component').then(
            (m) => m.PatientsComponent,
          ),
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import('../../pages/his-demo/pages/appointments.component').then(
            (m) => m.AppointmentsComponent,
          ),
      },
      {
        path: 'lab-results',
        loadComponent: () =>
          import('../../pages/his-demo/pages/lab-results.component').then(
            (m) => m.LabResultsComponent,
          ),
      },
      {
        path: 'pharmacy',
        loadComponent: () =>
          import('../../pages/his-demo/pages/pharmacy.component').then(
            (m) => m.PharmacyComponent,
          ),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('../../pages/his-demo/pages/reports.component').then(
            (m) => m.HisReportsComponent,
          ),
      },
      {
        path: 'appointment-calendar',
        loadComponent: () =>
          import(
            '../../pages/his-demo/pages/appointment-calendar/appointment-calendar.component'
          ).then((m) => m.AppointmentCalendarComponent),
        data: { title: 'Appointment Calendar' },
      },
      {
        path: 'followup-demo',
        loadComponent: () =>
          import(
            '../../pages/his-demo/pages/followup-demo/followup-demo.component'
          ).then((m) => m.FollowupDemoComponent),
        data: { title: 'Follow-up Booking Demo' },
      },
    ],
  },
  {
    path: 'app-launcher-demo',
    loadComponent: () =>
      import('../../pages/app-launcher-demo/app-launcher-demo.component').then(
        (m) => m.AppLauncherDemoComponent,
      ),
    data: {
      title: 'App Launcher Demo',
      description: 'App launcher demonstration',
    },
  },
  {
    path: 'gridster-demo',
    loadComponent: () =>
      import('../../pages/gridster-demo/gridster-demo.component').then(
        (m) => m.GridsterDemoComponent,
      ),
    data: {
      title: 'Gridster Demo',
      description: 'Gridster layout demonstration',
    },
  },
  {
    path: 'gridster-poc',
    loadComponent: () =>
      import('../../pages/gridster-poc/gridster-poc.component').then(
        (m) => m.GridsterPocComponent,
      ),
    data: {
      title: 'Gridster POC',
      description: 'Gridster proof of concept',
    },
  },
  {
    path: 'widget-demo',
    loadComponent: () =>
      import('../../pages/widget-demo/widget-demo.component').then(
        (m) => m.WidgetDemoComponent,
      ),
    data: {
      title: 'Widget Framework Demo',
      description: 'Widget framework demonstration',
    },
  },
];
