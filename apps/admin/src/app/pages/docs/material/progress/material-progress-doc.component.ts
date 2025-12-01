import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../components/docs';
import { ComponentToken } from '../../../../types/docs.types';

@Component({
  selector: 'app-material-progress-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="material-progress-doc">
      <ax-doc-header
        title="Progress Indicators"
        description="Progress indicators express an unspecified wait time or display the length of a process."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="material-progress-doc__header-links">
          <a
            href="https://material.angular.io/components/progress-bar/overview"
            target="_blank"
            rel="noopener"
            class="material-progress-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
        </div>
      </ax-doc-header>

      <mat-tab-group
        class="material-progress-doc__tabs"
        animationDuration="200ms"
      >
        <mat-tab label="Overview">
          <div class="material-progress-doc__section">
            <h2 class="material-progress-doc__section-title">Progress Bar</h2>

            <h3 class="material-progress-doc__subsection-title">Determinate</h3>
            <ax-live-preview title="Shows specific progress percentage">
              <div class="progress-demo">
                <mat-progress-bar
                  mode="determinate"
                  [value]="50"
                ></mat-progress-bar>
                <span class="progress-label">50%</span>
              </div>
            </ax-live-preview>

            <h3 class="material-progress-doc__subsection-title">
              Indeterminate
            </h3>
            <ax-live-preview title="Unknown duration loading">
              <mat-progress-bar mode="indeterminate"></mat-progress-bar>
            </ax-live-preview>

            <h3 class="material-progress-doc__subsection-title">Buffer</h3>
            <ax-live-preview title="Shows buffered content">
              <mat-progress-bar
                mode="buffer"
                [value]="40"
                [bufferValue]="70"
              ></mat-progress-bar>
            </ax-live-preview>

            <h3 class="material-progress-doc__subsection-title">Query</h3>
            <ax-live-preview title="Pre-loading indicator">
              <mat-progress-bar mode="query"></mat-progress-bar>
            </ax-live-preview>

            <h2
              class="material-progress-doc__section-title"
              style="margin-top: var(--ax-spacing-2xl);"
            >
              Progress Spinner
            </h2>

            <h3 class="material-progress-doc__subsection-title">
              Determinate Spinner
            </h3>
            <ax-live-preview title="Shows specific progress">
              <div class="spinner-row">
                <mat-progress-spinner
                  mode="determinate"
                  [value]="25"
                ></mat-progress-spinner>
                <mat-progress-spinner
                  mode="determinate"
                  [value]="50"
                ></mat-progress-spinner>
                <mat-progress-spinner
                  mode="determinate"
                  [value]="75"
                ></mat-progress-spinner>
                <mat-progress-spinner
                  mode="determinate"
                  [value]="100"
                ></mat-progress-spinner>
              </div>
            </ax-live-preview>

            <h3 class="material-progress-doc__subsection-title">
              Indeterminate Spinner
            </h3>
            <ax-live-preview title="Loading spinner">
              <div class="spinner-row">
                <mat-spinner></mat-spinner>
                <mat-spinner [diameter]="40"></mat-spinner>
                <mat-spinner [diameter]="30"></mat-spinner>
              </div>
            </ax-live-preview>
          </div>
        </mat-tab>

        <mat-tab label="Examples">
          <div class="material-progress-doc__section">
            <h2 class="material-progress-doc__section-title">Usage Examples</h2>
            <ax-code-tabs [tabs]="basicUsageCode" />
          </div>
        </mat-tab>

        <mat-tab label="API">
          <div class="material-progress-doc__section">
            <h2 class="material-progress-doc__section-title">API Reference</h2>
            <mat-card appearance="outlined">
              <mat-card-header
                ><mat-card-title
                  >Progress Bar Properties</mat-card-title
                ></mat-card-header
              >
              <mat-card-content>
                <table class="material-progress-doc__api-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>mode</code></td>
                      <td>
                        <code
                          >'determinate' | 'indeterminate' | 'buffer' |
                          'query'</code
                        >
                      </td>
                      <td>Progress mode</td>
                    </tr>
                    <tr>
                      <td><code>value</code></td>
                      <td><code>number</code></td>
                      <td>Progress value (0-100)</td>
                    </tr>
                    <tr>
                      <td><code>bufferValue</code></td>
                      <td><code>number</code></td>
                      <td>Buffer value for buffer mode</td>
                    </tr>
                    <tr>
                      <td><code>color</code></td>
                      <td><code>'primary' | 'accent' | 'warn'</code></td>
                      <td>Theme color</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              style="margin-top: var(--ax-spacing-md);"
            >
              <mat-card-header
                ><mat-card-title
                  >Progress Spinner Properties</mat-card-title
                ></mat-card-header
              >
              <mat-card-content>
                <table class="material-progress-doc__api-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>mode</code></td>
                      <td><code>'determinate' | 'indeterminate'</code></td>
                      <td>Spinner mode</td>
                    </tr>
                    <tr>
                      <td><code>value</code></td>
                      <td><code>number</code></td>
                      <td>Progress value (0-100)</td>
                    </tr>
                    <tr>
                      <td><code>diameter</code></td>
                      <td><code>number</code></td>
                      <td>Spinner diameter in pixels</td>
                    </tr>
                    <tr>
                      <td><code>strokeWidth</code></td>
                      <td><code>number</code></td>
                      <td>Stroke width in pixels</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="CSS Tokens">
          <div class="material-progress-doc__section">
            <h2 class="material-progress-doc__section-title">Design Tokens</h2>
            <ax-component-tokens [tokens]="progressTokens" />
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .material-progress-doc {
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
        .progress-demo {
          display: flex;
          align-items: center;
          gap: var(--ax-spacing-md);
          mat-progress-bar {
            flex: 1;
          }
          .progress-label {
            font-size: 0.875rem;
            color: var(--ax-text-subtle);
            min-width: 40px;
          }
        }
        .spinner-row {
          display: flex;
          gap: var(--ax-spacing-lg);
          align-items: center;
          flex-wrap: wrap;
        }
      }
    `,
  ],
})
export class MaterialProgressDocComponent {
  basicUsageCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<!-- Progress Bar -->
<mat-progress-bar mode="determinate" [value]="progress"></mat-progress-bar>
<mat-progress-bar mode="indeterminate"></mat-progress-bar>
<mat-progress-bar mode="buffer" [value]="40" [bufferValue]="70"></mat-progress-bar>

<!-- Progress Spinner -->
<mat-progress-spinner mode="determinate" [value]="75"></mat-progress-spinner>
<mat-spinner></mat-spinner>
<mat-spinner [diameter]="40"></mat-spinner>`,
    },
  ];

  progressTokens: ComponentToken[] = [
    {
      cssVar: '--mdc-linear-progress-active-indicator-color',
      usage: 'Progress bar active color',
      value: 'var(--ax-brand-default)',
      category: 'Colors',
    },
    {
      cssVar: '--mdc-linear-progress-track-color',
      usage: 'Progress bar track color',
      value: 'var(--ax-background-subtle)',
      category: 'Background',
    },
    {
      cssVar: '--mdc-circular-progress-active-indicator-color',
      usage: 'Spinner color',
      value: 'var(--ax-brand-default)',
      category: 'Colors',
    },
    {
      cssVar: '--mdc-linear-progress-track-height',
      usage: 'Progress bar height',
      value: '4px',
      category: 'Size',
    },
  ];
}
