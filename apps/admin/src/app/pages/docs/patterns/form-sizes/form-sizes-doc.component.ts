import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
} from '../../../../components/docs';

interface SizeVariant {
  name: string;
  className: string;
  formHeight: string;
  buttonHeight: string;
  fontSize: string;
  useCase: string;
  recommended?: boolean;
}

@Component({
  selector: 'app-form-sizes-doc',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
  ],
  template: `
    <div class="form-sizes-doc">
      <ax-doc-header
        title="Form Sizes"
        icon="format_size"
        description="Pre-configured form size utilities for consistent sizing across your application."
        [breadcrumbs]="[
          { label: 'Patterns', link: '/docs/patterns/form-sizes' },
          { label: 'Form Sizes' },
        ]"
        status="stable"
        version="1.0.0"
        [showImport]="false"
      ></ax-doc-header>

      <!-- Tabs -->
      <mat-tab-group class="docs-tabs" animationDuration="200ms">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="py-6">
            <section class="mb-8">
              <h2 class="text-2xl font-semibold mb-4">Introduction</h2>
              <p class="text-on-surface-variant mb-4">
                AegisX provides two form size variants to ensure consistent form
                field and button sizing. Use
                <code class="bg-surface-container px-2 py-1 rounded"
                  >.form-compact</code
                >
                for dense interfaces like CRUD tables, and
                <code class="bg-surface-container px-2 py-1 rounded"
                  >.form-standard</code
                >
                for general forms following Material Design 3 defaults.
              </p>
            </section>

            <!-- Size Comparison Table -->
            <section class="mb-8">
              <h3 class="text-xl font-semibold mb-4">Size Comparison</h3>
              <mat-card appearance="outlined">
                <table mat-table [dataSource]="sizeVariants" class="w-full">
                  <ng-container matColumnDef="variant">
                    <th mat-header-cell *matHeaderCellDef class="font-semibold">
                      Variant
                    </th>
                    <td mat-cell *matCellDef="let row">
                      <div>
                        <span class="font-semibold">{{ row.name }}</span>
                        @if (row.recommended) {
                          <span
                            class="ml-2 text-xs bg-primary-container text-primary px-2 py-0.5 rounded"
                            >Recommended</span
                          >
                        }
                      </div>
                      <code class="text-xs text-on-surface-variant"
                        >.{{ row.className }}</code
                      >
                    </td>
                  </ng-container>
                  <ng-container matColumnDef="formHeight">
                    <th mat-header-cell *matHeaderCellDef class="font-semibold">
                      Form Height
                    </th>
                    <td mat-cell *matCellDef="let row">{{ row.formHeight }}</td>
                  </ng-container>
                  <ng-container matColumnDef="buttonHeight">
                    <th mat-header-cell *matHeaderCellDef class="font-semibold">
                      Button Height
                    </th>
                    <td mat-cell *matCellDef="let row">
                      {{ row.buttonHeight }}
                    </td>
                  </ng-container>
                  <ng-container matColumnDef="fontSize">
                    <th mat-header-cell *matHeaderCellDef class="font-semibold">
                      Font Size
                    </th>
                    <td mat-cell *matCellDef="let row">{{ row.fontSize }}</td>
                  </ng-container>
                  <ng-container matColumnDef="useCase">
                    <th mat-header-cell *matHeaderCellDef class="font-semibold">
                      Best For
                    </th>
                    <td mat-cell *matCellDef="let row">{{ row.useCase }}</td>
                  </ng-container>
                  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                  <tr
                    mat-row
                    *matRowDef="let row; columns: displayedColumns"
                  ></tr>
                </table>
              </mat-card>
            </section>

            <!-- Quick Usage -->
            <section>
              <h3 class="text-xl font-semibold mb-4">Quick Usage</h3>
              <ax-code-tabs [tabs]="quickUsageCode" />
            </section>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="py-6 space-y-8">
            <!-- Compact Example -->
            <section>
              <h3 class="text-xl font-semibold mb-4">Compact (form-compact)</h3>
              <p class="text-on-surface-variant mb-4">
                40px form fields, 36px buttons - Ideal for dense interfaces
              </p>
              <ax-live-preview title="Compact Form Example">
                <div class="form-compact">
                  <div class="grid md:grid-cols-3 gap-4">
                    <mat-form-field
                      appearance="outline"
                      subscriptSizing="dynamic"
                      class="w-full"
                    >
                      <mat-label>Search Query</mat-label>
                      <mat-icon matPrefix>search</mat-icon>
                      <input matInput placeholder="Search..." />
                    </mat-form-field>
                    <mat-form-field
                      appearance="outline"
                      subscriptSizing="dynamic"
                      class="w-full"
                    >
                      <mat-label>Filter By</mat-label>
                      <mat-icon matPrefix>filter_list</mat-icon>
                      <input matInput placeholder="Filter..." />
                    </mat-form-field>
                    <div class="flex items-center gap-2">
                      <button mat-flat-button color="primary">
                        <mat-icon>search</mat-icon>
                        Search
                      </button>
                      <button mat-stroked-button>Clear</button>
                    </div>
                  </div>
                </div>
              </ax-live-preview>
              <ax-code-tabs [tabs]="compactExampleCode" />
            </section>

            <!-- Standard Example -->
            <section>
              <h3 class="text-xl font-semibold mb-4">
                Standard (form-standard)
              </h3>
              <p class="text-on-surface-variant mb-4">
                48px form fields, 40px buttons - Material Design 3 default
              </p>
              <ax-live-preview title="Standard Form Example">
                <div class="form-standard">
                  <div class="grid md:grid-cols-2 gap-4 mb-4">
                    <mat-form-field appearance="outline" class="w-full">
                      <mat-label>Full Name</mat-label>
                      <mat-icon matPrefix>person</mat-icon>
                      <input matInput placeholder="Enter your name" />
                    </mat-form-field>
                    <mat-form-field appearance="outline" class="w-full">
                      <mat-label>Email Address</mat-label>
                      <mat-icon matPrefix>email</mat-icon>
                      <input matInput placeholder="Enter your email" />
                    </mat-form-field>
                  </div>
                  <div class="flex gap-2">
                    <button mat-flat-button color="primary">
                      <mat-icon>save</mat-icon>
                      Save Changes
                    </button>
                    <button mat-stroked-button>Cancel</button>
                  </div>
                </div>
              </ax-live-preview>
              <ax-code-tabs [tabs]="standardExampleCode" />
            </section>

            <!-- Side by Side Comparison -->
            <section>
              <h3 class="text-xl font-semibold mb-4">
                Side-by-Side Comparison
              </h3>
              <div class="grid md:grid-cols-2 gap-6">
                <mat-card appearance="outlined" class="p-4">
                  <h4 class="font-semibold mb-3 flex items-center gap-2">
                    <span
                      class="text-xs bg-primary-container text-primary px-2 py-0.5 rounded"
                      >Recommended</span
                    >
                    Compact
                  </h4>
                  <div class="form-compact space-y-3">
                    <mat-form-field appearance="outline" class="w-full">
                      <mat-label>Username</mat-label>
                      <input matInput />
                    </mat-form-field>
                    <button mat-flat-button color="primary" class="w-full">
                      Login
                    </button>
                  </div>
                </mat-card>

                <mat-card appearance="outlined" class="p-4">
                  <h4 class="font-semibold mb-3">Standard</h4>
                  <div class="form-standard space-y-3">
                    <mat-form-field appearance="outline" class="w-full">
                      <mat-label>Username</mat-label>
                      <input matInput />
                    </mat-form-field>
                    <button mat-flat-button color="primary" class="w-full">
                      Login
                    </button>
                  </div>
                </mat-card>
              </div>
            </section>

            <!-- Real World Use Cases -->
            <section>
              <h3 class="text-xl font-semibold mb-4">Real World Use Cases</h3>
              <div class="space-y-4">
                <mat-card appearance="outlined" class="p-4">
                  <h4 class="font-semibold mb-2">
                    CRUD Table Filters (form-compact)
                  </h4>
                  <p class="text-sm text-on-surface-variant mb-3">
                    Use compact forms for table filters, search bars, and inline
                    editing in data-heavy interfaces.
                  </p>
                  <div class="form-compact flex flex-wrap gap-3">
                    <mat-form-field
                      appearance="outline"
                      class="flex-1 min-w-48"
                    >
                      <mat-label>Search users...</mat-label>
                      <mat-icon matPrefix>search</mat-icon>
                      <input matInput />
                    </mat-form-field>
                    <mat-form-field appearance="outline" class="w-40">
                      <mat-label>Status</mat-label>
                      <input matInput value="Active" />
                    </mat-form-field>
                    <button mat-flat-button color="primary">
                      Apply Filters
                    </button>
                  </div>
                </mat-card>

                <mat-card appearance="outlined" class="p-4">
                  <h4 class="font-semibold mb-2">
                    Settings Page (form-standard)
                  </h4>
                  <p class="text-sm text-on-surface-variant mb-3">
                    Use standard forms for user settings, profile pages, and
                    primary data entry forms.
                  </p>
                  <div class="form-standard space-y-4">
                    <mat-form-field appearance="outline" class="w-full">
                      <mat-label>Display Name</mat-label>
                      <input matInput value="John Doe" />
                    </mat-form-field>
                    <mat-form-field appearance="outline" class="w-full">
                      <mat-label>Bio</mat-label>
                      <input matInput value="Software Developer" />
                    </mat-form-field>
                    <button mat-flat-button color="primary">
                      Update Profile
                    </button>
                  </div>
                </mat-card>
              </div>
            </section>
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="py-6 space-y-8">
            <!-- Available Classes -->
            <section>
              <h3 class="text-xl font-semibold mb-4">Available CSS Classes</h3>
              <mat-card appearance="outlined">
                <table mat-table [dataSource]="cssClassesData" class="w-full">
                  <ng-container matColumnDef="class">
                    <th mat-header-cell *matHeaderCellDef class="font-semibold">
                      Class
                    </th>
                    <td mat-cell *matCellDef="let row">
                      <code class="text-sm text-primary">{{ row.class }}</code>
                    </td>
                  </ng-container>
                  <ng-container matColumnDef="formField">
                    <th mat-header-cell *matHeaderCellDef class="font-semibold">
                      Form Field Height
                    </th>
                    <td mat-cell *matCellDef="let row">{{ row.formField }}</td>
                  </ng-container>
                  <ng-container matColumnDef="button">
                    <th mat-header-cell *matHeaderCellDef class="font-semibold">
                      Button Height
                    </th>
                    <td mat-cell *matCellDef="let row">{{ row.button }}</td>
                  </ng-container>
                  <ng-container matColumnDef="description">
                    <th mat-header-cell *matHeaderCellDef class="font-semibold">
                      Description
                    </th>
                    <td mat-cell *matCellDef="let row">
                      {{ row.description }}
                    </td>
                  </ng-container>
                  <tr
                    mat-header-row
                    *matHeaderRowDef="[
                      'class',
                      'formField',
                      'button',
                      'description',
                    ]"
                  ></tr>
                  <tr
                    mat-row
                    *matRowDef="
                      let row;
                      columns: ['class', 'formField', 'button', 'description']
                    "
                  ></tr>
                </table>
              </mat-card>
            </section>

            <!-- How It Works -->
            <section>
              <h3 class="text-xl font-semibold mb-4">How It Works</h3>
              <ax-code-tabs [tabs]="howItWorksCode" />
            </section>

            <!-- Integration -->
            <section>
              <h3 class="text-xl font-semibold mb-4">
                Integration with Components
              </h3>
              <p class="text-on-surface-variant mb-4">
                These classes work with all Angular Material form components:
              </p>
              <div class="grid md:grid-cols-2 gap-4">
                @for (component of supportedComponents; track component.name) {
                  <mat-card appearance="outlined" class="p-3">
                    <div class="flex items-center gap-2">
                      <mat-icon class="text-primary">{{
                        component.icon
                      }}</mat-icon>
                      <span class="font-medium">{{ component.name }}</span>
                    </div>
                    <p class="text-sm text-on-surface-variant mt-1">
                      {{ component.description }}
                    </p>
                  </mat-card>
                }
              </div>
            </section>
          </div>
        </mat-tab>

        <!-- Tokens Tab -->
        <mat-tab label="Tokens">
          <div class="py-6 space-y-8">
            <!-- CSS Variables -->
            <section>
              <h3 class="text-xl font-semibold mb-4">CSS Variables</h3>
              <ax-code-tabs [tabs]="cssVariablesCode" />
            </section>

            <!-- Design Tokens Mapping -->
            <section>
              <h3 class="text-xl font-semibold mb-4">Design Token Mapping</h3>
              <div class="grid md:grid-cols-2 gap-4">
                <mat-card appearance="outlined" class="p-4">
                  <h4 class="font-semibold mb-3">Compact Tokens</h4>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <code>Form field height</code>
                      <span class="text-on-surface-variant">40px</span>
                    </div>
                    <div class="flex justify-between">
                      <code>Button height</code>
                      <span class="text-on-surface-variant">36px</span>
                    </div>
                    <div class="flex justify-between">
                      <code>Font size</code>
                      <span class="text-on-surface-variant"
                        >0.875rem (14px)</span
                      >
                    </div>
                    <div class="flex justify-between">
                      <code>Padding</code>
                      <span class="text-on-surface-variant">8px vertical</span>
                    </div>
                  </div>
                </mat-card>

                <mat-card appearance="outlined" class="p-4">
                  <h4 class="font-semibold mb-3">Standard Tokens</h4>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <code>Form field height</code>
                      <span class="text-on-surface-variant">48px</span>
                    </div>
                    <div class="flex justify-between">
                      <code>Button height</code>
                      <span class="text-on-surface-variant">40px</span>
                    </div>
                    <div class="flex justify-between">
                      <code>Font size</code>
                      <span class="text-on-surface-variant">1rem (16px)</span>
                    </div>
                    <div class="flex justify-between">
                      <code>Padding</code>
                      <span class="text-on-surface-variant">12px vertical</span>
                    </div>
                  </div>
                </mat-card>
              </div>
            </section>
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="py-6 space-y-8">
            <!-- Best Practices -->
            <section>
              <h3 class="text-xl font-semibold mb-4">Best Practices</h3>
              <div class="grid md:grid-cols-2 gap-6">
                <mat-card appearance="outlined" class="p-4">
                  <h4
                    class="font-semibold text-success mb-3 flex items-center gap-2"
                  >
                    <mat-icon>check_circle</mat-icon>
                    Do
                  </h4>
                  <ul class="space-y-2 text-sm text-on-surface-variant">
                    <li>
                      Use <code>.form-compact</code> for Tremor-style CRUD
                      interfaces
                    </li>
                    <li>
                      Use <code>.form-standard</code> as default for general
                      forms
                    </li>
                    <li>
                      Maintain consistency within the same feature or page
                    </li>
                    <li>Test on mobile devices (minimum 44px touch targets)</li>
                    <li>
                      Apply size class to a wrapper container, not individual
                      fields
                    </li>
                  </ul>
                </mat-card>

                <mat-card appearance="outlined" class="p-4">
                  <h4
                    class="font-semibold text-error mb-3 flex items-center gap-2"
                  >
                    <mat-icon>cancel</mat-icon>
                    Don't
                  </h4>
                  <ul class="space-y-2 text-sm text-on-surface-variant">
                    <li>Mix different sizes in the same form</li>
                    <li>
                      Use <code>.form-compact</code> for primary user input
                      forms
                    </li>
                    <li>
                      Use <code>.form-standard</code> for dense data tables
                    </li>
                    <li>Ignore accessibility requirements</li>
                    <li>Apply size classes to individual form fields</li>
                  </ul>
                </mat-card>
              </div>
            </section>

            <!-- When to Use Each -->
            <section>
              <h3 class="text-xl font-semibold mb-4">When to Use Each Size</h3>
              <div class="space-y-4">
                <mat-card appearance="outlined" class="p-4">
                  <h4 class="font-semibold text-primary mb-2">
                    Use Compact For:
                  </h4>
                  <ul class="space-y-1 text-sm text-on-surface-variant">
                    <li>CRUD table filters and search bars</li>
                    <li>Dashboard widgets with limited space</li>
                    <li>Inline editing in tables</li>
                    <li>Dialog forms where space is limited</li>
                    <li>Toolbar actions and quick filters</li>
                  </ul>
                </mat-card>

                <mat-card appearance="outlined" class="p-4">
                  <h4 class="font-semibold text-secondary mb-2">
                    Use Standard For:
                  </h4>
                  <ul class="space-y-1 text-sm text-on-surface-variant">
                    <li>User registration and login forms</li>
                    <li>Settings and profile pages</li>
                    <li>Contact forms</li>
                    <li>Checkout and payment forms</li>
                    <li>Any primary user data entry</li>
                  </ul>
                </mat-card>
              </div>
            </section>

            <!-- Accessibility -->
            <section>
              <h3 class="text-xl font-semibold mb-4">Accessibility</h3>
              <mat-card appearance="outlined" class="p-4">
                <ul class="space-y-3 text-sm text-on-surface-variant">
                  <li class="flex items-start gap-2">
                    <mat-icon class="text-primary text-lg"
                      >accessibility</mat-icon
                    >
                    <span
                      ><strong>Touch targets:</strong> Both sizes meet the
                      minimum 44px touch target on mobile when including
                      padding</span
                    >
                  </li>
                  <li class="flex items-start gap-2">
                    <mat-icon class="text-primary text-lg"
                      >accessibility</mat-icon
                    >
                    <span
                      ><strong>Font size:</strong> Compact uses 14px (0.875rem),
                      Standard uses 16px (1rem) - both readable</span
                    >
                  </li>
                  <li class="flex items-start gap-2">
                    <mat-icon class="text-primary text-lg"
                      >accessibility</mat-icon
                    >
                    <span
                      ><strong>Focus states:</strong> Both sizes maintain
                      visible focus indicators</span
                    >
                  </li>
                  <li class="flex items-start gap-2">
                    <mat-icon class="text-warning text-lg">warning</mat-icon>
                    <span
                      ><strong>Note:</strong> For mobile-primary interfaces,
                      prefer Standard size for better usability</span
                    >
                  </li>
                </ul>
              </mat-card>
            </section>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .docs-tabs ::ng-deep .mat-mdc-tab-body-wrapper {
        flex: 1;
      }

      pre {
        margin: 0;
        white-space: pre-wrap;
        word-break: break-word;
      }

      code {
        font-family: 'Fira Code', 'Consolas', monospace;
      }
    `,
  ],
})
export class FormSizesDocComponent {
  displayedColumns = [
    'variant',
    'formHeight',
    'buttonHeight',
    'fontSize',
    'useCase',
  ];

