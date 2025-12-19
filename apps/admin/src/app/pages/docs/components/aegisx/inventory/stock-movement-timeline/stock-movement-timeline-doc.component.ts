/* eslint-disable @typescript-eslint/prefer-as-const */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AxStockMovementTimelineComponent } from '@aegisx/ui';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../../../components/docs';
import { ComponentToken } from '../../../../../../types/docs.types';

@Component({
  selector: 'ax-stock-movement-timeline-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    AxStockMovementTimelineComponent,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="stock-movement-timeline-doc">
      <ax-doc-header
        title="Stock Movement Timeline"
        icon="timeline"
        description="Visual timeline of stock movements with Chart.js integration, filtering, grouping, and export capabilities."
        [breadcrumbs]="[
          {
            label: 'Inventory',
            link: '/docs/components/aegisx/inventory/stock-movement-timeline',
          },
          { label: 'Stock Movement Timeline' },
        ]"
        status="stable"
        version="1.0.0"
        importStatement="import { AxStockMovementTimelineComponent } from '@aegisx/ui';"
      ></ax-doc-header>

      <mat-tab-group
        class="stock-movement-timeline-doc__tabs"
        animationDuration="150ms"
      >
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="stock-movement-timeline-doc__tab-content">
            <section class="stock-movement-timeline-doc__section">
              <h2>Basic Usage</h2>
              <p>
                The Stock Movement Timeline component displays a chronological
                list of stock movements with a visual timeline, running balance
                chart, and powerful filtering capabilities. Ideal for tracking
                inventory changes and analyzing stock flow patterns.
              </p>

              <ax-live-preview variant="bordered">
                <div class="stock-movement-timeline-doc__demo">
                  <ax-stock-movement-timeline
                    [productId]="'PROD-001'"
                    [movements]="sampleMovements"
                    [showBalance]="true"
                    [showFilters]="true"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="basicUsageCode"></ax-code-tabs>
            </section>

            <section class="stock-movement-timeline-doc__section">
              <h2>Chart Integration</h2>
              <p>
                Display running balance over time using Chart.js integration.
                The line chart automatically updates based on filtered
                movements.
              </p>

              <ax-live-preview variant="bordered">
                <div class="stock-movement-timeline-doc__demo">
                  <ax-stock-movement-timeline
                    [productId]="'PROD-002'"
                    [movements]="sampleMovements"
                    [showBalance]="true"
                    [showFilters]="false"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="chartIntegrationCode"></ax-code-tabs>
            </section>

            <section class="stock-movement-timeline-doc__section">
              <h2>Grouping Strategies</h2>
              <p>
                Group movements by day, week, or month for better organization
                and analysis of stock flow patterns.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-lg)"
                align="stretch"
              >
                <div class="stock-movement-timeline-doc__demo">
                  <h4>Group by Day</h4>
                  <ax-stock-movement-timeline
                    [productId]="'PROD-003'"
                    [movements]="sampleMovements"
                    [(groupBy)]="groupByDay"
                    [showBalance]="false"
                  />
                </div>

                <div class="stock-movement-timeline-doc__demo">
                  <h4>Group by Week</h4>
                  <ax-stock-movement-timeline
                    [productId]="'PROD-004'"
                    [movements]="sampleMovements"
                    [(groupBy)]="groupByWeek"
                    [showBalance]="false"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="groupingCode"></ax-code-tabs>
            </section>

            <section class="stock-movement-timeline-doc__section">
              <h2>Filtering</h2>
              <p>
                Filter movements by date range, movement type
                (in/out/adjustment), location, and user. Filters update the
                timeline and chart in real-time.
              </p>

              <ax-live-preview variant="bordered">
                <div class="stock-movement-timeline-doc__demo">
                  <ax-stock-movement-timeline
                    [productId]="'PROD-005'"
                    [movements]="sampleMovements"
                    [showFilters]="true"
                    (filterChange)="handleFilterChange($event)"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="filteringCode"></ax-code-tabs>
            </section>

            <section class="stock-movement-timeline-doc__section">
              <h2>Export Functionality</h2>
              <p>
                Export movement data to PDF or Excel format for reporting and
                analysis purposes.
              </p>

              <ax-live-preview variant="bordered">
                <div class="stock-movement-timeline-doc__demo">
                  <ax-stock-movement-timeline
                    [productId]="'PROD-006'"
                    [movements]="sampleMovements"
                    [enableExport]="true"
                    (dataExport)="handleExport($event)"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="exportCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="stock-movement-timeline-doc__tab-content">
            <section class="stock-movement-timeline-doc__section">
              <h2>Movement Type Colors</h2>
              <p>
                Different movement types are color-coded for easy
                identification: green for inbound, red for outbound, and blue
                for adjustments.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-md)"
                align="stretch"
              >
                <div class="stock-movement-timeline-doc__type-demo">
                  <div class="type-indicator type-indicator--in">
                    <mat-icon>arrow_downward</mat-icon>
                    <span>Inbound (Green)</span>
                  </div>
                  <p>Receive, Transfer In, Adjust In</p>
                </div>

                <div class="stock-movement-timeline-doc__type-demo">
                  <div class="type-indicator type-indicator--out">
                    <mat-icon>arrow_upward</mat-icon>
                    <span>Outbound (Red)</span>
                  </div>
                  <p>Issue, Transfer Out, Adjust Out</p>
                </div>

                <div class="stock-movement-timeline-doc__type-demo">
                  <div class="type-indicator type-indicator--adjust">
                    <mat-icon>tune</mat-icon>
                    <span>Adjustment (Blue)</span>
                  </div>
                  <p>Adjust In, Adjust Out (Stock Count, Correction)</p>
                </div>
              </ax-live-preview>
            </section>

            <section class="stock-movement-timeline-doc__section">
              <h2>Real-time Updates</h2>
              <p>
                Enable WebSocket integration to receive real-time stock movement
                updates with visual animations for new entries.
              </p>

              <ax-live-preview variant="bordered">
                <div class="stock-movement-timeline-doc__demo">
                  <ax-stock-movement-timeline
                    [productId]="'PROD-007'"
                    [movements]="sampleMovements"
                    [enableRealtime]="true"
                    (movementsLoad)="handleMovementsLoad($event)"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="realtimeCode"></ax-code-tabs>
            </section>

            <section class="stock-movement-timeline-doc__section">
              <h2>Expandable Movement Details</h2>
              <p>
                Click on any movement to expand and view detailed information
                including user, reference document, batch number, and notes.
              </p>

              <ax-live-preview variant="bordered">
                <div class="stock-movement-timeline-doc__demo">
                  <ax-stock-movement-timeline
                    [productId]="'PROD-008'"
                    [movements]="sampleMovements"
                    (movementClick)="handleMovementClick($event)"
                  />
                </div>
              </ax-live-preview>
            </section>

            <section class="stock-movement-timeline-doc__section">
              <h2>Custom Date Ranges</h2>
              <p>
                Pre-filter movements by providing a date range input for focused
                analysis of specific time periods.
              </p>

              <ax-live-preview variant="bordered">
                <div class="stock-movement-timeline-doc__demo">
                  <ax-stock-movement-timeline
                    [productId]="'PROD-009'"
                    [movements]="sampleMovements"
                    [dateRange]="customDateRange"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="dateRangeCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="stock-movement-timeline-doc__tab-content">
            <section class="stock-movement-timeline-doc__section">
              <h2>Input Properties</h2>
              <div class="stock-movement-timeline-doc__api-table">
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
                      <td><code>productId</code></td>
                      <td><code>string</code></td>
                      <td><em>Required</em></td>
                      <td>Product ID to show movements for</td>
                    </tr>
                    <tr>
                      <td><code>movements</code></td>
                      <td><code>MovementRecord[]</code></td>
                      <td><code>[]</code></td>
                      <td>Pre-loaded movements (otherwise fetch from API)</td>
                    </tr>
                    <tr>
                      <td><code>groupBy</code></td>
                      <td><code>GroupByStrategy</code></td>
                      <td><code>'none'</code></td>
                      <td>
                        Grouping strategy: 'none' | 'day' | 'week' | 'month'
                        (supports two-way binding)
                      </td>
                    </tr>
                    <tr>
                      <td><code>showBalance</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Show running balance line chart</td>
                    </tr>
                    <tr>
                      <td><code>showFilters</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Show filter controls</td>
                    </tr>
                    <tr>
                      <td><code>enableExport</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Enable PDF/Excel export buttons</td>
                    </tr>
                    <tr>
                      <td><code>enableRealtime</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Enable WebSocket real-time updates</td>
                    </tr>
                    <tr>
                      <td><code>dateRange</code></td>
                      <td><code>&#123; start: Date; end: Date &#125;</code></td>
                      <td><code>undefined</code></td>
                      <td>Pre-filter date range</td>
                    </tr>
                    <tr>
                      <td><code>pageSize</code></td>
                      <td><code>number</code></td>
                      <td><code>50</code></td>
                      <td>Items per page for pagination</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="stock-movement-timeline-doc__section">
              <h2>Output Events</h2>
              <div class="stock-movement-timeline-doc__api-table">
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
                      <td><code>movementClick</code></td>
                      <td><code>MovementRecord</code></td>
                      <td>Emitted when movement is clicked</td>
                    </tr>
                    <tr>
                      <td><code>dataExport</code></td>
                      <td><code>ExportEventData</code></td>
                      <td>Emitted on export (format and data)</td>
                    </tr>
                    <tr>
                      <td><code>filterChange</code></td>
                      <td><code>MovementFilter</code></td>
                      <td>Emitted when filters change</td>
                    </tr>
                    <tr>
                      <td><code>movementsLoad</code></td>
                      <td><code>MovementRecord[]</code></td>
                      <td>Emitted after movements loaded from API</td>
                    </tr>
                    <tr>
                      <td><code>loadError</code></td>
                      <td><code>string</code></td>
                      <td>Emitted on errors</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="stock-movement-timeline-doc__section">
              <h2>Type Definitions</h2>

              <h3>MovementRecord</h3>
              <pre><code>interface MovementRecord &#123;
  id: string;
  timestamp: Date;
  type: MovementType;
  quantity: number;
  balanceAfter: number;
  unit: string;
  user: &#123;
    id: string;
    name: string;
  &#125;;
  location?: string;
  batchNumber?: string;
  referenceDocument?: &#123;
    type: string;
    number: string;
  &#125;;
  notes?: string;
