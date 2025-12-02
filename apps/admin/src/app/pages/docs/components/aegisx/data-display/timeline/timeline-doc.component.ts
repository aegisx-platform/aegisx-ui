import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import {
  AxTimelineComponent,
  TimelineItem,
  TimelineLayout,
  TimelineAlign,
  TimelineMarkerSize,
  TimelineConnectorStyle,
} from '@aegisx/ui';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
} from '../../../../../../components/docs';

@Component({
  selector: 'ax-timeline-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonToggleModule,
    FormsModule,
    AxTimelineComponent,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
  ],
  template: `
    <div class="timeline-doc">
      <ax-doc-header
        title="Timeline"
        icon="timeline"
        description="Display chronological events or activities in vertical, horizontal, or alternate layouts. Inspired by PrimeNG Timeline with full customization support."
        [breadcrumbs]="[
          {
            label: 'Data Display',
            link: '/docs/components/aegisx/data-display/card',
          },
          { label: 'Timeline' },
        ]"
        status="stable"
        version="2.0.0"
        importStatement="import { AxTimelineComponent, TimelineItem, TimelineLayout, TimelineAlign } from '@aegisx/ui';"
      ></ax-doc-header>

      <mat-tab-group class="doc-tabs" animationDuration="150ms">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="doc-tab-content">
            <section class="doc-section">
              <h2>Basic Usage</h2>
              <p>
                Timeline displays a list of events in chronological order with
                optional icons and timestamps.
              </p>

              <ax-live-preview variant="bordered">
                <ax-timeline [items]="basicItems"></ax-timeline>
              </ax-live-preview>

              <ax-code-tabs [tabs]="basicUsageCode"></ax-code-tabs>
            </section>

            <section class="doc-section">
              <h2>With Icons & Colors</h2>
              <p>
                Add icons and colors to each timeline item for visual context
                and status indication.
              </p>

              <ax-live-preview variant="bordered">
                <ax-timeline [items]="colorItems"></ax-timeline>
              </ax-live-preview>

              <ax-code-tabs [tabs]="iconCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- Layout Tab -->
        <mat-tab label="Layouts">
          <div class="doc-tab-content">
            <section class="doc-section">
              <h2>Layout Modes</h2>
              <p>
                Timeline supports vertical, horizontal, and alternate (zigzag)
                layouts.
              </p>

              <div class="control-bar">
                <span class="control-label">Layout:</span>
                <mat-button-toggle-group
                  [(ngModel)]="selectedLayout"
                  appearance="standard"
                >
                  <mat-button-toggle value="vertical"
                    >Vertical</mat-button-toggle
                  >
                  <mat-button-toggle value="horizontal"
                    >Horizontal</mat-button-toggle
                  >
                </mat-button-toggle-group>
              </div>

              <ax-live-preview variant="bordered">
                <ax-timeline
                  [items]="iconItems"
                  [layout]="selectedLayout"
                ></ax-timeline>
              </ax-live-preview>
            </section>

            <section class="doc-section">
              <h2>Alternate (Zigzag) Layout</h2>
              <p>
                Content alternates between left and right sides, similar to
                PrimeNG's alternate mode.
              </p>

              <ax-live-preview variant="bordered">
                <ax-timeline
                  [items]="alternateItems"
                  align="alternate"
                ></ax-timeline>
              </ax-live-preview>

              <ax-code-tabs [tabs]="alternateCode"></ax-code-tabs>
            </section>

            <section class="doc-section">
              <h2>Alignment Options</h2>
              <p>
                Control the alignment of content: left, right, or alternate.
              </p>

              <div class="control-bar">
                <span class="control-label">Align:</span>
                <mat-button-toggle-group
                  [(ngModel)]="selectedAlign"
                  appearance="standard"
                >
                  <mat-button-toggle value="left">Left</mat-button-toggle>
                  <mat-button-toggle value="right">Right</mat-button-toggle>
                  <mat-button-toggle value="alternate"
                    >Alternate</mat-button-toggle
                  >
                </mat-button-toggle-group>
              </div>

              <ax-live-preview variant="bordered">
                <ax-timeline
                  [items]="orderItems"
                  [align]="selectedAlign"
                ></ax-timeline>
              </ax-live-preview>
            </section>
          </div>
        </mat-tab>

        <!-- Customization Tab -->
        <mat-tab label="Customization">
          <div class="doc-tab-content">
            <section class="doc-section">
              <h2>Marker Sizes</h2>
              <p>Choose from small, medium (default), or large marker sizes.</p>

              <div class="control-bar">
                <span class="control-label">Size:</span>
                <mat-button-toggle-group
                  [(ngModel)]="selectedSize"
                  appearance="standard"
                >
                  <mat-button-toggle value="sm">Small</mat-button-toggle>
                  <mat-button-toggle value="md">Medium</mat-button-toggle>
                  <mat-button-toggle value="lg">Large</mat-button-toggle>
                </mat-button-toggle-group>
              </div>

              <ax-live-preview variant="bordered">
                <ax-timeline
                  [items]="colorItems"
                  [markerSize]="selectedSize"
                ></ax-timeline>
              </ax-live-preview>
            </section>

            <section class="doc-section">
              <h2>Connector Styles</h2>
              <p>Customize the connector line between markers.</p>

              <div class="control-bar">
                <span class="control-label">Connector:</span>
                <mat-button-toggle-group
                  [(ngModel)]="selectedConnector"
                  appearance="standard"
                >
                  <mat-button-toggle value="solid">Solid</mat-button-toggle>
                  <mat-button-toggle value="dashed">Dashed</mat-button-toggle>
                  <mat-button-toggle value="dotted">Dotted</mat-button-toggle>
                </mat-button-toggle-group>
              </div>

              <ax-live-preview variant="bordered">
                <ax-timeline
                  [items]="iconItems"
                  [connectorStyle]="selectedConnector"
                ></ax-timeline>
              </ax-live-preview>
            </section>

            <section class="doc-section">
              <h2>Dense Mode</h2>
              <p>Reduce spacing for compact displays.</p>

              <ax-live-preview variant="bordered">
                <ax-timeline
                  [items]="activityItems"
                  [dense]="true"
                ></ax-timeline>
              </ax-live-preview>

              <ax-code-tabs [tabs]="denseCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="doc-tab-content">
            <section class="doc-section">
              <h2>Order Tracking</h2>
              <ax-live-preview variant="bordered">
                <ax-timeline [items]="orderItems"></ax-timeline>
              </ax-live-preview>
            </section>

            <section class="doc-section">
              <h2>Activity Log (Dense)</h2>
              <ax-live-preview variant="bordered">
                <ax-timeline
                  [items]="activityItems"
                  [dense]="true"
                  markerSize="sm"
                ></ax-timeline>
              </ax-live-preview>
            </section>

            <section class="doc-section">
              <h2>Project Milestones (Alternate)</h2>
              <ax-live-preview variant="bordered">
                <ax-timeline
                  [items]="milestoneItems"
                  align="alternate"
                  markerSize="lg"
                ></ax-timeline>
              </ax-live-preview>
            </section>

            <section class="doc-section">
              <h2>Horizontal Timeline</h2>
              <ax-live-preview variant="bordered">
                <ax-timeline
                  [items]="horizontalItems"
                  layout="horizontal"
                ></ax-timeline>
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
                      <td><code>items</code></td>
                      <td><code>TimelineItem[]</code></td>
                      <td><code>[]</code></td>
                      <td>Array of timeline items to display</td>
                    </tr>
                    <tr>
                      <td><code>layout</code></td>
                      <td><code>'vertical' | 'horizontal'</code></td>
                      <td><code>'vertical'</code></td>
                      <td>Layout direction of the timeline</td>
                    </tr>
                    <tr>
                      <td><code>align</code></td>
                      <td><code>'left' | 'right' | 'alternate'</code></td>
                      <td><code>'left'</code></td>
                      <td>Alignment of content relative to the marker</td>
                    </tr>
                    <tr>
                      <td><code>markerSize</code></td>
                      <td><code>'sm' | 'md' | 'lg'</code></td>
                      <td><code>'md'</code></td>
                      <td>Size of the timeline markers</td>
                    </tr>
                    <tr>
                      <td><code>connectorStyle</code></td>
                      <td><code>'solid' | 'dashed' | 'dotted'</code></td>
                      <td><code>'solid'</code></td>
                      <td>Style of the connector line between markers</td>
                    </tr>
                    <tr>
                      <td><code>dense</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Enable compact mode with reduced spacing</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="doc-section">
              <h2>TimelineItem Interface</h2>
              <div class="api-table">
                <table>
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Required</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>title</code></td>
                      <td><code>string</code></td>
                      <td>Yes</td>
                      <td>Main title/heading of the event</td>
                    </tr>
                    <tr>
                      <td><code>description</code></td>
                      <td><code>string</code></td>
                      <td>No</td>
                      <td>Additional description text</td>
                    </tr>
                    <tr>
                      <td><code>timestamp</code></td>
                      <td><code>string</code></td>
                      <td>No</td>
                      <td>Time/date string to display</td>
                    </tr>
                    <tr>
                      <td><code>icon</code></td>
                      <td><code>string</code></td>
                      <td>No</td>
                      <td>Material icon name</td>
                    </tr>
                    <tr>
                      <td><code>color</code></td>
                      <td><code>string</code></td>
                      <td>No</td>
                      <td>CSS color for the marker</td>
                    </tr>
                    <tr>
                      <td><code>opposite</code></td>
                      <td><code>string</code></td>
                      <td>No</td>
                      <td>Content for the opposite side (alternate layout)</td>
                    </tr>
                    <tr>
                      <td><code>data</code></td>
                      <td><code>unknown</code></td>
                      <td>No</td>
                      <td>Custom data for template access</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="doc-section">
              <h2>Content Projection</h2>
              <p>
                Use ng-template with <code>#marker</code>,
                <code>#content</code>, or <code>#opposite</code> for custom
                rendering.
              </p>
              <ax-code-tabs [tabs]="templateCode"></ax-code-tabs>
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
                    <li>
                      Order items chronologically (newest first or oldest first
                      consistently)
                    </li>
                    <li>Use icons to differentiate event types</li>
                    <li>Include timestamps for time-sensitive events</li>
                    <li>
                      Use alternate layout for comparison or dual-stream data
                    </li>
                    <li>Use dense mode for activity logs with many items</li>
                    <li>
                      Use horizontal layout for process steps or workflows
                    </li>
                  </ul>
                </div>
                <div class="guideline dont">
                  <h4><mat-icon>cancel</mat-icon> Don't</h4>
                  <ul>
                    <li>Mix different time ordering in one timeline</li>
                    <li>Use too many different colors</li>
                    <li>Include very long descriptions</li>
                    <li>Show more than 10-15 items without pagination</li>
                    <li>
                      Use alternate layout on narrow screens (responsive handled
                      automatically)
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section class="doc-section">
              <h2>Accessibility</h2>
              <ul class="accessibility-list">
                <li>Uses semantic HTML structure</li>
                <li>Color is not the only indicator of status</li>
                <li>Icons provide additional visual context</li>
                <li>Supports keyboard navigation</li>
              </ul>
            </section>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .timeline-doc {
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

      .control-bar {
        display: flex;
        align-items: center;
        gap: var(--ax-spacing-md);
        margin-bottom: var(--ax-spacing-md);
        padding: var(--ax-spacing-sm) var(--ax-spacing-md);
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-md);
      }

      .control-label {
        font-size: var(--ax-text-sm);
        font-weight: 500;
        color: var(--ax-text-secondary);
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

      .accessibility-list {
        padding-left: var(--ax-spacing-lg);
        li {
          font-size: var(--ax-text-sm);
          color: var(--ax-text-primary);
          margin-bottom: var(--ax-spacing-xs);
        }
      }
    `,
  ],
})
export class TimelineDocComponent {
  // Interactive controls
  selectedLayout: TimelineLayout = 'vertical';
  selectedAlign: TimelineAlign = 'left';
  selectedSize: TimelineMarkerSize = 'md';
  selectedConnector: TimelineConnectorStyle = 'solid';

