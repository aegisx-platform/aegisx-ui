import type { AvatarColor } from '../avatar/avatar.types';

/** Semantic tone for the row status pill — maps to <ax-badge> color. */
export type ActivityListStatusTone =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';

export interface ActivityListItem {
  readonly id: string;
  readonly avatar: {
    /** Full name; <ax-avatar> auto-derives initials from it. */
    readonly name: string;
    /** Optional tint — passed to <ax-avatar [color]>. */
    readonly color?: AvatarColor;
  };
  readonly primary: string;
  readonly secondary?: string;
  readonly amount?: string;
  readonly status?: {
    readonly label: string;
    readonly tone: ActivityListStatusTone;
  };
  readonly date?: string;
}

export interface ActivityListColumns {
  amount?: boolean;
  status?: boolean;
  date?: boolean;
  menu?: boolean;
}
