import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../components/docs';
import { ComponentToken } from '../../../../types/docs.types';

@Component({
  selector: 'app-material-slide-toggle-doc',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSlideToggleModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="material-slide-toggle-doc">
      <!-- Header -->
      <ax-doc-header
        title="Slide Toggle"
        description="Toggle switch for on/off states, similar to mobile switches."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="material-slide-toggle-doc__header-links">
          <a
            href="https://material.angular.io/components/slide-toggle/overview"
            target="_blank"
            rel="noopener"
            class="material-slide-toggle-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
          <a
            href="https://m3.material.io/components/switch/overview"
            target="_blank"
            rel="noopener"
            class="material-slide-toggle-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Material Design 3
          </a>
        </div>
      </ax-doc-header>

      <!-- Tabs -->
      <mat-tab-group
        class="material-slide-toggle-doc__tabs"
        animationDuration="200ms"
      >
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="material-slide-toggle-doc__section">
            <h2 class="material-slide-toggle-doc__section-title">
              Slide Toggle Types
            </h2>
            <p class="material-slide-toggle-doc__section-description">
              Slide toggles are on/off switches for binary settings. They
              provide immediate feedback and are touch-friendly.
            </p>

            <!-- Basic Toggle -->
            <h3 class="material-slide-toggle-doc__subsection-title">
              Basic Toggle
            </h3>
            <ax-live-preview title="Simple on/off toggle">
              <mat-slide-toggle [(ngModel)]="isEnabled">
                {{ isEnabled ? 'Enabled' : 'Disabled' }}
              </mat-slide-toggle>
            </ax-live-preview>

            <!-- Color Variants -->
            <h3 class="material-slide-toggle-doc__subsection-title">Colors</h3>
            <ax-live-preview title="Different color options">
              <div class="toggle-row">
                <mat-slide-toggle color="primary" [checked]="true"
                  >Primary</mat-slide-toggle
                >
                <mat-slide-toggle color="accent" [checked]="true"
                  >Accent</mat-slide-toggle
                >
                <mat-slide-toggle color="warn" [checked]="true"
                  >Warn</mat-slide-toggle
                >
              </div>
            </ax-live-preview>

            <!-- Label Position -->
            <h3 class="material-slide-toggle-doc__subsection-title">
              Label Position
            </h3>
            <ax-live-preview title="Labels before or after">
              <div class="toggle-row">
                <mat-slide-toggle labelPosition="before"
                  >Label before</mat-slide-toggle
                >
                <mat-slide-toggle labelPosition="after"
                  >Label after</mat-slide-toggle
                >
              </div>
            </ax-live-preview>

            <!-- Disabled State -->
            <h3 class="material-slide-toggle-doc__subsection-title">
              Disabled
            </h3>
            <ax-live-preview title="Disabled toggles">
              <div class="toggle-row">
                <mat-slide-toggle [disabled]="true"
                  >Disabled off</mat-slide-toggle
                >
                <mat-slide-toggle [disabled]="true" [checked]="true"
                  >Disabled on</mat-slide-toggle
                >
              </div>
            </ax-live-preview>

            <!-- Settings Example -->
            <h3 class="material-slide-toggle-doc__subsection-title">
              Settings Example
            </h3>
            <ax-live-preview title="Typical settings usage">
              <mat-card appearance="outlined" class="settings-card">
                <mat-card-content>
                  <div class="setting-item">
                    <div>
                      <div class="setting-label">Dark Mode</div>
                      <div class="setting-description">
                        Enable dark theme across the app
                      </div>
                    </div>
                    <mat-slide-toggle [(ngModel)]="darkMode"></mat-slide-toggle>
                  </div>
                  <div class="setting-item">
                    <div>
                      <div class="setting-label">Notifications</div>
                      <div class="setting-description">
                        Receive push notifications
                      </div>
                    </div>
                    <mat-slide-toggle
                      [(ngModel)]="notifications"
                    ></mat-slide-toggle>
                  </div>
                  <div class="setting-item">
                    <div>
                      <div class="setting-label">Auto-save</div>
                      <div class="setting-description">
                        Automatically save changes
                      </div>
                    </div>
                    <mat-slide-toggle [(ngModel)]="autoSave"></mat-slide-toggle>
                  </div>
                </mat-card-content>
              </mat-card>
            </ax-live-preview>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="material-slide-toggle-doc__section">
            <h2 class="material-slide-toggle-doc__section-title">
              Usage Examples
            </h2>

            <!-- Basic Usage -->
            <h3 class="material-slide-toggle-doc__subsection-title">
              Basic Usage
            </h3>
            <ax-code-tabs [tabs]="basicUsageCode" />

            <!-- With Forms -->
            <h3 class="material-slide-toggle-doc__subsection-title">
              With Forms
            </h3>
            <ax-code-tabs [tabs]="formsCode" />

            <!-- Change Event -->
            <h3 class="material-slide-toggle-doc__subsection-title">
              Change Event
            </h3>
            <ax-code-tabs [tabs]="eventCode" />
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="material-slide-toggle-doc__section">
            <h2 class="material-slide-toggle-doc__section-title">
              API Reference
            </h2>

            <mat-card
              appearance="outlined"
              class="material-slide-toggle-doc__api-card"
            >
              <mat-card-header>
                <mat-card-title>Input Properties</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="material-slide-toggle-doc__api-table">
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
                      <td><code>checked</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Whether toggle is on</td>
                    </tr>
                    <tr>
                      <td><code>color</code></td>
                      <td><code>'primary' | 'accent' | 'warn'</code></td>
                      <td><code>'accent'</code></td>
                      <td>Theme color</td>
                    </tr>
                    <tr>
                      <td><code>disabled</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Disables the toggle</td>
                    </tr>
                    <tr>
                      <td><code>labelPosition</code></td>
                      <td><code>'before' | 'after'</code></td>
                      <td><code>'after'</code></td>
                      <td>Label position</td>
                    </tr>
                    <tr>
                      <td><code>hideIcon</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Hide the check/x icon</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              class="material-slide-toggle-doc__api-card"
            >
              <mat-card-header>
                <mat-card-title>Output Events</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="material-slide-toggle-doc__api-table">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>change</code></td>
                      <td><code>MatSlideToggleChange</code></td>
                      <td>Emits when checked state changes</td>
                    </tr>
                    <tr>
                      <td><code>toggleChange</code></td>
                      <td><code>void</code></td>
                      <td>Emits on toggle interaction</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- CSS Tokens Tab -->
        <mat-tab label="CSS Tokens">
          <div class="material-slide-toggle-doc__section">
            <h2 class="material-slide-toggle-doc__section-title">
              Design Tokens
            </h2>
            <p class="material-slide-toggle-doc__section-description">
              AegisX overrides these tokens for slide toggle styling.
            </p>
            <ax-component-tokens [tokens]="toggleTokens" />
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="material-slide-toggle-doc__section">
            <h2 class="material-slide-toggle-doc__section-title">
              Usage Guidelines
            </h2>

            <mat-card
              appearance="outlined"
              class="material-slide-toggle-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar>check_circle</mat-icon>
                <mat-card-title>When to Use</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-slide-toggle-doc__guide-list">
                  <li><strong>Settings:</strong> Enable/disable features</li>
                  <li><strong>Preferences:</strong> Binary user preferences</li>
                  <li>
                    <strong>Immediate effect:</strong> Changes that apply
                    instantly
                  </li>
                  <li>
                    <strong>Mobile-friendly:</strong> Touch-optimized interfaces
                  </li>
                </ul>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              class="material-slide-toggle-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar color="warn">cancel</mat-icon>
                <mat-card-title>Avoid</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-slide-toggle-doc__guide-list">
                  <li>
                    Don't use in forms that require submission (use checkbox)
                  </li>
                  <li>Don't use for multi-select scenarios</li>
                  <li>Don't use when action requires confirmation</li>
                  <li>Don't mix with checkboxes in same context</li>
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
      .material-slide-toggle-doc {
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

      .toggle-row {
        display: flex;
        flex-wrap: wrap;
        gap: var(--ax-spacing-xl);
      }

      .settings-card {
        max-width: 400px;
      }

      .setting-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--ax-spacing-sm) 0;

        &:not(:last-child) {
          border-bottom: 1px solid var(--ax-border-muted);
        }
      }

      .setting-label {
        font-weight: 500;
        color: var(--ax-text-strong);
      }

      .setting-description {
        font-size: 0.8125rem;
        color: var(--ax-text-subtle);
      }
    `,
  ],
})
export class MaterialSlideToggleDocComponent {
  isEnabled = true;
  darkMode = false;
  notifications = true;
  autoSave = true;

  basicUsageCode = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  imports: [MatSlideToggleModule],
  template: \`
    <mat-slide-toggle [(ngModel)]="isEnabled">
      Enable feature
    </mat-slide-toggle>
  \`
})
export class MyComponent {
  isEnabled = false;
}`,
    },
  ];

  formsCode = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [MatSlideToggleModule, ReactiveFormsModule],
  template: \`
    <mat-slide-toggle [formControl]="toggleControl">
      Accept terms
    </mat-slide-toggle>
  \`
})
export class MyComponent {
  toggleControl = new FormControl(false);
}`,
    },
  ];

  eventCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<mat-slide-toggle (change)="onToggleChange($event)">
  Toggle me
</mat-slide-toggle>`,
    },
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `import { MatSlideToggleChange } from '@angular/material/slide-toggle';

onToggleChange(event: MatSlideToggleChange) {
  console.log('Checked:', event.checked);
  // Perform action based on new state
}`,
    },
  ];

  toggleTokens: ComponentToken[] = [
    {
      cssVar: '--mdc-switch-selected-track-color',
      usage: 'Track color when on',
      value: 'var(--ax-brand-default)',
      category: 'Color',
    },
    {
      cssVar: '--mdc-switch-unselected-track-color',
      usage: 'Track color when off',
      value: 'var(--ax-background-emphasis)',
      category: 'Color',
    },
    {
      cssVar: '--mdc-switch-selected-handle-color',
      usage: 'Handle color when on',
      value: 'var(--ax-text-inverted)',
      category: 'Color',
    },
    {
      cssVar: '--mdc-switch-track-shape',
      usage: 'Track border radius',
      value: 'var(--ax-radius-full)',
      category: 'Shape',
    },
  ];
}
