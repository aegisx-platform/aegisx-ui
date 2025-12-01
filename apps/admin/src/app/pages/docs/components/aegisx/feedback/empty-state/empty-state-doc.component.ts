import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AxEmptyStateComponent, EmptyStateAction } from '@aegisx/ui';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
} from '../../../../../../components/docs';

@Component({
  selector: 'ax-empty-state-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    AxEmptyStateComponent,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
  ],
  template: `
    <div class="empty-state-doc">
      <ax-doc-header
        title="Empty State"
        icon="inbox"
        description="Display placeholder content when there is no data to show. Provides context and optional actions to guide users."
        [breadcrumbs]="[
          { label: 'Feedback', link: '/docs/components/aegisx/feedback/alert' },
          { label: 'Empty State' },
        ]"
        status="stable"
        version="1.0.0"
        importStatement="import { AxEmptyStateComponent } from '@aegisx/ui';"
      ></ax-doc-header>

      <mat-tab-group class="doc-tabs" animationDuration="150ms">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="doc-tab-content">
            <section class="doc-section">
              <h2>Basic Usage</h2>
              <p>
                Empty State shows a friendly message when there's no data to
                display. Include an icon, title, and message to explain the
                situation.
              </p>

              <ax-live-preview variant="bordered">
                <ax-empty-state
                  icon="inbox"
                  title="No messages"
                  message="You don't have any messages yet. Messages from your team will appear here."
                >
                </ax-empty-state>
              </ax-live-preview>

              <ax-code-tabs [tabs]="basicUsageCode"></ax-code-tabs>
            </section>

            <section class="doc-section">
              <h2>With Actions</h2>
              <p>Add action buttons to guide users on what to do next.</p>

              <ax-live-preview variant="bordered">
                <ax-empty-state
                  icon="folder_open"
                  title="No files uploaded"
                  message="Get started by uploading your first file."
                  [actions]="uploadActions"
                >
                </ax-empty-state>
              </ax-live-preview>

              <ax-code-tabs [tabs]="actionsCode"></ax-code-tabs>
            </section>

            <section class="doc-section">
              <h2>Compact Mode</h2>
              <p>
                Use compact mode for smaller containers or inline empty states.
              </p>

              <ax-live-preview variant="bordered">
                <ax-empty-state
                  icon="search_off"
                  title="No results found"
                  message="Try adjusting your search criteria."
                  [compact]="true"
                >
                </ax-empty-state>
              </ax-live-preview>
            </section>

            <section class="doc-section">
              <h2>Different Icons</h2>
              <p>Choose icons that match the context of what's empty.</p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-lg)"
              >
                <ax-empty-state
                  icon="shopping_cart"
                  title="Your cart is empty"
                  message="Add items to get started"
                  [compact]="true"
                ></ax-empty-state>
                <ax-empty-state
                  icon="notifications_off"
                  title="No notifications"
                  message="You're all caught up!"
                  [compact]="true"
                ></ax-empty-state>
                <ax-empty-state
                  icon="people_outline"
                  title="No team members"
                  message="Invite your colleagues to collaborate"
                  [compact]="true"
                ></ax-empty-state>
              </ax-live-preview>
            </section>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="doc-tab-content">
            <section class="doc-section">
              <h2>Search Results</h2>
              <ax-live-preview variant="bordered">
                <ax-empty-state
                  icon="search_off"
                  title="No results found"
                  message="We couldn't find anything matching your search. Try different keywords or filters."
                  [actions]="searchActions"
                >
                </ax-empty-state>
              </ax-live-preview>
            </section>

            <section class="doc-section">
              <h2>Empty Table</h2>
              <ax-live-preview variant="bordered">
                <ax-empty-state
                  icon="table_rows"
                  title="No data available"
                  message="There are no records to display. Create your first entry to get started."
                  [actions]="tableActions"
                >
                </ax-empty-state>
              </ax-live-preview>
            </section>

            <section class="doc-section">
              <h2>Empty Dashboard</h2>
              <ax-live-preview variant="bordered">
                <ax-empty-state
                  icon="dashboard"
                  title="Welcome to your dashboard"
                  message="Start by adding widgets to customize your view. You can drag and drop to arrange them."
                  [actions]="dashboardActions"
                >
                </ax-empty-state>
              </ax-live-preview>
            </section>

            <section class="doc-section">
              <h2>No Permissions</h2>
              <ax-live-preview variant="bordered">
                <ax-empty-state
                  icon="lock"
                  title="Access restricted"
                  message="You don't have permission to view this content. Contact your administrator for access."
                  [actions]="permissionActions"
                >
                </ax-empty-state>
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
                      <td>Material icon name</td>
                    </tr>
                    <tr>
                      <td><code>title</code></td>
                      <td><code>string</code></td>
                      <td><code>undefined</code></td>
                      <td>Main title/heading</td>
                    </tr>
                    <tr>
                      <td><code>message</code></td>
                      <td><code>string</code></td>
                      <td><code>undefined</code></td>
                      <td>Description message</td>
                    </tr>
                    <tr>
                      <td><code>compact</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Use compact/smaller layout</td>
                    </tr>
                    <tr>
                      <td><code>actions</code></td>
                      <td><code>EmptyStateAction[]</code></td>
                      <td><code>[]</code></td>
                      <td>Array of action buttons</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="doc-section">
              <h2>EmptyStateAction Interface</h2>
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
              <h2>Content Projection</h2>
              <p>
                You can project custom content using <code>ng-content</code> for
                the body and <code>[empty-state-actions]</code> for custom
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
                    <li>Use clear, friendly language</li>
                    <li>Provide actionable next steps</li>
                    <li>Match icon to the context</li>
                    <li>Keep messages concise</li>
                  </ul>
                </div>
                <div class="guideline dont">
                  <h4><mat-icon>cancel</mat-icon> Don't</h4>
                  <ul>
                    <li>Use technical error messages</li>
                    <li>Leave users without guidance</li>
                    <li>Use generic placeholder text</li>
                    <li>Show empty state for loading states</li>
                  </ul>
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
      .empty-state-doc {
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
    `,
  ],
})
export class EmptyStateDocComponent {
  uploadActions: EmptyStateAction[] = [
    {
      label: 'Upload File',
      icon: 'upload',
      primary: true,
      callback: () => console.log('Upload clicked'),
    },
    { label: 'Learn More', callback: () => console.log('Learn more clicked') },
  ];

