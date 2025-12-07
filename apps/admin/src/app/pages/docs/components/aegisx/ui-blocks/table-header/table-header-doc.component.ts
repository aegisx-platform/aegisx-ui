import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AxCardComponent, AxKpiCardComponent } from '@aegisx/ui';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
} from '../../../../../../components/docs';

@Component({
  selector: 'ax-table-header-doc',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatMenuModule,
    MatTooltipModule,
    AxCardComponent,
    AxKpiCardComponent,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
  ],
  template: `
    <div class="table-header-doc">
      <ax-doc-header
        title="Table Header Block"
        icon="table_chart"
        description="Reusable table header block for list pages. Includes title, search, filters, and action buttons. Compatible with CRUD Generator."
        [breadcrumbs]="[
          { label: 'UI Blocks', link: '/docs/components/aegisx/ui-blocks' },
          { label: 'Table Header' },
        ]"
        status="stable"
        version="2.0.0"
      ></ax-doc-header>

      <mat-tab-group class="doc__tabs" animationDuration="150ms">
        <!-- Variant 1: HTML Template -->
        <mat-tab label="HTML Template">
          <div class="doc__tab-content">
            <section class="doc__section">
              <h2>Variant 1: Copy-Paste HTML</h2>
              <p>
                Pure HTML + TailwindCSS template that you can copy and
                customize. Best for quick prototyping or when you need full
                control.
              </p>

              <!-- Live Preview -->
              <ax-live-preview variant="bordered">
                <div class="table-header-preview">
                  <!-- Row 1: Title + Actions -->
                  <div class="flex items-center justify-between mb-4">
                    <h2
                      class="text-lg font-semibold text-[var(--ax-text-default)]"
                    >
                      View all products
                    </h2>
                    <div class="flex items-center gap-2">
                      <button
                        mat-stroked-button
                        class="!border-[var(--ax-border-emphasis)]"
                      >
                        View JSON
                      </button>
                      <button
                        mat-stroked-button
                        class="!border-[var(--ax-border-emphasis)]"
                      >
                        <mat-icon class="!text-lg !w-5 !h-5 mr-1"
                          >upload</mat-icon
                        >
                        Export
                      </button>
                    </div>
                  </div>

                  <!-- Row 2: Search + Filter + Config + Add -->
                  <div class="flex items-center gap-3 flex-wrap">
                    <!-- Search -->
                    <div class="flex items-center flex-1 max-w-md">
                      <mat-form-field
                        appearance="outline"
                        class="flex-1 search-field-demo"
                        subscriptSizing="dynamic"
                      >
                        <mat-icon
                          matPrefix
                          class="!text-[var(--ax-text-disabled)]"
                          >search</mat-icon
                        >
                        <input matInput placeholder="Search..." />
                      </mat-form-field>
                      <button
                        mat-flat-button
                        color="primary"
                        class="!rounded-l-none !h-[56px] !min-w-[80px]"
                      >
                        Search
                      </button>
                    </div>

                    <!-- Filter -->
                    <button
                      mat-stroked-button
                      class="!border-[var(--ax-border-emphasis)] !h-[56px]"
                    >
                      <mat-icon class="!text-lg mr-1">filter_list</mat-icon>
                      Filter
                    </button>

                    <!-- Configurations -->
                    <button
                      mat-stroked-button
                      class="!border-[var(--ax-border-emphasis)] !h-[56px]"
                    >
                      <mat-icon class="!text-lg mr-1">settings</mat-icon>
                      Configurations
                    </button>

                    <div class="flex-1"></div>

                    <!-- Add Button -->
                    <button mat-flat-button color="primary" class="!h-[56px]">
                      <mat-icon>add</mat-icon>
                      Add new product
                    </button>
                  </div>

                  <!-- Row 3: Quick Filters -->
                  <div
                    class="flex items-center gap-4 mt-4 pt-4 border-t border-[var(--ax-border-subtle)]"
                  >
                    <span class="text-sm text-[var(--ax-text-secondary)]"
                      >Show only:</span
                    >
                    <mat-radio-group
                      [(ngModel)]="selectedFilter"
                      class="flex items-center gap-6"
                    >
                      <mat-radio-button value="all" class="!text-sm"
                        >All</mat-radio-button
                      >
                      <mat-radio-button value="active" class="!text-sm"
                        >Active products</mat-radio-button
                      >
                      <mat-radio-button value="pending" class="!text-sm"
                        >Pending products</mat-radio-button
                      >
                      <mat-radio-button value="inactive" class="!text-sm"
                        >Inactive products</mat-radio-button
                      >
                    </mat-radio-group>
                  </div>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="htmlTemplateCode"></ax-code-tabs>
            </section>

            <section class="doc__section">
              <h2>Compact Variant</h2>
              <p>Smaller version without the quick filters row.</p>

              <ax-live-preview variant="bordered">
                <div class="table-header-preview">
                  <div class="flex items-center gap-3 flex-wrap">
                    <h2
                      class="text-lg font-semibold text-[var(--ax-text-default)] mr-4"
                    >
                      Products
                    </h2>

                    <mat-form-field
                      appearance="outline"
                      class="flex-1 max-w-xs search-field-demo"
                      subscriptSizing="dynamic"
                    >
                      <mat-icon
                        matPrefix
                        class="!text-[var(--ax-text-disabled)]"
                        >search</mat-icon
                      >
                      <input matInput placeholder="Search..." />
                    </mat-form-field>

                    <button
                      mat-stroked-button
                      class="!border-[var(--ax-border-emphasis)]"
                    >
                      <mat-icon class="!text-lg">filter_list</mat-icon>
                    </button>

                    <div class="flex-1"></div>

                    <button
                      mat-stroked-button
                      class="!border-[var(--ax-border-emphasis)]"
                    >
                      <mat-icon class="!text-lg mr-1">upload</mat-icon>
                      Export
                    </button>

                    <button mat-flat-button color="primary">
                      <mat-icon>add</mat-icon>
                      Add
                    </button>
                  </div>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="compactHtmlCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- Variant 2: CRUD Component -->
        <mat-tab label="CRUD Component">
          <div class="doc__tab-content">
            <section class="doc__section">
              <h2>Variant 2: CRUD Generator Components</h2>
              <p>
                Component-based approach that works with the CRUD Generator.
                Split into <code>list-header</code> and
                <code>list-filters</code> components.
              </p>

              <!-- Header Component Preview -->
              <h3 class="mt-6 mb-2">List Header Component</h3>
              <ax-live-preview variant="bordered">
                <div class="crud-header-preview">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center gap-3">
                        <h1
                          class="text-2xl font-semibold text-[var(--ax-text-default)]"
                        >
                          Products
                        </h1>
                      </div>
                      <p class="text-sm text-[var(--ax-text-secondary)]">
                        Manage your product collection
                      </p>
                    </div>
                    <div class="flex items-center gap-2">
                      <button mat-stroked-button color="primary">
                        <mat-icon>upload_file</mat-icon>
                        Import
                      </button>
                      <button mat-flat-button color="primary">
                        <mat-icon>add</mat-icon>
                        Add product
                      </button>
                    </div>
                  </div>

                  <!-- Stats Cards -->
                  <div
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4"
                  >
                    <ax-kpi-card
                      [flat]="true"
                      label="Total Products"
                      [value]="1234"
                      variant="simple"
                    ></ax-kpi-card>
                    <ax-kpi-card
                      [flat]="true"
                      label="Available"
                      [value]="1100"
                      variant="badge"
                      badge="89%"
                      badgeType="success"
                    ></ax-kpi-card>
                    <ax-kpi-card
                      [flat]="true"
                      label="Unavailable"
                      [value]="134"
                      variant="badge"
                      badge="11%"
                      badgeType="error"
                    ></ax-kpi-card>
                    <ax-kpi-card
                      [flat]="true"
                      label="This Week"
                      [value]="45"
                      variant="simple"
                    ></ax-kpi-card>
                  </div>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="crudHeaderCode"></ax-code-tabs>

              <!-- Filters Component Preview -->
              <h3 class="mt-8 mb-2">List Filters Component</h3>
              <ax-live-preview variant="bordered">
                <ax-card variant="outlined" size="md" [flat]="true">
                  <div class="filter-panel-preview">
                    <!-- Row 1: Quick Filters + Actions -->
                    <div
                      class="flex items-center justify-between gap-4 flex-wrap mb-4"
                    >
                      <mat-button-toggle-group
                        [value]="quickFilter()"
                        (change)="quickFilter.set($event.value)"
                        class="quick-filter-toggle"
                      >
                        <mat-button-toggle value="all">All</mat-button-toggle>
                        <mat-button-toggle value="active"
                          >Available</mat-button-toggle
                        >
                        <mat-button-toggle value="unavailable"
                          >Unavailable</mat-button-toggle
                        >
                      </mat-button-toggle-group>

                      <div class="flex items-center gap-2">
                        <button
                          mat-stroked-button
                          (click)="showAdvanced.set(!showAdvanced())"
                          [class.active-filter-btn]="showAdvanced()"
                        >
                          <mat-icon>tune</mat-icon>
                          Advanced Filters
                          @if (filterCount() > 0) {
                            <span class="filter-badge">{{
                              filterCount()
                            }}</span>
                          }
                        </button>
                      </div>
                    </div>

                    <!-- Row 2: Search -->
                    <div class="flex items-center gap-2">
                      <mat-form-field
                        appearance="outline"
                        class="flex-1 max-w-md search-field-demo"
                        subscriptSizing="dynamic"
                      >
                        <mat-label>Search</mat-label>
                        <mat-icon matPrefix>search</mat-icon>
                        <input matInput placeholder="Search by name, code..." />
                      </mat-form-field>
                      <button mat-flat-button color="primary">
                        <mat-icon>search</mat-icon>
                        Search
                      </button>
                      <button mat-icon-button matTooltip="Refresh">
                        <mat-icon>refresh</mat-icon>
                      </button>
                    </div>

                    <!-- Advanced Filters (Expandable) -->
                    @if (showAdvanced()) {
                      <div
                        class="mt-4 pt-4 border-t border-[var(--ax-border-default)]"
                      >
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <mat-form-field
                            appearance="outline"
                            class="w-full"
                            subscriptSizing="dynamic"
                          >
                            <mat-label>Product Code</mat-label>
                            <input matInput placeholder="Enter code" />
                          </mat-form-field>
                          <mat-form-field
                            appearance="outline"
                            class="w-full"
                            subscriptSizing="dynamic"
                          >
                            <mat-label>Category</mat-label>
                            <input matInput placeholder="Enter category" />
                          </mat-form-field>
                          <mat-form-field
                            appearance="outline"
                            class="w-full"
                            subscriptSizing="dynamic"
                          >
                            <mat-label>Status</mat-label>
                            <input matInput placeholder="Select status" />
                          </mat-form-field>
                        </div>
                        <div class="mt-4 flex justify-end gap-2">
                          <button mat-stroked-button>Clear All</button>
                          <button mat-flat-button color="primary">
                            Apply Filters
                          </button>
                        </div>
                      </div>
                    }
                  </div>
                </ax-card>
              </ax-live-preview>

              <ax-code-tabs [tabs]="crudFiltersCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- Usage Tab -->
        <mat-tab label="Usage">
          <div class="doc__tab-content">
            <section class="doc__section">
              <h2>When to Use</h2>
              <div class="usage-grid">
                <div class="usage-card usage-card--do">
                  <h4>
                    <mat-icon>check_circle</mat-icon> Use HTML Template when:
                  </h4>
                  <ul>
                    <li>Quick prototyping needed</li>
                    <li>One-off custom design required</li>
                    <li>Full control over markup needed</li>
                    <li>Not using CRUD Generator</li>
                  </ul>
                </div>
                <div class="usage-card usage-card--do">
                  <h4>
                    <mat-icon>check_circle</mat-icon> Use CRUD Components when:
                  </h4>
                  <ul>
                    <li>Using CRUD Generator</li>
                    <li>Need consistent list pages</li>
                    <li>Want automatic stats integration</li>
                    <li>Need advanced filter support</li>
                  </ul>
                </div>
              </div>
            </section>

            <section class="doc__section">
              <h2>CRUD Generator Command</h2>
              <p>Generate a complete list page with header and filters:</p>
              <ax-code-tabs [tabs]="crudCommandCode"></ax-code-tabs>
            </section>

            <section class="doc__section">
              <h2>Anatomy</h2>
              <div class="anatomy-diagram">
                <div class="anatomy-row">
                  <span class="anatomy-label">1</span>
                  <span>Title + Description</span>
                </div>
                <div class="anatomy-row">
                  <span class="anatomy-label">2</span>
                  <span>Action Buttons (Import, Add)</span>
                </div>
                <div class="anatomy-row">
                  <span class="anatomy-label">3</span>
                  <span>Stats Cards (Optional)</span>
                </div>
                <div class="anatomy-row">
                  <span class="anatomy-label">4</span>
                  <span>Quick Filters (Toggle Group)</span>
                </div>
                <div class="anatomy-row">
                  <span class="anatomy-label">5</span>
                  <span>Search Input + Button</span>
                </div>
                <div class="anatomy-row">
                  <span class="anatomy-label">6</span>
                  <span>Advanced Filters Panel (Expandable)</span>
                </div>
              </div>
            </section>
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="doc__tab-content">
            <section class="doc__section">
              <h2>List Header Component API</h2>
              <div class="api-table">
                <table>
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>stats</code></td>
                      <td>
                        <code>{{
                          '{ total, available, unavailable, recentWeek }'
                        }}</code>
                      </td>
                      <td>Stats data for KPI cards</td>
                    </tr>
                    <tr>
                      <td><code>loading</code></td>
                      <td><code>boolean</code></td>
                      <td>Disable buttons when loading</td>
                    </tr>
                    <tr>
                      <td><code>permissionError</code></td>
                      <td><code>boolean</code></td>
                      <td>Show permission error banner</td>
                    </tr>
                    <tr>
                      <td><code>hasError</code></td>
                      <td><code>boolean</code></td>
                      <td>Hide stats when error</td>
                    </tr>
                    <tr>
                      <td><code>(createClicked)</code></td>
                      <td><code>EventEmitter</code></td>
                      <td>Emits when Add button clicked</td>
                    </tr>
                    <tr>
                      <td><code>(importClicked)</code></td>
                      <td><code>EventEmitter</code></td>
                      <td>Emits when Import button clicked</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="doc__section">
              <h2>List Filters Component API</h2>
              <div class="api-table">
                <table>
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>activeFilterCount</code></td>
                      <td><code>number</code></td>
                      <td>Number of active filters (badge)</td>
                    </tr>
                    <tr>
                      <td><code>searchTerm</code></td>
                      <td><code>string</code></td>
                      <td>Two-way bound search value</td>
                    </tr>
                    <tr>
                      <td><code>quickFilter</code></td>
                      <td><code>'all' | 'active' | 'unavailable'</code></td>
                      <td>Selected quick filter</td>
                    </tr>
                    <tr>
                      <td><code>(searchClicked)</code></td>
                      <td><code>EventEmitter</code></td>
                      <td>Emits when search triggered</td>
                    </tr>
                    <tr>
                      <td><code>(refreshClicked)</code></td>
                      <td><code>EventEmitter</code></td>
                      <td>Emits when refresh clicked</td>
                    </tr>
                    <tr>
                      <td><code>(applyFiltersClicked)</code></td>
                      <td><code>EventEmitter</code></td>
                      <td>Emits when filters applied</td>
                    </tr>
                    <tr>
                      <td><code>(clearAllClicked)</code></td>
                      <td><code>EventEmitter</code></td>
                      <td>Emits when filters cleared</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .table-header-doc {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--ax-spacing-xl, 1.5rem);
      }

      .doc__tabs {
        margin-top: var(--ax-spacing-xl, 1.5rem);
      }

      .doc__tab-content {
        padding: var(--ax-spacing-xl, 1.5rem) 0;
      }

      .doc__section {
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
        }

        > p {
          font-size: var(--ax-text-sm, 0.875rem);
          color: var(--ax-text-secondary);
          margin: 0 0 var(--ax-spacing-lg, 1rem) 0;
          max-width: 700px;
        }

        code {
          font-family: var(--ax-font-mono);
          font-size: var(--ax-text-xs, 0.75rem);
          background: var(--ax-background-subtle);
          padding: 2px 6px;
          border-radius: var(--ax-radius-sm, 0.25rem);
        }
      }

      /* Preview containers */
      .table-header-preview,
      .crud-header-preview,
      .filter-panel-preview {
        width: 100%;
        padding: var(--ax-spacing-lg, 1rem);
        background: var(--ax-background-default);
        border-radius: var(--ax-radius-lg);
      }

      /* Search field fix for demo */
      .search-field-demo ::ng-deep .mat-mdc-text-field-wrapper {
        border-top-right-radius: 0 !important;
        border-bottom-right-radius: 0 !important;
      }

      /* Quick filter toggle group */
      .quick-filter-toggle {
        border: 1px solid var(--ax-border-emphasis);
        border-radius: 6px;
        overflow: hidden;
        box-shadow: var(--ax-shadow-xs);
      }

      .quick-filter-toggle .mat-button-toggle {
        border: none !important;
      }

      .quick-filter-toggle .mat-button-toggle-checked {
        background-color: var(--ax-info-faint) !important;
        color: var(--ax-info-emphasis) !important;
      }

      /* Active filter button */
      .active-filter-btn {
        background-color: var(--ax-info-faint) !important;
        border-color: var(--ax-info-default) !important;
        color: var(--ax-info-emphasis) !important;
      }

      /* Filter badge */
      .filter-badge {
        margin-left: 0.5rem;
        padding: 0.125rem 0.5rem;
        font-size: 0.75rem;
        background: var(--ax-info-default);
        color: white;
        border-radius: 9999px;
      }

      /* Usage grid */
      .usage-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--ax-spacing-lg, 1rem);
      }

      .usage-card {
        padding: var(--ax-spacing-lg, 1rem);
        border-radius: var(--ax-radius-lg, 0.75rem);
        background: var(--ax-success-faint);

        h4 {
          display: flex;
          align-items: center;
          gap: var(--ax-spacing-xs, 0.25rem);
          font-size: var(--ax-text-base, 1rem);
          font-weight: 600;
          margin: 0 0 var(--ax-spacing-sm, 0.5rem) 0;
          color: var(--ax-success-emphasis);

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
            color: var(--ax-success-emphasis);
          }
        }
      }

      /* Anatomy diagram */
      .anatomy-diagram {
        display: flex;
        flex-direction: column;
        gap: var(--ax-spacing-sm, 0.5rem);
      }

      .anatomy-row {
        display: flex;
        align-items: center;
        gap: var(--ax-spacing-md, 0.75rem);
        padding: var(--ax-spacing-sm, 0.5rem);
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-md);
        font-size: var(--ax-text-sm, 0.875rem);
      }

      .anatomy-label {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        background: var(--ax-brand-default);
        color: white;
        border-radius: var(--ax-radius-full);
        font-size: var(--ax-text-xs, 0.75rem);
        font-weight: 600;
      }

      /* API Table */
      .api-table {
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
    `,
  ],
})
export class TableHeaderDocComponent {
  // Demo state
  selectedFilter = 'all';
  quickFilter = signal('all');
  showAdvanced = signal(false);
  filterCount = signal(0);

