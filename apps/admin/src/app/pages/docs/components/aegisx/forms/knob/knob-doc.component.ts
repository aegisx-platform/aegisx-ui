import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { AxKnobComponent } from '@aegisx/ui';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../../../components/docs';
import { ComponentToken } from '../../../../../../types/docs.types';

@Component({
  selector: 'ax-knob-doc',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatIconModule,
    AxKnobComponent,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="knob-doc">
      <ax-doc-header
        title="Knob"
        icon="tune"
        description="Circular input control for numeric values with mouse/touch drag interaction. Perfect for volume controls, gauge displays, and settings adjustments."
        [breadcrumbs]="[
          { label: 'Forms', link: '/docs/components/aegisx/forms/date-picker' },
          { label: 'Knob' },
        ]"
        status="stable"
        version="1.0.0"
        importStatement="import { AxKnobComponent } from '@aegisx/ui';"
      ></ax-doc-header>

      <mat-tab-group class="knob-doc__tabs" animationDuration="200ms">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="knob-doc__tab-content">
            <!-- Basic Usage -->
            <section class="knob-doc__section">
              <h2>Basic Usage</h2>
              <p>
                Click and drag the knob to change its value. The progress arc
                shows the current value relative to the range.
              </p>

              <ax-live-preview variant="bordered">
                <div class="knob-doc__demo-row">
                  <ax-knob
                    [(value)]="basicValue"
                    [min]="0"
                    [max]="100"
                  ></ax-knob>
                  <div class="knob-doc__value-display">
                    Value: <strong>{{ basicValue }}</strong>
                  </div>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="basicUsageCode"></ax-code-tabs>
            </section>

            <!-- Sizes -->
            <section class="knob-doc__section">
              <h2>Sizes</h2>
              <p>
                Four size variants for different use cases and container sizes.
              </p>

              <ax-live-preview variant="bordered">
                <div class="knob-doc__demo-row knob-doc__demo-row--align-end">
                  <div class="knob-doc__size-demo">
                    <ax-knob [(value)]="smValue" size="sm"></ax-knob>
                    <span>Small</span>
                  </div>
                  <div class="knob-doc__size-demo">
                    <ax-knob [(value)]="mdValue" size="md"></ax-knob>
                    <span>Medium</span>
                  </div>
                  <div class="knob-doc__size-demo">
                    <ax-knob [(value)]="lgValue" size="lg"></ax-knob>
                    <span>Large</span>
                  </div>
                  <div class="knob-doc__size-demo">
                    <ax-knob [(value)]="xlValue" size="xl"></ax-knob>
                    <span>Extra Large</span>
                  </div>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="sizesCode"></ax-code-tabs>
            </section>

            <!-- Colors -->
            <section class="knob-doc__section">
              <h2>Colors</h2>
              <p>Semantic color variants for different contexts.</p>

              <ax-live-preview variant="bordered">
                <div class="knob-doc__demo-row">
                  <div class="knob-doc__color-demo">
                    <ax-knob [value]="75" color="primary"></ax-knob>
                    <span>Primary</span>
                  </div>
                  <div class="knob-doc__color-demo">
                    <ax-knob [value]="75" color="accent"></ax-knob>
                    <span>Accent</span>
                  </div>
                  <div class="knob-doc__color-demo">
                    <ax-knob [value]="75" color="success"></ax-knob>
                    <span>Success</span>
                  </div>
                  <div class="knob-doc__color-demo">
                    <ax-knob [value]="75" color="warning"></ax-knob>
                    <span>Warning</span>
                  </div>
                  <div class="knob-doc__color-demo">
                    <ax-knob [value]="75" color="error"></ax-knob>
                    <span>Error</span>
                  </div>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="colorsCode"></ax-code-tabs>
            </section>

            <!-- Value Suffix -->
            <section class="knob-doc__section">
              <h2>Value Display</h2>
              <p>Show or hide the value, and add suffixes for units.</p>

              <ax-live-preview variant="bordered">
                <div class="knob-doc__demo-row">
                  <div class="knob-doc__suffix-demo">
                    <ax-knob [(value)]="percentValue" valueSuffix="%"></ax-knob>
                    <span>Percentage</span>
                  </div>
                  <div class="knob-doc__suffix-demo">
                    <ax-knob
                      [(value)]="dbValue"
                      [min]="-60"
                      [max]="0"
                      valueSuffix="dB"
                    ></ax-knob>
                    <span>Decibels</span>
                  </div>
                  <div class="knob-doc__suffix-demo">
                    <ax-knob
                      [(value)]="tempValue"
                      [min]="0"
                      [max]="40"
                      valueSuffix="°C"
                    ></ax-knob>
                    <span>Temperature</span>
                  </div>
                  <div class="knob-doc__suffix-demo">
                    <ax-knob
                      [(value)]="hiddenValue"
                      [showValue]="false"
                    ></ax-knob>
                    <span>Hidden Value</span>
                  </div>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="suffixCode"></ax-code-tabs>
            </section>

            <!-- Step -->
            <section class="knob-doc__section">
              <h2>Step Increment</h2>
              <p>
                Control the precision of value changes with step increments.
              </p>

              <ax-live-preview variant="bordered">
                <div class="knob-doc__demo-row">
                  <div class="knob-doc__step-demo">
                    <ax-knob [(value)]="step1Value" [step]="1"></ax-knob>
                    <span>Step: 1</span>
                  </div>
                  <div class="knob-doc__step-demo">
                    <ax-knob [(value)]="step5Value" [step]="5"></ax-knob>
                    <span>Step: 5</span>
                  </div>
                  <div class="knob-doc__step-demo">
                    <ax-knob [(value)]="step10Value" [step]="10"></ax-knob>
                    <span>Step: 10</span>
                  </div>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="stepCode"></ax-code-tabs>
            </section>

            <!-- States -->
            <section class="knob-doc__section">
              <h2>States</h2>
              <p>Disabled and read-only states for non-interactive displays.</p>

              <ax-live-preview variant="bordered">
                <div class="knob-doc__demo-row">
                  <div class="knob-doc__state-demo">
                    <ax-knob [value]="65" [disabled]="true"></ax-knob>
                    <span>Disabled</span>
                  </div>
                  <div class="knob-doc__state-demo">
                    <ax-knob [value]="85" [readonly]="true"></ax-knob>
                    <span>Read-only</span>
                  </div>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="statesCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="knob-doc__tab-content">
            <!-- Audio Mixer -->
            <section class="knob-doc__section">
              <h2>Audio Mixer</h2>
              <p>Volume and pan controls for an audio mixing interface.</p>

              <ax-live-preview variant="bordered">
                <div class="knob-doc__mixer">
                  <div class="knob-doc__channel">
                    <span class="knob-doc__channel-label">CH 1</span>
                    <ax-knob
                      [(value)]="channel1Vol"
                      [min]="-60"
                      [max]="12"
                      size="lg"
                      color="success"
                      valueSuffix="dB"
                    ></ax-knob>
                    <span class="knob-doc__channel-name">Drums</span>
                  </div>
                  <div class="knob-doc__channel">
                    <span class="knob-doc__channel-label">CH 2</span>
                    <ax-knob
                      [(value)]="channel2Vol"
                      [min]="-60"
                      [max]="12"
                      size="lg"
                      color="primary"
                      valueSuffix="dB"
                    ></ax-knob>
                    <span class="knob-doc__channel-name">Bass</span>
                  </div>
                  <div class="knob-doc__channel">
                    <span class="knob-doc__channel-label">CH 3</span>
                    <ax-knob
                      [(value)]="channel3Vol"
                      [min]="-60"
                      [max]="12"
                      size="lg"
                      color="accent"
                      valueSuffix="dB"
                    ></ax-knob>
                    <span class="knob-doc__channel-name">Guitar</span>
                  </div>
                  <div class="knob-doc__channel knob-doc__channel--master">
                    <span class="knob-doc__channel-label">MASTER</span>
                    <ax-knob
                      [(value)]="masterVol"
                      [min]="-60"
                      [max]="0"
                      size="xl"
                      color="error"
                      valueSuffix="dB"
                    ></ax-knob>
                    <span class="knob-doc__channel-name">Output</span>
                  </div>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="audioMixerCode"></ax-code-tabs>
            </section>

            <!-- Dashboard Gauges -->
            <section class="knob-doc__section">
              <h2>Dashboard Gauges</h2>
              <p>Read-only gauges for displaying metrics.</p>

              <ax-live-preview variant="bordered">
                <div class="knob-doc__gauges">
                  <div class="knob-doc__gauge">
                    <ax-knob
                      [value]="cpuUsage"
                      [readonly]="true"
                      size="lg"
                      color="primary"
                    >
                    </ax-knob>
                    <div class="knob-doc__gauge-info">
                      <strong>CPU Usage</strong>
                      <span>{{ cpuUsage }}%</span>
                    </div>
                  </div>
                  <div class="knob-doc__gauge">
                    <ax-knob
                      [value]="memoryUsage"
                      [readonly]="true"
                      size="lg"
                      color="warning"
                    >
                    </ax-knob>
                    <div class="knob-doc__gauge-info">
                      <strong>Memory</strong>
                      <span>{{ memoryUsage }}%</span>
                    </div>
                  </div>
                  <div class="knob-doc__gauge">
                    <ax-knob
                      [value]="diskUsage"
                      [readonly]="true"
                      size="lg"
                      color="success"
                    >
                    </ax-knob>
                    <div class="knob-doc__gauge-info">
                      <strong>Disk</strong>
                      <span>{{ diskUsage }}%</span>
                    </div>
                  </div>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="dashboardGaugesCode"></ax-code-tabs>
            </section>

            <!-- Settings Panel -->
            <section class="knob-doc__section">
              <h2>Settings Panel</h2>
              <p>Interactive settings with knob controls.</p>

              <ax-live-preview variant="bordered">
                <div class="knob-doc__settings">
                  <div class="knob-doc__setting">
                    <div class="knob-doc__setting-info">
                      <mat-icon>volume_up</mat-icon>
                      <div>
                        <strong>Volume</strong>
                        <span>System volume level</span>
                      </div>
                    </div>
                    <ax-knob
                      [(value)]="settingsVolume"
                      size="md"
                      valueSuffix="%"
                    ></ax-knob>
                  </div>
                  <div class="knob-doc__setting">
                    <div class="knob-doc__setting-info">
                      <mat-icon>brightness_6</mat-icon>
                      <div>
                        <strong>Brightness</strong>
                        <span>Display brightness</span>
                      </div>
                    </div>
                    <ax-knob
                      [(value)]="settingsBrightness"
                      size="md"
                      valueSuffix="%"
                    ></ax-knob>
                  </div>
                  <div class="knob-doc__setting">
                    <div class="knob-doc__setting-info">
                      <mat-icon>contrast</mat-icon>
                      <div>
                        <strong>Contrast</strong>
                        <span>Display contrast</span>
                      </div>
                    </div>
                    <ax-knob
                      [(value)]="settingsContrast"
                      size="md"
                      valueSuffix="%"
                    ></ax-knob>
                  </div>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="settingsPanelCode"></ax-code-tabs>
            </section>

            <!-- Custom Content -->
            <section class="knob-doc__section">
              <h2>Custom Content</h2>
              <p>
                Project content into the knob center instead of the default
                value display.
              </p>

              <ax-live-preview variant="bordered">
                <div class="knob-doc__demo-row">
                  <ax-knob
                    [(value)]="customValue"
                    size="xl"
                    [showValue]="false"
                    color="primary"
                  >
                    <mat-icon class="knob-doc__custom-icon">speed</mat-icon>
                  </ax-knob>
                  <ax-knob
                    [(value)]="customValue2"
                    size="xl"
                    [showValue]="false"
                    color="success"
                  >
                    <div class="knob-doc__custom-content">
                      <span class="knob-doc__custom-label">RPM</span>
                      <span class="knob-doc__custom-value">{{
                        customValue2 * 100
                      }}</span>
                    </div>
                  </ax-knob>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="customContentCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="knob-doc__tab-content">
            <section class="knob-doc__section">
              <h2>Properties</h2>
              <div class="knob-doc__api-table">
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
                      <td><code>value</code></td>
                      <td><code>number</code></td>
                      <td><code>0</code></td>
                      <td>Current value (two-way binding)</td>
                    </tr>
                    <tr>
                      <td><code>min</code></td>
                      <td><code>number</code></td>
                      <td><code>0</code></td>
                      <td>Minimum value</td>
                    </tr>
                    <tr>
                      <td><code>max</code></td>
                      <td><code>number</code></td>
                      <td><code>100</code></td>
                      <td>Maximum value</td>
                    </tr>
                    <tr>
                      <td><code>step</code></td>
                      <td><code>number</code></td>
                      <td><code>1</code></td>
                      <td>Step increment</td>
                    </tr>
                    <tr>
                      <td><code>size</code></td>
                      <td><code>'sm' | 'md' | 'lg' | 'xl'</code></td>
                      <td><code>'md'</code></td>
                      <td>Knob size</td>
                    </tr>
                    <tr>
                      <td><code>color</code></td>
                      <td>
                        <code
                          >'primary' | 'accent' | 'success' | 'warning' |
                          'error'</code
                        >
                      </td>
                      <td><code>'primary'</code></td>
                      <td>Progress arc color</td>
                    </tr>
                    <tr>
                      <td><code>showValue</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Show value in center</td>
                    </tr>
                    <tr>
                      <td><code>valueSuffix</code></td>
                      <td><code>string</code></td>
                      <td><code>''</code></td>
                      <td>Value suffix (e.g., '%', 'dB')</td>
                    </tr>
                    <tr>
                      <td><code>disabled</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Disable interaction</td>
                    </tr>
                    <tr>
                      <td><code>readonly</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Read-only mode</td>
                    </tr>
                    <tr>
                      <td><code>startAngle</code></td>
                      <td><code>number</code></td>
                      <td><code>-135</code></td>
                      <td>Starting angle in degrees</td>
                    </tr>
                    <tr>
                      <td><code>arcAngle</code></td>
                      <td><code>number</code></td>
                      <td><code>270</code></td>
                      <td>Arc angle in degrees</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="knob-doc__section">
              <h2>Events</h2>
              <div class="knob-doc__api-table">
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
                      <td><code>valueChange</code></td>
                      <td><code>EventEmitter&lt;number&gt;</code></td>
                      <td>Emits when value changes</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="knob-doc__section">
              <h2>Form Integration</h2>
              <p>
                The knob component implements
                <code>ControlValueAccessor</code> for seamless integration with
                Angular forms.
              </p>
              <ax-code-tabs [tabs]="formCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- Tokens Tab -->
        <mat-tab label="Tokens">
          <div class="knob-doc__tab-content">
            <ax-component-tokens [tokens]="knobTokens"></ax-component-tokens>
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="knob-doc__tab-content">
            <section class="knob-doc__section">
              <h2>Do's and Don'ts</h2>
              <div class="knob-doc__guidelines">
                <div class="knob-doc__guideline knob-doc__guideline--do">
                  <h4><mat-icon>check_circle</mat-icon> Do</h4>
                  <ul>
                    <li>Use for circular/radial value selection</li>
                    <li>Show the current value in the center</li>
                    <li>Use appropriate size for the container</li>
                    <li>Apply semantic colors for context</li>
                  </ul>
                </div>
                <div class="knob-doc__guideline knob-doc__guideline--dont">
                  <h4><mat-icon>cancel</mat-icon> Don't</h4>
                  <ul>
                    <li>Use for precise numeric input (use number input)</li>
                    <li>Use small knobs for touch interfaces</li>
                    <li>Disable without providing a reason</li>
                    <li>Use too many knobs in close proximity</li>
                  </ul>
                </div>
              </div>
            </section>

            <section class="knob-doc__section">
              <h2>Accessibility</h2>
              <ul class="knob-doc__a11y-list">
                <li>
                  <mat-icon>mouse</mat-icon>
                  <strong>Mouse:</strong> Click and drag to change value
                </li>
                <li>
                  <mat-icon>touch_app</mat-icon>
                  <strong>Touch:</strong> Touch and drag supported for mobile
                  devices
                </li>
                <li>
                  <mat-icon>visibility</mat-icon>
                  <strong>Visual:</strong> Clear progress arc shows current
                  position
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
      .knob-doc {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--ax-spacing-xl, 1.5rem);
      }

      .knob-doc__tabs {
        margin-top: var(--ax-spacing-xl, 1.5rem);
      }

      .knob-doc__tab-content {
        padding: var(--ax-spacing-xl, 1.5rem) 0;
      }

      .knob-doc__section {
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

      .knob-doc__demo-row {
        display: flex;
        align-items: center;
        gap: var(--ax-spacing-xl);
        flex-wrap: wrap;

        &--align-end {
          align-items: flex-end;
        }
      }

      .knob-doc__value-display {
        font-size: var(--ax-text-lg);
        color: var(--ax-text-secondary);

        strong {
          color: var(--ax-text-heading);
        }
      }

      .knob-doc__size-demo,
      .knob-doc__color-demo,
      .knob-doc__suffix-demo,
      .knob-doc__step-demo,
      .knob-doc__state-demo {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--ax-spacing-sm);

        span {
          font-size: var(--ax-text-xs);
          color: var(--ax-text-secondary);
        }
      }

      .knob-doc__mixer {
        display: flex;
        gap: var(--ax-spacing-lg);
        padding: var(--ax-spacing-lg);
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-lg);
      }

      .knob-doc__channel {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--ax-spacing-sm);
        padding: var(--ax-spacing-md);
        background: var(--ax-background-default);
        border-radius: var(--ax-radius-md);

        &--master {
          margin-left: var(--ax-spacing-md);
          padding-left: var(--ax-spacing-lg);
          border-left: 2px solid var(--ax-border-default);
        }
      }

      .knob-doc__channel-label {
        font-size: var(--ax-text-xs);
        font-weight: 600;
        color: var(--ax-text-subtle);
        text-transform: uppercase;
      }

      .knob-doc__channel-name {
        font-size: var(--ax-text-sm);
        color: var(--ax-text-secondary);
      }

      .knob-doc__gauges {
        display: flex;
        gap: var(--ax-spacing-xl);
        flex-wrap: wrap;
      }

      .knob-doc__gauge {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--ax-spacing-sm);
        padding: var(--ax-spacing-lg);
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-lg);
        min-width: 150px;
      }

      .knob-doc__gauge-info {
        text-align: center;

        strong {
          display: block;
          font-size: var(--ax-text-sm);
        }

        span {
          font-size: var(--ax-text-lg);
          font-weight: 600;
          color: var(--ax-text-heading);
        }
      }

      .knob-doc__settings {
        display: flex;
        flex-direction: column;
        gap: var(--ax-spacing-md);
        max-width: 400px;
      }

      .knob-doc__setting {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--ax-spacing-md);
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-lg);
      }

      .knob-doc__setting-info {
        display: flex;
        align-items: center;
        gap: var(--ax-spacing-md);

        mat-icon {
          color: var(--ax-text-subtle);
        }

        strong {
          display: block;
          font-size: var(--ax-text-sm);
        }

        span {
          font-size: var(--ax-text-xs);
          color: var(--ax-text-secondary);
        }
      }

      .knob-doc__custom-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
        color: var(--ax-primary);
      }

      .knob-doc__custom-content {
        text-align: center;
      }

      .knob-doc__custom-label {
        display: block;
        font-size: var(--ax-text-xs);
        color: var(--ax-text-subtle);
      }

      .knob-doc__custom-value {
        display: block;
        font-size: var(--ax-text-lg);
        font-weight: 600;
        color: var(--ax-text-heading);
      }

      .knob-doc__api-table {
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

      .knob-doc__guidelines {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--ax-spacing-lg);
      }

      .knob-doc__guideline {
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

      .knob-doc__a11y-list {
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
export class KnobDocComponent {
  basicValue = 50;
  smValue = 30;
  mdValue = 50;
  lgValue = 70;
  xlValue = 85;
  percentValue = 75;
  dbValue = -12;
  tempValue = 22;
  hiddenValue = 60;
  step1Value = 33;
  step5Value = 35;
  step10Value = 40;

  // Mixer example
  channel1Vol = -6;
  channel2Vol = -12;
  channel3Vol = -18;
  masterVol = -3;

  // Gauges example
  cpuUsage = 67;
  memoryUsage = 82;
  diskUsage = 45;

  // Settings example
  settingsVolume = 75;
  settingsBrightness = 80;
  settingsContrast = 50;

  // Custom content
  customValue = 50;
  customValue2 = 35;

  basicUsageCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-knob
  [(value)]="volume"
  [min]="0"
  [max]="100">
</ax-knob>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { AxKnobComponent } from '@aegisx/ui';

@Component({
  imports: [AxKnobComponent],
})
export class MyComponent {
  volume = 50;
}`,
    },
  ];

  sizesCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-knob [(value)]="value" size="sm"></ax-knob>
<ax-knob [(value)]="value" size="md"></ax-knob>
<ax-knob [(value)]="value" size="lg"></ax-knob>
<ax-knob [(value)]="value" size="xl"></ax-knob>`,
    },
  ];

  colorsCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-knob [value]="75" color="primary"></ax-knob>
<ax-knob [value]="75" color="accent"></ax-knob>
<ax-knob [value]="75" color="success"></ax-knob>
<ax-knob [value]="75" color="warning"></ax-knob>
<ax-knob [value]="75" color="error"></ax-knob>`,
    },
  ];

  suffixCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Percentage -->
<ax-knob [(value)]="percent" valueSuffix="%"></ax-knob>

<!-- Decibels with negative range -->
<ax-knob [(value)]="db" [min]="-60" [max]="0" valueSuffix="dB"></ax-knob>

<!-- Temperature -->
<ax-knob [(value)]="temp" [min]="0" [max]="40" valueSuffix="°C"></ax-knob>

<!-- Hidden value -->
<ax-knob [(value)]="value" [showValue]="false"></ax-knob>`,
    },
  ];

  stepCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-knob [(value)]="value" [step]="1"></ax-knob>
