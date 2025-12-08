import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AxCircularProgressComponent } from '@aegisx/ui';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../../../components/docs';
import { ComponentToken } from '../../../../../../types/docs.types';

@Component({
  selector: 'app-circular-progress-demo',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatCardModule,
    AxCircularProgressComponent,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="circular-progress-doc">
      <ax-doc-header
        title="Circular Progress"
        icon="donut_large"
        description="SVG-based circular progress indicators for displaying percentage metrics. Perfect for Web Vitals, SLA metrics, and performance scores."
        [breadcrumbs]="[
          { label: 'Charts', link: '/docs/components/aegisx/charts/sparkline' },
          { label: 'Circular Progress' },
        ]"
        status="stable"
        version="1.0.0"
        importStatement="import { AxCircularProgressComponent } from '@aegisx/ui';"
      ></ax-doc-header>

      <mat-tab-group
        class="circular-progress-doc__tabs"
        animationDuration="150ms"
      >
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="circular-progress-doc__tab-content">
            <section class="circular-progress-doc__section">
              <h2>Basic Usage</h2>
              <p>
                The Circular Progress component provides an SVG-based progress
                ring for displaying percentage values. Perfect for metrics,
                scores, and performance indicators.
              </p>

              <ax-live-preview variant="bordered">
                <ax-circular-progress
                  [value]="75"
                  size="md"
                  color="var(--ax-info-default)"
                >
                </ax-circular-progress>
              </ax-live-preview>

              <ax-code-tabs [tabs]="basicUsageCode"></ax-code-tabs>
            </section>

            <section class="circular-progress-doc__section">
              <h2>Sizes</h2>
              <p>Control the circular progress size with the size input.</p>

              <ax-live-preview
                variant="bordered"
                direction="row"
                [wrap]="true"
                gap="var(--ax-spacing-xl)"
                align="center"
              >
                <div class="circular-progress-doc__size-item">
                  <ax-circular-progress [value]="75" size="sm">
                  </ax-circular-progress>
                  <span class="text-sm text-secondary mt-2">Small (80px)</span>
                </div>

                <div class="circular-progress-doc__size-item">
                  <ax-circular-progress [value]="75" size="md">
                  </ax-circular-progress>
                  <span class="text-sm text-secondary mt-2"
                    >Medium (120px)</span
                  >
                </div>

                <div class="circular-progress-doc__size-item">
                  <ax-circular-progress [value]="75" size="lg">
                  </ax-circular-progress>
                  <span class="text-sm text-secondary mt-2">Large (160px)</span>
                </div>

                <div class="circular-progress-doc__size-item">
                  <ax-circular-progress [value]="75" size="xl">
                  </ax-circular-progress>
                  <span class="text-sm text-secondary mt-2">XL (200px)</span>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="sizesCode"></ax-code-tabs>
            </section>

            <section class="circular-progress-doc__section">
              <h2>Color Variants</h2>
              <p>Use semantic colors to convey meaning.</p>

              <ax-live-preview
                variant="bordered"
                direction="row"
                [wrap]="true"
                gap="var(--ax-spacing-lg)"
              >
                <div class="circular-progress-doc__color-item">
                  <ax-circular-progress
                    [value]="85"
                    size="md"
                    color="var(--ax-info-default)"
                  >
                  </ax-circular-progress>
                  <span class="text-sm text-secondary mt-2">Info</span>
                </div>

                <div class="circular-progress-doc__color-item">
                  <ax-circular-progress
                    [value]="92"
                    size="md"
                    color="var(--ax-success-default)"
                  >
                  </ax-circular-progress>
                  <span class="text-sm text-secondary mt-2">Success</span>
                </div>

                <div class="circular-progress-doc__color-item">
                  <ax-circular-progress
                    [value]="68"
                    size="md"
                    color="var(--ax-warning-default)"
                  >
                  </ax-circular-progress>
                  <span class="text-sm text-secondary mt-2">Warning</span>
                </div>

                <div class="circular-progress-doc__color-item">
                  <ax-circular-progress
                    [value]="42"
                    size="md"
                    color="var(--ax-error)"
                  >
                  </ax-circular-progress>
                  <span class="text-sm text-secondary mt-2">Error</span>
                </div>
              </ax-live-preview>
            </section>

            <section class="circular-progress-doc__section">
              <h2>Auto Color (Thresholds)</h2>
              <p>Colors change automatically based on value thresholds.</p>

              <ax-live-preview
                variant="bordered"
                direction="row"
                [wrap]="true"
                gap="var(--ax-spacing-lg)"
              >
                <div class="circular-progress-doc__color-item">
                  <ax-circular-progress
                    [value]="95"
                    size="md"
                    [autoColor]="true"
                    [successThreshold]="80"
                    [warningThreshold]="50"
                  >
                  </ax-circular-progress>
                  <span class="text-sm text-secondary mt-2">95% (Green)</span>
                </div>

                <div class="circular-progress-doc__color-item">
                  <ax-circular-progress
                    [value]="65"
                    size="md"
                    [autoColor]="true"
                    [successThreshold]="80"
                    [warningThreshold]="50"
                  >
                  </ax-circular-progress>
                  <span class="text-sm text-secondary mt-2">65% (Yellow)</span>
                </div>

                <div class="circular-progress-doc__color-item">
                  <ax-circular-progress
                    [value]="35"
                    size="md"
                    [autoColor]="true"
                    [successThreshold]="80"
                    [warningThreshold]="50"
                  >
                  </ax-circular-progress>
                  <span class="text-sm text-secondary mt-2">35% (Red)</span>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="autoColorCode"></ax-code-tabs>
            </section>

            <section class="circular-progress-doc__section">
              <h2>Custom Labels</h2>
              <p>Override the default percentage label with custom text.</p>

              <ax-live-preview
                variant="bordered"
                direction="row"
                [wrap]="true"
                gap="var(--ax-spacing-lg)"
              >
                <div class="circular-progress-doc__color-item">
                  <ax-circular-progress
                    [value]="99.9"
                    size="lg"
                    color="var(--ax-success-default)"
                    label="99.9%"
                  >
                  </ax-circular-progress>
                  <span class="text-sm text-secondary mt-2">Custom Label</span>
                </div>

                <div class="circular-progress-doc__color-item">
                  <ax-circular-progress
                    [value]="85"
                    size="lg"
                    color="var(--ax-info-default)"
                    [showLabel]="false"
                  >
                  </ax-circular-progress>
                  <span class="text-sm text-secondary mt-2">No Label</span>
                </div>
              </ax-live-preview>
            </section>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="circular-progress-doc__tab-content">
            <section class="circular-progress-doc__section">
              <h2>Web Vitals Metrics</h2>
              <p>Circular progress rings for Core Web Vitals monitoring.</p>

              <ax-live-preview
                variant="bordered"
                direction="row"
                [wrap]="true"
                gap="var(--ax-spacing-lg)"
              >
                <!-- FCP -->
                <mat-card class="circular-progress-doc__metric-card">
                  <mat-card-content class="flex flex-col items-center">
                    <ax-circular-progress
                      [value]="92"
                      size="md"
                      [autoColor]="true"
                      [successThreshold]="80"
                      [warningThreshold]="50"
                    >
                    </ax-circular-progress>
                    <div class="mt-4 text-center">
                      <div class="text-sm font-medium text-secondary">
                        First Contentful Paint
                      </div>
                      <div class="text-xs text-subtle mt-1">1.2s (Good)</div>
                    </div>
                  </mat-card-content>
                </mat-card>

                <!-- LCP -->
                <mat-card class="circular-progress-doc__metric-card">
                  <mat-card-content class="flex flex-col items-center">
                    <ax-circular-progress
                      [value]="88"
                      size="md"
                      [autoColor]="true"
                      [successThreshold]="80"
                      [warningThreshold]="50"
                    >
                    </ax-circular-progress>
                    <div class="mt-4 text-center">
                      <div class="text-sm font-medium text-secondary">
                        Largest Contentful Paint
                      </div>
                      <div class="text-xs text-subtle mt-1">2.1s (Good)</div>
                    </div>
                  </mat-card-content>
                </mat-card>

                <!-- CLS -->
                <mat-card class="circular-progress-doc__metric-card">
                  <mat-card-content class="flex flex-col items-center">
                    <ax-circular-progress
                      [value]="95"
                      size="md"
                      [autoColor]="true"
                      [successThreshold]="80"
                      [warningThreshold]="50"
                    >
                    </ax-circular-progress>
                    <div class="mt-4 text-center">
                      <div class="text-sm font-medium text-secondary">
                        Cumulative Layout Shift
                      </div>
                      <div class="text-xs text-subtle mt-1">0.05 (Good)</div>
                    </div>
                  </mat-card-content>
                </mat-card>

                <!-- INP -->
                <mat-card class="circular-progress-doc__metric-card">
                  <mat-card-content class="flex flex-col items-center">
                    <ax-circular-progress
                      [value]="45"
                      size="md"
                      [autoColor]="true"
                      [successThreshold]="80"
                      [warningThreshold]="50"
                    >
                    </ax-circular-progress>
                    <div class="mt-4 text-center">
                      <div class="text-sm font-medium text-secondary">
                        Interaction to Next Paint
                      </div>
                      <div class="text-xs text-subtle mt-1">
                        350ms (Needs work)
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>
              </ax-live-preview>

              <ax-code-tabs [tabs]="webVitalsCode"></ax-code-tabs>
            </section>

            <section class="circular-progress-doc__section">
              <h2>SLA & Performance Scores</h2>
              <p>Large circular progress for overall performance metrics.</p>

              <ax-live-preview
                variant="bordered"
                direction="row"
                [wrap]="true"
                gap="var(--ax-spacing-lg)"
              >
                <!-- API Uptime -->
                <mat-card class="circular-progress-doc__sla-card">
                  <mat-card-content class="flex flex-col items-center">
                    <ax-circular-progress
                      [value]="99.9"
                      size="lg"
                      color="var(--ax-success-default)"
                      label="99.9%"
                    >
                    </ax-circular-progress>
                    <div class="mt-4 text-center">
                      <div class="text-lg font-semibold text-heading">
                        API Uptime
                      </div>
                      <div class="text-sm text-secondary mt-1">
                        Last 30 days
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>

                <!-- Response Time -->
                <mat-card class="circular-progress-doc__sla-card">
                  <mat-card-content class="flex flex-col items-center">
                    <ax-circular-progress
                      [value]="85"
                      size="lg"
                      color="var(--ax-info-default)"
                      label="85%"
                    >
                    </ax-circular-progress>
                    <div class="mt-4 text-center">
                      <div class="text-lg font-semibold text-heading">
                        Response Time
                      </div>
                      <div class="text-sm text-secondary mt-1">
                        &lt; 200ms target
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>

                <!-- Success Rate -->
                <mat-card class="circular-progress-doc__sla-card">
                  <mat-card-content class="flex flex-col items-center">
                    <ax-circular-progress
                      [value]="98.5"
                      size="lg"
                      color="var(--ax-success-default)"
                      label="98.5%"
                    >
                    </ax-circular-progress>
                    <div class="mt-4 text-center">
                      <div class="text-lg font-semibold text-heading">
                        Success Rate
                      </div>
                      <div class="text-sm text-secondary mt-1">
                        1.5% error rate
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>
              </ax-live-preview>

              <ax-code-tabs [tabs]="slaCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="circular-progress-doc__tab-content">
            <section class="circular-progress-doc__section">
              <h2>Properties</h2>
              <div class="circular-progress-doc__api-table">
                <table>
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Default</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>value</code></td>
                      <td><code>number</code></td>
                      <td><code>0</code></td>
                      <td>Progress value (0-100)</td>
                    </tr>
                    <tr>
                      <td><code>variant</code></td>
                      <td><code>'ring' | 'donut' | 'gauge'</code></td>
                      <td><code>'ring'</code></td>
                      <td>Circle style variant</td>
                    </tr>
                    <tr>
                      <td><code>size</code></td>
                      <td><code>'sm' | 'md' | 'lg' | 'xl'</code></td>
                      <td><code>'md'</code></td>
                      <td>Circle size (80, 120, 160, 200px)</td>
                    </tr>
                    <tr>
                      <td><code>color</code></td>
                      <td><code>string</code></td>
                      <td><code>'var(--ax-info-default)'</code></td>
                      <td>Progress color (CSS variable or hex)</td>
                    </tr>
                    <tr>
                      <td><code>trackColor</code></td>
                      <td><code>string</code></td>
                      <td><code>'var(--ax-border-default)'</code></td>
                      <td>Background track color</td>
                    </tr>
                    <tr>
                      <td><code>showLabel</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Show percentage label in center</td>
                    </tr>
                    <tr>
                      <td><code>label</code></td>
                      <td><code>string</code></td>
                      <td><code>undefined</code></td>
                      <td>Custom label text (overrides percentage)</td>
                    </tr>
                    <tr>
                      <td><code>strokeWidth</code></td>
                      <td><code>number</code></td>
                      <td><code>auto</code></td>
                      <td>Stroke width (auto-calculated if not set)</td>
                    </tr>
                    <tr>
                      <td><code>autoColor</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Auto color based on thresholds</td>
                    </tr>
                    <tr>
                      <td><code>successThreshold</code></td>
                      <td><code>number</code></td>
                      <td><code>80</code></td>
                      <td>Green color threshold (value >= this)</td>
                    </tr>
                    <tr>
                      <td><code>warningThreshold</code></td>
                      <td><code>number</code></td>
                      <td><code>50</code></td>
                      <td>Yellow color threshold (value >= this)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="circular-progress-doc__section">
              <h2>Auto Color Logic</h2>
              <ul class="circular-progress-doc__usage-list">
                <li>
                  <strong>Green (Success):</strong> value >= successThreshold
                  (default: 80)
                </li>
                <li>
                  <strong>Yellow (Warning):</strong> value >= warningThreshold
                  (default: 50)
                </li>
                <li>
                  <strong>Red (Error):</strong> value &lt; warningThreshold
                </li>
              </ul>
            </section>
          </div>
        </mat-tab>

        <!-- Tokens Tab -->
        <mat-tab label="Tokens">
          <div class="circular-progress-doc__tab-content">
            <ax-component-tokens
              [tokens]="circularProgressTokens"
            ></ax-component-tokens>
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="circular-progress-doc__tab-content">
            <section class="circular-progress-doc__section">
              <h2>Do's and Don'ts</h2>

              <div class="circular-progress-doc__guidelines">
                <div
                  class="circular-progress-doc__guideline circular-progress-doc__guideline--do"
                >
                  <h4><mat-icon>check_circle</mat-icon> Do</h4>
                  <ul>
                    <li>Use for percentage-based metrics (0-100)</li>
                    <li>Include supporting text for context</li>
                    <li>Use autoColor for performance scores</li>
                    <li>Group related metrics together</li>
                    <li>Use consistent sizes within a group</li>
                    <li>Use semantic colors (success/warning/error)</li>
                  </ul>
                </div>

                <div
                  class="circular-progress-doc__guideline circular-progress-doc__guideline--dont"
                >
                  <h4><mat-icon>cancel</mat-icon> Don't</h4>
                  <ul>
                    <li>Use for non-percentage values</li>
                    <li>Mix too many different sizes</li>
                    <li>Use without labels or context</li>
                    <li>Overcrowd with too many rings</li>
                    <li>Use small size for important metrics</li>
                    <li>Rely on color alone for meaning</li>
                  </ul>
                </div>
              </div>
            </section>

            <section class="circular-progress-doc__section">
              <h2>Use Cases</h2>
              <ul class="circular-progress-doc__a11y-list">
                <li><strong>Web Vitals</strong> - FCP, LCP, CLS, INP scores</li>
                <li>
                  <strong>SLA Metrics</strong> - Uptime, availability
                  percentages
                </li>
                <li>
                  <strong>Performance Scores</strong> - Lighthouse, PageSpeed
                </li>
                <li>
                  <strong>Completion Status</strong> - Task progress, goals
                </li>
                <li>
                  <strong>Health Checks</strong> - System status indicators
                </li>
              </ul>
            </section>

            <section class="circular-progress-doc__section">
              <h2>Accessibility</h2>
              <ul class="circular-progress-doc__a11y-list">
                <li>Always provide text labels alongside visual progress</li>
                <li>Use sufficient color contrast for the progress ring</li>
                <li>Don't rely on color alone - include percentage text</li>
                <li>
                  Consider adding ARIA role="progressbar" for screen readers
                </li>
              </ul>
            </section>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .circular-progress-doc {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--ax-spacing-xl, 1.5rem);
      }

      .circular-progress-doc__tabs {
        margin-top: var(--ax-spacing-xl, 1.5rem);
      }

      .circular-progress-doc__tab-content {
        padding: var(--ax-spacing-xl, 1.5rem) 0;
      }

      .circular-progress-doc__section {
        margin-bottom: var(--ax-spacing-3xl, 3rem);

        h2 {
          font-size: var(--ax-text-xl, 1.25rem);
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0 0 var(--ax-spacing-sm, 0.5rem) 0;
        }

        > p {
          font-size: var(--ax-text-sm, 0.875rem);
          color: var(--ax-text-secondary);
          margin: 0 0 var(--ax-spacing-lg, 1rem) 0;
          max-width: 700px;
        }
      }

      .circular-progress-doc__size-item,
      .circular-progress-doc__color-item {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .circular-progress-doc__metric-card {
        width: 180px;
        background-color: var(--ax-background-default);
        border: 1px solid var(--ax-border-default);
      }

      .circular-progress-doc__sla-card {
        width: 220px;
        background-color: var(--ax-background-default);
        border: 1px solid var(--ax-border-default);
      }

      /* API Table */
      .circular-progress-doc__api-table {
        overflow-x: auto;
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-lg, 0.75rem);

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th,
        td {
          text-align: left;
          padding: var(--ax-spacing-sm, 0.5rem) var(--ax-spacing-md, 0.75rem);
          border-bottom: 1px solid var(--ax-border-default);
        }

        th {
          background: var(--ax-background-subtle);
          font-size: var(--ax-text-xs, 0.75rem);
          font-weight: 600;
          color: var(--ax-text-secondary);
          text-transform: uppercase;
        }

        td {
          font-size: var(--ax-text-sm, 0.875rem);
          color: var(--ax-text-primary);
        }

        td code {
          font-family: var(--ax-font-mono);
          font-size: var(--ax-text-xs, 0.75rem);
          background: var(--ax-background-subtle);
          padding: 2px 6px;
          border-radius: var(--ax-radius-sm, 0.25rem);
        }

        tr:last-child td {
          border-bottom: none;
        }
      }

      .circular-progress-doc__usage-list {
        margin: 0;
        padding-left: var(--ax-spacing-lg, 1rem);

        li {
          font-size: var(--ax-text-sm, 0.875rem);
          color: var(--ax-text-secondary);
          margin-bottom: var(--ax-spacing-sm, 0.5rem);
        }
      }

      /* Guidelines */
      .circular-progress-doc__guidelines {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--ax-spacing-lg, 1rem);
      }

      .circular-progress-doc__guideline {
        padding: var(--ax-spacing-lg, 1rem);
        border-radius: var(--ax-radius-lg, 0.75rem);

        h4 {
          display: flex;
          align-items: center;
          gap: var(--ax-spacing-xs, 0.25rem);
          font-size: var(--ax-text-base, 1rem);
          font-weight: 600;
          margin: 0 0 var(--ax-spacing-sm, 0.5rem) 0;

          mat-icon {
            font-size: 20px;
            width: 20px;
            height: 20px;
          }
        }

        ul {
          margin: 0;
          padding-left: var(--ax-spacing-lg, 1rem);

          li {
            font-size: var(--ax-text-sm, 0.875rem);
            margin-bottom: var(--ax-spacing-xs, 0.25rem);
          }
        }
      }

      .circular-progress-doc__guideline--do {
        background: var(--ax-success-faint);

        h4 {
          color: var(--ax-success-emphasis);
        }
        li {
          color: var(--ax-success-emphasis);
        }
      }

      .circular-progress-doc__guideline--dont {
        background: var(--ax-error-faint);

        h4 {
          color: var(--ax-error-emphasis);
        }
        li {
          color: var(--ax-error-emphasis);
        }
      }

      .circular-progress-doc__a11y-list {
        margin: 0;
        padding-left: var(--ax-spacing-lg, 1rem);

        li {
          font-size: var(--ax-text-sm, 0.875rem);
          color: var(--ax-text-secondary);
          margin-bottom: var(--ax-spacing-sm, 0.5rem);
        }
      }
    `,
  ],
})
export class CircularProgressDemoComponent {
  // Code examples
  basicUsageCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-circular-progress
  [value]="75"
  size="md"
  color="var(--ax-info-default)">
</ax-circular-progress>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxCircularProgressComponent } from '@aegisx/ui';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [AxCircularProgressComponent],
  template: \`
    <ax-circular-progress
      [value]="progress"
      size="md"
      color="var(--ax-info-default)">
    </ax-circular-progress>
  \`,
})
export class MyComponent {
  progress = 75;
}`,
    },
  ];

  sizesCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Small (80px) -->