  // HTML Template Code
  htmlTemplateCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Table Header Block - Full Version -->
<div class="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
  <!-- Row 1: Title + Actions -->
  <div class="flex items-center justify-between mb-4">
    <h2 class="text-lg font-semibold text-[var(--ax-text-default)]">
      View all products
    </h2>
    <div class="flex items-center gap-2">
      <button mat-stroked-button>View JSON</button>
      <button mat-stroked-button>
        <mat-icon>upload</mat-icon>
        Export
      </button>
    </div>
  </div>

  <!-- Row 2: Search + Filter + Config + Add -->
  <div class="flex items-center gap-3 flex-wrap">
    <!-- Search Input Group -->
    <div class="flex items-center flex-1 max-w-md">
      <mat-form-field appearance="outline" subscriptSizing="dynamic">
        <mat-icon matPrefix>search</mat-icon>
        <input matInput placeholder="Search..." />
      </mat-form-field>
      <button mat-flat-button color="primary">Search</button>
    </div>

    <!-- Filter Button -->
    <button mat-stroked-button>
      <mat-icon>filter_list</mat-icon>
      Filter
    </button>

    <!-- Configurations Button -->
    <button mat-stroked-button>
      <mat-icon>settings</mat-icon>
      Configurations
    </button>

    <div class="flex-1"></div>

