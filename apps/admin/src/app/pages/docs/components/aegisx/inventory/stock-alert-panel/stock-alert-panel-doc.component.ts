import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AxStockAlertPanelComponent } from '@aegisx/ui';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../../../components/docs';
import { ComponentToken } from '../../../../../../types/docs.types';
import type {
  StockAlert,
  AlertActionEvent,
} from '@aegisx/ui/lib/components/inventory/stock-alert-panel';

@Component({
  selector: 'ax-stock-alert-panel-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    AxStockAlertPanelComponent,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="stock-alert-panel-doc">
      <ax-doc-header
        title="Stock Alert Panel"
        icon="notifications_active"
        description="Real-time stock alert panel with severity indicators, filtering, grouping, and WebSocket integration for live inventory notifications."
        [breadcrumbs]="[
          {
            label: 'Inventory',
            link: '/docs/components/aegisx/inventory/stock-alert-panel',
          },
          { label: 'Stock Alert Panel' },
        ]"
        status="stable"
        version="1.0.0"
        importStatement="import { AxStockAlertPanelComponent } from '@aegisx/ui';"
      ></ax-doc-header>

      <mat-tab-group
        class="stock-alert-panel-doc__tabs"
        animationDuration="150ms"
      >
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="stock-alert-panel-doc__tab-content">
            <section class="stock-alert-panel-doc__section">
              <h2>Basic Usage</h2>
              <p>
                The Stock Alert Panel component displays real-time inventory
                alerts with severity indicators, filtering capabilities, and
                action buttons. Supports critical, warning, and info severity
                levels with optional WebSocket integration for live updates.
              </p>

              <ax-live-preview variant="bordered">
                <div class="stock-alert-panel-doc__demo">
                  <ax-stock-alert-panel
                    [alerts]="basicAlerts"
                    [groupBy]="'priority'"
                    [showActions]="true"
                    (alertClick)="handleAlertClick($event)"
                    (alertAction)="handleAlertAction($event)"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="basicUsageCode"></ax-code-tabs>
            </section>

            <section class="stock-alert-panel-doc__section">
              <h2>Severity Levels</h2>
              <p>
                Alerts are displayed with color-coded severity indicators:
                critical (red), warning (yellow), and info (blue).
              </p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-lg)"
                align="stretch"
              >
                <div class="stock-alert-panel-doc__demo">
                  <h4>Critical Alerts</h4>
                  <ax-stock-alert-panel
                    [alerts]="criticalAlerts"
                    [groupBy]="'none'"
                    [showActions]="true"
                  />
                </div>

                <div class="stock-alert-panel-doc__demo">
                  <h4>Warning Alerts</h4>
                  <ax-stock-alert-panel
                    [alerts]="warningAlerts"
                    [groupBy]="'none'"
                    [showActions]="true"
                  />
                </div>

                <div class="stock-alert-panel-doc__demo">
                  <h4>Info Alerts</h4>
                  <ax-stock-alert-panel
                    [alerts]="infoAlerts"
                    [groupBy]="'none'"
                    [showActions]="true"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="severityCode"></ax-code-tabs>
            </section>

            <section class="stock-alert-panel-doc__section">
              <h2>Grouping Options</h2>
              <p>
                Group alerts by priority, type, location, or display as a flat
                list.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-lg)"
                align="stretch"
              >
                <div class="stock-alert-panel-doc__demo">
                  <h4>Group by Priority</h4>
                  <ax-stock-alert-panel
                    [alerts]="mixedAlerts"
                    [groupBy]="'priority'"
                  />
                </div>

                <div class="stock-alert-panel-doc__demo">
                  <h4>Group by Type</h4>
                  <ax-stock-alert-panel
                    [alerts]="mixedAlerts"
                    [groupBy]="'type'"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="groupingCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="stock-alert-panel-doc__tab-content">
            <section class="stock-alert-panel-doc__section">
              <h2>Alert Dashboard</h2>
              <p>
                Complete alert dashboard with multiple severity levels and
                action buttons.
              </p>

              <ax-live-preview variant="bordered">
                <div class="stock-alert-panel-doc__dashboard">
                  <ax-stock-alert-panel
                    [alerts]="dashboardAlerts"
                    [groupBy]="'priority'"
                    [showActions]="true"
                    [maxDisplay]="10"
                    (alertClick)="handleAlertClick($event)"
                    (alertAction)="handleAlertAction($event)"
                    (alertDismiss)="handleAlertDismiss($event)"
                    (alertResolve)="handleAlertResolve($event)"
                  />
                </div>
              </ax-live-preview>
            </section>

            <section class="stock-alert-panel-doc__section">
              <h2>WebSocket Integration</h2>
              <p>
                Enable real-time alert updates via WebSocket connection with
                visual connection indicator.
              </p>

              <ax-live-preview variant="bordered">
                <div class="stock-alert-panel-doc__demo">
                  <ax-stock-alert-panel
                    [alerts]="[]"
                    [enableRealtime]="true"
                    [enableSounds]="false"
                    [groupBy]="'priority'"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="webSocketCode"></ax-code-tabs>
            </section>

            <section class="stock-alert-panel-doc__section">
              <h2>Alert Types</h2>
              <p>
                Different alert types with appropriate icons and suggested
                actions.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-md)"
                align="stretch"
              >
                <ax-stock-alert-panel
                  [alerts]="alertTypeExamples"
                  [groupBy]="'type'"
                  [showActions]="true"
                />
              </ax-live-preview>
            </section>

            <section class="stock-alert-panel-doc__section">
              <h2>Filtering</h2>
              <p>
                Filter alerts by type, severity, location, or read/resolved
                status.
              </p>

              <ax-live-preview variant="bordered">
                <div class="stock-alert-panel-doc__demo">
                  <ax-stock-alert-panel
                    [alerts]="mixedAlerts"
                    [filters]="{
                      severity: ['critical', 'warning'],
                      unresolvedOnly: true,
                    }"
                    [groupBy]="'priority'"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="filteringCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="stock-alert-panel-doc__tab-content">
            <section class="stock-alert-panel-doc__section">
              <h2>Input Properties</h2>
              <div class="stock-alert-panel-doc__api-table">
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
                      <td><code>alerts</code></td>
                      <td><code>StockAlert[]</code></td>
                      <td><code>[]</code></td>
                      <td>Array of stock alerts to display</td>
                    </tr>
                    <tr>
                      <td><code>groupBy</code></td>
                      <td>
                        <code>'priority' | 'type' | 'location' | 'none'</code>
                      </td>
                      <td><code>'priority'</code></td>
                      <td>Alert grouping strategy</td>
                    </tr>
                    <tr>
                      <td><code>showActions</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Show action buttons on alerts</td>
                    </tr>
                    <tr>
                      <td><code>maxDisplay</code></td>
                      <td><code>number</code></td>
                      <td><code>10</code></td>
                      <td>Maximum alerts to display</td>
                    </tr>
                    <tr>
                      <td><code>enableRealtime</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Enable WebSocket real-time updates</td>
                    </tr>
                    <tr>
                      <td><code>enableSounds</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Enable notification sounds</td>
                    </tr>
                    <tr>
                      <td><code>filters</code></td>
                      <td><code>AlertFilter</code></td>
                      <td><code>undefined</code></td>
                      <td>Filter criteria for alerts</td>
                    </tr>
                    <tr>
                      <td><code>config</code></td>
                      <td><code>AlertPanelConfig</code></td>
                      <td><code>undefined</code></td>
                      <td>Advanced configuration options</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="stock-alert-panel-doc__section">
              <h2>Output Events</h2>
              <div class="stock-alert-panel-doc__api-table">
                <table>
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>alertClick</code></td>
                      <td><code>StockAlert</code></td>
                      <td>Emitted when an alert is clicked</td>
                    </tr>
                    <tr>
                      <td><code>alertAction</code></td>
                      <td><code>AlertActionEvent</code></td>
                      <td>Emitted when action button is clicked</td>
                    </tr>
                    <tr>
                      <td><code>alertDismiss</code></td>
                      <td><code>string</code></td>
                      <td>Emitted when alert is dismissed (alert ID)</td>
                    </tr>
                    <tr>
                      <td><code>alertResolve</code></td>
                      <td><code>string</code></td>
                      <td>Emitted when alert is resolved (alert ID)</td>
                    </tr>
                    <tr>
                      <td><code>alertsLoad</code></td>
                      <td><code>StockAlert[]</code></td>
                      <td>Emitted after alerts are loaded</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="stock-alert-panel-doc__section">
              <h2>Type Definitions</h2>

              <h3>StockAlert</h3>
              <pre><code>interface StockAlert &#123;
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  product: &#123;
    id: string;
    name: string;
    sku: string;
  &#125;;
  message: string;
  createdAt: Date;
  metadata?: Record&lt;string, any&gt;;
  read?: boolean;
  resolved?: boolean;
  suggestedActions?: string[];
