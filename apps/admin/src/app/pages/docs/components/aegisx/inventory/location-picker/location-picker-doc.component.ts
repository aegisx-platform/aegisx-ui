import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  AxLocationPickerComponent,
  LocationNode,
  LocationType,
  LocationStatus,
  SelectionMode,
} from '@aegisx/ui';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../../../components/docs';
import { ComponentToken } from '../../../../../../types/docs.types';

@Component({
  selector: 'ax-location-picker-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    AxLocationPickerComponent,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="location-picker-doc">
      <ax-doc-header
        title="Location Picker"
        icon="warehouse"
        description="Hierarchical location/warehouse picker with tree navigation, search, breadcrumbs, recent locations, and favorites."
        [breadcrumbs]="[
          {
            label: 'Inventory',
            link: '/docs/components/aegisx/inventory/location-picker',
          },
          { label: 'Location Picker' },
        ]"
        status="stable"
        version="1.0.0"
        importStatement="import { AxLocationPickerComponent } from '@aegisx/ui';"
      ></ax-doc-header>

      <mat-tab-group
        class="location-picker-doc__tabs"
        animationDuration="150ms"
      >
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="location-picker-doc__tab-content">
            <section class="location-picker-doc__section">
              <h2>Basic Usage</h2>
              <p>
                The Location Picker component provides a hierarchical tree view
                for selecting warehouse locations (Warehouse → Zone → Aisle →
                Shelf → Bin). It includes search, breadcrumb navigation, and
                support for recent and favorite locations.
              </p>

              <ax-live-preview variant="bordered">
                <div class="location-picker-doc__demo">
                  <ax-location-picker
                    [locations]="basicLocations"
                    [showAvailability]="true"
                    [searchable]="true"
                    (locationSelect)="handleLocationSelect($event)"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="basicUsageCode"></ax-code-tabs>
            </section>

            <section class="location-picker-doc__section">
              <h2>Tree Navigation</h2>
              <p>
                Navigate through location hierarchy with expand/collapse
                controls. The tree automatically expands to show the current
                selected location.
              </p>

              <ax-live-preview variant="bordered">
                <div class="location-picker-doc__demo">
                  <ax-location-picker
                    [locations]="warehouseLocations"
                    [currentLocation]="'BIN-001'"
                    [showAvailability]="true"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="treeNavigationCode"></ax-code-tabs>
            </section>

            <section class="location-picker-doc__section">
              <h2>Search Functionality</h2>
              <p>
                Search locations by code or name. The tree automatically expands
                to show matching results and highlights them.
              </p>

              <ax-live-preview variant="bordered">
                <div class="location-picker-doc__demo">
                  <ax-location-picker
                    [locations]="warehouseLocations"
                    [searchable]="true"
                    [showBreadcrumbs]="true"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="searchCode"></ax-code-tabs>
            </section>

            <section class="location-picker-doc__section">
              <h2>Recent and Favorites</h2>
              <p>
                Enable tabs for recent locations and favorites for quick access
                to frequently used locations. Data persists in localStorage.
              </p>

              <ax-live-preview variant="bordered">
                <div class="location-picker-doc__demo">
                  <ax-location-picker
                    [locations]="warehouseLocations"
                    [showRecent]="true"
                    [showFavorites]="true"
                    [maxRecentLocations]="5"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="recentFavoritesCode"></ax-code-tabs>
            </section>

            <section class="location-picker-doc__section">
              <h2>Selection Modes</h2>
              <p>
                Support for single and multiple selection modes. Restrict
                selectable locations by type (e.g., only Shelf or Bin levels).
              </p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-lg)"
                align="stretch"
              >
                <div class="location-picker-doc__demo">
                  <h4>Single Selection (Default)</h4>
                  <ax-location-picker
                    [locations]="warehouseLocations"
                    [selectionMode]="SelectionMode.Single"
                    [allowedTypes]="[LocationType.Bin]"
                  />
                </div>

                <div class="location-picker-doc__demo">
                  <h4>Multiple Selection</h4>
                  <ax-location-picker
                    [locations]="warehouseLocations"
                    [selectionMode]="SelectionMode.Multiple"
                    [allowedTypes]="[LocationType.Shelf, LocationType.Bin]"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="selectionModesCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="location-picker-doc__tab-content">
            <section class="location-picker-doc__section">
              <h2>Warehouse Transfer Selection</h2>
              <p>
                Select source and destination locations for stock transfers.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-lg)"
                align="stretch"
              >
                <div class="location-picker-doc__transfer-step">
                  <h4>Source Location</h4>
                  <ax-location-picker
                    [locations]="warehouseLocations"
                    [allowedTypes]="[LocationType.Shelf, LocationType.Bin]"
                    [showAvailability]="true"
                    [showBreadcrumbs]="true"
                  />
                </div>

                <div class="location-picker-doc__transfer-step">
                  <h4>Destination Location</h4>
                  <ax-location-picker
                    [locations]="warehouseLocations"
                    [allowedTypes]="[LocationType.Shelf, LocationType.Bin]"
                    [showAvailability]="true"
                    [showBreadcrumbs]="true"
                  />
                </div>
              </ax-live-preview>
            </section>

            <section class="location-picker-doc__section">
              <h2>Location Hierarchy Display</h2>
              <p>
                Complete warehouse hierarchy from top-level warehouses down to
                individual bins.
              </p>

              <ax-live-preview variant="bordered">
                <div class="location-picker-doc__demo">
                  <ax-location-picker
                    [locations]="fullHierarchyLocations"
                    [showAvailability]="true"
                    [searchable]="true"
                    [showBreadcrumbs]="true"
                  />
                </div>
              </ax-live-preview>
            </section>

            <section class="location-picker-doc__section">
              <h2>Capacity Indicators</h2>
              <p>
                Show stock capacity and utilization for each location with
                color-coded indicators.
              </p>

              <ax-live-preview variant="bordered">
                <div class="location-picker-doc__demo">
                  <ax-location-picker
                    [locations]="capacityLocations"
                    [showAvailability]="true"
                  />
                </div>
              </ax-live-preview>
            </section>

            <section class="location-picker-doc__section">
              <h2>Keyboard Navigation</h2>
              <p>Full keyboard support for tree navigation and selection.</p>

              <div class="location-picker-doc__keyboard-shortcuts">
                <div class="shortcut-item">
                  <kbd>↑</kbd><kbd>↓</kbd>
                  <span>Navigate between nodes</span>
                </div>
                <div class="shortcut-item">
                  <kbd>→</kbd>
                  <span>Expand node</span>
                </div>
                <div class="shortcut-item">
                  <kbd>←</kbd>
                  <span>Collapse node</span>
                </div>
                <div class="shortcut-item">
                  <kbd>Enter</kbd>
                  <span>Select location</span>
                </div>
                <div class="shortcut-item">
                  <kbd>/</kbd>
                  <span>Focus search</span>
                </div>
              </div>
            </section>
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="location-picker-doc__tab-content">
            <section class="location-picker-doc__section">
              <h2>Input Properties</h2>
              <div class="location-picker-doc__api-table">
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
                      <td><code>locations</code></td>
                      <td><code>LocationNode[]</code></td>
                      <td><em>Required</em></td>
                      <td>Location hierarchy data</td>
                    </tr>
                    <tr>
                      <td><code>currentLocation</code></td>
                      <td><code>string</code></td>
                      <td><code>undefined</code></td>
                      <td>Pre-selected location ID</td>
                    </tr>
                    <tr>
                      <td><code>showAvailability</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Show stock capacity indicators</td>
                    </tr>
                    <tr>
                      <td><code>allowedTypes</code></td>
                      <td><code>LocationType[]</code></td>
                      <td><code>undefined</code></td>
                      <td>Allowed location types for selection</td>
                    </tr>
                    <tr>
                      <td><code>showRecent</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Show recent locations tab</td>
                    </tr>
                    <tr>
                      <td><code>showFavorites</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Show favorite locations tab</td>
                    </tr>
                    <tr>
                      <td><code>searchable</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Enable search functionality</td>
                    </tr>
                    <tr>
                      <td><code>showBreadcrumbs</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Show breadcrumb navigation</td>
                    </tr>
                    <tr>
                      <td><code>selectionMode</code></td>
                      <td><code>'single' | 'multiple'</code></td>
                      <td><code>'single'</code></td>
                      <td>Selection mode</td>
                    </tr>
                    <tr>
                      <td><code>maxRecentLocations</code></td>
                      <td><code>number</code></td>
                      <td><code>10</code></td>
                      <td>Maximum recent locations to store</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="location-picker-doc__section">
              <h2>Output Events</h2>
              <div class="location-picker-doc__api-table">
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
                      <td><code>locationSelect</code></td>
                      <td><code>LocationSelection</code></td>
                      <td>Emitted when location is selected</td>
                    </tr>
                    <tr>
                      <td><code>favoriteToggle</code></td>
                      <td><code>FavoriteToggleEvent</code></td>
                      <td>Emitted when favorite is toggled</td>
                    </tr>
                    <tr>
                      <td><code>nodeExpand</code></td>
                      <td><code>NodeExpandEvent</code></td>
                      <td>Emitted when node is expanded/collapsed</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="location-picker-doc__section">
              <h2>Type Definitions</h2>

              <h3>LocationNode</h3>
              <pre><code>interface LocationNode &#123;
  id: string;
  code: string;
  name: string;
  type: LocationType;
  parentId?: string;
  children?: LocationNode[];
  stockCount?: number;
  capacity?: number;
  utilization?: number;
  status?: LocationStatus;
  disabled?: boolean;
