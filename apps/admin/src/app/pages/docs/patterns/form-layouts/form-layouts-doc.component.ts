import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-form-layouts-doc',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDividerModule,
  ],
  template: `
    <div class="docs-page p-6 max-w-6xl mx-auto">
      <!-- Header -->
      <header class="mb-8">
        <div
          class="flex items-center gap-2 text-sm text-on-surface-variant mb-2"
        >
          <a routerLink="/docs/patterns/form-sizes" class="hover:text-primary"
            >Patterns</a
          >
          <mat-icon class="text-base">chevron_right</mat-icon>
          <span>Form Layouts</span>
        </div>
        <h1 class="text-4xl font-bold text-on-surface mb-2">Form Layouts</h1>
        <p class="text-lg text-on-surface-variant">
          Common form layout patterns for different use cases including
          registration, settings, and dialogs.
        </p>
      </header>

      <!-- Tabs -->
      <mat-tab-group class="docs-tabs" animationDuration="200ms">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="py-6">
            <section class="mb-8">
              <h2 class="text-2xl font-semibold mb-4">Introduction</h2>
              <p class="text-on-surface-variant mb-4">
                AegisX provides several form layout patterns optimized for
                different scenarios. All layouts use
                <code class="bg-surface-container px-2 py-1 rounded"
                  >.form-compact</code
                >
                for consistent Tremor-style sizing and are designed for
                enterprise applications.
              </p>
            </section>

            <!-- Layout Patterns Overview -->
            <section class="mb-8">
              <h3 class="text-xl font-semibold mb-4">Available Patterns</h3>
              <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                @for (pattern of layoutPatterns; track pattern.name) {
                  <mat-card appearance="outlined" class="p-4">
                    <div class="flex items-center gap-3 mb-2">
                      <mat-icon class="text-primary">{{
                        pattern.icon
                      }}</mat-icon>
                      <h4 class="font-semibold">{{ pattern.name }}</h4>
                    </div>
                    <p class="text-sm text-on-surface-variant">
                      {{ pattern.description }}
                    </p>
                  </mat-card>
                }
              </div>
            </section>

            <!-- Basic Structure -->
            <section>
              <h3 class="text-xl font-semibold mb-4">Basic Structure</h3>
              <mat-card appearance="outlined">
                <div class="p-4 bg-surface-container-lowest">
                  <pre
                    class="text-sm overflow-x-auto"
                  ><code>&lt;!-- Basic form layout structure --&gt;
&lt;div class="form-compact"&gt;
  &lt;form class="flex flex-col gap-4"&gt;
    &lt;!-- Form header --&gt;
    &lt;div class="mb-6"&gt;
      &lt;h2 class="h4"&gt;Form Title&lt;/h2&gt;
      &lt;p class="text-secondary"&gt;Description text&lt;/p&gt;
    &lt;/div&gt;

    &lt;!-- Form fields --&gt;
    &lt;mat-form-field appearance="outline"&gt;
      &lt;mat-label&gt;Field Label&lt;/mat-label&gt;
      &lt;input matInput&gt;
    &lt;/mat-form-field&gt;

    &lt;!-- Actions --&gt;
    &lt;div class="flex gap-2"&gt;
      &lt;button mat-flat-button color="primary"&gt;Submit&lt;/button&gt;
      &lt;button mat-stroked-button&gt;Cancel&lt;/button&gt;
    &lt;/div&gt;
  &lt;/form&gt;
&lt;/div&gt;</code></pre>
                </div>
              </mat-card>
            </section>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="py-6 space-y-8">
            <!-- Single Column -->
            <section>
              <h3 class="text-xl font-semibold mb-4">Single Column Layout</h3>
              <p class="text-on-surface-variant mb-4">
                Use for simple forms like registration, login, or contact forms.
              </p>
              <mat-card appearance="outlined">
                <div class="p-6 border-b border-outline-variant">
                  <div class="max-w-md mx-auto form-compact">
                    <div class="mb-4">
                      <h4 class="font-semibold">Create Account</h4>
                      <p class="text-sm text-on-surface-variant">
                        Enter your details below.
                      </p>
                    </div>
                    <div class="space-y-4">
                      <mat-form-field appearance="outline" class="w-full">
                        <mat-label>Full Name</mat-label>
                        <mat-icon matPrefix>person</mat-icon>
                        <input matInput placeholder="John Doe" />
                      </mat-form-field>
                      <mat-form-field appearance="outline" class="w-full">
                        <mat-label>Email</mat-label>
                        <mat-icon matPrefix>email</mat-icon>
                        <input matInput placeholder="john@example.com" />
                      </mat-form-field>
                      <mat-form-field appearance="outline" class="w-full">
                        <mat-label>Password</mat-label>
                        <mat-icon matPrefix>lock</mat-icon>
                        <input
                          matInput
                          type="password"
                          placeholder="••••••••"
                        />
                      </mat-form-field>
                      <div class="flex gap-2">
                        <button mat-flat-button color="primary" class="flex-1">
                          Create Account
                        </button>
                        <button mat-stroked-button>Cancel</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="p-4 bg-surface-container-lowest">
                  <pre
                    class="text-sm overflow-x-auto"
                  ><code>&lt;div class="max-w-md mx-auto form-compact"&gt;
  &lt;mat-form-field appearance="outline" class="w-full"&gt;
    &lt;mat-label&gt;Full Name&lt;/mat-label&gt;
    &lt;input matInput&gt;
  &lt;/mat-form-field&gt;
  &lt;!-- More fields --&gt;
&lt;/div&gt;</code></pre>
                </div>
              </mat-card>
            </section>

            <!-- Multi-Column -->
            <section>
              <h3 class="text-xl font-semibold mb-4">Multi-Column Layout</h3>
              <p class="text-on-surface-variant mb-4">
                Use for settings pages, profiles, or forms with many fields.
              </p>
              <mat-card appearance="outlined">
                <div class="p-6 border-b border-outline-variant">
                  <div class="form-compact">
                    <div class="mb-4">
                      <h4 class="font-semibold">Personal Information</h4>
                      <p class="text-sm text-on-surface-variant">
                        Update your personal details.
                      </p>
                    </div>
                    <div class="grid md:grid-cols-2 gap-4">
                      <mat-form-field appearance="outline">
                        <mat-label>First Name</mat-label>
                        <input matInput placeholder="John" />
                      </mat-form-field>
                      <mat-form-field appearance="outline">
                        <mat-label>Last Name</mat-label>
                        <input matInput placeholder="Doe" />
                      </mat-form-field>
                      <mat-form-field
                        appearance="outline"
                        class="md:col-span-2"
                      >
                        <mat-label>Email Address</mat-label>
                        <mat-icon matPrefix>email</mat-icon>
                        <input matInput placeholder="john@example.com" />
                      </mat-form-field>
                      <mat-form-field appearance="outline">
                        <mat-label>Phone</mat-label>
                        <mat-icon matPrefix>phone</mat-icon>
                        <input matInput placeholder="+1 (555) 000-0000" />
                      </mat-form-field>
                      <mat-form-field appearance="outline">
                        <mat-label>Country</mat-label>
                        <mat-icon matPrefix>public</mat-icon>
                        <mat-select>
                          <mat-option value="us">United States</mat-option>
                          <mat-option value="uk">United Kingdom</mat-option>
                          <mat-option value="ca">Canada</mat-option>
                        </mat-select>
                      </mat-form-field>
                    </div>
                    <div class="flex justify-end gap-2 mt-4">
                      <button mat-stroked-button>Cancel</button>
                      <button mat-flat-button color="primary">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
                <div class="p-4 bg-surface-container-lowest">
                  <pre
                    class="text-sm overflow-x-auto"
                  ><code>&lt;div class="grid md:grid-cols-2 gap-4"&gt;
  &lt;mat-form-field appearance="outline"&gt;
    &lt;mat-label&gt;First Name&lt;/mat-label&gt;
    &lt;input matInput&gt;
  &lt;/mat-form-field&gt;
  &lt;mat-form-field appearance="outline"&gt;
    &lt;mat-label&gt;Last Name&lt;/mat-label&gt;
    &lt;input matInput&gt;
  &lt;/mat-form-field&gt;
  &lt;!-- Full width field --&gt;
  &lt;mat-form-field appearance="outline" class="md:col-span-2"&gt;
    &lt;mat-label&gt;Email&lt;/mat-label&gt;
    &lt;input matInput&gt;
  &lt;/mat-form-field&gt;
&lt;/div&gt;</code></pre>
                </div>
              </mat-card>
            </section>

            <!-- Sectioned Form -->
            <section>
              <h3 class="text-xl font-semibold mb-4">Sectioned Form</h3>
              <p class="text-on-surface-variant mb-4">
                Use for complex forms with multiple categories of information.
              </p>
              <mat-card appearance="outlined">
                <div class="p-6 border-b border-outline-variant">
                  <div class="form-compact">
                    <!-- Section 1 -->
                    <div class="mb-6">
                      <h4 class="font-semibold mb-1">Account Details</h4>
                      <p class="text-sm text-on-surface-variant mb-4">
                        Your login credentials
                      </p>
                      <div class="grid md:grid-cols-2 gap-4">
                        <mat-form-field appearance="outline">
                          <mat-label>Username</mat-label>
                          <input matInput />
                        </mat-form-field>
                        <mat-form-field appearance="outline">
                          <mat-label>Email</mat-label>
                          <input matInput type="email" />
                        </mat-form-field>
                      </div>
                    </div>

                    <mat-divider class="my-6"></mat-divider>

                    <!-- Section 2 -->
                    <div class="mb-6">
                      <h4 class="font-semibold mb-1">Preferences</h4>
                      <p class="text-sm text-on-surface-variant mb-4">
                        Notification settings
                      </p>
                      <div class="space-y-3">
                        <mat-checkbox>Email notifications</mat-checkbox>
                        <mat-checkbox>Weekly summary</mat-checkbox>
                        <mat-checkbox checked>Security alerts</mat-checkbox>
                      </div>
                    </div>

                    <div class="flex justify-end gap-2">
                      <button mat-stroked-button>Cancel</button>
                      <button mat-flat-button color="primary">
                        Save Settings
                      </button>
                    </div>
                  </div>
                </div>
                <div class="p-4 bg-surface-container-lowest">
                  <pre
                    class="text-sm overflow-x-auto"
                  ><code>&lt;!-- Section 1 --&gt;
&lt;div class="mb-6"&gt;
  &lt;h4&gt;Section Title&lt;/h4&gt;
  &lt;p&gt;Section description&lt;/p&gt;
  &lt;!-- Fields --&gt;
&lt;/div&gt;

&lt;mat-divider class="my-6"&gt;&lt;/mat-divider&gt;

&lt;!-- Section 2 --&gt;
&lt;div class="mb-6"&gt;
  &lt;h4&gt;Another Section&lt;/h4&gt;
  &lt;!-- Fields --&gt;
&lt;/div&gt;</code></pre>
                </div>
              </mat-card>
            </section>

            <!-- Dialog Form -->
            <section>
              <h3 class="text-xl font-semibold mb-4">Dialog Form</h3>
              <p class="text-on-surface-variant mb-4">
                Compact form layout for dialogs with limited space.
              </p>
              <mat-card appearance="outlined">
                <div class="p-6 border-b border-outline-variant">
                  <div class="max-w-md mx-auto">
                    <mat-card appearance="outlined">
                      <div
                        class="p-4 border-b border-outline-variant flex items-center justify-between"
                      >
                        <div class="flex items-center gap-2">
                          <mat-icon class="text-primary">add_circle</mat-icon>
                          <span class="font-semibold">Add New Item</span>
                        </div>
                        <button mat-icon-button>
                          <mat-icon>close</mat-icon>
                        </button>
                      </div>
                      <div class="p-4 form-compact">
                        <div class="space-y-4">
                          <mat-form-field appearance="outline" class="w-full">
                            <mat-label>Item Name</mat-label>
                            <input matInput placeholder="Enter name" />
                          </mat-form-field>
                          <mat-form-field appearance="outline" class="w-full">
                            <mat-label>Category</mat-label>
                            <mat-select>
                              <mat-option value="product">Product</mat-option>
                              <mat-option value="service">Service</mat-option>
                            </mat-select>
                          </mat-form-field>
                        </div>
                      </div>
                      <div
                        class="p-4 border-t border-outline-variant flex justify-end gap-2"
                      >
                        <button mat-stroked-button>Cancel</button>
                        <button mat-flat-button color="primary">
                          Add Item
                        </button>
                      </div>
                    </mat-card>
                  </div>
                </div>
                <div class="p-4 bg-surface-container-lowest">
                  <pre
                    class="text-sm overflow-x-auto"
                  ><code>&lt;!-- Dialog structure --&gt;
&lt;h2 mat-dialog-title&gt;Add New Item&lt;/h2&gt;
&lt;mat-dialog-content class="form-compact"&gt;
  &lt;mat-form-field appearance="outline" class="w-full"&gt;
    &lt;mat-label&gt;Item Name&lt;/mat-label&gt;
    &lt;input matInput&gt;
  &lt;/mat-form-field&gt;
&lt;/mat-dialog-content&gt;
&lt;mat-dialog-actions align="end"&gt;
  &lt;button mat-stroked-button mat-dialog-close&gt;Cancel&lt;/button&gt;
  &lt;button mat-flat-button color="primary"&gt;Add&lt;/button&gt;
&lt;/mat-dialog-actions&gt;</code></pre>
                </div>
              </mat-card>
            </section>
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="py-6 space-y-8">
            <!-- Grid Classes -->
            <section>
              <h3 class="text-xl font-semibold mb-4">Layout Grid Classes</h3>
              <mat-card appearance="outlined">
                <table mat-table [dataSource]="gridClassesData" class="w-full">
                  <ng-container matColumnDef="class">
                    <th mat-header-cell *matHeaderCellDef class="font-semibold">
                      Class
                    </th>
                    <td mat-cell *matCellDef="let row">
                      <code class="text-sm text-primary">{{ row.class }}</code>
                    </td>
                  </ng-container>
                  <ng-container matColumnDef="description">
                    <th mat-header-cell *matHeaderCellDef class="font-semibold">
                      Description
                    </th>
                    <td mat-cell *matCellDef="let row">
                      {{ row.description }}
                    </td>
                  </ng-container>
                  <ng-container matColumnDef="useCase">
                    <th mat-header-cell *matHeaderCellDef class="font-semibold">
                      Use Case
                    </th>
                    <td mat-cell *matCellDef="let row">{{ row.useCase }}</td>
                  </ng-container>
                  <tr
                    mat-header-row
                    *matHeaderRowDef="['class', 'description', 'useCase']"
                  ></tr>
                  <tr
                    mat-row
                    *matRowDef="
                      let row;
                      columns: ['class', 'description', 'useCase']
                    "
                  ></tr>
                </table>
              </mat-card>
            </section>

            <!-- Spacing Classes -->
            <section>
              <h3 class="text-xl font-semibold mb-4">Spacing Utilities</h3>
              <mat-card appearance="outlined">
                <table
                  mat-table
                  [dataSource]="spacingClassesData"
                  class="w-full"
                >
                  <ng-container matColumnDef="class">
                    <th mat-header-cell *matHeaderCellDef class="font-semibold">
                      Class
                    </th>
                    <td mat-cell *matCellDef="let row">
                      <code class="text-sm text-primary">{{ row.class }}</code>
                    </td>
                  </ng-container>
                  <ng-container matColumnDef="value">
                    <th mat-header-cell *matHeaderCellDef class="font-semibold">
                      Value
                    </th>
                    <td mat-cell *matCellDef="let row">{{ row.value }}</td>
                  </ng-container>
                  <ng-container matColumnDef="use">
                    <th mat-header-cell *matHeaderCellDef class="font-semibold">
                      Recommended Use
                    </th>
                    <td mat-cell *matCellDef="let row">{{ row.use }}</td>
                  </ng-container>
                  <tr
                    mat-header-row
                    *matHeaderRowDef="['class', 'value', 'use']"
                  ></tr>
                  <tr
                    mat-row
                    *matRowDef="let row; columns: ['class', 'value', 'use']"
                  ></tr>
                </table>
              </mat-card>
            </section>

            <!-- Field Width Classes -->
            <section>
              <h3 class="text-xl font-semibold mb-4">Field Width Utilities</h3>
              <mat-card appearance="outlined">
                <div class="p-4 bg-surface-container-lowest">
                  <pre
                    class="text-sm overflow-x-auto"
                  ><code>/* Full width field */
&lt;mat-form-field class="w-full"&gt;...&lt;/mat-form-field&gt;

/* Span 2 columns in grid */
&lt;mat-form-field class="md:col-span-2"&gt;...&lt;/mat-form-field&gt;

/* Fixed width */
&lt;mat-form-field class="w-40"&gt;...&lt;/mat-form-field&gt;  /* 160px */
&lt;mat-form-field class="w-48"&gt;...&lt;/mat-form-field&gt;  /* 192px */
&lt;mat-form-field class="w-64"&gt;...&lt;/mat-form-field&gt;  /* 256px */

/* Flex grow */
&lt;mat-form-field class="flex-1"&gt;...&lt;/mat-form-field&gt;</code></pre>
                </div>
              </mat-card>
            </section>
          </div>
        </mat-tab>

        <!-- Tokens Tab -->
        <mat-tab label="Tokens">
          <div class="py-6 space-y-8">
            <!-- Form Layout Tokens -->
            <section>
              <h3 class="text-xl font-semibold mb-4">Form Layout CSS</h3>
              <mat-card appearance="outlined">
                <div class="p-4 bg-surface-container-lowest">
                  <pre
                    class="text-sm overflow-x-auto"
                  ><code>/* Form container */
.form-compact {{'{'}}
  --mdc-outlined-text-field-container-height: 40px;
{{'}'}}

/* Section header */
.section-title {{'{'}}
  font-size: 1rem;
  font-weight: 600;
  color: var(--md-sys-color-on-surface);
{{'}'}}

.section-description {{'{'}}
  font-size: 0.875rem;
  color: var(--md-sys-color-on-surface-variant);
{{'}'}}

/* Required field asterisk */
.required-asterisk {{'{'}}
  color: var(--md-sys-color-error);
{{'}'}}

/* Action buttons */
.form-actions {{'{'}}
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 1rem;
{{'}'}}</code></pre>
                </div>
              </mat-card>
            </section>

            <!-- Responsive Breakpoints -->
            <section>
              <h3 class="text-xl font-semibold mb-4">Responsive Breakpoints</h3>
              <div class="grid md:grid-cols-2 gap-4">
                @for (bp of breakpoints; track bp.name) {
                  <mat-card appearance="outlined" class="p-4">
                    <h4 class="font-semibold mb-2">{{ bp.name }}</h4>
                    <div class="space-y-1 text-sm">
                      <div class="flex justify-between">
                        <code>{{ bp.prefix }}</code>
                        <span class="text-on-surface-variant">{{
                          bp.width
                        }}</span>
                      </div>
                      <p class="text-on-surface-variant text-xs mt-2">
                        {{ bp.description }}
                      </p>
                    </div>
                  </mat-card>
                }
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
                      Use <code>.form-compact</code> wrapper for consistent
                      sizing
                    </li>
                    <li>Mark required fields with red asterisks</li>
                    <li>Use <code>mat-hint</code> for helper text</li>
                    <li>Group related fields using grid layouts</li>
                    <li>Separate sections with <code>mat-divider</code></li>
                    <li>Place primary action on the right</li>
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
                    <li>Mix different form sizes in same form</li>
                    <li>Create forms with more than 10-12 visible fields</li>
                    <li>Use dialogs for complex multi-section forms</li>
                    <li>Skip labels or use placeholder as label</li>
                    <li>Put important actions in hard-to-reach positions</li>
                    <li>Forget mobile responsiveness</li>
                  </ul>
                </mat-card>
              </div>
            </section>

            <!-- Layout Selection Guide -->
            <section>
              <h3 class="text-xl font-semibold mb-4">
                When to Use Each Layout
              </h3>
              <div class="space-y-4">
                @for (guide of layoutGuide; track guide.layout) {
                  <mat-card appearance="outlined" class="p-4">
                    <h4 class="font-semibold text-primary mb-2">
                      {{ guide.layout }}
                    </h4>
                    <p class="text-sm text-on-surface-variant mb-2">
                      {{ guide.description }}
                    </p>
                    <div class="flex flex-wrap gap-2">
                      @for (use of guide.uses; track use) {
                        <span
                          class="text-xs bg-surface-container px-2 py-1 rounded"
                          >{{ use }}</span
                        >
                      }
                    </div>
                  </mat-card>
                }
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
                      ><strong>Labels:</strong> Every field must have a visible
                      label, never use placeholder alone</span
                    >
                  </li>
                  <li class="flex items-start gap-2">
                    <mat-icon class="text-primary text-lg"
                      >accessibility</mat-icon
                    >
                    <span
                      ><strong>Error messages:</strong> Use
                      <code>mat-error</code> for inline validation
                      feedback</span
                    >
                  </li>
                  <li class="flex items-start gap-2">
                    <mat-icon class="text-primary text-lg"
                      >accessibility</mat-icon
                    >
                    <span
                      ><strong>Required fields:</strong> Indicate required
                      fields both visually and with
                      <code>required</code> attribute</span
                    >
                  </li>
                  <li class="flex items-start gap-2">
                    <mat-icon class="text-primary text-lg"
                      >accessibility</mat-icon
                    >
                    <span
                      ><strong>Focus order:</strong> Ensure logical tab order
                      through form fields</span
                    >
                  </li>
                  <li class="flex items-start gap-2">
                    <mat-icon class="text-primary text-lg"
                      >accessibility</mat-icon
                    >
                    <span
                      ><strong>Button labels:</strong> Use descriptive button
                      text ("Save Changes" not just "Submit")</span
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
export class FormLayoutsDocComponent {
  layoutPatterns = [
    {
      icon: 'view_agenda',
      name: 'Single Column',
      description: 'Simple forms like login, registration',
    },
    {
      icon: 'grid_view',
      name: 'Multi-Column',
      description: 'Settings pages, profiles with many fields',
    },
    {
      icon: 'view_list',
      name: 'Sectioned',
      description: 'Complex forms with multiple categories',
    },
    {
      icon: 'open_in_new',
      name: 'Dialog Form',
      description: 'Quick add, edit, and confirmation dialogs',
    },
    {
      icon: 'credit_card',
      name: 'With Selection',
      description: 'Forms with plan/option selection',
    },
    {
      icon: 'filter_list',
      name: 'Inline Filters',
      description: 'Table filters and search forms',
    },
  ];

  gridClassesData = [
    {
      class: 'grid grid-cols-1',
      description: 'Single column layout',
      useCase: 'Mobile, simple forms',
    },
    {
      class: 'grid md:grid-cols-2',
      description: '2 columns on md screens',
      useCase: 'Most common pattern',
    },
    {
      class: 'grid lg:grid-cols-3',
      description: '3 columns on lg screens',
      useCase: 'Dashboard filters',
    },
    {
      class: 'md:col-span-2',
      description: 'Span 2 columns',
      useCase: 'Full-width fields in grid',
    },
    {
      class: 'flex flex-col',
      description: 'Vertical flex layout',
      useCase: 'Form sections',
    },
    {
      class: 'flex gap-2',
      description: 'Horizontal flex with gap',
      useCase: 'Button groups',
    },
  ];

  spacingClassesData = [
    { class: 'gap-2', value: '0.5rem (8px)', use: 'Between buttons' },
    { class: 'gap-3', value: '0.75rem (12px)', use: 'Between small elements' },
    { class: 'gap-4', value: '1rem (16px)', use: 'Between form fields' },
    { class: 'gap-6', value: '1.5rem (24px)', use: 'Between sections' },
    { class: 'mb-4', value: '1rem margin', use: 'After section headers' },
    { class: 'my-6', value: '1.5rem vertical', use: 'Around dividers' },
  ];

  breakpoints = [
    {
      name: 'Mobile First',
      prefix: '(default)',
      width: '< 640px',
      description: 'Single column layout',
    },
    {
      name: 'Small',
      prefix: 'sm:',
      width: '≥ 640px',
      description: 'Tablet portrait',
    },
    {
      name: 'Medium',
      prefix: 'md:',
      width: '≥ 768px',
      description: 'Tablet landscape, multi-column',
    },
    {
      name: 'Large',
      prefix: 'lg:',
      width: '≥ 1024px',
      description: 'Desktop, 3+ columns',
    },
  ];

  layoutGuide = [
    {
      layout: 'Single Column',
      description: 'Best for focused user journeys and mobile-first forms.',
      uses: ['Login', 'Registration', 'Contact forms', 'Simple dialogs'],
    },
    {
      layout: 'Multi-Column (2 cols)',
      description: 'Efficient use of space for forms with related field pairs.',
      uses: ['Profile settings', 'Address forms', 'User management'],
    },
    {
      layout: 'Sectioned Forms',
      description: 'For complex data entry with logical groupings.',
      uses: ['Account settings', 'Configuration pages', 'Onboarding wizards'],
    },
    {
      layout: 'Dialog Forms',
      description: "Quick actions that don't require full page navigation.",
      uses: ['Quick add', 'Edit records', 'Confirmations', 'Simple settings'],
    },
  ];
}
