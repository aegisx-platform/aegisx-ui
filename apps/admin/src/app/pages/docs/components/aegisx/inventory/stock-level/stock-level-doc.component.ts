import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AxStockLevelComponent } from '@aegisx/ui';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../../../components/docs';
import { ComponentToken } from '../../../../../../types/docs.types';

@Component({
  selector: 'ax-stock-level-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    AxStockLevelComponent,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="stock-level-doc">
      <ax-doc-header
        title="Stock Level"
        icon="inventory_2"
        description="Progress bar indicator for inventory levels with color-coded zones and warning notifications."
        [breadcrumbs]="[
          {
            label: 'Inventory',
            link: '/docs/components/aegisx/inventory/stock-level',
          },
          { label: 'Stock Level' },
        ]"
        status="stable"
        version="1.0.0"
        importStatement="import { AxStockLevelComponent } from '@aegisx/ui';"
      ></ax-doc-header>

      <mat-tab-group class="stock-level-doc__tabs" animationDuration="150ms">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="stock-level-doc__tab-content">
            <section class="stock-level-doc__section">
              <h2>Basic Usage</h2>
              <p>
                The Stock Level component displays inventory levels with a
                visual progress bar, color-coded zones, and optional warning
                notifications. Perfect for monitoring stock status at a glance.
              </p>

              <ax-live-preview variant="bordered">
                <div class="stock-level-doc__demo">
                  <ax-stock-level
                    [current]="250"
                    [minimum]="50"
                    [maximum]="500"
                    [unit]="'pieces'"
                    [size]="'md'"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="basicUsageCode"></ax-code-tabs>
            </section>

            <section class="stock-level-doc__section">
              <h2>Color Schemes</h2>
              <p>
                Choose between traffic-light (distinct zones) or gradient
                (smooth transition) color schemes.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-lg)"
                align="stretch"
              >
                <div class="stock-level-doc__demo">
                  <h4>Traffic Light (Default)</h4>
                  <ax-stock-level
                    [current]="400"
                    [minimum]="100"
                    [maximum]="500"
                    [unit]="'units'"
                    [colorScheme]="'traffic-light'"
                  />
                </div>

                <div class="stock-level-doc__demo">
                  <h4>Gradient</h4>
                  <ax-stock-level
                    [current]="400"
                    [minimum]="100"
                    [maximum]="500"
                    [unit]="'units'"
                    [colorScheme]="'gradient'"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="colorSchemesCode"></ax-code-tabs>
            </section>

            <section class="stock-level-doc__section">
              <h2>Sizes</h2>
              <p>Available in small, medium, and large sizes.</p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-lg)"
                align="stretch"
              >
                <div class="stock-level-doc__demo">
                  <h4>Small</h4>
                  <ax-stock-level
                    [current]="150"
                    [minimum]="50"
                    [maximum]="200"
                    [unit]="'items'"
                    [size]="'sm'"
                  />
                </div>

                <div class="stock-level-doc__demo">
                  <h4>Medium (Default)</h4>
                  <ax-stock-level
                    [current]="150"
                    [minimum]="50"
                    [maximum]="200"
                    [unit]="'items'"
                    [size]="'md'"
                  />
                </div>

                <div class="stock-level-doc__demo">
                  <h4>Large</h4>
                  <ax-stock-level
                    [current]="150"
                    [minimum]="50"
                    [maximum]="200"
                    [unit]="'items'"
                    [size]="'lg'"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="sizesCode"></ax-code-tabs>
            </section>

            <section class="stock-level-doc__section">
              <h2>Warning State</h2>
              <p>
                When current stock falls at or below minimum threshold, a
                warning badge appears and click events can be handled.
              </p>

              <ax-live-preview variant="bordered">
                <div class="stock-level-doc__demo">
                  <ax-stock-level
                    [current]="30"
                    [minimum]="50"
                    [maximum]="500"
                    [unit]="'pieces'"
                    (warningClick)="handleWarning($event)"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="warningCode"></ax-code-tabs>
            </section>

            <section class="stock-level-doc__section">
              <h2>Label Options</h2>
              <p>
                Control the display of labels and percentage with showLabel and
                showPercentage inputs.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-lg)"
                align="stretch"
              >
                <div class="stock-level-doc__demo">
                  <h4>With Label and Percentage</h4>
                  <ax-stock-level
                    [current]="300"
                    [minimum]="50"
                    [maximum]="500"
                    [unit]="'units'"
                    [showLabel]="true"
                    [showPercentage]="true"
                  />
                </div>

                <div class="stock-level-doc__demo">
                  <h4>Label Only</h4>
                  <ax-stock-level
                    [current]="300"
                    [minimum]="50"
                    [maximum]="500"
                    [unit]="'units'"
                    [showLabel]="true"
                    [showPercentage]="false"
                  />
                </div>

                <div class="stock-level-doc__demo">
                  <h4>No Label</h4>
                  <ax-stock-level
                    [current]="300"
                    [minimum]="50"
                    [maximum]="500"
                    [unit]="'units'"
                    [showLabel]="false"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="labelOptionsCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="stock-level-doc__tab-content">
            <section class="stock-level-doc__section">
              <h2>Stock Status Dashboard</h2>
              <p>Monitor multiple product stock levels in a dashboard view.</p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-md)"
                align="stretch"
              >
                <div class="stock-level-doc__product-card">
                  <div class="product-info">
                    <h4>Medical Gloves - Size M</h4>
                    <span class="product-sku">SKU: GLV-001-M</span>
                  </div>
                  <ax-stock-level
                    [current]="450"
                    [minimum]="100"
                    [maximum]="1000"
                    [unit]="'boxes'"
                    [size]="'sm'"
                  />
                </div>

                <div class="stock-level-doc__product-card">
                  <div class="product-info">
                    <h4>Surgical Masks</h4>
                    <span class="product-sku">SKU: MSK-002</span>
                  </div>
                  <ax-stock-level
                    [current]="80"
                    [minimum]="150"
                    [maximum]="2000"
                    [unit]="'pieces'"
                    [size]="'sm'"
                  />
                </div>

                <div class="stock-level-doc__product-card">
                  <div class="product-info">
                    <h4>Hand Sanitizer 500ml</h4>
                    <span class="product-sku">SKU: SAN-003</span>
                  </div>
                  <ax-stock-level
                    [current]="200"
                    [minimum]="50"
                    [maximum]="500"
                    [unit]="'bottles'"
                    [size]="'sm'"
                  />
                </div>
              </ax-live-preview>
            </section>

            <section class="stock-level-doc__section">
              <h2>Color Zone Comparison</h2>
              <p>
                Visual demonstration of how stock levels appear in different
                zones (safe, warning, critical).
              </p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-lg)"
                align="stretch"
              >
                <div class="stock-level-doc__demo">
                  <h4>Green Zone (Safe: &gt;75%)</h4>
                  <ax-stock-level
                    [current]="400"
                    [minimum]="50"
                    [maximum]="500"
                    [unit]="'units'"
                  />
                </div>

                <div class="stock-level-doc__demo">
                  <h4>Yellow Zone (Warning: 25-75%)</h4>
                  <ax-stock-level
                    [current]="250"
                    [minimum]="50"
                    [maximum]="500"
                    [unit]="'units'"
                  />
                </div>

                <div class="stock-level-doc__demo">
                  <h4>Red Zone (Critical: &lt;25%)</h4>
                  <ax-stock-level
                    [current]="100"
                    [minimum]="50"
                    [maximum]="500"
                    [unit]="'units'"
                  />
                </div>

                <div class="stock-level-doc__demo">
                  <h4>Below Minimum (Low Stock Alert)</h4>
                  <ax-stock-level
                    [current]="30"
                    [minimum]="50"
                    [maximum]="500"
                    [unit]="'units'"
                  />
                </div>
              </ax-live-preview>
            </section>

            <section class="stock-level-doc__section">
              <h2>Different Unit Types</h2>
              <p>Display various unit types for different inventory items.</p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-md)"
                align="stretch"
              >
                <ax-stock-level
                  [current]="45.5"
                  [minimum]="10"
                  [maximum]="100"
                  [unit]="'kg'"
                />

                <ax-stock-level
                  [current]="850"
                  [minimum]="200"
                  [maximum]="1000"
                  [unit]="'ml'"
                />

                <ax-stock-level
                  [current]="15"
                  [minimum]="5"
                  [maximum]="20"
                  [unit]="'pallets'"
                />

                <ax-stock-level
                  [current]="750"
                  [minimum]="100"
                  [maximum]="1000"
                  [unit]="'doses'"
                />
              </ax-live-preview>
            </section>
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="stock-level-doc__tab-content">
            <section class="stock-level-doc__section">
              <h2>Input Properties</h2>
              <div class="stock-level-doc__api-table">
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
                      <td><code>current</code></td>
                      <td><code>number</code></td>
                      <td><em>Required</em></td>
                      <td>Current stock quantity</td>
                    </tr>
                    <tr>
                      <td><code>minimum</code></td>
                      <td><code>number</code></td>
                      <td><em>Required</em></td>
                      <td>Minimum stock threshold</td>
                    </tr>
                    <tr>
                      <td><code>maximum</code></td>
                      <td><code>number</code></td>
                      <td><em>Required</em></td>
                      <td>Maximum stock capacity</td>
                    </tr>
                    <tr>
                      <td><code>unit</code></td>
                      <td><code>string</code></td>
                      <td><code>'pieces'</code></td>
                      <td>Unit of measurement for stock</td>
                    </tr>
                    <tr>
                      <td><code>size</code></td>
                      <td><code>'sm' | 'md' | 'lg'</code></td>
                      <td><code>'md'</code></td>
                      <td>Size of the progress bar</td>
                    </tr>
                    <tr>
                      <td><code>showLabel</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Show stock quantity label</td>
                    </tr>
                    <tr>
                      <td><code>showPercentage</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Show percentage in label</td>
                    </tr>
                    <tr>
                      <td><code>colorScheme</code></td>
                      <td><code>'traffic-light' | 'gradient'</code></td>
                      <td><code>'traffic-light'</code></td>
                      <td>Color scheme for progress bar</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="stock-level-doc__section">
              <h2>Output Events</h2>
              <div class="stock-level-doc__api-table">
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
                      <td><code>warningClick</code></td>
                      <td><code>StockLevelWarningEvent</code></td>
                      <td>
                        Emitted when warning badge is clicked (when stock ≤
                        minimum)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="stock-level-doc__section">
              <h2>Type Definitions</h2>

              <h3>StockLevelWarningEvent</h3>
              <pre><code>interface StockLevelWarningEvent &#123;
  level: 'low' | 'critical';  // Warning level
  current: number;             // Current stock value
  minimum: number;             // Minimum threshold
