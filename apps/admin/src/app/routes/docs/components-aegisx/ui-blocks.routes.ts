/**
 * UI Blocks Routes
 *
 * Reusable UI block patterns for common page layouts.
 * These blocks are designed to work with the CRUD Generator.
 */

import { Route } from '@angular/router';

export const UI_BLOCKS_ROUTES: Route[] = [
  {
    path: 'ui-blocks/table-header',
    loadComponent: () =>
      import(
        '../../../pages/docs/components/aegisx/ui-blocks/table-header/table-header-doc.component'
      ).then((m) => m.TableHeaderDocComponent),
    data: {
      title: 'Table Header',
      description: 'Reusable table header block for list pages',
    },
  },
];
