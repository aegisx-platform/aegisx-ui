import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import {
  AxDescriptionListComponent,
  AxFieldDisplayComponent,
} from '@aegisx/ui';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
} from '../../../../../../components/docs';

@Component({
  selector: 'ax-description-list-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    AxDescriptionListComponent,
    AxFieldDisplayComponent,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
  ],
  template: `
    <div class="description-list-doc">
      <ax-doc-header
        title="Description List"
        icon="list_alt"
        description="Container for organizing multiple field-display components in structured layouts. Supports grid, horizontal, and vertical layouts."
        [breadcrumbs]="[
          {
            label: 'Data Display',
            link: '/docs/components/aegisx/data-display/card',
          },
          { label: 'Description List' },
        ]"
        status="stable"
        version="1.0.0"
        importStatement="import { AxDescriptionListComponent, AxFieldDisplayComponent } from '@aegisx/ui';"
      ></ax-doc-header>

      <mat-tab-group class="doc-tabs" animationDuration="150ms">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="doc-tab-content">
            <section class="doc-section">
              <h2>Basic Usage</h2>
              <p>
                Description List is a container component that organizes
                field-display components in structured layouts. Use it to group
                related information.
              </p>

              <ax-live-preview variant="bordered">
                <ax-description-list>
                  <ax-field-display
                    label="Name"
                    value="Somchai Jaidee"
                  ></ax-field-display>
                  <ax-field-display
                    label="Email"
                    value="somchai@company.co.th"
                  ></ax-field-display>
                  <ax-field-display
                    label="Phone"
                    value="+66-2-123-4567"
                  ></ax-field-display>
                </ax-description-list>
              </ax-live-preview>

              <ax-code-tabs [tabs]="basicUsageCode"></ax-code-tabs>
            </section>

            <section class="doc-section">
              <h2>Grid Layout</h2>
              <p>Use grid layout for organizing fields in multiple columns.</p>

              <ax-live-preview variant="bordered">
                <ax-description-list layout="grid" [columns]="2">
                  <ax-field-display
                    label="First Name"
                    value="Somchai"
                  ></ax-field-display>
                  <ax-field-display
                    label="Last Name"
                    value="Jaidee"
                  ></ax-field-display>
                  <ax-field-display
                    label="Department"
                    value="Engineering"
                  ></ax-field-display>
                  <ax-field-display
                    label="Position"
                    value="Senior Developer"
                  ></ax-field-display>
                  <ax-field-display
                    label="Email"
                    value="somchai@company.co.th"
                  ></ax-field-display>
                  <ax-field-display
                    label="Phone"
                    value="+66-81-234-5678"
                  ></ax-field-display>
                </ax-description-list>
              </ax-live-preview>

              <ax-code-tabs [tabs]="gridLayoutCode"></ax-code-tabs>
            </section>

            <section class="doc-section">
              <h2>With Dividers</h2>
              <p>Add dividers between fields for visual separation.</p>

              <ax-live-preview variant="bordered">
                <ax-description-list [divider]="true">
                  <ax-field-display
                    label="Order ID"
                    value="ORD-2024-001234"
                  ></ax-field-display>
                  <ax-field-display
                    label="Status"
                    value="Processing"
                  ></ax-field-display>
                  <ax-field-display
                    label="Total"
                    value="฿25,999.00"
                  ></ax-field-display>
                </ax-description-list>
              </ax-live-preview>
            </section>

            <section class="doc-section">
              <h2>Vertical Layout</h2>
              <p>
                Use vertical layout when you have longer values or descriptions.
              </p>

              <ax-live-preview variant="bordered">
                <ax-description-list layout="vertical">
                  <ax-field-display
                    label="Project Name"
                    value="AegisX Design System"
                  ></ax-field-display>
                  <ax-field-display
                    label="Description"
                    value="A comprehensive Angular component library built with Material Design 3 principles"
                  ></ax-field-display>
                  <ax-field-display
                    label="Technologies"
                    value="Angular 19, TypeScript, SCSS, Material Design 3"
                  ></ax-field-display>
                </ax-description-list>
              </ax-live-preview>
            </section>

            <section class="doc-section">
              <h2>Column Options</h2>
              <p>Grid layout supports 1, 2, or 3 columns.</p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-xl)"
              >
                <div>
                  <h4
                    style="margin: 0 0 8px; font-size: 14px; color: var(--ax-text-secondary)"
                  >
                    3 Columns
                  </h4>
                  <ax-description-list layout="grid" [columns]="3">
                    <ax-field-display
                      label="Name"
                      value="John"
                    ></ax-field-display>
                    <ax-field-display label="Age" value="28"></ax-field-display>
                    <ax-field-display
                      label="City"
                      value="Bangkok"
                    ></ax-field-display>
                  </ax-description-list>
                </div>
              </ax-live-preview>
            </section>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="doc-tab-content">
            <section class="doc-section">
              <h2>Employee Profile</h2>
              <ax-live-preview variant="bordered">
                <ax-description-list
                  layout="grid"
                  [columns]="2"
                  [divider]="true"
                >
                  <ax-field-display
                    label="Employee ID"
                    value="EMP-001234"
                  ></ax-field-display>
                  <ax-field-display
                    label="Full Name"
                    value="Somchai Jaidee"
                  ></ax-field-display>
                  <ax-field-display
                    label="Department"
                    value="Software Development"
                  ></ax-field-display>
                  <ax-field-display
                    label="Position"
                    value="Senior Full-Stack Developer"
                  ></ax-field-display>
                  <ax-field-display
                    label="Email"
                    value="somchai@company.co.th"
                    type="email"
                  ></ax-field-display>
                  <ax-field-display
                    label="Phone"
                    value="+66-81-234-5678"
                    type="phone"
                  ></ax-field-display>
                  <ax-field-display
                    label="Join Date"
                    [value]="joinDate"
                    type="date"
                  ></ax-field-display>
                  <ax-field-display
                    label="Manager"
                    value="Somsri Manager"
                  ></ax-field-display>
                </ax-description-list>
              </ax-live-preview>
            </section>

            <section class="doc-section">
              <h2>Order Summary</h2>
              <ax-live-preview variant="bordered">
                <ax-description-list [divider]="true">
                  <ax-field-display
                    label="Order Number"
                    value="ORD-2024-001234"
                  ></ax-field-display>
                  <ax-field-display
                    label="Order Date"
                    [value]="orderDate"
                    type="date"
                  ></ax-field-display>
                  <ax-field-display
                    label="Customer"
                    value="Somchai Jaidee"
                  ></ax-field-display>
                  <ax-field-display
                    label="Shipping Address"
                    value="123 Sukhumvit Rd, Bangkok 10110"
                  ></ax-field-display>
                  <ax-field-display
                    label="Subtotal"
                    [value]="24999"
                    type="currency"
                    [formatOptions]="{ currency: 'THB' }"
                  ></ax-field-display>
                  <ax-field-display
                    label="Shipping"
                    [value]="100"
                    type="currency"
                    [formatOptions]="{ currency: 'THB' }"
                  ></ax-field-display>
                  <ax-field-display
                    label="Total"
                    [value]="25099"
                    type="currency"
                    [formatOptions]="{ currency: 'THB' }"
                  ></ax-field-display>
                </ax-description-list>
              </ax-live-preview>
            </section>

            <section class="doc-section">
              <h2>Product Details</h2>
              <ax-live-preview variant="bordered">
                <ax-description-list layout="vertical">
                  <ax-field-display
                    label="Product Name"
                    value="MacBook Pro 14-inch M3 Pro"
                  ></ax-field-display>
                  <ax-field-display
                    label="SKU"
                    value="MBP-14-M3PRO-512"
                  ></ax-field-display>
                  <ax-field-display
                    label="Category"
                    value="Computers > Laptops > Apple"
                  ></ax-field-display>
                  <ax-field-display
                    label="Description"
                    value="The most advanced MacBook Pro ever. Powered by the M3 Pro chip, delivering exceptional performance for demanding workflows."
                  ></ax-field-display>
                  <ax-field-display
                    label="Price"
                    [value]="69900"
                    type="currency"
                    [formatOptions]="{ currency: 'THB' }"
                  ></ax-field-display>
                  <ax-field-display
                    label="Stock"
                    value="In Stock (15 units)"
                  ></ax-field-display>
                </ax-description-list>
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
                      <td><code>layout</code></td>
                      <td><code>'horizontal' | 'vertical' | 'grid'</code></td>
                      <td><code>'horizontal'</code></td>
                      <td>Layout mode for the description list</td>
                    </tr>
                    <tr>
                      <td><code>columns</code></td>
                      <td><code>1 | 2 | 3</code></td>
                      <td><code>2</code></td>
                      <td>Number of columns for grid layout</td>
                    </tr>
                    <tr>
                      <td><code>size</code></td>
                      <td><code>'sm' | 'md' | 'lg'</code></td>
                      <td><code>'md'</code></td>
                      <td>Size variant (cascades to child components)</td>
                    </tr>
                    <tr>
                      <td><code>divider</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Show dividers between fields</td>
                    </tr>
                    <tr>
                      <td><code>gap</code></td>
                      <td><code>string</code></td>
                      <td><code>undefined</code></td>
                      <td>Gap between items (CSS value)</td>
                    </tr>
                    <tr>
                      <td><code>class</code></td>
                      <td><code>string</code></td>
                      <td><code>''</code></td>
                      <td>Optional CSS class for the container</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="doc-section">
              <h2>Content Projection</h2>
              <p>
                Description List uses <code>ng-content</code> to project child
                <code>ax-field-display</code> components. All field-display
                components inside will inherit layout styles from the parent.
              </p>
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
                    <li>Group related fields together</li>
                    <li>Use grid layout for structured data</li>
                    <li>Add dividers to separate logical sections</li>
                    <li>Use vertical layout for long descriptions</li>
                  </ul>
                </div>
                <div class="guideline dont">
                  <h4><mat-icon>cancel</mat-icon> Don't</h4>
                  <ul>
                    <li>Mix different layouts in the same group</li>
                    <li>Use too many columns (max 3)</li>
                    <li>Put unrelated fields together</li>
                    <li>Nest description lists inside each other</li>
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
      .description-list-doc {
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
export class DescriptionListDocComponent {
  joinDate = new Date('2022-01-15');
  orderDate = new Date('2024-11-28');

  basicUsageCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-description-list>
  <ax-field-display label="Name" value="Somchai Jaidee"></ax-field-display>
  <ax-field-display label="Email" value="somchai@company.co.th"></ax-field-display>
  <ax-field-display label="Phone" value="+66-2-123-4567"></ax-field-display>
</ax-description-list>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxDescriptionListComponent, AxFieldDisplayComponent } from '@aegisx/ui';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [AxDescriptionListComponent, AxFieldDisplayComponent],
  template: \`
    <ax-description-list>
      <ax-field-display label="Name" [value]="user.name"></ax-field-display>
      <ax-field-display label="Email" [value]="user.email"></ax-field-display>
    </ax-description-list>
  \`,
})
export class UserDetailComponent {
  user = { name: 'Somchai', email: 'somchai@company.co.th' };
}`,
    },
  ];

  gridLayoutCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-description-list layout="grid" [columns]="2">
  <ax-field-display label="First Name" value="Somchai"></ax-field-display>
  <ax-field-display label="Last Name" value="Jaidee"></ax-field-display>
  <ax-field-display label="Department" value="Engineering"></ax-field-display>
  <ax-field-display label="Position" value="Senior Developer"></ax-field-display>
</ax-description-list>`,
    },
  ];
}