&#125;</code></pre>

              <h3>AlertType</h3>
              <pre><code>type AlertType =
  | 'low-stock'
  | 'out-of-stock'
  | 'expiring'
  | 'expired'
  | 'overstock'
  | 'reorder';</code></pre>

              <h3>AlertSeverity</h3>
              <pre><code>type AlertSeverity = 'critical' | 'warning' | 'info';</code></pre>

              <h3>AlertActionEvent</h3>
              <pre><code>interface AlertActionEvent &#123;
  alert: StockAlert;
  action: 'create-po' | 'adjust-stock' | 'view-product' | 'dispose' | 'reorder';
&#125;</code></pre>

              <h3>AlertFilter</h3>
              <pre><code>interface AlertFilter &#123;
  types?: AlertType[];
  severity?: AlertSeverity[];
  productIds?: string[];
  locationIds?: string[];
  unreadOnly?: boolean;
  unresolvedOnly?: boolean;
&#125;</code></pre>
            </section>

            <section class="stock-alert-panel-doc__section">
              <h2>Severity Colors</h2>
              <div class="stock-alert-panel-doc__severity-colors">
                <div class="severity-color severity-color--critical">
                  <strong>Critical</strong>
                  <p>Out of stock, expired items requiring immediate action</p>
                </div>
                <div class="severity-color severity-color--warning">
                  <strong>Warning</strong>
                  <p>Low stock, expiring soon items requiring attention</p>
                </div>
                <div class="severity-color severity-color--info">
                  <strong>Info</strong>
                  <p>Overstock, reorder points, general notifications</p>
                </div>
              </div>
            </section>
          </div>
        </mat-tab>

        <!-- Tokens Tab -->
        <mat-tab label="Tokens">
          <div class="stock-alert-panel-doc__tab-content">
            <ax-component-tokens
              [tokens]="stockAlertPanelTokens"
            ></ax-component-tokens>
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="stock-alert-panel-doc__tab-content">
            <section class="stock-alert-panel-doc__section">
              <h2>Do's and Don'ts</h2>

              <div class="stock-alert-panel-doc__guidelines">
                <div
                  class="stock-alert-panel-doc__guideline stock-alert-panel-doc__guideline--do"
                >
                  <h4><mat-icon>check_circle</mat-icon> Do</h4>
                  <ul>
                    <li>
                      Use consistent severity levels across your application
                    </li>
                    <li>
                      Provide clear, actionable messages in alert descriptions
                    </li>
                    <li>
                      Handle alert action events to enable quick resolution
                    </li>
                    <li>Group alerts by priority for better visibility</li>
                    <li>Enable WebSocket updates for real-time monitoring</li>
                    <li>
                      Use filtering to help users focus on specific alert types
                    </li>
                  </ul>
                </div>

                <div
                  class="stock-alert-panel-doc__guideline stock-alert-panel-doc__guideline--dont"
                >
                  <h4><mat-icon>cancel</mat-icon> Don't</h4>
                  <ul>
                    <li>Overuse critical severity for non-urgent alerts</li>
                    <li>Display too many alerts without pagination/limiting</li>
                    <li>Mix different grouping strategies in the same view</li>
                    <li>
                      Ignore dismissed/resolved events - persist state properly
                    </li>
                    <li>
                      Enable sounds without user consent (accessibility concern)
                    </li>
                    <li>Show stale alerts - implement proper refresh logic</li>
                  </ul>
                </div>
              </div>
            </section>

            <section class="stock-alert-panel-doc__section">
              <h2>Accessibility</h2>
              <ul class="stock-alert-panel-doc__a11y-list">
                <li>
                  Alert list uses semantic HTML with proper ARIA roles and
                  labels
                </li>
                <li>
                  Severity indicators include icon and text for
                  color-independent recognition
                </li>
                <li>
                  Action buttons are keyboard accessible with proper focus
                  management
                </li>
                <li>
                  WebSocket connection status is announced to screen readers
                </li>
                <li>
                  Alert counts and grouping information are exposed via ARIA
                  live regions
                </li>
                <li>
                  Notification sounds can be disabled and respect user
                  preferences
                </li>
              </ul>
            </section>

            <section class="stock-alert-panel-doc__section">
              <h2>Best Practices</h2>
              <ul class="stock-alert-panel-doc__best-practices">
                <li>
                  <strong>Severity Levels:</strong> Reserve 'critical' for
                  situations requiring immediate action (out of stock, expired),
                  use 'warning' for preventive alerts (low stock, expiring soon)
                </li>
                <li>
                  <strong>Grouping:</strong> Group by priority in dashboards for
                  quick severity assessment, group by type in focused views for
                  operational workflows
                </li>
                <li>
                  <strong>Filtering:</strong> Provide filter controls for users
                  to focus on specific alert categories or locations
                </li>
                <li>
                  <strong>WebSocket Integration:</strong> Enable real-time
                  updates in monitoring dashboards, disable in report views to
                  avoid disruption
                </li>
                <li>
                  <strong>Action Buttons:</strong> Provide contextual actions
                  based on alert type (create PO for out-of-stock, dispose for
                  expired)
                </li>
                <li>
                  <strong>Alert Lifecycle:</strong> Implement proper read/unread
                  and resolved/unresolved states with backend persistence
                </li>
                <li>
                  <strong>Performance:</strong> Use maxDisplay to limit visible
                  alerts and provide "View All" for complete list
                </li>
              </ul>
            </section>

            <section class="stock-alert-panel-doc__section">
              <h2>WebSocket Message Format</h2>
              <p>
                When enableRealtime is true, the component expects WebSocket
                messages in this format:
              </p>

              <pre><code>interface WebSocketAlertMessage &#123;
  type: 'new-alert' | 'alert-updated' | 'alert-resolved' | 'alert-dismissed';
  data: StockAlert;
  timestamp: Date;
