import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AxBarcodeScannerComponent } from '@aegisx/ui';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../../../components/docs';
import { ComponentToken } from '../../../../../../types/docs.types';

@Component({
  selector: 'ax-barcode-scanner-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    AxBarcodeScannerComponent,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="barcode-scanner-doc">
      <ax-doc-header
        title="Barcode Scanner"
        icon="qr_code_scanner"
        description="Camera-based and manual barcode scanning with support for multiple formats including QR, EAN-13, Code 128, and more."
        [breadcrumbs]="[
          {
            label: 'Inventory',
            link: '/docs/components/aegisx/inventory/barcode-scanner',
          },
          { label: 'Barcode Scanner' },
        ]"
        status="stable"
        version="1.0.0"
        importStatement="import { AxBarcodeScannerComponent } from '@aegisx/ui';"
      ></ax-doc-header>

      <mat-tab-group
        class="barcode-scanner-doc__tabs"
        animationDuration="150ms"
      >
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="barcode-scanner-doc__tab-content">
            <section class="barcode-scanner-doc__section">
              <h2>Basic Usage</h2>
              <p>
                The Barcode Scanner component provides camera-based scanning
                with ZXing integration and manual entry fallback. It
                automatically detects and decodes multiple barcode formats with
                visual and audio feedback.
              </p>

              <ax-live-preview variant="bordered">
                <div class="barcode-scanner-doc__demo">
                  <ax-barcode-scanner
                    [mode]="'auto'"
                    [formats]="['qr', 'ean13', 'code128']"
                    [beepSound]="true"
                    [showHistory]="true"
                    (scan)="handleScan($event)"
                    (scanError)="handleError($event)"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="basicUsageCode"></ax-code-tabs>
            </section>

            <section class="barcode-scanner-doc__section">
              <h2>Scanner Modes</h2>
              <p>
                Choose between auto (camera with manual fallback), camera-only,
                or manual-only input modes based on device capabilities and user
                preferences.
              </p>

              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-lg)"
                align="stretch"
              >
                <div class="barcode-scanner-doc__demo">
                  <h4>Auto Mode (Recommended)</h4>
                  <p class="demo-description">
                    Automatically uses camera if available, falls back to manual
                    entry
                  </p>
                  <ax-barcode-scanner
                    [mode]="'auto'"
                    [formats]="['qr', 'ean13']"
                    (scan)="handleScan($event)"
                  />
                </div>

                <div class="barcode-scanner-doc__demo">
                  <h4>Manual Entry Mode</h4>
                  <p class="demo-description">
                    Keyboard input with format validation
                  </p>
                  <ax-barcode-scanner
                    [mode]="'manual'"
                    [formats]="['ean13', 'code128']"
                    [placeholder]="'Enter barcode manually...'"
                    (scan)="handleScan($event)"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="modesCode"></ax-code-tabs>
            </section>

            <section class="barcode-scanner-doc__section">
              <h2>Supported Formats</h2>
              <p>
                The scanner supports multiple barcode formats. Specify which
                formats to accept to improve scanning accuracy and validation.
              </p>

              <div class="barcode-scanner-doc__format-grid">
                <div class="format-card">
                  <mat-icon>qr_code</mat-icon>
                  <strong>QR Code</strong>
                  <span>2D matrix barcode</span>
                </div>
                <div class="format-card">
                  <mat-icon>barcode</mat-icon>
                  <strong>EAN-13</strong>
                  <span>13-digit retail standard</span>
                </div>
                <div class="format-card">
                  <mat-icon>barcode</mat-icon>
                  <strong>EAN-8</strong>
                  <span>8-digit compact format</span>
                </div>
                <div class="format-card">
                  <mat-icon>barcode</mat-icon>
                  <strong>Code 128</strong>
                  <span>High-density alphanumeric</span>
                </div>
                <div class="format-card">
                  <mat-icon>barcode</mat-icon>
                  <strong>Code 39</strong>
                  <span>Alphanumeric standard</span>
                </div>
                <div class="format-card">
                  <mat-icon>grid_on</mat-icon>
                  <strong>Data Matrix</strong>
                  <span>2D industrial code</span>
                </div>
              </div>

              <ax-code-tabs [tabs]="formatsCode"></ax-code-tabs>
            </section>

            <section class="barcode-scanner-doc__section">
              <h2>Continuous Scan Mode</h2>
              <p>
                Enable continuous scanning for bulk operations. The scanner will
                keep the camera active and emit multiple scan events until
                manually stopped.
              </p>

              <ax-live-preview variant="bordered">
                <div class="barcode-scanner-doc__demo">
                  <ax-barcode-scanner
                    [mode]="'auto'"
                    [formats]="['qr', 'ean13', 'code128']"
                    [continuousScan]="true"
                    [beepSound]="true"
                    [showHistory]="true"
                    (scan)="handleScan($event)"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="continuousScanCode"></ax-code-tabs>
            </section>

            <section class="barcode-scanner-doc__section">
              <h2>Scan History</h2>
              <p>
                Display recent scans (last 10) with timestamps. Useful for
                verifying scans and preventing duplicates in workflows.
              </p>

              <ax-live-preview variant="bordered">
                <div class="barcode-scanner-doc__demo">
                  <ax-barcode-scanner
                    [mode]="'manual'"
                    [formats]="['qr', 'ean13', 'code128']"
                    [showHistory]="true"
                    [beepSound]="false"
                    (scan)="handleScan($event)"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="historyCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="barcode-scanner-doc__tab-content">
            <section class="barcode-scanner-doc__section">
              <h2>Product Receiving</h2>
              <p>
                Scan incoming products during receiving process with continuous
                mode and history tracking for verification.
              </p>

              <ax-live-preview variant="bordered">
                <div class="barcode-scanner-doc__example">
                  <div class="example-header">
                    <h4>Receive Shipment #SH-2025-001</h4>
                    <span class="scanned-count">Scanned: 0 items</span>
                  </div>
                  <ax-barcode-scanner
                    [mode]="'auto'"
                    [formats]="['ean13', 'code128']"
                    [continuousScan]="true"
                    [beepSound]="true"
                    [showHistory]="true"
                    (scan)="handleProductReceiving($event)"
                  />
                </div>
              </ax-live-preview>
            </section>

            <section class="barcode-scanner-doc__section">
              <h2>Stock Taking</h2>
              <p>
                Quick barcode lookup during inventory counts with manual entry
                fallback for damaged labels.
              </p>

              <ax-live-preview variant="bordered">
                <div class="barcode-scanner-doc__example">
                  <div class="example-header">
                    <mat-icon>inventory</mat-icon>
                    <h4>Stock Count - Location A1-B2</h4>
                  </div>
                  <ax-barcode-scanner
                    [mode]="'auto'"
                    [formats]="['qr', 'ean13', 'code128']"
                    [continuousScan]="false"
                    [beepSound]="true"
                    [placeholder]="'Scan or enter product barcode...'"
                    (scan)="handleStockTaking($event)"
                    (scanError)="handleError($event)"
                  />
                  <p class="example-hint">
                    <mat-icon>info</mat-icon>
                    Camera not working? Switch to manual entry mode.
                  </p>
                </div>
              </ax-live-preview>
            </section>

            <section class="barcode-scanner-doc__section">
              <h2>Asset Tracking</h2>
              <p>
                Scan QR codes on equipment and assets with history for audit
                trails.
              </p>

              <ax-live-preview variant="bordered">
                <div class="barcode-scanner-doc__example">
                  <div class="example-header">
                    <mat-icon>devices</mat-icon>
                    <h4>Equipment Checkout</h4>
                  </div>
                  <ax-barcode-scanner
                    [mode]="'camera'"
                    [formats]="['qr']"
                    [continuousScan]="false"
                    [beepSound]="true"
                    [showHistory]="true"
                    (scan)="handleAssetTracking($event)"
                  />
                </div>
              </ax-live-preview>
            </section>

            <section class="barcode-scanner-doc__section">
              <h2>Permission Error Handling</h2>
              <p>
                Graceful handling of camera permission denial with automatic
                fallback to manual entry.
              </p>

              <ax-live-preview variant="bordered">
                <div class="barcode-scanner-doc__example">
                  <div class="example-info">
                    <mat-icon>info</mat-icon>
                    <p>
                      When camera permission is denied, the scanner
                      automatically switches to manual entry mode. Users can
                      re-enable camera access in browser settings.
                    </p>
                  </div>
                  <ax-barcode-scanner
                    [mode]="'auto'"
                    [formats]="['qr', 'ean13']"
                    (scanError)="handlePermissionError($event)"
                    (modeChange)="handleModeChange($event)"
                  />
                </div>
              </ax-live-preview>

              <ax-code-tabs [tabs]="errorHandlingCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="barcode-scanner-doc__tab-content">
            <section class="barcode-scanner-doc__section">
              <h2>Input Properties</h2>
              <div class="barcode-scanner-doc__api-table">
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
                      <td><code>mode</code></td>
                      <td><code>'auto' | 'camera' | 'manual'</code></td>
                      <td><code>'auto'</code></td>
                      <td>
                        Scanner mode: auto (camera with fallback), camera-only,
                        or manual-only
                      </td>
                    </tr>
                    <tr>
                      <td><code>formats</code></td>
                      <td><code>BarcodeFormat[]</code></td>
                      <td><code>['qr', 'ean13', 'code128']</code></td>
                      <td>Supported barcode formats to scan and validate</td>
                    </tr>
                    <tr>
                      <td><code>continuousScan</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Keep camera active for multiple scans</td>
                    </tr>
                    <tr>
                      <td><code>beepSound</code></td>
                      <td><code>boolean</code></td>
                      <td><code>true</code></td>
                      <td>Play beep sound on successful scan</td>
                    </tr>
                    <tr>
                      <td><code>showHistory</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Display recent scans (last 10)</td>
                    </tr>
                    <tr>
                      <td><code>placeholder</code></td>
                      <td><code>string</code></td>
                      <td><code>'Enter barcode...'</code></td>
                      <td>Placeholder text for manual entry input</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="barcode-scanner-doc__section">
              <h2>Output Events</h2>
              <div class="barcode-scanner-doc__api-table">
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
                      <td><code>scan</code></td>
                      <td><code>ScanResult</code></td>
                      <td>
                        Emitted when barcode is successfully scanned or entered
                      </td>
                    </tr>
                    <tr>
                      <td><code>scanError</code></td>
                      <td><code>ScanError</code></td>
                      <td>
                        Emitted on errors (permission denied, invalid format,
                        camera error)
                      </td>
                    </tr>
                    <tr>
                      <td><code>modeChange</code></td>
                      <td><code>'camera' | 'manual'</code></td>
                      <td>Emitted when scanner mode changes</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="barcode-scanner-doc__section">
              <h2>Type Definitions</h2>

              <h3>ScanResult</h3>
              <pre><code>interface ScanResult &#123;
  code: string;              // Scanned barcode value
  format: BarcodeFormat;     // Detected format
  timestamp: Date;           // Timestamp of scan
  mode: 'camera' | 'manual'; // Mode used for scanning
