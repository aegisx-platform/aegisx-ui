import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { AxThemeBuilderComponent, ThemeBuilderService } from '@aegisx/ui';
import { CodeTabsComponent } from '../../../../../../components/docs/code-tabs/code-tabs.component';
import { CodeTab } from '../../../../../../types/docs.types';

@Component({
  selector: 'app-theme-builder-doc',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatCardModule,
    AxThemeBuilderComponent,
    CodeTabsComponent,
  ],
  template: `
    <div class="doc-page">
      <!-- Header -->
      <header class="doc-header">
        <h1>Theme Builder</h1>
        <p class="doc-description">
          Visual editor for customizing design tokens and color palettes. Create
          and export custom themes in SCSS, CSS, JSON, or Tailwind format.
        </p>
        <div class="doc-badges">
          <span class="badge new">New</span>
          <span class="badge">Visual Editor</span>
          <span class="badge">Export Ready</span>
        </div>

        <a routerLink="/tools/theme-builder" class="open-tool-btn">
          <mat-icon>open_in_new</mat-icon>
          Open Full Screen Tool
        </a>
      </header>

      <!-- Table of Contents -->
      <nav class="doc-toc">
        <h4>On this page</h4>
        <ul>
          <li><a href="#live-demo">Live Demo</a></li>
          <li><a href="#usage">Usage</a></li>
          <li><a href="#api-reference">API Reference</a></li>
          <li><a href="#code-export" class="new">Code Export</a></li>
          <li><a href="#export-formats">Export Formats</a></li>
          <li><a href="#m3-color-scheme">M3 Color Scheme</a></li>
        </ul>
      </nav>

      <!-- Quick Features -->
      <section class="feature-grid">
        <div class="feature-card">
          <mat-icon>palette</mat-icon>
          <h3>Color Palettes</h3>
          <p>
            Create complete color palettes with 10 shades from a single base
            color
          </p>
        </div>
        <div class="feature-card">
          <mat-icon>text_fields</mat-icon>
          <h3>Typography</h3>
          <p>Configure font families, sizes, weights, and line heights</p>
        </div>
        <div class="feature-card">
          <mat-icon>space_bar</mat-icon>
          <h3>Spacing & Radius</h3>
          <p>Define consistent spacing scale and border radius values</p>
        </div>
        <div class="feature-card">
          <mat-icon>download</mat-icon>
          <h3>Export</h3>
          <p>Export as SCSS, CSS, JSON, or Tailwind configuration</p>
        </div>
      </section>

      <!-- Live Demo -->
      <section id="live-demo" class="doc-section">
        <h2>Live Demo</h2>
        <p>Try the Theme Builder below. Changes are saved automatically.</p>

        <div class="theme-builder-container">
          <ax-theme-builder />
        </div>
      </section>

      <!-- Usage -->
      <section id="usage" class="doc-section">
        <h2>Usage</h2>

        <mat-tab-group>
          <mat-tab label="Basic">
            <ax-code-tabs [tabs]="basicUsageTabs" />
          </mat-tab>

          <mat-tab label="With Service">
            <ax-code-tabs [tabs]="serviceUsageTabs" />
          </mat-tab>

          <mat-tab label="Programmatic">
            <ax-code-tabs [tabs]="programmaticUsageTabs" />
          </mat-tab>
        </mat-tab-group>
      </section>

      <!-- API Reference -->
      <section id="api-reference" class="doc-section">
        <h2>API Reference</h2>

        <h3>ThemeBuilderService</h3>
        <div class="api-table">
          <table>
            <thead>
              <tr>
                <th>Method</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>currentTheme()</code></td>
                <td>Signal containing current theme configuration</td>
              </tr>
              <tr>
                <td><code>updateColor(name, shade, value)</code></td>
                <td>Update a specific color shade</td>
              </tr>
              <tr>
                <td><code>updateColorPalette(name, palette)</code></td>
                <td>Update entire color palette</td>
              </tr>
              <tr>
                <td><code>generateColorPalette(baseColor)</code></td>
                <td>Generate palette from base color</td>
              </tr>
              <tr>
                <td><code>applyPreset(presetId)</code></td>
                <td>Apply a theme preset (aegisx, verus, rose, emerald)</td>
              </tr>
              <tr>
                <td><code>exportTheme(format)</code></td>
                <td>Export theme as SCSS, CSS, JSON, or Tailwind</td>
              </tr>
              <tr>
                <td><code>applyToDocument()</code></td>
                <td>Apply current theme to document CSS variables</td>
              </tr>
              <tr>
                <td><code>saveToStorage()</code></td>
                <td>Save current theme to localStorage</td>
              </tr>
              <tr>
                <td><code>resetToDefault()</code></td>
                <td>Reset to default AegisX theme</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>ThemeBuilderConfig Interface</h3>
        <ax-code-tabs [tabs]="configInterfaceTabs" />

        <h3>Available Presets</h3>
        <div class="preset-grid">
          <button
            mat-stroked-button
            class="preset-btn aegisx"
            (click)="applyPreset('aegisx')"
          >
            <span class="preset-color" style="background: #6366f1"></span>
            AegisX (Indigo)
          </button>
          <button
            mat-stroked-button
            class="preset-btn verus"
            (click)="applyPreset('verus')"
          >
            <span class="preset-color" style="background: #14b8a6"></span>
            Verus (Teal)
          </button>
          <button
            mat-stroked-button
            class="preset-btn rose"
            (click)="applyPreset('rose')"
          >
            <span class="preset-color" style="background: #f43f5e"></span>
            Rose (Pink)
          </button>
          <button
            mat-stroked-button
            class="preset-btn emerald"
            (click)="applyPreset('emerald')"
          >
            <span class="preset-color" style="background: #10b981"></span>
            Emerald (Green)
          </button>
        </div>
      </section>

      <!-- Code Export Section (NEW) -->
      <section id="code-export" class="doc-section">
        <h2>Code Export</h2>
        <p>
          The Theme Builder includes a powerful Code Export feature that lets
          you preview, copy, and download your theme in multiple formats with
          support for both light and dark modes.
        </p>

        <div class="feature-highlight">
          <mat-icon>new_releases</mat-icon>
          <div>
            <strong>New Feature!</strong>
            <p>
              Navigate to the "Code Export" section in the sidebar to preview
              your theme code in real-time, toggle between light/dark modes, and
              download as files.
            </p>
          </div>
        </div>

        <h3>Code Export Features</h3>
        <div class="code-export-features">
          <div class="feature-item">
            <mat-icon>visibility</mat-icon>
            <div>
              <strong>Live Preview</strong>
              <p>See generated code update in real-time as you make changes</p>
            </div>
          </div>
          <div class="feature-item">
            <mat-icon>light_mode</mat-icon>
            <div>
              <strong>Light Mode Export</strong>
              <p>
                Export CSS with <code>:root</code> selector for light themes
              </p>
            </div>
          </div>
          <div class="feature-item">
            <mat-icon>dark_mode</mat-icon>
            <div>
              <strong>Dark Mode Export</strong>
              <p>
                Auto-generated dark theme with <code>:root.dark</code> selector
              </p>
            </div>
          </div>
          <div class="feature-item">
            <mat-icon>contrast</mat-icon>
            <div>
              <strong>Both Modes</strong>
              <p>
                Export complete theme with both light and dark mode selectors
              </p>
            </div>
          </div>
          <div class="feature-item">
            <mat-icon>content_copy</mat-icon>
            <div>
              <strong>Copy to Clipboard</strong>
              <p>One-click copy with notification feedback</p>
            </div>
          </div>
          <div class="feature-item">
            <mat-icon>download</mat-icon>
            <div>
              <strong>Download Files</strong>
              <p>Download as .css, .scss, or .json with appropriate naming</p>
            </div>
          </div>
        </div>

        <h3>Dark Mode Generation</h3>
        <p>
          The dark theme is automatically generated from your light theme by
          intelligently inverting colors:
        </p>
        <ax-code-tabs [tabs]="darkModeGenerationTabs" />

        <h3>Export Selectors</h3>
        <p>
          The CSS export uses standard selectors that work with common dark mode
          implementations:
        </p>
        <ax-code-tabs [tabs]="exportSelectorsTabs" />

        <h3>Using Code Export</h3>
        <mat-tab-group>
          <mat-tab label="Via UI">
            <div class="usage-step">
              <ol>
                <li>Click "Code Export" in the Theme Builder sidebar</li>
                <li>Select format: CSS, SCSS, or JSON</li>
                <li>Choose mode: Light, Dark, or Both</li>
                <li>Preview the generated code</li>
                <li>Click "Copy" or "Download"</li>
              </ol>
            </div>
          </mat-tab>
          <mat-tab label="Via Service">
            <ax-code-tabs [tabs]="codeExportServiceTabs" />
          </mat-tab>
        </mat-tab-group>
      </section>

      <!-- Export Formats -->
      <section id="export-formats" class="doc-section">
        <h2>Export Formats</h2>

        <mat-tab-group>
          <mat-tab label="SCSS">
            <ax-code-tabs [tabs]="scssExportTabs" />
          </mat-tab>
          <mat-tab label="CSS">
            <ax-code-tabs [tabs]="cssExportTabs" />
          </mat-tab>
          <mat-tab label="JSON">
            <ax-code-tabs [tabs]="jsonExportTabs" />
          </mat-tab>
          <mat-tab label="Tailwind">
            <ax-code-tabs [tabs]="tailwindExportTabs" />
          </mat-tab>
        </mat-tab-group>
      </section>

      <!-- M3 Color Scheme Section -->
      <section id="m3-color-scheme" class="doc-section">
        <h2>Material Design 3 (M3) Color Scheme</h2>
        <p>
          The Theme Builder includes M3 Color Scheme generation that creates
          complete color palettes from a single seed color following Google's
          Material Design 3 guidelines. The generated colors are automatically
          mapped to AegisX theme variables.
        </p>

        <!-- Understanding the Two Views -->
        <div class="understanding-views">
          <h3>Understanding the Two Views</h3>
          <p class="intro-text">
            The M3 Color preview has <strong>2 tabs</strong> that show different
            aspects of your generated color palette:
          </p>

          <div class="views-comparison">
            <div class="view-card key-colors">
              <div class="view-header">
                <mat-icon>palette</mat-icon>
                <h4>Key Colors (Scheme View)</h4>
                <span class="badge primary">Use This for Export</span>
              </div>
              <div class="view-body">
                <p>
                  <strong>What it shows:</strong> The final colors your app will
                  use
                </p>
                <ul>
                  <li>Primary, Secondary, Tertiary - Your brand colors</li>
                  <li>Error - For error states</li>
                  <li>Surface, Background - Your UI backgrounds</li>
                  <li>Light/Dark mode toggle to preview both schemes</li>
                </ul>
                <p class="highlight">
                  <mat-icon>lightbulb</mat-icon>
                  <strong>This is what you export!</strong> Click "Preview Code"
                  or "Copy CSS" to get these colors as AegisX variables.
                </p>
              </div>
            </div>

            <div class="view-card tonal-palettes">
              <div class="view-header">
                <mat-icon>gradient</mat-icon>
                <h4>Tonal Palettes (Reference View)</h4>
                <span class="badge secondary">For Design Reference</span>
              </div>
              <div class="view-body">
                <p>
                  <strong>What it shows:</strong> The full color spectrum for
                  each palette
                </p>
                <ul>
                  <li>18 tones (0-100) for Primary, Secondary, Tertiary</li>
                  <li>Neutral and Neutral Variant for grays</li>
                  <li>Error palette for semantic colors</li>
                </ul>
                <p class="highlight">
                  <mat-icon>info</mat-icon>
                  Use this for <strong>design exploration</strong> - seeing all
                  available shades. The Key Colors view picks the optimal tones
                  for you.
                </p>
              </div>
            </div>
          </div>

          <div class="quick-summary">
            <mat-icon>summarize</mat-icon>
            <div>
              <strong>TL;DR:</strong> Use <em>Key Colors</em> for export → Copy
              the generated CSS/SCSS → Paste into your theme file.
              <em>Tonal Palettes</em> is just for exploring all available
              shades.
            </div>
          </div>
        </div>

        <h3>How It Works</h3>
        <div class="m3-workflow">
          <div class="workflow-step">
            <div class="step-number">1</div>
            <div class="step-content">
              <strong>Pick a Seed Color</strong>
              <p>
                Choose your brand's primary color. This single color will
                generate an entire palette.
              </p>
            </div>
          </div>
          <div class="workflow-step">
            <div class="step-number">2</div>
            <div class="step-content">
              <strong>M3 Algorithm Generates Palettes</strong>
              <p>
                The algorithm creates Primary, Secondary, Tertiary, Error,
                Neutral, and Neutral Variant tonal palettes.
              </p>
            </div>
          </div>
          <div class="workflow-step">
            <div class="step-number">3</div>
            <div class="step-content">
              <strong>Auto-Maps to AegisX Variables</strong>
              <p>
                M3 colors are automatically converted to AegisX theme variables
                (--ax-*) ready for use.
              </p>
            </div>
          </div>
          <div class="workflow-step">
            <div class="step-number">4</div>
            <div class="step-content">
              <strong>Export & Apply</strong>
              <p>
                Copy the generated CSS/SCSS and add to your theme file. Instant
                theme!
              </p>
            </div>
          </div>
        </div>

        <h3>M3 to AegisX Variable Mapping</h3>
        <p>
          The following table shows how Material Design 3 color roles map to
          AegisX theme variables:
        </p>

        <div class="mapping-table">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>M3 Color Role</th>
                <th>AegisX Variable</th>
                <th>Usage</th>
              </tr>
            </thead>
            <tbody>
              <tr class="category-header">
                <td colspan="4"><strong>Primary / Brand</strong></td>
              </tr>
              <tr>
                <td></td>
                <td><code>primary</code></td>
                <td>
                  <code>--ax-primary</code>, <code>--ax-brand-default</code>
                </td>
                <td>Main brand color, buttons, links</td>
              </tr>
              <tr>
                <td></td>
                <td><code>onPrimary</code></td>
                <td><code>--ax-primary-contrast</code></td>
                <td>Text on primary colored backgrounds</td>
              </tr>
              <tr>
                <td></td>
                <td><code>primaryContainer</code></td>
                <td>
                  <code>--ax-brand-faint</code>, <code>--ax-brand-surface</code>
                </td>
                <td>Light background tints</td>
              </tr>
              <tr>
                <td></td>
                <td><code>onPrimaryContainer</code></td>
                <td><code>--ax-brand-emphasis</code></td>
                <td>Dark text for emphasis</td>
              </tr>

              <tr class="category-header">
                <td colspan="4"><strong>Backgrounds</strong></td>
              </tr>
              <tr>
                <td></td>
                <td><code>surface</code></td>
                <td>
                  <code>--ax-background-default</code>, <code>--ax-white</code>
                </td>
                <td>Main background color</td>
              </tr>
              <tr>
                <td></td>
                <td><code>surfaceContainerLow</code></td>
                <td><code>--ax-background-subtle</code></td>
                <td>Slightly elevated backgrounds</td>
              </tr>
              <tr>
                <td></td>
                <td><code>surfaceDim</code></td>
                <td><code>--ax-background-page</code></td>
                <td>Page/app background</td>
              </tr>
              <tr>
                <td></td>
                <td><code>inverseSurface</code></td>
                <td><code>--ax-background-emphasis</code></td>
                <td>Dark backgrounds for contrast</td>
              </tr>

              <tr class="category-header">
                <td colspan="4"><strong>Text</strong></td>
              </tr>
              <tr>
                <td></td>
                <td><code>onSurface</code></td>
                <td>
                  <code>--ax-text-default</code>, <code>--ax-text-primary</code>
                </td>
                <td>Main text color</td>
              </tr>
              <tr>
                <td></td>
                <td><code>onSurfaceVariant</code></td>
                <td><code>--ax-text-secondary</code></td>
                <td>Secondary/muted text</td>
              </tr>
              <tr>
                <td></td>
                <td><code>outline</code></td>
                <td><code>--ax-text-subtle</code></td>
                <td>Subtle text, placeholders</td>
              </tr>
              <tr>
                <td></td>
                <td><code>inverseOnSurface</code></td>
                <td><code>--ax-text-inverse</code></td>
                <td>Light text on dark backgrounds</td>
              </tr>

              <tr class="category-header">
                <td colspan="4"><strong>Borders</strong></td>
              </tr>
              <tr>
                <td></td>
                <td><code>outline</code></td>
                <td>
                  <code>--ax-border-default</code>,
                  <code>--ax-border-color</code>
                </td>
                <td>Default border color</td>
              </tr>
              <tr>
                <td></td>
                <td><code>outlineVariant</code></td>
                <td><code>--ax-border-subtle</code></td>
                <td>Subtle dividers</td>
              </tr>

              <tr class="category-header">
                <td colspan="4"><strong>Semantic Colors</strong></td>
              </tr>
              <tr>
                <td></td>
                <td><code>error</code></td>
                <td><code>--ax-error-default</code></td>
                <td>Error states, destructive actions</td>
              </tr>
              <tr>
                <td></td>
                <td><code>secondary</code></td>
                <td><code>--ax-success-default</code></td>
                <td>Success states (derived from secondary)</td>
              </tr>
              <tr>
                <td></td>
                <td><code>tertiary</code></td>
                <td><code>--ax-warning-default</code></td>
                <td>Warning states (derived from tertiary)</td>
              </tr>

              <tr class="category-header">
                <td colspan="4"><strong>Navigation</strong></td>
              </tr>
              <tr>
                <td></td>
                <td><code>surface</code></td>
                <td><code>--ax-nav-bg</code></td>
                <td>Navigation background</td>
              </tr>
              <tr>
                <td></td>
                <td><code>primary</code></td>
                <td><code>--ax-nav-text-active</code></td>
                <td>Active nav item text</td>
              </tr>
              <tr>
                <td></td>
                <td><code>primaryContainer</code></td>
                <td><code>--ax-nav-active</code></td>
                <td>Active nav item background</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Usage Guide</h3>

        <mat-tab-group>
          <mat-tab label="Step 1: Generate">
            <div class="usage-step">
              <p>
                In the Theme Builder, go to the
                <strong>Color Palette</strong> tab and use the color picker to
                select your seed color. The M3 algorithm will automatically
                generate tonal palettes.
              </p>
              <ax-code-tabs [tabs]="m3GenerateStepTabs" />
            </div>
          </mat-tab>

          <mat-tab label="Step 2: Preview">
            <div class="usage-step">
              <p>
                Switch between Light and Dark mode to preview how your colors
                look in both schemes. The Key Colors view shows the main color
                roles, while Tonal Palettes shows all 18 tones.
              </p>
              <ax-code-tabs [tabs]="m3PreviewStepTabs" />
            </div>
          </mat-tab>

          <mat-tab label="Step 3: Copy Code">
            <div class="usage-step">
              <p>
                Click the code preview button to see the generated AegisX theme
                variables. You can copy either CSS or SCSS format.
              </p>
              <ax-code-tabs [tabs]="m3CopyStepTabs" />
            </div>
          </mat-tab>

          <mat-tab label="Step 4: Apply Theme">
            <div class="usage-step">
              <p>
                Add the generated variables to your theme file. For a new theme,
                create a file in
                <code>libs/aegisx-ui/src/lib/styles/themes/</code>
              </p>
              <ax-code-tabs [tabs]="m3ApplyStepTabs" />
            </div>
          </mat-tab>
        </mat-tab-group>

        <h3>Example Output</h3>
        <p>
          Here's what the generated CSS looks like when you choose a seed color:
        </p>
        <ax-code-tabs [tabs]="m3ExampleOutputTabs" />

        <h3>Best Practices</h3>
        <div class="best-practices">
          <div class="practice-card">
            <mat-icon>check_circle</mat-icon>
            <div>
              <strong>Test both Light and Dark modes</strong>
              <p>
                M3 generates optimized colors for each mode. Always preview
                both.
              </p>
            </div>
          </div>
          <div class="practice-card">
            <mat-icon>check_circle</mat-icon>
            <div>
              <strong>Use semantic colors</strong>
              <p>
                Don't hardcode hex values. Use the generated --ax-* variables
                for consistency.
              </p>
            </div>
          </div>
          <div class="practice-card">
            <mat-icon>check_circle</mat-icon>
            <div>
              <strong>Check contrast ratios</strong>
              <p>
                M3 ensures WCAG AA compliance, but always verify text
                readability.
              </p>
            </div>
          </div>
          <div class="practice-card">
            <mat-icon>check_circle</mat-icon>
            <div>
              <strong>Create both theme files</strong>
              <p>
                Generate separate _light.scss and _dark.scss files for theme
                switching.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .doc-page {
        max-width: 1400px;
        margin: 0 auto;
        padding: 2rem;
      }

      .doc-header {
        margin-bottom: 2rem;

        h1 {
          margin: 0 0 0.5rem;
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--ax-text-heading, #0a0a0a);
        }

        .doc-description {
          margin: 0 0 1rem;
          font-size: 1.125rem;
          color: var(--ax-text-secondary, #71717a);
          max-width: 600px;
        }
      }

      .doc-badges {
        display: flex;
        gap: 0.5rem;

        .badge {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
          background: var(--ax-background-subtle, #f4f4f5);
          color: var(--ax-text-secondary, #71717a);

          &.new {
            background: var(--ax-success-100, #dcfce7);
            color: var(--ax-success-700, #15803d);
          }
        }
      }

      /* Table of Contents */
      .doc-toc {
        padding: 1rem 1.25rem;
        margin-bottom: 2rem;
        background: var(--ax-background-subtle, #f4f4f5);
        border-radius: var(--ax-radius-lg, 0.5rem);
        border: 1px solid var(--ax-border-default, #e4e4e7);

        h4 {
          margin: 0 0 0.75rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--ax-text-heading, #0a0a0a);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        ul {
          margin: 0;
          padding: 0;
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem 1.5rem;
        }

        li {
          a {
            display: inline-flex;
            align-items: center;
            gap: 0.375rem;
            font-size: 0.875rem;
            color: var(--ax-text-secondary, #71717a);
            text-decoration: none;
            transition: color 0.15s;

            &:hover {
              color: var(--ax-brand-500, #6366f1);
            }

            &.new {
              color: var(--ax-brand-600, #4f46e5);
              font-weight: 500;

              &::after {
                content: 'New';
                font-size: 0.625rem;
                padding: 0.125rem 0.375rem;
                background: var(--ax-brand-100, #e0e7ff);
                color: var(--ax-brand-700, #4338ca);
                border-radius: 9999px;
                font-weight: 600;
                text-transform: uppercase;
              }
            }
          }
        }
      }

      .feature-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 3rem;
      }

      .feature-card {
        padding: 1.5rem;
        background: var(--ax-background-subtle, #f4f4f5);
        border-radius: var(--ax-radius-lg, 0.5rem);
        border: 1px solid var(--ax-border-default, #e4e4e7);

        mat-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;
          color: var(--ax-brand-500, #6366f1);
          margin-bottom: 0.75rem;
        }

        h3 {
          margin: 0 0 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          color: var(--ax-text-heading, #0a0a0a);
        }

        p {
          margin: 0;
          font-size: 0.875rem;
          color: var(--ax-text-secondary, #71717a);
        }
      }

      .doc-section {
        margin-bottom: 3rem;

        h2 {
          margin: 0 0 1rem;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--ax-text-heading, #0a0a0a);
          border-bottom: 1px solid var(--ax-border-default, #e4e4e7);
          padding-bottom: 0.5rem;
        }

        h3 {
          margin: 1.5rem 0 0.75rem;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--ax-text-heading, #0a0a0a);
        }
      }

      .theme-builder-container {
        border: 1px solid var(--ax-border-default, #e4e4e7);
        border-radius: var(--ax-radius-lg, 0.5rem);
        overflow: hidden;
        height: 700px;
      }

      .api-table {
        overflow-x: auto;

        table {
          width: 100%;
          border-collapse: collapse;

          th,
          td {
            padding: 0.75rem 1rem;
            text-align: left;
            border-bottom: 1px solid var(--ax-border-default, #e4e4e7);
          }

          th {
            font-weight: 600;
            background: var(--ax-background-subtle, #f4f4f5);
            color: var(--ax-text-heading, #0a0a0a);
          }

          td {
            color: var(--ax-text-primary, #3f3f46);

            code {
              background: var(--ax-background-subtle, #f4f4f5);
              padding: 0.125rem 0.375rem;
              border-radius: var(--ax-radius-sm, 0.25rem);
              font-family: monospace;
              font-size: 0.875rem;
            }
          }
        }
      }

      .preset-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-top: 1rem;
      }

      .preset-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        .preset-color {
          width: 16px;
          height: 16px;
          border-radius: 50%;
        }
      }

      /* M3 Color Scheme Styles */

      /* Understanding Views Section */
      .understanding-views {
        margin: 2rem 0;
        padding: 1.5rem;
        background: var(--ax-background-subtle, #f9fafb);
        border-radius: var(--ax-radius-xl, 1rem);
        border: 1px solid var(--ax-border-default, #e5e7eb);

        h3 {
          margin: 0 0 0.5rem;
        }

        .intro-text {
          margin: 0 0 1.5rem;
          font-size: 1rem;
          color: var(--ax-text-secondary, #6b7280);
        }
      }

      .views-comparison {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .view-card {
        background: white;
        border-radius: var(--ax-radius-lg, 0.75rem);
        border: 2px solid var(--ax-border-default, #e5e7eb);
        overflow: hidden;
        transition:
          border-color 0.2s,
          box-shadow 0.2s;

        &.key-colors {
          border-color: var(--ax-brand-500, #6366f1);
          .view-header {
            background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
          }
        }

        &.tonal-palettes {
          .view-header {
            background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%);
          }
        }

        .view-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          color: white;

          mat-icon {
            font-size: 24px;
            width: 24px;
            height: 24px;
          }

          h4 {
            margin: 0;
            flex: 1;
            font-size: 1rem;
            font-weight: 600;
          }

          .badge {
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.7rem;
            font-weight: 600;
            text-transform: uppercase;

            &.primary {
              background: rgba(255, 255, 255, 0.25);
            }

            &.secondary {
              background: rgba(255, 255, 255, 0.2);
            }
          }
        }

        .view-body {
          padding: 1rem;

          p {
            margin: 0 0 0.75rem;
            font-size: 0.875rem;
            color: var(--ax-text-secondary, #6b7280);
          }

          ul {
            margin: 0 0 1rem;
            padding-left: 1.25rem;

            li {
              font-size: 0.875rem;
              color: var(--ax-text-secondary, #6b7280);
              margin-bottom: 0.25rem;
            }
          }

          .highlight {
            display: flex;
            align-items: flex-start;
            gap: 0.5rem;
            padding: 0.75rem;
            background: var(--ax-brand-50, #eef2ff);
            border-radius: var(--ax-radius-md, 0.5rem);
            margin: 0;

            mat-icon {
              font-size: 18px;
              width: 18px;
              height: 18px;
              color: var(--ax-brand-500, #6366f1);
              flex-shrink: 0;
              margin-top: 2px;
            }

            strong {
              color: var(--ax-text-heading, #111827);
            }
          }
        }
      }

      .quick-summary {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        background: var(--ax-brand-50, #eef2ff);
        border: 1px solid var(--ax-brand-200, #c7d2fe);
        border-radius: var(--ax-radius-lg, 0.75rem);

        mat-icon {
          font-size: 24px;
          width: 24px;
          height: 24px;
          color: var(--ax-brand-500, #6366f1);
          flex-shrink: 0;
        }

        div {
          font-size: 0.9375rem;
          color: var(--ax-text-primary, #374151);

          strong {
            color: var(--ax-text-heading, #111827);
          }

          em {
            font-style: normal;
            font-weight: 600;
            color: var(--ax-brand-600, #4f46e5);
          }
        }
      }

      .m3-workflow {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin: 1.5rem 0;
      }

      .workflow-step {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        background: var(--ax-background-subtle, #f4f4f5);
        border-radius: var(--ax-radius-lg, 0.5rem);
        border: 1px solid var(--ax-border-default, #e4e4e7);

        .step-number {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--ax-brand-500, #6366f1);
          color: white;
          border-radius: 50%;
          font-weight: 700;
          flex-shrink: 0;
        }

        .step-content {
          strong {
            display: block;
            color: var(--ax-text-heading, #0a0a0a);
            margin-bottom: 0.25rem;
          }

          p {
            margin: 0;
            font-size: 0.875rem;
            color: var(--ax-text-secondary, #71717a);
          }
        }
      }

      .mapping-table {
        overflow-x: auto;
        margin: 1rem 0;

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;

          th,
          td {
            padding: 0.625rem 0.75rem;
            text-align: left;
            border-bottom: 1px solid var(--ax-border-default, #e4e4e7);
          }

          th {
            font-weight: 600;
            background: var(--ax-background-subtle, #f4f4f5);
            color: var(--ax-text-heading, #0a0a0a);
          }

          td {
            color: var(--ax-text-primary, #3f3f46);

            code {
              background: var(--ax-background-subtle, #f4f4f5);
              padding: 0.125rem 0.375rem;
              border-radius: var(--ax-radius-sm, 0.25rem);
              font-family: monospace;
              font-size: 0.75rem;
              white-space: nowrap;
            }
          }

          .category-header {
            background: var(--ax-brand-50, #eef2ff);

            td {
              color: var(--ax-brand-700, #4338ca);
            }
          }
        }
      }

      .usage-step {
        padding: 1rem 0;

        p {
          margin: 0 0 1rem;
          color: var(--ax-text-secondary, #71717a);

          code {
            background: var(--ax-background-subtle, #f4f4f5);
            padding: 0.125rem 0.375rem;
            border-radius: var(--ax-radius-sm, 0.25rem);
            font-family: monospace;
          }
        }
      }

      .best-practices {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
      }

      .practice-card {
        display: flex;
        gap: 0.75rem;
        padding: 1rem;
        background: var(--ax-success-50, #f0fdf4);
        border-radius: var(--ax-radius-lg, 0.5rem);
        border: 1px solid var(--ax-success-200, #bbf7d0);

        mat-icon {
          color: var(--ax-success-600, #16a34a);
          flex-shrink: 0;
        }

        strong {
          display: block;
          color: var(--ax-text-heading, #0a0a0a);
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        p {
          margin: 0;
          font-size: 0.75rem;
          color: var(--ax-text-secondary, #71717a);
        }
      }

      .open-tool-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 1.25rem;
        padding: 0.75rem 1.5rem;
        background: var(--ax-primary, #6366f1);
        color: white;
        border-radius: 9999px;
        font-size: 0.9375rem;
        font-weight: 500;
        text-decoration: none;
        transition: all 0.2s ease;
        box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);

        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }

        &:hover {
          background: var(--ax-primary-dark, #4f46e5);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
          transform: translateY(-1px);
        }

        &:active {
          transform: translateY(0);
        }
      }

      /* Code Export Section Styles */
      .feature-highlight {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        padding: 1.25rem;
        margin: 1.5rem 0;
        background: linear-gradient(
          135deg,
          var(--ax-brand-50, #eef2ff) 0%,
          var(--ax-brand-100, #e0e7ff) 100%
        );
        border: 1px solid var(--ax-brand-200, #c7d2fe);
        border-radius: var(--ax-radius-lg, 0.75rem);

        mat-icon {
          font-size: 28px;
          width: 28px;
          height: 28px;
          color: var(--ax-brand-500, #6366f1);
          flex-shrink: 0;
        }

        div {
          flex: 1;

          strong {
            display: block;
            font-size: 1rem;
            color: var(--ax-brand-700, #4338ca);
            margin-bottom: 0.5rem;
          }

          p {
            margin: 0;
            font-size: 0.9375rem;
            color: var(--ax-text-secondary, #71717a);
            line-height: 1.5;
          }
        }
      }

      .code-export-features {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1rem;
        margin: 1.5rem 0;
      }

      .feature-item {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 1rem;
        background: var(--ax-background-subtle, #f4f4f5);
        border-radius: var(--ax-radius-lg, 0.5rem);
        border: 1px solid var(--ax-border-default, #e4e4e7);
        transition:
          border-color 0.2s,
          box-shadow 0.2s;

        &:hover {
          border-color: var(--ax-brand-300, #a5b4fc);
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.1);
        }

        mat-icon {
          font-size: 24px;
          width: 24px;
          height: 24px;
          color: var(--ax-brand-500, #6366f1);
          flex-shrink: 0;
          margin-top: 2px;
        }

        div {
          flex: 1;

          strong {
            display: block;
            font-size: 0.9375rem;
            color: var(--ax-text-heading, #0a0a0a);
            margin-bottom: 0.25rem;
          }

          p {
            margin: 0;
            font-size: 0.8125rem;
            color: var(--ax-text-secondary, #71717a);
            line-height: 1.4;

            code {
              background: var(--ax-background-default, #ffffff);
              padding: 0.125rem 0.375rem;
              border-radius: var(--ax-radius-sm, 0.25rem);
              font-family: monospace;
              font-size: 0.75rem;
              color: var(--ax-brand-600, #4f46e5);
            }
          }
        }
      }

      .usage-step {
        padding: 1rem 0;

        p {
          margin: 0 0 1rem;
          color: var(--ax-text-secondary, #71717a);

          code {
            background: var(--ax-background-subtle, #f4f4f5);
            padding: 0.125rem 0.375rem;
            border-radius: var(--ax-radius-sm, 0.25rem);
            font-family: monospace;
          }
        }

        ol {
          margin: 0;
          padding-left: 1.5rem;

          li {
            margin-bottom: 0.5rem;
            font-size: 0.9375rem;
            color: var(--ax-text-primary, #3f3f46);
            line-height: 1.6;

            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
    `,
  ],
})
export class ThemeBuilderDocComponent {
  constructor(private themeService: ThemeBuilderService) {}