<ax-knob [(value)]="value" [step]="5"></ax-knob>
<ax-knob [(value)]="value" [step]="10"></ax-knob>`,
    },
  ];

  statesCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Disabled -->
<ax-knob [value]="65" [disabled]="true"></ax-knob>

<!-- Read-only (for display gauges) -->
<ax-knob [value]="85" [readonly]="true"></ax-knob>`,
    },
  ];

  formCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Template-driven form -->
<ax-knob [(ngModel)]="volume" name="volume"></ax-knob>

<!-- Reactive form -->
<ax-knob formControlName="brightness"></ax-knob>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule, AxKnobComponent],
})
export class MyComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      brightness: [75],
    });
  }
}`,
    },
  ];

  // Examples tab code
  audioMixerCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<div class="mixer">
  <div class="channel">
    <span class="channel-label">CH 1</span>
    <ax-knob
      [(value)]="channel1Vol"
      [min]="-60"
      [max]="12"
      size="lg"
      color="success"
      valueSuffix="dB">
    </ax-knob>
    <span class="channel-name">Drums</span>
  </div>

  <div class="channel">
    <span class="channel-label">CH 2</span>
    <ax-knob
      [(value)]="channel2Vol"
      [min]="-60"
      [max]="12"
      size="lg"
      color="primary"
      valueSuffix="dB">
    </ax-knob>
    <span class="channel-name">Bass</span>
  </div>

  <div class="channel master">
    <span class="channel-label">MASTER</span>
    <ax-knob
      [(value)]="masterVol"
      [min]="-60"
      [max]="0"
      size="xl"
      color="error"
      valueSuffix="dB">
    </ax-knob>
    <span class="channel-name">Output</span>
  </div>
</div>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxKnobComponent } from '@aegisx/ui';

@Component({
  imports: [AxKnobComponent],
})
export class AudioMixerComponent {
  channel1Vol = -6;
  channel2Vol = -12;
  channel3Vol = -18;
  masterVol = -3;
}`,
    },
  ];

  dashboardGaugesCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<div class="gauges">
  <div class="gauge">
    <ax-knob
      [value]="cpuUsage"
      [readonly]="true"
      size="lg"
      color="primary">
    </ax-knob>
    <div class="gauge-info">
      <strong>CPU Usage</strong>
      <span>{{ cpuUsage }}%</span>
    </div>
  </div>

  <div class="gauge">
    <ax-knob
      [value]="memoryUsage"
      [readonly]="true"
      size="lg"
      color="warning">
    </ax-knob>
    <div class="gauge-info">
      <strong>Memory</strong>
      <span>{{ memoryUsage }}%</span>
    </div>
  </div>

  <div class="gauge">
    <ax-knob
      [value]="diskUsage"
      [readonly]="true"
      size="lg"
      color="success">
    </ax-knob>
    <div class="gauge-info">
      <strong>Disk</strong>
      <span>{{ diskUsage }}%</span>
    </div>
  </div>
