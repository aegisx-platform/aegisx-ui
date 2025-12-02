import { Route } from '@angular/router';

export const COMPONENTS_AEGISX_ROUTES: Route[] = [
  {
    path: 'overview',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/overview/components-overview.component'
      ).then((m) => m.ComponentsOverviewComponent),
    data: {
      title: 'Components Overview',
      description: 'AegisX components library overview',
    },
  },
  {
    path: 'data-display/overview',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/data-display/overview/data-display-demo.component'
      ).then((m) => m.DataDisplayDemoComponent),
    data: {
      title: 'Data Display Components',
      description: 'Components for displaying data',
    },
  },
  {
    path: 'data-display/card',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/data-display/card/card-doc.component'
      ).then((m) => m.CardDocComponent),
    data: {
      title: 'Card Component',
      description: 'Card component documentation',
    },
  },
  {
    path: 'data-display/kpi-card',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/data-display/kpi-card/kpi-card-doc.component'
      ).then((m) => m.KpiCardDocComponent),
    data: {
      title: 'KPI Card Component',
      description: 'KPI Card component documentation',
    },
  },
  {
    path: 'data-display/badge',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/data-display/badge/badge-doc.component'
      ).then((m) => m.BadgeDocComponent),
    data: {
      title: 'Badge Component',
      description: 'Badge component documentation',
    },
  },
  {
    path: 'data-display/avatar',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/data-display/avatar/avatar-doc.component'
      ).then((m) => m.AvatarDocComponent),
    data: {
      title: 'Avatar Component',
      description: 'Avatar component documentation',
    },
  },
  {
    path: 'data-display/list',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/data-display/list/list-doc.component'
      ).then((m) => m.ListDocComponent),
    data: {
      title: 'List Component',
      description: 'List component documentation',
    },
  },
  {
    path: 'data-display/calendar',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/data-display/calendar/calendar-doc.component'
      ).then((m) => m.CalendarDocComponent),
    data: {
      title: 'Calendar Component',
      description: 'Calendar component documentation',
    },
  },
  {
    path: 'data-display/kbd',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/data-display/kbd/kbd-doc.component'
      ).then((m) => m.KbdDocComponent),
    data: {
      title: 'Kbd Component',
      description: 'Keyboard component documentation',
    },
  },
  {
    path: 'data-display/field-display',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/data-display/field-display/field-display-doc.component'
      ).then((m) => m.FieldDisplayDocComponent),
    data: {
      title: 'Field Display Component',
      description: 'Field Display component documentation',
    },
  },
  {
    path: 'data-display/description-list',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/data-display/description-list/description-list-doc.component'
      ).then((m) => m.DescriptionListDocComponent),
    data: {
      title: 'Description List Component',
      description: 'Description List component documentation',
    },
  },
  {
    path: 'data-display/stats-card',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/data-display/stats-card/stats-card-doc.component'
      ).then((m) => m.StatsCardDocComponent),
    data: {
      title: 'Stats Card Component',
      description: 'Stats Card component documentation',
    },
  },
  {
    path: 'data-display/timeline',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/data-display/timeline/timeline-doc.component'
      ).then((m) => m.TimelineDocComponent),
    data: {
      title: 'Timeline Component',
      description: 'Timeline component documentation',
    },
  },
  {
    path: 'data-display/divider',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/data-display/divider/divider-doc.component'
      ).then((m) => m.DividerDocComponent),
    data: {
      title: 'Divider Component',
      description: 'Divider component documentation',
    },
  },
  {
    path: 'charts/sparkline',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/charts/sparkline/sparkline-demo.component'
      ).then((m) => m.SparklineDemoComponent),
    data: {
      title: 'Sparkline Chart',
      description: 'Sparkline chart component',
    },
  },
  {
    path: 'charts/circular-progress',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/charts/circular-progress/circular-progress-demo.component'
      ).then((m) => m.CircularProgressDemoComponent),
    data: {
      title: 'Circular Progress',
      description: 'Circular progress component',
    },
  },
  {
    path: 'charts/segmented-progress',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/charts/segmented-progress/segmented-progress-demo.component'
      ).then((m) => m.SegmentedProgressDemoComponent),
    data: {
      title: 'Segmented Progress',
      description: 'Segmented progress component',
    },
  },
  {
    path: 'forms/date-picker',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/forms/date-picker/date-picker-doc.component'
      ).then((m) => m.DatePickerDocComponent),
    data: {
      title: 'Date Picker',
      description: 'Date picker component',
    },
  },
  {
    path: 'forms/file-upload',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/forms/file-upload/file-upload-doc.component'
      ).then((m) => m.FileUploadDocComponent),
    data: {
      title: 'File Upload',
      description: 'File upload component',
    },
  },
  {
    path: 'forms/popup-edit',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/forms/popup-edit/popup-edit-doc.component'
      ).then((m) => m.PopupEditDocComponent),
    data: {
      title: 'Popup Edit',
      description: 'Popup edit component',
    },
  },
  {
    path: 'forms/knob',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/forms/knob/knob-doc.component'
      ).then((m) => m.KnobDocComponent),
    data: {
      title: 'Knob Component',
      description: 'Knob form component',
    },
  },
  {
    path: 'forms/time-slots',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/forms/time-slots/time-slots-doc.component'
      ).then((m) => m.TimeSlotsDocComponent),
    data: {
      title: 'Time Slots',
      description: 'Time slots component',
    },
  },
  {
    path: 'forms/scheduler',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/forms/scheduler/scheduler-doc.component'
      ).then((m) => m.SchedulerDocComponent),
    data: {
      title: 'Scheduler',
      description: 'Scheduler component',
    },
  },
  {
    path: 'forms/input-otp',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/forms/input-otp/input-otp-doc.component'
      ).then((m) => m.InputOtpDocComponent),
    data: {
      title: 'Input OTP',
      description: 'One-time password input component',
    },
  },
  {
    path: 'feedback/alert',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/feedback/alert/alert-doc.component'
      ).then((m) => m.AlertDocComponent),
    data: {
      title: 'Alert Component',
      description: 'Alert component documentation',
    },
  },
  {
    path: 'feedback/inner-loading',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/feedback/inner-loading/inner-loading-doc.component'
      ).then((m) => m.InnerLoadingDocComponent),
    data: {
      title: 'Inner Loading',
      description: 'Inner loading component',
    },
  },
  {
    path: 'feedback/loading-bar',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/feedback/loading-bar/loading-bar-doc.component'
      ).then((m) => m.LoadingBarDocComponent),
    data: {
      title: 'Loading Bar',
      description: 'Loading bar component',
    },
  },
  {
    path: 'feedback/dialogs',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/feedback/dialogs/dialogs-doc.component'
      ).then((m) => m.DialogsDocComponent),
    data: {
      title: 'Dialogs',
      description: 'Dialog components',
    },
  },
  {
    path: 'feedback/toast',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/feedback/toast/toast-doc.component'
      ).then((m) => m.ToastDocComponent),
    data: {
      title: 'Toast',
      description: 'Toast notification component',
    },
  },
  {
    path: 'feedback/skeleton',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/feedback/skeleton/skeleton-doc.component'
      ).then((m) => m.SkeletonDocComponent),
    data: {
      title: 'Skeleton',
      description: 'Skeleton loading component',
    },
  },
  {
    path: 'feedback/empty-state',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/feedback/empty-state/empty-state-doc.component'
      ).then((m) => m.EmptyStateDocComponent),
    data: {
      title: 'Empty State',
      description: 'Empty state component',
    },
  },
  {
    path: 'feedback/error-state',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/feedback/error-state/error-state-doc.component'
      ).then((m) => m.ErrorStateDocComponent),
    data: {
      title: 'Error State',
      description: 'Error state component',
    },
  },
  {
    path: 'feedback/splash-screen',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/feedback/splash-screen/splash-screen-doc.component'
      ).then((m) => m.SplashScreenDocComponent),
    data: {
      title: 'Splash Screen',
      description: 'Splash screen component',
    },
  },
  {
    path: 'navigation/breadcrumb',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/navigation/breadcrumb/breadcrumb-doc.component'
      ).then((m) => m.BreadcrumbDocComponent),
    data: {
      title: 'Breadcrumb',
      description: 'Breadcrumb navigation component',
    },
  },
  {
    path: 'navigation/stepper',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/navigation/stepper/stepper-doc.component'
      ).then((m) => m.StepperDocComponent),
    data: {
      title: 'Stepper',
      description: 'Stepper component',
    },
  },
  {
    path: 'navigation/launcher',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/navigation/launcher/launcher-doc.component'
      ).then((m) => m.LauncherDocComponent),
    data: {
      title: 'Launcher',
      description: 'App launcher component',
    },
  },
  {
    path: 'navigation/navigation-menu',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/navigation/navigation-menu/navigation-menu-doc.component'
      ).then((m) => m.NavigationMenuDocComponent),
    data: {
      title: 'Navigation Menu',
      description: 'Navigation menu component',
    },
  },
  {
    path: 'navigation/navbar',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/navigation/navbar/navbar-doc.component'
      ).then((m) => m.NavbarDocComponent),
    data: {
      title: 'Navbar',
      description: 'Enterprise navigation bar component',
    },
  },
  {
    path: 'layout/drawer',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/layout/drawer/drawer-doc.component'
      ).then((m) => m.DrawerDocComponent),
    data: {
      title: 'Drawer',
      description: 'Drawer layout component',
    },
  },
  {
    path: 'layout/splitter',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/layout/splitter/splitter-doc.component'
      ).then((m) => m.SplitterDocComponent),
    data: {
      title: 'Splitter',
      description: 'Splitter layout component',
    },
  },
  {
    path: 'layout/enterprise',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/layout/enterprise/enterprise-layout-doc.component'
      ).then((m) => m.EnterpriseLayoutDocComponent),
    data: {
      title: 'Enterprise Layout',
      description: 'Enterprise layout component',
    },
  },
  {
    path: 'layout/compact',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/layout/compact/compact-layout-doc.component'
      ).then((m) => m.CompactLayoutDocComponent),
    data: {
      title: 'Compact Layout',
      description: 'Compact layout component',
    },
  },
  {
    path: 'layout/empty',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/layout/empty/empty-layout-doc.component'
      ).then((m) => m.EmptyLayoutDocComponent),
    data: {
      title: 'Empty Layout',
      description: 'Empty layout component',
    },
  },
  {
    path: 'utilities/theme-switcher',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/utilities/theme-switcher/theme-switcher-doc.component'
      ).then((m) => m.ThemeSwitcherDocComponent),
    data: {
      title: 'Theme Switcher',
      description: 'Theme switcher utility',
    },
  },
  {
    path: 'utilities/layout-switcher',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/utilities/layout-switcher/layout-switcher-doc.component'
      ).then((m) => m.LayoutSwitcherDocComponent),
    data: {
      title: 'Layout Switcher',
      description: 'Layout switcher utility',
    },
  },
  {
    path: 'utilities/theme-builder',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/utilities/theme-builder/theme-builder-doc.component'
      ).then((m) => m.ThemeBuilderDocComponent),
    data: {
      title: 'Theme Builder Doc',
      description: 'Theme builder utility documentation',
    },
  },
  {
    path: 'dashboard/widget-framework',
    loadComponent: () =>
      import(
        '../../pages/docs/components/aegisx/dashboard/widget-framework/widget-framework-doc.component'
      ).then((m) => m.WidgetFrameworkDocComponent),
    data: {
      title: 'Widget Framework',
      description: 'Widget framework documentation',
    },
  },
];
