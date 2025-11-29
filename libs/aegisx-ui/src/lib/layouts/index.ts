// Layout Components (Modern, Clean)
export { AxCompactLayoutComponent } from './ax-compact/ax-compact-layout.component';
export { EmptyLayoutComponent as AxEmptyLayoutComponent } from './empty/empty-layout.component';
export { EnterpriseLayoutComponent as AxEnterpriseLayoutComponent } from './enterprise/enterprise-layout.component';

// Docs Layout (Shadcn/ui style)
export * from './docs';

// Direct exports for backward compatibility
export * from './ax-compact/ax-compact-layout.component';
export * from './empty/empty-layout.component';
export { EnterpriseLayoutComponent } from './enterprise/enterprise-layout.component';

// Re-export navigation types from central location
export type {
  AxNavigationItem,
  AxNavigation,
} from '../types/ax-navigation.types';