&#125;</code></pre>

              <h3>MovementFilter</h3>
              <pre><code>interface MovementFilter &#123;
  types: MovementType[];
  dateRange?: &#123;
    start: Date;
    end: Date;
  &#125;;
  locations?: string[];
  users?: string[];
&#125;</code></pre>

              <h3>ExportEventData</h3>
              <pre><code>interface ExportEventData &#123;
  format: 'pdf' | 'excel';
  data: MovementRecord[];
&#125;</code></pre>

              <h3>MovementType</h3>
              <pre><code>type MovementType =
  | 'receive'       // Receiving stock (inbound - green)
  | 'issue'         // Issuing stock (outbound - red)
  | 'transfer-in'   // Transfer in (inbound - green)
  | 'transfer-out'  // Transfer out (outbound - red)
  | 'adjust-in'     // Adjustment increase (adjustment - blue)
  | 'adjust-out';   // Adjustment decrease (adjustment - blue)</code></pre>
            </section>
          </div>
        </mat-tab>

        <!-- Tokens Tab -->
        <mat-tab label="Tokens">
          <div class="stock-movement-timeline-doc__tab-content">
            <ax-component-tokens
              [tokens]="stockMovementTimelineTokens"
            ></ax-component-tokens>
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="stock-movement-timeline-doc__tab-content">
            <section class="stock-movement-timeline-doc__section">
              <h2>Do's and Don'ts</h2>

              <div class="stock-movement-timeline-doc__guidelines">
                <div
                  class="stock-movement-timeline-doc__guideline stock-movement-timeline-doc__guideline--do"
                >
                  <h4><mat-icon>check_circle</mat-icon> Do</h4>
                  <ul>
                    <li>
                      Use consistent movement types across your application
                    </li>
                    <li>Provide clear reference documents for audit trails</li>
                    <li>Enable real-time updates for critical inventory</li>
                    <li>
                      Group movements by appropriate time periods for analysis
                    </li>
                    <li>Export data regularly for compliance and reporting</li>
                  </ul>
                </div>

                <div
                  class="stock-movement-timeline-doc__guideline stock-movement-timeline-doc__guideline--dont"
                >
                  <h4><mat-icon>cancel</mat-icon> Don't</h4>
                  <ul>
                    <li>Mix movement types without clear categorization</li>
                    <li>Display hundreds of movements without pagination</li>
                    <li>
                      Disable filters for products with high movement frequency
                    </li>
                    <li>
                      Forget to include user information for accountability
                    </li>
                    <li>Ignore batch numbers for expiry-tracked items</li>
                  </ul>
                </div>
              </div>
            </section>

            <section class="stock-movement-timeline-doc__section">
              <h2>Chart.js Integration</h2>
              <ul class="stock-movement-timeline-doc__best-practices">
                <li>
                  <strong>Running Balance Chart:</strong> Automatically displays
                  stock balance over time using Chart.js line chart
                </li>
                <li>
                  <strong>Responsive Design:</strong> Chart adjusts to container
                  size and maintains aspect ratio
                </li>
                <li>
                  <strong>Time Scale:</strong> X-axis uses Chart.js time scale
                  with automatic unit selection (day/week/month)
                </li>
                <li>
                  <strong>Interactive Tooltips:</strong> Hover over data points
                  to see exact balance and timestamp
                </li>
                <li>
                  <strong>Reactive Updates:</strong> Chart automatically updates
                  when filters or grouping changes
                </li>
              </ul>
            </section>

            <section class="stock-movement-timeline-doc__section">
              <h2>Filtering Best Practices</h2>
              <ul class="stock-movement-timeline-doc__best-practices">
                <li>
                  <strong>Date Range:</strong> Use date pickers to filter
                  movements within specific time periods
                </li>
                <li>
                  <strong>Movement Type:</strong> Filter by type chips
                  (in/out/adjustment) to focus on specific operations
                </li>
                <li>
                  <strong>Location Filter:</strong> Essential for multi-location
                  inventory management
                </li>
                <li>
                  <strong>Clear Filters:</strong> Always provide a clear button
                  to reset all filters quickly
                </li>
                <li>
                  <strong>Filter Persistence:</strong> Consider saving filter
                  state in URL or local storage
                </li>
              </ul>
            </section>

            <section class="stock-movement-timeline-doc__section">
              <h2>Accessibility</h2>
              <ul class="stock-movement-timeline-doc__a11y-list">
                <li>
                  Timeline uses semantic HTML structure with proper heading
                  hierarchy
                </li>
                <li>
                  Movement cards are keyboard accessible with focus indicators
                </li>
                <li>
                  Filter controls include proper ARIA labels and keyboard
                  navigation
                </li>
                <li>
                  Chart canvas includes descriptive title and ARIA attributes
                </li>
                <li>
                  Export buttons are keyboard accessible with clear labels
                </li>
                <li>
                  Color-coded movement types also include icons for color-blind
                  users
                </li>
              </ul>
            </section>

            <section class="stock-movement-timeline-doc__section">
              <h2>Performance Considerations</h2>
              <ul class="stock-movement-timeline-doc__best-practices">
                <li>
                  <strong>Virtual Scrolling:</strong> Component uses CDK virtual
                  scrolling for large datasets (1000+ movements)
                </li>
                <li>
                  <strong>Pagination:</strong> API requests are paginated with
                  configurable page size
                </li>
                <li>
                  <strong>Lazy Loading:</strong> Chart.js and export libraries
                  (jsPDF, xlsx) are dynamically imported
                </li>
                <li>
                  <strong>Signal-based Reactivity:</strong> Efficient updates
                  using Angular signals and computed values
                </li>
                <li>
                  <strong>Memory Management:</strong> Chart instance is properly
                  destroyed on component cleanup
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
      .stock-movement-timeline-doc {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--ax-spacing-xl, 1.5rem);
      }

      .stock-movement-timeline-doc__tabs {
        margin-top: var(--ax-spacing-xl, 1.5rem);
      }

      .stock-movement-timeline-doc__tab-content {
        padding: var(--ax-spacing-xl, 1.5rem) 0;
      }

      .stock-movement-timeline-doc__section {
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

      .stock-movement-timeline-doc__demo {
        width: 100%;

        h4 {
          font-size: var(--ax-text-sm, 0.875rem);
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0 0 var(--ax-spacing-sm, 0.5rem) 0;
        }
      }

      /* Movement Type Indicators */
      .stock-movement-timeline-doc__type-demo {
        padding: var(--ax-spacing-md, 0.75rem);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-md, 0.5rem);
        background: var(--ax-background-default);

        .type-indicator {
          display: flex;
          align-items: center;
          gap: var(--ax-spacing-xs, 0.25rem);
          margin-bottom: var(--ax-spacing-xs, 0.25rem);

          mat-icon {
            font-size: 20px;
            width: 20px;
            height: 20px;
          }

          span {
            font-weight: 600;
            font-size: var(--ax-text-sm, 0.875rem);
          }
        }

        .type-indicator--in {
          color: var(--ax-success-emphasis);

          mat-icon {
            color: var(--ax-success-default);
          }
        }

        .type-indicator--out {
          color: var(--ax-error-emphasis);

          mat-icon {
            color: var(--ax-error-default);
          }
        }

        .type-indicator--adjust {
          color: var(--ax-info-emphasis);

          mat-icon {
            color: var(--ax-info-default);
          }
        }

        p {
          font-size: var(--ax-text-xs, 0.75rem);
          color: var(--ax-text-secondary);
          margin: 0;
        }
      }

      /* API Table */
      .stock-movement-timeline-doc__api-table {
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
      .stock-movement-timeline-doc__guidelines {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--ax-spacing-lg, 1rem);
      }

      .stock-movement-timeline-doc__guideline {
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

      .stock-movement-timeline-doc__guideline--do {
        background: var(--ax-success-faint);

        h4 {
          color: var(--ax-success-emphasis);
        }
        li {
          color: var(--ax-success-emphasis);
        }
      }

      .stock-movement-timeline-doc__guideline--dont {
        background: var(--ax-error-faint);

        h4 {
          color: var(--ax-error-emphasis);
        }
        li {
          color: var(--ax-error-emphasis);
        }
      }

      .stock-movement-timeline-doc__a11y-list,
      .stock-movement-timeline-doc__best-practices {
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
export class StockMovementTimelineDocComponent {
  // Sample data for examples
  sampleMovements = [
    {
      id: '1',
      timestamp: new Date('2024-01-15T10:30:00'),
      type: 'receive' as const,
      quantity: 100,
      balanceAfter: 100,
      unit: 'pieces',
      user: { id: 'user-1', name: 'John Doe' },
      location: 'Warehouse A',
      batchNumber: 'BATCH-001',
      referenceDocument: { type: 'PO' as const, number: 'PO-2024-001' },
    },
    {
      id: '2',
      timestamp: new Date('2024-01-14T14:20:00'),
      type: 'issue' as const,
      quantity: 25,
      balanceAfter: 75,
      unit: 'pieces',
      user: { id: 'user-2', name: 'Jane Smith' },
      location: 'Store Front',
      referenceDocument: { type: 'SO' as const, number: 'SO-2024-042' },
    },
    {
      id: '3',
      timestamp: new Date('2024-01-13T09:15:00'),
      type: 'adjust-in' as const,
      quantity: 5,
      balanceAfter: 100,
      unit: 'pieces',
      user: { id: 'user-3', name: 'Admin' },
      location: 'Warehouse A',
      notes: 'Stock count correction',
    },
  ];

  groupByDay: 'day' = 'day';
  groupByWeek: 'week' = 'week';

  customDateRange = {
    start: new Date('2024-01-01'),
    end: new Date('2024-01-31'),
  };

  basicUsageCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-stock-movement-timeline
  [productId]="'PROD-001'"
  [showBalance]="true"
  [showFilters]="true"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxStockMovementTimelineComponent } from '@aegisx/ui';

@Component({
  selector: 'app-product-history',
  standalone: true,
  imports: [AxStockMovementTimelineComponent],
  template: \`
    <ax-stock-movement-timeline
      [productId]="productId"
      [showBalance]="true"
      (movementClick)="handleMovementClick($event)"
    />
  \`,
})
export class ProductHistoryComponent {
  productId = 'PROD-001';

  handleMovementClick(movement: MovementRecord): void {
    console.log('Movement clicked:', movement);
  }
}`,
    },
  ];

  chartIntegrationCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-stock-movement-timeline
  [productId]="'PROD-002'"
  [showBalance]="true"
  [showFilters]="false"
/>`,
    },
    {
      label: 'Notes',
      language: 'typescript' as const,
      code: `// Chart.js Integration
//
// The component automatically integrates Chart.js to display
// a running balance line chart:
//
// - Time Scale: Uses chartjs-adapter-date-fns for time axis
// - Responsive: Chart adjusts to container width
// - Interactive: Hover tooltips show balance and timestamp
// - Reactive: Updates automatically when filters change
// - Lazy Loaded: Chart.js is dynamically imported (80KB)`,
    },
  ];

  groupingCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Two-way binding for grouping -->