  searchActions: EmptyStateAction[] = [
    {
      label: 'Clear Filters',
      icon: 'filter_alt_off',
      callback: () => console.log('Clear filters'),
    },
    {
      label: 'Browse All',
      primary: true,
      callback: () => console.log('Browse all'),
    },
  ];

  tableActions: EmptyStateAction[] = [
    {
      label: 'Create New',
      icon: 'add',
      primary: true,
      callback: () => console.log('Create'),
    },
    {
      label: 'Import Data',
      icon: 'upload',
      callback: () => console.log('Import'),
    },
  ];

  dashboardActions: EmptyStateAction[] = [
    {
      label: 'Add Widget',
      icon: 'add_circle',
      primary: true,
      callback: () => console.log('Add widget'),
    },
    { label: 'Use Template', callback: () => console.log('Template') },
  ];

  permissionActions: EmptyStateAction[] = [
    {
      label: 'Request Access',
      icon: 'send',
      primary: true,
      callback: () => console.log('Request'),
    },
    { label: 'Go Back', callback: () => console.log('Back') },
  ];

  basicUsageCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-empty-state
  icon="inbox"
  title="No messages"
  message="You don't have any messages yet. Messages from your team will appear here.">
</ax-empty-state>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxEmptyStateComponent } from '@aegisx/ui';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [AxEmptyStateComponent],
  template: \`
    <ax-empty-state
      icon="inbox"
      title="No messages"
      message="Messages will appear here.">
    </ax-empty-state>
  \`,
})
export class MessagesComponent {}`,
    },
  ];

  actionsCode = [
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { AxEmptyStateComponent, EmptyStateAction } from '@aegisx/ui';

@Component({
  // ...
})
export class FilesComponent {
  actions: EmptyStateAction[] = [
    {
      label: 'Upload File',
      icon: 'upload',
      primary: true,
      callback: () => this.openUploadDialog()
    },
    {
      label: 'Learn More',
      callback: () => this.showHelp()
    }
  ];

  openUploadDialog() {
    // Open upload dialog
  }

  showHelp() {
    // Show help
  }
}`,
    },
  ];
}
