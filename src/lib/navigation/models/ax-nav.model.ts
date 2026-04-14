/** 4 layout modes */
export type NavMode = 'rail' | 'expanded' | 'dock' | 'topnav';

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
  route: string;
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

/** All layout options */
export const LAYOUT_OPTIONS: readonly LayoutOption[] = [
  { id: 'rail', label: 'Rail', icon: 'view_sidebar', description: 'Icon sidebar' },
  { id: 'expanded', label: 'Expanded', icon: 'view_quilt', description: 'Sidebar + panel' },
  { id: 'dock', label: 'Dock', icon: 'dock_to_left', description: 'Floating sidebar' },
  { id: 'topnav', label: 'Top Nav', icon: 'web', description: 'Horizontal bar' },
] as const;
