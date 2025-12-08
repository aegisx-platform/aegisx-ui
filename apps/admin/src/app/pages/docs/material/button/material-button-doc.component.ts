import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../components/docs';
import { ComponentToken } from '../../../../types/docs.types';

@Component({
  selector: 'app-material-button-doc',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatTooltipModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="material-button-doc">
      <!-- Header -->
      <ax-doc-header
        title="Button"
        description="Buttons help people take actions, such as sending an email, sharing a document, or liking a comment."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="material-button-doc__header-links">
          <a
            href="https://material.angular.dev/components/button/overview"
            target="_blank"
            rel="noopener"
            class="material-button-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
          <a
            href="https://m3.material.io/components/buttons/overview"
            target="_blank"
            rel="noopener"
            class="material-button-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Material Design 3
          </a>
        </div>
      </ax-doc-header>

      <!-- Tabs -->
      <mat-tab-group
        class="material-button-doc__tabs"
        animationDuration="200ms"
      >
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="material-button-doc__section">
            <h2 class="material-button-doc__section-title">Button Overview</h2>
            <p class="material-button-doc__section-description">
              Material Design 3 defines several button types. Each type has a
              specific use case and level of emphasis.
            </p>

            <!-- Button Overview Table -->
            <div class="button-overview-table">
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>Basic</th>
                    <th>Disabled</th>
                    <th>Link</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- Text -->
                  <tr>
                    <td class="type-label">Text</td>
                    <td><button mat-button>Basic</button></td>
                    <td><button mat-button disabled>Disabled</button></td>
                    <td><a mat-button routerLink=".">Link</a></td>
                  </tr>
                  <!-- Elevated -->
                  <tr>
                    <td class="type-label">Elevated</td>
                    <td><button mat-raised-button>Basic</button></td>
                    <td>
                      <button mat-raised-button disabled>Disabled</button>
                    </td>
                    <td><a mat-raised-button routerLink=".">Link</a></td>
                  </tr>
                  <!-- Outlined -->
                  <tr>
                    <td class="type-label">Outlined</td>
                    <td><button mat-stroked-button>Basic</button></td>
                    <td>
                      <button mat-stroked-button disabled>Disabled</button>
                    </td>
                    <td><a mat-stroked-button routerLink=".">Link</a></td>
                  </tr>
                  <!-- Filled -->
                  <tr>
                    <td class="type-label">Filled</td>
                    <td>
                      <button mat-flat-button color="primary">Basic</button>
                    </td>
                    <td>
                      <button mat-flat-button color="primary" disabled>
                        Disabled
                      </button>
                    </td>
                    <td>
                      <a mat-flat-button color="primary" routerLink=".">Link</a>
                    </td>
                  </tr>
                  <!-- Tonal -->
                  <tr>
                    <td class="type-label">Tonal</td>
                    <td>
                      <button mat-flat-button class="tonal-button">
                        Basic
                      </button>
                    </td>
                    <td>
                      <button mat-flat-button class="tonal-button" disabled>
                        Disabled
                      </button>
                    </td>
                    <td>
                      <a mat-flat-button class="tonal-button" routerLink="."
                        >Link</a
                      >
                    </td>
                  </tr>
                  <!-- Icon -->
                  <tr>
                    <td class="type-label">Icon</td>
                    <td>
                      <button mat-icon-button aria-label="More options">
                        <mat-icon>more_vert</mat-icon>
                      </button>
                      <button mat-icon-button aria-label="Open in new">
                        <mat-icon>open_in_new</mat-icon>
                      </button>
                    </td>
                    <td>
                      <button
                        mat-icon-button
                        disabled
                        aria-label="More options"
                      >
                        <mat-icon>more_vert</mat-icon>
                      </button>
                    </td>
                    <td>
                      <a mat-icon-button routerLink="." aria-label="Link">
                        <mat-icon>link</mat-icon>
                      </a>
                    </td>
                  </tr>
                  <!-- FAB -->
                  <tr>
                    <td class="type-label">Floating Action Button (FAB)</td>
                    <td>
                      <button mat-fab color="primary" aria-label="Delete">
                        <mat-icon>delete</mat-icon>
                      </button>
                      <button mat-fab aria-label="Favorite">
                        <mat-icon>favorite</mat-icon>
                      </button>
                    </td>
                    <td>
                      <button mat-fab disabled aria-label="Delete">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </td>
                    <td>
                      <a
                        mat-fab
                        color="primary"
                        routerLink="."
                        aria-label="Link"
                      >
                        <mat-icon>link</mat-icon>
                      </a>
                    </td>
                  </tr>
                  <!-- Mini FAB -->
                  <tr>
                    <td class="type-label">Mini FAB</td>
                    <td>
                      <button mat-mini-fab color="primary" aria-label="Menu">
                        <mat-icon>menu</mat-icon>
                      </button>
                      <button mat-mini-fab aria-label="Home">
                        <mat-icon>home</mat-icon>
                      </button>
                    </td>
                    <td>
                      <button mat-mini-fab disabled aria-label="Menu">
                        <mat-icon>menu</mat-icon>
                      </button>
                    </td>
                    <td>
                      <a
                        mat-mini-fab
                        color="primary"
                        routerLink="."
                        aria-label="Link"
                      >
                        <mat-icon>link</mat-icon>
                      </a>
                    </td>
                  </tr>
                  <!-- Extended FAB -->
                  <tr>
                    <td class="type-label">Extended FAB</td>
                    <td>
                      <button mat-fab extended color="primary">
                        <mat-icon>favorite</mat-icon>
                        Basic
                      </button>
                    </td>
                    <td>
                      <button mat-fab extended disabled>
                        <mat-icon>favorite</mat-icon>
                        Disabled
                      </button>
                    </td>
                    <td>
                      <a mat-fab extended color="primary" routerLink=".">
                        <mat-icon>favorite</mat-icon>
                        Link
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <mat-divider></mat-divider>

            <h2 class="material-button-doc__section-title">
              Button Types Explained
            </h2>

            <!-- Text Buttons -->
            <h3 class="material-button-doc__subsection-title">Text Buttons</h3>
            <p class="material-button-doc__description">
              Text buttons are used for the lowest priority actions, especially
              when presenting multiple options. They're often used in dialogs
              and cards.
            </p>
            <ax-live-preview title="Text buttons">
              <div class="material-button-doc__button-row">
                <button mat-button>Default</button>
                <button mat-button color="primary">Primary</button>
                <button mat-button color="accent">Accent</button>
                <button mat-button color="warn">Warn</button>
                <button mat-button disabled>Disabled</button>
              </div>
            </ax-live-preview>

            <!-- Elevated Buttons -->
            <h3 class="material-button-doc__subsection-title">
              Elevated Buttons
            </h3>
            <p class="material-button-doc__description">
              Elevated buttons are essentially filled tonal buttons with a
              shadow. Use them for actions that need emphasis but aren't
              primary.
            </p>
            <ax-live-preview title="Elevated buttons">
              <div class="material-button-doc__button-row">
                <button mat-raised-button>Default</button>
                <button mat-raised-button color="primary">Primary</button>
                <button mat-raised-button color="accent">Accent</button>
                <button mat-raised-button color="warn">Warn</button>
                <button mat-raised-button disabled>Disabled</button>
              </div>
            </ax-live-preview>

            <!-- Outlined Buttons -->
            <h3 class="material-button-doc__subsection-title">
              Outlined Buttons
            </h3>
            <p class="material-button-doc__description">
              Outlined buttons are medium-emphasis buttons. They're good for
              secondary actions like "Cancel" or "Back".
            </p>
            <ax-live-preview title="Outlined buttons">
              <div class="material-button-doc__button-row">
                <button mat-stroked-button>Default</button>
                <button mat-stroked-button color="primary">Primary</button>
                <button mat-stroked-button color="accent">Accent</button>
                <button mat-stroked-button color="warn">Warn</button>
                <button mat-stroked-button disabled>Disabled</button>
              </div>
            </ax-live-preview>

            <!-- Filled Buttons -->
            <h3 class="material-button-doc__subsection-title">
              Filled Buttons
            </h3>
            <p class="material-button-doc__description">
              Filled buttons have the most visual impact. Use them for
              important, final actions like "Save", "Confirm", or "Submit".
            </p>
            <ax-live-preview title="Filled buttons">
              <div class="material-button-doc__button-row">
                <button mat-flat-button color="primary">Primary</button>
                <button mat-flat-button color="accent">Accent</button>
                <button mat-flat-button color="warn">Warn</button>
                <button mat-flat-button color="primary" disabled>
                  Disabled
                </button>
              </div>
            </ax-live-preview>

            <!-- Tonal Buttons -->
            <h3 class="material-button-doc__subsection-title">Tonal Buttons</h3>
            <p class="material-button-doc__description">
              Tonal buttons are a middle ground between filled and outlined
              buttons. They have a lighter background color that's derived from
              the primary color.
            </p>
            <ax-live-preview title="Tonal buttons">
              <div class="material-button-doc__button-row">
                <button mat-flat-button class="tonal-button">Default</button>
                <button
                  mat-flat-button
                  class="tonal-button tonal-button--primary"
                >
                  Primary Tonal
                </button>
                <button
                  mat-flat-button
                  class="tonal-button tonal-button--accent"
                >
                  Accent Tonal
                </button>
                <button mat-flat-button class="tonal-button" disabled>
                  Disabled
                </button>
              </div>
            </ax-live-preview>

            <!-- Icon Buttons -->
            <h3 class="material-button-doc__subsection-title">Icon Buttons</h3>
            <p class="material-button-doc__description">
              Icon buttons are commonly found in app bars and toolbars. Always
              provide an aria-label for accessibility.
            </p>
            <ax-live-preview title="Icon buttons">
              <div class="material-button-doc__button-row">
                <button
                  mat-icon-button
                  aria-label="Settings"
                  matTooltip="Settings"
                >
                  <mat-icon>settings</mat-icon>
                </button>
                <button
                  mat-icon-button
                  color="primary"
                  aria-label="Favorite"
                  matTooltip="Favorite"
                >
                  <mat-icon>favorite</mat-icon>
                </button>
                <button
                  mat-icon-button
                  color="accent"
                  aria-label="Share"
                  matTooltip="Share"
                >
                  <mat-icon>share</mat-icon>
                </button>
                <button
                  mat-icon-button
                  color="warn"
                  aria-label="Delete"
                  matTooltip="Delete"
                >
                  <mat-icon>delete</mat-icon>
                </button>
                <button
                  mat-icon-button
                  disabled
                  aria-label="Home"
                  matTooltip="Home"
                >
                  <mat-icon>home</mat-icon>
                </button>
              </div>
            </ax-live-preview>

            <!-- FAB Buttons -->
            <h3 class="material-button-doc__subsection-title">
              Floating Action Buttons (FAB)
            </h3>
            <p class="material-button-doc__description">
              FABs represent the primary action of a screen. Only use one FAB
              per screen and it should represent the most important action.
            </p>
            <ax-live-preview title="FAB buttons">
              <div class="material-button-doc__button-row fab-row">
                <div class="fab-group">
                  <span class="fab-label">FAB</span>
                  <button mat-fab color="primary" aria-label="Add">
                    <mat-icon>add</mat-icon>
                  </button>
                </div>
                <div class="fab-group">
                  <span class="fab-label">Mini FAB</span>
                  <button mat-mini-fab color="primary" aria-label="Edit">
                    <mat-icon>edit</mat-icon>
                  </button>
                </div>
                <div class="fab-group">
                  <span class="fab-label">Extended FAB</span>
                  <button mat-fab extended color="primary">
                    <mat-icon>navigation</mat-icon>
                    Navigate
                  </button>
                </div>
              </div>
            </ax-live-preview>

            <!-- Extended FAB variants -->
            <h3 class="material-button-doc__subsection-title">
              Extended FAB Variants
            </h3>
            <ax-live-preview title="Extended FAB options">
              <div class="material-button-doc__button-row">
                <button mat-fab extended color="primary">
                  <mat-icon>add</mat-icon>
                  Create
                </button>
                <button mat-fab extended color="accent">
                  <mat-icon>edit</mat-icon>
                  Edit
                </button>
                <button mat-fab extended>
                  <mat-icon>share</mat-icon>
                  Share
                </button>
                <button mat-fab extended disabled>
                  <mat-icon>delete</mat-icon>
                  Delete
                </button>
              </div>
            </ax-live-preview>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="material-button-doc__section">
            <h2 class="material-button-doc__section-title">Usage Examples</h2>

            <!-- Basic Usage -->
            <h3 class="material-button-doc__subsection-title">Basic Usage</h3>
            <ax-live-preview title="Import and use buttons">
              <div class="material-button-doc__button-row">
                <button mat-flat-button color="primary">Submit</button>
                <button mat-stroked-button>Cancel</button>
                <button mat-button>Learn More</button>
              </div>
            </ax-live-preview>
            <ax-code-tabs [tabs]="basicUsageCode" />

            <!-- Buttons with Icons -->
            <h3 class="material-button-doc__subsection-title">
              Buttons with Icons
            </h3>
            <ax-live-preview title="Icons can be placed before or after text">
              <div class="material-button-doc__button-row">
                <button mat-flat-button color="primary">
                  <mat-icon>save</mat-icon>
                  Save
                </button>
                <button mat-stroked-button>
                  <mat-icon>download</mat-icon>
                  Download
                </button>
                <button mat-raised-button>
                  Upload
                  <mat-icon>upload</mat-icon>
                </button>
                <button mat-button color="primary">
                  <mat-icon>arrow_back</mat-icon>
                  Back
                </button>
                <button mat-button color="primary">
                  Next
                  <mat-icon>arrow_forward</mat-icon>
                </button>
              </div>
            </ax-live-preview>
            <ax-code-tabs [tabs]="withIconsCode" />

            <!-- Button Group -->
            <h3 class="material-button-doc__subsection-title">Button Group</h3>
            <ax-live-preview title="Grouped buttons for related actions">
              <div class="material-button-doc__button-group">
                <button mat-stroked-button>Day</button>
                <button mat-stroked-button>Week</button>
                <button mat-flat-button color="primary">Month</button>
                <button mat-stroked-button>Year</button>
              </div>
            </ax-live-preview>
            <ax-code-tabs [tabs]="buttonGroupCode" />

            <!-- Interactive Disabled Buttons -->
            <h3 class="material-button-doc__subsection-title">
              Interactive Disabled Buttons
            </h3>
            <p class="material-button-doc__description">
              Use <code>disabledInteractive</code> to keep disabled buttons in
              the tab order and show tooltips on hover.
            </p>
            <ax-live-preview title="Disabled interactive buttons">
              <div class="material-button-doc__button-row">
                <button
                  mat-flat-button
                  color="primary"
                  disabled
                  disabledInteractive
                  matTooltip="Action unavailable - please log in first"
                >
                  Publish
                </button>
                <button
                  mat-stroked-button
                  disabled
                  disabledInteractive
                  matTooltip="No items selected"
                >
                  Delete Selected
                </button>
              </div>
            </ax-live-preview>
            <ax-code-tabs [tabs]="interactiveDisabledCode" />

            <!-- Anchor Buttons -->
            <h3 class="material-button-doc__subsection-title">
              Anchor Buttons
            </h3>
            <p class="material-button-doc__description">
              Use <code>&lt;a&gt;</code> tag with button directives for
              navigation links that look like buttons.
            </p>
            <ax-live-preview title="Buttons as links">
              <div class="material-button-doc__button-row">
                <a
                  mat-flat-button
                  color="primary"
                  href="https://material.angular.io"
                  target="_blank"
                >
                  Documentation
                </a>
                <a mat-stroked-button routerLink="/docs/material/card">
                  View Cards
                </a>
                <a mat-button routerLink="/docs"> Back to Docs </a>
              </div>
            </ax-live-preview>
            <ax-code-tabs [tabs]="anchorButtonsCode" />

            <!-- Toggle Buttons Pattern -->
            <h3 class="material-button-doc__subsection-title">
              Toggle Button Pattern
            </h3>
            <ax-live-preview title="Toggle-style buttons">
              <div class="material-button-doc__button-row">
                <button mat-flat-button color="primary" class="toggle-active">
                  <mat-icon>format_bold</mat-icon>
                </button>
                <button mat-button>
                  <mat-icon>format_italic</mat-icon>
                </button>
                <button mat-button>
                  <mat-icon>format_underlined</mat-icon>
                </button>
                <mat-divider vertical></mat-divider>
                <button mat-button>
                  <mat-icon>format_align_left</mat-icon>
                </button>
                <button mat-flat-button color="primary" class="toggle-active">
                  <mat-icon>format_align_center</mat-icon>
                </button>
                <button mat-button>
                  <mat-icon>format_align_right</mat-icon>
                </button>
              </div>
            </ax-live-preview>
            <ax-code-tabs [tabs]="toggleButtonsCode" />

            <!-- Loading Buttons -->
            <h3 class="material-button-doc__subsection-title">Loading State</h3>
            <ax-live-preview title="Buttons with loading indicator">
              <div class="material-button-doc__button-row">
                <button
                  mat-flat-button
                  color="primary"
                  class="loading-button"
                  disabled
                >
                  <span class="spinner"></span>
                  Saving...
                </button>
                <button mat-stroked-button class="loading-button" disabled>
                  <span class="spinner"></span>
                  Processing...
                </button>
              </div>
            </ax-live-preview>
            <ax-code-tabs [tabs]="loadingButtonsCode" />
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="material-button-doc__section">
            <h2 class="material-button-doc__section-title">API Reference</h2>

            <mat-card
              appearance="outlined"
              class="material-button-doc__api-card"
            >
              <mat-card-header>
                <mat-card-title>Button Directives</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="material-button-doc__api-table">
                  <thead>
                    <tr>
                      <th>Directive</th>
                      <th>Selector</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>MatButton</code></td>
                      <td><code>mat-button</code></td>
                      <td>Text button (lowest emphasis)</td>
                    </tr>
                    <tr>
                      <td><code>MatRaisedButton</code></td>
                      <td><code>mat-raised-button</code></td>
                      <td>Elevated button with shadow</td>
                    </tr>
                    <tr>
                      <td><code>MatStrokedButton</code></td>
                      <td><code>mat-stroked-button</code></td>
                      <td>Outlined button (medium emphasis)</td>
                    </tr>
                    <tr>
                      <td><code>MatFlatButton</code></td>
                      <td><code>mat-flat-button</code></td>
                      <td>Filled button (high emphasis)</td>
                    </tr>
                    <tr>
                      <td><code>MatIconButton</code></td>
                      <td><code>mat-icon-button</code></td>
                      <td>Icon-only circular button</td>
                    </tr>
                    <tr>
                      <td><code>MatFab</code></td>
                      <td><code>mat-fab</code></td>
                      <td>Floating action button</td>
                    </tr>
                    <tr>
                      <td><code>MatMiniFab</code></td>
                      <td><code>mat-mini-fab</code></td>
                      <td>Mini floating action button</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              class="material-button-doc__api-card"
            >
              <mat-card-header>
                <mat-card-title>Input Properties</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="material-button-doc__api-table">
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
                      <td><code>color</code></td>
                      <td><code>'primary' | 'accent' | 'warn'</code></td>
                      <td>-</td>
                      <td>Theme color palette</td>
                    </tr>
                    <tr>
                      <td><code>disabled</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Whether the button is disabled</td>
                    </tr>
                    <tr>
                      <td><code>disabledInteractive</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>
                        Keep disabled button in tab order and allow tooltips
                      </td>
                    </tr>
                    <tr>
                      <td><code>disableRipple</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Whether to disable the ripple effect</td>
                    </tr>
                    <tr>
                      <td><code>extended</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Extended style for FAB (shows text)</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              class="material-button-doc__api-card"
            >
              <mat-card-header>
                <mat-card-title>Accessibility</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="accessibility-list">
                  <li>
                    <mat-icon>check_circle</mat-icon>
                    Always provide <code>aria-label</code> for icon-only buttons
                  </li>
                  <li>
                    <mat-icon>check_circle</mat-icon>
                    Use <code>&lt;button&gt;</code> for actions,
                    <code>&lt;a&gt;</code> for navigation
                  </li>
                  <li>
                    <mat-icon>check_circle</mat-icon>
                    Ensure sufficient color contrast (WCAG AA: 4.5:1 for text)
                  </li>
                  <li>
                    <mat-icon>check_circle</mat-icon>
                    Keep focus indicators visible for keyboard navigation
                  </li>
                  <li>
                    <mat-icon>check_circle</mat-icon>
                    Use <code>disabledInteractive</code> when tooltips are
                    needed on disabled buttons
                  </li>
                  <li>
                    <mat-icon>check_circle</mat-icon>
                    FABs should have descriptive labels or aria-labels
                  </li>
                </ul>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- CSS Tokens Tab -->
        <mat-tab label="CSS Tokens">
          <div class="material-button-doc__section">
            <h2 class="material-button-doc__section-title">Design Tokens</h2>
            <p class="material-button-doc__section-description">
              AegisX customizes these Material Design tokens for button styling.
            </p>
            <ax-component-tokens [tokens]="buttonTokens" />

            <h3 class="material-button-doc__subsection-title">
              Custom Styling Example
            </h3>
            <ax-code-tabs [tabs]="customStylingCode" />
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="material-button-doc__section">
            <h2 class="material-button-doc__section-title">Usage Guidelines</h2>

            <!-- Button Hierarchy -->
            <mat-card
              appearance="outlined"
              class="material-button-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar>layers</mat-icon>
                <mat-card-title>Button Hierarchy</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="hierarchy-demo">
                  <div class="hierarchy-item">
                    <button mat-flat-button color="primary">Filled</button>
                    <span>High emphasis - Primary actions</span>
                  </div>
                  <div class="hierarchy-item">
                    <button mat-flat-button class="tonal-button">Tonal</button>
                    <span
                      >Medium-high emphasis - Secondary important actions</span
                    >
                  </div>
                  <div class="hierarchy-item">
                    <button mat-raised-button>Elevated</button>
                    <span>Medium emphasis - Actions needing visual lift</span>
                  </div>
                  <div class="hierarchy-item">
                    <button mat-stroked-button>Outlined</button>
                    <span>Medium emphasis - Alternative actions</span>
                  </div>
                  <div class="hierarchy-item">
                    <button mat-button>Text</button>
                    <span>Low emphasis - Tertiary actions</span>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              class="material-button-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar>check_circle</mat-icon>
                <mat-card-title>Do's</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-button-doc__guide-list">
                  <li>
                    <strong>One primary action:</strong> Use only one filled
                    button per section
                  </li>
                  <li>
                    <strong>Clear labels:</strong> Use action verbs like "Save",
                    "Submit", "Download"
                  </li>
                  <li>
                    <strong>Consistent placement:</strong> Primary actions on
                    the right in forms
                  </li>
                  <li>
                    <strong>Visual hierarchy:</strong> Match button importance
                    to visual weight
                  </li>
                  <li>
                    <strong>Touch targets:</strong> Minimum 48x48px for mobile
                  </li>
                </ul>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              class="material-button-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar color="warn">cancel</mat-icon>
                <mat-card-title>Don'ts</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-button-doc__guide-list">
                  <li>Don't use multiple filled buttons in the same section</li>
                  <li>Don't use FAB for negative actions like "Delete"</li>
                  <li>Don't use vague labels like "Click Here" or "Go"</li>
                  <li>Don't disable buttons without explaining why</li>
                  <li>Don't use icon-only buttons without aria-label</li>
                  <li>Don't mix button styles inconsistently</li>
                </ul>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              class="material-button-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar>touch_app</mat-icon>
                <mat-card-title>FAB Guidelines</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-button-doc__guide-list">
                  <li>
                    <strong>One per screen:</strong> Only one FAB should be
                    present
                  </li>
                  <li>
                    <strong>Primary action:</strong> FAB represents the main
                    action of the screen
                  </li>
                  <li>
                    <strong>Positive actions:</strong> Use for constructive
                    actions (Add, Create, Compose)
                  </li>
                  <li>
                    <strong>Position:</strong> Typically bottom-right corner on
                    desktop, bottom-center on mobile
                  </li>
                  <li>
                    <strong>Extended FAB:</strong> Use when space allows for a
                    text label
                  </li>
                </ul>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .material-button-doc {
        max-width: 1000px;
        margin: 0 auto;

        &__header-links {
          display: flex;
          gap: var(--ax-spacing-md);
          margin-top: var(--ax-spacing-md);
        }

        &__external-link {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8125rem;
          color: var(--ax-brand-default);
          text-decoration: none;

          mat-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
          }

          &:hover {
            text-decoration: underline;
          }
        }

        &__tabs {
          margin-top: var(--ax-spacing-lg);
        }

        &__section {
          padding: var(--ax-spacing-lg);
        }

        &__section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0 0 var(--ax-spacing-sm) 0;
        }

        &__section-description {
          font-size: 0.9375rem;
          color: var(--ax-text-secondary);
          line-height: 1.6;
          margin: 0 0 var(--ax-spacing-xl) 0;
        }

        &__description {
          font-size: 0.875rem;
          color: var(--ax-text-secondary);
          margin: 0 0 var(--ax-spacing-md) 0;
        }

        &__subsection-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: var(--ax-spacing-2xl) 0 var(--ax-spacing-md) 0;

          &:first-of-type {
            margin-top: var(--ax-spacing-xl);
          }
        }

        &__button-row {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ax-spacing-md);
          align-items: center;

          mat-divider[vertical] {
            height: 24px;
            margin: 0 var(--ax-spacing-sm);
          }
        }

        &__button-group {
          display: inline-flex;

          button {
            border-radius: 0;

            &:first-child {
              border-radius: var(--ax-radius-sm) 0 0 var(--ax-radius-sm);
            }

            &:last-child {
              border-radius: 0 var(--ax-radius-sm) var(--ax-radius-sm) 0;
            }

            &:not(:last-child) {
              border-right: none;
            }
          }
        }

        &__api-card {
          margin-bottom: var(--ax-spacing-lg);
        }

        &__api-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;

          th,
          td {
            padding: var(--ax-spacing-sm) var(--ax-spacing-md);
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
            padding: 2px 6px;
            border-radius: var(--ax-radius-sm);
            font-size: 0.8125rem;
          }
        }

        &__guide-card {
          margin-bottom: var(--ax-spacing-lg);

          mat-icon[mat-card-avatar] {
            color: var(--ax-success-default);
          }
        }

        &__guide-list {
          margin: 0;
          padding-left: var(--ax-spacing-lg);
          color: var(--ax-text-primary);
          line-height: 1.8;

          li {
            margin-bottom: var(--ax-spacing-xs);
          }

          strong {
            color: var(--ax-text-heading);
          }

          code {
            background: var(--ax-background-subtle);
            padding: 2px 6px;
            border-radius: var(--ax-radius-sm);
            font-size: 0.8125rem;
          }
        }
      }

      /* Button Overview Table */
      .button-overview-table {
        overflow-x: auto;
        margin-bottom: var(--ax-spacing-xl);

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 600px;
        }

        th,
        td {
          padding: var(--ax-spacing-md);
          text-align: left;
          border-bottom: 1px solid var(--ax-border-default);
          vertical-align: middle;
        }

        th {
          font-weight: 500;
          color: var(--ax-text-secondary);
          font-size: 0.875rem;
        }

        .type-label {
          font-weight: 500;
          color: var(--ax-text-heading);
          white-space: nowrap;
        }

        td:not(.type-label) {
          button,
          a {
            margin-right: var(--ax-spacing-sm);

            &:last-child {
              margin-right: 0;
            }
          }
        }
      }

      /* Tonal Button Styles */
      .tonal-button {
        --mdc-filled-button-container-color: var(--ax-background-muted);
        --mdc-filled-button-label-text-color: var(--ax-text-heading);

        &--primary {
          --mdc-filled-button-container-color: oklch(
            from var(--ax-brand-default) 90% 0.05 h
          );
          --mdc-filled-button-label-text-color: var(--ax-brand-emphasis);
        }

        &--accent {
          --mdc-filled-button-container-color: oklch(
            from var(--ax-accent-default) 90% 0.05 h
          );
          --mdc-filled-button-label-text-color: var(--ax-accent-emphasis);
        }
      }

      /* FAB Row */
      .fab-row {
        gap: var(--ax-spacing-xl);
      }

      .fab-group {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--ax-spacing-sm);
      }

      .fab-label {
        font-size: 0.75rem;
        color: var(--ax-text-secondary);
      }

      /* Toggle Active State */
      .toggle-active {
        --mdc-filled-button-container-color: var(--ax-brand-default);
        --mdc-filled-button-label-text-color: white;
      }

      /* Loading Button */
      .loading-button {
        display: inline-flex;
        align-items: center;
        gap: var(--ax-spacing-sm);
      }

      .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
        animation: spin 0.75s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      /* Hierarchy Demo */
      .hierarchy-demo {
        display: flex;
        flex-direction: column;
        gap: var(--ax-spacing-md);
      }

      .hierarchy-item {
        display: flex;
        align-items: center;
        gap: var(--ax-spacing-lg);

        button {
          min-width: 120px;
        }

        span {
          font-size: 0.875rem;
          color: var(--ax-text-secondary);
        }
      }

      /* Accessibility List */
      .accessibility-list {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          display: flex;
          align-items: flex-start;
          gap: var(--ax-spacing-sm);
          padding: var(--ax-spacing-sm) 0;

          mat-icon {
            color: #22c55e;
            flex-shrink: 0;
            font-size: 20px;
            width: 20px;
            height: 20px;
          }

          code {
            background: var(--ax-background-subtle);
            padding: 2px 6px;
            border-radius: var(--ax-radius-sm);
            font-size: 0.8125rem;
          }
        }
      }
    `,
  ],
})
export class MaterialButtonDocComponent {
  basicUsageCode = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [MatButtonModule],
  template: \`
    <button mat-flat-button color="primary">Submit</button>
    <button mat-stroked-button>Cancel</button>
    <button mat-button>Learn More</button>
  \`
})
export class MyComponent {}`,
    },
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<!-- Filled button (high emphasis) -->
<button mat-flat-button color="primary">Submit</button>