  applyPreset(presetId: string): void {
    this.themeService.applyPreset(presetId);
    this.themeService.applyToDocument();
  }

  basicUsageTabs: CodeTab[] = [
    {
      label: 'Template',
      language: 'html',
      code: `<!-- Simply add the component to your template -->
<ax-theme-builder />`,
    },
    {
      label: 'Module',
      language: 'typescript',
      code: `import { Component } from '@angular/core';
import { AxThemeBuilderComponent } from '@aegisx/ui';

@Component({
  selector: 'app-theme-page',
  standalone: true,
  imports: [AxThemeBuilderComponent],
  template: \`<ax-theme-builder />\`
})
export class ThemePageComponent {}`,
    },
  ];

  serviceUsageTabs: CodeTab[] = [
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `import { Component, inject } from '@angular/core';
import { ThemeBuilderService } from '@aegisx/ui';

@Component({
  selector: 'app-custom-theme',
  template: \`
    <button (click)="exportAsCSS()">Export CSS</button>
    <button (click)="applyTheme()">Apply Theme</button>
  \`
})
export class CustomThemeComponent {
  private themeService = inject(ThemeBuilderService);

  exportAsCSS(): void {
    const css = this.themeService.exportTheme('css');
    console.log(css);
    // Copy to clipboard
    navigator.clipboard.writeText(css);
  }

  applyTheme(): void {
    this.themeService.applyToDocument();
  }
}`,
    },
  ];

  programmaticUsageTabs: CodeTab[] = [
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `import { ThemeBuilderService } from '@aegisx/ui';

// Inject the service
constructor(private themeService: ThemeBuilderService) {}

// Update a single color
this.themeService.updateColor('brand', 500, '#8b5cf6');

// Generate and apply a full palette from base color
const palette = this.themeService.generateColorPalette('#8b5cf6');
this.themeService.updateColorPalette('brand', palette);

// Apply a preset
this.themeService.applyPreset('verus');

// Export theme
const scss = this.themeService.exportTheme('scss');
const css = this.themeService.exportTheme('css');
const json = this.themeService.exportTheme('json');
const tailwind = this.themeService.exportTheme('tailwind');

// Apply to document
this.themeService.applyToDocument();

// Save to localStorage
this.themeService.saveToStorage();

// Reset to default
this.themeService.resetToDefault();`,
    },
  ];

  configInterfaceTabs: CodeTab[] = [
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `interface ThemeBuilderConfig {
  name: string;
  mode: 'light' | 'dark';
  colors: {
    brand: ColorPalette;
    success: ColorPalette;
    warning: ColorPalette;
    error: ColorPalette;
    info: ColorPalette;
    // ... more semantic colors
  };
  background: {
    muted: string;
    subtle: string;
    default: string;
    emphasis: string;
  };
  text: {
    disabled: string;
    subtle: string;
    secondary: string;
    primary: string;
    heading: string;
    inverted: string;
  };
  border: {
    muted: string;
    default: string;
    emphasis: string;
  };
  typography: TypographyConfig;
  spacing: SpacingConfig;
  radius: RadiusConfig;
  shadows: ShadowConfig;
}

interface ColorPalette {
  50: string;   // Lightest
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;  // Main color
  600: string;
  700: string;
  800: string;
  900: string;  // Darkest
}`,
    },
  ];

  scssExportTabs: CodeTab[] = [
    {
      label: 'SCSS Output',
      language: 'scss',
      code: `// AegisX Theme: Custom Theme
// Generated by Theme Builder

// Color Palettes
$ax-brand-50: #eef2ff;
$ax-brand-100: #e0e7ff;
$ax-brand-200: #c7d2fe;
$ax-brand-300: #a5b4fc;
$ax-brand-400: #818cf8;
$ax-brand-500: #6366f1;
$ax-brand-600: #4f46e5;
$ax-brand-700: #4338ca;
$ax-brand-800: #3730a3;
$ax-brand-900: #312e81;

// Background
$ax-background-muted: #fafafa;
$ax-background-subtle: #f4f4f5;
$ax-background-default: #ffffff;
$ax-background-emphasis: #3f3f46;

// ... more variables`,
    },
  ];

  cssExportTabs: CodeTab[] = [
    {
      label: 'CSS Output',
      language: 'scss',
      code: `/* AegisX Theme: Custom Theme */
/* Generated by Theme Builder */

:root {
  --ax-brand-50: #eef2ff;
  --ax-brand-100: #e0e7ff;
  --ax-brand-200: #c7d2fe;
  --ax-brand-500: #6366f1;
  --ax-brand-700: #4338ca;
  --ax-brand-900: #312e81;

  --ax-background-muted: #fafafa;
  --ax-background-subtle: #f4f4f5;
  --ax-background-default: #ffffff;

  --ax-text-heading: #0a0a0a;
  --ax-text-primary: #3f3f46;
  --ax-text-secondary: #71717a;

  --ax-radius-sm: 0.25rem;
  --ax-radius-md: 0.375rem;
  --ax-radius-lg: 0.5rem;
}`,
    },
  ];

  jsonExportTabs: CodeTab[] = [
    {
      label: 'JSON Output',
      language: 'json',
      code: `{
  "name": "Custom Theme",
  "mode": "light",
  "colors": {
    "brand": {
      "50": "#eef2ff",
      "100": "#e0e7ff",
      "500": "#6366f1",
      "700": "#4338ca",
      "900": "#312e81"
    },
    "success": { ... },
    "warning": { ... },
    "error": { ... }
  },
  "background": {
    "muted": "#fafafa",
    "subtle": "#f4f4f5",
    "default": "#ffffff"
  },
  "typography": {
    "fontFamily": "Inter, sans-serif",
    "fontSize": { ... }
  }
}`,
    },
  ];

  tailwindExportTabs: CodeTab[] = [
    {
      label: 'Tailwind Config',
      language: 'typescript',
      code: `// Tailwind Config Extension
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81"
        },
        success: { ... },
        warning: { ... },
        error: { ... }
      }
    }
  }
}`,
    },
  ];

  // =====================================================
  // M3 Color Scheme Documentation Code Tabs
  // =====================================================

  m3GenerateStepTabs: CodeTab[] = [
    {
      label: 'How M3 Works',
      language: 'typescript',
      code: `// Material Design 3 generates colors from a single "seed" color
// The algorithm creates 6 tonal palettes:

// 1. PRIMARY - Your brand color (the seed)
// 2. SECONDARY - Complementary accent (~30° hue shift)
// 3. TERTIARY - Vibrant accent (~60° hue shift)
// 4. ERROR - Semantic error color (red-based)
// 5. NEUTRAL - Gray tones for surfaces/text
// 6. NEUTRAL VARIANT - Slightly tinted grays

// Each palette has 18 tones (0-100):
// 0 = black, 100 = white
// Key tones: 10, 20, 30, 40, 50, 60, 70, 80, 90, 95

// Light theme uses darker tones (40) for primary
// Dark theme uses lighter tones (80) for primary`,
    },
  ];

  m3PreviewStepTabs: CodeTab[] = [
    {
      label: 'Key Colors View',
      language: 'typescript',
      code: `// Key Colors view shows the main M3 color roles:

// PRIMARY COLUMN
// - Primary (main brand color)
// - On Primary (text color on primary)
// - Primary Container (light background)
// - On Primary Container (text on container)

// SECONDARY COLUMN
// - Secondary (accent color)
// - Secondary Container

// TERTIARY COLUMN
// - Tertiary (vibrant accent)
// - Tertiary Container

// SURFACE COLUMN
// - Surface (main background)
// - Surface Variant
// - Outline (borders)
// - Outline Variant`,
    },
    {
      label: 'Tonal Palettes View',
      language: 'typescript',
      code: `// Tonal Palettes view shows all 18 tones for each palette
// Useful for fine-grained control and accessibility checking

// Each row shows tones from 100 (white) to 0 (black):
// 100, 99, 98, 95, 90, 80, 70, 60, 50, 40, 35, 30, 25, 20, 15, 10, 5, 0

// PALETTES:
// - Primary (your seed color)
// - Secondary (complementary)
// - Tertiary (vibrant accent)
// - Neutral (grays)
// - Neutral Variant (tinted grays)
// - Error (red tones)

// Click any tone to copy its hex value`,
    },
  ];

  m3CopyStepTabs: CodeTab[] = [
    {
      label: 'Export Options',
      language: 'typescript',
      code: `// The code preview shows AegisX-compatible CSS variables
// Two format options:

// CSS Format (recommended for direct use):
// [data-theme="custom"] {
//   --ax-primary: #6750A4;
//   --ax-brand-default: #6750A4;
//   --ax-background-default: #FFFBFE;
//   ...
// }

// SCSS Format (for SCSS projects):
// $ax-primary: #6750A4;
// $ax-brand-default: #6750A4;
// $ax-background-default: #FFFBFE;
// ...

// Click the copy button to copy all variables`,
    },
  ];

  m3ApplyStepTabs: CodeTab[] = [
    {
      label: 'Create Theme File',
      language: 'scss',
      code: `// 1. Create a new theme file:
// libs/aegisx-ui/src/lib/styles/themes/my-brand/_light.scss

// 2. Paste the generated CSS variables:
[data-theme='my-brand'],
.theme-my-brand {
  // PRIMARY / BRAND (from M3 export)
  --ax-primary: #6750A4;
  --ax-primary-light: #EADDFF;
  --ax-primary-dark: #21005D;
  --ax-primary-contrast: #FFFFFF;

  --ax-brand-default: #6750A4;
  --ax-brand-emphasis: #21005D;
  --ax-brand-faint: #EADDFF;

  // BACKGROUNDS
  --ax-background-default: #FFFBFE;
  --ax-background-subtle: #F7F2FA;
  --ax-background-page: #DED8E1;

  // TEXT
  --ax-text-default: #1C1B1F;
  --ax-text-secondary: #49454F;

  // ... rest of variables
}`,
    },
    {
      label: 'Register Theme',
      language: 'typescript',
      code: `// 3. Import in your main styles:
// libs/aegisx-ui/src/lib/styles/themes/index.scss

@import './my-brand/light';
@import './my-brand/dark';

// 4. Add to theme service (optional):
// libs/aegisx-ui/src/lib/services/theme/ax-theme.service.ts

readonly availableThemes = [
  { id: 'aegisx', name: 'AegisX' },
  { id: 'verus', name: 'Verus' },
  { id: 'my-brand', name: 'My Brand' }, // Add your theme
];

// 5. Use in component:
<div data-theme="my-brand">
  <!-- Content uses your M3 colors -->
</div>`,
    },
  ];

  m3ExampleOutputTabs: CodeTab[] = [
    {
      label: 'CSS Output (Light)',
      language: 'scss',
      code: `/* AegisX Theme - Light Mode */
/* Generated from M3 Color Scheme */
/* Seed Color: #6750A4 (Purple) */

[data-theme="custom"] {
  /* PRIMARY / BRAND */
  --ax-primary: #6750A4;
  --ax-primary-light: #EADDFF;
  --ax-primary-dark: #21005D;
  --ax-primary-contrast: #FFFFFF;

  --ax-brand-default: #6750A4;
  --ax-brand-emphasis: #21005D;
  --ax-brand-muted: #EADDFF;
  --ax-brand-faint: #EADDFF;
  --ax-brand-surface: #EADDFF;
  --ax-brand-border: #79747E;

  /* BACKGROUNDS */
  --ax-background-default: #FFFBFE;
  --ax-background-subtle: #F7F2FA;
  --ax-background-muted: #FFFFFF;
  --ax-background-emphasis: #313033;
  --ax-background-page: #DED8E1;
  --ax-white: #FFFBFE;

  /* TEXT */
  --ax-text-default: #1C1B1F;
  --ax-text-primary: #1C1B1F;
  --ax-text-secondary: #49454F;
  --ax-text-subtle: #79747E;
  --ax-text-disabled: #CAC4D0;
  --ax-text-heading: #1C1B1F;
  --ax-text-strong: #1C1B1F;
  --ax-text-inverse: #F4EFF4;

  /* BORDERS */
  --ax-border-default: #79747E;
  --ax-border-emphasis: #79747E;
  --ax-border-subtle: #CAC4D0;
  --ax-border-color: #79747E;

  /* ERROR */
  --ax-error-default: #B3261E;
  --ax-error-emphasis: #410E0B;
  --ax-error-faint: #F9DEDC;
  --ax-error-muted: #F9DEDC;
  --ax-error-surface: #F9DEDC;
  --ax-error-border: #B3261E;

  /* SUCCESS (from Secondary) */
  --ax-success-default: #625B71;
  --ax-success-emphasis: #1D192B;
  --ax-success-faint: #E8DEF8;
  --ax-success: #625B71;

  /* WARNING (from Tertiary) */
  --ax-warning-default: #7D5260;
  --ax-warning-emphasis: #31111D;
  --ax-warning-faint: #FFD8E4;

  /* NAVIGATION */
  --ax-nav-bg: #FFFBFE;
  --ax-nav-text: #49454F;
  --ax-nav-text-active: #6750A4;
  --ax-nav-hover: #F7F2FA;
  --ax-nav-active: #EADDFF;
  --ax-nav-border: #CAC4D0;
}`,
    },
    {
      label: 'SCSS Output',
      language: 'scss',
      code: `// AegisX Theme - Light Mode
// Generated from M3 Color Scheme
// Seed Color: #6750A4 (Purple)

// PRIMARY / BRAND
$ax-primary: #6750A4;
$ax-primary-light: #EADDFF;
$ax-primary-dark: #21005D;
$ax-primary-contrast: #FFFFFF;

$ax-brand-default: #6750A4;
$ax-brand-emphasis: #21005D;
$ax-brand-muted: #EADDFF;
$ax-brand-faint: #EADDFF;
$ax-brand-surface: #EADDFF;
$ax-brand-border: #79747E;

// BACKGROUNDS
$ax-background-default: #FFFBFE;
$ax-background-subtle: #F7F2FA;
$ax-background-muted: #FFFFFF;
$ax-background-emphasis: #313033;
$ax-background-page: #DED8E1;
$ax-white: #FFFBFE;

// TEXT
$ax-text-default: #1C1B1F;
$ax-text-primary: #1C1B1F;
$ax-text-secondary: #49454F;
$ax-text-subtle: #79747E;
$ax-text-disabled: #CAC4D0;
$ax-text-heading: #1C1B1F;
$ax-text-strong: #1C1B1F;
$ax-text-inverse: #F4EFF4;

// BORDERS
$ax-border-default: #79747E;
$ax-border-emphasis: #79747E;
$ax-border-subtle: #CAC4D0;
$ax-border-color: #79747E;

// ERROR
$ax-error-default: #B3261E;
$ax-error-emphasis: #410E0B;
$ax-error-faint: #F9DEDC;

// SUCCESS (from Secondary)
$ax-success-default: #625B71;
$ax-success-emphasis: #1D192B;
$ax-success-faint: #E8DEF8;

// WARNING (from Tertiary)
$ax-warning-default: #7D5260;
$ax-warning-emphasis: #31111D;
$ax-warning-faint: #FFD8E4;

// NAVIGATION
$ax-nav-bg: #FFFBFE;
$ax-nav-text: #49454F;
$ax-nav-text-active: #6750A4;
$ax-nav-hover: #F7F2FA;
$ax-nav-active: #EADDFF;
$ax-nav-border: #CAC4D0;`,
    },
  ];

  // =====================================================
  // Code Export Documentation Code Tabs (NEW)
  // =====================================================

  darkModeGenerationTabs: CodeTab[] = [
    {
      label: 'How It Works',
      language: 'typescript',
      code: `// The dark theme is automatically generated by inverting colors
// This ensures proper contrast and readability in dark mode

// Light theme → Dark theme transformation:
// - Light backgrounds → Dark backgrounds
// - Dark text → Light text
// - Colors are adjusted for dark mode visibility
// - Contrast ratios maintained for accessibility

// Example transformation:
// Light mode:
//   --ax-background-default: #ffffff;
//   --ax-text-primary: #3f3f46;
//
// Dark mode (auto-generated):
//   --ax-background-default: #18181b;
//   --ax-text-primary: #e4e4e7;`,
    },
    {
      label: 'Service Method',
      language: 'typescript',
      code: `import { ThemeBuilderService } from '@aegisx/ui';

// The service provides generateDarkTheme() method
// that creates dark mode colors from your light theme

const themeService = inject(ThemeBuilderService);

// Get current light theme
const lightTheme = themeService.currentTheme();

// Generate dark theme automatically
const darkTheme = themeService.generateDarkTheme();

// Export with mode parameter
const lightCss = themeService.exportTheme('css', 'light');
const darkCss = themeService.exportTheme('css', 'dark');
const bothCss = themeService.exportTheme('css', 'both');`,
    },
  ];

  exportSelectorsTabs: CodeTab[] = [
    {
      label: 'CSS',
      language: 'scss',
      code: `/* Light Mode Export - :root selector */
:root {
  --ax-brand-500: #6366f1;
  --ax-background-default: #ffffff;
  --ax-text-primary: #3f3f46;
  /* ... more variables */
}

/* Dark Mode Export - :root.dark selector */
:root.dark {
  --ax-brand-500: #818cf8;
  --ax-background-default: #18181b;
  --ax-text-primary: #e4e4e7;
  /* ... more variables */
}

/* Both Modes Export - combines both */
:root {
  /* light mode variables */
}

:root.dark {
  /* dark mode variables */
}`,
    },
    {
      label: 'Usage',
      language: 'html',
      code: `<!-- Apply light mode (default) -->
<html>
  <body>Content uses light theme</body>
</html>

<!-- Apply dark mode -->
<html class="dark">
  <body>Content uses dark theme</body>
</html>

<!-- Toggle with JavaScript -->
<script>
  // Toggle dark mode
  document.documentElement.classList.toggle('dark');

  // Check current mode
  const isDark = document.documentElement.classList.contains('dark');
</script>`,
    },
  ];

  codeExportServiceTabs: CodeTab[] = [
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `import { inject } from '@angular/core';
import { ThemeBuilderService, ExportFormat } from '@aegisx/ui';

// Inject the service
const themeService = inject(ThemeBuilderService);

// Export with mode parameter
type ExportMode = 'light' | 'dark' | 'both';

// Get CSS for light mode only
const lightCss = themeService.exportTheme('css', 'light');

// Get CSS for dark mode only
const darkCss = themeService.exportTheme('css', 'dark');

// Get CSS for both modes (recommended for full theme)
const fullCss = themeService.exportTheme('css', 'both');

// Export in different formats
const scss = themeService.exportTheme('scss', 'both');
const json = themeService.exportTheme('json', 'light');
const tailwind = themeService.exportTheme('tailwind', 'light');

// Copy to clipboard
navigator.clipboard.writeText(fullCss);

// Download as file
const blob = new Blob([fullCss], { type: 'text/css' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'aegisx-theme.css';
a.click();
URL.revokeObjectURL(url);`,
    },
  ];
}