    <!-- Add Button -->
    <button mat-flat-button color="primary">
      <mat-icon>add</mat-icon>
      Add new product
    </button>
  </div>

  <!-- Row 3: Quick Filters -->
  <div class="flex items-center gap-4 mt-4 pt-4 border-t">
    <span class="text-sm text-gray-500">Show only:</span>
    <mat-radio-group [(ngModel)]="quickFilter">
      <mat-radio-button value="all">All</mat-radio-button>
      <mat-radio-button value="active">Active products</mat-radio-button>
      <mat-radio-button value="pending">Pending products</mat-radio-button>
      <mat-radio-button value="inactive">Inactive products</mat-radio-button>
    </mat-radio-group>
  </div>
</div>`,
    },
  ];

  compactHtmlCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Table Header Block - Compact Version -->
<div class="p-4 bg-white rounded-lg border border-gray-200">
  <div class="flex items-center gap-3 flex-wrap">
    <h2 class="text-lg font-semibold mr-4">Products</h2>

    <mat-form-field appearance="outline" class="flex-1 max-w-xs" subscriptSizing="dynamic">
      <mat-icon matPrefix>search</mat-icon>
      <input matInput placeholder="Search..." />
    </mat-form-field>

    <button mat-stroked-button>
      <mat-icon>filter_list</mat-icon>
    </button>

    <div class="flex-1"></div>

    <button mat-stroked-button>
      <mat-icon>upload</mat-icon>
      Export
    </button>

    <button mat-flat-button color="primary">
      <mat-icon>add</mat-icon>
      Add
    </button>
  </div>
</div>`,
    },
  ];

  // CRUD Header Code
  crudHeaderCode = [
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `// products-list-header.component.ts
@Component({
  selector: 'app-products-list-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, AxKpiCardComponent],
  template: \`
    <div class="flex items-start justify-between mt-4">
      <div class="flex-1">
        <h1 class="text-2xl font-semibold">Products</h1>
        <p class="text-sm text-[var(--ax-text-secondary)]">
          Manage your product collection
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button mat-stroked-button color="primary" (click)="importClicked.emit()">
          <mat-icon>upload_file</mat-icon>
          Import
        </button>
        <button mat-flat-button color="primary" (click)="createClicked.emit()">
          <mat-icon>add</mat-icon>
          Add product
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    @if (!hasError) {
      <div class="grid grid-cols-4 gap-4 mt-4">
        <ax-kpi-card label="Total" [value]="stats.total" variant="simple" />
        <ax-kpi-card label="Available" [value]="stats.available" variant="badge"
          [badge]="getPercentage(stats.available) + '%'" badgeType="success" />
        <ax-kpi-card label="Unavailable" [value]="stats.unavailable" variant="badge"
          [badge]="getPercentage(stats.unavailable) + '%'" badgeType="error" />
        <ax-kpi-card label="This Week" [value]="stats.recentWeek" variant="simple" />
      </div>
    }
  \`,
})
export class ProductsListHeaderComponent {
  @Input() stats!: { total: number; available: number; unavailable: number; recentWeek: number };
  @Input() loading = false;
  @Input() hasError = false;

  @Output() createClicked = new EventEmitter<void>();
  @Output() importClicked = new EventEmitter<void>();

  getPercentage(count: number): number {
    return this.stats.total > 0 ? Math.round((count / this.stats.total) * 100) : 0;
  }
}`,
    },
  ];

  crudFiltersCode = [
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `// products-list-filters.component.ts
@Component({
  selector: 'app-products-list-filters',
  standalone: true,
  imports: [/* Material imports */],
  template: \`
    <div class="filter-panel">
      <!-- Quick Filters -->
      <div class="flex items-center justify-between mb-4">
        <mat-button-toggle-group [value]="quickFilter" (change)="onQuickFilterChange($event.value)">
          <mat-button-toggle value="all">All</mat-button-toggle>
          <mat-button-toggle value="active">Available</mat-button-toggle>
          <mat-button-toggle value="unavailable">Unavailable</mat-button-toggle>
        </mat-button-toggle-group>

        <button mat-stroked-button (click)="showAdvancedFilters.set(!showAdvancedFilters())">
          <mat-icon>tune</mat-icon>
          Advanced Filters
          @if (activeFilterCount > 0) {
            <span class="filter-badge">{{ activeFilterCount }}</span>
          }
        </button>
      </div>

      <!-- Search -->
      <div class="flex items-center gap-2">
        <mat-form-field appearance="outline" class="flex-1 max-w-md">
          <mat-icon matPrefix>search</mat-icon>
          <input matInput [(ngModel)]="searchTerm" (keyup.enter)="onSearch()" />
        </mat-form-field>
        <button mat-flat-button color="primary" (click)="onSearch()">Search</button>
        <button mat-icon-button (click)="refreshClicked.emit()">
          <mat-icon>refresh</mat-icon>
        </button>
      </div>

      <!-- Advanced Filters (Expandable) -->
      @if (showAdvancedFilters()) {
        <div class="mt-4 pt-4 border-t">
          <!-- Filter fields generated by CRUD -->
        </div>
      }
    </div>
  \`,
})
export class ProductsListFiltersComponent {
  @Input() activeFilterCount = 0;
  @Input() searchTerm = '';
  @Input() quickFilter: 'all' | 'active' | 'unavailable' = 'all';

  @Output() searchClicked = new EventEmitter<void>();
  @Output() refreshClicked = new EventEmitter<void>();
  @Output() quickFilterChange = new EventEmitter<string>();

  showAdvancedFilters = signal(false);
}`,
    },
  ];

  crudCommandCode = [
    {
      label: 'Bash',
      language: 'bash' as const,
      code: `# Generate CRUD with import feature (includes header + filters)
pnpm run crud:import -- products --domain inventory/master-data --schema inventory --force

# Basic CRUD (without import)
pnpm run crud -- products --domain inventory/master-data --schema inventory --force

# Full featured CRUD (import + events)
pnpm run crud:full -- products --domain inventory/master-data --schema inventory --force`,
    },
  ];
}
