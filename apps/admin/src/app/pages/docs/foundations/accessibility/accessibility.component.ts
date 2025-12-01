import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { AxKbdComponent } from '@aegisx/ui';
import {
  DocHeaderComponent,
  CodeTabsComponent,
} from '../../../../components/docs';
import { CodeTab } from '../../../../types/docs.types';

interface A11yPrinciple {
  icon: string;
  title: string;
  description: string;
  wcag: string;
}

interface KeyboardShortcut {
  keys: string;
  action: string;
  context: string;
}

@Component({
  selector: 'ax-accessibility-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatChipsModule,
    RouterModule,
    AxKbdComponent,
    DocHeaderComponent,
    CodeTabsComponent,
  ],
  template: `
    <div class="a11y-page">
      <ax-doc-header
        title="Accessibility"
        icon="accessibility_new"
        description="AegisX UI is designed with accessibility in mind, following WCAG 2.1 guidelines to ensure all users can interact with your application effectively."
        [breadcrumbs]="[
          { label: 'Foundations', link: '/docs/foundations/overview' },
          { label: 'Accessibility' },
        ]"
        [showImport]="false"
        [showQuickLinks]="false"
      ></ax-doc-header>

      <mat-tab-group class="docs-tabs" animationDuration="200ms">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="py-6">
            <!-- WCAG Compliance -->
            <section class="mb-8">
              <h2 class="text-2xl font-semibold mb-4">WCAG 2.1 Compliance</h2>
              <p class="text-on-surface-variant mb-6">
                AegisX UI components are designed to meet
                <strong>WCAG 2.1 Level AA</strong> standards. This means our
                components support:
              </p>

              <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                @for (principle of wcagPrinciples; track principle.title) {
                  <mat-card appearance="outlined" class="p-4">
                    <div class="flex items-center gap-3 mb-3">
                      <div
                        class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"
                      >
                        <mat-icon class="text-primary">{{
                          principle.icon
                        }}</mat-icon>
                      </div>
                      <div>
                        <h3 class="font-semibold">{{ principle.title }}</h3>
                        <span class="text-xs text-on-surface-variant">{{
                          principle.wcag
                        }}</span>
                      </div>
                    </div>
                    <p class="text-sm text-on-surface-variant">
                      {{ principle.description }}
                    </p>
                  </mat-card>
                }
              </div>
            </section>

            <!-- Built-in Support -->
            <section class="mb-8">
              <h2 class="text-2xl font-semibold mb-4">Built-in Support</h2>
              <div class="grid md:grid-cols-2 gap-6">
                <mat-card appearance="outlined" class="p-6">
                  <div class="flex items-center gap-3 mb-4">
                    <mat-icon class="text-success">check_circle</mat-icon>
                    <h3 class="text-lg font-semibold">Angular Material</h3>
                  </div>
                  <p class="text-on-surface-variant mb-4">
                    AegisX UI is built on Angular Material, which provides
                    excellent accessibility support out of the box including:
                  </p>
                  <ul class="space-y-2 text-sm text-on-surface-variant">
                    <li class="flex items-center gap-2">
                      <mat-icon class="text-sm">arrow_right</mat-icon>
                      ARIA attributes on all interactive elements
                    </li>
                    <li class="flex items-center gap-2">
                      <mat-icon class="text-sm">arrow_right</mat-icon>
                      Keyboard navigation support
                    </li>
                    <li class="flex items-center gap-2">
                      <mat-icon class="text-sm">arrow_right</mat-icon>
                      High contrast mode compatibility
                    </li>
                    <li class="flex items-center gap-2">
                      <mat-icon class="text-sm">arrow_right</mat-icon>
                      Screen reader announcements
                    </li>
                  </ul>
                </mat-card>

                <mat-card appearance="outlined" class="p-6">
                  <div class="flex items-center gap-3 mb-4">
                    <mat-icon class="text-primary">palette</mat-icon>
                    <h3 class="text-lg font-semibold">Color Contrast</h3>
                  </div>
                  <p class="text-on-surface-variant mb-4">
                    Our color system ensures sufficient contrast ratios:
                  </p>
                  <div class="space-y-3">
                    <div
                      class="flex items-center justify-between p-3 bg-surface-container rounded-lg"
                    >
                      <span>Normal Text (14px+)</span>
                      <mat-chip-set>
                        <mat-chip class="!bg-success/20 !text-success"
                          >4.5:1 AA</mat-chip
                        >
                      </mat-chip-set>
                    </div>
                    <div
                      class="flex items-center justify-between p-3 bg-surface-container rounded-lg"
                    >
                      <span>Large Text (18px+)</span>
                      <mat-chip-set>
                        <mat-chip class="!bg-success/20 !text-success"
                          >3:1 AA</mat-chip
                        >
                      </mat-chip-set>
                    </div>
                    <div
                      class="flex items-center justify-between p-3 bg-surface-container rounded-lg"
                    >
                      <span>UI Components</span>
                      <mat-chip-set>
                        <mat-chip class="!bg-success/20 !text-success"
                          >3:1 AA</mat-chip
                        >
                      </mat-chip-set>
                    </div>
                  </div>
                </mat-card>
              </div>
            </section>

            <!-- Screen Reader Support -->
            <section class="mb-8">
              <h2 class="text-2xl font-semibold mb-4">Screen Reader Support</h2>
              <p class="text-on-surface-variant mb-4">
                AegisX UI components are tested with popular screen readers:
              </p>
              <div class="grid md:grid-cols-3 gap-4">
                <mat-card appearance="outlined" class="p-4 text-center">
                  <mat-icon class="text-4xl mb-2 text-primary"
                    >desktop_mac</mat-icon
                  >
                  <h4 class="font-semibold">VoiceOver</h4>
                  <p class="text-sm text-on-surface-variant">macOS & iOS</p>
                </mat-card>
                <mat-card appearance="outlined" class="p-4 text-center">
                  <mat-icon class="text-4xl mb-2 text-primary"
                    >desktop_windows</mat-icon
                  >
                  <h4 class="font-semibold">NVDA</h4>
                  <p class="text-sm text-on-surface-variant">Windows</p>
                </mat-card>
                <mat-card appearance="outlined" class="p-4 text-center">
                  <mat-icon class="text-4xl mb-2 text-primary"
                    >android</mat-icon
                  >
                  <h4 class="font-semibold">TalkBack</h4>
                  <p class="text-sm text-on-surface-variant">Android</p>
                </mat-card>
              </div>
            </section>
          </div>
        </mat-tab>

        <!-- Keyboard Tab -->
        <mat-tab label="Keyboard">
          <div class="py-6">
            <section class="mb-8">
              <h2 class="text-2xl font-semibold mb-4">Keyboard Navigation</h2>
              <p class="text-on-surface-variant mb-6">
                All interactive components support full keyboard navigation.
                Users can navigate and interact without using a mouse.
              </p>

              <!-- Global Shortcuts -->
              <h3 class="text-xl font-semibold mb-4">Global Navigation</h3>
              <mat-card appearance="outlined" class="p-6 mb-6">
                <div class="shortcuts-list">
                  @for (shortcut of globalShortcuts; track shortcut.keys) {
                    <div class="shortcut-row">
                      <ax-kbd [shortcut]="shortcut.keys"></ax-kbd>
                      <div class="shortcut-info">
                        <span class="font-medium">{{ shortcut.action }}</span>
                        <span class="text-sm text-on-surface-variant">{{
                          shortcut.context
                        }}</span>
                      </div>
                    </div>
                  }
                </div>
              </mat-card>

              <!-- Component Shortcuts -->
              <h3 class="text-xl font-semibold mb-4">Component Shortcuts</h3>
              <mat-card appearance="outlined" class="p-6">
                <div class="shortcuts-list">
                  @for (shortcut of componentShortcuts; track shortcut.keys) {
                    <div class="shortcut-row">
                      <ax-kbd [shortcut]="shortcut.keys"></ax-kbd>
                      <div class="shortcut-info">
                        <span class="font-medium">{{ shortcut.action }}</span>
                        <span class="text-sm text-on-surface-variant">{{
                          shortcut.context
                        }}</span>
                      </div>
                    </div>
                  }
                </div>
              </mat-card>
            </section>

            <!-- Focus Management -->
            <section class="mb-8">
              <h2 class="text-2xl font-semibold mb-4">Focus Management</h2>
              <div class="grid md:grid-cols-2 gap-6">
                <mat-card appearance="outlined" class="p-6">
                  <h3 class="font-semibold mb-3">Visible Focus Indicators</h3>
                  <p class="text-on-surface-variant mb-4">
                    All interactive elements have visible focus indicators that
                    meet WCAG 2.4.7 requirements. Focus rings use our brand
                    colors with sufficient contrast.
                  </p>
                  <div class="p-4 bg-surface-container rounded-lg">
                    <button
                      class="px-4 py-2 bg-primary text-on-primary rounded-md focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      Focus me with Tab
                    </button>
                  </div>
                </mat-card>

                <mat-card appearance="outlined" class="p-6">
                  <h3 class="font-semibold mb-3">Focus Trap</h3>
                  <p class="text-on-surface-variant mb-4">
                    Modal dialogs, drawers, and overlays trap focus within the
                    component to prevent users from accidentally navigating
                    outside the modal context.
                  </p>
                  <code
                    class="block p-3 bg-surface-container rounded-lg text-sm"
                  >
                    cdkTrapFocus<br />
                    cdkFocusInitial
                  </code>
                </mat-card>
              </div>
            </section>
          </div>
        </mat-tab>

        <!-- ARIA Tab -->
        <mat-tab label="ARIA">
          <div class="py-6">
            <section class="mb-8">
              <h2 class="text-2xl font-semibold mb-4">ARIA Attributes</h2>
              <p class="text-on-surface-variant mb-6">
                ARIA (Accessible Rich Internet Applications) attributes provide
                additional context to assistive technologies. AegisX UI
                components include appropriate ARIA attributes automatically.
              </p>

              <ax-code-tabs [tabs]="ariaTabs"></ax-code-tabs>
            </section>

            <!-- Common Patterns -->
            <section class="mb-8">
              <h2 class="text-2xl font-semibold mb-4">Common ARIA Patterns</h2>
              <div class="overflow-x-auto">
                <table mat-table [dataSource]="ariaPatterns" class="w-full">
                  <ng-container matColumnDef="pattern">
                    <th mat-header-cell *matHeaderCellDef>Pattern</th>
                    <td mat-cell *matCellDef="let row">
                      <code class="text-primary">{{ row.pattern }}</code>
                    </td>
                  </ng-container>
                  <ng-container matColumnDef="usage">
                    <th mat-header-cell *matHeaderCellDef>Usage</th>
                    <td mat-cell *matCellDef="let row">{{ row.usage }}</td>
                  </ng-container>
                  <ng-container matColumnDef="component">
                    <th mat-header-cell *matHeaderCellDef>Components</th>
                    <td mat-cell *matCellDef="let row">
                      <span class="text-secondary">{{ row.component }}</span>
                    </td>
                  </ng-container>
                  <tr mat-header-row *matHeaderRowDef="ariaColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: ariaColumns"></tr>
                </table>
              </div>
            </section>

            <!-- Live Regions -->
            <section class="mb-8">
              <h2 class="text-2xl font-semibold mb-4">Live Regions</h2>
              <p class="text-on-surface-variant mb-4">
                Dynamic content changes are announced to screen readers using
                ARIA live regions.
              </p>
              <ax-code-tabs [tabs]="liveRegionTabs"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- Forms Tab -->
        <mat-tab label="Forms">
          <div class="py-6">
            <section class="mb-8">
              <h2 class="text-2xl font-semibold mb-4">Accessible Forms</h2>
              <p class="text-on-surface-variant mb-6">
                Forms require special attention for accessibility. Follow these
                guidelines to ensure all users can complete forms successfully.
              </p>

              <div class="grid md:grid-cols-2 gap-6 mb-6">
                <mat-card appearance="outlined" class="p-6">
                  <div class="flex items-center gap-3 mb-4">
                    <mat-icon class="text-success">check_circle</mat-icon>
                    <h3 class="font-semibold text-success">Do</h3>
                  </div>
                  <ul class="space-y-3 text-sm">
                    <li class="flex items-start gap-2">
                      <mat-icon class="text-success text-sm mt-0.5"
                        >check</mat-icon
                      >
                      <span
                        >Always associate labels with inputs using
                        <code>for</code> attribute</span
                      >
                    </li>
                    <li class="flex items-start gap-2">
                      <mat-icon class="text-success text-sm mt-0.5"
                        >check</mat-icon
                      >
                      <span
                        >Provide clear error messages with
                        <code>aria-describedby</code></span
                      >
                    </li>
                    <li class="flex items-start gap-2">
                      <mat-icon class="text-success text-sm mt-0.5"
                        >check</mat-icon
                      >
                      <span
                        >Mark required fields with
                        <code>aria-required="true"</code></span
                      >
                    </li>
                    <li class="flex items-start gap-2">
                      <mat-icon class="text-success text-sm mt-0.5"
                        >check</mat-icon
                      >
                      <span
                        >Group related inputs with <code>fieldset</code> and
                        <code>legend</code></span
                      >
                    </li>
                    <li class="flex items-start gap-2">
                      <mat-icon class="text-success text-sm mt-0.5"
                        >check</mat-icon
                      >
                      <span
                        >Use <code>autocomplete</code> attributes for common
                        fields</span
                      >
                    </li>
                  </ul>
                </mat-card>

                <mat-card appearance="outlined" class="p-6">
                  <div class="flex items-center gap-3 mb-4">
                    <mat-icon class="text-error">cancel</mat-icon>
                    <h3 class="font-semibold text-error">Don't</h3>
                  </div>
                  <ul class="space-y-3 text-sm">
                    <li class="flex items-start gap-2">
                      <mat-icon class="text-error text-sm mt-0.5"
                        >close</mat-icon
                      >
                      <span>Rely only on color to indicate errors</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <mat-icon class="text-error text-sm mt-0.5"
                        >close</mat-icon
                      >
                      <span>Use placeholder as the only label</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <mat-icon class="text-error text-sm mt-0.5"
                        >close</mat-icon
                      >
                      <span>Auto-submit forms on input change</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <mat-icon class="text-error text-sm mt-0.5"
                        >close</mat-icon
                      >
                      <span>Use time limits without warnings</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <mat-icon class="text-error text-sm mt-0.5"
                        >close</mat-icon
                      >
                      <span>Clear error messages on new input</span>
                    </li>
                  </ul>
                </mat-card>
              </div>

              <ax-code-tabs [tabs]="formTabs"></ax-code-tabs>
            </section>

            <!-- Error Handling -->
            <section class="mb-8">
              <h2 class="text-2xl font-semibold mb-4">Error Handling</h2>
              <p class="text-on-surface-variant mb-4">
                Error messages should be programmatically associated with their
                inputs and announced to screen readers.
              </p>
              <ax-code-tabs [tabs]="errorTabs"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- Testing Tab -->
        <mat-tab label="Testing">
          <div class="py-6">
            <section class="mb-8">
              <h2 class="text-2xl font-semibold mb-4">Accessibility Testing</h2>
              <p class="text-on-surface-variant mb-6">
                Regular accessibility testing ensures your application remains
                accessible as it evolves.
              </p>

              <div class="grid md:grid-cols-2 gap-6">
                <mat-card appearance="outlined" class="p-6">
                  <h3 class="font-semibold mb-4">Automated Testing</h3>
                  <ul class="space-y-3">
                    <li class="flex items-center gap-3">
                      <img
                        src="https://www.deque.com/wp-content/uploads/2021/03/axe-logo.svg"
                        alt="axe"
                        class="w-6 h-6"
                      />
                      <div>
                        <span class="font-medium">axe DevTools</span>
                        <p class="text-sm text-on-surface-variant">
                          Browser extension for accessibility testing
                        </p>
                      </div>
                    </li>
                    <li class="flex items-center gap-3">
                      <mat-icon class="text-primary"
                        >integration_instructions</mat-icon
                      >
                      <div>
                        <span class="font-medium">Lighthouse</span>
                        <p class="text-sm text-on-surface-variant">
                          Built into Chrome DevTools
                        </p>
                      </div>
                    </li>
                    <li class="flex items-center gap-3">
                      <mat-icon class="text-primary">code</mat-icon>
                      <div>
                        <span class="font-medium">eslint-plugin-jsx-a11y</span>
                        <p class="text-sm text-on-surface-variant">
                          Linting for accessibility issues
                        </p>
                      </div>
                    </li>
                  </ul>
                </mat-card>

                <mat-card appearance="outlined" class="p-6">
                  <h3 class="font-semibold mb-4">Manual Testing</h3>
                  <ul class="space-y-3">
                    <li class="flex items-start gap-3">
                      <mat-icon class="text-primary mt-0.5">keyboard</mat-icon>
                      <div>
                        <span class="font-medium"
                          >Keyboard-only navigation</span
                        >
                        <p class="text-sm text-on-surface-variant">
                          Navigate without using a mouse
                        </p>
                      </div>
                    </li>
                    <li class="flex items-start gap-3">
                      <mat-icon class="text-primary mt-0.5"
                        >record_voice_over</mat-icon
                      >
                      <div>
                        <span class="font-medium">Screen reader testing</span>
                        <p class="text-sm text-on-surface-variant">
                          Use VoiceOver, NVDA, or TalkBack
                        </p>
                      </div>
                    </li>
                    <li class="flex items-start gap-3">
                      <mat-icon class="text-primary mt-0.5">zoom_in</mat-icon>
                      <div>
                        <span class="font-medium">Zoom testing</span>
                        <p class="text-sm text-on-surface-variant">
                          Test at 200% and 400% zoom
                        </p>
                      </div>
                    </li>
                  </ul>
                </mat-card>
              </div>
            </section>

            <!-- Testing Checklist -->
            <section class="mb-8">
              <h2 class="text-2xl font-semibold mb-4">Testing Checklist</h2>
              <mat-card appearance="outlined" class="p-6">
                <div class="space-y-4">
                  @for (item of testingChecklist; track item) {
                    <div
                      class="flex items-start gap-3 p-3 bg-surface-container rounded-lg"
                    >
                      <mat-icon class="text-primary mt-0.5">task_alt</mat-icon>
                      <span>{{ item }}</span>
                    </div>
                  }
                </div>
              </mat-card>
            </section>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .a11y-page {
        max-width: 1200px;
        margin: 0 auto;
      }

      .shortcuts-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .shortcut-row {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem 1rem;
        border-bottom: 1px solid var(--ax-outline-variant);
      }

      .shortcut-row:last-child {
        border-bottom: none;
      }

      .shortcut-row ax-kbd {
        min-width: 140px;
      }

      .shortcut-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
    `,
  ],
})
export class AccessibilityComponent {
  wcagPrinciples: A11yPrinciple[] = [
    {
      icon: 'visibility',
      title: 'Perceivable',
      description:
        'Information and UI components must be presentable to users in ways they can perceive.',
      wcag: 'WCAG 1.x',
    },
    {
      icon: 'touch_app',
      title: 'Operable',
      description:
        'UI components and navigation must be operable by all users.',
      wcag: 'WCAG 2.x',
    },
    {
      icon: 'psychology',
      title: 'Understandable',
      description:
        'Information and the operation of the UI must be understandable.',
      wcag: 'WCAG 3.x',
    },
    {
      icon: 'settings_applications',
      title: 'Robust',
      description:
        'Content must be robust enough to be interpreted by a wide variety of user agents.',
      wcag: 'WCAG 4.x',
    },
  ];

