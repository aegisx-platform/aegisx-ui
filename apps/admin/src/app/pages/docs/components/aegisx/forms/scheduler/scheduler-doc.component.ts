import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import {
  AxSchedulerComponent,
  SchedulerValue,
  SchedulerAvailability,
  TimeSlotConfig,
} from '@aegisx/ui';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../../../components/docs';
import { ComponentToken } from '../../../../../../types/docs.types';

@Component({
  selector: 'ax-scheduler-doc',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatIconModule,
    AxSchedulerComponent,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="scheduler-doc">
      <ax-doc-header
        title="Scheduler"
        icon="event_available"
        description="Combined date and time selection component for appointment scheduling. Integrates date picker with time slots in various layouts."
        [breadcrumbs]="[
          { label: 'Forms', link: '/docs/components/aegisx/forms/scheduler' },
          { label: 'Scheduler' },
        ]"
        status="stable"
        version="1.0.0"
        importStatement="import { AxSchedulerComponent } from '@aegisx/ui';"
      ></ax-doc-header>

      <mat-tab-group class="scheduler-doc__tabs" animationDuration="150ms">
        <!-- Playground Tab -->
        <mat-tab label="Playground">
          <div class="scheduler-doc__tab-content">
            <section class="scheduler-doc__section">
              <h2>Interactive Config</h2>
              <p>
                Customize the scheduler component and copy the generated code.
              </p>

              <div class="scheduler-doc__playground">
                <!-- Config Panel -->
                <div class="scheduler-doc__config-panel">
                  <h4>Configuration</h4>

                  <div class="scheduler-doc__config-group">
                    <label>Layout</label>
                    <div class="scheduler-doc__config-options">
                      @for (opt of layoutOptions; track opt) {
                        <button
                          type="button"
                          class="scheduler-doc__config-btn"
                          [class.active]="configLayout === opt"
                          (click)="configLayout = opt"
                        >
                          {{ opt }}
                        </button>
                      }
                    </div>
                  </div>

                  <div class="scheduler-doc__config-group">
                    <label>Time Slots Layout</label>
                    <div class="scheduler-doc__config-options">
                      @for (opt of timeSlotsLayoutOptions; track opt) {
                        <button
                          type="button"
                          class="scheduler-doc__config-btn"
                          [class.active]="configTimeSlotsLayout === opt"
                          (click)="configTimeSlotsLayout = opt"
                        >
                          {{ opt }}
                        </button>
                      }
                    </div>
                  </div>

                  <div class="scheduler-doc__config-group">
                    <label>Size</label>
                    <div class="scheduler-doc__config-options">
                      @for (opt of sizeOptions; track opt) {
                        <button
                          type="button"
                          class="scheduler-doc__config-btn"
                          [class.active]="configSize === opt"
                          (click)="configSize = opt"
                        >
                          {{ opt }}
                        </button>
                      }
                    </div>
                  </div>

                  <div class="scheduler-doc__config-group">
                    <label>Locale</label>
                    <div class="scheduler-doc__config-options">
                      @for (opt of localeOptions; track opt) {
                        <button
                          type="button"
                          class="scheduler-doc__config-btn"
                          [class.active]="configLocale === opt.value"
                          (click)="configLocale = opt.value"
                        >
                          {{ opt.label }}
                        </button>
                      }
                    </div>
                  </div>

                  <div class="scheduler-doc__config-group">
                    <label>Time Format</label>
                    <div class="scheduler-doc__config-options">
                      @for (opt of timeFormatOptions; track opt) {
                        <button
                          type="button"
                          class="scheduler-doc__config-btn"
                          [class.active]="configTimeFormat === opt"
                          (click)="configTimeFormat = opt"
                        >
                          {{ opt }}
                        </button>
                      }
                    </div>
                  </div>

                  <div class="scheduler-doc__config-group">
                    <label>Columns (Grid only)</label>
                    <div class="scheduler-doc__config-options">
                      @for (opt of columnsOptions; track opt) {
                        <button
                          type="button"
                          class="scheduler-doc__config-btn"
                          [class.active]="configColumns === opt"
                          (click)="configColumns = opt"
                        >
                          {{ opt }}
                        </button>
                      }
                    </div>
                  </div>

                  <div class="scheduler-doc__config-group">
                    <label>Labels</label>
                    <input
                      type="text"
                      class="scheduler-doc__config-input"
                      placeholder="Main Label"
                      [(ngModel)]="configLabel"
                    />
                    <input
                      type="text"
                      class="scheduler-doc__config-input"
                      placeholder="Date Label"
                      [(ngModel)]="configDateLabel"
                    />
                    <input
                      type="text"
                      class="scheduler-doc__config-input"
                      placeholder="Time Label"
                      [(ngModel)]="configTimeLabel"
                    />
                  </div>

                  <div class="scheduler-doc__config-group">
                    <label>States</label>
                    <div class="scheduler-doc__config-toggles">
                      <label class="scheduler-doc__config-toggle">
                        <input type="checkbox" [(ngModel)]="configDisabled" />
                        <span>Disabled</span>
                      </label>
                      <label class="scheduler-doc__config-toggle">
                        <input type="checkbox" [(ngModel)]="configRequired" />
                        <span>Required</span>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Preview Panel -->
                <div class="scheduler-doc__preview-panel">
                  <h4>Live Preview</h4>
                  <ax-live-preview variant="bordered">
                    <ax-scheduler
                      [label]="configLabel"
                      [dateLabel]="configDateLabel"
                      [timeLabel]="configTimeLabel"
                      [layout]="configLayout"
                      [timeSlotsLayout]="configTimeSlotsLayout"
                      [size]="configSize"
                      [locale]="configLocale"
                      [timeFormat]="configTimeFormat"
                      [columns]="configColumns"
                      [disabled]="configDisabled"
                      [required]="configRequired"
                      [timeConfig]="playgroundConfig"
                      [(ngModel)]="playgroundValue"
                    ></ax-scheduler>
                  </ax-live-preview>

                  @if (playgroundValue?.date && playgroundValue?.time) {
                    <div class="scheduler-doc__preview-value">
                      <strong>Selected:</strong>
                      {{ $any(playgroundValue).date | date: 'medium' }} at
                      {{ $any(playgroundValue).time }}
                    </div>
                  }
                </div>
              </div>

              <!-- Generated Code -->
              <div class="scheduler-doc__code-section">
                <div class="scheduler-doc__code-header">
                  <h4>Generated Code</h4>
                  <button
                    type="button"
                    class="scheduler-doc__copy-btn"
                    (click)="copyCode()"
                  >
                    <mat-icon>content_copy</mat-icon>
                    {{ copied ? 'Copied!' : 'Copy' }}
                  </button>
                </div>
                <pre
                  class="scheduler-doc__code"
                ><code>{{ generatedCode }}</code></pre>
              </div>
            </section>
          </div>
        </mat-tab>

        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="scheduler-doc__tab-content">
            <section class="scheduler-doc__section">
              <h2>Basic Usage</h2>
              <p>
                Combined date and time selection in a single component. Users
                first select a date, then choose from available time slots.
              </p>

              <ax-live-preview variant="bordered">
                <ax-scheduler
                  label="Schedule Appointment"
                  dateLabel="Select Date"
                  timeLabel="Select Time"
                  [timeConfig]="basicConfig"
                  [(ngModel)]="basicValue"
                ></ax-scheduler>
              </ax-live-preview>

              <ax-code-tabs [tabs]="basicUsageCode"></ax-code-tabs>
            </section>

            <section class="scheduler-doc__section">
              <h2>Layouts</h2>
              <p>Three layout options for different UI requirements.</p>

              <h4>Horizontal Layout (Default)</h4>
              <ax-live-preview variant="bordered">
                <ax-scheduler
                  layout="horizontal"
                  dateLabel="Date"
                  timeLabel="Time"
                  [timeConfig]="layoutConfig"
                  [(ngModel)]="horizontalValue"
                ></ax-scheduler>
              </ax-live-preview>

              <h4>Vertical Layout</h4>
              <ax-live-preview variant="bordered">
                <ax-scheduler
                  layout="vertical"
                  dateLabel="Date"
                  timeLabel="Time"
                  [timeConfig]="layoutConfig"
                  [(ngModel)]="verticalValue"
                ></ax-scheduler>
              </ax-live-preview>

              <h4>Stacked Layout</h4>
              <ax-live-preview variant="bordered">
                <ax-scheduler
                  layout="stacked"
                  dateLabel="Date"
                  timeLabel="Time"
                  [timeConfig]="layoutConfig"
                  [(ngModel)]="stackedValue"
                ></ax-scheduler>
              </ax-live-preview>
            </section>

            <section class="scheduler-doc__section">
              <h2>Time Slots Layout</h2>
              <p>Choose between grid and list layout for time slots.</p>

              <h4>Grid Layout (Default)</h4>
              <ax-live-preview variant="bordered">
                <ax-scheduler
                  layout="stacked"
                  dateLabel="Date"
                  timeLabel="Time (Grid)"
                  timeSlotsLayout="grid"
                  [columns]="4"
                  [timeConfig]="layoutConfig"
                  [(ngModel)]="gridTimeSlotsValue"
                ></ax-scheduler>
              </ax-live-preview>

              <h4>List Layout</h4>
              <ax-live-preview variant="bordered">
                <ax-scheduler
                  layout="stacked"
                  dateLabel="Date"
                  timeLabel="Time (List)"
                  timeSlotsLayout="list"
                  [timeConfig]="layoutConfig"
                  [(ngModel)]="listTimeSlotsValue"
                ></ax-scheduler>
              </ax-live-preview>

              <h4>Calendly Style (Horizontal + List)</h4>
              <ax-live-preview variant="bordered">
                <div class="scheduler-doc__calendly-example">
                  <ax-scheduler
                    layout="horizontal"
                    timeSlotsLayout="list"
                    [timeConfig]="calendlyConfig"
                    [(ngModel)]="calendlyValue"
                  ></ax-scheduler>

                  @if (calendlyValue?.date && calendlyValue?.time) {
                    <div class="scheduler-doc__calendly-footer">
                      <span class="scheduler-doc__calendly-message">
                        Your meeting is booked for
                        <strong>{{
                          $any(calendlyValue).date | date: 'EEEE, MMMM d'
                        }}</strong>
                        at <strong>{{ $any(calendlyValue).time }}</strong
                        >.
                      </span>
                      <button class="scheduler-doc__calendly-button">
                        Continue
                      </button>
                    </div>
                  }
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="timeSlotsLayoutCode"></ax-code-tabs>
            </section>

            <section class="scheduler-doc__section">
              <h2>With Availability</h2>
              <p>
                Show different available time slots based on selected date.
                Useful for real appointment scheduling systems.
              </p>

              <ax-live-preview variant="bordered">
                <ax-scheduler
                  label="Book Appointment"
                  dateLabel="Choose Date"
                  timeLabel="Available Times"
                  [timeConfig]="availabilityConfig"
                  [availability]="availability"
                  [(ngModel)]="availabilityValue"
                  helperText="Time slots vary by day"
                ></ax-scheduler>
              </ax-live-preview>

              <ax-code-tabs [tabs]="availabilityCode"></ax-code-tabs>
            </section>

            <section class="scheduler-doc__section">
              <h2>Sizes</h2>
              <p>Three sizes for different contexts.</p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-xl)"
              >
                <div>
                  <h4>Small</h4>
                  <ax-scheduler
                    size="sm"
                    layout="stacked"
                    [timeConfig]="sizeConfig"
                  ></ax-scheduler>
                </div>

                <div>
                  <h4>Medium (default)</h4>
                  <ax-scheduler
                    size="md"
                    layout="stacked"
                    [timeConfig]="sizeConfig"
                  ></ax-scheduler>
                </div>

                <div>
                  <h4>Large</h4>
                  <ax-scheduler
                    size="lg"
                    layout="stacked"
                    [timeConfig]="sizeConfig"
                  ></ax-scheduler>
                </div>
              </ax-live-preview>
            </section>

            <section class="scheduler-doc__section">
              <h2>Thai Locale</h2>
              <p>Full Thai language support with Buddhist calendar.</p>

              <ax-live-preview variant="bordered">
                <ax-scheduler
                  label="นัดหมาย"
                  dateLabel="เลือกวันที่"
                  timeLabel="เลือกเวลา"
                  locale="th"
                  timeFormat="12h"
                  [timeConfig]="thaiConfig"
                  [(ngModel)]="thaiValue"
                ></ax-scheduler>
              </ax-live-preview>
            </section>

            <section class="scheduler-doc__section">
              <h2>Date Constraints</h2>
              <p>Limit date selection with min/max dates.</p>

              <ax-live-preview variant="bordered">
                <ax-scheduler
                  label="Book Within Next 7 Days"
                  [minDate]="today"
                  [maxDate]="nextWeek"
                  [timeConfig]="basicConfig"
                  [(ngModel)]="constrainedValue"
                ></ax-scheduler>
              </ax-live-preview>
            </section>

            <section class="scheduler-doc__section">
              <h2>24-Hour Format</h2>
              <p>Use 24-hour time format.</p>

              <ax-live-preview variant="bordered">
                <ax-scheduler
                  label="Schedule Meeting"
                  timeFormat="24h"
                  [timeConfig]="workHoursConfig"
                  [(ngModel)]="meetingValue"
                ></ax-scheduler>
              </ax-live-preview>
            </section>

            <section class="scheduler-doc__section">
              <h2>States</h2>
              <p>Different visual states.</p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-xl)"
              >
                <ax-scheduler
                  label="With Helper Text"
                  helperText="Select both date and time to continue"
                  layout="stacked"
                  [timeConfig]="sizeConfig"
                ></ax-scheduler>

                <ax-scheduler
                  label="With Error"
                  errorMessage="Please complete your selection"
                  layout="stacked"
                  [timeConfig]="sizeConfig"
                ></ax-scheduler>

                <ax-scheduler
                  label="Disabled"
                  [disabled]="true"
                  layout="stacked"
                  [timeConfig]="sizeConfig"
                ></ax-scheduler>
              </ax-live-preview>
            </section>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="scheduler-doc__tab-content">
            <section class="scheduler-doc__section">
              <h2>Doctor Appointment</h2>
              <ax-live-preview variant="bordered">
                <div class="scheduler-doc__example">
                  <ax-scheduler
                    label="Book Appointment with Dr. Smith"
                    dateLabel="Appointment Date"
                    timeLabel="Available Slots"
                    [minDate]="today"
                    [availability]="doctorAvailability"
                    [timeConfig]="doctorConfig"
                    [(ngModel)]="doctorAppointment"
                    helperText="Select a date to see available appointments"
                  ></ax-scheduler>

                  @if (doctorAppointment?.date && doctorAppointment?.time) {
                    <div class="scheduler-doc__confirmation">
                      <h4>Appointment Confirmed</h4>
                      <p>
                        <strong>Date:</strong>
                        {{
                          $any(doctorAppointment).date.toLocaleDateString(
                            'en-US',
                            {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            }
                          )
                        }}
                      </p>
                      <p>
                        <strong>Time:</strong>
                        {{ formatTime($any(doctorAppointment).time) }}
                      </p>
                    </div>
                  }
                </div>
              </ax-live-preview>
            </section>

            <section class="scheduler-doc__section">
              <h2>Spa Booking (Thai)</h2>
              <ax-live-preview variant="bordered">
                <div class="scheduler-doc__example">
                  <ax-scheduler
                    label="จองคิวสปา"
                    dateLabel="เลือกวันที่"
                    timeLabel="เวลาว่าง"
                    locale="th"
                    timeFormat="12h"
                    layout="vertical"
                    [minDate]="today"
                    [timeConfig]="spaConfig"
                    [(ngModel)]="spaBooking"
                  ></ax-scheduler>

                  @if (spaBooking?.date && spaBooking?.time) {
                    <div class="scheduler-doc__confirmation">
                      <h4>ยืนยันการจอง</h4>
                      <p>
                        <strong>วันที่:</strong>
                        {{
                          $any(spaBooking).date.toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        }}
                      </p>
                      <p>
                        <strong>เวลา:</strong>
                        {{ $any(spaBooking).time }}
                      </p>
                    </div>
                  }
                </div>
              </ax-live-preview>
            </section>

            <section class="scheduler-doc__section">
              <h2>Meeting Room Scheduler</h2>
              <ax-live-preview variant="bordered">
                <div class="scheduler-doc__example">
                  <ax-scheduler
                    label="Book Meeting Room"
                    dateLabel="Meeting Date"
                    timeLabel="Time Slot"
                    timeFormat="24h"
                    layout="horizontal"
                    [columns]="6"
                    [minDate]="today"
                    [timeConfig]="meetingRoomConfig"
                    [(ngModel)]="roomBooking"
                  ></ax-scheduler>

                  @if (roomBooking?.date && roomBooking?.time) {
                    <div class="scheduler-doc__confirmation">
                      <h4>Room Booked</h4>
                      <p>
                        {{ $any(roomBooking).date.toLocaleDateString() }} at
                        {{ $any(roomBooking).time }}
                      </p>
                    </div>
                  }
                </div>
              </ax-live-preview>
            </section>
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="scheduler-doc__tab-content">
            <section class="scheduler-doc__section">
              <h2>Properties</h2>
              <div class="scheduler-doc__api-table">
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
                      <td>Main label</td>
                    </tr>
                    <tr>
                      <td><code>dateLabel</code></td>
                      <td><code>string</code></td>
                      <td><code>''</code></td>
                      <td>Date section label</td>
                    </tr>
                    <tr>
                      <td><code>timeLabel</code></td>
                      <td><code>string</code></td>
                      <td><code>''</code></td>
                      <td>Time section label</td>
                    </tr>
                    <tr>
                      <td><code>layout</code></td>
                      <td>
                        <code>'horizontal' | 'vertical' | 'stacked'</code>
                      </td>
                      <td><code>'horizontal'</code></td>
                      <td>Layout mode</td>
                    </tr>
                    <tr>
                      <td><code>size</code></td>
                      <td><code>'sm' | 'md' | 'lg'</code></td>
                      <td><code>'md'</code></td>
                      <td>Component size</td>
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
                      <td>Time slots grid columns</td>
                    </tr>
                    <tr>
                      <td><code>timeSlotsLayout</code></td>
                      <td><code>'grid' | 'list'</code></td>
                      <td><code>'grid'</code></td>
                      <td>Time slots display layout</td>
                    </tr>
                    <tr>
                      <td><code>minDate</code></td>
                      <td><code>Date</code></td>
                      <td>-</td>
                      <td>Minimum selectable date</td>
                    </tr>
                    <tr>
                      <td><code>maxDate</code></td>
                      <td><code>Date</code></td>
                      <td>-</td>
                      <td>Maximum selectable date</td>
                    </tr>
                    <tr>
                      <td><code>timeConfig</code></td>
                      <td><code>TimeSlotConfig</code></td>
                      <td>-</td>
                      <td>Time slot generation config</td>
                    </tr>
                    <tr>
                      <td><code>availability</code></td>
                      <td><code>SchedulerAvailability</code></td>
                      <td>-</td>
                      <td>Date-specific availability map</td>
                    </tr>
                    <tr>
                      <td><code>autoSelectFirstTime</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Auto-select first available time</td>
                    </tr>
                    <tr>
                      <td><code>disabled</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Disable component</td>
                    </tr>
                    <tr>
                      <td><code>required</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Mark as required</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="scheduler-doc__section">
              <h2>SchedulerValue Interface</h2>
              <ax-code-tabs [tabs]="schedulerValueInterface"></ax-code-tabs>
            </section>

            <section class="scheduler-doc__section">
              <h2>SchedulerAvailability Interface</h2>
              <ax-code-tabs
                [tabs]="schedulerAvailabilityInterface"
              ></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- Tokens Tab -->
        <mat-tab label="Tokens">
          <div class="scheduler-doc__tab-content">
            <ax-component-tokens
              [tokens]="schedulerTokens"
            ></ax-component-tokens>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .scheduler-doc {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--ax-spacing-xl, 1.5rem);
      }

      .scheduler-doc__tabs {
        margin-top: var(--ax-spacing-xl, 1.5rem);
      }

      .scheduler-doc__tab-content {
        padding: var(--ax-spacing-xl, 1.5rem) 0;
      }

      .scheduler-doc__section {
        margin-bottom: var(--ax-spacing-3xl, 3rem);

        h2 {
          font-size: var(--ax-text-xl, 1.25rem);
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0 0 var(--ax-spacing-sm, 0.5rem) 0;
        }

        h4 {
          font-size: var(--ax-text-sm, 0.875rem);
          font-weight: 600;
          color: var(--ax-text-primary);
          margin: var(--ax-spacing-lg, 1rem) 0 var(--ax-spacing-sm, 0.5rem) 0;
        }

        > p {
          font-size: var(--ax-text-sm, 0.875rem);
          color: var(--ax-text-secondary);
          margin: 0 0 var(--ax-spacing-lg, 1rem) 0;
          max-width: 700px;
        }
      }

      .scheduler-doc__example {
        display: flex;
        flex-direction: column;
        gap: var(--ax-spacing-lg, 1rem);
      }

      .scheduler-doc__confirmation {
        padding: var(--ax-spacing-md, 0.75rem);
        background: var(--ax-success-subtle);
        border: 1px solid var(--ax-success-default);
        border-radius: var(--ax-radius-md);

        h4 {
          margin: 0 0 var(--ax-spacing-sm, 0.5rem) 0;
          color: var(--ax-success-emphasis);
          font-size: var(--ax-text-sm, 0.875rem);
        }

        p {
          margin: 0 0 var(--ax-spacing-xs, 0.25rem) 0;
          font-size: var(--ax-text-sm, 0.875rem);
          color: var(--ax-text-primary);

          strong {
            color: var(--ax-text-heading);
          }
        }
      }

      // Calendly-style example
      .scheduler-doc__calendly-example {
        display: flex;
        flex-direction: column;
        gap: 0;
      }

      .scheduler-doc__calendly-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--ax-spacing-md, 0.75rem);
        padding: var(--ax-spacing-lg, 1rem) var(--ax-spacing-md, 0.75rem);
        background: var(--ax-background-subtle);
        border-top: 1px solid var(--ax-border-default);
        margin-top: var(--ax-spacing-lg, 1rem);
      }

      .scheduler-doc__calendly-message {
        font-size: var(--ax-text-sm, 0.875rem);
        color: var(--ax-text-primary);

        strong {
          color: var(--ax-text-heading);
        }
      }

      .scheduler-doc__calendly-button {
        padding: var(--ax-spacing-sm, 0.5rem) var(--ax-spacing-lg, 1rem);
        background: var(--ax-brand-default, #3b82f6);
        color: white;
        border: none;
        border-radius: var(--ax-radius-md, 0.375rem);
        font-size: var(--ax-text-sm, 0.875rem);
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.15s ease;

        &:hover {
          background: var(--ax-brand-emphasis, #2563eb);
        }
      }

      .scheduler-doc__api-table {
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

      // Playground styles
      .scheduler-doc__playground {
        display: grid;
        grid-template-columns: 320px 1fr;
        gap: var(--ax-spacing-xl, 1.5rem);
        margin-bottom: var(--ax-spacing-xl, 1.5rem);

        @media (max-width: 1024px) {
          grid-template-columns: 1fr;
        }
      }

      .scheduler-doc__config-panel {
        padding: var(--ax-spacing-lg, 1rem);
        background: var(--ax-background-subtle);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-lg, 0.75rem);

        h4 {
          font-size: var(--ax-text-sm, 0.875rem);
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0 0 var(--ax-spacing-lg, 1rem) 0;
          padding-bottom: var(--ax-spacing-sm, 0.5rem);
          border-bottom: 1px solid var(--ax-border-default);
        }
      }

      .scheduler-doc__config-group {
        margin-bottom: var(--ax-spacing-md, 0.75rem);

        > label {
          display: block;
          font-size: var(--ax-text-xs, 0.75rem);
          font-weight: 500;
          color: var(--ax-text-secondary);
          margin-bottom: var(--ax-spacing-xs, 0.25rem);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      }

      .scheduler-doc__config-options {
        display: flex;
        flex-wrap: wrap;
        gap: var(--ax-spacing-xs, 0.25rem);
      }

      .scheduler-doc__config-btn {
        padding: var(--ax-spacing-xs, 0.25rem) var(--ax-spacing-sm, 0.5rem);
        font-size: var(--ax-text-xs, 0.75rem);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-sm, 0.25rem);
        background: var(--ax-background-default);
        color: var(--ax-text-primary);
        cursor: pointer;
        transition: all 0.15s ease;

        &:hover {
          border-color: var(--ax-brand-default);
          color: var(--ax-brand-default);
        }

        &.active {
          background: var(--ax-brand-default);
          border-color: var(--ax-brand-default);
          color: white;
        }
      }

      .scheduler-doc__config-input {
        width: 100%;
        padding: var(--ax-spacing-xs, 0.25rem) var(--ax-spacing-sm, 0.5rem);
        font-size: var(--ax-text-sm, 0.875rem);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-sm, 0.25rem);
        background: var(--ax-background-default);
        color: var(--ax-text-primary);
        margin-bottom: var(--ax-spacing-xs, 0.25rem);

        &:focus {
          outline: none;
          border-color: var(--ax-brand-default);
        }

        &::placeholder {
          color: var(--ax-text-subtle);
        }
      }

      .scheduler-doc__config-toggles {
        display: flex;
        flex-direction: column;
        gap: var(--ax-spacing-xs, 0.25rem);
      }

      .scheduler-doc__config-toggle {
        display: flex;
        align-items: center;
        gap: var(--ax-spacing-xs, 0.25rem);
        font-size: var(--ax-text-sm, 0.875rem);
        color: var(--ax-text-primary);
        cursor: pointer;

        input[type='checkbox'] {
          width: 16px;
          height: 16px;
          accent-color: var(--ax-brand-default);
        }
      }

      .scheduler-doc__preview-panel {
        h4 {
          font-size: var(--ax-text-sm, 0.875rem);
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0 0 var(--ax-spacing-md, 0.75rem) 0;
        }
      }

      .scheduler-doc__preview-value {
        margin-top: var(--ax-spacing-md, 0.75rem);
        padding: var(--ax-spacing-sm, 0.5rem) var(--ax-spacing-md, 0.75rem);
        background: var(--ax-brand-subtle);
        border-radius: var(--ax-radius-md, 0.375rem);
        font-size: var(--ax-text-sm, 0.875rem);
        color: var(--ax-text-primary);
      }

      .scheduler-doc__code-section {
        margin-top: var(--ax-spacing-lg, 1rem);
      }

      .scheduler-doc__code-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--ax-spacing-sm, 0.5rem);

        h4 {
          font-size: var(--ax-text-sm, 0.875rem);
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0;
        }
      }

      .scheduler-doc__copy-btn {
        display: flex;
        align-items: center;
        gap: var(--ax-spacing-xs, 0.25rem);
        padding: var(--ax-spacing-xs, 0.25rem) var(--ax-spacing-sm, 0.5rem);
        font-size: var(--ax-text-xs, 0.75rem);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-sm, 0.25rem);
        background: var(--ax-background-default);
        color: var(--ax-text-primary);
        cursor: pointer;
        transition: all 0.15s ease;

        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }

        &:hover {
          border-color: var(--ax-brand-default);
          color: var(--ax-brand-default);
        }
      }

      .scheduler-doc__code {
        padding: var(--ax-spacing-md, 0.75rem);
        background: var(--ax-background-subtle);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-md, 0.375rem);
        overflow-x: auto;
        margin: 0;

        code {
          font-family: var(
            --ax-font-mono,
            'SF Mono',
            Monaco,
            'Cascadia Code',
            monospace
          );
          font-size: var(--ax-text-sm, 0.875rem);
          color: var(--ax-text-primary);
          white-space: pre;
        }
      }
    `,
  ],
})
export class SchedulerDocComponent {
  // Playground config options
  layoutOptions: ('horizontal' | 'vertical' | 'stacked')[] = [
    'horizontal',
    'vertical',
    'stacked',
  ];
  timeSlotsLayoutOptions: ('grid' | 'list')[] = ['grid', 'list'];
  sizeOptions: ('sm' | 'md' | 'lg')[] = ['sm', 'md', 'lg'];
  localeOptions = [
    { value: 'en' as const, label: 'English' },
    { value: 'th' as const, label: 'ไทย' },
  ];
  timeFormatOptions: ('12h' | '24h')[] = ['12h', '24h'];
  columnsOptions = [2, 3, 4, 5, 6];

  // Playground config state
  configLayout: 'horizontal' | 'vertical' | 'stacked' = 'horizontal';
  configTimeSlotsLayout: 'grid' | 'list' = 'grid';
  configSize: 'sm' | 'md' | 'lg' = 'md';
  configLocale: 'en' | 'th' = 'en';
  configTimeFormat: '12h' | '24h' = '12h';
  configColumns = 4;
  configLabel = 'Schedule Appointment';
  configDateLabel = 'Select Date';
  configTimeLabel = 'Select Time';
  configDisabled = false;
  configRequired = false;
  copied = false;

  playgroundValue: SchedulerValue | null = null;
  playgroundConfig: TimeSlotConfig = {
    startTime: '09:00',
    endTime: '17:00',
    interval: 60,
  };

  get generatedCode(): string {
    const attrs: string[] = [];

    if (this.configLabel) {
      attrs.push(`  label="${this.configLabel}"`);
    }
    if (this.configDateLabel) {
      attrs.push(`  dateLabel="${this.configDateLabel}"`);
    }
    if (this.configTimeLabel) {
      attrs.push(`  timeLabel="${this.configTimeLabel}"`);
    }
    if (this.configLayout !== 'horizontal') {
      attrs.push(`  layout="${this.configLayout}"`);
    }
    if (this.configTimeSlotsLayout !== 'grid') {
      attrs.push(`  timeSlotsLayout="${this.configTimeSlotsLayout}"`);
    }
    if (this.configSize !== 'md') {
      attrs.push(`  size="${this.configSize}"`);
    }
    if (this.configLocale !== 'en') {
      attrs.push(`  locale="${this.configLocale}"`);
    }
    if (this.configTimeFormat !== '12h') {
      attrs.push(`  timeFormat="${this.configTimeFormat}"`);
    }
    if (this.configTimeSlotsLayout === 'grid' && this.configColumns !== 4) {
      attrs.push(`  [columns]="${this.configColumns}"`);
    }
    if (this.configDisabled) {
      attrs.push(`  [disabled]="true"`);
    }
    if (this.configRequired) {
      attrs.push(`  [required]="true"`);
    }

    attrs.push(`  [timeConfig]="timeConfig"`);
    attrs.push(`  [(ngModel)]="schedulerValue"`);

    return `<ax-scheduler\n${attrs.join('\n')}\n></ax-scheduler>

