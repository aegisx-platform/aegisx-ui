import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AxLoadingButtonComponent } from '@aegisx/ui';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../../../components/docs';
import { ComponentToken } from '../../../../../../types/docs.types';

@Component({
  selector: 'ax-loading-button-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    AxLoadingButtonComponent,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="loading-button-doc">
      <ax-doc-header
        title="Loading Button"
        icon="smart_button"
        description="Material 3 compliant button with built-in loading state, gradient background, shimmer effect, and CSS-only spinner. Perfect for form submissions and async actions."
        [breadcrumbs]="[
          { label: 'Feedback', link: '/docs/components/aegisx/feedback/alert' },
          { label: 'Loading Button' },
        ]"
        status="stable"
        version="1.0.0"
        importStatement="import { AxLoadingButtonComponent } from '@aegisx/ui';"
      ></ax-doc-header>

      <mat-tab-group class="loading-button-doc__tabs" animationDuration="200ms">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="loading-button-doc__tab-content">
            <!-- Basic Usage -->
            <section class="loading-button-doc__section">
              <h2>Basic Usage</h2>
              <p>
                A button that shows loading state with gradient background and
                CSS-only spinner. Click the buttons to toggle loading state.
              </p>

              <ax-live-preview variant="bordered">
                <div class="loading-button-doc__demo-row">
                  <ax-loading-button
                    [loading]="isBasicLoading"
                    loadingText="Loading..."
                    (buttonClick)="toggleBasicLoading()"
                  >
                    Click Me
                  </ax-loading-button>

                  <ax-loading-button
                    [loading]="isBasicLoading2"
                    loadingText="Submitting..."
                    icon="send"
                    iconPosition="end"
                    (buttonClick)="toggleBasicLoading2()"
                  >
                    Submit
                  </ax-loading-button>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="basicUsageCode"></ax-code-tabs>
            </section>

            <!-- Variants -->
            <section class="loading-button-doc__section">
              <h2>Button Variants</h2>
              <p>
                Choose from raised (default), stroked, flat, or basic variants
                to match your design needs.
              </p>

              <ax-live-preview variant="bordered">
                <div class="loading-button-doc__demo-row">
                  <ax-loading-button
                    variant="raised"
                    [loading]="isRaisedLoading"
                    loadingText="Raised..."
                    (buttonClick)="toggleRaisedLoading()"
                  >
                    Raised
                  </ax-loading-button>

                  <ax-loading-button
                    variant="stroked"
                    [loading]="isStrokedLoading"
                    loadingText="Stroked..."
                    (buttonClick)="toggleStrokedLoading()"
                  >
                    Stroked
                  </ax-loading-button>

                  <ax-loading-button
                    variant="flat"
                    [loading]="isFlatLoading"
                    loadingText="Flat..."
                    (buttonClick)="toggleFlatLoading()"
                  >
                    Flat
                  </ax-loading-button>

                  <ax-loading-button
                    variant="basic"
                    [loading]="isBasicVarLoading"
                    loadingText="Basic..."
                    (buttonClick)="toggleBasicVarLoading()"
                  >
                    Basic
                  </ax-loading-button>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="variantsCode"></ax-code-tabs>
            </section>

            <!-- Icons -->
            <section class="loading-button-doc__section">
              <h2>With Icons</h2>
              <p>
                Add icons at the start or end of the button text. Icons
                automatically animate on hover.
              </p>

              <ax-live-preview variant="bordered">
                <div class="loading-button-doc__demo-row">
                  <ax-loading-button
                    [loading]="false"
                    icon="arrow_forward"
                    iconPosition="end"
                  >
                    Next
                  </ax-loading-button>

                  <ax-loading-button
                    [loading]="false"
                    icon="arrow_back"
                    iconPosition="start"
                    variant="stroked"
                  >
                    Back
                  </ax-loading-button>

                  <ax-loading-button
                    [loading]="false"
                    icon="check"
                    iconPosition="end"
                  >
                    Confirm
                  </ax-loading-button>

                  <ax-loading-button
                    [loading]="false"
                    icon="refresh"
                    iconPosition="start"
                    variant="stroked"
                  >
                    Refresh
                  </ax-loading-button>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="iconsCode"></ax-code-tabs>
            </section>

            <!-- Full Width -->
            <section class="loading-button-doc__section">
              <h2>Full Width</h2>
              <p>
                Make the button span the full width of its container. Perfect
                for forms and mobile layouts.
              </p>

              <ax-live-preview variant="bordered">
                <div class="loading-button-doc__demo-column">
                  <ax-loading-button
                    [loading]="isFullWidthLoading"
                    loadingText="Signing in..."
                    icon="login"
                    iconPosition="end"
                    [fullWidth]="true"
                    (buttonClick)="simulateLogin()"
                  >
                    Sign In
                  </ax-loading-button>

                  <ax-loading-button
                    variant="stroked"
                    [loading]="false"
                    icon="person_add"
                    iconPosition="end"
                    [fullWidth]="true"
                  >
                    Create Account
                  </ax-loading-button>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="fullWidthCode"></ax-code-tabs>
            </section>

            <!-- Loading State Features -->
            <section class="loading-button-doc__section">
              <h2>Loading State Features</h2>
              <p>
                The raised variant features gradient background, shimmer effect,
                and pulse animation during loading.
              </p>

              <ax-live-preview variant="bordered">
                <div class="loading-button-doc__demo-row">
                  <ax-loading-button
                    [loading]="true"
                    loadingText="Saving..."
                    [fullWidth]="false"
                  >
                    Save Changes
                  </ax-loading-button>

                  <ax-loading-button
                    variant="stroked"
                    [loading]="true"
                    loadingText="Resending..."
                    [fullWidth]="false"
                  >
                    Resend Email
                  </ax-loading-button>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="loadingFeaturesCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="loading-button-doc__tab-content">
            <!-- Form Submission -->
            <section class="loading-button-doc__section">
              <h2>Form Submission</h2>
              <p>Common pattern for form submit buttons with loading state.</p>

              <ax-live-preview variant="bordered">
                <div class="loading-button-doc__form">
                  <div class="loading-button-doc__form-field">
                    <label>Email</label>
                    <input type="email" placeholder="your@email.com" />
                  </div>
                  <div class="loading-button-doc__form-field">
                    <label>Password</label>
                    <input type="password" placeholder="Enter password" />
                  </div>
                  <ax-loading-button
                    type="submit"
                    [loading]="isFormLoading"
                    loadingText="Signing in..."
                    icon="arrow_forward"
                    iconPosition="end"
                    [fullWidth]="true"
                    (buttonClick)="simulateFormSubmit()"
                  >
                    Sign In
                  </ax-loading-button>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="formSubmissionCode"></ax-code-tabs>
            </section>

            <!-- Auth Actions -->
            <section class="loading-button-doc__section">
              <h2>Authentication Actions</h2>
              <p>
                Buttons for authentication flows like login, register, and
                password reset.
              </p>

              <ax-live-preview variant="bordered">
                <div class="loading-button-doc__demo-column">
                  <ax-loading-button
                    [loading]="isAuthLoading1"
                    loadingText="Signing in..."
                    icon="login"
                    iconPosition="end"
                    [fullWidth]="true"
                    (buttonClick)="simulateAuth(1)"
                  >
                    Sign In
                  </ax-loading-button>

                  <ax-loading-button
                    [loading]="isAuthLoading2"
                    loadingText="Creating account..."
                    icon="person_add"
                    iconPosition="end"
                    [fullWidth]="true"
                    (buttonClick)="simulateAuth(2)"
                  >
                    Create Account
                  </ax-loading-button>

                  <ax-loading-button
                    variant="stroked"
                    [loading]="isAuthLoading3"
                    loadingText="Sending..."
                    icon="email"
                    iconPosition="end"
                    [fullWidth]="true"
                    (buttonClick)="simulateAuth(3)"
                  >
                    Send Reset Link
                  </ax-loading-button>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="authActionsCode"></ax-code-tabs>
            </section>

            <!-- CRUD Actions -->
            <section class="loading-button-doc__section">
              <h2>CRUD Actions</h2>
              <p>Buttons for create, update, delete operations.</p>

              <ax-live-preview variant="bordered">
                <div class="loading-button-doc__demo-row">
                  <ax-loading-button
                    [loading]="isCrudLoading1"
                    loadingText="Saving..."
                    icon="save"
                    iconPosition="start"
                    (buttonClick)="simulateCrud(1)"
                  >
                    Save
                  </ax-loading-button>

                  <ax-loading-button
                    variant="stroked"
                    [loading]="isCrudLoading2"
                    loadingText="Updating..."
                    icon="edit"
                    iconPosition="start"
                    (buttonClick)="simulateCrud(2)"
                  >
                    Update
                  </ax-loading-button>

                  <ax-loading-button
                    variant="stroked"
                    [loading]="isCrudLoading3"
                    loadingText="Deleting..."
                    icon="delete"
                    iconPosition="start"
                    (buttonClick)="simulateCrud(3)"
                  >
                    Delete
                  </ax-loading-button>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="crudActionsCode"></ax-code-tabs>
            </section>

            <!-- Disabled State -->
            <section class="loading-button-doc__section">
              <h2>Disabled State</h2>
              <p>Buttons can be disabled independently of loading state.</p>

              <ax-live-preview variant="bordered">
                <div class="loading-button-doc__demo-row">
                  <ax-loading-button [disabled]="true" [loading]="false">
                    Disabled
                  </ax-loading-button>

                  <ax-loading-button
                    variant="stroked"
                    [disabled]="true"
                    [loading]="false"
                  >
                    Disabled Stroked
                  </ax-loading-button>

                  <ax-loading-button
                    [disabled]="true"
                    [loading]="true"
                    loadingText="Loading..."
                  >
                    Disabled Loading
                  </ax-loading-button>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="disabledCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="loading-button-doc__tab-content">
            <section class="loading-button-doc__section">
              <h2>Properties (Inputs)</h2>
              <div class="loading-button-doc__api-table">
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
                      <td><code>variant</code></td>
                      <td>
                        <code>'raised' | 'stroked' | 'flat' | 'basic'</code>
                      </td>
                      <td><code>'raised'</code></td>
                      <td>Button style variant</td>
                    </tr>
                    <tr>
                      <td><code>color</code></td>
                      <td><code>'primary' | 'accent' | 'warn' | ''</code></td>
                      <td><code>'primary'</code></td>
                      <td>Button color theme</td>
                    </tr>
                    <tr>
                      <td><code>loading</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Show loading state with spinner</td>
                    </tr>
                    <tr>
                      <td><code>loadingText</code></td>
                      <td><code>string</code></td>
                      <td><code>'Loading...'</code></td>
                      <td>Text displayed during loading</td>
                    </tr>
                    <tr>
                      <td><code>disabled</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Disable button interaction</td>
                    </tr>
                    <tr>
                      <td><code>disableWhenLoading</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Auto-disable during loading</td>
                    </tr>
                    <tr>
                      <td><code>type</code></td>
                      <td><code>'button' | 'submit' | 'reset'</code></td>
                      <td><code>'button'</code></td>
                      <td>HTML button type</td>
                    </tr>
                    <tr>
                      <td><code>icon</code></td>
                      <td><code>string</code></td>
                      <td><code>''</code></td>
                      <td>Material icon name</td>
                    </tr>
                    <tr>
                      <td><code>iconPosition</code></td>
                      <td><code>'start' | 'end'</code></td>
                      <td><code>'end'</code></td>
                      <td>Icon placement relative to text</td>
                    </tr>
                    <tr>
                      <td><code>fullWidth</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Expand to container width</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="loading-button-doc__section">
              <h2>Events (Outputs)</h2>
              <div class="loading-button-doc__api-table">
                <table>
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>buttonClick</code></td>
                      <td><code>EventEmitter&lt;MouseEvent&gt;</code></td>
                      <td>
                        Emitted on click (only when not loading or disabled)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="loading-button-doc__section">
              <h2>Content Projection</h2>
              <div class="loading-button-doc__api-table">
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
                        Button text content (replaced by loadingText when
                        loading)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="loading-button-doc__section">
              <h2>Usage Notes</h2>
              <ul class="loading-button-doc__notes">
                <li>
                  <mat-icon>info</mat-icon>
                  Use <code>(buttonClick)</code> instead of <code>(click)</code>
                  to prevent clicks during loading
                </li>
                <li>
                  <mat-icon>info</mat-icon>
                  Set <code>type="submit"</code> for form submission buttons
                </li>
                <li>
                  <mat-icon>info</mat-icon>
                  The raised variant uses gradient + shimmer for premium look
                </li>
                <li>
                  <mat-icon>info</mat-icon>
                  CSS-only spinner for better performance than mat-spinner
                </li>
              </ul>
            </section>
          </div>
        </mat-tab>

        <!-- Tokens Tab -->
        <mat-tab label="Tokens">
          <div class="loading-button-doc__tab-content">
            <ax-component-tokens
              [tokens]="loadingButtonTokens"
            ></ax-component-tokens>
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="loading-button-doc__tab-content">
            <section class="loading-button-doc__section">
              <h2>Do's and Don'ts</h2>
              <div class="loading-button-doc__guidelines">
                <div
                  class="loading-button-doc__guideline loading-button-doc__guideline--do"
                >
                  <h4><mat-icon>check_circle</mat-icon> Do</h4>
                  <ul>
                    <li>Use descriptive loadingText for context</li>
                    <li>Use raised variant for primary actions</li>
                    <li>Use stroked variant for secondary actions</li>
                    <li>Add icon for visual clarity</li>
                    <li>Use fullWidth for mobile/form buttons</li>
                  </ul>
                </div>
                <div
                  class="loading-button-doc__guideline loading-button-doc__guideline--dont"
                >
                  <h4><mat-icon>cancel</mat-icon> Don't</h4>
                  <ul>
                    <li>Use vague text like "Please wait..."</li>
                    <li>Nest loading buttons inside each other</li>
                    <li>Use for instant operations</li>
                    <li>Forget to handle errors</li>
                    <li>Leave loading state stuck on error</li>
                  </ul>
                </div>
              </div>
            </section>

            <section class="loading-button-doc__section">
              <h2>When to Use</h2>
              <ul class="loading-button-doc__use-cases">
                <li>
                  <mat-icon>login</mat-icon>
                  <strong>Authentication:</strong> Sign in, sign up, password
                  reset
                </li>
                <li>
                  <mat-icon>save</mat-icon>
                  <strong>Form submission:</strong> Save, update, create
                  operations
                </li>
                <li>
                  <mat-icon>send</mat-icon>
                  <strong>Async actions:</strong> Email sending, API calls
                </li>
                <li>
                  <mat-icon>upload</mat-icon>
                  <strong>File operations:</strong> Upload, download, export
                </li>
              </ul>
            </section>

            <section class="loading-button-doc__section">
              <h2>Accessibility</h2>
              <ul class="loading-button-doc__notes">
                <li>
                  <mat-icon>accessibility</mat-icon>
                  Button is automatically disabled during loading to prevent
                  double-submission
                </li>
                <li>
                  <mat-icon>accessibility</mat-icon>
                  Loading text provides context for screen readers
                </li>
                <li>
                  <mat-icon>accessibility</mat-icon>
                  Maintains focus state after loading completes
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
      .loading-button-doc {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--ax-spacing-xl, 1.5rem);
      }

      .loading-button-doc__tabs {
        margin-top: var(--ax-spacing-xl, 1.5rem);
      }

      .loading-button-doc__tab-content {
        padding: var(--ax-spacing-xl, 1.5rem) 0;
      }

      .loading-button-doc__section {
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

      .loading-button-doc__demo-row {
        display: flex;
        gap: var(--ax-spacing-md);
        flex-wrap: wrap;
        align-items: center;
      }

      .loading-button-doc__demo-column {
        display: flex;
        flex-direction: column;
        gap: var(--ax-spacing-md);
        max-width: 320px;
      }

      .loading-button-doc__form {
        padding: var(--ax-spacing-lg);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-lg);
        max-width: 320px;
      }

      .loading-button-doc__form-field {
        margin-bottom: var(--ax-spacing-md);

        label {
          display: block;
          font-size: var(--ax-text-sm);
          font-weight: 500;
          margin-bottom: var(--ax-spacing-xs);
          color: var(--ax-text-heading);
        }

        input {
          width: 100%;
          padding: var(--ax-spacing-sm) var(--ax-spacing-md);
          border: 1px solid var(--ax-border-default);
          border-radius: var(--ax-radius-md);
          font-size: var(--ax-text-sm);

          &:focus {
            outline: none;
            border-color: var(--ax-primary);
          }
        }
      }

      .loading-button-doc__api-table {
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

      .loading-button-doc__notes {
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

      .loading-button-doc__guidelines {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--ax-spacing-lg);
      }

      .loading-button-doc__guideline {
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

      .loading-button-doc__use-cases {
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
export class LoadingButtonDocComponent {
  // Basic loading states
  isBasicLoading = false;
  isBasicLoading2 = false;

  // Variant loading states
  isRaisedLoading = false;
  isStrokedLoading = false;
  isFlatLoading = false;
  isBasicVarLoading = false;

  // Full width loading
  isFullWidthLoading = false;

  // Form loading
  isFormLoading = false;

  // Auth loading states
  isAuthLoading1 = false;
  isAuthLoading2 = false;
  isAuthLoading3 = false;

  // CRUD loading states
  isCrudLoading1 = false;
  isCrudLoading2 = false;
  isCrudLoading3 = false;

  toggleBasicLoading() {
    this.isBasicLoading = true;
    setTimeout(() => (this.isBasicLoading = false), 2000);
  }

  toggleBasicLoading2() {
    this.isBasicLoading2 = true;
    setTimeout(() => (this.isBasicLoading2 = false), 2000);
  }

  toggleRaisedLoading() {
    this.isRaisedLoading = true;
    setTimeout(() => (this.isRaisedLoading = false), 2000);
  }

  toggleStrokedLoading() {
    this.isStrokedLoading = true;
    setTimeout(() => (this.isStrokedLoading = false), 2000);
  }

  toggleFlatLoading() {
    this.isFlatLoading = true;
    setTimeout(() => (this.isFlatLoading = false), 2000);
  }

  toggleBasicVarLoading() {
    this.isBasicVarLoading = true;
    setTimeout(() => (this.isBasicVarLoading = false), 2000);
  }

  simulateLogin() {
    this.isFullWidthLoading = true;
    setTimeout(() => (this.isFullWidthLoading = false), 2500);
  }

  simulateFormSubmit() {
    this.isFormLoading = true;
    setTimeout(() => (this.isFormLoading = false), 2500);
  }

  simulateAuth(index: number) {
    if (index === 1) {
      this.isAuthLoading1 = true;
      setTimeout(() => (this.isAuthLoading1 = false), 2000);
    } else if (index === 2) {
      this.isAuthLoading2 = true;
      setTimeout(() => (this.isAuthLoading2 = false), 2000);
    } else {
      this.isAuthLoading3 = true;
      setTimeout(() => (this.isAuthLoading3 = false), 2000);
    }
  }

  simulateCrud(index: number) {
    if (index === 1) {
      this.isCrudLoading1 = true;
      setTimeout(() => (this.isCrudLoading1 = false), 2000);
    } else if (index === 2) {
      this.isCrudLoading2 = true;
      setTimeout(() => (this.isCrudLoading2 = false), 2000);
    } else {
      this.isCrudLoading3 = true;
      setTimeout(() => (this.isCrudLoading3 = false), 2000);
    }
  }

  basicUsageCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Basic loading button -->
<ax-loading-button
  [loading]="isLoading"
  loadingText="Loading..."
  (buttonClick)="onSubmit()"
>
  Click Me
</ax-loading-button>

<!-- With icon -->
<ax-loading-button
  [loading]="isLoading"
  loadingText="Submitting..."
  icon="send"
  iconPosition="end"
  (buttonClick)="onSubmit()"
>
  Submit
</ax-loading-button>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { AxLoadingButtonComponent } from '@aegisx/ui';

@Component({
  imports: [AxLoadingButtonComponent],
})
export class MyComponent {
  isLoading = false;

  onSubmit() {
    this.isLoading = true;
    this.api.submit().subscribe({
      next: () => this.isLoading = false,
      error: () => this.isLoading = false,
    });
  }
}`,
    },
  ];

  variantsCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Raised (default) - Primary actions -->
<ax-loading-button variant="raised" [loading]="isLoading">
  Raised
</ax-loading-button>

<!-- Stroked - Secondary actions -->
<ax-loading-button variant="stroked" [loading]="isLoading">
  Stroked
</ax-loading-button>

<!-- Flat - Subtle actions -->
<ax-loading-button variant="flat" [loading]="isLoading">
  Flat
</ax-loading-button>

<!-- Basic - Text-only actions -->
<ax-loading-button variant="basic" [loading]="isLoading">
  Basic
</ax-loading-button>`,
    },
  ];

  iconsCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Icon at end (default) -->
<ax-loading-button icon="arrow_forward" iconPosition="end">
  Next
</ax-loading-button>

<!-- Icon at start -->
<ax-loading-button icon="arrow_back" iconPosition="start">
  Back
</ax-loading-button>

<!-- Common icons -->
<ax-loading-button icon="check" iconPosition="end">
  Confirm
</ax-loading-button>

<ax-loading-button icon="refresh" iconPosition="start" variant="stroked">
  Refresh
</ax-loading-button>`,
    },
  ];

  fullWidthCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-loading-button
  [loading]="isLoading"
  loadingText="Signing in..."
  icon="login"
  iconPosition="end"
  [fullWidth]="true"
  (buttonClick)="onSignIn()"
>
  Sign In
</ax-loading-button>

<ax-loading-button
  variant="stroked"
  icon="person_add"
  iconPosition="end"
  [fullWidth]="true"
  (buttonClick)="onCreateAccount()"
>
  Create Account
</ax-loading-button>`,
    },
  ];

  loadingFeaturesCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Raised variant with gradient + shimmer -->
