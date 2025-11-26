import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  // ============================================
  // STANDALONE ROUTES (no layout)
  // ============================================
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },

  // ============================================
  // ROOT REDIRECT
  // ============================================
  {
    path: '',
    redirectTo: 'docs/getting-started/introduction',
    pathMatch: 'full',
  },

  // ============================================
  // DOCUMENTATION ROUTES - /docs/*
  // ============================================

  // --- Getting Started ---
  {
    path: 'docs/getting-started/introduction',
    loadComponent: () =>
      import('./pages/introduction/introduction.component').then(
        (m) => m.IntroductionComponent,
      ),
  },
  {
    path: 'docs/getting-started/installation',
    loadComponent: () =>
      import('./pages/installation/installation.component').then(
        (m) => m.InstallationComponent,
      ),
  },
  {
    path: 'docs/getting-started/quick-start',
    loadComponent: () =>
      import('./pages/quick-start/quick-start.component').then(
        (m) => m.QuickStartComponent,
      ),
  },

  // --- Foundations ---
  {
    path: 'docs/foundations/overview',
    loadComponent: () =>
      import(
        './pages/docs/foundations/overview/foundations-overview.component'
      ).then((m) => m.FoundationsOverviewComponent),
  },
  {
    path: 'docs/foundations/design-tokens',
    loadComponent: () =>
      import('./pages/design-tokens/design-tokens.component').then(
        (m) => m.DesignTokensComponent,
      ),
  },
  {
    path: 'docs/foundations/colors',
    loadComponent: () =>
      import('./pages/docs/foundations/colors/colors.component').then(
        (m) => m.ColorsComponent,
      ),
  },
  {
    path: 'docs/foundations/typography',
    loadComponent: () =>
      import('./pages/typography-showcase/typography-showcase.component').then(
        (m) => m.TypographyShowcaseComponent,
      ),
  },
  {
    path: 'docs/foundations/spacing',
    loadComponent: () =>
      import('./pages/docs/foundations/spacing/spacing.component').then(
        (m) => m.SpacingComponent,
      ),
  },
  {
    path: 'docs/foundations/shadows',
    loadComponent: () =>
      import('./pages/docs/foundations/shadows/shadows.component').then(
        (m) => m.ShadowsComponent,
      ),
  },
  {
    path: 'docs/foundations/motion',
    loadComponent: () =>
      import('./pages/docs/foundations/motion/motion.component').then(
        (m) => m.MotionComponent,
      ),
  },

  // --- Components > Data Display ---
  {
    path: 'docs/components/data-display/overview',
    loadComponent: () =>
      import(
        './pages/aegisx-ui/data-display-demo/data-display-demo.component'
      ).then((m) => m.DataDisplayDemoComponent),
  },
  {
    path: 'docs/components/data-display/card',
    loadComponent: () =>
      import(
        './pages/docs/components/data-display/card/card-doc.component'
      ).then((m) => m.CardDocComponent),
  },
  {
    path: 'docs/components/data-display/kpi-card',
    loadComponent: () =>
      import(
        './pages/docs/components/data-display/kpi-card/kpi-card-doc.component'
      ).then((m) => m.KpiCardDocComponent),
  },
  {
    path: 'docs/components/data-display/badge',
    loadComponent: () =>
      import(
        './pages/docs/components/data-display/badge/badge-doc.component'
      ).then((m) => m.BadgeDocComponent),
  },
  {
    path: 'docs/components/data-display/avatar',
    loadComponent: () =>
      import(
        './pages/docs/components/data-display/avatar/avatar-doc.component'
      ).then((m) => m.AvatarDocComponent),
  },
  {
    path: 'docs/components/data-display/list',
    loadComponent: () =>
      import(
        './pages/docs/components/data-display/list/list-doc.component'
      ).then((m) => m.ListDocComponent),
  },
  {
    path: 'docs/components/data-display/sparkline',
    loadComponent: () =>
      import('./pages/sparkline-demo/sparkline-demo.component').then(
        (m) => m.SparklineDemoComponent,
      ),
  },
  {
    path: 'docs/components/data-display/circular-progress',
    loadComponent: () =>
      import(
        './pages/circular-progress-demo/circular-progress-demo.component'
      ).then((m) => m.CircularProgressDemoComponent),
  },
  {
    path: 'docs/components/data-display/segmented-progress',
    loadComponent: () =>
      import(
        './pages/segmented-progress-demo/segmented-progress-demo.component'
      ).then((m) => m.SegmentedProgressDemoComponent),
  },

  // --- Components > Forms ---
  {
    path: 'docs/components/forms/date-picker',
    loadComponent: () =>
      import(
        './pages/docs/components/forms/date-picker/date-picker-doc.component'
      ).then((m) => m.DatePickerDocComponent),
  },

  // --- Components > Feedback ---
  {
    path: 'docs/components/feedback/alert',
    loadComponent: () =>
      import('./pages/docs/components/feedback/alert/alert-doc.component').then(
        (m) => m.AlertDocComponent,
      ),
  },
  {
    path: 'docs/components/feedback/loading-bar',
    loadComponent: () =>
      import(
        './pages/docs/components/feedback/loading-bar/loading-bar-doc.component'
      ).then((m) => m.LoadingBarDocComponent),
  },
  {
    path: 'docs/components/feedback/dialogs',
    loadComponent: () =>
      import(
        './pages/docs/components/feedback/dialogs/dialogs-doc.component'
      ).then((m) => m.DialogsDocComponent),
  },

  // --- Components > Navigation ---
  {
    path: 'docs/components/navigation/breadcrumb',
    loadComponent: () =>
      import(
        './pages/docs/components/navigation/breadcrumb/breadcrumb-doc.component'
      ).then((m) => m.BreadcrumbDocComponent),
  },

  // --- Patterns ---
  {
    path: 'docs/patterns/form-sizes',
    loadComponent: () =>
      import('./pages/docs/patterns/form-sizes/form-sizes-doc.component').then(
        (m) => m.FormSizesDocComponent,
      ),
  },
  {
    path: 'docs/patterns/form-layouts',
    loadComponent: () =>
      import(
        './pages/docs/patterns/form-layouts/form-layouts-doc.component'
      ).then((m) => m.FormLayoutsDocComponent),
  },

  // --- Examples ---
  {
    path: 'docs/examples/dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
  },
  {
    path: 'docs/examples/user-management',
    loadComponent: () =>
      import('./pages/user-management/user-management.component').then(
        (m) => m.UserManagementComponent,
      ),
  },
  {
    path: 'docs/examples/components',
    loadComponent: () =>
      import('./pages/components-demo/components-demo.component').then(
        (m) => m.ComponentsDemoComponent,
      ),
  },
  {
    path: 'docs/examples/card-examples',
    loadComponent: () =>
      import('./pages/card-examples/card-examples.component').then(
        (m) => m.CardExamplesComponent,
      ),
  },

  // ============================================
  // LEGACY REDIRECTS (old routes → new routes)
  // ============================================
  {
    path: 'introduction',
    redirectTo: 'docs/getting-started/introduction',
    pathMatch: 'full',
  },
  {
    path: 'installation',
    redirectTo: 'docs/getting-started/installation',
    pathMatch: 'full',
  },
  {
    path: 'quick-start',
    redirectTo: 'docs/getting-started/quick-start',
    pathMatch: 'full',
  },
  {
    path: 'design-tokens',
    redirectTo: 'docs/foundations/design-tokens',
    pathMatch: 'full',
  },
  {
    path: 'typography',
    redirectTo: 'docs/foundations/typography',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    redirectTo: 'docs/examples/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'users',
    redirectTo: 'docs/examples/user-management',
    pathMatch: 'full',
  },
  {
    path: 'components',
    redirectTo: 'docs/examples/components',
    pathMatch: 'full',
  },
  {
    path: 'form-sizes',
    redirectTo: 'docs/patterns/form-sizes',
    pathMatch: 'full',
  },
  {
    path: 'form-layouts',
    redirectTo: 'docs/patterns/form-layouts',
    pathMatch: 'full',
  },
  {
    path: 'badges',
    redirectTo: 'docs/components/data-display/badge',
    pathMatch: 'full',
  },
  {
    path: 'kpi-card-demo',
    redirectTo: 'docs/components/data-display/kpi-card',
    pathMatch: 'full',
  },
  {
    path: 'card-examples',
    redirectTo: 'docs/examples/card-examples',
    pathMatch: 'full',
  },
  {
    path: 'sparkline-demo',
    redirectTo: 'docs/components/data-display/sparkline',
    pathMatch: 'full',
  },
  {
    path: 'circular-progress-demo',
    redirectTo: 'docs/components/data-display/circular-progress',
    pathMatch: 'full',
  },
  {
    path: 'segmented-progress-demo',
    redirectTo: 'docs/components/data-display/segmented-progress',
    pathMatch: 'full',
  },
  {
    path: 'aegisx-ui',
    redirectTo: 'docs/components/data-display/overview',
    pathMatch: 'full',
  },
  {
    path: 'aegisx-ui/cards',
    redirectTo: 'docs/components/data-display/card',
    pathMatch: 'full',
  },
  {
    path: 'aegisx-ui/lists',
    redirectTo: 'docs/components/data-display/list',
    pathMatch: 'full',
  },
  {
    path: 'aegisx-ui/data-display',
    redirectTo: 'docs/components/data-display/overview',
    pathMatch: 'full',
  },
  {
    path: 'aegisx-ui/avatar',
    redirectTo: 'docs/components/data-display/avatar',
    pathMatch: 'full',
  },
  {
    path: 'aegisx-ui/date-picker',
    redirectTo: 'docs/components/forms/date-picker',
    pathMatch: 'full',
  },
  {
    path: 'aegisx-ui/alerts',
    redirectTo: 'docs/components/feedback/alert',
    pathMatch: 'full',
  },
  {
    path: 'aegisx-ui/loading-bar',
    redirectTo: 'docs/components/feedback/loading-bar',
    pathMatch: 'full',
  },
  {
    path: 'aegisx-ui/breadcrumb',
    redirectTo: 'docs/components/navigation/breadcrumb',
    pathMatch: 'full',
  },
  {
    path: 'aegisx-ui/dialogs',
    redirectTo: 'docs/components/feedback/dialogs',
    pathMatch: 'full',
  },

  // Deprecated routes (can be removed later)
  {
    path: 'prose-demo',
    loadComponent: () =>
      import('./pages/prose-demo/prose-demo.component').then(
        (m) => m.ProseDemoComponent,
      ),
  },
  {
    path: 'spark-charts',
    loadComponent: () =>
      import('./pages/spark-charts/spark-charts.component').then(
        (m) => m.SparkChartsComponent,
      ),
  },
];
