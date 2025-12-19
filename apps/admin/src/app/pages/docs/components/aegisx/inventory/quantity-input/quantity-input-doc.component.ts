import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AxQuantityInputComponent } from '@aegisx/ui';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../../../components/docs';
import { ComponentToken } from '../../../../../../types/docs.types';

@Component({
  selector: 'ax-quantity-input-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    AxQuantityInputComponent,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="quantity-input-doc">
      <ax-doc-header
        title="Quantity Input"
        icon="dialpad"
        description="Numeric input component with unit conversion, validation, stepper controls, and preset multipliers for efficient quantity entry."
        [breadcrumbs]="[
          {
            label: 'Inventory',
            link: '/docs/components/aegisx/inventory/quantity-input',
          },
          { label: 'Quantity Input' },
        ]"
        status="stable"
        version="1.0.0"
        importStatement="import { AxQuantityInputComponent } from '@aegisx/ui';"
      ></ax-doc-header>

      <mat-tab-group class="quantity-input-doc__tabs" animationDuration="150ms">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="quantity-input-doc__tab-content">
            <section class="quantity-input-doc__section">
              <h2>Basic Usage</h2>
              <p>
                The Quantity Input component provides a sophisticated numeric
                input with unit conversion, increment/decrement buttons, and
                validation. Perfect for inventory management, order quantities,
                and stock transfers.
              </p>

              <ax-live-preview variant="bordered">
                <div class="quantity-input-doc__demo">
                  <ax-quantity-input
                    [(value)]="basicQuantity"
                    [baseUnit]="'pieces'"
                    [availableUnits]="basicUnits"
                    [min]="0"
                    [max]="1000"
                    [step]="1"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="basicUsageCode"></ax-code-tabs>
            </section>

            <section class="quantity-input-doc__section">
              <h2>Unit Conversion</h2>
              <p>
                Convert between different units (e.g., boxes to pieces) with
                automatic calculation and display.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-lg)"
                align="stretch"
              >
                <div class="quantity-input-doc__demo">
                  <h4>Multi-Unit Input (Pieces/Boxes/Cartons)</h4>
                  <ax-quantity-input
                    [(value)]="conversionQuantity"
                    [baseUnit]="'pieces'"
                    [availableUnits]="multiUnits"
                    [min]="0"
                    [max]="10000"
                    [showStepper]="true"
                  />
                  <p class="conversion-hint">
                    Base value: {{ conversionQuantity }} pieces
                  </p>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="unitConversionCode"></ax-code-tabs>
            </section>

            <section class="quantity-input-doc__section">
              <h2>Validation</h2>
              <p>
                Built-in validation for min/max values, decimal places, and
                integer requirements.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-lg)"
                align="stretch"
              >
                <div class="quantity-input-doc__demo">
                  <h4>Min/Max Validation (0-100)</h4>
                  <ax-quantity-input
                    [(value)]="validationQuantity"
                    [baseUnit]="'units'"
                    [availableUnits]="singleUnit"
                    [min]="0"
                    [max]="100"
                    (validation)="handleValidation($event)"
                  />
                </div>

                <div class="quantity-input-doc__demo">
                  <h4>Decimal Places Validation (max 2 decimals)</h4>
                  <ax-quantity-input
                    [(value)]="decimalQuantity"
                    [baseUnit]="'kg'"
                    [availableUnits]="decimalUnit"
                    [min]="0"
                    [max]="1000"
                    [decimalPlaces]="2"
                  />
                </div>

                <div class="quantity-input-doc__demo">
                  <h4>Integer Only Validation</h4>
                  <ax-quantity-input
                    [(value)]="integerQuantity"
                    [baseUnit]="'boxes'"
                    [availableUnits]="integerUnit"
                    [min]="0"
                    [max]="500"
                    [decimalPlaces]="0"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="validationCode"></ax-code-tabs>
            </section>

            <section class="quantity-input-doc__section">
              <h2>Stepper Controls</h2>
              <p>
                Increment/decrement buttons with customizable step size for
                quick quantity adjustments.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-lg)"
                align="stretch"
              >
                <div class="quantity-input-doc__demo">
                  <h4>Step Size: 1</h4>
                  <ax-quantity-input
                    [(value)]="stepQuantity1"
                    [baseUnit]="'pieces'"
                    [availableUnits]="basicUnits"
                    [min]="0"
                    [max]="100"
                    [step]="1"
                    [showStepper]="true"
                  />
                </div>

                <div class="quantity-input-doc__demo">
                  <h4>Step Size: 10</h4>
                  <ax-quantity-input
                    [(value)]="stepQuantity10"
                    [baseUnit]="'pieces'"
                    [availableUnits]="basicUnits"
                    [min]="0"
                    [max]="1000"
                    [step]="10"
                    [showStepper]="true"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="stepperCode"></ax-code-tabs>
            </section>

            <section class="quantity-input-doc__section">
              <h2>Preset Multipliers</h2>
              <p>
                Quick multiplication buttons (×10, ×100) for rapid quantity
                entry in bulk operations.
              </p>

              <ax-live-preview variant="bordered">
                <div class="quantity-input-doc__demo">
                  <ax-quantity-input
                    [(value)]="presetQuantity"
                    [baseUnit]="'pieces'"
                    [availableUnits]="basicUnits"
                    [min]="0"
                    [max]="100000"
                    [showPresets]="true"
                    [showStepper]="true"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="presetsCode"></ax-code-tabs>
            </section>

            <section class="quantity-input-doc__section">
              <h2>Disabled State</h2>
              <p>
                Disable the input for read-only display or locked quantities.
              </p>

              <ax-live-preview variant="bordered">
                <div class="quantity-input-doc__demo">
                  <ax-quantity-input
                    [(value)]="disabledQuantity"
                    [baseUnit]="'pieces'"
                    [availableUnits]="basicUnits"
                    [disabled]="true"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="disabledCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="quantity-input-doc__tab-content">
            <section class="quantity-input-doc__section">
              <h2>Stock Transfer Form</h2>
              <p>
                Use quantity inputs in a stock transfer workflow with different
                units and validation.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-md)"
                align="stretch"
              >
                <div class="quantity-input-doc__transfer-card">
                  <div class="transfer-info">
                    <h4>Medical Gloves - Size M</h4>
                    <span class="transfer-sku">SKU: GLV-001-M</span>
                    <span class="transfer-available"
                      >Available: 500 pieces</span
                    >
                  </div>
                  <ax-quantity-input
                    [(value)]="transferQuantity1"
                    [baseUnit]="'pieces'"
                    [availableUnits]="transferUnits1"
                    [min]="0"
                    [max]="500"
                    [showStepper]="true"
                  />
                </div>

                <div class="quantity-input-doc__transfer-card">
                  <div class="transfer-info">
                    <h4>Hand Sanitizer 500ml</h4>
                    <span class="transfer-sku">SKU: SAN-003</span>
                    <span class="transfer-available">Available: 48.5 kg</span>
                  </div>
                  <ax-quantity-input
                    [(value)]="transferQuantity2"
                    [baseUnit]="'kg'"
                    [availableUnits]="transferUnits2"
                    [min]="0"
                    [max]="48.5"
                    [decimalPlaces]="2"
                    [showStepper]="true"
                  />
                </div>
              </ax-live-preview>
            </section>

            <section class="quantity-input-doc__section">
              <h2>Order Quantity Entry</h2>
              <p>
                Bulk order entry with preset multipliers for efficient data
                input.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-md)"
                align="stretch"
              >
                <div class="quantity-input-doc__order-card">
                  <div class="order-info">
                    <h4>Surgical Masks (Box of 50)</h4>
                    <span class="order-price">฿350 per box</span>
                  </div>
                  <ax-quantity-input
                    [(value)]="orderQuantity1"
                    [baseUnit]="'pieces'"
                    [availableUnits]="orderUnits"
                    [min]="0"
                    [max]="100000"
                    [showPresets]="true"
                    [showStepper]="true"
                  />
                  <div class="order-total">
                    Total: ฿{{ calculateTotal(orderQuantity1, 50, 350) }}
                  </div>
                </div>
              </ax-live-preview>
            </section>

            <section class="quantity-input-doc__section">
              <h2>Keyboard Shortcuts</h2>
              <p>
                The component supports keyboard shortcuts for efficient data
                entry:
              </p>

              <div class="quantity-input-doc__keyboard-shortcuts">
                <div class="shortcut-item">
                  <kbd>↑</kbd>
                  <span>Increment by step</span>
                </div>
                <div class="shortcut-item">
                  <kbd>↓</kbd>
                  <span>Decrement by step</span>
                </div>
                <div class="shortcut-item">
                  <kbd>Page Up</kbd>
                  <span>Increment by step × 10</span>
                </div>
                <div class="shortcut-item">
                  <kbd>Page Down</kbd>
                  <span>Decrement by step × 10</span>
                </div>
                <div class="shortcut-item">
                  <kbd>Home</kbd>
                  <span>Set to minimum value</span>
                </div>
                <div class="shortcut-item">
                  <kbd>End</kbd>
                  <span>Set to maximum value</span>
                </div>
              </div>

              <ax-live-preview variant="bordered">
                <div class="quantity-input-doc__demo">
                  <h4>Try keyboard shortcuts (focus and use arrow keys)</h4>
                  <ax-quantity-input
                    [(value)]="keyboardQuantity"
                    [baseUnit]="'units'"
                    [availableUnits]="singleUnit"
                    [min]="0"
                    [max]="100"
                    [step]="5"
                    [showStepper]="true"
                  />
                </div>
              </ax-live-preview>
            </section>
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="quantity-input-doc__tab-content">
            <section class="quantity-input-doc__section">
              <h2>Input Properties</h2>
              <div class="quantity-input-doc__api-table">
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
                      <td><em>Required</em></td>
                      <td>Current value in base unit (two-way binding)</td>
                    </tr>
                    <tr>
                      <td><code>baseUnit</code></td>
                      <td><code>string</code></td>
                      <td><em>Required</em></td>
                      <td>Base unit code (e.g., 'pieces', 'kg')</td>
                    </tr>
                    <tr>
                      <td><code>availableUnits</code></td>
                      <td><code>QuantityUnitConfig[]</code></td>
                      <td><em>Required</em></td>
                      <td>Array of unit configurations for conversion</td>
                    </tr>
                    <tr>
                      <td><code>min</code></td>
                      <td><code>number</code></td>
                      <td><code>0</code></td>
                      <td>Minimum allowed value (in base unit)</td>
                    </tr>
                    <tr>
                      <td><code>max</code></td>
                      <td><code>number</code></td>
                      <td><code>Infinity</code></td>
                      <td>Maximum allowed value (in base unit)</td>
                    </tr>
                    <tr>
                      <td><code>step</code></td>
                      <td><code>number</code></td>
                      <td><code>1</code></td>
                      <td>Step size for increment/decrement</td>
                    </tr>
                    <tr>
                      <td><code>showStepper</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Show increment/decrement buttons</td>
                    </tr>
                    <tr>
                      <td><code>showPresets</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Show preset multiplier buttons (×10, ×100)</td>
                    </tr>
                    <tr>
                      <td><code>decimalPlaces</code></td>
                      <td><code>number</code></td>
                      <td><code>0</code></td>
                      <td>Maximum decimal places allowed</td>
                    </tr>
                    <tr>
                      <td><code>disabled</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Disable the input</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="quantity-input-doc__section">
              <h2>Output Events</h2>
              <div class="quantity-input-doc__api-table">
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
                      <td><code>number</code></td>
                      <td>Emitted when value changes (in base unit)</td>
                    </tr>
                    <tr>
                      <td><code>unitChange</code></td>
                      <td><code>string</code></td>
                      <td>Emitted when selected unit changes</td>
                    </tr>
                    <tr>
                      <td><code>validation</code></td>
                      <td><code>ValidationState</code></td>
                      <td>Emitted when validation state changes</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="quantity-input-doc__section">
              <h2>Type Definitions</h2>

              <h3>QuantityUnitConfig</h3>
              <pre><code>interface QuantityUnitConfig &#123;
  code: string;              // Unit code (e.g., 'pieces', 'box')
  label: string;             // Display label
  conversionRate: number;    // Conversion to base unit (e.g., 12 pieces per box)
  decimalPlaces: number;     // Allowed decimal places for this unit
  symbol?: string;           // Optional unit symbol
