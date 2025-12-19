import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AxTransferWizardComponent } from '@aegisx/ui';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../../../components/docs';
import { ComponentToken } from '../../../../../../types/docs.types';

@Component({
  selector: 'ax-transfer-wizard-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    AxTransferWizardComponent,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="transfer-wizard-doc">
      <ax-doc-header
        title="Transfer Wizard"
        icon="sync_alt"
        description="Multi-step wizard component for creating and managing inventory transfers between locations with progress tracking and validation."
        [breadcrumbs]="[
          {
            label: 'Inventory',
            link: '/docs/components/aegisx/inventory/transfer-wizard',
          },
          { label: 'Transfer Wizard' },
        ]"
        status="stable"
        version="1.0.0"
        importStatement="import { AxTransferWizardComponent } from '@aegisx/ui';"
      ></ax-doc-header>

      <mat-tab-group class="transfer-wizard-doc__tabs" animationDuration="150ms">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="transfer-wizard-doc__tab-content">
            <section class="transfer-wizard-doc__section">
              <h2>Basic Usage</h2>
              <p>
                The Transfer Wizard component provides a complete 5-step workflow
                for creating inventory transfers: Source Selection → Destination
                Selection → Items Selection → Quantity Input → Review & Submit.
                Each step includes validation and users can navigate between steps.
              </p>

              <ax-live-preview variant="bordered">
                <div class="transfer-wizard-doc__demo">
                  <ax-transfer-wizard
                    [availableLocations]="sampleLocations()"
                    [productSearchFn]="productSearchFunction"
                    [allowPartialTransfer]="true"
                    [requireApproval]="false"
                    (complete)="handleTransferComplete($event)"
                    (wizardCancel)="handleTransferCancel()"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="basicUsageCode"></ax-code-tabs>
            </section>

            <section class="transfer-wizard-doc__section">
              <h2>5-Step Workflow</h2>
              <p>
                The wizard guides users through a complete transfer process with
                validation at each step:
              </p>

              <div class="transfer-wizard-doc__workflow">
                <div class="workflow-step">
                  <div class="workflow-step__number">1</div>
                  <div class="workflow-step__content">
                    <h4>Select Source</h4>
                    <p>Choose the source location using the location picker component</p>
                  </div>
                </div>

                <div class="workflow-step">
                  <div class="workflow-step__number">2</div>
                  <div class="workflow-step__content">
                    <h4>Select Destination</h4>
                    <p>Choose destination location (must be different from source)</p>
                  </div>
                </div>

                <div class="workflow-step">
                  <div class="workflow-step__number">3</div>
                  <div class="workflow-step__content">
                    <h4>Select Items</h4>
                    <p>Search and add products with product autocomplete</p>
                  </div>
                </div>

                <div class="workflow-step">
                  <div class="workflow-step__number">4</div>
                  <div class="workflow-step__content">
                    <h4>Confirm Quantities</h4>
                    <p>Enter transfer quantities with validation against available stock</p>
                  </div>
                </div>

                <div class="workflow-step">
                  <div class="workflow-step__number">5</div>
                  <div class="workflow-step__content">
                    <h4>Review & Submit</h4>
                    <p>Review all details, add notes, and submit the transfer</p>
                  </div>
                </div>
              </div>
            </section>

            <section class="transfer-wizard-doc__section">
              <h2>Progress Indicator</h2>
              <p>
                The wizard displays a visual progress indicator showing the current
                step, completed steps, and remaining steps. Users can jump to
                previously completed steps.
              </p>

              <ax-code-tabs [tabs]="progressIndicatorCode"></ax-code-tabs>
            </section>

            <section class="transfer-wizard-doc__section">
              <h2>Validation</h2>
              <p>
                Each step includes comprehensive validation before proceeding:
              </p>

              <ul class="transfer-wizard-doc__validation-list">
                <li><strong>Source:</strong> Location must be selected</li>
                <li><strong>Destination:</strong> Must be different from source location</li>
                <li><strong>Items:</strong> At least one product must be added</li>
                <li><strong>Quantities:</strong> Must be greater than 0 and not exceed available stock</li>
                <li><strong>Review:</strong> Final validation of all data before submission</li>
              </ul>
            </section>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="transfer-wizard-doc__tab-content">
            <section class="transfer-wizard-doc__section">
              <h2>Basic Transfer Wizard</h2>
              <p>Standard transfer wizard with all default settings enabled.</p>

              <ax-code-tabs [tabs]="basicExampleCode"></ax-code-tabs>
            </section>

            <section class="transfer-wizard-doc__section">
              <h2>With Pre-selected Source</h2>
              <p>
                Pre-fill the source location when creating transfers from a
                specific location view.
              </p>

              <ax-code-tabs [tabs]="preSelectedSourceCode"></ax-code-tabs>
            </section>

            <section class="transfer-wizard-doc__section">
              <h2>With Approval Required</h2>
              <p>
                Enable approval workflow for transfers requiring manager authorization.
              </p>

              <ax-code-tabs [tabs]="approvalRequiredCode"></ax-code-tabs>
            </section>

            <section class="transfer-wizard-doc__section">
              <h2>Draft Save/Load</h2>
              <p>
                The wizard automatically saves drafts to localStorage, allowing
                users to resume incomplete transfers. Drafts are saved every 2
                seconds (debounced).
              </p>

              <ax-code-tabs [tabs]="draftSaveCode"></ax-code-tabs>
            </section>

            <section class="transfer-wizard-doc__section">
              <h2>Step Change Tracking</h2>
              <p>
                Track wizard step changes for analytics or additional validation.
              </p>

              <ax-code-tabs [tabs]="stepChangeCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="transfer-wizard-doc__tab-content">
            <section class="transfer-wizard-doc__section">
              <h2>Input Properties</h2>
              <div class="transfer-wizard-doc__api-table">
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
                      <td><code>sourceLocation</code></td>
                      <td><code>string</code></td>
                      <td><code>undefined</code></td>
                      <td>Pre-selected source location ID (optional)</td>
                    </tr>
                    <tr>
                      <td><code>steps</code></td>
                      <td><code>WizardStep[]</code></td>
                      <td><code>DEFAULT_WIZARD_STEPS</code></td>
                      <td>Custom wizard steps configuration</td>
                    </tr>
                    <tr>
                      <td><code>config</code></td>
                      <td><code>Partial&lt;TransferWizardConfig&gt;</code></td>
                      <td><code>{}</code></td>
                      <td>Configuration options for wizard behavior</td>
                    </tr>
                    <tr>
                      <td><code>allowPartialTransfer</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Allow partial quantity transfers</td>
                    </tr>
                    <tr>
                      <td><code>requireApproval</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Require manager approval for transfers</td>
                    </tr>
                    <tr>
                      <td><code>allowMultipleProducts</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Allow selecting multiple products</td>
                    </tr>
                    <tr>
                      <td><code>enableDraftSave</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Enable draft save/load functionality</td>
                    </tr>
                    <tr>
                      <td><code>availableLocations</code></td>
                      <td><code>any[]</code></td>
                      <td><code>[]</code></td>
                      <td>Available locations for source/destination selection</td>
                    </tr>
                    <tr>
                      <td><code>productSearchFn</code></td>
                      <td><code>(term: string) =&gt; Promise&lt;ProductSearchResult[]&gt;</code></td>
                      <td><code>undefined</code></td>
                      <td>Product search function for autocomplete</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="transfer-wizard-doc__section">
              <h2>Output Events</h2>
              <div class="transfer-wizard-doc__api-table">
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
                      <td><code>complete</code></td>
                      <td><code>StockTransfer</code></td>
                      <td>Emitted when transfer is submitted successfully</td>
                    </tr>
                    <tr>
                      <td><code>wizardCancel</code></td>
                      <td><code>void</code></td>
                      <td>Emitted when wizard is cancelled</td>
                    </tr>
                    <tr>
                      <td><code>stepChange</code></td>
                      <td><code>{{ '{' }} step: number; data: any {{ '}' }}</code></td>
                      <td>Emitted when step changes</td>
                    </tr>
                    <tr>
                      <td><code>draftSave</code></td>
                      <td><code>TransferDraft</code></td>
                      <td>Emitted when draft is saved</td>
                    </tr>
                    <tr>
                      <td><code>draftLoad</code></td>
                      <td><code>TransferDraft</code></td>
                      <td>Emitted when draft is loaded</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="transfer-wizard-doc__section">
              <h2>Type Definitions</h2>

              <h3>StockTransfer</h3>
              <pre><code>interface StockTransfer {{ '{' }}
  sourceLocationId: string;        // Source location ID
  destinationLocationId: string;   // Destination location ID
  items: TransferItem[];           // Items to transfer
  notes?: string;                  // Optional transfer notes
  referenceNo?: string;            // Transfer reference number
  requiresApproval?: boolean;      // Whether approval is required
  scheduledDate?: Date;            // Scheduled transfer date
{{ '}' }}</code></pre>

              <h3>TransferItem</h3>
              <pre><code>interface TransferItem {{ '{' }}
  productId: string;         // Unique product identifier
  productName: string;       // Product name for display
  sku?: string;              // Product SKU
  quantity: number;          // Quantity to transfer
  availableQuantity: number; // Available quantity at source
  unit?: string;             // Unit of measurement
  batchNumber?: string;      // Batch number if tracking enabled
  notes?: string;            // Optional notes for this item
{{ '}' }}</code></pre>

              <h3>TransferDraft</h3>
              <pre><code>interface TransferDraft {{ '{' }}
  id: string;                         // Draft ID
  name: string;                       // Draft name/description
  state: Partial&lt;TransferWizardState&gt;; // Draft state
  transfer: Partial&lt;StockTransfer&gt;;    // Transfer data
  createdAt: Date;                    // Created timestamp
  updatedAt: Date;                    // Last modified timestamp
{{ '}' }}</code></pre>

              <h3>ProductSearchResult</h3>
              <pre><code>interface ProductSearchResult {{ '{' }}
  id: string;              // Product ID
  name: string;            // Product name
  sku: string;             // Product SKU
  availableQuantity: number; // Available at source
  unit: string;            // Unit of measurement
  imageUrl?: string;       // Product image URL
{{ '}' }}</code></pre>
            </section>
          </div>
        </mat-tab>

        <!-- Tokens Tab -->
        <mat-tab label="Tokens">
          <div class="transfer-wizard-doc__tab-content">
            <ax-component-tokens
              [tokens]="transferWizardTokens"
            ></ax-component-tokens>
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="transfer-wizard-doc__tab-content">
            <section class="transfer-wizard-doc__section">
              <h2>Do's and Don'ts</h2>

              <div class="transfer-wizard-doc__guidelines">
                <div class="transfer-wizard-doc__guideline transfer-wizard-doc__guideline--do">
                  <h4><mat-icon>check_circle</mat-icon> Do</h4>
                  <ul>
                    <li>Provide clear product search functionality with autocomplete</li>
                    <li>Validate quantities against available stock at each step</li>
                    <li>Enable draft save for long or complex transfers</li>
                    <li>Show clear progress indicators and step navigation</li>
                    <li>Include comprehensive review step before submission</li>
                    <li>Handle errors gracefully with user-friendly messages</li>
                  </ul>
                </div>

                <div class="transfer-wizard-doc__guideline transfer-wizard-doc__guideline--dont">
                  <h4><mat-icon>cancel</mat-icon> Don't</h4>
                  <ul>
                    <li>Allow destination to be same as source location</li>
                    <li>Skip validation at any step</li>
                    <li>Allow quantities exceeding available stock</li>
                    <li>Lose user data on cancellation without warning</li>
                    <li>Submit transfers without final review</li>
                    <li>Forget to clear draft after successful submission</li>
                  </ul>
                </div>
              </div>
            </section>

            <section class="transfer-wizard-doc__section">
              <h2>Accessibility</h2>
              <ul class="transfer-wizard-doc__a11y-list">
                <li>
                  Stepper component includes proper ARIA labels and navigation
                  attributes
                </li>
                <li>
                  All form inputs have associated labels and error messages
                </li>
                <li>
                  Keyboard navigation works throughout all wizard steps (Tab, Enter, Escape)
                </li>
                <li>
                  Progress indicator is announced to screen readers
                </li>
                <li>
                  Validation errors are clearly communicated with ARIA live regions
                </li>
                <li>
                  Buttons have clear focus indicators and disabled states
                </li>
              </ul>
            </section>

            <section class="transfer-wizard-doc__section">
              <h2>Best Practices</h2>
              <ul class="transfer-wizard-doc__best-practices">
                <li>
                  <strong>Source Pre-selection:</strong> Pre-fill source location
                  when creating transfers from a specific location view to reduce
                  user steps
                </li>
                <li>
                  <strong>Product Search:</strong> Implement efficient product
                  search with debouncing (200-300ms) and minimum 2-3 character
                  requirement
                </li>
                <li>
                  <strong>Draft Auto-save:</strong> Enable draft save with 2-second
                  debounce to avoid excessive localStorage writes
                </li>
                <li>
                  <strong>Approval Workflow:</strong> Enable requireApproval for
                  high-value or cross-department transfers
                </li>
                <li>
                  <strong>Step Validation:</strong> Validate each step before
                  allowing navigation to prevent incomplete data
                </li>
                <li>
                  <strong>Error Handling:</strong> Show specific validation errors
                  with suggestions for resolution
                </li>
                <li>
                  <strong>Review Step:</strong> Always include a review step to
                  allow users to verify all details before submission
                </li>
                <li>
                  <strong>Loading States:</strong> Show loading indicators during
                  product search and form submission
                </li>
              </ul>
            </section>

            <section class="transfer-wizard-doc__section">
              <h2>Workflow Integration</h2>
              <p>
                The Transfer Wizard integrates with several other inventory
                components:
              </p>
              <ul class="transfer-wizard-doc__integration-list">
                <li>
                  <strong>Location Picker:</strong> Used in steps 1 & 2 for
                  source/destination selection
                </li>
                <li>
                  <strong>Quantity Input:</strong> Used in step 4 for entering
                  transfer quantities with validation
                </li>
                <li>
                  <strong>Batch Selector:</strong> Optional integration for batch
                  tracking when enableBatchTracking is true
                </li>
                <li>
                  <strong>Stock Movement Timeline:</strong> Can display transfer
                  history after successful submission
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
      .transfer-wizard-doc {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--ax-spacing-xl, 1.5rem);
      }

      .transfer-wizard-doc__tabs {
        margin-top: var(--ax-spacing-xl, 1.5rem);
      }

      .transfer-wizard-doc__tab-content {
        padding: var(--ax-spacing-xl, 1.5rem) 0;
      }

      .transfer-wizard-doc__section {
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

      .transfer-wizard-doc__demo {
        width: 100%;
        min-height: 500px;
      }

      /* Workflow Steps */
      .transfer-wizard-doc__workflow {
        display: flex;
        flex-direction: column;
        gap: var(--ax-spacing-md, 0.75rem);
        margin-top: var(--ax-spacing-lg, 1rem);
      }

      .workflow-step {
        display: flex;
        align-items: flex-start;
        gap: var(--ax-spacing-md, 0.75rem);
        padding: var(--ax-spacing-md, 0.75rem);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-md, 0.5rem);
        background: var(--ax-background-default);
      }

      .workflow-step__number {
        flex-shrink: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--ax-primary-default);
        color: white;
        border-radius: 50%;
        font-weight: 600;
        font-size: var(--ax-text-sm, 0.875rem);
      }

      .workflow-step__content {
        flex: 1;

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

      /* Validation List */
      .transfer-wizard-doc__validation-list {
        margin: 0;
        padding-left: var(--ax-spacing-lg, 1rem);

        li {
          font-size: var(--ax-text-sm, 0.875rem);
          color: var(--ax-text-secondary);
          margin-bottom: var(--ax-spacing-xs, 0.25rem);

          strong {
            color: var(--ax-text-heading);
          }
        }
      }

      /* API Table */
      .transfer-wizard-doc__api-table {
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
      .transfer-wizard-doc__guidelines {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--ax-spacing-lg, 1rem);
      }

      .transfer-wizard-doc__guideline {
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

      .transfer-wizard-doc__guideline--do {
        background: var(--ax-success-faint);

        h4 {
          color: var(--ax-success-emphasis);
        }
        li {
          color: var(--ax-success-emphasis);
        }
      }

      .transfer-wizard-doc__guideline--dont {
        background: var(--ax-error-faint);

        h4 {
          color: var(--ax-error-emphasis);
        }
        li {
          color: var(--ax-error-emphasis);
        }
      }

      .transfer-wizard-doc__a11y-list,
      .transfer-wizard-doc__best-practices,
      .transfer-wizard-doc__integration-list {
        margin: 0;
        padding-left: var(--ax-spacing-lg, 1rem);

        li {
          font-size: var(--ax-text-sm, 0.875rem);
          color: var(--ax-text-secondary);
          margin-bottom: var(--ax-spacing-sm, 0.5rem);

          strong {
            color: var(--ax-text-heading);
          }
        }
      }
    `,
  ],
})
export class TransferWizardDocComponent {
  // Sample data for demo
  sampleLocations = signal([
    { id: '1', name: 'Main Warehouse', type: 'warehouse' },
    { id: '2', name: 'Pharmacy Storage', type: 'storage' },
    { id: '3', name: 'Emergency Room', type: 'department' },
    { id: '4', name: 'ICU Supply', type: 'department' },
  ]);

  // Product search function for demo
  productSearchFunction = async (term: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    const products = [
      {
        id: '1',
        name: 'Medical Gloves Size M',
        sku: 'GLV-001-M',
        availableQuantity: 500,
        unit: 'boxes',
      },
      {
        id: '2',
        name: 'Surgical Masks',
        sku: 'MSK-002',
        availableQuantity: 1000,
        unit: 'pieces',
      },
      {
        id: '3',
        name: 'Hand Sanitizer 500ml',
        sku: 'SAN-003',
        availableQuantity: 200,
        unit: 'bottles',
      },
      {
        id: '4',
        name: 'Thermometer Digital',
        sku: 'THM-004',
        availableQuantity: 50,
        unit: 'units',
      },
    ];

    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term.toLowerCase()) ||
        p.sku.toLowerCase().includes(term.toLowerCase()),
    );
  };

  basicUsageCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-transfer-wizard
  [availableLocations]="locations"
  [productSearchFn]="searchProducts"
  [allowPartialTransfer]="true"
  [requireApproval]="false"
  (complete)="handleTransferComplete($event)"
  (wizardCancel)="handleTransferCancel()"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxTransferWizardComponent, StockTransfer } from '@aegisx/ui';

@Component({
  selector: 'app-create-transfer',
  standalone: true,
  imports: [AxTransferWizardComponent],
  template: \`
    <ax-transfer-wizard
      [availableLocations]="locations"
      [productSearchFn]="searchProducts"
      (complete)="handleTransferComplete($event)"
    />
  \`,
})
export class CreateTransferComponent {
  locations = [
    { id: '1', name: 'Main Warehouse', type: 'warehouse' },
    { id: '2', name: 'Pharmacy Storage', type: 'storage' },
  ];

  async searchProducts(term: string) {
    return this.productService.search(term);
  }

  handleTransferComplete(transfer: StockTransfer): void {
    this.transferService.create(transfer).subscribe({
      next: () => this.router.navigate(['/transfers']),
      error: (err) => this.showError(err),
    });
  }
}`,
    },
  ];

  progressIndicatorCode = [
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `// The wizard automatically tracks progress
// Users can see:
// - Current step (highlighted)
// - Completed steps (green checkmark)
// - Remaining steps (gray)
// - Overall progress percentage

// Access progress programmatically via stepChange event:
(stepChange)="onStepChange($event)"

onStepChange(event: { step: number; data: any }): void {
  console.log(\`Step \${event.step + 1} of 5\`);
  console.log('Step data:', event.data);
}`,
    },
  ];

  basicExampleCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-transfer-wizard
  [availableLocations]="locations"
  [productSearchFn]="searchProducts"
  [allowPartialTransfer]="true"
  [allowMultipleProducts]="true"
  [enableDraftSave]="true"
  (complete)="handleComplete($event)"
