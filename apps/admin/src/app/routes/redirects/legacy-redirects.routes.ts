import { Route } from '@angular/router';

export const LEGACY_REDIRECTS: Route[] = [
  // Getting Started redirects
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

  // Foundations redirects
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

  // Old component routes → new aegisx routes
  {
    path: 'docs/components/data-display/overview',
    redirectTo: 'docs/components/aegisx/data-display/overview',
    pathMatch: 'full',
  },
  {
    path: 'docs/components/data-display/card',
    redirectTo: 'docs/components/aegisx/data-display/card',
    pathMatch: 'full',
  },
  {
    path: 'docs/components/data-display/badge',
    redirectTo: 'docs/components/aegisx/data-display/badge',
    pathMatch: 'full',
  },
  {
    path: 'docs/components/data-display/avatar',
    redirectTo: 'docs/components/aegisx/data-display/avatar',
    pathMatch: 'full',
  },
  {
    path: 'docs/components/data-display/list',
    redirectTo: 'docs/components/aegisx/data-display/list',
    pathMatch: 'full',
  },
  {
    path: 'docs/components/data-display/kpi-card',
    redirectTo: 'docs/components/aegisx/data-display/kpi-card',
    pathMatch: 'full',
  },
  {
    path: 'docs/components/data-display/sparkline',
    redirectTo: 'docs/components/aegisx/charts/sparkline',
    pathMatch: 'full',
  },
  {
    path: 'docs/components/data-display/circular-progress',
    redirectTo: 'docs/components/aegisx/charts/circular-progress',
    pathMatch: 'full',
  },
  {
    path: 'docs/components/data-display/segmented-progress',
    redirectTo: 'docs/components/aegisx/charts/segmented-progress',
    pathMatch: 'full',
  },
  {
    path: 'docs/components/forms/date-picker',
    redirectTo: 'docs/components/aegisx/forms/date-picker',
    pathMatch: 'full',
  },
  {
    path: 'docs/components/feedback/alert',
    redirectTo: 'docs/components/aegisx/feedback/alert',
    pathMatch: 'full',
  },
  {
    path: 'docs/components/feedback/loading-bar',
    redirectTo: 'docs/components/aegisx/feedback/loading-bar',
    pathMatch: 'full',
  },
  {
    path: 'docs/components/feedback/dialogs',
    redirectTo: 'docs/components/aegisx/feedback/dialogs',
    pathMatch: 'full',
  },
  {
    path: 'docs/components/navigation/breadcrumb',
    redirectTo: 'docs/components/aegisx/navigation/breadcrumb',
    pathMatch: 'full',
  },

  // Examples redirects → playground
  {
    path: 'docs/examples/dashboard',
    redirectTo: 'playground/pages/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'docs/examples/user-management',
    redirectTo: 'playground/pages/user-management',
    pathMatch: 'full',
  },
  {
    path: 'docs/examples/components',
    redirectTo: 'playground/experiments/components',
    pathMatch: 'full',
  },
  {
    path: 'docs/examples/card-examples',
    redirectTo: 'playground/experiments/cards',
    pathMatch: 'full',
  },

  // Other legacy redirects
  {
    path: 'dashboard',
    redirectTo: 'playground/pages/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'users',
    redirectTo: 'playground/pages/user-management',
    pathMatch: 'full',
  },
  {
    path: 'components',
    redirectTo: 'playground/experiments/components',
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
    redirectTo: 'docs/components/aegisx/data-display/badge',
    pathMatch: 'full',
  },
  {
    path: 'kpi-card-demo',
    redirectTo: 'docs/components/aegisx/data-display/kpi-card',
    pathMatch: 'full',
  },
  {
    path: 'card-examples',
    redirectTo: 'playground/experiments/cards',
    pathMatch: 'full',
  },
  {
    path: 'sparkline-demo',
    redirectTo: 'docs/components/aegisx/charts/sparkline',
    pathMatch: 'full',
  },
  {
    path: 'circular-progress-demo',
    redirectTo: 'docs/components/aegisx/charts/circular-progress',
    pathMatch: 'full',
  },
  {
    path: 'segmented-progress-demo',
    redirectTo: 'docs/components/aegisx/charts/segmented-progress',
    pathMatch: 'full',
  },
  {
    path: 'aegisx-ui',
    redirectTo: 'docs/components/aegisx/overview',
    pathMatch: 'full',
  },
  {
    path: 'aegisx-ui/cards',
    redirectTo: 'docs/components/aegisx/data-display/card',
    pathMatch: 'full',
  },
  {
    path: 'aegisx-ui/lists',
    redirectTo: 'docs/components/aegisx/data-display/list',
    pathMatch: 'full',
  },
  {
    path: 'aegisx-ui/data-display',
    redirectTo: 'docs/components/aegisx/overview',
    pathMatch: 'full',
  },
  {
    path: 'aegisx-ui/avatar',
    redirectTo: 'docs/components/aegisx/data-display/avatar',
    pathMatch: 'full',
  },
  {
    path: 'aegisx-ui/date-picker',
    redirectTo: 'docs/components/aegisx/forms/date-picker',
    pathMatch: 'full',
  },
  {
    path: 'aegisx-ui/alerts',
    redirectTo: 'docs/components/aegisx/feedback/alert',
    pathMatch: 'full',
  },
  {
    path: 'aegisx-ui/loading-bar',
    redirectTo: 'docs/components/aegisx/feedback/loading-bar',
    pathMatch: 'full',
  },
  {
    path: 'aegisx-ui/breadcrumb',
    redirectTo: 'docs/components/aegisx/navigation/breadcrumb',
    pathMatch: 'full',
  },
  {
    path: 'aegisx-ui/dialogs',
    redirectTo: 'docs/components/aegisx/feedback/dialogs',
    pathMatch: 'full',
  },
  {
    path: 'prose-demo',
    redirectTo: 'playground/experiments/prose',
    pathMatch: 'full',
  },
  {
    path: 'spark-charts',
    redirectTo: 'playground/experiments/charts',
    pathMatch: 'full',
  },
];
