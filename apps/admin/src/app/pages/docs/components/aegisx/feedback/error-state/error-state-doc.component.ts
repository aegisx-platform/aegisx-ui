import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AxErrorStateComponent, ErrorStateAction } from '@aegisx/ui';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
} from '../../../../../../components/docs';

@Component({
  selector: 'ax-error-state-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    AxErrorStateComponent,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
  ],
  template: `
    <div class="error-state-doc">
      <ax-doc-header
        title="Error State"
        icon="error_outline"
        description="Display error messages, warnings, and informational states with optional actions and technical details. Perfect for API errors, form validation, and system notifications."
        [breadcrumbs]="[
          { label: 'Feedback', link: '/docs/components/aegisx/feedback/alert' },
          { label: 'Error State' },
        ]"
        status="stable"
        version="1.0.0"
        importStatement="import { AxErrorStateComponent, ErrorStateAction } from '@aegisx/ui';"
      ></ax-doc-header>

      <mat-tab-group class="doc-tabs" animationDuration="150ms">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="doc-tab-content">
            <section class="doc-section">
              <h2>Basic Usage</h2>
              <p>
                Error State displays a user-friendly error message with an icon,
                title, and description.
              </p>

              <ax-live-preview variant="bordered">
                <ax-error-state
                  title="Something went wrong"
                  message="We couldn't load your data. Please try again later."
                >
                </ax-error-state>
              </ax-live-preview>

              <ax-code-tabs [tabs]="basicUsageCode"></ax-code-tabs>
            </section>

            <section class="doc-section">
              <h2>With Actions</h2>
              <p>Add action buttons to help users recover from errors.</p>

              <ax-live-preview variant="bordered">
                <ax-error-state
                  title="Connection failed"
                  message="Unable to connect to the server. Please check your internet connection."
                  [actions]="retryActions"
                >
                </ax-error-state>
              </ax-live-preview>

              <ax-code-tabs [tabs]="actionsCode"></ax-code-tabs>
            </section>

            <section class="doc-section">
              <h2>Types</h2>
              <p>
                Use different types for error, warning, and informational
                states.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-lg)"
              >
                <ax-error-state
                  type="error"
                  title="Error"
                  message="An error occurred while processing your request."
                  [compact]="true"
                >
                </ax-error-state>
                <ax-error-state
                  type="warning"
                  title="Warning"
                  message="Your session will expire in 5 minutes."
                  [compact]="true"
                >
                </ax-error-state>
                <ax-error-state
                  type="info"
                  title="Information"
                  message="Scheduled maintenance will occur tonight at 11 PM."
                  [compact]="true"
                >
                </ax-error-state>
              </ax-live-preview>
            </section>

            <section class="doc-section">
              <h2>With Status Code</h2>
              <p>
                Automatically generate titles from HTTP status codes for API
                errors.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-lg)"
              >
                <ax-error-state
                  [statusCode]="404"
                  message="The page you're looking for doesn't exist."
                  [compact]="true"
                >
                </ax-error-state>
                <ax-error-state
                  [statusCode]="500"
                  message="Our servers are having trouble. Please try again."
                  [compact]="true"
                >
                </ax-error-state>
              </ax-live-preview>
            </section>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="doc-tab-content">
            <section class="doc-section">
              <h2>API Error</h2>
              <ax-live-preview variant="bordered">
                <ax-error-state
                  [statusCode]="500"
                  message="Unable to fetch data from the server. Our team has been notified."
                  [actions]="apiErrorActions"
                >
                </ax-error-state>
              </ax-live-preview>
            </section>

            <section class="doc-section">
              <h2>With Technical Details</h2>
              <ax-live-preview variant="bordered">
                <ax-error-state
                  title="Database connection failed"
                  message="Unable to establish connection to the database server."
                  [errorDetails]="errorDetails"
                  [showDetails]="true"
                  [actions]="technicalActions"
                >
                </ax-error-state>
              </ax-live-preview>
            </section>

            <section class="doc-section">
              <h2>Permission Denied</h2>
              <ax-live-preview variant="bordered">
                <ax-error-state
                  [statusCode]="403"
                  message="You don't have permission to access this resource. Contact your administrator if you believe this is an error."
                  [actions]="permissionActions"
                >
                </ax-error-state>
              </ax-live-preview>
            </section>

            <section class="doc-section">
              <h2>Network Error</h2>
              <ax-live-preview variant="bordered">
                <ax-error-state
                  icon="wifi_off"
                  title="No internet connection"
                  message="Please check your network connection and try again."
                  [actions]="networkActions"
                >
                </ax-error-state>
              </ax-live-preview>
            </section>

            <section class="doc-section">
              <h2>Session Expired (Warning)</h2>
              <ax-live-preview variant="bordered">
                <ax-error-state
                  type="warning"
                  icon="schedule"
                  title="Session expired"
                  message="Your session has expired due to inactivity. Please log in again to continue."
                  [actions]="sessionActions"
                >
                </ax-error-state>
              </ax-live-preview>
            </section>
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="doc-tab-content">
            <section class="doc-section">
              <h2>Properties</h2>
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
                      <td><code>icon</code></td>
                      <td><code>string</code></td>
                      <td><code>undefined</code></td>
                      <td>
                        Custom Material icon name (auto-set based on type if not
                        provided)
                      </td>
                    </tr>
                    <tr>
                      <td><code>title</code></td>
                      <td><code>string</code></td>
                      <td><code>undefined</code></td>
                      <td>
                        Main title/heading (auto-generated from statusCode if
                        provided)
                      </td>
                    </tr>
                    <tr>
                      <td><code>message</code></td>
                      <td><code>string</code></td>
                      <td><code>undefined</code></td>
                      <td>Description message explaining the error</td>
                    </tr>
                    <tr>
                      <td><code>type</code></td>
                      <td><code>'error' | 'warning' | 'info'</code></td>
                      <td><code>'error'</code></td>
                      <td>Visual style of the error state</td>
                    </tr>
                    <tr>
                      <td><code>statusCode</code></td>
                      <td><code>number</code></td>
                      <td><code>undefined</code></td>
                      <td>HTTP status code for automatic title generation</td>
                    </tr>
                    <tr>
                      <td><code>errorDetails</code></td>
                      <td><code>string</code></td>
                      <td><code>undefined</code></td>
                      <td>
                        Technical error details (shown in collapsible section)
                      </td>
                    </tr>
                    <tr>
                      <td><code>showDetails</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Show technical details section</td>
                    </tr>
                    <tr>
                      <td><code>compact</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Use compact/smaller layout</td>
                    </tr>
                    <tr>
                      <td><code>actions</code></td>
                      <td><code>ErrorStateAction[]</code></td>
                      <td><code>[]</code></td>
                      <td>Array of action buttons</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="doc-section">
              <h2>ErrorStateAction Interface</h2>
              <div class="api-table">
                <table>
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>label</code></td>
                      <td><code>string</code></td>
                      <td>Button text</td>
                    </tr>
                    <tr>
                      <td><code>icon</code></td>
                      <td><code>string</code></td>
                      <td>Optional button icon</td>
                    </tr>
                    <tr>
                      <td><code>primary</code></td>
                      <td><code>boolean</code></td>
                      <td>Use primary button style</td>
                    </tr>
                    <tr>
                      <td><code>callback</code></td>
                      <td><code>() => void</code></td>
                      <td>Click handler function</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="doc-section">
              <h2>Supported Status Codes</h2>
              <div class="api-table">
                <table>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Generated Title</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>400</code></td>
                      <td>Error 400: Bad Request</td>
                    </tr>
                    <tr>
                      <td><code>401</code></td>
                      <td>Error 401: Unauthorized</td>
                    </tr>
                    <tr>
                      <td><code>403</code></td>
                      <td>Error 403: Access Forbidden</td>
                    </tr>
                    <tr>
                      <td><code>404</code></td>
                      <td>Error 404: Not Found</td>
                    </tr>
                    <tr>
                      <td><code>408</code></td>
                      <td>Error 408: Request Timeout</td>
                    </tr>
                    <tr>
                      <td><code>429</code></td>
                      <td>Error 429: Too Many Requests</td>
                    </tr>
                    <tr>
                      <td><code>500</code></td>
                      <td>Error 500: Server Error</td>
                    </tr>
                    <tr>
                      <td><code>502</code></td>
                      <td>Error 502: Bad Gateway</td>
                    </tr>
                    <tr>
                      <td><code>503</code></td>
                      <td>Error 503: Service Unavailable</td>
                    </tr>
                    <tr>
                      <td><code>504</code></td>
                      <td>Error 504: Gateway Timeout</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="doc-section">
              <h2>Content Projection</h2>
              <p>
                You can project custom content using <code>ng-content</code> for
                the body and <code>[error-state-actions]</code> for custom
                action buttons.
              </p>
            </section>
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="doc-tab-content">
            <section class="doc-section">
              <h2>Best Practices</h2>
              <div class="guidelines-grid">
                <div class="guideline do">
                  <h4><mat-icon>check_circle</mat-icon> Do</h4>
                  <ul>
                    <li>Use clear, human-readable error messages</li>
                    <li>Provide actionable next steps</li>
                    <li>Match error type to severity (error/warning/info)</li>
                    <li>Show technical details only when useful</li>
                    <li>Use status codes for API errors</li>
                  </ul>
                </div>
                <div class="guideline dont">
                  <h4><mat-icon>cancel</mat-icon> Don't</h4>
                  <ul>
                    <li>Show raw technical errors to users</li>
                    <li>Use vague messages like "Error occurred"</li>
                    <li>Leave users without recovery options</li>
                    <li>Use error state for loading or success states</li>
                    <li>Blame the user for system errors</li>
                  </ul>
                </div>
              </div>
            </section>

            <section class="doc-section">
              <h2>When to Use Each Type</h2>
              <div class="type-guide">
                <div class="type-item">
                  <h4><mat-icon>error_outline</mat-icon> Error</h4>
                  <p>
                    Use for critical failures that prevent the user from
                    completing their task. Examples: API failures, form
                    submission errors, data loading failures.
                  </p>
                </div>
                <div class="type-item">
                  <h4><mat-icon>warning</mat-icon> Warning</h4>
                  <p>
                    Use for non-critical issues that the user should be aware
                    of. Examples: Session expiring soon, unsaved changes,
                    deprecated features.
                  </p>
                </div>
                <div class="type-item">
                  <h4><mat-icon>info</mat-icon> Info</h4>
                  <p>
                    Use for informational messages that don't indicate a
                    problem. Examples: Scheduled maintenance, feature updates,
                    helpful tips.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .error-state-doc {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--ax-spacing-xl);
      }

      .doc-tabs {
        margin-top: var(--ax-spacing-xl);
      }
      .doc-tab-content {
        padding: var(--ax-spacing-xl) 0;
      }

      .doc-section {
        margin-bottom: var(--ax-spacing-3xl);

        h2 {
          font-size: var(--ax-text-xl);
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0 0 var(--ax-spacing-sm) 0;
        }

        > p {
          font-size: var(--ax-text-sm);
          color: var(--ax-text-secondary);
          margin: 0 0 var(--ax-spacing-lg) 0;
          max-width: 700px;
        }

        code {
          font-family: var(--ax-font-mono);
          font-size: var(--ax-text-xs);
          background: var(--ax-background-subtle);
          padding: 2px 6px;
          border-radius: var(--ax-radius-sm);
        }
      }

      .api-table {
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
        }

        th {
          background: var(--ax-background-subtle);
          font-size: var(--ax-text-xs);
          font-weight: 600;
          color: var(--ax-text-secondary);
          text-transform: uppercase;
        }

        td {
          font-size: var(--ax-text-sm);
          color: var(--ax-text-primary);
        }
        tr:last-child td {
          border-bottom: none;
        }
      }

      .guidelines-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--ax-spacing-lg);
      }

      .guideline {
        padding: var(--ax-spacing-lg);
        border-radius: var(--ax-radius-lg);

        h4 {
          display: flex;
          align-items: center;
          gap: var(--ax-spacing-xs);
          font-size: var(--ax-text-base);
          font-weight: 600;
          margin: 0 0 var(--ax-spacing-sm) 0;
          mat-icon {
            font-size: 20px;
            width: 20px;
            height: 20px;
          }
        }

        ul {
          margin: 0;
          padding-left: var(--ax-spacing-lg);
          li {
            font-size: var(--ax-text-sm);
            margin-bottom: var(--ax-spacing-xs);
          }
        }
      }

      .guideline.do {
        background: var(--ax-success-faint);
        h4 {
          color: var(--ax-success-emphasis);
        }
        li {
          color: var(--ax-success-emphasis);
        }
      }

      .guideline.dont {
        background: var(--ax-error-faint);
        h4 {
          color: var(--ax-error-emphasis);
        }
        li {
          color: var(--ax-error-emphasis);
        }
      }

      .type-guide {
        display: grid;
        gap: var(--ax-spacing-md);
      }

      .type-item {
        padding: var(--ax-spacing-md);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-lg);

        h4 {
          display: flex;
          align-items: center;
          gap: var(--ax-spacing-xs);
          font-size: var(--ax-text-base);
          font-weight: 600;
          margin: 0 0 var(--ax-spacing-xs) 0;
          color: var(--ax-text-heading);
          mat-icon {
            font-size: 20px;
            width: 20px;
            height: 20px;
          }
        }

        p {
          margin: 0;
          font-size: var(--ax-text-sm);
          color: var(--ax-text-secondary);
        }
      }
    `,
  ],
})
export class ErrorStateDocComponent {
  retryActions: ErrorStateAction[] = [
    {
      label: 'Try Again',
      icon: 'refresh',
      primary: true,
      callback: () => console.log('Retry clicked'),
    },
    { label: 'Go Back', callback: () => console.log('Go back clicked') },
  ];

