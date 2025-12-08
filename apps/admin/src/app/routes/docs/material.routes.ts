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
    path: 'autocomplete',
    loadComponent: () =>
      import(
        '../../pages/docs/material/autocomplete/material-autocomplete-doc.component'
      ).then((m) => m.MaterialAutocompleteDocComponent),
    data: { title: 'Autocomplete', description: 'Autocomplete component' },
  },
  {
    path: 'badge',
    loadComponent: () =>
      import(
        '../../pages/docs/material/badge/material-badge-doc.component'
      ).then((m) => m.MaterialBadgeDocComponent),
    data: { title: 'Badge', description: 'Badge component' },
  },
  {
    path: 'bottom-sheet',
    loadComponent: () =>
      import(
        '../../pages/docs/material/bottom-sheet/material-bottom-sheet-doc.component'
      ).then((m) => m.MaterialBottomSheetDocComponent),
    data: { title: 'Bottom Sheet', description: 'Bottom sheet component' },
  },
  {
    path: 'divider',
    loadComponent: () =>
      import(
        '../../pages/docs/material/divider/material-divider-doc.component'
      ).then((m) => m.MaterialDividerDocComponent),
    data: { title: 'Divider', description: 'Divider component' },
  },
  {
    path: 'grid-list',
    loadComponent: () =>
      import(
        '../../pages/docs/material/grid-list/material-grid-list-doc.component'
      ).then((m) => m.MaterialGridListDocComponent),
    data: { title: 'Grid List', description: 'Grid list component' },
  },
  {
    path: 'input',
    loadComponent: () =>
      import(
        '../../pages/docs/material/input/material-input-doc.component'
      ).then((m) => m.MaterialInputDocComponent),
    data: { title: 'Input', description: 'Input component' },
  },
  {
    path: 'paginator',
    loadComponent: () =>
      import(
        '../../pages/docs/material/paginator/material-paginator-doc.component'
      ).then((m) => m.MaterialPaginatorDocComponent),
    data: { title: 'Paginator', description: 'Paginator component' },
  },
  {
    path: 'radio',
    loadComponent: () =>
      import(
        '../../pages/docs/material/radio/material-radio-doc.component'
      ).then((m) => m.MaterialRadioDocComponent),
    data: { title: 'Radio', description: 'Radio component' },
  },
  {
    path: 'sidenav',
    loadComponent: () =>
      import(
        '../../pages/docs/material/sidenav/material-sidenav-doc.component'
      ).then((m) => m.MaterialSidenavDocComponent),
    data: { title: 'Sidenav', description: 'Sidenav component' },
  },
  {
    path: 'slide-toggle',
    loadComponent: () =>
      import(
        '../../pages/docs/material/slide-toggle/material-slide-toggle-doc.component'
      ).then((m) => m.MaterialSlideToggleDocComponent),
    data: { title: 'Slide Toggle', description: 'Slide toggle component' },
  },
  {
    path: 'sort',
    loadComponent: () =>
      import('../../pages/docs/material/sort/material-sort-doc.component').then(
        (m) => m.MaterialSortDocComponent,
      ),
    data: { title: 'Sort', description: 'Sort component' },
  },
  {
    path: 'stepper',
    loadComponent: () =>
      import(
        '../../pages/docs/material/stepper/material-stepper-doc.component'
      ).then((m) => m.MaterialStepperDocComponent),
    data: { title: 'Stepper', description: 'Stepper component' },
  },
  {
    path: 'toolbar',
    loadComponent: () =>
      import(
        '../../pages/docs/material/toolbar/material-toolbar-doc.component'
      ).then((m) => m.MaterialToolbarDocComponent),
    data: { title: 'Toolbar', description: 'Toolbar component' },
  },
  {
    path: 'tree',
    loadComponent: () =>
      import('../../pages/docs/material/tree/material-tree-doc.component').then(
        (m) => m.MaterialTreeDocComponent,
      ),
    data: { title: 'Tree', description: 'Tree component' },
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
