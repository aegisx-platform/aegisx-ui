import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../components/docs';
import { ComponentToken } from '../../../../types/docs.types';

@Component({
  selector: 'app-material-expansion-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="material-expansion-doc">
      <ax-doc-header
        title="Expansion Panel"
        description="Expansion panels provide progressive disclosure through expandable content areas."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="material-expansion-doc__header-links">
          <a
            href="https://material.angular.io/components/expansion/overview"
            target="_blank"
            rel="noopener"
            class="material-expansion-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
        </div>
      </ax-doc-header>

      <mat-tab-group
        class="material-expansion-doc__tabs"
        animationDuration="200ms"
      >
        <mat-tab label="Overview">
          <div class="material-expansion-doc__section">
            <h2 class="material-expansion-doc__section-title">
              Expansion Panel Types
            </h2>

            <h3 class="material-expansion-doc__subsection-title">
              Basic Expansion Panel
            </h3>
            <ax-live-preview title="Single expandable panel">
              <mat-expansion-panel>
                <mat-expansion-panel-header>
                  <mat-panel-title>Personal Information</mat-panel-title>
                  <mat-panel-description
                    >Enter your details</mat-panel-description
                  >
                </mat-expansion-panel-header>
                <p>
                  This is the content of the expansion panel. It can contain any
                  HTML content.
                </p>
              </mat-expansion-panel>
            </ax-live-preview>

            <h3 class="material-expansion-doc__subsection-title">Accordion</h3>
            <ax-live-preview title="Multiple panels with accordion behavior">
              <mat-accordion>
                <mat-expansion-panel>
                  <mat-expansion-panel-header>
                    <mat-panel-title>
                      <mat-icon>person</mat-icon>
                      Personal Details
                    </mat-panel-title>
                  </mat-expansion-panel-header>
                  <p>Enter your personal information here.</p>
                </mat-expansion-panel>

                <mat-expansion-panel>
                  <mat-expansion-panel-header>
                    <mat-panel-title>
                      <mat-icon>work</mat-icon>
                      Work Experience
                    </mat-panel-title>
                  </mat-expansion-panel-header>
                  <p>List your previous work experience.</p>
                </mat-expansion-panel>

                <mat-expansion-panel>
                  <mat-expansion-panel-header>
                    <mat-panel-title>
                      <mat-icon>school</mat-icon>
                      Education
                    </mat-panel-title>
                  </mat-expansion-panel-header>
                  <p>Provide your educational background.</p>
                </mat-expansion-panel>
              </mat-accordion>
            </ax-live-preview>

            <h3 class="material-expansion-doc__subsection-title">
              Multi-Expand
            </h3>
            <ax-live-preview title="Multiple panels can be open simultaneously">
              <mat-accordion multi>
                <mat-expansion-panel>
                  <mat-expansion-panel-header>
                    <mat-panel-title>Section 1</mat-panel-title>
                  </mat-expansion-panel-header>
                  <p>Content for section 1.</p>
                </mat-expansion-panel>

                <mat-expansion-panel>
                  <mat-expansion-panel-header>
                    <mat-panel-title>Section 2</mat-panel-title>
                  </mat-expansion-panel-header>
                  <p>Content for section 2.</p>
                </mat-expansion-panel>

                <mat-expansion-panel>
                  <mat-expansion-panel-header>
                    <mat-panel-title>Section 3</mat-panel-title>
                  </mat-expansion-panel-header>
                  <p>Content for section 3.</p>
                </mat-expansion-panel>
              </mat-accordion>
            </ax-live-preview>

            <h3 class="material-expansion-doc__subsection-title">
              With Actions
            </h3>
            <ax-live-preview title="Panel with action buttons">
              <mat-expansion-panel>
                <mat-expansion-panel-header>
                  <mat-panel-title>Settings</mat-panel-title>
                  <mat-panel-description
                    >Configure your preferences</mat-panel-description
                  >
                </mat-expansion-panel-header>
                <p>Configure your settings here.</p>
                <mat-action-row>
                  <button mat-button>Cancel</button>
                  <button mat-flat-button color="primary">Save</button>
                </mat-action-row>
              </mat-expansion-panel>
            </ax-live-preview>
          </div>
        </mat-tab>

        <mat-tab label="Examples">
          <div class="material-expansion-doc__section">
            <h2 class="material-expansion-doc__section-title">
              Usage Examples
            </h2>
            <ax-code-tabs [tabs]="basicUsageCode" />
          </div>
        </mat-tab>

        <mat-tab label="API">
          <div class="material-expansion-doc__section">
            <h2 class="material-expansion-doc__section-title">API Reference</h2>
            <mat-card appearance="outlined">
              <mat-card-header
                ><mat-card-title
                  >Expansion Panel Properties</mat-card-title
                ></mat-card-header
              >
              <mat-card-content>
                <table class="material-expansion-doc__api-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>expanded</code></td>
                      <td><code>boolean</code></td>
                      <td>Whether panel is expanded</td>
                    </tr>
                    <tr>
                      <td><code>disabled</code></td>
                      <td><code>boolean</code></td>
                      <td>Disable panel interaction</td>
                    </tr>
                    <tr>
                      <td><code>hideToggle</code></td>
                      <td><code>boolean</code></td>
                      <td>Hide expand/collapse toggle</td>
                    </tr>
                    <tr>
                      <td><code>togglePosition</code></td>
                      <td><code>'before' | 'after'</code></td>
                      <td>Toggle icon position</td>
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
                  >Accordion Properties</mat-card-title
                ></mat-card-header
              >
              <mat-card-content>
                <table class="material-expansion-doc__api-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>multi</code></td>
                      <td><code>boolean</code></td>
                      <td>Allow multiple panels open</td>
                    </tr>
                    <tr>
                      <td><code>displayMode</code></td>
                      <td><code>'default' | 'flat'</code></td>
                      <td>Display style</td>
                    </tr>
                    <tr>
                      <td><code>hideToggle</code></td>
                      <td><code>boolean</code></td>
                      <td>Hide all toggles</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="CSS Tokens">
          <div class="material-expansion-doc__section">
            <h2 class="material-expansion-doc__section-title">Design Tokens</h2>
            <ax-component-tokens [tokens]="expansionTokens" />
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .material-expansion-doc {
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
        mat-panel-title {
          display: flex;
          align-items: center;
          gap: var(--ax-spacing-sm);
          mat-icon {
            font-size: 20px;
            width: 20px;
            height: 20px;
          }
        }
      }
    `,
  ],
})
export class MaterialExpansionDocComponent {
  basicUsageCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<!-- Single Panel -->
<mat-expansion-panel>
  <mat-expansion-panel-header>
    <mat-panel-title>Title</mat-panel-title>
    <mat-panel-description>Description</mat-panel-description>
  </mat-expansion-panel-header>
  <p>Panel content</p>
</mat-expansion-panel>

<!-- Accordion -->
<mat-accordion>
  <mat-expansion-panel>
    <mat-expansion-panel-header>
      <mat-panel-title>Section 1</mat-panel-title>
    </mat-expansion-panel-header>
    <p>Content 1</p>
  </mat-expansion-panel>

  <mat-expansion-panel>
    <mat-expansion-panel-header>
      <mat-panel-title>Section 2</mat-panel-title>
    </mat-expansion-panel-header>
    <p>Content 2</p>
  </mat-expansion-panel>
</mat-accordion>

<!-- With Action Row -->
<mat-expansion-panel>
  <mat-expansion-panel-header>
    <mat-panel-title>Settings</mat-panel-title>
  </mat-expansion-panel-header>
  <p>Settings content</p>
  <mat-action-row>
    <button mat-button>Cancel</button>
    <button mat-flat-button color="primary">Save</button>
  </mat-action-row>
</mat-expansion-panel>`,
    },
  ];

  expansionTokens: ComponentToken[] = [
    {
      cssVar: '--mat-expansion-container-background-color',
      usage: 'Panel background',
      value: 'var(--ax-background-default)',
      category: 'Background',
    },
    {
      cssVar: '--mat-expansion-container-text-color',
      usage: 'Content text color',
      value: 'var(--ax-text-body)',
      category: 'Text',
    },
    {
      cssVar: '--mat-expansion-header-text-color',
      usage: 'Header text color',
      value: 'var(--ax-text-strong)',
      category: 'Text',
    },
    {
      cssVar: '--mat-expansion-container-shape',
      usage: 'Border radius',
      value: 'var(--ax-radius-sm)',
      category: 'Shape',
    },
  ];
}
