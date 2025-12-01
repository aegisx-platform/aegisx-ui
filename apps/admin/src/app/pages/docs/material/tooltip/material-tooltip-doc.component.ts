import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../components/docs';
import { ComponentToken } from '../../../../types/docs.types';

@Component({
  selector: 'app-material-tooltip-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="material-tooltip-doc">
      <ax-doc-header
        title="Tooltip"
        description="Tooltips display informative text when users hover over or focus on an element."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="material-tooltip-doc__header-links">
          <a
            href="https://material.angular.io/components/tooltip/overview"
            target="_blank"
            rel="noopener"
            class="material-tooltip-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
        </div>
      </ax-doc-header>

      <mat-tab-group
        class="material-tooltip-doc__tabs"
        animationDuration="200ms"
      >
        <mat-tab label="Overview">
          <div class="material-tooltip-doc__section">
            <h2 class="material-tooltip-doc__section-title">
              Tooltip Positions
            </h2>

            <h3 class="material-tooltip-doc__subsection-title">
              Basic Positions
            </h3>
            <ax-live-preview title="Tooltip placement options">
              <div class="tooltip-row">
                <button
                  mat-raised-button
                  matTooltip="Above tooltip"
                  matTooltipPosition="above"
                >
                  Above
                </button>
                <button
                  mat-raised-button
                  matTooltip="Below tooltip"
                  matTooltipPosition="below"
                >
                  Below
                </button>
                <button
                  mat-raised-button
                  matTooltip="Left tooltip"
                  matTooltipPosition="left"
                >
                  Left
                </button>
                <button
                  mat-raised-button
                  matTooltip="Right tooltip"
                  matTooltipPosition="right"
                >
                  Right
                </button>
              </div>
            </ax-live-preview>

            <h3 class="material-tooltip-doc__subsection-title">On Icons</h3>
            <ax-live-preview title="Tooltips on icon buttons">
              <div class="tooltip-row">
                <button mat-icon-button matTooltip="Edit item">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button matTooltip="Delete item">
                  <mat-icon>delete</mat-icon>
                </button>
                <button mat-icon-button matTooltip="Share item">
                  <mat-icon>share</mat-icon>
                </button>
                <button mat-icon-button matTooltip="More options">
                  <mat-icon>more_vert</mat-icon>
                </button>
              </div>
            </ax-live-preview>

            <h3 class="material-tooltip-doc__subsection-title">With Delay</h3>
            <ax-live-preview title="Show/hide delay configuration">
              <div class="tooltip-row">
                <button
                  mat-stroked-button
                  matTooltip="Appears after 500ms"
                  [matTooltipShowDelay]="500"
                >
                  Show Delay (500ms)
                </button>
                <button
                  mat-stroked-button
                  matTooltip="Stays visible longer"
                  [matTooltipHideDelay]="1000"
                >
                  Hide Delay (1000ms)
                </button>
              </div>
            </ax-live-preview>

            <h3 class="material-tooltip-doc__subsection-title">
              Disabled State
            </h3>
            <ax-live-preview title="Conditionally disable tooltip">
              <div class="tooltip-row">
                <button
                  mat-flat-button
                  color="primary"
                  matTooltip="This tooltip is enabled"
                  [matTooltipDisabled]="false"
                >
                  Enabled Tooltip
                </button>
                <button
                  mat-flat-button
                  matTooltip="This tooltip is disabled"
                  [matTooltipDisabled]="true"
                >
                  Disabled Tooltip
                </button>
              </div>
            </ax-live-preview>
          </div>
        </mat-tab>

        <mat-tab label="Examples">
          <div class="material-tooltip-doc__section">
            <h2 class="material-tooltip-doc__section-title">Usage Examples</h2>
            <ax-code-tabs [tabs]="basicUsageCode" />
          </div>
        </mat-tab>

        <mat-tab label="API">
          <div class="material-tooltip-doc__section">
            <h2 class="material-tooltip-doc__section-title">API Reference</h2>
            <mat-card appearance="outlined">
              <mat-card-header
                ><mat-card-title
                  >Tooltip Properties</mat-card-title
                ></mat-card-header
              >
              <mat-card-content>
                <table class="material-tooltip-doc__api-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>matTooltip</code></td>
                      <td><code>string</code></td>
                      <td>Tooltip message text</td>
                    </tr>
                    <tr>
                      <td><code>matTooltipPosition</code></td>
                      <td><code>'above' | 'below' | 'left' | 'right'</code></td>
                      <td>Tooltip position</td>
                    </tr>
                    <tr>
                      <td><code>matTooltipShowDelay</code></td>
                      <td><code>number</code></td>
                      <td>Show delay in ms</td>
                    </tr>
                    <tr>
                      <td><code>matTooltipHideDelay</code></td>
                      <td><code>number</code></td>
                      <td>Hide delay in ms</td>
                    </tr>
                    <tr>
                      <td><code>matTooltipDisabled</code></td>
                      <td><code>boolean</code></td>
                      <td>Disable tooltip</td>
                    </tr>
                    <tr>
                      <td><code>matTooltipClass</code></td>
                      <td><code>string</code></td>
                      <td>Custom CSS class</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="CSS Tokens">
          <div class="material-tooltip-doc__section">
            <h2 class="material-tooltip-doc__section-title">Design Tokens</h2>
            <ax-component-tokens [tokens]="tooltipTokens" />
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .material-tooltip-doc {
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
        .tooltip-row {
          display: flex;
          gap: var(--ax-spacing-md);
          flex-wrap: wrap;
        }
      }
    `,
  ],
})
export class MaterialTooltipDocComponent {
  basicUsageCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<!-- Basic tooltip -->
<button mat-button matTooltip="Info about this action">
  Action
</button>

<!-- With position -->
<button mat-button
        matTooltip="Appears above"
        matTooltipPosition="above">
  Above
</button>

<!-- With delay -->
<button mat-button
        matTooltip="Delayed tooltip"
        [matTooltipShowDelay]="500"
        [matTooltipHideDelay]="1000">
  Delayed
</button>

<!-- On icon button -->
<button mat-icon-button matTooltip="Settings">
  <mat-icon>settings</mat-icon>
</button>`,
    },
  ];

  tooltipTokens: ComponentToken[] = [
    {
      cssVar: '--mdc-plain-tooltip-container-color',
      usage: 'Background color',
      value: 'var(--ax-background-inverse)',
      category: 'Background',
    },
    {
      cssVar: '--mdc-plain-tooltip-supporting-text-color',
      usage: 'Text color',
      value: 'var(--ax-text-inverse)',
      category: 'Text',
    },
    {
      cssVar: '--mdc-plain-tooltip-container-shape',
      usage: 'Border radius',
      value: 'var(--ax-radius-sm)',
      category: 'Shape',
    },
    {
      cssVar: '--mdc-plain-tooltip-supporting-text-size',
      usage: 'Font size',
      value: '0.75rem',
      category: 'Typography',
    },
  ];
}