  basicItems: TimelineItem[] = [
    {
      title: 'Order placed',
      description: 'Your order has been received',
      timestamp: '10:30 AM',
    },
    {
      title: 'Payment confirmed',
      description: 'Payment processed successfully',
      timestamp: '10:32 AM',
    },
    {
      title: 'Processing',
      description: 'Your order is being prepared',
      timestamp: '11:00 AM',
    },
  ];

  iconItems: TimelineItem[] = [
    {
      title: 'Order placed',
      description: 'Order #12345 created',
      timestamp: '10:30 AM',
      icon: 'shopping_cart',
    },
    {
      title: 'Payment received',
      description: 'Paid via Credit Card',
      timestamp: '10:32 AM',
      icon: 'payment',
    },
    {
      title: 'Shipped',
      description: 'Tracking: TH123456789',
      timestamp: '2:00 PM',
      icon: 'local_shipping',
    },
    {
      title: 'Delivered',
      description: 'Package received',
      timestamp: '4:30 PM',
      icon: 'check_circle',
    },
  ];

  colorItems: TimelineItem[] = [
    {
      title: 'Completed',
      description: 'Task finished',
      timestamp: '9:00 AM',
      icon: 'check_circle',
      color: 'var(--ax-success-default)',
    },
    {
      title: 'In Progress',
      description: 'Currently working',
      timestamp: '10:00 AM',
      icon: 'pending',
      color: 'var(--ax-warning-default)',
    },
    {
      title: 'Failed',
      description: 'Error occurred',
      timestamp: '11:00 AM',
      icon: 'error',
      color: 'var(--ax-error-default)',
    },
    {
      title: 'Pending',
      description: 'Waiting to start',
      timestamp: '12:00 PM',
      icon: 'schedule',
      color: 'var(--ax-info-default)',
    },
  ];

