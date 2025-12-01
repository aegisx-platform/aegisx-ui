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
  selector: 'app-material-tabs-doc',
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
    <div class="material-tabs-doc">
      <ax-doc-header
        title="Tabs"
        description="Tabs organize content across different screens, data sets, or interactions."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="material-tabs-doc__header-links">
          <a
            href="https://material.angular.io/components/tabs/overview"
            target="_blank"
            rel="noopener"
            class="material-tabs-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
        </div>
      </ax-doc-header>

      <mat-tab-group
        class="material-tabs-doc__main-tabs"
        animationDuration="200ms"
      >
        <mat-tab label="Overview">
          <div class="material-tabs-doc__section">
            <h2 class="material-tabs-doc__section-title">Tab Variants</h2>

            <h3 class="material-tabs-doc__subsection-title">Basic Tabs</h3>
            <ax-live-preview title="Simple tab group">
              <mat-tab-group>
                <mat-tab label="First">Content for first tab</mat-tab>
                <mat-tab label="Second">Content for second tab</mat-tab>
                <mat-tab label="Third">Content for third tab</mat-tab>
              </mat-tab-group>
            </ax-live-preview>

            <h3 class="material-tabs-doc__subsection-title">Tabs with Icons</h3>
            <ax-live-preview title="Tabs with icon labels">
              <mat-tab-group>
                <mat-tab>
                  <ng-template mat-tab-label>
                    <mat-icon>home</mat-icon>
                    Home
                  </ng-template>
                  Home content
                </mat-tab>
                <mat-tab>
                  <ng-template mat-tab-label>
                    <mat-icon>favorite</mat-icon>
                    Favorites
                  </ng-template>
                  Favorites content
                </mat-tab>
                <mat-tab>
                  <ng-template mat-tab-label>
                    <mat-icon>settings</mat-icon>
                    Settings
                  </ng-template>
                  Settings content
                </mat-tab>
              </mat-tab-group>
            </ax-live-preview>

            <h3 class="material-tabs-doc__subsection-title">Stretched Tabs</h3>
            <ax-live-preview title="Tabs that fill container width">
              <mat-tab-group mat-stretch-tabs="true">
                <mat-tab label="Tab 1">Content 1</mat-tab>
                <mat-tab label="Tab 2">Content 2</mat-tab>
                <mat-tab label="Tab 3">Content 3</mat-tab>
              </mat-tab-group>
            </ax-live-preview>

            <h3 class="material-tabs-doc__subsection-title">Tab Navigation</h3>
            <ax-live-preview title="Navigation-style tabs">
              <nav mat-tab-nav-bar>
                @for (link of navLinks; track link) {
                  <a
                    mat-tab-link
                    [active]="activeLink === link"
                    (click)="activeLink = link"
                  >
                    {{ link }}
                  </a>
                }
              </nav>
            </ax-live-preview>
          </div>
        </mat-tab>

        <mat-tab label="Examples">
          <div class="material-tabs-doc__section">
            <h2 class="material-tabs-doc__section-title">Usage Examples</h2>
            <ax-code-tabs [tabs]="basicUsageCode" />
          </div>
        </mat-tab>

        <mat-tab label="API">
          <div class="material-tabs-doc__section">
            <h2 class="material-tabs-doc__section-title">API Reference</h2>
            <mat-card appearance="outlined">
              <mat-card-header
                ><mat-card-title
                  >Tab Components</mat-card-title
                ></mat-card-header
              >
              <mat-card-content>
                <table class="material-tabs-doc__api-table">
                  <thead>
                    <tr>
                      <th>Component</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>mat-tab-group</code></td>
                      <td>Container for tabs</td>
                    </tr>
                    <tr>
                      <td><code>mat-tab</code></td>
                      <td>Individual tab</td>
                    </tr>
                    <tr>
                      <td><code>mat-tab-nav-bar</code></td>
                      <td>Navigation-style tabs</td>
                    </tr>
                    <tr>
                      <td><code>mat-tab-link</code></td>
                      <td>Navigation tab link</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="CSS Tokens">
          <div class="material-tabs-doc__section">
            <h2 class="material-tabs-doc__section-title">Design Tokens</h2>
            <ax-component-tokens [tokens]="tabsTokens" />
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .material-tabs-doc {
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
        &__main-tabs {
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
export class MaterialTabsDocComponent {
  navLinks = ['Home', 'Dashboard', 'Settings'];
  activeLink = 'Home';

  basicUsageCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<mat-tab-group>
  <mat-tab label="First">First tab content</mat-tab>
  <mat-tab label="Second">Second tab content</mat-tab>
  <mat-tab label="Third">Third tab content</mat-tab>
</mat-tab-group>

<!-- With icons -->
<mat-tab-group>
  <mat-tab>
    <ng-template mat-tab-label>
      <mat-icon>home</mat-icon>
      Home
    </ng-template>
    Content here
  </mat-tab>
</mat-tab-group>`,
    },
  ];

  tabsTokens: ComponentToken[] = [
    {
      cssVar: '--mdc-secondary-navigation-tab-container-height',
      usage: 'Tab bar height',
      value: '48px',
      category: 'Size',
    },
    {
      cssVar: '--mat-tab-header-active-label-text-color',
      usage: 'Active tab color',
      value: 'var(--ax-brand-default)',
      category: 'Colors',
    },
    {
      cssVar: '--mat-tab-header-inactive-label-text-color',
      usage: 'Inactive tab color',
      value: 'var(--ax-text-subtle)',
      category: 'Colors',
    },
  ];
}