  sizeVariants: SizeVariant[] = [
    {
      name: 'Compact',
      className: 'form-compact',
      formHeight: '40px',
      buttonHeight: '36px',
      fontSize: '14px (0.875rem)',
      useCase: 'CRUD tables, dashboards, dense interfaces',
      recommended: true,
    },
    {
      name: 'Standard',
      className: 'form-standard',
      formHeight: '48px',
      buttonHeight: '40px',
      fontSize: '16px (1rem)',
      useCase: 'General forms, settings, primary data entry',
    },
  ];

  cssClassesData = [
    {
      class: '.form-compact',
      formField: '40px',
      button: '36px',
      description: 'Dense sizing for CRUD tables and dashboards',
    },
    {
      class: '.form-standard',
      formField: '48px',
      button: '40px',
      description: 'Material Design 3 default sizing',
    },
  ];

  supportedComponents = [
    {
      name: 'mat-form-field',
      icon: 'input',
      description: 'Text inputs, selects, autocomplete',
    },
    {
      name: 'mat-select',
      icon: 'arrow_drop_down',
      description: 'Dropdown select menus',
    },
    {
      name: 'mat-datepicker',
      icon: 'calendar_today',
      description: 'Date picker inputs',
    },
    {
      name: 'mat-button',
      icon: 'smart_button',
      description: 'All button variants',
    },
    {
      name: 'mat-checkbox',
      icon: 'check_box',
      description: 'Checkbox controls',
    },
    {
      name: 'mat-radio',
      icon: 'radio_button_checked',
      description: 'Radio button groups',
    },
  ];

