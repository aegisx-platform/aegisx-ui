import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export interface HeroMetricStat {
  readonly label: string;
  readonly value: string;
}

/**
 * <ax-hero-metric-card>
 *
 * Blue-gradient hero card with a primary metric, optional pill, CTA,
 * right-aligned secondary stats, and an optional wave chart at the
 * bottom. Designed for inside <ax-dashboard-panel> but works anywhere.
 *
 * Content is entirely driven by @Input() — no baked-in wording.
 */
@Component({
  selector: 'ax-hero-metric-card',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="ax-hero-metric-card">
      <div class="ax-hero-metric-card__glow" aria-hidden="true"></div>
      <div class="ax-hero-metric-card__top">
        <div class="ax-hero-metric-card__primary">
          <span class="ax-hero-metric-card__label">{{ label }}</span>
          <div class="ax-hero-metric-card__value-row">
            <span class="ax-hero-metric-card__dot" aria-hidden="true"></span>
            <span class="ax-hero-metric-card__value">{{ value }}</span>
            @if (pill) {
              <span class="ax-hero-metric-card__pill">{{ pill }}</span>
            }
          </div>
        </div>

        @if (ctaLabel) {
          <button
            type="button"
            class="ax-hero-metric-card__cta"
            (click)="ctaClick.emit()"
          >
            <span>{{ ctaLabel }}</span>
            <mat-icon>chevron_right</mat-icon>
          </button>
        }
      </div>

      @if (stats?.length) {
        <div class="ax-hero-metric-card__stats">
          @for (s of stats; track s.label) {
            <div class="ax-hero-metric-card__stat">
              <span class="ax-hero-metric-card__stat-label">{{ s.label }}</span>
              <span class="ax-hero-metric-card__stat-value">{{ s.value }}</span>
            </div>
          }
        </div>
      }

      @if (waveData?.length) {
        <div class="ax-hero-metric-card__wave">
          @if (waveLabel) {
            <span class="ax-hero-metric-card__wave-label">{{ waveLabel }}</span>
          }
          <svg
            class="ax-hero-metric-card__wave-svg"
            viewBox="0 0 400 120"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="axHeroWaveFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="rgba(255,255,255,0.35)" />
                <stop offset="100%" stop-color="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
            <path
              [attr.d]="waveFillPath"
              fill="url(#axHeroWaveFill)"
              stroke="none"
            />
            <path
              [attr.d]="waveFaintPath"
              fill="none"
              stroke="rgba(255,255,255,0.35)"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <path
              [attr.d]="waveSolidPath"
              fill="none"
              stroke="rgba(255,255,255,0.95)"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </div>
      }
    </article>
  `,
  styles: [
    `
      :host {
        display: block;
        min-width: 0;
      }

      .ax-hero-metric-card {
        position: relative;
        border-radius: var(--ax-dashboard-hero-radius, 18px);
        padding: 22px 24px 0;
        background: var(
          --ax-dashboard-hero-bg,
          linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)
        );
        color: #fff;
        overflow: hidden;
        min-height: 280px;
        display: flex;
        flex-direction: column;
      }

      .ax-hero-metric-card__glow {
        position: absolute;
        inset: 0;
        background: var(
          --ax-dashboard-hero-glow,
          radial-gradient(
            circle at top right,
            rgba(147, 197, 253, 0.15),
            transparent 60%
          )
        );
        pointer-events: none;
      }

      .ax-hero-metric-card__top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
        position: relative;
      }

      .ax-hero-metric-card__label {
        display: block;
        font-size: 12px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.7);
        letter-spacing: 0.02em;
      }

      .ax-hero-metric-card__value-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 6px;
      }

      .ax-hero-metric-card__dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.9);
      }

      .ax-hero-metric-card__value {
        font-size: 40px;
        font-weight: 600;
        letter-spacing: -1px;
        line-height: 1;
      }

      .ax-hero-metric-card__pill {
        padding: 4px 10px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.18);
        font-size: 12px;
        font-weight: 500;
      }

      .ax-hero-metric-card__cta {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 6px 10px;
        border-radius: 12px;
        border: none;
        background: rgba(255, 255, 255, 0.12);
        color: #fff;
        font: inherit;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.15s;

        &:hover {
          background: rgba(255, 255, 255, 0.22);
        }

        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
      }

      .ax-hero-metric-card__stats {
        display: flex;
        gap: 24px;
        justify-content: flex-end;
        margin-top: 12px;
        position: relative;
      }

      .ax-hero-metric-card__stat {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }

      .ax-hero-metric-card__stat-label {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.6);
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }

      .ax-hero-metric-card__stat-value {
        font-size: 16px;
        font-weight: 500;
        margin-top: 2px;
      }

      .ax-hero-metric-card__wave {
        position: relative;
        height: 130px;
        margin-top: auto;
      }

      .ax-hero-metric-card__wave-label {
        position: absolute;
        left: 0;
        top: 8px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.55);
      }

      .ax-hero-metric-card__wave-svg {
        position: absolute;
        left: -24px;
        right: -24px;
        bottom: 0;
        width: calc(100% + 48px);
        height: 100%;
      }

      @media (max-width: 900px) {
        .ax-hero-metric-card__value {
          font-size: 32px;
        }
      }
    `,
  ],
})
export class AxHeroMetricCardComponent {
  @Input() label = '';
  @Input() value: string | number = '';
  @Input() pill?: string;
  @Input() ctaLabel?: string;
  @Input() stats?: readonly HeroMetricStat[];
  @Input() waveData?: readonly number[];
  @Input() waveLabel?: string;

  @Output() ctaClick = new EventEmitter<void>();

  /**
   * Cubic-Bezier wave path for the solid white line. Given a numeric
   * array of length N, plots evenly-spaced points across a 400×120
   * viewBox and smooths via Bezier control points.
   */
  get waveSolidPath(): string {
    return this.buildPath(this.waveData ?? [], 0.55);
  }

  /** Slightly shifted path rendered at low opacity for a parallax feel. */
  get waveFaintPath(): string {
    const data = this.waveData ?? [];
    if (data.length === 0) return '';
    const shifted = data.map((_, i) => data[(i + 2) % data.length]);
    return this.buildPath(shifted, 0.7);
  }

  /** Closed polygon of the solid line down to y=120 for the gradient fill. */
  get waveFillPath(): string {
    const line = this.waveSolidPath;
    if (!line) return '';
    return `${line} L 400 120 L 0 120 Z`;
  }

  private buildPath(data: readonly number[], tension: number): string {
    if (data.length === 0) return '';
    const width = 400;
    const heightBand = 70; // y range within the 120-tall viewBox
    const baselineY = 70; // vertical mid
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const step = width / Math.max(1, data.length - 1);

    const points: Array<[number, number]> = data.map((v, i) => [
      i * step,
      baselineY - ((v - min) / range) * heightBand + heightBand / 2,
    ]);

    if (points.length === 1) {
      const [, y] = points[0];
      return `M 0 ${y} L ${width} ${y}`;
    }

    const parts: string[] = [
      `M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`,
    ];
    for (let i = 0; i < points.length - 1; i++) {
      const [x0, y0] = points[i];
      const [x1, y1] = points[i + 1];
      const cx1 = x0 + (x1 - x0) * tension;
      const cx2 = x1 - (x1 - x0) * tension;
      parts.push(
        `C ${cx1.toFixed(2)} ${y0.toFixed(2)}, ${cx2.toFixed(2)} ${y1.toFixed(2)}, ${x1.toFixed(2)} ${y1.toFixed(2)}`,
      );
    }
    return parts.join(' ');
  }
}
