import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AxBatchSelectorComponent } from '@aegisx/ui';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../../../components/docs';
import { ComponentToken } from '../../../../../../types/docs.types';

@Component({
  selector: 'ax-batch-selector-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    AxBatchSelectorComponent,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="batch-selector-doc">
      <ax-doc-header
        title="Batch Selector"
        icon="qr_code_scanner"
        description="Smart batch/lot number selector with FIFO, FEFO, and LIFO strategies, expiry tracking, and quantity allocation."
        [breadcrumbs]="[
          {
            label: 'Inventory',
            link: '/docs/components/aegisx/inventory/batch-selector',
          },
          { label: 'Batch Selector' },
        ]"
        status="stable"
        version="1.0.0"
        importStatement="import { AxBatchSelectorComponent } from '@aegisx/ui';"
      ></ax-doc-header>

      <mat-tab-group class="batch-selector-doc__tabs" animationDuration="150ms">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="batch-selector-doc__tab-content">
            <section class="batch-selector-doc__section">
              <h2>Basic Usage</h2>
              <p>
                The Batch Selector component helps users select batch/lot
                numbers for inventory operations with automatic sorting based on
                strategies like FIFO, FEFO, or LIFO. It includes expiry
                tracking, quantity allocation, and color-coded status
                indicators.
              </p>

              <ax-live-preview variant="bordered">
                <div class="batch-selector-doc__demo">
                  <ax-batch-selector
                    [productId]="'PROD-001'"
                    [batches]="sampleBatches"
                    [strategy]="'fefo'"
                    [allowMultiple]="true"
                    [requestedQuantity]="150"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="basicUsageCode"></ax-code-tabs>
            </section>

            <section class="batch-selector-doc__section">
              <h2>Selection Strategies</h2>
              <p>
                Choose between three batch selection strategies: FIFO (First In
                First Out), FEFO (First Expired First Out), and LIFO (Last In
                First Out).
              </p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-lg)"
                align="stretch"
              >
                <div class="batch-selector-doc__demo">
                  <h4>FIFO - First In First Out</h4>
                  <p class="strategy-desc">
                    Selects oldest batches first based on manufacturing date
                  </p>
                  <ax-batch-selector
                    [productId]="'PROD-002'"
                    [batches]="sampleBatches"
                    [strategy]="'fifo'"
                    [showRecommendation]="true"
                  />
                </div>

                <div class="batch-selector-doc__demo">
                  <h4>FEFO - First Expired First Out (Recommended)</h4>
                  <p class="strategy-desc">
                    Selects batches with nearest expiry dates first
                  </p>
                  <ax-batch-selector
                    [productId]="'PROD-002'"
                    [batches]="sampleBatches"
                    [strategy]="'fefo'"
                    [showRecommendation]="true"
                  />
                </div>

                <div class="batch-selector-doc__demo">
                  <h4>LIFO - Last In First Out</h4>
                  <p class="strategy-desc">
                    Selects newest batches first based on manufacturing date
                  </p>
                  <ax-batch-selector
                    [productId]="'PROD-002'"
                    [batches]="sampleBatches"
                    [strategy]="'lifo'"
                    [showRecommendation]="true"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="strategiesCode"></ax-code-tabs>
            </section>

            <section class="batch-selector-doc__section">
              <h2>Expiry Status Tracking</h2>
              <p>
                Batches are color-coded based on their expiry status: safe
                (green), warning (yellow), critical (red), and expired (gray).
              </p>

              <ax-live-preview variant="bordered">
                <div class="batch-selector-doc__demo">
                  <ax-batch-selector
                    [productId]="'PROD-003'"
                    [batches]="expiryStatusBatches"
                    [strategy]="'fefo'"
                    [showExpiry]="true"
                    [expiryWarningDays]="30"
                    [expiryCriticalDays]="7"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="expiryTrackingCode"></ax-code-tabs>
            </section>

            <section class="batch-selector-doc__section">
              <h2>Quantity Allocation</h2>
              <p>
                When a requested quantity is specified, the component
                automatically calculates how much to allocate from each batch.
              </p>

              <ax-live-preview variant="bordered">
                <div class="batch-selector-doc__demo">
                  <ax-batch-selector
                    [productId]="'PROD-004'"
                    [batches]="sampleBatches"
                    [strategy]="'fefo'"
                    [allowMultiple]="true"
                    [requestedQuantity]="250"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="quantityAllocationCode"></ax-code-tabs>
            </section>

            <section class="batch-selector-doc__section">
              <h2>Single Selection Mode</h2>
              <p>
                Disable multi-select to allow only one batch selection at a
                time.
              </p>

              <ax-live-preview variant="bordered">
                <div class="batch-selector-doc__demo">
                  <ax-batch-selector
                    [productId]="'PROD-005'"
                    [batches]="sampleBatches"
                    [strategy]="'fefo'"
                    [allowMultiple]="false"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="singleSelectCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="batch-selector-doc__tab-content">
            <section class="batch-selector-doc__section">
              <h2>Stock Transfer Workflow</h2>
              <p>
                Use batch selector in a stock transfer workflow to select which
                batches to move to another location.
              </p>

              <ax-live-preview variant="bordered">
                <div class="batch-selector-doc__workflow-card">
                  <div class="workflow-header">
                    <h4>Transfer Medical Gloves</h4>
                    <span class="workflow-step"
                      >Step 2 of 4: Select Batches</span
                    >
                  </div>
                  <div class="workflow-info">
                    <div class="info-item">
                      <span class="label">From:</span>
                      <span class="value">Central Warehouse</span>
                    </div>
                    <div class="info-item">
                      <span class="label">To:</span>
                      <span class="value">Floor 3 - ER</span>
                    </div>
                    <div class="info-item">
                      <span class="label">Requested:</span>
                      <span class="value">200 pieces</span>
                    </div>
                  </div>
                  <ax-batch-selector
                    [productId]="'PROD-006'"
                    [batches]="sampleBatches"
                    [strategy]="'fefo'"
                    [allowMultiple]="true"
                    [requestedQuantity]="200"
                  />
                </div>
              </ax-live-preview>
            </section>

            <section class="batch-selector-doc__section">
              <h2>Expiry Status Indicators</h2>
              <p>
                Visual demonstration of all expiry status colors and their
                meaning.
              </p>

              <div class="batch-selector-doc__status-legend">
                <div class="status-item status-item--safe">
                  <div class="status-badge"></div>
                  <div class="status-info">
                    <strong>Safe (Green)</strong>
                    <p>More than 30 days until expiry</p>
                  </div>
                </div>
                <div class="status-item status-item--warning">
                  <div class="status-badge"></div>
                  <div class="status-info">
                    <strong>Warning (Yellow)</strong>
                    <p>7-30 days until expiry</p>
                  </div>
                </div>
                <div class="status-item status-item--critical">
                  <div class="status-badge"></div>
                  <div class="status-info">
                    <strong>Critical (Red)</strong>
                    <p>Less than 7 days until expiry</p>
                  </div>
                </div>
                <div class="status-item status-item--expired">
                  <div class="status-badge"></div>
                  <div class="status-info">
                    <strong>Expired (Gray)</strong>
                    <p>Past expiry date - cannot be selected</p>
                  </div>
                </div>
              </div>
            </section>

            <section class="batch-selector-doc__section">
              <h2>Search and Filter</h2>
              <p>
                Users can search for specific batch numbers or lot numbers to
                quickly find the batch they need.
              </p>

              <ax-live-preview variant="bordered">
                <div class="batch-selector-doc__demo">
                  <ax-batch-selector
                    [productId]="'PROD-007'"
                    [batches]="largeBatchList"
                    [strategy]="'fefo'"
                  />
                </div>
              </ax-live-preview>
            </section>

            <section class="batch-selector-doc__section">
              <h2>Recommended Batch Highlight</h2>
              <p>
                The component automatically highlights the recommended batch
                based on the selected strategy and availability.
              </p>

              <ax-live-preview variant="bordered">
                <div class="batch-selector-doc__demo">
                  <ax-batch-selector
                    [productId]="'PROD-008'"
                    [batches]="sampleBatches"
                    [strategy]="'fefo'"
                    [showRecommendation]="true"
                  />
                </div>
              </ax-live-preview>
            </section>
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="batch-selector-doc__tab-content">
            <section class="batch-selector-doc__section">
              <h2>Input Properties</h2>
              <div class="batch-selector-doc__api-table">
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
                      <td>Product ID to fetch batches for</td>
                    </tr>
                    <tr>
                      <td><code>batches</code></td>
                      <td><code>BatchInfo[]</code></td>
                      <td><code>[]</code></td>
                      <td>Pre-loaded batches (if not loading from API)</td>
                    </tr>
                    <tr>
                      <td><code>strategy</code></td>
                      <td><code>'fifo' | 'fefo' | 'lifo'</code></td>
                      <td><code>'fefo'</code></td>
                      <td>
                        Batch selection strategy (supports two-way binding)
                      </td>
                    </tr>
                    <tr>
                      <td><code>allowMultiple</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Allow selecting multiple batches</td>
                    </tr>
                    <tr>
                      <td><code>requestedQuantity</code></td>
                      <td><code>number</code></td>
                      <td><code>undefined</code></td>
                      <td>Requested quantity for auto-calculation</td>
                    </tr>
                    <tr>
                      <td><code>showExpiry</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Show expiry date information</td>
                    </tr>
                    <tr>
                      <td><code>showManufacturing</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Show manufacturing date information</td>
                    </tr>
                    <tr>
                      <td><code>showRecommendation</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Show recommended batch indicator</td>
                    </tr>
                    <tr>
                      <td><code>expiryWarningDays</code></td>
                      <td><code>number</code></td>
                      <td><code>30</code></td>
                      <td>Days threshold for expiry warning (yellow)</td>
                    </tr>
                    <tr>
                      <td><code>expiryCriticalDays</code></td>
                      <td><code>number</code></td>
                      <td><code>7</code></td>
                      <td>Days threshold for critical expiry (red)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="batch-selector-doc__section">
              <h2>Output Events</h2>
              <div class="batch-selector-doc__api-table">
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
                      <td><code>batchSelect</code></td>
                      <td><code>BatchSelection</code></td>
                      <td>Emitted when batch selection changes</td>
                    </tr>
                    <tr>
                      <td><code>batchesLoad</code></td>
                      <td><code>BatchInfo[]</code></td>
                      <td>Emitted when batches are loaded from API</td>
                    </tr>
                    <tr>
                      <td><code>loadError</code></td>
                      <td><code>string</code></td>
                      <td>Emitted on API load errors</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="batch-selector-doc__section">
              <h2>Type Definitions</h2>

              <h3>BatchInfo</h3>
              <pre><code>interface BatchInfo &#123;
  batchNumber: string;         // Batch/lot number
  lotNumber?: string;          // Optional lot number
  expiryDate: Date;            // Expiration date
  manufacturingDate?: Date;    // Manufacturing date
  availableQuantity: number;   // Available quantity in this batch
  status: 'available' | 'reserved' | 'quarantine';