  // Code Examples
  compactExampleCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<div class="form-compact">
  <div class="grid md:grid-cols-3 gap-4">
    <mat-form-field appearance="outline" subscriptSizing="dynamic" class="w-full">
      <mat-label>Search Query</mat-label>
      <mat-icon matPrefix>search</mat-icon>
      <input matInput placeholder="Search...">
    </mat-form-field>

    <mat-form-field appearance="outline" subscriptSizing="dynamic" class="w-full">
      <mat-label>Filter By</mat-label>
      <mat-icon matPrefix>filter_list</mat-icon>
      <input matInput placeholder="Filter...">
    </mat-form-field>

    <div class="flex items-center gap-2">
      <button mat-flat-button color="primary">
        <mat-icon>search</mat-icon>
        Search
      </button>
      <button mat-stroked-button>Clear</button>
    </div>
  </div>
</div>`,
    },
  ];

  standardExampleCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<div class="form-standard">
  <div class="grid md:grid-cols-2 gap-4 mb-4">
    <mat-form-field appearance="outline" class="w-full">
      <mat-label>Full Name</mat-label>
      <mat-icon matPrefix>person</mat-icon>
      <input matInput placeholder="Enter your name">
    </mat-form-field>

    <mat-form-field appearance="outline" class="w-full">
      <mat-label>Email Address</mat-label>
      <mat-icon matPrefix>email</mat-icon>
      <input matInput placeholder="Enter your email">
    </mat-form-field>
  </div>

  <div class="flex gap-2">
    <button mat-flat-button color="primary">
      <mat-icon>save</mat-icon>
      Save Changes
    </button>
    <button mat-stroked-button>Cancel</button>
  </div>
</div>`,
    },
  ];

  quickUsageCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<!-- Compact forms for CRUD tables and dashboards -->
