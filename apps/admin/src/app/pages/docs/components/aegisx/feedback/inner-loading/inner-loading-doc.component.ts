import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AxInnerLoadingComponent } from '@aegisx/ui';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../../../components/docs';
import { ComponentToken } from '../../../../../../types/docs.types';

@Component({
  selector: 'ax-inner-loading-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    AxInnerLoadingComponent,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="inner-loading-doc">
      <ax-doc-header
        title="Inner Loading"
        icon="hourglass_empty"
        description="Container-level loading overlay that blocks interaction while displaying a spinner. Perfect for loading states within cards, panels, or specific sections."
        [breadcrumbs]="[
          { label: 'Feedback', link: '/docs/components/aegisx/feedback/alert' },
          { label: 'Inner Loading' },
        ]"
        status="stable"
        version="1.0.0"
        importStatement="import { AxInnerLoadingComponent } from '@aegisx/ui';"
      ></ax-doc-header>

      <mat-tab-group class="inner-loading-doc__tabs" animationDuration="200ms">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="inner-loading-doc__tab-content">
            <!-- Basic Usage -->
            <section class="inner-loading-doc__section">
              <h2>Basic Usage</h2>
              <p>
                Place the inner loading component inside a container with
                <code>position: relative</code>. Control the loading state with
                the <code>showing</code> input.
              </p>

              <ax-live-preview variant="bordered">
                <div class="inner-loading-doc__demo-row">
                  <div class="inner-loading-doc__demo-box relative">
                    <ax-inner-loading [showing]="true"></ax-inner-loading>
                    <div class="inner-loading-doc__content">
                      <h4>Card Content</h4>
                      <p>This content is being loaded...</p>
                    </div>
                  </div>

                  <div class="inner-loading-doc__demo-box relative">
                    <ax-inner-loading [showing]="false"></ax-inner-loading>
                    <div class="inner-loading-doc__content">
                      <h4>Card Content</h4>
                      <p>Loading complete!</p>
                    </div>
                  </div>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="basicUsageCode"></ax-code-tabs>
            </section>

            <!-- Sizes -->
            <section class="inner-loading-doc__section">
              <h2>Spinner Sizes</h2>
              <p>
                Choose from small, medium, or large spinner sizes based on your
                container size.
              </p>

              <ax-live-preview variant="bordered">
                <div class="inner-loading-doc__demo-row">
                  <div
                    class="inner-loading-doc__demo-box inner-loading-doc__demo-box--sm relative"
                  >
                    <ax-inner-loading
                      [showing]="true"
                      size="sm"
                    ></ax-inner-loading>
                    <div class="inner-loading-doc__content">
                      <p>Small</p>
                    </div>
                  </div>

                  <div class="inner-loading-doc__demo-box relative">
                    <ax-inner-loading
                      [showing]="true"
                      size="md"
                    ></ax-inner-loading>
                    <div class="inner-loading-doc__content">
                      <p>Medium</p>
                    </div>
                  </div>

                  <div
                    class="inner-loading-doc__demo-box inner-loading-doc__demo-box--lg relative"
                  >
                    <ax-inner-loading
                      [showing]="true"
                      size="lg"
                    ></ax-inner-loading>
                    <div class="inner-loading-doc__content">
                      <p>Large</p>
                    </div>
                  </div>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="sizesCode"></ax-code-tabs>
            </section>

            <!-- With Label -->
            <section class="inner-loading-doc__section">
              <h2>With Label</h2>
              <p>
                Add a descriptive label below the spinner to inform users what's
                happening.
              </p>

              <ax-live-preview variant="bordered">
                <div
                  class="inner-loading-doc__demo-box inner-loading-doc__demo-box--wide relative"
                >
                  <ax-inner-loading
                    [showing]="true"
                    label="Loading data..."
                  ></ax-inner-loading>
                  <div class="inner-loading-doc__content">
                    <h4>Data Table</h4>
                    <p>Table content goes here</p>
                  </div>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="labelCode"></ax-code-tabs>
            </section>

            <!-- Dark Mode -->
            <section class="inner-loading-doc__section">
              <h2>Dark Overlay</h2>
              <p>
                Use dark overlay for light-colored content areas to maintain
                visibility.
              </p>

              <ax-live-preview variant="bordered">
                <div
                  class="inner-loading-doc__demo-box inner-loading-doc__demo-box--wide inner-loading-doc__demo-box--light relative"
                >
                  <ax-inner-loading
                    [showing]="true"
                    [dark]="true"
                    label="Loading..."
                  ></ax-inner-loading>
                  <div class="inner-loading-doc__content">
                    <h4>Light Content Area</h4>
                    <p>Dark overlay provides better contrast</p>
                  </div>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="darkCode"></ax-code-tabs>
            </section>

            <!-- Spinner Colors -->
            <section class="inner-loading-doc__section">
              <h2>Spinner Colors</h2>
              <p>Choose from primary, accent, warn, or light spinner colors.</p>

              <ax-live-preview variant="bordered">
                <div class="inner-loading-doc__demo-row">
                  <div class="inner-loading-doc__demo-box relative">
                    <ax-inner-loading
                      [showing]="true"
                      color="primary"
                    ></ax-inner-loading>
                    <div class="inner-loading-doc__content">
                      <p>Primary</p>
                    </div>
                  </div>

                  <div class="inner-loading-doc__demo-box relative">
                    <ax-inner-loading
                      [showing]="true"
                      color="accent"
                    ></ax-inner-loading>
                    <div class="inner-loading-doc__content">
                      <p>Accent</p>
                    </div>
                  </div>

                  <div class="inner-loading-doc__demo-box relative">
                    <ax-inner-loading
                      [showing]="true"
                      color="warn"
                    ></ax-inner-loading>
                    <div class="inner-loading-doc__content">
                      <p>Warn</p>
                    </div>
                  </div>

                  <div
                    class="inner-loading-doc__demo-box inner-loading-doc__demo-box--dark relative"
                  >
                    <ax-inner-loading
                      [showing]="true"
                      color="light"
                    ></ax-inner-loading>
                    <div
                      class="inner-loading-doc__content inner-loading-doc__content--light"
                    >
                      <p>Light</p>
                    </div>
                  </div>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="colorsCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="inner-loading-doc__tab-content">
            <!-- Card Loading -->
            <section class="inner-loading-doc__section">
              <h2>Card Loading State</h2>
              <p>Common pattern for loading data within a card component.</p>

              <ax-live-preview variant="bordered">
                <div class="inner-loading-doc__card-example relative">
                  <ax-inner-loading
                    [showing]="isCardLoading"
                    label="Fetching user data..."
                  ></ax-inner-loading>
                  <div class="inner-loading-doc__card">
                    <div class="inner-loading-doc__card-header">
                      <div class="inner-loading-doc__avatar">JD</div>
                      <div>
                        <h4>John Doe</h4>
                        <span>Software Engineer</span>
                      </div>
                    </div>
                    <div class="inner-loading-doc__card-body">
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed do eiusmod tempor.
                      </p>
                    </div>
                    <div class="inner-loading-doc__card-actions">
                      <button
                        mat-button
                        color="primary"
                        (click)="toggleCardLoading()"
                      >
                        {{ isCardLoading ? 'Stop' : 'Reload' }}
                      </button>
                      <button mat-button>View Profile</button>
                    </div>
                  </div>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="cardLoadingCode"></ax-code-tabs>
            </section>

            <!-- Table Loading -->
            <section class="inner-loading-doc__section">
              <h2>Table Loading State</h2>
              <p>Show loading state for data tables while fetching results.</p>

              <ax-live-preview variant="bordered">
                <div class="inner-loading-doc__table relative">
                  <ax-inner-loading
                    [showing]="isTableLoading"
                    size="lg"
                    label="Loading records..."
                  ></ax-inner-loading>
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Alice Johnson</td>
                        <td>alice&#64;example.com</td>
                        <td>Active</td>
                      </tr>
                      <tr>
                        <td>Bob Smith</td>
                        <td>bob&#64;example.com</td>
                        <td>Pending</td>
                      </tr>
                      <tr>
                        <td>Carol White</td>
                        <td>carol&#64;example.com</td>
                        <td>Active</td>
                      </tr>
                    </tbody>
                  </table>
                  <div class="inner-loading-doc__table-actions">
                    <button mat-stroked-button (click)="toggleTableLoading()">
                      {{ isTableLoading ? 'Cancel' : 'Refresh' }}
                    </button>
                  </div>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="tableLoadingCode"></ax-code-tabs>
            </section>

            <!-- Form Submission -->
            <section class="inner-loading-doc__section">
              <h2>Form Submission</h2>
              <p>Block form interaction during submission.</p>

              <ax-live-preview variant="bordered">
                <div class="inner-loading-doc__form relative">
                  <ax-inner-loading
                    [showing]="isFormLoading"
                    label="Saving changes..."
                  ></ax-inner-loading>
                  <div class="inner-loading-doc__form-field">
                    <label>Name</label>
                    <input type="text" value="John Doe" />
                  </div>
                  <div class="inner-loading-doc__form-field">
                    <label>Email</label>
                    <input type="email" value="john&#64;example.com" />
                  </div>
                  <div class="inner-loading-doc__form-actions">
                    <button
                      mat-flat-button
                      color="primary"
                      (click)="submitForm()"
                    >
                      Save Changes
                    </button>
                    <button mat-button>Cancel</button>
                  </div>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="formSubmissionCode"></ax-code-tabs>
            </section>

            <!-- Custom Background -->
            <section class="inner-loading-doc__section">
              <h2>Custom Background Color</h2>
              <p>Use a custom background color for the overlay.</p>

              <ax-live-preview variant="bordered">
                <div
                  class="inner-loading-doc__demo-box inner-loading-doc__demo-box--wide relative"
                >
                  <ax-inner-loading
                    [showing]="true"
                    backgroundColor="rgba(99, 102, 241, 0.9)"
                    color="light"
                    label="Custom overlay..."
                  ></ax-inner-loading>
                  <div class="inner-loading-doc__content">
                    <h4>Custom Background</h4>
                    <p>Using a custom RGBA color for the overlay</p>
                  </div>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="customBgCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="inner-loading-doc__tab-content">
            <section class="inner-loading-doc__section">
              <h2>Properties</h2>
              <div class="inner-loading-doc__api-table">
                <table>
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
                      <td><code>showing</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Show/hide the loading overlay</td>
                    </tr>
                    <tr>
                      <td><code>size</code></td>
                      <td><code>'sm' | 'md' | 'lg'</code></td>
                      <td><code>'md'</code></td>
                      <td>Spinner size</td>
                    </tr>
                    <tr>
                      <td><code>color</code></td>
                      <td>
                        <code>'primary' | 'accent' | 'warn' | 'light'</code>
                      </td>
                      <td><code>'primary'</code></td>
                      <td>Spinner color theme</td>
                    </tr>
                    <tr>
                      <td><code>label</code></td>
                      <td><code>string</code></td>
                      <td><code>''</code></td>
                      <td>Optional label text below spinner</td>
                    </tr>
                    <tr>
                      <td><code>dark</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Use dark overlay (for light content)</td>
                    </tr>
                    <tr>
                      <td><code>backgroundColor</code></td>
                      <td><code>string</code></td>
                      <td><code>''</code></td>
                      <td>Custom background color (with opacity)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="inner-loading-doc__section">
              <h2>Content Projection</h2>
              <div class="inner-loading-doc__api-table">
                <table>
                  <thead>
                    <tr>
                      <th>Slot</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>default</code></td>
                      <td>
                        Custom content to display inside the loading overlay
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="inner-loading-doc__section">
              <h2>Usage Notes</h2>
              <ul class="inner-loading-doc__notes">
                <li>
                  <mat-icon>info</mat-icon>
                  Parent element <strong>must have</strong>
                  <code>position: relative</code> for proper positioning
                </li>
                <li>
                  <mat-icon>info</mat-icon>
                  The component overlays on top of content; it does not wrap
                  content
                </li>
                <li>
                  <mat-icon>info</mat-icon>
                  Use <code>dark</code> mode when overlay is on light
                  backgrounds for better visibility
                </li>
              </ul>
            </section>
          </div>
        </mat-tab>

        <!-- Tokens Tab -->
        <mat-tab label="Tokens">
          <div class="inner-loading-doc__tab-content">
            <ax-component-tokens
              [tokens]="innerLoadingTokens"
            ></ax-component-tokens>
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="inner-loading-doc__tab-content">
            <section class="inner-loading-doc__section">
              <h2>Do's and Don'ts</h2>
              <div class="inner-loading-doc__guidelines">
                <div
                  class="inner-loading-doc__guideline inner-loading-doc__guideline--do"
                >
                  <h4><mat-icon>check_circle</mat-icon> Do</h4>
                  <ul>
                    <li>Use for container-specific loading states</li>
                    <li>Provide a label for long-running operations</li>
                    <li>Match spinner size to container size</li>
                    <li>Ensure parent has position: relative</li>
                    <li>Use dark mode on light backgrounds</li>
                  </ul>
                </div>
                <div
                  class="inner-loading-doc__guideline inner-loading-doc__guideline--dont"
                >
                  <h4><mat-icon>cancel</mat-icon> Don't</h4>
                  <ul>
                    <li>Use for full-page loading (use LoadingBar instead)</li>
                    <li>Show loading state for instant operations</li>
                    <li>Nest multiple inner-loading components</li>
                    <li>Use vague labels like "Please wait..."</li>
                    <li>Forget position: relative on parent</li>
                  </ul>
                </div>
              </div>
            </section>

            <section class="inner-loading-doc__section">
              <h2>When to Use</h2>
              <ul class="inner-loading-doc__use-cases">
                <li>
                  <mat-icon>view_module</mat-icon>
                  <strong>Card loading:</strong> When fetching data for
                  individual cards
                </li>
                <li>
                  <mat-icon>table_chart</mat-icon>
                  <strong>Table loading:</strong> While loading table data or
                  refreshing
                </li>
                <li>
                  <mat-icon>edit_note</mat-icon>
                  <strong>Form submission:</strong> During form save operations
                </li>
                <li>
                  <mat-icon>dashboard</mat-icon>
                  <strong>Panel updates:</strong> Refreshing specific dashboard
                  panels
                </li>
              </ul>
            </section>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .inner-loading-doc {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--ax-spacing-xl, 1.5rem);
      }

      .inner-loading-doc__tabs {
        margin-top: var(--ax-spacing-xl, 1.5rem);
      }

      .inner-loading-doc__tab-content {
        padding: var(--ax-spacing-xl, 1.5rem) 0;
      }

      .inner-loading-doc__section {
        margin-bottom: var(--ax-spacing-3xl, 3rem);

        h2 {
          font-size: var(--ax-text-xl, 1.25rem);
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0 0 var(--ax-spacing-sm, 0.5rem) 0;
        }

        > p {
          font-size: var(--ax-text-sm, 0.875rem);
          color: var(--ax-text-secondary);
          margin: 0 0 var(--ax-spacing-lg, 1rem) 0;
          max-width: 700px;
        }

        code {
          background: var(--ax-background-subtle);
          padding: 2px 6px;
          border-radius: var(--ax-radius-sm);
          font-size: var(--ax-text-xs);
        }
      }

      .relative {
        position: relative;
      }

      .inner-loading-doc__demo-row {
        display: flex;
        gap: var(--ax-spacing-lg);
        flex-wrap: wrap;
      }

      .inner-loading-doc__demo-box {
        width: 200px;
        height: 150px;
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-lg);
        overflow: hidden;

        &--sm {
          width: 120px;
          height: 100px;
        }

        &--lg {
          width: 250px;
          height: 200px;
        }

        &--wide {
          width: 100%;
          max-width: 400px;
          height: auto;
          min-height: 150px;
        }

        &--light {
          background: #f8fafc;
        }

        &--dark {
          background: #1e293b;
        }
      }

      .inner-loading-doc__content {
        padding: var(--ax-spacing-md);
        height: 100%;

        h4 {
          margin: 0 0 var(--ax-spacing-xs) 0;
          font-size: var(--ax-text-md);
        }

        p {
          margin: 0;
          font-size: var(--ax-text-sm);
          color: var(--ax-text-secondary);
        }

        &--light {
          color: white;

          p {
            color: rgba(255, 255, 255, 0.8);
          }
        }
      }

      .inner-loading-doc__card-example {
        width: 100%;
        max-width: 350px;
      }

      .inner-loading-doc__card {
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-lg);
        overflow: hidden;
      }

      .inner-loading-doc__card-header {
        display: flex;
        align-items: center;
        gap: var(--ax-spacing-md);
        padding: var(--ax-spacing-md);
        background: var(--ax-background-subtle);

        h4 {
          margin: 0;
          font-size: var(--ax-text-md);
        }

        span {
          font-size: var(--ax-text-xs);
          color: var(--ax-text-secondary);
        }
      }

      .inner-loading-doc__avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--ax-primary);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
      }

      .inner-loading-doc__card-body {
        padding: var(--ax-spacing-md);

        p {
          margin: 0;
          font-size: var(--ax-text-sm);
          color: var(--ax-text-secondary);
        }
      }

      .inner-loading-doc__card-actions {
        display: flex;
        gap: var(--ax-spacing-sm);
        padding: var(--ax-spacing-sm) var(--ax-spacing-md);
        border-top: 1px solid var(--ax-border-default);
      }

      .inner-loading-doc__table {
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-lg);
        overflow: hidden;

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th,
        td {
          padding: var(--ax-spacing-sm) var(--ax-spacing-md);
          text-align: left;
          border-bottom: 1px solid var(--ax-border-default);
          font-size: var(--ax-text-sm);
        }

        th {
          background: var(--ax-background-subtle);
          font-weight: 600;
        }
      }

      .inner-loading-doc__table-actions {
        padding: var(--ax-spacing-sm) var(--ax-spacing-md);
        background: var(--ax-background-subtle);
      }

      .inner-loading-doc__form {
        padding: var(--ax-spacing-lg);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-lg);
        max-width: 400px;
      }

      .inner-loading-doc__form-field {
        margin-bottom: var(--ax-spacing-md);

        label {
          display: block;
          font-size: var(--ax-text-sm);
          font-weight: 500;
          margin-bottom: var(--ax-spacing-xs);
        }

        input {
          width: 100%;
          padding: var(--ax-spacing-sm) var(--ax-spacing-md);
          border: 1px solid var(--ax-border-default);
          border-radius: var(--ax-radius-md);
          font-size: var(--ax-text-sm);
        }
      }

      .inner-loading-doc__form-actions {
        display: flex;
        gap: var(--ax-spacing-sm);
        margin-top: var(--ax-spacing-lg);
      }

      .inner-loading-doc__api-table {
        overflow-x: auto;
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-lg);

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th,
        td {
          text-align: left;
          padding: var(--ax-spacing-sm) var(--ax-spacing-md);
          border-bottom: 1px solid var(--ax-border-default);
          font-size: var(--ax-text-sm);
        }

        th {
          background: var(--ax-background-subtle);
          font-weight: 600;
          font-size: var(--ax-text-xs);
          text-transform: uppercase;
        }

        tr:last-child td {
          border-bottom: none;
        }

        code {
          background: var(--ax-background-subtle);
          padding: 2px 6px;
          border-radius: var(--ax-radius-sm);
          font-size: var(--ax-text-xs);
        }
      }

      .inner-loading-doc__notes {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          display: flex;
          align-items: flex-start;
          gap: var(--ax-spacing-sm);
          padding: var(--ax-spacing-md);
          background: var(--ax-background-subtle);
          border-radius: var(--ax-radius-md);
          margin-bottom: var(--ax-spacing-sm);
          font-size: var(--ax-text-sm);

          mat-icon {
            color: var(--ax-primary);
            font-size: 20px;
            width: 20px;
            height: 20px;
          }

          code {
            background: var(--ax-background-default);
            padding: 2px 6px;
            border-radius: var(--ax-radius-sm);
            font-size: var(--ax-text-xs);
          }
        }
      }

      .inner-loading-doc__guidelines {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--ax-spacing-lg);
      }

      .inner-loading-doc__guideline {
        padding: var(--ax-spacing-lg);
        border-radius: var(--ax-radius-lg);

        &--do {
          background: var(--ax-success-faint);
        }

        &--dont {
          background: var(--ax-error-faint);
        }

        h4 {
          display: flex;
          align-items: center;
          gap: var(--ax-spacing-xs);
          margin: 0 0 var(--ax-spacing-md) 0;
        }

        ul {
          margin: 0;
          padding-left: var(--ax-spacing-lg);

          li {
            margin-bottom: var(--ax-spacing-xs);
            font-size: var(--ax-text-sm);
          }
        }
      }

      .inner-loading-doc__use-cases {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          display: flex;
          align-items: flex-start;
          gap: var(--ax-spacing-sm);
          padding: var(--ax-spacing-md);
          background: var(--ax-background-subtle);
          border-radius: var(--ax-radius-md);
          margin-bottom: var(--ax-spacing-sm);
          font-size: var(--ax-text-sm);

          mat-icon {
            color: var(--ax-primary);
          }
        }
      }
    `,
  ],
})
export class InnerLoadingDocComponent {
  isCardLoading = true;
  isTableLoading = false;
  isFormLoading = false;

  toggleCardLoading() {
    this.isCardLoading = !this.isCardLoading;
  }

  toggleTableLoading() {
    this.isTableLoading = !this.isTableLoading;
  }

  submitForm() {
    this.isFormLoading = true;
    setTimeout(() => {
      this.isFormLoading = false;
    }, 2000);
  }

  basicUsageCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Parent must have position: relative -->
<div class="card relative">
  <ax-inner-loading [showing]="isLoading"></ax-inner-loading>
  <div class="card-content">
    <!-- Your content here -->
  </div>
</div>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { AxInnerLoadingComponent } from '@aegisx/ui';

@Component({
  imports: [AxInnerLoadingComponent],
})
export class MyComponent {
  isLoading = false;

  loadData() {
    this.isLoading = true;
    this.api.fetchData().subscribe({
      next: () => this.isLoading = false,
      error: () => this.isLoading = false,
    });
  }
}`,
    },
  ];

  sizesCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Small spinner for compact areas -->
