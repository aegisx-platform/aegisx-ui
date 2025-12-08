import { Component, signal, inject, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  AxCalendarComponent,
  AxCalendarEvent,
  AxCalendarDateRange,
  AxEventClickEvent,
  AxDateSelectEvent,
  AxEventChangeEvent,
  AxCalendarEventDialogComponent,
  AxCalendarEventDialogData,
  AxCalendarEventDialogResult,
} from '@aegisx/ui';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../../../components/docs';
import { ComponentToken, CodeTab } from '../../../../../../types/docs.types';

@Component({
  selector: 'ax-calendar-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    HttpClientModule,
    AxCalendarComponent,
    AxCalendarEventDialogComponent,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="calendar-doc">
      <ax-doc-header
        title="Calendar"
        icon="calendar_month"
        description="Full-featured calendar component with month, week, day, and list views. Supports drag & drop, event resizing, and API integration."
        [breadcrumbs]="[
          {
            label: 'Data Display',
            link: '/docs/components/aegisx/data-display/overview',
          },
          { label: 'Calendar' },
        ]"
        status="beta"
        version="1.0.0"
        importStatement="import { AxCalendarComponent, AxCalendarService } from '&#64;aegisx/ui';"
      ></ax-doc-header>

      <mat-tab-group class="calendar-doc__tabs" animationDuration="150ms">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="calendar-doc__tab-content">
            <section class="calendar-doc__section">
              <h2>Basic Calendar</h2>
              <p>
                A fully themed calendar component built on FullCalendar.
                Integrates seamlessly with AegisX design system and supports
                light/dark mode.
              </p>

              <ax-live-preview variant="bordered" direction="column">
                <ax-calendar
                  #basicCalendar
                  [events]="demoEvents()"
                  [initialView]="'dayGridMonth'"
                  [editable]="true"
                  [selectable]="true"
                  (eventClick)="onEventClick($event)"
                  (dateSelect)="onDateSelect($event)"
                  (eventChange)="onEventChange($event)"
                  [height]="600"
                ></ax-calendar>
              </ax-live-preview>

              <ax-code-tabs [tabs]="basicUsageCode"></ax-code-tabs>
            </section>

            <section class="calendar-doc__section">
              <h2>Event Colors</h2>
              <p>
                Events can be styled with different colors using the
                <code>color</code> property. Available colors: primary, success,
                warning, danger, info, secondary.
              </p>

              <ax-live-preview variant="bordered" direction="row" gap="0.5rem">
                <button
                  mat-stroked-button
                  (click)="addEventWithColor('primary')"
                >
                  <mat-icon>add</mat-icon>
                  Primary
                </button>
                <button
                  mat-stroked-button
                  (click)="addEventWithColor('success')"
                >
                  <mat-icon>add</mat-icon>
                  Success
                </button>
                <button
                  mat-stroked-button
                  (click)="addEventWithColor('warning')"
                >
                  <mat-icon>add</mat-icon>
                  Warning
                </button>
                <button
                  mat-stroked-button
                  (click)="addEventWithColor('danger')"
                >
                  <mat-icon>add</mat-icon>
                  Danger
                </button>
                <button mat-stroked-button (click)="addEventWithColor('info')">
                  <mat-icon>add</mat-icon>
                  Info
                </button>
                <button mat-stroked-button (click)="resetEvents()">
                  <mat-icon>refresh</mat-icon>
                  Reset
                </button>
              </ax-live-preview>

              <ax-code-tabs [tabs]="colorCode"></ax-code-tabs>
            </section>

            <section class="calendar-doc__section">
              <h2>View Controls</h2>
              <p>
                Navigate between different views programmatically using the
                calendar's public API.
              </p>

              <ax-live-preview variant="bordered" direction="row" gap="0.5rem">
                <button
                  mat-stroked-button
                  (click)="basicCalendar?.changeView('dayGridMonth')"
                >
                  <mat-icon>calendar_view_month</mat-icon>
                  Month
                </button>
                <button
                  mat-stroked-button
                  (click)="basicCalendar?.changeView('timeGridWeek')"
                >
                  <mat-icon>view_week</mat-icon>
                  Week
                </button>
                <button
                  mat-stroked-button
                  (click)="basicCalendar?.changeView('timeGridDay')"
                >
                  <mat-icon>view_day</mat-icon>
                  Day
                </button>
                <button
                  mat-stroked-button
                  (click)="basicCalendar?.changeView('listWeek')"
                >
                  <mat-icon>view_list</mat-icon>
                  List
                </button>
                <button
                  mat-flat-button
                  color="primary"
                  (click)="basicCalendar?.today()"
                >
                  <mat-icon>today</mat-icon>
                  Today
                </button>
              </ax-live-preview>

              <ax-code-tabs [tabs]="viewControlCode"></ax-code-tabs>
            </section>

            <section class="calendar-doc__section">
              <h2>Event Dialog</h2>
              <p>
                Use the built-in event dialog component for creating and editing
                events. Click on an event or select a date range to try it.
              </p>

              <ax-code-tabs [tabs]="dialogCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="calendar-doc__tab-content">
            <section class="calendar-doc__section">
              <h2>Inputs</h2>
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
                      <td><code>events</code></td>
                      <td>AxCalendarEvent[]</td>
                      <td>[]</td>
                      <td>Array of events to display</td>
                    </tr>
                    <tr>
                      <td><code>initialView</code></td>
                      <td>AxCalendarView</td>
                      <td>'dayGridMonth'</td>
                      <td>Initial view type</td>
                    </tr>
                    <tr>
                      <td><code>initialDate</code></td>
                      <td>Date | string</td>
                      <td>today</td>
                      <td>Initial date to display</td>
                    </tr>
                    <tr>
                      <td><code>editable</code></td>
                      <td>boolean</td>
                      <td>false</td>
                      <td>Enable drag & drop and resize</td>
                    </tr>
                    <tr>
                      <td><code>selectable</code></td>
                      <td>boolean</td>
                      <td>false</td>
                      <td>Enable date selection</td>
                    </tr>
                    <tr>
                      <td><code>loading</code></td>
                      <td>boolean</td>
                      <td>false</td>
                      <td>Show loading overlay</td>
                    </tr>
                    <tr>
                      <td><code>height</code></td>
                      <td>'auto' | number</td>
                      <td>'auto'</td>
                      <td>Calendar height</td>
                    </tr>
                    <tr>
                      <td><code>firstDay</code></td>
                      <td>number</td>
                      <td>0</td>
                      <td>First day of week (0=Sun)</td>
                    </tr>
                    <tr>
                      <td><code>weekNumbers</code></td>
                      <td>boolean</td>
                      <td>false</td>
                      <td>Show week numbers</td>
                    </tr>
                    <tr>
                      <td><code>nowIndicator</code></td>
                      <td>boolean</td>
                      <td>true</td>
                      <td>Show current time indicator</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="calendar-doc__section">
              <h2>Outputs</h2>
              <div class="api-table">
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
                      <td><code>eventClick</code></td>
                      <td>AxEventClickEvent</td>
                      <td>Emitted when clicking an event</td>
                    </tr>
                    <tr>
                      <td><code>dateSelect</code></td>
                      <td>AxDateSelectEvent</td>
                      <td>Emitted when selecting dates</td>
                    </tr>
                    <tr>
                      <td><code>eventChange</code></td>
                      <td>AxEventChangeEvent</td>
                      <td>Emitted on drag/resize</td>
                    </tr>
                    <tr>
                      <td><code>datesChange</code></td>
                      <td>AxCalendarDateRange</td>
                      <td>Emitted when visible range changes</td>
                    </tr>
                    <tr>
                      <td><code>dateClick</code></td>
                      <td>{{ '{' }} date: Date; allDay: boolean {{ '}' }}</td>
                      <td>Emitted when clicking a date</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="calendar-doc__section">
              <h2>Public Methods</h2>
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
                      <td><code>gotoDate(date)</code></td>
                      <td>Date | string</td>
                      <td>Navigate to specific date</td>
                    </tr>
                    <tr>
                      <td><code>today()</code></td>
                      <td>-</td>
                      <td>Navigate to today</td>
                    </tr>
                    <tr>
                      <td><code>prev()</code></td>
                      <td>-</td>
                      <td>Navigate to previous period</td>
                    </tr>
                    <tr>
                      <td><code>next()</code></td>
                      <td>-</td>
                      <td>Navigate to next period</td>
                    </tr>
                    <tr>
                      <td><code>changeView(view)</code></td>
                      <td>AxCalendarView</td>
                      <td>Change current view</td>
                    </tr>
                    <tr>
                      <td><code>addEvent(event)</code></td>
                      <td>AxCalendarEvent</td>
                      <td>Add event programmatically</td>
                    </tr>
                    <tr>
                      <td><code>removeEvent(id)</code></td>
                      <td>string</td>
                      <td>Remove event by ID</td>
                    </tr>
                    <tr>
                      <td><code>updateEvent(event)</code></td>
                      <td>AxCalendarEvent</td>
                      <td>Update existing event</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="calendar-doc__section">
              <h2>AxCalendarEvent Interface</h2>
              <ax-code-tabs [tabs]="eventInterfaceCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- Service Tab -->
        <mat-tab label="API Service">
          <div class="calendar-doc__tab-content">
            <section class="calendar-doc__section">
              <h2>AxCalendarService</h2>
              <p>
                Use the calendar service for seamless API integration. It
                provides reactive state management with signals and handles CRUD
                operations.
              </p>

              <ax-code-tabs [tabs]="serviceCode"></ax-code-tabs>
            </section>

            <section class="calendar-doc__section">
              <h2>Service Methods</h2>
              <div class="api-table">
                <table>
                  <thead>
                    <tr>
                      <th>Method</th>
                      <th>Returns</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>fetchEvents(range)</code></td>
                      <td>Observable&lt;AxCalendarEvent[]&gt;</td>
                      <td>Fetch events for date range</td>
                    </tr>
                    <tr>
                      <td><code>createEvent(payload)</code></td>
                      <td>Observable&lt;AxCalendarEvent&gt;</td>
                      <td>Create new event</td>
                    </tr>
                    <tr>
                      <td><code>updateEvent(id, payload)</code></td>
                      <td>Observable&lt;AxCalendarEvent&gt;</td>
                      <td>Update existing event</td>
                    </tr>
                    <tr>
                      <td><code>deleteEvent(id)</code></td>
                      <td>Observable&lt;boolean&gt;</td>
                      <td>Delete event</td>
                    </tr>
                    <tr>
                      <td><code>moveEvent(id, start, end?, allDay?)</code></td>
                      <td>Observable&lt;AxCalendarEvent&gt;</td>
                      <td>Move event (drag & drop)</td>
                    </tr>
                    <tr>
                      <td><code>refresh()</code></td>
                      <td>Observable&lt;AxCalendarEvent[]&gt;</td>
                      <td>Refresh current range</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </mat-tab>

        <!-- Design Tokens Tab -->
        <mat-tab label="Design Tokens">
          <div class="calendar-doc__tab-content">
            <ax-component-tokens [tokens]="designTokens"></ax-component-tokens>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .calendar-doc {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }

      .calendar-doc__tabs {
        margin-top: 2rem;
      }

      .calendar-doc__tab-content {
        padding: 1.5rem 0;
      }

      .calendar-doc__section {
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

        code {
          background: var(--ax-background-subtle);
          padding: 0.125rem 0.375rem;
          border-radius: var(--ax-radius-sm);
          font-size: 0.875rem;
        }
      }

      .api-table {
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
    `,
  ],
})
export class CalendarDocComponent implements OnInit {
  private dialog = inject(MatDialog);

  @ViewChild('basicCalendar') basicCalendar?: AxCalendarComponent;

  // Demo events
  demoEvents = signal<AxCalendarEvent[]>([]);
  private eventCounter = 0;

  ngOnInit(): void {
    this.initDemoEvents();
  }

  private initDemoEvents(): void {
    const today = new Date();
    const events: AxCalendarEvent[] = [
      {
        id: '1',
        title: 'Team Standup',
        start: this.setTime(today, 9, 0),
        end: this.setTime(today, 9, 30),
        color: 'primary',
      },
      {
        id: '2',
        title: 'Project Review',
        start: this.setTime(this.addDays(today, 1), 14, 0),
        end: this.setTime(this.addDays(today, 1), 15, 30),
        color: 'success',
      },
      {
        id: '3',
        title: 'Sprint Planning',
        start: this.setTime(this.addDays(today, 2), 10, 0),
        end: this.setTime(this.addDays(today, 2), 12, 0),
        color: 'info',
      },
      {
        id: '4',
        title: 'Deadline: Feature Release',
        start: this.addDays(today, 5),
        allDay: true,
        color: 'danger',
      },
      {
        id: '5',
        title: 'Team Building',
        start: this.addDays(today, 7),
        end: this.addDays(today, 8),
        allDay: true,
        color: 'warning',
      },
    ];
    this.demoEvents.set(events);
    this.eventCounter = events.length;
  }

  private setTime(date: Date, hours: number, minutes: number): Date {
    const result = new Date(date);
    result.setHours(hours, minutes, 0, 0);
    return result;
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  onEventClick(event: AxEventClickEvent): void {
    const dialogRef = this.dialog.open(AxCalendarEventDialogComponent, {
      data: {
        mode: 'edit',
        event: event.event,
      } as AxCalendarEventDialogData,
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result: AxCalendarEventDialogResult) => {
      if (result?.action === 'save' && result.event) {
        // Update event
        this.demoEvents.update((events) =>
          events.map((e) =>
            e.id === result.event?.id
              ? ({ ...e, ...result.event } as AxCalendarEvent)
              : e,
          ),
        );
      } else if (result?.action === 'delete') {
        // Delete event
        this.demoEvents.update((events) =>
          events.filter((e) => e.id !== event.event.id),
        );
      }
    });
  }

  onDateSelect(event: AxDateSelectEvent): void {
    const dialogRef = this.dialog.open(AxCalendarEventDialogComponent, {
      data: {
        mode: 'create',
        start: event.start,
        end: event.end,
        allDay: event.allDay,
      } as AxCalendarEventDialogData,
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result: AxCalendarEventDialogResult) => {
      if (result?.action === 'save' && result.event) {
        this.eventCounter++;
        const newEvent: AxCalendarEvent = {
          ...result.event,
          id: String(this.eventCounter),
        } as AxCalendarEvent;
        this.demoEvents.update((events) => [...events, newEvent]);
      }
    });
  }

  onEventChange(event: AxEventChangeEvent): void {
    // Update event after drag/resize
    this.demoEvents.update((events) =>
      events.map((e) => (e.id === event.event.id ? event.event : e)),
    );
  }

  addEventWithColor(color: AxCalendarEvent['color']): void {
    this.eventCounter++;
    const today = new Date();
    const randomHour = 8 + Math.floor(Math.random() * 10);
    const randomDay = Math.floor(Math.random() * 14) - 7;

    const newEvent: AxCalendarEvent = {
      id: String(this.eventCounter),
      title: `${color?.charAt(0).toUpperCase()}${color?.slice(1)} Event`,
      start: this.setTime(this.addDays(today, randomDay), randomHour, 0),
      end: this.setTime(this.addDays(today, randomDay), randomHour + 1, 30),
      color,
    };

    this.demoEvents.update((events) => [...events, newEvent]);
  }

  resetEvents(): void {
    this.initDemoEvents();
  }

  // Code examples
  readonly basicUsageCode: CodeTab[] = [
    {
      label: 'Template',
      language: 'html',
      code: `<ax-calendar
  [events]="events()"
  [initialView]="'dayGridMonth'"
  [editable]="true"
  [selectable]="true"
  (eventClick)="onEventClick($event)"
  (dateSelect)="onDateSelect($event)"
  (eventChange)="onEventChange($event)"
  [height]="600">
</ax-calendar>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `import {
  AxCalendarComponent,
  AxCalendarEvent,
  AxEventClickEvent,
  AxDateSelectEvent,
  AxEventChangeEvent
} from '@aegisx/ui';

@Component({
  // ...
  imports: [AxCalendarComponent]
})
export class MyCalendarPage {
  events = signal<AxCalendarEvent[]>([
    {
      id: '1',
      title: 'Team Meeting',
      start: new Date(),
      end: new Date(Date.now() + 3600000),
      color: 'primary',
    }
  ]);

  onEventClick(event: AxEventClickEvent) {
    console.log('Clicked:', event.event);
  }

  onDateSelect(event: AxDateSelectEvent) {
    console.log('Selected:', event.start, event.end);
  }

  onEventChange(event: AxEventChangeEvent) {
    // Handle drag/resize
    console.log('Changed:', event.event);
    // Call event.revert() to undo the change
  }
}`,
    },
    {
      label: 'Styles',
      language: 'scss',
      code: `// Import the FullCalendar theme in your styles.scss
@use '@aegisx/ui/styles/vendors/fullcalendar';`,
    },
  ];

  readonly colorCode: CodeTab[] = [
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `// Available colors
type EventColor = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'secondary';

const event: AxCalendarEvent = {
  id: '1',
  title: 'Deadline',
  start: new Date(),
  color: 'danger', // Red color for urgency
};`,
    },
  ];

  readonly viewControlCode: CodeTab[] = [
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `@ViewChild('calendar') calendar!: AxCalendarComponent;

// Navigate between views
changeToMonth() {
  this.calendar.changeView('dayGridMonth');
}

changeToWeek() {
  this.calendar.changeView('timeGridWeek');
}

changeToDay() {
  this.calendar.changeView('timeGridDay');
}

changeToList() {
  this.calendar.changeView('listWeek');
}

// Navigation
goToToday() {
  this.calendar.today();
}

goToDate(date: Date) {
  this.calendar.gotoDate(date);
}`,
    },
  ];

  readonly dialogCode: CodeTab[] = [
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `import { MatDialog } from '@angular/material/dialog';
import {
  AxCalendarEventDialogComponent,
  AxCalendarEventDialogData,
  AxCalendarEventDialogResult
} from '@aegisx/ui';

export class MyCalendarPage {
  private dialog = inject(MatDialog);

  // Handle event click - open edit dialog
  onEventClick(event: AxEventClickEvent) {
    const dialogRef = this.dialog.open(AxCalendarEventDialogComponent, {
      data: {
        mode: 'edit',
        event: event.event,
      } as AxCalendarEventDialogData,
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result: AxCalendarEventDialogResult) => {
      if (result?.action === 'save') {
        this.calendarService.updateEvent(result.event.id, result.event);
      } else if (result?.action === 'delete') {
        this.calendarService.deleteEvent(event.event.id);
      }
    });
  }

  // Handle date selection - open create dialog
  onDateSelect(event: AxDateSelectEvent) {
    const dialogRef = this.dialog.open(AxCalendarEventDialogComponent, {
      data: {
        mode: 'create',
        start: event.start,
        end: event.end,
        allDay: event.allDay,
      } as AxCalendarEventDialogData,
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result: AxCalendarEventDialogResult) => {
      if (result?.action === 'save') {
        this.calendarService.createEvent(result.event);
      }
    });
  }
}`,
    },
  ];

  readonly eventInterfaceCode: CodeTab[] = [
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `interface AxCalendarEvent {
  id: string;
  title: string;
  start: Date | string;
  end?: Date | string;
  allDay?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'secondary';
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps?: Record<string, unknown>;
  editable?: boolean;
  resourceId?: string;
}`,
    },
  ];

  readonly serviceCode: CodeTab[] = [
    {
      label: 'Component',
      language: 'typescript',
      code: `import { Component, inject } from '@angular/core';
import {
  AxCalendarComponent,
  AxCalendarService,
  provideAxCalendarService
} from '@aegisx/ui';

@Component({
  selector: 'my-calendar-page',
  template: \`
    <ax-calendar
      [events]="calendarService.events()"
      [loading]="calendarService.loading()"
      (datesChange)="onDatesChange($event)"
      (eventClick)="onEventClick($event)"
      (eventChange)="onEventChange($event)">
    </ax-calendar>
  \`,
  providers: [
    provideAxCalendarService('/api/events')
  ]
})
export class MyCalendarPage {
  calendarService = inject(AxCalendarService);

  onDatesChange(range: AxCalendarDateRange) {
    // Automatically fetch events when date range changes
    this.calendarService.fetchEvents(range).subscribe();
  }

  onEventChange(event: AxEventChangeEvent) {
    // Save event changes from drag & drop
    this.calendarService.moveEvent(
      event.event.id,
      event.event.start,
      event.event.end,
      event.event.allDay
    ).subscribe({
      error: () => event.revert() // Revert on error
    });
  }
}`,
    },
    {
      label: 'API Response',
      language: 'json',
      code: `// Expected API response format
// GET /api/events?start=2024-01-01&end=2024-01-31
{
  "data": [
    {
      "id": "uuid-1",
      "title": "Team Meeting",
      "start": "2024-01-15T09:00:00Z",
      "end": "2024-01-15T10:00:00Z",
      "all_day": false,
      "color": "primary",
      "description": "Weekly team sync",
      "location": "Conference Room A"
    }
  ],
  "meta": {
    "total": 1
  }
}`,
    },
  ];

  readonly designTokens: ComponentToken[] = [
    {
      category: 'Colors',
      cssVar: '--fc-border-color',
      usage: 'Calendar grid borders',
    },
    {
      category: 'Colors',
      cssVar: '--fc-page-bg-color',
      usage: 'Calendar background',
    },
    {
      category: 'Colors',
      cssVar: '--fc-today-bg-color',
      usage: 'Today highlight background',
    },
    {
      category: 'Colors',
      cssVar: '--fc-event-bg-color',
      usage: 'Default event background',
    },
    {
      category: 'Colors',
      cssVar: '--fc-button-bg-color',
      usage: 'Button background color',
    },
    {
      category: 'Typography',
      cssVar: '--ax-font-family',
      usage: 'Calendar font family',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-md',
      usage: 'Cell padding',
    },
    {
      category: 'Borders',
      cssVar: '--ax-radius-md',
      usage: 'Button and event border radius',
    },
  ];
}