  globalShortcuts: KeyboardShortcut[] = [
    {
      keys: 'Tab',
      action: 'Move focus forward',
      context: 'Navigate between interactive elements',
    },
    {
      keys: 'Shift+Tab',
      action: 'Move focus backward',
      context: 'Navigate in reverse order',
    },
    {
      keys: 'Enter',
      action: 'Activate element',
      context: 'Buttons, links, menu items',
    },
    {
      keys: 'Space',
      action: 'Toggle/Select',
      context: 'Checkboxes, toggles, buttons',
    },
    {
      keys: 'Escape',
      action: 'Close/Cancel',
      context: 'Modals, dropdowns, dialogs',
    },
  ];

  componentShortcuts: KeyboardShortcut[] = [
    { keys: 'Up', action: 'Previous option', context: 'Lists, menus, selects' },
    { keys: 'Down', action: 'Next option', context: 'Lists, menus, selects' },
    { keys: 'Home', action: 'First option', context: 'Lists, sliders' },
    { keys: 'End', action: 'Last option', context: 'Lists, sliders' },
    { keys: 'Left', action: 'Decrease value', context: 'Sliders, tabs' },
    { keys: 'Right', action: 'Increase value', context: 'Sliders, tabs' },
    { keys: 'Ctrl+A', action: 'Select all', context: 'Tables, lists' },
  ];