<div class="relative">
  <ax-inner-loading [showing]="true" size="sm"></ax-inner-loading>
  ...
</div>

<!-- Medium (default) -->
<div class="relative">
  <ax-inner-loading [showing]="true" size="md"></ax-inner-loading>
  ...
</div>

<!-- Large for big containers -->
<div class="relative">
  <ax-inner-loading [showing]="true" size="lg"></ax-inner-loading>
  ...
</div>`,
    },
  ];

  labelCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<div class="table-container relative">
  <ax-inner-loading
    [showing]="isLoading"
    label="Loading data...">
  </ax-inner-loading>
  <table>
    <!-- Table content -->
  </table>
</div>`,
    },
  ];

  darkCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Use dark overlay on light backgrounds -->
<div class="light-panel relative">
  <ax-inner-loading
    [showing]="isLoading"
    [dark]="true"
    label="Processing...">
  </ax-inner-loading>
  <div class="content">
    <!-- Light-colored content -->
  </div>
</div>`,
    },
  ];

  colorsCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Primary color (default) -->
<ax-inner-loading [showing]="true" color="primary"></ax-inner-loading>

<!-- Accent color -->
<ax-inner-loading [showing]="true" color="accent"></ax-inner-loading>

<!-- Warn color -->
<ax-inner-loading [showing]="true" color="warn"></ax-inner-loading>

<!-- Light color (for dark backgrounds) -->
<ax-inner-loading [showing]="true" color="light"></ax-inner-loading>`,
    },
  ];

  customBgCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<div class="panel relative">
  <ax-inner-loading
    [showing]="isLoading"
    backgroundColor="rgba(99, 102, 241, 0.9)"
    color="light"
    label="Custom overlay...">
  </ax-inner-loading>
  <!-- Content -->
