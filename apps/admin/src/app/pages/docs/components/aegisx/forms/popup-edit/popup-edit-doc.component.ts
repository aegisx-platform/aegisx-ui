import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { AxPopupEditComponent } from '@aegisx/ui';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../../../components/docs';
import { ComponentToken } from '../../../../../../types/docs.types';

@Component({
  selector: 'ax-popup-edit-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    AxPopupEditComponent,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="popup-edit-doc">
      <ax-doc-header
        title="Popup Edit"
        icon="edit_note"
        description="Inline editing component that shows a popup input when clicked. Perfect for editable table cells, quick property updates, and inline data modification."
        [breadcrumbs]="[
          { label: 'Forms', link: '/docs/components/aegisx/forms/date-picker' },
          { label: 'Popup Edit' },
        ]"
        status="stable"
        version="1.0.0"
        importStatement="import { AxPopupEditComponent } from '@aegisx/ui';"
      ></ax-doc-header>

      <mat-tab-group class="popup-edit-doc__tabs" animationDuration="200ms">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="popup-edit-doc__tab-content">
            <!-- Basic Usage -->
            <section class="popup-edit-doc__section">
              <h2>Basic Usage</h2>
              <p>
                Click on the content to open an inline edit popup. The edit icon
                appears on hover.
              </p>

              <ax-live-preview variant="bordered">
                <div class="popup-edit-doc__demo-row">
                  <div class="popup-edit-doc__field">
                    <span class="popup-edit-doc__label">Name:</span>
                    <ax-popup-edit
                      [(value)]="userName"
                      label="Name"
                      (saveEvent)="onSave('name', $event)"
                    >
                      {{ userName }}
                    </ax-popup-edit>
                  </div>

                  <div class="popup-edit-doc__field">
                    <span class="popup-edit-doc__label">Email:</span>
                    <ax-popup-edit
                      [(value)]="userEmail"
                      label="Email"
                      (saveEvent)="onSave('email', $event)"
                    >
                      {{ userEmail }}
                    </ax-popup-edit>
                  </div>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="basicUsageCode"></ax-code-tabs>
            </section>

            <!-- Input Types -->
            <section class="popup-edit-doc__section">
              <h2>Input Types</h2>
              <p>
                Support for text, number, and textarea input types for different
                data formats.
              </p>

              <ax-live-preview variant="bordered">
                <div class="popup-edit-doc__demo-column">
                  <div class="popup-edit-doc__field">
                    <span class="popup-edit-doc__label">Text:</span>
                    <ax-popup-edit
                      [(value)]="textValue"
                      type="text"
                      label="Title"
                    >
                      {{ textValue }}
                    </ax-popup-edit>
                  </div>

                  <div class="popup-edit-doc__field">
                    <span class="popup-edit-doc__label">Number:</span>
                    <ax-popup-edit
                      [(value)]="numberValue"
                      type="number"
                      label="Quantity"
                    >
                      {{ numberValue }} items
                    </ax-popup-edit>
                  </div>

                  <div class="popup-edit-doc__field">
                    <span class="popup-edit-doc__label">Textarea:</span>
                    <ax-popup-edit
                      [(value)]="textareaValue"
                      type="textarea"
                      label="Description"
                      [rows]="3"
                    >
                      {{ textareaValue | slice: 0 : 50 }}...
                    </ax-popup-edit>
                  </div>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="inputTypesCode"></ax-code-tabs>
            </section>

            <!-- Custom Labels -->
            <section class="popup-edit-doc__section">
              <h2>Custom Button Labels</h2>
              <p>
                Customize the save and cancel button labels for different
                contexts.
              </p>

              <ax-live-preview variant="bordered">
                <div class="popup-edit-doc__field">
                  <span class="popup-edit-doc__label">Status:</span>
                  <ax-popup-edit
                    [(value)]="statusValue"
                    label="Status"
                    saveLabel="Update"
                    cancelLabel="Discard"
                  >
                    {{ statusValue }}
                  </ax-popup-edit>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="labelsCode"></ax-code-tabs>
            </section>

            <!-- Without Buttons -->
            <section class="popup-edit-doc__section">
              <h2>Quick Edit Mode</h2>
              <p>
                Hide action buttons for a quicker editing experience. Press
                Enter to save, Escape to cancel.
              </p>

              <ax-live-preview variant="bordered">
                <div class="popup-edit-doc__field">
                  <span class="popup-edit-doc__label">Quick edit:</span>
                  <ax-popup-edit
                    [(value)]="quickValue"
                    [showButtons]="false"
                    placeholder="Type and press Enter"
                  >
                    {{ quickValue || 'Click to edit' }}
                  </ax-popup-edit>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="quickEditCode"></ax-code-tabs>
            </section>

            <!-- Disabled State -->
            <section class="popup-edit-doc__section">
              <h2>Disabled State</h2>
              <p>Disable editing to display read-only values.</p>

              <ax-live-preview variant="bordered">
                <div class="popup-edit-doc__field">
                  <span class="popup-edit-doc__label">Read-only:</span>
                  <ax-popup-edit [(value)]="readOnlyValue" [disabled]="true">
                    {{ readOnlyValue }}
                  </ax-popup-edit>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="disabledCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="popup-edit-doc__tab-content">
            <!-- Editable Table -->
            <section class="popup-edit-doc__section">
              <h2>Editable Data Table</h2>
              <p>Common pattern for inline editing in data tables.</p>

              <ax-live-preview variant="bordered">
                <div class="popup-edit-doc__table-container">
                  <table class="popup-edit-doc__table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (product of products; track product.id) {
                        <tr>
                          <td>
                            <ax-popup-edit
                              [(value)]="product.name"
                              label="Product Name"
                            >
                              {{ product.name }}
                            </ax-popup-edit>
                          </td>
                          <td>
                            <ax-popup-edit
                              [(value)]="product.price"
                              type="number"
                              label="Price"
                            >
                              \${{ product.price }}
                            </ax-popup-edit>
                          </td>
                          <td>
                            <ax-popup-edit
                              [(value)]="product.stock"
                              type="number"
                              label="Stock"
                            >
                              {{ product.stock }} units
                            </ax-popup-edit>
                          </td>
                          <td>
                            <ax-popup-edit
                              [(value)]="product.status"
                              label="Status"
                            >
                              <span
                                class="popup-edit-doc__status"
                                [class.popup-edit-doc__status--active]="
                                  product.status === 'Active'
                                "
                              >
                                {{ product.status }}
                              </span>
                            </ax-popup-edit>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="editableTableCode"></ax-code-tabs>
            </section>

            <!-- Profile Card -->
            <section class="popup-edit-doc__section">
              <h2>Profile Card with Inline Edit</h2>
              <p>User profile card with editable fields.</p>

              <ax-live-preview variant="bordered">
                <div class="popup-edit-doc__profile">
                  <div class="popup-edit-doc__profile-avatar">
                    {{ profileData.name.charAt(0) }}
                  </div>
                  <div class="popup-edit-doc__profile-info">
                    <div class="popup-edit-doc__profile-field">
                      <mat-icon>person</mat-icon>
                      <ax-popup-edit
                        [(value)]="profileData.name"
                        label="Full Name"
                      >
                        <strong>{{ profileData.name }}</strong>
                      </ax-popup-edit>
                    </div>
                    <div class="popup-edit-doc__profile-field">
                      <mat-icon>email</mat-icon>
                      <ax-popup-edit
                        [(value)]="profileData.email"
                        label="Email"
                      >
                        {{ profileData.email }}
                      </ax-popup-edit>
                    </div>
                    <div class="popup-edit-doc__profile-field">
                      <mat-icon>phone</mat-icon>
                      <ax-popup-edit
                        [(value)]="profileData.phone"
                        label="Phone"
                      >
                        {{ profileData.phone }}
                      </ax-popup-edit>
                    </div>
                    <div class="popup-edit-doc__profile-field">
                      <mat-icon>work</mat-icon>
                      <ax-popup-edit
                        [(value)]="profileData.title"
                        label="Job Title"
                      >
                        {{ profileData.title }}
                      </ax-popup-edit>
                    </div>
                    <div
                      class="popup-edit-doc__profile-field popup-edit-doc__profile-field--full"
                    >
                      <mat-icon>notes</mat-icon>
                      <ax-popup-edit
                        [(value)]="profileData.bio"
                        type="textarea"
                        label="Bio"
                        [rows]="3"
                      >
                        {{ profileData.bio }}
                      </ax-popup-edit>
                    </div>
                  </div>
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="profileCardCode"></ax-code-tabs>
            </section>

            <!-- Settings List -->
            <section class="popup-edit-doc__section">
              <h2>Settings List</h2>
              <p>Configuration list with editable values.</p>

              <ax-live-preview variant="bordered">
                <div class="popup-edit-doc__settings">
                  @for (setting of settings; track setting.key) {
                    <div class="popup-edit-doc__setting">
                      <div class="popup-edit-doc__setting-label">
                        <mat-icon>{{ setting.icon }}</mat-icon>
                        <span>{{ setting.label }}</span>
                      </div>
                      <ax-popup-edit
                        [(value)]="setting.value"
                        [label]="setting.label"
                      >
                        {{ setting.value }}
                      </ax-popup-edit>
                    </div>
                  }
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="settingsListCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="popup-edit-doc__tab-content">
            <section class="popup-edit-doc__section">
              <h2>Properties</h2>
              <div class="popup-edit-doc__api-table">
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
                      <td><code>string | number</code></td>
                      <td><code>''</code></td>
                      <td>Current value (two-way binding)</td>
                    </tr>
                    <tr>
                      <td><code>type</code></td>
                      <td><code>'text' | 'number' | 'textarea'</code></td>
                      <td><code>'text'</code></td>
                      <td>Input field type</td>
                    </tr>
                    <tr>
                      <td><code>label</code></td>
                      <td><code>string</code></td>
                      <td><code>''</code></td>
                      <td>Form field label</td>
                    </tr>
                    <tr>
                      <td><code>placeholder</code></td>
                      <td><code>string</code></td>
                      <td><code>''</code></td>
                      <td>Input placeholder text</td>
                    </tr>
                    <tr>
                      <td><code>rows</code></td>
                      <td><code>number</code></td>
                      <td><code>3</code></td>
                      <td>Textarea rows (type="textarea")</td>
                    </tr>
                    <tr>
                      <td><code>disabled</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Disable editing</td>
                    </tr>
                    <tr>
                      <td><code>showButtons</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Show Save/Cancel buttons</td>
                    </tr>
                    <tr>
                      <td><code>saveLabel</code></td>
                      <td><code>string</code></td>
                      <td><code>'Save'</code></td>
                      <td>Save button label</td>
                    </tr>
                    <tr>
                      <td><code>cancelLabel</code></td>
                      <td><code>string</code></td>
                      <td><code>'Cancel'</code></td>
                      <td>Cancel button label</td>
                    </tr>
                    <tr>
                      <td><code>validate</code></td>
                      <td><code>(value) => boolean</code></td>
                      <td><code>undefined</code></td>
                      <td>Validation function</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="popup-edit-doc__section">
              <h2>Events</h2>
              <div class="popup-edit-doc__api-table">
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
                      <td><code>EventEmitter&lt;string | number&gt;</code></td>
                      <td>Emits when value changes</td>
                    </tr>
                    <tr>
                      <td><code>saveEvent</code></td>
                      <td><code>EventEmitter&lt;string | number&gt;</code></td>
                      <td>Emits on save with new value</td>
                    </tr>
                    <tr>
                      <td><code>cancelEvent</code></td>
                      <td><code>EventEmitter&lt;void&gt;</code></td>
                      <td>Emits when editing is cancelled</td>
                    </tr>
                    <tr>
                      <td><code>opened</code></td>
                      <td><code>EventEmitter&lt;void&gt;</code></td>
                      <td>Emits when popup opens</td>
                    </tr>
                    <tr>
                      <td><code>closed</code></td>
                      <td><code>EventEmitter&lt;void&gt;</code></td>
                      <td>Emits when popup closes</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="popup-edit-doc__section">
              <h2>Keyboard Shortcuts</h2>
              <div class="popup-edit-doc__api-table">
                <table>
                  <thead>
                    <tr>
                      <th>Key</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>Enter</code></td>
                      <td>Save changes (text/number input)</td>
                    </tr>
                    <tr>
                      <td><code>Escape</code></td>
                      <td>Cancel and close popup</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </mat-tab>

        <!-- Tokens Tab -->
        <mat-tab label="Tokens">
          <div class="popup-edit-doc__tab-content">
            <ax-component-tokens
              [tokens]="popupEditTokens"
            ></ax-component-tokens>
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="popup-edit-doc__tab-content">
            <section class="popup-edit-doc__section">
              <h2>Do's and Don'ts</h2>
              <div class="popup-edit-doc__guidelines">
                <div
                  class="popup-edit-doc__guideline popup-edit-doc__guideline--do"
                >
                  <h4><mat-icon>check_circle</mat-icon> Do</h4>
                  <ul>
                    <li>Use for single-field inline edits</li>
                    <li>Provide clear labels in the popup</li>
                    <li>Show the current value as the display content</li>
                    <li>Add validation for required fields</li>
                  </ul>
                </div>
                <div
                  class="popup-edit-doc__guideline popup-edit-doc__guideline--dont"
                >
                  <h4><mat-icon>cancel</mat-icon> Don't</h4>
                  <ul>
                    <li>Use for multi-field forms (use dialogs instead)</li>
                    <li>Hide the edit icon completely on important fields</li>
                    <li>Use for sensitive data without confirmation</li>
                    <li>Forget to handle save errors gracefully</li>
                  </ul>
                </div>
              </div>
            </section>

            <section class="popup-edit-doc__section">
              <h2>Accessibility</h2>
              <ul class="popup-edit-doc__a11y-list">
                <li>
                  <mat-icon>keyboard</mat-icon>
                  <strong>Keyboard:</strong> Full keyboard navigation with Enter
                  to save, Escape to cancel
                </li>
                <li>
                  <mat-icon>visibility</mat-icon>
                  <strong>Focus:</strong> Auto-focus on input when popup opens
                </li>
                <li>
                  <mat-icon>touch_app</mat-icon>
                  <strong>Click outside:</strong> Clicking backdrop cancels
                  editing
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
      .popup-edit-doc {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--ax-spacing-xl, 1.5rem);
      }

      .popup-edit-doc__tabs {
        margin-top: var(--ax-spacing-xl, 1.5rem);
      }

      .popup-edit-doc__tab-content {
        padding: var(--ax-spacing-xl, 1.5rem) 0;
      }

      .popup-edit-doc__section {
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

      .popup-edit-doc__demo-row {
        display: flex;
        gap: var(--ax-spacing-xl);
        flex-wrap: wrap;
      }

      .popup-edit-doc__demo-column {
        display: flex;
        flex-direction: column;
        gap: var(--ax-spacing-md);
      }

      .popup-edit-doc__field {
        display: flex;
        align-items: center;
        gap: var(--ax-spacing-sm);
      }

      .popup-edit-doc__label {
        font-size: var(--ax-text-sm);
        font-weight: 500;
        color: var(--ax-text-secondary);
        min-width: 80px;
      }

      .popup-edit-doc__table-container {
        overflow-x: auto;
      }

      .popup-edit-doc__table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-lg);

        th,
        td {
          padding: var(--ax-spacing-sm) var(--ax-spacing-md);
          text-align: left;
          border-bottom: 1px solid var(--ax-border-default);
          font-size: var(--ax-text-sm);
        }

        th {
          background: var(--ax-background-subtle);
          font-weight: 600;
        }

        tr:last-child td {
          border-bottom: none;
        }
      }

      .popup-edit-doc__status {
        padding: 2px 8px;
        border-radius: var(--ax-radius-full);
        font-size: var(--ax-text-xs);
        background: var(--ax-warning-faint);
        color: var(--ax-warning);

        &--active {
          background: var(--ax-success-faint);
          color: var(--ax-success);
        }
      }

      .popup-edit-doc__profile {
        display: flex;
        gap: var(--ax-spacing-lg);
        padding: var(--ax-spacing-lg);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-lg);
        max-width: 500px;
      }

      .popup-edit-doc__profile-avatar {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: var(--ax-primary);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: 600;
        flex-shrink: 0;
      }

      .popup-edit-doc__profile-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: var(--ax-spacing-xs);
      }

      .popup-edit-doc__profile-field {
        display: flex;
        align-items: center;
        gap: var(--ax-spacing-sm);

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
          color: var(--ax-text-subtle);
        }

        &--full {
          align-items: flex-start;

          mat-icon {
            margin-top: 4px;
          }
        }
      }

      .popup-edit-doc__settings {
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-lg);
        overflow: hidden;
        max-width: 400px;
      }

      .popup-edit-doc__setting {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--ax-spacing-sm) var(--ax-spacing-md);
        border-bottom: 1px solid var(--ax-border-default);

        &:last-child {
          border-bottom: none;
        }
      }

      .popup-edit-doc__setting-label {
        display: flex;
        align-items: center;
        gap: var(--ax-spacing-sm);
        font-size: var(--ax-text-sm);

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
          color: var(--ax-text-subtle);
        }
      }

      .popup-edit-doc__api-table {
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

      .popup-edit-doc__guidelines {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--ax-spacing-lg);
      }

      .popup-edit-doc__guideline {
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

      .popup-edit-doc__a11y-list {
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
export class PopupEditDocComponent {
  userName = 'John Doe';
  userEmail = 'john@example.com';
  textValue = 'Product Title';
  numberValue = 42;
  textareaValue =
    'This is a longer description that can be edited in a textarea field for multi-line content.';
  statusValue = 'Active';
  quickValue = 'Quick edit value';
  readOnlyValue = 'Cannot edit this';

  products = [
    { id: 1, name: 'Widget Pro', price: 29.99, stock: 150, status: 'Active' },
    { id: 2, name: 'Gadget Plus', price: 49.99, stock: 75, status: 'Active' },
    {
      id: 3,
      name: 'Tool Basic',
      price: 19.99,
      stock: 0,
      status: 'Out of Stock',
    },
  ];

  profileData = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1 (555) 123-4567',
    title: 'Senior Developer',
    bio: 'Passionate about building great user experiences and writing clean code.',
  };

  settings = [
    {
      key: 'company',
      label: 'Company Name',
      value: 'Acme Corp',
      icon: 'business',
    },
    {
      key: 'timezone',
      label: 'Timezone',
      value: 'UTC-5 (EST)',
      icon: 'schedule',
    },
    { key: 'language', label: 'Language', value: 'English', icon: 'language' },
    {
      key: 'currency',
      label: 'Currency',
      value: 'USD ($)',
      icon: 'attach_money',
    },
  ];

  onSave(field: string, value: string | number) {
    console.log(`Saved ${field}:`, value);
  }

  basicUsageCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-popup-edit
  [(value)]="userName"
  label="Name"
  (saveEvent)="onSave($event)">
  {{ userName }}
</ax-popup-edit>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { AxPopupEditComponent } from '@aegisx/ui';

@Component({
  imports: [AxPopupEditComponent],
})
export class MyComponent {
  userName = 'John Doe';

  onSave(newValue: string | number) {
    console.log('Saved:', newValue);
    // Call API to save the value
  }
}`,
    },
  ];

  inputTypesCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Text input (default) -->
<ax-popup-edit [(value)]="title" type="text" label="Title">
  {{ title }}
</ax-popup-edit>

<!-- Number input -->
<ax-popup-edit [(value)]="quantity" type="number" label="Quantity">
  {{ quantity }} items
</ax-popup-edit>

<!-- Textarea for longer text -->
<ax-popup-edit
  [(value)]="description"
  type="textarea"
  label="Description"
  [rows]="3">
  {{ description | slice:0:50 }}...
</ax-popup-edit>`,
    },
  ];

  labelsCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-popup-edit
  [(value)]="status"
  label="Status"
  saveLabel="Update"
  cancelLabel="Discard">
  {{ status }}