// TypeScript
timeConfig: TimeSlotConfig = {
  startTime: '09:00',
  endTime: '17:00',
  interval: 60,
};

schedulerValue: SchedulerValue | null = null;`;
  }

  copyCode(): void {
    navigator.clipboard.writeText(this.generatedCode).then(() => {
      this.copied = true;
      setTimeout(() => (this.copied = false), 2000);
    });
  }

  // Demo values
  basicValue: SchedulerValue | null = null;
  horizontalValue: SchedulerValue | null = null;
  verticalValue: SchedulerValue | null = null;
  stackedValue: SchedulerValue | null = null;
  gridTimeSlotsValue: SchedulerValue | null = null;
  listTimeSlotsValue: SchedulerValue | null = null;
  calendlyValue: SchedulerValue | null = null;
  availabilityValue: SchedulerValue | null = null;
  thaiValue: SchedulerValue | null = null;
  constrainedValue: SchedulerValue | null = null;
  meetingValue: SchedulerValue | null = null;
  doctorAppointment: SchedulerValue | null = null;
  spaBooking: SchedulerValue | null = null;
  roomBooking: SchedulerValue | null = null;

  // Dates
  today = new Date();
  nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Configs
  basicConfig: TimeSlotConfig = {
    startTime: '09:00',
    endTime: '17:00',
    interval: 60,
  };

  layoutConfig: TimeSlotConfig = {
    startTime: '09:00',
    endTime: '12:00',
    interval: 60,
  };

  calendlyConfig: TimeSlotConfig = {
    startTime: '09:00',
    endTime: '11:00',
    interval: 15,
  };

  sizeConfig: TimeSlotConfig = {
    startTime: '09:00',
    endTime: '11:00',
    interval: 60,
  };

  availabilityConfig: TimeSlotConfig = {
    startTime: '09:00',
    endTime: '17:00',
    interval: 60,
  };

  thaiConfig: TimeSlotConfig = {
    startTime: '10:00',
    endTime: '18:00',
    interval: 60,
  };

  workHoursConfig: TimeSlotConfig = {
    startTime: '08:00',
    endTime: '18:00',
    interval: 60,
  };

  doctorConfig: TimeSlotConfig = {
    startTime: '08:00',
    endTime: '17:00',
    interval: 30,
  };

  spaConfig: TimeSlotConfig = {
    startTime: '10:00',
    endTime: '20:00',
    interval: 60,
  };

  meetingRoomConfig: TimeSlotConfig = {
    startTime: '08:00',
    endTime: '18:00',
    interval: 30,
  };

  // Availability maps
  availability: SchedulerAvailability = this.generateAvailability();
  doctorAvailability: SchedulerAvailability = this.generateDoctorAvailability();

  generateAvailability(): SchedulerAvailability {
    const result: SchedulerAvailability = {};
    const now = new Date();

    for (let i = 0; i < 14; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i);
      const key = this.formatDateKey(date);

      // Weekends have fewer slots
      if (date.getDay() === 0 || date.getDay() === 6) {
        result[key] = ['10:00', '11:00', '14:00', '15:00'];
      } else {
        result[key] = [
          '09:00',
          '10:00',
          '11:00',
          '13:00',
          '14:00',
          '15:00',
          '16:00',
        ];
      }
    }

    return result;
  }

  generateDoctorAvailability(): SchedulerAvailability {
    const result: SchedulerAvailability = {};
    const now = new Date();

    for (let i = 0; i < 14; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i);
      const key = this.formatDateKey(date);

      // No appointments on weekends
      if (date.getDay() === 0 || date.getDay() === 6) {
        result[key] = [];
      } else {
        // Random availability
        const slots = [
          '08:00',
          '08:30',
          '09:00',
          '09:30',
          '10:00',
          '10:30',
          '11:00',
          '13:00',
          '13:30',
          '14:00',
          '14:30',
          '15:00',
          '15:30',
          '16:00',
          '16:30',
        ];
        result[key] = slots.filter(() => Math.random() > 0.3);
      }
    }

    return result;
  }

  formatDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatTime(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  basicUsageCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-scheduler
  label="Schedule Appointment"
  dateLabel="Select Date"
  timeLabel="Select Time"
  [timeConfig]="timeConfig"
  [(ngModel)]="schedulerValue">
</ax-scheduler>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AxSchedulerComponent,
  SchedulerValue,
  TimeSlotConfig
} from '@aegisx/ui';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [FormsModule, AxSchedulerComponent],
  template: \`
    <ax-scheduler
      label="Schedule Appointment"
      dateLabel="Select Date"
      timeLabel="Select Time"
      [timeConfig]="timeConfig"
      [(ngModel)]="schedulerValue">
    </ax-scheduler>
  \`,
})
export class BookingComponent {
  schedulerValue: SchedulerValue | null = null;

  timeConfig: TimeSlotConfig = {
    startTime: '09:00',
    endTime: '17:00',
    interval: 60,
  };
}`,
    },
  ];

  timeSlotsLayoutCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Grid Layout (default) -->