&#125;</code></pre>

              <h3>BatchSelection</h3>
              <pre><code>interface BatchSelection &#123;
  batches: SelectedBatch[];    // Array of selected batches
  totalQuantity: number;       // Total quantity across all batches
  strategy: 'fifo' | 'fefo' | 'lifo';
&#125;</code></pre>

              <h3>SelectedBatch</h3>
              <pre><code>interface SelectedBatch &#123;
  batch: BatchInfo;            // Batch information
  quantity: number;            // Allocated quantity from this batch
&#125;</code></pre>

              <h3>ExpiryStatus</h3>
              <pre><code>type ExpiryStatus = 'safe' | 'warning' | 'critical' | 'expired';</code></pre>

              <h3>Strategy Behavior</h3>
              <div class="batch-selector-doc__strategy-info">
                <div class="strategy-card">
                  <strong>FIFO (First In First Out)</strong>
                  <p>
                    Sorts batches by manufacturing date in ascending order.
                    Oldest batches appear first. Best for general inventory
                    rotation.
                  </p>
                </div>
                <div class="strategy-card">
                  <strong>FEFO (First Expired First Out)</strong>
                  <p>
                    Sorts batches by expiry date in ascending order. Batches
                    expiring soonest appear first. Recommended for medical and
                    perishable items.
                  </p>
                </div>
                <div class="strategy-card">
                  <strong>LIFO (Last In First Out)</strong>
                  <p>
                    Sorts batches by manufacturing date in descending order.
                    Newest batches appear first. Used for specific inventory
                    management strategies.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </mat-tab>

        <!-- Tokens Tab -->
        <mat-tab label="Tokens">
          <div class="batch-selector-doc__tab-content">
            <ax-component-tokens
              [tokens]="batchSelectorTokens"
            ></ax-component-tokens>
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="batch-selector-doc__tab-content">
            <section class="batch-selector-doc__section">
              <h2>Do's and Don'ts</h2>

              <div class="batch-selector-doc__guidelines">
                <div
                  class="batch-selector-doc__guideline batch-selector-doc__guideline--do"
                >
                  <h4><mat-icon>check_circle</mat-icon> Do</h4>
                  <ul>
                    <li>
                      Use FEFO strategy for medical supplies and perishable
                      items
                    </li>
                    <li>
                      Set appropriate expiry warning thresholds for your context
                    </li>
                    <li>
                      Enable multi-select when users need to fulfill larger
                      quantities
                    </li>
                    <li>
                      Show expiry dates prominently to prevent expired stock
                      usage
                    </li>
                    <li>
                      Use requestedQuantity for automatic allocation across
                      batches
                    </li>
                    <li>Disable selection of expired batches</li>
                  </ul>
                </div>

                <div
                  class="batch-selector-doc__guideline batch-selector-doc__guideline--dont"
                >
                  <h4><mat-icon>cancel</mat-icon> Don't</h4>
                  <ul>
                    <li>Allow selection of expired or quarantined batches</li>
                    <li>Mix selection strategies in the same workflow</li>
                    <li>
                      Hide expiry information for medical or perishable products
                    </li>
                    <li>
                      Set warning thresholds shorter than typical reorder lead
                      time
                    </li>
                    <li>Use LIFO for items where expiry dates are critical</li>
                    <li>Skip validation when allocating quantities</li>
                  </ul>
                </div>
              </div>
            </section>

            <section class="batch-selector-doc__section">
              <h2>Accessibility</h2>
              <ul class="batch-selector-doc__a11y-list">
                <li>
                  All batch items are keyboard accessible with proper tabindex
                </li>
                <li>
                  Expiry status is communicated through both color and text for
                  colorblind users
                </li>
                <li>
                  Screen readers announce batch details including expiry status
                </li>
                <li>Search input includes proper ARIA labels and hints</li>
                <li>
                  Selected batches are indicated with visual and ARIA attributes
                </li>
                <li>
                  Radio/checkbox inputs follow native accessibility patterns
                </li>
              </ul>
            </section>

            <section class="batch-selector-doc__section">
              <h2>Best Practices</h2>
              <ul class="batch-selector-doc__best-practices">
                <li>
                  <strong>Strategy Selection:</strong> Use FEFO for medical
                  supplies, pharmaceuticals, and perishables. FIFO works well
                  for general inventory. LIFO is for special cases only.
                </li>
                <li>
                  <strong>Expiry Thresholds:</strong> Set critical threshold to
                  7 days (or less) and warning to 30 days. Adjust based on
                  product shelf life and reorder lead time.
                </li>
                <li>
                  <strong>Quantity Allocation:</strong> When providing
                  requestedQuantity, the component will auto-calculate optimal
                  distribution across batches following the strategy.
                </li>
                <li>
                  <strong>Multi-Select:</strong> Enable for dispensing and
                  transfers. Keep single-select for stock takes and audits.
                </li>
                <li>
                  <strong>Search Functionality:</strong> The search bar helps
                  users find specific batches quickly in large lists. It
                  searches both batch numbers and lot numbers.
                </li>
                <li>
                  <strong>API Integration:</strong> When productId is provided
                  without batches, the component will automatically fetch from
                  /api/inventory/products/:id/batches endpoint.
                </li>
              </ul>
            </section>

            <section class="batch-selector-doc__section">
              <h2>Color Status Reference</h2>
              <div class="batch-selector-doc__color-reference">
                <div class="color-ref-item color-ref-item--safe">
                  <div class="color-badge"></div>
                  <div class="color-info">
                    <strong>Green (Safe)</strong>
                    <p>More than 30 days until expiry (default threshold)</p>
                  </div>
                </div>
                <div class="color-ref-item color-ref-item--warning">
                  <div class="color-badge"></div>
                  <div class="color-info">
                    <strong>Yellow (Warning)</strong>
                    <p>7-30 days until expiry (configurable range)</p>
                  </div>
                </div>
                <div class="color-ref-item color-ref-item--critical">
                  <div class="color-badge"></div>
                  <div class="color-info">
                    <strong>Red (Critical)</strong>
                    <p>Less than 7 days until expiry (configurable)</p>
                  </div>
                </div>
                <div class="color-ref-item color-ref-item--expired">
                  <div class="color-badge"></div>
                  <div class="color-info">
                    <strong>Gray (Expired)</strong>
                    <p>Past expiry date - selection disabled</p>
                  </div>
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
      .batch-selector-doc {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--ax-spacing-xl, 1.5rem);
      }

      .batch-selector-doc__tabs {
        margin-top: var(--ax-spacing-xl, 1.5rem);
      }

      .batch-selector-doc__tab-content {
        padding: var(--ax-spacing-xl, 1.5rem) 0;
      }

      .batch-selector-doc__section {
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

      .batch-selector-doc__demo {
        width: 100%;

        h4 {
          font-size: var(--ax-text-sm, 0.875rem);
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0 0 var(--ax-spacing-xs, 0.25rem) 0;
        }

        .strategy-desc {
          font-size: var(--ax-text-xs, 0.75rem);
          color: var(--ax-text-secondary);
          margin: 0 0 var(--ax-spacing-sm, 0.5rem) 0;
        }
      }

      /* Workflow Card */
      .batch-selector-doc__workflow-card {
        padding: var(--ax-spacing-lg, 1rem);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-lg, 0.75rem);
        background: var(--ax-background-default);

        .workflow-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--ax-spacing-md, 0.75rem);
          padding-bottom: var(--ax-spacing-sm, 0.5rem);
          border-bottom: 1px solid var(--ax-border-default);

          h4 {
            font-size: var(--ax-text-base, 1rem);
            font-weight: 600;
            color: var(--ax-text-heading);
            margin: 0;
          }

          .workflow-step {
            font-size: var(--ax-text-xs, 0.75rem);
            color: var(--ax-text-secondary);
            font-weight: 500;
          }
        }

        .workflow-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: var(--ax-spacing-sm, 0.5rem);
          margin-bottom: var(--ax-spacing-md, 0.75rem);

          .info-item {
            display: flex;
            flex-direction: column;
            gap: var(--ax-spacing-xs, 0.25rem);

            .label {
              font-size: var(--ax-text-xs, 0.75rem);
              color: var(--ax-text-secondary);
              font-weight: 500;
            }

            .value {
              font-size: var(--ax-text-sm, 0.875rem);
              color: var(--ax-text-primary);
              font-weight: 600;
            }
          }
        }
      }

      /* Status Legend */
      .batch-selector-doc__status-legend {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--ax-spacing-md, 0.75rem);
        margin-top: var(--ax-spacing-md, 0.75rem);
      }

      .status-item {
        display: flex;
        align-items: center;
        gap: var(--ax-spacing-sm, 0.5rem);
        padding: var(--ax-spacing-md, 0.75rem);
        border-radius: var(--ax-radius-md, 0.5rem);
        border: 1px solid var(--ax-border-default);
        background: var(--ax-background-default);

        .status-badge {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .status-info {
          strong {
            display: block;
            font-size: var(--ax-text-sm, 0.875rem);
            font-weight: 600;
            color: var(--ax-text-heading);
            margin-bottom: var(--ax-spacing-xs, 0.25rem);
          }

          p {
            font-size: var(--ax-text-xs, 0.75rem);
            color: var(--ax-text-secondary);
            margin: 0;
          }
        }
      }

      .status-item--safe .status-badge {
        background: var(--ax-success-default);
      }

      .status-item--warning .status-badge {
        background: var(--ax-warning-default);
      }

      .status-item--critical .status-badge {
        background: var(--ax-error-default);
      }

      .status-item--expired .status-badge {
        background: var(--ax-text-disabled);
      }

      /* API Table */
      .batch-selector-doc__api-table {
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

      /* Strategy Info Cards */
      .batch-selector-doc__strategy-info {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--ax-spacing-md, 0.75rem);
        margin-top: var(--ax-spacing-md, 0.75rem);
      }

      .strategy-card {
        padding: var(--ax-spacing-md, 0.75rem);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-md, 0.5rem);
        background: var(--ax-background-subtle);

        strong {
          display: block;
          font-size: var(--ax-text-sm, 0.875rem);
          font-weight: 600;
          color: var(--ax-text-heading);
          margin-bottom: var(--ax-spacing-xs, 0.25rem);
        }

        p {
          font-size: var(--ax-text-sm, 0.875rem);
          color: var(--ax-text-secondary);
          margin: 0;
          line-height: 1.5;
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
      .batch-selector-doc__guidelines {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--ax-spacing-lg, 1rem);
      }

      .batch-selector-doc__guideline {
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

      .batch-selector-doc__guideline--do {
        background: var(--ax-success-faint);

        h4 {
          color: var(--ax-success-emphasis);
        }
        li {
          color: var(--ax-success-emphasis);
        }
      }

      .batch-selector-doc__guideline--dont {
        background: var(--ax-error-faint);

        h4 {
          color: var(--ax-error-emphasis);
        }
        li {
          color: var(--ax-error-emphasis);
        }
      }

      /* Color Reference */
      .batch-selector-doc__color-reference {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--ax-spacing-md, 0.75rem);
        margin-top: var(--ax-spacing-md, 0.75rem);
      }

      .color-ref-item {
        display: flex;
        align-items: center;
        gap: var(--ax-spacing-sm, 0.5rem);
        padding: var(--ax-spacing-md, 0.75rem);
        border: 2px solid;
        border-radius: var(--ax-radius-md, 0.5rem);

        .color-badge {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .color-info {
          strong {
            display: block;
            font-size: var(--ax-text-sm, 0.875rem);
            font-weight: 600;
            margin-bottom: var(--ax-spacing-xs, 0.25rem);
          }

          p {
            font-size: var(--ax-text-xs, 0.75rem);
            margin: 0;
            line-height: 1.4;
          }
        }
      }

      .color-ref-item--safe {
        background: var(--ax-success-faint);
        border-color: var(--ax-success-default);

        .color-badge {
          background: var(--ax-success-default);
        }

        strong,
        p {
          color: var(--ax-success-emphasis);
        }
      }

      .color-ref-item--warning {
        background: var(--ax-warning-faint);
        border-color: var(--ax-warning-default);

        .color-badge {
          background: var(--ax-warning-default);
        }

        strong,
        p {
          color: var(--ax-warning-emphasis);
        }
      }

      .color-ref-item--critical {
        background: var(--ax-error-faint);
        border-color: var(--ax-error-default);

        .color-badge {
          background: var(--ax-error-default);
        }

        strong,
        p {
          color: var(--ax-error-emphasis);
        }
      }

      .color-ref-item--expired {
        background: var(--ax-background-subtle);
        border-color: var(--ax-text-disabled);

        .color-badge {
          background: var(--ax-text-disabled);
        }

        strong,
        p {
          color: var(--ax-text-secondary);
        }
      }

      .batch-selector-doc__a11y-list,
      .batch-selector-doc__best-practices {
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
export class BatchSelectorDocComponent {
  // Sample batch data for demonstrations
  sampleBatches = [
    {
      batchNumber: 'BATCH-2024-001',
      lotNumber: 'LOT-001',
      expiryDate: new Date('2025-06-15'),
      manufacturingDate: new Date('2024-06-15'),
      availableQuantity: 150,
      status: 'available' as const,
    },
    {
      batchNumber: 'BATCH-2024-002',
      lotNumber: 'LOT-002',
      expiryDate: new Date('2025-03-20'),
      manufacturingDate: new Date('2024-09-20'),
      availableQuantity: 200,
      status: 'available' as const,
    },
    {
      batchNumber: 'BATCH-2024-003',
      lotNumber: 'LOT-003',
      expiryDate: new Date('2025-08-10'),
      manufacturingDate: new Date('2024-11-10'),
      availableQuantity: 100,
      status: 'available' as const,
    },
  ];

  // Batches with various expiry statuses
  expiryStatusBatches = [
    {
      batchNumber: 'BATCH-SAFE',
      expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      manufacturingDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      availableQuantity: 200,
      status: 'available' as const,
    },
    {
      batchNumber: 'BATCH-WARNING',
      expiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days
      manufacturingDate: new Date(Date.now() - 250 * 24 * 60 * 60 * 1000),
      availableQuantity: 150,
      status: 'available' as const,
    },
    {
      batchNumber: 'BATCH-CRITICAL',
      expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
      manufacturingDate: new Date(Date.now() - 340 * 24 * 60 * 60 * 1000),
      availableQuantity: 100,
      status: 'available' as const,
    },
    {
      batchNumber: 'BATCH-EXPIRED',
      expiryDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // -10 days (expired)
      manufacturingDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      availableQuantity: 50,
      status: 'available' as const,
    },
  ];

  // Large batch list for search demo
  largeBatchList = [
    ...this.sampleBatches,
    {
      batchNumber: 'BATCH-2024-004',
      lotNumber: 'LOT-004',
      expiryDate: new Date('2025-05-01'),
      manufacturingDate: new Date('2024-08-01'),
      availableQuantity: 120,
      status: 'available' as const,
    },
    {
      batchNumber: 'BATCH-2024-005',
      lotNumber: 'LOT-005',
      expiryDate: new Date('2025-07-15'),
      manufacturingDate: new Date('2024-10-15'),
      availableQuantity: 180,
      status: 'available' as const,
    },
    {
      batchNumber: 'BATCH-2024-006',
      lotNumber: 'LOT-006',
      expiryDate: new Date('2025-04-20'),
      manufacturingDate: new Date('2024-07-20'),
      availableQuantity: 90,
      status: 'available' as const,
    },
  ];

  basicUsageCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-batch-selector
  [productId]="'PROD-001'"
  [strategy]="'fefo'"
  [allowMultiple]="true"
  [requestedQuantity]="150"
  (batchSelect)="handleBatchSelection($event)"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxBatchSelectorComponent, BatchSelection } from '@aegisx/ui';

@Component({
  selector: 'app-batch-selection',
  standalone: true,
  imports: [AxBatchSelectorComponent],
  template: \`
    <ax-batch-selector
      [productId]="productId"
      [strategy]="strategy"
      [allowMultiple]="true"
      [requestedQuantity]="requestedQty"
      (batchSelect)="handleBatchSelection($event)"
    />
  \`,
})
export class BatchSelectionComponent {
  productId = 'PROD-001';
  strategy: 'fifo' | 'fefo' | 'lifo' = 'fefo';
  requestedQty = 150;

  handleBatchSelection(selection: BatchSelection): void {
    console.log('Selected batches:', selection.batches);
    console.log('Total quantity:', selection.totalQuantity);
    console.log('Strategy used:', selection.strategy);
  }
}`,
    },
  ];

  strategiesCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- FIFO - First In First Out -->
<ax-batch-selector
  [productId]="'PROD-001'"
  [strategy]="'fifo'"
  [showRecommendation]="true"
/>

<!-- FEFO - First Expired First Out (Recommended) -->
<ax-batch-selector
  [productId]="'PROD-001'"
  [strategy]="'fefo'"
  [showRecommendation]="true"
/>

<!-- LIFO - Last In First Out -->
<ax-batch-selector
  [productId]="'PROD-001'"
  [strategy]="'lifo'"
  [showRecommendation]="true"
/>`,
    },
  ];

  expiryTrackingCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-batch-selector
  [productId]="'PROD-001'"
  [strategy]="'fefo'"
  [showExpiry]="true"
  [expiryWarningDays]="30"
  [expiryCriticalDays]="7"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxBatchSelectorComponent } from '@aegisx/ui';

@Component({
  selector: 'app-expiry-tracking',
  standalone: true,
  imports: [AxBatchSelectorComponent],
  template: \`
    <ax-batch-selector
      [productId]="productId"
      [strategy]="'fefo'"
      [showExpiry]="true"
      [expiryWarningDays]="warningThreshold"
      [expiryCriticalDays]="criticalThreshold"
    />
  \`,
})
export class ExpiryTrackingComponent {
  productId = 'PROD-001';
  warningThreshold = 30; // Yellow badge
  criticalThreshold = 7;  // Red badge
}`,
    },
  ];

  quantityAllocationCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-batch-selector
  [productId]="'PROD-001'"
  [strategy]="'fefo'"
  [allowMultiple]="true"
  [requestedQuantity]="250"
  (batchSelect)="onBatchSelection($event)"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxBatchSelectorComponent, BatchSelection } from '@aegisx/ui';