&#125;</code></pre>

              <h3>ValidationState</h3>
              <pre><code>interface ValidationState &#123;
  valid: boolean;              // Whether value is valid
  errors: ValidationError[];   // Array of validation errors
&#125;</code></pre>

              <h3>ValidationError</h3>
              <pre><code>interface ValidationError &#123;
  type: 'min' | 'max' | 'decimal' | 'integer';
  message: string;             // Error message
&#125;</code></pre>

              <h3>Unit Conversion Example</h3>
              <div class="quantity-input-doc__conversion-example">
                <div class="conversion-step">
                  <strong>Base Unit:</strong> pieces
                </div>
                <div class="conversion-step">
                  <strong>Unit Config:</strong> Box (12 pieces per box)
                </div>
                <div class="conversion-step">
                  <strong>Display:</strong> 5 boxes
                </div>
                <div class="conversion-step">
                  <strong>Stored Value:</strong> 60 pieces (5 × 12)
                </div>
              </div>
            </section>

            <section class="quantity-input-doc__section">
              <h2>Keyboard Shortcuts Reference</h2>
              <div class="quantity-input-doc__api-table">
                <table>
                  <thead>
                    <tr>
                      <th>Key</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>↑ (Arrow Up)</code></td>
                      <td>Increment by step value</td>
                    </tr>
                    <tr>
                      <td><code>↓ (Arrow Down)</code></td>
                      <td>Decrement by step value</td>
                    </tr>
                    <tr>
                      <td><code>Page Up</code></td>
                      <td>Increment by step × 10</td>
                    </tr>
                    <tr>
                      <td><code>Page Down</code></td>
                      <td>Decrement by step × 10</td>
                    </tr>
                    <tr>
                      <td><code>Home</code></td>
                      <td>Set to minimum value</td>
                    </tr>
                    <tr>
                      <td><code>End</code></td>
                      <td>Set to maximum value</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </mat-tab>

        <!-- Tokens Tab -->
        <mat-tab label="Tokens">
          <div class="quantity-input-doc__tab-content">
            <ax-component-tokens
              [tokens]="quantityInputTokens"
            ></ax-component-tokens>
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="quantity-input-doc__tab-content">
            <section class="quantity-input-doc__section">
              <h2>Do's and Don'ts</h2>

              <div class="quantity-input-doc__guidelines">
                <div
                  class="quantity-input-doc__guideline quantity-input-doc__guideline--do"
                >
                  <h4><mat-icon>check_circle</mat-icon> Do</h4>
                  <ul>
                    <li>Use appropriate unit conversions for the context</li>
                    <li>
                      Set realistic min/max bounds based on business rules
                    </li>
                    <li>Enable preset multipliers for bulk entry scenarios</li>
                    <li>
                      Validate decimal places based on unit requirements (e.g.,
                      whole numbers for boxes)
                    </li>
                    <li>
                      Provide clear conversion hints for multi-unit inputs
                    </li>
                    <li>Use consistent step sizes within the same form</li>
                    <li>
                      Handle validation events to show user-friendly errors
                    </li>
                  </ul>
                </div>

                <div
                  class="quantity-input-doc__guideline quantity-input-doc__guideline--dont"
                >
                  <h4><mat-icon>cancel</mat-icon> Don't</h4>
                  <ul>
                    <li>Set min value higher than max value</li>
                    <li>Use excessive decimal places for whole-number units</li>
                    <li>
                      Mix incompatible units in the same input (e.g., kg and
                      pieces)
                    </li>
                    <li>
                      Show preset multipliers when max value is too low (×100 on
                      max 50)
                    </li>
                    <li>Ignore validation errors in production forms</li>
                    <li>Use overly large step sizes for precise quantities</li>
                    <li>
                      Disable keyboard shortcuts - they're essential for power
                      users
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section class="quantity-input-doc__section">
              <h2>Accessibility</h2>
              <ul class="quantity-input-doc__a11y-list">
                <li>Input includes proper ARIA labels and descriptions</li>
                <li>
                  Stepper buttons are keyboard accessible with proper focus
                  management
                </li>
                <li>Validation errors are announced to screen readers</li>
                <li>
                  Keyboard shortcuts follow standard numeric input conventions
                </li>
                <li>Unit selector dropdown is keyboard navigable</li>
                <li>Focus states meet WCAG 2.1 AA contrast requirements</li>
                <li>
                  Error messages are associated with input via aria-describedby
                </li>
              </ul>
            </section>

            <section class="quantity-input-doc__section">
              <h2>Best Practices</h2>
              <ul class="quantity-input-doc__best-practices">
                <li>
                  <strong>Unit Selection:</strong> Default to the most commonly
                  used unit for the context (e.g., 'boxes' for retail, 'pieces'
                  for warehouse)
                </li>
                <li>
                  <strong>Validation Timing:</strong> Show validation errors
                  after the user finishes input (onBlur), not on every keystroke
                </li>
                <li>
                  <strong>Step Size:</strong> Set step to match common order
                  increments (e.g., step=6 for items sold in 6-packs)
                </li>
                <li>
                  <strong>Preset Multipliers:</strong> Enable only when max
                  value supports it (max should be at least 100× the typical
                  value)
                </li>
                <li>
                  <strong>Decimal Places:</strong> Match decimal precision to
                  unit type (0 for countable items, 2-3 for weights/volumes)
                </li>
                <li>
                  <strong>Conversion Hints:</strong> Always show the base unit
                  value for transparency when using unit conversion
                </li>
                <li>
                  <strong>Form Integration:</strong> Use with Reactive Forms via
                  ControlValueAccessor for seamless validation
                </li>
              </ul>
            </section>

            <section class="quantity-input-doc__section">
              <h2>Common Use Cases</h2>
              <div class="quantity-input-doc__use-cases">
                <div class="use-case">
                  <h4>Stock Transfer</h4>
                  <p>
                    Enable unit conversion with available stock validation. Show
                    conversion hints to prevent transfer errors.
                  </p>
                </div>
                <div class="use-case">
                  <h4>Purchase Orders</h4>
                  <p>
                    Use preset multipliers for bulk ordering. Set appropriate
                    step sizes based on packaging (e.g., step=12 for dozen
                    packs).
                  </p>
                </div>
                <div class="use-case">
                  <h4>Inventory Adjustment</h4>
                  <p>
                    Allow both positive and negative values with clear
                    validation. Use decimal support for weight-based items.
                  </p>
                </div>
                <div class="use-case">
                  <h4>Recipe Scaling</h4>
                  <p>
                    Support fractional quantities with appropriate decimal
                    places. Enable unit conversion between volume and weight
                    units.
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
      .quantity-input-doc {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--ax-spacing-xl, 1.5rem);
      }

      .quantity-input-doc__tabs {
        margin-top: var(--ax-spacing-xl, 1.5rem);
      }

      .quantity-input-doc__tab-content {
        padding: var(--ax-spacing-xl, 1.5rem) 0;
      }

      .quantity-input-doc__section {
        margin-bottom: var(--ax-spacing-3xl, 3rem);

        h2 {
          font-size: var(--ax-text-xl, 1.25rem);
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0 0 var(--ax-spacing-sm, 0.5rem) 0;
        }

        h3 {
          font-size: var(--ax-text-lg, 1.125rem);
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: var(--ax-spacing-lg, 1rem) 0 var(--ax-spacing-sm, 0.5rem) 0;
        }

        > p {
          font-size: var(--ax-text-sm, 0.875rem);
          color: var(--ax-text-secondary);
          margin: 0 0 var(--ax-spacing-lg, 1rem) 0;
          max-width: 700px;
        }
      }

      .quantity-input-doc__demo {
        width: 100%;

        h4 {
          font-size: var(--ax-text-sm, 0.875rem);
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0 0 var(--ax-spacing-sm, 0.5rem) 0;
        }
      }

      /* Conversion Hint */
      .conversion-hint {
        margin-top: var(--ax-spacing-sm, 0.5rem);
        font-size: var(--ax-text-xs, 0.75rem);
        color: var(--ax-text-secondary);
        font-style: italic;
      }

      /* Transfer Card Example */
      .quantity-input-doc__transfer-card {
        padding: var(--ax-spacing-md, 0.75rem);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-md, 0.5rem);
        background: var(--ax-background-default);

        .transfer-info {
          margin-bottom: var(--ax-spacing-sm, 0.5rem);

          h4 {
            font-size: var(--ax-text-base, 1rem);
            font-weight: 600;
            color: var(--ax-text-heading);
            margin: 0 0 var(--ax-spacing-xs, 0.25rem) 0;
          }

          .transfer-sku,
          .transfer-available {
            display: block;
            font-size: var(--ax-text-xs, 0.75rem);
            color: var(--ax-text-secondary);
          }

          .transfer-available {
            color: var(--ax-success-emphasis);
            font-weight: 500;
          }
        }
      }

      /* Order Card Example */
      .quantity-input-doc__order-card {
        padding: var(--ax-spacing-md, 0.75rem);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-md, 0.5rem);
        background: var(--ax-background-default);

        .order-info {
          margin-bottom: var(--ax-spacing-sm, 0.5rem);

          h4 {
            font-size: var(--ax-text-base, 1rem);
            font-weight: 600;
            color: var(--ax-text-heading);
            margin: 0 0 var(--ax-spacing-xs, 0.25rem) 0;
          }

          .order-price {
            font-size: var(--ax-text-xs, 0.75rem);
            color: var(--ax-text-secondary);
          }
        }

        .order-total {
          margin-top: var(--ax-spacing-sm, 0.5rem);
          font-size: var(--ax-text-sm, 0.875rem);
          font-weight: 600;
          color: var(--ax-primary-emphasis);
        }
      }

      /* Keyboard Shortcuts */
      .quantity-input-doc__keyboard-shortcuts {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--ax-spacing-md, 0.75rem);
        margin: var(--ax-spacing-lg, 1rem) 0;

        .shortcut-item {
          display: flex;
          align-items: center;
          gap: var(--ax-spacing-sm, 0.5rem);
          padding: var(--ax-spacing-sm, 0.5rem);
          background: var(--ax-background-subtle);
          border-radius: var(--ax-radius-md, 0.5rem);

          kbd {
            display: inline-block;
            padding: 2px 8px;
            font-family: var(--ax-font-mono);
            font-size: var(--ax-text-xs, 0.75rem);
            background: var(--ax-background-default);
            border: 1px solid var(--ax-border-default);
            border-radius: var(--ax-radius-sm, 0.25rem);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            white-space: nowrap;
          }

          span {
            font-size: var(--ax-text-sm, 0.875rem);
            color: var(--ax-text-secondary);
          }
        }
      }

      /* API Table */
      .quantity-input-doc__api-table {
        overflow-x: auto;
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-lg, 0.75rem);
        margin-top: var(--ax-spacing-md, 0.75rem);

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

        td em {
          font-style: italic;
          color: var(--ax-text-secondary);
        }

        tr:last-child td {
          border-bottom: none;
        }
      }

      /* Conversion Example */
      .quantity-input-doc__conversion-example {
        background: var(--ax-background-subtle);
        padding: var(--ax-spacing-md, 0.75rem);
        border-radius: var(--ax-radius-md, 0.5rem);
        margin-top: var(--ax-spacing-md, 0.75rem);

        .conversion-step {
          padding: var(--ax-spacing-xs, 0.25rem) 0;
          font-size: var(--ax-text-sm, 0.875rem);
          color: var(--ax-text-primary);

          strong {
            font-weight: 600;
            color: var(--ax-text-heading);
          }
        }
      }

      /* Code Example */
      pre {
        background: var(--ax-background-subtle);
        padding: var(--ax-spacing-md, 0.75rem);
        border-radius: var(--ax-radius-md, 0.5rem);
        overflow-x: auto;
        margin: var(--ax-spacing-md, 0.75rem) 0;

        code {
          font-family: var(--ax-font-mono);
          font-size: var(--ax-text-sm, 0.875rem);
          color: var(--ax-text-primary);
          line-height: 1.6;
        }
      }

      /* Guidelines */
      .quantity-input-doc__guidelines {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--ax-spacing-lg, 1rem);
      }

      .quantity-input-doc__guideline {
        padding: var(--ax-spacing-lg, 1rem);
        border-radius: var(--ax-radius-lg, 0.75rem);

        h4 {
          display: flex;
          align-items: center;
          gap: var(--ax-spacing-xs, 0.25rem);
          font-size: var(--ax-text-base, 1rem);
          font-weight: 600;
          margin: 0 0 var(--ax-spacing-sm, 0.5rem) 0;

          mat-icon {
            font-size: 20px;
            width: 20px;
            height: 20px;
          }
        }

        ul {
          margin: 0;
          padding-left: var(--ax-spacing-lg, 1rem);

          li {
            font-size: var(--ax-text-sm, 0.875rem);
            margin-bottom: var(--ax-spacing-xs, 0.25rem);
          }
        }
      }

      .quantity-input-doc__guideline--do {
        background: var(--ax-success-faint);

        h4 {
          color: var(--ax-success-emphasis);
        }
        li {
          color: var(--ax-success-emphasis);
        }
      }

      .quantity-input-doc__guideline--dont {
        background: var(--ax-error-faint);

        h4 {
          color: var(--ax-error-emphasis);
        }
        li {
          color: var(--ax-error-emphasis);
        }
      }

      .quantity-input-doc__a11y-list,
      .quantity-input-doc__best-practices {
        margin: 0;
        padding-left: var(--ax-spacing-lg, 1rem);

        li {
          font-size: var(--ax-text-sm, 0.875rem);
          color: var(--ax-text-secondary);
          margin-bottom: var(--ax-spacing-sm, 0.5rem);
        }
      }

      /* Use Cases */
      .quantity-input-doc__use-cases {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--ax-spacing-md, 0.75rem);
        margin-top: var(--ax-spacing-md, 0.75rem);

        .use-case {
          padding: var(--ax-spacing-md, 0.75rem);
          background: var(--ax-background-subtle);
          border-radius: var(--ax-radius-md, 0.5rem);
          border-left: 3px solid var(--ax-primary-default);

          h4 {
            font-size: var(--ax-text-base, 1rem);
            font-weight: 600;
            color: var(--ax-text-heading);
            margin: 0 0 var(--ax-spacing-xs, 0.25rem) 0;
          }

          p {
            font-size: var(--ax-text-sm, 0.875rem);
            color: var(--ax-text-secondary);
            margin: 0;
          }
        }
      }
    `,
  ],
})
export class QuantityInputDocComponent {
  // State for examples
  basicQuantity = 100;
  conversionQuantity = 60;
  validationQuantity = 50;
  decimalQuantity = 12.5;
  integerQuantity = 10;
  stepQuantity1 = 5;
  stepQuantity10 = 50;
  presetQuantity = 100;
  disabledQuantity = 75;
  transferQuantity1 = 120;
  transferQuantity2 = 10.5;
  orderQuantity1 = 100;
  keyboardQuantity = 50;

  // Unit configurations
  basicUnits = [
    { code: 'pieces', label: 'Pieces', conversionRate: 1, decimalPlaces: 0 },
  ];

  multiUnits = [
    { code: 'pieces', label: 'Pieces', conversionRate: 1, decimalPlaces: 0 },
    { code: 'box', label: 'Boxes', conversionRate: 12, decimalPlaces: 0 },
    { code: 'carton', label: 'Cartons', conversionRate: 144, decimalPlaces: 0 },
  ];

  singleUnit = [
    { code: 'units', label: 'Units', conversionRate: 1, decimalPlaces: 0 },
  ];

  decimalUnit = [
    { code: 'kg', label: 'Kilograms', conversionRate: 1, decimalPlaces: 2 },
  ];

  integerUnit = [
    { code: 'boxes', label: 'Boxes', conversionRate: 1, decimalPlaces: 0 },
  ];

  transferUnits1 = [
    { code: 'pieces', label: 'Pieces', conversionRate: 1, decimalPlaces: 0 },
    { code: 'box', label: 'Boxes', conversionRate: 50, decimalPlaces: 0 },
  ];

  transferUnits2 = [
    { code: 'kg', label: 'Kilograms', conversionRate: 1, decimalPlaces: 2 },
    { code: 'bottle', label: 'Bottles', conversionRate: 0.5, decimalPlaces: 0 },
  ];

  orderUnits = [
    { code: 'pieces', label: 'Pieces', conversionRate: 1, decimalPlaces: 0 },
    { code: 'box', label: 'Boxes', conversionRate: 50, decimalPlaces: 0 },
  ];

  // Code examples
  basicUsageCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-quantity-input
  [(value)]="quantity"
  [baseUnit]="'pieces'"
  [availableUnits]="units"
  [min]="0"
  [max]="1000"
  [step]="1"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxQuantityInputComponent, QuantityUnitConfig } from '@aegisx/ui';

@Component({
  selector: 'app-quantity-entry',
  standalone: true,
  imports: [AxQuantityInputComponent],
  template: \`
    <ax-quantity-input
      [(value)]="quantity"
      [baseUnit]="'pieces'"
      [availableUnits]="units"
      [min]="0"
      [max]="1000"
    />
  \`,
})
export class QuantityEntryComponent {
  quantity = 100;

  units: QuantityUnitConfig[] = [
    { code: 'pieces', label: 'Pieces', conversionRate: 1, decimalPlaces: 0 }
  ];
}`,
    },
  ];

  unitConversionCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-quantity-input
  [(value)]="quantity"
  [baseUnit]="'pieces'"
  [availableUnits]="multiUnits"
  [min]="0"
  [max]="10000"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxQuantityInputComponent, QuantityUnitConfig } from '@aegisx/ui';

