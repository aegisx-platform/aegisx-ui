import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeGeneratorService } from '../../services/theme-generator.service';

type RadiusType = 'radius-box' | 'radius-field' | 'radius-selector';

interface RadiusOption {
  value: string;
  preview: string; // CSS for preview shape
}

@Component({
  selector: 'app-radius-editor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="radius-editor">
      <!-- Header -->
      <div class="editor-header">
        <div class="header-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" />
            <path d="M3 12V5a2 2 0 0 1 2-2h7" />
            <path d="M3 12h9" />
            <path d="M12 3v9" />
          </svg>
        </div>
        <span class="header-title">Radius</span>
        <div class="header-line"></div>
      </div>

      <!-- Boxes (card, modal, alert) -->
      <div class="radius-section">
        <div class="section-label">
          <span class="label-title">Boxes</span>
          <span class="label-hint">card, modal, alert</span>
        </div>
        <div class="radius-options">
          @for (option of radiusOptions; track option.value) {
            <button
              type="button"
              class="radius-option"
              [class.selected]="isSelected('radius-box', option.value)"
              (click)="setRadius('radius-box', option.value)"
            >
              <div
                class="radius-preview radius-preview-box"
                [style.border-radius]="option.value"
              >
                <div class="preview-corner"></div>
              </div>
            </button>
          }
        </div>
      </div>

      <!-- Fields (button, input, select, tab) -->
      <div class="radius-section">
        <div class="section-label">
          <span class="label-title">Fields</span>
          <span class="label-hint">button, input, select, tab</span>
        </div>
        <div class="radius-options">
          @for (option of radiusOptions; track option.value) {
            <button
              type="button"
              class="radius-option"
              [class.selected]="isSelected('radius-field', option.value)"
              (click)="setRadius('radius-field', option.value)"
            >
              <div
                class="radius-preview radius-preview-field"
                [style.border-radius]="option.value"
              >
                <div class="preview-corner"></div>
              </div>
            </button>
          }
        </div>
      </div>

      <!-- Selectors (checkbox, toggle, badge) -->
      <div class="radius-section">
        <div class="section-label">
          <span class="label-title">Selectors</span>
          <span class="label-hint">checkbox, toggle, badge</span>
        </div>
        <div class="radius-options">
          @for (option of radiusOptions; track option.value) {
            <button
              type="button"
              class="radius-option"
              [class.selected]="isSelected('radius-selector', option.value)"
              (click)="setRadius('radius-selector', option.value)"
            >
              <div
                class="radius-preview radius-preview-selector"
                [style.border-radius]="option.value"
              >
                <div class="preview-corner"></div>
              </div>
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .radius-editor {
        padding: 1rem;
      }

      .editor-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
      }

      .header-icon {
        color: var(--ax-text-muted, #666);
      }

      .header-title {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--ax-text-default, #333);
      }

      .header-line {
        flex: 1;
        height: 1px;
        background: var(--ax-border-default, #e5e5e5);
        margin-left: 0.5rem;
      }

      .radius-section {
        margin-bottom: 1.5rem;
      }

      .radius-section:last-child {
        margin-bottom: 0;
      }

      .section-label {
        margin-bottom: 0.75rem;
      }

      .label-title {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--ax-text-default, #333);
      }

      .label-hint {
        font-size: 0.75rem;
        color: var(--ax-text-muted, #999);
        font-style: italic;
      }

      .radius-options {
        display: flex;
        gap: 0.5rem;
      }

      .radius-option {
        width: 3rem;
        height: 3rem;
        padding: 0;
        border: none;
        background: var(--ax-background-muted, #f5f5f5);
        border-radius: 0.5rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s ease;
      }

      .radius-option:hover {
        background: var(--ax-background-subtle, #e8e8e8);
      }

      .radius-option.selected {
        background: var(--ax-background-default, #fff);
        box-shadow: 0 0 0 2px var(--ax-primary, #6366f1);
      }

      .radius-preview {
        position: relative;
        background: var(--ax-background-subtle, #e0e0e0);
        overflow: hidden;
      }

      .radius-preview-box {
        width: 2rem;
        height: 1.5rem;
      }

      .radius-preview-field {
        width: 2rem;
        height: 1.25rem;
      }

      .radius-preview-selector {
        width: 2rem;
        height: 1.25rem;
      }

      .preview-corner {
        position: absolute;
        top: 0;
        right: 0;
        width: 0.75rem;
        height: 0.75rem;
        border-left: 2px solid var(--ax-primary, #6366f1);
        border-bottom: 2px solid var(--ax-primary, #6366f1);
        border-bottom-left-radius: inherit;
        opacity: 0;
        transition: opacity 0.15s ease;
      }

      .radius-option.selected .preview-corner {
        opacity: 1;
      }
    `,
  ],
})
export class RadiusEditorComponent {
  private themeService = inject(ThemeGeneratorService);

  radiusOptions: RadiusOption[] = [
    { value: '0', preview: '0' },
    { value: '0.25rem', preview: '0.25rem' },
    { value: '0.5rem', preview: '0.5rem' },
    { value: '0.75rem', preview: '0.75rem' },
    { value: '1rem', preview: '1rem' },
  ];

  isSelected(type: RadiusType, value: string): boolean {
    return this.themeService.tokens()[type] === value;
  }

  setRadius(type: RadiusType, value: string): void {
    this.themeService.setToken(type, value);
  }
}
