import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../components/docs';
import { ComponentToken } from '../../../../types/docs.types';

@Component({
  selector: 'app-material-card-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatChipsModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="material-card-doc">
      <!-- Header -->
      <ax-doc-header
        title="Card"
        description="Cards contain content and actions about a single subject with AegisX styling."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="material-card-doc__header-links">
          <a
            href="https://material.angular.io/components/card/overview"
            target="_blank"
            rel="noopener"
            class="material-card-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
        </div>
      </ax-doc-header>

      <!-- Tabs -->
      <mat-tab-group class="material-card-doc__tabs" animationDuration="200ms">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="material-card-doc__section">
            <h2 class="material-card-doc__section-title">Card Variants</h2>
            <p class="material-card-doc__section-description">
              Material Design 3 cards with AegisX border-radius and shadow
              tokens.
            </p>

            <!-- Elevated Card -->
            <h3 class="material-card-doc__subsection-title">Elevated Card</h3>
            <ax-live-preview title="Default elevated card with shadow">
              <mat-card class="example-card">
                <mat-card-header>
                  <mat-card-title>Elevated Card</mat-card-title>
                  <mat-card-subtitle>Default appearance</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <p>
                    This is the default elevated card style with subtle shadow.
                  </p>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-button>Action</button>
                </mat-card-actions>
              </mat-card>
            </ax-live-preview>

            <!-- Outlined Card -->
            <h3 class="material-card-doc__subsection-title">Outlined Card</h3>
            <ax-live-preview title="Outlined card with border">
              <mat-card appearance="outlined" class="example-card">
                <mat-card-header>
                  <mat-card-title>Outlined Card</mat-card-title>
                  <mat-card-subtitle>With border, no shadow</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <p>
                    Outlined cards use a border instead of elevation for
                    separation.
                  </p>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-button>Action</button>
                </mat-card-actions>
              </mat-card>
            </ax-live-preview>

            <!-- Card with Image -->
            <h3 class="material-card-doc__subsection-title">Card with Image</h3>
            <ax-live-preview title="Card with header image">
              <mat-card class="example-card">
                <img
                  mat-card-image
                  src="https://picsum.photos/400/200"
                  alt="Card image"
                />
                <mat-card-content>
                  <p>Cards can include images as headers or inline content.</p>
                </mat-card-content>
                <mat-card-actions align="end">
                  <button mat-button>Share</button>
                  <button mat-button color="primary">Learn More</button>
                </mat-card-actions>
              </mat-card>
            </ax-live-preview>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="material-card-doc__section">
            <h2 class="material-card-doc__section-title">Usage Examples</h2>

            <h3 class="material-card-doc__subsection-title">Basic Usage</h3>
            <ax-live-preview title="Simple card">
              <mat-card class="example-card">
                <mat-card-content>
                  <p>Simple card with just content.</p>
                </mat-card-content>
              </mat-card>
            </ax-live-preview>
            <ax-code-tabs [tabs]="basicUsageCode" />

            <h3 class="material-card-doc__subsection-title">
              Card with Avatar
            </h3>
            <ax-live-preview title="Card with avatar header">
              <mat-card class="example-card">
                <mat-card-header>
                  <div mat-card-avatar class="example-header-image"></div>
                  <mat-card-title>John Doe</mat-card-title>
                  <mat-card-subtitle>Software Engineer</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <p>Building great software one line at a time.</p>
                </mat-card-content>
              </mat-card>
            </ax-live-preview>
            <ax-code-tabs [tabs]="avatarCardCode" />
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="material-card-doc__section">
            <h2 class="material-card-doc__section-title">API Reference</h2>

            <mat-card appearance="outlined" class="material-card-doc__api-card">
              <mat-card-header>
                <mat-card-title>Card Selectors</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="material-card-doc__api-table">
                  <thead>
                    <tr>
                      <th>Selector</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>mat-card</code></td>
                      <td>Main card container</td>
                    </tr>
                    <tr>
                      <td><code>mat-card-header</code></td>
                      <td>Card header section</td>
                    </tr>
                    <tr>
                      <td><code>mat-card-title</code></td>
                      <td>Card title text</td>
                    </tr>
                    <tr>
                      <td><code>mat-card-subtitle</code></td>
                      <td>Card subtitle text</td>
                    </tr>
                    <tr>
                      <td><code>mat-card-content</code></td>
                      <td>Main content area</td>
                    </tr>
                    <tr>
                      <td><code>mat-card-actions</code></td>
                      <td>Action buttons area</td>
                    </tr>
                    <tr>
                      <td><code>mat-card-image</code></td>
                      <td>Full-width image</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>

            <mat-card appearance="outlined" class="material-card-doc__api-card">
              <mat-card-header>
                <mat-card-title>Input Properties</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="material-card-doc__api-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>appearance</code></td>
                      <td><code>'raised' | 'outlined'</code></td>
                      <td>Card appearance style</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- CSS Tokens Tab -->
        <mat-tab label="CSS Tokens">
          <div class="material-card-doc__section">
            <h2 class="material-card-doc__section-title">Design Tokens</h2>
            <p class="material-card-doc__section-description">
              AegisX overrides these Material Design tokens for card styling.
            </p>
            <ax-component-tokens [tokens]="cardTokens" />
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .material-card-doc {
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

          code {
            background: var(--ax-background-subtle);
            padding: 2px 6px;
            border-radius: var(--ax-radius-sm);
            font-size: 0.8125rem;
          }
        }

        .example-card {
          max-width: 400px;
        }

        .example-header-image {
          background: var(--ax-brand-default);
          border-radius: 50%;
          width: 40px;
          height: 40px;
        }
      }
    `,
  ],
})
export class MaterialCardDocComponent {
  basicUsageCode = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `import { MatCardModule } from '@angular/material/card';

@Component({
  imports: [MatCardModule],
  template: \`
    <mat-card>
      <mat-card-content>
        <p>Simple card content</p>
      </mat-card-content>
    </mat-card>
  \`
})
export class MyComponent {}`,
    },
  ];

  avatarCardCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<mat-card>
  <mat-card-header>
    <div mat-card-avatar class="avatar"></div>
    <mat-card-title>John Doe</mat-card-title>
    <mat-card-subtitle>Software Engineer</mat-card-subtitle>
  </mat-card-header>
  <mat-card-content>
    <p>Card content here</p>
  </mat-card-content>
</mat-card>`,
    },
  ];

  cardTokens: ComponentToken[] = [
    {
      cssVar: '--mdc-elevated-card-container-shape',
      usage: 'Border radius for elevated cards',
      value: 'var(--ax-radius-md)',
      category: 'Shape',
    },
    {
      cssVar: '--mdc-outlined-card-container-shape',
      usage: 'Border radius for outlined cards',
      value: 'var(--ax-radius-md)',
      category: 'Shape',
    },
    {
      cssVar: '--mdc-elevated-card-container-elevation',
      usage: 'Shadow for elevated cards',
      value: 'var(--ax-shadow-sm)',
      category: 'Elevation',
    },
    {
      cssVar: '--mdc-outlined-card-outline-color',
      usage: 'Border color for outlined cards',
      value: 'var(--ax-border-default)',
      category: 'Border',
    },
  ];
}