<!-- Outlined button (medium emphasis) -->
<button mat-stroked-button>Cancel</button>

<!-- Text button (low emphasis) -->
<button mat-button>Learn More</button>

<!-- Elevated button -->
<button mat-raised-button>Elevated</button>`,
    },
  ];

  withIconsCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<!-- Icon before text -->
<button mat-flat-button color="primary">
  <mat-icon>save</mat-icon>
  Save
</button>

<!-- Icon after text -->
<button mat-raised-button>
  Upload
  <mat-icon>upload</mat-icon>
</button>

<!-- Navigation arrows -->
<button mat-button color="primary">
  <mat-icon>arrow_back</mat-icon>
  Back
</button>

<button mat-button color="primary">
  Next
  <mat-icon>arrow_forward</mat-icon>
</button>`,
    },
  ];

  buttonGroupCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<div class="button-group">
  <button mat-stroked-button>Day</button>
  <button mat-stroked-button>Week</button>
  <button mat-flat-button color="primary">Month</button>
  <button mat-stroked-button>Year</button>
</div>`,
    },
    {
      language: 'scss' as const,
      label: 'SCSS',
      code: `.button-group {
  display: inline-flex;

  button {
    border-radius: 0;

    &:first-child {
      border-radius: var(--ax-radius-sm) 0 0 var(--ax-radius-sm);
    }

    &:last-child {
      border-radius: 0 var(--ax-radius-sm) var(--ax-radius-sm) 0;
    }

    &:not(:last-child) {
      border-right: none;
    }
  }
}`,
    },
  ];

  interactiveDisabledCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<!-- Disabled button that stays in tab order and shows tooltip -->
<button mat-flat-button color="primary"
        disabled
        disabledInteractive
        matTooltip="Action unavailable - please log in first">
  Publish
</button>

<!-- Regular disabled button (not in tab order) -->
<button mat-flat-button color="primary" disabled>
  Publish
</button>`,
    },
  ];

  anchorButtonsCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<!-- External link -->
