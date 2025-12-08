import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { AxDrawerComponent } from '@aegisx/ui';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../../../components/docs';
import { ComponentToken, CodeTab } from '../../../../../../types/docs.types';

@Component({
  selector: 'ax-drawer-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    AxDrawerComponent,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="drawer-doc">
      <ax-doc-header
        title="Drawer / Sheet"
        icon="web_asset"
        description="A sliding panel that appears from the edge of the screen. Useful for navigation, filters, forms, and detail views."
        [breadcrumbs]="[
          { label: 'Layout', link: '/docs/components/aegisx/layout/drawer' },
          { label: 'Drawer' },
        ]"
        status="stable"
        version="1.0.0"
        importStatement="import { AxDrawerComponent } from '&#64;aegisx/ui';"
      ></ax-doc-header>

      <mat-tab-group class="drawer-doc__tabs" animationDuration="150ms">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="drawer-doc__tab-content">
            <section class="drawer-doc__section">
              <h2>Basic Usage</h2>
              <p>
                The Drawer component provides a sliding panel that can appear
                from any edge of the screen. Perfect for navigation menus,
                filters, forms, and detail views.
              </p>

              <ax-live-preview variant="bordered">
                <button
                  mat-flat-button
                  color="primary"
                  (click)="openBasicDrawer()"
                >
                  <mat-icon>menu_open</mat-icon>
                  Open Drawer
                </button>
              </ax-live-preview>

              <ax-code-tabs [tabs]="basicUsageCode"></ax-code-tabs>
            </section>

            <section class="drawer-doc__section">
              <h2>Position Variants</h2>
              <p>
                Drawers can slide in from any edge of the screen: left, right,
                top, or bottom.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="row"
                gap="var(--ax-spacing-md)"
              >
                <button mat-stroked-button (click)="openDrawer('left')">
                  <mat-icon>chevron_right</mat-icon>
                  Left
                </button>
                <button
                  mat-flat-button
                  color="primary"
                  (click)="openDrawer('right')"
                >
                  <mat-icon>chevron_left</mat-icon>
                  Right
                </button>
                <button mat-stroked-button (click)="openDrawer('top')">
                  <mat-icon>expand_more</mat-icon>
                  Top
                </button>
                <button mat-stroked-button (click)="openDrawer('bottom')">
                  <mat-icon>expand_less</mat-icon>
                  Bottom (Sheet)
                </button>
              </ax-live-preview>

              <ax-code-tabs [tabs]="positionCode"></ax-code-tabs>
            </section>

            <section class="drawer-doc__section">
              <h2>Size Variants</h2>
              <p>Choose from predefined sizes: sm, md, lg, xl, or full.</p>

              <ax-live-preview
                variant="bordered"
                direction="row"
                gap="var(--ax-spacing-md)"
              >
                <button mat-stroked-button (click)="openDrawerSize('sm')">
                  Small (320px)
                </button>
                <button mat-stroked-button (click)="openDrawerSize('md')">
                  Medium (400px)
                </button>
                <button mat-stroked-button (click)="openDrawerSize('lg')">
                  Large (500px)
                </button>
                <button mat-stroked-button (click)="openDrawerSize('xl')">
                  X-Large (640px)
                </button>
              </ax-live-preview>

              <ax-code-tabs [tabs]="sizeCode"></ax-code-tabs>
            </section>

            <section class="drawer-doc__section">
              <h2>With Header Options</h2>
              <p>
                Configure drawer header with title, subtitle, and icon. You can
                also hide the header or close button.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="row"
                gap="var(--ax-spacing-md)"
              >
                <button mat-stroked-button (click)="openHeaderDrawer('full')">
                  Full Header
                </button>
                <button
                  mat-stroked-button
                  (click)="openHeaderDrawer('minimal')"
                >
                  Minimal Header
                </button>
                <button mat-stroked-button (click)="openHeaderDrawer('none')">
                  No Header
                </button>
              </ax-live-preview>

              <ax-code-tabs [tabs]="headerCode"></ax-code-tabs>
            </section>

            <section class="drawer-doc__section">
              <h2>With Footer</h2>
              <p>Use the footer template for action buttons.</p>

              <ax-live-preview variant="bordered">
                <button
                  mat-flat-button
                  color="primary"
                  (click)="openFormDrawer()"
                >
                  <mat-icon>edit</mat-icon>
                  Open Form Drawer
                </button>
              </ax-live-preview>

              <ax-code-tabs [tabs]="footerCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="drawer-doc__tab-content">
            <section class="drawer-doc__section">
              <h2>Navigation Drawer</h2>
              <p>Use a left drawer for navigation menus.</p>
              <ax-live-preview variant="bordered">
                <button mat-stroked-button (click)="openNavDrawer()">
                  <mat-icon>menu</mat-icon>
                  Open Navigation
                </button>
              </ax-live-preview>
              <ax-code-tabs [tabs]="navExampleCode"></ax-code-tabs>
            </section>

            <section class="drawer-doc__section">
              <h2>Filter Panel</h2>
              <p>Use a right drawer for filters and settings.</p>
              <ax-live-preview variant="bordered">
                <button mat-stroked-button (click)="openFilterDrawer()">
                  <mat-icon>filter_list</mat-icon>
                  Open Filters
                </button>
              </ax-live-preview>
              <ax-code-tabs [tabs]="filterExampleCode"></ax-code-tabs>
            </section>

            <section class="drawer-doc__section">
              <h2>Bottom Sheet</h2>
              <p>Use a bottom drawer for mobile-friendly action sheets.</p>
              <ax-live-preview variant="bordered">
                <button mat-stroked-button (click)="openBottomSheet()">
                  <mat-icon>expand_less</mat-icon>
                  Open Bottom Sheet
                </button>
              </ax-live-preview>
              <ax-code-tabs [tabs]="bottomSheetCode"></ax-code-tabs>
            </section>

            <section class="drawer-doc__section">
              <h2>Detail View</h2>
              <p>Use a large drawer for viewing item details.</p>
              <ax-live-preview variant="bordered">
                <button mat-stroked-button (click)="openDetailDrawer()">
                  <mat-icon>info</mat-icon>
                  View Details
                </button>
              </ax-live-preview>
              <ax-code-tabs [tabs]="detailExampleCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="drawer-doc__tab-content">
            <section class="drawer-doc__section">
              <h2>Properties</h2>
              <div class="drawer-doc__api-table">
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
                      <td><code>open</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Whether the drawer is open (two-way bindable)</td>
                    </tr>
                    <tr>
                      <td><code>position</code></td>
                      <td>
                        <code>'left' | 'right' | 'top' | 'bottom'</code>
                      </td>
                      <td><code>'right'</code></td>
                      <td>Position of the drawer</td>
                    </tr>
                    <tr>
                      <td><code>size</code></td>
                      <td><code>'sm' | 'md' | 'lg' | 'xl' | 'full'</code></td>
                      <td><code>'md'</code></td>
                      <td>Size of the drawer</td>
                    </tr>
                    <tr>
                      <td><code>title</code></td>
                      <td><code>string</code></td>
                      <td><code>undefined</code></td>
                      <td>Drawer title</td>
                    </tr>
                    <tr>
                      <td><code>subtitle</code></td>
                      <td><code>string</code></td>
                      <td><code>undefined</code></td>
                      <td>Drawer subtitle</td>
                    </tr>
                    <tr>
                      <td><code>icon</code></td>
                      <td><code>string</code></td>
                      <td><code>undefined</code></td>
                      <td>Material icon name for header</td>
                    </tr>
                    <tr>
                      <td><code>showHeader</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Show header section</td>
                    </tr>
                    <tr>
                      <td><code>showCloseButton</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Show close button in header</td>
                    </tr>
                    <tr>
                      <td><code>hasBackdrop</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Show backdrop overlay</td>
                    </tr>
                    <tr>
                      <td><code>closeOnBackdropClick</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Close when backdrop is clicked</td>
                    </tr>
                    <tr>
                      <td><code>closeOnEscape</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Close on Escape key press</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="drawer-doc__section">
              <h2>Outputs</h2>
              <div class="drawer-doc__api-table">
                <table>
                  <thead>
                    <tr>
                      <th>Output</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>openChange</code></td>
                      <td><code>EventEmitter&lt;boolean&gt;</code></td>
                      <td>Emits when open state changes</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="drawer-doc__section">
              <h2>Content Projection Slots</h2>
              <div class="drawer-doc__api-table">
                <table>
                  <thead>
                    <tr>
                      <th>Slot</th>
                      <th>Selector</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>default</code></td>
                      <td><code>ng-content</code></td>
                      <td>Main content area of the drawer</td>
                    </tr>
                    <tr>
                      <td><code>footer</code></td>
                      <td><code>#footer</code></td>
                      <td>Footer template with action buttons</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="drawer-doc__section">
              <h2>Size Reference</h2>
              <div class="drawer-doc__api-table">
                <table>
                  <thead>
                    <tr>
                      <th>Size</th>
                      <th>Width (Left/Right)</th>
                      <th>Height (Top/Bottom)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>sm</code></td>
                      <td>320px</td>
                      <td>200px</td>
                    </tr>
                    <tr>
                      <td><code>md</code></td>
                      <td>400px</td>
                      <td>320px</td>
                    </tr>
                    <tr>
                      <td><code>lg</code></td>
                      <td>500px</td>
                      <td>480px</td>
                    </tr>
                    <tr>
                      <td><code>xl</code></td>
                      <td>640px</td>
                      <td>640px</td>
                    </tr>
                    <tr>
                      <td><code>full</code></td>
                      <td>100%</td>
                      <td>100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </mat-tab>

        <!-- Tokens Tab -->
        <mat-tab label="Tokens">
          <div class="drawer-doc__tab-content">
            <ax-component-tokens [tokens]="designTokens"></ax-component-tokens>
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="drawer-doc__tab-content">
            <section class="drawer-doc__section">
              <h2>Do's and Don'ts</h2>

              <div class="drawer-doc__guidelines">
                <div class="drawer-doc__guideline drawer-doc__guideline--do">
                  <h4><mat-icon>check_circle</mat-icon> Do</h4>
                  <ul>
                    <li>Use right drawer for forms and detail views</li>
                    <li>Use left drawer for navigation menus</li>
                    <li>Use bottom drawer for mobile action sheets</li>
                    <li>Provide clear close mechanism (X button, backdrop)</li>
                    <li>Use appropriate size for content amount</li>
                    <li>Add footer with action buttons for forms</li>
                  </ul>
                </div>

                <div class="drawer-doc__guideline drawer-doc__guideline--dont">
                  <h4><mat-icon>cancel</mat-icon> Don't</h4>
                  <ul>
                    <li>Open multiple drawers at the same time</li>
                    <li>Use full-size drawer for simple content</li>
                    <li>Disable all close mechanisms</li>
                    <li>Put critical actions only in drawer</li>
                    <li>Use drawer for main content</li>
                    <li>Nest drawers inside other drawers</li>
                  </ul>
                </div>
              </div>
            </section>

            <section class="drawer-doc__section">
              <h2>Position Guidelines</h2>
              <div class="drawer-doc__position-guide">
                <div class="drawer-doc__position-item">
                  <mat-icon>chevron_right</mat-icon>
                  <div>
                    <strong>Left</strong>
                    <p>Navigation menus, sidebar content</p>
                  </div>
                </div>
                <div class="drawer-doc__position-item">
                  <mat-icon>chevron_left</mat-icon>
                  <div>
                    <strong>Right (Default)</strong>
                    <p>Forms, detail views, settings panels</p>
                  </div>
                </div>
                <div class="drawer-doc__position-item">
                  <mat-icon>expand_more</mat-icon>
                  <div>
                    <strong>Top</strong>
                    <p>Search bars, notifications</p>
                  </div>
                </div>
                <div class="drawer-doc__position-item">
                  <mat-icon>expand_less</mat-icon>
                  <div>
                    <strong>Bottom</strong>
                    <p>Mobile sheets, action menus</p>
                  </div>
                </div>
              </div>
            </section>

            <section class="drawer-doc__section">
              <h2>Accessibility</h2>
              <ul class="drawer-doc__a11y-list">
                <li>Drawer traps focus when open</li>
                <li>Escape key closes the drawer by default</li>
                <li>Close button has appropriate ARIA label</li>
                <li>Backdrop is keyboard accessible</li>
                <li>Focus returns to trigger element on close</li>
              </ul>
            </section>

            <section class="drawer-doc__section">
              <h2>Responsive Behavior</h2>
              <p>
                On mobile screens (width &lt; 640px), left and right drawers
                automatically expand to full width for better usability.
              </p>
            </section>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>

    <!-- Demo Drawers -->
    <ax-drawer
      [(open)]="isDrawerOpen"
      [position]="drawerPosition"
      [size]="drawerSize"
      [title]="drawerTitle"
      [subtitle]="drawerSubtitle"
      [icon]="drawerIcon"
      [showHeader]="showHeader"
      [showCloseButton]="showCloseButton"
    >
      <p>{{ drawerContent }}</p>
      <p>Click outside or press Escape to close.</p>
    </ax-drawer>

    <!-- Form Drawer -->
    <ax-drawer
      [(open)]="isFormDrawerOpen"
      position="right"
      size="md"
      title="Edit Profile"
      subtitle="Update your personal information"
      icon="person"
    >
      <ng-template #footer>
        <button mat-stroked-button (click)="isFormDrawerOpen = false">
          Cancel
        </button>
        <button
          mat-flat-button
          color="primary"
          (click)="isFormDrawerOpen = false"
        >
          Save Changes
        </button>
      </ng-template>

      <form class="drawer-form">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput placeholder="Enter your name" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput type="email" placeholder="Enter your email" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Bio</mat-label>
          <textarea
            matInput
            rows="4"
            placeholder="Tell us about yourself"
          ></textarea>
        </mat-form-field>
      </form>
    </ax-drawer>

    <!-- Navigation Drawer -->
    <ax-drawer
      [(open)]="isNavDrawerOpen"
      position="left"
      size="sm"
      title="Navigation"
      icon="menu"
    >
      <mat-nav-list>
        <a mat-list-item (click)="isNavDrawerOpen = false">
          <mat-icon matListItemIcon>home</mat-icon>
          <span matListItemTitle>Home</span>
        </a>
        <a mat-list-item (click)="isNavDrawerOpen = false">
          <mat-icon matListItemIcon>dashboard</mat-icon>
          <span matListItemTitle>Dashboard</span>
        </a>
        <a mat-list-item (click)="isNavDrawerOpen = false">
          <mat-icon matListItemIcon>analytics</mat-icon>
          <span matListItemTitle>Analytics</span>
        </a>
        <a mat-list-item (click)="isNavDrawerOpen = false">
          <mat-icon matListItemIcon>settings</mat-icon>
          <span matListItemTitle>Settings</span>
        </a>
      </mat-nav-list>
    </ax-drawer>

    <!-- Filter Drawer -->
    <ax-drawer
      [(open)]="isFilterDrawerOpen"
      position="right"
      size="sm"
      title="Filters"
      subtitle="Refine your search"
      icon="filter_list"
    >
      <ng-template #footer>
        <button mat-stroked-button (click)="isFilterDrawerOpen = false">
          Reset
        </button>
        <button
          mat-flat-button
          color="primary"
          (click)="isFilterDrawerOpen = false"
        >
          Apply Filters
        </button>
      </ng-template>

      <div class="filter-content">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Category</mat-label>
          <input matInput placeholder="All categories" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Price Range</mat-label>
          <input matInput placeholder="$0 - $1000" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Brand</mat-label>
          <input matInput placeholder="All brands" />
        </mat-form-field>
      </div>
    </ax-drawer>

    <!-- Bottom Sheet -->
    <ax-drawer
      [(open)]="isBottomSheetOpen"
      position="bottom"
      size="sm"
      title="Choose an action"
    >
      <mat-nav-list>
        <a mat-list-item (click)="isBottomSheetOpen = false">
          <mat-icon matListItemIcon>share</mat-icon>
          <span matListItemTitle>Share</span>
        </a>
        <a mat-list-item (click)="isBottomSheetOpen = false">
          <mat-icon matListItemIcon>link</mat-icon>
          <span matListItemTitle>Copy Link</span>
        </a>
        <a mat-list-item (click)="isBottomSheetOpen = false">
          <mat-icon matListItemIcon>edit</mat-icon>
          <span matListItemTitle>Edit</span>
        </a>
        <a mat-list-item (click)="isBottomSheetOpen = false">
          <mat-icon matListItemIcon>delete</mat-icon>
          <span matListItemTitle>Delete</span>
        </a>
      </mat-nav-list>
    </ax-drawer>

    <!-- Detail Drawer -->
    <ax-drawer
      [(open)]="isDetailDrawerOpen"
      position="right"
      size="lg"
      title="Product Details"
      subtitle="SKU: PRD-12345"
      icon="inventory_2"
    >
      <div class="detail-content">
        <div class="detail-section">
          <h4>Description</h4>
          <p>
            High-quality product with premium materials. Designed for everyday
            use with durability in mind.
          </p>
        </div>
        <div class="detail-section">
          <h4>Specifications</h4>
          <div class="detail-specs">
            <div class="spec-item">
              <span class="spec-label">Weight</span>
              <span class="spec-value">1.5 kg</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Dimensions</span>
              <span class="spec-value">30 x 20 x 10 cm</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Color</span>
              <span class="spec-value">Midnight Blue</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Material</span>
              <span class="spec-value">Premium Aluminum</span>
            </div>
          </div>
        </div>
        <div class="detail-section">
          <h4>Price</h4>
          <p class="detail-price">$299.00</p>
        </div>
      </div>
    </ax-drawer>
  `,
  styles: [
    `
      .drawer-doc {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--ax-spacing-xl, 1.5rem);
      }

      .drawer-doc__tabs {
        margin-top: var(--ax-spacing-xl, 1.5rem);
      }

      .drawer-doc__tab-content {
        padding: var(--ax-spacing-xl, 1.5rem) 0;
      }

      .drawer-doc__section {
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
          line-height: 1.6;
        }
      }

      /* API Table */
      .drawer-doc__api-table {
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
      .drawer-doc__guidelines {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--ax-spacing-lg, 1rem);
      }

      .drawer-doc__guideline {
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

      .drawer-doc__guideline--do {
        background: var(--ax-success-faint);

        h4 {
          color: var(--ax-success-emphasis);
        }
        li {
          color: var(--ax-success-emphasis);
        }
      }

      .drawer-doc__guideline--dont {
        background: var(--ax-error-faint);

        h4 {
          color: var(--ax-error-emphasis);
        }
        li {
          color: var(--ax-error-emphasis);
        }
      }

      /* Position Guide */
      .drawer-doc__position-guide {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--ax-spacing-md, 0.75rem);
      }

      .drawer-doc__position-item {
        display: flex;
        align-items: flex-start;
        gap: var(--ax-spacing-sm, 0.5rem);
        padding: var(--ax-spacing-md, 0.75rem);
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-md, 0.5rem);

        mat-icon {
          color: var(--ax-brand-default);
        }

        strong {
          display: block;
          font-size: var(--ax-text-sm, 0.875rem);
          color: var(--ax-text-heading);
        }

        p {
          margin: var(--ax-spacing-xs, 0.25rem) 0 0 0;
          font-size: var(--ax-text-xs, 0.75rem);
          color: var(--ax-text-secondary);
        }
      }

      .drawer-doc__a11y-list {
        margin: 0;
        padding-left: var(--ax-spacing-lg, 1rem);

        li {
          font-size: var(--ax-text-sm, 0.875rem);
          color: var(--ax-text-secondary);
          margin-bottom: var(--ax-spacing-sm, 0.5rem);
        }
      }

      /* Drawer Content Styles */
      .drawer-form {
        display: flex;
        flex-direction: column;
        gap: var(--ax-spacing-md, 0.75rem);

        mat-form-field {
          width: 100%;
        }
      }

      .filter-content {
        display: flex;
        flex-direction: column;
        gap: var(--ax-spacing-sm, 0.5rem);
      }

      .full-width {
        width: 100%;
      }

      .detail-content {
        display: flex;
        flex-direction: column;
        gap: var(--ax-spacing-lg, 1rem);
      }

      .detail-section {
        h4 {
          font-size: var(--ax-text-sm, 0.875rem);
          font-weight: 600;
          color: var(--ax-text-secondary);
          margin: 0 0 var(--ax-spacing-xs, 0.25rem) 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        p {
          margin: 0;
          font-size: var(--ax-text-sm, 0.875rem);
          color: var(--ax-text-primary);
          line-height: 1.6;
        }
      }

      .detail-specs {
        display: flex;
        flex-direction: column;
        gap: var(--ax-spacing-xs, 0.25rem);
      }

      .spec-item {
        display: flex;
        justify-content: space-between;
        padding: var(--ax-spacing-xs, 0.25rem) 0;
        border-bottom: 1px solid var(--ax-border-muted);
      }

      .spec-label {
        font-size: var(--ax-text-sm, 0.875rem);
        color: var(--ax-text-secondary);
      }

      .spec-value {
        font-size: var(--ax-text-sm, 0.875rem);
        font-weight: 500;
        color: var(--ax-text-primary);
      }

      .detail-price {
        font-size: var(--ax-text-2xl, 1.5rem);
        font-weight: 700;
        color: var(--ax-brand-default);
      }
    `,
  ],
})
export class DrawerDocComponent {
  // Drawer states
  isDrawerOpen = false;
  isFormDrawerOpen = false;
  isNavDrawerOpen = false;
  isFilterDrawerOpen = false;
  isBottomSheetOpen = false;
  isDetailDrawerOpen = false;

  // Drawer config
  drawerPosition: 'left' | 'right' | 'top' | 'bottom' = 'right';
  drawerSize: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md';
  drawerTitle = 'Drawer Title';
  drawerSubtitle = '';
  drawerIcon = '';
  drawerContent = 'This is the drawer content.';
  showHeader = true;
  showCloseButton = true;

  openBasicDrawer(): void {
    this.drawerPosition = 'right';
    this.drawerSize = 'md';
    this.drawerTitle = 'Basic Drawer';
    this.drawerSubtitle = 'A simple example';
    this.drawerIcon = '';
    this.drawerContent =
      'This is a basic drawer. You can put any content here.';
    this.showHeader = true;
    this.showCloseButton = true;
    this.isDrawerOpen = true;
  }

  openDrawer(position: 'left' | 'right' | 'top' | 'bottom'): void {
    this.drawerPosition = position;
    this.drawerSize = position === 'bottom' ? 'sm' : 'md';
    this.drawerTitle =
      position === 'bottom'
        ? 'Bottom Sheet'
        : `${position.charAt(0).toUpperCase() + position.slice(1)} Drawer`;
    this.drawerSubtitle = `Opens from the ${position}`;
    this.drawerIcon = '';
    this.drawerContent = `This drawer slides in from the ${position}.`;
    this.showHeader = true;
    this.showCloseButton = true;
    this.isDrawerOpen = true;
  }

  openDrawerSize(size: 'sm' | 'md' | 'lg' | 'xl'): void {
    this.drawerPosition = 'right';
    this.drawerSize = size;
    this.drawerTitle = `${size.toUpperCase()} Size Drawer`;
    this.drawerSubtitle = `Width: ${size === 'sm' ? '320px' : size === 'md' ? '400px' : size === 'lg' ? '500px' : '640px'}`;
    this.drawerIcon = '';
    this.drawerContent = `This is a ${size} size drawer.`;
    this.showHeader = true;
    this.showCloseButton = true;
    this.isDrawerOpen = true;
  }

  openHeaderDrawer(type: 'full' | 'minimal' | 'none'): void {
    this.drawerPosition = 'right';
    this.drawerSize = 'md';

    if (type === 'full') {
      this.drawerTitle = 'Full Header';
      this.drawerSubtitle = 'With title, subtitle, and icon';
      this.drawerIcon = 'settings';
      this.showHeader = true;
      this.showCloseButton = true;
    } else if (type === 'minimal') {
      this.drawerTitle = 'Minimal Header';
      this.drawerSubtitle = '';
      this.drawerIcon = '';
      this.showHeader = true;
      this.showCloseButton = true;
    } else {
      this.drawerTitle = '';
      this.drawerSubtitle = '';
      this.drawerIcon = '';
      this.showHeader = false;
      this.showCloseButton = false;
    }

    this.drawerContent = `This drawer has ${type} header configuration.`;
    this.isDrawerOpen = true;
  }

  openFormDrawer(): void {
    this.isFormDrawerOpen = true;
  }

  openNavDrawer(): void {
    this.isNavDrawerOpen = true;
  }

  openFilterDrawer(): void {
    this.isFilterDrawerOpen = true;
  }

  openBottomSheet(): void {
    this.isBottomSheetOpen = true;
  }

  openDetailDrawer(): void {
    this.isDetailDrawerOpen = true;
  }

  // Code examples
  readonly basicUsageCode: CodeTab[] = [
    {
      label: 'HTML',
      language: 'html',
      code: `<ax-drawer
  [(open)]="isOpen"
  title="Drawer Title"
  subtitle="Optional subtitle"
>
  <p>Drawer content goes here.</p>
</ax-drawer>

<button mat-flat-button (click)="isOpen = true">
  Open Drawer
</button>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `import { Component } from '@angular/core';
import { AxDrawerComponent } from '@aegisx/ui';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [AxDrawerComponent],
  template: \`...\`,
})
export class MyComponent {
  isOpen = false;
}`,
    },
  ];

  readonly positionCode: CodeTab[] = [
    {
      label: 'HTML',
      language: 'html',
      code: `<!-- Right drawer (default) -->
<ax-drawer [(open)]="isOpen" position="right" title="Settings">
  <p>Drawer content</p>
</ax-drawer>

<!-- Left navigation drawer -->
<ax-drawer [(open)]="navOpen" position="left" title="Menu">
  <nav>...</nav>
</ax-drawer>

<!-- Top drawer -->
<ax-drawer [(open)]="topOpen" position="top" title="Search">
  <input type="search" placeholder="Search..." />
</ax-drawer>

<!-- Bottom sheet -->
<ax-drawer [(open)]="sheetOpen" position="bottom" size="sm" title="Options">
  <p>Sheet content</p>
</ax-drawer>`,
    },
  ];

  readonly sizeCode: CodeTab[] = [
    {
      label: 'HTML',
      language: 'html',
      code: `<!-- Small: 320px width -->
<ax-drawer size="sm" title="Small">...</ax-drawer>

<!-- Medium: 400px width (default) -->
<ax-drawer size="md" title="Medium">...</ax-drawer>

<!-- Large: 500px width -->
<ax-drawer size="lg" title="Large">...</ax-drawer>

<!-- Extra Large: 640px width -->
<ax-drawer size="xl" title="X-Large">...</ax-drawer>

<!-- Full width -->
<ax-drawer size="full" title="Full">...</ax-drawer>`,
    },
  ];

  readonly headerCode: CodeTab[] = [
    {
      label: 'HTML',
      language: 'html',
      code: `<!-- Full header with icon -->
<ax-drawer
  title="Settings"
  subtitle="Configure your preferences"
  icon="settings"
>
  ...
</ax-drawer>

<!-- Minimal header (title only) -->
<ax-drawer title="Quick View">
  ...
</ax-drawer>

<!-- No header -->
<ax-drawer [showHeader]="false">
  <div class="custom-header">...</div>
  ...
</ax-drawer>

<!-- Header without close button -->
<ax-drawer title="Modal Drawer" [showCloseButton]="false">
  ...
</ax-drawer>`,
    },
  ];

  readonly footerCode: CodeTab[] = [
    {
      label: 'HTML',
      language: 'html',
      code: `<ax-drawer
  [(open)]="isOpen"
  title="Edit Profile"
  subtitle="Update your information"
  icon="person"
>
  <!-- Footer template with action buttons -->
  <ng-template #footer>
    <button mat-stroked-button (click)="isOpen = false">
      Cancel
    </button>
    <button mat-flat-button color="primary" (click)="save()">
      Save Changes
    </button>
  </ng-template>

  <!-- Main content -->
  <form>
    <mat-form-field>
      <mat-label>Name</mat-label>
      <input matInput [(ngModel)]="name">
    </mat-form-field>
  </form>
</ax-drawer>`,
    },
  ];

  readonly navExampleCode: CodeTab[] = [
    {
      label: 'HTML',
      language: 'html',
      code: `<ax-drawer
  [(open)]="isNavOpen"
  position="left"
  size="sm"
  title="Navigation"
  icon="menu"
>
  <mat-nav-list>
    <a mat-list-item routerLink="/home">
      <mat-icon matListItemIcon>home</mat-icon>
      <span matListItemTitle>Home</span>
    </a>
    <a mat-list-item routerLink="/dashboard">
      <mat-icon matListItemIcon>dashboard</mat-icon>
      <span matListItemTitle>Dashboard</span>
    </a>
    <a mat-list-item routerLink="/settings">
      <mat-icon matListItemIcon>settings</mat-icon>
      <span matListItemTitle>Settings</span>
    </a>
  </mat-nav-list>
</ax-drawer>`,
    },
  ];

  readonly filterExampleCode: CodeTab[] = [
    {
      label: 'HTML',
      language: 'html',
      code: `<ax-drawer
  [(open)]="isFilterOpen"
  position="right"
  size="sm"
  title="Filters"
  subtitle="Refine your search"
  icon="filter_list"
>
  <ng-template #footer>
    <button mat-stroked-button (click)="resetFilters()">Reset</button>
    <button mat-flat-button color="primary" (click)="applyFilters()">
      Apply Filters
    </button>
  </ng-template>

  <mat-form-field appearance="outline">
    <mat-label>Category</mat-label>
    <mat-select [(ngModel)]="selectedCategory">
      <mat-option value="all">All</mat-option>
      <mat-option value="electronics">Electronics</mat-option>
      <mat-option value="clothing">Clothing</mat-option>
    </mat-select>
  </mat-form-field>
</ax-drawer>`,
    },
  ];

  readonly bottomSheetCode: CodeTab[] = [
    {
      label: 'HTML',
      language: 'html',
      code: `<ax-drawer
  [(open)]="isSheetOpen"
  position="bottom"
  size="sm"
  title="Choose an action"
>
  <mat-nav-list>
    <a mat-list-item (click)="share()">
      <mat-icon matListItemIcon>share</mat-icon>
      <span matListItemTitle>Share</span>
    </a>
    <a mat-list-item (click)="copyLink()">
      <mat-icon matListItemIcon>link</mat-icon>
      <span matListItemTitle>Copy Link</span>
    </a>
    <a mat-list-item (click)="delete()">
      <mat-icon matListItemIcon>delete</mat-icon>
      <span matListItemTitle>Delete</span>
    </a>
  </mat-nav-list>
</ax-drawer>`,
    },
  ];

  readonly detailExampleCode: CodeTab[] = [
    {
      label: 'HTML',
      language: 'html',
      code: `<ax-drawer
  [(open)]="isDetailOpen"
  position="right"
  size="lg"
  title="Product Details"
  subtitle="SKU: PRD-12345"
  icon="inventory_2"
>
  <div class="detail-content">
    <section>
      <h4>Description</h4>
      <p>{{ product.description }}</p>
    </section>

    <section>
      <h4>Specifications</h4>
      <div class="spec-list">
        @for (spec of product.specs; track spec.label) {
          <div class="spec-item">
            <span>{{ spec.label }}</span>
            <span>{{ spec.value }}</span>
          </div>
        }
      </div>
    </section>

    <section>
      <h4>Price</h4>
      <p class="price">{{ product.price | currency }}</p>
    </section>
  </div>
</ax-drawer>`,
    },
  ];

  readonly designTokens: ComponentToken[] = [
    {
      category: 'Colors',
      cssVar: '--ax-background-default',
      usage: 'Drawer panel background',
    },
    {
      category: 'Colors',
      cssVar: '--ax-border-default',
      usage: 'Drawer border',
    },
    {
      category: 'Colors',
      cssVar: '--ax-border-muted',
      usage: 'Header/footer divider',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-heading',
      usage: 'Title text color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-secondary',
      usage: 'Subtitle and icon color',
    },
    {
      category: 'Shadows',
      cssVar: '--ax-shadow-xl',
      usage: 'Drawer elevation shadow',
    },
    {
      category: 'Borders',
      cssVar: '--ax-radius-xl',
      usage: 'Bottom sheet corner radius',
    },
    {
      category: 'Animation',
      cssVar: 'cubic-bezier(0.4, 0, 0.2, 1)',
      usage: 'Slide-in animation easing',
    },
    {
      category: 'Animation',
      cssVar: 'cubic-bezier(0.4, 0, 0.6, 1)',
      usage: 'Slide-out animation easing',
    },
    {
      category: 'Timing',
      cssVar: '300ms',
      usage: 'Slide-in animation duration',
    },
    {
      category: 'Timing',
      cssVar: '200ms',
      usage: 'Slide-out animation duration',
    },
  ];
}
