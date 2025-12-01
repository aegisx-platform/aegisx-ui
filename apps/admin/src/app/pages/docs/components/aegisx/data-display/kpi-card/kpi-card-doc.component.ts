import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { AxKpiCardComponent } from '@aegisx/ui';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../../../components/docs';
import { ComponentToken } from '../../../../../../types/docs.types';

@Component({
  selector: 'ax-kpi-card-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    AxKpiCardComponent,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="kpi-card-doc">
      <ax-doc-header
        title="KPI Card"
        icon="analytics"
        description="Specialized card for displaying Key Performance Indicators with support for trends, badges, progress bars, and visual accents."
        [breadcrumbs]="[
          {
            label: 'Data Display',
            link: '/docs/components/aegisx/data-display/card',
          },
          { label: 'KPI Card' },
        ]"
        status="stable"
        version="1.1.0"
        importStatement="import { AxKpiCardComponent } from '@aegisx/ui';"
      ></ax-doc-header>

      <mat-tab-group class="kpi-card-doc__tabs" animationDuration="150ms">
        <!-- ============================================================== -->
        <!-- OVERVIEW TAB - Simple demos showing all variants -->
        <!-- ============================================================== -->
        <mat-tab label="Overview">
          <div class="kpi-card-doc__tab-content">
            <!-- Introduction -->
            <section class="kpi-card-doc__section">
              <h2>Overview</h2>
              <p>
                KPI Cards are specialized cards designed for displaying Key
                Performance Indicators. They support multiple variants including
                simple metrics, badges, accents, progress bars, and segmented
                progress displays.
              </p>

              <!-- All Variants Showcase -->
              <ax-live-preview
                variant="bordered"
                direction="row"
                [wrap]="true"
                gap="var(--ax-spacing-lg)"
              >
                <!-- Simple -->
                <ax-kpi-card label="Simple" value="$45,231" [change]="12.5">
                </ax-kpi-card>

                <!-- Badge -->
                <ax-kpi-card
                  variant="badge"
                  label="Badge"
                  value="3,450"
                  badge="+12.1%"
                  badgeType="success"
                >
                </ax-kpi-card>

                <!-- Accent -->
                <ax-kpi-card
                  variant="accent"
                  label="Accent"
                  value="1,234"
                  accentColor="primary"
                >
                </ax-kpi-card>

                <!-- Visual Indicator -->
                <ax-kpi-card
                  variant="visual-indicator"
                  label="Visual Indicator"
                  value="450 GB"
                  [barsFilled]="2"
                  [barsTotal]="3"
                  barColor="info"
                  supplementary="450/752 GB"
                >
                </ax-kpi-card>

                <!-- Progress -->
                <ax-kpi-card
                  variant="progress"
                  label="Progress"
                  value="996"
                  [progress]="9.96"
                  progressColor="info"
                  progressLabel="996 of 10,000"
                >
                </ax-kpi-card>

                <!-- Segmented -->
                <ax-kpi-card
                  variant="segmented"
                  label="Segmented"
                  value="247"
                  [segments]="ticketSegments"
                >
                </ax-kpi-card>
              </ax-live-preview>

              <ax-code-tabs [tabs]="overviewCode"></ax-code-tabs>
            </section>

            <!-- Sizes -->
            <section class="kpi-card-doc__section">
              <h2>Sizes</h2>
              <p>
                KPI Cards are available in three sizes: small, medium (default),
                and large.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="row"
                [wrap]="true"
                gap="var(--ax-spacing-lg)"
              >
                <ax-kpi-card
                  size="sm"
                  label="Small"
                  value="1,234"
                ></ax-kpi-card>
                <ax-kpi-card
                  size="md"
                  label="Medium"
                  value="5,678"
                ></ax-kpi-card>
                <ax-kpi-card
                  size="lg"
                  label="Large"
                  value="9,012"
                ></ax-kpi-card>
              </ax-live-preview>
            </section>

            <!-- Interactive -->
            <section class="kpi-card-doc__section">
              <h2>Interactive</h2>
              <p>
                Cards can be made hoverable and clickable for interactive
                dashboards.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="row"
                [wrap]="true"
                gap="var(--ax-spacing-lg)"
              >
                <ax-kpi-card
                  [hoverable]="true"
                  label="Hoverable"
                  value="$12,345"
                  subtitle="Hover to see effect"
                >
                </ax-kpi-card>

                <ax-kpi-card
                  [hoverable]="true"
                  [clickable]="true"
                  label="Clickable"
                  value="Click me"
                  subtitle="Click for details"
                >
                </ax-kpi-card>
              </ax-live-preview>
            </section>
          </div>
        </mat-tab>

        <!-- ============================================================== -->
        <!-- EXAMPLES TAB - Complete real-world examples with code -->
        <!-- ============================================================== -->
        <mat-tab label="Examples">
          <div class="kpi-card-doc__tab-content">
            <!-- Example 1: Analytics Dashboard -->
            <section class="kpi-card-doc__section">
              <h2>Analytics Dashboard</h2>
              <p>
                Simple KPI cards with change indicators - perfect for overview
                dashboards showing key metrics with trend information.
              </p>

              <ax-live-preview variant="bordered">
                <div class="kpi-card-doc__dashboard-grid">
                  <ax-kpi-card
                    label="Unique visitors"
                    value="10,450"
                    [change]="-12.5"
                    changeLabel="vs last month"
                  >
                  </ax-kpi-card>

                  <ax-kpi-card
                    label="Bounce rate"
                    value="50.1%"
                    [change]="1.8"
                    changeLabel="vs last month"
                  >
                  </ax-kpi-card>

                  <ax-kpi-card
                    label="Page views"
                    value="443,231"
                    [change]="19.2"
                    changeLabel="vs last month"
                  >
                  </ax-kpi-card>

                  <ax-kpi-card
                    label="Avg. session"
                    value="3m 21s"
                    [change]="-5.3"
                    changeLabel="vs last month"
                  >
                  </ax-kpi-card>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="analyticsDashboardCode"></ax-code-tabs>
            </section>

            <!-- Example 2: User Engagement Metrics -->
            <section class="kpi-card-doc__section">
              <h2>User Engagement Metrics</h2>
              <p>
                Badge variant cards highlighting percentage changes prominently
                - ideal for user engagement and conversion tracking.
              </p>

              <ax-live-preview variant="bordered">
                <div class="kpi-card-doc__dashboard-grid">
                  <ax-kpi-card
                    variant="badge"
                    label="Daily Active Users"
                    value="3,450"
                    badge="+12.1%"
                    badgeType="success"
                  >
                  </ax-kpi-card>

                  <ax-kpi-card
                    variant="badge"
                    label="Monthly Active Users"
                    value="15,200"
                    badge="+8.5%"
                    badgeType="success"
                  >
                  </ax-kpi-card>

                  <ax-kpi-card
                    variant="badge"
                    label="Churn Rate"
                    value="2.3%"
                    badge="-0.5%"
                    badgeType="error"
                  >
                  </ax-kpi-card>

                  <ax-kpi-card
                    variant="badge"
                    label="NPS Score"
                    value="72"
                    badge="stable"
                    badgeType="info"
                  >
                  </ax-kpi-card>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="userEngagementCode"></ax-code-tabs>
            </section>

            <!-- Example 3: Business Performance -->
            <section class="kpi-card-doc__section">
              <h2>Business Performance</h2>
              <p>
                Accent variant with color-coded categories for quick visual
                scanning of different business metrics.
              </p>

              <ax-live-preview variant="bordered">
                <div class="kpi-card-doc__dashboard-grid">
                  <ax-kpi-card
                    variant="accent"
                    label="Total Revenue"
                    value="$128,430"
                    [change]="8.2"
                    accentColor="success"
                    accentPosition="left"
                  >
                  </ax-kpi-card>

                  <ax-kpi-card
                    variant="accent"
                    label="New Customers"
                    value="1,429"
                    [change]="12.5"
                    accentColor="primary"
                    accentPosition="left"
                  >
                  </ax-kpi-card>

                  <ax-kpi-card
                    variant="accent"
                    label="Pending Orders"
                    value="42"
                    [change]="-5"
                    accentColor="warning"
                    accentPosition="left"
                  >
                  </ax-kpi-card>

                  <ax-kpi-card
                    variant="accent"
                    label="Support Tickets"
                    value="18"
                    [change]="3"
                    accentColor="error"
                    accentPosition="left"
                  >
                  </ax-kpi-card>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="businessPerformanceCode"></ax-code-tabs>
            </section>

            <!-- Example 4: Visual Indicator Cards -->
            <section class="kpi-card-doc__section">
              <h2>Visual Indicator Cards</h2>
              <p>
                Visual indicator bars showing progress toward goals - great for
                quick status assessment at a glance.
              </p>

              <ax-live-preview variant="bordered">
                <div class="kpi-card-doc__dashboard-grid">
                  <ax-kpi-card
                    variant="visual-indicator"
                    label="Storage Used"
                    value="450 GB"
                    [barsFilled]="2"
                    [barsTotal]="3"
                    barColor="info"
                    supplementary="450/752 GB"
                  >
                  </ax-kpi-card>

                  <ax-kpi-card
                    variant="visual-indicator"
                    label="Tasks Complete"
                    value="75%"
                    [barsFilled]="3"
                    [barsTotal]="4"
                    barColor="success"
                    supplementary="18/24 tasks"
                  >
                  </ax-kpi-card>

                  <ax-kpi-card
                    variant="visual-indicator"
                    label="API Quota"
                    value="90%"
                    [barsFilled]="3"
                    [barsTotal]="3"
                    barColor="warning"
                    supplementary="9,000/10,000"
                  >
                  </ax-kpi-card>

                  <ax-kpi-card
                    variant="visual-indicator"
                    label="Critical Alerts"
                    value="5"
                    [barsFilled]="1"
                    [barsTotal]="5"
                    barColor="error"
                    supplementary="1/5 resolved"
                  >
                  </ax-kpi-card>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="visualIndicatorCode"></ax-code-tabs>
            </section>

            <!-- Example 5: Usage & Quota Cards -->
            <section class="kpi-card-doc__section">
              <h2>Usage & Quota Cards</h2>
              <p>
                Progress bar variant showing usage against limits - perfect for
                subscription plans, API usage, and resource monitoring.
              </p>

              <ax-live-preview variant="bordered">
                <div class="kpi-card-doc__dashboard-grid">
                  <ax-kpi-card
                    variant="progress"
                    label="API Requests"
                    value="996"
                    [progress]="9.96"
                    progressColor="info"
                    progressLabel="996 of 10,000"
                  >
                  </ax-kpi-card>

                  <ax-kpi-card
                    variant="progress"
                    label="Credits Used"
                    value="$672"
                    [progress]="67.2"
                    progressColor="warning"
                    progressLabel="$672 of $1,000"
                  >
                  </ax-kpi-card>

                  <ax-kpi-card
                    variant="progress"
                    label="Storage"
                    value="1.85 GB"
                    [progress]="18.5"
                    progressColor="success"
                    progressLabel="1.85 of 10 GB"
                  >
                  </ax-kpi-card>

                  <ax-kpi-card
                    variant="progress"
                    label="Bandwidth"
                    value="85 GB"
                    [progress]="85"
                    progressColor="error"
                    progressLabel="85 of 100 GB"
                  >
                  </ax-kpi-card>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="usageQuotaCode"></ax-code-tabs>
            </section>

            <!-- Example 6: Distribution Analytics -->
            <section class="kpi-card-doc__section">
              <h2>Distribution Analytics</h2>
              <p>
                Segmented progress variant showing breakdown of data into
                categories - ideal for ticket status, query performance, and
                resource distribution.
              </p>

              <ax-live-preview variant="bordered">
                <div class="kpi-card-doc__dashboard-grid">
                  <ax-kpi-card
                    variant="segmented"
                    label="Current Tickets"
                    value="247"
                    [segments]="ticketSegments"
                  >
                  </ax-kpi-card>

                  <ax-kpi-card
                    variant="segmented"
                    label="Database Queries"
                    value="44,757"
                    [segments]="querySegments"
                  >
                  </ax-kpi-card>

                  <ax-kpi-card
                    variant="segmented"
                    label="Query Latency"
                    value="1,247ms"
                    [segments]="latencySegments"
                  >
                  </ax-kpi-card>

                  <ax-kpi-card
                    variant="segmented"
                    label="Traffic Sources"
                    value="12,500"
                    [segments]="trafficSegments"
                  >
                  </ax-kpi-card>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="distributionAnalyticsCode"></ax-code-tabs>
            </section>

            <!-- Example 7: Compact Dashboard -->
            <section class="kpi-card-doc__section">
              <h2>Compact Dashboard</h2>
              <p>
                Compact variant for dense layouts with many metrics - uses
                reduced spacing and smaller typography.
              </p>

              <ax-live-preview variant="bordered">
                <div class="kpi-card-doc__compact-grid">
                  <ax-kpi-card
                    variant="compact"
                    label="Users Online"
                    value="1,234"
                    [change]="5.2"
                  >
                  </ax-kpi-card>

                  <ax-kpi-card
                    variant="compact"
                    label="Active Sessions"
                    value="856"
                    [change]="3.1"
                  >
                  </ax-kpi-card>

                  <ax-kpi-card
                    variant="compact"
                    label="CPU Usage"
                    value="45%"
                    [change]="-2.5"
                  >
                  </ax-kpi-card>

                  <ax-kpi-card
                    variant="compact"
                    label="Memory"
                    value="8.2 GB"
                    [change]="1.8"
                  >
                  </ax-kpi-card>

                  <ax-kpi-card
                    variant="compact"
                    label="Disk I/O"
                    value="120 MB/s"
                    [change]="-0.5"
                  >
                  </ax-kpi-card>

                  <ax-kpi-card
                    variant="compact"
                    label="Network"
                    value="45 Mbps"
                    [change]="2.3"
                  >
                  </ax-kpi-card>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="compactDashboardCode"></ax-code-tabs>
            </section>

            <!-- Example 8: Accent Positions -->
            <section class="kpi-card-doc__section">
              <h2>Accent Positions</h2>
              <p>
                Accent bars can be positioned on any edge of the card - left,
                right, top, or bottom.
              </p>

              <ax-live-preview variant="bordered">
                <div class="kpi-card-doc__dashboard-grid">
                  <ax-kpi-card
                    variant="accent"
                    label="Left Accent"
                    value="$45,231"
                    accentColor="primary"
                    accentPosition="left"
                  >
                  </ax-kpi-card>

                  <ax-kpi-card
                    variant="accent"
                    label="Right Accent"
                    value="2,543"
                    accentColor="success"
                    accentPosition="right"
                  >
                  </ax-kpi-card>

                  <ax-kpi-card
                    variant="accent"
                    label="Top Accent"
                    value="98.5%"
                    accentColor="info"
                    accentPosition="top"
                  >
                  </ax-kpi-card>

                  <ax-kpi-card
                    variant="accent"
                    label="Bottom Accent"
                    value="24"
                    accentColor="warning"
                    accentPosition="bottom"
                  >
                  </ax-kpi-card>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="accentPositionsCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- ============================================================== -->
        <!-- API TAB - Complete properties reference -->
        <!-- ============================================================== -->
        <mat-tab label="API">
          <div class="kpi-card-doc__tab-content">
            <section class="kpi-card-doc__section">
              <h2>Properties</h2>
              <div class="kpi-card-doc__api-table">
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
                      <td><code>variant</code></td>
                      <td>
                        <code
                          >'simple' | 'badge' | 'compact' | 'accent' |
                          'visual-indicator' | 'progress' | 'segmented'</code
                        >
                      </td>
                      <td><code>'simple'</code></td>
                      <td>Card variant/layout</td>
                    </tr>
                    <tr>
                      <td><code>size</code></td>
                      <td><code>'sm' | 'md' | 'lg'</code></td>
                      <td><code>'md'</code></td>
                      <td>Card size</td>
                    </tr>
                    <tr>
                      <td><code>label</code></td>
                      <td><code>string</code></td>
                      <td><code>''</code></td>
                      <td>KPI label/title</td>
                    </tr>
                    <tr>
                      <td><code>value</code></td>
                      <td><code>string | number</code></td>
                      <td><code>''</code></td>
                      <td>KPI value</td>
                    </tr>
                    <tr>
                      <td><code>subtitle</code></td>
                      <td><code>string</code></td>
                      <td><code>''</code></td>
                      <td>Optional subtitle</td>
                    </tr>
                    <tr>
                      <td><code>change</code></td>
                      <td><code>number</code></td>
                      <td><code>undefined</code></td>
                      <td>Change percentage (e.g., 12.5 or -5.2)</td>
                    </tr>
                    <tr>
                      <td><code>changeType</code></td>
                      <td><code>'up' | 'down' | 'neutral'</code></td>
                      <td><code>auto</code></td>
                      <td>Change trend (auto-calculated from change value)</td>
                    </tr>
                    <tr>
                      <td><code>changeLabel</code></td>
                      <td><code>string</code></td>
                      <td><code>''</code></td>
                      <td>Change label (e.g., "vs last month")</td>
                    </tr>
                    <tr>
                      <td><code>badge</code></td>
                      <td><code>string</code></td>
                      <td><code>''</code></td>
                      <td>Badge text (for badge variant)</td>
                    </tr>
                    <tr>
                      <td><code>badgeType</code></td>
                      <td>
                        <code
                          >'success' | 'error' | 'warning' | 'info' |
                          'neutral'</code
                        >
                      </td>
                      <td><code>'neutral'</code></td>
                      <td>Badge color type</td>
                    </tr>
                    <tr>
                      <td><code>accentColor</code></td>
                      <td>
                        <code
                          >'primary' | 'info' | 'success' | 'warning' |
                          'error'</code
                        >
                      </td>
                      <td><code>undefined</code></td>
                      <td>Accent bar color</td>
                    </tr>
                    <tr>
                      <td><code>accentPosition</code></td>
                      <td><code>'left' | 'right' | 'top' | 'bottom'</code></td>
                      <td><code>'left'</code></td>
                      <td>Accent bar position</td>
                    </tr>
                    <tr>
                      <td><code>barsFilled</code></td>
                      <td><code>number</code></td>
                      <td><code>0</code></td>
                      <td>Number of filled bars (visual-indicator variant)</td>
                    </tr>
                    <tr>
                      <td><code>barsTotal</code></td>
                      <td><code>number</code></td>
                      <td><code>3</code></td>
                      <td>Total number of bars (visual-indicator variant)</td>
                    </tr>
                    <tr>
                      <td><code>barColor</code></td>
                      <td>
                        <code
                          >'primary' | 'info' | 'success' | 'warning' |
                          'error'</code
                        >
                      </td>
                      <td><code>'info'</code></td>
                      <td>Bar color (visual-indicator variant)</td>
                    </tr>
                    <tr>
                      <td><code>supplementary</code></td>
                      <td><code>string</code></td>
                      <td><code>''</code></td>
                      <td>Supplementary text (e.g., "450/752 GB")</td>
                    </tr>
                    <tr>
                      <td><code>progress</code></td>
                      <td><code>number</code></td>
                      <td><code>0</code></td>
                      <td>Progress percentage 0-100 (progress variant)</td>
                    </tr>
                    <tr>
                      <td><code>progressColor</code></td>
                      <td>
                        <code
                          >'primary' | 'info' | 'success' | 'warning' |
                          'error'</code
                        >
                      </td>
                      <td><code>'info'</code></td>
                      <td>Progress bar color</td>
                    </tr>
                    <tr>
                      <td><code>progressLabel</code></td>
                      <td><code>string</code></td>
                      <td><code>''</code></td>
                      <td>Progress label (e.g., "996 of 10,000")</td>
                    </tr>
                    <tr>
                      <td><code>segments</code></td>
                      <td>
                        <code>{{
                          '{ value: number; color: string; label?: string }[]'
                        }}</code>
                      </td>
                      <td><code>[]</code></td>
                      <td>Segment data for segmented variant</td>
                    </tr>
                    <tr>
                      <td><code>compact</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Enable compact spacing</td>
                    </tr>
                    <tr>
                      <td><code>hoverable</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Enable hover effect</td>
                    </tr>
                    <tr>
                      <td><code>clickable</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Enable clickable cursor</td>
                    </tr>
                    <tr>
                      <td><code>flat</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Remove shadow (flat style)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </mat-tab>

        <!-- ============================================================== -->
        <!-- TOKENS TAB -->
        <!-- ============================================================== -->
        <mat-tab label="Tokens">
          <div class="kpi-card-doc__tab-content">
            <ax-component-tokens [tokens]="kpiCardTokens"></ax-component-tokens>
          </div>
        </mat-tab>

        <!-- ============================================================== -->
        <!-- GUIDELINES TAB -->
        <!-- ============================================================== -->
        <mat-tab label="Guidelines">
          <div class="kpi-card-doc__tab-content">
            <section class="kpi-card-doc__section">
              <h2>Do's and Don'ts</h2>

              <div class="kpi-card-doc__guidelines">
                <div
                  class="kpi-card-doc__guideline kpi-card-doc__guideline--do"
                >
                  <h4><mat-icon>check_circle</mat-icon> Do</h4>
                  <ul>
                    <li>Use clear, concise labels</li>
                    <li>Format numbers for readability (1,234 not 1234)</li>
                    <li>Include context with change labels</li>
                    <li>Use consistent variants within a dashboard</li>
                    <li>Choose semantic colors for badges and accents</li>
                    <li>Use progress variant for quotas and limits</li>
                    <li>Use segmented variant for distribution data</li>
                  </ul>
                </div>

                <div
                  class="kpi-card-doc__guideline kpi-card-doc__guideline--dont"
                >
                  <h4><mat-icon>cancel</mat-icon> Don't</h4>
                  <ul>
                    <li>Display too many KPIs at once</li>
                    <li>Use misleading change percentages</li>
                    <li>Mix different card variants randomly</li>
                    <li>Use colors that don't match the metric meaning</li>
                    <li>Truncate important values</li>
                    <li>Use progress bar for non-percentage data</li>
                    <li>Overload segments (max 4-5 recommended)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section class="kpi-card-doc__section">
              <h2>When to Use Each Variant</h2>
              <div class="kpi-card-doc__variant-guide">
                <div class="variant-item">
                  <strong>Simple:</strong>
                  <span>Basic metrics with optional change indicator</span>
                </div>
                <div class="variant-item">
                  <strong>Badge:</strong>
                  <span>Highlight change percentage prominently</span>
                </div>
                <div class="variant-item">
                  <strong>Compact:</strong>
                  <span>Dense layouts with many metrics</span>
                </div>
                <div class="variant-item">
                  <strong>Accent:</strong>
                  <span>Categorize metrics by color/type</span>
                </div>
                <div class="variant-item">
                  <strong>Visual Indicator:</strong>
                  <span>Show progress toward a goal with bars</span>
                </div>
                <div class="variant-item">
                  <strong>Progress:</strong>
                  <span>Show usage/quota with progress bar</span>
                </div>
                <div class="variant-item">
                  <strong>Segmented:</strong>
                  <span>Show data distribution with segments</span>
                </div>
              </div>
            </section>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .kpi-card-doc {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--ax-spacing-xl, 1.5rem);
      }

      .kpi-card-doc__tabs {
        margin-top: var(--ax-spacing-xl, 1.5rem);
      }

      .kpi-card-doc__tab-content {
        padding: var(--ax-spacing-xl, 1.5rem) 0;
      }

      .kpi-card-doc__section {
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

      /* Dashboard grid - 4 columns */
      .kpi-card-doc__dashboard-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: var(--ax-spacing-lg, 1rem);
        width: 100%;
      }

      /* Compact grid - 6 columns */
      .kpi-card-doc__compact-grid {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: var(--ax-spacing-md, 0.75rem);
        width: 100%;
      }

      @media (max-width: 1200px) {
        .kpi-card-doc__dashboard-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        .kpi-card-doc__compact-grid {
          grid-template-columns: repeat(3, 1fr);
        }
      }

      @media (max-width: 768px) {
        .kpi-card-doc__dashboard-grid,
        .kpi-card-doc__compact-grid {
          grid-template-columns: 1fr;
        }
      }

      /* API Table */
      .kpi-card-doc__api-table {
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
      .kpi-card-doc__guidelines {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--ax-spacing-lg, 1rem);
      }

      .kpi-card-doc__guideline {
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

      .kpi-card-doc__guideline--do {
        background: var(--ax-success-faint);

        h4 {
          color: var(--ax-success-emphasis);
        }
        li {
          color: var(--ax-success-emphasis);
        }
      }

      .kpi-card-doc__guideline--dont {
        background: var(--ax-error-faint);

        h4 {
          color: var(--ax-error-emphasis);
        }
        li {
          color: var(--ax-error-emphasis);
        }
      }

      /* Variant Guide */
      .kpi-card-doc__variant-guide {
        display: flex;
        flex-direction: column;
        gap: var(--ax-spacing-sm, 0.5rem);
      }

      .variant-item {
        font-size: var(--ax-text-sm, 0.875rem);
        color: var(--ax-text-secondary);

        strong {
          color: var(--ax-text-heading);
          margin-right: var(--ax-spacing-xs, 0.25rem);
        }
      }
    `,
  ],
})
export class KpiCardDocComponent {
  // ============================================================
  // SEGMENT DATA
  // ============================================================
  ticketSegments = [
    { value: 82, color: 'var(--ax-info-default)', label: 'Resolved' },
    { value: 13, color: 'var(--ax-text-secondary)', label: 'Progress' },
    { value: 5, color: 'var(--md-sys-error)', label: 'Escalated' },
  ];

  querySegments = [
    { value: 57, color: 'var(--ax-info-default)', label: 'Optimized' },
    { value: 12, color: 'var(--ax-text-secondary)', label: 'Editing' },
    { value: 31, color: 'var(--md-sys-error)', label: 'Slow' },
  ];

  latencySegments = [
    { value: 75, color: 'var(--ax-info-default)', label: 'Fast' },
    { value: 20, color: 'var(--ax-text-secondary)', label: 'Medium' },
    { value: 5, color: 'var(--md-sys-error)', label: 'Slow' },
  ];

  trafficSegments = [
    { value: 45, color: 'var(--ax-info-default)', label: 'Organic' },
    { value: 30, color: 'var(--ax-success-default)', label: 'Direct' },
    { value: 15, color: 'var(--ax-warning-default)', label: 'Referral' },
    { value: 10, color: 'var(--ax-text-secondary)', label: 'Social' },
  ];

  // ============================================================
  // OVERVIEW TAB CODE EXAMPLES
  // ============================================================
  overviewCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Simple -->
<ax-kpi-card label="Simple" value="$45,231" [change]="12.5"></ax-kpi-card>

<!-- Badge -->
<ax-kpi-card variant="badge" label="Badge" value="3,450" badge="+12.1%" badgeType="success"></ax-kpi-card>

<!-- Accent -->
<ax-kpi-card variant="accent" label="Accent" value="1,234" accentColor="primary"></ax-kpi-card>

<!-- Visual Indicator -->
<ax-kpi-card variant="visual-indicator" label="Visual Indicator" value="450 GB"
  [barsFilled]="2" [barsTotal]="3" barColor="info" supplementary="450/752 GB"></ax-kpi-card>

<!-- Progress -->
<ax-kpi-card variant="progress" label="Progress" value="996"
  [progress]="9.96" progressColor="info" progressLabel="996 of 10,000"></ax-kpi-card>

<!-- Segmented -->
<ax-kpi-card variant="segmented" label="Segmented" value="247" [segments]="ticketSegments"></ax-kpi-card>`,
    },
  ];

  // ============================================================
  // EXAMPLES TAB CODE
  // ============================================================

  // Example 1: Analytics Dashboard
  analyticsDashboardCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<div class="dashboard-grid">
  <ax-kpi-card
    label="Unique visitors"
    value="10,450"
    [change]="-12.5"
    changeLabel="vs last month">
  </ax-kpi-card>

  <ax-kpi-card
    label="Bounce rate"
    value="50.1%"
    [change]="1.8"
    changeLabel="vs last month">
  </ax-kpi-card>

  <ax-kpi-card
    label="Page views"
    value="443,231"
    [change]="19.2"
    changeLabel="vs last month">
  </ax-kpi-card>

  <ax-kpi-card
    label="Avg. session"
    value="3m 21s"
    [change]="-5.3"
    changeLabel="vs last month">
  </ax-kpi-card>
