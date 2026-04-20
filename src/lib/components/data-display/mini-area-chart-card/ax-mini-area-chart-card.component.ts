import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  signal,
} from '@angular/core';
import { AxCardComponent } from '../card/card.component';
import { AxBadgeComponent } from '../badge/badge.component';
import type { BadgeType } from '../badge/badge.types';

export interface MiniAreaDelta {
  readonly label: string;
  readonly direction: 'up' | 'down' | 'flat';
}

/**
 * <ax-mini-area-chart-card>
 *
 * White card with a hero number + optional delta chip + inline SVG
 * area chart (polyline + gradient fill + end-circle marker). Wraps
 * <ax-card> for chrome and uses <ax-badge> for the delta chip, so
 * radius / shadow / pill styling all inherit the @aegisx/ui design
 * system.
 */
@Component({
  selector: 'ax-mini-area-chart-card',
  standalone: true,
  imports: [AxCardComponent, AxBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ax-card [flat]="flat" class="ax-mini-area-chart-card">
      <header class="ax-mini-area-chart-card__header">
        <h3 class="ax-mini-area-chart-card__title">{{ title }}</h3>
      </header>

      <div class="ax-mini-area-chart-card__top">
        <span class="ax-mini-area-chart-card__value">{{ value }}</span>
        @if (delta) {
          <ax-badge
            [color]="deltaBadgeColor()"
            variant="soft"
            rounded="full"
            size="sm"
            [icon]="directionIcon()"
            iconPosition="leading"
            >{{ delta.label }}</ax-badge
          >
        }
      </div>

      @if (dataSignal().length > 0) {
        <div class="ax-mini-area-chart-card__chart">
          <svg
            viewBox="0 0 400 110"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                [attr.id]="gradientId()"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stop-color="var(--ax-dashboard-accent, #3b82f6)"
                  stop-opacity="0.25"
                />
                <stop
                  offset="100%"
                  stop-color="var(--ax-dashboard-accent, #3b82f6)"
                  stop-opacity="0"
                />
              </linearGradient>
            </defs>
            <path
              [attr.d]="areaPath()"
              [attr.fill]="'url(#' + gradientId() + ')'"
            />
            <path
              [attr.d]="linePath()"
              fill="none"
              stroke="var(--ax-dashboard-accent, #3b82f6)"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            @if (endPoint(); as end) {
              <circle
                [attr.cx]="end.x"
                [attr.cy]="end.y"
                r="4"
                fill="#fff"
                stroke="var(--ax-dashboard-accent, #3b82f6)"
                stroke-width="2"
              />
            }
          </svg>
        </div>

        <footer class="ax-mini-area-chart-card__x-labels">
          @for (x of xLabels; track x) {
            <span>{{ x }}</span>
          }
        </footer>
      }
    </ax-card>
  `,
  styles: [
    `
      :host {
        display: block;
        min-width: 0;
      }

      .ax-mini-area-chart-card ::ng-deep .ax-card-body {
        padding: 20px 22px;
      }

      .ax-mini-area-chart-card__header {
        margin-bottom: 8px;
      }

      .ax-mini-area-chart-card__title {
        font-size: 13px;
        font-weight: 500;
        color: var(--ax-text-secondary, #6b7280);
        margin: 0;
      }

      .ax-mini-area-chart-card__top {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 16px;
      }

      .ax-mini-area-chart-card__value {
        font-size: 28px;
        font-weight: 600;
        color: var(--ax-text-heading, #111827);
        letter-spacing: -0.5px;
        line-height: 1;
      }

      .ax-mini-area-chart-card__chart {
        height: 110px;
        position: relative;
        margin: 0 -10px;

        svg {
          width: 100%;
          height: 100%;
          display: block;
        }
      }

      .ax-mini-area-chart-card__x-labels {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        color: var(--ax-text-muted, #9ca3af);
        margin-top: 8px;
        padding: 0 4px;
      }
    `,
  ],
})
export class AxMiniAreaChartCardComponent {
  @Input() title = '';
  @Input() value: string | number = '';
  @Input() delta?: MiniAreaDelta;
  @Input() set data(value: readonly number[]) {
    this._dataSignal.set(value);
  }
  get data(): readonly number[] {
    return this._dataSignal();
  }
  @Input() xLabels: readonly string[] = [];
  /** Passthrough to inner <ax-card>. */
  @Input() flat = false;

  private readonly _dataSignal = signal<readonly number[]>([]);
  /** Read-only projection of the data signal for any consumer that needs it. */
  readonly dataSignal = this._dataSignal.asReadonly();
  private static counter = 0;
  private readonly instanceId = ++AxMiniAreaChartCardComponent.counter;

  readonly gradientId = () => `ax-mini-area-grad-${this.instanceId}`;

  readonly linePath = computed(() => {
    const data = this.dataSignal();
    if (data.length === 0) return '';
    const points = this.pointsFor(data);
    if (points.length === 1) {
      return `M 0 ${points[0][1]} L 400 ${points[0][1]}`;
    }
    return (
      `M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)} ` +
      points
        .slice(1)
        .map(([x, y]) => `L ${x.toFixed(2)} ${y.toFixed(2)}`)
        .join(' ')
    );
  });

  readonly areaPath = computed(() => {
    const line = this.linePath();
    if (!line) return '';
    return `${line} L 400 110 L 0 110 Z`;
  });

  readonly endPoint = computed(() => {
    const data = this.dataSignal();
    if (data.length === 0) return null;
    const points = this.pointsFor(data);
    const last = points[points.length - 1];
    return { x: last[0], y: last[1] };
  });

  directionIcon(): string {
    switch (this.delta?.direction) {
      case 'down':
        return 'trending_down';
      case 'flat':
        return 'trending_flat';
      case 'up':
      default:
        return 'trending_up';
    }
  }

  /** Picks a semantic <ax-badge> color based on delta direction. */
  deltaBadgeColor(): BadgeType {
    switch (this.delta?.direction) {
      case 'down':
        return 'error';
      case 'flat':
        return 'neutral';
      case 'up':
      default:
        return 'success';
    }
  }

  private pointsFor(data: readonly number[]): Array<[number, number]> {
    const width = 400;
    const height = 90;
    const top = 10;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const step = width / Math.max(1, data.length - 1);
    return data.map((v, i) => [
      i * step,
      top + height - ((v - min) / range) * height,
    ]);
  }
}