</div>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component, OnInit, OnDestroy } from '@angular/core';
import { AxKnobComponent } from '@aegisx/ui';

@Component({
  imports: [AxKnobComponent],
})
export class DashboardGaugesComponent implements OnInit, OnDestroy {
  cpuUsage = 67;
  memoryUsage = 82;
  diskUsage = 45;

  private interval: any;

  ngOnInit() {
    // Simulate real-time updates
    this.interval = setInterval(() => {
      this.cpuUsage = Math.floor(Math.random() * 100);
      this.memoryUsage = Math.floor(Math.random() * 100);
    }, 2000);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}`,
    },
  ];

  settingsPanelCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<div class="settings">
  <div class="setting">
    <div class="setting-info">
      <mat-icon>volume_up</mat-icon>
      <div>
        <strong>Volume</strong>
        <span>System volume level</span>
      </div>
    </div>
    <ax-knob [(value)]="volume" size="md" valueSuffix="%"></ax-knob>
  </div>

  <div class="setting">
    <div class="setting-info">
      <mat-icon>brightness_6</mat-icon>
      <div>
        <strong>Brightness</strong>
        <span>Display brightness</span>
      </div>
    </div>
    <ax-knob [(value)]="brightness" size="md" valueSuffix="%"></ax-knob>
  </div>

  <div class="setting">
    <div class="setting-info">
      <mat-icon>contrast</mat-icon>
      <div>
        <strong>Contrast</strong>
        <span>Display contrast</span>
      </div>
    </div>
    <ax-knob [(value)]="contrast" size="md" valueSuffix="%"></ax-knob>
  </div>
</div>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AxKnobComponent } from '@aegisx/ui';

@Component({
  imports: [MatIconModule, AxKnobComponent],
})
export class SettingsPanelComponent {
  volume = 75;
  brightness = 80;
  contrast = 50;

  onSettingChange(setting: string, value: number) {
    console.log(\`\${setting} changed to \${value}\`);
    // Apply setting changes
  }
}`,
    },
  ];

  customContentCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Icon content -->
