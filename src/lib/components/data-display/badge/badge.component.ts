import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  BadgeVariant,
  BadgeType,
  BadgeSize,
  BadgeRounded,
  BadgeIconPosition,
} from './badge.types';

/**
 * Badge Component — Untitled UI style
 *
 * @example
 * // Pill badge with dot
 * <ax-badge variant="soft" color="success" [dot]="true" rounded="full">Active</ax-badge>
 *
 * @example
 * // Icon trailing
 * <ax-badge icon="arrow_forward" iconPosition="trailing">Next</ax-badge>
 *
 * @example
 * // Icon only
 * <ax-badge icon="check" [iconOnly]="true" color="success" rounded="full"></ax-badge>
 *
 * @example
 * // Brand color
 * <ax-badge color="brand" variant="soft" rounded="full">New feature</ax-badge>
 */
@Component({
  selector: 'ax-badge',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
})
export class AxBadgeComponent {
  /** Badge variant style */
  @Input() variant: BadgeVariant = 'soft';

  /**
   * @deprecated Use `color` instead.
   */
  @Input() type: BadgeType = 'neutral';

  /** Badge semantic color */
  @Input() set color(value: BadgeType) {
    this.type = value;
  }

  /** Badge size */
  @Input() size: BadgeSize = 'md';

  /** Border radius */
  @Input() rounded: BadgeRounded = 'full';

  /** Material icon name */
  @Input() icon?: string;

  /** Icon position — leading (default) or trailing */
  @Input() iconPosition: BadgeIconPosition = 'leading';

  /** Icon-only mode — hides label content */
  @Input() iconOnly: boolean = false;

  /** Show colored dot indicator */
  @Input() dot: boolean = false;

  /** Show colored square indicator */
  @Input() square: boolean = false;

  /** Show remove/close button */
  @Input() removable: boolean = false;

  /** Counter value */
  @Input() counter?: number;

  /** Custom hex color override */
  @Input() customColor?: string;

  /** Emitted when remove button is clicked */
  @Output() remove = new EventEmitter<void>();

  private isHexColor(value: string): boolean {
    return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(value);
  }

  get customStyles(): Record<string, string> | null {
    if (!this.customColor?.trim()) return null;
    if (!this.isHexColor(this.customColor)) {
      return { color: this.customColor, 'background-color': 'transparent', 'border-color': this.customColor };
    }
    return { color: this.customColor, 'background-color': `${this.customColor}14`, 'border-color': `${this.customColor}30` };
  }

  get badgeClasses(): string {
    const classes = ['badge'];
    classes.push(`badge-${this.variant}`);
    classes.push(`badge-${this.type}`);
    classes.push(`badge-${this.size}`);
    classes.push(`badge-rounded-${this.rounded}`);
    if (this.icon) classes.push('badge-icon');
    if (this.iconOnly) classes.push('badge-icon-only');
    if (this.dot) classes.push('badge-dot');
    if (this.square) classes.push('badge-square');
    if (this.removable) classes.push('badge-removable');
    if (this.counter !== undefined) classes.push('badge-counter');
    return classes.join(' ');
  }

  onRemoveClick(event: Event): void {
    event.stopPropagation();
    this.remove.emit();
  }
}
