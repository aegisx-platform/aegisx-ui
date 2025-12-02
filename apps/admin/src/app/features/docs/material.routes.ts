import { Route } from '@angular/router';

export const MATERIAL_ROUTES: Route[] = [
  {
    path: 'overview',
    loadComponent: () =>
      import('../../pages/docs/material/material-overview.component').then(
        (m) => m.MaterialOverviewComponent,
      ),
    data: {
      title: 'Material Components Overview',
      description: 'Angular Material components overview',
    },
  },
  {
    path: 'button',
    loadComponent: () =>
      import(
        '../../pages/docs/material/button/material-button-doc.component'
      ).then((m) => m.MaterialButtonDocComponent),
    data: { title: 'Button', description: 'Button component' },
  },
  {
    path: 'card',
    loadComponent: () =>
      import('../../pages/docs/material/card/material-card-doc.component').then(
        (m) => m.MaterialCardDocComponent,
      ),
    data: { title: 'Card', description: 'Card component' },
  },
  {
    path: 'table',
    loadComponent: () =>
      import(
        '../../pages/docs/material/table/material-table-doc.component'
      ).then((m) => m.MaterialTableDocComponent),
    data: { title: 'Table', description: 'Table component' },
  },
  {
    path: 'form-field',
    loadComponent: () =>
      import(
        '../../pages/docs/material/form-field/material-form-field-doc.component'
      ).then((m) => m.MaterialFormFieldDocComponent),
    data: { title: 'Form Field', description: 'Form field component' },
  },
  {
    path: 'chips',
    loadComponent: () =>
      import(
        '../../pages/docs/material/chips/material-chips-doc.component'
      ).then((m) => m.MaterialChipsDocComponent),
    data: { title: 'Chips', description: 'Chips component' },
  },
  {
    path: 'dialog',
    loadComponent: () =>
      import(
        '../../pages/docs/material/dialog/material-dialog-doc.component'
      ).then((m) => m.MaterialDialogDocComponent),
    data: { title: 'Dialog', description: 'Dialog component' },
  },
  {
    path: 'menu',
    loadComponent: () =>
      import('../../pages/docs/material/menu/material-menu-doc.component').then(
        (m) => m.MaterialMenuDocComponent,
      ),
    data: { title: 'Menu', description: 'Menu component' },
  },
  {
    path: 'tabs',
    loadComponent: () =>
      import('../../pages/docs/material/tabs/material-tabs-doc.component').then(
        (m) => m.MaterialTabsDocComponent,
      ),
    data: { title: 'Tabs', description: 'Tabs component' },
  },
  {
    path: 'fab',
    loadComponent: () =>
      import('../../pages/docs/material/fab/material-fab-doc.component').then(
        (m) => m.MaterialFabDocComponent,
      ),
    data: { title: 'FAB', description: 'Floating action button' },
  },
  {
    path: 'select',
    loadComponent: () =>
      import(
        '../../pages/docs/material/select/material-select-doc.component'
      ).then((m) => m.MaterialSelectDocComponent),
    data: { title: 'Select', description: 'Select component' },
  },
  {
    path: 'progress',
    loadComponent: () =>
      import(
        '../../pages/docs/material/progress/material-progress-doc.component'
      ).then((m) => m.MaterialProgressDocComponent),
    data: { title: 'Progress', description: 'Progress component' },
  },
  {
    path: 'tooltip',
    loadComponent: () =>
      import(
        '../../pages/docs/material/tooltip/material-tooltip-doc.component'
      ).then((m) => m.MaterialTooltipDocComponent),
    data: { title: 'Tooltip', description: 'Tooltip component' },
  },
  {
    path: 'checkbox',
    loadComponent: () =>
      import(
        '../../pages/docs/material/checkbox/material-checkbox-doc.component'
      ).then((m) => m.MaterialCheckboxDocComponent),
    data: { title: 'Checkbox', description: 'Checkbox component' },
  },
  {
    path: 'slider',
    loadComponent: () =>
      import(
        '../../pages/docs/material/slider/material-slider-doc.component'
      ).then((m) => m.MaterialSliderDocComponent),
    data: { title: 'Slider', description: 'Slider component' },
  },
  {
    path: 'snackbar',
    loadComponent: () =>
      import(
        '../../pages/docs/material/snackbar/material-snackbar-doc.component'
      ).then((m) => m.MaterialSnackbarDocComponent),
    data: { title: 'Snackbar', description: 'Snackbar component' },
  },
  {
    path: 'expansion',
    loadComponent: () =>
      import(
        '../../pages/docs/material/expansion/material-expansion-doc.component'
      ).then((m) => m.MaterialExpansionDocComponent),
    data: { title: 'Expansion Panel', description: 'Expansion panel' },
  },
  {
    path: 'list',
    loadComponent: () =>
      import('../../pages/docs/material/list/material-list-doc.component').then(
        (m) => m.MaterialListDocComponent,
      ),
    data: { title: 'List', description: 'List component' },
  },
  {
    path: 'icon',
    loadComponent: () =>
      import('../../pages/docs/material/icon/material-icon-doc.component').then(
        (m) => m.MaterialIconDocComponent,
      ),
    data: { title: 'Icon', description: 'Icon component' },
  },
  {
    path: 'button-toggle',
    loadComponent: () =>
      import(
        '../../pages/docs/material/button-toggle/material-button-toggle-doc.component'
      ).then((m) => m.MaterialButtonToggleDocComponent),
    data: { title: 'Button Toggle', description: 'Button toggle' },
  },
  {
    path: 'datepicker',
    loadComponent: () =>
      import(
        '../../pages/docs/material/datepicker/material-datepicker-doc.component'
      ).then((m) => m.MaterialDatepickerDocComponent),
    data: { title: 'Datepicker', description: 'Datepicker component' },
  },
  {
    path: 'progress-bar',
    loadComponent: () =>
      import(
        '../../pages/docs/material/progress-bar/material-progress-bar-doc.component'
      ).then((m) => m.MaterialProgressBarDocComponent),
    data: { title: 'Progress Bar', description: 'Progress bar component' },
  },
  {
    path: ':component',
    loadComponent: () =>
      import('../../pages/docs/material/material-placeholder.component').then(
        (m) => m.MaterialPlaceholderComponent,
      ),
    data: { title: 'Material Component', description: 'Material component' },
  },
];