<ax-stock-movement-timeline
  [productId]="'PROD-003'"
  [(groupBy)]="groupingStrategy"
/>

<!-- Or one-way binding -->
<ax-stock-movement-timeline
  [productId]="'PROD-004'"
  [groupBy]="'week'"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxStockMovementTimelineComponent } from '@aegisx/ui';
import type { GroupByStrategy } from '@aegisx/ui';

@Component({
  selector: 'app-movement-analysis',
  standalone: true,
  imports: [AxStockMovementTimelineComponent],
  template: \`
    <ax-stock-movement-timeline
      [productId]="productId"
      [(groupBy)]="grouping"
    />
  \`,
})
export class MovementAnalysisComponent {
  productId = 'PROD-003';
  grouping: GroupByStrategy = 'week';
}`,
    },
  ];

  filteringCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-stock-movement-timeline
  [productId]="'PROD-005'"
  [showFilters]="true"
  (filterChange)="handleFilterChange($event)"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxStockMovementTimelineComponent } from '@aegisx/ui';
import type { MovementFilter } from '@aegisx/ui';

@Component({
  selector: 'app-filtered-movements',
  standalone: true,
  imports: [AxStockMovementTimelineComponent],
  template: \`
    <ax-stock-movement-timeline
      [productId]="productId"
      [showFilters]="true"
      (filterChange)="handleFilterChange($event)"
    />
  \`,
})
export class FilteredMovementsComponent {
  productId = 'PROD-005';

  handleFilterChange(filter: MovementFilter): void {
    console.log('Active filters:', filter);
    // Save to URL params or local storage
  }
}`,
    },
  ];

  exportCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-stock-movement-timeline
  [productId]="'PROD-006'"
  [enableExport]="true"
  (dataExport)="handleExport($event)"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxStockMovementTimelineComponent } from '@aegisx/ui';