</div>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxKpiCardComponent } from '@aegisx/ui';

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [AxKpiCardComponent],
  template: \`
    <div class="dashboard-grid">
      <ax-kpi-card label="Unique visitors" value="10,450" [change]="-12.5" changeLabel="vs last month"></ax-kpi-card>
      <ax-kpi-card label="Bounce rate" value="50.1%" [change]="1.8" changeLabel="vs last month"></ax-kpi-card>
      <ax-kpi-card label="Page views" value="443,231" [change]="19.2" changeLabel="vs last month"></ax-kpi-card>
      <ax-kpi-card label="Avg. session" value="3m 21s" [change]="-5.3" changeLabel="vs last month"></ax-kpi-card>
    </div>
  \`,
  styles: [\`
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }
  \`]
})
export class AnalyticsDashboardComponent {}`,
    },
  ];

  // Example 2: User Engagement Metrics
  userEngagementCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<div class="dashboard-grid">
  <ax-kpi-card
    variant="badge"
    label="Daily Active Users"
    value="3,450"
    badge="+12.1%"
    badgeType="success">
  </ax-kpi-card>

  <ax-kpi-card
    variant="badge"
    label="Monthly Active Users"
    value="15,200"
    badge="+8.5%"
    badgeType="success">
  </ax-kpi-card>

  <ax-kpi-card
    variant="badge"
    label="Churn Rate"
    value="2.3%"
    badge="-0.5%"
    badgeType="error">
  </ax-kpi-card>

  <ax-kpi-card
    variant="badge"
    label="NPS Score"
    value="72"
    badge="stable"
    badgeType="info">
  </ax-kpi-card>
