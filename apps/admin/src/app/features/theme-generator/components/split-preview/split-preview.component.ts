import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeGeneratorService } from '../../services/theme-generator.service';
import {
  ThemeDefinition,
  DEFAULT_LIGHT_COLORS,
  DEFAULT_DARK_COLORS,
  DEFAULT_DESIGN_TOKENS,
} from '../../models/theme-generator.types';
import { oklchToHex } from '../../utils/oklch.utils';

type ViewMode = 'light' | 'dark' | 'split';

@Component({
  selector: 'app-split-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="split-preview">
      <!-- View Mode Toggle -->
      <div class="preview-header">
        <h3 class="preview-title">Preview</h3>
        <div class="view-toggle">
          <button
            type="button"
            class="toggle-btn"
            [class.active]="viewMode() === 'light'"
            (click)="viewMode.set('light')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            Light
          </button>
          <button
            type="button"
            class="toggle-btn"
            [class.active]="viewMode() === 'dark'"
            (click)="viewMode.set('dark')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
            Dark
          </button>
          <button
            type="button"
            class="toggle-btn"
            [class.active]="viewMode() === 'split'"
            (click)="viewMode.set('split')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="12" y1="3" x2="12" y2="21" />
            </svg>
            Split
          </button>
        </div>
      </div>

      <!-- Preview Content -->
      <div class="preview-content" [class.split-mode]="viewMode() === 'split'">
        @if (viewMode() === 'light' || viewMode() === 'split') {
          <div class="preview-pane light-pane" [style]="getLightStyles()">
            @if (viewMode() === 'split') {
              <div class="pane-label">Light</div>
            }
            <ng-container *ngTemplateOutlet="previewComponents"></ng-container>
          </div>
        }

        @if (viewMode() === 'dark' || viewMode() === 'split') {
          <div class="preview-pane dark-pane" [style]="getDarkStyles()">
            @if (viewMode() === 'split') {
              <div class="pane-label">Dark</div>
            }
            <ng-container *ngTemplateOutlet="previewComponents"></ng-container>
          </div>
        }
      </div>

      <!-- Preview Components Template -->
      <ng-template #previewComponents>
        <div class="components-grid">
          <!-- Buttons -->
          <div class="component-group">
            <span class="group-label">Buttons</span>
            <div class="buttons-row">
              <button class="demo-btn demo-btn-primary">Primary</button>
              <button class="demo-btn demo-btn-secondary">Secondary</button>
              <button class="demo-btn demo-btn-accent">Accent</button>
            </div>
          </div>

          <!-- Badges -->
          <div class="component-group">
            <span class="group-label">Badges</span>
            <div class="badges-row">
              <span class="demo-badge demo-badge-info">Info</span>
              <span class="demo-badge demo-badge-success">Success</span>
              <span class="demo-badge demo-badge-warning">Warning</span>
              <span class="demo-badge demo-badge-error">Error</span>
            </div>
          </div>

          <!-- Card -->
          <div class="component-group component-group-wide">
            <span class="group-label">Card</span>
            <div class="demo-card">
              <div class="card-content">
                <h4 class="card-title">Card Title</h4>
                <p class="card-text">
                  Sample card content with theme colors applied.
                </p>
                <button class="demo-btn demo-btn-primary demo-btn-sm">
                  Action
                </button>
              </div>
            </div>
          </div>

          <!-- Alerts -->
          <div class="component-group component-group-wide">
            <span class="group-label">Alerts</span>
            <div class="demo-alert demo-alert-success">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>Operation completed successfully!</span>
            </div>
            <div class="demo-alert demo-alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <span>Something went wrong!</span>
            </div>
          </div>

          <!-- Form -->
          <div class="component-group">
            <span class="group-label">Form</span>
            <div class="demo-form">
              <input
                type="text"
                class="demo-input"
                placeholder="Input field..."
              />
              <label class="demo-checkbox">
                <input type="checkbox" checked />
                <span>Checkbox option</span>
              </label>
            </div>
          </div>

          <!-- Toggle -->
          <div class="component-group">
            <span class="group-label">Toggle</span>
            <div class="toggle-row">
              <label class="demo-toggle">
                <input type="checkbox" checked />
                <span class="toggle-slider"></span>
              </label>
              <span class="toggle-text">Enabled</span>
            </div>
          </div>
        </div>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .split-preview {
        background: var(--ax-background-default, #fff);
        border-radius: 0.75rem;
        overflow: hidden;
      }

      .preview-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 1rem;
        border-bottom: 1px solid var(--ax-border-default, #e5e5e5);
      }

      .preview-title {
        font-size: 0.875rem;
        font-weight: 600;
        margin: 0;
        color: var(--ax-text-default, #333);
      }

      .view-toggle {
        display: flex;
        gap: 0.25rem;
        background: var(--ax-background-muted, #f5f5f5);
        padding: 0.25rem;
        border-radius: 0.5rem;
      }

      .toggle-btn {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.375rem 0.625rem;
        border: none;
        background: transparent;
        border-radius: 0.375rem;
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--ax-text-muted, #666);
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .toggle-btn:hover {
        color: var(--ax-text-default, #333);
      }

      .toggle-btn.active {
        background: var(--ax-background-default, #fff);
        color: var(--ax-text-default, #333);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .preview-content {
        display: flex;
        min-height: 400px;
      }

      .preview-content.split-mode {
        display: grid;
        grid-template-columns: 1fr 1fr;
      }

      .preview-pane {
        flex: 1;
        padding: 1rem;
        position: relative;
      }

      .light-pane {
        background: var(--pane-bg, #fff);
        color: var(--pane-text, #333);
      }

      .dark-pane {
        background: var(--pane-bg, #1a1a1a);
        color: var(--pane-text, #e5e5e5);
      }

      .split-mode .light-pane {
        border-right: 1px solid var(--ax-border-default, #e5e5e5);
      }

      .pane-label {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        font-size: 0.625rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        opacity: 0.5;
      }

      /* Components Grid */
      .components-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }

      .component-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .component-group-wide {
        grid-column: span 2;
      }

      .group-label {
        font-size: 0.625rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        opacity: 0.6;
      }

      /* Demo Buttons */
      .buttons-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.375rem;
      }

      .demo-btn {
        padding: 0.375rem 0.75rem;
        border-radius: var(--radius-field, 0.375rem);
        font-size: 0.75rem;
        font-weight: 500;
        border: none;
        cursor: pointer;
        transition: opacity 0.15s;
      }

      .demo-btn:hover {
        opacity: 0.9;
      }

      .demo-btn-sm {
        padding: 0.25rem 0.5rem;
        font-size: 0.6875rem;
      }

      .demo-btn-primary {
        background: var(--color-primary);
        color: var(--color-primary-content);
      }

      .demo-btn-secondary {
        background: var(--color-secondary);
        color: var(--color-secondary-content);
      }

      .demo-btn-accent {
        background: var(--color-accent);
        color: var(--color-accent-content);
      }

      /* Demo Badges */
      .badges-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.375rem;
      }

      .demo-badge {
        padding: 0.25rem 0.5rem;
        border-radius: 9999px;
        font-size: 0.625rem;
        font-weight: 500;
      }

      .demo-badge-info {
        background: var(--color-info);
        color: var(--color-info-content);
      }

      .demo-badge-success {
        background: var(--color-success);
        color: var(--color-success-content);
      }

      .demo-badge-warning {
        background: var(--color-warning);
        color: var(--color-warning-content);
      }

      .demo-badge-error {
        background: var(--color-error);
        color: var(--color-error-content);
      }

      /* Demo Card */
      .demo-card {
        background: var(--color-base-200);
        border-radius: var(--radius-box, 0.5rem);
        overflow: hidden;
      }

      .card-content {
        padding: 0.75rem;
      }

      .card-title {
        font-size: 0.875rem;
        font-weight: 600;
        margin: 0 0 0.375rem;
        color: var(--color-base-content);
      }

      .card-text {
        font-size: 0.75rem;
        margin: 0 0 0.75rem;
        opacity: 0.7;
        color: var(--color-base-content);
      }

      /* Demo Alerts */
      .demo-alert {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0.75rem;
        border-radius: var(--radius-box, 0.5rem);
        font-size: 0.75rem;
        margin-bottom: 0.5rem;
      }

      .demo-alert:last-child {
        margin-bottom: 0;
      }

      .demo-alert-success {
        background: color-mix(in oklch, var(--color-success) 15%, transparent);
        color: var(--color-success);
      }

      .demo-alert-error {
        background: color-mix(in oklch, var(--color-error) 15%, transparent);
        color: var(--color-error);
      }

      /* Demo Form */
      .demo-form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .demo-input {
        padding: 0.5rem;
        border: 1px solid var(--color-base-300);
        border-radius: var(--radius-field, 0.375rem);
        font-size: 0.75rem;
        background: var(--color-base-100);
        color: var(--color-base-content);
      }

      .demo-input::placeholder {
        color: var(--color-base-content);
        opacity: 0.5;
      }

      .demo-checkbox {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        font-size: 0.75rem;
        cursor: pointer;
      }

      .demo-checkbox input {
        accent-color: var(--color-primary);
      }

      /* Demo Toggle */
      .toggle-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .toggle-text {
        font-size: 0.75rem;
      }

      .demo-toggle {
        position: relative;
        width: 2.5rem;
        height: 1.25rem;
        cursor: pointer;
      }

      .demo-toggle input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .toggle-slider {
        position: absolute;
        inset: 0;
        background: var(--color-base-300);
        border-radius: 1.25rem;
        transition: background 0.2s;
      }

      .toggle-slider::before {
        content: '';
        position: absolute;
        height: 1rem;
        width: 1rem;
        left: 0.125rem;
        bottom: 0.125rem;
        background: var(--color-base-100);
        border-radius: 50%;
        transition: transform 0.2s;
      }

      .demo-toggle input:checked + .toggle-slider {
        background: var(--color-primary);
      }

      .demo-toggle input:checked + .toggle-slider::before {
        transform: translateX(1.25rem);
      }

      @media (max-width: 768px) {
        .preview-content.split-mode {
          grid-template-columns: 1fr;
        }

        .split-mode .light-pane {
          border-right: none;
          border-bottom: 1px solid var(--ax-border-default, #e5e5e5);
        }

        .components-grid {
          grid-template-columns: 1fr;
        }

        .component-group-wide {
          grid-column: span 1;
        }
      }
    `,
  ],
})
export class SplitPreviewComponent {
  private themeService = inject(ThemeGeneratorService);

  viewMode = signal<ViewMode>('split');

  private colors = computed(() => this.themeService.colors());
  private tokens = computed(() => this.themeService.tokens());

  getLightStyles(): string {
    const c = this.colors();
    const t = this.tokens();

    // Use current colors but force light base if dark theme
    const baseL = c['base-100'].l < 50 ? 98 : c['base-100'].l;

    return `
      --pane-bg: ${oklchToHex({ ...c['base-100'], l: baseL })};
      --pane-text: ${oklchToHex({ ...c['base-content'], l: Math.min(c['base-content'].l, 30) })};
      --color-base-100: ${oklchToHex({ ...c['base-100'], l: baseL })};
      --color-base-200: ${oklchToHex({ ...c['base-200'], l: Math.max(baseL - 3, 90) })};
      --color-base-300: ${oklchToHex({ ...c['base-300'], l: Math.max(baseL - 8, 85) })};
      --color-base-content: ${oklchToHex({ ...c['base-content'], l: Math.min(c['base-content'].l, 25) })};
      --color-primary: ${oklchToHex(c['primary'])};
      --color-primary-content: ${oklchToHex(c['primary-content'])};
      --color-secondary: ${oklchToHex(c['secondary'])};
      --color-secondary-content: ${oklchToHex(c['secondary-content'])};
      --color-accent: ${oklchToHex(c['accent'])};
      --color-accent-content: ${oklchToHex(c['accent-content'])};
      --color-info: ${oklchToHex(c['info'])};
      --color-info-content: ${oklchToHex(c['info-content'])};
      --color-success: ${oklchToHex(c['success'])};
      --color-success-content: ${oklchToHex(c['success-content'])};
      --color-warning: ${oklchToHex(c['warning'])};
      --color-warning-content: ${oklchToHex(c['warning-content'])};
      --color-error: ${oklchToHex(c['error'])};
      --color-error-content: ${oklchToHex(c['error-content'])};
      --radius-field: ${t['radius-field']};
      --radius-box: ${t['radius-box']};
    `;
  }

  getDarkStyles(): string {
    const c = this.colors();
    const t = this.tokens();

    // Force dark base colors
    const baseL = c['base-100'].l > 50 ? 15 : c['base-100'].l;

    return `
      --pane-bg: ${oklchToHex({ ...c['base-100'], l: baseL })};
      --pane-text: ${oklchToHex({ ...c['base-content'], l: Math.max(c['base-content'].l, 90) })};
      --color-base-100: ${oklchToHex({ ...c['base-100'], l: baseL })};
      --color-base-200: ${oklchToHex({ ...c['base-200'], l: Math.max(baseL - 3, 8) })};
      --color-base-300: ${oklchToHex({ ...c['base-300'], l: Math.min(baseL + 10, 30) })};
      --color-base-content: ${oklchToHex({ ...c['base-content'], l: Math.max(c['base-content'].l, 90) })};
      --color-primary: ${oklchToHex({ ...c['primary'], l: Math.min(c['primary'].l + 10, 75) })};
      --color-primary-content: ${oklchToHex({ ...c['primary-content'], l: Math.min(c['primary-content'].l, 15) })};
      --color-secondary: ${oklchToHex({ ...c['secondary'], l: Math.min(c['secondary'].l + 10, 70) })};
      --color-secondary-content: ${oklchToHex({ ...c['secondary-content'], l: Math.min(c['secondary-content'].l, 15) })};
      --color-accent: ${oklchToHex({ ...c['accent'], l: Math.min(c['accent'].l + 5, 75) })};
      --color-accent-content: ${oklchToHex({ ...c['accent-content'], l: Math.min(c['accent-content'].l, 20) })};
      --color-info: ${oklchToHex({ ...c['info'], l: Math.min(c['info'].l + 5, 70) })};
      --color-info-content: ${oklchToHex({ ...c['info-content'], l: Math.min(c['info-content'].l, 15) })};
      --color-success: ${oklchToHex({ ...c['success'], l: Math.min(c['success'].l + 5, 70) })};
      --color-success-content: ${oklchToHex({ ...c['success-content'], l: Math.min(c['success-content'].l, 15) })};
      --color-warning: ${oklchToHex({ ...c['warning'], l: Math.min(c['warning'].l + 5, 75) })};
      --color-warning-content: ${oklchToHex({ ...c['warning-content'], l: Math.min(c['warning-content'].l, 20) })};
      --color-error: ${oklchToHex({ ...c['error'], l: Math.min(c['error'].l + 5, 65) })};
      --color-error-content: ${oklchToHex(c['error-content'])};
      --radius-field: ${t['radius-field']};
      --radius-box: ${t['radius-box']};
    `;
  }
}
