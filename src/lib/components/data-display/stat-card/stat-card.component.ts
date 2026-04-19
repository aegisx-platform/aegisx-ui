import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  StatCardBreakdownItem,
  StatCardColor,
  StatCardStatus,
  StatCardValueColor,
  StatCardVariant,
} from './stat-card.types';

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

  /**
   * Whether the **value text** follows the semantic `color` prop or stays
   * neutral. Default `'neutral'` — value reads as data, not warning.
   * Set `'accent'` for urgent/emphasis cards where the number itself
   * must scream the status.
   *
   * Breaking change: this default flipped from accent → neutral to match
   * the Untitled UI / enterprise-SaaS look. Opt back in with `"accent"`.
   */
  @Input() valueColor: StatCardValueColor = 'neutral';

  /**
   * Whether the **icon badge** follows the semantic `color` prop or stays
   * neutral. Default `'accent'` keeps the small colored icon as a scan
   * hint (info = blue, warning = amber, etc.) — the only accent left when
   * `valueColor` is neutral, so the card still has identity.
   */
  @Input() iconColor: StatCardValueColor = 'accent';

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

  // ─── Variant-specific inputs ──────────────────────────────────────────

  /**
   * Array of numeric data points for the `trend` variant's sparkline.
   * Normalised to fit a 100×30 SVG viewport internally.
   */
  @Input() trendData?: readonly number[];

  /** Target value for the `comparison` variant's actual-vs-target bar. */
  @Input() target?: number;

  /** Human label for the target (e.g., '฿5M'). Defaults to the raw number. */
  @Input() targetLabel?: string;

  /** Breakdown items rendered as chips in the `breakdown` variant. */
  @Input() breakdown?: readonly StatCardBreakdownItem[];

  /** Data points for the `bars` variant's mini bar chart (one bar each). */
  @Input() barData?: readonly number[];

  /** Optional labels under each bar (e.g., ['M','T','W','T','F','S','S']). */
  @Input() barLabels?: readonly string[];

  /** Status level for the `status` variant's live indicator dot. */
  @Input() status?: StatCardStatus;

  /** Freshness text for the `status` variant (e.g., 'อัพเดท 2 นาทีที่แล้ว'). */
  @Input() lastUpdated?: string;

  /** Human label shown below value in the `ring` variant (e.g., '฿3.2M / ฿5M'). */
  @Input() progressLabel?: string;

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

  // ─── Sparkline (trend variant) ────────────────────────────────────────

  /**
   * SVG polyline points for the sparkline, normalised into a 100×30
   * viewport with 2px vertical padding so the stroke doesn't clip.
   */
  get sparklinePoints(): string {
    const data = this.trendData;
    if (!data || data.length === 0) return '';
    if (data.length === 1) return `0,15 100,15`;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const step = 100 / (data.length - 1);
    return data
      .map((v, i) => {
        const x = i * step;
        const y = 28 - ((v - min) / range) * 26;
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(' ');
  }

  /** Closed-polygon version of the sparkline for the area fill. */
  get sparklineAreaPoints(): string {
    const line = this.sparklinePoints;
    if (!line) return '';
    return `0,30 ${line} 100,30`;
  }

  // ─── Ring variant ──────────────────────────────────────────────────────

  /** SVG circumference for a 36px-radius circle (2πr). */
  readonly ringCircumference = 2 * Math.PI * 36;

  /** Stroke-dashoffset for the ring's progress arc. */
  get ringDashOffset(): number {
    return this.ringCircumference * (1 - this.clampedProgress / 100);
  }

  // ─── Comparison variant ───────────────────────────────────────────────

  /** Percent of target reached (clamped 0-100) for the comparison bar. */
  get comparisonPercent(): number {
    if (!this.target || this.target <= 0) return 0;
    const raw = Number(this.value);
    if (isNaN(raw)) return 0;
    return Math.max(0, Math.min(100, (raw / this.target) * 100));
  }

  /** Rounded integer version for the "{N}% of target" caption. */
  get comparisonPercentRounded(): number {
    return Math.round(this.comparisonPercent);
  }

  // ─── Bars variant ──────────────────────────────────────────────────────

  /** Height percentage (0-100) for each bar in the bars variant. */
  get barHeights(): readonly number[] {
    const data = this.barData;
    if (!data || data.length === 0) return [];
    const max = Math.max(...data, 1);
    return data.map((v) => Math.max(2, (v / max) * 100));
  }
}