  alternateItems: TimelineItem[] = [
    {
      title: 'Order placed',
      description: 'Order confirmed and payment received',
      timestamp: 'Nov 28, 10:30 AM',
      icon: 'receipt',
      color: 'var(--ax-brand-default)',
    },
    {
      title: 'Processing',
      description: 'Order is being prepared',
      timestamp: 'Nov 28, 2:00 PM',
      icon: 'inventory',
      color: 'var(--ax-info-default)',
    },
    {
      title: 'Shipped',
      description: 'Package picked up by carrier',
      timestamp: 'Nov 29, 9:00 AM',
      icon: 'local_shipping',
      color: 'var(--ax-info-default)',
    },
    {
      title: 'Delivered',
      description: 'Package delivered to recipient',
      timestamp: 'Nov 30, 4:30 PM',
      icon: 'check_circle',
      color: 'var(--ax-success-default)',
    },
  ];

  orderItems: TimelineItem[] = [
    {
      title: 'Delivered',
      description: 'Package delivered to recipient',
      timestamp: 'Nov 30, 4:30 PM',
      icon: 'check_circle',
      color: 'var(--ax-success-default)',
    },
    {
      title: 'Out for delivery',
      description: 'Package is on the delivery vehicle',
      timestamp: 'Nov 30, 8:00 AM',
      icon: 'local_shipping',
      color: 'var(--ax-info-default)',
    },
    {
      title: 'In transit',
      description: 'Package arrived at Bangkok sorting facility',
      timestamp: 'Nov 29, 6:00 PM',
      icon: 'inventory',
      color: 'var(--ax-info-default)',
    },
    {
      title: 'Shipped',
      description: 'Package picked up by carrier',
      timestamp: 'Nov 28, 2:00 PM',
      icon: 'local_shipping',
      color: 'var(--ax-info-default)',
    },
    {
      title: 'Order placed',
      description: 'Order confirmed and payment received',
      timestamp: 'Nov 28, 10:30 AM',
      icon: 'receipt',
      color: 'var(--ax-neutral-default)',
    },
  ];

