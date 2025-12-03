import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../components/docs';
import { ComponentToken } from '../../../../types/docs.types';

interface UserData {
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-material-sort-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="material-sort-doc">
      <!-- Header -->
      <ax-doc-header
        title="Sort"
        description="Sorting functionality for tables and data lists."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="material-sort-doc__header-links">
          <a
            href="https://material.angular.io/components/sort/overview"
            target="_blank"
            rel="noopener"
            class="material-sort-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
        </div>
      </ax-doc-header>

      <!-- Tabs -->
      <mat-tab-group class="material-sort-doc__tabs" animationDuration="200ms">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="material-sort-doc__section">
            <h2 class="material-sort-doc__section-title">Sortable Tables</h2>
            <p class="material-sort-doc__section-description">
              MatSort provides sortable column headers for tables. Click a
              header to sort, click again to reverse.
            </p>

            <!-- Basic Sort -->
            <h3 class="material-sort-doc__subsection-title">Basic Sort</h3>
            <ax-live-preview title="Table with sortable columns">
              <table
                mat-table
                [dataSource]="sortedData"
                matSort
                (matSortChange)="sortData($event)"
                class="demo-table"
              >
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>
                    Name
                  </th>
                  <td mat-cell *matCellDef="let element">{{ element.name }}</td>
                </ng-container>

                <ng-container matColumnDef="email">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>
                    Email
                  </th>
                  <td mat-cell *matCellDef="let element">
                    {{ element.email }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="role">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>
                    Role
                  </th>
                  <td mat-cell *matCellDef="let element">{{ element.role }}</td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr
                  mat-row
                  *matRowDef="let row; columns: displayedColumns"
                ></tr>
              </table>
            </ax-live-preview>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="material-sort-doc__section">
            <h2 class="material-sort-doc__section-title">Usage Examples</h2>

            <!-- Basic Usage -->
            <h3 class="material-sort-doc__subsection-title">Basic Usage</h3>
            <ax-code-tabs [tabs]="basicUsageCode" />

            <!-- With MatTableDataSource -->
            <h3 class="material-sort-doc__subsection-title">
              With MatTableDataSource
            </h3>
            <ax-code-tabs [tabs]="dataSourceCode" />

            <!-- Custom Sorting -->
            <h3 class="material-sort-doc__subsection-title">Custom Sorting</h3>
            <ax-code-tabs [tabs]="customCode" />
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="material-sort-doc__section">
            <h2 class="material-sort-doc__section-title">API Reference</h2>

            <mat-card appearance="outlined" class="material-sort-doc__api-card">
              <mat-card-header>
                <mat-card-title>MatSort Directive</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="material-sort-doc__api-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>active</code></td>
                      <td><code>string</code></td>
                      <td>Currently active column</td>
                    </tr>
                    <tr>
                      <td><code>direction</code></td>
                      <td><code>'asc' | 'desc' | ''</code></td>
                      <td>Sort direction</td>
                    </tr>
                    <tr>
                      <td><code>disableClear</code></td>
                      <td><code>boolean</code></td>
                      <td>Prevent clearing sort</td>
                    </tr>
                    <tr>
                      <td><code>disabled</code></td>
                      <td><code>boolean</code></td>
                      <td>Disable all sorting</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>

            <mat-card appearance="outlined" class="material-sort-doc__api-card">
              <mat-card-header>
                <mat-card-title>mat-sort-header</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="material-sort-doc__api-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>id</code></td>
                      <td><code>string</code></td>
                      <td>Column identifier for sorting</td>
                    </tr>
                    <tr>
                      <td><code>arrowPosition</code></td>
                      <td><code>'before' | 'after'</code></td>
                      <td>Position of sort arrow</td>
                    </tr>
                    <tr>
                      <td><code>start</code></td>
                      <td><code>'asc' | 'desc'</code></td>
                      <td>Initial sort direction</td>
                    </tr>
                    <tr>
                      <td><code>disabled</code></td>
                      <td><code>boolean</code></td>
                      <td>Disable this column's sort</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- CSS Tokens Tab -->
        <mat-tab label="CSS Tokens">
          <div class="material-sort-doc__section">
            <h2 class="material-sort-doc__section-title">Design Tokens</h2>
            <p class="material-sort-doc__section-description">
              AegisX overrides these tokens for sort header styling.
            </p>
            <ax-component-tokens [tokens]="sortTokens" />
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="material-sort-doc__section">
            <h2 class="material-sort-doc__section-title">Usage Guidelines</h2>

            <mat-card
              appearance="outlined"
              class="material-sort-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar>check_circle</mat-icon>
                <mat-card-title>When to Use</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-sort-doc__guide-list">
                  <li>
                    <strong>Data tables:</strong> Allow users to reorder rows
                  </li>
                  <li>
                    <strong>Comparing data:</strong> Find highest/lowest values
                  </li>
                  <li>
                    <strong>Alphabetic ordering:</strong> Sort names, titles
                  </li>
                  <li><strong>Date ordering:</strong> Chronological sorting</li>
                </ul>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              class="material-sort-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar color="warn">cancel</mat-icon>
                <mat-card-title>Avoid</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-sort-doc__guide-list">
                  <li>Don't make all columns sortable if not useful</li>
                  <li>Don't sort by columns with unique values (IDs)</li>
                  <li>Don't remove default sort without user action</li>
                  <li>Don't use for small data sets (less than 10 rows)</li>
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
      .material-sort-doc {
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

      .demo-table {
        width: 100%;
      }
    `,
  ],
})
export class MaterialSortDocComponent {
  displayedColumns = ['name', 'email', 'role'];

  users: UserData[] = [
    { name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
    { name: 'Bob Smith', email: 'bob@example.com', role: 'User' },
    { name: 'Charlie Brown', email: 'charlie@example.com', role: 'Editor' },
    { name: 'Diana Prince', email: 'diana@example.com', role: 'Admin' },
  ];

  sortedData: UserData[] = [...this.users];

  sortData(sort: Sort): void {
    const data = [...this.users];
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'email':
          return compare(a.email, b.email, isAsc);
        case 'role':
          return compare(a.role, b.role, isAsc);
        default:
          return 0;
      }
    });
  }

  basicUsageCode = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `import { MatSortModule, Sort } from '@angular/material/sort';

@Component({
  imports: [MatTableModule, MatSortModule],
  template: \`
    <table mat-table [dataSource]="data" matSort (matSortChange)="sortData($event)">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
        <td mat-cell *matCellDef="let element">{{element.name}}</td>
      </ng-container>
      ...
    </table>
  \`
})
export class MyComponent {
  sortData(sort: Sort) {
    // Handle sorting logic
  }
}`,
    },
  ];

  dataSourceCode = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({...})
export class MyComponent implements AfterViewInit {
  dataSource = new MatTableDataSource(this.data);
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}`,
    },
  ];

  customCode = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `// Custom sort function
dataSource.sortingDataAccessor = (item, property) => {
  switch (property) {
    case 'date':
      return new Date(item.date).getTime();
    case 'name':
      return item.name.toLowerCase();
    default:
      return item[property];
  }
};

// Custom sort comparator
dataSource.sortData = (data, sort) => {
  return data.sort((a, b) => {
    const isAsc = sort.direction === 'asc';
    // Custom comparison logic
  });
};`,
    },
  ];

  sortTokens: ComponentToken[] = [
    {
      cssVar: '--mat-sort-arrow-color',
      usage: 'Color of sort indicator arrow',
      value: 'var(--ax-text-subtle)',
      category: 'Color',
    },
  ];
}

function compare(a: string, b: string, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
