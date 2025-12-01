import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { AxTimeSlotsComponent, TimeSlot, TimeSlotConfig } from '@aegisx/ui';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../../../components/docs';
import { ComponentToken } from '../../../../../../types/docs.types';

@Component({
  selector: 'ax-time-slots-doc',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatIconModule,
    AxTimeSlotsComponent,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="time-slots-doc">
      <ax-doc-header
        title="Time Slots"
        icon="schedule"
        description="Time slot selection component for scheduling and appointment booking. Supports single/multiple selection, grid/list layouts, and 12/24 hour formats."
        [breadcrumbs]="[
          { label: 'Forms', link: '/docs/components/aegisx/forms/time-slots' },
          { label: 'Time Slots' },
        ]"
        status="stable"
        version="1.0.0"
        importStatement="import { AxTimeSlotsComponent } from '@aegisx/ui';"
      ></ax-doc-header>

      <mat-tab-group class="time-slots-doc__tabs" animationDuration="150ms">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="time-slots-doc__tab-content">
            <section class="time-slots-doc__section">
              <h2>Basic Usage</h2>
              <p>
                Time slots with automatic generation from config. Perfect for
                appointment booking interfaces.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                align="start"
                gap="var(--ax-spacing-lg)"
              >
                <ax-time-slots
                  label="Select Time"
                  [config]="basicConfig"
                  [(ngModel)]="basicTime"
                ></ax-time-slots>
                <span class="time-slots-doc__value">
                  Selected: {{ basicTime || 'None' }}
                </span>
              </ax-live-preview>

              <ax-code-tabs [tabs]="basicUsageCode"></ax-code-tabs>
            </section>

            <section class="time-slots-doc__section">
              <h2>Custom Time Slots</h2>
              <p>Provide custom slots with labels and availability status.</p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                align="start"
                gap="var(--ax-spacing-lg)"
              >
                <ax-time-slots
                  label="Available Appointments"
                  [slots]="customSlots"
                  [(ngModel)]="customTime"
                ></ax-time-slots>
              </ax-live-preview>
            </section>

            <section class="time-slots-doc__section">
              <h2>Sizes</h2>
              <p>Three sizes available for different layouts.</p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                align="start"
                gap="var(--ax-spacing-xl)"
              >
                <ax-time-slots
                  label="Small"
                  size="sm"
                  [config]="sizeConfig"
                ></ax-time-slots>

                <ax-time-slots
                  label="Medium (default)"
                  size="md"
                  [config]="sizeConfig"
                ></ax-time-slots>

                <ax-time-slots
                  label="Large"
                  size="lg"
                  [config]="sizeConfig"
                ></ax-time-slots>
              </ax-live-preview>
            </section>

            <section class="time-slots-doc__section">
              <h2>Time Format</h2>
              <p>Support for 12-hour and 24-hour time formats.</p>

              <ax-live-preview
                variant="bordered"
                direction="row"
                align="start"
                gap="var(--ax-spacing-xl)"
              >
                <div class="time-slots-doc__format-example">
                  <ax-time-slots
                    label="12-Hour Format"
                    timeFormat="12h"
                    [config]="formatConfig"
                  ></ax-time-slots>
                </div>

                <div class="time-slots-doc__format-example">
                  <ax-time-slots
                    label="24-Hour Format"
                    timeFormat="24h"
                    [config]="formatConfig"
                  ></ax-time-slots>
                </div>
              </ax-live-preview>
            </section>

            <section class="time-slots-doc__section">
              <h2>Thai Locale</h2>
              <p>Full Thai language support.</p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                align="start"
                gap="var(--ax-spacing-lg)"
              >
                <ax-time-slots
                  label="เลือกเวลานัดหมาย"
                  locale="th"
                  timeFormat="12h"
                  [slots]="thaiSlots"
                  [(ngModel)]="thaiTime"
                ></ax-time-slots>
              </ax-live-preview>
            </section>

            <section class="time-slots-doc__section">
              <h2>Multiple Selection</h2>
              <p>Allow users to select multiple time slots.</p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                align="start"
                gap="var(--ax-spacing-lg)"
              >
                <ax-time-slots
                  label="Select Available Times"
                  mode="multiple"
                  [config]="basicConfig"
                  [(ngModel)]="multipleTimes"
                ></ax-time-slots>
                <span class="time-slots-doc__value">
                  Selected:
                  {{
                    multipleTimes?.length ? multipleTimes.join(', ') : 'None'
                  }}
                </span>
              </ax-live-preview>
            </section>

            <section class="time-slots-doc__section">
              <h2>List Layout</h2>
              <p>Vertical list layout for narrow containers.</p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                align="start"
                gap="var(--ax-spacing-lg)"
              >
                <div style="max-width: 200px;">
                  <ax-time-slots
                    label="Select Time"
                    layout="list"
                    [config]="sizeConfig"
                    [(ngModel)]="listTime"
                  ></ax-time-slots>
                </div>
              </ax-live-preview>
            </section>

            <section class="time-slots-doc__section">
              <h2>Grid Columns</h2>
              <p>Configure the number of columns in grid layout.</p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                align="start"
                gap="var(--ax-spacing-xl)"
              >
                <ax-time-slots
                  label="3 Columns"
                  [columns]="3"
                  [config]="basicConfig"
                ></ax-time-slots>

                <ax-time-slots
                  label="6 Columns"
                  [columns]="6"
                  [config]="basicConfig"
                ></ax-time-slots>
              </ax-live-preview>
            </section>

            <section class="time-slots-doc__section">
              <h2>States</h2>
              <p>Different visual states for form validation.</p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                align="start"
                gap="var(--ax-spacing-xl)"
              >
                <ax-time-slots
                  label="With Helper Text"
                  helperText="Select your preferred appointment time"
                  [config]="sizeConfig"
                ></ax-time-slots>

                <ax-time-slots
                  label="With Error"
                  errorMessage="Please select a time slot"
                  [config]="sizeConfig"
                ></ax-time-slots>

                <ax-time-slots
                  label="Disabled"
                  [disabled]="true"
                  [config]="sizeConfig"
                ></ax-time-slots>
              </ax-live-preview>
            </section>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="time-slots-doc__tab-content">
            <section class="time-slots-doc__section">
              <h2>Doctor Appointment</h2>
              <ax-live-preview variant="bordered">
                <div class="time-slots-doc__example">
                  <h4>Morning Slots</h4>
                  <ax-time-slots
                    [slots]="morningSlots"
                    size="sm"
                    [columns]="4"
                    [(ngModel)]="appointmentTime"
                  ></ax-time-slots>

                  <h4>Afternoon Slots</h4>
                  <ax-time-slots
                    [slots]="afternoonSlots"
                    size="sm"
                    [columns]="4"
                    [(ngModel)]="appointmentTime"
                  ></ax-time-slots>

                  @if (appointmentTime) {
                    <div class="time-slots-doc__selected">
                      Selected appointment: {{ appointmentTime }}
                    </div>
                  }
                </div>
              </ax-live-preview>
            </section>

            <section class="time-slots-doc__section">
              <h2>Meeting Room Booking</h2>
              <ax-live-preview variant="bordered">
                <div class="time-slots-doc__example">
                  <ax-time-slots
                    label="Book Meeting Room"
                    mode="multiple"
                    [slots]="meetingSlots"
                    [columns]="3"
                    [(ngModel)]="meetingTimes"
                    helperText="Select consecutive slots for longer meetings"
                  ></ax-time-slots>

                  @if (meetingTimes?.length) {
                    <div class="time-slots-doc__selected">
                      Booked: {{ meetingTimes.join(' - ') }}
                      <span>({{ meetingTimes.length * 30 }} minutes)</span>
                    </div>
                  }
                </div>
              </ax-live-preview>
            </section>

            <section class="time-slots-doc__section">
              <h2>Restaurant Reservation (Thai)</h2>
              <ax-live-preview variant="bordered">
                <div class="time-slots-doc__example">
                  <ax-time-slots
                    label="เลือกเวลาจองโต๊ะ"
                    locale="th"
                    [slots]="restaurantSlots"
                    [columns]="4"
                    [(ngModel)]="reservationTime"
                  ></ax-time-slots>

                  @if (reservationTime) {
                    <div class="time-slots-doc__selected">
                      จองเวลา: {{ reservationTime }}
                    </div>
                  }
                </div>
              </ax-live-preview>
            </section>
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="time-slots-doc__tab-content">
            <section class="time-slots-doc__section">
              <h2>Properties</h2>
              <div class="time-slots-doc__api-table">
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
                      <td><code>label</code></td>
                      <td><code>string</code></td>
                      <td><code>''</code></td>
                      <td>Field label</td>
                    </tr>
                    <tr>
                      <td><code>size</code></td>
                      <td><code>'sm' | 'md' | 'lg'</code></td>
                      <td><code>'md'</code></td>
                      <td>Slot button size</td>
                    </tr>
                    <tr>
                      <td><code>layout</code></td>
                      <td><code>'grid' | 'list'</code></td>
                      <td><code>'grid'</code></td>
                      <td>Layout mode</td>
                    </tr>
                    <tr>
                      <td><code>mode</code></td>
                      <td><code>'single' | 'multiple'</code></td>
                      <td><code>'single'</code></td>
                      <td>Selection mode</td>
                    </tr>
                    <tr>
                      <td><code>timeFormat</code></td>
                      <td><code>'12h' | '24h'</code></td>
                      <td><code>'12h'</code></td>
                      <td>Time display format</td>
                    </tr>
                    <tr>
                      <td><code>locale</code></td>
                      <td><code>'en' | 'th'</code></td>
                      <td><code>'en'</code></td>
                      <td>Display locale</td>
                    </tr>
                    <tr>
                      <td><code>columns</code></td>
                      <td><code>number</code></td>
                      <td><code>4</code></td>
                      <td>Grid columns</td>
                    </tr>
                    <tr>
                      <td><code>disabled</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Disable all slots</td>
                    </tr>
                    <tr>
                      <td><code>required</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Mark as required</td>
                    </tr>
                    <tr>
                      <td><code>helperText</code></td>
                      <td><code>string</code></td>
                      <td><code>''</code></td>
                      <td>Helper text</td>
                    </tr>
                    <tr>
                      <td><code>errorMessage</code></td>
                      <td><code>string</code></td>
                      <td><code>''</code></td>
                      <td>Error message</td>
                    </tr>
                    <tr>
                      <td><code>slots</code></td>
                      <td><code>TimeSlot[]</code></td>
                      <td><code>[]</code></td>
                      <td>Custom time slots</td>
                    </tr>
                    <tr>
                      <td><code>config</code></td>
                      <td><code>TimeSlotConfig</code></td>
                      <td>-</td>
                      <td>Auto-generate config</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="time-slots-doc__section">
              <h2>TimeSlot Interface</h2>
              <ax-code-tabs [tabs]="timeSlotInterface"></ax-code-tabs>
            </section>

            <section class="time-slots-doc__section">
              <h2>TimeSlotConfig Interface</h2>
              <ax-code-tabs [tabs]="timeSlotConfigInterface"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- Tokens Tab -->
        <mat-tab label="Tokens">
          <div class="time-slots-doc__tab-content">
            <ax-component-tokens
              [tokens]="timeSlotsTokens"
            ></ax-component-tokens>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .time-slots-doc {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--ax-spacing-xl, 1.5rem);
      }

      .time-slots-doc__tabs {
        margin-top: var(--ax-spacing-xl, 1.5rem);
      }

      .time-slots-doc__tab-content {
        padding: var(--ax-spacing-xl, 1.5rem) 0;
      }

      .time-slots-doc__section {
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
      }

      .time-slots-doc__value {
        font-size: var(--ax-text-sm, 0.875rem);
        color: var(--ax-text-secondary);
      }

      .time-slots-doc__format-example {
        flex: 1;
        min-width: 300px;
      }

      .time-slots-doc__example {
        display: flex;
        flex-direction: column;
        gap: var(--ax-spacing-lg, 1rem);

        h4 {
          font-size: var(--ax-text-sm, 0.875rem);
          font-weight: 600;
          color: var(--ax-text-primary);
          margin: 0;
        }
      }

      .time-slots-doc__selected {
        padding: var(--ax-spacing-md, 0.75rem);
        background: var(--ax-brand-subtle);
        border-radius: var(--ax-radius-md);
        font-size: var(--ax-text-sm, 0.875rem);
        color: var(--ax-brand-default);
        font-weight: 500;

        span {
          color: var(--ax-text-secondary);
          font-weight: 400;
        }
      }

      .time-slots-doc__api-table {
        overflow-x: auto;
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-lg, 0.75rem);

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th,
        td {
          text-align: left;
          padding: var(--ax-spacing-sm, 0.5rem) var(--ax-spacing-md, 0.75rem);
          border-bottom: 1px solid var(--ax-border-default);
        }

        th {
          background: var(--ax-background-subtle);
          font-size: var(--ax-text-xs, 0.75rem);
          font-weight: 600;
          color: var(--ax-text-secondary);
          text-transform: uppercase;
        }

        td {
          font-size: var(--ax-text-sm, 0.875rem);
          color: var(--ax-text-primary);
        }

        td code {
          font-family: var(--ax-font-mono);
          font-size: var(--ax-text-xs, 0.75rem);
          background: var(--ax-background-subtle);
          padding: 2px 6px;
          border-radius: var(--ax-radius-sm, 0.25rem);
        }

        tr:last-child td {
          border-bottom: none;
        }
      }
    `,
  ],
})
export class TimeSlotsDocComponent {
  // Demo values
  basicTime: string | null = null;
  customTime: string | null = null;
  thaiTime: string | null = null;
  listTime: string | null = null;
  multipleTimes: string[] = [];
  appointmentTime: string | null = null;
  meetingTimes: string[] = [];
  reservationTime: string | null = null;

  // Configs
  basicConfig: TimeSlotConfig = {
    startTime: '09:00',
    endTime: '17:00',
    interval: 60,
  };

  sizeConfig: TimeSlotConfig = {
    startTime: '09:00',
    endTime: '12:00',
    interval: 60,
  };

  formatConfig: TimeSlotConfig = {
    startTime: '08:00',
    endTime: '14:00',
    interval: 60,
  };

  // Custom slots
  customSlots: TimeSlot[] = [
    { time: '09:00', label: '9:00 AM', available: true },
    { time: '09:30', label: '9:30 AM', available: false },
    { time: '10:00', label: '10:00 AM', available: true },
    { time: '10:30', label: '10:30 AM', available: true },
    { time: '11:00', label: '11:00 AM', available: false },
    { time: '11:30', label: '11:30 AM', available: true },
  ];

  thaiSlots: TimeSlot[] = [
    { time: '09:00', available: true },
    { time: '10:00', available: true },
    { time: '11:00', available: false },
    { time: '13:00', available: true },
    { time: '14:00', available: true },
    { time: '15:00', available: false },
  ];

  morningSlots: TimeSlot[] = [
    { time: '08:00', label: '8:00 AM', available: true },
    { time: '08:30', label: '8:30 AM', available: false },
    { time: '09:00', label: '9:00 AM', available: true },
    { time: '09:30', label: '9:30 AM', available: true },
    { time: '10:00', label: '10:00 AM', available: false },
    { time: '10:30', label: '10:30 AM', available: true },
    { time: '11:00', label: '11:00 AM', available: true },
    { time: '11:30', label: '11:30 AM', available: false },
  ];

  afternoonSlots: TimeSlot[] = [
    { time: '13:00', label: '1:00 PM', available: true },
    { time: '13:30', label: '1:30 PM', available: true },
    { time: '14:00', label: '2:00 PM', available: false },
    { time: '14:30', label: '2:30 PM', available: true },
    { time: '15:00', label: '3:00 PM', available: true },
    { time: '15:30', label: '3:30 PM', available: false },
    { time: '16:00', label: '4:00 PM', available: true },
    { time: '16:30', label: '4:30 PM', available: true },
  ];

  meetingSlots: TimeSlot[] = [
    { time: '09:00', label: '09:00', available: true },
    { time: '09:30', label: '09:30', available: true },
    { time: '10:00', label: '10:00', available: false },
    { time: '10:30', label: '10:30', available: false },
    { time: '11:00', label: '11:00', available: true },
    { time: '11:30', label: '11:30', available: true },
    { time: '13:00', label: '13:00', available: true },
    { time: '13:30', label: '13:30', available: true },
    { time: '14:00', label: '14:00', available: true },
  ];

  restaurantSlots: TimeSlot[] = [
    { time: '11:00', available: true },
    { time: '11:30', available: true },
    { time: '12:00', available: false },
    { time: '12:30', available: false },
    { time: '18:00', available: true },
    { time: '18:30', available: true },
    { time: '19:00', available: false },
    { time: '19:30', available: true },
  ];

  basicUsageCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-time-slots
  label="Select Time"
  [config]="config"
  [(ngModel)]="selectedTime">
</ax-time-slots>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AxTimeSlotsComponent, TimeSlotConfig } from '@aegisx/ui';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [FormsModule, AxTimeSlotsComponent],
  template: \`
    <ax-time-slots
      label="Select Time"
      [config]="config"
      [(ngModel)]="selectedTime">
    </ax-time-slots>
  \`,
})
export class MyComponent {
  selectedTime: string | null = null;

  config: TimeSlotConfig = {
    startTime: '09:00',
    endTime: '17:00',
    interval: 60, // 60 minutes
  };
}`,
    },
  ];

  timeSlotInterface = [
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `interface TimeSlot {
  time: string;      // HH:mm format (e.g., "09:00")
  label?: string;    // Optional custom label
  disabled?: boolean;
  available?: boolean;
  data?: unknown;    // Optional custom data
}`,
    },
  ];

  timeSlotConfigInterface = [
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `interface TimeSlotConfig {
  startTime?: string;    // HH:mm format, default "09:00"
  endTime?: string;      // HH:mm format, default "17:00"
  interval?: number;     // Minutes, default 30
  excludeTimes?: string[]; // Times to exclude
  disabledTimes?: string[]; // Times to show as disabled
}`,
    },
  ];

  timeSlotsTokens: ComponentToken[] = [
    {
      category: 'Colors',
      cssVar: '--ax-background-default',
      usage: 'Slot button background',
    },
    {
      category: 'Colors',
      cssVar: '--ax-border-default',
      usage: 'Slot button border',
    },
    {
      category: 'Colors',
      cssVar: '--ax-brand-default',
      usage: 'Selected slot background',
    },
    {
      category: 'Colors',
      cssVar: '--ax-brand-subtle',
      usage: 'Hover state background',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-primary',
      usage: 'Slot text color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-disabled',
      usage: 'Unavailable slot text',
    },
    {
      category: 'Colors',
      cssVar: '--ax-error-default',
      usage: 'Error state color',
    },
    {
      category: 'Borders',
      cssVar: '--ax-radius-md',
      usage: 'Slot button corners',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-sm',
      usage: 'Grid gap',
    },
  ];
}