@Component({
  selector: 'app-quantity-allocation',
  standalone: true,
  imports: [AxBatchSelectorComponent],
  template: \`
    <ax-batch-selector
      [productId]="productId"
      [strategy]="'fefo'"
      [allowMultiple]="true"
      [requestedQuantity]="requestedQuantity"
      (batchSelect)="onBatchSelection($event)"
    />
  \`,
})
export class QuantityAllocationComponent {
  productId = 'PROD-001';
  requestedQuantity = 250;

  onBatchSelection(selection: BatchSelection): void {
    // Component auto-allocates across batches following FEFO
    selection.batches.forEach(sb => {
      console.log(\`Batch \${sb.batch.batchNumber}: \${sb.quantity} units\`);
    });

    console.log(\`Total allocated: \${selection.totalQuantity}\`);
  }
}`,
    },
  ];

  singleSelectCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-batch-selector
  [productId]="'PROD-001'"
  [strategy]="'fefo'"
  [allowMultiple]="false"
  (batchSelect)="onSingleBatchSelect($event)"
/>`,
    },
  ];

  batchSelectorTokens: ComponentToken[] = [
    {
      category: 'Colors',
      cssVar: '--ax-success-default',
      usage: 'Safe expiry status (>30 days)',
    },
    {
      category: 'Colors',
      cssVar: '--ax-warning-default',
      usage: 'Warning expiry status (7-30 days)',
    },
    {
      category: 'Colors',
      cssVar: '--ax-error-default',
      usage: 'Critical expiry status (<7 days)',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-disabled',
      usage: 'Expired batches (past expiry date)',
    },
    {
      category: 'Colors',
      cssVar: '--ax-primary-default',
      usage: 'Recommended batch highlight',
    },
    {
      category: 'Colors',
      cssVar: '--ax-background-subtle',
      usage: 'Batch item background',
    },
    {
      category: 'Colors',
      cssVar: '--ax-border-default',
      usage: 'Batch item borders',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-heading',
      usage: 'Batch number text',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-secondary',
      usage: 'Secondary information text',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-sm',
      usage: 'Item padding',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-md',
      usage: 'Section spacing',
    },
    {
      category: 'Borders',
      cssVar: '--ax-radius-md',
      usage: 'Batch item border radius',
    },
  ];
}
