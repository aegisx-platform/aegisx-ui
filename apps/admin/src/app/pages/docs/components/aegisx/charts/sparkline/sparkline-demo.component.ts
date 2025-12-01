import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AxSparklineComponent, AxKpiCardComponent } from '@aegisx/ui';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../../../components/docs';
import { ComponentToken } from '../../../../../../types/docs.types';

@Component({
  selector: 'app-sparkline-demo',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatCardModule,
    AxSparklineComponent,
    AxKpiCardComponent,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="sparkline-doc">
      <ax-doc-header
        title="Sparkline"
        icon="show_chart"
        description="Lightweight SVG-based sparkline charts for displaying trends inline with metrics. Perfect for dashboards and KPI cards."
        [breadcrumbs]="[
          { label: 'Charts', link: '/docs/components/aegisx/charts/sparkline' },
          { label: 'Sparkline' },
        ]"
        status="stable"
        version="1.0.0"
        importStatement="import { AxSparklineComponent } from '@aegisx/ui';"
      ></ax-doc-header>

      <mat-tab-group class="sparkline-doc__tabs" animationDuration="150ms">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="sparkline-doc__tab-content">
            <section class="sparkline-doc__section">
              <h2>Basic Usage</h2>
              <p>
                The Sparkline component provides a lightweight SVG-based mini
                chart for displaying trends. Perfect for inline metrics and
                dashboard KPIs.
              </p>

              <ax-live-preview variant="bordered">
                <ax-sparkline
                  [data]="sampleData"
                  variant="line"
                  size="md"
                  color="var(--ax-info-default)"
                >
                </ax-sparkline>
              </ax-live-preview>

              <ax-code-tabs [tabs]="basicUsageCode"></ax-code-tabs>
            </section>

            <section class="sparkline-doc__section">
              <h2>Variants</h2>
              <p>Sparklines support two visual variants: line and area.</p>

              <ax-live-preview
                variant="bordered"
                direction="row"
                [wrap]="true"
                gap="var(--ax-spacing-xl)"
              >
                <div class="sparkline-doc__demo-item">
                  <div class="text-sm font-medium mb-2">Line Variant</div>
                  <ax-sparkline
                    [data]="trendData"
                    variant="line"
                    size="md"
                    color="var(--ax-info-default)"
                    [strokeWidth]="2"
                  >
                  </ax-sparkline>
                </div>

                <div class="sparkline-doc__demo-item">
                  <div class="text-sm font-medium mb-2">Area Variant</div>
                  <ax-sparkline
                    [data]="trendData"
                    variant="area"
                    size="md"
                    color="var(--ax-info-default)"
                    [fillOpacity]="0.3"
                  >
                  </ax-sparkline>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="variantsCode"></ax-code-tabs>
            </section>

            <section class="sparkline-doc__section">
              <h2>Sizes</h2>
              <p>Control the sparkline height with the size input.</p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-lg)"
              >
                <div class="sparkline-doc__size-item">
                  <span class="text-sm font-medium w-32">Small (24px)</span>
                  <ax-sparkline
                    [data]="sampleData"
                    variant="line"
                    size="sm"
                    color="var(--ax-info-default)"
                  >
                  </ax-sparkline>
                </div>

                <div class="sparkline-doc__size-item">
                  <span class="text-sm font-medium w-32">Medium (40px)</span>
                  <ax-sparkline
                    [data]="sampleData"
                    variant="line"
                    size="md"
                    color="var(--ax-info-default)"
                  >
                  </ax-sparkline>
                </div>

                <div class="sparkline-doc__size-item">
                  <span class="text-sm font-medium w-32">Large (60px)</span>
                  <ax-sparkline
                    [data]="sampleData"
                    variant="line"
                    size="lg"
                    color="var(--ax-info-default)"
                  >
                  </ax-sparkline>
                </div>
              </ax-live-preview>
            </section>

            <section class="sparkline-doc__section">
              <h2>Color Variants</h2>
              <p>Use semantic colors to convey meaning.</p>

              <ax-live-preview
                variant="bordered"
                direction="row"
                [wrap]="true"
                gap="var(--ax-spacing-lg)"
              >
                <div class="sparkline-doc__color-item">
                  <ax-sparkline
                    [data]="sampleData"
                    variant="area"
                    size="md"
                    color="var(--ax-info-default)"
                  >
                  </ax-sparkline>
                  <span class="text-xs text-secondary mt-2">Info</span>
                </div>

                <div class="sparkline-doc__color-item">
                  <ax-sparkline
                    [data]="sampleData"
                    variant="area"
                    size="md"
                    color="var(--ax-success-default)"
                  >
                  </ax-sparkline>
                  <span class="text-xs text-secondary mt-2">Success</span>
                </div>

                <div class="sparkline-doc__color-item">
                  <ax-sparkline
                    [data]="sampleData"
                    variant="area"
                    size="md"
                    color="var(--ax-warning-default)"
                  >
                  </ax-sparkline>
                  <span class="text-xs text-secondary mt-2">Warning</span>
                </div>

                <div class="sparkline-doc__color-item">
                  <ax-sparkline
                    [data]="sampleData"
                    variant="area"
                    size="md"
                    color="var(--ax-error)"
                  >
                  </ax-sparkline>
                  <span class="text-xs text-secondary mt-2">Error</span>
                </div>
              </ax-live-preview>
            </section>

            <section class="sparkline-doc__section">
              <h2>Smooth vs Linear</h2>
              <p>
                Toggle between smooth curves and straight line interpolation.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="row"
                [wrap]="true"
                gap="var(--ax-spacing-xl)"
              >
                <div class="sparkline-doc__demo-item">
                  <div class="text-sm font-medium mb-2">Smooth Curves</div>
                  <ax-sparkline
                    [data]="volatileData"
                    variant="line"
                    size="lg"
                    color="var(--ax-info-default)"
                    [smooth]="true"
                    [strokeWidth]="2"
                  >
                  </ax-sparkline>
                </div>

                <div class="sparkline-doc__demo-item">
                  <div class="text-sm font-medium mb-2">Straight Lines</div>
                  <ax-sparkline
                    [data]="volatileData"
                    variant="line"
                    size="lg"
                    color="var(--ax-info-default)"
                    [smooth]="false"
                    [strokeWidth]="2"
                  >
                  </ax-sparkline>
                </div>
              </ax-live-preview>
            </section>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="sparkline-doc__tab-content">
            <section class="sparkline-doc__section">
              <h2>KPI Cards with Sparklines</h2>
              <p>Combine sparklines with KPI metrics for dashboard displays.</p>

              <ax-live-preview
                variant="bordered"
                direction="row"
                [wrap]="true"
                gap="var(--ax-spacing-lg)"
              >
                <!-- Revenue Card -->
                <mat-card class="sparkline-doc__kpi-card">
                  <mat-card-content>
                    <div class="flex items-baseline justify-between mb-2">
                      <span class="text-sm text-secondary">Revenue</span>
                      <span class="text-sm font-medium text-success"
                        >+12.5%</span
                      >
                    </div>
                    <div class="text-3xl font-semibold text-heading mb-3">
                      $45,231
                    </div>
                    <ax-sparkline
                      [data]="revenueData"
                      variant="area"
                      size="lg"
                      color="var(--ax-success-default)"
                      [fillOpacity]="0.2"
                    >
                    </ax-sparkline>
                  </mat-card-content>
                </mat-card>

                <!-- Users Card -->
                <mat-card class="sparkline-doc__kpi-card">
                  <mat-card-content>
                    <div class="flex items-baseline justify-between mb-2">
                      <span class="text-sm text-secondary">Active Users</span>
                      <span class="text-sm font-medium text-info">+8.3%</span>
                    </div>
                    <div class="text-3xl font-semibold text-heading mb-3">
                      2,543
                    </div>
                    <ax-sparkline
                      [data]="usersData"
                      variant="area"
                      size="lg"
                      color="var(--ax-info-default)"
                      [fillOpacity]="0.2"
                    >
                    </ax-sparkline>
                  </mat-card-content>
                </mat-card>

                <!-- Orders Card -->
                <mat-card class="sparkline-doc__kpi-card">
                  <mat-card-content>
                    <div class="flex items-baseline justify-between mb-2">
                      <span class="text-sm text-secondary">Orders</span>
                      <span class="text-sm font-medium text-error">-3.2%</span>
                    </div>
                    <div class="text-3xl font-semibold text-heading mb-3">
                      892
                    </div>
                    <ax-sparkline
                      [data]="ordersData"
                      variant="area"
                      size="lg"
                      color="var(--ax-error)"
                      [fillOpacity]="0.2"
                    >
                    </ax-sparkline>
                  </mat-card-content>
                </mat-card>
              </ax-live-preview>

              <ax-code-tabs [tabs]="kpiCardsCode"></ax-code-tabs>
            </section>

            <section class="sparkline-doc__section">
              <h2>Stock Ticker Cards</h2>
              <p>
                Complete stock ticker cards with company info, price, change,
                and sparkline trend.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="row"
                [wrap]="true"
                gap="var(--ax-spacing-lg)"
              >
                <!-- Amazon Stock -->
                <mat-card class="sparkline-doc__stock-card">
                  <mat-card-content>
                    <div class="flex items-center justify-between gap-4">
                      <div class="flex-shrink-0">
                        <div class="text-sm font-semibold text-heading">
                          AMZN
                        </div>
                        <div class="text-xs text-secondary">
                          Amazon.com Inc.
                        </div>
                      </div>
                      <div class="flex items-center gap-3 flex-1 justify-end">
                        <div class="text-right">
                          <div class="text-lg font-semibold text-heading">
                            $178.25
                          </div>
                          <div class="text-xs font-medium text-success">
                            +$4.75 (+2.74%)
                          </div>
                        </div>
                        <ax-sparkline
                          [data]="amznData"
                          variant="area"
                          size="sm"
                          color="var(--ax-success-default)"
                          [fillOpacity]="0.15"
                          [smooth]="true"
                        >
                        </ax-sparkline>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>

                <!-- Tesla Stock -->
                <mat-card class="sparkline-doc__stock-card">
                  <mat-card-content>
                    <div class="flex items-center justify-between gap-4">
                      <div class="flex-shrink-0">
                        <div class="text-sm font-semibold text-heading">
                          TSLA
                        </div>
                        <div class="text-xs text-secondary">Tesla Inc.</div>
                      </div>
                      <div class="flex items-center gap-3 flex-1 justify-end">
                        <div class="text-right">
                          <div class="text-lg font-semibold text-heading">
                            $231.75
                          </div>
                          <div class="text-xs font-medium text-error">
                            -$6.25 (-2.62%)
                          </div>
                        </div>
                        <ax-sparkline
                          [data]="tslaData"
                          variant="area"
                          size="sm"
                          color="var(--ax-error)"
                          [fillOpacity]="0.15"
                          [smooth]="true"
                        >
                        </ax-sparkline>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>

                <!-- Google Stock -->
                <mat-card class="sparkline-doc__stock-card">
                  <mat-card-content>
                    <div class="flex items-center justify-between gap-4">
                      <div class="flex-shrink-0">
                        <div class="text-sm font-semibold text-heading">
                          GOOGL
                        </div>
                        <div class="text-xs text-secondary">Alphabet Inc.</div>
                      </div>
                      <div class="flex items-center gap-3 flex-1 justify-end">
                        <div class="text-right">
                          <div class="text-lg font-semibold text-heading">
                            $149.85
                          </div>
                          <div class="text-xs font-medium text-success">
                            +$3.65 (+2.50%)
                          </div>
                        </div>
                        <ax-sparkline
                          [data]="googlData"
                          variant="area"
                          size="sm"
                          color="var(--ax-success-default)"
                          [fillOpacity]="0.15"
                          [smooth]="true"
                        >
                        </ax-sparkline>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>
              </ax-live-preview>

              <ax-code-tabs [tabs]="stockTickerCode"></ax-code-tabs>
            </section>

            <section class="sparkline-doc__section">
              <h2>Custom Width</h2>
              <p>
                Use customWidth to control sparkline width with pixels or
                percentages.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="row"
                [wrap]="true"
                gap="var(--ax-spacing-lg)"
              >
                <mat-card class="sparkline-doc__width-card">
                  <mat-card-content>
                    <div class="text-sm text-secondary mb-2">Fixed 200px</div>
                    <ax-sparkline
                      [data]="revenueData"
                      variant="area"
                      size="md"
                      color="var(--ax-info-default)"
                      [fillOpacity]="0.2"
                      customWidth="200px"
                    >
                    </ax-sparkline>
                  </mat-card-content>
                </mat-card>

                <mat-card class="sparkline-doc__width-card">
                  <mat-card-content>
                    <div class="text-sm text-secondary mb-2">50% Width</div>
                    <ax-sparkline
                      [data]="revenueData"
                      variant="area"
                      size="md"
                      color="var(--ax-success-default)"
                      [fillOpacity]="0.2"
                      customWidth="50%"
                    >
                    </ax-sparkline>
                  </mat-card-content>
                </mat-card>
              </ax-live-preview>

              <ax-code-tabs [tabs]="customWidthCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="sparkline-doc__tab-content">
            <section class="sparkline-doc__section">
              <h2>Properties</h2>
              <div class="sparkline-doc__api-table">
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
                      <td><code>data</code></td>
                      <td><code>number[]</code></td>
                      <td><code>[]</code></td>
                      <td>Array of data points for the sparkline</td>
                    </tr>
                    <tr>
                      <td><code>variant</code></td>
                      <td><code>'line' | 'area'</code></td>
                      <td><code>'line'</code></td>
                      <td>Visual style of the sparkline</td>
                    </tr>
                    <tr>
                      <td><code>size</code></td>
                      <td><code>'sm' | 'md' | 'lg'</code></td>
                      <td><code>'md'</code></td>
                      <td>Sparkline height (24px, 40px, 60px)</td>
                    </tr>
                    <tr>
                      <td><code>color</code></td>
                      <td><code>string</code></td>
                      <td><code>'var(--ax-info-default)'</code></td>
                      <td>Line/area color (CSS variable or hex)</td>
                    </tr>
                    <tr>
                      <td><code>strokeWidth</code></td>
                      <td><code>number</code></td>
                      <td><code>2</code></td>
                      <td>Line stroke width in pixels</td>
                    </tr>
                    <tr>
                      <td><code>fillOpacity</code></td>
                      <td><code>number</code></td>
                      <td><code>0.2</code></td>
                      <td>Area fill opacity (0-1)</td>
                    </tr>
                    <tr>
                      <td><code>smooth</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Use smooth curves or straight lines</td>
                    </tr>
                    <tr>
                      <td><code>showDots</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Show dots on data points</td>
                    </tr>
                    <tr>
                      <td><code>dotRadius</code></td>
                      <td><code>number</code></td>
                      <td><code>3</code></td>
                      <td>Radius of data point dots</td>
                    </tr>
                    <tr>
                      <td><code>showValue</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Show value tooltip on hover</td>
                    </tr>
                    <tr>
                      <td><code>customWidth</code></td>
                      <td><code>string</code></td>
                      <td><code>undefined</code></td>
                      <td>Custom width (e.g., "200px", "50%")</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="sparkline-doc__section">
              <h2>Usage Notes</h2>
              <ul class="sparkline-doc__usage-list">
                <li>
                  Data is automatically normalized to fit within the SVG viewBox
                </li>
                <li>
                  By default, sparklines take 100% width of their container
                </li>
                <li>
                  Use <code>customWidth</code> to set specific pixel or
                  percentage widths
                </li>
                <li>
                  Hover over data points to see values (when
                  <code>showValue</code> is true)
                </li>
              </ul>
            </section>
          </div>
        </mat-tab>

        <!-- Tokens Tab -->
        <mat-tab label="Tokens">
          <div class="sparkline-doc__tab-content">
            <ax-component-tokens
              [tokens]="sparklineTokens"
            ></ax-component-tokens>
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="sparkline-doc__tab-content">
            <section class="sparkline-doc__section">
              <h2>Do's and Don'ts</h2>

              <div class="sparkline-doc__guidelines">
                <div
                  class="sparkline-doc__guideline sparkline-doc__guideline--do"
                >
                  <h4><mat-icon>check_circle</mat-icon> Do</h4>
                  <ul>
                    <li>Use sparklines for showing trends, not exact values</li>
                    <li>Keep data point count between 5-30 for best results</li>
                    <li>
                      Use semantic colors to convey meaning (success/error)
                    </li>
                    <li>Pair with numeric KPIs for context</li>
                    <li>
                      Use area variant for positive metrics, line for neutral
                    </li>
                    <li>Match sparkline color to related UI elements</li>
                  </ul>
                </div>

                <div
                  class="sparkline-doc__guideline sparkline-doc__guideline--dont"
                >
                  <h4><mat-icon>cancel</mat-icon> Don't</h4>
                  <ul>
                    <li>Use for precise data comparison</li>
                    <li>Include too many data points (100+)</li>
                    <li>Use multiple colors within a single sparkline</li>
                    <li>Make sparklines too small to see trends</li>
                    <li>Use without supporting metrics or labels</li>
                    <li>Mix sparkline and full chart in same context</li>
                  </ul>
                </div>
              </div>
            </section>

            <section class="sparkline-doc__section">
              <h2>Use Cases</h2>
              <ul class="sparkline-doc__a11y-list">
                <li>
                  <strong>Dashboard KPIs</strong> - Show revenue, user, or order
                  trends
                </li>
                <li>
                  <strong>Stock Tickers</strong> - Display price movements
                  inline
                </li>
                <li>
                  <strong>Server Metrics</strong> - CPU, memory, response time
                  trends
                </li>
                <li>
                  <strong>Analytics</strong> - Page views, conversion rate
                  trends
                </li>
                <li>
                  <strong>Tables</strong> - Inline trends in data table cells
                </li>
              </ul>
            </section>

            <section class="sparkline-doc__section">
              <h2>Accessibility</h2>
              <ul class="sparkline-doc__a11y-list">
                <li>
                  Sparklines are decorative and should have supporting text
                  metrics
                </li>
                <li>
                  Use sufficient color contrast for the sparkline line/fill
                </li>
                <li>
                  Provide text alternatives when sparkline represents important
                  data
                </li>
                <li>Consider providing data tables for screen readers</li>
              </ul>
            </section>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .sparkline-doc {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--ax-spacing-xl, 1.5rem);
      }

      .sparkline-doc__tabs {
        margin-top: var(--ax-spacing-xl, 1.5rem);
      }

      .sparkline-doc__tab-content {
        padding: var(--ax-spacing-xl, 1.5rem) 0;
      }

      .sparkline-doc__section {
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

      .sparkline-doc__demo-item {
        min-width: 200px;
      }

      .sparkline-doc__size-item {
        display: flex;
        align-items: center;
        gap: var(--ax-spacing-lg, 1rem);
      }

      .sparkline-doc__color-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 120px;
      }

      .sparkline-doc__kpi-card {
        width: 260px;
        background-color: var(--ax-background-default);
        border: 1px solid var(--ax-border-default);
      }

      .sparkline-doc__stock-card {
        width: 320px;
        background-color: var(--ax-background-default);
        border: 1px solid var(--ax-border-default);
      }

      .sparkline-doc__width-card {
        min-width: 280px;
        background-color: var(--ax-background-default);
        border: 1px solid var(--ax-border-default);
      }

      /* API Table */
      .sparkline-doc__api-table {
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

      .sparkline-doc__usage-list {
        margin: 0;
        padding-left: var(--ax-spacing-lg, 1rem);

        li {
          font-size: var(--ax-text-sm, 0.875rem);
          color: var(--ax-text-secondary);
          margin-bottom: var(--ax-spacing-sm, 0.5rem);

          code {
            font-family: var(--ax-font-mono);
            font-size: var(--ax-text-xs, 0.75rem);
            background: var(--ax-background-subtle);
            padding: 2px 6px;
            border-radius: var(--ax-radius-sm, 0.25rem);
          }
        }
      }

      /* Guidelines */
      .sparkline-doc__guidelines {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--ax-spacing-lg, 1rem);
      }

      .sparkline-doc__guideline {
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

      .sparkline-doc__guideline--do {
        background: var(--ax-success-faint);

        h4 {
          color: var(--ax-success-emphasis);
        }
        li {
          color: var(--ax-success-emphasis);
        }
      }

      .sparkline-doc__guideline--dont {
        background: var(--ax-error-faint);

        h4 {
          color: var(--ax-error-emphasis);
        }
        li {
          color: var(--ax-error-emphasis);
        }
      }

      .sparkline-doc__a11y-list {
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
export class SparklineDemoComponent {
  // Sample data for demos
  sampleData = [10, 30, 20, 50, 40, 60, 55, 70];
  trendData = [1500, 2100, 1800, 2400, 2800, 2600, 3000, 2845];
  volatileData = [20, 45, 28, 60, 35, 75, 40, 85, 50, 90, 65, 95];
  revenueData = [28000, 32000, 29500, 35000, 38000, 36000, 40000, 42000, 45231];
  usersData = [1800, 1950, 2100, 2050, 2200, 2300, 2400, 2500, 2543];
  ordersData = [950, 920, 900, 880, 910, 905, 895, 900, 892];

  // Stock ticker data
  amznData = [165.5, 167.2, 169.8, 171.5, 170.3, 173.8, 175.2, 176.5, 178.25];
  tslaData = [248.5, 245.3, 242.8, 240.5, 238.2, 236.5, 234.8, 233.2, 231.75];
  googlData = [138.5, 140.2, 139.8, 142.5, 143.8, 145.2, 146.8, 148.5, 149.85];

  // Code examples
  basicUsageCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-sparkline
  [data]="[10, 30, 20, 50, 40, 60, 55, 70]"
  variant="line"
  size="md"
  color="var(--ax-info-default)">
</ax-sparkline>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxSparklineComponent } from '@aegisx/ui';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [AxSparklineComponent],
  template: \`
    <ax-sparkline
      [data]="chartData"
      variant="line"
      size="md"
      color="var(--ax-info-default)">
    </ax-sparkline>
  \`,
})
export class MyComponent {
  chartData = [10, 30, 20, 50, 40, 60, 55, 70];
}`,
    },
  ];

  variantsCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Line Variant -->