&#125;</code></pre>

              <h3>ScanError</h3>
              <pre><code>interface ScanError &#123;
  type: 'permission-denied' | 'invalid-format' | 'camera-error' | 'timeout';
  message: string;
&#125;</code></pre>

              <h3>BarcodeFormat</h3>
              <pre><code>type BarcodeFormat =
  | 'qr'          // QR Code
  | 'ean13'       // EAN-13 (13 digits)
  | 'ean8'        // EAN-8 (8 digits)
  | 'code128'     // Code 128 (alphanumeric)
  | 'code39'      // Code 39 (alphanumeric)
  | 'datamatrix'; // Data Matrix (2D)</code></pre>

              <h3>ScannerMode</h3>
              <pre><code>type ScannerMode =
  | 'auto'    // Camera with manual fallback
  | 'camera'  // Camera only
  | 'manual'; // Manual entry only</code></pre>
            </section>

            <section class="barcode-scanner-doc__section">
              <h2>Camera Permissions</h2>
              <div class="barcode-scanner-doc__permissions">
                <div class="permission-flow">
                  <div class="permission-step">
                    <mat-icon>videocam</mat-icon>
                    <strong>Request Permission</strong>
                    <p>Browser prompts user for camera access on first use</p>
                  </div>
                  <mat-icon class="arrow">arrow_forward</mat-icon>
                  <div class="permission-step">
                    <mat-icon>check_circle</mat-icon>
                    <strong>Granted</strong>
                    <p>Camera activates and scanning begins</p>
                  </div>
                  <mat-icon class="arrow">arrow_forward</mat-icon>
                  <div class="permission-step">
                    <mat-icon>block</mat-icon>
                    <strong>Denied</strong>
                    <p>Falls back to manual entry mode (auto mode)</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </mat-tab>

        <!-- Tokens Tab -->
        <mat-tab label="Tokens">
          <div class="barcode-scanner-doc__tab-content">
            <ax-component-tokens
              [tokens]="barcodeScannerTokens"
            ></ax-component-tokens>
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="barcode-scanner-doc__tab-content">
            <section class="barcode-scanner-doc__section">
              <h2>Do's and Don'ts</h2>

              <div class="barcode-scanner-doc__guidelines">
                <div
                  class="barcode-scanner-doc__guideline barcode-scanner-doc__guideline--do"
                >
                  <h4><mat-icon>check_circle</mat-icon> Do</h4>
                  <ul>
                    <li>
                      Use 'auto' mode for best user experience across devices
                    </li>
                    <li>
                      Specify only the barcode formats you actually need to
                      improve accuracy
                    </li>
                    <li>
                      Handle scanError events gracefully with user-friendly
                      messages
                    </li>
                    <li>
                      Enable beep sound for confirmation in noisy environments
                    </li>
                    <li>
                      Use continuousScan for bulk operations like receiving
                      shipments
                    </li>
                    <li>
                      Show scan history for verification and duplicate
                      prevention
                    </li>
                    <li>
                      Provide clear instructions when camera permission is
                      required
                    </li>
                  </ul>
                </div>

                <div
                  class="barcode-scanner-doc__guideline barcode-scanner-doc__guideline--dont"
                >
                  <h4><mat-icon>cancel</mat-icon> Don't</h4>
                  <ul>
                    <li>
                      Force camera-only mode without manual entry fallback
                    </li>
                    <li>
                      Allow all barcode formats if you only need specific types
                    </li>
                    <li>
                      Ignore scanError events - always handle permission denials
                    </li>
                    <li>
                      Use continuous scan mode without a clear way to stop
                      scanning
                    </li>
                    <li>
                      Forget to validate scanned codes against your database
                    </li>
                    <li>
                      Disable beep sound without alternative visual feedback
                    </li>
                    <li>
                      Use camera scanning in poor lighting without guidance to
                      user
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section class="barcode-scanner-doc__section">
              <h2>Accessibility</h2>
              <ul class="barcode-scanner-doc__a11y-list">
                <li>
                  Camera permission prompts are provided by the browser and
                  follow native accessibility standards
                </li>
                <li>
                  Manual entry mode is fully keyboard accessible with Enter key
                  submission
                </li>
                <li>
                  Scan history list includes proper ARIA labels for screen
                  readers
                </li>
                <li>
                  Error messages are announced to screen readers via ARIA live
                  regions
                </li>
                <li>
                  Mode toggle buttons have descriptive labels and keyboard focus
                  indicators
                </li>
                <li>
                  Beep sound can be disabled for users who prefer silent
                  operation
                </li>
              </ul>
            </section>

            <section class="barcode-scanner-doc__section">
              <h2>Best Practices</h2>
              <ul class="barcode-scanner-doc__best-practices">
                <li>
                  <strong>Mode Selection:</strong> Use 'auto' mode by default to
                  handle both camera-capable and camera-less devices gracefully
                </li>
                <li>
                  <strong>Format Filtering:</strong> Specify only the formats
                  your system uses (e.g., ['ean13'] for retail products) to
                  improve scan speed and accuracy
                </li>
                <li>
                  <strong>Continuous Scanning:</strong> Enable for bulk
                  operations but provide clear visual indication that scanning
                  is active and a way to stop
                </li>
                <li>
                  <strong>Error Handling:</strong> Always handle
                  permission-denied errors by showing instructions to enable
                  camera access in browser settings
                </li>
                <li>
                  <strong>Validation:</strong> After scanning, validate the
                  barcode against your database and show clear feedback if not
                  found
                </li>
                <li>
                  <strong>Feedback:</strong> Combine beep sound with visual
                  feedback (success/error states) for better user experience
                </li>
                <li>
                  <strong>Mobile Optimization:</strong> On mobile devices, the
                  camera viewfinder should use the rear camera by default
                  (environment facing mode)
                </li>
                <li>
                  <strong>Lighting Conditions:</strong> Provide guidance when
                  scans fail repeatedly - suggest better lighting or manual
                  entry
                </li>
              </ul>
            </section>

            <section class="barcode-scanner-doc__section">
              <h2>Browser Compatibility</h2>
              <div class="barcode-scanner-doc__browser-compat">
                <div class="compat-item">
                  <mat-icon>check_circle</mat-icon>
                  <strong>Chrome/Edge 87+</strong>
                  <span>Full camera support with flashlight control</span>
                </div>
                <div class="compat-item">
                  <mat-icon>check_circle</mat-icon>
                  <strong>Safari 14+</strong>
                  <span>Camera support (no flashlight on iOS)</span>
                </div>
                <div class="compat-item">
                  <mat-icon>check_circle</mat-icon>
                  <strong>Firefox 90+</strong>
                  <span>Camera support with permission prompts</span>
                </div>
                <div class="compat-item">
                  <mat-icon>warning</mat-icon>
                  <strong>Older Browsers</strong>
                  <span>Falls back to manual entry mode</span>
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
      .barcode-scanner-doc {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--ax-spacing-xl, 1.5rem);
      }

      .barcode-scanner-doc__tabs {
        margin-top: var(--ax-spacing-xl, 1.5rem);
      }

      .barcode-scanner-doc__tab-content {
        padding: var(--ax-spacing-xl, 1.5rem) 0;
      }

      .barcode-scanner-doc__section {
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

      .barcode-scanner-doc__demo {
        width: 100%;

        h4 {
          font-size: var(--ax-text-sm, 0.875rem);
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0 0 var(--ax-spacing-xs, 0.25rem) 0;
        }

        .demo-description {
          font-size: var(--ax-text-xs, 0.75rem);
          color: var(--ax-text-secondary);
          margin: 0 0 var(--ax-spacing-sm, 0.5rem) 0;
        }
      }

      /* Format Grid */
      .barcode-scanner-doc__format-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: var(--ax-spacing-md, 0.75rem);
        margin: var(--ax-spacing-lg, 1rem) 0;

        .format-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: var(--ax-spacing-md, 0.75rem);
          border: 1px solid var(--ax-border-default);
          border-radius: var(--ax-radius-md, 0.5rem);
          background: var(--ax-background-default);

          mat-icon {
            font-size: 32px;
            width: 32px;
            height: 32px;
            color: var(--ax-primary-default);
            margin-bottom: var(--ax-spacing-xs, 0.25rem);
          }

          strong {
            font-size: var(--ax-text-sm, 0.875rem);
            font-weight: 600;
            color: var(--ax-text-heading);
            margin-bottom: var(--ax-spacing-xs, 0.25rem);
          }

          span {
            font-size: var(--ax-text-xs, 0.75rem);
            color: var(--ax-text-secondary);
          }
        }
      }

      /* Example Styles */
      .barcode-scanner-doc__example {
        width: 100%;

        .example-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--ax-spacing-sm, 0.5rem);
          margin-bottom: var(--ax-spacing-md, 0.75rem);
          padding-bottom: var(--ax-spacing-sm, 0.5rem);
          border-bottom: 1px solid var(--ax-border-default);

          mat-icon {
            color: var(--ax-primary-default);
          }

          h4 {
            flex: 1;
            font-size: var(--ax-text-base, 1rem);
            font-weight: 600;
            color: var(--ax-text-heading);
            margin: 0;
          }

          .scanned-count {
            font-size: var(--ax-text-sm, 0.875rem);
            color: var(--ax-text-secondary);
          }
        }

        .example-hint {
          display: flex;
          align-items: center;
          gap: var(--ax-spacing-xs, 0.25rem);
          font-size: var(--ax-text-xs, 0.75rem);
          color: var(--ax-text-secondary);
          margin-top: var(--ax-spacing-sm, 0.5rem);

          mat-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
          }
        }

        .example-info {
          display: flex;
          gap: var(--ax-spacing-sm, 0.5rem);
          padding: var(--ax-spacing-md, 0.75rem);
          background: var(--ax-info-faint);
          border: 1px solid var(--ax-info-default);
          border-radius: var(--ax-radius-md, 0.5rem);
          margin-bottom: var(--ax-spacing-md, 0.75rem);

          mat-icon {
            flex-shrink: 0;
            color: var(--ax-info-default);
          }

          p {
            font-size: var(--ax-text-sm, 0.875rem);
            color: var(--ax-info-emphasis);
            margin: 0;
          }
        }
      }

      /* API Table */
      .barcode-scanner-doc__api-table {
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

      /* Permissions Flow */
      .barcode-scanner-doc__permissions {
        margin-top: var(--ax-spacing-md, 0.75rem);

        .permission-flow {
          display: flex;
          align-items: center;
          gap: var(--ax-spacing-md, 0.75rem);
          flex-wrap: wrap;

          .permission-step {
            flex: 1;
            min-width: 150px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: var(--ax-spacing-md, 0.75rem);
            border: 1px solid var(--ax-border-default);
            border-radius: var(--ax-radius-md, 0.5rem);
            background: var(--ax-background-default);

            mat-icon {
              font-size: 32px;
              width: 32px;
              height: 32px;
              margin-bottom: var(--ax-spacing-xs, 0.25rem);
            }

            strong {
              font-size: var(--ax-text-sm, 0.875rem);
              font-weight: 600;
              color: var(--ax-text-heading);
              margin-bottom: var(--ax-spacing-xs, 0.25rem);
            }

            p {
              font-size: var(--ax-text-xs, 0.75rem);
              color: var(--ax-text-secondary);
              margin: 0;
            }
          }

          mat-icon.arrow {
            color: var(--ax-text-secondary);
            flex-shrink: 0;
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
      .barcode-scanner-doc__guidelines {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--ax-spacing-lg, 1rem);
      }

      .barcode-scanner-doc__guideline {
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

      .barcode-scanner-doc__guideline--do {
        background: var(--ax-success-faint);

        h4 {
          color: var(--ax-success-emphasis);
        }
        li {
          color: var(--ax-success-emphasis);
        }
      }

      .barcode-scanner-doc__guideline--dont {
        background: var(--ax-error-faint);

        h4 {
          color: var(--ax-error-emphasis);
        }
        li {
          color: var(--ax-error-emphasis);
        }
      }

      .barcode-scanner-doc__a11y-list,
      .barcode-scanner-doc__best-practices {
        margin: 0;
        padding-left: var(--ax-spacing-lg, 1rem);

        li {
          font-size: var(--ax-text-sm, 0.875rem);
          color: var(--ax-text-secondary);
          margin-bottom: var(--ax-spacing-sm, 0.5rem);
        }
      }

      /* Browser Compatibility */
      .barcode-scanner-doc__browser-compat {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--ax-spacing-md, 0.75rem);
        margin-top: var(--ax-spacing-md, 0.75rem);

        .compat-item {
          display: flex;
          flex-direction: column;
          gap: var(--ax-spacing-xs, 0.25rem);
          padding: var(--ax-spacing-md, 0.75rem);
          border: 1px solid var(--ax-border-default);
          border-radius: var(--ax-radius-md, 0.5rem);
          background: var(--ax-background-default);

          mat-icon {
            font-size: 24px;
            width: 24px;
            height: 24px;
            margin-bottom: var(--ax-spacing-xs, 0.25rem);

            &[class*='check'] {
              color: var(--ax-success-default);
            }

            &[class*='warning'] {
              color: var(--ax-warning-default);
            }
          }

          strong {
            font-size: var(--ax-text-sm, 0.875rem);
            font-weight: 600;
            color: var(--ax-text-heading);
          }

          span {
            font-size: var(--ax-text-xs, 0.75rem);
            color: var(--ax-text-secondary);
          }
        }
      }
    `,
  ],
})
export class BarcodeScannerDocComponent {
  basicUsageCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-barcode-scanner
  [mode]="'auto'"
  [formats]="['qr', 'ean13', 'code128']"
  [beepSound]="true"
  [showHistory]="true"
  (scan)="handleScan($event)"
  (scanError)="handleError($event)"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxBarcodeScannerComponent, ScanResult, ScanError } from '@aegisx/ui';

@Component({
  selector: 'app-product-scanner',
  standalone: true,
  imports: [AxBarcodeScannerComponent],
  template: \`
    <ax-barcode-scanner
      [mode]="'auto'"
      [formats]="['qr', 'ean13', 'code128']"
      (scan)="handleScan($event)"
      (scanError)="handleError($event)"
    />
  \`,
})
export class ProductScannerComponent {
  handleScan(result: ScanResult): void {
    console.log('Scanned:', result.code);
    console.log('Format:', result.format);
    console.log('Mode:', result.mode);

    // Look up product by barcode
    this.productService.findByBarcode(result.code).subscribe();
  }

  handleError(error: ScanError): void {
    console.error('Scan error:', error.type, error.message);
  }
}`,
    },
  ];

  modesCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Auto mode (recommended) -->
<ax-barcode-scanner
  [mode]="'auto'"
  [formats]="['qr', 'ean13']"
  (scan)="handleScan($event)"
/>

<!-- Camera only -->
<ax-barcode-scanner
  [mode]="'camera'"
  [formats]="['qr']"
  (scan)="handleScan($event)"
/>

<!-- Manual entry only -->
<ax-barcode-scanner
  [mode]="'manual'"
  [formats]="['ean13', 'code128']"
  [placeholder]="'Enter barcode manually...'"
  (scan)="handleScan($event)"
/>`,
    },
  ];

  formatsCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- QR codes only (asset tracking) -->
<ax-barcode-scanner
  [formats]="['qr']"
  (scan)="handleScan($event)"
/>

<!-- Retail products (EAN-13) -->
<ax-barcode-scanner
  [formats]="['ean13']"
  (scan)="handleScan($event)"
/>

<!-- Industrial applications (Code 128) -->
<ax-barcode-scanner
  [formats]="['code128', 'code39']"
  (scan)="handleScan($event)"
/>

<!-- Multiple formats -->
<ax-barcode-scanner
  [formats]="['qr', 'ean13', 'ean8', 'code128']"
  (scan)="handleScan($event)"
/>`,
    },
  ];

  continuousScanCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-barcode-scanner
  [mode]="'auto'"
  [formats]="['ean13', 'code128']"
  [continuousScan]="true"
  [beepSound]="true"
  [showHistory]="true"
  (scan)="handleBulkScan($event)"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component, signal } from '@angular/core';
