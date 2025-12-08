import { Route } from '@angular/router';

export const MCP_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
  {
    path: 'overview',
    loadComponent: () =>
      import('../../pages/docs/mcp/overview/mcp-overview.component').then(
        (m) => m.McpOverviewComponent,
      ),
    data: {
      title: 'MCP Overview',
      description: 'AegisX Model Context Protocol server documentation',
    },
  },
  {
    path: 'components',
    loadComponent: () =>
      import('../../pages/docs/mcp/components/mcp-components.component').then(
        (m) => m.McpComponentsComponent,
      ),
    data: {
      title: 'MCP Components',
      description: 'MCP tools for AegisX UI components',
    },
  },
  {
    path: 'patterns',
    loadComponent: () =>
      import('../../pages/docs/mcp/patterns/mcp-patterns.component').then(
        (m) => m.McpPatternsComponent,
      ),
    data: {
      title: 'MCP Patterns',
      description: 'MCP tools for development patterns',
    },
  },
  {
    path: 'crud-generator',
    redirectTo: '/docs/cli/reference',
    pathMatch: 'full',
  },
];
