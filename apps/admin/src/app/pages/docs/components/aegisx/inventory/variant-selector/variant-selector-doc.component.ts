import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { AxVariantSelectorComponent } from '@aegisx/ui';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../../../components/docs';
import { ComponentToken } from '../../../../../../types/docs.types';

@Component({
  selector: 'ax-variant-selector-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatChipsModule,
    AxVariantSelectorComponent,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="variant-selector-doc">
      <ax-doc-header
        title="Variant Selector"
        icon="style"
        description="Multi-dimensional product variant selector with grid, list, and compact layouts. Features attribute filtering, stock availability, and search capabilities."
        [breadcrumbs]="[
          {
            label: 'Inventory',
            link: '/docs/components/aegisx/inventory/variant-selector',
          },
          { label: 'Variant Selector' },
        ]"
        status="stable"
        version="1.0.0"
        importStatement="import { AxVariantSelectorComponent } from '@aegisx/ui';"
      ></ax-doc-header>

      <mat-tab-group
        class="variant-selector-doc__tabs"
        animationDuration="150ms"
      >
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="variant-selector-doc__tab-content">
            <section class="variant-selector-doc__section">
              <h2>Basic Usage</h2>
              <p>
                The Variant Selector component enables multi-dimensional product
                variant selection with support for attributes like size, color,
                and style. It displays stock availability, pricing, and images
                for each variant in flexible layout modes.
              </p>

              <ax-live-preview variant="bordered">
                <div class="variant-selector-doc__demo">
                  <ax-variant-selector
                    [productId]="'PROD-001'"
                    [variants]="sampleVariants"
                    [layout]="'grid'"
                    [showImages]="true"
                    [showStock]="true"
                    (variantSelect)="handleVariantSelect($event)"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="basicUsageCode"></ax-code-tabs>
            </section>

            <section class="variant-selector-doc__section">
              <h2>Layout Modes</h2>
              <p>
                Choose between grid, list, or compact layouts depending on your
                display requirements and available space.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-xl)"
                align="stretch"
              >
                <div class="variant-selector-doc__demo">
                  <h4>Grid Layout (Default)</h4>
                  <ax-variant-selector
                    [productId]="'PROD-001'"
                    [variants]="sampleVariants"
                    [layout]="'grid'"
                    [showImages]="true"
                  />
                </div>

                <div class="variant-selector-doc__demo">
                  <h4>List Layout</h4>
                  <ax-variant-selector
                    [productId]="'PROD-001'"
                    [variants]="sampleVariants"
                    [layout]="'list'"
                    [showImages]="true"
                  />
                </div>

                <div class="variant-selector-doc__demo">
                  <h4>Compact Layout</h4>
                  <ax-variant-selector
                    [productId]="'PROD-001'"
                    [variants]="sampleVariants"
                    [layout]="'compact'"
                    [showImages]="false"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="layoutModesCode"></ax-code-tabs>
            </section>

            <section class="variant-selector-doc__section">
              <h2>Multi-Dimensional Attributes</h2>
              <p>
                Filter and select variants by multiple attributes such as size,
                color, style, and more. Attribute filters update available
                variants in real-time.
              </p>

              <ax-live-preview variant="bordered">
                <div class="variant-selector-doc__demo">
                  <ax-variant-selector
                    [productId]="'PROD-002'"
                    [variants]="multiDimensionalVariants"
                    [attributes]="['size', 'color', 'style']"
                    [showAttributeFilters]="true"
                    (attributeFilter)="handleAttributeFilter($event)"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="attributesCode"></ax-code-tabs>
            </section>

            <section class="variant-selector-doc__section">
              <h2>Stock Availability</h2>
              <p>
                Display stock levels with color-coded indicators: green for in
                stock, yellow for low stock, and red for out of stock.
              </p>

              <ax-live-preview variant="bordered">
                <div class="variant-selector-doc__demo">
                  <ax-variant-selector
                    [productId]="'PROD-003'"
                    [variants]="stockVariants"
                    [showStock]="true"
                    [lowStockThreshold]="10"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="stockAvailabilityCode"></ax-code-tabs>
            </section>

            <section class="variant-selector-doc__section">
              <h2>Search by SKU</h2>
              <p>
                Enable search functionality to quickly find variants by SKU,
                name, or attribute values.
              </p>

              <ax-live-preview variant="bordered">
                <div class="variant-selector-doc__demo">
                  <ax-variant-selector
                    [productId]="'PROD-004'"
                    [variants]="sampleVariants"
                    [enableSearch]="true"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="searchCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="variant-selector-doc__tab-content">
            <section class="variant-selector-doc__section">
              <h2>E-commerce Product Page</h2>
              <p>
                Complete variant selection experience for online shopping with
                images, prices, and stock availability.
              </p>

              <ax-live-preview variant="bordered">
                <div class="variant-selector-doc__ecommerce-example">
                  <div class="product-header">
                    <h3>Premium T-Shirt Collection</h3>
                    <p class="product-description">
                      High-quality cotton t-shirts available in multiple sizes
                      and colors
                    </p>
                  </div>
                  <ax-variant-selector
                    [productId]="'TSH-001'"
                    [variants]="ecommerceVariants"
                    [layout]="'grid'"
                    [showImages]="true"
                    [showStock]="true"
                    [showPrice]="true"
                    [enableQuickView]="true"
                  />
                </div>
              </ax-live-preview>
            </section>

            <section class="variant-selector-doc__section">
              <h2>Bulk Order Selection</h2>
              <p>
                Multi-select mode with quantity input for bulk ordering
                scenarios.
              </p>

              <ax-live-preview variant="bordered">
                <div class="variant-selector-doc__demo">
                  <ax-variant-selector
                    [productId]="'BULK-001'"
                    [variants]="bulkVariants"
                    [layout]="'list'"
                    [allowMultiple]="true"
                    [showStock]="true"
                  />
                </div>
              </ax-live-preview>
            </section>

            <section class="variant-selector-doc__section">
              <h2>Compact Inventory View</h2>
              <p>
                Space-efficient compact layout for inventory management
                dashboards.
              </p>

              <ax-live-preview variant="bordered">
                <div class="variant-selector-doc__demo">
                  <ax-variant-selector
                    [productId]="'INV-001'"
                    [variants]="inventoryVariants"
                    [layout]="'compact'"
                    [showImages]="false"
                    [showStock]="true"
                  />
                </div>
              </ax-live-preview>
            </section>

            <section class="variant-selector-doc__section">
              <h2>Attribute Filter Demonstration</h2>
              <p>
                Interactive filtering by size, color, and style attributes with
                real-time variant updates.
              </p>

              <ax-live-preview variant="bordered">
                <div class="variant-selector-doc__demo">
                  <ax-variant-selector
                    [productId]="'FILTER-001'"
                    [variants]="filterDemoVariants"
                    [attributes]="['size', 'color', 'style']"
                    [showAttributeFilters]="true"
                    [enableSearch]="true"
                  />
                </div>
              </ax-live-preview>
            </section>
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="variant-selector-doc__tab-content">
            <section class="variant-selector-doc__section">
              <h2>Input Properties</h2>
              <div class="variant-selector-doc__api-table">
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
                      <td>Base product identifier</td>
                    </tr>
                    <tr>
                      <td><code>variants</code></td>
                      <td><code>ProductVariant[]</code></td>
                      <td><em>Required</em></td>
                      <td>Array of available product variants</td>
                    </tr>
                    <tr>
                      <td><code>attributes</code></td>
                      <td><code>string[]</code></td>
                      <td><code>[]</code></td>
                      <td>
                        Attribute dimensions to display (auto-detected if empty)
                      </td>
                    </tr>
                    <tr>
                      <td><code>layout</code></td>
                      <td><code>'grid' | 'list' | 'compact'</code></td>
                      <td><code>'grid'</code></td>
                      <td>Display layout mode (supports two-way binding)</td>
                    </tr>
                    <tr>
                      <td><code>showImages</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Show variant images/thumbnails</td>
                    </tr>
                    <tr>
                      <td><code>showStock</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Show stock level indicators</td>
                    </tr>
                    <tr>
                      <td><code>showPrice</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Show price differences from base product</td>
                    </tr>
                    <tr>
                      <td><code>allowMultiple</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Allow selecting multiple variants with quantities</td>
                    </tr>
                    <tr>
                      <td><code>lowStockThreshold</code></td>
                      <td><code>number</code></td>
                      <td><code>10</code></td>
                      <td>Stock level threshold for low stock warning</td>
                    </tr>
                    <tr>
                      <td><code>enableQuickView</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Enable quick view modal for variant details</td>
                    </tr>
                    <tr>
                      <td><code>showAttributeFilters</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Show attribute filter chips</td>
                    </tr>
                    <tr>
                      <td><code>enableSearch</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Enable search by SKU/name/attributes</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="variant-selector-doc__section">
              <h2>Output Events</h2>
              <div class="variant-selector-doc__api-table">
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
                      <td><code>variantSelect</code></td>
                      <td><code>VariantSelection</code></td>
                      <td>
                        Emitted when variant selection changes (includes
                        variants and quantities)
                      </td>
                    </tr>
                    <tr>
                      <td><code>attributeFilter</code></td>
                      <td><code>AttributeFilterEvent</code></td>
                      <td>Emitted when attribute filter is applied</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="variant-selector-doc__section">
              <h2>Type Definitions</h2>

              <h3>ProductVariant</h3>
              <pre><code>interface ProductVariant &#123;
  sku: string;                         // Unique variant SKU
  name: string;                        // Variant display name
  attributes: Record&lt;string, string&gt;; // Multi-dimensional attributes
  imageUrl?: string;                   // Variant image URL
  price: number;                       // Variant price
  stockLevel: number;                  // Current stock level
  available: boolean;                  // Availability status
  metadata?: Record&lt;string, unknown&gt;; // Additional metadata
