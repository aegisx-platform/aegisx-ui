import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeGeneratorService } from '../../services/theme-generator.service';

@Component({
  selector: 'app-theme-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="theme-preview">
      <h3 class="preview-title">Components Preview</h3>

      <div class="preview-grid">
        <!-- Buttons Section -->
        <div class="preview-section">
          <h4>Buttons</h4>
          <div class="button-group">
            <button class="btn btn-primary">Primary</button>
            <button class="btn btn-secondary">Secondary</button>
            <button class="btn btn-accent">Accent</button>
            <button class="btn btn-neutral">Neutral</button>
          </div>
          <div class="button-group">
            <button class="btn btn-info">Info</button>
            <button class="btn btn-success">Success</button>
            <button class="btn btn-warning">Warning</button>
            <button class="btn btn-error">Error</button>
          </div>
          <div class="button-group">
            <button class="btn btn-outline-primary">Outline</button>
            <button class="btn btn-ghost">Ghost</button>
            <button class="btn" disabled>Disabled</button>
          </div>
        </div>

        <!-- Badges Section -->
        <div class="preview-section">
          <h4>Badges</h4>
          <div class="badge-group">
            <span class="badge badge-primary">Primary</span>
            <span class="badge badge-secondary">Secondary</span>
            <span class="badge badge-accent">Accent</span>
            <span class="badge badge-neutral">Neutral</span>
          </div>
          <div class="badge-group">
            <span class="badge badge-info">Info</span>
            <span class="badge badge-success">Success</span>
            <span class="badge badge-warning">Warning</span>
            <span class="badge badge-error">Error</span>
          </div>
          <div class="badge-group">
            <span class="badge badge-outline">Outline</span>
            <span class="badge badge-lg badge-primary">Large</span>
          </div>
        </div>

        <!-- Card Section -->
        <div class="preview-section preview-section-wide">
          <h4>Card</h4>
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Card Title</h5>
              <p class="card-text">
                This is a sample card with some content to preview how cards
                look with your theme colors.
              </p>
              <div class="card-actions">
                <button class="btn btn-primary btn-sm">Action</button>
                <button class="btn btn-ghost btn-sm">Cancel</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Alerts Section -->
        <div class="preview-section preview-section-wide">
          <h4>Alerts</h4>
          <div class="alerts-stack">
            <div class="alert alert-info">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>Info: This is an informational message.</span>
            </div>
            <div class="alert alert-success">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>Success: Operation completed successfully!</span>
            </div>
            <div class="alert alert-warning">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>Warning: Please review before proceeding.</span>
            </div>
            <div class="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <span>Error: Something went wrong!</span>
            </div>
          </div>
        </div>

        <!-- Form Inputs Section -->
        <div class="preview-section">
          <h4>Form Inputs</h4>
          <div class="form-group">
            <label class="form-label">Text Input</label>
            <input type="text" class="form-input" placeholder="Enter text..." />
          </div>
          <div class="form-group">
            <label class="form-label">Select</label>
            <select class="form-select">
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" class="form-checkbox" checked />
              <span>Checkbox option</span>
            </label>
          </div>
        </div>

        <!-- Progress & Stats Section -->
        <div class="preview-section">
          <h4>Progress</h4>
          <div class="progress-stack">
            <div class="progress-item">
              <span class="progress-label">Primary</span>
              <div class="progress-bar">
                <div
                  class="progress-fill progress-primary"
                  style="width: 75%"
                ></div>
              </div>
            </div>
            <div class="progress-item">
              <span class="progress-label">Secondary</span>
              <div class="progress-bar">
                <div
                  class="progress-fill progress-secondary"
                  style="width: 50%"
                ></div>
              </div>
            </div>
            <div class="progress-item">
              <span class="progress-label">Success</span>
              <div class="progress-bar">
                <div
                  class="progress-fill progress-success"
                  style="width: 90%"
                ></div>
              </div>
            </div>
          </div>

          <h4 style="margin-top: 1rem;">Stats</h4>
          <div class="stats-grid">
            <div class="stat">
              <div class="stat-value">31K</div>
              <div class="stat-label">Users</div>
            </div>
            <div class="stat stat-primary">
              <div class="stat-value">4.5</div>
              <div class="stat-label">Rating</div>
            </div>
            <div class="stat stat-success">
              <div class="stat-value">89%</div>
              <div class="stat-label">Growth</div>
            </div>
          </div>
        </div>

        <!-- Tabs Section -->
        <div class="preview-section preview-section-wide">
          <h4>Tabs & Navigation</h4>
          <div class="tabs">
            <button class="tab tab-active">Tab 1</button>
            <button class="tab">Tab 2</button>
            <button class="tab">Tab 3</button>
          </div>
          <div class="tab-content">
            <p>Tab content area with your theme colors applied.</p>
          </div>
        </div>

        <!-- Avatar & Tooltip Section -->
        <div class="preview-section">
          <h4>Avatars</h4>
          <div class="avatar-group">
            <div class="avatar avatar-primary">JD</div>
            <div class="avatar avatar-secondary">AB</div>
            <div class="avatar avatar-accent">XY</div>
            <div class="avatar avatar-neutral">+5</div>
          </div>
        </div>

        <!-- Toggle Section -->
        <div class="preview-section">
          <h4>Toggle & Switch</h4>
          <div class="toggle-group">
            <label class="toggle-label">
              <input type="checkbox" class="toggle toggle-primary" checked />
              <span>Primary Toggle</span>
            </label>
            <label class="toggle-label">
              <input type="checkbox" class="toggle toggle-success" checked />
              <span>Success Toggle</span>
            </label>
            <label class="toggle-label">
              <input type="checkbox" class="toggle" />
              <span>Default Toggle</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .theme-preview {
        background: var(
          --ax-color-base-100,
          var(--ax-background-default, #fff)
        );
        border-radius: 0.75rem;
        padding: 1.5rem;
        color: var(--ax-color-base-content, var(--ax-text-default, #333));
      }

      .preview-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid
          var(--ax-color-base-300, var(--ax-border-default, #e5e5e5));
      }

      .preview-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
      }

      .preview-section {
        background: var(
          --ax-color-base-200,
          var(--ax-background-muted, #f5f5f5)
        );
        border-radius: 0.5rem;
        padding: 1rem;
      }

      .preview-section-wide {
        grid-column: span 2;
      }

      .preview-section h4 {
        font-size: 0.875rem;
        font-weight: 600;
        margin-bottom: 0.75rem;
        color: var(--ax-color-base-content, var(--ax-text-default, #333));
      }

      /* Buttons */
      .button-group {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
      }

      .btn {
        padding: 0.5rem 1rem;
        border-radius: var(--ax-radius-field, 0.375rem);
        font-size: 0.875rem;
        font-weight: 500;
        border: none;
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .btn-sm {
        padding: 0.375rem 0.75rem;
        font-size: 0.75rem;
      }

      .btn-primary {
        background: var(--ax-color-primary, var(--ax-primary, #6366f1));
        color: var(--ax-color-primary-content, #fff);
      }

      .btn-secondary {
        background: var(--ax-color-secondary, var(--ax-secondary, #64748b));
        color: var(--ax-color-secondary-content, #fff);
      }

      .btn-accent {
        background: var(--ax-color-accent, var(--ax-accent, #f59e0b));
        color: var(--ax-color-accent-content, #000);
      }

      .btn-neutral {
        background: var(--ax-color-neutral, var(--ax-neutral, #374151));
        color: var(--ax-color-neutral-content, #fff);
      }

      .btn-info {
        background: var(--ax-color-info, var(--ax-info, #3b82f6));
        color: var(--ax-color-info-content, #fff);
      }

      .btn-success {
        background: var(--ax-color-success, var(--ax-success, #22c55e));
        color: var(--ax-color-success-content, #fff);
      }

      .btn-warning {
        background: var(--ax-color-warning, var(--ax-warning, #f59e0b));
        color: var(--ax-color-warning-content, #000);
      }

      .btn-error {
        background: var(--ax-color-error, var(--ax-error, #ef4444));
        color: var(--ax-color-error-content, #fff);
      }

      .btn-outline-primary {
        background: transparent;
        border: 1px solid var(--ax-color-primary, var(--ax-primary, #6366f1));
        color: var(--ax-color-primary, var(--ax-primary, #6366f1));
      }

      .btn-ghost {
        background: transparent;
        color: var(--ax-color-base-content, var(--ax-text-default, #333));
      }

      .btn-ghost:hover {
        background: var(--ax-color-base-300, rgba(0, 0, 0, 0.1));
      }

      .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      /* Badges */
      .badge-group {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
      }

      .badge {
        padding: 0.25rem 0.625rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 500;
      }

      .badge-lg {
        padding: 0.375rem 0.875rem;
        font-size: 0.875rem;
      }

      .badge-primary {
        background: var(--ax-color-primary, var(--ax-primary, #6366f1));
        color: var(--ax-color-primary-content, #fff);
      }

      .badge-secondary {
        background: var(--ax-color-secondary, var(--ax-secondary, #64748b));
        color: var(--ax-color-secondary-content, #fff);
      }

      .badge-accent {
        background: var(--ax-color-accent, var(--ax-accent, #f59e0b));
        color: var(--ax-color-accent-content, #000);
      }

      .badge-neutral {
        background: var(--ax-color-neutral, var(--ax-neutral, #374151));
        color: var(--ax-color-neutral-content, #fff);
      }

      .badge-info {
        background: var(--ax-color-info, var(--ax-info, #3b82f6));
        color: var(--ax-color-info-content, #fff);
      }

      .badge-success {
        background: var(--ax-color-success, var(--ax-success, #22c55e));
        color: var(--ax-color-success-content, #fff);
      }

      .badge-warning {
        background: var(--ax-color-warning, var(--ax-warning, #f59e0b));
        color: var(--ax-color-warning-content, #000);
      }

      .badge-error {
        background: var(--ax-color-error, var(--ax-error, #ef4444));
        color: var(--ax-color-error-content, #fff);
      }

      .badge-outline {
        background: transparent;
        border: 1px solid
          var(--ax-color-base-content, var(--ax-text-default, #333));
        color: var(--ax-color-base-content, var(--ax-text-default, #333));
      }

      /* Card */
      .card {
        background: var(
          --ax-color-base-100,
          var(--ax-background-default, #fff)
        );
        border-radius: var(--ax-radius-box, 0.5rem);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .card-body {
        padding: 1rem;
      }

      .card-title {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
      }

      .card-text {
        font-size: 0.875rem;
        color: var(--ax-color-base-content, var(--ax-text-muted, #666));
        margin-bottom: 1rem;
        opacity: 0.8;
      }

      .card-actions {
        display: flex;
        gap: 0.5rem;
      }

      /* Alerts */
      .alerts-stack {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .alert {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        border-radius: var(--ax-radius-box, 0.5rem);
        font-size: 0.875rem;
      }

      .alert-info {
        background: color-mix(
          in oklch,
          var(--ax-color-info, var(--ax-info, #3b82f6)) 15%,
          transparent
        );
        color: var(--ax-color-info, var(--ax-info, #3b82f6));
      }

      .alert-success {
        background: color-mix(
          in oklch,
          var(--ax-color-success, var(--ax-success, #22c55e)) 15%,
          transparent
        );
        color: var(--ax-color-success, var(--ax-success, #22c55e));
      }

      .alert-warning {
        background: color-mix(
          in oklch,
          var(--ax-color-warning, var(--ax-warning, #f59e0b)) 15%,
          transparent
        );
        color: var(--ax-color-warning, var(--ax-warning, #f59e0b));
      }

      .alert-error {
        background: color-mix(
          in oklch,
          var(--ax-color-error, var(--ax-error, #ef4444)) 15%,
          transparent
        );
        color: var(--ax-color-error, var(--ax-error, #ef4444));
      }

      /* Form Inputs */
      .form-group {
        margin-bottom: 0.75rem;
      }

      .form-label {
        display: block;
        font-size: 0.75rem;
        font-weight: 500;
        margin-bottom: 0.25rem;
        color: var(--ax-color-base-content, var(--ax-text-default, #333));
      }

      .form-input,
      .form-select {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid
          var(--ax-color-base-300, var(--ax-border-default, #e5e5e5));
        border-radius: var(--ax-radius-field, 0.375rem);
        font-size: 0.875rem;
        background: var(
          --ax-color-base-100,
          var(--ax-background-default, #fff)
        );
        color: var(--ax-color-base-content, var(--ax-text-default, #333));
      }

      .form-input:focus,
      .form-select:focus {
        outline: none;
        border-color: var(--ax-color-primary, var(--ax-primary, #6366f1));
        box-shadow: 0 0 0 2px
          color-mix(
            in oklch,
            var(--ax-color-primary, var(--ax-primary, #6366f1)) 25%,
            transparent
          );
      }

      .checkbox-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        cursor: pointer;
      }

      .form-checkbox {
        width: 1rem;
        height: 1rem;
        accent-color: var(--ax-color-primary, var(--ax-primary, #6366f1));
      }

      /* Progress */
      .progress-stack {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .progress-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .progress-label {
        font-size: 0.75rem;
        min-width: 4rem;
        color: var(--ax-color-base-content, var(--ax-text-muted, #666));
      }

      .progress-bar {
        flex: 1;
        height: 0.5rem;
        background: var(
          --ax-color-base-300,
          var(--ax-background-subtle, #e5e5e5)
        );
        border-radius: 9999px;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        border-radius: 9999px;
        transition: width 0.3s ease;
      }

      .progress-primary {
        background: var(--ax-color-primary, var(--ax-primary, #6366f1));
      }

      .progress-secondary {
        background: var(--ax-color-secondary, var(--ax-secondary, #64748b));
      }

      .progress-success {
        background: var(--ax-color-success, var(--ax-success, #22c55e));
      }

      /* Stats */
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.5rem;
      }

      .stat {
        text-align: center;
        padding: 0.5rem;
        border-radius: var(--ax-radius-box, 0.5rem);
        background: var(
          --ax-color-base-100,
          var(--ax-background-default, #fff)
        );
      }

      .stat-primary {
        background: color-mix(
          in oklch,
          var(--ax-color-primary, var(--ax-primary, #6366f1)) 15%,
          transparent
        );
      }

      .stat-success {
        background: color-mix(
          in oklch,
          var(--ax-color-success, var(--ax-success, #22c55e)) 15%,
          transparent
        );
      }

      .stat-value {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--ax-color-base-content, var(--ax-text-default, #333));
      }

      .stat-label {
        font-size: 0.625rem;
        text-transform: uppercase;
        color: var(--ax-color-base-content, var(--ax-text-muted, #666));
        opacity: 0.7;
      }

      /* Tabs */
      .tabs {
        display: flex;
        gap: 0.25rem;
        background: var(
          --ax-color-base-300,
          var(--ax-background-subtle, #e5e5e5)
        );
        padding: 0.25rem;
        border-radius: var(--ax-radius-box, 0.5rem);
      }

      .tab {
        flex: 1;
        padding: 0.5rem 1rem;
        border: none;
        background: transparent;
        border-radius: calc(var(--ax-radius-box, 0.5rem) - 0.125rem);
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        color: var(--ax-color-base-content, var(--ax-text-muted, #666));
        transition: all 0.15s ease;
      }

      .tab:hover {
        color: var(--ax-color-base-content, var(--ax-text-default, #333));
      }

      .tab-active {
        background: var(
          --ax-color-base-100,
          var(--ax-background-default, #fff)
        );
        color: var(--ax-color-base-content, var(--ax-text-default, #333));
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .tab-content {
        padding: 1rem;
        background: var(
          --ax-color-base-100,
          var(--ax-background-default, #fff)
        );
        border-radius: 0 0 var(--ax-radius-box, 0.5rem)
          var(--ax-radius-box, 0.5rem);
        font-size: 0.875rem;
      }

      /* Avatars */
      .avatar-group {
        display: flex;
        gap: -0.5rem;
      }

      .avatar {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: 600;
        border: 2px solid
          var(--ax-color-base-100, var(--ax-background-default, #fff));
      }

      .avatar-primary {
        background: var(--ax-color-primary, var(--ax-primary, #6366f1));
        color: var(--ax-color-primary-content, #fff);
      }

      .avatar-secondary {
        background: var(--ax-color-secondary, var(--ax-secondary, #64748b));
        color: var(--ax-color-secondary-content, #fff);
      }

      .avatar-accent {
        background: var(--ax-color-accent, var(--ax-accent, #f59e0b));
        color: var(--ax-color-accent-content, #000);
      }

      .avatar-neutral {
        background: var(--ax-color-neutral, var(--ax-neutral, #374151));
        color: var(--ax-color-neutral-content, #fff);
      }

      /* Toggle */
      .toggle-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .toggle-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        cursor: pointer;
      }

      .toggle {
        appearance: none;
        width: 2.5rem;
        height: 1.25rem;
        background: var(
          --ax-color-base-300,
          var(--ax-background-subtle, #e5e5e5)
        );
        border-radius: 9999px;
        position: relative;
        cursor: pointer;
        transition: background 0.15s ease;
      }

      .toggle::before {
        content: '';
        position: absolute;
        top: 0.125rem;
        left: 0.125rem;
        width: 1rem;
        height: 1rem;
        background: var(--ax-color-base-100, #fff);
        border-radius: 50%;
        transition: transform 0.15s ease;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      }

      .toggle:checked {
        background: var(--ax-color-neutral, var(--ax-neutral, #374151));
      }

      .toggle:checked::before {
        transform: translateX(1.25rem);
      }

      .toggle-primary:checked {
        background: var(--ax-color-primary, var(--ax-primary, #6366f1));
      }

      .toggle-success:checked {
        background: var(--ax-color-success, var(--ax-success, #22c55e));
      }

      @media (max-width: 768px) {
        .preview-grid {
          grid-template-columns: 1fr;
        }

        .preview-section-wide {
          grid-column: span 1;
        }
      }
    `,
  ],
})
export class ThemePreviewComponent {
  private themeService = inject(ThemeGeneratorService);
}
