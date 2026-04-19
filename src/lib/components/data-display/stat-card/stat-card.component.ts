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
  StatCardCategory,
  StatCardColor,
  StatCardDonutSegment,
  StatCardGridCell,
  StatCardMetric,
  StatCardPeriod,
  StatCardRankItem,
  StatCardSegment,
  StatCardStatus,
  StatCardStep,
  StatCardThreshold,
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

  /** Segments for the `stacked-bar` variant. */
  @Input() segments?: readonly StatCardSegment[];

  /** Metrics rows for the `dual-metric` variant (typically 2 entries). */
  @Input() metrics?: readonly StatCardMetric[];

  /** Meta info shown top-right in `billboard` variant (e.g., 'All · 30 days'). */
  @Input() meta?: string;

  /** Period boxes for the `compare-period` variant (current first, baseline second). */
  @Input() periods?: readonly StatCardPeriod[];

  /** Min value of the `threshold` variant's scale. */
  @Input() min?: number;

  /** Max value of the `threshold` variant's scale. */
  @Input() max?: number;

  /** Threshold markers between min/max for the `threshold` variant. */
  @Input() thresholds?: readonly StatCardThreshold[];

  /** Pipeline steps for the `progress-steps` variant. */
  @Input() steps?: readonly StatCardStep[];

  /**
   * 2D matrix of numeric intensities for the `heatmap` variant. Each row
   * = one horizontal band, each cell = one day/slot. Values are
   * normalised to the max cell so cell opacity reads 0..1.
   */
  @Input() heatmapData?: readonly (readonly number[])[];

  /** Column labels under the heatmap (e.g., ['Mon','Tue',…,'Sun']). */
  @Input() heatmapColLabels?: readonly string[];

  /** Row labels on the left of the heatmap (e.g., week numbers). */
  @Input() heatmapRowLabels?: readonly string[];

  /** 2x2 grid of mini-metrics for the `metric-grid` variant. */
  @Input() cells?: readonly StatCardGridCell[];

  /** Ranked rows for the `ranking` variant. */
  @Input() ranking?: readonly StatCardRankItem[];

  /** Projected-state value for the `journey` variant's right side. */
  @Input() projectedValue?: string | number;

  /** Projected-state label for the `journey` variant. */
  @Input() projectedLabel?: string;

  /** Projected-state tag text (e.g., 'Excellent', 'Optimal'). */
  @Input() projectedSubtitle?: string;

  /** Arc segments for `donut-legend` (360°) and `gauge-split` (180°). */
  @Input() donutSegments?: readonly StatCardDonutSegment[];

  /** Center total shown inside the donut / gauge (e.g., '2,257'). */
  @Input() centerValue?: string | number;

  /** Small center label above the total (e.g., 'Summarize'). */
  @Input() centerLabel?: string;

  /** Browseable categories for the `category-browser` variant. */
  @Input() categories?: readonly StatCardCategory[];

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

  // ─── Gauge variant (semi-circle arc) ──────────────────────────────────

  /**
   * Circumference of the gauge arc (half of the 2πr circle — the bottom
   * half is invisible). Used to scale stroke-dasharray so dashoffset
   * reads as a clean 0-100% progress.
   */
  readonly gaugeCircumference = Math.PI * 36;

  /** Stroke-dashoffset for the gauge's progress arc. */
  get gaugeDashOffset(): number {
    return this.gaugeCircumference * (1 - this.clampedProgress / 100);
  }

  // ─── Stacked-bar variant ─────────────────────────────────────────────

  /** Total of all segment values — used for percentage math. */
  get segmentTotal(): number {
    if (!this.segments) return 0;
    return this.segments.reduce((sum, s) => sum + s.value, 0);
  }

  /**
   * Segments enriched with a precomputed `percent` so the template can
   * bind `[style.width.%]="seg.percent"` without inlining math.
   */
  get segmentViews(): ReadonlyArray<StatCardSegment & { percent: number }> {
    const total = this.segmentTotal;
    if (!this.segments || total <= 0) return [];
    return this.segments.map((s) => ({
      ...s,
      percent: (s.value / total) * 100,
    }));
  }

  // ─── Dual-metric variant ─────────────────────────────────────────────

  /**
   * Metrics with a percent-of-total share, used to size the split-bar
   * segments at the top of the card.
   */
  get metricViews(): ReadonlyArray<StatCardMetric & { percent: number }> {
    if (!this.metrics) return [];
    const nums = this.metrics.map((m) => Number(m.value));
    const total = nums.reduce((sum, v) => sum + (isNaN(v) ? 0 : v), 0);
    if (total <= 0) {
      const share = 100 / this.metrics.length;
      return this.metrics.map((m) => ({ ...m, percent: share }));
    }
    return this.metrics.map((m) => {
      const n = Number(m.value);
      return {
        ...m,
        percent: isNaN(n) ? 0 : (n / total) * 100,
      };
    });
  }

  // ─── Threshold variant ────────────────────────────────────────────────

  /**
   * Percent position (0-100) for the value marker on the threshold scale.
   * Falls back to 50% when min/max aren't provided.
   */
  get thresholdValuePercent(): number {
    const min = this.min ?? 0;
    const max = this.max ?? 100;
    if (max <= min) return 50;
    const v = Number(this.value);
    if (isNaN(v)) return 0;
    return Math.max(0, Math.min(100, ((v - min) / (max - min)) * 100));
  }

  /** Enriched thresholds with percent positions for marker placement. */
  get thresholdViews(): ReadonlyArray<
    StatCardThreshold & { percent: number }
  > {
    if (!this.thresholds) return [];
    const min = this.min ?? 0;
    const max = this.max ?? 100;
    if (max <= min) {
      return this.thresholds.map((t) => ({ ...t, percent: 50 }));
    }
    return this.thresholds.map((t) => ({
      ...t,
      percent: Math.max(0, Math.min(100, ((t.value - min) / (max - min)) * 100)),
    }));
  }

  // ─── Heatmap variant ─────────────────────────────────────────────────

  /** Max value across the heatmap, used to normalise cell opacity. */
  get heatmapMax(): number {
    if (!this.heatmapData) return 0;
    let max = 0;
    for (const row of this.heatmapData) {
      for (const v of row) {
        if (v > max) max = v;
      }
    }
    return max;
  }

  /**
   * Flattened heatmap cells with normalised opacity (0.08 – 1.0 so very
   * low values still show a hint of color against the card bg).
   */
  get heatmapCells(): readonly {
    value: number;
    opacity: number;
    row: number;
    col: number;
  }[] {
    if (!this.heatmapData) return [];
    const max = this.heatmapMax || 1;
    const cells: {
      value: number;
      opacity: number;
      row: number;
      col: number;
    }[] = [];
    for (let r = 0; r < this.heatmapData.length; r++) {
      const row = this.heatmapData[r];
      for (let c = 0; c < row.length; c++) {
        const v = row[c];
        cells.push({
          value: v,
          opacity: v === 0 ? 0.06 : 0.15 + (v / max) * 0.85,
          row: r,
          col: c,
        });
      }
    }
    return cells;
  }

  /** Number of columns in the heatmap grid (for CSS grid-template-columns). */
  get heatmapCols(): number {
    return this.heatmapData?.[0]?.length ?? 0;
  }

  // ─── Donut / Gauge-split variants ─────────────────────────────────────

  /**
   * Enriched donut segments with precomputed stroke-dasharray and
   * stroke-dashoffset so the template can bind them directly onto
   * <circle> / <path> elements without inlining any math.
   */
  get donutSegmentViews(): ReadonlyArray<
    StatCardDonutSegment & {
      dashArray: string;
      dashOffset: number;
      /** Cumulative percent before this segment (for ordering). */
      cumulative: number;
    }
  > {
    if (!this.donutSegments || this.donutSegments.length === 0) return [];
    // Full circle circumference at r=36
    const C = 2 * Math.PI * 36;
    let cumulative = 0;
    return this.donutSegments.map((s) => {
      const arc = (s.percent / 100) * C;
      const view = {
        ...s,
        cumulative,
        dashArray: `${arc.toFixed(2)} ${(C - arc).toFixed(2)}`,
        // offset = -(sum of previous arcs) so each segment starts right
        // after the previous one. Stroke starts at 3 o'clock so we also
        // rotate -90° in the template to start at 12.
        dashOffset: -((cumulative / 100) * C),
      };
      cumulative += s.percent;
      return view;
    });
  }

  /** Same idea but for the half-circumference arc path used by gauge-split. */
  get gaugeSplitSegmentViews(): ReadonlyArray<
    StatCardDonutSegment & {
      dashArray: string;
      dashOffset: number;
      cumulative: number;
    }
  > {
    if (!this.donutSegments || this.donutSegments.length === 0) return [];
    // Half-circle length (what the path "M 4 44 A 36 36 0 0 1 76 44"
    // draws) ≈ π·36.
    const C = Math.PI * 36;
    let cumulative = 0;
    return this.donutSegments.map((s) => {
      const arc = (s.percent / 100) * C;
      const view = {
        ...s,
        cumulative,
        dashArray: `${arc.toFixed(2)} ${(C - arc).toFixed(2)}`,
        dashOffset: -((cumulative / 100) * C),
      };
      cumulative += s.percent;
      return view;
    });
  }

  // ─── Category-browser variant ────────────────────────────────────────

  private _currentCategoryIndex = 0;

  /** Currently-visible category entry. */
  get currentCategory(): StatCardCategory | undefined {
    return this.categories?.[this._currentCategoryIndex];
  }

  /** Zero-based index of the current category (for the demo / consumers). */
  get currentCategoryIndex(): number {
    return this._currentCategoryIndex;
  }

  /**
   * Bar heights normalised from the CURRENT category's barData — distinct
   * from the general `barHeights` getter which reads from the `barData`
   * input.
   */
  get currentCategoryBarHeights(): readonly number[] {
    const data = this.currentCategory?.barData;
    if (!data || data.length === 0) return [];
    const max = Math.max(...data, 1);
    return data.map((v) => Math.max(2, (v / max) * 100));
  }

  /** Cycle to previous category (wraps around). */
  onPrevCategory(event: Event): void {
    event.stopPropagation();
    if (!this.categories || this.categories.length === 0) return;
    this._currentCategoryIndex =
      (this._currentCategoryIndex - 1 + this.categories.length) %
      this.categories.length;
  }

  /** Cycle to next category (wraps around). */
  onNextCategory(event: Event): void {
    event.stopPropagation();
    if (!this.categories || this.categories.length === 0) return;
    this._currentCategoryIndex =
      (this._currentCategoryIndex + 1) % this.categories.length;
  }
}
