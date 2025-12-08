import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AxToastService } from '@aegisx/ui';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../../../components/docs';
import { ComponentToken, CodeTab } from '../../../../../../types/docs.types';

@Component({
  selector: 'ax-toast-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="toast-doc">
      <ax-doc-header
        title="Toast Service"
        icon="notifications"
        description="Unified notification service supporting both ngx-toastr and MatSnackBar. Show success, error, warning, and info messages with a simple API."
        [breadcrumbs]="[
          { label: 'Feedback', link: '/docs/components/aegisx/feedback/alert' },
          { label: 'Toast' },
        ]"
        status="stable"
        version="1.0.0"
        importStatement="import { AxToastService } from '&#64;aegisx/ui';"
      ></ax-doc-header>

      <mat-tab-group class="toast-doc__tabs" animationDuration="150ms">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="toast-doc__tab-content">
            <section class="toast-doc__section">
              <h2>Basic Usage</h2>
              <p>
                The Toast Service provides a unified API for showing
                notifications. Simply inject the service and call the
                appropriate method.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="row"
                gap="var(--ax-spacing-md)"
              >
                <button mat-flat-button color="primary" (click)="showSuccess()">
                  <mat-icon>check_circle</mat-icon>
                  Success
                </button>
                <button mat-flat-button color="warn" (click)="showError()">
                  <mat-icon>error</mat-icon>
                  Error
                </button>
                <button mat-stroked-button (click)="showWarning()">
                  <mat-icon>warning</mat-icon>
                  Warning
                </button>
                <button mat-stroked-button (click)="showInfo()">
                  <mat-icon>info</mat-icon>
                  Info
                </button>
              </ax-live-preview>

              <ax-code-tabs [tabs]="basicUsageCode"></ax-code-tabs>
            </section>

            <section class="toast-doc__section">
              <h2>With Title</h2>
              <p>
                Add a title to provide additional context for the notification.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="row"
                gap="var(--ax-spacing-md)"
              >
                <button
                  mat-flat-button
                  color="primary"
                  (click)="showWithTitle()"
                >
                  <mat-icon>title</mat-icon>
                  With Title
                </button>
              </ax-live-preview>

              <ax-code-tabs [tabs]="withTitleCode"></ax-code-tabs>
            </section>

            <section class="toast-doc__section">
              <h2>ngx-toastr Stacking</h2>
              <p>
                ngx-toastr supports stacking multiple toasts. Click the button
                multiple times to see them stack. Each toast has a close button
                and progress bar.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="row"
                gap="var(--ax-spacing-md)"
              >
                <button
                  mat-flat-button
                  color="primary"
                  (click)="showStackingDemo()"
                >
                  <mat-icon>layers</mat-icon>
                  Show Stacking Toasts
                </button>
                <button mat-stroked-button (click)="clearAllToasts()">
                  <mat-icon>clear_all</mat-icon>
                  Clear All
                </button>
              </ax-live-preview>

              <ax-code-tabs [tabs]="stackingCode"></ax-code-tabs>
            </section>

            <section class="toast-doc__section">
              <h2>Toast Positions</h2>
              <p>
                ngx-toastr supports various positions. Choose where toasts
                appear on screen.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="row"
                gap="var(--ax-spacing-md)"
              >
                <button
                  mat-stroked-button
                  (click)="showPosition('toast-top-right')"
                >
                  Top Right
                </button>
                <button
                  mat-stroked-button
                  (click)="showPosition('toast-top-left')"
                >
                  Top Left
                </button>
                <button
                  mat-stroked-button
                  (click)="showPosition('toast-bottom-right')"
                >
                  Bottom Right
                </button>
                <button
                  mat-stroked-button
                  (click)="showPosition('toast-bottom-left')"
                >
                  Bottom Left
                </button>
                <button
                  mat-stroked-button
                  (click)="showPosition('toast-top-center')"
                >
                  Top Center
                </button>
                <button
                  mat-stroked-button
                  (click)="showPosition('toast-bottom-center')"
                >
                  Bottom Center
                </button>
              </ax-live-preview>

              <ax-code-tabs [tabs]="positionCode"></ax-code-tabs>
            </section>

            <section class="toast-doc__section">
              <h2>Provider Comparison</h2>
              <p>
                Choose between ngx-toastr (stacking, positions, progress bar)
                and MatSnackBar (action button, Material Design style).
              </p>

              <ax-live-preview
                variant="bordered"
                direction="row"
                gap="var(--ax-spacing-md)"
              >
                <button mat-stroked-button (click)="showToastr()">
                  <mat-icon>layers</mat-icon>
                  ngx-toastr
                </button>
                <button mat-stroked-button (click)="showSnackbar()">
                  <mat-icon>crop_landscape</mat-icon>
                  MatSnackBar
                </button>
              </ax-live-preview>

              <ax-code-tabs [tabs]="providerCode"></ax-code-tabs>
            </section>

            <section class="toast-doc__section">
              <h2>With Action Callback</h2>
              <p>
                Use MatSnackBar provider with an action button and callback.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="row"
                gap="var(--ax-spacing-md)"
              >
                <button mat-flat-button color="warn" (click)="showWithAction()">
                  <mat-icon>delete</mat-icon>
                  Show with Undo Action
                </button>
              </ax-live-preview>

              <ax-code-tabs [tabs]="actionCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- Libraries Tab -->
        <mat-tab label="Libraries">
          <div class="toast-doc__tab-content">
            <section class="toast-doc__section">
              <h2>External Libraries</h2>
              <p>
                The Toast Service is a unified wrapper around two powerful
                notification libraries. Choose the right provider for your use
                case.
              </p>

              <div class="library-cards">
                <div class="library-card">
                  <div class="library-header">
                    <div class="library-icon ngx-toastr">
                      <mat-icon>layers</mat-icon>
                    </div>
                    <div class="library-info">
                      <h3>ngx-toastr</h3>
                      <span class="library-version">v19.1.0</span>
                    </div>
                  </div>
                  <p class="library-description">
                    A popular Angular toast notifications library with rich
                    features including stacking, positioning, progress bars, and
                    animations.
                  </p>
                  <div class="library-features">
                    <span class="feature-tag">Stacking</span>
                    <span class="feature-tag">Positions</span>
                    <span class="feature-tag">Progress Bar</span>
                    <span class="feature-tag">Close Button</span>
                    <span class="feature-tag">Animations</span>
                  </div>
                  <div class="library-links">
                    <a
                      href="https://www.npmjs.com/package/ngx-toastr"
                      target="_blank"
                      rel="noopener"
                    >
                      <mat-icon>open_in_new</mat-icon>
                      npm
                    </a>
                    <a
                      href="https://github.com/scttcper/ngx-toastr"
                      target="_blank"
                      rel="noopener"
                    >
                      <mat-icon>code</mat-icon>
                      GitHub
                    </a>
                  </div>
                </div>

                <div class="library-card">
                  <div class="library-header">
                    <div class="library-icon mat-snackbar">
                      <mat-icon>crop_landscape</mat-icon>
                    </div>
                    <div class="library-info">
                      <h3>MatSnackBar</h3>
                      <span class="library-version">Angular Material</span>
                    </div>
                  </div>
                  <p class="library-description">
                    Angular Material's built-in snackbar component following
                    Material Design 3 guidelines. Simple and consistent with
                    other Material components.
                  </p>
                  <div class="library-features">
                    <span class="feature-tag">Material Design</span>
                    <span class="feature-tag">Action Button</span>
                    <span class="feature-tag">Callbacks</span>
                    <span class="feature-tag">Simple API</span>
                  </div>
                  <div class="library-links">
                    <a
                      href="https://material.angular.io/components/snack-bar"
                      target="_blank"
                      rel="noopener"
                    >
                      <mat-icon>open_in_new</mat-icon>
                      Documentation
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <section class="toast-doc__section">
              <h2>When to Use Each Provider</h2>
              <div class="comparison-table">
                <table>
                  <thead>
                    <tr>
                      <th>Use Case</th>
                      <th>Recommended Provider</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Multiple notifications at once</td>
                      <td><code>ngx-toastr</code> - Supports stacking</td>
                    </tr>
                    <tr>
                      <td>Custom positions (corners, center)</td>
                      <td><code>ngx-toastr</code> - 6 position options</td>
                    </tr>
                    <tr>
                      <td>Progress indicator</td>
                      <td><code>ngx-toastr</code> - Built-in progress bar</td>
                    </tr>
                    <tr>
                      <td>Undo/Action button</td>
                      <td><code>MatSnackBar</code> - Native action support</td>
                    </tr>
                    <tr>
                      <td>Material Design consistency</td>
                      <td><code>MatSnackBar</code> - Official MD3</td>
                    </tr>
                    <tr>
                      <td>Simple notifications</td>
                      <td><code>auto</code> - Let service decide</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="toast-doc__section">
              <h2>Installation</h2>
              <p>
                Both libraries are pre-installed in the AegisX monorepo. If you
                need to add ngx-toastr to a new project:
              </p>
              <ax-code-tabs [tabs]="installationCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="toast-doc__tab-content">
            <section class="toast-doc__section">
              <h2>Service Methods</h2>
              <div class="api-table">
                <table>
                  <thead>
                    <tr>
                      <th>Method</th>
                      <th>Parameters</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>success(message, options?)</code></td>
                      <td>string, ToastOptions</td>
                      <td>Show success toast</td>
                    </tr>
                    <tr>
                      <td><code>error(message, options?)</code></td>
                      <td>string, ToastOptions</td>
                      <td>Show error toast</td>
                    </tr>
                    <tr>
                      <td><code>warning(message, options?)</code></td>
                      <td>string, ToastOptions</td>
                      <td>Show warning toast</td>
                    </tr>
                    <tr>
                      <td><code>info(message, options?)</code></td>
                      <td>string, ToastOptions</td>
                      <td>Show info toast</td>
                    </tr>
                    <tr>
                      <td><code>clear()</code></td>
                      <td>-</td>
                      <td>Clear all toasts</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="toast-doc__section">
              <h2>ToastOptions</h2>
              <div class="api-table">
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
                      <td><code>duration</code></td>
                      <td>number</td>
                      <td>5000</td>
                      <td>Duration in milliseconds</td>
                    </tr>
                    <tr>
                      <td><code>provider</code></td>
                      <td>'toastr' | 'snackbar' | 'auto'</td>
                      <td>'auto'</td>
                      <td>Which provider to use</td>
                    </tr>
                    <tr>
                      <td><code>title</code></td>
                      <td>string</td>
                      <td>-</td>
                      <td>Toast title (toastr only)</td>
                    </tr>
                    <tr>
                      <td><code>action</code></td>
                      <td>string</td>
                      <td>-</td>
                      <td>Action button text</td>
                    </tr>
                    <tr>
                      <td><code>onAction</code></td>
                      <td>() => void</td>
                      <td>-</td>
                      <td>Action button callback</td>
                    </tr>
                    <tr>
                      <td><code>position</code></td>
                      <td>ToastPosition</td>
                      <td>'toast-top-right'</td>
                      <td>Position for toastr</td>
                    </tr>
                    <tr>
                      <td><code>closeButton</code></td>
                      <td>boolean</td>
                      <td>true</td>
                      <td>Show close button</td>
                    </tr>
                    <tr>
                      <td><code>progressBar</code></td>
                      <td>boolean</td>
                      <td>true</td>
                      <td>Show progress bar</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </mat-tab>

        <!-- Design Tokens Tab -->
        <mat-tab label="Design Tokens">
          <div class="toast-doc__tab-content">
            <ax-component-tokens [tokens]="designTokens"></ax-component-tokens>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .toast-doc {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }

      .toast-doc__tabs {
        margin-top: 2rem;
      }

      .toast-doc__tab-content {
        padding: 1.5rem 0;
      }

      .toast-doc__section {
        margin-bottom: 3rem;

        h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--ax-text-heading);
          margin-bottom: 0.75rem;
        }

        p {
          color: var(--ax-text-secondary);
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }
      }

      .api-table,
      .comparison-table {
        overflow-x: auto;

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;

          th,
          td {
            padding: 0.75rem 1rem;
            text-align: left;
            border-bottom: 1px solid var(--ax-border-default);
          }

          th {
            font-weight: 600;
            color: var(--ax-text-heading);
            background: var(--ax-background-subtle);
          }

          code {
            background: var(--ax-background-subtle);
            padding: 0.125rem 0.375rem;
            border-radius: var(--ax-radius-sm);
            font-size: 0.8125rem;
          }
        }
      }

      /* Library Cards */
      .library-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .library-card {
        background: var(--ax-background-default);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-lg);
        padding: 1.5rem;
        transition: all 0.2s ease;

        &:hover {
          border-color: var(--ax-brand-default);
          box-shadow: var(--ax-shadow-md);
        }
      }

      .library-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .library-icon {
        width: 48px;
        height: 48px;
        border-radius: var(--ax-radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        mat-icon {
          font-size: 24px;
          width: 24px;
          height: 24px;
          color: white;
        }

        &.ngx-toastr {
          background: linear-gradient(135deg, #f97316, #ea580c);
        }

        &.mat-snackbar {
          background: linear-gradient(135deg, #6366f1, #4f46e5);
        }
      }

      .library-info {
        h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0 0 0.25rem 0;
        }
      }

      .library-version {
        font-size: 0.75rem;
        color: var(--ax-text-tertiary);
        background: var(--ax-background-subtle);
        padding: 0.125rem 0.5rem;
        border-radius: var(--ax-radius-full);
      }

      .library-description {
        font-size: 0.875rem;
        color: var(--ax-text-secondary);
        line-height: 1.6;
        margin-bottom: 1rem;
      }

      .library-features {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      .feature-tag {
        font-size: 0.75rem;
        padding: 0.25rem 0.625rem;
        background: var(--ax-background-muted);
        color: var(--ax-text-secondary);
        border-radius: var(--ax-radius-full);
        font-weight: 500;
      }

      .library-links {
        display: flex;
        gap: 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--ax-border-muted);

        a {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.8125rem;
          color: var(--ax-brand-default);
          text-decoration: none;
          transition: color 0.2s ease;

          mat-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
          }

          &:hover {
            color: var(--ax-brand-emphasis);
            text-decoration: underline;
          }
        }
      }
    `,
  ],
})
export class ToastDocComponent {
  private readonly toast = inject(AxToastService);

  // Demo methods
  showSuccess(): void {
    this.toast.success('Operation completed successfully!');
  }

  showError(): void {
    this.toast.error('An error occurred. Please try again.');
  }

  showWarning(): void {
    this.toast.warning('Please review before proceeding.');
  }

  showInfo(): void {
    this.toast.info('This is an informational message.');
  }

  showWithTitle(): void {
    this.toast.success('Your changes have been saved.', {
      title: 'Saved Successfully',
    });
  }

  showStackingDemo(): void {
    this.toast.success('First notification', {
      provider: 'toastr',
      title: 'Success',
    });
    setTimeout(() => {
      this.toast.info('Second notification', {
        provider: 'toastr',
        title: 'Info',
      });
    }, 300);
    setTimeout(() => {
      this.toast.warning('Third notification', {
        provider: 'toastr',
        title: 'Warning',
      });
    }, 600);
  }

  clearAllToasts(): void {
    this.toast.clear();
  }

  showPosition(position: string): void {
    this.toast.info(
      `Toast at ${position.replace('toast-', '').replace('-', ' ')}`,
      {
        provider: 'toastr',
        position: position as
          | 'toast-top-right'
          | 'toast-top-left'
          | 'toast-bottom-right'
          | 'toast-bottom-left'
          | 'toast-top-center'
          | 'toast-bottom-center',
      },
    );
  }

  showToastr(): void {
    this.toast.info('This uses ngx-toastr with progress bar', {
      provider: 'toastr',
      title: 'ngx-toastr',
      progressBar: true,
      closeButton: true,
    });
  }

  showSnackbar(): void {
    this.toast.info('This uses MatSnackBar', {
      provider: 'snackbar',
      action: 'OK',
    });
  }

  showWithAction(): void {
    this.toast.warning('Item deleted', {
      provider: 'snackbar',
      action: 'Undo',
      duration: 8000,
      onAction: () => {
        this.toast.success('Action undone!');
      },
    });
  }

  // Code examples
  readonly basicUsageCode: CodeTab[] = [
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `import { AxToastService } from '@aegisx/ui';

export class MyComponent {
  private toast = inject(AxToastService);

  onSave() {
    this.toast.success('Saved successfully!');
  }

  onError() {
    this.toast.error('An error occurred');
  }

  onWarning() {
    this.toast.warning('Please check your input');
  }

  onInfo() {
    this.toast.info('Processing...');
  }
}`,
    },
  ];

  readonly withTitleCode: CodeTab[] = [
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `this.toast.success('Your changes have been saved.', {
  title: 'Saved Successfully'
});`,
    },
  ];

  readonly stackingCode: CodeTab[] = [
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `// ngx-toastr supports stacking multiple toasts
// Each new toast appears above the previous one

this.toast.success('First notification', {
  provider: 'toastr',
  title: 'Success'
});

this.toast.info('Second notification', {
  provider: 'toastr',
  title: 'Info'
});

this.toast.warning('Third notification', {
  provider: 'toastr',
  title: 'Warning'
});

// Clear all toasts
this.toast.clear();`,
    },
  ];

  readonly positionCode: CodeTab[] = [
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `// Available positions for ngx-toastr
type ToastPosition =
  | 'toast-top-right'     // Default
  | 'toast-top-left'
  | 'toast-top-center'
  | 'toast-bottom-right'
  | 'toast-bottom-left'
  | 'toast-bottom-center';

// Example usage
this.toast.info('Message at top left', {
  provider: 'toastr',
  position: 'toast-top-left'
});

this.toast.success('Message at bottom center', {
  provider: 'toastr',
  position: 'toast-bottom-center'
});`,
    },
  ];

  readonly providerCode: CodeTab[] = [
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `// Use ngx-toastr (supports stacking multiple toasts)
this.toast.info('Message 1', { provider: 'toastr' });
this.toast.info('Message 2', { provider: 'toastr' });

// Use MatSnackBar (single toast with action support)
this.toast.info('Message', {
  provider: 'snackbar',
  action: 'OK'
});`,
    },
  ];

  readonly actionCode: CodeTab[] = [
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `this.toast.warning('Item deleted', {
  provider: 'snackbar',
  action: 'Undo',
  duration: 8000,
  onAction: () => {
    // Handle undo action
    this.restoreItem();
    this.toast.success('Item restored!');
  }
});`,
    },
  ];

  readonly installationCode: CodeTab[] = [
    {
      label: 'Install',
      language: 'bash',
      code: `# Install ngx-toastr
pnpm add ngx-toastr

# Angular Material snackbar is included with @angular/material`,
    },
    {
      label: 'app.config.ts',
      language: 'typescript',
      code: `import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideToastr({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
      closeButton: true,
    }),
  ],
};`,
    },
    {
      label: 'styles.scss',
      language: 'scss',
      code: `// Import ngx-toastr styles
@import 'ngx-toastr/toastr';

// Or use the AegisX themed version
@import '@aegisx/ui/styles/vendors/toastr';`,
    },
  ];

  readonly designTokens: ComponentToken[] = [
    {
      category: 'Colors',
      cssVar: '--ax-success-faint',
      usage: 'Success toast background',
    },
    {
      category: 'Colors',
      cssVar: '--ax-success-default',
      usage: 'Success progress bar',
    },
    {
      category: 'Colors',
      cssVar: '--ax-error-faint',
      usage: 'Error toast background',
    },
    {
      category: 'Colors',
      cssVar: '--ax-error-default',
      usage: 'Error progress bar',
    },
    {
      category: 'Colors',
      cssVar: '--ax-warning-faint',
      usage: 'Warning toast background',
    },
    {
      category: 'Colors',
      cssVar: '--ax-warning-default',
      usage: 'Warning progress bar',
    },
    {
      category: 'Colors',
      cssVar: '--ax-info-faint',
      usage: 'Info toast background',
    },
    {
      category: 'Colors',
      cssVar: '--ax-info-default',
      usage: 'Info progress bar',
    },
    {
      category: 'Borders',
      cssVar: '--ax-radius-lg',
      usage: 'Toast border radius',
    },
    { category: 'Shadows', cssVar: '--ax-shadow-lg', usage: 'Toast elevation' },
  ];
}