</div>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxKpiCardComponent } from '@aegisx/ui';

@Component({
  selector: 'app-user-engagement',
  standalone: true,
  imports: [AxKpiCardComponent],
  template: \`
    <div class="dashboard-grid">
      <ax-kpi-card variant="badge" label="Daily Active Users" value="3,450" badge="+12.1%" badgeType="success"></ax-kpi-card>
      <ax-kpi-card variant="badge" label="Monthly Active Users" value="15,200" badge="+8.5%" badgeType="success"></ax-kpi-card>
      <ax-kpi-card variant="badge" label="Churn Rate" value="2.3%" badge="-0.5%" badgeType="error"></ax-kpi-card>
      <ax-kpi-card variant="badge" label="NPS Score" value="72" badge="stable" badgeType="info"></ax-kpi-card>
    </div>
  \`,
  styles: [\`
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }
  \`]
})
export class UserEngagementComponent {}`,
    },
  ];

  // Example 3: Business Performance
  businessPerformanceCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<div class="dashboard-grid">
  <ax-kpi-card
    variant="accent"
    label="Total Revenue"
    value="$128,430"
    [change]="8.2"
    accentColor="success"
    accentPosition="left">
  </ax-kpi-card>

  <ax-kpi-card
    variant="accent"
    label="New Customers"
    value="1,429"
    [change]="12.5"
    accentColor="primary"
    accentPosition="left">
  </ax-kpi-card>

  <ax-kpi-card
    variant="accent"
    label="Pending Orders"
    value="42"
    [change]="-5"
    accentColor="warning"
    accentPosition="left">
  </ax-kpi-card>

  <ax-kpi-card
    variant="accent"
    label="Support Tickets"
    value="18"
    [change]="3"
    accentColor="error"
    accentPosition="left">
  </ax-kpi-card>