  apiErrorActions: ErrorStateAction[] = [
    {
      label: 'Retry',
      icon: 'refresh',
      primary: true,
      callback: () => console.log('Retry'),
    },
    {
      label: 'Report Issue',
      icon: 'bug_report',
      callback: () => console.log('Report'),
    },
  ];

  technicalActions: ErrorStateAction[] = [
    {
      label: 'Try Again',
      icon: 'refresh',
      primary: true,
      callback: () => console.log('Retry'),
    },
    {
      label: 'Contact Support',
      icon: 'support_agent',
      callback: () => console.log('Support'),
    },
  ];

  permissionActions: ErrorStateAction[] = [
    {
      label: 'Request Access',
      icon: 'send',
      primary: true,
      callback: () => console.log('Request'),
    },
    { label: 'Go Home', icon: 'home', callback: () => console.log('Home') },
  ];

  networkActions: ErrorStateAction[] = [
    {
      label: 'Retry Connection',
      icon: 'refresh',
      primary: true,
      callback: () => console.log('Retry'),
    },
    { label: 'Work Offline', callback: () => console.log('Offline') },
  ];

  sessionActions: ErrorStateAction[] = [
    {
      label: 'Log In Again',
      icon: 'login',
      primary: true,
      callback: () => console.log('Login'),
    },
  ];