<ax-knob [(value)]="speed" size="xl" [showValue]="false" color="primary">
  <mat-icon class="custom-icon">speed</mat-icon>
</ax-knob>

<!-- Custom RPM display -->
<ax-knob [(value)]="rpmPercent" size="xl" [showValue]="false" color="success">
  <div class="custom-content">
    <span class="label">RPM</span>
    <span class="value">{{ rpmPercent * 100 }}</span>
  </div>
</ax-knob>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AxKnobComponent } from '@aegisx/ui';

@Component({
  imports: [MatIconModule, AxKnobComponent],
})
export class CustomKnobComponent {
  speed = 50;
  rpmPercent = 35;

  get displayRpm(): number {
    return this.rpmPercent * 100;
  }
}`,
    },
  ];

  knobTokens: ComponentToken[] = [
    {
      category: 'Colors',
      cssVar: '--ax-background-subtle',
      usage: 'Track background color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-primary',
      usage: 'Primary progress color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-accent',
      usage: 'Accent progress color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-success',
      usage: 'Success progress color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-warning',
      usage: 'Warning progress color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-error',
      usage: 'Error progress color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-default',
      usage: 'Value text color',
    },
    {
      category: 'Typography',
      cssVar: '--ax-text-sm',
      usage: 'Small size value font',
    },
    {
      category: 'Typography',
      cssVar: '--ax-text-lg',
      usage: 'Large size value font',
    },
  ];
}
