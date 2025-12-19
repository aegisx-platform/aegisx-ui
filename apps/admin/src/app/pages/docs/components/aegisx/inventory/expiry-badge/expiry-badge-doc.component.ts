import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AxExpiryBadgeComponent } from '@aegisx/ui';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../../../components/docs';
import { ComponentToken } from '../../../../../../types/docs.types';

@Component({
  selector: 'ax-expiry-badge-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    AxExpiryBadgeComponent,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="expiry-badge-doc">
      <ax-doc-header
        title="Expiry Badge"
        icon="event_available"
        description="Color-coded badge component displaying expiry status and countdown with safe, warning, critical, and expired states."
        [breadcrumbs]="[
          {
            label: 'Inventory',
            link: '/docs/components/aegisx/inventory/expiry-badge',
          },
          { label: 'Expiry Badge' },
        ]"
        status="stable"
        version="1.0.0"
        importStatement="import { AxExpiryBadgeComponent } from '@aegisx/ui';"
      ></ax-doc-header>

      <mat-tab-group class="expiry-badge-doc__tabs" animationDuration="150ms">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="expiry-badge-doc__tab-content">
            <section class="expiry-badge-doc__section">
              <h2>Basic Usage</h2>
              <p>
                The Expiry Badge component displays color-coded expiry status
                indicators with countdown information. It provides visual cues
                for safe (green), warning (yellow), critical (red), and expired
                (gray) states with full WCAG 2.1 AA accessibility compliance.
              </p>

              <ax-live-preview variant="bordered">
                <div class="expiry-badge-doc__demo">
                  <ax-expiry-badge
                    [expiryDate]="getFutureDate(15)"
                    (badgeClick)="handleBadgeClick($event)"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="basicUsageCode"></ax-code-tabs>
            </section>

            <section class="expiry-badge-doc__section">
              <h2>Status Colors</h2>
              <p>
                Four distinct color-coded states indicate the urgency of expiry
                status based on configurable thresholds.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-lg)"
                align="stretch"
              >
                <div class="expiry-badge-doc__demo">
                  <h4>Safe (Green) - More than 30 days</h4>
                  <ax-expiry-badge [expiryDate]="getFutureDate(45)" />
                </div>

                <div class="expiry-badge-doc__demo">
                  <h4>Warning (Yellow) - 8 to 30 days</h4>
                  <ax-expiry-badge [expiryDate]="getFutureDate(15)" />
                </div>

                <div class="expiry-badge-doc__demo">
                  <h4>Critical (Red) - 1 to 7 days</h4>
                  <ax-expiry-badge [expiryDate]="getFutureDate(3)" />
                </div>

                <div class="expiry-badge-doc__demo">
                  <h4>Expired (Gray) - Past expiry date</h4>
                  <ax-expiry-badge [expiryDate]="getPastDate(5)" />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="statusColorsCode"></ax-code-tabs>
            </section>

            <section class="expiry-badge-doc__section">
              <h2>Sizes</h2>
              <p>Available in small, medium, and large sizes.</p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-lg)"
                align="stretch"
              >
                <div class="expiry-badge-doc__demo">
                  <h4>Small (20px height)</h4>
                  <ax-expiry-badge
                    [expiryDate]="getFutureDate(15)"
                    [size]="'sm'"
                  />
                </div>

                <div class="expiry-badge-doc__demo">
                  <h4>Medium (24px height, default)</h4>
                  <ax-expiry-badge
                    [expiryDate]="getFutureDate(15)"
                    [size]="'md'"
                  />
                </div>

                <div class="expiry-badge-doc__demo">
                  <h4>Large (32px height)</h4>
                  <ax-expiry-badge
                    [expiryDate]="getFutureDate(15)"
                    [size]="'lg'"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="sizesCode"></ax-code-tabs>
            </section>

            <section class="expiry-badge-doc__section">
              <h2>Variants</h2>
              <p>
                Choose between outlined, soft (default), or solid variants for
                different visual emphasis.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-lg)"
                align="stretch"
              >
                <div class="expiry-badge-doc__demo">
                  <h4>Outlined</h4>
                  <ax-expiry-badge
                    [expiryDate]="getFutureDate(15)"
                    [variant]="'outlined'"
                  />
                </div>

                <div class="expiry-badge-doc__demo">
                  <h4>Soft (Default)</h4>
                  <ax-expiry-badge
                    [expiryDate]="getFutureDate(15)"
                    [variant]="'soft'"
                  />
                </div>

                <div class="expiry-badge-doc__demo">
                  <h4>Solid</h4>
                  <ax-expiry-badge
                    [expiryDate]="getFutureDate(15)"
                    [variant]="'solid'"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="variantsCode"></ax-code-tabs>
            </section>

            <section class="expiry-badge-doc__section">
              <h2>Compact Mode</h2>
              <p>
                Compact mode displays icon-only badges with full information in
                tooltips, perfect for dense table layouts.
              </p>

              <ax-live-preview variant="bordered">
                <div class="expiry-badge-doc__demo">
                  <ax-expiry-badge
                    [expiryDate]="getFutureDate(15)"
                    [compact]="true"
                    [size]="'sm'"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="compactModeCode"></ax-code-tabs>
            </section>

            <section class="expiry-badge-doc__section">
              <h2>Custom Thresholds</h2>
              <p>
                Configure warning and critical thresholds to match your business
                rules (default: warning=30 days, critical=7 days).
              </p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-lg)"
                align="stretch"
              >
                <div class="expiry-badge-doc__demo">
                  <h4>Default Thresholds (30/7 days)</h4>
                  <ax-expiry-badge [expiryDate]="getFutureDate(15)" />
                </div>

                <div class="expiry-badge-doc__demo">
                  <h4>Custom Thresholds (14/3 days)</h4>
                  <ax-expiry-badge
                    [expiryDate]="getFutureDate(15)"
                    [warningDays]="14"
                    [criticalDays]="3"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="customThresholdsCode"></ax-code-tabs>
            </section>

            <section class="expiry-badge-doc__section">
              <h2>Countdown Options</h2>
              <p>Control the display of countdown text and status icons.</p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-lg)"
                align="stretch"
              >
                <div class="expiry-badge-doc__demo">
                  <h4>With Countdown and Icon (Default)</h4>
                  <ax-expiry-badge
                    [expiryDate]="getFutureDate(15)"
                    [showCountdown]="true"
                    [showIcon]="true"
                  />
                </div>

                <div class="expiry-badge-doc__demo">
                  <h4>Status Text Only (No Countdown)</h4>
                  <ax-expiry-badge
                    [expiryDate]="getFutureDate(15)"
                    [showCountdown]="false"
                    [showIcon]="true"
                  />
                </div>

                <div class="expiry-badge-doc__demo">
                  <h4>Text Only (No Icon)</h4>
                  <ax-expiry-badge
                    [expiryDate]="getFutureDate(15)"
                    [showCountdown]="true"
                    [showIcon]="false"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="countdownOptionsCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="expiry-badge-doc__tab-content">
            <section class="expiry-badge-doc__section">
              <h2>Product Inventory Table</h2>
              <p>Display expiry badges in compact mode for table rows.</p>

              <ax-live-preview variant="bordered">
                <div class="expiry-badge-doc__table">
                  <table>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Batch</th>
                        <th>Quantity</th>
                        <th>Expiry Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Aspirin 500mg</td>
                        <td>BTH-2024-001</td>
                        <td>500 tablets</td>
                        <td>
                          <ax-expiry-badge
                            [expiryDate]="getFutureDate(45)"
                            [compact]="true"
                            [size]="'sm'"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Vitamin C 1000mg</td>
                        <td>BTH-2024-002</td>
                        <td>250 tablets</td>
                        <td>
                          <ax-expiry-badge
                            [expiryDate]="getFutureDate(15)"
                            [compact]="true"
                            [size]="'sm'"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Antibiotic Cream</td>
                        <td>BTH-2024-003</td>
                        <td>100 tubes</td>
                        <td>
                          <ax-expiry-badge
                            [expiryDate]="getFutureDate(3)"
                            [compact]="true"
                            [size]="'sm'"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Cough Syrup</td>
                        <td>BTH-2023-045</td>
                        <td>75 bottles</td>
                        <td>
                          <ax-expiry-badge
                            [expiryDate]="getPastDate(10)"
                            [compact]="true"
                            [size]="'sm'"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </ax-live-preview>
            </section>

            <section class="expiry-badge-doc__section">
              <h2>Product Card View</h2>
              <p>
                Use full-size badges in product cards for detailed information.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-md)"
                align="stretch"
              >
                <div class="expiry-badge-doc__product-card">
                  <div class="product-info">
                    <h4>Surgical Masks (Box of 50)</h4>
                    <span class="product-sku">SKU: MSK-N95-001</span>
                    <span class="product-batch">Batch: BTH-2024-M-001</span>
                  </div>
                  <div class="product-expiry">
                    <ax-expiry-badge
                      [expiryDate]="getFutureDate(45)"
                      [size]="'md'"
                      [variant]="'soft'"
                    />
                  </div>
                </div>

                <div class="expiry-badge-doc__product-card">
                  <div class="product-info">
                    <h4>Hand Sanitizer 500ml</h4>
                    <span class="product-sku">SKU: SAN-ALC-500</span>
                    <span class="product-batch">Batch: BTH-2024-S-015</span>
                  </div>
                  <div class="product-expiry">
                    <ax-expiry-badge
                      [expiryDate]="getFutureDate(15)"
                      [size]="'md'"
                      [variant]="'soft'"
                    />
                  </div>
                </div>

                <div class="expiry-badge-doc__product-card">
                  <div class="product-info">
                    <h4>Latex Gloves (Size M)</h4>
                    <span class="product-sku">SKU: GLV-LAT-M</span>
                    <span class="product-batch">Batch: BTH-2024-G-008</span>
                  </div>
                  <div class="product-expiry">
                    <ax-expiry-badge
                      [expiryDate]="getFutureDate(3)"
                      [size]="'md'"
                      [variant]="'soft'"
                    />
                  </div>
                </div>
              </ax-live-preview>
            </section>

            <section class="expiry-badge-doc__section">
              <h2>All Status States</h2>
              <p>
                Complete demonstration of all expiry status states with
                different time frames.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-lg)"
                align="stretch"
              >
                <div class="expiry-badge-doc__demo">
                  <h4>Far Future (90 days) - Safe</h4>
                  <ax-expiry-badge [expiryDate]="getFutureDate(90)" />
                </div>

                <div class="expiry-badge-doc__demo">
                  <h4>Near Future (30 days) - Safe</h4>
                  <ax-expiry-badge [expiryDate]="getFutureDate(30)" />
                </div>

                <div class="expiry-badge-doc__demo">
                  <h4>Warning Range (15 days) - Warning</h4>
                  <ax-expiry-badge [expiryDate]="getFutureDate(15)" />
                </div>

                <div class="expiry-badge-doc__demo">
                  <h4>Critical Range (7 days) - Critical</h4>
                  <ax-expiry-badge [expiryDate]="getFutureDate(7)" />
                </div>

                <div class="expiry-badge-doc__demo">
                  <h4>Tomorrow - Critical</h4>
                  <ax-expiry-badge [expiryDate]="getFutureDate(1)" />
                </div>

                <div class="expiry-badge-doc__demo">
                  <h4>Today - Critical</h4>
                  <ax-expiry-badge [expiryDate]="getFutureDate(0)" />
                </div>

                <div class="expiry-badge-doc__demo">
                  <h4>Yesterday - Expired</h4>
                  <ax-expiry-badge [expiryDate]="getPastDate(1)" />
                </div>

                <div class="expiry-badge-doc__demo">
                  <h4>Long Expired (30 days ago) - Expired</h4>
                  <ax-expiry-badge [expiryDate]="getPastDate(30)" />
                </div>
              </ax-live-preview>
            </section>

            <section class="expiry-badge-doc__section">
              <h2>Variant Comparison</h2>
              <p>
                Side-by-side comparison of all variants with different statuses.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-lg)"
                align="stretch"
              >
                <div class="expiry-badge-doc__variant-group">
                  <h4>Safe Status</h4>
                  <div class="variant-row">
                    <ax-expiry-badge
                      [expiryDate]="getFutureDate(45)"
                      [variant]="'outlined'"
                    />
                    <ax-expiry-badge
                      [expiryDate]="getFutureDate(45)"
                      [variant]="'soft'"
                    />
                    <ax-expiry-badge
                      [expiryDate]="getFutureDate(45)"
                      [variant]="'solid'"
                    />
                  </div>
                </div>

                <div class="expiry-badge-doc__variant-group">
                  <h4>Warning Status</h4>
                  <div class="variant-row">
                    <ax-expiry-badge
                      [expiryDate]="getFutureDate(15)"
                      [variant]="'outlined'"
                    />
                    <ax-expiry-badge
                      [expiryDate]="getFutureDate(15)"
                      [variant]="'soft'"
                    />
                    <ax-expiry-badge
                      [expiryDate]="getFutureDate(15)"
                      [variant]="'solid'"
                    />
                  </div>
                </div>

                <div class="expiry-badge-doc__variant-group">
                  <h4>Critical Status</h4>
                  <div class="variant-row">
                    <ax-expiry-badge
                      [expiryDate]="getFutureDate(3)"
                      [variant]="'outlined'"
                    />
                    <ax-expiry-badge
                      [expiryDate]="getFutureDate(3)"
                      [variant]="'soft'"
                    />
                    <ax-expiry-badge
                      [expiryDate]="getFutureDate(3)"
                      [variant]="'solid'"
                    />
                  </div>
                </div>

                <div class="expiry-badge-doc__variant-group">
                  <h4>Expired Status</h4>
                  <div class="variant-row">
                    <ax-expiry-badge
                      [expiryDate]="getPastDate(5)"
                      [variant]="'outlined'"
                    />
                    <ax-expiry-badge
                      [expiryDate]="getPastDate(5)"
                      [variant]="'soft'"
                    />
                    <ax-expiry-badge
                      [expiryDate]="getPastDate(5)"
                      [variant]="'solid'"
                    />
                  </div>
                </div>
              </ax-live-preview>
            </section>
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="expiry-badge-doc__tab-content">
            <section class="expiry-badge-doc__section">
              <h2>Input Properties</h2>
              <div class="expiry-badge-doc__api-table">
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
                      <td><code>expiryDate</code></td>
                      <td><code>Date</code></td>
                      <td><em>Required</em></td>
                      <td>Expiry date to evaluate</td>
                    </tr>
                    <tr>
                      <td><code>warningDays</code></td>
                      <td><code>number</code></td>
                      <td><code>30</code></td>
                      <td>Days threshold for warning status</td>
                    </tr>
                    <tr>
                      <td><code>criticalDays</code></td>
                      <td><code>number</code></td>
                      <td><code>7</code></td>
                      <td>Days threshold for critical status</td>
                    </tr>
                    <tr>
                      <td><code>showCountdown</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Show countdown text (e.g., "15 days left")</td>
                    </tr>
                    <tr>
                      <td><code>showIcon</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Show status icon</td>
                    </tr>
                    <tr>
                      <td><code>size</code></td>
                      <td><code>'sm' | 'md' | 'lg'</code></td>
                      <td><code>'md'</code></td>
                      <td>Badge size: sm (20px), md (24px), lg (32px)</td>
                    </tr>
                    <tr>
                      <td><code>variant</code></td>
                      <td><code>'outlined' | 'soft' | 'solid'</code></td>
                      <td><code>'soft'</code></td>
                      <td>Badge style variant</td>
                    </tr>
                    <tr>
                      <td><code>compact</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Compact mode (icon only with tooltip)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="expiry-badge-doc__section">
              <h2>Output Events</h2>
              <div class="expiry-badge-doc__api-table">
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
                      <td><code>badgeClick</code></td>
                      <td><code>ExpiryInfo</code></td>
                      <td>
                        Emitted when badge is clicked with expiry information
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="expiry-badge-doc__section">
              <h2>Type Definitions</h2>

              <h3>ExpiryInfo</h3>
              <pre><code>interface ExpiryInfo &#123;
  expiryDate: Date;           // Original expiry date
  daysUntilExpiry: number;    // Days until expiry (negative if expired)
  status: ExpiryStatus;       // Current expiry status
  message: string;            // Display message
