import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../components/docs';
import { ComponentToken } from '../../../../types/docs.types';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-material-table-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="material-table-doc">
      <ax-doc-header
        title="Table"
        description="Data tables display sets of data with AegisX minimal styling."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="material-table-doc__header-links">
          <a
            href="https://material.angular.io/components/table/overview"
            target="_blank"
            rel="noopener"
            class="material-table-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
        </div>
      </ax-doc-header>

      <mat-tab-group class="material-table-doc__tabs" animationDuration="200ms">
        <mat-tab label="Overview">
          <div class="material-table-doc__section">
            <h2 class="material-table-doc__section-title">Table Styles</h2>
            <p class="material-table-doc__section-description">
              Material tables with AegisX clean borders and minimal styling.
            </p>

            <h3 class="material-table-doc__subsection-title">Basic Table</h3>
            <ax-live-preview title="Simple data table">
              <table
                mat-table
                [dataSource]="dataSource"
                class="mat-elevation-z0"
              >
                <ng-container matColumnDef="id">
                  <th mat-header-cell *matHeaderCellDef>ID</th>
                  <td mat-cell *matCellDef="let element">{{ element.id }}</td>
                </ng-container>
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Name</th>
                  <td mat-cell *matCellDef="let element">{{ element.name }}</td>
                </ng-container>
                <ng-container matColumnDef="email">
                  <th mat-header-cell *matHeaderCellDef>Email</th>
                  <td mat-cell *matCellDef="let element">
                    {{ element.email }}
                  </td>
                </ng-container>
                <ng-container matColumnDef="role">
                  <th mat-header-cell *matHeaderCellDef>Role</th>
                  <td mat-cell *matCellDef="let element">{{ element.role }}</td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr
                  mat-row
                  *matRowDef="let row; columns: displayedColumns"
                ></tr>
              </table>
            </ax-live-preview>

            <h3 class="material-table-doc__subsection-title">
              Table with Pagination
            </h3>
            <ax-live-preview title="Table with paginator">
              <div class="table-container">
                <table
                  mat-table
                  [dataSource]="dataSource"
                  class="mat-elevation-z0"
                >
                  <ng-container matColumnDef="id">
                    <th mat-header-cell *matHeaderCellDef>ID</th>
                    <td mat-cell *matCellDef="let element">{{ element.id }}</td>
                  </ng-container>
                  <ng-container matColumnDef="name">
                    <th mat-header-cell *matHeaderCellDef>Name</th>
                    <td mat-cell *matCellDef="let element">
                      {{ element.name }}
                    </td>
                  </ng-container>
                  <ng-container matColumnDef="email">
                    <th mat-header-cell *matHeaderCellDef>Email</th>
                    <td mat-cell *matCellDef="let element">
                      {{ element.email }}
                    </td>
                  </ng-container>
                  <ng-container matColumnDef="role">
                    <th mat-header-cell *matHeaderCellDef>Role</th>
                    <td mat-cell *matCellDef="let element">
                      {{ element.role }}
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                  <tr
                    mat-row
                    *matRowDef="let row; columns: displayedColumns"
                  ></tr>
                </table>
                <mat-paginator
                  [pageSizeOptions]="[5, 10, 20]"
                  showFirstLastButtons
                ></mat-paginator>
              </div>
            </ax-live-preview>
          </div>
        </mat-tab>

        <mat-tab label="Examples">
          <div class="material-table-doc__section">
            <h2 class="material-table-doc__section-title">Usage Examples</h2>
            <ax-code-tabs [tabs]="basicUsageCode" />
          </div>
        </mat-tab>

        <mat-tab label="API">
          <div class="material-table-doc__section">
            <h2 class="material-table-doc__section-title">API Reference</h2>
            <mat-card appearance="outlined">
              <mat-card-header>
                <mat-card-title>Table Directives</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="material-table-doc__api-table">
                  <thead>
                    <tr>
                      <th>Directive</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>mat-table</code></td>
                      <td>Main table container</td>
                    </tr>
                    <tr>
                      <td><code>mat-header-cell</code></td>
                      <td>Header cell</td>
                    </tr>
                    <tr>
                      <td><code>mat-cell</code></td>
                      <td>Body cell</td>
                    </tr>
                    <tr>
                      <td><code>mat-header-row</code></td>
                      <td>Header row</td>
                    </tr>
                    <tr>
                      <td><code>mat-row</code></td>
                      <td>Body row</td>
                    </tr>
                    <tr>
                      <td><code>mat-paginator</code></td>
                      <td>Pagination control</td>
                    </tr>
                    <tr>
                      <td><code>matSort</code></td>
                      <td>Sorting functionality</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="CSS Tokens">
          <div class="material-table-doc__section">
            <h2 class="material-table-doc__section-title">Design Tokens</h2>
            <ax-component-tokens [tokens]="tableTokens" />
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .material-table-doc {
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
          margin: 0 0 var(--ax-spacing-xl) 0;
        }
        &__subsection-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--ax-text-strong);
          margin: var(--ax-spacing-xl) 0 var(--ax-spacing-md) 0;
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
            background: var(--ax-background-subtle);
          }
          code {
            background: var(--ax-background-subtle);
            padding: 2px 6px;
            border-radius: var(--ax-radius-sm);
          }
        }
        .table-container {
          border: 1px solid var(--ax-border-default);
          border-radius: var(--ax-radius-md);
          overflow: hidden;
        }
      }
    `,
  ],
})
export class MaterialTableDocComponent {
  displayedColumns = ['id', 'name', 'email', 'role'];
  dataSource: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'Viewer' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Editor' },
  ];

  basicUsageCode = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `import { MatTableModule } from '@angular/material/table';

@Component({
  imports: [MatTableModule],
  template: \`
    <table mat-table [dataSource]="dataSource">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Name</th>
        <td mat-cell *matCellDef="let element">{{ element.name }}</td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="columns"></tr>
      <tr mat-row *matRowDef="let row; columns: columns;"></tr>
    </table>
  \`
})
export class MyComponent {
  dataSource = [...];
  columns = ['name'];
}`,
    },
  ];

  tableTokens: ComponentToken[] = [
    {
      cssVar: '--mat-table-header-headline-color',
      usage: 'Header text color',
      value: 'var(--ax-text-strong)',
      category: 'Colors',
    },
    {
      cssVar: '--mat-table-row-item-outline-color',
      usage: 'Row border color',
      value: 'var(--ax-border-default)',
      category: 'Border',
    },
    {
      cssVar: '--mat-table-background-color',
      usage: 'Table background',
      value: 'var(--ax-background-default)',
      category: 'Background',
    },
  ];
}
