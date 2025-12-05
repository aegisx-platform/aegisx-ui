import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeGeneratorService } from '../../services/theme-generator.service';

@Component({
  selector: 'app-design-tokens-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="design-tokens-editor">
      <h4 class="section-title">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
        Design Tokens
      </h4>

      <!-- Border Radius -->
      <div class="token-group">
        <h5 class="token-group-title">Border Radius</h5>

        <div class="token-item">
          <label>
            <span class="token-label">Selector</span>
            <span class="token-hint">Badges, chips</span>
          </label>
          <div class="token-input-group">
            <select
              [ngModel]="tokens()['radius-selector']"
              (ngModelChange)="setToken('radius-selector', $event)"
              class="token-select"
            >
              <option value="0">0 (None)</option>
              <option value="0.25rem">0.25rem (XS)</option>
              <option value="0.375rem">0.375rem (SM)</option>
              <option value="0.5rem">0.5rem (MD)</option>
              <option value="0.75rem">0.75rem (LG)</option>
              <option value="1rem">1rem (XL)</option>
              <option value="1.5rem">1.5rem (2XL)</option>
              <option value="9999px">Full</option>
            </select>
            <div
              class="radius-preview"
              [style.border-radius]="tokens()['radius-selector']"
            ></div>
          </div>
        </div>

        <div class="token-item">
          <label>
            <span class="token-label">Field</span>
            <span class="token-hint">Inputs, buttons</span>
          </label>
          <div class="token-input-group">
            <select
              [ngModel]="tokens()['radius-field']"
              (ngModelChange)="setToken('radius-field', $event)"
              class="token-select"
            >
              <option value="0">0 (None)</option>
              <option value="0.25rem">0.25rem (XS)</option>
              <option value="0.375rem">0.375rem (SM)</option>
              <option value="0.5rem">0.5rem (MD)</option>
              <option value="0.75rem">0.75rem (LG)</option>
              <option value="1rem">1rem (XL)</option>
            </select>
            <div
              class="radius-preview"
              [style.border-radius]="tokens()['radius-field']"
            ></div>
          </div>
        </div>

        <div class="token-item">
          <label>
            <span class="token-label">Box</span>
            <span class="token-hint">Cards, modals</span>
          </label>
          <div class="token-input-group">
            <select
              [ngModel]="tokens()['radius-box']"
              (ngModelChange)="setToken('radius-box', $event)"
              class="token-select"
            >
              <option value="0">0 (None)</option>
              <option value="0.25rem">0.25rem (XS)</option>
              <option value="0.375rem">0.375rem (SM)</option>
              <option value="0.5rem">0.5rem (MD)</option>
              <option value="0.75rem">0.75rem (LG)</option>
              <option value="1rem">1rem (XL)</option>
              <option value="1.5rem">1.5rem (2XL)</option>
            </select>
            <div
              class="radius-preview radius-preview-box"
              [style.border-radius]="tokens()['radius-box']"
            ></div>
          </div>
        </div>
      </div>

      <!-- Size -->
      <div class="token-group">
        <h5 class="token-group-title">Size</h5>

        <div class="token-item">
          <label>
            <span class="token-label">Selector Size</span>
            <span class="token-hint">Spacing for selectors</span>
          </label>
          <select
            [ngModel]="tokens()['size-selector']"
            (ngModelChange)="setToken('size-selector', $event)"
            class="token-select"
          >
            <option value="0.125rem">0.125rem (XS)</option>
            <option value="0.25rem">0.25rem (SM)</option>
            <option value="0.375rem">0.375rem (MD)</option>
            <option value="0.5rem">0.5rem (LG)</option>
          </select>
        </div>

        <div class="token-item">
          <label>
            <span class="token-label">Field Size</span>
            <span class="token-hint">Spacing for fields</span>
          </label>
          <select
            [ngModel]="tokens()['size-field']"
            (ngModelChange)="setToken('size-field', $event)"
            class="token-select"
          >
            <option value="0.125rem">0.125rem (XS)</option>
            <option value="0.25rem">0.25rem (SM)</option>
            <option value="0.375rem">0.375rem (MD)</option>
            <option value="0.5rem">0.5rem (LG)</option>
          </select>
        </div>
      </div>

      <!-- Border -->
      <div class="token-group">
        <h5 class="token-group-title">Border</h5>

        <div class="token-item">
          <label>
            <span class="token-label">Border Width</span>
            <span class="token-hint">Default border thickness</span>
          </label>
          <select
            [ngModel]="tokens()['border']"
            (ngModelChange)="setToken('border', $event)"
            class="token-select"
          >
            <option value="0">0 (None)</option>
            <option value="1px">1px (Thin)</option>
            <option value="2px">2px (Medium)</option>
            <option value="3px">3px (Thick)</option>
          </select>
        </div>
      </div>

      <!-- Effects -->
      <div class="token-group">
        <h5 class="token-group-title">Effects</h5>

        <div class="token-item">
          <label>
            <span class="token-label">Shadow Depth</span>
            <span class="token-hint">0 = flat, 1 = elevated</span>
          </label>
          <div class="slider-group">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              [ngModel]="tokens()['depth']"
              (ngModelChange)="setToken('depth', $event)"
              class="token-slider"
            />
            <span class="slider-value">{{ tokens()['depth'] }}</span>
          </div>
        </div>

        <div class="token-item">
          <label>
            <span class="token-label">Noise Texture</span>
            <span class="token-hint">0 = smooth, 1 = textured</span>
          </label>
          <div class="slider-group">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              [ngModel]="tokens()['noise']"
              (ngModelChange)="setToken('noise', $event)"
              class="token-slider"
            />
            <span class="slider-value">{{ tokens()['noise'] }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .design-tokens-editor {
        padding: 1rem;
      }

      .section-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: var(--ax-text-default, #333);
      }

      .token-group {
        margin-bottom: 1.25rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--ax-border-default, #e5e5e5);
      }

      .token-group:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }

      .token-group-title {
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--ax-text-muted, #666);
        margin-bottom: 0.75rem;
      }

      .token-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.75rem;
      }

      .token-item:last-child {
        margin-bottom: 0;
      }

      .token-item label {
        display: flex;
        flex-direction: column;
      }

      .token-label {
        font-size: 0.8125rem;
        font-weight: 500;
        color: var(--ax-text-default, #333);
      }

      .token-hint {
        font-size: 0.6875rem;
        color: var(--ax-text-muted, #999);
      }

      .token-input-group {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .token-select {
        padding: 0.375rem 0.5rem;
        border: 1px solid var(--ax-border-default, #e5e5e5);
        border-radius: 0.375rem;
        font-size: 0.75rem;
        background: var(--ax-background-default, #fff);
        color: var(--ax-text-default, #333);
        min-width: 120px;
      }

      .token-select:focus {
        outline: none;
        border-color: var(--ax-primary, #6366f1);
      }

      .radius-preview {
        width: 1.5rem;
        height: 1.5rem;
        background: var(--ax-primary, #6366f1);
        transition: border-radius 0.15s ease;
      }

      .radius-preview-box {
        width: 2rem;
        height: 1.5rem;
      }

      .slider-group {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .token-slider {
        width: 100px;
        -webkit-appearance: none;
        height: 0.375rem;
        border-radius: 0.25rem;
        background: var(--ax-background-subtle, #e5e5e5);
      }

      .token-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 0.875rem;
        height: 0.875rem;
        border-radius: 50%;
        background: var(--ax-primary, #6366f1);
        cursor: pointer;
      }

      .slider-value {
        font-size: 0.75rem;
        font-family: monospace;
        min-width: 2rem;
        text-align: right;
        color: var(--ax-text-muted, #666);
      }
    `,
  ],
})
export class DesignTokensEditorComponent {
  private themeService = inject(ThemeGeneratorService);

  tokens = this.themeService.tokens;

  setToken(key: string, value: string | number): void {
    this.themeService.setToken(key as any, value as any);
  }
}