  errorDetails = `Error: ECONNREFUSED
  at TCPConnectWrap.afterConnect [as oncomplete]
  Code: ECONNREFUSED
  Host: db.example.com:5432
  Timestamp: 2024-11-30T10:30:00.000Z`;

  basicUsageCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-error-state
  title="Something went wrong"
  message="We couldn't load your data. Please try again later.">
</ax-error-state>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxErrorStateComponent } from '@aegisx/ui';

@Component({
  selector: 'app-data-view',
  standalone: true,
  imports: [AxErrorStateComponent],
  template: \`
    <ax-error-state
      title="Something went wrong"
      message="We couldn't load your data.">
    </ax-error-state>
  \`,
})
export class DataViewComponent {}`,
    },
  ];

  actionsCode = [
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { AxErrorStateComponent, ErrorStateAction } from '@aegisx/ui';

@Component({
  // ...
})
export class ConnectionErrorComponent {
  actions: ErrorStateAction[] = [
    {
      label: 'Try Again',
      icon: 'refresh',
      primary: true,
      callback: () => this.retryConnection()
    },
    {
      label: 'Go Back',
      callback: () => this.goBack()
    }
  ];

  retryConnection() {
    // Retry logic
  }

  goBack() {
    // Navigation logic
  }
}`,
    },
  ];
}
