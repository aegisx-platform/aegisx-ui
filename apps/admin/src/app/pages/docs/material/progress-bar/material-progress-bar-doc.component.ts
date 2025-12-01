import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../components/docs';
import { ComponentToken } from '../../../../types/docs.types';

@Component({
  selector: 'app-material-progress-bar-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="material-progress-bar-doc">
      <ax-doc-header
        title="Progress Bar"
        description="Progress bars display the length of a process or express an unspecified wait time."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="material-progress-bar-doc__header-links">
          <a
            href="https://material.angular.io/components/progress-bar/overview"
            target="_blank"
            rel="noopener"
            class="material-progress-bar-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
        </div>
      </ax-doc-header>

      <mat-tab-group
        class="material-progress-bar-doc__tabs"
        animationDuration="200ms"
      >
        <mat-tab label="Overview">
          <div class="material-progress-bar-doc__section">
            <h2 class="material-progress-bar-doc__section-title">
              Progress Bar Modes
            </h2>

            <h3 class="material-progress-bar-doc__subsection-title">
              Determinate
            </h3>
            <ax-live-preview title="Shows specific progress percentage">
              <div class="progress-demo">
                <mat-progress-bar
                  mode="determinate"
                  [value]="25"
                ></mat-progress-bar>
                <span class="progress-label">25%</span>
              </div>
              <div class="progress-demo">
                <mat-progress-bar
                  mode="determinate"
                  [value]="50"
                ></mat-progress-bar>
                <span class="progress-label">50%</span>
              </div>
              <div class="progress-demo">
                <mat-progress-bar
                  mode="determinate"
                  [value]="75"
                ></mat-progress-bar>
                <span class="progress-label">75%</span>
              </div>
              <div class="progress-demo">
                <mat-progress-bar
                  mode="determinate"
                  [value]="100"
                ></mat-progress-bar>
                <span class="progress-label">100%</span>
              </div>
            </ax-live-preview>

            <h3 class="material-progress-bar-doc__subsection-title">
              Indeterminate
            </h3>
            <ax-live-preview title="Unknown duration loading animation">
              <mat-progress-bar mode="indeterminate"></mat-progress-bar>
            </ax-live-preview>

            <h3 class="material-progress-bar-doc__subsection-title">Buffer</h3>
            <ax-live-preview
              title="Shows buffered content (e.g., video loading)"
            >
              <div class="progress-demo">
                <mat-progress-bar
                  mode="buffer"
                  [value]="35"
                  [bufferValue]="65"
                ></mat-progress-bar>
                <span class="progress-label">35% loaded, 65% buffered</span>
              </div>
            </ax-live-preview>

            <h3 class="material-progress-bar-doc__subsection-title">Query</h3>
            <ax-live-preview
              title="Pre-loading indicator (reversed indeterminate)"
            >
              <mat-progress-bar mode="query"></mat-progress-bar>
            </ax-live-preview>

            <h3 class="material-progress-bar-doc__subsection-title">Colors</h3>
            <ax-live-preview title="Theme color variants">
              <div class="progress-stack">
                <div class="progress-color-row">
                  <span class="color-label">Primary:</span>
                  <mat-progress-bar
                    mode="determinate"
                    [value]="60"
                    color="primary"
                  ></mat-progress-bar>
                </div>
                <div class="progress-color-row">
                  <span class="color-label">Accent:</span>
                  <mat-progress-bar
                    mode="determinate"
                    [value]="60"
                    color="accent"
                  ></mat-progress-bar>
                </div>
                <div class="progress-color-row">
                  <span class="color-label">Warn:</span>
                  <mat-progress-bar
                    mode="determinate"
                    [value]="60"
                    color="warn"
                  ></mat-progress-bar>
                </div>
              </div>
            </ax-live-preview>

            <h3 class="material-progress-bar-doc__subsection-title">
              Interactive Demo
            </h3>
            <ax-live-preview title="Adjust progress value">
              <div class="interactive-demo">
                <mat-progress-bar
                  mode="determinate"
                  [value]="progressValue"
                ></mat-progress-bar>
                <div class="progress-controls">
                  <button mat-stroked-button (click)="decreaseProgress()">
                    <mat-icon>remove</mat-icon>
                  </button>
                  <span class="progress-display">{{ progressValue }}%</span>
                  <button mat-stroked-button (click)="increaseProgress()">
                    <mat-icon>add</mat-icon>
                  </button>
                  <button
                    mat-flat-button
                    color="primary"
                    (click)="resetProgress()"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </ax-live-preview>
          </div>
        </mat-tab>

        <mat-tab label="Examples">
          <div class="material-progress-bar-doc__section">
            <h2 class="material-progress-bar-doc__section-title">
              Usage Examples
            </h2>
            <ax-code-tabs [tabs]="basicUsageCode" />
          </div>
        </mat-tab>

        <mat-tab label="API">
          <div class="material-progress-bar-doc__section">
            <h2 class="material-progress-bar-doc__section-title">
              API Reference
            </h2>
            <mat-card appearance="outlined">
              <mat-card-header
                ><mat-card-title
                  >Progress Bar Properties</mat-card-title
                ></mat-card-header
              >
              <mat-card-content>
                <table class="material-progress-bar-doc__api-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>mode</code></td>
                      <td>
                        <code
                          >'determinate' | 'indeterminate' | 'buffer' |
                          'query'</code
                        >
                      </td>
                      <td>Progress mode</td>
                    </tr>
                    <tr>
                      <td><code>value</code></td>
                      <td><code>number</code></td>
                      <td>Progress value (0-100)</td>
                    </tr>
                    <tr>
                      <td><code>bufferValue</code></td>
                      <td><code>number</code></td>
                      <td>Buffer value for buffer mode (0-100)</td>
                    </tr>
                    <tr>
                      <td><code>color</code></td>
                      <td><code>'primary' | 'accent' | 'warn'</code></td>
                      <td>Theme color</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              style="margin-top: var(--ax-spacing-md);"
            >
              <mat-card-header
                ><mat-card-title>Events</mat-card-title></mat-card-header
              >
              <mat-card-content>
                <table class="material-progress-bar-doc__api-table">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>animationEnd</code></td>
                      <td><code>ProgressAnimationEnd</code></td>
                      <td>Emitted when animation completes</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="CSS Tokens">
          <div class="material-progress-bar-doc__section">
            <h2 class="material-progress-bar-doc__section-title">
              Design Tokens
            </h2>
            <ax-component-tokens [tokens]="progressBarTokens" />
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .material-progress-bar-doc {
        max-width: 1000px;
        margin: 0 auto;
        &__header-links {
          display: flex;
          gap: var(--ax-spacing-md);
          margin-top: var(--ax-spacing-md);
        }
        &__external-link {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8125rem;
          color: var(--ax-brand-default);
          text-decoration: none;
          mat-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
          }
          &:hover {
            text-decoration: underline;
          }
        }
        &__tabs {
          margin-top: var(--ax-spacing-lg);
        }
        &__section {
          padding: var(--ax-spacing-lg);
        }
        &__section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--ax-text-strong);
          margin: 0 0 var(--ax-spacing-sm) 0;
        }
        &__subsection-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--ax-text-strong);
          margin: var(--ax-spacing-xl) 0 var(--ax-spacing-md) 0;
        }
        &__api-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
          th,
          td {
            padding: var(--ax-spacing-sm) var(--ax-spacing-md);
            text-align: left;
            border-bottom: 1px solid var(--ax-border-default);
          }
          th {
            font-weight: 600;
            background: var(--ax-background-subtle);
          }
          code {
            background: var(--ax-background-subtle);
            padding: 2px 6px;
            border-radius: var(--ax-radius-sm);
          }
        }
        .progress-demo {
          display: flex;
          align-items: center;
          gap: var(--ax-spacing-md);
          margin-bottom: var(--ax-spacing-md);
          mat-progress-bar {
            flex: 1;
          }
          .progress-label {
            min-width: 150px;
            font-size: 0.875rem;
            color: var(--ax-text-subtle);
          }
        }
        .progress-stack {
          display: flex;
          flex-direction: column;
          gap: var(--ax-spacing-md);
        }
        .progress-color-row {
          display: flex;
          align-items: center;
          gap: var(--ax-spacing-md);
          .color-label {
            min-width: 80px;
            font-size: 0.875rem;
            color: var(--ax-text-subtle);
          }
          mat-progress-bar {
            flex: 1;
          }
        }
        .interactive-demo {
          display: flex;
          flex-direction: column;
          gap: var(--ax-spacing-md);
          .progress-controls {
            display: flex;
            align-items: center;
            gap: var(--ax-spacing-sm);
            .progress-display {
              min-width: 50px;
              text-align: center;
              font-weight: 600;
              font-size: 1.125rem;
              color: var(--ax-text-strong);
            }
          }
        }
      }
    `,
  ],
})
export class MaterialProgressBarDocComponent {
  progressValue = 50;

  increaseProgress() {
    this.progressValue = Math.min(100, this.progressValue + 10);
  }

  decreaseProgress() {
    this.progressValue = Math.max(0, this.progressValue - 10);
  }

  resetProgress() {
    this.progressValue = 50;
  }

  basicUsageCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<!-- Determinate (shows specific progress) -->
<mat-progress-bar mode="determinate" [value]="progress"></mat-progress-bar>

<!-- Indeterminate (unknown duration) -->
<mat-progress-bar mode="indeterminate"></mat-progress-bar>

<!-- Buffer (shows buffered content) -->
<mat-progress-bar
  mode="buffer"
  [value]="loadedPercent"
  [bufferValue]="bufferedPercent">
</mat-progress-bar>

<!-- Query (pre-loading) -->
<mat-progress-bar mode="query"></mat-progress-bar>

<!-- With color -->
<mat-progress-bar
  mode="determinate"
  [value]="60"
  color="accent">
</mat-progress-bar>`,
    },
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  imports: [MatProgressBarModule],
})
export class MyComponent {
  progress = 0;
  loadedPercent = 35;
  bufferedPercent = 65;

  // Update progress
  updateProgress(value: number) {
    this.progress = value;
  }

  // Simulate loading
  simulateLoading() {
    const interval = setInterval(() => {
      this.progress += 10;
      if (this.progress >= 100) {
        clearInterval(interval);
      }
    }, 500);
  }
}`,
    },
  ];

  progressBarTokens: ComponentToken[] = [
    {
      cssVar: '--mdc-linear-progress-active-indicator-color',
      usage: 'Active progress color',
      value: 'var(--ax-brand-default)',
      category: 'Colors',
    },
    {
      cssVar: '--mdc-linear-progress-track-color',
      usage: 'Track background color',
      value: 'var(--ax-background-subtle)',
      category: 'Background',
    },
    {
      cssVar: '--mdc-linear-progress-track-height',
      usage: 'Progress bar height',
      value: '4px',
      category: 'Size',
    },
    {
      cssVar: '--mdc-linear-progress-track-shape',
      usage: 'Track border radius',
      value: '0',
      category: 'Shape',
    },
  ];
}
