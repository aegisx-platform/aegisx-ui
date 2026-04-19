import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { StatCardColor, StatCardVariant } from './stat-card.types';

/**
 * Stat Card Component
 *
 * A compact card for displaying a single statistic with an icon,
 * designed for list page headers with clickable filter functionality.
 *
 * @example
 * // Basic stat card
 * <ax-stat-card
 *   icon="medication"
 *   color="info"
 *   [value]="1250"
 *   label="ทั้งหมด"
 *   subtitle="1,250 รายการ">
 * </ax-stat-card>
 *
 * @example
 * // Clickable filter card
 * <ax-stat-card
 *   icon="check_circle"
 *   color="success"
 *   [value]="980"
 *   label="ใช้งาน"
 *   subtitle="78%"
 *   [active]="activeFilter() === 'active'"
 *   (clicked)="onFilter('active')">
 * </ax-stat-card>
 *
 * @example
 * // Display-only (non-clickable)
 * <ax-stat-card
 *   icon="inventory"
 *   color="info"
 *   [value]="23450"
 *   label="คงคลัง"
 *   subtitle="TAB (47%)"
 *   [clickable]="false">
 * </ax-stat-card>
 */
@Component({
  selector: 'ax-stat-card',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AxStatCardComponent {
  /** Material icon name */
  @Input() icon = '';

  /** Semantic color — controls icon bg and active border */
  @Input() color: StatCardColor = 'info';

  /** Layout variant — `compact` (default) or `icon-leading` (big icon on left) */
  @Input() variant: StatCardVariant = 'compact';

  /**
   * Stat value (number or formatted string).
   *
   * Accepts `null` so callers can pipe through Angular's `number` /
   * `currency` / `percent` pipes which all return `string | null`.
   * Renders as empty string when null / undefined.
   */
  @Input() value: string | number | null | undefined = '';

  /** Card label */
  @Input() label = '';

  /** Optional subtitle */
  @Input() subtitle = '';

  /** Whether the card is in active/selected state */
  @Input() active = false;

  /** Whether the card is clickable (default true) */
  @Input() clickable = true;

  /**
   * Progress value from 0 to 100. When set, a thin horizontal progress bar
   * renders at the bottom of the card. Leave undefined to hide.
   *
   * Common use: budget utilisation, stock levels against max, quota
   * consumption, contract expiry countdown, etc.
   */
  @Input() progress?: number;

  /**
   * Progress bar color. Defaults to the card's `color` prop. Useful when
   * the card is `info` but the progress should go red past 80%.
   */
  @Input() progressColor?: StatCardColor;

  /** Emitted when card is clicked */
  @Output() clicked = new EventEmitter<void>();

  onClick(): void {
    if (this.clickable) {
      this.clicked.emit();
    }
  }

  /** Resolve the effective progress color, falling back to `color`. */
  get effectiveProgressColor(): StatCardColor {
    return this.progressColor ?? this.color;
  }

  /** Clamp progress into [0, 100]. */
  get clampedProgress(): number {
    if (this.progress == null || isNaN(this.progress)) return 0;
    return Math.max(0, Math.min(100, this.progress));
  }

  /** True when the progress bar should render. */
  get showProgress(): boolean {
    return this.progress != null && !isNaN(this.progress);
  }
}
