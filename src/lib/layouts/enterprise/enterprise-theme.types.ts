/**
 * Enterprise Layout Theme System
 *
 * Provides app-specific theming for Enterprise Layout.
 * Supports both preset themes and custom overrides.
 *
 * @example
 * ```typescript
 * // Using preset theme
 * <ax-enterprise-layout [appTheme]="'medical'" />
 *
 * // Using preset with override
 * <ax-enterprise-layout
 *   [appTheme]="'medical'"
 *   [themeOverrides]="{ headerBg: '#custom' }"
 * />
 *
 * // Fully custom theme
 * <ax-enterprise-layout [appTheme]="customTheme" />
 * ```
 */

/**
 * Theme configuration for Enterprise Layout
 */
export interface EnterpriseAppTheme {
  /** Theme identifier */
  id: string;

  /** Display name */
  name: string;

  /** Primary brand color */
  primary: string;

  /** Primary color variants for light/dark contrast */
  primaryLight?: string;
  primaryDark?: string;

  /** Accent color for highlights */
  accent?: string;

  /** Header background color */
  headerBg: string;

  /** Header text color */
  headerText: string;

  /** Header text color on hover */
  headerTextHover?: string;

  /** Active nav item background */
  headerActiveBg?: string;

  /** Sub-navigation background */
  subnavBg?: string;

  /** Tab underline color */
  tabIndicator?: string;

  /** Logo placeholder background */
  logoPlaceholderBg?: string;

  /** Logo placeholder icon color */
  logoPlaceholderColor?: string;

  /** Badge colors */
  badgePrimary?: string;
  badgeAccent?: string;

  /** Sidebar background (if used) */
  sidebarBg?: string;

  /** Footer background */
  footerBg?: string;

  /** Content area background */
  contentBg?: string;
}

/**
 * Partial theme for overrides
 */
export type EnterpriseAppThemeOverride = Partial<
  Omit<EnterpriseAppTheme, 'id' | 'name'>
>;

/**
 * Preset theme names
 */
export type EnterprisePresetTheme =
  | 'default'
  | 'medical'
  | 'finance'
  | 'inventory'
  | 'hr'
  | 'education'
  | 'retail'
  | 'manufacturing'
  | 'logistics';

/**
 * Input type for appTheme - accepts preset name or custom theme object
 */
export type EnterpriseAppThemeInput =
  | EnterprisePresetTheme
  | EnterpriseAppTheme;

/**
 * Preset themes collection
 */
export const ENTERPRISE_PRESET_THEMES: Record<
  EnterprisePresetTheme,
  EnterpriseAppTheme
