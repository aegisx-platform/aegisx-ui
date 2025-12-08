import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../components/docs';
import { ComponentToken } from '../../../../types/docs.types';

@Component({
  selector: 'app-material-fab-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="material-fab-doc">
      <ax-doc-header
        title="FAB"
        description="Floating Action Buttons represent the primary action of a screen."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="material-fab-doc__header-links">
          <a
            href="https://material.angular.io/components/button/overview#fab"
            target="_blank"
            rel="noopener"
            class="material-fab-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
        </div>
      </ax-doc-header>

      <mat-tab-group class="material-fab-doc__tabs" animationDuration="200ms">
        <mat-tab label="Overview">
          <div class="material-fab-doc__section">
            <h2 class="material-fab-doc__section-title">FAB Types</h2>

            <h3 class="material-fab-doc__subsection-title">Standard FAB</h3>
            <ax-live-preview title="Default FAB size">
              <div class="fab-row">
                <button mat-fab>
                  <mat-icon>add</mat-icon>
                </button>
                <button mat-fab color="primary">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-fab color="accent">
                  <mat-icon>favorite</mat-icon>
                </button>
                <button mat-fab color="warn">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </ax-live-preview>

            <h3 class="material-fab-doc__subsection-title">Mini FAB</h3>
            <ax-live-preview title="Smaller FAB for compact layouts">
              <div class="fab-row">
                <button mat-mini-fab>
                  <mat-icon>add</mat-icon>
                </button>
                <button mat-mini-fab color="primary">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-mini-fab color="accent">
                  <mat-icon>star</mat-icon>
                </button>
              </div>
            </ax-live-preview>

            <h3 class="material-fab-doc__subsection-title">Extended FAB</h3>
            <ax-live-preview title="FAB with text label">
              <div class="fab-row">
                <button mat-fab extended>
                  <mat-icon>add</mat-icon>
                  Create
                </button>
                <button mat-fab extended color="primary">
                  <mat-icon>edit</mat-icon>
                  Edit
                </button>
              </div>
            </ax-live-preview>

            <h3 class="material-fab-doc__subsection-title">Disabled FAB</h3>
            <ax-live-preview title="FAB in disabled state">
              <div class="fab-row">
                <button mat-fab disabled>
                  <mat-icon>add</mat-icon>
                </button>
                <button mat-mini-fab disabled>
                  <mat-icon>edit</mat-icon>
                </button>
              </div>
            </ax-live-preview>
          </div>
        </mat-tab>

        <mat-tab label="Examples">
          <div class="material-fab-doc__section">
            <h2 class="material-fab-doc__section-title">Usage Examples</h2>
            <ax-code-tabs [tabs]="basicUsageCode" />
          </div>
        </mat-tab>

        <mat-tab label="API">
          <div class="material-fab-doc__section">
            <h2 class="material-fab-doc__section-title">API Reference</h2>
            <mat-card appearance="outlined">
              <mat-card-header
                ><mat-card-title
                  >FAB Directives</mat-card-title
                ></mat-card-header
              >
              <mat-card-content>
                <table class="material-fab-doc__api-table">
                  <thead>
                    <tr>
                      <th>Directive</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>mat-fab</code></td>
                      <td>Standard floating action button</td>
                    </tr>
                    <tr>
                      <td><code>mat-mini-fab</code></td>
                      <td>Smaller FAB variant</td>
                    </tr>
                    <tr>
                      <td><code>extended</code></td>
                      <td>FAB with text label</td>
                    </tr>
                    <tr>
                      <td><code>color</code></td>
                      <td>Theme color: primary, accent, warn</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="CSS Tokens">
          <div class="material-fab-doc__section">
            <h2 class="material-fab-doc__section-title">Design Tokens</h2>
            <ax-component-tokens [tokens]="fabTokens" />
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .material-fab-doc {
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
        .fab-row {
          display: flex;
          gap: var(--ax-spacing-md);
          align-items: center;
          flex-wrap: wrap;
        }
      }
    `,
  ],
})
export class MaterialFabDocComponent {
  basicUsageCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<!-- Standard FAB -->
<button mat-fab color="primary">
  <mat-icon>add</mat-icon>
</button>

<!-- Mini FAB -->
<button mat-mini-fab color="accent">
  <mat-icon>edit</mat-icon>
</button>

<!-- Extended FAB -->
<button mat-fab extended color="primary">
  <mat-icon>add</mat-icon>
  Create New
</button>`,
    },
  ];

  fabTokens: ComponentToken[] = [
    {
      cssVar: '--mdc-fab-container-shape',
      usage: 'Border radius',
      value: 'var(--ax-radius-lg)',
      category: 'Shape',
    },
    {
      cssVar: '--mdc-fab-container-color',
      usage: 'Background color',
      value: 'var(--ax-brand-default)',
      category: 'Background',
    },
    {
      cssVar: '--mat-fab-foreground-color',
      usage: 'Icon color',
      value: 'var(--ax-text-on-primary)',
      category: 'Text',
    },
    {
      cssVar: '--mdc-fab-container-elevation-shadow',
      usage: 'Shadow',
      value: 'var(--ax-shadow-md)',
      category: 'Elevation',
    },
  ];
}
