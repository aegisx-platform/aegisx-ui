import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../components/docs';
import { ComponentToken } from '../../../../types/docs.types';

@Component({
  selector: 'app-material-input-doc',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="material-input-doc">
      <!-- Header -->
      <ax-doc-header
        title="Input"
        description="Text input fields for forms with labels, hints, and validation."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="material-input-doc__header-links">
          <a
            href="https://material.angular.io/components/input/overview"
            target="_blank"
            rel="noopener"
            class="material-input-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
          <a
            href="https://m3.material.io/components/text-fields/overview"
            target="_blank"
            rel="noopener"
            class="material-input-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Material Design 3
          </a>
        </div>
      </ax-doc-header>

      <!-- Tabs -->
      <mat-tab-group class="material-input-doc__tabs" animationDuration="200ms">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="material-input-doc__section">
            <h2 class="material-input-doc__section-title">Input Types</h2>
            <p class="material-input-doc__section-description">
              MatInput extends native input/textarea with Material Design
              styling. Use with mat-form-field for labels and error states.
            </p>

            <!-- Basic Input -->
            <h3 class="material-input-doc__subsection-title">Basic Input</h3>
            <ax-live-preview title="Simple text input">
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Username</mat-label>
                  <input matInput placeholder="Enter username" />
                </mat-form-field>
              </div>
            </ax-live-preview>

            <!-- Input Types -->
            <h3 class="material-input-doc__subsection-title">Input Types</h3>
            <ax-live-preview title="Different input types">
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Email</mat-label>
                  <input matInput type="email" placeholder="name@example.com" />
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Password</mat-label>
                  <input matInput type="password" />
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Number</mat-label>
                  <input matInput type="number" />
                </mat-form-field>
              </div>
            </ax-live-preview>

            <!-- With Icons -->
            <h3 class="material-input-doc__subsection-title">With Icons</h3>
            <ax-live-preview title="Input with prefix and suffix icons">
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Search</mat-label>
                  <mat-icon matPrefix>search</mat-icon>
                  <input matInput placeholder="Search..." />
                  <mat-icon matSuffix>clear</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Amount</mat-label>
                  <span matTextPrefix>$&nbsp;</span>
                  <input matInput type="number" />
                  <span matTextSuffix>.00</span>
                </mat-form-field>
              </div>
            </ax-live-preview>

            <!-- Textarea -->
            <h3 class="material-input-doc__subsection-title">Textarea</h3>
            <ax-live-preview title="Multi-line text input">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Description</mat-label>
                <textarea
                  matInput
                  placeholder="Enter description"
                  rows="4"
                ></textarea>
                <mat-hint align="end">256 characters max</mat-hint>
              </mat-form-field>
            </ax-live-preview>

            <!-- With Hints and Errors -->
            <h3 class="material-input-doc__subsection-title">
              Hints and Errors
            </h3>
            <ax-live-preview title="Input with hint and error states">
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Email</mat-label>
                  <input matInput [(ngModel)]="email" required />
                  <mat-hint>Enter your email address</mat-hint>
                  @if (!email) {
                    <mat-error>Email is required</mat-error>
                  }
                </mat-form-field>
              </div>
            </ax-live-preview>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="material-input-doc__section">
            <h2 class="material-input-doc__section-title">Usage Examples</h2>

            <!-- Basic Usage -->
            <h3 class="material-input-doc__subsection-title">Basic Usage</h3>
            <ax-code-tabs [tabs]="basicUsageCode" />

            <!-- With Icons -->
            <h3 class="material-input-doc__subsection-title">With Icons</h3>
            <ax-code-tabs [tabs]="iconCode" />

            <!-- Form Validation -->
            <h3 class="material-input-doc__subsection-title">
              Form Validation
            </h3>
            <ax-code-tabs [tabs]="validationCode" />
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="material-input-doc__section">
            <h2 class="material-input-doc__section-title">API Reference</h2>

            <mat-card
              appearance="outlined"
              class="material-input-doc__api-card"
            >
              <mat-card-header>
                <mat-card-title>MatInput Directive</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="material-input-doc__api-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>type</code></td>
                      <td><code>string</code></td>
                      <td>Input type (text, email, password, etc.)</td>
                    </tr>
                    <tr>
                      <td><code>placeholder</code></td>
                      <td><code>string</code></td>
                      <td>Placeholder text</td>
                    </tr>
                    <tr>
                      <td><code>disabled</code></td>
                      <td><code>boolean</code></td>
                      <td>Disables the input</td>
                    </tr>
                    <tr>
                      <td><code>readonly</code></td>
                      <td><code>boolean</code></td>
                      <td>Makes input read-only</td>
                    </tr>
                    <tr>
                      <td><code>required</code></td>
                      <td><code>boolean</code></td>
                      <td>Marks input as required</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              class="material-input-doc__api-card"
            >
              <mat-card-header>
                <mat-card-title>Form Field Slots</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="material-input-doc__api-table">
                  <thead>
                    <tr>
                      <th>Directive</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>matPrefix</code></td>
                      <td>Content before the input</td>
                    </tr>
                    <tr>
                      <td><code>matSuffix</code></td>
                      <td>Content after the input</td>
                    </tr>
                    <tr>
                      <td><code>matTextPrefix</code></td>
                      <td>Text prefix (no padding)</td>
                    </tr>
                    <tr>
                      <td><code>matTextSuffix</code></td>
                      <td>Text suffix (no padding)</td>
                    </tr>
                    <tr>
                      <td><code>mat-hint</code></td>
                      <td>Helper text below input</td>
                    </tr>
                    <tr>
                      <td><code>mat-error</code></td>
                      <td>Error message (when invalid)</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- CSS Tokens Tab -->
        <mat-tab label="CSS Tokens">
          <div class="material-input-doc__section">
            <h2 class="material-input-doc__section-title">Design Tokens</h2>
            <p class="material-input-doc__section-description">
              AegisX overrides these tokens for input styling.
            </p>
            <ax-component-tokens [tokens]="inputTokens" />
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="material-input-doc__section">
            <h2 class="material-input-doc__section-title">Usage Guidelines</h2>

            <mat-card
              appearance="outlined"
              class="material-input-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar>check_circle</mat-icon>
                <mat-card-title>When to Use</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-input-doc__guide-list">
                  <li><strong>Forms:</strong> Collecting user information</li>
                  <li>
                    <strong>Search:</strong> Search and filter functionality
                  </li>
                  <li><strong>Settings:</strong> Configuration values</li>
                  <li><strong>Dialogs:</strong> Quick data entry</li>
                </ul>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              class="material-input-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar color="warn">cancel</mat-icon>
                <mat-card-title>Avoid</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-input-doc__guide-list">
                  <li>Don't use placeholder as the only label</li>
                  <li>Don't use generic labels like "Input"</li>
                  <li>Don't hide error messages in tooltips</li>
                  <li>Don't use for read-only data display</li>
                </ul>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              class="material-input-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar>accessibility</mat-icon>
                <mat-card-title>Accessibility</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-input-doc__guide-list">
                  <li>Always use mat-label with mat-form-field</li>
                  <li>Use appropriate input types for mobile keyboards</li>
                  <li>Provide clear error messages</li>
                  <li>Use autocomplete attributes where appropriate</li>
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
      .material-input-doc {
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

      .form-row {
        display: flex;
        flex-wrap: wrap;
        gap: var(--ax-spacing-md);
      }

      .full-width {
        width: 100%;
      }
    `,
  ],
})
export class MaterialInputDocComponent {
  email = '';

  basicUsageCode = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  imports: [MatFormFieldModule, MatInputModule],
  template: \`
    <mat-form-field appearance="outline">
      <mat-label>Username</mat-label>
      <input matInput placeholder="Enter username">
    </mat-form-field>
  \`
})
export class MyComponent {}`,
    },
  ];

  iconCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<mat-form-field appearance="outline">
  <mat-label>Search</mat-label>
  <mat-icon matPrefix>search</mat-icon>
  <input matInput placeholder="Search...">
  <button mat-icon-button matSuffix (click)="clear()">
    <mat-icon>clear</mat-icon>
  </button>
</mat-form-field>

<mat-form-field appearance="outline">
  <mat-label>Amount</mat-label>
  <span matTextPrefix>$&nbsp;</span>
  <input matInput type="number">
  <span matTextSuffix>.00</span>
</mat-form-field>`,
    },
  ];

  validationCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<mat-form-field appearance="outline">
  <mat-label>Email</mat-label>
  <input matInput
         [formControl]="email"
         type="email"
         required>
  <mat-hint>Enter your email address</mat-hint>
  @if (email.hasError('required')) {
    <mat-error>Email is required</mat-error>
  }
  @if (email.hasError('email')) {
    <mat-error>Invalid email format</mat-error>
  }
</mat-form-field>`,
    },
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `import { FormControl, Validators } from '@angular/forms';

email = new FormControl('', [
  Validators.required,
  Validators.email
]);`,
    },
  ];

  inputTokens: ComponentToken[] = [
    {
      cssVar: '--mdc-outlined-text-field-container-shape',
      usage: 'Border radius for outlined fields',
      value: 'var(--ax-radius-sm)',
      category: 'Shape',
    },
    {
      cssVar: '--mdc-outlined-text-field-outline-color',
      usage: 'Border color',
      value: 'var(--ax-border-default)',
      category: 'Color',
    },
    {
      cssVar: '--mdc-outlined-text-field-focus-outline-color',
      usage: 'Border color when focused',
      value: 'var(--ax-brand-default)',
      category: 'Color',
    },
    {
      cssVar: '--mdc-outlined-text-field-error-outline-color',
      usage: 'Border color on error',
      value: 'var(--ax-error-default)',
      category: 'Color',
    },
  ];
}
