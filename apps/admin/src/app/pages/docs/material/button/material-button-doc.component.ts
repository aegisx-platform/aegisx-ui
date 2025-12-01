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
  selector: 'app-material-button-doc',
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
    <div class="material-button-doc">
      <!-- Header -->
      <ax-doc-header
        title="Button"
        description="Material Design buttons with AegisX styling for actions in forms, dialogs, and more."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="material-button-doc__header-links">
          <a
            href="https://material.angular.io/components/button/overview"
            target="_blank"
            rel="noopener"
            class="material-button-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
          <a
            href="https://m3.material.io/components/buttons/overview"
            target="_blank"
            rel="noopener"
            class="material-button-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Material Design 3
          </a>
        </div>
      </ax-doc-header>

      <!-- Tabs -->
      <mat-tab-group
        class="material-button-doc__tabs"
        animationDuration="200ms"
      >
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="material-button-doc__section">
            <h2 class="material-button-doc__section-title">Button Types</h2>
            <p class="material-button-doc__section-description">
              Material Design 3 defines 5 button types, each with specific use
              cases. AegisX applies consistent border-radius and hover effects.
            </p>

            <!-- Filled Buttons -->
            <h3 class="material-button-doc__subsection-title">
              Filled Buttons
            </h3>
            <ax-live-preview title="Filled buttons for primary actions">
              <div class="material-button-doc__button-row">
                <button matButton="filled" color="primary">Primary</button>
                <button matButton="filled" color="accent">Accent</button>
                <button matButton="filled" color="warn">Warn</button>
                <button matButton="filled" disabled>Disabled</button>
              </div>
            </ax-live-preview>

            <!-- Outlined Buttons -->
            <h3 class="material-button-doc__subsection-title">
              Outlined Buttons
            </h3>
            <ax-live-preview title="Outlined buttons for secondary actions">
              <div class="material-button-doc__button-row">
                <button matButton="outlined">Default</button>
                <button matButton="outlined" color="primary">Primary</button>
                <button matButton="outlined" color="warn">Warn</button>
                <button matButton="outlined" disabled>Disabled</button>
              </div>
            </ax-live-preview>

            <!-- Text Buttons -->
            <h3 class="material-button-doc__subsection-title">Text Buttons</h3>
            <ax-live-preview title="Text buttons for low-emphasis actions">
              <div class="material-button-doc__button-row">
                <button mat-button>Default</button>
                <button mat-button color="primary">Primary</button>
                <button mat-button color="warn">Warn</button>
                <button mat-button disabled>Disabled</button>
              </div>
            </ax-live-preview>

            <!-- Elevated Buttons -->
            <h3 class="material-button-doc__subsection-title">
              Elevated Buttons
            </h3>
            <ax-live-preview title="Elevated buttons with shadow">
              <div class="material-button-doc__button-row">
                <button matButton="elevated">Default</button>
                <button matButton="elevated" color="primary">Primary</button>
                <button matButton="elevated" color="warn">Warn</button>
                <button matButton="elevated" disabled>Disabled</button>
              </div>
            </ax-live-preview>

            <!-- Icon Buttons -->
            <h3 class="material-button-doc__subsection-title">Icon Buttons</h3>
            <ax-live-preview title="Icon-only buttons for compact actions">
              <div class="material-button-doc__button-row">
                <button mat-icon-button aria-label="Settings">
                  <mat-icon>settings</mat-icon>
                </button>
                <button mat-icon-button color="primary" aria-label="Favorite">
                  <mat-icon>favorite</mat-icon>
                </button>
                <button mat-icon-button color="warn" aria-label="Delete">
                  <mat-icon>delete</mat-icon>
                </button>
                <button mat-icon-button disabled aria-label="Home">
                  <mat-icon>home</mat-icon>
                </button>
              </div>
            </ax-live-preview>

            <!-- FAB Buttons -->
            <h3 class="material-button-doc__subsection-title">FAB Buttons</h3>
            <ax-live-preview title="Floating action buttons">
              <div class="material-button-doc__button-row">
                <button mat-fab color="primary" aria-label="Add">
                  <mat-icon>add</mat-icon>
                </button>
                <button mat-mini-fab color="accent" aria-label="Edit">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-fab extended color="primary">
                  <mat-icon>add</mat-icon>
                  Create
                </button>
              </div>
            </ax-live-preview>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="material-button-doc__section">
            <h2 class="material-button-doc__section-title">Usage Examples</h2>

            <!-- Basic Usage -->
            <h3 class="material-button-doc__subsection-title">Basic Usage</h3>
            <ax-live-preview title="Import and use">
              <div class="material-button-doc__button-row">
                <button matButton="filled" color="primary">Submit</button>
                <button matButton="outlined">Cancel</button>
              </div>
            </ax-live-preview>
            <ax-code-tabs [tabs]="basicUsageCode" />

            <!-- With Icons -->
            <h3 class="material-button-doc__subsection-title">With Icons</h3>
            <ax-live-preview title="Buttons with icons">
              <div class="material-button-doc__button-row">
                <button matButton="filled" color="primary">
                  <mat-icon>save</mat-icon>
                  Save
                </button>
                <button matButton="outlined">
                  <mat-icon>download</mat-icon>
                  Download
                </button>
                <button matButton="elevated">
                  Upload
                  <mat-icon>upload</mat-icon>
                </button>
              </div>
            </ax-live-preview>
            <ax-code-tabs [tabs]="withIconsCode" />

            <!-- Button Group -->
            <h3 class="material-button-doc__subsection-title">Button Group</h3>
            <ax-live-preview title="Grouped buttons">
              <div class="material-button-doc__button-group">
                <button matButton="outlined">Day</button>
                <button matButton="outlined">Week</button>
                <button matButton="filled" color="primary">Month</button>
                <button matButton="outlined">Year</button>
              </div>
            </ax-live-preview>
            <ax-code-tabs [tabs]="buttonGroupCode" />
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="material-button-doc__section">
            <h2 class="material-button-doc__section-title">API Reference</h2>

            <mat-card
              appearance="outlined"
              class="material-button-doc__api-card"
            >
              <mat-card-header>
                <mat-card-title>Button Directives</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="material-button-doc__api-table">
                  <thead>
                    <tr>
                      <th>Directive</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>mat-button</code></td>
                      <td>Text button (low emphasis)</td>
                    </tr>
                    <tr>
                      <td><code>matButton="filled"</code></td>
                      <td>Filled button (high emphasis)</td>
                    </tr>
                    <tr>
                      <td><code>matButton="outlined"</code></td>
                      <td>Outlined button (medium emphasis)</td>
                    </tr>
                    <tr>
                      <td><code>matButton="elevated"</code></td>
                      <td>Elevated button with shadow</td>
                    </tr>
                    <tr>
                      <td><code>mat-icon-button</code></td>
                      <td>Icon-only button</td>
                    </tr>
                    <tr>
                      <td><code>mat-fab</code></td>
                      <td>Floating action button</td>
                    </tr>
                    <tr>
                      <td><code>mat-mini-fab</code></td>
                      <td>Mini floating action button</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              class="material-button-doc__api-card"
            >
              <mat-card-header>
                <mat-card-title>Input Properties</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="material-button-doc__api-table">
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
                    <tr>
                      <td><code>disabled</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Disables the button</td>
                    </tr>
                    <tr>
                      <td><code>disableRipple</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Disables ripple effect</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- CSS Tokens Tab -->
        <mat-tab label="CSS Tokens">
          <div class="material-button-doc__section">
            <h2 class="material-button-doc__section-title">Design Tokens</h2>
            <p class="material-button-doc__section-description">
              AegisX overrides these Material Design tokens for button styling.
              These tokens ensure consistent appearance across light and dark
              themes.
            </p>
            <ax-component-tokens [tokens]="buttonTokens" />
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="material-button-doc__section">
            <h2 class="material-button-doc__section-title">Usage Guidelines</h2>

            <mat-card
              appearance="outlined"
              class="material-button-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar>check_circle</mat-icon>
                <mat-card-title>When to Use</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-button-doc__guide-list">
                  <li>
                    <strong>Filled:</strong> Primary actions like "Save",
                    "Submit", "Create"
                  </li>
                  <li>
                    <strong>Outlined:</strong> Secondary actions like "Cancel",
                    "Back"
                  </li>
                  <li>
                    <strong>Text:</strong> Tertiary actions like "Learn more",
                    "Skip"
                  </li>
                  <li>
                    <strong>Elevated:</strong> Actions that need emphasis but
                    aren't primary
                  </li>
                  <li>
                    <strong>FAB:</strong> Primary screen action (one per screen)
                  </li>
                </ul>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              class="material-button-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar color="warn">cancel</mat-icon>
                <mat-card-title>Avoid</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-button-doc__guide-list">
                  <li>Don't use more than one filled button per section</li>
                  <li>Don't use FAB for negative actions like "Delete"</li>
                  <li>Don't use long text labels - keep buttons concise</li>
                  <li>Don't disable buttons without clear reason</li>
                </ul>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              class="material-button-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar>accessibility</mat-icon>
                <mat-card-title>Accessibility</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-button-doc__guide-list">
                  <li>
                    Always include <code>aria-label</code> for icon-only buttons
                  </li>
                  <li>Ensure sufficient color contrast (WCAG AA minimum)</li>
                  <li>
                    Use semantic HTML - <code>&lt;button&gt;</code> for actions,
                    <code>&lt;a&gt;</code> for navigation
                  </li>
                  <li>Keep focus indicators visible for keyboard navigation</li>
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
      .material-button-doc {
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

        &__button-row {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ax-spacing-md);
          align-items: center;
        }

        &__button-group {
          display: flex;
          gap: 0;

          button {
            border-radius: 0;

            &:first-child {
              border-radius: var(--ax-radius-sm) 0 0 var(--ax-radius-sm);
            }

            &:last-child {
              border-radius: 0 var(--ax-radius-sm) var(--ax-radius-sm) 0;
            }

            &:not(:last-child) {
              border-right: none;
            }
          }
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

          code {
            background: var(--ax-background-subtle);
            padding: 2px 6px;
            border-radius: var(--ax-radius-sm);
            font-size: 0.8125rem;
          }
        }
      }
    `,
  ],
})
export class MaterialButtonDocComponent {
  basicUsageCode = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [MatButtonModule],
  template: \`
    <button matButton="filled" color="primary">Submit</button>
    <button matButton="outlined">Cancel</button>
  \`
})
export class MyComponent {}`,
    },
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<!-- Filled button -->
<button matButton="filled" color="primary">Submit</button>

