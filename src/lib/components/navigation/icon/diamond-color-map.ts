// Diamond shape color mapping — used with <ax-diamond-icon>

export interface DiamondColors {
  dark: { bg: string; border: string; stroke: string };
  light: { bg: string; border: string; stroke: string };
}

export const DIAMOND_COLOR_MAP: Record<string, DiamondColors> = {
  // Platform
  platform: {
    dark: { bg: '#1e3a5f', border: '#3b82f6', stroke: '#93c5fd' },
    light: { bg: '#eff6ff', border: '#bfdbfe', stroke: '#2563eb' },
  },
  users: {
    dark: { bg: '#1e3a5f', border: '#3b82f6', stroke: '#93c5fd' },
    light: { bg: '#eff6ff', border: '#bfdbfe', stroke: '#2563eb' },
  },
  rbac: {
    dark: { bg: '#581c87', border: '#a855f7', stroke: '#d8b4fe' },
    light: { bg: '#faf5ff', border: '#e9d5ff', stroke: '#7c3aed' },
  },
  settings: {
    dark: { bg: '#334155', border: '#64748b', stroke: '#cbd5e1' },
    light: { bg: '#f8fafc', border: '#e2e8f0', stroke: '#475569' },
  },
  'multi-site': {
    dark: { bg: '#134e4a', border: '#14b8a6', stroke: '#5eead4' },
    light: { bg: '#f0fdfa', border: '#99f6e4', stroke: '#0d9488' },
  },
  'audit-log': {
    dark: { bg: '#713f12', border: '#f59e0b', stroke: '#fcd34d' },
    light: { bg: '#fefce8', border: '#fde68a', stroke: '#a16207' },
  },
  'api-integration': {
    dark: { bg: '#312e81', border: '#6366f1', stroke: '#c7d2fe' },
    light: { bg: '#eef2ff', border: '#c7d2fe', stroke: '#4f46e5' },
  },
  'dashboard-bi': {
    dark: { bg: '#312e81', border: '#6366f1', stroke: '#c7d2fe' },
    light: { bg: '#eef2ff', border: '#c7d2fe', stroke: '#4f46e5' },
  },

  // Clinical
  registration: {
    dark: { bg: '#1e3a5f', border: '#3b82f6', stroke: '#93c5fd' },
    light: { bg: '#eff6ff', border: '#bfdbfe', stroke: '#2563eb' },
  },
  opd: {
    dark: { bg: '#059669', border: '#34d399', stroke: '#a7f3d0' },
    light: { bg: '#ecfdf5', border: '#a7f3d0', stroke: '#059669' },
  },
  ipd: {
    dark: { bg: '#312e81', border: '#6366f1', stroke: '#c7d2fe' },
    light: { bg: '#eef2ff', border: '#c7d2fe', stroke: '#4f46e5' },
  },
  er: {
    dark: { bg: '#991b1b', border: '#ef4444', stroke: '#fca5a5' },
    light: { bg: '#fef2f2', border: '#fecaca', stroke: '#dc2626' },
  },
  'or-surgery': {
    dark: { bg: '#7f1d1d', border: '#ef4444', stroke: '#fca5a5' },
    light: { bg: '#fef2f2', border: '#fecaca', stroke: '#991b1b' },
  },
  pharmacy: {
    dark: { bg: '#4338ca', border: '#6366f1', stroke: '#c7d2fe' },
    light: { bg: '#eef2ff', border: '#c7d2fe', stroke: '#4338ca' },
  },
  laboratory: {
    dark: { bg: '#155e75', border: '#06b6d4', stroke: '#67e8f9' },
    light: { bg: '#ecfeff', border: '#a5f3fc', stroke: '#0891b2' },
  },
  radiology: {
    dark: { bg: '#334155', border: '#64748b', stroke: '#cbd5e1' },
    light: { bg: '#f8fafc', border: '#e2e8f0', stroke: '#475569' },
  },
  dental: {
    dark: { bg: '#075985', border: '#0ea5e9', stroke: '#7dd3fc' },
    light: { bg: '#f0f9ff', border: '#bae6fd', stroke: '#0284c7' },
  },
  nursing: {
    dark: { bg: '#831843', border: '#ec4899', stroke: '#f9a8d4' },
    light: { bg: '#fdf2f8', border: '#fbcfe8', stroke: '#db2777' },
  },
  rehab: {
    dark: { bg: '#134e4a', border: '#14b8a6', stroke: '#5eead4' },
    light: { bg: '#f0fdfa', border: '#99f6e4', stroke: '#0d9488' },
  },
  'blood-bank': {
    dark: { bg: '#7f1d1d', border: '#ef4444', stroke: '#fca5a5' },
    light: { bg: '#fef2f2', border: '#fecaca', stroke: '#dc2626' },
  },
  nutrition: {
    dark: { bg: '#7c2d12', border: '#f97316', stroke: '#fdba74' },
    light: { bg: '#fff7ed', border: '#fed7aa', stroke: '#ea580c' },
  },
  'med-records': {
    dark: { bg: '#581c87', border: '#a855f7', stroke: '#d8b4fe' },
    light: { bg: '#faf5ff', border: '#e9d5ff', stroke: '#7c3aed' },
  },
  appointment: {
    dark: { bg: '#166534', border: '#22c55e', stroke: '#86efac' },
    light: { bg: '#f0fdf4', border: '#bbf7d0', stroke: '#16a34a' },
  },
  queue: {
    dark: { bg: '#1e3a5f', border: '#3b82f6', stroke: '#93c5fd' },
    light: { bg: '#eff6ff', border: '#bfdbfe', stroke: '#2563eb' },
  },
  referral: {
    dark: { bg: '#312e81', border: '#6366f1', stroke: '#c7d2fe' },
    light: { bg: '#eef2ff', border: '#c7d2fe', stroke: '#4f46e5' },
  },
  telehealth: {
    dark: { bg: '#155e75', border: '#06b6d4', stroke: '#67e8f9' },
    light: { bg: '#ecfeff', border: '#a5f3fc', stroke: '#0891b2' },
  },
  discharge: {
    dark: { bg: '#059669', border: '#34d399', stroke: '#a7f3d0' },
    light: { bg: '#ecfdf5', border: '#a7f3d0', stroke: '#059669' },
  },
  checkup: {
    dark: { bg: '#166534', border: '#22c55e', stroke: '#86efac' },
    light: { bg: '#f0fdf4', border: '#bbf7d0', stroke: '#16a34a' },
  },
  icu: {
    dark: { bg: '#991b1b', border: '#ef4444', stroke: '#fca5a5' },
    light: { bg: '#fef2f2', border: '#fecaca', stroke: '#dc2626' },
  },
  hemodialysis: {
    dark: { bg: '#1e3a5f', border: '#3b82f6', stroke: '#93c5fd' },
    light: { bg: '#eff6ff', border: '#bfdbfe', stroke: '#2563eb' },
  },
  'thai-med': {
    dark: { bg: '#065f46', border: '#10b981', stroke: '#6ee7b7' },
    light: { bg: '#ecfdf5', border: '#a7f3d0', stroke: '#059669' },
  },
  'special-clinic': {
    dark: { bg: '#4338ca', border: '#6366f1', stroke: '#c7d2fe' },
    light: { bg: '#eef2ff', border: '#c7d2fe', stroke: '#4f46e5' },
  },
  'home-health': {
    dark: { bg: '#134e4a', border: '#14b8a6', stroke: '#5eead4' },
    light: { bg: '#f0fdfa', border: '#99f6e4', stroke: '#0d9488' },
  },
  pathology: {
    dark: { bg: '#581c87', border: '#a855f7', stroke: '#d8b4fe' },
    light: { bg: '#faf5ff', border: '#e9d5ff', stroke: '#7c3aed' },
  },
  'occupational-health': {
    dark: { bg: '#7c2d12', border: '#f97316', stroke: '#fdba74' },
    light: { bg: '#fff7ed', border: '#fed7aa', stroke: '#ea580c' },
  },
  maternal: {
    dark: { bg: '#831843', border: '#ec4899', stroke: '#f9a8d4' },
    light: { bg: '#fdf2f8', border: '#fbcfe8', stroke: '#db2777' },
  },
  'social-work': {
    dark: { bg: '#831843', border: '#ec4899', stroke: '#f9a8d4' },
    light: { bg: '#fdf2f8', border: '#fbcfe8', stroke: '#db2777' },
  },
  forensic: {
    dark: { bg: '#334155', border: '#64748b', stroke: '#cbd5e1' },
    light: { bg: '#f8fafc', border: '#e2e8f0', stroke: '#475569' },
  },

  // Inventory
  'inv-budget': {
    dark: { bg: '#065f46', border: '#10b981', stroke: '#6ee7b7' },
    light: { bg: '#ecfdf5', border: '#a7f3d0', stroke: '#059669' },
  },
  'inv-procurement': {
    dark: { bg: '#1e3a5f', border: '#3b82f6', stroke: '#93c5fd' },
    light: { bg: '#eff6ff', border: '#bfdbfe', stroke: '#2563eb' },
  },
  'inv-warehouse': {
    dark: { bg: '#4338ca', border: '#6366f1', stroke: '#c7d2fe' },
    light: { bg: '#eef2ff', border: '#c7d2fe', stroke: '#4f46e5' },
  },
  'inv-substore': {
    dark: { bg: '#7c2d12', border: '#f97316', stroke: '#fdba74' },
    light: { bg: '#fff7ed', border: '#fed7aa', stroke: '#ea580c' },
  },

  // Finance
  billing: {
    dark: { bg: '#92400e', border: '#f59e0b', stroke: '#fcd34d' },
    light: { bg: '#fffbeb', border: '#fde68a', stroke: '#b45309' },
  },
  accounting: {
    dark: { bg: '#713f12', border: '#f59e0b', stroke: '#fcd34d' },
    light: { bg: '#fefce8', border: '#fde68a', stroke: '#a16207' },
  },
  finance: {
    dark: { bg: '#854d0e', border: '#f59e0b', stroke: '#fcd34d' },
    light: { bg: '#fffbeb', border: '#fde68a', stroke: '#b45309' },
  },
  nhso: {
    dark: { bg: '#065f46', border: '#10b981', stroke: '#6ee7b7' },
    light: { bg: '#ecfdf5', border: '#a7f3d0', stroke: '#059669' },
  },
  'social-security': {
    dark: { bg: '#1e3a5f', border: '#3b82f6', stroke: '#93c5fd' },
    light: { bg: '#eff6ff', border: '#bfdbfe', stroke: '#2563eb' },
  },
  cgd: {
    dark: { bg: '#1e3a5f', border: '#3b82f6', stroke: '#93c5fd' },
    light: { bg: '#eff6ff', border: '#bfdbfe', stroke: '#1e3a5f' },
  },
  insurance: {
    dark: { bg: '#1e3a5f', border: '#3b82f6', stroke: '#93c5fd' },
    light: { bg: '#eff6ff', border: '#bfdbfe', stroke: '#2563eb' },
  },
  'cost-center': {
    dark: { bg: '#92400e', border: '#f59e0b', stroke: '#fcd34d' },
    light: { bg: '#fffbeb', border: '#fde68a', stroke: '#b45309' },
  },
  revenue: {
    dark: { bg: '#713f12', border: '#f59e0b', stroke: '#fcd34d' },
    light: { bg: '#fefce8', border: '#fde68a', stroke: '#a16207' },
  },

  // Back Office
  hr: {
    dark: { bg: '#134e4a', border: '#14b8a6', stroke: '#5eead4' },
    light: { bg: '#f0fdfa', border: '#99f6e4', stroke: '#0d9488' },
  },
  'duty-schedule': {
    dark: { bg: '#134e4a', border: '#14b8a6', stroke: '#5eead4' },
    light: { bg: '#f0fdfa', border: '#99f6e4', stroke: '#0d9488' },
  },
  leave: {
    dark: { bg: '#134e4a', border: '#14b8a6', stroke: '#5eead4' },
    light: { bg: '#f0fdfa', border: '#99f6e4', stroke: '#0d9488' },
  },
  'ot-manage': {
    dark: { bg: '#134e4a', border: '#14b8a6', stroke: '#5eead4' },
    light: { bg: '#f0fdfa', border: '#99f6e4', stroke: '#0d9488' },
  },
  'general-supply': {
    dark: { bg: '#1e3a5f', border: '#3b82f6', stroke: '#93c5fd' },
    light: { bg: '#eff6ff', border: '#bfdbfe', stroke: '#2563eb' },
  },
  maintenance: {
    dark: { bg: '#334155', border: '#64748b', stroke: '#cbd5e1' },
    light: { bg: '#f8fafc', border: '#e2e8f0', stroke: '#475569' },
  },
  vehicle: {
    dark: { bg: '#334155', border: '#64748b', stroke: '#cbd5e1' },
    light: { bg: '#f8fafc', border: '#e2e8f0', stroke: '#475569' },
  },
  'meeting-room': {
    dark: { bg: '#312e81', border: '#6366f1', stroke: '#c7d2fe' },
    light: { bg: '#eef2ff', border: '#c7d2fe', stroke: '#4f46e5' },
  },
  document: {
    dark: { bg: '#581c87', border: '#a855f7', stroke: '#d8b4fe' },
    light: { bg: '#faf5ff', border: '#e9d5ff', stroke: '#7c3aed' },
  },
  laundry: {
    dark: { bg: '#1e3a5f', border: '#3b82f6', stroke: '#93c5fd' },
    light: { bg: '#eff6ff', border: '#bfdbfe', stroke: '#2563eb' },
  },
  cssd: {
    dark: { bg: '#155e75', border: '#06b6d4', stroke: '#67e8f9' },
    light: { bg: '#ecfeff', border: '#a5f3fc', stroke: '#0891b2' },
  },
  security: {
    dark: { bg: '#334155', border: '#64748b', stroke: '#cbd5e1' },
    light: { bg: '#f8fafc', border: '#e2e8f0', stroke: '#475569' },
  },
  facilities: {
    dark: { bg: '#334155', border: '#64748b', stroke: '#cbd5e1' },
    light: { bg: '#f8fafc', border: '#e2e8f0', stroke: '#475569' },
  },
  waste: {
    dark: { bg: '#065f46', border: '#10b981', stroke: '#6ee7b7' },
    light: { bg: '#ecfdf5', border: '#a7f3d0', stroke: '#059669' },
  },
  training: {
    dark: { bg: '#4338ca', border: '#6366f1', stroke: '#c7d2fe' },
    light: { bg: '#eef2ff', border: '#c7d2fe', stroke: '#4f46e5' },
  },
  cafeteria: {
    dark: { bg: '#7c2d12', border: '#f97316', stroke: '#fdba74' },
    light: { bg: '#fff7ed', border: '#fed7aa', stroke: '#ea580c' },
  },
  'staff-housing': {
    dark: { bg: '#1e3a5f', border: '#3b82f6', stroke: '#93c5fd' },
    light: { bg: '#eff6ff', border: '#bfdbfe', stroke: '#2563eb' },
  },
  complaint: {
    dark: { bg: '#92400e', border: '#f59e0b', stroke: '#fcd34d' },
    light: { bg: '#fffbeb', border: '#fde68a', stroke: '#d97706' },
  },

  // Quality
  'risk-mgmt': {
    dark: { bg: '#991b1b', border: '#ef4444', stroke: '#fca5a5' },
    light: { bg: '#fef2f2', border: '#fecaca', stroke: '#dc2626' },
  },
  'infection-ctrl': {
    dark: { bg: '#991b1b', border: '#ef4444', stroke: '#fca5a5' },
    light: { bg: '#fef2f2', border: '#fecaca', stroke: '#dc2626' },
  },
  'quality-ha': {
    dark: { bg: '#065f46', border: '#10b981', stroke: '#6ee7b7' },
    light: { bg: '#ecfdf5', border: '#a7f3d0', stroke: '#059669' },
  },
  'internal-audit': {
    dark: { bg: '#713f12', border: '#f59e0b', stroke: '#fcd34d' },
    light: { bg: '#fefce8', border: '#fde68a', stroke: '#a16207' },
  },
} as const;

export type DiamondIconName = keyof typeof DIAMOND_COLOR_MAP;

/**
 * Get diamond colors for icon name and theme
 *
 * @example
 * ```typescript
 * const colors = getDiamondColors('er', 'dark');
 * // { bg: '#991b1b', border: '#ef4444', stroke: '#fca5a5' }
 * ```
 */
export function getDiamondColors(
  icon: string,
  theme: 'dark' | 'light',
): { bg: string; border: string; stroke: string } {
  return (
    DIAMOND_COLOR_MAP[icon]?.[theme] ?? DIAMOND_COLOR_MAP['platform'][theme]
  );
}
