import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../components/docs';
import { ComponentToken } from '../../../../types/docs.types';

@Component({
  selector: 'app-material-sidenav-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="material-sidenav-doc">
      <!-- Header -->
      <ax-doc-header
        title="Sidenav"
        description="Side navigation panel for application navigation and menus."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="material-sidenav-doc__header-links">
          <a
            href="https://material.angular.io/components/sidenav/overview"
            target="_blank"
            rel="noopener"
            class="material-sidenav-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
          <a
            href="https://m3.material.io/components/navigation-drawer/overview"
            target="_blank"
            rel="noopener"
            class="material-sidenav-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Material Design 3
          </a>
        </div>
      </ax-doc-header>

      <!-- Tabs -->
      <mat-tab-group
        class="material-sidenav-doc__tabs"
        animationDuration="200ms"
      >
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="material-sidenav-doc__section">
            <h2 class="material-sidenav-doc__section-title">Sidenav Types</h2>
            <p class="material-sidenav-doc__section-description">
              Sidenav provides side navigation for your app. It can be fixed,
              overlay, or push content aside.
            </p>

            <!-- Basic Sidenav -->
            <h3 class="material-sidenav-doc__subsection-title">
              Basic Sidenav
            </h3>
            <ax-live-preview title="Simple sidenav with toggle">
              <div class="sidenav-demo">
                <mat-sidenav-container>
                  <mat-sidenav #sidenav mode="over">
                    <mat-nav-list>
                      <a mat-list-item (click)="sidenav.close()">
                        <mat-icon matListItemIcon>home</mat-icon>
                        Home
                      </a>
                      <a mat-list-item (click)="sidenav.close()">
                        <mat-icon matListItemIcon>person</mat-icon>
                        Profile
                      </a>
                      <a mat-list-item (click)="sidenav.close()">
                        <mat-icon matListItemIcon>settings</mat-icon>
                        Settings
                      </a>
                    </mat-nav-list>
                  </mat-sidenav>
                  <mat-sidenav-content>
                    <button mat-raised-button (click)="sidenav.toggle()">
                      Toggle Sidenav
                    </button>
                  </mat-sidenav-content>
                </mat-sidenav-container>
              </div>
            </ax-live-preview>

            <!-- Mode Demo -->
            <h3 class="material-sidenav-doc__subsection-title">Modes</h3>
            <ax-live-preview title="Different sidenav modes">
              <div class="mode-info">
                <mat-card appearance="outlined">
                  <mat-card-header>
                    <mat-icon mat-card-avatar>layers</mat-icon>
                    <mat-card-title>Over</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    Sidenav floats over the content with a backdrop.
                  </mat-card-content>
                </mat-card>
                <mat-card appearance="outlined">
                  <mat-card-header>
                    <mat-icon mat-card-avatar>swap_horiz</mat-icon>
                    <mat-card-title>Push</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    Sidenav pushes the content aside when opened.
                  </mat-card-content>
                </mat-card>
                <mat-card appearance="outlined">
                  <mat-card-header>
                    <mat-icon mat-card-avatar>view_sidebar</mat-icon>
                    <mat-card-title>Side</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    Sidenav appears side-by-side with content (no backdrop).
                  </mat-card-content>
                </mat-card>
              </div>
            </ax-live-preview>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="material-sidenav-doc__section">
            <h2 class="material-sidenav-doc__section-title">Usage Examples</h2>

            <!-- Basic Usage -->
            <h3 class="material-sidenav-doc__subsection-title">Basic Usage</h3>
            <ax-code-tabs [tabs]="basicUsageCode" />

            <!-- Responsive -->
            <h3 class="material-sidenav-doc__subsection-title">
              Responsive Sidenav
            </h3>
            <ax-code-tabs [tabs]="responsiveCode" />

            <!-- With Router -->
            <h3 class="material-sidenav-doc__subsection-title">With Router</h3>
            <ax-code-tabs [tabs]="routerCode" />
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="material-sidenav-doc__section">
            <h2 class="material-sidenav-doc__section-title">API Reference</h2>

            <mat-card
              appearance="outlined"
              class="material-sidenav-doc__api-card"
            >
              <mat-card-header>
                <mat-card-title>MatSidenav Properties</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="material-sidenav-doc__api-table">
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
                      <td><code>mode</code></td>
                      <td><code>'over' | 'push' | 'side'</code></td>
                      <td><code>'over'</code></td>
                      <td>How sidenav interacts with content</td>
                    </tr>
                    <tr>
                      <td><code>opened</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Whether sidenav is open</td>
                    </tr>
                    <tr>
                      <td><code>position</code></td>
                      <td><code>'start' | 'end'</code></td>
                      <td><code>'start'</code></td>
                      <td>Position of the sidenav</td>
                    </tr>
                    <tr>
                      <td><code>fixedInViewport</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Fixed position in viewport</td>
                    </tr>
                    <tr>
                      <td><code>disableClose</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Disable closing via backdrop</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              class="material-sidenav-doc__api-card"
            >
              <mat-card-header>
                <mat-card-title>Methods</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="material-sidenav-doc__api-table">
                  <thead>
                    <tr>
                      <th>Method</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>open()</code></td>
                      <td>Opens the sidenav</td>
                    </tr>
                    <tr>
                      <td><code>close()</code></td>
                      <td>Closes the sidenav</td>
                    </tr>
                    <tr>
                      <td><code>toggle()</code></td>
                      <td>Toggles sidenav open/closed</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- CSS Tokens Tab -->
        <mat-tab label="CSS Tokens">
          <div class="material-sidenav-doc__section">
            <h2 class="material-sidenav-doc__section-title">Design Tokens</h2>
            <p class="material-sidenav-doc__section-description">
              AegisX overrides these tokens for sidenav styling.
            </p>
            <ax-component-tokens [tokens]="sidenavTokens" />
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="material-sidenav-doc__section">
            <h2 class="material-sidenav-doc__section-title">
              Usage Guidelines
            </h2>

            <mat-card
              appearance="outlined"
              class="material-sidenav-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar>check_circle</mat-icon>
                <mat-card-title>When to Use</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-sidenav-doc__guide-list">
                  <li>
                    <strong>Main navigation:</strong> Primary app navigation
                  </li>
                  <li>
                    <strong>Secondary menus:</strong> Feature-specific menus
                  </li>
                  <li>
                    <strong>Mobile navigation:</strong> Hamburger menu on mobile
                  </li>
                  <li>
                    <strong>Settings panels:</strong> Configuration drawers
                  </li>
                </ul>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              class="material-sidenav-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar color="warn">cancel</mat-icon>
                <mat-card-title>Avoid</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-sidenav-doc__guide-list">
                  <li>Don't use for temporary content (use dialog instead)</li>
                  <li>Don't nest multiple sidenavs</li>
                  <li>
                    Don't use 'side' mode on mobile without responsive logic
                  </li>
                  <li>Don't put critical actions only in sidenav</li>
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
      .material-sidenav-doc {
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

      .sidenav-demo {
        height: 200px;
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-md);
        overflow: hidden;

        mat-sidenav-container {
          height: 100%;
        }

        mat-sidenav {
          width: 200px;
        }

        mat-sidenav-content {
          padding: var(--ax-spacing-md);
        }
      }

      .mode-info {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--ax-spacing-md);
      }
    `,
  ],
})
export class MaterialSidenavDocComponent {
  basicUsageCode = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  imports: [MatSidenavModule],
  template: \`
    <mat-sidenav-container>
      <mat-sidenav #sidenav mode="over">
        Sidenav content
      </mat-sidenav>
      <mat-sidenav-content>
        <button (click)="sidenav.toggle()">Toggle</button>
        Main content
      </mat-sidenav-content>
    </mat-sidenav-container>
  \`
})
export class MyComponent {}`,
    },
  ];

  responsiveCode = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({...})
