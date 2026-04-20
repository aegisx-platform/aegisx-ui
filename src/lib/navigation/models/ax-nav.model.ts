/** 4 layout modes */
export type NavMode = 'rail' | 'expanded' | 'dock' | 'topnav';

/** Interaction type for a navigation module */
export type NavModuleType = 'route' | 'action' | 'external' | 'divider';

/** App group = Level 1 navigation (e.g. Clinical, Inventory, Finance) */
export interface AppGroup {
  id: string;
  label: string;
  labelTh: string;
  icon: string;
  color: string;
  route: string;
  permission: string;
  modules: NavModule[];
  iconStyle?: 'mono' | 'diamond';
}

/** Module = Level 2 navigation (inside an app group) */
export interface NavModule {
  id: string;
  icon: string;
  label: string;
  labelEn?: string;
  route?: string;
  type?: NavModuleType;
  action?: string;
  externalUrl?: string;
  permission?: string;
  badge?: number;
  children?: NavChild[];
  iconStyle?: 'mono' | 'diamond';
}

/** Sub-route = Level 3 (for expanded panel detail) */
export interface NavChild {
  id: string;
  label: string;
  route: string;
  icon?: string;
  badge?: number;
}

/** Hospital site (multi-tenant) */
export interface Hospital {
  id: string;
  label: string;
  code: string;
  shortName: string;
}

/** Notification item */
export interface NavNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  timestamp: Date;
  unread: boolean;
  type: 'approval' | 'alert' | 'info' | 'system';
  route?: string;
  appId?: string;
}

/** Current user context */
export interface NavUser {
  id: string;
  name: string;
  shortName: string;
  initials: string;
  role: string;
  avatarUrl?: string;
  online: boolean;
}

/** Command palette search result */
export interface CommandItem {
  id: string;
  type: 'module' | 'patient' | 'action' | 'recent';
  label: string;
  labelEn?: string;
  icon: string;
  route: string;
  groupLabel: string;
  groupColor: string;
  keywords: string[];
}

/** Layout config for config popover */
export interface LayoutOption {
  id: NavMode;
  label: string;
  icon?: string;
  description: string;
}

/** Nav accent preset — background color for the sidebar/topbar */
export interface NavAccent {
  id: string;
  label: string;
  bg: string;
  text: string;
  iconDefault: string;
  iconHover: string;
  iconActive: string;
  btnHover: string;
  btnActive: string;
  divider: string;
}

/** Built-in nav accent presets */
export const NAV_ACCENTS: readonly NavAccent[] = [
  {
    id: 'slate',
    label: 'Slate',
    bg: '#0f172a',
    text: '#fff',
    iconDefault: '#94a3b8',
    iconHover: '#cbd5e1',
    iconActive: '#3b82f6',
    btnHover: 'rgba(148,163,184,0.12)',
    btnActive: 'rgba(59,130,246,0.2)',
    divider: 'rgba(148,163,184,0.15)',
  },
  {
    id: 'zinc',
    label: 'Zinc',
    bg: '#18181b',
    text: '#fff',
    iconDefault: '#a1a1aa',
    iconHover: '#d4d4d8',
    iconActive: '#818cf8',
    btnHover: 'rgba(161,161,170,0.12)',
    btnActive: 'rgba(129,140,248,0.2)',
    divider: 'rgba(161,161,170,0.12)',
  },
  {
    id: 'indigo',
    label: 'Indigo',
    bg: '#312e81',
    text: '#fff',
    iconDefault: '#a5b4fc',
    iconHover: '#c7d2fe',
    iconActive: '#fff',
    btnHover: 'rgba(165,180,252,0.15)',
    btnActive: 'rgba(255,255,255,0.18)',
    divider: 'rgba(165,180,252,0.15)',
  },
  {
    id: 'blue',
    label: 'Blue',
    bg: '#1e3a5f',
    text: '#fff',
    iconDefault: '#93c5fd',
    iconHover: '#bfdbfe',
    iconActive: '#fff',
    btnHover: 'rgba(147,197,253,0.15)',
    btnActive: 'rgba(255,255,255,0.18)',
    divider: 'rgba(147,197,253,0.12)',
  },
  {
    id: 'emerald',
    label: 'Emerald',
    bg: '#064e3b',
    text: '#fff',
    iconDefault: '#6ee7b7',
    iconHover: '#a7f3d0',
    iconActive: '#fff',
    btnHover: 'rgba(110,231,183,0.15)',
    btnActive: 'rgba(255,255,255,0.18)',
    divider: 'rgba(110,231,183,0.12)',
  },
  {
    id: 'rose',
    label: 'Rose',
    bg: '#4c0519',
    text: '#fff',
    iconDefault: '#fda4af',
    iconHover: '#fecdd3',
    iconActive: '#fff',
    btnHover: 'rgba(253,164,175,0.15)',
    btnActive: 'rgba(255,255,255,0.18)',
    divider: 'rgba(253,164,175,0.12)',
  },
  {
    id: 'white',
    label: 'White',
    bg: '#ffffff',
    text: '#0f172a',
    iconDefault: '#64748b',
    iconHover: '#334155',
    iconActive: '#3b82f6',
    btnHover: 'rgba(0,0,0,0.04)',
    btnActive: 'rgba(59,130,246,0.1)',
    divider: 'rgba(0,0,0,0.08)',
  },
  {
    id: 'stone',
    label: 'Stone',
    bg: '#f5f5f4',
    text: '#1c1917',
    iconDefault: '#78716c',
    iconHover: '#44403c',
    iconActive: '#3b82f6',
    btnHover: 'rgba(0,0,0,0.04)',
    btnActive: 'rgba(59,130,246,0.1)',
    divider: 'rgba(0,0,0,0.06)',
  },
] as const;

/** All layout options */
export const LAYOUT_OPTIONS: readonly LayoutOption[] = [
  {
    id: 'rail',
    label: 'Rail',
    icon: 'view_sidebar',
    description: 'Icon sidebar',
  },
  {
    id: 'expanded',
    label: 'Expanded',
    icon: 'view_quilt',
    description: 'Sidebar + panel',
  },
  {
    id: 'dock',
    label: 'Dock',
    icon: 'dock_to_left',
    description: 'Floating sidebar',
  },
  {
    id: 'topnav',
    label: 'Top Nav',
    icon: 'web',
    description: 'Horizontal bar',
  },
] as const;
