import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { AxFieldDisplayComponent } from '@aegisx/ui';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
} from '../../../../../../components/docs';

@Component({
  selector: 'ax-field-display-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    AxFieldDisplayComponent,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
  ],
  template: `
    <div class="field-display-doc">
      <ax-doc-header
        title="Field Display"
        icon="text_fields"
        description="Displays a single field in read-only format with label and value. Supports automatic type-based formatting and customizable empty states."
        [breadcrumbs]="[
          {
            label: 'Data Display',
            link: '/docs/components/aegisx/data-display/card',
          },
          { label: 'Field Display' },
        ]"
        status="stable"
        version="1.0.0"
        importStatement="import { AxFieldDisplayComponent } from '@aegisx/ui';"
      ></ax-doc-header>

      <mat-tab-group class="doc-tabs" animationDuration="150ms">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="doc-tab-content">
            <section class="doc-section">
              <h2>Basic Usage</h2>
              <p>
                Field Display shows a label-value pair in a clean, consistent
                format. Perfect for detail views, profile pages, and data
                summaries.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                align="start"
                gap="var(--ax-spacing-md)"
              >
                <ax-field-display
                  label="Name"
                  value="John Doe"
                ></ax-field-display>
                <ax-field-display
                  label="Email"
                  value="john@example.com"
                ></ax-field-display>
                <ax-field-display
                  label="Department"
                  value="Engineering"
                ></ax-field-display>
              </ax-live-preview>

              <ax-code-tabs [tabs]="basicUsageCode"></ax-code-tabs>
            </section>

            <section class="doc-section">
              <h2>Type Formatting</h2>
              <p>
                Use the <code>type</code> property for automatic formatting of
                dates, currencies, and more.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                align="start"
                gap="var(--ax-spacing-md)"
              >
                <ax-field-display
                  label="Birth Date"
                  [value]="sampleDate"
                  type="date"
                ></ax-field-display>
                <ax-field-display
                  label="Salary"
                  [value]="75000"
                  type="currency"
                  [formatOptions]="{ currency: 'THB' }"
                ></ax-field-display>
                <ax-field-display
                  label="Progress"
                  [value]="0.85"
                  type="percentage"
                ></ax-field-display>
                <ax-field-display
                  label="Phone"
                  value="+66-81-234-5678"
                  type="phone"
                ></ax-field-display>
                <ax-field-display
                  label="Email"
                  value="contact@company.com"
                  type="email"
                ></ax-field-display>
              </ax-live-preview>

              <ax-code-tabs [tabs]="typeFormatCode"></ax-code-tabs>
            </section>

            <section class="doc-section">
              <h2>Orientations</h2>
              <p>
                Switch between horizontal and vertical layouts based on your
                design needs.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                align="start"
                gap="var(--ax-spacing-lg)"
              >
                <div>
                  <h4
                    style="margin: 0 0 8px 0; font-size: 14px; color: var(--ax-text-secondary)"
                  >
                    Horizontal (default)
                  </h4>
                  <ax-field-display
                    label="Status"
                    value="Active"
                    orientation="horizontal"
                  ></ax-field-display>
                </div>
                <div>
                  <h4
                    style="margin: 0 0 8px 0; font-size: 14px; color: var(--ax-text-secondary)"
                  >
                    Vertical
                  </h4>
                  <ax-field-display
                    label="Description"
                    value="This is a longer description that works better in vertical layout"
                    orientation="vertical"
                  ></ax-field-display>
                </div>
              </ax-live-preview>
            </section>

            <section class="doc-section">
              <h2>Empty States</h2>
              <p>Customize how empty or null values are displayed.</p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                align="start"
                gap="var(--ax-spacing-md)"
              >
                <ax-field-display
                  label="Middle Name"
                  [value]="null"
                  emptyDisplay="dash"
                ></ax-field-display>
                <ax-field-display
                  label="Nickname"
                  [value]="null"
                  emptyDisplay="placeholder"
                ></ax-field-display>
                <ax-field-display
                  label="Notes"
                  [value]="null"
                  emptyDisplay="text"
                  emptyText="No notes available"
                ></ax-field-display>
              </ax-live-preview>
            </section>

            <section class="doc-section">
              <h2>Sizes</h2>
              <p>Three size variants for different contexts.</p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                align="start"
                gap="var(--ax-spacing-md)"
              >
                <ax-field-display
                  label="Small"
                  value="Compact text"
                  size="sm"
                ></ax-field-display>
                <ax-field-display
                  label="Medium"
                  value="Default size"
                  size="md"
                ></ax-field-display>
                <ax-field-display
                  label="Large"
                  value="Larger text"
                  size="lg"
                ></ax-field-display>
              </ax-live-preview>
            </section>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="doc-tab-content">
            <section class="doc-section">
              <h2>User Profile</h2>
              <ax-live-preview
                variant="bordered"
                direction="column"
                align="start"
                gap="var(--ax-spacing-sm)"
              >
                <ax-field-display
                  label="Full Name"
                  value="Somchai Jaidee"
                  labelWidth="120px"
                ></ax-field-display>
                <ax-field-display
                  label="Email"
                  value="somchai@company.co.th"
                  type="email"
                  labelWidth="120px"
                ></ax-field-display>
                <ax-field-display
                  label="Phone"
                  value="+66-2-123-4567"
                  type="phone"
                  labelWidth="120px"
                ></ax-field-display>
                <ax-field-display
                  label="Department"
                  value="Software Development"
                  labelWidth="120px"
                ></ax-field-display>
                <ax-field-display
                  label="Join Date"
                  [value]="joinDate"
                  type="date"
                  labelWidth="120px"
                ></ax-field-display>
              </ax-live-preview>
            </section>

            <section class="doc-section">
              <h2>Order Details</h2>
              <ax-live-preview
                variant="bordered"
                direction="column"
                align="start"
                gap="var(--ax-spacing-sm)"
              >
                <ax-field-display
                  label="Order ID"
                  value="ORD-2024-001234"
                  labelWidth="100px"
                ></ax-field-display>
                <ax-field-display
                  label="Total"
                  [value]="25999"
                  type="currency"
                  [formatOptions]="{ currency: 'THB' }"
                  labelWidth="100px"
                ></ax-field-display>
                <ax-field-display
                  label="Status"
                  value="Shipped"
                  labelWidth="100px"
                ></ax-field-display>
                <ax-field-display
                  label="Tracking"
                  value="TH123456789"
                  labelWidth="100px"
                ></ax-field-display>
              </ax-live-preview>
            </section>

            <section class="doc-section">
              <h2>Financial Data</h2>
              <ax-live-preview
                variant="bordered"
                direction="column"
                align="start"
                gap="var(--ax-spacing-sm)"
              >
                <ax-field-display
                  label="Revenue"
                  [value]="1250000"
                  type="currency"
                  [formatOptions]="{ currency: 'THB', decimals: 0 }"
                  labelWidth="120px"
                ></ax-field-display>
                <ax-field-display
                  label="Growth"
                  [value]="0.156"
                  type="percentage"
                  labelWidth="120px"
                ></ax-field-display>
                <ax-field-display
                  label="Transactions"
                  [value]="4521"
                  type="number"
                  labelWidth="120px"
                ></ax-field-display>
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
                      <td><code>label</code></td>
                      <td><code>string</code></td>
                      <td><code>''</code></td>
                      <td>Label text for the field</td>
                    </tr>
                    <tr>
                      <td><code>value</code></td>
                      <td><code>unknown</code></td>
                      <td><code>null</code></td>
                      <td>Value to display</td>
                    </tr>
                    <tr>
                      <td><code>type</code></td>
                      <td>
                        <code
                          >'text' | 'date' | 'datetime' | 'currency' | 'number'
                          | 'percentage' | 'email' | 'phone' | 'url' |
                          'boolean'</code
                        >
                      </td>
                      <td><code>'text'</code></td>
                      <td>Field type for automatic formatting</td>
                    </tr>
                    <tr>
                      <td><code>size</code></td>
                      <td><code>'sm' | 'md' | 'lg'</code></td>
                      <td><code>'md'</code></td>
                      <td>Display size variant</td>
                    </tr>
                    <tr>
                      <td><code>orientation</code></td>
                      <td><code>'horizontal' | 'vertical'</code></td>
                      <td><code>'horizontal'</code></td>
                      <td>Layout orientation</td>
                    </tr>
                    <tr>
                      <td><code>labelWidth</code></td>
                      <td><code>string</code></td>
                      <td><code>undefined</code></td>
                      <td>Fixed width for label (CSS value)</td>
                    </tr>
                    <tr>
                      <td><code>emptyText</code></td>
                      <td><code>string</code></td>
                      <td><code>'—'</code></td>
                      <td>Text to show when value is empty</td>
                    </tr>
                    <tr>
                      <td><code>emptyDisplay</code></td>
                      <td>
                        <code>'dash' | 'text' | 'placeholder' | 'hide'</code>
                      </td>
                      <td><code>'dash'</code></td>
                      <td>How to display empty values</td>
                    </tr>
                    <tr>
                      <td><code>formatOptions</code></td>
                      <td><code>FieldFormatOptions</code></td>
                      <td><code>undefined</code></td>
                      <td>Options for formatter (currency, decimals, etc.)</td>
                    </tr>
                    <tr>
                      <td><code>clickable</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Make email/phone/url clickable links</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="doc-section">
              <h2>Format Options</h2>
              <div class="api-table">
                <table>
                  <thead>
                    <tr>
                      <th>Option</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>currency</code></td>
                      <td><code>string</code></td>
                      <td>Currency code (e.g., 'THB', 'USD')</td>
                    </tr>
                    <tr>
                      <td><code>decimals</code></td>
                      <td><code>number</code></td>
                      <td>Number of decimal places</td>
                    </tr>
                    <tr>
                      <td><code>dateFormat</code></td>
                      <td><code>string</code></td>
                      <td>Date format string</td>
                    </tr>
                    <tr>
                      <td><code>locale</code></td>
                      <td><code>string</code></td>
                      <td>Locale for formatting</td>
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
              <h2>When to Use</h2>
              <ul class="guidelines-list">
                <li>Detail views showing entity information</li>
                <li>Profile pages with user data</li>
                <li>Order summaries and receipts</li>
                <li>Read-only forms or confirmation screens</li>
                <li>Dashboard cards with key metrics</li>
              </ul>
            </section>

            <section class="doc-section">
              <h2>Best Practices</h2>
              <div class="guidelines-grid">
                <div class="guideline do">
                  <h4><mat-icon>check_circle</mat-icon> Do</h4>
                  <ul>
                    <li>Use consistent label widths in a group</li>
                    <li>Choose appropriate type for automatic formatting</li>
                    <li>Provide meaningful empty state text</li>
                    <li>Group related fields together</li>
                  </ul>
                </div>
                <div class="guideline dont">
                  <h4><mat-icon>cancel</mat-icon> Don't</h4>
                  <ul>
                    <li>Mix orientations within the same group</li>
                    <li>Use for editable fields (use form inputs)</li>
                    <li>Put very long text in horizontal layout</li>
                    <li>Hide important empty fields</li>
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
      .field-display-doc {
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

      .guidelines-list {
        padding-left: var(--ax-spacing-lg);
        li {
          font-size: var(--ax-text-sm);
          color: var(--ax-text-primary);
          margin-bottom: var(--ax-spacing-xs);
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
export class FieldDisplayDocComponent {
  sampleDate = new Date('1990-05-15');
  joinDate = new Date('2022-01-15');

  basicUsageCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-field-display label="Name" value="John Doe"></ax-field-display>
<ax-field-display label="Email" value="john@example.com"></ax-field-display>
<ax-field-display label="Department" value="Engineering"></ax-field-display>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxFieldDisplayComponent } from '@aegisx/ui';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [AxFieldDisplayComponent],
  template: \`
    <ax-field-display label="Name" [value]="user.name"></ax-field-display>
    <ax-field-display label="Email" [value]="user.email"></ax-field-display>
  \`,
})
export class UserDetailComponent {
  user = { name: 'John Doe', email: 'john@example.com' };
}`,
    },
  ];

  typeFormatCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Date formatting -->
<ax-field-display label="Birth Date" [value]="birthDate" type="date"></ax-field-display>

<!-- Currency formatting -->
<ax-field-display
  label="Salary"
  [value]="75000"
  type="currency"
  [formatOptions]="{ currency: 'THB' }">
</ax-field-display>

<!-- Percent formatting -->
<ax-field-display label="Progress" [value]="0.85" type="percentage"></ax-field-display>

<!-- Clickable phone -->
<ax-field-display label="Phone" value="+66-81-234-5678" type="phone"></ax-field-display>

<!-- Clickable email -->
<ax-field-display label="Email" value="contact@company.com" type="email"></ax-field-display>`,
    },
  ];
}
