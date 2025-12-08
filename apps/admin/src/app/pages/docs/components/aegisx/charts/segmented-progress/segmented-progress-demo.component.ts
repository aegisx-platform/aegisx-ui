import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AxSegmentedProgressComponent, ProgressSegment } from '@aegisx/ui';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../../../components/docs';
import { ComponentToken } from '../../../../../../types/docs.types';

@Component({
  selector: 'app-segmented-progress-demo',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatCardModule,
    AxSegmentedProgressComponent,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="segmented-progress-doc">
      <ax-doc-header
        title="Segmented Progress"
        icon="stacked_bar_chart"
        description="Multi-segment progress bars with legends for displaying distribution metrics. Perfect for showing proportional data like ticket status, query performance, or resource allocation."
        [breadcrumbs]="[
          { label: 'Charts', link: '/docs/components/aegisx/charts/sparkline' },
          { label: 'Segmented Progress' },
        ]"
        status="stable"
        version="1.0.0"
        importStatement="import { AxSegmentedProgressComponent, ProgressSegment } from '@aegisx/ui';"
      ></ax-doc-header>

      <mat-tab-group
        class="segmented-progress-doc__tabs"
        animationDuration="150ms"
      >
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="segmented-progress-doc__tab-content">
            <section class="segmented-progress-doc__section">
              <h2>Basic Usage</h2>
              <p>
                The Segmented Progress component displays multi-segment progress
                bars for showing distribution metrics. Each segment represents a
                portion of the total.
              </p>

              <ax-live-preview variant="bordered">
                <ax-segmented-progress
                  [segments]="ticketSegments"
                  size="md"
                  legendPosition="bottom"
                >
                </ax-segmented-progress>
              </ax-live-preview>

              <ax-code-tabs [tabs]="basicUsageCode"></ax-code-tabs>
            </section>

            <section class="segmented-progress-doc__section">
              <h2>Size Variants</h2>
              <p>Control the progress bar height with the size input.</p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-xl)"
              >
                <div>
                  <div class="text-sm font-medium mb-2">Small (6px height)</div>
                  <ax-segmented-progress
                    [segments]="ticketSegments"
                    size="sm"
                    legendPosition="bottom"
                  >
                  </ax-segmented-progress>
                </div>

                <div>
                  <div class="text-sm font-medium mb-2">
                    Medium (8px height)
                  </div>
                  <ax-segmented-progress
                    [segments]="ticketSegments"
                    size="md"
                    legendPosition="bottom"
                  >
                  </ax-segmented-progress>
                </div>

                <div>
                  <div class="text-sm font-medium mb-2">
                    Large (12px height)
                  </div>
                  <ax-segmented-progress
                    [segments]="ticketSegments"
                    size="lg"
                    legendPosition="bottom"
                  >
                  </ax-segmented-progress>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="sizesCode"></ax-code-tabs>
            </section>

            <section class="segmented-progress-doc__section">
              <h2>Legend Positions</h2>
              <p>Position the legend at the bottom, right, or hide it.</p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-xl)"
              >
                <mat-card class="segmented-progress-doc__demo-card">
                  <mat-card-content>
                    <div class="text-sm font-medium mb-3">Legend: Bottom</div>
                    <ax-segmented-progress
                      [segments]="salesSegments"
                      size="md"
                      legendPosition="bottom"
                    >
                    </ax-segmented-progress>
                  </mat-card-content>
                </mat-card>

                <mat-card class="segmented-progress-doc__demo-card">
                  <mat-card-content>
                    <div class="text-sm font-medium mb-3">Legend: Right</div>
                    <ax-segmented-progress
                      [segments]="salesSegments"
                      size="md"
                      legendPosition="right"
                    >
                    </ax-segmented-progress>
                  </mat-card-content>
                </mat-card>

                <mat-card class="segmented-progress-doc__demo-card">
                  <mat-card-content>
                    <div class="text-sm font-medium mb-3">Legend: None</div>
                    <ax-segmented-progress
                      [segments]="salesSegments"
                      size="md"
                      legendPosition="none"
                    >
                    </ax-segmented-progress>
                  </mat-card-content>
                </mat-card>
              </ax-live-preview>
            </section>

            <section class="segmented-progress-doc__section">
              <h2>Rounded Corners</h2>
              <p>Control corner rounding with the rounded input.</p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-lg)"
              >
                <div>
                  <div class="text-sm font-medium mb-2">rounded="none"</div>
                  <ax-segmented-progress
                    [segments]="ticketSegments"
                    size="lg"
                    legendPosition="none"
                    rounded="none"
                  >
                  </ax-segmented-progress>
                </div>

                <div>
                  <div class="text-sm font-medium mb-2">rounded="sm"</div>
                  <ax-segmented-progress
                    [segments]="ticketSegments"
                    size="lg"
                    legendPosition="none"
                    rounded="sm"
                  >
                  </ax-segmented-progress>
                </div>

                <div>
                  <div class="text-sm font-medium mb-2">rounded="full"</div>
                  <ax-segmented-progress
                    [segments]="ticketSegments"
                    size="lg"
                    legendPosition="none"
                    rounded="full"
                  >
                  </ax-segmented-progress>
                </div>
              </ax-live-preview>
            </section>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="segmented-progress-doc__tab-content">
            <section class="segmented-progress-doc__section">
              <h2>Ticket Status Distribution</h2>
              <p>Track ticket resolution, in-progress, and escalated states.</p>

              <ax-live-preview
                variant="bordered"
                direction="row"
                [wrap]="true"
                gap="var(--ax-spacing-lg)"
              >
                <!-- Current Tickets -->
                <mat-card class="segmented-progress-doc__kpi-card">
                  <mat-card-content>
                    <div class="text-sm text-secondary mb-2">
                      Current Tickets
                    </div>
                    <div class="text-3xl font-semibold text-heading mb-4">
                      247
                    </div>
                    <ax-segmented-progress
                      [segments]="ticketSegments"
                      size="md"
                      legendPosition="bottom"
                      [showPercentage]="false"
                      [showValue]="false"
                    >
                    </ax-segmented-progress>
                  </mat-card-content>
                </mat-card>

                <!-- Database Queries -->
                <mat-card class="segmented-progress-doc__kpi-card">
                  <mat-card-content>
                    <div class="text-sm text-secondary mb-2">
                      Database Queries
                    </div>
                    <div class="text-3xl font-semibold text-heading mb-4">
                      44,757
                    </div>
                    <ax-segmented-progress
                      [segments]="querySegments"
                      size="md"
                      legendPosition="bottom"
                      [showPercentage]="false"
                      [showValue]="false"
                    >
                    </ax-segmented-progress>
                  </mat-card-content>
                </mat-card>

                <!-- Query Latency -->
                <mat-card class="segmented-progress-doc__kpi-card">
                  <mat-card-content>
                    <div class="text-sm text-secondary mb-2">Query Latency</div>
                    <div class="text-3xl font-semibold text-heading mb-4">
                      1,247ms
                    </div>
                    <ax-segmented-progress
                      [segments]="latencySegments"
                      size="md"
                      legendPosition="bottom"
                      [showPercentage]="false"
                      [showValue]="false"
                    >
                    </ax-segmented-progress>
                  </mat-card-content>
                </mat-card>
              </ax-live-preview>

              <ax-code-tabs [tabs]="ticketStatusCode"></ax-code-tabs>
            </section>

            <section class="segmented-progress-doc__section">
              <h2>Sales Channel Distribution</h2>
              <p>
                Multi-category distribution with 4+ segments and detailed
                legend.
              </p>

              <ax-live-preview variant="bordered">
                <mat-card class="segmented-progress-doc__sales-card">
                  <mat-card-content>
                    <div class="text-sm text-secondary mb-2">Total sales</div>
                    <div class="text-4xl font-semibold text-heading mb-4">
                      $292,400
                    </div>
                    <div class="text-sm text-secondary mb-3">
                      Sales channel distribution
                    </div>
                    <ax-segmented-progress
                      [segments]="salesSegments"
                      size="lg"
                      rounded="full"
                      legendPosition="bottom"
                      [showPercentage]="true"
                      [showValue]="true"
                      [gap]="4"
                    >
                    </ax-segmented-progress>
                  </mat-card-content>
                </mat-card>
              </ax-live-preview>

              <ax-code-tabs [tabs]="salesCode"></ax-code-tabs>
            </section>

            <section class="segmented-progress-doc__section">
              <h2>Token Usage Metrics</h2>
              <p>Binary distribution showing completion vs prompt tokens.</p>

              <ax-live-preview
                variant="bordered"
                direction="row"
                [wrap]="true"
                gap="var(--ax-spacing-lg)"
              >
                <!-- Average tokens per request -->
                <mat-card class="segmented-progress-doc__kpi-card">
                  <mat-card-content>
                    <div class="text-sm text-secondary mb-3">
                      Average tokens per request
                    </div>
                    <div class="text-4xl font-semibold text-heading mb-4">
                      341
                    </div>
                    <ax-segmented-progress
                      [segments]="avgTokenSegments"
                      size="md"
                      rounded="sm"
                      legendPosition="bottom"
                      [gap]="0"
                    >
                    </ax-segmented-progress>
                  </mat-card-content>
                </mat-card>

                <!-- Total tokens -->
                <mat-card class="segmented-progress-doc__kpi-card">
                  <mat-card-content>
                    <div class="text-sm text-secondary mb-3">Total tokens</div>
                    <div class="text-4xl font-semibold text-heading mb-4">
                      4,229
                    </div>
                    <ax-segmented-progress
                      [segments]="totalTokenSegments"
                      size="md"
                      rounded="sm"
                      legendPosition="bottom"
                      [gap]="0"
                    >
                    </ax-segmented-progress>
                  </mat-card-content>
                </mat-card>
              </ax-live-preview>

              <ax-code-tabs [tabs]="tokenUsageCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="segmented-progress-doc__tab-content">
            <section class="segmented-progress-doc__section">
              <h2>Properties</h2>
              <div class="segmented-progress-doc__api-table">
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
                      <td><code>segments</code></td>
                      <td><code>ProgressSegment[]</code></td>
                      <td><code>[]</code></td>
                      <td>Array of segment configurations</td>
                    </tr>
                    <tr>
                      <td><code>size</code></td>
                      <td><code>'sm' | 'md' | 'lg'</code></td>
                      <td><code>'md'</code></td>
                      <td>Progress bar height (6, 8, 12px)</td>
                    </tr>
                    <tr>
                      <td><code>legendPosition</code></td>
                      <td><code>'bottom' | 'right' | 'none'</code></td>
                      <td><code>'bottom'</code></td>
                      <td>Position of the legend</td>
                    </tr>
                    <tr>
                      <td><code>showPercentage</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Show percentage in legend</td>
                    </tr>
                    <tr>
                      <td><code>showValue</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Show value in legend</td>
                    </tr>
                    <tr>
                      <td><code>gap</code></td>
                      <td><code>number</code></td>
                      <td><code>2</code></td>
                      <td>Gap between segments (px)</td>
                    </tr>
                    <tr>
                      <td><code>rounded</code></td>
                      <td><code>'none' | 'sm' | 'md' | 'lg' | 'full'</code></td>
                      <td><code>'sm'</code></td>
                      <td>Border radius style</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="segmented-progress-doc__section">
              <h2>ProgressSegment Interface</h2>
              <div class="segmented-progress-doc__api-table">
                <table>
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>label</code></td>
                      <td><code>string</code></td>
                      <td>Segment label text</td>
                    </tr>
                    <tr>
                      <td><code>value</code></td>
                      <td><code>number</code></td>
                      <td>Raw value (for display in legend)</td>
                    </tr>
                    <tr>
                      <td><code>percentage</code></td>
                      <td><code>number</code></td>
                      <td>Percentage (0-100) for width calculation</td>
                    </tr>
                    <tr>
                      <td><code>color</code></td>
                      <td><code>string</code></td>
                      <td>Segment color (CSS variable or hex)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </mat-tab>

        <!-- Tokens Tab -->
        <mat-tab label="Tokens">
          <div class="segmented-progress-doc__tab-content">
            <ax-component-tokens
              [tokens]="segmentedProgressTokens"
            ></ax-component-tokens>
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="segmented-progress-doc__tab-content">
            <section class="segmented-progress-doc__section">
              <h2>Do's and Don'ts</h2>

              <div class="segmented-progress-doc__guidelines">
                <div
                  class="segmented-progress-doc__guideline segmented-progress-doc__guideline--do"
                >
                  <h4><mat-icon>check_circle</mat-icon> Do</h4>
                  <ul>
                    <li>Use for distribution/proportion data</li>
                    <li>Keep segment count between 2-6</li>
                    <li>Order segments by size (largest first)</li>
                    <li>Use distinct colors for each segment</li>
                    <li>Include legend for clarity</li>
                    <li>Ensure percentages sum to 100%</li>
                  </ul>
                </div>

                <div
                  class="segmented-progress-doc__guideline segmented-progress-doc__guideline--dont"
                >
                  <h4><mat-icon>cancel</mat-icon> Don't</h4>
                  <ul>
                    <li>Use too many segments (7+)</li>
                    <li>Use similar colors for adjacent segments</li>
                    <li>Hide legend when segments need labels</li>
                    <li>Use for time-based progress</li>
                    <li>Mix with other progress indicators</li>
                    <li>Use very small percentages (&lt;5%)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section class="segmented-progress-doc__section">
              <h2>Use Cases</h2>
              <ul class="segmented-progress-doc__a11y-list">
                <li>
                  <strong>Status Distribution</strong> - Tickets, tasks, orders
                  by status
                </li>
                <li>
                  <strong>Sales Breakdown</strong> - Revenue by channel or
                  category
                </li>
                <li>
                  <strong>Resource Usage</strong> - CPU, memory, disk allocation
                </li>
                <li>
                  <strong>Token Metrics</strong> - Prompt vs completion tokens
                </li>
                <li><strong>Survey Results</strong> - Response distribution</li>
              </ul>
            </section>

            <section class="segmented-progress-doc__section">
              <h2>Accessibility</h2>
              <ul class="segmented-progress-doc__a11y-list">
                <li>Always include a legend with labels</li>
                <li>Use sufficient color contrast between segments</li>
                <li>Don't rely on color alone - include percentages/values</li>
                <li>Consider providing data table for screen readers</li>
              </ul>
            </section>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .segmented-progress-doc {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--ax-spacing-xl, 1.5rem);
      }

      .segmented-progress-doc__tabs {
        margin-top: var(--ax-spacing-xl, 1.5rem);
      }

      .segmented-progress-doc__tab-content {
        padding: var(--ax-spacing-xl, 1.5rem) 0;
      }

      .segmented-progress-doc__section {
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

      .segmented-progress-doc__demo-card {
        background-color: var(--ax-background-default);
        border: 1px solid var(--ax-border-default);
      }

      .segmented-progress-doc__kpi-card {
        width: 280px;
        background-color: var(--ax-background-default);
        border: 1px solid var(--ax-border-default);
      }

      .segmented-progress-doc__sales-card {
        max-width: 600px;
        background-color: var(--ax-background-default);
        border: 1px solid var(--ax-border-default);
      }

      /* API Table */
      .segmented-progress-doc__api-table {
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

      /* Guidelines */
      .segmented-progress-doc__guidelines {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--ax-spacing-lg, 1rem);
      }

      .segmented-progress-doc__guideline {
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

      .segmented-progress-doc__guideline--do {
        background: var(--ax-success-faint);

        h4 {
          color: var(--ax-success-emphasis);
        }
        li {
          color: var(--ax-success-emphasis);
        }
      }

      .segmented-progress-doc__guideline--dont {
        background: var(--ax-error-faint);

        h4 {
          color: var(--ax-error-emphasis);
        }
        li {
          color: var(--ax-error-emphasis);
        }
      }

      .segmented-progress-doc__a11y-list {
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
export class SegmentedProgressDemoComponent {
  // Sample segment data
  ticketSegments: ProgressSegment[] = [
    {
      label: 'Resolved',
      value: 203,
      percentage: 82,
      color: 'var(--ax-info-default)',
    },
    {
      label: 'Progress',
      value: 32,
      percentage: 13,
      color: 'var(--ax-text-secondary)',
    },
    {
      label: 'Escalated',
      value: 12,
      percentage: 5,
      color: 'var(--ax-error)',
    },
  ];

  querySegments: ProgressSegment[] = [
    {
      label: 'Optimized',
      value: 25511,
      percentage: 57,
      color: 'var(--ax-info-default)',
    },
    {
      label: 'Editing',
      value: 5371,
      percentage: 12,
      color: 'var(--ax-text-secondary)',
    },
    {
      label: 'Slow',
      value: 13875,
      percentage: 31,
      color: 'var(--ax-error)',
    },
  ];

  latencySegments: ProgressSegment[] = [
    {
      label: 'Fast',
      value: 935,
      percentage: 75,
      color: 'var(--ax-info-default)',
    },
    {
      label: 'Medium',
      value: 249,
      percentage: 20,
      color: 'var(--ax-text-secondary)',
    },
    {
      label: 'Slow',
      value: 62,
      percentage: 5,
      color: 'var(--ax-error)',
    },
  ];

  salesSegments: ProgressSegment[] = [
    {
      label: 'Direct sales',
      value: 100500,
      percentage: 34.4,
      color: 'var(--ax-info-default)',
    },
    {
      label: 'Retail stores',
      value: 89500,
      percentage: 30.6,
      color: 'var(--ax-warning-default)',
    },
    {
      label: 'E-commerce',
      value: 61200,
      percentage: 20.9,
      color: 'var(--ax-cyan)',
    },
    {
      label: 'Wholesale',
      value: 41200,
      percentage: 14.1,
      color: 'var(--ax-text-secondary)',
    },
  ];

  avgTokenSegments: ProgressSegment[] = [
    {
      label: 'Completion tokens',
      value: 136,
      percentage: 39.9,
      color: 'var(--ax-cyan)',
    },
    {
      label: 'Prompt tokens',
      value: 205,
      percentage: 60.1,
      color: 'var(--ax-purple)',
    },
  ];

  totalTokenSegments: ProgressSegment[] = [
    {
      label: 'Completion tokens',
      value: 1480,
      percentage: 35,
      color: 'var(--ax-cyan)',
    },
    {
      label: 'Prompt tokens',
      value: 2749,
      percentage: 65,
      color: 'var(--ax-purple)',
    },
  ];

  // Code examples
  basicUsageCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-segmented-progress
  [segments]="ticketSegments"
  size="md"
  legendPosition="bottom">
</ax-segmented-progress>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxSegmentedProgressComponent, ProgressSegment } from '@aegisx/ui';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [AxSegmentedProgressComponent],
  template: \`
    <ax-segmented-progress
      [segments]="ticketSegments"
      size="md"
      legendPosition="bottom">
    </ax-segmented-progress>
  \`,
})
export class MyComponent {
  ticketSegments: ProgressSegment[] = [
    { label: 'Resolved', value: 203, percentage: 82, color: 'var(--ax-info-default)' },
    { label: 'Progress', value: 32, percentage: 13, color: 'var(--ax-text-secondary)' },
    { label: 'Escalated', value: 12, percentage: 5, color: 'var(--ax-error)' },
  ];
}`,
    },
  ];

  sizesCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Small (6px) -->
<ax-segmented-progress [segments]="segments" size="sm"></ax-segmented-progress>

<!-- Medium (8px) -->
<ax-segmented-progress [segments]="segments" size="md"></ax-segmented-progress>

<!-- Large (12px) -->
<ax-segmented-progress [segments]="segments" size="lg"></ax-segmented-progress>`,
    },
  ];

  ticketStatusCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<mat-card class="kpi-card">
  <mat-card-content>
    <div class="text-sm text-secondary mb-2">Current Tickets</div>
    <div class="text-3xl font-semibold text-heading mb-4">247</div>
    <ax-segmented-progress
      [segments]="ticketSegments"
      size="md"
      legendPosition="bottom"
      [showPercentage]="false"
      [showValue]="false">
    </ax-segmented-progress>
  </mat-card-content>
</mat-card>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `ticketSegments: ProgressSegment[] = [
  { label: 'Resolved', value: 203, percentage: 82, color: 'var(--ax-info-default)' },
  { label: 'Progress', value: 32, percentage: 13, color: 'var(--ax-text-secondary)' },
  { label: 'Escalated', value: 12, percentage: 5, color: 'var(--ax-error)' },
];`,
    },
  ];

  salesCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-segmented-progress
  [segments]="salesSegments"
  size="lg"
  rounded="full"
  legendPosition="bottom"
  [showPercentage]="true"
  [showValue]="true"
  [gap]="4">
</ax-segmented-progress>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `salesSegments: ProgressSegment[] = [
  { label: 'Direct sales', value: 100500, percentage: 34.4, color: 'var(--ax-info-default)' },
  { label: 'Retail stores', value: 89500, percentage: 30.6, color: 'var(--ax-warning-default)' },
  { label: 'E-commerce', value: 61200, percentage: 20.9, color: 'var(--ax-cyan)' },
  { label: 'Wholesale', value: 41200, percentage: 14.1, color: 'var(--ax-text-secondary)' },
];`,
    },
  ];

  tokenUsageCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-segmented-progress
  [segments]="tokenSegments"
  size="md"
  rounded="sm"
  legendPosition="bottom"
  [gap]="0">
</ax-segmented-progress>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `tokenSegments: ProgressSegment[] = [
  { label: 'Completion tokens', value: 136, percentage: 39.9, color: 'var(--ax-cyan)' },
  { label: 'Prompt tokens', value: 205, percentage: 60.1, color: 'var(--ax-purple)' },
];`,
    },
  ];

  // Design tokens
  segmentedProgressTokens: ComponentToken[] = [
    {
      category: 'Colors',
      cssVar: '--ax-info-default',
      usage: 'Default/primary segment color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-success-default',
      usage: 'Success/positive segment color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-warning-default',
      usage: 'Warning segment color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-error',
      usage: 'Error/negative segment color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-secondary',
      usage: 'Neutral/in-progress segment color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-cyan',
      usage: 'Additional accent color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-purple',
      usage: 'Additional accent color',
    },
    {
      category: 'Typography',
      cssVar: '--ax-text-xs',
      usage: 'Legend text size',
    },
    {
      category: 'Typography',
      cssVar: '--ax-text-sm',
      usage: 'Legend label size',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-xs',
      usage: 'Segment gap',
    },
    {
      category: 'Borders',
      cssVar: '--ax-radius-sm',
      usage: 'Small rounded corners',
    },
    {
      category: 'Borders',
      cssVar: '--ax-radius-full',
      usage: 'Full rounded corners',
    },
  ];
}