<ax-scheduler
  timeSlotsLayout="grid"
  [columns]="4"
  [timeConfig]="timeConfig"
  [(ngModel)]="value">
</ax-scheduler>

<!-- List Layout -->
<ax-scheduler
  timeSlotsLayout="list"
  [timeConfig]="timeConfig"
  [(ngModel)]="value">
</ax-scheduler>`,
    },
  ];

  availabilityCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-scheduler
  label="Book Appointment"
  [timeConfig]="timeConfig"
  [availability]="availability"
  [(ngModel)]="value">
</ax-scheduler>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import {
  AxSchedulerComponent,
  SchedulerValue,
  SchedulerAvailability,
  TimeSlotConfig
} from '@aegisx/ui';

@Component({...})
export class BookingComponent {
  value: SchedulerValue | null = null;

  timeConfig: TimeSlotConfig = {
    startTime: '09:00',
    endTime: '17:00',
    interval: 60,
  };

  // Map of date string to available time slots
  availability: SchedulerAvailability = {
    '2024-12-01': ['09:00', '10:00', '14:00', '15:00'],
    '2024-12-02': ['10:00', '11:00', '13:00', '16:00'],
    '2024-12-03': ['09:00', '11:00', '14:00', '15:00', '16:00'],
    // ... more dates
  };
}`,
    },
  ];

  schedulerValueInterface = [
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `interface SchedulerValue {
  date: Date | null;
  time: string | null; // HH:mm format
}`,
    },
  ];

  schedulerAvailabilityInterface = [
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `// Map of date string (YYYY-MM-DD) to available time slots
interface SchedulerAvailability {
  [dateString: string]: string[]; // Array of HH:mm times
}

// Example:
const availability: SchedulerAvailability = {
  '2024-12-01': ['09:00', '10:00', '14:00'],
  '2024-12-02': ['10:00', '11:00', '15:00'],
};`,
    },
  ];

  schedulerTokens: ComponentToken[] = [
    {
      category: 'Colors',
      cssVar: '--ax-background-default',
      usage: 'Component background',
    },
    {
      category: 'Colors',
      cssVar: '--ax-background-subtle',
      usage: 'Placeholder background',
    },
    {
      category: 'Colors',
      cssVar: '--ax-brand-default',
      usage: 'Selection highlight',
    },
    {
      category: 'Colors',
      cssVar: '--ax-brand-subtle',
      usage: 'Summary background',
    },
    {
      category: 'Colors',
      cssVar: '--ax-border-default',
      usage: 'Section borders',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-primary',
      usage: 'Primary text',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-secondary',
      usage: 'Section labels',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-lg',
      usage: 'Section gap',
    },
    {
      category: 'Borders',
      cssVar: '--ax-radius-md',
      usage: 'Summary corners',
    },
  ];
}
