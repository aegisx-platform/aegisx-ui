import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import {
  AxCommandPaletteComponent,
  AxCommandPaletteService,
  CommandGroup,
} from '@aegisx/ui';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../../../components/docs';
import { CodeTab, ComponentToken } from '../../../../../../types/docs.types';

@Component({
  selector: 'app-command-palette-doc',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    AxCommandPaletteComponent,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="command-palette-doc">
      <ax-doc-header
        title="Command Palette"
        icon="terminal"
        description="A searchable command palette for quick access to commands and navigation. Activated with keyboard shortcut (Cmd+K / Ctrl+K)."
        [breadcrumbs]="[
          {
            label: 'Navigation',
            link: '/docs/components/aegisx/navigation/stepper',
          },
          { label: 'Command Palette' },
        ]"
        [showImport]="false"
        [showQuickLinks]="false"
      ></ax-doc-header>

      <!-- Tabs -->
      <mat-tab-group class="docs-tabs" animationDuration="200ms">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="py-6">
            <section class="mb-8">
              <h2 class="text-2xl font-semibold mb-4">Introduction</h2>
              <p class="text-on-surface-variant mb-4">
                The
                <code class="bg-surface-container px-2 py-1 rounded"
                  >ax-command-palette</code
                >
                component provides a keyboard-first interface for quickly
                searching and executing commands. Similar to VS Code's command
                palette or macOS Spotlight.
              </p>
              <div class="flex gap-4 mt-4">
                <button mat-flat-button color="primary" (click)="openPalette()">
                  <mat-icon>keyboard</mat-icon>
                  Open Command Palette
                </button>
                <span class="text-on-surface-variant self-center">
                  or press
                  <kbd
                    class="bg-surface-container px-2 py-1 rounded text-sm font-mono"
                    >{{ isMac ? '⌘' : 'Ctrl' }}+K</kbd
                  >
                </span>
              </div>
            </section>

            <!-- Features -->
            <section class="mb-8">
              <h3 class="text-xl font-semibold mb-4">Key Features</h3>
              <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                @for (feature of features; track feature.title) {
                  <mat-card appearance="outlined" class="p-4">
                    <div class="flex items-center gap-3 mb-2">
                      <mat-icon class="text-primary">{{
                        feature.icon
                      }}</mat-icon>
                      <h4 class="font-semibold">{{ feature.title }}</h4>
                    </div>
                    <p class="text-sm text-on-surface-variant">
                      {{ feature.description }}
                    </p>
                  </mat-card>
                }
              </div>
            </section>

            <!-- Demo Section -->
            <section class="mb-8">
              <h3 class="text-xl font-semibold mb-4">Live Demo</h3>
              <mat-card appearance="outlined" class="p-6">
                <div class="text-center">
                  <mat-icon class="text-6xl text-primary mb-4">search</mat-icon>
                  <h4 class="text-lg font-semibold mb-2">
                    Try the Command Palette
                  </h4>
                  <p class="text-on-surface-variant mb-4">
                    Press the keyboard shortcut or click the button to open the
                    command palette. Try searching for "home", "settings", or
                    "theme".
                  </p>
                  <button
                    mat-flat-button
                    color="primary"
                    (click)="openPalette()"
                  >
                    <mat-icon>keyboard</mat-icon>
                    Open Palette ({{ isMac ? '⌘' : 'Ctrl' }}+K)
                  </button>
                </div>
              </mat-card>
            </section>

            <!-- Basic Usage -->
            <section>
              <h3 class="text-xl font-semibold mb-4">Basic Usage</h3>
              <ax-code-tabs [tabs]="basicUsageTabs"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="py-6 space-y-8">
            <!-- Registering Commands -->
            <section>
              <h3 class="text-xl font-semibold mb-4">Registering Commands</h3>
              <p class="text-on-surface-variant mb-4">
                Use the
                <code class="bg-surface-container px-2 py-1 rounded"
                  >AxCommandPaletteService</code
                >
                to register command groups.
              </p>
              <ax-code-tabs [tabs]="registerCommandsTabs"></ax-code-tabs>
            </section>

            <!-- Navigation Commands -->
            <section>
              <h3 class="text-xl font-semibold mb-4">Navigation Commands</h3>
              <p class="text-on-surface-variant mb-4">
                Commands can navigate to routes using
                <code class="bg-surface-container px-2 py-1 rounded"
                  >routerLink</code
                >.
              </p>
              <ax-code-tabs [tabs]="navigationTabs"></ax-code-tabs>
            </section>

            <!-- Action Commands -->
            <section>
              <h3 class="text-xl font-semibold mb-4">Action Commands</h3>
              <p class="text-on-surface-variant mb-4">
                Commands can execute custom actions via callback functions.
              </p>
              <ax-code-tabs [tabs]="actionTabs"></ax-code-tabs>
            </section>

            <!-- Configuration -->
            <section>
              <h3 class="text-xl font-semibold mb-4">Configuration</h3>
              <p class="text-on-surface-variant mb-4">
                Customize the command palette behavior.
              </p>
              <ax-code-tabs [tabs]="configTabs"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="command-palette-doc__tab-content">
            <!-- Service Methods -->
            <section class="command-palette-doc__section">
              <h2>AxCommandPaletteService Methods</h2>
              <p>
                Service for managing the command palette state and commands.
              </p>
              <div class="command-palette-doc__api-table">
                <table>
                  <thead>
                    <tr>
                      <th>Method</th>
                      <th>Parameters</th>
                      <th>Return</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>registerCommands</code></td>
                      <td><code>group: CommandGroup</code></td>
                      <td><code>void</code></td>
                      <td>Register a group of commands</td>
                    </tr>
                    <tr>
                      <td><code>unregisterCommands</code></td>
                      <td><code>groupId: string</code></td>
                      <td><code>void</code></td>
                      <td>Remove a command group by ID</td>
                    </tr>
                    <tr>
                      <td><code>open</code></td>
                      <td>-</td>
                      <td><code>void</code></td>
                      <td>Open the command palette</td>
                    </tr>
                    <tr>
                      <td><code>close</code></td>
                      <td>-</td>
                      <td><code>void</code></td>
                      <td>Close the command palette</td>
                    </tr>
                    <tr>
                      <td><code>toggle</code></td>
                      <td>-</td>
                      <td><code>void</code></td>
                      <td>Toggle the palette open/close</td>
                    </tr>
                    <tr>
                      <td><code>configure</code></td>
                      <td>
                        <code>config: Partial&lt;CommandPaletteConfig&gt;</code>
                      </td>
                      <td><code>void</code></td>
                      <td>Update configuration options</td>
                    </tr>
                    <tr>
                      <td><code>executeCommand</code></td>
                      <td><code>command: CommandItem</code></td>
                      <td><code>void</code></td>
                      <td>Execute a specific command</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <!-- CommandItem Interface -->
            <section class="command-palette-doc__section">
              <h2>CommandItem Interface</h2>
              <p>Structure of a command item.</p>
              <div class="command-palette-doc__api-table">
                <table>
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Required</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>id</code></td>
                      <td><code>string</code></td>
                      <td>Yes</td>
                      <td>Unique identifier</td>
                    </tr>
                    <tr>
                      <td><code>label</code></td>
                      <td><code>string</code></td>
                      <td>Yes</td>
                      <td>Display label</td>
                    </tr>
                    <tr>
                      <td><code>description</code></td>
                      <td><code>string</code></td>
                      <td>No</td>
                      <td>Additional description</td>
                    </tr>
                    <tr>
                      <td><code>icon</code></td>
                      <td><code>string</code></td>
                      <td>No</td>
                      <td>Material icon name</td>
                    </tr>
                    <tr>
                      <td><code>shortcut</code></td>
                      <td><code>string</code></td>
                      <td>No</td>
                      <td>Keyboard shortcut hint</td>
                    </tr>
                    <tr>
                      <td><code>category</code></td>
                      <td><code>string</code></td>
                      <td>No</td>
                      <td>Category for grouping</td>
                    </tr>
                    <tr>
                      <td><code>keywords</code></td>
                      <td><code>string[]</code></td>
                      <td>No</td>
                      <td>Search keywords</td>
                    </tr>
                    <tr>
                      <td><code>routerLink</code></td>
                      <td><code>string | string[]</code></td>
                      <td>No</td>
                      <td>Navigation route</td>
                    </tr>
                    <tr>
                      <td><code>action</code></td>
                      <td><code>string | (() => void)</code></td>
                      <td>No</td>
                      <td>Action callback or event name</td>
                    </tr>
                    <tr>
                      <td><code>disabled</code></td>
                      <td><code>boolean</code></td>
                      <td>No</td>
                      <td>Whether command is disabled</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <!-- Configuration Options -->
            <section class="command-palette-doc__section">
              <h2>CommandPaletteConfig</h2>
              <p>Configuration options for the command palette.</p>
              <div class="command-palette-doc__api-table">
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
                      <td><code>placeholder</code></td>
                      <td><code>string</code></td>
                      <td><code>'Type a command or search...'</code></td>
                      <td>Input placeholder text</td>
                    </tr>
                    <tr>
                      <td><code>emptyMessage</code></td>
                      <td><code>string</code></td>
                      <td><code>'No commands found.'</code></td>
                      <td>Message when no results</td>
                    </tr>
                    <tr>
                      <td><code>maxRecentCommands</code></td>
                      <td><code>number</code></td>
                      <td><code>5</code></td>
                      <td>Max recent commands to show</td>
                    </tr>
                    <tr>
                      <td><code>showRecent</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Show recent commands section</td>
                    </tr>
                    <tr>
                      <td><code>showShortcuts</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Show keyboard shortcuts</td>
                    </tr>
                    <tr>
                      <td><code>hotkey</code></td>
                      <td><code>string</code></td>
                      <td><code>'k'</code></td>
                      <td>Keyboard shortcut key</td>
                    </tr>
                    <tr>
                      <td><code>useMetaKey</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Use Cmd (Mac) / Ctrl (Windows)</td>
                    </tr>
                    <tr>
                      <td><code>maxHeight</code></td>
                      <td><code>string</code></td>
                      <td><code>'400px'</code></td>
                      <td>Maximum height of results</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <!-- Interfaces -->
            <section class="command-palette-doc__section">
              <h2>Interfaces</h2>
              <ax-code-tabs [tabs]="interfaceTabs"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- Tokens Tab -->
        <mat-tab label="Tokens">
          <div class="py-6">
            <ax-component-tokens
              [tokens]="commandPaletteTokens"
            ></ax-component-tokens>
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="command-palette-doc__tab-content">
            <section class="command-palette-doc__section">
              <h2>Do's and Don'ts</h2>

              <div class="command-palette-doc__guidelines">
                <div
                  class="command-palette-doc__guideline command-palette-doc__guideline--do"
                >
                  <h4><mat-icon>check_circle</mat-icon> Do</h4>
                  <ul>
                    <li>Use clear, action-oriented command labels</li>
                    <li>Add relevant keywords for better search</li>
                    <li>Group related commands together</li>
                    <li>Provide keyboard shortcuts for common actions</li>
                    <li>Use icons to aid visual recognition</li>
                    <li>Keep descriptions concise but informative</li>
                  </ul>
                </div>

                <div
                  class="command-palette-doc__guideline command-palette-doc__guideline--dont"
                >
                  <h4><mat-icon>cancel</mat-icon> Don't</h4>
                  <ul>
                    <li>Overload with too many commands (keep it focused)</li>
                    <li>Use vague or ambiguous labels</li>
                    <li>Register commands that require complex inputs</li>
                    <li>Hide critical actions only in the palette</li>
                    <li>Forget to unregister commands on component destroy</li>
                    <li>Use the same shortcut for multiple commands</li>
                  </ul>
                </div>
              </div>
            </section>

            <section class="command-palette-doc__section">
              <h2>Accessibility</h2>
              <ul class="command-palette-doc__a11y-list">
                <li>Full keyboard navigation with arrow keys</li>
                <li>Focus trap keeps focus within the palette</li>
                <li>ESC key closes the palette</li>
                <li>Enter executes the selected command</li>
                <li>ARIA labels for screen reader compatibility</li>
                <li>High contrast mode support</li>
              </ul>
            </section>

            <section class="command-palette-doc__section">
              <h2>Keyboard Shortcuts</h2>
              <div class="command-palette-doc__shortcuts">
                <div class="shortcut-row">
                  <kbd>{{ isMac ? '⌘' : 'Ctrl' }}+K</kbd>
                  <span>Open/close command palette</span>
                </div>
                <div class="shortcut-row">
                  <kbd>↑ / ↓</kbd>
                  <span>Navigate through commands</span>
                </div>
                <div class="shortcut-row">
                  <kbd>Enter</kbd>
                  <span>Execute selected command</span>
                </div>
                <div class="shortcut-row">
                  <kbd>Escape</kbd>
                  <span>Close palette</span>
                </div>
              </div>
            </section>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>

    <!-- Command Palette Component (global listener) -->
    <ax-command-palette></ax-command-palette>
  `,
  styles: [
    `
      .command-palette-doc {
        max-width: 1200px;
        margin: 0 auto;
      }

      /* Tab Content Styles */
      .command-palette-doc__tab-content {
        padding: var(--ax-spacing-xl, 1.5rem) 0;
      }

      .command-palette-doc__section {
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

      .command-palette-doc__api-table {
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

      /* Guidelines */
      .command-palette-doc__guidelines {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--ax-spacing-lg, 1rem);
      }

      .command-palette-doc__guideline {
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

      .command-palette-doc__guideline--do {
        background: var(--ax-success-faint);

        h4 {
          color: var(--ax-success-emphasis);
        }
        li {
          color: var(--ax-success-emphasis);
        }
      }

      .command-palette-doc__guideline--dont {
        background: var(--ax-error-faint);

        h4 {
          color: var(--ax-error-emphasis);
        }
        li {
          color: var(--ax-error-emphasis);
        }
      }

      .command-palette-doc__a11y-list {
        margin: 0;
        padding-left: var(--ax-spacing-lg, 1rem);

        li {
          font-size: var(--ax-text-sm, 0.875rem);
          color: var(--ax-text-secondary);
          margin-bottom: var(--ax-spacing-sm, 0.5rem);
        }
      }

      .command-palette-doc__shortcuts {
        display: flex;
        flex-direction: column;
        gap: var(--ax-spacing-sm, 0.5rem);

        .shortcut-row {
          display: flex;
          align-items: center;
          gap: var(--ax-spacing-md, 0.75rem);

          kbd {
            min-width: 80px;
            padding: var(--ax-spacing-xs, 0.25rem) var(--ax-spacing-sm, 0.5rem);
            background: var(--ax-background-subtle);
            border: 1px solid var(--ax-border-default);
            border-radius: var(--ax-radius-sm, 0.25rem);
            font-family: var(--ax-font-mono);
            font-size: var(--ax-text-sm, 0.875rem);
            text-align: center;
          }

          span {
            color: var(--ax-text-secondary);
            font-size: var(--ax-text-sm, 0.875rem);
          }
        }
      }
    `,
  ],
})
export class CommandPaletteDocComponent implements OnInit, OnDestroy {
  private commandService = inject(AxCommandPaletteService);

  isMac = false;

  features = [
    {
      icon: 'keyboard',
      title: 'Keyboard First',
      description: 'Quick access with Cmd+K or Ctrl+K shortcut',
    },
    {
      icon: 'search',
      title: 'Fuzzy Search',
      description: 'Smart search with typo tolerance',
    },
    {
      icon: 'history',
      title: 'Recent Commands',
      description: 'Quick access to recently used commands',
    },
    {
      icon: 'navigation',
      title: 'Router Integration',
      description: 'Navigate directly to routes',
    },
    {
      icon: 'play_arrow',
      title: 'Custom Actions',
      description: 'Execute any callback function',
    },
    {
      icon: 'category',
      title: 'Grouped Commands',
      description: 'Organize commands by category',
    },
    {
      icon: 'accessibility',
      title: 'Accessible',
      description: 'Full keyboard navigation support',
    },
    {
      icon: 'dark_mode',
      title: 'Theme Support',
      description: 'Adapts to light and dark themes',
    },
  ];

  basicUsageTabs: CodeTab[] = [
    {
      label: 'HTML',
      language: 'html',
      code: `<!-- Add the command palette component to your app -->
<ax-command-palette></ax-command-palette>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `import { Component, inject, OnInit } from '@angular/core';
import {
  AxCommandPaletteComponent,
  AxCommandPaletteService,
  CommandGroup,
} from '@aegisx/ui';

@Component({
  standalone: true,
  imports: [AxCommandPaletteComponent],
  template: \`<ax-command-palette></ax-command-palette>\`,
})
export class AppComponent implements OnInit {
  private commandService = inject(AxCommandPaletteService);

  ngOnInit() {
    // Register commands
    this.commandService.registerCommands({
      id: 'navigation',
      label: 'Navigation',
      commands: [
        { id: 'home', label: 'Go to Home', icon: 'home', routerLink: '/' },
        { id: 'settings', label: 'Settings', icon: 'settings', routerLink: '/settings' },
      ],
    });
  }
}`,
    },
  ];

  registerCommandsTabs: CodeTab[] = [
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `// Register a group of commands
this.commandService.registerCommands({
  id: 'my-feature',
  label: 'My Feature',
  priority: 100, // Higher = appears first
  commands: [
    {
      id: 'create-item',
      label: 'Create New Item',
      description: 'Add a new item to the list',
      icon: 'add',
      category: 'Actions',
      keywords: ['new', 'add', 'create'],
      shortcut: '⌘N',
      action: () => this.createItem(),
    },
    {
      id: 'edit-item',
      label: 'Edit Selected Item',
      icon: 'edit',
      category: 'Actions',
      disabled: !this.hasSelection,
      action: () => this.editItem(),
    },
  ],
});

// Unregister when done
this.commandService.unregisterCommands('my-feature');`,
    },
  ];

  navigationTabs: CodeTab[] = [
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `this.commandService.registerCommands({
  id: 'navigation',
  label: 'Navigation',
  commands: [
    {
      id: 'go-home',
      label: 'Go to Home',
      icon: 'home',
      routerLink: '/',
      keywords: ['dashboard', 'main'],
    },
    {
      id: 'go-profile',
      label: 'View Profile',
      icon: 'person',
      routerLink: ['/user', 'profile'],
    },
    {
      id: 'go-docs',
      label: 'Open Documentation',
      icon: 'description',
      href: 'https://docs.example.com', // External link
    },
  ],
});`,
    },
  ];

  actionTabs: CodeTab[] = [
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `this.commandService.registerCommands({
  id: 'actions',
  label: 'Actions',
  commands: [
    {
      id: 'toggle-theme',
      label: 'Toggle Dark Mode',
      icon: 'dark_mode',
      shortcut: '⌘⇧D',
      action: () => this.themeService.toggle(),
    },
    {
      id: 'logout',
      label: 'Sign Out',
      icon: 'logout',
      action: () => this.authService.logout(),
    },
    {
      id: 'event-action',
      label: 'Custom Event',
      icon: 'notifications',
      action: 'custom-event', // String action emits via commandExecuted$
    },
  ],
});

// Listen to string action events
this.commandService.commandExecuted$.subscribe(event => {
  if (event.command.action === 'custom-event') {
    console.log('Custom event triggered at', event.timestamp);
  }
});`,
    },
  ];

  configTabs: CodeTab[] = [
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `// Configure the command palette
this.commandService.configure({
  placeholder: 'What would you like to do?',
  emptyMessage: 'No matching commands',
  maxRecentCommands: 10,
  showRecent: true,
  showShortcuts: true,
  hotkey: 'k', // Cmd/Ctrl + K
  useMetaKey: true,
  maxHeight: '500px',
});

// Programmatically control
this.commandService.open();
this.commandService.close();
this.commandService.toggle();`,
    },
  ];

  interfaceTabs: CodeTab[] = [
    {
      label: 'CommandItem',
      language: 'typescript',
      code: `interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  shortcut?: string;
  category?: string;
  keywords?: string[];
  disabled?: boolean;
  action?: string | (() => void);
  routerLink?: string | string[];
  href?: string;
  children?: CommandItem[];
  data?: unknown;
}`,
    },
    {
      label: 'CommandGroup',
      language: 'typescript',
      code: `interface CommandGroup {
  id: string;
  label: string;
  commands: CommandItem[];
  priority?: number;
}`,
    },
    {
      label: 'CommandPaletteConfig',
      language: 'typescript',
      code: `interface CommandPaletteConfig {
  placeholder?: string;
  emptyMessage?: string;
  maxRecentCommands?: number;
  showRecent?: boolean;
  showShortcuts?: boolean;
  hotkey?: string;
  useMetaKey?: boolean;
  searchDebounce?: number;
  maxHeight?: string;
  animationDuration?: number;
}`,
    },
  ];

  commandPaletteTokens: ComponentToken[] = [
    {
      category: 'Colors',
      cssVar: '--ax-background-default',
      usage: 'Palette background',
    },
    {
      category: 'Colors',
      cssVar: '--ax-background-subtle',
      usage: 'Header/footer background, kbd elements',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-primary',
      usage: 'Command label text',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-secondary',
      usage: 'Icons and search icon',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-tertiary',
      usage: 'Group labels, descriptions, hints',
    },
    {
      category: 'Colors',
      cssVar: '--ax-border',
      usage: 'Borders and dividers',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-sm',
      usage: 'Item padding, gaps',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-lg',
      usage: 'Header/footer padding',
    },
    {
      category: 'Borders',
      cssVar: '--ax-radius-lg',
      usage: 'Palette border radius',
    },
    {
      category: 'Borders',
      cssVar: '--ax-radius-sm',
      usage: 'Kbd element radius',
    },
    {
      category: 'Shadows',
      cssVar: '--ax-shadow-xl',
      usage: 'Palette shadow',
    },
    {
      category: 'Typography',
      cssVar: '--ax-text-base',
      usage: 'Input text size',
    },
    {
      category: 'Typography',
      cssVar: '--ax-text-sm',
      usage: 'Command label size',
    },
    {
      category: 'Typography',
      cssVar: '--ax-text-xs',
      usage: 'Group label, shortcut size',
    },
    {
      category: 'Animation',
      cssVar: '--ax-duration-fast',
      usage: 'Hover transition duration',
    },
  ];

  ngOnInit() {
    this.isMac =
      typeof navigator !== 'undefined' &&
      navigator.platform?.toUpperCase().indexOf('MAC') >= 0;

    // Register demo commands
    this.registerDemoCommands();
  }

  ngOnDestroy() {
    this.commandService.unregisterCommands('demo-navigation');
    this.commandService.unregisterCommands('demo-actions');
  }

  openPalette() {
    this.commandService.open();
  }

  private registerDemoCommands() {
    const navigationCommands: CommandGroup = {
      id: 'demo-navigation',
      label: 'Navigation',
      priority: 100,
      commands: [
        {
          id: 'go-home',
          label: 'Go to Home',
          description: 'Navigate to the home page',
          icon: 'home',
          routerLink: '/',
          category: 'Navigation',
          keywords: ['dashboard', 'main', 'start'],
        },
        {
          id: 'go-docs',
          label: 'Documentation',
          description: 'Browse component documentation',
          icon: 'description',
          routerLink: '/docs',
          category: 'Navigation',
          keywords: ['help', 'guide', 'components'],
        },
        {
          id: 'go-settings',
          label: 'Settings',
          description: 'Application settings',
          icon: 'settings',
          routerLink: '/settings',
          category: 'Navigation',
          keywords: ['preferences', 'config'],
        },
      ],
    };

    const actionCommands: CommandGroup = {
      id: 'demo-actions',
      label: 'Actions',
      priority: 50,
      commands: [
        {
          id: 'toggle-theme',
          label: 'Toggle Theme',
          description: 'Switch between light and dark mode',
          icon: 'dark_mode',
          shortcut: '⌘⇧D',
          category: 'Theme',
          keywords: ['dark', 'light', 'mode', 'appearance'],
          action: () => console.log('Toggle theme'),
        },
        {
          id: 'refresh',
          label: 'Refresh Page',
          description: 'Reload the current page',
          icon: 'refresh',
          shortcut: '⌘R',
          category: 'Actions',
          action: () => window.location.reload(),
        },
      ],
    };

    this.commandService.registerCommands(navigationCommands);
    this.commandService.registerCommands(actionCommands);
  }
}