import type { ExportEventData } from '@aegisx/ui';

@Component({
  selector: 'app-exportable-movements',
  standalone: true,
  imports: [AxStockMovementTimelineComponent],
  template: \`
    <ax-stock-movement-timeline
      [productId]="productId"
      [enableExport]="true"
      (dataExport)="handleExport($event)"
    />
  \`,
})
export class ExportableMovementsComponent {
  productId = 'PROD-006';

  handleExport(event: ExportEventData): void {
    console.log(\`Exporting \${event.data.length} movements as \${event.format}\`);
    // Component handles actual export with jsPDF or xlsx
    // This event is for tracking/analytics
  }
}`,
    },
  ];

  realtimeCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-stock-movement-timeline
  [productId]="'PROD-007'"
  [enableRealtime]="true"
  (movementsLoad)="handleMovementsLoad($event)"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxStockMovementTimelineComponent } from '@aegisx/ui';
import type { MovementRecord } from '@aegisx/ui';

@Component({
  selector: 'app-realtime-movements',
  standalone: true,
  imports: [AxStockMovementTimelineComponent],
  template: \`
    <ax-stock-movement-timeline
      [productId]="productId"
      [enableRealtime]="true"
      (movementsLoad)="handleMovementsLoad($event)"
    />
  \`,
})
export class RealtimeMovementsComponent {
  productId = 'PROD-007';

  handleMovementsLoad(movements: MovementRecord[]): void {
    console.log(\`Loaded \${movements.length} movements\`);
    // New movements will appear with animation
  }
}`,
    },
  ];

  dateRangeCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-stock-movement-timeline
  [productId]="'PROD-009'"
  [dateRange]="customDateRange"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxStockMovementTimelineComponent } from '@aegisx/ui';

