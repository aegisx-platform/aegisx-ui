import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../components/docs';
import { ComponentToken } from '../../../../types/docs.types';

@Component({
  selector: 'app-material-button-toggle-doc',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatButtonToggleModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="material-button-toggle-doc">
      <ax-doc-header
        title="Button Toggle"
        description="Button toggles are groups of related options that can be selected exclusively or multiple."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="material-button-toggle-doc__header-links">
          <a
            href="https://material.angular.io/components/button-toggle/overview"
            target="_blank"
            rel="noopener"
            class="material-button-toggle-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
        </div>
      </ax-doc-header>

      <mat-tab-group
        class="material-button-toggle-doc__tabs"
        animationDuration="200ms"
      >
        <mat-tab label="Overview">
          <div class="material-button-toggle-doc__section">
            <h2 class="material-button-toggle-doc__section-title">
              Button Toggle Types
            </h2>

            <h3 class="material-button-toggle-doc__subsection-title">
              Exclusive Selection
            </h3>
            <ax-live-preview title="Single selection toggle group">
              <mat-button-toggle-group [(ngModel)]="selectedAlignment">
                <mat-button-toggle value="left">
                  <mat-icon>format_align_left</mat-icon>
                </mat-button-toggle>
                <mat-button-toggle value="center">
                  <mat-icon>format_align_center</mat-icon>
                </mat-button-toggle>
                <mat-button-toggle value="right">
                  <mat-icon>format_align_right</mat-icon>
                </mat-button-toggle>
                <mat-button-toggle value="justify">
                  <mat-icon>format_align_justify</mat-icon>
                </mat-button-toggle>
              </mat-button-toggle-group>
              <span class="selection-label"
                >Selected: {{ selectedAlignment }}</span
              >
            </ax-live-preview>

            <h3 class="material-button-toggle-doc__subsection-title">
              Multiple Selection
            </h3>
            <ax-live-preview title="Multiple options can be selected">
              <mat-button-toggle-group multiple [(ngModel)]="selectedFormats">
                <mat-button-toggle value="bold">
                  <mat-icon>format_bold</mat-icon>
                </mat-button-toggle>
                <mat-button-toggle value="italic">
                  <mat-icon>format_italic</mat-icon>
                </mat-button-toggle>
                <mat-button-toggle value="underline">
                  <mat-icon>format_underlined</mat-icon>
                </mat-button-toggle>
                <mat-button-toggle value="strikethrough">
                  <mat-icon>strikethrough_s</mat-icon>
                </mat-button-toggle>
              </mat-button-toggle-group>
              <span class="selection-label"
                >Selected: {{ selectedFormats.join(', ') || 'none' }}</span
              >
            </ax-live-preview>

            <h3 class="material-button-toggle-doc__subsection-title">
              With Text Labels
            </h3>
            <ax-live-preview title="Toggle buttons with text">
              <mat-button-toggle-group [(ngModel)]="selectedView">
                <mat-button-toggle value="day">Day</mat-button-toggle>
                <mat-button-toggle value="week">Week</mat-button-toggle>
                <mat-button-toggle value="month">Month</mat-button-toggle>
                <mat-button-toggle value="year">Year</mat-button-toggle>
              </mat-button-toggle-group>
            </ax-live-preview>

            <h3 class="material-button-toggle-doc__subsection-title">
              Appearance Variants
            </h3>
            <ax-live-preview title="Standard and legacy appearance">
              <div class="toggle-stack">
                <div class="toggle-row">
                  <span class="toggle-label">Standard:</span>
                  <mat-button-toggle-group appearance="standard">
                    <mat-button-toggle value="a">Option A</mat-button-toggle>
                    <mat-button-toggle value="b">Option B</mat-button-toggle>
                    <mat-button-toggle value="c">Option C</mat-button-toggle>
                  </mat-button-toggle-group>
                </div>
                <div class="toggle-row">
                  <span class="toggle-label">Legacy:</span>
                  <mat-button-toggle-group appearance="legacy">
                    <mat-button-toggle value="a">Option A</mat-button-toggle>
                    <mat-button-toggle value="b">Option B</mat-button-toggle>
                    <mat-button-toggle value="c">Option C</mat-button-toggle>
                  </mat-button-toggle-group>
                </div>
              </div>
            </ax-live-preview>

            <h3 class="material-button-toggle-doc__subsection-title">
              Disabled State
            </h3>
            <ax-live-preview
              title="Disabled toggle group and individual toggles"
            >
              <div class="toggle-stack">
                <mat-button-toggle-group disabled>
                  <mat-button-toggle value="a">Disabled A</mat-button-toggle>
                  <mat-button-toggle value="b">Disabled B</mat-button-toggle>
                </mat-button-toggle-group>
                <mat-button-toggle-group>
                  <mat-button-toggle value="enabled">Enabled</mat-button-toggle>
                  <mat-button-toggle value="disabled" disabled
                    >Disabled</mat-button-toggle
                  >
                  <mat-button-toggle value="enabled2"
                    >Enabled</mat-button-toggle
                  >
                </mat-button-toggle-group>
              </div>
            </ax-live-preview>

            <h3 class="material-button-toggle-doc__subsection-title">
              Vertical Orientation
            </h3>
            <ax-live-preview title="Vertical button toggle group">
              <mat-button-toggle-group vertical [(ngModel)]="selectedSize">
                <mat-button-toggle value="small">Small</mat-button-toggle>
                <mat-button-toggle value="medium">Medium</mat-button-toggle>
                <mat-button-toggle value="large">Large</mat-button-toggle>
              </mat-button-toggle-group>
            </ax-live-preview>
          </div>
        </mat-tab>

        <mat-tab label="Examples">
          <div class="material-button-toggle-doc__section">
            <h2 class="material-button-toggle-doc__section-title">
              Usage Examples
            </h2>
            <ax-code-tabs [tabs]="basicUsageCode" />
          </div>
        </mat-tab>

        <mat-tab label="API">
          <div class="material-button-toggle-doc__section">
            <h2 class="material-button-toggle-doc__section-title">
              API Reference
            </h2>
            <mat-card appearance="outlined">
              <mat-card-header
                ><mat-card-title
                  >Button Toggle Group Properties</mat-card-title
                ></mat-card-header
              >
              <mat-card-content>
                <table class="material-button-toggle-doc__api-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>multiple</code></td>
                      <td><code>boolean</code></td>
                      <td>Allow multiple selections</td>
                    </tr>
                    <tr>
                      <td><code>vertical</code></td>
                      <td><code>boolean</code></td>
                      <td>Vertical orientation</td>
                    </tr>
                    <tr>
                      <td><code>appearance</code></td>
                      <td><code>'standard' | 'legacy'</code></td>
                      <td>Visual style</td>
                    </tr>
                    <tr>
                      <td><code>disabled</code></td>
                      <td><code>boolean</code></td>
                      <td>Disable entire group</td>
                    </tr>
                    <tr>
                      <td><code>value</code></td>
                      <td><code>any</code></td>
                      <td>Selected value(s)</td>
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
                  >Button Toggle Properties</mat-card-title
                ></mat-card-header
              >
              <mat-card-content>
                <table class="material-button-toggle-doc__api-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>value</code></td>
                      <td><code>any</code></td>
                      <td>Toggle value</td>
                    </tr>
                    <tr>
                      <td><code>disabled</code></td>
                      <td><code>boolean</code></td>
                      <td>Disable toggle</td>
                    </tr>
                    <tr>
                      <td><code>checked</code></td>
                      <td><code>boolean</code></td>
                      <td>Whether selected</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="CSS Tokens">
          <div class="material-button-toggle-doc__section">
            <h2 class="material-button-toggle-doc__section-title">
              Design Tokens
            </h2>
            <ax-component-tokens [tokens]="buttonToggleTokens" />
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .material-button-toggle-doc {
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
        .selection-label {
          margin-left: var(--ax-spacing-md);
          font-size: 0.875rem;
          color: var(--ax-text-subtle);
        }
        .toggle-stack {
          display: flex;
          flex-direction: column;
          gap: var(--ax-spacing-md);
        }
        .toggle-row {
          display: flex;
          align-items: center;
          gap: var(--ax-spacing-md);
          .toggle-label {
            min-width: 80px;
            font-size: 0.875rem;
            color: var(--ax-text-subtle);
          }
        }
      }
    `,
  ],
})
export class MaterialButtonToggleDocComponent {
  selectedAlignment = 'left';
  selectedFormats: string[] = [];
  selectedView = 'week';
  selectedSize = 'medium';

  basicUsageCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<!-- Exclusive Selection -->
<mat-button-toggle-group [(ngModel)]="alignment">
  <mat-button-toggle value="left">
    <mat-icon>format_align_left</mat-icon>
  </mat-button-toggle>
  <mat-button-toggle value="center">
    <mat-icon>format_align_center</mat-icon>
  </mat-button-toggle>
  <mat-button-toggle value="right">
    <mat-icon>format_align_right</mat-icon>
  </mat-button-toggle>
</mat-button-toggle-group>

<!-- Multiple Selection -->
<mat-button-toggle-group multiple [(ngModel)]="formats">
  <mat-button-toggle value="bold">Bold</mat-button-toggle>
  <mat-button-toggle value="italic">Italic</mat-button-toggle>
  <mat-button-toggle value="underline">Underline</mat-button-toggle>
</mat-button-toggle-group>

<!-- With Text Labels -->
<mat-button-toggle-group [(ngModel)]="view">
  <mat-button-toggle value="day">Day</mat-button-toggle>
  <mat-button-toggle value="week">Week</mat-button-toggle>
  <mat-button-toggle value="month">Month</mat-button-toggle>
</mat-button-toggle-group>

<!-- Vertical -->
<mat-button-toggle-group vertical>
  <mat-button-toggle value="small">Small</mat-button-toggle>
  <mat-button-toggle value="medium">Medium</mat-button-toggle>
  <mat-button-toggle value="large">Large</mat-button-toggle>
</mat-button-toggle-group>`,
    },
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  imports: [MatButtonToggleModule, FormsModule],
  // ...
})
export class MyComponent {
  alignment = 'left';
  formats: string[] = [];
  view = 'week';
}`,
    },
  ];

  buttonToggleTokens: ComponentToken[] = [
    {
      cssVar: '--mat-standard-button-toggle-shape',
      usage: 'Border radius',
      value: 'var(--ax-radius-sm)',
      category: 'Shape',
    },
    {
      cssVar: '--mat-standard-button-toggle-selected-state-background-color',
      usage: 'Selected background',
      value: 'var(--ax-brand-subtle)',
      category: 'Background',
    },
    {
      cssVar: '--mat-standard-button-toggle-selected-state-text-color',
      usage: 'Selected text color',
      value: 'var(--ax-brand-default)',
      category: 'Text',
    },
    {
      cssVar: '--mat-standard-button-toggle-divider-color',
      usage: 'Divider color',
      value: 'var(--ax-border-default)',
      category: 'Border',
    },
    {
      cssVar: '--mat-standard-button-toggle-height',
      usage: 'Toggle height',
      value: '48px',
      category: 'Size',
    },
  ];
}