&#125;</code></pre>

              <h3>Color Zones</h3>
              <div class="stock-level-doc__color-zones">
                <div class="color-zone color-zone--green">
                  <strong>Green Zone (Safe)</strong>
                  <p>&gt;75% of maximum capacity</p>
                </div>
                <div class="color-zone color-zone--yellow">
                  <strong>Yellow Zone (Warning)</strong>
                  <p>25-75% of maximum capacity</p>
                </div>
                <div class="color-zone color-zone--red">
                  <strong>Red Zone (Critical)</strong>
                  <p>&lt;25% of maximum capacity</p>
                </div>
              </div>
            </section>
          </div>
        </mat-tab>

        <!-- Tokens Tab -->
        <mat-tab label="Tokens">
          <div class="stock-level-doc__tab-content">
            <ax-component-tokens
              [tokens]="stockLevelTokens"
            ></ax-component-tokens>
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="stock-level-doc__tab-content">
            <section class="stock-level-doc__section">
              <h2>Do's and Don'ts</h2>

              <div class="stock-level-doc__guidelines">
                <div
                  class="stock-level-doc__guideline stock-level-doc__guideline--do"
                >
                  <h4><mat-icon>check_circle</mat-icon> Do</h4>
                  <ul>
                    <li>Use consistent units across related items</li>
                    <li>
                      Set realistic minimum thresholds based on reorder time
                    </li>
                    <li>
                      Handle warning clicks to enable quick reordering actions
                    </li>
                    <li>Use appropriate size for the display context</li>
                    <li>
                      Show labels and percentages for detailed stock monitoring
                    </li>
                  </ul>
                </div>

                <div
                  class="stock-level-doc__guideline stock-level-doc__guideline--dont"
                >
                  <h4><mat-icon>cancel</mat-icon> Don't</h4>
                  <ul>
                    <li>
                      Set minimum threshold equal to or higher than maximum
                    </li>
                    <li>Use decimals unless appropriate for the unit type</li>
                    <li>Mix color schemes in the same view</li>
                    <li>Ignore warning events in production systems</li>
                    <li>Use without proper unit labels in data-dense views</li>
                  </ul>
                </div>
              </div>
            </section>

            <section class="stock-level-doc__section">
              <h2>Accessibility</h2>
              <ul class="stock-level-doc__a11y-list">
                <li>
                  Progress bar includes proper ARIA attributes (role, valuenow,
                  valuemin, valuemax)
                </li>
                <li>Warning badge is keyboard accessible with tabindex</li>
                <li>
                  Tooltip provides additional context for screen readers and
                  mouse users
                </li>
                <li>
                  Color-coded zones meet WCAG 2.1 AA contrast requirements
                </li>
                <li>Minimum threshold indicator includes descriptive label</li>
              </ul>
            </section>

            <section class="stock-level-doc__section">
              <h2>Best Practices</h2>
              <ul class="stock-level-doc__best-practices">
                <li>
                  <strong>Traffic Light Scheme:</strong> Use for distinct,
                  easy-to-recognize zones in at-a-glance dashboards
                </li>
                <li>
                  <strong>Gradient Scheme:</strong> Use for more nuanced stock
                  level displays where smooth transitions are preferred
                </li>
                <li>
                  <strong>Warning Threshold:</strong> Set minimum at the point
                  where reordering should be triggered, considering lead time
                </li>
                <li>
                  <strong>Size Selection:</strong> Use 'sm' in dense tables,
                  'md' for cards, 'lg' for detail views
                </li>
                <li>
                  <strong>Label Display:</strong> Hide labels in compact views
                  where space is limited; rely on tooltips instead
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
      .stock-level-doc {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--ax-spacing-xl, 1.5rem);
      }

      .stock-level-doc__tabs {
        margin-top: var(--ax-spacing-xl, 1.5rem);
      }

      .stock-level-doc__tab-content {
        padding: var(--ax-spacing-xl, 1.5rem) 0;
      }

      .stock-level-doc__section {
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

      .stock-level-doc__demo {
        width: 100%;

        h4 {
          font-size: var(--ax-text-sm, 0.875rem);
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0 0 var(--ax-spacing-sm, 0.5rem) 0;
        }
      }

      /* Product Card Example */
      .stock-level-doc__product-card {
        padding: var(--ax-spacing-md, 0.75rem);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-md, 0.5rem);
        background: var(--ax-background-default);

        .product-info {
          margin-bottom: var(--ax-spacing-sm, 0.5rem);

          h4 {
            font-size: var(--ax-text-base, 1rem);
            font-weight: 600;
            color: var(--ax-text-heading);
            margin: 0 0 var(--ax-spacing-xs, 0.25rem) 0;
          }

          .product-sku {
            font-size: var(--ax-text-xs, 0.75rem);
            color: var(--ax-text-secondary);
          }
        }
      }

      /* API Table */
      .stock-level-doc__api-table {
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

      /* Color Zones */
      .stock-level-doc__color-zones {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--ax-spacing-md, 0.75rem);
        margin-top: var(--ax-spacing-md, 0.75rem);
      }

      .color-zone {
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

      .color-zone--green {
        background: var(--ax-success-faint);
        border-color: var(--ax-success-default);
        color: var(--ax-success-emphasis);
      }

      .color-zone--yellow {
        background: var(--ax-warning-faint);
        border-color: var(--ax-warning-default);
        color: var(--ax-warning-emphasis);
      }

      .color-zone--red {
        background: var(--ax-error-faint);
        border-color: var(--ax-error-default);
        color: var(--ax-error-emphasis);
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
      .stock-level-doc__guidelines {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--ax-spacing-lg, 1rem);
      }

      .stock-level-doc__guideline {
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

      .stock-level-doc__guideline--do {
        background: var(--ax-success-faint);

        h4 {
          color: var(--ax-success-emphasis);
        }
        li {
          color: var(--ax-success-emphasis);
        }
      }

      .stock-level-doc__guideline--dont {
        background: var(--ax-error-faint);

        h4 {
          color: var(--ax-error-emphasis);
        }
        li {
          color: var(--ax-error-emphasis);
        }
      }

      .stock-level-doc__a11y-list,
      .stock-level-doc__best-practices {
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
export class StockLevelDocComponent {
  basicUsageCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-stock-level
  [current]="250"
  [minimum]="50"
  [maximum]="500"
  [unit]="'pieces'"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxStockLevelComponent } from '@aegisx/ui';

@Component({
  selector: 'app-inventory-status',
  standalone: true,
  imports: [AxStockLevelComponent],
  template: \`
    <ax-stock-level
      [current]="currentStock"
      [minimum]="minThreshold"
      [maximum]="maxCapacity"
      [unit]="'pieces'"
    />
  \`,
})
export class InventoryStatusComponent {
  currentStock = 250;
  minThreshold = 50;
  maxCapacity = 500;
}`,
    },
  ];

  colorSchemesCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Traffic Light (default) -->
<ax-stock-level
  [current]="400"
  [minimum]="100"
  [maximum]="500"
  [colorScheme]="'traffic-light'"
/>

<!-- Gradient -->
<ax-stock-level
  [current]="400"
  [minimum]="100"
  [maximum]="500"
  [colorScheme]="'gradient'"
/>`,
    },
  ];

  sizesCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Small -->
<ax-stock-level
  [current]="150"
  [minimum]="50"
  [maximum]="200"
  [size]="'sm'"
/>

<!-- Medium (default) -->
<ax-stock-level
  [current]="150"
  [minimum]="50"
  [maximum]="200"
  [size]="'md'"
/>

<!-- Large -->
<ax-stock-level
  [current]="150"
  [minimum]="50"
  [maximum]="200"
  [size]="'lg'"
/>`,
    },
  ];

  warningCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-stock-level
  [current]="30"
  [minimum]="50"
  [maximum]="500"
  [unit]="'pieces'"
  (warningClick)="handleWarning($event)"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxStockLevelComponent, StockLevelWarningEvent } from '@aegisx/ui';

