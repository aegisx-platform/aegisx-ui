/**
 * Status Badge Component Type Definitions
 *
 * Semantic status badge that maps business statuses to visual styles.
 * Unlike ax-badge (generic), ax-status-badge is purpose-built for
 * entity status display with automatic color/icon/label mapping.
 */

/** Predefined status variants with automatic styling */
export type StatusBadgeStatus =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'draft'
  | 'approved'
  | 'rejected'
  | 'expired'
  | 'suspended';

/** Badge display size */
export type StatusBadgeSize = 'sm' | 'md' | 'lg';

/** Display variant */
export type StatusBadgeVariant = 'dot' | 'outlined' | 'soft';

/** Status configuration for rendering */
export interface StatusConfig {
  label: string;
  color: 'success' | 'error' | 'warning' | 'info' | 'neutral';
  icon?: string;
}

/** Default status-to-config mapping */
export const STATUS_CONFIG_MAP: Record<StatusBadgeStatus, StatusConfig> = {
  active:    { label: 'ใช้งาน',    color: 'success', icon: 'check_circle' },
  inactive:  { label: 'ยกเลิก',    color: 'error',   icon: 'cancel' },
  pending:   { label: 'รอดำเนินการ', color: 'warning', icon: 'schedule' },
  draft:     { label: 'แบบร่าง',   color: 'neutral',  icon: 'edit_note' },
  approved:  { label: 'อนุมัติ',    color: 'success', icon: 'verified' },
  rejected:  { label: 'ไม่อนุมัติ',  color: 'error',   icon: 'block' },
  expired:   { label: 'หมดอายุ',   color: 'error',   icon: 'event_busy' },
  suspended: { label: 'ระงับ',     color: 'warning', icon: 'pause_circle' },
};