<a mat-flat-button color="primary"
   href="https://material.angular.io"
   target="_blank">
  Documentation
</a>

<!-- Router link -->
<a mat-stroked-button routerLink="/docs/material/card">
  View Cards
</a>

<!-- Text link button -->
<a mat-button routerLink="/docs">
  Back to Docs
</a>`,
    },
  ];

  toggleButtonsCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<div class="toolbar">
  <button mat-flat-button [color]="isBold ? 'primary' : undefined"
          (click)="isBold = !isBold">
    <mat-icon>format_bold</mat-icon>
  </button>
  <button mat-button [class.active]="isItalic"
          (click)="isItalic = !isItalic">
    <mat-icon>format_italic</mat-icon>
  </button>
</div>`,
    },
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `@Component({...})
export class ToolbarComponent {
  isBold = false;
  isItalic = false;
}`,
    },
  ];

  loadingButtonsCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<button mat-flat-button color="primary"
        [disabled]="isLoading"
        (click)="save()">
  @if (isLoading) {
    <span class="spinner"></span>
    Saving...
  } @else {
    <mat-icon>save</mat-icon>
    Save
  }
</button>`,
    },
    {
      language: 'scss' as const,
      label: 'SCSS',
      code: `.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}`,
    },
  ];

  customStylingCode = [
    {
      language: 'scss' as const,
      label: 'SCSS',
      code: `/* Customize all filled buttons */