@Component({
  selector: 'app-inventory-monitor',
  standalone: true,
  imports: [AxStockLevelComponent],
  template: \`
    <ax-stock-level
      [current]="30"
      [minimum]="50"
      [maximum]="500"
      (warningClick)="handleWarning($event)"
    />
  \`,
})
export class InventoryMonitorComponent {
  handleWarning(event: StockLevelWarningEvent): void {
    console.log('Warning:', event.level);
    console.log('Current:', event.current);
    console.log('Minimum:', event.minimum);

    // Navigate to reorder page or show reorder dialog
    this.openReorderDialog(event);
  }
}`,
    },
  ];

  labelOptionsCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- With label and percentage -->
<ax-stock-level
  [current]="300"
  [minimum]="50"
  [maximum]="500"
  [showLabel]="true"
  [showPercentage]="true"
/>

<!-- Label only -->
<ax-stock-level
  [current]="300"
  [minimum]="50"
  [maximum]="500"
  [showLabel]="true"
  [showPercentage]="false"
/>

<!-- No label -->
<ax-stock-level
  [current]="300"
  [minimum]="50"
  [maximum]="500"
  [showLabel]="false"
/>`,
    },
  ];

  stockLevelTokens: ComponentToken[] = [
    {
      category: 'Colors',
      cssVar: '--ax-success-default',
      usage: 'Safe zone (>75%) progress bar color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-warning-default',
      usage: 'Warning zone (25-75%) progress bar color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-error-default',
      usage: 'Critical zone (<25%) progress bar color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-background-subtle',
      usage: 'Progress bar background',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-heading',
      usage: 'Label text color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-secondary',
      usage: 'Percentage and unit text color',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-xs',
      usage: 'Small size height',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-sm',
      usage: 'Medium size height',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-md',
      usage: 'Large size height',
    },
    {
      category: 'Borders',
      cssVar: '--ax-radius-full',
      usage: 'Progress bar corner rounding',
    },
  ];

  handleWarning(event: {
    level: string;
    current: number;
    minimum: number;
  }): void {
    console.log('Warning triggered:', event);
    alert(
      `Low stock warning!\nLevel: ${event.level}\nCurrent: ${event.current}\nMinimum: ${event.minimum}`,
    );
  }
}
