import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../components/docs';
import { ComponentToken } from '../../../../types/docs.types';

@Component({
  selector: 'app-material-radio-doc',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatRadioModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="material-radio-doc">
      <!-- Header -->
      <ax-doc-header
        title="Radio Button"
        description="Radio buttons for selecting a single option from a set."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="material-radio-doc__header-links">
          <a
            href="https://material.angular.io/components/radio/overview"
            target="_blank"
            rel="noopener"
            class="material-radio-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
          <a
            href="https://m3.material.io/components/radio-button/overview"
            target="_blank"
            rel="noopener"
            class="material-radio-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Material Design 3
          </a>
        </div>
      </ax-doc-header>

      <!-- Tabs -->
      <mat-tab-group class="material-radio-doc__tabs" animationDuration="200ms">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="material-radio-doc__section">
            <h2 class="material-radio-doc__section-title">
              Radio Button Types
            </h2>
            <p class="material-radio-doc__section-description">
              Radio buttons allow users to select one option from a set. Use
              radio groups for mutually exclusive selections.
            </p>

            <!-- Basic Radio -->
            <h3 class="material-radio-doc__subsection-title">
              Basic Radio Group
            </h3>
            <ax-live-preview title="Simple radio button group">
              <mat-radio-group [(ngModel)]="selectedFruit">
                <mat-radio-button value="apple">Apple</mat-radio-button>
                <mat-radio-button value="banana">Banana</mat-radio-button>
                <mat-radio-button value="cherry">Cherry</mat-radio-button>
              </mat-radio-group>
              <p class="info-text">Selected: {{ selectedFruit }}</p>
            </ax-live-preview>

            <!-- Vertical Layout -->
            <h3 class="material-radio-doc__subsection-title">
              Vertical Layout
            </h3>
            <ax-live-preview title="Radio buttons stacked vertically">
              <mat-radio-group
                class="vertical-group"
                [(ngModel)]="selectedSize"
              >
                <mat-radio-button value="small">Small</mat-radio-button>
                <mat-radio-button value="medium">Medium</mat-radio-button>
                <mat-radio-button value="large">Large</mat-radio-button>
              </mat-radio-group>
            </ax-live-preview>

            <!-- Color Variants -->
            <h3 class="material-radio-doc__subsection-title">Colors</h3>
            <ax-live-preview title="Different color options">
              <div class="color-demo">
                <mat-radio-button color="primary" [checked]="true"
                  >Primary</mat-radio-button
                >
                <mat-radio-button color="accent" [checked]="true"
                  >Accent</mat-radio-button
                >
                <mat-radio-button color="warn" [checked]="true"
                  >Warn</mat-radio-button
                >
              </div>
            </ax-live-preview>

            <!-- Disabled State -->
            <h3 class="material-radio-doc__subsection-title">Disabled</h3>
            <ax-live-preview title="Disabled radio buttons">
              <mat-radio-group>
                <mat-radio-button value="1" [disabled]="true"
                  >Disabled unchecked</mat-radio-button
                >
                <mat-radio-button value="2" [disabled]="true" [checked]="true"
                  >Disabled checked</mat-radio-button
                >
              </mat-radio-group>
            </ax-live-preview>

            <!-- With Label Position -->
            <h3 class="material-radio-doc__subsection-title">Label Position</h3>
            <ax-live-preview title="Labels before or after">
              <mat-radio-group>
                <mat-radio-button value="before" labelPosition="before"
                  >Label before</mat-radio-button
                >
                <mat-radio-button value="after" labelPosition="after"
                  >Label after</mat-radio-button
                >
              </mat-radio-group>
            </ax-live-preview>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="material-radio-doc__section">
            <h2 class="material-radio-doc__section-title">Usage Examples</h2>

            <!-- Basic Usage -->
            <h3 class="material-radio-doc__subsection-title">Basic Usage</h3>
            <ax-code-tabs [tabs]="basicUsageCode" />

            <!-- With Forms -->
            <h3 class="material-radio-doc__subsection-title">With Forms</h3>
            <ax-code-tabs [tabs]="formsCode" />

            <!-- Dynamic Options -->
            <h3 class="material-radio-doc__subsection-title">
              Dynamic Options
            </h3>
            <ax-code-tabs [tabs]="dynamicCode" />
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="material-radio-doc__section">
            <h2 class="material-radio-doc__section-title">API Reference</h2>

            <mat-card
              appearance="outlined"
              class="material-radio-doc__api-card"
            >
              <mat-card-header>
                <mat-card-title>MatRadioGroup Properties</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="material-radio-doc__api-table">
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
                      <td>Value of the selected radio button</td>
                    </tr>
                    <tr>
                      <td><code>name</code></td>
                      <td><code>string</code></td>
                      <td>Name attribute for radio buttons</td>
                    </tr>
                    <tr>
                      <td><code>disabled</code></td>
                      <td><code>boolean</code></td>
                      <td>Disables all radio buttons</td>
                    </tr>
                    <tr>
                      <td><code>color</code></td>
                      <td><code>'primary' | 'accent' | 'warn'</code></td>
                      <td>Theme color for all buttons</td>
                    </tr>
                    <tr>
                      <td><code>labelPosition</code></td>
                      <td><code>'before' | 'after'</code></td>
                      <td>Label position for all buttons</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              class="material-radio-doc__api-card"
            >
              <mat-card-header>
                <mat-card-title>MatRadioButton Properties</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="material-radio-doc__api-table">
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
                      <td>Value of this radio button</td>
                    </tr>
                    <tr>
                      <td><code>checked</code></td>
                      <td><code>boolean</code></td>
                      <td>Whether button is checked</td>
                    </tr>
                    <tr>
                      <td><code>disabled</code></td>
                      <td><code>boolean</code></td>
                      <td>Disables this button</td>
                    </tr>
                    <tr>
                      <td><code>required</code></td>
                      <td><code>boolean</code></td>
                      <td>Marks as required</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- CSS Tokens Tab -->
        <mat-tab label="CSS Tokens">
          <div class="material-radio-doc__section">
            <h2 class="material-radio-doc__section-title">Design Tokens</h2>
            <p class="material-radio-doc__section-description">
              AegisX overrides these tokens for radio button styling.
            </p>
            <ax-component-tokens [tokens]="radioTokens" />
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="material-radio-doc__section">
            <h2 class="material-radio-doc__section-title">Usage Guidelines</h2>

            <mat-card
              appearance="outlined"
              class="material-radio-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar>check_circle</mat-icon>
                <mat-card-title>When to Use</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-radio-doc__guide-list">
                  <li>
                    <strong>Single selection:</strong> User must choose exactly
                    one option
                  </li>
                  <li>
                    <strong>2-5 options:</strong> For short lists of choices
                  </li>
                  <li>
                    <strong>Important choices:</strong> When all options should
                    be visible
                  </li>
                  <li>
                    <strong>Settings:</strong> Configuration with clear options
                  </li>
                </ul>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              class="material-radio-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar color="warn">cancel</mat-icon>
                <mat-card-title>Avoid</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-radio-doc__guide-list">
                  <li>
                    Don't use for multiple selections (use checkbox instead)
                  </li>
                  <li>
                    Don't use for more than 5 options (use select instead)
                  </li>
                  <li>Don't pre-select when no default makes sense</li>
                  <li>Don't use for binary yes/no (use switch instead)</li>
                </ul>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              class="material-radio-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar>accessibility</mat-icon>
                <mat-card-title>Accessibility</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-radio-doc__guide-list">
                  <li>Always use mat-radio-group for related options</li>
                  <li>Provide clear, descriptive labels</li>
                  <li>Use fieldset/legend for form groups</li>
                  <li>Radio buttons support keyboard navigation</li>
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
      .material-radio-doc {
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

      mat-radio-group {
        display: flex;
        gap: var(--ax-spacing-md);
      }

      .vertical-group {
        flex-direction: column;
        gap: var(--ax-spacing-sm);
      }

      .color-demo {
        display: flex;
        gap: var(--ax-spacing-lg);
      }

      .info-text {
        margin-top: var(--ax-spacing-md);
        font-size: 0.875rem;
        color: var(--ax-text-subtle);
      }
    `,
  ],
})
export class MaterialRadioDocComponent {
  selectedFruit = 'apple';
  selectedSize = 'medium';

  basicUsageCode = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [MatRadioModule, FormsModule],
  template: \`
    <mat-radio-group [(ngModel)]="selected">
      <mat-radio-button value="option1">Option 1</mat-radio-button>
      <mat-radio-button value="option2">Option 2</mat-radio-button>
      <mat-radio-button value="option3">Option 3</mat-radio-button>
    </mat-radio-group>
  \`
})
export class MyComponent {
  selected = 'option1';
}`,
    },
  ];

  formsCode = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [MatRadioModule, ReactiveFormsModule],
  template: \`
    <mat-radio-group [formControl]="sizeControl">
      <mat-radio-button value="small">Small</mat-radio-button>
      <mat-radio-button value="medium">Medium</mat-radio-button>
      <mat-radio-button value="large">Large</mat-radio-button>
    </mat-radio-group>
  \`
})
export class MyComponent {
  sizeControl = new FormControl('medium');
}`,
    },
  ];

  dynamicCode = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `interface Option {
  value: string;
  label: string;
}

options: Option[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

selected = 'weekly';`,
    },
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<mat-radio-group [(ngModel)]="selected">
  @for (option of options; track option.value) {
    <mat-radio-button [value]="option.value">
      {{option.label}}
    </mat-radio-button>
  }
</mat-radio-group>`,
    },
  ];

  radioTokens: ComponentToken[] = [
    {
      cssVar: '--mdc-radio-selected-icon-color',
      usage: 'Color when selected',
      value: 'var(--ax-brand-default)',
      category: 'Color',
    },
    {
      cssVar: '--mdc-radio-unselected-icon-color',
      usage: 'Color when unselected',
      value: 'var(--ax-text-subtle)',
      category: 'Color',
    },
    {
      cssVar: '--mdc-radio-disabled-selected-icon-color',
      usage: 'Disabled selected color',
      value: 'var(--ax-text-disabled)',
      category: 'Color',
    },
    {
      cssVar: '--mat-radio-ripple-color',
      usage: 'Ripple effect color',
      value: 'var(--ax-brand-faint)',
      category: 'State',
    },
  ];
}
