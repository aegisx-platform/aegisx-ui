/** Pastel color theme for app cards */
export type AppCardColor =
  | 'pink' // #fdf2f8 / pink-50
  | 'peach' // #fff7ed / orange-50
  | 'mint' // #f0fdf4 / green-50
  | 'blue' // #eff6ff / blue-50
  | 'yellow' // #fefce8 / yellow-50
  | 'lavender' // #faf5ff / purple-50
  | 'cyan' // #ecfeff / cyan-50
  | 'neutral'; // #fafafa / zinc-50

/** Status badge for app card */
export type AppStatus = 'active' | 'beta' | 'new' | 'maintenance';

/** Menu action */
export interface AppMenuAction {
  id: string;
  label: string;
  icon: string;
  disabled?: boolean;
}

/** App data model */
export interface AppInfo {
  id: string;
  name: string;
  description?: string;
  icon: string; // Material icon name
  route: string; // Router path to navigate
  color: AppCardColor; // Pastel background color
  status?: AppStatus; // Optional status badge
  notificationCount?: number; // Badge count (0 = hidden)
  lastEdited?: string; // "Last edit by Mark at 7:40 PM"
  menuActions?: AppMenuAction[];
}
