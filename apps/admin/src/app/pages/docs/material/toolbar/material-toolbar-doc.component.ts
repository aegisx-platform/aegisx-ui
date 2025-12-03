import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../components/docs';
import { ComponentToken } from '../../../../types/docs.types';

@Component({
  selector: 'app-material-toolbar-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="material-toolbar-doc">
      <!-- Header -->
      <ax-doc-header
        title="Toolbar"
        description="Container for headers, titles, and actions at the top of views."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="material-toolbar-doc__header-links">
          <a
            href="https://material.angular.io/components/toolbar/overview"
            target="_blank"
            rel="noopener"
            class="material-toolbar-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
          <a
            href="https://m3.material.io/components/top-app-bar/overview"
            target="_blank"
            rel="noopener"
            class="material-toolbar-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Material Design 3
          </a>
        </div>
      </ax-doc-header>

      <!-- Tabs -->
      <mat-tab-group
        class="material-toolbar-doc__tabs"
        animationDuration="200ms"
      >
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="material-toolbar-doc__section">
            <h2 class="material-toolbar-doc__section-title">Toolbar Types</h2>
            <p class="material-toolbar-doc__section-description">
              Toolbars provide a container for titles and actions. They can be
              single or multi-row with different colors.
            </p>

            <!-- Basic Toolbar -->
            <h3 class="material-toolbar-doc__subsection-title">
              Basic Toolbar
            </h3>
            <ax-live-preview title="Simple toolbar with title and actions">
              <mat-toolbar>
                <button mat-icon-button>
                  <mat-icon>menu</mat-icon>
                </button>
                <span>My App</span>
                <span class="toolbar-spacer"></span>
                <button mat-icon-button>
                  <mat-icon>search</mat-icon>
                </button>
                <button mat-icon-button>
                  <mat-icon>more_vert</mat-icon>
                </button>
              </mat-toolbar>
            </ax-live-preview>

            <!-- Colored Toolbar -->
            <h3 class="material-toolbar-doc__subsection-title">
              Colored Toolbars
            </h3>
            <ax-live-preview title="Different color variants">
              <div class="toolbar-stack">
                <mat-toolbar color="primary">
                  <span>Primary Toolbar</span>
                </mat-toolbar>
                <mat-toolbar color="accent">
                  <span>Accent Toolbar</span>
                </mat-toolbar>
                <mat-toolbar color="warn">
                  <span>Warn Toolbar</span>
                </mat-toolbar>
              </div>
            </ax-live-preview>

            <!-- Multi-row Toolbar -->
            <h3 class="material-toolbar-doc__subsection-title">
              Multi-row Toolbar
            </h3>
            <ax-live-preview title="Toolbar with multiple rows">
              <mat-toolbar color="primary">
                <mat-toolbar-row>
                  <button mat-icon-button>
                    <mat-icon>menu</mat-icon>
                  </button>
                  <span>Application</span>
                </mat-toolbar-row>
                <mat-toolbar-row>
                  <span class="toolbar-subtitle"
                    >Subtitle or secondary actions</span
                  >
                  <span class="toolbar-spacer"></span>
                  <button mat-mini-fab color="accent">
                    <mat-icon>add</mat-icon>
                  </button>
                </mat-toolbar-row>
              </mat-toolbar>
            </ax-live-preview>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="material-toolbar-doc__section">
            <h2 class="material-toolbar-doc__section-title">Usage Examples</h2>

            <!-- Basic Usage -->
            <h3 class="material-toolbar-doc__subsection-title">Basic Usage</h3>
            <ax-code-tabs [tabs]="basicUsageCode" />

            <!-- With Actions -->
            <h3 class="material-toolbar-doc__subsection-title">With Actions</h3>
            <ax-code-tabs [tabs]="actionsCode" />

            <!-- Multi-row -->
            <h3 class="material-toolbar-doc__subsection-title">Multi-row</h3>
            <ax-code-tabs [tabs]="multiRowCode" />
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="material-toolbar-doc__section">
            <h2 class="material-toolbar-doc__section-title">API Reference</h2>

            <mat-card
              appearance="outlined"
              class="material-toolbar-doc__api-card"
            >
              <mat-card-header>
                <mat-card-title>MatToolbar Properties</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="material-toolbar-doc__api-table">
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
                      <td><code>color</code></td>
                      <td><code>'primary' | 'accent' | 'warn'</code></td>
                      <td>-</td>
                      <td>Theme color palette</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              class="material-toolbar-doc__api-card"
            >
              <mat-card-header>
                <mat-card-title>Directives</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="material-toolbar-doc__api-table">
                  <thead>
                    <tr>
                      <th>Directive</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>mat-toolbar</code></td>
                      <td>Main toolbar container</td>
                    </tr>
                    <tr>
                      <td><code>mat-toolbar-row</code></td>
                      <td>Row within multi-row toolbar</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- CSS Tokens Tab -->
        <mat-tab label="CSS Tokens">
          <div class="material-toolbar-doc__section">
            <h2 class="material-toolbar-doc__section-title">Design Tokens</h2>
            <p class="material-toolbar-doc__section-description">
              AegisX overrides these tokens for toolbar styling.
            </p>
            <ax-component-tokens [tokens]="toolbarTokens" />
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="material-toolbar-doc__section">
            <h2 class="material-toolbar-doc__section-title">
              Usage Guidelines
            </h2>

            <mat-card
              appearance="outlined"
              class="material-toolbar-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar>check_circle</mat-icon>
                <mat-card-title>When to Use</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-toolbar-doc__guide-list">
                  <li>
                    <strong>App header:</strong> Main application navigation
                  </li>
                  <li><strong>Page titles:</strong> Section headers</li>
                  <li>
                    <strong>Action bars:</strong> Context-specific actions
                  </li>
                  <li>
                    <strong>Search bars:</strong> Prominent search functionality
                  </li>
                </ul>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              class="material-toolbar-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar color="warn">cancel</mat-icon>
                <mat-card-title>Avoid</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-toolbar-doc__guide-list">
                  <li>Don't use multiple toolbars on one page</li>
                  <li>Don't overcrowd with too many actions</li>
                  <li>Don't use for content that should scroll</li>
                  <li>Don't hide essential navigation in overflow menus</li>
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
      .material-toolbar-doc {
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

      .toolbar-spacer {
        flex: 1 1 auto;
      }

      .toolbar-subtitle {
        font-size: 0.875rem;
        opacity: 0.8;
      }

      .toolbar-stack {
        display: flex;
        flex-direction: column;
        gap: var(--ax-spacing-sm);
      }
    `,
  ],
})
export class MaterialToolbarDocComponent {
  basicUsageCode = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  imports: [MatToolbarModule],
  template: \`
    <mat-toolbar>
      <span>My Application</span>
    </mat-toolbar>
  \`
})
export class MyComponent {}`,
    },
  ];

  actionsCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<mat-toolbar color="primary">
  <button mat-icon-button>
    <mat-icon>menu</mat-icon>
  </button>
  <span>My App</span>
  <span class="spacer"></span>
  <button mat-icon-button>
    <mat-icon>search</mat-icon>
  </button>
  <button mat-icon-button>
    <mat-icon>more_vert</mat-icon>
  </button>
</mat-toolbar>`,
    },
    {
      language: 'scss' as const,
      label: 'SCSS',
      code: `.spacer {
  flex: 1 1 auto;
}`,
    },
  ];

  multiRowCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<mat-toolbar color="primary">
  <mat-toolbar-row>
    <button mat-icon-button>
      <mat-icon>menu</mat-icon>
    </button>
    <span>Application Title</span>
  </mat-toolbar-row>

  <mat-toolbar-row>
    <span>Subtitle or search</span>
    <span class="spacer"></span>
    <button mat-mini-fab color="accent">
      <mat-icon>add</mat-icon>
    </button>
  </mat-toolbar-row>
</mat-toolbar>`,
    },
  ];

  toolbarTokens: ComponentToken[] = [
    {
      cssVar: '--mat-toolbar-container-background-color',
      usage: 'Background color',
      value: 'var(--ax-background-default)',
      category: 'Color',
    },
    {
      cssVar: '--mat-toolbar-container-text-color',
      usage: 'Text color',
      value: 'var(--ax-text-strong)',
      category: 'Color',
    },
    {
      cssVar: '--mat-toolbar-standard-height',
      usage: 'Standard toolbar height',
      value: '64px',
      category: 'Size',
    },
    {
      cssVar: '--mat-toolbar-mobile-height',
      usage: 'Mobile toolbar height',
      value: '56px',
      category: 'Size',
    },
  ];
}