&#125;</code></pre>

              <p>Example WebSocket message:</p>
              <pre><code>&#123;
  "type": "new-alert",
  "data": &#123;
    "id": "alert-001",
    "type": "out-of-stock",
    "severity": "critical",
    "product": &#123;
      "id": "prod-001",
      "name": "Aspirin 500mg",
      "sku": "ASP-500"
    &#125;,
    "message": "Product is out of stock",
    "createdAt": "2025-12-19T10:30:00Z",
    "read": false,
    "resolved": false
  &#125;,
  "timestamp": "2025-12-19T10:30:00Z"
&#125;</code></pre>
            </section>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .stock-alert-panel-doc {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--ax-spacing-xl, 1.5rem);
      }

      .stock-alert-panel-doc__tabs {
        margin-top: var(--ax-spacing-xl, 1.5rem);
      }

      .stock-alert-panel-doc__tab-content {
        padding: var(--ax-spacing-xl, 1.5rem) 0;
      }

      .stock-alert-panel-doc__section {
        margin-bottom: var(--ax-spacing-3xl, 3rem);

        h2 {
          font-size: var(--ax-text-xl, 1.25rem);
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0 0 var(--ax-spacing-sm, 0.5rem) 0;
        }

        h3 {
          font-size: var(--ax-text-lg, 1.125rem);
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: var(--ax-spacing-lg, 1rem) 0 var(--ax-spacing-sm, 0.5rem) 0;
        }

        > p {
          font-size: var(--ax-text-sm, 0.875rem);
          color: var(--ax-text-secondary);
          margin: 0 0 var(--ax-spacing-lg, 1rem) 0;
          max-width: 700px;
        }
      }

      .stock-alert-panel-doc__demo {
        width: 100%;

        h4 {
          font-size: var(--ax-text-sm, 0.875rem);
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0 0 var(--ax-spacing-sm, 0.5rem) 0;
        }
      }

      .stock-alert-panel-doc__dashboard {
        min-height: 400px;
      }

      /* API Table */
      .stock-alert-panel-doc__api-table {
        overflow-x: auto;
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-lg, 0.75rem);
        margin-top: var(--ax-spacing-md, 0.75rem);

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

        td em {
          font-style: italic;
          color: var(--ax-text-secondary);
        }

        tr:last-child td {
          border-bottom: none;
        }
      }

      /* Severity Colors */
      .stock-alert-panel-doc__severity-colors {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--ax-spacing-md, 0.75rem);
        margin-top: var(--ax-spacing-md, 0.75rem);
      }

      .severity-color {
        padding: var(--ax-spacing-md, 0.75rem);
        border-radius: var(--ax-radius-md, 0.5rem);
        border: 2px solid;

        strong {
          display: block;
          font-size: var(--ax-text-sm, 0.875rem);
          font-weight: 600;
          margin-bottom: var(--ax-spacing-xs, 0.25rem);
        }

        p {
          font-size: var(--ax-text-sm, 0.875rem);
          margin: 0;
        }
      }

      .severity-color--critical {
        background: var(--ax-error-faint);
        border-color: var(--ax-error-default);
        color: var(--ax-error-emphasis);
      }

      .severity-color--warning {
        background: var(--ax-warning-faint);
        border-color: var(--ax-warning-default);
        color: var(--ax-warning-emphasis);
      }

      .severity-color--info {
        background: var(--ax-info-faint);
        border-color: var(--ax-info-default);
        color: var(--ax-info-emphasis);
      }

      /* Code Example */
      pre {
        background: var(--ax-background-subtle);
        padding: var(--ax-spacing-md, 0.75rem);
        border-radius: var(--ax-radius-md, 0.5rem);
        overflow-x: auto;
        margin: var(--ax-spacing-md, 0.75rem) 0;

        code {
          font-family: var(--ax-font-mono);
          font-size: var(--ax-text-sm, 0.875rem);
          color: var(--ax-text-primary);
          line-height: 1.6;
        }
      }

      /* Guidelines */
      .stock-alert-panel-doc__guidelines {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--ax-spacing-lg, 1rem);
      }

      .stock-alert-panel-doc__guideline {
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

      .stock-alert-panel-doc__guideline--do {
        background: var(--ax-success-faint);

        h4 {
          color: var(--ax-success-emphasis);
        }
        li {
          color: var(--ax-success-emphasis);
        }
      }

      .stock-alert-panel-doc__guideline--dont {
        background: var(--ax-error-faint);

        h4 {
          color: var(--ax-error-emphasis);
        }
        li {
          color: var(--ax-error-emphasis);
        }
      }

      .stock-alert-panel-doc__a11y-list,
      .stock-alert-panel-doc__best-practices {
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
export class StockAlertPanelDocComponent {
  // Basic alerts for overview demo
  basicAlerts: StockAlert[] = [
    {
      id: '1',
      type: 'out-of-stock',
      severity: 'critical',
      product: {
        id: 'prod-001',
        name: 'Aspirin 500mg',
        sku: 'ASP-500',
      },
      message: 'Product is out of stock',
      createdAt: new Date(Date.now() - 3600000),
      read: false,
      resolved: false,
    },
    {
      id: '2',
      type: 'low-stock',
      severity: 'warning',
      product: {
        id: 'prod-002',
        name: 'Ibuprofen 200mg',
        sku: 'IBU-200',
      },
      message: 'Stock level below minimum threshold',
      createdAt: new Date(Date.now() - 7200000),
      read: false,
      resolved: false,
    },
  ];

  // Critical alerts only
  criticalAlerts: StockAlert[] = [
    {
      id: '3',
      type: 'out-of-stock',
      severity: 'critical',
      product: {
        id: 'prod-003',
        name: 'Medical Gloves Size M',
        sku: 'GLV-M',
      },
      message: 'Product is completely out of stock',
      createdAt: new Date(Date.now() - 1800000),
      read: false,
      resolved: false,
    },
    {
      id: '4',
      type: 'expired',
      severity: 'critical',
      product: {
        id: 'prod-004',
        name: 'Paracetamol 650mg',
        sku: 'PAR-650',
      },
      message: 'Product has expired',
      createdAt: new Date(Date.now() - 3600000),
      metadata: {
        expiryDate: new Date(Date.now() - 432000000),
        batchNumber: 'BATCH-2023-099',
      },
      read: false,
      resolved: false,
    },
  ];

  // Warning alerts only
  warningAlerts: StockAlert[] = [
    {
      id: '5',
      type: 'low-stock',
      severity: 'warning',
      product: {
        id: 'prod-005',
        name: 'Surgical Masks',
        sku: 'MASK-001',
      },
      message: 'Stock level below minimum threshold',
      createdAt: new Date(Date.now() - 5400000),
      metadata: {
        currentStock: 25,
        minimumStock: 50,
      },
      read: false,
      resolved: false,
    },
    {
      id: '6',
      type: 'expiring',
      severity: 'warning',
      product: {
        id: 'prod-006',
        name: 'Antibiotic Cream',
        sku: 'ABX-001',
      },
      message: 'Product expiring in 7 days',
      createdAt: new Date(Date.now() - 7200000),
      metadata: {
        expiryDate: new Date(Date.now() + 604800000),
        batchNumber: 'BATCH-2024-042',
      },
      read: false,
      resolved: false,
    },
  ];

  // Info alerts only
  infoAlerts: StockAlert[] = [
    {
      id: '7',
      type: 'overstock',
      severity: 'info',
      product: {
        id: 'prod-007',
        name: 'Hand Sanitizer 500ml',
        sku: 'SAN-500',
      },
      message: 'Stock level exceeds maximum capacity',
      createdAt: new Date(Date.now() - 9000000),
      metadata: {
        currentStock: 1200,
        maximumStock: 1000,
      },
      read: false,
      resolved: false,
    },
    {
      id: '8',
      type: 'reorder',
      severity: 'info',
      product: {
        id: 'prod-008',
        name: 'Bandages 10cm',
        sku: 'BND-10',
      },
      message: 'Reorder point reached',
      createdAt: new Date(Date.now() - 10800000),
      read: false,
      resolved: false,
    },
  ];

  // Mixed alerts for grouping examples
  mixedAlerts: StockAlert[] = [
    ...this.criticalAlerts,
    ...this.warningAlerts,
    ...this.infoAlerts,
  ];

  // Dashboard alerts with all types
  dashboardAlerts: StockAlert[] = this.mixedAlerts;

  // Alert type examples
  alertTypeExamples: StockAlert[] = [
    {
      id: '9',
      type: 'out-of-stock',
      severity: 'critical',
      product: {
        id: 'prod-009',
        name: 'Insulin Pen Needles',
        sku: 'INS-NED',
      },
      message: 'Product is out of stock',
      createdAt: new Date(Date.now() - 1800000),
      read: false,
      resolved: false,
    },
    {
      id: '10',
      type: 'expired',
      severity: 'critical',
      product: {
        id: 'prod-010',
        name: 'Cough Syrup 100ml',
        sku: 'CSP-100',
      },
      message: 'Product has expired',
      createdAt: new Date(Date.now() - 3600000),
      read: false,
      resolved: false,
    },
    {
      id: '11',
      type: 'low-stock',
      severity: 'warning',
      product: {
        id: 'prod-011',
        name: 'Thermometer Digital',
        sku: 'THM-DIG',
      },
      message: 'Stock level below minimum',
      createdAt: new Date(Date.now() - 5400000),
      read: false,
      resolved: false,
    },
    {
      id: '12',
      type: 'expiring',
      severity: 'warning',
      product: {
        id: 'prod-012',
        name: 'Eye Drops 10ml',
        sku: 'EYE-010',
      },
      message: 'Product expiring soon',
      createdAt: new Date(Date.now() - 7200000),
      read: false,
      resolved: false,
    },
    {
      id: '13',
      type: 'overstock',
      severity: 'info',
      product: {
        id: 'prod-013',
        name: 'Cotton Swabs',
        sku: 'COT-SWB',
      },
      message: 'Stock exceeds maximum',
      createdAt: new Date(Date.now() - 9000000),
      read: false,
      resolved: false,
    },
    {
      id: '14',
      type: 'reorder',
      severity: 'info',
      product: {
        id: 'prod-014',
        name: 'Gauze Pads 5x5cm',
        sku: 'GAU-5X5',
      },
      message: 'Reorder point reached',
      createdAt: new Date(Date.now() - 10800000),
      read: false,
      resolved: false,
    },
  ];

  basicUsageCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-stock-alert-panel
  [alerts]="alerts"
  [groupBy]="'priority'"
  [showActions]="true"
  (alertClick)="handleAlertClick($event)"
  (alertAction)="handleAlertAction($event)"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxStockAlertPanelComponent } from '@aegisx/ui';
import type {
  StockAlert,
  AlertActionEvent,
} from '@aegisx/ui/lib/components/inventory/stock-alert-panel';

@Component({
  selector: 'app-alert-dashboard',
  standalone: true,
  imports: [AxStockAlertPanelComponent],
  template: \`
    <ax-stock-alert-panel
      [alerts]="alerts"
      [groupBy]="'priority'"
      [showActions]="true"
      (alertClick)="handleAlertClick($event)"
      (alertAction)="handleAlertAction($event)"
    />
  \`,
})
export class AlertDashboardComponent {
  alerts: StockAlert[] = [
    {
      id: '1',
      type: 'out-of-stock',
      severity: 'critical',
      product: {
        id: 'prod-001',
        name: 'Aspirin 500mg',
        sku: 'ASP-500',
      },
      message: 'Product is out of stock',
      createdAt: new Date(),
      read: false,
      resolved: false,
    },
    // ... more alerts
  ];

  handleAlertClick(alert: StockAlert): void {
    console.log('Alert clicked:', alert);
    // Navigate to product detail or show alert details
  }

  handleAlertAction(event: AlertActionEvent): void {
    console.log('Action:', event.action, 'Alert:', event.alert);
    // Handle action (create PO, adjust stock, etc.)
  }
}`,
    },
  ];

  severityCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Critical Alerts -->
<ax-stock-alert-panel
  [alerts]="criticalAlerts"
  [groupBy]="'none'"
/>

<!-- Warning Alerts -->
<ax-stock-alert-panel
  [alerts]="warningAlerts"
  [groupBy]="'none'"
/>

<!-- Info Alerts -->
<ax-stock-alert-panel
  [alerts]="infoAlerts"
  [groupBy]="'none'"
/>`,
    },
  ];

  groupingCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Group by Priority (Severity) -->
<ax-stock-alert-panel
  [alerts]="alerts"
  [groupBy]="'priority'"
/>

<!-- Group by Type -->
<ax-stock-alert-panel
  [alerts]="alerts"
  [groupBy]="'type'"
/>

<!-- Group by Location -->
<ax-stock-alert-panel
  [alerts]="alerts"
  [groupBy]="'location'"
/>

<!-- No Grouping (Flat List) -->
<ax-stock-alert-panel
  [alerts]="alerts"
  [groupBy]="'none'"
/>`,
    },
  ];

  webSocketCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-stock-alert-panel
  [enableRealtime]="true"
  [enableSounds]="true"
  [groupBy]="'priority'"
  (alertsLoad)="handleAlertsLoad($event)"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxStockAlertPanelComponent } from '@aegisx/ui';