</div>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxKpiCardComponent } from '@aegisx/ui';

@Component({
  selector: 'app-business-performance',
  standalone: true,
  imports: [AxKpiCardComponent],
  template: \`
    <div class="dashboard-grid">
      <ax-kpi-card variant="accent" label="Total Revenue" value="$128,430" [change]="8.2" accentColor="success" accentPosition="left"></ax-kpi-card>
      <ax-kpi-card variant="accent" label="New Customers" value="1,429" [change]="12.5" accentColor="primary" accentPosition="left"></ax-kpi-card>
      <ax-kpi-card variant="accent" label="Pending Orders" value="42" [change]="-5" accentColor="warning" accentPosition="left"></ax-kpi-card>
      <ax-kpi-card variant="accent" label="Support Tickets" value="18" [change]="3" accentColor="error" accentPosition="left"></ax-kpi-card>
    </div>
  \`,
  styles: [\`
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }
  \`]
})
export class BusinessPerformanceComponent {}`,
    },
  ];

  // Example 4: Visual Indicator Cards
  visualIndicatorCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<div class="dashboard-grid">
  <ax-kpi-card
    variant="visual-indicator"
    label="Storage Used"
    value="450 GB"
    [barsFilled]="2"
    [barsTotal]="3"
    barColor="info"
    supplementary="450/752 GB">
  </ax-kpi-card>

  <ax-kpi-card
    variant="visual-indicator"
    label="Tasks Complete"
    value="75%"
    [barsFilled]="3"
    [barsTotal]="4"
    barColor="success"
    supplementary="18/24 tasks">
  </ax-kpi-card>

  <ax-kpi-card
    variant="visual-indicator"
    label="API Quota"
    value="90%"
    [barsFilled]="3"
    [barsTotal]="3"
    barColor="warning"
    supplementary="9,000/10,000">
  </ax-kpi-card>

  <ax-kpi-card
    variant="visual-indicator"
    label="Critical Alerts"
    value="5"
    [barsFilled]="1"
    [barsTotal]="5"
    barColor="error"
    supplementary="1/5 resolved">
  </ax-kpi-card>
