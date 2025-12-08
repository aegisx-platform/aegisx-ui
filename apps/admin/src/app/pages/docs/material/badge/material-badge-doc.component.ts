import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../components/docs';
import { ComponentToken } from '../../../../types/docs.types';

@Component({
  selector: 'app-material-badge-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatBadgeModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="material-badge-doc">
      <!-- Header -->
      <ax-doc-header
        title="Badge"
        description="Small status descriptors for UI elements like icons and buttons."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="material-badge-doc__header-links">
          <a
            href="https://material.angular.io/components/badge/overview"
            target="_blank"
            rel="noopener"
            class="material-badge-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
          <a
            href="https://m3.material.io/components/badges/overview"
            target="_blank"
            rel="noopener"
            class="material-badge-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Material Design 3
          </a>
        </div>
      </ax-doc-header>

      <!-- Tabs -->
      <mat-tab-group class="material-badge-doc__tabs" animationDuration="200ms">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="material-badge-doc__section">
            <h2 class="material-badge-doc__section-title">Badge Types</h2>
            <p class="material-badge-doc__section-description">
              Badges provide small status descriptors. They can show counts,
              statuses, or indicate new content.
            </p>

            <!-- Basic Badges -->
            <h3 class="material-badge-doc__subsection-title">Basic Badges</h3>
            <ax-live-preview title="Badges on icons">
              <div class="material-badge-doc__badge-row">
                <button mat-icon-button [matBadge]="5" matBadgeColor="primary">
                  <mat-icon>mail</mat-icon>
                </button>
                <button mat-icon-button [matBadge]="10" matBadgeColor="accent">
                  <mat-icon>notifications</mat-icon>
                </button>
                <button mat-icon-button [matBadge]="99" matBadgeColor="warn">
                  <mat-icon>shopping_cart</mat-icon>
                </button>
              </div>
            </ax-live-preview>

            <!-- Badge Position -->
            <h3 class="material-badge-doc__subsection-title">Badge Position</h3>
            <ax-live-preview title="Different badge positions">
              <div class="material-badge-doc__badge-row">
                <button
                  mat-icon-button
                  [matBadge]="1"
                  matBadgePosition="above after"
                >
                  <mat-icon>home</mat-icon>
                </button>
                <button
                  mat-icon-button
                  [matBadge]="2"
                  matBadgePosition="above before"
                >
                  <mat-icon>home</mat-icon>
                </button>
                <button
                  mat-icon-button
                  [matBadge]="3"
                  matBadgePosition="below after"
                >
                  <mat-icon>home</mat-icon>
                </button>
                <button
                  mat-icon-button
                  [matBadge]="4"
                  matBadgePosition="below before"
                >
                  <mat-icon>home</mat-icon>
                </button>
              </div>
            </ax-live-preview>

            <!-- Badge Size -->
            <h3 class="material-badge-doc__subsection-title">Badge Size</h3>
            <ax-live-preview title="Small, medium, and large badges">
              <div class="material-badge-doc__badge-row">
                <span matBadge="S" matBadgeSize="small">Small</span>
                <span matBadge="M" matBadgeSize="medium">Medium</span>
                <span matBadge="L" matBadgeSize="large">Large</span>
              </div>
            </ax-live-preview>

            <!-- Overlap -->
            <h3 class="material-badge-doc__subsection-title">Overlap Mode</h3>
            <ax-live-preview title="Overlap vs non-overlap badges">
              <div class="material-badge-doc__badge-row">
                <span matBadge="!" [matBadgeOverlap]="true">Overlap</span>
                <span matBadge="!" [matBadgeOverlap]="false">No Overlap</span>
              </div>
            </ax-live-preview>

            <!-- Text Badges -->
            <h3 class="material-badge-doc__subsection-title">
              Text on Buttons
            </h3>
            <ax-live-preview title="Badges on text buttons">
              <div class="material-badge-doc__badge-row">
                <button
                  mat-raised-button
                  [matBadge]="3"
                  matBadgeColor="primary"
                >
                  Messages
                </button>
                <button
                  mat-stroked-button
                  matBadge="NEW"
                  matBadgeColor="accent"
                >
                  Features
                </button>
              </div>
            </ax-live-preview>

            <!-- Hidden Badge -->
            <h3 class="material-badge-doc__subsection-title">Hidden Badge</h3>
            <ax-live-preview title="Conditionally hide badges">
              <div class="material-badge-doc__badge-row">
                <button
                  mat-icon-button
                  [matBadge]="unreadCount"
                  [matBadgeHidden]="unreadCount === 0"
                >
                  <mat-icon>mail</mat-icon>
                </button>
                <button mat-raised-button (click)="toggleUnread()">
                  Toggle ({{ unreadCount }})
                </button>
              </div>
            </ax-live-preview>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="material-badge-doc__section">
            <h2 class="material-badge-doc__section-title">Usage Examples</h2>

            <!-- Basic Usage -->
            <h3 class="material-badge-doc__subsection-title">Basic Usage</h3>
            <ax-code-tabs [tabs]="basicUsageCode" />

            <!-- With Icons -->
            <h3 class="material-badge-doc__subsection-title">
              On Icon Buttons
            </h3>
            <ax-code-tabs [tabs]="iconButtonCode" />

            <!-- Conditional Display -->
            <h3 class="material-badge-doc__subsection-title">
              Conditional Display
            </h3>
            <ax-code-tabs [tabs]="conditionalCode" />
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="material-badge-doc__section">
            <h2 class="material-badge-doc__section-title">API Reference</h2>

            <mat-card
              appearance="outlined"
              class="material-badge-doc__api-card"
            >
              <mat-card-header>
                <mat-card-title>Input Properties</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="material-badge-doc__api-table">
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
                      <td><code>matBadge</code></td>
                      <td><code>string | number</code></td>
                      <td>-</td>
                      <td>Content for the badge</td>
                    </tr>
                    <tr>
                      <td><code>matBadgeColor</code></td>
                      <td><code>'primary' | 'accent' | 'warn'</code></td>
                      <td><code>'primary'</code></td>
                      <td>Theme color palette</td>
                    </tr>
                    <tr>
                      <td><code>matBadgePosition</code></td>
                      <td>
                        <code
                          >'above after' | 'above before' | 'below after' |
                          'below before'</code
                        >
                      </td>
                      <td><code>'above after'</code></td>
                      <td>Position of the badge</td>
                    </tr>
                    <tr>
                      <td><code>matBadgeSize</code></td>
                      <td><code>'small' | 'medium' | 'large'</code></td>
                      <td><code>'medium'</code></td>
                      <td>Size of the badge</td>
                    </tr>
                    <tr>
                      <td><code>matBadgeHidden</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Hide the badge</td>
                    </tr>
                    <tr>
                      <td><code>matBadgeOverlap</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Overlap the element</td>
                    </tr>
                    <tr>
                      <td><code>matBadgeDisabled</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Disable the badge</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- CSS Tokens Tab -->
        <mat-tab label="CSS Tokens">
          <div class="material-badge-doc__section">
            <h2 class="material-badge-doc__section-title">Design Tokens</h2>
            <p class="material-badge-doc__section-description">
              AegisX overrides these Material Design tokens for badge styling.
            </p>
            <ax-component-tokens [tokens]="badgeTokens" />
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="material-badge-doc__section">
            <h2 class="material-badge-doc__section-title">Usage Guidelines</h2>

            <mat-card
              appearance="outlined"
              class="material-badge-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar>check_circle</mat-icon>
                <mat-card-title>When to Use</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-badge-doc__guide-list">
                  <li>
                    <strong>Notifications:</strong> Show unread count on icons
                  </li>
                  <li>
                    <strong>Status indicators:</strong> Mark new or updated
                    items
                  </li>
                  <li>
                    <strong>Cart count:</strong> Display number of items in cart
                  </li>
                  <li>
                    <strong>Attention:</strong> Draw attention to actionable
                    items
                  </li>
                </ul>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              class="material-badge-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar color="warn">cancel</mat-icon>
                <mat-card-title>Avoid</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-badge-doc__guide-list">
                  <li>Don't overuse badges - they lose effectiveness</li>
                  <li>Don't show zero counts - hide the badge instead</li>
                  <li>Don't use for decorative purposes</li>
                  <li>Don't use long text in badges</li>
                </ul>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              class="material-badge-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar>accessibility</mat-icon>
                <mat-card-title>Accessibility</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-badge-doc__guide-list">
                  <li>
                    Badges create aria-describedby for the content automatically
                  </li>
                  <li>
                    Use <code>matBadgeDescription</code> for custom screen
                    reader text
                  </li>
                  <li>Ensure sufficient color contrast for badge content</li>
                  <li>Badge content should be meaningful, not decorative</li>
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
      .material-badge-doc {
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

        &__badge-row {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ax-spacing-xl);
          align-items: center;
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
export class MaterialBadgeDocComponent {
  unreadCount = 5;

  toggleUnread(): void {
    this.unreadCount = this.unreadCount === 0 ? 5 : 0;
  }

  basicUsageCode = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `import { MatBadgeModule } from '@angular/material/badge';

@Component({
  imports: [MatBadgeModule],
  template: \`
    <span matBadge="4" matBadgeColor="primary">Text with badge</span>
  \`
})
export class MyComponent {}`,
    },
  ];

  iconButtonCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<button mat-icon-button [matBadge]="5" matBadgeColor="warn">
  <mat-icon>notifications</mat-icon>
</button>

<button mat-icon-button [matBadge]="99" matBadgePosition="below after">
  <mat-icon>mail</mat-icon>
</button>`,
    },
  ];

  conditionalCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<button mat-icon-button
        [matBadge]="unreadCount"
        [matBadgeHidden]="unreadCount === 0">
  <mat-icon>mail</mat-icon>
</button>`,
    },
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `unreadCount = 5;

clearNotifications() {
  this.unreadCount = 0;
}`,
    },
  ];

  badgeTokens: ComponentToken[] = [
    {
      cssVar: '--mat-badge-background-color',
      usage: 'Background color of the badge',
      value: 'var(--ax-brand-default)',
      category: 'Color',
    },
    {
      cssVar: '--mat-badge-text-color',
      usage: 'Text color in the badge',
      value: 'var(--ax-text-inverted)',
      category: 'Color',
    },
    {
      cssVar: '--mat-badge-container-shape',
      usage: 'Border radius of the badge',
      value: 'var(--ax-radius-full)',
      category: 'Shape',
    },
    {
      cssVar: '--mat-badge-container-size',
      usage: 'Size of the badge',
      value: '22px',
      category: 'Size',
    },
  ];
}