  activityItems: TimelineItem[] = [
    {
      title: 'Somchai updated the document',
      description: 'Modified project-plan.pdf',
      timestamp: '5 minutes ago',
      icon: 'edit',
    },
    {
      title: 'Somsri added a comment',
      description: '"Looks good, approved!"',
      timestamp: '1 hour ago',
      icon: 'comment',
    },
    {
      title: 'New member joined',
      description: 'Sompong joined the team',
      timestamp: '3 hours ago',
      icon: 'person_add',
    },
    {
      title: 'Task completed',
      description: 'Design review finished',
      timestamp: 'Yesterday',
      icon: 'task_alt',
    },
  ];

  milestoneItems: TimelineItem[] = [
    {
      title: 'Launch',
      description: 'Product released to production',
      timestamp: 'Q1 2025',
      icon: 'rocket_launch',
      color: 'var(--ax-success-default)',
    },
    {
      title: 'Beta Testing',
      description: 'User acceptance testing',
      timestamp: 'Dec 2024',
      icon: 'bug_report',
      color: 'var(--ax-warning-default)',
    },
    {
      title: 'Development',
      description: 'Feature implementation',
      timestamp: 'Nov 2024',
      icon: 'code',
      color: 'var(--ax-info-default)',
    },
    {
      title: 'Design',
      description: 'UI/UX design completed',
      timestamp: 'Oct 2024',
      icon: 'design_services',
      color: 'var(--ax-info-default)',
    },
    {
      title: 'Planning',
      description: 'Requirements gathering',
      timestamp: 'Sep 2024',
      icon: 'assignment',
      color: 'var(--ax-neutral-default)',
    },
  ];