</div>`,
    },
  ];

  cardLoadingCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<div class="card relative">
  <ax-inner-loading
    [showing]="isLoading"
    label="Fetching user data...">
  </ax-inner-loading>
  <div class="card-header">
    <div class="avatar">JD</div>
    <div>
      <h4>John Doe</h4>
      <span>Software Engineer</span>
    </div>
  </div>
  <div class="card-body">
    <p>Card content here...</p>
  </div>
  <div class="card-actions">
    <button (click)="toggleLoading()">
      {{ isLoading ? 'Stop' : 'Reload' }}
    </button>
  </div>
</div>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxInnerLoadingComponent } from '@aegisx/ui';

@Component({
  imports: [AxInnerLoadingComponent],
})
export class CardComponent {
  isLoading = false;

  loadData() {
    this.isLoading = true;
    this.userService.fetchUser().subscribe({
      next: (data) => {
        this.user = data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false,
    });
  }

  toggleLoading() {
    this.isLoading = !this.isLoading;
  }
}`,
    },
  ];

  tableLoadingCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<div class="table-container relative">
  <ax-inner-loading
    [showing]="isLoading"
    size="lg"
    label="Loading records...">
  </ax-inner-loading>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      @for (user of users; track user.id) {
        <tr>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.status }}</td>
        </tr>
      }
    </tbody>
  </table>
  <button (click)="refresh()">Refresh</button>