</ax-popup-edit>`,
    },
  ];

  quickEditCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Quick edit without buttons -->
<ax-popup-edit
  [(value)]="value"
  [showButtons]="false"
  placeholder="Type and press Enter">
  {{ value || 'Click to edit' }}
</ax-popup-edit>`,
    },
  ];

  disabledCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-popup-edit [(value)]="value" [disabled]="true">
  {{ value }}
</ax-popup-edit>`,
    },
  ];

  editableTableCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<table class="data-table">
  <thead>
    <tr>
      <th>Product</th>
      <th>Price</th>
      <th>Stock</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    @for (product of products; track product.id) {
      <tr>
        <td>
          <ax-popup-edit [(value)]="product.name" label="Product Name">
            {{ product.name }}
          </ax-popup-edit>
        </td>
        <td>
          <ax-popup-edit
            [(value)]="product.price"
            type="number"
            label="Price"
            (saveEvent)="updateProduct(product)">
            \${{ product.price }}
          </ax-popup-edit>
        </td>
        <td>
          <ax-popup-edit [(value)]="product.stock" type="number" label="Stock">
            {{ product.stock }} units
          </ax-popup-edit>
        </td>
        <td>
          <ax-popup-edit [(value)]="product.status" label="Status">
            <span [class.active]="product.status === 'Active'">
              {{ product.status }}
            </span>
          </ax-popup-edit>
        </td>
      </tr>
    }
  </tbody>
</table>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  status: string;
}

@Component({
  imports: [AxPopupEditComponent],
})
export class ProductTableComponent {
  products: Product[] = [
    { id: 1, name: 'Widget Pro', price: 29.99, stock: 150, status: 'Active' },
    { id: 2, name: 'Gadget Plus', price: 49.99, stock: 75, status: 'Active' },
  ];

  updateProduct(product: Product) {
    this.productService.update(product).subscribe();
  }
}`,
    },
  ];

  profileCardCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<div class="profile-card">
  <div class="profile-avatar">{{ profile.name.charAt(0) }}</div>
  <div class="profile-info">
    <div class="profile-field">
      <mat-icon>person</mat-icon>
      <ax-popup-edit [(value)]="profile.name" label="Full Name">
        <strong>{{ profile.name }}</strong>
      </ax-popup-edit>
    </div>
    <div class="profile-field">
      <mat-icon>email</mat-icon>
      <ax-popup-edit [(value)]="profile.email" label="Email">
        {{ profile.email }}
      </ax-popup-edit>
    </div>
    <div class="profile-field">
      <mat-icon>phone</mat-icon>
      <ax-popup-edit [(value)]="profile.phone" label="Phone">
        {{ profile.phone }}
      </ax-popup-edit>
    </div>
    <div class="profile-field">
      <mat-icon>notes</mat-icon>
      <ax-popup-edit
        [(value)]="profile.bio"
        type="textarea"
        label="Bio"
        [rows]="3">
        {{ profile.bio }}
      </ax-popup-edit>
    </div>
  </div>