<!-- Outlined button -->
<button matButton="outlined">Cancel</button>`,
    },
  ];

  withIconsCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<!-- Icon before text -->
<button matButton="filled" color="primary">
  <mat-icon>save</mat-icon>
  Save
</button>

<!-- Icon after text -->
<button matButton="elevated">
  Upload
  <mat-icon>upload</mat-icon>
</button>`,
    },
  ];

  buttonGroupCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<div class="button-group">
  <button matButton="outlined">Day</button>
  <button matButton="outlined">Week</button>
  <button matButton="filled" color="primary">Month</button>
  <button matButton="outlined">Year</button>
</div>`,
    },
    {
      language: 'scss' as const,
      label: 'SCSS',
      code: `.button-group {
  display: flex;

  button {
    border-radius: 0;

    &:first-child {
      border-radius: var(--ax-radius-sm) 0 0 var(--ax-radius-sm);
    }

    &:last-child {
      border-radius: 0 var(--ax-radius-sm) var(--ax-radius-sm) 0;
    }

    &:not(:last-child) {
      border-right: none;
    }
  }
}`,
    },
  ];

  buttonTokens: ComponentToken[] = [
    {
      cssVar: '--ax-radius-sm',
      usage: 'Border radius for all button types',
      value: '6px',
      category: 'Shape',
    },
    {
      cssVar: 'filled-container-shape',
      usage: 'Border radius for filled buttons',
      value: 'var(--ax-radius-sm)',
      category: 'Shape',
    },
    {
      cssVar: 'outlined-container-shape',
      usage: 'Border radius for outlined buttons',
      value: 'var(--ax-radius-sm)',
      category: 'Shape',
    },
    {
      cssVar: 'text-container-shape',
      usage: 'Border radius for text buttons',
      value: 'var(--ax-radius-sm)',
      category: 'Shape',
    },
    {
      cssVar: 'container-shape',
      usage: 'Border radius for FAB buttons',
      value: 'var(--ax-radius-sm)',
      category: 'FAB',
    },
    {
      cssVar: 'container-elevation-shadow',
      usage: 'Shadow for FAB buttons',
      value: 'var(--ax-shadow-md)',
      category: 'FAB',
    },
    {
      cssVar: 'hover-container-elevation-shadow',
      usage: 'Hover shadow for FAB buttons',
      value: 'var(--ax-shadow-lg)',
      category: 'FAB',
    },
  ];
}