export class MyComponent {
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$ = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));
}`,
    },
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<mat-sidenav-container>
  <mat-sidenav #sidenav
    [mode]="(isHandset$ | async) ? 'over' : 'side'"
    [opened]="!(isHandset$ | async)">
    Navigation
  </mat-sidenav>
  <mat-sidenav-content>
    Content
  </mat-sidenav-content>
</mat-sidenav-container>`,
    },
  ];

  routerCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<mat-sidenav-container>
  <mat-sidenav #sidenav mode="side" opened>
    <mat-nav-list>
      <a mat-list-item routerLink="/home" routerLinkActive="active">
        <mat-icon matListItemIcon>home</mat-icon>
        Home
      </a>
      <a mat-list-item routerLink="/profile" routerLinkActive="active">
        <mat-icon matListItemIcon>person</mat-icon>
        Profile
      </a>
    </mat-nav-list>
  </mat-sidenav>
  <mat-sidenav-content>
    <router-outlet></router-outlet>
  </mat-sidenav-content>
</mat-sidenav-container>`,
    },
  ];

  sidenavTokens: ComponentToken[] = [
    {
      cssVar: '--mat-sidenav-container-background-color',
      usage: 'Sidenav background color',
      value: 'var(--ax-background-default)',
      category: 'Color',
    },
    {
      cssVar: '--mat-sidenav-container-divider-color',
      usage: 'Divider between sidenav and content',
      value: 'var(--ax-border-default)',
      category: 'Color',
    },
    {
      cssVar: '--mat-sidenav-scrim-color',
      usage: 'Backdrop/scrim color',
      value: 'rgba(0, 0, 0, 0.32)',
      category: 'Color',
    },
  ];
}