import type { StockAlert } from '@aegisx/ui/lib/components/inventory/stock-alert-panel';

@Component({
  selector: 'app-realtime-alerts',
  standalone: true,
  imports: [AxStockAlertPanelComponent],
  template: \`
    <ax-stock-alert-panel
      [enableRealtime]="true"
      [enableSounds]="soundsEnabled"
      [groupBy]="'priority'"
      (alertsLoad)="handleAlertsLoad($event)"
    />
  \`,
})
export class RealtimeAlertsComponent {
  soundsEnabled = false; // User preference

  handleAlertsLoad(alerts: StockAlert[]): void {
    console.log('Alerts loaded:', alerts.length);
  }
}`,
    },
  ];

  filteringCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Show only critical and warning alerts -->
<ax-stock-alert-panel
  [alerts]="alerts"
  [filters]="{
    severity: ['critical', 'warning']
  }"
/>

<!-- Show only unresolved alerts -->
<ax-stock-alert-panel
  [alerts]="alerts"
  [filters]="{
    unresolvedOnly: true
  }"
/>

<!-- Show specific alert types -->
<ax-stock-alert-panel
  [alerts]="alerts"
  [filters]="{
    types: ['out-of-stock', 'expired']
  }"
/>

<!-- Combined filters -->
<ax-stock-alert-panel
  [alerts]="alerts"
  [filters]="{
    severity: ['critical'],
    unresolvedOnly: true,
    types: ['out-of-stock', 'expired']
  }"