<ax-sparkline
  [data]="data"
  variant="line"
  size="md"
  color="var(--ax-info-default)"
  [strokeWidth]="2">
</ax-sparkline>

<!-- Area Variant -->
<ax-sparkline
  [data]="data"
  variant="area"
  size="md"
  color="var(--ax-info-default)"
  [fillOpacity]="0.3">
</ax-sparkline>`,
    },
  ];

  kpiCardsCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<mat-card class="kpi-card">
  <mat-card-content>
    <div class="flex items-baseline justify-between mb-2">
      <span class="text-sm text-secondary">Revenue</span>
      <span class="text-sm font-medium text-success">+12.5%</span>
    </div>
    <div class="text-3xl font-semibold text-heading mb-3">
      $45,231
    </div>
    <ax-sparkline
      [data]="revenueData"
      variant="area"
      size="lg"
      color="var(--ax-success-default)"
      [fillOpacity]="0.2">
    </ax-sparkline>
  </mat-card-content>
</mat-card>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `revenueData = [28000, 32000, 29500, 35000, 38000, 36000, 40000, 42000, 45231];`,
    },
  ];

  stockTickerCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<mat-card class="stock-card">
  <mat-card-content>
    <div class="flex items-center justify-between gap-4">
      <div class="flex-shrink-0">
        <div class="text-sm font-semibold text-heading">AMZN</div>
        <div class="text-xs text-secondary">Amazon.com Inc.</div>
      </div>
      <div class="flex items-center gap-3 flex-1 justify-end">
        <div class="text-right">
          <div class="text-lg font-semibold text-heading">$178.25</div>
          <div class="text-xs font-medium text-success">+$4.75 (+2.74%)</div>
        </div>
        <ax-sparkline
          [data]="stockData"
          variant="area"
          size="sm"
          color="var(--ax-success-default)"
          [fillOpacity]="0.15"
          [smooth]="true">
        </ax-sparkline>
      </div>
    </div>
  </mat-card-content>
</mat-card>`,
    },
  ];

  customWidthCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Default: 100% width -->