<div class="form-compact">
  <mat-form-field appearance="outline">
    <mat-label>Search</mat-label>
    <input matInput>
  </mat-form-field>
  <button mat-flat-button color="primary">Search</button>
</div>

<!-- Standard forms for general use -->
<div class="form-standard">
  <mat-form-field appearance="outline">
    <mat-label>Full Name</mat-label>
    <input matInput>
  </mat-form-field>
  <button mat-flat-button color="primary">Save</button>
</div>`,
    },
  ];

  howItWorksCode = [
    {
      language: 'scss' as const,
      label: 'SCSS',
      code: `/* The .form-compact class applies these styles */
.form-compact {
  /* Form fields */
  --mdc-outlined-text-field-container-height: 40px;

  /* Buttons */
  button {
    height: 36px;
    font-size: 0.875rem;
  }
}

/* The .form-standard class applies these styles */
.form-standard {
  /* Form fields - Material Design 3 default */
  --mdc-outlined-text-field-container-height: 48px;

  /* Buttons */
  button {
    height: 40px;
    font-size: 1rem;
  }
}`,
    },
  ];

  cssVariablesCode = [
    {
      language: 'scss' as const,
      label: 'SCSS',
      code: `/* Compact Form Variables */
.form-compact {
  --mdc-outlined-text-field-container-height: 40px;
  --mdc-filled-text-field-container-height: 40px;
  --mat-form-field-container-vertical-padding: 8px;
}

/* Standard Form Variables */
.form-standard {
  --mdc-outlined-text-field-container-height: 48px;
  --mdc-filled-text-field-container-height: 48px;
  --mat-form-field-container-vertical-padding: 12px;
}

/* Button Height Variables */
--ax-button-height-compact: 36px;
--ax-button-height-standard: 40px;`,
    },
  ];
}
