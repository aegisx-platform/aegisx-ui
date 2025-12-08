import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { AxDividerComponent } from '@aegisx/ui';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../../../components/docs';
import { CodeTab, ComponentToken } from '../../../../../../types/docs.types';

@Component({
  selector: 'ax-divider-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    AxDividerComponent,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="divider-doc">
      <ax-doc-header
        title="Divider"
        icon="horizontal_rule"
        description="Separate content with a horizontal or vertical line. Supports text content, multiple border styles, and flexible alignment options."
        [breadcrumbs]="[
          {
            label: 'Data Display',
            link: '/docs/components/aegisx/data-display/overview',
          },
          { label: 'Divider' },
        ]"
        status="stable"
        version="1.0.0"
        importStatement="import { AxDividerComponent } from '@aegisx/ui';"
      ></ax-doc-header>

      <mat-tab-group class="divider-doc__tabs" animationDuration="150ms">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="divider-doc__tab-content">
            <section class="divider-doc__section">
              <h2>Basic Usage</h2>
              <p>A simple horizontal divider to separate content sections.</p>

              <ax-live-preview variant="bordered">
                <div class="demo-container">
                  <p>
                    Section 1 content goes here. This is some example text above
                    the divider.
                  </p>
                  <ax-divider></ax-divider>
                  <p>
                    Section 2 content goes here. This is some example text below
                    the divider.
                  </p>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="basicUsageCode"></ax-code-tabs>
            </section>

            <section class="divider-doc__section">
              <h2>Divider with Text</h2>
              <p>
                Add text content to the divider using content projection. Great
                for "OR" separators or section labels.
              </p>

              <ax-live-preview variant="bordered">
                <div class="demo-container">
                  <p>Sign in with your account</p>
                  <ax-divider>OR</ax-divider>
                  <p>Continue as guest</p>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="textDividerCode"></ax-code-tabs>
            </section>

            <section class="divider-doc__section">
              <h2>Border Styles</h2>
              <p>
                Choose from solid, dashed, or dotted border styles using the
                <code>type</code> input.
              </p>

              <ax-live-preview variant="bordered">
                <div class="demo-container">
                  <p><strong>Solid (Default)</strong></p>
                  <ax-divider type="solid"></ax-divider>

                  <p><strong>Dashed</strong></p>
                  <ax-divider type="dashed"></ax-divider>

                  <p><strong>Dotted</strong></p>
                  <ax-divider type="dotted"></ax-divider>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="borderStylesCode"></ax-code-tabs>
            </section>

            <section class="divider-doc__section">
              <h2>Content Alignment</h2>
              <p>
                Use the <code>align</code> input to position the text content
                left, center, or right.
              </p>

              <ax-live-preview variant="bordered">
                <div class="demo-container">
                  <ax-divider align="left">Left aligned</ax-divider>
                  <ax-divider align="center">Center aligned</ax-divider>
                  <ax-divider align="right">Right aligned</ax-divider>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="alignmentCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="divider-doc__tab-content">
            <section class="divider-doc__section">
              <h2>Vertical Divider</h2>
              <p>
                Use <code>layout="vertical"</code> to create a vertical divider
                for side-by-side content.
              </p>

              <ax-live-preview variant="bordered">
                <div class="vertical-demo">
                  <div class="vertical-item">Left Panel</div>
                  <ax-divider layout="vertical"></ax-divider>
                  <div class="vertical-item">Right Panel</div>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="verticalCode"></ax-code-tabs>
            </section>

            <section class="divider-doc__section">
              <h2>Vertical with Text</h2>
              <p>Vertical dividers can also include text content.</p>

              <ax-live-preview variant="bordered">
                <div class="vertical-demo tall">
                  <div class="vertical-item">Column A</div>
                  <ax-divider layout="vertical">OR</ax-divider>
                  <div class="vertical-item">Column B</div>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="verticalTextCode"></ax-code-tabs>
            </section>

            <section class="divider-doc__section">
              <h2>Login Form Example</h2>
              <p>Common use case for social login separation.</p>

              <ax-live-preview variant="bordered">
                <div class="login-demo">
                  <div class="login-buttons">
                    <button class="social-btn google">
                      Continue with Google
                    </button>
                    <button class="social-btn github">
                      Continue with GitHub
                    </button>
                  </div>
                  <ax-divider type="dashed">or continue with email</ax-divider>
                  <div class="email-form">
                    <input
                      type="email"
                      placeholder="Email address"
                      class="email-input"
                    />
                    <button class="submit-btn">Continue</button>
                  </div>
                </div>
              </ax-live-preview>
            </section>

            <section class="divider-doc__section">
              <h2>Section Headers</h2>
              <p>Use dividers as section headers with icons or badges.</p>

              <ax-live-preview variant="bordered">
                <div class="demo-container">
                  <ax-divider align="left">
                    <span class="section-label">
                      <mat-icon>settings</mat-icon>
                      Settings
                    </span>
                  </ax-divider>
                  <p>Configure your preferences here.</p>

                  <ax-divider align="left">
                    <span class="section-label">
                      <mat-icon>notifications</mat-icon>
                      Notifications
                    </span>
                  </ax-divider>
                  <p>Manage your notification preferences.</p>
                </div>
              </ax-live-preview>
            </section>

            <section class="divider-doc__section">
              <h2>Styled Dividers</h2>
              <p>Combine border styles with alignment for various effects.</p>

              <ax-live-preview variant="bordered">
                <div class="demo-container">
                  <ax-divider type="dashed" align="center">
                    <span class="badge-label">NEW</span>
                  </ax-divider>

                  <ax-divider type="dotted" align="left">
                    <span class="date-label">December 2024</span>
                  </ax-divider>

                  <ax-divider type="solid" align="right">
                    <span class="count-label">3 items</span>
                  </ax-divider>
                </div>
              </ax-live-preview>
            </section>

            <section class="divider-doc__section">
              <h2>Card Layout Example</h2>
              <p>Using vertical dividers between card sections.</p>

              <ax-live-preview variant="bordered">
                <div class="card-demo">
                  <div class="card-stat">
                    <span class="stat-value">1,234</span>
                    <span class="stat-label">Users</span>
                  </div>
                  <ax-divider layout="vertical"></ax-divider>
                  <div class="card-stat">
                    <span class="stat-value">567</span>
                    <span class="stat-label">Orders</span>
                  </div>
                  <ax-divider layout="vertical"></ax-divider>
                  <div class="card-stat">
                    <span class="stat-value">89%</span>
                    <span class="stat-label">Success</span>
                  </div>
                </div>
              </ax-live-preview>
            </section>
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="divider-doc__tab-content">
            <section class="divider-doc__section">
              <h2>Inputs</h2>

              <div class="api-table">
                <table>
                  <thead>
                    <tr>
                      <th>Input</th>
                      <th>Type</th>
                      <th>Default</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>layout</code></td>
                      <td>'horizontal' | 'vertical'</td>
                      <td>'horizontal'</td>
                      <td>Direction of the divider</td>
                    </tr>
                    <tr>
                      <td><code>type</code></td>
                      <td>'solid' | 'dashed' | 'dotted'</td>
                      <td>'solid'</td>
                      <td>Border style of the divider line</td>
                    </tr>
                    <tr>
                      <td><code>align</code></td>
                      <td>'left' | 'center' | 'right' | 'top' | 'bottom'</td>
                      <td>'center'</td>
                      <td>Alignment of content within the divider</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="divider-doc__section">
              <h2>Content Projection</h2>
              <p>
                Use <code>ng-content</code> to project text, icons, or other
                elements into the divider.
              </p>

              <div class="api-table">
                <table>
                  <thead>
                    <tr>
                      <th>Slot</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Default</td>
                      <td>Content to display in the center of the divider</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="divider-doc__section">
              <h2>Accessibility</h2>
              <p>The component includes proper ARIA attributes:</p>
              <ul class="a11y-list">
                <li>
                  <code>role="separator"</code> - Indicates the element is a
                  separator
                </li>
                <li>
                  <code>aria-orientation</code> - Set to "horizontal" or
                  "vertical" based on layout
                </li>
              </ul>
            </section>
          </div>
        </mat-tab>

        <!-- Tokens Tab -->
        <mat-tab label="Tokens">
          <div class="divider-doc__tab-content">
            <ax-component-tokens [tokens]="designTokens"></ax-component-tokens>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .divider-doc {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }

      .divider-doc__tabs {
        margin-top: 1rem;
      }

      .divider-doc__tab-content {
        padding: 1.5rem 0;
      }

      .divider-doc__section {
        margin-bottom: 3rem;

        h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--ax-text-heading);
          margin-bottom: 0.75rem;
        }

        > p {
          color: var(--ax-text-secondary);
          margin-bottom: 1.5rem;
          line-height: 1.6;

          code {
            background: var(--ax-background-subtle);
            padding: 0.125rem 0.375rem;
            border-radius: 4px;
            font-size: 0.875rem;
          }
        }
      }

      .demo-container {
        width: 100%;

        p {
          margin: 0.75rem 0;
          color: var(--ax-text-default);
        }
      }

      .vertical-demo {
        display: flex;
        align-items: stretch;
        height: 100px;

        &.tall {
          height: 150px;
        }
      }

      .vertical-item {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        color: var(--ax-text-secondary);
      }

      .login-demo {
        max-width: 400px;
        margin: 0 auto;
      }

      .login-buttons {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-bottom: 1rem;
      }

      .social-btn {
        padding: 0.75rem 1rem;
        border-radius: 8px;
        border: 1px solid var(--ax-border);
        background: var(--ax-background-default);
        cursor: pointer;
        font-size: 0.875rem;

        &:hover {
          background: var(--ax-background-subtle);
        }

        &.google {
          color: #db4437;
        }

        &.github {
          color: #333;
        }
      }

      .email-form {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-top: 1rem;
      }

      .email-input {
        padding: 0.75rem 1rem;
        border-radius: 8px;
        border: 1px solid var(--ax-border);
        font-size: 0.875rem;

        &:focus {
          outline: none;
          border-color: var(--ax-brand-default);
        }
      }

      .submit-btn {
        padding: 0.75rem 1rem;
        border-radius: 8px;
        border: none;
        background: var(--ax-brand-default);
        color: white;
        cursor: pointer;
        font-size: 0.875rem;

        &:hover {
          opacity: 0.9;
        }
      }

      .section-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        color: var(--ax-text-default);

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
        }
      }

      .badge-label {
        background: var(--ax-status-success);
        color: white;
        padding: 0.125rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
      }

      .date-label {
        color: var(--ax-text-muted);
        font-size: 0.875rem;
      }

      .count-label {
        color: var(--ax-text-secondary);
        font-size: 0.75rem;
      }

      .card-demo {
        display: flex;
        align-items: center;
        padding: 1rem;
        background: var(--ax-background-elevated);
        border-radius: 12px;
        border: 1px solid var(--ax-border);
        min-height: 100px;
      }

      .card-stat {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
      }

      .stat-value {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--ax-text-heading);
      }

      .stat-label {
        font-size: 0.875rem;
        color: var(--ax-text-secondary);
      }

      .api-table {
        overflow-x: auto;
        border: 1px solid var(--ax-border);
        border-radius: 12px;

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;

          th,
          td {
            padding: 0.75rem 1rem;
            text-align: left;
            border-bottom: 1px solid var(--ax-border);
          }

          th {
            font-weight: 600;
            color: var(--ax-text-heading);
            background: var(--ax-background-subtle);
          }

          code {
            background: var(--ax-background-subtle);
            padding: 0.125rem 0.375rem;
            border-radius: 4px;
            font-size: 0.8125rem;
          }

          tr:last-child td {
            border-bottom: none;
          }
        }
      }

      .a11y-list {
        list-style: disc;
        padding-left: 1.5rem;

        li {
          margin: 0.5rem 0;
          color: var(--ax-text-secondary);

          code {
            background: var(--ax-background-subtle);
            padding: 0.125rem 0.375rem;
            border-radius: 4px;
            font-size: 0.875rem;
          }
        }
      }
    `,
  ],
})
export class DividerDocComponent {
  // Code examples
  readonly basicUsageCode: CodeTab[] = [
    {
      label: 'HTML',
      language: 'html',
      code: `<p>Section 1 content</p>