</div>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxKpiCardComponent } from '@aegisx/ui';

@Component({
  selector: 'app-visual-indicators',
  standalone: true,
  imports: [AxKpiCardComponent],
  template: \`
    <div class="dashboard-grid">
      <ax-kpi-card variant="visual-indicator" label="Storage Used" value="450 GB"
        [barsFilled]="2" [barsTotal]="3" barColor="info" supplementary="450/752 GB"></ax-kpi-card>
      <ax-kpi-card variant="visual-indicator" label="Tasks Complete" value="75%"
        [barsFilled]="3" [barsTotal]="4" barColor="success" supplementary="18/24 tasks"></ax-kpi-card>
      <ax-kpi-card variant="visual-indicator" label="API Quota" value="90%"
        [barsFilled]="3" [barsTotal]="3" barColor="warning" supplementary="9,000/10,000"></ax-kpi-card>
      <ax-kpi-card variant="visual-indicator" label="Critical Alerts" value="5"
        [barsFilled]="1" [barsTotal]="5" barColor="error" supplementary="1/5 resolved"></ax-kpi-card>
    </div>
  \`,
  styles: [\`
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }
  \`]
})
export class VisualIndicatorsComponent {}`,
    },
  ];

  // Example 5: Usage & Quota Cards
  usageQuotaCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<div class="dashboard-grid">
  <ax-kpi-card
    variant="progress"
    label="API Requests"
    value="996"
    [progress]="9.96"
    progressColor="info"
    progressLabel="996 of 10,000">
  </ax-kpi-card>

  <ax-kpi-card
    variant="progress"
    label="Credits Used"
    value="$672"
    [progress]="67.2"
    progressColor="warning"
    progressLabel="$672 of $1,000">
  </ax-kpi-card>

  <ax-kpi-card
    variant="progress"
    label="Storage"
    value="1.85 GB"
    [progress]="18.5"
    progressColor="success"
    progressLabel="1.85 of 10 GB">
  </ax-kpi-card>

  <ax-kpi-card
    variant="progress"
    label="Bandwidth"
    value="85 GB"
    [progress]="85"
    progressColor="error"
    progressLabel="85 of 100 GB">
  </ax-kpi-card>
