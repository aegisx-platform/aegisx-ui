import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../components/docs';
import { ComponentToken } from '../../../../types/docs.types';

interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-material-grid-list-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="material-grid-list-doc">
      <!-- Header -->
      <ax-doc-header
        title="Grid List"
        description="Grid-based layout for cards, media, and repeated content."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="material-grid-list-doc__header-links">
          <a
            href="https://material.angular.io/components/grid-list/overview"
            target="_blank"
            rel="noopener"
            class="material-grid-list-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
        </div>
      </ax-doc-header>

      <!-- Tabs -->
      <mat-tab-group
        class="material-grid-list-doc__tabs"
        animationDuration="200ms"
      >
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="material-grid-list-doc__section">
            <h2 class="material-grid-list-doc__section-title">Grid Layouts</h2>
            <p class="material-grid-list-doc__section-description">
              Grid list provides a container for grid-based layouts. Use it for
              image galleries, dashboards, or any repeated content.
            </p>

            <!-- Basic Grid -->
            <h3 class="material-grid-list-doc__subsection-title">Basic Grid</h3>
            <ax-live-preview title="Simple 4-column grid">
              <mat-grid-list cols="4" rowHeight="100px">
                @for (tile of basicTiles; track tile) {
                  <mat-grid-tile [style.background]="tile">{{
                    tile
                  }}</mat-grid-tile>
                }
              </mat-grid-list>
            </ax-live-preview>

            <!-- Dynamic Tiles -->
            <h3 class="material-grid-list-doc__subsection-title">
              Dynamic Tiles
            </h3>
            <ax-live-preview title="Tiles with different sizes">
              <mat-grid-list cols="4" rowHeight="100px">
                @for (tile of dynamicTiles; track tile.text) {
                  <mat-grid-tile
                    [colspan]="tile.cols"
                    [rowspan]="tile.rows"
                    [style.background]="tile.color"
                  >
                    {{ tile.text }}
                  </mat-grid-tile>
                }
              </mat-grid-list>
            </ax-live-preview>

            <!-- With Headers/Footers -->
            <h3 class="material-grid-list-doc__subsection-title">
              With Headers & Footers
            </h3>
            <ax-live-preview title="Grid tiles with header and footer">
              <mat-grid-list cols="3" rowHeight="150px" gutterSize="8px">
                @for (item of imageItems; track item.title) {
                  <mat-grid-tile [style.background]="item.color">
                    <mat-grid-tile-header>
                      {{ item.title }}
                    </mat-grid-tile-header>
                    <mat-icon style="font-size: 48px; opacity: 0.7">{{
                      item.icon
                    }}</mat-icon>
                    <mat-grid-tile-footer>
                      <span>{{ item.subtitle }}</span>
                      <button mat-icon-button>
                        <mat-icon>share</mat-icon>
                      </button>
                    </mat-grid-tile-footer>
                  </mat-grid-tile>
                }
              </mat-grid-list>
            </ax-live-preview>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="material-grid-list-doc__section">
            <h2 class="material-grid-list-doc__section-title">
              Usage Examples
            </h2>

            <!-- Basic Usage -->
            <h3 class="material-grid-list-doc__subsection-title">
              Basic Usage
            </h3>
            <ax-code-tabs [tabs]="basicUsageCode" />

            <!-- Dynamic Layout -->
            <h3 class="material-grid-list-doc__subsection-title">
              Dynamic Layout
            </h3>
            <ax-code-tabs [tabs]="dynamicCode" />

            <!-- With Content -->
            <h3 class="material-grid-list-doc__subsection-title">
              With Headers/Footers
            </h3>
            <ax-code-tabs [tabs]="headerFooterCode" />
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="material-grid-list-doc__section">
            <h2 class="material-grid-list-doc__section-title">API Reference</h2>

            <mat-card
              appearance="outlined"
              class="material-grid-list-doc__api-card"
            >
              <mat-card-header>
                <mat-card-title>MatGridList Properties</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="material-grid-list-doc__api-table">
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
                      <td><code>cols</code></td>
                      <td><code>number</code></td>
                      <td>-</td>
                      <td>Number of columns</td>
                    </tr>
                    <tr>
                      <td><code>rowHeight</code></td>
                      <td><code>string | number</code></td>
                      <td><code>'1:1'</code></td>
                      <td>Row height (px, ratio, or 'fit')</td>
                    </tr>
                    <tr>
                      <td><code>gutterSize</code></td>
                      <td><code>string</code></td>
                      <td><code>'1px'</code></td>
                      <td>Gutter size between tiles</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              class="material-grid-list-doc__api-card"
            >
              <mat-card-header>
                <mat-card-title>MatGridTile Properties</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="material-grid-list-doc__api-table">
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
                      <td><code>colspan</code></td>
                      <td><code>number</code></td>
                      <td><code>1</code></td>
                      <td>Columns the tile spans</td>
                    </tr>
                    <tr>
                      <td><code>rowspan</code></td>
                      <td><code>number</code></td>
                      <td><code>1</code></td>
                      <td>Rows the tile spans</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- CSS Tokens Tab -->
        <mat-tab label="CSS Tokens">
          <div class="material-grid-list-doc__section">
            <h2 class="material-grid-list-doc__section-title">Design Tokens</h2>
            <p class="material-grid-list-doc__section-description">
              AegisX applies these tokens for grid list styling.
            </p>
            <ax-component-tokens [tokens]="gridTokens" />
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="material-grid-list-doc__section">
            <h2 class="material-grid-list-doc__section-title">
              Usage Guidelines
            </h2>

            <mat-card
              appearance="outlined"
              class="material-grid-list-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar>check_circle</mat-icon>
                <mat-card-title>When to Use</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-grid-list-doc__guide-list">
                  <li>
                    <strong>Image galleries:</strong> Display collections of
                    media
                  </li>
                  <li>
                    <strong>Dashboards:</strong> Arrange widgets in a grid
                  </li>
                  <li>
                    <strong>Product listings:</strong> Show items in a catalog
                  </li>
                  <li>
                    <strong>Card layouts:</strong> Organize cards systematically
                  </li>
                </ul>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              class="material-grid-list-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar color="warn">cancel</mat-icon>
                <mat-card-title>Avoid</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-grid-list-doc__guide-list">
                  <li>Don't use for complex layouts - use CSS Grid instead</li>
                  <li>Don't mix drastically different content types</li>
                  <li>Don't use without considering mobile responsiveness</li>
                  <li>Don't overload tiles with too much content</li>
                </ul>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .material-grid-list-doc {
        max-width: 1000px;
        margin: 0 auto;

        &__header-links {
          display: flex;
          gap: var(--ax-spacing-md);
          margin-top: var(--ax-spacing-md);
        }

        &__external-link {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8125rem;
          color: var(--ax-brand-default);
          text-decoration: none;

          mat-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
          }

          &:hover {
            text-decoration: underline;
          }
        }

        &__tabs {
          margin-top: var(--ax-spacing-lg);
        }

        &__section {
          padding: var(--ax-spacing-lg);
        }

        &__section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--ax-text-strong);
          margin: 0 0 var(--ax-spacing-sm) 0;
        }

        &__section-description {
          font-size: 0.9375rem;
          color: var(--ax-text-body);
          line-height: 1.6;
          margin: 0 0 var(--ax-spacing-xl) 0;
        }

        &__subsection-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--ax-text-strong);
          margin: var(--ax-spacing-xl) 0 var(--ax-spacing-md) 0;
        }

        &__api-card {
          margin-bottom: var(--ax-spacing-lg);
        }

        &__api-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;

          th,
          td {
            padding: var(--ax-spacing-sm) var(--ax-spacing-md);
            text-align: left;
            border-bottom: 1px solid var(--ax-border-default);
          }

          th {
            font-weight: 600;
            color: var(--ax-text-strong);
            background: var(--ax-background-subtle);
          }

          td {
            color: var(--ax-text-body);
          }

          code {
            background: var(--ax-background-subtle);
            padding: 2px 6px;
            border-radius: var(--ax-radius-sm);
            font-size: 0.8125rem;
            color: var(--ax-text-emphasis);
          }
        }

        &__guide-card {
          margin-bottom: var(--ax-spacing-lg);

          mat-icon[mat-card-avatar] {
            color: var(--ax-success-default);
          }
        }

        &__guide-list {
          margin: 0;
          padding-left: var(--ax-spacing-lg);
          color: var(--ax-text-body);
          line-height: 1.8;

          li {
            margin-bottom: var(--ax-spacing-xs);
          }

          strong {
            color: var(--ax-text-strong);
          }
        }
      }

      mat-grid-tile {
        color: white;
        font-weight: 500;
      }
    `,
  ],
})
export class MaterialGridListDocComponent {
  basicTiles = ['#f44336', '#e91e63', '#9c27b0', '#673ab7'];

  dynamicTiles: Tile[] = [
    { text: 'One', cols: 3, rows: 1, color: '#2196f3' },
    { text: 'Two', cols: 1, rows: 2, color: '#4caf50' },
    { text: 'Three', cols: 1, rows: 1, color: '#ff9800' },
    { text: 'Four', cols: 2, rows: 1, color: '#9c27b0' },
  ];

  imageItems = [
    { title: 'Photos', subtitle: '324 items', icon: 'photo', color: '#2196f3' },
    {
      title: 'Videos',
      subtitle: '48 items',
      icon: 'videocam',
      color: '#f44336',
    },
    {
      title: 'Music',
      subtitle: '156 items',
      icon: 'music_note',
      color: '#4caf50',
    },
  ];

  basicUsageCode = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  imports: [MatGridListModule],
  template: \`
    <mat-grid-list cols="4" rowHeight="100px">
      @for (tile of tiles; track tile) {
        <mat-grid-tile>{{tile}}</mat-grid-tile>
      }
    </mat-grid-list>
  \`
})
export class MyComponent {
  tiles = ['Tile 1', 'Tile 2', 'Tile 3', 'Tile 4'];
}`,
    },
  ];

  dynamicCode = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `interface Tile {
  text: string;
  cols: number;
  rows: number;
  color: string;
}

tiles: Tile[] = [
  { text: 'One', cols: 3, rows: 1, color: '#2196f3' },
  { text: 'Two', cols: 1, rows: 2, color: '#4caf50' },
  { text: 'Three', cols: 1, rows: 1, color: '#ff9800' },
  { text: 'Four', cols: 2, rows: 1, color: '#9c27b0' },
];`,
    },
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<mat-grid-list cols="4" rowHeight="100px">
  @for (tile of tiles; track tile.text) {
    <mat-grid-tile
      [colspan]="tile.cols"
      [rowspan]="tile.rows"
      [style.background]="tile.color">
      {{tile.text}}
    </mat-grid-tile>
  }
</mat-grid-list>`,
    },
  ];

  headerFooterCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<mat-grid-list cols="3" rowHeight="150px" gutterSize="8px">
  @for (item of items; track item.title) {
    <mat-grid-tile [style.background]="item.color">
      <mat-grid-tile-header>
        {{item.title}}
      </mat-grid-tile-header>

      <mat-icon>{{item.icon}}</mat-icon>

      <mat-grid-tile-footer>
        <span>{{item.subtitle}}</span>
        <button mat-icon-button>
          <mat-icon>share</mat-icon>
        </button>
      </mat-grid-tile-footer>
    </mat-grid-tile>
  }
</mat-grid-list>`,
    },
  ];

  gridTokens: ComponentToken[] = [
    {
      cssVar: '--mat-grid-list-tile-header-background',
      usage: 'Header background color',
      value: 'rgba(0, 0, 0, 0.3)',
      category: 'Color',
    },
    {
      cssVar: '--mat-grid-list-tile-footer-background',
      usage: 'Footer background color',
      value: 'rgba(0, 0, 0, 0.3)',
      category: 'Color',
    },
  ];
}