  horizontalItems: TimelineItem[] = [
    {
      title: 'Step 1',
      description: 'Create account',
      icon: 'person_add',
      color: 'var(--ax-success-default)',
    },
    {
      title: 'Step 2',
      description: 'Verify email',
      icon: 'mark_email_read',
      color: 'var(--ax-success-default)',
    },
    {
      title: 'Step 3',
      description: 'Complete profile',
      icon: 'badge',
      color: 'var(--ax-warning-default)',
    },
    {
      title: 'Step 4',
      description: 'Start using',
      icon: 'rocket_launch',
      color: 'var(--ax-neutral-default)',
    },
  ];

  basicUsageCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-timeline [items]="items"></ax-timeline>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxTimelineComponent, TimelineItem } from '@aegisx/ui';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [AxTimelineComponent],
  template: \`<ax-timeline [items]="items"></ax-timeline>\`,
})
export class OrderTrackingComponent {
  items: TimelineItem[] = [
    { title: 'Order placed', description: 'Your order has been received', timestamp: '10:30 AM' },
    { title: 'Payment confirmed', description: 'Payment processed', timestamp: '10:32 AM' },
    { title: 'Processing', description: 'Order being prepared', timestamp: '11:00 AM' },
  ];
}`,
    },
  ];

  iconCode = [
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `items: TimelineItem[] = [
  { title: 'Completed', timestamp: '9:00 AM', icon: 'check_circle', color: 'var(--ax-success-default)' },
  { title: 'In Progress', timestamp: '10:00 AM', icon: 'pending', color: 'var(--ax-warning-default)' },
  { title: 'Failed', timestamp: '11:00 AM', icon: 'error', color: 'var(--ax-error-default)' },
  { title: 'Pending', timestamp: '12:00 PM', icon: 'schedule', color: 'var(--ax-info-default)' },
];`,
    },
  ];

  alternateCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-timeline
  [items]="items"
  align="alternate"
></ax-timeline>`,
    },
  ];

  denseCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-timeline
  [items]="activityItems"
  [dense]="true"
  markerSize="sm"
></ax-timeline>`,
    },
  ];

  templateCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-timeline [items]="items">
  <!-- Custom marker template -->
  <ng-template #marker let-item let-index="index">
    <div class="custom-marker">
      <img [src]="item.data?.avatar" [alt]="item.title" />
    </div>
  </ng-template>

  <!-- Custom content template -->
  <ng-template #content let-item let-index="index">
    <div class="custom-content">
      <h4>{{ item.title }}</h4>
      <p>{{ item.description }}</p>
      <button mat-button (click)="handleClick(item)">View Details</button>
    </div>
  </ng-template>
</ax-timeline>`,
    },
  ];
}