&#125;</code></pre>

              <h3>VariantSelection</h3>
              <pre><code>interface VariantSelection &#123;
  variants: Array&lt;&#123;
    variant: ProductVariant;
    quantity: number;
  &#125;&gt;;
&#125;</code></pre>

              <h3>AttributeFilterEvent</h3>
              <pre><code>interface AttributeFilterEvent &#123;
  attribute: string;  // Attribute key (e.g., 'size', 'color')
  value: string;      // Selected value (e.g., 'Large', 'Blue')
&#125;</code></pre>

              <h3>Layout Modes</h3>
              <div class="variant-selector-doc__layout-modes">
                <div class="layout-mode">
                  <strong>Grid</strong>
                  <p>Responsive grid with images and key details</p>
                </div>
                <div class="layout-mode">
                  <strong>List</strong>
                  <p>Table format with all variant information</p>
                </div>
                <div class="layout-mode">
                  <strong>Compact</strong>
                  <p>Dense layout for space-constrained views</p>
                </div>
              </div>
            </section>
          </div>
        </mat-tab>

        <!-- Tokens Tab -->
        <mat-tab label="Tokens">
          <div class="variant-selector-doc__tab-content">
            <ax-component-tokens
              [tokens]="variantSelectorTokens"
            ></ax-component-tokens>
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="variant-selector-doc__tab-content">
            <section class="variant-selector-doc__section">
              <h2>Do's and Don'ts</h2>

              <div class="variant-selector-doc__guidelines">
                <div
                  class="variant-selector-doc__guideline variant-selector-doc__guideline--do"
                >
                  <h4><mat-icon>check_circle</mat-icon> Do</h4>
                  <ul>
                    <li>
                      Use grid layout for product browsing with images and
                      visual appeal
                    </li>
                    <li>
                      Use list layout when detailed comparison of variants is
                      needed
                    </li>
                    <li>
                      Use compact layout in space-constrained admin interfaces
                    </li>
                    <li>
                      Show stock availability to prevent orders for out-of-stock
                      items
                    </li>
                    <li>
                      Enable attribute filters for products with many variant
                      combinations
                    </li>
                    <li>
                      Provide search functionality for products with 10+
                      variants
                    </li>
                    <li>
                      Use multi-select mode for bulk ordering or inventory
                      management
                    </li>
                  </ul>
                </div>

                <div
                  class="variant-selector-doc__guideline variant-selector-doc__guideline--dont"
                >
                  <h4><mat-icon>cancel</mat-icon> Don't</h4>
                  <ul>
                    <li>
                      Don't hide stock information for customer-facing
                      e-commerce applications
                    </li>
                    <li>
                      Don't use grid layout without images (use list or compact
                      instead)
                    </li>
                    <li>
                      Don't overload with too many attributes (3-5 is optimal)
                    </li>
                    <li>
                      Don't allow selection of unavailable variants without
                      clear indication
                    </li>
                    <li>
                      Don't mix layout modes on the same page (maintain
                      consistency)
                    </li>
                    <li>
                      Don't forget to handle empty states when filters return no
                      results
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section class="variant-selector-doc__section">
              <h2>Accessibility</h2>
              <ul class="variant-selector-doc__a11y-list">
                <li>
                  Variant cards are keyboard accessible with proper focus
                  management
                </li>
                <li>
                  Stock badges include ARIA labels for screen reader support
                </li>
                <li>
                  Attribute filters use semantic HTML with proper button roles
                </li>
                <li>
                  Search input includes clear aria-label and placeholder text
                </li>
                <li>
                  Quick view modal is properly announced to assistive
                  technologies
                </li>
                <li>
                  Disabled variants are marked with aria-disabled and visual
                  indicators
                </li>
                <li>
                  Color-coded stock indicators meet WCAG 2.1 AA contrast ratios
                </li>
              </ul>
            </section>

            <section class="variant-selector-doc__section">
              <h2>Best Practices</h2>
              <ul class="variant-selector-doc__best-practices">
                <li>
                  <strong>Layout Selection:</strong> Grid for visual browsing,
                  list for detailed comparison, compact for admin dashboards
                </li>
                <li>
                  <strong>Attribute Organization:</strong> Display most
                  important attributes first (size, color, then style)
                </li>
                <li>
                  <strong>Stock Thresholds:</strong> Set low stock warning at
                  reorder point (typically 10-20% of max capacity)
                </li>
                <li>
                  <strong>Image Quality:</strong> Use consistent aspect ratios
                  and provide fallback for missing images
                </li>
                <li>
                  <strong>Search Implementation:</strong> Support search by SKU,
                  name, and attribute values for flexibility
                </li>
                <li>
                  <strong>Multi-Select Mode:</strong> Always show quantity
                  inputs and selection count in multi-select mode
                </li>
                <li>
                  <strong>Performance:</strong> Use virtual scrolling for
                  products with 100+ variants
                </li>
                <li>
                  <strong>Mobile Responsiveness:</strong> Grid automatically
                  adapts to single column on mobile devices
                </li>
              </ul>
            </section>

            <section class="variant-selector-doc__section">
              <h2>Common Use Cases</h2>
              <div class="variant-selector-doc__use-cases">
                <div class="use-case">
                  <h4>E-commerce Product Pages</h4>
                  <p>
                    Grid layout with images, prices, and quick view for online
                    shopping
                  </p>
                  <code
                    >layout="grid" showImages="true"
                    enableQuickView="true"</code
                  >
                </div>
                <div class="use-case">
                  <h4>Bulk Order Forms</h4>
                  <p>
                    List layout with multi-select and quantity inputs for B2B
                    ordering
                  </p>
                  <code>layout="list" allowMultiple="true"</code>
                </div>
                <div class="use-case">
                  <h4>Inventory Management</h4>
                  <p>
                    Compact layout with stock focus for warehouse operations
                  </p>
                  <code
                    >layout="compact" showStock="true" showImages="false"</code
                  >
                </div>
                <div class="use-case">
                  <h4>Mobile Shopping</h4>
                  <p>Grid layout with attribute filters for mobile commerce</p>
                  <code>layout="grid" showAttributeFilters="true"</code>
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
      .variant-selector-doc {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--ax-spacing-xl, 1.5rem);
      }

      .variant-selector-doc__tabs {
        margin-top: var(--ax-spacing-xl, 1.5rem);
      }

      .variant-selector-doc__tab-content {
        padding: var(--ax-spacing-xl, 1.5rem) 0;
      }

      .variant-selector-doc__section {
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

      .variant-selector-doc__demo {
        width: 100%;

        h4 {
          font-size: var(--ax-text-sm, 0.875rem);
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0 0 var(--ax-spacing-sm, 0.5rem) 0;
        }
      }

      /* E-commerce Example */
      .variant-selector-doc__ecommerce-example {
        .product-header {
          margin-bottom: var(--ax-spacing-lg, 1rem);

          h3 {
            font-size: var(--ax-text-lg, 1.125rem);
            font-weight: 600;
            color: var(--ax-text-heading);
            margin: 0 0 var(--ax-spacing-xs, 0.25rem) 0;
          }

          .product-description {
            font-size: var(--ax-text-sm, 0.875rem);
            color: var(--ax-text-secondary);
            margin: 0;
          }
        }
      }

      /* API Table */
      .variant-selector-doc__api-table {
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

      /* Layout Modes */
      .variant-selector-doc__layout-modes {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--ax-spacing-md, 0.75rem);
        margin-top: var(--ax-spacing-md, 0.75rem);
      }

      .layout-mode {
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
      .variant-selector-doc__guidelines {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--ax-spacing-lg, 1rem);
      }

      .variant-selector-doc__guideline {
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

      .variant-selector-doc__guideline--do {
        background: var(--ax-success-faint);

        h4 {
          color: var(--ax-success-emphasis);
        }
        li {
          color: var(--ax-success-emphasis);
        }
      }

      .variant-selector-doc__guideline--dont {
        background: var(--ax-error-faint);

        h4 {
          color: var(--ax-error-emphasis);
        }
        li {
          color: var(--ax-error-emphasis);
        }
      }

      .variant-selector-doc__a11y-list,
      .variant-selector-doc__best-practices {
        margin: 0;
        padding-left: var(--ax-spacing-lg, 1rem);

        li {
          font-size: var(--ax-text-sm, 0.875rem);
          color: var(--ax-text-secondary);
          margin-bottom: var(--ax-spacing-sm, 0.5rem);
        }
      }

      /* Use Cases */
      .variant-selector-doc__use-cases {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--ax-spacing-md, 0.75rem);
        margin-top: var(--ax-spacing-md, 0.75rem);
      }

      .use-case {
        padding: var(--ax-spacing-md, 0.75rem);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-md, 0.5rem);
        background: var(--ax-background-default);

        h4 {
          font-size: var(--ax-text-sm, 0.875rem);
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0 0 var(--ax-spacing-xs, 0.25rem) 0;
        }

        p {
          font-size: var(--ax-text-sm, 0.875rem);
          color: var(--ax-text-secondary);
          margin: 0 0 var(--ax-spacing-xs, 0.25rem) 0;
        }

        code {
          font-family: var(--ax-font-mono);
          font-size: var(--ax-text-xs, 0.75rem);
          background: var(--ax-background-subtle);
          padding: 2px 6px;
          border-radius: var(--ax-radius-sm, 0.25rem);
          display: block;
          margin-top: var(--ax-spacing-xs, 0.25rem);
        }
      }
    `,
  ],
})
export class VariantSelectorDocComponent {
  // Sample data for demonstrations
  sampleVariants = [
    {
      sku: 'PROD-001-S-BLK',
      name: 'Small - Black',
      attributes: { size: 'Small', color: 'Black' },
      imageUrl:
        'https://via.placeholder.com/150/000000/FFFFFF?text=Small+Black',
      price: 29.99,
      stockLevel: 45,
      available: true,
    },
    {
      sku: 'PROD-001-M-BLK',
      name: 'Medium - Black',
      attributes: { size: 'Medium', color: 'Black' },
      imageUrl:
        'https://via.placeholder.com/150/000000/FFFFFF?text=Medium+Black',
      price: 29.99,
      stockLevel: 32,
      available: true,
    },
    {
      sku: 'PROD-001-L-BLK',
      name: 'Large - Black',
      attributes: { size: 'Large', color: 'Black' },
      imageUrl:
        'https://via.placeholder.com/150/000000/FFFFFF?text=Large+Black',
      price: 31.99,
      stockLevel: 8,
      available: true,
    },
    {
      sku: 'PROD-001-S-BLU',
      name: 'Small - Blue',
      attributes: { size: 'Small', color: 'Blue' },
      imageUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Small+Blue',
      price: 29.99,
      stockLevel: 0,
      available: false,
    },
  ];

  multiDimensionalVariants = [
    {
      sku: 'TSH-001-S-RED-CAS',
      name: 'Small - Red - Casual',
      attributes: { size: 'Small', color: 'Red', style: 'Casual' },
      imageUrl:
        'https://via.placeholder.com/150/FF0000/FFFFFF?text=S+Red+Casual',
      price: 24.99,
      stockLevel: 15,
      available: true,
    },
    {
      sku: 'TSH-001-M-RED-CAS',
      name: 'Medium - Red - Casual',
      attributes: { size: 'Medium', color: 'Red', style: 'Casual' },
      imageUrl:
        'https://via.placeholder.com/150/FF0000/FFFFFF?text=M+Red+Casual',
      price: 24.99,
      stockLevel: 22,
      available: true,
    },
    {
      sku: 'TSH-001-M-BLU-FOR',
      name: 'Medium - Blue - Formal',
      attributes: { size: 'Medium', color: 'Blue', style: 'Formal' },
      imageUrl:
        'https://via.placeholder.com/150/0000FF/FFFFFF?text=M+Blue+Formal',
      price: 34.99,
      stockLevel: 12,
      available: true,
    },
  ];

  stockVariants = [
    {
      sku: 'STK-001-A',
      name: 'Variant A - In Stock',
      attributes: { type: 'A' },
      price: 19.99,
      stockLevel: 50,
      available: true,
    },
    {
      sku: 'STK-001-B',
      name: 'Variant B - Low Stock',
      attributes: { type: 'B' },
      price: 19.99,
      stockLevel: 5,
      available: true,
    },
    {
      sku: 'STK-001-C',
      name: 'Variant C - Out of Stock',
      attributes: { type: 'C' },
      price: 19.99,
      stockLevel: 0,
      available: false,
    },
  ];

  ecommerceVariants = [
    {
      sku: 'TSH-PREM-S-WHT',
      name: 'Small - White',
      attributes: { size: 'Small', color: 'White' },
      imageUrl: 'https://via.placeholder.com/150/FFFFFF/000000?text=S+White',
      price: 39.99,
      stockLevel: 25,
      available: true,
    },
    {
      sku: 'TSH-PREM-M-WHT',
      name: 'Medium - White',
      attributes: { size: 'Medium', color: 'White' },
      imageUrl: 'https://via.placeholder.com/150/FFFFFF/000000?text=M+White',
      price: 39.99,
      stockLevel: 18,
      available: true,
    },
    {
      sku: 'TSH-PREM-L-NAV',
      name: 'Large - Navy',
      attributes: { size: 'Large', color: 'Navy' },
      imageUrl: 'https://via.placeholder.com/150/000080/FFFFFF?text=L+Navy',
      price: 42.99,
      stockLevel: 12,
      available: true,
    },
  ];

  bulkVariants = this.sampleVariants;
  inventoryVariants = this.stockVariants;
  filterDemoVariants = this.multiDimensionalVariants;

  // Code examples
  basicUsageCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-variant-selector
  [productId]="'PROD-001'"
  [variants]="productVariants"
  [layout]="'grid'"
  (variantSelect)="handleVariantSelect($event)"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxVariantSelectorComponent, ProductVariant, VariantSelection } from '@aegisx/ui';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [AxVariantSelectorComponent],
  template: \`
    <ax-variant-selector
      [productId]="productId"
      [variants]="variants"
      (variantSelect)="handleVariantSelect($event)"
    />
  \`,
})
export class ProductPageComponent {
  productId = 'PROD-001';
  variants: ProductVariant[] = [
    {
      sku: 'PROD-001-S-BLK',
      name: 'Small - Black',
      attributes: { size: 'Small', color: 'Black' },
      imageUrl: '/assets/variants/small-black.jpg',
      price: 29.99,
      stockLevel: 45,
      available: true,
    },
    // ... more variants
  ];

  handleVariantSelect(selection: VariantSelection): void {
    console.log('Selected variants:', selection.variants);
    // Add to cart or process selection
  }
}`,
    },
  ];

  layoutModesCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Grid Layout (default) -->