</div>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `@Component({
  imports: [AxInnerLoadingComponent],
})
export class TableComponent {
  isLoading = false;
  users: User[] = [];

  refresh() {
    this.isLoading = true;
    this.userService.getAll().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: () => this.isLoading = false,
    });
  }
}`,
    },
  ];

  formSubmissionCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<form class="relative" (ngSubmit)="onSubmit()">
  <ax-inner-loading
    [showing]="isSaving"
    label="Saving changes...">
  </ax-inner-loading>

  <div class="form-field">
    <label>Name</label>
    <input [(ngModel)]="user.name" name="name" />
  </div>

  <div class="form-field">
    <label>Email</label>
    <input [(ngModel)]="user.email" name="email" type="email" />
  </div>

  <div class="form-actions">
    <button type="submit" [disabled]="isSaving">
      Save Changes
    </button>
    <button type="button" (click)="cancel()">Cancel</button>
  </div>
</form>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `@Component({
  imports: [AxInnerLoadingComponent, FormsModule],
})
export class FormComponent {
  isSaving = false;
  user = { name: '', email: '' };

  onSubmit() {
    this.isSaving = true;
    this.userService.save(this.user).subscribe({
      next: () => {
        this.isSaving = false;
        this.snackBar.open('Saved successfully!');
      },
      error: () => {
        this.isSaving = false;
        this.snackBar.open('Save failed');
      },
    });
  }
}`,
    },
  ];

  innerLoadingTokens: ComponentToken[] = [
    {
      category: 'Colors',
      cssVar: '--ax-background-default',
      usage: 'Default overlay background color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-primary',
      usage: 'Primary spinner color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-accent',
      usage: 'Accent spinner color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-warn',
      usage: 'Warn spinner color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-secondary',
      usage: 'Label text color',
    },
    {
      category: 'Typography',
      cssVar: '--ax-text-sm',
      usage: 'Label font size',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-sm',
      usage: 'Gap between spinner and label',
    },
  ];
}