/>`,
    },
  ];

  stockAlertPanelTokens: ComponentToken[] = [
    {
      category: 'Colors',
      cssVar: '--ax-error-default',
      usage: 'Critical severity indicator color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-error-faint',
      usage: 'Critical severity background',
    },
    {
      category: 'Colors',
      cssVar: '--ax-warning-default',
      usage: 'Warning severity indicator color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-warning-faint',
      usage: 'Warning severity background',
    },
    {
      category: 'Colors',
      cssVar: '--ax-info-default',
      usage: 'Info severity indicator color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-info-faint',
      usage: 'Info severity background',
    },
    {
      category: 'Colors',
      cssVar: '--ax-border-default',
      usage: 'Alert item border color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-background-default',
      usage: 'Alert item background',
    },
    {
      category: 'Colors',
      cssVar: '--ax-background-subtle',
      usage: 'Group header background',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-heading',
      usage: 'Alert message text color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-secondary',
      usage: 'Alert metadata text color',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-xs',
      usage: 'Compact spacing between elements',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-sm',
      usage: 'Small spacing for alert padding',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-md',
      usage: 'Medium spacing between alerts',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-lg',
      usage: 'Large spacing for sections',
    },
    {
      category: 'Borders',
      cssVar: '--ax-radius-md',
      usage: 'Alert item border radius',
    },
    {
      category: 'Borders',
      cssVar: '--ax-radius-lg',
      usage: 'Panel border radius',
    },
  ];

  handleAlertClick(alert: StockAlert): void {
    console.log('Alert clicked:', alert);
  }

  handleAlertAction(event: AlertActionEvent): void {
    console.log('Alert action:', event.action, 'for alert:', event.alert.id);
  }

  handleAlertDismiss(alertId: string): void {
    console.log('Alert dismissed:', alertId);
  }

  handleAlertResolve(alertId: string): void {
    console.log('Alert resolved:', alertId);
  }
}