<ax-loading-button
  [loading]="true"
  loadingText="Saving..."
>
  Save Changes
</ax-loading-button>

<!-- Stroked variant with opacity fade -->
<ax-loading-button
  variant="stroked"
  [loading]="true"
  loadingText="Resending..."
>
  Resend Email
</ax-loading-button>`,
    },
  ];

  formSubmissionCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<form (ngSubmit)="onSubmit()">
  <mat-form-field appearance="outline">
    <mat-label>Email</mat-label>
    <input matInput type="email" formControlName="email" />
  </mat-form-field>

  <mat-form-field appearance="outline">
    <mat-label>Password</mat-label>
    <input matInput type="password" formControlName="password" />
  </mat-form-field>

  <ax-loading-button
    type="submit"
    [loading]="isLoading"
    loadingText="Signing in..."
    icon="arrow_forward"
    iconPosition="end"
    [fullWidth]="true"
    (buttonClick)="onSubmit()"
  >
    Sign In
  </ax-loading-button>
</form>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `@Component({
  imports: [AxLoadingButtonComponent, ReactiveFormsModule],
})
export class LoginComponent {
  isLoading = false;

  onSubmit() {
    if (this.form.invalid) return;

    this.isLoading = true;
    this.authService.login(this.form.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Login failed', 'Close');
      },
    });
  }
}`,
    },
  ];

  authActionsCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Sign In -->
<ax-loading-button
  [loading]="isSigningIn"
  loadingText="Signing in..."
  icon="login"
  iconPosition="end"
  [fullWidth]="true"
  (buttonClick)="signIn()"
>
  Sign In
</ax-loading-button>

<!-- Create Account -->
<ax-loading-button
  [loading]="isCreating"
  loadingText="Creating account..."
  icon="person_add"
  iconPosition="end"
  [fullWidth]="true"
  (buttonClick)="createAccount()"
>
  Create Account
</ax-loading-button>

<!-- Send Reset Link -->
<ax-loading-button
  variant="stroked"
  [loading]="isSending"
  loadingText="Sending..."
  icon="email"
  iconPosition="end"
  [fullWidth]="true"
  (buttonClick)="sendResetLink()"
>
  Send Reset Link
</ax-loading-button>`,
    },
  ];

  crudActionsCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<div class="actions">
  <ax-loading-button
    [loading]="isSaving"
    loadingText="Saving..."
    icon="save"
    iconPosition="start"
    (buttonClick)="save()"
  >
    Save
  </ax-loading-button>

  <ax-loading-button
    variant="stroked"
    [loading]="isUpdating"
    loadingText="Updating..."
    icon="edit"
    iconPosition="start"
    (buttonClick)="update()"
  >
    Update
  </ax-loading-button>

  <ax-loading-button
    variant="stroked"
    [loading]="isDeleting"
    loadingText="Deleting..."
    icon="delete"
    iconPosition="start"
    (buttonClick)="delete()"
  >
    Delete
  </ax-loading-button>
