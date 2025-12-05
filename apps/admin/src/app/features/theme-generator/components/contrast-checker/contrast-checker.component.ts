import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeGeneratorService } from '../../services/theme-generator.service';
import {
  OklchColor,
  ThemeColorSlots,
} from '../../models/theme-generator.types';
import {
  oklchToHex,
  getContrastRatio,
  meetsWcagAA,
  meetsWcagAAA,
} from '../../utils/oklch.utils';

interface ContrastPair {
  name: string;
  bg: keyof ThemeColorSlots;
  fg: keyof ThemeColorSlots;
}

@Component({
  selector: 'app-contrast-checker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="contrast-checker">
      <!-- Header -->
      <div class="checker-header">
        <div class="header-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a10 10 0 0 1 0 20" />
          </svg>
        </div>
        <span class="header-title">Contrast Checker</span>
        <div class="header-line"></div>
      </div>

      <!-- Overall Score -->
      <div
        class="overall-score"
        [class.good]="overallScore() >= 80"
        [class.warning]="overallScore() >= 50 && overallScore() < 80"
        [class.poor]="overallScore() < 50"
      >
        <div class="score-circle">
          <svg viewBox="0 0 36 36" class="circular-chart">
            <path
              class="circle-bg"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              class="circle"
              [attr.stroke-dasharray]="overallScore() + ', 100'"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span class="score-text">{{ overallScore() }}%</span>
        </div>
        <div class="score-info">
          <span class="score-label">WCAG Compliance</span>
          <span class="score-status">
            @if (overallScore() >= 80) {
              Excellent contrast
            } @else if (overallScore() >= 50) {
              Some issues found
            } @else {
              Needs improvement
            }
          </span>
        </div>
      </div>

      <!-- Contrast Pairs -->
      <div class="contrast-pairs">
        @for (result of contrastResults(); track result.name) {
          <div class="pair-row">
            <div class="pair-preview">
              <div
                class="preview-swatch"
                [style.background-color]="result.bgHex"
                [style.color]="result.fgHex"
              >
                Aa
              </div>
            </div>
            <div class="pair-info">
              <span class="pair-name">{{ result.name }}</span>
              <span class="pair-ratio"
                >{{ result.ratio | number: '1.1-1' }}:1</span
              >
            </div>
            <div class="pair-badges">
              <span
                class="badge"
                [class.pass]="result.aa"
                [class.fail]="!result.aa"
              >
                AA
              </span>
              <span
                class="badge"
                [class.pass]="result.aaa"
                [class.fail]="!result.aaa"
              >
                AAA
              </span>
            </div>
          </div>
        }
      </div>

      <!-- Legend -->
      <div class="legend">
        <div class="legend-item">
          <span class="legend-badge pass">✓</span>
          <span>Passes WCAG</span>
        </div>
        <div class="legend-item">
          <span class="legend-badge fail">✗</span>
          <span>Fails WCAG</span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .contrast-checker {
        background: var(--ax-background-default, #fff);
        border-radius: 0.75rem;
        padding: 1rem;
      }

      .checker-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      .header-icon {
        color: var(--ax-text-muted, #666);
      }

      .header-title {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--ax-text-default, #333);
      }

      .header-line {
        flex: 1;
        height: 1px;
        background: var(--ax-border-default, #e5e5e5);
        margin-left: 0.5rem;
      }

      /* Overall Score */
      .overall-score {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border-radius: 0.75rem;
        margin-bottom: 1rem;
      }

      .overall-score.good {
        background: color-mix(
          in oklch,
          var(--ax-success, #22c55e) 10%,
          transparent
        );
      }

      .overall-score.warning {
        background: color-mix(
          in oklch,
          var(--ax-warning, #f59e0b) 10%,
          transparent
        );
      }

      .overall-score.poor {
        background: color-mix(
          in oklch,
          var(--ax-error, #ef4444) 10%,
          transparent
        );
      }

      .score-circle {
        position: relative;
        width: 4rem;
        height: 4rem;
      }

      .circular-chart {
        width: 100%;
        height: 100%;
      }

      .circle-bg {
        fill: none;
        stroke: var(--ax-background-subtle, #e5e5e5);
        stroke-width: 3;
      }

      .circle {
        fill: none;
        stroke-width: 3;
        stroke-linecap: round;
        transform: rotate(-90deg);
        transform-origin: 50% 50%;
        transition: stroke-dasharray 0.3s ease;
      }

      .overall-score.good .circle {
        stroke: var(--ax-success, #22c55e);
      }

      .overall-score.warning .circle {
        stroke: var(--ax-warning, #f59e0b);
      }

      .overall-score.poor .circle {
        stroke: var(--ax-error, #ef4444);
      }

      .score-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 0.875rem;
        font-weight: 700;
        color: var(--ax-text-default, #333);
      }

      .score-info {
        display: flex;
        flex-direction: column;
      }

      .score-label {
        font-size: 0.75rem;
        color: var(--ax-text-muted, #999);
      }

      .score-status {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--ax-text-default, #333);
      }

      /* Contrast Pairs */
      .contrast-pairs {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      .pair-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem;
        border-radius: 0.5rem;
        background: var(--ax-background-muted, #f8f8f8);
      }

      .preview-swatch {
        width: 2rem;
        height: 2rem;
        border-radius: 0.375rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: 600;
        border: 1px solid rgba(0, 0, 0, 0.1);
      }

      .pair-info {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .pair-name {
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--ax-text-default, #333);
      }

      .pair-ratio {
        font-size: 0.625rem;
        font-family: monospace;
        color: var(--ax-text-muted, #999);
      }

      .pair-badges {
        display: flex;
        gap: 0.25rem;
      }

      .badge {
        padding: 0.125rem 0.375rem;
        border-radius: 0.25rem;
        font-size: 0.5625rem;
        font-weight: 600;
      }

      .badge.pass {
        background: color-mix(
          in oklch,
          var(--ax-success, #22c55e) 15%,
          transparent
        );
        color: var(--ax-success, #22c55e);
      }

      .badge.fail {
        background: color-mix(
          in oklch,
          var(--ax-error, #ef4444) 15%,
          transparent
        );
        color: var(--ax-error, #ef4444);
      }

      /* Legend */
      .legend {
        display: flex;
        gap: 1rem;
        justify-content: center;
        padding-top: 0.75rem;
        border-top: 1px solid var(--ax-border-default, #e5e5e5);
      }

      .legend-item {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        font-size: 0.6875rem;
        color: var(--ax-text-muted, #999);
      }

      .legend-badge {
        width: 1rem;
        height: 1rem;
        border-radius: 0.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.5rem;
      }

      .legend-badge.pass {
        background: color-mix(
          in oklch,
          var(--ax-success, #22c55e) 15%,
          transparent
        );
        color: var(--ax-success, #22c55e);
      }

      .legend-badge.fail {
        background: color-mix(
          in oklch,
          var(--ax-error, #ef4444) 15%,
          transparent
        );
        color: var(--ax-error, #ef4444);
      }
    `,
  ],
})
export class ContrastCheckerComponent {
  private themeService = inject(ThemeGeneratorService);

  // Define which color pairs to check
  private contrastPairs: ContrastPair[] = [
    { name: 'Primary on Background', bg: 'base-100', fg: 'primary' },
    { name: 'Primary Content', bg: 'primary', fg: 'primary-content' },
    { name: 'Secondary Content', bg: 'secondary', fg: 'secondary-content' },
    { name: 'Base Content', bg: 'base-100', fg: 'base-content' },
    { name: 'Info Content', bg: 'info', fg: 'info-content' },
    { name: 'Success Content', bg: 'success', fg: 'success-content' },
    { name: 'Warning Content', bg: 'warning', fg: 'warning-content' },
    { name: 'Error Content', bg: 'error', fg: 'error-content' },
  ];

  contrastResults = computed(() => {
    const colors = this.themeService.colors();
    return this.contrastPairs.map((pair) => {
      const bgColor = colors[pair.bg];
      const fgColor = colors[pair.fg];
      const ratio = getContrastRatio(bgColor, fgColor);
      return {
        name: pair.name,
        bgHex: oklchToHex(bgColor),
        fgHex: oklchToHex(fgColor),
        ratio,
        aa: meetsWcagAA(fgColor, bgColor),
        aaa: meetsWcagAAA(fgColor, bgColor),
      };
    });
  });

  overallScore = computed(() => {
    const results = this.contrastResults();
    const aaCount = results.filter((r) => r.aa).length;
    return Math.round((aaCount / results.length) * 100);
  });
}
