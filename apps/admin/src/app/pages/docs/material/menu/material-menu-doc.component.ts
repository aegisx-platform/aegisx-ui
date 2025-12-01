import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../components/docs';
import { ComponentToken } from '../../../../types/docs.types';

@Component({
  selector: 'app-material-menu-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatDividerModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="material-menu-doc">
      <ax-doc-header
        title="Menu"
        description="Menus display a list of choices on temporary surfaces."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="material-menu-doc__header-links">
          <a
            href="https://material.angular.io/components/menu/overview"
            target="_blank"
            rel="noopener"
            class="material-menu-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
        </div>
      </ax-doc-header>

      <mat-tab-group class="material-menu-doc__tabs" animationDuration="200ms">
        <mat-tab label="Overview">
          <div class="material-menu-doc__section">
            <h2 class="material-menu-doc__section-title">Menu Types</h2>

            <h3 class="material-menu-doc__subsection-title">Basic Menu</h3>
            <ax-live-preview title="Simple dropdown menu">
              <button mat-button [matMenuTriggerFor]="basicMenu">
                <mat-icon>more_vert</mat-icon>
                Options
              </button>
              <mat-menu #basicMenu="matMenu">
                <button mat-menu-item>
                  <mat-icon>edit</mat-icon>
                  <span>Edit</span>
                </button>
                <button mat-menu-item>
                  <mat-icon>content_copy</mat-icon>
                  <span>Duplicate</span>
                </button>
                <button mat-menu-item>
                  <mat-icon>delete</mat-icon>
                  <span>Delete</span>
                </button>
              </mat-menu>
            </ax-live-preview>

            <h3 class="material-menu-doc__subsection-title">
              Menu with Dividers
            </h3>
            <ax-live-preview title="Menu with section dividers">
              <button
                mat-flat-button
                color="primary"
                [matMenuTriggerFor]="dividerMenu"
              >
                File Menu
              </button>
              <mat-menu #dividerMenu="matMenu">
                <button mat-menu-item>New</button>
                <button mat-menu-item>Open</button>
                <button mat-menu-item>Save</button>
                <mat-divider></mat-divider>
                <button mat-menu-item>Print</button>
                <button mat-menu-item>Export</button>
                <mat-divider></mat-divider>
                <button mat-menu-item>Close</button>
              </mat-menu>
            </ax-live-preview>

            <h3 class="material-menu-doc__subsection-title">Nested Menu</h3>
            <ax-live-preview title="Menu with submenus">
              <button mat-stroked-button [matMenuTriggerFor]="nestedMenu">
                Settings
              </button>
              <mat-menu #nestedMenu="matMenu">
                <button mat-menu-item [matMenuTriggerFor]="appearanceMenu">
                  <mat-icon>palette</mat-icon>
                  <span>Appearance</span>
                </button>
                <button mat-menu-item [matMenuTriggerFor]="languageMenu">
                  <mat-icon>language</mat-icon>
                  <span>Language</span>
                </button>
                <button mat-menu-item>
                  <mat-icon>settings</mat-icon>
                  <span>Advanced</span>
                </button>
              </mat-menu>

              <mat-menu #appearanceMenu="matMenu">
                <button mat-menu-item>Light</button>
                <button mat-menu-item>Dark</button>
                <button mat-menu-item>System</button>
              </mat-menu>

              <mat-menu #languageMenu="matMenu">
                <button mat-menu-item>English</button>
                <button mat-menu-item>Thai</button>
                <button mat-menu-item>Japanese</button>
              </mat-menu>
            </ax-live-preview>
          </div>
        </mat-tab>

        <mat-tab label="Examples">
          <div class="material-menu-doc__section">
            <h2 class="material-menu-doc__section-title">Usage Examples</h2>
            <ax-code-tabs [tabs]="basicUsageCode" />
          </div>
        </mat-tab>

        <mat-tab label="API">
          <div class="material-menu-doc__section">
            <h2 class="material-menu-doc__section-title">API Reference</h2>
            <mat-card appearance="outlined">
              <mat-card-header
                ><mat-card-title
                  >Menu Directives</mat-card-title
                ></mat-card-header
              >
              <mat-card-content>
                <table class="material-menu-doc__api-table">
                  <thead>
                    <tr>
                      <th>Directive</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>mat-menu</code></td>
                      <td>Menu container</td>
                    </tr>
                    <tr>
                      <td><code>mat-menu-item</code></td>
                      <td>Menu item button</td>
                    </tr>
                    <tr>
                      <td><code>matMenuTriggerFor</code></td>
                      <td>Trigger that opens menu</td>
                    </tr>
                    <tr>
                      <td><code>mat-divider</code></td>
                      <td>Separator between items</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="CSS Tokens">
          <div class="material-menu-doc__section">
            <h2 class="material-menu-doc__section-title">Design Tokens</h2>
            <ax-component-tokens [tokens]="menuTokens" />
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .material-menu-doc {
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
export class MaterialMenuDocComponent {
  basicUsageCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<button mat-button [matMenuTriggerFor]="menu">Menu</button>
<mat-menu #menu="matMenu">
  <button mat-menu-item>Item 1</button>
  <button mat-menu-item>Item 2</button>
  <mat-divider></mat-divider>
  <button mat-menu-item>Item 3</button>
</mat-menu>`,
    },
  ];

  menuTokens: ComponentToken[] = [
    {
      cssVar: '--mat-menu-container-shape',
      usage: 'Border radius',
      value: 'var(--ax-radius-md)',
      category: 'Shape',
    },
    {
      cssVar: '--mat-menu-container-color',
      usage: 'Background',
      value: 'var(--ax-background-default)',
      category: 'Background',
    },
    {
      cssVar: '--mat-menu-item-label-text-color',
      usage: 'Item text color',
      value: 'var(--ax-text-body)',
      category: 'Text',
    },
  ];
}