<ax-variant-selector
  [productId]="'PROD-001'"
  [variants]="variants"
  [layout]="'grid'"
  [showImages]="true"
/>

<!-- List Layout -->
<ax-variant-selector
  [productId]="'PROD-001'"
  [variants]="variants"
  [layout]="'list'"
/>

<!-- Compact Layout -->
<ax-variant-selector
  [productId]="'PROD-001'"
  [variants]="variants"
  [layout]="'compact'"
  [showImages]="false"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-variant-display',
  template: \`
    <mat-button-toggle-group [(value)]="layout">
      <mat-button-toggle value="grid">Grid</mat-button-toggle>
      <mat-button-toggle value="list">List</mat-button-toggle>
      <mat-button-toggle value="compact">Compact</mat-button-toggle>
    </mat-button-toggle-group>

    <ax-variant-selector
      [productId]="'PROD-001'"
      [variants]="variants"
      [(layout)]="layout"
    />
  \`,
})
export class VariantDisplayComponent {
  layout = signal<'grid' | 'list' | 'compact'>('grid');
  // Two-way binding with layout input
}`,
    },
  ];

  attributesCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-variant-selector
  [productId]="'PROD-002'"
  [variants]="variants"
  [attributes]="['size', 'color', 'style']"
  [showAttributeFilters]="true"
  (attributeFilter)="handleAttributeFilter($event)"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AttributeFilterEvent } from '@aegisx/ui';