&#125;</code></pre>

              <h3>LocationType</h3>
              <pre><code>enum LocationType &#123;
  Warehouse = 'warehouse',
  Zone = 'zone',
  Aisle = 'aisle',
  Shelf = 'shelf',
  Bin = 'bin',
&#125;</code></pre>

              <h3>LocationStatus</h3>
              <pre><code>enum LocationStatus &#123;
  Active = 'active',
  Inactive = 'inactive',
  Maintenance = 'maintenance',
  Full = 'full',
&#125;</code></pre>

              <h3>LocationSelection</h3>
              <pre><code>interface LocationSelection &#123;
  location: LocationNode;
  path: LocationNode[];
  pathString: string;
&#125;</code></pre>

              <h3>SelectionMode</h3>
              <pre><code>enum SelectionMode &#123;
  Single = 'single',
  Multiple = 'multiple',
&#125;</code></pre>
            </section>
          </div>
        </mat-tab>

        <!-- Tokens Tab -->
        <mat-tab label="Tokens">
          <div class="location-picker-doc__tab-content">
            <ax-component-tokens
              [tokens]="locationPickerTokens"
            ></ax-component-tokens>
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="location-picker-doc__tab-content">
            <section class="location-picker-doc__section">
              <h2>Do's and Don'ts</h2>

              <div class="location-picker-doc__guidelines">
                <div
                  class="location-picker-doc__guideline location-picker-doc__guideline--do"
                >
                  <h4><mat-icon>check_circle</mat-icon> Do</h4>
                  <ul>
                    <li>Use breadcrumbs to show current location path</li>
                    <li>Enable search for warehouses with many locations</li>
                    <li>
                      Restrict selection to appropriate location types for the
                      task
                    </li>
                    <li>Show capacity indicators for storage locations</li>
                    <li>
                      Enable recent and favorites for frequently accessed
                      locations
                    </li>
                    <li>Provide keyboard navigation for power users</li>
                  </ul>
                </div>

                <div
                  class="location-picker-doc__guideline location-picker-doc__guideline--dont"
                >
                  <h4><mat-icon>cancel</mat-icon> Don't</h4>
                  <ul>
                    <li>
                      Allow selection of disabled or maintenance locations
                    </li>
                    <li>
                      Show all nodes expanded by default in large hierarchies
                    </li>
                    <li>
                      Allow selection of parent nodes when only bins should be
                      selected
                    </li>
                    <li>
                      Ignore capacity limits when showing available locations
                    </li>
                    <li>Hide breadcrumbs in deep hierarchies (>3 levels)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section class="location-picker-doc__section">
              <h2>Accessibility</h2>
              <ul class="location-picker-doc__a11y-list">
                <li>Tree uses proper ARIA tree roles and attributes</li>
                <li>
                  Full keyboard navigation support (arrows, Enter, slash for
                  search)
                </li>
                <li>Search field has descriptive aria-label</li>
                <li>
                  Favorite toggle buttons include aria-label with location name
                </li>
                <li>Capacity indicators use aria-label for screen readers</li>
                <li>Breadcrumb navigation is keyboard accessible</li>
                <li>Disabled locations indicated with aria-disabled</li>
              </ul>
            </section>

            <section class="location-picker-doc__section">
              <h2>Best Practices</h2>
              <ul class="location-picker-doc__best-practices">
                <li>
                  <strong>Type Restrictions:</strong> For stock movements,
                  restrict to Shelf/Bin. For zone selection, allow
                  Warehouse/Zone levels.
                </li>
                <li>
                  <strong>Capacity Display:</strong> Show utilization for
                  storage locations (Shelf, Bin) to help users select locations
                  with available space.
                </li>
                <li>
                  <strong>Search Scope:</strong> Search matches both location
                  codes and names. Consider allowing search by product stored
                  for advanced use cases.
                </li>
                <li>
                  <strong>Recent Locations:</strong> Limit to 5-10 most recent
                  for optimal UX. Auto-cleanup after 30 days of inactivity.
                </li>
                <li>
                  <strong>Tree State:</strong> Persist expanded nodes in
                  component state or URL for better navigation experience.
                </li>
                <li>
                  <strong>Multi-Select:</strong> Use for bulk operations like
                  batch transfers or inventory cycle counts.
                </li>
              </ul>
            </section>

            <section class="location-picker-doc__section">
              <h2>Common Use Cases</h2>
              <ul class="location-picker-doc__use-cases">
                <li>
                  <strong>Stock Transfer:</strong> Select source and destination
                  locations with capacity validation
                </li>
                <li>
                  <strong>Inventory Count:</strong> Select multiple locations
                  for cycle counting
                </li>
                <li>
                  <strong>Put-away:</strong> Find available bin locations based
                  on capacity
                </li>
                <li>
                  <strong>Picking:</strong> Navigate to exact bin location for
                  order fulfillment
                </li>
                <li>
                  <strong>Warehouse Setup:</strong> Organize and manage location
                  hierarchy
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
      .location-picker-doc {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--ax-spacing-xl, 1.5rem);
      }

      .location-picker-doc__tabs {
        margin-top: var(--ax-spacing-xl, 1.5rem);
      }

      .location-picker-doc__tab-content {
        padding: var(--ax-spacing-xl, 1.5rem) 0;
      }

      .location-picker-doc__section {
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

      .location-picker-doc__demo {
        width: 100%;

        h4 {
          font-size: var(--ax-text-sm, 0.875rem);
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0 0 var(--ax-spacing-sm, 0.5rem) 0;
        }
      }

      /* Transfer Steps */
      .location-picker-doc__transfer-step {
        padding: var(--ax-spacing-md, 0.75rem);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-md, 0.5rem);
        background: var(--ax-background-default);

        h4 {
          font-size: var(--ax-text-base, 1rem);
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0 0 var(--ax-spacing-sm, 0.5rem) 0;
        }
      }

      /* Keyboard Shortcuts */
      .location-picker-doc__keyboard-shortcuts {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--ax-spacing-md, 0.75rem);
        margin-top: var(--ax-spacing-md, 0.75rem);

        .shortcut-item {
          display: flex;
          align-items: center;
          gap: var(--ax-spacing-sm, 0.5rem);
          padding: var(--ax-spacing-sm, 0.5rem);
          border: 1px solid var(--ax-border-default);
          border-radius: var(--ax-radius-md, 0.5rem);
          background: var(--ax-background-subtle);

          kbd {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 24px;
            height: 24px;
            padding: 0 var(--ax-spacing-xs, 0.25rem);
            font-family: var(--ax-font-mono);
            font-size: var(--ax-text-xs, 0.75rem);
            font-weight: 600;
            color: var(--ax-text-heading);
            background: var(--ax-background-default);
            border: 1px solid var(--ax-border-strong);
            border-radius: var(--ax-radius-sm, 0.25rem);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          }

          span {
            font-size: var(--ax-text-sm, 0.875rem);
            color: var(--ax-text-secondary);
          }
        }
      }

      /* API Table */
      .location-picker-doc__api-table {
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
      .location-picker-doc__guidelines {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--ax-spacing-lg, 1rem);
      }

      .location-picker-doc__guideline {
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

      .location-picker-doc__guideline--do {
        background: var(--ax-success-faint);

        h4 {
          color: var(--ax-success-emphasis);
        }
        li {
          color: var(--ax-success-emphasis);
        }
      }

      .location-picker-doc__guideline--dont {
        background: var(--ax-error-faint);

        h4 {
          color: var(--ax-error-emphasis);
        }
        li {
          color: var(--ax-error-emphasis);
        }
      }

      .location-picker-doc__a11y-list,
      .location-picker-doc__best-practices,
      .location-picker-doc__use-cases {
        margin: 0;
        padding-left: var(--ax-spacing-lg, 1rem);

        li {
          font-size: var(--ax-text-sm, 0.875rem);
          color: var(--ax-text-secondary);
          margin-bottom: var(--ax-spacing-sm, 0.5rem);

          strong {
            color: var(--ax-text-heading);
          }
        }
      }
    `,
  ],
})
export class LocationPickerDocComponent {
  LocationType = LocationType;
  SelectionMode = SelectionMode;

  basicUsageCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-location-picker
  [locations]="warehouseTree"
  [showAvailability]="true"
  [searchable]="true"
  (locationSelect)="handleLocationSelect($event)"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxLocationPickerComponent, LocationNode, LocationSelection } from '@aegisx/ui';

@Component({
  selector: 'app-location-selector',
  standalone: true,
  imports: [AxLocationPickerComponent],
  template: \`
    <ax-location-picker
      [locations]="warehouseTree"
      (locationSelect)="handleLocationSelect($event)"
    />
  \`,
})
export class LocationSelectorComponent {
  warehouseTree: LocationNode[] = [
    {
      id: 'WH-001',
      code: 'WH-001',
      name: 'Main Warehouse',
      type: 'warehouse',
      children: [
        {
          id: 'ZONE-A',
          code: 'ZONE-A',
          name: 'Zone A',
          type: 'zone',
          parentId: 'WH-001',
          children: []
        }
      ]
    }
  ];

  handleLocationSelect(selection: LocationSelection): void {
    console.log('Selected:', selection.location.code);
    console.log('Path:', selection.pathString);
  }
}`,
    },
  ];

  treeNavigationCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-location-picker
  [locations]="warehouseTree"
  [currentLocation]="'BIN-001'"
  [showAvailability]="true"
  [showBreadcrumbs]="true"
  (nodeExpand)="handleNodeExpand($event)"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { NodeExpandEvent } from '@aegisx/ui';

