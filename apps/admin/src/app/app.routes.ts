import { Route } from '@angular/router';

// Feature Routes
import { COMPONENTS_AEGISX_ROUTES } from './features/docs/components-aegisx.routes';
import { FOUNDATIONS_ROUTES } from './features/docs/foundations.routes';
import { GETTING_STARTED_ROUTES } from './features/docs/getting-started.routes';
import { INTEGRATIONS_ROUTES } from './features/docs/integrations.routes';
import { MATERIAL_ROUTES } from './features/docs/material.routes';
import {
  ARCHITECTURE_ROUTES,
  PATTERNS_ROUTES,
} from './features/docs/patterns-architecture.routes';
import { PLAYGROUND_ROUTES } from './features/playground/playground.routes';
import { LEGACY_REDIRECTS } from './features/redirects/legacy-redirects.routes';
import { STANDALONE_ROUTES } from './features/standalone/standalone.routes';
import { TOOLS_ROUTES } from './features/tools/tools.routes';

/**
 * Admin Application Routes
 *
 * Route Architecture:
 * ├── / (root redirect)
 * ├── /docs/* (documentation)
 * │   ├── /docs/getting-started/*
 * │   ├── /docs/foundations/*
 * │   ├── /docs/components/aegisx/*
 * │   ├── /docs/integrations/*
 * │   ├── /docs/material/*
 * │   ├── /docs/patterns/*
 * │   └── /docs/architecture/*
 * ├── /playground/* (examples & experiments)
 * ├── /tools/* (admin tools)
 * ├── /[standalone pages] (demos & legacy)
 * └── [legacy redirects]
 */
export const appRoutes: Route[] = [
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
  {
    path: 'docs/getting-started',
    children: GETTING_STARTED_ROUTES,
    data: {
      title: 'Getting Started',
      description: 'Get started with AegisX',
    },
  },
  {
    path: 'docs/foundations',
    children: FOUNDATIONS_ROUTES,
    data: {
      title: 'Foundations',
      description: 'Design foundations and principles',
    },
  },
  {
    path: 'docs/components/aegisx',
    children: COMPONENTS_AEGISX_ROUTES,
    data: {
      title: 'AegisX Components',
      description: 'AegisX component library',
    },
  },
  {
    path: 'docs/integrations',
    children: INTEGRATIONS_ROUTES,
    data: {
      title: 'Integrations',
      description: 'Third-party integrations',
    },
  },
  {
    path: 'docs/material',
    children: MATERIAL_ROUTES,
    data: {
      title: 'Material Components',
      description: 'Angular Material components',
    },
  },
  {
    path: 'docs/patterns',
    children: PATTERNS_ROUTES,
    data: {
      title: 'Patterns',
      description: 'Design patterns',
    },
  },
  {
    path: 'docs/architecture',
    children: ARCHITECTURE_ROUTES,
    data: {
      title: 'Architecture',
      description: 'Application architecture',
    },
  },

  // ============================================
  // PLAYGROUND ROUTES - /playground/*
  // ============================================
  {
    path: 'playground',
    children: PLAYGROUND_ROUTES,
    data: {
      title: 'Playground',
      description: 'Component playgrounds and experiments',
    },
  },

  // ============================================
  // TOOLS ROUTES - /tools/*
  // ============================================
  {
    path: 'tools',
    children: TOOLS_ROUTES,
    data: {
      title: 'Tools',
      description: 'Administrative tools and utilities',
    },
  },

  // ============================================
  // STANDALONE DEMO ROUTES
  // ============================================
  ...STANDALONE_ROUTES,

  // ============================================
  // LEGACY REDIRECTS (old routes → new routes)
  // ============================================
  ...LEGACY_REDIRECTS,

  // ============================================
  // CATCH-ALL (404)
  // ============================================
  {
    path: '**',
    redirectTo: 'docs/getting-started/introduction',
  },
];