  ariaColumns = ['pattern', 'usage', 'component'];
  ariaPatterns = [
    {
      pattern: 'role="button"',
      usage: 'Non-button elements that act as buttons',
      component: 'Custom buttons',
    },
    {
      pattern: 'aria-label',
      usage: 'Provides accessible name when text is not visible',
      component: 'Icon buttons',
    },
    {
      pattern: 'aria-labelledby',
      usage: 'References another element as the label',
      component: 'Dialogs, sections',
    },
    {
      pattern: 'aria-describedby',
      usage: 'References additional descriptive content',
      component: 'Form inputs',
    },
    {
      pattern: 'aria-expanded',
      usage: 'Indicates expandable element state',
      component: 'Accordions, menus',
    },
    {
      pattern: 'aria-selected',
      usage: 'Indicates selection state',
      component: 'Tabs, lists',
    },
    {
      pattern: 'aria-hidden',
      usage: 'Hides decorative content from screen readers',
      component: 'Icons, decorations',
    },
    {
      pattern: 'aria-live',
      usage: 'Announces dynamic content changes',
      component: 'Toasts, alerts',
    },
  ];

  ariaTabs: CodeTab[] = [
    {
      label: 'Button',
      language: 'html',
      code: `<!-- Icon button with accessible label -->
<button mat-icon-button aria-label="Close dialog">
  <mat-icon>close</mat-icon>
</button>

<!-- Toggle button with state -->
<button
  mat-icon-button
  [attr.aria-pressed]="isActive"
  aria-label="Toggle favorite">
  <mat-icon>{{ isActive ? 'favorite' : 'favorite_border' }}</mat-icon>
</button>`,
    },
    {
      label: 'Menu',
      language: 'html',
      code: `<!-- Menu with keyboard navigation -->
<button
  mat-button
  [matMenuTriggerFor]="menu"
  aria-haspopup="menu"
  [attr.aria-expanded]="menuOpen">
  Options
</button>

<mat-menu #menu="matMenu" role="menu">
  <button mat-menu-item role="menuitem">Edit</button>
  <button mat-menu-item role="menuitem">Delete</button>
</mat-menu>`,
    },
    {
      label: 'Dialog',
      language: 'html',
      code: `<!-- Dialog with proper labeling -->
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description">

  <h2 id="dialog-title">Confirm Action</h2>
  <p id="dialog-description">
    Are you sure you want to proceed?
  </p>

  <button mat-button cdkFocusInitial>Cancel</button>
  <button mat-flat-button color="primary">Confirm</button>
</div>`,
    },
  ];