&#125;</code></pre>

              <h3>ExpiryStatus</h3>
              <pre><code>type ExpiryStatus = 'safe' | 'warning' | 'critical' | 'expired';</code></pre>

              <h3>Status Rules</h3>
              <div class="expiry-badge-doc__status-rules">
                <div class="status-rule status-rule--safe">
                  <strong>Safe (Green)</strong>
                  <p>Days remaining &gt; warningDays (default: 30)</p>
                </div>
                <div class="status-rule status-rule--warning">
                  <strong>Warning (Yellow)</strong>
                  <p>criticalDays &lt; Days ≤ warningDays (default: 7-30)</p>
                </div>
                <div class="status-rule status-rule--critical">
                  <strong>Critical (Red)</strong>
                  <p>0 ≤ Days ≤ criticalDays (default: 0-7)</p>
                </div>
                <div class="status-rule status-rule--expired">
                  <strong>Expired (Gray)</strong>
                  <p>Days &lt; 0 (past expiry date)</p>
                </div>
              </div>
            </section>
          </div>
        </mat-tab>

        <!-- Tokens Tab -->
        <mat-tab label="Tokens">
          <div class="expiry-badge-doc__tab-content">
            <ax-component-tokens
              [tokens]="expiryBadgeTokens"
            ></ax-component-tokens>
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="expiry-badge-doc__tab-content">
            <section class="expiry-badge-doc__section">
              <h2>Do's and Don'ts</h2>

              <div class="expiry-badge-doc__guidelines">
                <div
                  class="expiry-badge-doc__guideline expiry-badge-doc__guideline--do"
                >
                  <h4><mat-icon>check_circle</mat-icon> Do</h4>
                  <ul>
                    <li>
                      Use consistent thresholds across similar product types
                    </li>
                    <li>
                      Set thresholds based on regulatory requirements and
                      business rules
                    </li>
                    <li>Use compact mode in dense table layouts</li>
                    <li>
                      Handle badge clicks to enable quick actions (view details,
                      reorder)
                    </li>
                    <li>Display countdown for better time awareness</li>
                    <li>
                      Use tooltips to provide full expiry date information
                    </li>
                  </ul>
                </div>

                <div
                  class="expiry-badge-doc__guideline expiry-badge-doc__guideline--dont"
                >
                  <h4><mat-icon>cancel</mat-icon> Don't</h4>
                  <ul>
                    <li>Set criticalDays higher than warningDays</li>
                    <li>
                      Use extremely short thresholds that trigger false alarms
                    </li>
                    <li>Mix variants in the same view</li>
                    <li>Hide critical or expired badges</li>
                    <li>Ignore expired items in inventory systems</li>
                    <li>Use countdown without considering timezone issues</li>
                  </ul>
                </div>
              </div>
            </section>

            <section class="expiry-badge-doc__section">
              <h2>Accessibility</h2>
              <ul class="expiry-badge-doc__a11y-list">
                <li>
                  Badge includes proper ARIA labels describing expiry status
                </li>
                <li>
                  Color-coded states meet WCAG 2.1 AA contrast requirements
                </li>
                <li>
                  Tooltip provides additional context with exact date and time
                </li>
                <li>Badge is keyboard accessible with tab navigation</li>
                <li>
                  Status information is conveyed through both color and text
                  (not relying on color alone)
                </li>
                <li>
                  Icons have semantic meaning with proper Material Icons labels
                </li>
              </ul>
            </section>

            <section class="expiry-badge-doc__section">
              <h2>Best Practices</h2>
              <ul class="expiry-badge-doc__best-practices">
                <li>
                  <strong>Threshold Configuration:</strong> For pharmaceuticals,
                  use warningDays=30 (FDA recommendation for reorder) and
                  criticalDays=7 (urgency for disposition)
                </li>
                <li>
                  <strong>Variant Selection:</strong> Use 'soft' (default) for
                  general use, 'outlined' for light backgrounds, 'solid' for
                  high emphasis
                </li>
                <li>
                  <strong>Compact Mode:</strong> Enable in tables with 5+
                  columns where space is limited; rely on tooltips for details
                </li>
                <li>
                  <strong>Size Selection:</strong> Use 'sm' in tables, 'md' in
                  cards and lists, 'lg' in detail views or dashboards
                </li>
                <li>
                  <strong>Countdown Display:</strong> Show countdown for
                  non-expired items; hide for expired to avoid confusion with
                  negative numbers
                </li>
                <li>
                  <strong>Click Handling:</strong> Implement click handlers to
                  navigate to batch details, expiry reports, or disposal
                  workflows
                </li>
                <li>
                  <strong>Real-time Updates:</strong> For dashboard views,
                  refresh expiry calculations daily or on data reload to ensure
                  accuracy
                </li>
              </ul>
            </section>

            <section class="expiry-badge-doc__section">
              <h2>Color Semantics</h2>
              <div class="expiry-badge-doc__color-semantics">
                <div class="color-semantic color-semantic--green">
                  <mat-icon>check_circle</mat-icon>
                  <strong>Green (Safe)</strong>
                  <p>Sufficient time remaining. No action required.</p>
                </div>
                <div class="color-semantic color-semantic--yellow">
                  <mat-icon>warning</mat-icon>
                  <strong>Yellow (Warning)</strong>
                  <p>Approaching expiry. Plan for reorder or consumption.</p>
                </div>
                <div class="color-semantic color-semantic--red">
                  <mat-icon>error</mat-icon>
                  <strong>Red (Critical)</strong>
                  <p>Expiring soon. Immediate action required.</p>
                </div>
                <div class="color-semantic color-semantic--gray">
                  <mat-icon>cancel</mat-icon>
                  <strong>Gray (Expired)</strong>
                  <p>Past expiry date. Requires disposal or evaluation.</p>
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
      .expiry-badge-doc {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--ax-spacing-xl, 1.5rem);
      }

      .expiry-badge-doc__tabs {
        margin-top: var(--ax-spacing-xl, 1.5rem);
      }

      .expiry-badge-doc__tab-content {
        padding: var(--ax-spacing-xl, 1.5rem) 0;
      }

      .expiry-badge-doc__section {
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

      .expiry-badge-doc__demo {
        width: 100%;

        h4 {
          font-size: var(--ax-text-sm, 0.875rem);
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0 0 var(--ax-spacing-sm, 0.5rem) 0;
        }
      }

      /* Product Card Example */
      .expiry-badge-doc__product-card {
        padding: var(--ax-spacing-md, 0.75rem);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-md, 0.5rem);
        background: var(--ax-background-default);
        display: flex;
        justify-content: space-between;
        align-items: center;

        .product-info {
          flex: 1;

          h4 {
            font-size: var(--ax-text-base, 1rem);
            font-weight: 600;
            color: var(--ax-text-heading);
            margin: 0 0 var(--ax-spacing-xs, 0.25rem) 0;
          }

          .product-sku,
          .product-batch {
            display: block;
            font-size: var(--ax-text-xs, 0.75rem);
            color: var(--ax-text-secondary);
          }
        }

        .product-expiry {
          margin-left: var(--ax-spacing-md, 0.75rem);
        }
      }

      /* Table Example */
      .expiry-badge-doc__table {
        width: 100%;
        overflow-x: auto;

        table {
          width: 100%;
          border-collapse: collapse;

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

          tbody tr:hover {
            background: var(--ax-background-subtle);
          }
        }
      }

      /* Variant Group */
      .expiry-badge-doc__variant-group {
        h4 {
          font-size: var(--ax-text-sm, 0.875rem);
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0 0 var(--ax-spacing-sm, 0.5rem) 0;
        }

        .variant-row {
          display: flex;
          gap: var(--ax-spacing-md, 0.75rem);
          flex-wrap: wrap;
        }
      }

      /* API Table */
      .expiry-badge-doc__api-table {
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

      /* Status Rules */
      .expiry-badge-doc__status-rules {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--ax-spacing-md, 0.75rem);
        margin-top: var(--ax-spacing-md, 0.75rem);
      }

      .status-rule {
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

      .status-rule--safe {
        background: var(--ax-success-faint);
        border-color: var(--ax-success-default);
        color: var(--ax-success-emphasis);
      }

      .status-rule--warning {
        background: var(--ax-warning-faint);
        border-color: var(--ax-warning-default);
        color: var(--ax-warning-emphasis);
      }

      .status-rule--critical {
        background: var(--ax-error-faint);
        border-color: var(--ax-error-default);
        color: var(--ax-error-emphasis);
      }

      .status-rule--expired {
        background: var(--ax-background-subtle);
        border-color: var(--ax-border-default);
        color: var(--ax-text-secondary);
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
      .expiry-badge-doc__guidelines {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--ax-spacing-lg, 1rem);
      }

      .expiry-badge-doc__guideline {
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

      .expiry-badge-doc__guideline--do {
        background: var(--ax-success-faint);

        h4 {
          color: var(--ax-success-emphasis);
        }
        li {
          color: var(--ax-success-emphasis);
        }
      }

      .expiry-badge-doc__guideline--dont {
        background: var(--ax-error-faint);

        h4 {
          color: var(--ax-error-emphasis);
        }
        li {
          color: var(--ax-error-emphasis);
        }
      }

      .expiry-badge-doc__a11y-list,
      .expiry-badge-doc__best-practices {
        margin: 0;
        padding-left: var(--ax-spacing-lg, 1rem);

        li {
          font-size: var(--ax-text-sm, 0.875rem);
          color: var(--ax-text-secondary);
          margin-bottom: var(--ax-spacing-sm, 0.5rem);
        }
      }

      /* Color Semantics */
      .expiry-badge-doc__color-semantics {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--ax-spacing-md, 0.75rem);
        margin-top: var(--ax-spacing-md, 0.75rem);
      }

      .color-semantic {
        padding: var(--ax-spacing-md, 0.75rem);
        border-radius: var(--ax-radius-md, 0.5rem);
        border: 2px solid;
        text-align: center;

        mat-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;
          margin-bottom: var(--ax-spacing-xs, 0.25rem);
        }

        strong {
          display: block;
          font-size: var(--ax-text-sm, 0.875rem);
          font-weight: 600;
          margin-bottom: var(--ax-spacing-xs, 0.25rem);
        }

        p {
          font-size: var(--ax-text-xs, 0.75rem);
          margin: 0;
        }
      }

      .color-semantic--green {
        background: var(--ax-success-faint);
        border-color: var(--ax-success-default);
        color: var(--ax-success-emphasis);
      }

      .color-semantic--yellow {
        background: var(--ax-warning-faint);
        border-color: var(--ax-warning-default);
        color: var(--ax-warning-emphasis);
      }

      .color-semantic--red {
        background: var(--ax-error-faint);
        border-color: var(--ax-error-default);
        color: var(--ax-error-emphasis);
      }

      .color-semantic--gray {
        background: var(--ax-background-subtle);
        border-color: var(--ax-border-default);
        color: var(--ax-text-secondary);
      }
    `,
  ],
})
export class ExpiryBadgeDocComponent {
  // Helper methods to generate dates
  getFutureDate(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  }

  getPastDate(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
  }

  handleBadgeClick(event: {
    expiryDate: Date;
    daysUntilExpiry: number;
    status: string;
    message: string;
  }): void {
    console.log('Badge clicked:', event);
  }

  basicUsageCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-expiry-badge
  [expiryDate]="product.expiryDate"
  (badgeClick)="handleBadgeClick($event)"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxExpiryBadgeComponent, ExpiryInfo } from '@aegisx/ui';

@Component({
  selector: 'app-product-expiry',
  standalone: true,
  imports: [AxExpiryBadgeComponent],
  template: \`
    <ax-expiry-badge
      [expiryDate]="productExpiryDate"
      (badgeClick)="handleBadgeClick($event)"
    />
  \`,
})
export class ProductExpiryComponent {
  productExpiryDate = new Date('2025-02-15');

  handleBadgeClick(info: ExpiryInfo): void {
    console.log('Expiry info:', info);
    // Navigate to batch details or show expiry management
  }
}`,
    },
  ];

  statusColorsCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Safe (Green) - More than 30 days -->