@Component({
  selector: 'app-date-filtered-movements',
  standalone: true,
  imports: [AxStockMovementTimelineComponent],
  template: \`
    <ax-stock-movement-timeline
      [productId]="productId"
      [dateRange]="dateRange"
    />
  \`,
})
export class DateFilteredMovementsComponent {
  productId = 'PROD-009';
  dateRange = {
    start: new Date('2024-01-01'),
    end: new Date('2024-01-31'),
  };
}`,
    },
  ];

  stockMovementTimelineTokens: ComponentToken[] = [
    {
      category: 'Colors',
      cssVar: '--ax-success-default',
      usage: 'Inbound movement color (receive, transfer-in, adjust-in)',
    },
    {
      category: 'Colors',
      cssVar: '--ax-error-default',
      usage: 'Outbound movement color (issue, transfer-out, adjust-out)',
    },
    {
      category: 'Colors',
      cssVar: '--ax-info-default',
      usage: 'Adjustment movement color (adjust-in, adjust-out)',
    },
    {
      category: 'Colors',
      cssVar: '--ax-background-default',
      usage: 'Timeline card background',
    },
    {
      category: 'Colors',
      cssVar: '--ax-background-subtle',
      usage: 'Filter panel and chart background',
    },
    {
      category: 'Colors',
      cssVar: '--ax-border-default',
      usage: 'Timeline connector and card borders',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-heading',
      usage: 'Movement type and timestamp text',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-secondary',
      usage: 'User, location, and metadata text',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-md',
      usage: 'Timeline card padding',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-lg',
      usage: 'Gap between timeline items',
    },
    {
      category: 'Borders',
      cssVar: '--ax-radius-md',
      usage: 'Timeline card corner rounding',
    },
  ];

  handleFilterChange(filter: any): void {
    console.log('Filter changed:', filter);
  }

  handleExport(event: any): void {
    console.log('Export event:', event);
  }

  handleMovementClick(movement: any): void {
    console.log('Movement clicked:', movement);
  }

  handleMovementsLoad(movements: any[]): void {
    console.log('Movements loaded:', movements);
  }
}
