import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../components/docs';
import { ComponentToken } from '../../../../types/docs.types';

@Component({
  selector: 'app-material-form-field-doc',
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
    MatSelectModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="material-form-field-doc">
      <ax-doc-header
        title="Form Field"
        description="Form fields wrap input elements with labels, hints, and error messages."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="material-form-field-doc__header-links">
          <a
            href="https://material.angular.io/components/form-field/overview"
            target="_blank"
            rel="noopener"
            class="material-form-field-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
        </div>
      </ax-doc-header>

      <mat-tab-group
        class="material-form-field-doc__tabs"
        animationDuration="200ms"
      >
        <mat-tab label="Overview">
          <div class="material-form-field-doc__section">
            <h2 class="material-form-field-doc__section-title">
              Form Field Appearances
            </h2>

            <h3 class="material-form-field-doc__subsection-title">
              Fill Appearance
            </h3>
            <ax-live-preview title="Filled form field (default)">
              <div class="form-row">
                <mat-form-field appearance="fill">
                  <mat-label>Email</mat-label>
                  <input matInput placeholder="Enter email" />
                  <mat-hint>We'll never share your email</mat-hint>
                </mat-form-field>
              </div>
            </ax-live-preview>

            <h3 class="material-form-field-doc__subsection-title">
              Outline Appearance
            </h3>
            <ax-live-preview title="Outlined form field">
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Username</mat-label>
                  <input matInput placeholder="Enter username" />
                </mat-form-field>
              </div>
            </ax-live-preview>

            <h3 class="material-form-field-doc__subsection-title">
              With Icons
            </h3>
            <ax-live-preview title="Form fields with prefix/suffix icons">
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Search</mat-label>
                  <mat-icon matPrefix>search</mat-icon>
                  <input matInput placeholder="Search..." />
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Password</mat-label>
                  <input matInput type="password" />
                  <mat-icon matSuffix>visibility</mat-icon>
                </mat-form-field>
              </div>
            </ax-live-preview>

            <h3 class="material-form-field-doc__subsection-title">
              With Select
            </h3>
            <ax-live-preview title="Form field with select">
              <mat-form-field appearance="outline">
                <mat-label>Country</mat-label>
                <mat-select>
                  <mat-option value="th">Thailand</mat-option>
                  <mat-option value="us">United States</mat-option>
                  <mat-option value="uk">United Kingdom</mat-option>
                </mat-select>
              </mat-form-field>
            </ax-live-preview>
          </div>
        </mat-tab>

        <mat-tab label="Examples">
          <div class="material-form-field-doc__section">
            <h2 class="material-form-field-doc__section-title">
              Usage Examples
            </h2>
            <ax-code-tabs [tabs]="basicUsageCode" />
          </div>
        </mat-tab>

        <mat-tab label="API">
          <div class="material-form-field-doc__section">
            <h2 class="material-form-field-doc__section-title">
              API Reference
            </h2>
            <mat-card appearance="outlined">
              <mat-card-header
                ><mat-card-title
                  >Input Properties</mat-card-title
                ></mat-card-header
              >
              <mat-card-content>
                <table class="material-form-field-doc__api-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>appearance</code></td>
                      <td><code>'fill' | 'outline'</code></td>
                      <td>Form field appearance</td>
                    </tr>
                    <tr>
                      <td><code>floatLabel</code></td>
                      <td><code>'always' | 'auto'</code></td>
                      <td>Label float behavior</td>
                    </tr>
                    <tr>
                      <td><code>hideRequiredMarker</code></td>
                      <td><code>boolean</code></td>
                      <td>Hide required asterisk</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="CSS Tokens">
          <div class="material-form-field-doc__section">
            <h2 class="material-form-field-doc__section-title">
              Design Tokens
            </h2>
            <ax-component-tokens [tokens]="formFieldTokens" />
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .material-form-field-doc {
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
        .form-row {
          display: flex;
          gap: var(--ax-spacing-md);
          flex-wrap: wrap;
        }
      }
    `,
  ],
})
export class MaterialFormFieldDocComponent {
  basicUsageCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<mat-form-field appearance="outline">
  <mat-label>Email</mat-label>
  <input matInput placeholder="Enter email">
  <mat-hint>Your email address</mat-hint>
</mat-form-field>`,
    },
  ];

  formFieldTokens: ComponentToken[] = [
    {
      cssVar: '--mdc-outlined-text-field-container-shape',
      usage: 'Border radius',
      value: 'var(--ax-radius-sm)',
      category: 'Shape',
    },
    {
      cssVar: '--mdc-outlined-text-field-outline-color',
      usage: 'Border color',
      value: 'var(--ax-border-default)',
      category: 'Border',
    },
    {
      cssVar: '--mdc-outlined-text-field-focus-outline-color',
      usage: 'Focus border color',
      value: 'var(--ax-brand-default)',
      category: 'Focus',
    },
  ];
}
