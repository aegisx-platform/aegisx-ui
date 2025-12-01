import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { AxStatsCardComponent } from '@aegisx/ui';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
} from '../../../../../../components/docs';

@Component({
  selector: 'ax-stats-card-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    AxStatsCardComponent,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
  ],
  template: `
    <div class="stats-card-doc">
      <ax-doc-header
        title="Stats Card"
        icon="analytics"
        description="Display key metrics with title, value, and trend indicators. Perfect for dashboards and analytics views."
        [breadcrumbs]="[
          {
            label: 'Data Display',
            link: '/docs/components/aegisx/data-display/card',
          },
          { label: 'Stats Card' },
        ]"
        status="stable"
        version="1.0.0"
        importStatement="import { AxStatsCardComponent } from '@aegisx/ui';"
      ></ax-doc-header>

      <mat-tab-group class="doc-tabs" animationDuration="150ms">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="doc-tab-content">
            <section class="doc-section">
              <h2>Basic Usage</h2>
              <p>
                Stats Card displays a metric with its title and optional change
                indicator.
              </p>

              <ax-live-preview variant="bordered" gap="var(--ax-spacing-md)">
                <ax-stats-card
                  title="Total Users"
                  value="12,543"
                ></ax-stats-card>
                <ax-stats-card title="Revenue" value="฿1.2M"></ax-stats-card>
                <ax-stats-card title="Orders" value="384"></ax-stats-card>
              </ax-live-preview>

              <ax-code-tabs [tabs]="basicUsageCode"></ax-code-tabs>
            </section>

            <section class="doc-section">
              <h2>With Trend Indicators</h2>
              <p>
                Show positive or negative trends with the <code>trend</code> and
                <code>change</code> properties.
              </p>

              <ax-live-preview variant="bordered" gap="var(--ax-spacing-md)">
                <ax-stats-card
                  title="Total Sales"
                  value="฿2.4M"
                  change="+12.5%"
                  trend="up"
                >
                </ax-stats-card>
                <ax-stats-card
                  title="Bounce Rate"
                  value="24.3%"
                  change="-3.2%"
                  trend="down"
                >
                </ax-stats-card>
                <ax-stats-card
                  title="Avg. Session"
                  value="4m 32s"
                  change="0%"
                  trend="neutral"
                >
                </ax-stats-card>
              </ax-live-preview>

              <ax-code-tabs [tabs]="trendCode"></ax-code-tabs>
            </section>

            <section class="doc-section">
              <h2>With Icons</h2>
              <p>Add icons to provide visual context for the metric.</p>

              <ax-live-preview variant="bordered" gap="var(--ax-spacing-md)">
                <ax-stats-card
                  title="Active Users"
                  value="8,420"
                  change="+5.2%"
                  trend="up"
                  icon="people"
                >
                </ax-stats-card>
                <ax-stats-card
                  title="Revenue"
                  value="฿3.2M"
                  change="+18.7%"
                  trend="up"
                  icon="payments"
                >
                </ax-stats-card>
                <ax-stats-card
                  title="Conversion"
                  value="3.24%"
                  change="-0.5%"
                  trend="down"
                  icon="trending_up"
                >
                </ax-stats-card>
              </ax-live-preview>
            </section>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="doc-tab-content">
            <section class="doc-section">
              <h2>Dashboard Metrics</h2>
              <ax-live-preview
                variant="bordered"
                gap="var(--ax-spacing-md)"
                [wrap]="true"
              >
                <ax-stats-card
                  title="Total Revenue"
                  value="฿4.5M"
                  change="+22.5%"
                  trend="up"
                  icon="account_balance_wallet"
                ></ax-stats-card>
                <ax-stats-card
                  title="New Customers"
                  value="1,234"
                  change="+15.3%"
                  trend="up"
                  icon="person_add"
                ></ax-stats-card>
                <ax-stats-card
                  title="Active Orders"
                  value="456"
                  change="-2.1%"
                  trend="down"
                  icon="shopping_cart"
                ></ax-stats-card>
                <ax-stats-card
                  title="Avg. Order Value"
                  value="฿2,850"
                  change="+8.4%"
                  trend="up"
                  icon="receipt_long"
                ></ax-stats-card>
              </ax-live-preview>
            </section>

            <section class="doc-section">
              <h2>Website Analytics</h2>
              <ax-live-preview
                variant="bordered"
                gap="var(--ax-spacing-md)"
                [wrap]="true"
              >
                <ax-stats-card
                  title="Page Views"
                  value="142K"
                  change="+28%"
                  trend="up"
                  icon="visibility"
                ></ax-stats-card>
                <ax-stats-card
                  title="Unique Visitors"
                  value="45.2K"
                  change="+12%"
                  trend="up"
                  icon="groups"
                ></ax-stats-card>
                <ax-stats-card
                  title="Bounce Rate"
                  value="32.4%"
                  change="-5.2%"
                  trend="up"
                  icon="exit_to_app"
                ></ax-stats-card>
                <ax-stats-card
                  title="Session Duration"
                  value="3m 45s"
                  change="+18%"
                  trend="up"
                  icon="schedule"
                ></ax-stats-card>
              </ax-live-preview>
            </section>

            <section class="doc-section">
              <h2>E-commerce KPIs</h2>
              <ax-live-preview
                variant="bordered"
                gap="var(--ax-spacing-md)"
                [wrap]="true"
              >
                <ax-stats-card
                  title="Products Sold"
                  value="8,542"
                  change="+34%"
                  trend="up"
                  icon="inventory_2"
                ></ax-stats-card>
                <ax-stats-card
                  title="Cart Abandonment"
                  value="68.2%"
                  change="+2.3%"
                  trend="down"
                  icon="remove_shopping_cart"
                ></ax-stats-card>
                <ax-stats-card
                  title="Return Rate"
                  value="4.8%"
                  change="-1.2%"
                  trend="up"
                  icon="assignment_return"
                ></ax-stats-card>
                <ax-stats-card
                  title="Customer Satisfaction"
                  value="4.8/5"
                  change="+0.2"
                  trend="up"
                  icon="thumb_up"
                ></ax-stats-card>
              </ax-live-preview>
            </section>
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="doc-tab-content">
            <section class="doc-section">
              <h2>Properties</h2>
              <div class="api-table">
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
                      <td><code>title</code></td>
                      <td><code>string</code></td>
                      <td><code>''</code></td>
                      <td>Title/label for the metric</td>
                    </tr>
                    <tr>
                      <td><code>value</code></td>
                      <td><code>string</code></td>
                      <td><code>''</code></td>
                      <td>The main metric value</td>
                    </tr>
                    <tr>
                      <td><code>change</code></td>
                      <td><code>string</code></td>
                      <td><code>''</code></td>
                      <td>Change indicator text (e.g., '+12.5%')</td>
                    </tr>
                    <tr>
                      <td><code>trend</code></td>
                      <td><code>'up' | 'down' | 'neutral'</code></td>
                      <td><code>'neutral'</code></td>
                      <td>Trend direction for styling</td>
                    </tr>
                    <tr>
                      <td><code>icon</code></td>
                      <td><code>string</code></td>
                      <td><code>''</code></td>
                      <td>Material icon name</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="doc-tab-content">
            <section class="doc-section">
              <h2>Best Practices</h2>
              <div class="guidelines-grid">
                <div class="guideline do">
                  <h4><mat-icon>check_circle</mat-icon> Do</h4>
                  <ul>
                    <li>Use consistent formatting for values</li>
                    <li>Include context with icons</li>
                    <li>Show trends for important metrics</li>
                    <li>Group related stats together</li>
                  </ul>
                </div>
                <div class="guideline dont">
                  <h4><mat-icon>cancel</mat-icon> Don't</h4>
                  <ul>
                    <li>Display too many stats at once</li>
                    <li>Use confusing or unclear labels</li>
                    <li>Mix different number formats</li>
                    <li>Show trends without context</li>
                  </ul>
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
      .stats-card-doc {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--ax-spacing-xl);
      }

      .doc-tabs {
        margin-top: var(--ax-spacing-xl);
      }
      .doc-tab-content {
        padding: var(--ax-spacing-xl) 0;
      }

      .doc-section {
        margin-bottom: var(--ax-spacing-3xl);

        h2 {
          font-size: var(--ax-text-xl);
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0 0 var(--ax-spacing-sm) 0;
        }

        > p {
          font-size: var(--ax-text-sm);
          color: var(--ax-text-secondary);
          margin: 0 0 var(--ax-spacing-lg) 0;
          max-width: 700px;
        }

        code {
          font-family: var(--ax-font-mono);
          font-size: var(--ax-text-xs);
          background: var(--ax-background-subtle);
          padding: 2px 6px;
          border-radius: var(--ax-radius-sm);
        }
      }

      .api-table {
        overflow-x: auto;
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-lg);

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th,
        td {
          text-align: left;
          padding: var(--ax-spacing-sm) var(--ax-spacing-md);
          border-bottom: 1px solid var(--ax-border-default);
        }

        th {
          background: var(--ax-background-subtle);
          font-size: var(--ax-text-xs);
          font-weight: 600;
          color: var(--ax-text-secondary);
          text-transform: uppercase;
        }

        td {
          font-size: var(--ax-text-sm);
          color: var(--ax-text-primary);
        }
        tr:last-child td {
          border-bottom: none;
        }
      }

      .guidelines-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--ax-spacing-lg);
      }

      .guideline {
        padding: var(--ax-spacing-lg);
        border-radius: var(--ax-radius-lg);

        h4 {
          display: flex;
          align-items: center;
          gap: var(--ax-spacing-xs);
          font-size: var(--ax-text-base);
          font-weight: 600;
          margin: 0 0 var(--ax-spacing-sm) 0;
          mat-icon {
            font-size: 20px;
            width: 20px;
            height: 20px;
          }
        }

        ul {
          margin: 0;
          padding-left: var(--ax-spacing-lg);
          li {
            font-size: var(--ax-text-sm);
            margin-bottom: var(--ax-spacing-xs);
          }
        }
      }

      .guideline.do {
        background: var(--ax-success-faint);
        h4 {
          color: var(--ax-success-emphasis);
        }
        li {
          color: var(--ax-success-emphasis);
        }
      }

      .guideline.dont {
        background: var(--ax-error-faint);
        h4 {
          color: var(--ax-error-emphasis);
        }
        li {
          color: var(--ax-error-emphasis);
        }
      }
    `,
  ],
})
export class StatsCardDocComponent {
  basicUsageCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-stats-card title="Total Users" value="12,543"></ax-stats-card>
<ax-stats-card title="Revenue" value="฿1.2M"></ax-stats-card>
<ax-stats-card title="Orders" value="384"></ax-stats-card>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxStatsCardComponent } from '@aegisx/ui';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AxStatsCardComponent],
  template: \`
    <ax-stats-card
      title="Total Revenue"
      [value]="formatCurrency(revenue)"
      [change]="revenueChange"
      [trend]="revenueTrend">
    </ax-stats-card>
  \`,
})
export class DashboardComponent {
  revenue = 1250000;
  revenueChange = '+12.5%';
  revenueTrend = 'up' as const;

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      notation: 'compact'
    }).format(value);
  }
}`,
    },
  ];

  trendCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Upward trend (positive) -->
<ax-stats-card
  title="Total Sales"
  value="฿2.4M"
  change="+12.5%"
  trend="up">
</ax-stats-card>

<!-- Downward trend (can be positive or negative depending on context) -->
<ax-stats-card
  title="Bounce Rate"
  value="24.3%"
  change="-3.2%"
  trend="down">
</ax-stats-card>

<!-- Neutral (no change) -->
<ax-stats-card
  title="Avg. Session"
  value="4m 32s"
  change="0%"
  trend="neutral">
</ax-stats-card>`,
    },
  ];
}