<ax-divider></ax-divider>
<p>Section 2 content</p>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `import { AxDividerComponent } from '@aegisx/ui';

@Component({
  imports: [AxDividerComponent],
  ...
})`,
    },
  ];

  readonly textDividerCode: CodeTab[] = [
    {
      label: 'HTML',
      language: 'html',
      code: `<!-- Simple text -->
<ax-divider>OR</ax-divider>

<!-- With icon -->
<ax-divider>
  <mat-icon>favorite</mat-icon>
</ax-divider>

<!-- Custom content -->
<ax-divider>
  <span class="custom-label">Section Title</span>
</ax-divider>`,
    },
  ];

  readonly borderStylesCode: CodeTab[] = [
    {
      label: 'HTML',
      language: 'html',
      code: `<!-- Solid (default) -->
<ax-divider type="solid"></ax-divider>

<!-- Dashed -->
<ax-divider type="dashed"></ax-divider>

<!-- Dotted -->
<ax-divider type="dotted"></ax-divider>`,
    },
  ];

  readonly alignmentCode: CodeTab[] = [
    {
      label: 'HTML',
      language: 'html',
      code: `<!-- Left aligned -->
<ax-divider align="left">Left</ax-divider>

<!-- Center aligned (default) -->
<ax-divider align="center">Center</ax-divider>

<!-- Right aligned -->
<ax-divider align="right">Right</ax-divider>`,
    },
  ];

  readonly verticalCode: CodeTab[] = [
    {
      label: 'HTML',
      language: 'html',
      code: `<div style="display: flex; height: 100px;">
  <div>Left Panel</div>
  <ax-divider layout="vertical"></ax-divider>
  <div>Right Panel</div>
</div>`,
    },
  ];

  readonly verticalTextCode: CodeTab[] = [
    {
      label: 'HTML',
      language: 'html',
      code: `<div style="display: flex; height: 150px;">
  <div>Column A</div>
  <ax-divider layout="vertical">OR</ax-divider>
  <div>Column B</div>
</div>`,
    },
  ];

  // Design tokens
  readonly designTokens: ComponentToken[] = [
    {
      category: 'Colors',
      cssVar: '--ax-divider-color',
      usage: 'Line color (defaults to --ax-border)',
    },
    {
      category: 'Sizing',
      cssVar: '--ax-divider-width',
      usage: 'Line thickness (default: 1px)',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-divider-content-padding',
      usage: 'Padding around content text',
    },
    {
      category: 'Colors',
      cssVar: '--ax-divider-content-color',
      usage: 'Text content color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-divider-content-bg',
      usage: 'Background color behind content',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-md',
      usage: 'Vertical margin for horizontal divider',
    },
  ];
}
