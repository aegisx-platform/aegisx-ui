import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../components/docs';
import { ComponentToken } from '../../../../types/docs.types';

@Component({
  selector: 'app-material-checkbox-doc',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSlideToggleModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="material-checkbox-doc">
      <ax-doc-header
        title="Checkbox, Radio & Toggle"
        description="Selection controls allow users to make choices and confirm their selections."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="material-checkbox-doc__header-links">
          <a
            href="https://material.angular.io/components/checkbox/overview"
            target="_blank"
            rel="noopener"
            class="material-checkbox-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
        </div>
      </ax-doc-header>

      <mat-tab-group
        class="material-checkbox-doc__tabs"
        animationDuration="200ms"
      >
        <mat-tab label="Overview">
          <div class="material-checkbox-doc__section">
            <h2 class="material-checkbox-doc__section-title">Checkbox</h2>

            <h3 class="material-checkbox-doc__subsection-title">
              Basic Checkbox
            </h3>
            <ax-live-preview title="Standard checkboxes">
              <div class="checkbox-row">
                <mat-checkbox>Unchecked</mat-checkbox>
                <mat-checkbox [checked]="true">Checked</mat-checkbox>
                <mat-checkbox [indeterminate]="true"
                  >Indeterminate</mat-checkbox
                >
                <mat-checkbox disabled>Disabled</mat-checkbox>
              </div>
            </ax-live-preview>

            <h3 class="material-checkbox-doc__subsection-title">
              Checkbox Colors
            </h3>
            <ax-live-preview title="Theme color variants">
              <div class="checkbox-row">
                <mat-checkbox color="primary" [checked]="true"
                  >Primary</mat-checkbox
                >
                <mat-checkbox color="accent" [checked]="true"
                  >Accent</mat-checkbox
                >
                <mat-checkbox color="warn" [checked]="true">Warn</mat-checkbox>
              </div>
            </ax-live-preview>

            <h2
              class="material-checkbox-doc__section-title"
              style="margin-top: var(--ax-spacing-2xl);"
            >
              Radio Buttons
            </h2>

            <h3 class="material-checkbox-doc__subsection-title">
              Basic Radio Group
            </h3>
            <ax-live-preview title="Radio button selection">
              <mat-radio-group [(ngModel)]="selectedOption">
                <mat-radio-button value="option1">Option 1</mat-radio-button>
                <mat-radio-button value="option2">Option 2</mat-radio-button>
                <mat-radio-button value="option3">Option 3</mat-radio-button>
                <mat-radio-button value="option4" disabled
                  >Disabled</mat-radio-button
                >
              </mat-radio-group>
            </ax-live-preview>

            <h2
              class="material-checkbox-doc__section-title"
              style="margin-top: var(--ax-spacing-2xl);"
            >
              Slide Toggle
            </h2>

            <h3 class="material-checkbox-doc__subsection-title">
              Basic Toggle
            </h3>
            <ax-live-preview title="On/off toggle switches">
              <div class="toggle-row">
                <mat-slide-toggle>Default</mat-slide-toggle>
                <mat-slide-toggle [checked]="true">Checked</mat-slide-toggle>
                <mat-slide-toggle disabled>Disabled</mat-slide-toggle>
              </div>
            </ax-live-preview>

            <h3 class="material-checkbox-doc__subsection-title">
              Toggle Colors
            </h3>
            <ax-live-preview title="Theme color variants">
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
          </div>
        </mat-tab>

        <mat-tab label="Examples">
          <div class="material-checkbox-doc__section">
            <h2 class="material-checkbox-doc__section-title">Usage Examples</h2>
            <ax-code-tabs [tabs]="basicUsageCode" />
          </div>
        </mat-tab>

        <mat-tab label="API">
          <div class="material-checkbox-doc__section">
            <h2 class="material-checkbox-doc__section-title">API Reference</h2>
            <mat-card appearance="outlined">
              <mat-card-header
                ><mat-card-title
                  >Checkbox Properties</mat-card-title
                ></mat-card-header
              >
              <mat-card-content>
                <table class="material-checkbox-doc__api-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>checked</code></td>
                      <td><code>boolean</code></td>
                      <td>Whether checked</td>
                    </tr>
                    <tr>
                      <td><code>indeterminate</code></td>
                      <td><code>boolean</code></td>
                      <td>Indeterminate state</td>
                    </tr>
                    <tr>
                      <td><code>disabled</code></td>
                      <td><code>boolean</code></td>
                      <td>Disable checkbox</td>
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
          </div>
        </mat-tab>

        <mat-tab label="CSS Tokens">
          <div class="material-checkbox-doc__section">
            <h2 class="material-checkbox-doc__section-title">Design Tokens</h2>
            <ax-component-tokens [tokens]="checkboxTokens" />
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .material-checkbox-doc {
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
        .checkbox-row {
          display: flex;
          gap: var(--ax-spacing-lg);
          flex-wrap: wrap;
        }
        .toggle-row {
          display: flex;
          gap: var(--ax-spacing-lg);
          flex-wrap: wrap;
        }
        mat-radio-group {
          display: flex;
          gap: var(--ax-spacing-lg);
          flex-wrap: wrap;
        }
      }
    `,
  ],
})
export class MaterialCheckboxDocComponent {
  selectedOption = 'option1';

  basicUsageCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<!-- Checkbox -->
<mat-checkbox [(ngModel)]="checked">Remember me</mat-checkbox>
<mat-checkbox color="primary" [checked]="true">Primary</mat-checkbox>

<!-- Radio Group -->
<mat-radio-group [(ngModel)]="selectedValue">
  <mat-radio-button value="a">Option A</mat-radio-button>
  <mat-radio-button value="b">Option B</mat-radio-button>
</mat-radio-group>

<!-- Slide Toggle -->
<mat-slide-toggle [(ngModel)]="isEnabled">
  Enable feature
</mat-slide-toggle>`,
    },
  ];

  checkboxTokens: ComponentToken[] = [
    {
      cssVar: '--mdc-checkbox-selected-checkmark-color',
      usage: 'Checkmark color',
      value: 'var(--ax-text-on-primary)',
      category: 'Icon',
    },
    {
      cssVar: '--mdc-checkbox-selected-focus-icon-color',
      usage: 'Selected background',
      value: 'var(--ax-brand-default)',
      category: 'Background',
    },
    {
      cssVar: '--mdc-radio-selected-icon-color',
      usage: 'Radio selected color',
      value: 'var(--ax-brand-default)',
      category: 'Colors',
    },
    {
      cssVar: '--mdc-switch-selected-track-color',
      usage: 'Toggle track color',
      value: 'var(--ax-brand-default)',
      category: 'Background',
    },
  ];
}