@Component({
  selector: 'app-multi-unit-input',
  standalone: true,
  imports: [AxQuantityInputComponent],
})
export class MultiUnitInputComponent {
  quantity = 60; // Stored in base unit (pieces)

  multiUnits: QuantityUnitConfig[] = [
    { code: 'pieces', label: 'Pieces', conversionRate: 1, decimalPlaces: 0 },
    { code: 'box', label: 'Boxes', conversionRate: 12, decimalPlaces: 0 },
    { code: 'carton', label: 'Cartons', conversionRate: 144, decimalPlaces: 0 }
  ];

  // When user selects "box" and enters 5:
  // - Display shows: 5 boxes
  // - quantity value becomes: 60 (5 × 12)
}`,
    },
  ];

  validationCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Min/Max Validation -->
<ax-quantity-input
  [(value)]="quantity"
  [baseUnit]="'units'"
  [availableUnits]="units"
  [min]="0"
  [max]="100"
  (validation)="handleValidation($event)"
/>

<!-- Decimal Places Validation -->
<ax-quantity-input
  [(value)]="weight"
  [baseUnit]="'kg'"
  [availableUnits]="weightUnits"
  [decimalPlaces]="2"
/>

<!-- Integer Only Validation -->
<ax-quantity-input
  [(value)]="boxes"
  [baseUnit]="'boxes'"
  [availableUnits]="boxUnits"
  [decimalPlaces]="0"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxQuantityInputComponent, ValidationState } from '@aegisx/ui';

@Component({
  selector: 'app-validated-input',
  standalone: true,
  imports: [AxQuantityInputComponent],
})
export class ValidatedInputComponent {
  quantity = 50;

  handleValidation(state: ValidationState): void {
    if (!state.valid) {
      // Show validation errors
      state.errors.forEach(error => {
        console.log(\`\${error.type}: \${error.message}\`);
        // Display error in UI
      });
    }
  }
}`,
    },
  ];

  stepperCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Step Size: 1 -->