  liveRegionTabs: CodeTab[] = [
    {
      label: 'Polite',
      language: 'html',
      code: `<!-- Polite announcements (wait for user to finish) -->
<div aria-live="polite" aria-atomic="true">
  {{ statusMessage }}
</div>

<!-- Toast notifications -->
<ax-toast aria-live="polite">
  Changes saved successfully
</ax-toast>`,
    },
    {
      label: 'Assertive',
      language: 'html',
      code: `<!-- Assertive announcements (interrupt immediately) -->
<div aria-live="assertive" role="alert">
  {{ errorMessage }}
</div>

<!-- Error alerts -->
<ax-alert type="error" aria-live="assertive">
  Session expired. Please log in again.
</ax-alert>`,
    },
  ];

  formTabs: CodeTab[] = [
    {
      label: 'Basic Form',
      language: 'html',
      code: `<form>
  <!-- Always use labels -->
  <mat-form-field>
    <mat-label>Email Address</mat-label>
    <input
      matInput
      type="email"
      id="email"
      name="email"
      autocomplete="email"
      aria-required="true"
      [attr.aria-invalid]="emailControl.invalid"
      [attr.aria-describedby]="emailControl.invalid ? 'email-error' : null">

    @if (emailControl.invalid) {
      <mat-error id="email-error">
        Please enter a valid email address
      </mat-error>
    }
  </mat-form-field>

  <!-- Group related fields -->
  <fieldset>
    <legend>Shipping Address</legend>
    <!-- Address fields -->
  </fieldset>
</form>`,
    },
    {
      label: 'Required Fields',
      language: 'html',
      code: `<!-- Mark required fields visually AND programmatically -->
<mat-form-field>
  <mat-label>
    Username <span class="text-error">*</span>
  </mat-label>
  <input
    matInput
    required
    aria-required="true">
  <mat-hint>Required field</mat-hint>
</mat-form-field>

<!-- Provide instructions before the form -->
<p class="form-instructions">
  Fields marked with <span class="text-error">*</span> are required.
</p>`,
    },
  ];