import { AxBarcodeScannerComponent, ScanResult } from '@aegisx/ui';

@Component({
  selector: 'app-bulk-scanner',
  standalone: true,
  imports: [AxBarcodeScannerComponent],
  template: \`
    <div>
      <h3>Scanned Items: {{ scannedItems().length }}</h3>
      <ax-barcode-scanner
        [continuousScan]="true"
        [showHistory]="true"
        (scan)="handleBulkScan($event)"
      />
    </div>
  \`,
})
export class BulkScannerComponent {
  scannedItems = signal<ScanResult[]>([]);

  handleBulkScan(result: ScanResult): void {
    // Add to scanned items
    this.scannedItems.update(items => [...items, result]);

    // Process in real-time
    this.processScannedItem(result.code);
  }
}`,
    },
  ];

  historyCode = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-barcode-scanner
  [mode]="'manual'"
  [formats]="['qr', 'ean13', 'code128']"
  [showHistory]="true"
  (scan)="handleScan($event)"
/>`,
    },
  ];

  errorHandlingCode = [
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component } from '@angular/core';
import { AxBarcodeScannerComponent, ScanError } from '@aegisx/ui';

@Component({
  selector: 'app-scanner-with-error-handling',
  standalone: true,
  imports: [AxBarcodeScannerComponent],
  template: \`
    <ax-barcode-scanner
      [mode]="'auto'"
      (scanError)="handleError($event)"
      (modeChange)="handleModeChange($event)"
    />
  \`,
})
export class ScannerWithErrorHandlingComponent {
  handleError(error: ScanError): void {
    switch (error.type) {
      case 'permission-denied':
        this.showPermissionDialog();
        break;
      case 'camera-error':
        this.showCameraErrorMessage(error.message);
        break;
      case 'invalid-format':
        this.showFormatError(error.message);
        break;
    }
  }

  handleModeChange(mode: 'camera' | 'manual'): void {
    console.log('Scanner mode changed to:', mode);
    if (mode === 'manual') {
      this.showManualModeNotification();
    }
  }

  private showPermissionDialog(): void {
    // Show instructions to enable camera permission
    alert('Camera permission is required. Please enable it in browser settings.');
  }
}`,
    },
  ];

  barcodeScannerTokens: ComponentToken[] = [
    {
      category: 'Colors',
      cssVar: '--ax-primary-default',
      usage: 'Scanner viewfinder border and icons',
    },
    {
      category: 'Colors',
      cssVar: '--ax-success-default',
      usage: 'Successful scan feedback',
    },
    {
      category: 'Colors',
      cssVar: '--ax-error-default',
      usage: 'Scan error state and messages',
    },
    {
      category: 'Colors',
      cssVar: '--ax-background-default',
      usage: 'Scanner container background',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-heading',
      usage: 'Scanner header and labels',
    },
    {
      category: 'Colors',
      cssVar: '--ax-text-secondary',
      usage: 'Timestamps and helper text',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-md',
      usage: 'Scanner component padding',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-sm',
      usage: 'History item spacing',
    },
    {
      category: 'Borders',
      cssVar: '--ax-radius-md',
      usage: 'Scanner container corner rounding',
    },
    {
      category: 'Borders',
      cssVar: '--ax-border-default',
      usage: 'Scanner container border',
    },
  ];

  handleScan(result: any): void {
    console.log('Scan result:', result);
  }

  handleError(error: any): void {
    console.error('Scan error:', error);
  }

  handleProductReceiving(result: any): void {
    console.log('Product receiving:', result);
  }

  handleStockTaking(result: any): void {
    console.log('Stock taking:', result);
  }

  handleAssetTracking(result: any): void {
    console.log('Asset tracking:', result);
  }

  handlePermissionError(error: any): void {
    console.error('Permission error:', error);
  }

  handleModeChange(mode: string): void {
    console.log('Mode changed to:', mode);
  }
}