</div>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxKpiCardComponent } from '@aegisx/ui';

@Component({
  selector: 'app-usage-quota',
  standalone: true,
  imports: [AxKpiCardComponent],
  template: \`
    <div class="dashboard-grid">
      <ax-kpi-card variant="progress" label="API Requests" value="996"
        [progress]="9.96" progressColor="info" progressLabel="996 of 10,000"></ax-kpi-card>
      <ax-kpi-card variant="progress" label="Credits Used" value="$672"
        [progress]="67.2" progressColor="warning" progressLabel="$672 of $1,000"></ax-kpi-card>
      <ax-kpi-card variant="progress" label="Storage" value="1.85 GB"
        [progress]="18.5" progressColor="success" progressLabel="1.85 of 10 GB"></ax-kpi-card>
      <ax-kpi-card variant="progress" label="Bandwidth" value="85 GB"
        [progress]="85" progressColor="error" progressLabel="85 of 100 GB"></ax-kpi-card>
    </div>
  \`,
  styles: [\`
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }
  \`]
})
export class UsageQuotaComponent {}`,
    },
  ];

  // Example 6: Distribution Analytics
  distributionAnalyticsCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<div class="dashboard-grid">
  <ax-kpi-card
    variant="segmented"
    label="Current Tickets"
    value="247"
    [segments]="ticketSegments">
  </ax-kpi-card>

  <ax-kpi-card
    variant="segmented"
    label="Database Queries"
    value="44,757"
    [segments]="querySegments">
  </ax-kpi-card>

  <ax-kpi-card
    variant="segmented"
    label="Query Latency"
    value="1,247ms"
    [segments]="latencySegments">
  </ax-kpi-card>

  <ax-kpi-card
    variant="segmented"
    label="Traffic Sources"
    value="12,500"
    [segments]="trafficSegments">
  </ax-kpi-card>