handleNodeExpand(event: NodeExpandEvent): void {
  console.log('Node expanded:', event.nodeId, event.isExpanded);
}`,
    },
  ];

  searchCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-location-picker
  [locations]="warehouseTree"
  [searchable]="true"
  [showBreadcrumbs]="true"
/>`,
    },
  ];

  recentFavoritesCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-location-picker
  [locations]="warehouseTree"
  [showRecent]="true"
  [showFavorites]="true"
  [maxRecentLocations]="5"
  (favoriteToggle)="handleFavoriteToggle($event)"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { FavoriteToggleEvent } from '@aegisx/ui';

handleFavoriteToggle(event: FavoriteToggleEvent): void {
  console.log('Favorite toggled:', event.locationId, event.isFavorite);
}`,
    },
  ];

  selectionModesCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Single Selection (only Bins) -->
<ax-location-picker
  [locations]="warehouseTree"
  [selectionMode]="'single'"
  [allowedTypes]="[LocationType.Bin]"
/>

<!-- Multiple Selection (Shelves and Bins) -->
<ax-location-picker
  [locations]="warehouseTree"
  [selectionMode]="'multiple'"
  [allowedTypes]="[LocationType.Shelf, LocationType.Bin]"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { LocationType, SelectionMode } from '@aegisx/ui';

export class TransferComponent {
  LocationType = LocationType;

  allowedTypes = [LocationType.Shelf, LocationType.Bin];
  selectionMode: SelectionMode = 'multiple';
}`,
    },
  ];

  locationPickerTokens: ComponentToken[] = [
    {
      category: 'Colors',
      cssVar: '--ax-background-default',
      usage: 'Tree background color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-background-subtle',
      usage: 'Selected node background',
    },
    {
      category: 'Colors',
      cssVar: '--ax-background-hover',
      usage: 'Node hover background',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-heading',
      usage: 'Location name text color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-secondary',
      usage: 'Location code text color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-border-default',
      usage: 'Tree border and dividers',
    },
    {
      category: 'Colors',
      cssVar: '--ax-success-default',
      usage: 'Active status and low utilization (<70%)',
    },
    {
      category: 'Colors',
      cssVar: '--ax-warning-default',
      usage: 'Warning utilization (70-90%)',
    },
    {
      category: 'Colors',
      cssVar: '--ax-error-default',
      usage: 'Critical utilization (>90%) or full status',
    },
    {
      category: 'Colors',
      cssVar: '--ax-primary-default',
      usage: 'Favorite icon active state',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-xs',
      usage: 'Icon spacing and small gaps',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-sm',
      usage: 'Node vertical padding',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-md',
      usage: 'Tree indentation per level',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-lg',
      usage: 'Section padding',
    },
    {
      category: 'Borders',
      cssVar: '--ax-radius-md',
      usage: 'Selected node border radius',
    },
    {
      category: 'Borders',
      cssVar: '--ax-radius-lg',
      usage: 'Container border radius',
    },
  ];

  // Sample location data
  basicLocations: LocationNode[] = [
    {
      id: 'WH-001',
      code: 'WH-001',
      name: 'Main Warehouse',
      type: LocationType.Warehouse,
      stockCount: 450,
      capacity: 1000,
      utilization: 45,
      status: LocationStatus.Active,
      children: [
        {
          id: 'ZONE-A',
          code: 'ZONE-A',
          name: 'Zone A',
          type: LocationType.Zone,
          parentId: 'WH-001',
          stockCount: 200,
          capacity: 500,
          utilization: 40,
          status: LocationStatus.Active,
          children: [
            {
              id: 'AISLE-01',
              code: 'AISLE-01',
              name: 'Aisle 01',
              type: LocationType.Aisle,
              parentId: 'ZONE-A',
              children: [
                {
                  id: 'SHELF-A1',
                  code: 'SHELF-A1',
                  name: 'Shelf A1',
                  type: LocationType.Shelf,
                  parentId: 'AISLE-01',
                  stockCount: 25,
                  capacity: 50,
                  utilization: 50,
                  status: LocationStatus.Active,
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  warehouseLocations: LocationNode[] = [
    {
      id: 'WH-001',
      code: 'WH-001',
      name: 'Main Warehouse',
      type: LocationType.Warehouse,
      stockCount: 850,
      capacity: 2000,
      utilization: 43,
      status: LocationStatus.Active,
      children: [
        {
          id: 'ZONE-A',
          code: 'ZONE-A',
          name: 'Zone A - Medical Supplies',
          type: LocationType.Zone,
          parentId: 'WH-001',
          stockCount: 400,
          capacity: 1000,
          utilization: 40,
          status: LocationStatus.Active,
          children: [
            {
              id: 'AISLE-01',
              code: 'AISLE-01',
              name: 'Aisle 01',
              type: LocationType.Aisle,
              parentId: 'ZONE-A',
              children: [
                {
                  id: 'SHELF-A1',
                  code: 'SHELF-A1',
                  name: 'Shelf A1',
                  type: LocationType.Shelf,
                  parentId: 'AISLE-01',
                  stockCount: 45,
                  capacity: 50,
                  utilization: 90,
                  status: LocationStatus.Active,
                  children: [
                    {
                      id: 'BIN-001',
                      code: 'BIN-001',
                      name: 'Bin 001',
                      type: LocationType.Bin,
                      parentId: 'SHELF-A1',
                      stockCount: 12,
                      capacity: 15,
                      utilization: 80,
                      status: LocationStatus.Active,
                    },
                    {
                      id: 'BIN-002',
                      code: 'BIN-002',
                      name: 'Bin 002',
                      type: LocationType.Bin,
                      parentId: 'SHELF-A1',
                      stockCount: 15,
                      capacity: 15,
                      utilization: 100,
                      status: LocationStatus.Full,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'ZONE-B',
          code: 'ZONE-B',
          name: 'Zone B - Pharmaceuticals',
          type: LocationType.Zone,
          parentId: 'WH-001',
          stockCount: 450,
          capacity: 1000,
          utilization: 45,
          status: LocationStatus.Active,
          children: [],
        },
      ],
    },
  ];

  fullHierarchyLocations = this.warehouseLocations;
  capacityLocations = this.warehouseLocations;

  handleLocationSelect(selection: any): void {
    console.log('Location selected:', selection);
  }
}