<ax-expiry-badge [expiryDate]="safeDate" />

<!-- Warning (Yellow) - 8 to 30 days -->
<ax-expiry-badge [expiryDate]="warningDate" />

<!-- Critical (Red) - 1 to 7 days -->
<ax-expiry-badge [expiryDate]="criticalDate" />

<!-- Expired (Gray) - Past expiry date -->
<ax-expiry-badge [expiryDate]="expiredDate" />`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `export class ExpiryStatusComponent {
  safeDate = this.addDays(45);      // 45 days from now
  warningDate = this.addDays(15);   // 15 days from now
  criticalDate = this.addDays(3);   // 3 days from now
  expiredDate = this.addDays(-5);   // 5 days ago

  private addDays(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  }
}`,
    },
  ];

  sizesCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Small (20px height) -->
<ax-expiry-badge
  [expiryDate]="expiryDate"
  [size]="'sm'"
/>

<!-- Medium (24px height, default) -->
<ax-expiry-badge
  [expiryDate]="expiryDate"
  [size]="'md'"
/>

<!-- Large (32px height) -->
<ax-expiry-badge
  [expiryDate]="expiryDate"
  [size]="'lg'"
/>`,
    },
  ];

  variantsCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Outlined -->
<ax-expiry-badge
  [expiryDate]="expiryDate"
  [variant]="'outlined'"