<ax-sparkline
  [data]="data"
  variant="area"
  size="md">
</ax-sparkline>

<!-- Fixed pixel width -->
<ax-sparkline
  [data]="data"
  variant="area"
  size="md"
  customWidth="200px">
</ax-sparkline>

<!-- Percentage width -->
<ax-sparkline
  [data]="data"
  variant="area"
  size="md"
  customWidth="50%">
</ax-sparkline>`,
    },
  ];

  // Design tokens
  sparklineTokens: ComponentToken[] = [
    {
      category: 'Colors',
      cssVar: '--ax-info-default',
      usage: 'Default sparkline color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-success-default',
      usage: 'Positive trend color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-error',
      usage: 'Negative trend color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-warning-default',
      usage: 'Warning/caution trend color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-heading',
      usage: 'Tooltip text color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-background-default',
      usage: 'Tooltip background',
    },
    {
      category: 'Borders',
      cssVar: '--ax-border-default',
      usage: 'Tooltip border color',
    },
    {
      category: 'Borders',
      cssVar: '--ax-radius-sm',
      usage: 'Tooltip border radius',
    },
    {
      category: 'Shadows',
      cssVar: '--ax-shadow-sm',
      usage: 'Tooltip shadow',
    },
    {
      category: 'Typography',
      cssVar: '--ax-text-xs',
      usage: 'Tooltip text size',
    },
  ];
}