</div>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxKpiCardComponent } from '@aegisx/ui';

@Component({
  selector: 'app-distribution-analytics',
  standalone: true,
  imports: [AxKpiCardComponent],
  template: \`
    <div class="dashboard-grid">
      <ax-kpi-card variant="segmented" label="Current Tickets" value="247" [segments]="ticketSegments"></ax-kpi-card>
      <ax-kpi-card variant="segmented" label="Database Queries" value="44,757" [segments]="querySegments"></ax-kpi-card>
      <ax-kpi-card variant="segmented" label="Query Latency" value="1,247ms" [segments]="latencySegments"></ax-kpi-card>
      <ax-kpi-card variant="segmented" label="Traffic Sources" value="12,500" [segments]="trafficSegments"></ax-kpi-card>
    </div>
  \`,
  styles: [\`
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }
  \`]
})
export class DistributionAnalyticsComponent {
  ticketSegments = [
    { value: 82, color: 'var(--ax-info-default)', label: 'Resolved' },
    { value: 13, color: 'var(--ax-text-secondary)', label: 'Progress' },
    { value: 5, color: 'var(--md-sys-error)', label: 'Escalated' },
  ];

  querySegments = [
    { value: 57, color: 'var(--ax-info-default)', label: 'Optimized' },
    { value: 12, color: 'var(--ax-text-secondary)', label: 'Editing' },
    { value: 31, color: 'var(--md-sys-error)', label: 'Slow' },
  ];

  latencySegments = [
    { value: 75, color: 'var(--ax-info-default)', label: 'Fast' },
    { value: 20, color: 'var(--ax-text-secondary)', label: 'Medium' },
    { value: 5, color: 'var(--md-sys-error)', label: 'Slow' },
  ];

  trafficSegments = [
    { value: 45, color: 'var(--ax-info-default)', label: 'Organic' },
    { value: 30, color: 'var(--ax-success-default)', label: 'Direct' },
    { value: 15, color: 'var(--ax-warning-default)', label: 'Referral' },
    { value: 10, color: 'var(--ax-text-secondary)', label: 'Social' },
  ];
}`,
    },
  ];

  // Example 7: Compact Dashboard
  compactDashboardCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<div class="compact-grid">
  <ax-kpi-card variant="compact" label="Users Online" value="1,234" [change]="5.2"></ax-kpi-card>
  <ax-kpi-card variant="compact" label="Active Sessions" value="856" [change]="3.1"></ax-kpi-card>
  <ax-kpi-card variant="compact" label="CPU Usage" value="45%" [change]="-2.5"></ax-kpi-card>
  <ax-kpi-card variant="compact" label="Memory" value="8.2 GB" [change]="1.8"></ax-kpi-card>
  <ax-kpi-card variant="compact" label="Disk I/O" value="120 MB/s" [change]="-0.5"></ax-kpi-card>
  <ax-kpi-card variant="compact" label="Network" value="45 Mbps" [change]="2.3"></ax-kpi-card>
