import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../components/docs';
import { ComponentToken } from '../../../../types/docs.types';

@Component({
  selector: 'app-material-paginator-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatPaginatorModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="material-paginator-doc">
      <!-- Header -->
      <ax-doc-header
        title="Paginator"
        description="Pagination controls for navigating through data sets."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="material-paginator-doc__header-links">
          <a
            href="https://material.angular.io/components/paginator/overview"
            target="_blank"
            rel="noopener"
            class="material-paginator-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
        </div>
      </ax-doc-header>

      <!-- Tabs -->
      <mat-tab-group
        class="material-paginator-doc__tabs"
        animationDuration="200ms"
      >
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="material-paginator-doc__section">
            <h2 class="material-paginator-doc__section-title">
              Paginator Variants
            </h2>
            <p class="material-paginator-doc__section-description">
              Paginator provides navigation controls for paging through data.
              It's commonly used with tables but can be used independently.
            </p>

            <!-- Basic Paginator -->
            <h3 class="material-paginator-doc__subsection-title">
              Basic Paginator
            </h3>
            <ax-live-preview title="Standard pagination controls">
              <mat-paginator
                [length]="100"
                [pageSize]="10"
                [pageSizeOptions]="[5, 10, 25, 100]"
                (page)="onPageChange($event)"
              >
              </mat-paginator>
              <p class="info-text">
                Page {{ pageIndex + 1 }} of {{ Math.ceil(100 / pageSize) }}
              </p>
            </ax-live-preview>

            <!-- Without Page Size -->
            <h3 class="material-paginator-doc__subsection-title">
              Without Page Size Selector
            </h3>
            <ax-live-preview title="Simple pagination without size options">
              <mat-paginator
                [length]="50"
                [pageSize]="10"
                [hidePageSize]="true"
              >
              </mat-paginator>
            </ax-live-preview>

            <!-- Disabled -->
            <h3 class="material-paginator-doc__subsection-title">Disabled</h3>
            <ax-live-preview title="Disabled pagination">
              <mat-paginator [length]="100" [pageSize]="10" [disabled]="true">
              </mat-paginator>
            </ax-live-preview>

            <!-- With First/Last -->
            <h3 class="material-paginator-doc__subsection-title">
              First/Last Buttons
            </h3>
            <ax-live-preview title="With first and last page buttons">
              <mat-paginator
                [length]="100"
                [pageSize]="10"
                [showFirstLastButtons]="true"
              >
              </mat-paginator>
            </ax-live-preview>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="material-paginator-doc__section">
            <h2 class="material-paginator-doc__section-title">
              Usage Examples
            </h2>

            <!-- Basic Usage -->
            <h3 class="material-paginator-doc__subsection-title">
              Basic Usage
            </h3>
            <ax-code-tabs [tabs]="basicUsageCode" />

            <!-- With Table -->
            <h3 class="material-paginator-doc__subsection-title">With Table</h3>
            <ax-code-tabs [tabs]="tableCode" />

            <!-- Custom Labels -->
            <h3 class="material-paginator-doc__subsection-title">
              Custom Labels
            </h3>
            <ax-code-tabs [tabs]="customLabelsCode" />
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="material-paginator-doc__section">
            <h2 class="material-paginator-doc__section-title">API Reference</h2>

            <mat-card
              appearance="outlined"
              class="material-paginator-doc__api-card"
            >
              <mat-card-header>
                <mat-card-title>Input Properties</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="material-paginator-doc__api-table">
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
                      <td><code>length</code></td>
                      <td><code>number</code></td>
                      <td><code>0</code></td>
                      <td>Total number of items</td>
                    </tr>
                    <tr>
                      <td><code>pageSize</code></td>
                      <td><code>number</code></td>
                      <td><code>50</code></td>
                      <td>Items per page</td>
                    </tr>
                    <tr>
                      <td><code>pageSizeOptions</code></td>
                      <td><code>number[]</code></td>
                      <td><code>[]</code></td>
                      <td>Available page size options</td>
                    </tr>
                    <tr>
                      <td><code>pageIndex</code></td>
                      <td><code>number</code></td>
                      <td><code>0</code></td>
                      <td>Current page index</td>
                    </tr>
                    <tr>
                      <td><code>hidePageSize</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Hide page size selector</td>
                    </tr>
                    <tr>
                      <td><code>showFirstLastButtons</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Show first/last buttons</td>
                    </tr>
                    <tr>
                      <td><code>disabled</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Disable all controls</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              class="material-paginator-doc__api-card"
            >
              <mat-card-header>
                <mat-card-title>Output Events</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="material-paginator-doc__api-table">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>page</code></td>
                      <td><code>PageEvent</code></td>
                      <td>
                        Emits when page changes (includes pageIndex, pageSize,
                        length)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- CSS Tokens Tab -->
        <mat-tab label="CSS Tokens">
          <div class="material-paginator-doc__section">
            <h2 class="material-paginator-doc__section-title">Design Tokens</h2>
            <p class="material-paginator-doc__section-description">
              AegisX overrides these tokens for paginator styling.
            </p>
            <ax-component-tokens [tokens]="paginatorTokens" />
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="material-paginator-doc__section">
            <h2 class="material-paginator-doc__section-title">
              Usage Guidelines
            </h2>

            <mat-card
              appearance="outlined"
              class="material-paginator-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar>check_circle</mat-icon>
                <mat-card-title>When to Use</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-paginator-doc__guide-list">
                  <li>
                    <strong>Large data sets:</strong> When data can't all be
                    displayed
                  </li>
                  <li><strong>Tables:</strong> Paginate table rows</li>
                  <li><strong>Lists:</strong> Navigate through item lists</li>
                  <li>
                    <strong>Search results:</strong> Browse paginated results
                  </li>
                </ul>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              class="material-paginator-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar color="warn">cancel</mat-icon>
                <mat-card-title>Avoid</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-paginator-doc__guide-list">
                  <li>Don't use for small data sets (less than 25 items)</li>
                  <li>Don't hide item count from users</li>
                  <li>Don't make page size options too varied</li>
                  <li>Don't reset page on filter changes (use pageIndex)</li>
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
      .material-paginator-doc {
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

      .info-text {
        margin-top: var(--ax-spacing-sm);
        font-size: 0.875rem;
        color: var(--ax-text-subtle);
      }
    `,
  ],
})
export class MaterialPaginatorDocComponent {
  pageIndex = 0;
  pageSize = 10;
  Math = Math;

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  basicUsageCode = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  imports: [MatPaginatorModule],
  template: \`
    <mat-paginator
      [length]="100"
      [pageSize]="10"
      [pageSizeOptions]="[5, 10, 25, 100]"
      (page)="onPageChange($event)">
    </mat-paginator>
  \`
})
export class MyComponent {
  onPageChange(event: PageEvent) {
    console.log('Page:', event.pageIndex);
    console.log('Page size:', event.pageSize);
  }
}`,
    },
  ];

  tableCode = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `@ViewChild(MatPaginator) paginator!: MatPaginator;

ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
}`,
    },
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<table mat-table [dataSource]="dataSource">
  <!-- columns -->