<ax-circular-progress [value]="75" size="sm"></ax-circular-progress>

<!-- Medium (120px) -->
<ax-circular-progress [value]="75" size="md"></ax-circular-progress>

<!-- Large (160px) -->
<ax-circular-progress [value]="75" size="lg"></ax-circular-progress>

<!-- Extra Large (200px) -->
<ax-circular-progress [value]="75" size="xl"></ax-circular-progress>`,
    },
  ];

  autoColorCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-circular-progress
  [value]="95"
  size="md"
  [autoColor]="true"
  [successThreshold]="80"
  [warningThreshold]="50">
</ax-circular-progress>

<!-- 95% = Green (>= 80) -->
<!-- 65% = Yellow (>= 50, < 80) -->
<!-- 35% = Red (< 50) -->`,
    },
  ];

  webVitalsCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<mat-card class="metric-card">
  <mat-card-content class="flex flex-col items-center">
    <ax-circular-progress
      [value]="92"
      size="md"
      [autoColor]="true"
      [successThreshold]="80"
      [warningThreshold]="50">
    </ax-circular-progress>
    <div class="mt-4 text-center">
      <div class="text-sm font-medium">First Contentful Paint</div>
      <div class="text-xs text-secondary">1.2s (Good)</div>
    </div>
  </mat-card-content>
</mat-card>`,
    },
  ];

  slaCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-circular-progress
  [value]="99.9"
  size="lg"
  color="var(--ax-success-default)"
  label="99.9%">
</ax-circular-progress>
<div class="mt-4 text-center">
  <div class="text-lg font-semibold">API Uptime</div>
  <div class="text-sm text-secondary">Last 30 days</div>
</div>`,
    },
  ];

  // Design tokens
  circularProgressTokens: ComponentToken[] = [
    {
      category: 'Colors',
      cssVar: '--ax-info-default',
      usage: 'Default progress color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-success-default',
      usage: 'Success/high value color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-warning-default',
      usage: 'Warning/medium value color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-error',
      usage: 'Error/low value color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-border-default',
      usage: 'Track background color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-heading',
      usage: 'Label text color',
    },
    {
      category: 'Typography',
      cssVar: '--ax-text-sm',
      usage: 'Small size label',
    },
    {
      category: 'Typography',
      cssVar: '--ax-text-lg',
      usage: 'Medium size label',
    },
    {
      category: 'Typography',
      cssVar: '--ax-text-2xl',
      usage: 'Large size label',
    },
    {
      category: 'Typography',
      cssVar: '--ax-text-3xl',
      usage: 'XL size label',
    },
  ];
}
