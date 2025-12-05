import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeGeneratorService } from '../../services/theme-generator.service';

@Component({
  selector: 'app-effects-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="effects-editor">
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
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            />
          </svg>
        </div>
        <span class="header-title">Effects</span>
        <div class="header-line"></div>
      </div>

      <!-- Depth Effect -->
      <div class="effect-row">
        <div class="effect-info">
          <span class="effect-title">Depth Effect</span>
          <span class="effect-hint">3D depth on fields & selectors</span>
        </div>
        <label class="toggle-switch">
          <input
            type="checkbox"
            [checked]="themeService.tokens()['depth'] === 1"
            (change)="toggleDepth($event)"
          />
          <span class="toggle-slider"></span>
        </label>
      </div>

      <!-- Noise Effect -->
      <div class="effect-row">
        <div class="effect-info">
          <span class="effect-title">Noise Effect</span>
          <span class="effect-hint">Noise pattern on fields & selectors</span>
        </div>
        <label class="toggle-switch">
          <input
            type="checkbox"
            [checked]="themeService.tokens()['noise'] === 1"
            (change)="toggleNoise($event)"
          />
          <span class="toggle-slider"></span>
        </label>
      </div>
    </div>
  `,
  styles: [
    `
      .effects-editor {
        padding: 1rem;
      }

      .editor-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1.25rem;
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

      .effect-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 0;
        border-bottom: 1px solid var(--ax-border-default, #f0f0f0);
      }

      .effect-row:last-child {
        border-bottom: none;
      }

      .effect-info {
        display: flex;
        flex-direction: column;
      }

      .effect-title {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--ax-text-default, #333);
      }

      .effect-hint {
        font-size: 0.75rem;
        color: var(--ax-text-muted, #999);
        font-style: italic;
      }

      /* Toggle Switch */
      .toggle-switch {
        position: relative;
        display: inline-block;
        width: 3rem;
        height: 1.5rem;
        cursor: pointer;
      }

      .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .toggle-slider {
        position: absolute;
        inset: 0;
        background-color: var(--ax-background-subtle, #e0e0e0);
        border-radius: 1.5rem;
        transition: all 0.2s ease;
      }

      .toggle-slider::before {
        position: absolute;
        content: '';
        height: 1.125rem;
        width: 1.125rem;
        left: 0.1875rem;
        bottom: 0.1875rem;
        background-color: white;
        border-radius: 50%;
        transition: all 0.2s ease;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      }

      .toggle-switch input:checked + .toggle-slider {
        background-color: var(--ax-text-default, #333);
      }

      .toggle-switch input:checked + .toggle-slider::before {
        transform: translateX(1.5rem);
      }

      .toggle-switch input:focus + .toggle-slider {
        box-shadow: 0 0 0 2px
          color-mix(in oklch, var(--ax-primary, #6366f1) 30%, transparent);
      }
    `,
  ],
})
export class EffectsEditorComponent {
  themeService = inject(ThemeGeneratorService);

  toggleDepth(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.themeService.setToken('depth', checked ? 1 : 0);
  }

  toggleNoise(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.themeService.setToken('noise', checked ? 1 : 0);
  }
}