</div>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxKpiCardComponent } from '@aegisx/ui';

@Component({
  selector: 'app-compact-dashboard',
  standalone: true,
  imports: [AxKpiCardComponent],
  template: \`
    <div class="compact-grid">
      <ax-kpi-card variant="compact" label="Users Online" value="1,234" [change]="5.2"></ax-kpi-card>
      <ax-kpi-card variant="compact" label="Active Sessions" value="856" [change]="3.1"></ax-kpi-card>
      <ax-kpi-card variant="compact" label="CPU Usage" value="45%" [change]="-2.5"></ax-kpi-card>
      <ax-kpi-card variant="compact" label="Memory" value="8.2 GB" [change]="1.8"></ax-kpi-card>
      <ax-kpi-card variant="compact" label="Disk I/O" value="120 MB/s" [change]="-0.5"></ax-kpi-card>
      <ax-kpi-card variant="compact" label="Network" value="45 Mbps" [change]="2.3"></ax-kpi-card>
    </div>
  \`,
  styles: [\`
    .compact-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 0.75rem;
    }
  \`]
})
export class CompactDashboardComponent {}`,
    },
  ];

  // Example 8: Accent Positions
  accentPositionsCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<div class="dashboard-grid">
  <ax-kpi-card variant="accent" label="Left Accent" value="$45,231" accentColor="primary" accentPosition="left"></ax-kpi-card>
  <ax-kpi-card variant="accent" label="Right Accent" value="2,543" accentColor="success" accentPosition="right"></ax-kpi-card>
  <ax-kpi-card variant="accent" label="Top Accent" value="98.5%" accentColor="info" accentPosition="top"></ax-kpi-card>
  <ax-kpi-card variant="accent" label="Bottom Accent" value="24" accentColor="warning" accentPosition="bottom"></ax-kpi-card>
</div>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxKpiCardComponent } from '@aegisx/ui';

@Component({
  selector: 'app-accent-positions',
  standalone: true,
  imports: [AxKpiCardComponent],
  template: \`
    <div class="dashboard-grid">
      <ax-kpi-card variant="accent" label="Left Accent" value="$45,231" accentColor="primary" accentPosition="left"></ax-kpi-card>
      <ax-kpi-card variant="accent" label="Right Accent" value="2,543" accentColor="success" accentPosition="right"></ax-kpi-card>
      <ax-kpi-card variant="accent" label="Top Accent" value="98.5%" accentColor="info" accentPosition="top"></ax-kpi-card>
      <ax-kpi-card variant="accent" label="Bottom Accent" value="24" accentColor="warning" accentPosition="bottom"></ax-kpi-card>
    </div>
  \`,
  styles: [\`
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }
  \`]
})
export class AccentPositionsComponent {}`,
    },
  ];

  // ============================================================
  // TOKENS
  // ============================================================
  kpiCardTokens: ComponentToken[] = [
    {
      category: 'Colors',
      cssVar: '--ax-background-default',
      usage: 'Card background',
    },
    { category: 'Colors', cssVar: '--ax-border-default', usage: 'Card border' },
    {
      category: 'Colors',
      cssVar: '--ax-border-emphasis',
      usage: 'Card border emphasis',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-primary',
      usage: 'Value text color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-secondary',
      usage: 'Label and subtitle color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-success-default',
      usage: 'Positive change indicator',
    },
    {
      category: 'Colors',
      cssVar: '--md-sys-error',
      usage: 'Negative change indicator',
    },
    {
      category: 'Colors',
      cssVar: '--ax-success-faint',
      usage: 'Success badge background',
    },
    {
      category: 'Colors',
      cssVar: '--ax-error-faint',
      usage: 'Error badge background',
    },
    {
      category: 'Colors',
      cssVar: '--ax-brand-default',
      usage: 'Primary accent color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-info-default',
      usage: 'Info accent/progress color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-warning-default',
      usage: 'Warning accent/progress color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-background-subtle',
      usage: 'Progress bar background',
    },
    {
      category: 'Borders',
      cssVar: '--ax-radius-lg',
      usage: 'Card corner radius',
    },
    {
      category: 'Borders',
      cssVar: '--ax-radius-full',
      usage: 'Progress bar radius',
    },
    { category: 'Shadows', cssVar: '--ax-shadow-sm', usage: 'Card shadow' },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-md',
      usage: 'Internal padding',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-lg',
      usage: 'Content padding',
    },
    {
      category: 'Typography',
      cssVar: '--ax-text-base',
      usage: 'Label text size',
    },
    {
      category: 'Typography',
      cssVar: '--ax-text-sm',
      usage: 'Badge/change text size',
    },
    {
      category: 'Typography',
      cssVar: '--ax-font-semibold',
      usage: 'Value font weight',
    },
  ];
}
