import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  AxInputOtpComponent,
  OtpLength,
  OtpPattern,
  OtpSize,
} from '@aegisx/ui';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../../../components/docs';
import { ComponentToken } from '../../../../../../types/docs.types';

@Component({
  selector: 'app-input-otp-doc',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    AxInputOtpComponent,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="input-otp-doc">
      <ax-doc-header
        title="Input OTP"
        icon="pin"
        description="Accessible one-time password input component with copy/paste support and keyboard navigation."
        [breadcrumbs]="[
          { label: 'Forms', link: '/docs/components/aegisx/forms/date-picker' },
          { label: 'Input OTP' }
        ]"
        status="stable"
        version="1.0.0"
        importStatement="import { AxInputOtpComponent } from '&#64;aegisx/ui';"
      ></ax-doc-header>

      <mat-tab-group class="docs-tabs" animationDuration="150ms">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="py-6 space-y-8">
            <!-- Introduction -->
            <section>
              <h2 class="text-2xl font-semibold mb-4">Introduction</h2>
              <p class="text-on-surface-variant mb-4">
                The Input OTP component provides a user-friendly way to enter one-time passwords
                and verification codes. It supports various configurations including different
                lengths, patterns, separators, and sizes.
              </p>
            </section>

            <!-- Quick Demo -->
            <section>
              <h3 class="text-xl font-semibold mb-4">Quick Demo</h3>
              <ax-live-preview title="Basic OTP Input" variant="bordered">
                <div class="flex flex-col items-center gap-4">
                  <ax-input-otp
                    [(value)]="demoValue"
                    [length]="6"
                    [separatorAfter]="3"
                    (completed)="onCompleted($event)"
                  />
                  <p class="text-sm text-on-surface-variant">
                    Value: <code class="bg-surface-container px-2 py-1 rounded">{{ demoValue || 'Empty' }}</code>
                  </p>
                </div>
              </ax-live-preview>
            </section>

            <!-- Features -->
            <section>
              <h3 class="text-xl font-semibold mb-4">Key Features</h3>
              <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                @for (feature of features; track feature.title) {
                  <mat-card appearance="outlined" class="p-4">
                    <div class="flex items-center gap-3 mb-2">
                      <mat-icon class="text-primary">{{ feature.icon }}</mat-icon>
                      <h4 class="font-semibold">{{ feature.title }}</h4>
                    </div>
                    <p class="text-sm text-on-surface-variant">{{ feature.description }}</p>
                  </mat-card>
                }
              </div>
            </section>

            <!-- Basic Usage -->
            <section>
              <h3 class="text-xl font-semibold mb-4">Basic Usage</h3>
              <ax-code-tabs [tabs]="basicUsageCode" />
            </section>

            <!-- Interactive Playground -->
            <section>
              <h3 class="text-xl font-semibold mb-4">Interactive Playground</h3>
              <mat-card appearance="outlined" class="p-6">
                <div class="grid md:grid-cols-4 gap-4 mb-6">
                  <mat-form-field appearance="outline">
                    <mat-label>Length</mat-label>
                    <mat-select [(ngModel)]="playgroundLength">
                      <mat-option [value]="4">4 digits</mat-option>
                      <mat-option [value]="5">5 digits</mat-option>
                      <mat-option [value]="6">6 digits</mat-option>
                      <mat-option [value]="8">8 digits</mat-option>
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Pattern</mat-label>
                    <mat-select [(ngModel)]="playgroundPattern">
                      <mat-option value="digits">Digits only</mat-option>
                      <mat-option value="alphanumeric">Alphanumeric</mat-option>
                      <mat-option value="alpha">Letters only</mat-option>
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Size</mat-label>
                    <mat-select [(ngModel)]="playgroundSize">
                      <mat-option value="sm">Small</mat-option>
                      <mat-option value="md">Medium</mat-option>
                      <mat-option value="lg">Large</mat-option>
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Separator After</mat-label>
                    <mat-select [(ngModel)]="playgroundSeparator">
                      <mat-option [value]="0">None</mat-option>
                      <mat-option [value]="2">After 2</mat-option>
                      <mat-option [value]="3">After 3</mat-option>
                      <mat-option [value]="4">After 4</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>

                <div class="flex flex-col items-center gap-4 p-6 bg-surface-container rounded-lg">
                  <ax-input-otp
                    [(value)]="playgroundValue"
                    [length]="playgroundLength"
                    [pattern]="playgroundPattern"
                    [size]="playgroundSize"
                    [separatorAfter]="playgroundSeparator || undefined"
                    [error]="playgroundError"
                    (completed)="onPlaygroundComplete($event)"
                  />
                  <div class="flex gap-4">
                    <button mat-stroked-button (click)="clearPlayground()">
                      <mat-icon>clear</mat-icon>
                      Clear
                    </button>
                    <button mat-stroked-button (click)="playgroundError = !playgroundError">
                      <mat-icon>{{ playgroundError ? 'check' : 'error' }}</mat-icon>
                      {{ playgroundError ? 'Remove Error' : 'Show Error' }}
                    </button>
                  </div>
                  <p class="text-sm text-on-surface-variant">
                    Value: <code class="bg-surface-container-high px-2 py-1 rounded">{{ playgroundValue || 'Empty' }}</code>
                    @if (playgroundComplete()) {
                      <span class="ml-2 text-success">Complete!</span>
                    }
                  </p>
                </div>
              </mat-card>
            </section>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="py-6 space-y-8">
            <!-- Size Variants -->
            <section>
              <h3 class="text-xl font-semibold mb-4">Size Variants</h3>
              <ax-live-preview title="OTP Sizes" variant="bordered">
                <div class="space-y-6">
                  <div>
                    <p class="text-sm text-on-surface-variant mb-2">Small (sm)</p>
                    <ax-input-otp [length]="4" size="sm" />
                  </div>
                  <div>
                    <p class="text-sm text-on-surface-variant mb-2">Medium (md) - Default</p>
                    <ax-input-otp [length]="4" size="md" />
                  </div>
                  <div>
                    <p class="text-sm text-on-surface-variant mb-2">Large (lg)</p>
                    <ax-input-otp [length]="4" size="lg" />
                  </div>
                </div>
              </ax-live-preview>
              <ax-code-tabs [tabs]="sizeVariantsCode" />
            </section>

            <!-- Pattern Variants -->
            <section>
              <h3 class="text-xl font-semibold mb-4">Pattern Variants</h3>
              <ax-live-preview title="Input Patterns" variant="bordered">
                <div class="space-y-6">
                  <div>
                    <p class="text-sm text-on-surface-variant mb-2">Digits Only (default)</p>
                    <ax-input-otp [length]="6" pattern="digits" />
                  </div>
                  <div>
                    <p class="text-sm text-on-surface-variant mb-2">Alphanumeric</p>
                    <ax-input-otp [length]="6" pattern="alphanumeric" />
                  </div>
                  <div>
                    <p class="text-sm text-on-surface-variant mb-2">Letters Only</p>
                    <ax-input-otp [length]="6" pattern="alpha" />
                  </div>
                </div>
              </ax-live-preview>
              <ax-code-tabs [tabs]="patternCode" />
            </section>

            <!-- With Separator -->
            <section>
              <h3 class="text-xl font-semibold mb-4">With Separator</h3>
              <ax-live-preview title="Separator Examples" variant="bordered">
                <div class="space-y-6">
                  <div>
                    <p class="text-sm text-on-surface-variant mb-2">6 digits with separator after 3</p>
                    <ax-input-otp [length]="6" [separatorAfter]="3" />
                  </div>
                  <div>
                    <p class="text-sm text-on-surface-variant mb-2">8 digits with separator after 4</p>
                    <ax-input-otp [length]="8" [separatorAfter]="4" />
                  </div>
                </div>
              </ax-live-preview>
              <ax-code-tabs [tabs]="separatorCode" />
            </section>

            <!-- Error State -->
            <section>
              <h3 class="text-xl font-semibold mb-4">Error State</h3>
              <ax-live-preview title="Error Display" variant="bordered">
                <div class="space-y-4">
                  <ax-input-otp [length]="6" [error]="true" />
                  <p class="text-sm text-error">Invalid verification code. Please try again.</p>
                </div>
              </ax-live-preview>
              <ax-code-tabs [tabs]="errorCode" />
            </section>

            <!-- Real World Examples -->
            <section>
              <h3 class="text-xl font-semibold mb-4">Real World Examples</h3>
              <div class="grid md:grid-cols-2 gap-4">
                <!-- 2FA Verification -->
                <mat-card appearance="outlined" class="p-6">
                  <h4 class="font-semibold mb-4">Two-Factor Authentication</h4>
                  <p class="text-sm text-on-surface-variant mb-4">
                    Enter the 6-digit code from your authenticator app
                  </p>
                  <ax-input-otp
                    [(value)]="twoFaValue"
                    [length]="6"
                    [separatorAfter]="3"
                    (completed)="verify2FA($event)"
                  />
                </mat-card>

                <!-- Phone Verification -->
                <mat-card appearance="outlined" class="p-6">
                  <h4 class="font-semibold mb-4">SMS Verification</h4>
                  <p class="text-sm text-on-surface-variant mb-4">
                    Enter the 4-digit code sent to your phone
                  </p>
                  <ax-input-otp
                    [(value)]="smsValue"
                    [length]="4"
                    [autoFocus]="false"
                    (completed)="verifySMS($event)"
                  />
                </mat-card>
              </div>
            </section>
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="py-6 space-y-8">
            <!-- Inputs -->
            <section>
              <h3 class="text-xl font-semibold mb-4">Component Inputs</h3>
              <mat-card appearance="outlined">
                <div class="p-4 border-b border-outline-variant bg-surface-container">
                  <code class="text-sm">import {{ '{' }} AxInputOtpComponent {{ '}' }} from '@aegisx/ui';</code>
                </div>
                <table mat-table [dataSource]="inputsData" class="w-full">
                  <ng-container matColumnDef="property">
                    <th mat-header-cell *matHeaderCellDef class="font-semibold">Property</th>
                    <td mat-cell *matCellDef="let row">
                      <code class="text-sm text-primary">{{ row.property }}</code>
                    </td>
                  </ng-container>
                  <ng-container matColumnDef="type">
                    <th mat-header-cell *matHeaderCellDef class="font-semibold">Type</th>
                    <td mat-cell *matCellDef="let row">
                      <code class="text-xs bg-surface-container px-1 rounded">{{ row.type }}</code>
                    </td>
                  </ng-container>
                  <ng-container matColumnDef="default">
                    <th mat-header-cell *matHeaderCellDef class="font-semibold">Default</th>
                    <td mat-cell *matCellDef="let row">{{ row.default }}</td>
                  </ng-container>
                  <ng-container matColumnDef="description">
                    <th mat-header-cell *matHeaderCellDef class="font-semibold">Description</th>
                    <td mat-cell *matCellDef="let row">{{ row.description }}</td>
                  </ng-container>
                  <tr mat-header-row *matHeaderRowDef="['property', 'type', 'default', 'description']"></tr>
                  <tr mat-row *matRowDef="let row; columns: ['property', 'type', 'default', 'description'];"></tr>
                </table>
              </mat-card>
            </section>

            <!-- Outputs -->
            <section>
              <h3 class="text-xl font-semibold mb-4">Component Outputs</h3>
              <mat-card appearance="outlined">
                <table mat-table [dataSource]="outputsData" class="w-full">
                  <ng-container matColumnDef="event">
                    <th mat-header-cell *matHeaderCellDef class="font-semibold">Event</th>
                    <td mat-cell *matCellDef="let row">
                      <code class="text-sm text-primary">{{ row.event }}</code>
                    </td>
                  </ng-container>
                  <ng-container matColumnDef="payload">
                    <th mat-header-cell *matHeaderCellDef class="font-semibold">Payload</th>
                    <td mat-cell *matCellDef="let row">
                      <code class="text-xs bg-surface-container px-1 rounded">{{ row.payload }}</code>
                    </td>
                  </ng-container>
                  <ng-container matColumnDef="description">
                    <th mat-header-cell *matHeaderCellDef class="font-semibold">Description</th>
                    <td mat-cell *matCellDef="let row">{{ row.description }}</td>
                  </ng-container>
                  <tr mat-header-row *matHeaderRowDef="['event', 'payload', 'description']"></tr>
                  <tr mat-row *matRowDef="let row; columns: ['event', 'payload', 'description'];"></tr>
                </table>
              </mat-card>
            </section>

            <!-- Methods -->
            <section>
              <h3 class="text-xl font-semibold mb-4">Public Methods</h3>
              <mat-card appearance="outlined">
                <table mat-table [dataSource]="methodsData" class="w-full">
                  <ng-container matColumnDef="method">
                    <th mat-header-cell *matHeaderCellDef class="font-semibold">Method</th>
                    <td mat-cell *matCellDef="let row">
                      <code class="text-sm text-primary">{{ row.method }}</code>
                    </td>
                  </ng-container>
                  <ng-container matColumnDef="description">
                    <th mat-header-cell *matHeaderCellDef class="font-semibold">Description</th>
                    <td mat-cell *matCellDef="let row">{{ row.description }}</td>
                  </ng-container>
                  <tr mat-header-row *matHeaderRowDef="['method', 'description']"></tr>
                  <tr mat-row *matRowDef="let row; columns: ['method', 'description'];"></tr>
                </table>
              </mat-card>
            </section>

            <!-- Types -->
            <section>
              <h3 class="text-xl font-semibold mb-4">Types</h3>
              <mat-card appearance="outlined">
                <div class="p-4 bg-surface-container-lowest">
                  <pre class="text-sm overflow-x-auto"><code>export type OtpLength = 4 | 5 | 6 | 7 | 8;
export type OtpPattern = 'digits' | 'alphanumeric' | 'alpha';
export type OtpSize = 'sm' | 'md' | 'lg';</code></pre>
                </div>
              </mat-card>
            </section>
          </div>
        </mat-tab>

        <!-- Design Tokens Tab -->
        <mat-tab label="Design Tokens">
          <div class="py-6">
            <ax-component-tokens [tokens]="designTokens"></ax-component-tokens>
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
                  <h4 class="font-semibold text-success mb-3 flex items-center gap-2">
                    <mat-icon>check_circle</mat-icon>
                    Do
                  </h4>
                  <ul class="space-y-2 text-sm text-on-surface-variant">
                    <li>Use clear labels explaining what code is expected</li>
                    <li>Show remaining time for code expiration</li>
                    <li>Provide "Resend code" option for SMS/email verification</li>
                    <li>Use appropriate length (4-6 for SMS, 6-8 for 2FA)</li>
                    <li>Auto-focus the input when the page loads</li>
                    <li>Show success feedback when code is verified</li>
                  </ul>
                </mat-card>

                <mat-card appearance="outlined" class="p-4">
                  <h4 class="font-semibold text-error mb-3 flex items-center gap-2">
                    <mat-icon>cancel</mat-icon>
                    Don't
                  </h4>
                  <ul class="space-y-2 text-sm text-on-surface-variant">
                    <li>Don't use for regular text input</li>
                    <li>Don't make codes too long (max 8 characters)</li>
                    <li>Don't auto-submit without user confirmation</li>
                    <li>Don't show the actual code in error messages</li>
                    <li>Don't allow unlimited attempts</li>
                    <li>Don't use without HTTPS</li>
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
                    <mat-icon class="text-primary text-lg">accessibility</mat-icon>
                    <span><strong>ARIA:</strong> Uses role="group" with aria-label for screen readers</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <mat-icon class="text-primary text-lg">accessibility</mat-icon>
                    <span><strong>Keyboard:</strong> Full navigation with Arrow keys, Home, End, Backspace</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <mat-icon class="text-primary text-lg">accessibility</mat-icon>
                    <span><strong>Focus:</strong> Clear focus indicators on each slot</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <mat-icon class="text-primary text-lg">accessibility</mat-icon>
                    <span><strong>Input mode:</strong> Shows numeric keyboard on mobile for digits pattern</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <mat-icon class="text-primary text-lg">accessibility</mat-icon>
                    <span><strong>Autocomplete:</strong> Uses one-time-code autocomplete hint</span>
                  </li>
                </ul>
              </mat-card>
            </section>

            <!-- Keyboard Shortcuts -->
            <section>
              <h3 class="text-xl font-semibold mb-4">Keyboard Shortcuts</h3>
              <mat-card appearance="outlined" class="p-4">
                <div class="grid md:grid-cols-2 gap-4">
                  <div class="flex justify-between items-center py-2 border-b border-outline-variant">
                    <span>Move to next slot</span>
                    <kbd class="px-2 py-1 bg-surface-container rounded text-sm">Tab</kbd>
                  </div>
                  <div class="flex justify-between items-center py-2 border-b border-outline-variant">
                    <span>Move to previous slot</span>
                    <kbd class="px-2 py-1 bg-surface-container rounded text-sm">Shift + Tab</kbd>
                  </div>
                  <div class="flex justify-between items-center py-2 border-b border-outline-variant">
                    <span>Move left</span>
                    <kbd class="px-2 py-1 bg-surface-container rounded text-sm">Arrow Left</kbd>
                  </div>
                  <div class="flex justify-between items-center py-2 border-b border-outline-variant">
                    <span>Move right</span>
                    <kbd class="px-2 py-1 bg-surface-container rounded text-sm">Arrow Right</kbd>
                  </div>
                  <div class="flex justify-between items-center py-2 border-b border-outline-variant">
                    <span>Go to first slot</span>
                    <kbd class="px-2 py-1 bg-surface-container rounded text-sm">Home</kbd>
                  </div>
                  <div class="flex justify-between items-center py-2 border-b border-outline-variant">
                    <span>Go to last slot</span>
                    <kbd class="px-2 py-1 bg-surface-container rounded text-sm">End</kbd>
                  </div>
                  <div class="flex justify-between items-center py-2 border-b border-outline-variant">
                    <span>Delete current & move back</span>
                    <kbd class="px-2 py-1 bg-surface-container rounded text-sm">Backspace</kbd>
                  </div>
                  <div class="flex justify-between items-center py-2 border-b border-outline-variant">
                    <span>Paste code</span>
                    <kbd class="px-2 py-1 bg-surface-container rounded text-sm">Ctrl/Cmd + V</kbd>
                  </div>
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

      kbd {
        font-family: 'Fira Code', 'Consolas', monospace;
        border: 1px solid var(--ax-border-default);
      }
    `,
  ],
})
export class InputOtpDocComponent {
  // Demo values
  demoValue = '';
  twoFaValue = '';
  smsValue = '';

  // Playground state
  playgroundValue = '';
  playgroundLength: OtpLength = 6;
  playgroundPattern: OtpPattern = 'digits';
  playgroundSize: OtpSize = 'md';
  playgroundSeparator: number = 3;
  playgroundError = false;
  playgroundComplete = signal(false);

  // Features
  features = [
    {
      icon: 'content_paste',
      title: 'Copy/Paste',
      description: 'Full support for pasting OTP codes',
    },
    {
      icon: 'keyboard',
      title: 'Keyboard Nav',
      description: 'Arrow keys, Home, End support',
    },
    {
      icon: 'smartphone',
      title: 'Mobile Ready',
      description: 'Numeric keyboard on mobile',
    },
    {
      icon: 'verified',
      title: 'Accessible',
      description: 'ARIA labels and roles',
    },
  ];

  // API Data
  inputsData = [
    {
      property: 'length',
      type: 'OtpLength',
      default: '6',
      description: 'Number of OTP digits (4-8)',
    },
    {
      property: 'pattern',
      type: 'OtpPattern',
      default: "'digits'",
      description: 'Input pattern (digits, alphanumeric, alpha)',
    },
    {
      property: 'size',
      type: 'OtpSize',
      default: "'md'",
      description: 'Component size (sm, md, lg)',
    },
    {
      property: 'separatorAfter',
      type: 'number',
      default: 'undefined',
      description: 'Show separator after this position',
    },
    {
      property: 'separatorChar',
      type: 'string',
      default: "'-'",
      description: 'Separator character',
    },
    {
      property: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disable the input',
    },
    {
      property: 'readonly',
      type: 'boolean',
      default: 'false',
      description: 'Make input readonly',
    },
    {
      property: 'error',
      type: 'boolean',
      default: 'false',
      description: 'Show error state',
    },
    {
      property: 'autoFocus',
      type: 'boolean',
      default: 'false',
      description: 'Auto-focus first slot on init',
    },
    {
      property: 'ariaLabel',
      type: 'string',
      default: "'One-time password input'",
      description: 'Aria label for the group',
    },
  ];

  outputsData = [
    {
      event: 'valueChange',
      payload: 'string',
      description: 'Emits the current OTP value on change',
    },
    {
      event: 'completed',
      payload: 'string',
      description: 'Emits when all slots are filled',
    },
  ];

  methodsData = [
    {
      method: 'clear()',
      description: 'Clear all slots and focus the first one',
    },
    {
      method: 'focus()',
      description: 'Focus the first empty slot or first slot',
    },
  ];

  // Design Tokens
  readonly designTokens: ComponentToken[] = [
    {
      category: 'Colors',
      cssVar: '--ax-border-default',
      usage: 'Slot border color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-border-emphasis',
      usage: 'Filled slot border',
    },
    {
      category: 'Colors',
      cssVar: '--ax-brand-default',
      usage: 'Focus ring color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-brand-faint',
      usage: 'Focus ring background',
    },
    {
      category: 'Colors',
      cssVar: '--ax-error-default',
      usage: 'Error state border',
    },
    {
      category: 'Colors',
      cssVar: '--ax-error-faint',
      usage: 'Error state background',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-heading',
      usage: 'Input text color',
    },
    { category: 'Colors', cssVar: '--ax-text-muted', usage: 'Separator color' },
    {
      category: 'Borders',
      cssVar: '--ax-radius-md',
      usage: 'Slot border radius',
    },
    {
      category: 'Borders',
      cssVar: '--ax-radius-lg',
      usage: 'Large size radius',
    },
    {
      category: 'Background',
      cssVar: '--ax-background-default',
      usage: 'Slot background',
    },
    {
      category: 'Background',
      cssVar: '--ax-background-subtle',
      usage: 'Filled slot background',
    },
  ];

  // Code Examples
  basicUsageCode = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `import { Component, signal } from '@angular/core';
import { AxInputOtpComponent } from '@aegisx/ui';

@Component({
  selector: 'app-otp-example',
  standalone: true,
  imports: [AxInputOtpComponent],
  template: \`
    <ax-input-otp
      [(value)]="otpValue"
      [length]="6"
      [separatorAfter]="3"
      (completed)="onOtpComplete($event)"
    />
    <p>Value: {{ otpValue }}</p>
  \`
})
export class OtpExampleComponent {
  otpValue = '';

  onOtpComplete(code: string): void {
    console.log('OTP Complete:', code);
    // Verify the code
  }
}`,
    },
    {
      language: 'html' as const,
      label: 'Template',
      code: `<ax-input-otp
  [(value)]="otpValue"
  [length]="6"
  [separatorAfter]="3"
  (completed)="onOtpComplete($event)"
/>`,
    },
  ];

  sizeVariantsCode = [
    {
      language: 'html' as const,
      label: 'Template',
      code: `<!-- Small -->
<ax-input-otp [length]="4" size="sm" />

<!-- Medium (default) -->
<ax-input-otp [length]="4" size="md" />

<!-- Large -->
<ax-input-otp [length]="4" size="lg" />`,
    },
  ];

  patternCode = [
    {
      language: 'html' as const,
      label: 'Template',
      code: `<!-- Digits only (default) -->
<ax-input-otp [length]="6" pattern="digits" />

<!-- Alphanumeric (letters and numbers) -->
<ax-input-otp [length]="6" pattern="alphanumeric" />

<!-- Letters only -->
<ax-input-otp [length]="6" pattern="alpha" />`,
    },
  ];

  separatorCode = [
    {
      language: 'html' as const,
      label: 'Template',
      code: `<!-- 6 digits with separator after position 3 -->
<ax-input-otp [length]="6" [separatorAfter]="3" />

<!-- 8 digits with separator after position 4 -->
<ax-input-otp [length]="8" [separatorAfter]="4" />

<!-- Custom separator character -->
<ax-input-otp [length]="6" [separatorAfter]="3" separatorChar="•" />`,
    },
  ];

  errorCode = [
    {
      language: 'html' as const,
      label: 'Template',
      code: `<ax-input-otp [length]="6" [error]="hasError" />

@if (hasError) {
  <p class="text-error">Invalid verification code</p>
}`,
    },
  ];

  // Event handlers
  onCompleted(value: string): void {
    console.log('OTP Completed:', value);
  }

  onPlaygroundComplete(value: string): void {
    this.playgroundComplete.set(true);
    console.log('Playground Complete:', value);
  }

  clearPlayground(): void {
    this.playgroundValue = '';
    this.playgroundComplete.set(false);
  }

  verify2FA(code: string): void {
    console.log('Verifying 2FA:', code);
  }

  verifySMS(code: string): void {
    console.log('Verifying SMS:', code);
  }
}