/>

<!-- Soft (default) -->
<ax-expiry-badge
  [expiryDate]="expiryDate"
  [variant]="'soft'"
/>

<!-- Solid -->
<ax-expiry-badge
  [expiryDate]="expiryDate"
  [variant]="'solid'"
/>`,
    },
  ];

  compactModeCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Compact mode for tables -->
<ax-expiry-badge
  [expiryDate]="item.expiryDate"
  [compact]="true"
  [size]="'sm'"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `// Use in table templates
@Component({
  template: \`
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Batch</th>
          <th>Expiry</th>
        </tr>
      </thead>
      <tbody>
        @for (item of items(); track item.id) {
          <tr>
            <td>{{ item.name }}</td>
            <td>{{ item.batch }}</td>
            <td>
              <ax-expiry-badge
                [expiryDate]="item.expiryDate"
                [compact]="true"
                [size]="'sm'"
              />
            </td>
          </tr>
        }
      </tbody>
    </table>
  \`
})`,
    },
  ];

  customThresholdsCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Default thresholds (30/7 days) -->
<ax-expiry-badge [expiryDate]="expiryDate" />

<!-- Custom thresholds (14/3 days) -->
<ax-expiry-badge
  [expiryDate]="expiryDate"
  [warningDays]="14"
  [criticalDays]="3"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `// Configure based on product type
@Component({
  template: \`
    <!-- Pharmaceuticals: strict requirements -->
    <ax-expiry-badge
      [expiryDate]="pharmaExpiry"
      [warningDays]="30"
      [criticalDays]="7"
    />

    <!-- Food items: shorter shelf life -->
    <ax-expiry-badge
      [expiryDate]="foodExpiry"
      [warningDays]="7"
      [criticalDays]="2"
    />

    <!-- Chemicals: longer shelf life -->
    <ax-expiry-badge
      [expiryDate]="chemicalExpiry"
      [warningDays]="90"
      [criticalDays]="30"
    />
  \`
})`,
    },
  ];

  countdownOptionsCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- With countdown and icon (default) -->