<ax-quantity-input
  [(value)]="quantity"
  [baseUnit]="'pieces'"
  [availableUnits]="units"
  [step]="1"
  [showStepper]="true"
/>

<!-- Step Size: 10 -->
<ax-quantity-input
  [(value)]="quantity"
  [baseUnit]="'pieces'"
  [availableUnits]="units"
  [step]="10"
  [showStepper]="true"
/>`,
    },
  ];

  presetsCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-quantity-input
  [(value)]="quantity"
  [baseUnit]="'pieces'"
  [availableUnits]="units"
  [max]="100000"
  [showPresets]="true"
  [showStepper]="true"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `// Preset multipliers provide quick multiplication:
// - ×10 button: multiply current value by 10
// - ×100 button: multiply current value by 100
//
// Example: value=10 → click ×10 → value=100
// Only enable when max value supports it`,
    },
  ];

  disabledCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-quantity-input
  [(value)]="quantity"
  [baseUnit]="'pieces'"
  [availableUnits]="units"
  [disabled]="true"
/>`,
    },
  ];

  quantityInputTokens: ComponentToken[] = [
    {
      category: 'Colors',
      cssVar: '--ax-border-default',
      usage: 'Input border color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-border-focus',
      usage: 'Input border color on focus',
    },
    {
      category: 'Colors',
      cssVar: '--ax-error-default',
      usage: 'Validation error border and text color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-background-default',
      usage: 'Input background color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-primary',
      usage: 'Input text color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-secondary',
      usage: 'Unit label and hint text color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-primary-default',
      usage: 'Stepper button color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-background-subtle',
      usage: 'Disabled input background',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-xs',
      usage: 'Internal padding (small)',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-sm',
      usage: 'Internal padding (medium)',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-md',
      usage: 'Gap between elements',
    },
    {
      category: 'Borders',
      cssVar: '--ax-radius-md',
      usage: 'Input corner rounding',
    },
    {
      category: 'Typography',
      cssVar: '--ax-text-sm',
      usage: 'Input text size',
    },
    {
      category: 'Typography',
      cssVar: '--ax-font-mono',
      usage: 'Numeric input font family',
    },
  ];

  handleValidation(state: {
    valid: boolean;
    errors: Array<{ type: string; message: string }>;
  }): void {
    console.log('Validation state:', state);
    if (!state.valid) {
      console.log('Validation errors:', state.errors);
    }
  }

  calculateTotal(
    quantity: number,
    piecesPerBox: number,
    pricePerBox: number,
  ): string {
    const boxes = Math.ceil(quantity / piecesPerBox);
    return (boxes * pricePerBox).toLocaleString('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}