</table>

<mat-paginator
  [pageSizeOptions]="[5, 10, 25]"
  showFirstLastButtons>
</mat-paginator>`,
    },
  ];

  customLabelsCode = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class CustomPaginatorIntl extends MatPaginatorIntl {
  itemsPerPageLabel = 'Items per page:';
  nextPageLabel = 'Next';
  previousPageLabel = 'Previous';
  firstPageLabel = 'First';
  lastPageLabel = 'Last';

  getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0) return 'No items';
    const start = page * pageSize + 1;
    const end = Math.min((page + 1) * pageSize, length);
    return \`\${start} - \${end} of \${length}\`;
  };
}

// In providers:
{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }`,
    },
  ];

  paginatorTokens: ComponentToken[] = [
    {
      cssVar: '--mat-paginator-container-background-color',
      usage: 'Background color',
      value: 'var(--ax-background-default)',
      category: 'Color',
    },
    {
      cssVar: '--mat-paginator-container-text-color',
      usage: 'Text color',
      value: 'var(--ax-text-body)',
      category: 'Color',
    },
    {
      cssVar: '--mat-paginator-enabled-icon-color',
      usage: 'Navigation icon color',
      value: 'var(--ax-text-strong)',
      category: 'Color',
    },
    {
      cssVar: '--mat-paginator-disabled-icon-color',
      usage: 'Disabled icon color',
      value: 'var(--ax-text-disabled)',
      category: 'Color',
    },
  ];
}