/>`,
    },
  ];

  preSelectedSourceCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Pre-fill source location from current context -->
<ax-transfer-wizard
  [sourceLocation]="currentLocationId"
  [availableLocations]="locations"
  [productSearchFn]="searchProducts"
  (complete)="handleComplete($event)"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `export class LocationDetailComponent {
  currentLocationId = '1'; // From route params or context

  // Wizard will skip step 1 and pre-fill source location
}`,
    },
  ];

  approvalRequiredCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-transfer-wizard
  [availableLocations]="locations"
  [productSearchFn]="searchProducts"
  [requireApproval]="true"
  (complete)="handleComplete($event)"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `handleComplete(transfer: StockTransfer): void {
  // Transfer will have requiresApproval = true
  this.transferService.create(transfer).subscribe({
    next: (result) => {
      this.showMessage(
        'Transfer created and sent for approval',
        'success'
      );
      this.router.navigate(['/transfers/pending']);
    },
  });
}`,
    },
  ];

  draftSaveCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-transfer-wizard
  [enableDraftSave]="true"
  (draftSave)="onDraftSave($event)"
  (draftLoad)="onDraftLoad($event)"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { TransferDraft } from '@aegisx/ui';

onDraftSave(draft: TransferDraft): void {
  console.log('Draft auto-saved:', draft.updatedAt);
  // Draft is automatically saved to localStorage
  // Optionally sync to backend
  this.draftService.save(draft);
}

onDraftLoad(draft: TransferDraft): void {
  console.log('Draft loaded:', draft.name);
  this.showMessage('Previous draft loaded', 'info');
}`,
    },
  ];

  stepChangeCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-transfer-wizard
  (stepChange)="onStepChange($event)"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `onStepChange(event: { step: number; data: any }): void {
  // Track analytics
  this.analytics.track('transfer_wizard_step', {
    step: event.step,
    stepName: this.getStepName(event.step),
  });

  // Perform additional validation
  if (event.step === 2) {
    // Validate source/destination are from same department
    this.validateLocations(event.data);
  }
}

getStepName(step: number): string {
  const names = ['source', 'destination', 'items', 'quantities', 'review'];
  return names[step];
}`,
    },
  ];

  transferWizardTokens: ComponentToken[] = [
    {
      category: 'Colors',
      cssVar: '--ax-primary-default',
      usage: 'Active step indicator color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-success-default',
      usage: 'Completed step indicator color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-secondary',
      usage: 'Pending step indicator color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-error-default',
      usage: 'Validation error color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-background-default',
      usage: 'Wizard background color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-border-default',
      usage: 'Step separator and card borders',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-md',
      usage: 'Spacing between form fields',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-lg',
      usage: 'Spacing between wizard steps',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-xl',
      usage: 'Padding for wizard container',
    },
    {
      category: 'Borders',
      cssVar: '--ax-radius-md',
      usage: 'Card and button border radius',
    },
  ];

  handleTransferComplete(transfer: any): void {
    console.log('Transfer completed:', transfer);
    alert('Transfer submitted successfully!');
  }

  handleTransferCancel(): void {
    console.log('Transfer cancelled');
  }
}