<ax-expiry-badge
  [expiryDate]="expiryDate"
  [showCountdown]="true"
  [showIcon]="true"
/>

<!-- Status text only (no countdown) -->
<ax-expiry-badge
  [expiryDate]="expiryDate"
  [showCountdown]="false"
  [showIcon]="true"
/>

<!-- Text only (no icon) -->
<ax-expiry-badge
  [expiryDate]="expiryDate"
  [showCountdown]="true"
  [showIcon]="false"
/>`,
    },
  ];

  expiryBadgeTokens: ComponentToken[] = [
    {
      category: 'Colors',
      cssVar: '--ax-success-default',
      usage: 'Safe status badge color (green)',
    },
    {
      category: 'Colors',
      cssVar: '--ax-success-faint',
      usage: 'Safe status badge background (soft variant)',
    },
    {
      category: 'Colors',
      cssVar: '--ax-success-emphasis',
      usage: 'Safe status text color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-warning-default',
      usage: 'Warning status badge color (yellow)',
    },
    {
      category: 'Colors',
      cssVar: '--ax-warning-faint',
      usage: 'Warning status badge background (soft variant)',
    },
    {
      category: 'Colors',
      cssVar: '--ax-warning-emphasis',
      usage: 'Warning status text color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-error-default',
      usage: 'Critical status badge color (red)',
    },
    {
      category: 'Colors',
      cssVar: '--ax-error-faint',
      usage: 'Critical status badge background (soft variant)',
    },
    {
      category: 'Colors',
      cssVar: '--ax-error-emphasis',
      usage: 'Critical status text color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-secondary',
      usage: 'Expired status badge color (gray)',
    },
    {
      category: 'Colors',
      cssVar: '--ax-background-subtle',
      usage: 'Expired status badge background',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-xs',
      usage: 'Small size padding and icon spacing',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-sm',
      usage: 'Medium size padding',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-md',
      usage: 'Large size padding',
    },
    {
      category: 'Borders',
      cssVar: '--ax-radius-sm',
      usage: 'Badge corner rounding (small/medium)',
    },
    {
      category: 'Borders',
      cssVar: '--ax-radius-md',
      usage: 'Badge corner rounding (large)',
    },
    {
      category: 'Typography',
      cssVar: '--ax-text-xs',
      usage: 'Small badge text size',
    },
    {
      category: 'Typography',
      cssVar: '--ax-text-sm',
      usage: 'Medium badge text size',
    },
    {
      category: 'Typography',
      cssVar: '--ax-text-base',
      usage: 'Large badge text size',
    },
  ];
}
