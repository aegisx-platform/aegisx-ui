import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../components/docs';
import { ComponentToken } from '../../../../types/docs.types';

@Component({
  selector: 'app-material-divider-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="material-divider-doc">
      <!-- Header -->
      <ax-doc-header
        title="Divider"
        description="Horizontal or vertical line to separate content visually."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="material-divider-doc__header-links">
          <a
            href="https://material.angular.io/components/divider/overview"
            target="_blank"
            rel="noopener"
            class="material-divider-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
          <a
            href="https://m3.material.io/components/divider/overview"
            target="_blank"
            rel="noopener"
            class="material-divider-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Material Design 3
          </a>
        </div>
      </ax-doc-header>

      <!-- Tabs -->
      <mat-tab-group
        class="material-divider-doc__tabs"
        animationDuration="200ms"
      >
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="material-divider-doc__section">
            <h2 class="material-divider-doc__section-title">Divider Types</h2>
            <p class="material-divider-doc__section-description">
              Dividers separate content into clear groups. They can be
              horizontal, vertical, or inset.
            </p>

            <!-- Horizontal Divider -->
            <h3 class="material-divider-doc__subsection-title">
              Horizontal Divider
            </h3>
            <ax-live-preview title="Basic horizontal divider">
              <div class="divider-demo">
                <p>Content above</p>
                <mat-divider></mat-divider>
                <p>Content below</p>
              </div>
            </ax-live-preview>

            <!-- Inset Divider -->
            <h3 class="material-divider-doc__subsection-title">
              Inset Divider
            </h3>
            <ax-live-preview title="Divider with inset (padding)">
              <mat-list>
                <mat-list-item>
                  <mat-icon matListItemIcon>inbox</mat-icon>
                  <span matListItemTitle>Inbox</span>
                </mat-list-item>
                <mat-divider [inset]="true"></mat-divider>
                <mat-list-item>
                  <mat-icon matListItemIcon>send</mat-icon>
                  <span matListItemTitle>Sent</span>
                </mat-list-item>
                <mat-divider [inset]="true"></mat-divider>
                <mat-list-item>
                  <mat-icon matListItemIcon>drafts</mat-icon>
                  <span matListItemTitle>Drafts</span>
                </mat-list-item>
              </mat-list>
            </ax-live-preview>

            <!-- Vertical Divider -->
            <h3 class="material-divider-doc__subsection-title">
              Vertical Divider
            </h3>
            <ax-live-preview title="Vertical divider between items">
              <div class="vertical-demo">
                <span>Left</span>
                <mat-divider [vertical]="true"></mat-divider>
                <span>Center</span>
                <mat-divider [vertical]="true"></mat-divider>
                <span>Right</span>
              </div>
            </ax-live-preview>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="material-divider-doc__section">
            <h2 class="material-divider-doc__section-title">Usage Examples</h2>

            <!-- Basic Usage -->
            <h3 class="material-divider-doc__subsection-title">Basic Usage</h3>
            <ax-code-tabs [tabs]="basicUsageCode" />

            <!-- In Lists -->
            <h3 class="material-divider-doc__subsection-title">In Lists</h3>
            <ax-code-tabs [tabs]="listUsageCode" />

            <!-- Vertical -->
            <h3 class="material-divider-doc__subsection-title">Vertical</h3>
            <ax-code-tabs [tabs]="verticalCode" />
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="material-divider-doc__section">
            <h2 class="material-divider-doc__section-title">API Reference</h2>

            <mat-card
              appearance="outlined"
              class="material-divider-doc__api-card"
            >
              <mat-card-header>
                <mat-card-title>Input Properties</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="material-divider-doc__api-table">
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
                      <td><code>vertical</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Display vertically</td>
                    </tr>
                    <tr>
                      <td><code>inset</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Add left/right inset</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- CSS Tokens Tab -->
        <mat-tab label="CSS Tokens">
          <div class="material-divider-doc__section">
            <h2 class="material-divider-doc__section-title">Design Tokens</h2>
            <p class="material-divider-doc__section-description">
              AegisX overrides these tokens for divider styling.
            </p>
            <ax-component-tokens [tokens]="dividerTokens" />
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="material-divider-doc__section">
            <h2 class="material-divider-doc__section-title">
              Usage Guidelines
            </h2>

            <mat-card
              appearance="outlined"
              class="material-divider-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar>check_circle</mat-icon>
                <mat-card-title>When to Use</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-divider-doc__guide-list">
                  <li><strong>Lists:</strong> Separate list items visually</li>
                  <li>
                    <strong>Sections:</strong> Divide content into logical
                    groups
                  </li>
                  <li><strong>Toolbars:</strong> Separate action groups</li>
                  <li><strong>Cards:</strong> Divide card content areas</li>
                </ul>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              class="material-divider-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar color="warn">cancel</mat-icon>
                <mat-card-title>Avoid</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-divider-doc__guide-list">
                  <li>Don't overuse - white space often works better</li>
                  <li>Don't use to create borders around content</li>
                  <li>Don't use multiple dividers in a row</li>
                  <li>Don't use as decorative elements</li>
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
      .material-divider-doc {
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

      .divider-demo {
        padding: var(--ax-spacing-md);
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-md);

        p {
          margin: var(--ax-spacing-sm) 0;
        }
      }

      .vertical-demo {
        display: flex;
        align-items: center;
        gap: var(--ax-spacing-md);
        height: 40px;
        padding: var(--ax-spacing-md);
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-md);

        mat-divider {
          height: 100%;
        }
      }
    `,
  ],
})
export class MaterialDividerDocComponent {
  basicUsageCode = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `import { MatDividerModule } from '@angular/material/divider';

@Component({
  imports: [MatDividerModule],
  template: \`
    <p>Content above</p>
    <mat-divider></mat-divider>
    <p>Content below</p>
  \`
})
export class MyComponent {}`,
    },
  ];

  listUsageCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<mat-list>
  <mat-list-item>
    <mat-icon matListItemIcon>inbox</mat-icon>
    <span matListItemTitle>Inbox</span>
  </mat-list-item>
  <mat-divider [inset]="true"></mat-divider>
  <mat-list-item>
    <mat-icon matListItemIcon>send</mat-icon>
    <span matListItemTitle>Sent</span>
  </mat-list-item>
</mat-list>`,
    },
  ];

  verticalCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<div class="toolbar">
  <button mat-icon-button>
    <mat-icon>format_bold</mat-icon>
  </button>
  <mat-divider [vertical]="true"></mat-divider>
  <button mat-icon-button>
    <mat-icon>format_italic</mat-icon>
  </button>
</div>`,
    },
    {
      language: 'scss' as const,
      label: 'SCSS',
      code: `.toolbar {
  display: flex;
  align-items: center;
  height: 48px;

  mat-divider {
    height: 24px;
    margin: 0 8px;
  }
}`,
    },
  ];

  dividerTokens: ComponentToken[] = [
    {
      cssVar: '--mat-divider-color',
      usage: 'Color of the divider line',
      value: 'var(--ax-border-default)',
      category: 'Color',
    },
    {
      cssVar: '--mat-divider-width',
      usage: 'Thickness of the divider',
      value: '1px',
      category: 'Size',
    },
  ];
}