</div>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `@Component({
  imports: [AxPopupEditComponent, MatIconModule],
})
export class ProfileCardComponent {
  profile = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1 (555) 123-4567',
    bio: 'Passionate about building great user experiences.',
  };
}`,
    },
  ];

  settingsListCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<div class="settings-list">
  @for (setting of settings; track setting.key) {
    <div class="setting-item">
      <div class="setting-label">
        <mat-icon>{{ setting.icon }}</mat-icon>
        <span>{{ setting.label }}</span>
      </div>
      <ax-popup-edit
        [(value)]="setting.value"
        [label]="setting.label"
        (saveEvent)="saveSetting(setting)">
        {{ setting.value }}
      </ax-popup-edit>
    </div>
  }
</div>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `interface Setting {
  key: string;
  label: string;
  value: string;
  icon: string;
}

@Component({
  imports: [AxPopupEditComponent, MatIconModule],
})
export class SettingsComponent {
  settings: Setting[] = [
    { key: 'company', label: 'Company Name', value: 'Acme Corp', icon: 'business' },
    { key: 'timezone', label: 'Timezone', value: 'UTC-5 (EST)', icon: 'schedule' },
    { key: 'language', label: 'Language', value: 'English', icon: 'language' },
    { key: 'currency', label: 'Currency', value: 'USD ($)', icon: 'attach_money' },
  ];

  saveSetting(setting: Setting) {
    this.settingsService.update(setting.key, setting.value).subscribe();
  }
}`,
    },
  ];

  popupEditTokens: ComponentToken[] = [
    {
      category: 'Colors',
      cssVar: '--ax-background-default',
      usage: 'Popup panel background',
    },
    {
      category: 'Colors',
      cssVar: '--ax-background-subtle',
      usage: 'Hover state background',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-subtle',
      usage: 'Edit icon color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-border-default',
      usage: 'Panel border color',
    },
    {
      category: 'Borders',
      cssVar: '--ax-radius-sm',
      usage: 'Trigger border radius',
    },
    {
      category: 'Borders',
      cssVar: '--ax-radius-lg',
      usage: 'Panel border radius',
    },
    {
      category: 'Effects',
      cssVar: '--ax-shadow-lg',
      usage: 'Panel shadow',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-md',
      usage: 'Panel padding',
    },
  ];
}
