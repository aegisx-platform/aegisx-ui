// Layout Components (Modern, Clean)
export { EmptyLayoutComponent as AxEmptyLayoutComponent } from './empty/empty-layout.component';
export { EnterpriseLayoutComponent as AxEnterpriseLayoutComponent } from './enterprise/enterprise-layout.component';
export { AxSidebarLayoutComponent } from './sidebar/sidebar-layout.component';

// Docs Layout (Shadcn/ui style)
export * from './docs';

// Direct exports for backward compatibility
export * from './empty/empty-layout.component';
export { EnterpriseLayoutComponent } from './enterprise/enterprise-layout.component';
export * from './sidebar';
export * from './dashboard-panel';
export { AxDashboardPanelComponent } from './dashboard-panel/ax-dashboard-panel.component';

// Enterprise Layout Theme Types
export type {
  EnterpriseAppTheme,
  EnterpriseAppThemeInput,
  EnterpriseAppThemeOverride,
  EnterprisePresetTheme,
} from './enterprise/enterprise-theme.types';
export {
  ENTERPRISE_PRESET_THEMES,
  resolveEnterpriseTheme,
  generateThemeCSSVariables,
} from './enterprise/enterprise-theme.types';

// Re-export navigation types from central location
export type {
  AxNavigationItem,
  AxNavigation,
} from '../types/ax-navigation.types';