> = {
  default: {
    id: 'default',
    name: 'Default',
    primary: '#6366f1',
    primaryLight: '#818cf8',
    primaryDark: '#4f46e5',
    accent: '#14b8a6',
    headerBg: '#0f172a',
    headerText: 'rgba(255, 255, 255, 0.8)',
    headerTextHover: '#ffffff',
    headerActiveBg: 'rgba(99, 102, 241, 0.2)',
    subnavBg: '#0f172a',
    tabIndicator: '#6366f1',
    logoPlaceholderBg: '#6366f1',
    logoPlaceholderColor: '#ffffff',
    badgePrimary: '#6366f1',
    badgeAccent: '#14b8a6',
  },

  medical: {
    id: 'medical',
    name: 'Medical / Healthcare',
    primary: '#0891b2',
    primaryLight: '#22d3ee',
    primaryDark: '#0e7490',
    accent: '#10b981',
    headerBg: '#164e63',
    headerText: 'rgba(255, 255, 255, 0.85)',
    headerTextHover: '#ffffff',
    headerActiveBg: 'rgba(8, 145, 178, 0.3)',
    subnavBg: '#155e75',
    tabIndicator: '#22d3ee',
    logoPlaceholderBg: '#0891b2',
    logoPlaceholderColor: '#ffffff',
    badgePrimary: '#0891b2',
    badgeAccent: '#10b981',
  },

  finance: {
    id: 'finance',
    name: 'Finance / Banking',
    primary: '#0d9488',
    primaryLight: '#2dd4bf',
    primaryDark: '#0f766e',
    accent: '#f59e0b',
    headerBg: '#134e4a',
    headerText: 'rgba(255, 255, 255, 0.85)',
    headerTextHover: '#ffffff',
    headerActiveBg: 'rgba(13, 148, 136, 0.3)',
    subnavBg: '#115e59',
    tabIndicator: '#2dd4bf',
    logoPlaceholderBg: '#0d9488',
    logoPlaceholderColor: '#ffffff',
    badgePrimary: '#0d9488',
    badgeAccent: '#f59e0b',
  },

  inventory: {
    id: 'inventory',
    name: 'Inventory / Warehouse',
    primary: '#7c3aed',
    primaryLight: '#a78bfa',
    primaryDark: '#6d28d9',
    accent: '#f97316',
    headerBg: '#3b0764',
    headerText: 'rgba(255, 255, 255, 0.85)',
    headerTextHover: '#ffffff',
    headerActiveBg: 'rgba(124, 58, 237, 0.3)',
    subnavBg: '#4c1d95',
    tabIndicator: '#a78bfa',
    logoPlaceholderBg: '#7c3aed',
    logoPlaceholderColor: '#ffffff',
    badgePrimary: '#7c3aed',
    badgeAccent: '#f97316',
  },

  hr: {
    id: 'hr',
    name: 'HR / Human Resources',
    primary: '#ec4899',
    primaryLight: '#f472b6',
    primaryDark: '#db2777',
    accent: '#8b5cf6',
    headerBg: '#831843',
    headerText: 'rgba(255, 255, 255, 0.85)',
    headerTextHover: '#ffffff',
    headerActiveBg: 'rgba(236, 72, 153, 0.3)',
    subnavBg: '#9d174d',
    tabIndicator: '#f472b6',
    logoPlaceholderBg: '#ec4899',
    logoPlaceholderColor: '#ffffff',
    badgePrimary: '#ec4899',
    badgeAccent: '#8b5cf6',
  },

  education: {
    id: 'education',
    name: 'Education / LMS',
    primary: '#3b82f6',
    primaryLight: '#60a5fa',
    primaryDark: '#2563eb',
    accent: '#10b981',
    headerBg: '#1e3a8a',
    headerText: 'rgba(255, 255, 255, 0.85)',
    headerTextHover: '#ffffff',
    headerActiveBg: 'rgba(59, 130, 246, 0.3)',
    subnavBg: '#1e40af',
    tabIndicator: '#60a5fa',
    logoPlaceholderBg: '#3b82f6',
    logoPlaceholderColor: '#ffffff',
    badgePrimary: '#3b82f6',
    badgeAccent: '#10b981',
  },

  retail: {
    id: 'retail',
    name: 'Retail / POS',
    primary: '#f97316',
    primaryLight: '#fb923c',
    primaryDark: '#ea580c',
    accent: '#84cc16',
    headerBg: '#7c2d12',
    headerText: 'rgba(255, 255, 255, 0.85)',
    headerTextHover: '#ffffff',
    headerActiveBg: 'rgba(249, 115, 22, 0.3)',
    subnavBg: '#9a3412',
    tabIndicator: '#fb923c',
    logoPlaceholderBg: '#f97316',
    logoPlaceholderColor: '#ffffff',
    badgePrimary: '#f97316',
    badgeAccent: '#84cc16',
  },

  manufacturing: {
    id: 'manufacturing',
    name: 'Manufacturing / MES',
    primary: '#64748b',
    primaryLight: '#94a3b8',
    primaryDark: '#475569',
    accent: '#eab308',
    headerBg: '#1e293b',
    headerText: 'rgba(255, 255, 255, 0.85)',
    headerTextHover: '#ffffff',
    headerActiveBg: 'rgba(100, 116, 139, 0.3)',
    subnavBg: '#334155',
    tabIndicator: '#94a3b8',
    logoPlaceholderBg: '#64748b',
    logoPlaceholderColor: '#ffffff',
    badgePrimary: '#64748b',
    badgeAccent: '#eab308',
  },

  logistics: {
    id: 'logistics',
    name: 'Logistics / TMS',
    primary: '#059669',
    primaryLight: '#34d399',
    primaryDark: '#047857',
    accent: '#0ea5e9',
    headerBg: '#064e3b',
    headerText: 'rgba(255, 255, 255, 0.85)',
    headerTextHover: '#ffffff',
    headerActiveBg: 'rgba(5, 150, 105, 0.3)',
    subnavBg: '#065f46',
    tabIndicator: '#34d399',
    logoPlaceholderBg: '#059669',
    logoPlaceholderColor: '#ffffff',
    badgePrimary: '#059669',
    badgeAccent: '#0ea5e9',
  },
};

/**
 * Resolve theme from preset name or custom object
 */
export function resolveEnterpriseTheme(
  input: EnterpriseAppThemeInput | undefined,
  overrides?: EnterpriseAppThemeOverride,
): EnterpriseAppTheme {
  // Get base theme
  let theme: EnterpriseAppTheme;

  if (!input) {
    theme = { ...ENTERPRISE_PRESET_THEMES.default };
  } else if (typeof input === 'string') {
    theme = ENTERPRISE_PRESET_THEMES[input]
      ? { ...ENTERPRISE_PRESET_THEMES[input] }
      : { ...ENTERPRISE_PRESET_THEMES.default };
  } else {
    theme = { ...input };
  }

  // Apply overrides
  if (overrides) {
    return { ...theme, ...overrides };
  }

  return theme;
}

/**
 * Generate CSS custom properties from theme
 */
export function generateThemeCSSVariables(
  theme: EnterpriseAppTheme,
): Record<string, string> {
  return {
    '--ax-enterprise-primary': theme.primary,
    '--ax-enterprise-primary-light': theme.primaryLight || theme.primary,
    '--ax-enterprise-primary-dark': theme.primaryDark || theme.primary,
    '--ax-enterprise-accent': theme.accent || theme.primary,
    '--ax-enterprise-header-bg': theme.headerBg,
    '--ax-enterprise-header-text': theme.headerText,
    '--ax-enterprise-header-text-hover': theme.headerTextHover || '#ffffff',
    '--ax-enterprise-header-active-bg':
      theme.headerActiveBg || `${theme.primary}33`,
    '--ax-enterprise-subnav-bg': theme.subnavBg || theme.headerBg,
    '--ax-enterprise-tab-indicator': theme.tabIndicator || theme.primary,
    '--ax-enterprise-logo-bg': theme.logoPlaceholderBg || theme.primary,
    '--ax-enterprise-logo-color': theme.logoPlaceholderColor || '#ffffff',
    '--ax-enterprise-badge-primary': theme.badgePrimary || theme.primary,
    '--ax-enterprise-badge-accent':
      theme.badgeAccent || theme.accent || theme.primary,
  };
}
