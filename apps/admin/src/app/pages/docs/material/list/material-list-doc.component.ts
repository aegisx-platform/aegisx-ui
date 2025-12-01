import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../components/docs';
import { ComponentToken } from '../../../../types/docs.types';

@Component({
  selector: 'app-material-list-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="material-list-doc">
      <ax-doc-header
        title="List"
        description="Lists are continuous, vertical indexes of text or images."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="material-list-doc__header-links">
          <a
            href="https://material.angular.io/components/list/overview"
            target="_blank"
            rel="noopener"
            class="material-list-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
        </div>
      </ax-doc-header>

      <mat-tab-group class="material-list-doc__tabs" animationDuration="200ms">
        <mat-tab label="Overview">
          <div class="material-list-doc__section">
            <h2 class="material-list-doc__section-title">List Types</h2>

            <h3 class="material-list-doc__subsection-title">Basic List</h3>
            <ax-live-preview title="Simple list items">
              <mat-list>
                <mat-list-item>Item 1</mat-list-item>
                <mat-list-item>Item 2</mat-list-item>
                <mat-list-item>Item 3</mat-list-item>
              </mat-list>
            </ax-live-preview>

            <h3 class="material-list-doc__subsection-title">List with Icons</h3>
            <ax-live-preview title="List items with leading icons">
              <mat-list>
                <mat-list-item>
                  <mat-icon matListItemIcon>home</mat-icon>
                  <span matListItemTitle>Home</span>
                </mat-list-item>
                <mat-list-item>
                  <mat-icon matListItemIcon>folder</mat-icon>
                  <span matListItemTitle>Documents</span>
                </mat-list-item>
                <mat-list-item>
                  <mat-icon matListItemIcon>settings</mat-icon>
                  <span matListItemTitle>Settings</span>
                </mat-list-item>
              </mat-list>
            </ax-live-preview>

            <h3 class="material-list-doc__subsection-title">Two-Line List</h3>
            <ax-live-preview title="List with title and subtitle">
              <mat-list>
                <mat-list-item>
                  <span matListItemTitle>Brunch this weekend?</span>
                  <span matListItemLine
                    >Ali Connors — I'll be in your neighborhood</span
                  >
                </mat-list-item>
                <mat-divider></mat-divider>
                <mat-list-item>
                  <span matListItemTitle>Summer BBQ</span>
                  <span matListItemLine
                    >to Alex, Scott, Jennifer — Wish I could come</span
                  >
                </mat-list-item>
                <mat-divider></mat-divider>
                <mat-list-item>
                  <span matListItemTitle>Oui oui</span>
                  <span matListItemLine
                    >Sandra Adams — Do you have Paris recommendations?</span
                  >
                </mat-list-item>
              </mat-list>
            </ax-live-preview>

            <h3 class="material-list-doc__subsection-title">Navigation List</h3>
            <ax-live-preview title="List for navigation purposes">
              <mat-nav-list>
                <a mat-list-item href="#">
                  <mat-icon matListItemIcon>dashboard</mat-icon>
                  <span matListItemTitle>Dashboard</span>
                </a>
                <a mat-list-item href="#">
                  <mat-icon matListItemIcon>people</mat-icon>
                  <span matListItemTitle>Users</span>
                </a>
                <a mat-list-item href="#">
                  <mat-icon matListItemIcon>analytics</mat-icon>
                  <span matListItemTitle>Reports</span>
                </a>
              </mat-nav-list>
            </ax-live-preview>

            <h3 class="material-list-doc__subsection-title">Selection List</h3>
            <ax-live-preview title="List with checkbox selection">
              <mat-selection-list>
                <mat-list-option>Boots</mat-list-option>
                <mat-list-option>Clogs</mat-list-option>
                <mat-list-option>Loafers</mat-list-option>
                <mat-list-option>Moccasins</mat-list-option>
              </mat-selection-list>
            </ax-live-preview>
          </div>
        </mat-tab>

        <mat-tab label="Examples">
          <div class="material-list-doc__section">
            <h2 class="material-list-doc__section-title">Usage Examples</h2>
            <ax-code-tabs [tabs]="basicUsageCode" />
          </div>
        </mat-tab>

        <mat-tab label="API">
          <div class="material-list-doc__section">
            <h2 class="material-list-doc__section-title">API Reference</h2>
            <mat-card appearance="outlined">
              <mat-card-header
                ><mat-card-title
                  >List Components</mat-card-title
                ></mat-card-header
              >
              <mat-card-content>
                <table class="material-list-doc__api-table">
                  <thead>
                    <tr>
                      <th>Component</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>mat-list</code></td>
                      <td>Basic list container</td>
                    </tr>
                    <tr>
                      <td><code>mat-list-item</code></td>
                      <td>Individual list item</td>
                    </tr>
                    <tr>
                      <td><code>mat-nav-list</code></td>
                      <td>Navigation list</td>
                    </tr>
                    <tr>
                      <td><code>mat-selection-list</code></td>
                      <td>List with checkboxes</td>
                    </tr>
                    <tr>
                      <td><code>mat-list-option</code></td>
                      <td>Selectable list item</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="CSS Tokens">
          <div class="material-list-doc__section">
            <h2 class="material-list-doc__section-title">Design Tokens</h2>
            <ax-component-tokens [tokens]="listTokens" />
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .material-list-doc {
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
      }
    `,
  ],
})
export class MaterialListDocComponent {
  basicUsageCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<!-- Basic List -->
<mat-list>
  <mat-list-item>Item 1</mat-list-item>
  <mat-list-item>Item 2</mat-list-item>
</mat-list>

<!-- List with Icons -->
<mat-list>
  <mat-list-item>
    <mat-icon matListItemIcon>home</mat-icon>
    <span matListItemTitle>Home</span>
  </mat-list-item>
</mat-list>

<!-- Navigation List -->
<mat-nav-list>
  <a mat-list-item routerLink="/dashboard">
    <mat-icon matListItemIcon>dashboard</mat-icon>
    <span matListItemTitle>Dashboard</span>
  </a>
</mat-nav-list>

<!-- Selection List -->
<mat-selection-list [(ngModel)]="selectedItems">
  <mat-list-option value="item1">Item 1</mat-list-option>
  <mat-list-option value="item2">Item 2</mat-list-option>
</mat-selection-list>`,
    },
  ];

  listTokens: ComponentToken[] = [
    {
      cssVar: '--mdc-list-list-item-one-line-container-height',
      usage: 'Single line height',
      value: '48px',
      category: 'Size',
    },
    {
      cssVar: '--mdc-list-list-item-two-line-container-height',
      usage: 'Two line height',
      value: '64px',
      category: 'Size',
    },
    {
      cssVar: '--mdc-list-list-item-label-text-color',
      usage: 'Item text color',
      value: 'var(--ax-text-body)',
      category: 'Text',
    },
    {
      cssVar: '--mat-list-active-indicator-color',
      usage: 'Active item background',
      value: 'var(--ax-brand-subtle)',
      category: 'State',
    },
  ];
}