  errorTabs: CodeTab[] = [
    {
      label: 'Inline Errors',
      language: 'html',
      code: `<mat-form-field>
  <mat-label>Password</mat-label>
  <input
    matInput
    type="password"
    [attr.aria-invalid]="passwordControl.invalid"
    [attr.aria-describedby]="
      passwordControl.invalid ? 'password-error password-hint' : 'password-hint'
    ">

  <mat-hint id="password-hint">
    Minimum 8 characters
  </mat-hint>

  @if (passwordControl.hasError('minlength')) {
    <mat-error id="password-error">
      Password must be at least 8 characters
    </mat-error>
  }
</mat-form-field>`,
    },
    {
      label: 'Error Summary',
      language: 'html',
      code: `<!-- Error summary at top of form -->
@if (form.invalid && form.submitted) {
  <div
    role="alert"
    aria-live="assertive"
    class="error-summary">
    <h2>Please correct the following errors:</h2>
    <ul>
      @for (error of formErrors; track error.field) {
        <li>
          <a href="#{{ error.field }}">{{ error.message }}</a>
        </li>
      }
    </ul>
  </div>
}`,
    },
  ];

  testingChecklist = [
    'Navigate entire page using only keyboard (Tab, Shift+Tab, Enter, Space, Escape)',
    'All interactive elements have visible focus indicators',
    'Focus order follows logical reading order',
    'No keyboard traps (can always escape modal/menu)',
    'Screen reader announces all content and state changes',
    'Color is not the only means of conveying information',
    'Text has sufficient color contrast (4.5:1 for normal, 3:1 for large)',
    'Page is usable at 200% zoom',
    'All images have appropriate alt text',
    'Form inputs have associated labels',
    'Error messages are clear and helpful',
    'Time limits have warnings and extension options',
  ];
}