:root {
  --mdc-filled-button-container-shape: var(--ax-radius-md);
  --mdc-filled-button-container-color: var(--ax-brand-default);
  --mdc-filled-button-label-text-color: white;
}

/* Customize outlined buttons */
:root {
  --mdc-outlined-button-container-shape: var(--ax-radius-md);
  --mdc-outlined-button-outline-color: var(--ax-border-default);
}

/* Custom tonal button class */
.tonal-button {
  --mdc-filled-button-container-color: var(--ax-background-muted);
  --mdc-filled-button-label-text-color: var(--ax-text-heading);
}

/* FAB customization */
:root {
  --mdc-fab-container-shape: var(--ax-radius-lg);
  --mdc-fab-container-elevation-shadow: var(--ax-shadow-md);
}`,
    },
  ];

  buttonTokens: ComponentToken[] = [
    {
      cssVar: '--mdc-filled-button-container-shape',
      usage: 'Border radius for filled buttons',
      value: 'var(--ax-radius-sm)',
      category: 'Shape',
    },
    {
      cssVar: '--mdc-filled-button-container-color',
      usage: 'Background color for filled buttons',
      value: 'var(--ax-brand-default)',
      category: 'Color',
    },
    {
      cssVar: '--mdc-outlined-button-container-shape',
      usage: 'Border radius for outlined buttons',
      value: 'var(--ax-radius-sm)',
      category: 'Shape',
    },
    {
      cssVar: '--mdc-outlined-button-outline-color',
      usage: 'Border color for outlined buttons',
      value: 'var(--ax-border-default)',
      category: 'Border',
    },
    {
      cssVar: '--mdc-text-button-container-shape',
      usage: 'Border radius for text buttons',
      value: 'var(--ax-radius-sm)',
      category: 'Shape',
    },
    {
      cssVar: '--mdc-elevated-button-container-elevation',
      usage: 'Shadow for elevated buttons',
      value: 'var(--ax-shadow-sm)',
      category: 'Elevation',
    },
    {
      cssVar: '--mdc-fab-container-shape',
      usage: 'Border radius for FAB buttons',
      value: 'var(--ax-radius-lg)',
      category: 'FAB',
    },
    {
      cssVar: '--mdc-fab-container-elevation-shadow',
      usage: 'Shadow for FAB buttons',
      value: 'var(--ax-shadow-md)',
      category: 'FAB',
    },
  ];
}