@Component({
  selector: 'app-variant-filter',
  template: \`
    <ax-variant-selector
      [productId]="productId"
      [variants]="variants"
      [attributes]="attributes"
      [showAttributeFilters]="true"
      (attributeFilter)="handleAttributeFilter($event)"
    />
  \`,
})
export class VariantFilterComponent {
  productId = 'PROD-002';
  attributes = ['size', 'color', 'style'];

  variants = [
    {
      sku: 'TSH-001-S-RED-CAS',
      name: 'Small - Red - Casual',
      attributes: {
        size: 'Small',
        color: 'Red',
        style: 'Casual'
      },
      price: 24.99,
      stockLevel: 15,
      available: true,
    },
    // ... more variants
  ];

  handleAttributeFilter(event: AttributeFilterEvent): void {
    console.log(\`Filter applied: \${event.attribute} = \${event.value}\`);
    // Track analytics or update UI
  }
}`,
    },
  ];

  stockAvailabilityCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-variant-selector
  [productId]="'PROD-003'"
  [variants]="variants"
  [showStock]="true"
  [lowStockThreshold]="10"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-stock-aware-variants',
  template: \`
    <ax-variant-selector
      [productId]="productId"
      [variants]="variants"
      [showStock]="true"
      [lowStockThreshold]="lowStockThreshold"
    />
  \`,
})
export class StockAwareVariantsComponent {
  productId = 'PROD-003';
  lowStockThreshold = 10; // Show warning when stock ≤ 10

  variants = [
    {
      sku: 'VAR-001',
      name: 'In Stock',
      attributes: { type: 'A' },
      price: 19.99,
      stockLevel: 50, // Green badge
      available: true,
    },
    {
      sku: 'VAR-002',
      name: 'Low Stock',
      attributes: { type: 'B' },
      price: 19.99,
      stockLevel: 5, // Yellow badge (≤ 10)
      available: true,
    },
    {
      sku: 'VAR-003',
      name: 'Out of Stock',
      attributes: { type: 'C' },
      price: 19.99,
      stockLevel: 0, // Red badge
      available: false,
    },
  ];
}`,
    },
  ];

  searchCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-variant-selector
  [productId]="'PROD-004'"
  [variants]="variants"
  [enableSearch]="true"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `// Search functionality is built-in
// Searches by: SKU, name, and attribute values
// No additional configuration needed

<ax-variant-selector
  [productId]="productId"
  [variants]="variants"
  [enableSearch]="true"
/>

// User can search for:
// - SKU: "PROD-001-S-BLK"
// - Name: "Small Black"
// - Attributes: "Small", "Black", etc.`,
    },
  ];

  variantSelectorTokens: ComponentToken[] = [
    {
      category: 'Colors',
      cssVar: '--ax-success-default',
      usage: 'In stock badge color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-warning-default',
      usage: 'Low stock badge color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-error-default',
      usage: 'Out of stock badge color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-primary-default',
      usage: 'Selected variant highlight',
    },
    {
      category: 'Colors',
      cssVar: '--ax-background-default',
      usage: 'Variant card background',
    },
    {
      category: 'Colors',
      cssVar: '--ax-background-subtle',
      usage: 'Variant card hover background',
    },
    {
      category: 'Colors',
      cssVar: '--ax-border-default',
      usage: 'Variant card border',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-heading',
      usage: 'Variant name text color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-secondary',
      usage: 'Attribute and SKU text color',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-sm',
      usage: 'Card padding (compact)',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-md',
      usage: 'Card padding (grid/list)',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-lg',
      usage: 'Gap between variants',
    },
    {
      category: 'Borders',
      cssVar: '--ax-radius-md',
      usage: 'Variant card corner rounding',
    },
    {
      category: 'Borders',
      cssVar: '--ax-radius-full',
      usage: 'Badge corner rounding',
    },
  ];

  handleVariantSelect(selection: any): void {
    console.log('Variant selected:', selection);
  }

  handleAttributeFilter(event: any): void {
    console.log('Attribute filter:', event);
  }
}