</div>`,
    },
  ];

  disabledCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Disabled button -->
<ax-loading-button [disabled]="true">
  Disabled
</ax-loading-button>

<!-- Disabled stroked -->
<ax-loading-button variant="stroked" [disabled]="true">
  Disabled Stroked
</ax-loading-button>

<!-- Disabled + loading (both states) -->
<ax-loading-button
  [disabled]="true"
  [loading]="true"
  loadingText="Loading..."
>
  Disabled Loading
</ax-loading-button>`,
    },
  ];

  loadingButtonTokens: ComponentToken[] = [
    {
      category: 'Colors',
      cssVar: '--ax-brand-default',
      usage: 'Primary button background and spinner color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-brand-emphasis',
      usage: 'Gradient end color and hover state',
    },
    {
      category: 'Colors',
      cssVar: '--ax-brand-subtle',
      usage: 'Flat variant background',
    },
    {
      category: 'Colors',
      cssVar: '--ax-brand-muted',
      usage: 'Flat variant hover background',
    },
    {
      category: 'Shadows',
      cssVar: '--ax-shadow-sm',
      usage: 'Raised button default shadow',
    },
    {
      category: 'Shadows',
      cssVar: '--ax-shadow-md',
      usage: 'Raised button hover shadow',
    },
    {
      category: 'Border Radius',
      cssVar: '--ax-radius-md',
      usage: 'Button border radius',
    },
    {
      category: 'Background',
      cssVar: '--ax-background-muted',
      usage: 'Basic variant hover background',
    },
  ];
}
