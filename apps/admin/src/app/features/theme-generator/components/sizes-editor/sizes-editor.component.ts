import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeGeneratorService } from '../../services/theme-generator.service';

@Component({
  selector: 'app-sizes-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="sizes-editor">
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
            <path d="M21 3H3v7h18V3z" />
            <path d="M21 14H3v7h18v-7z" />
          </svg>
        </div>
        <span class="header-title">Sizes</span>
        <div class="header-line"></div>
      </div>

      <!-- Fields Size -->
      <div class="size-section">
        <div class="section-label">
          <span class="label-title">Fields</span>
          <span class="label-hint">button, input, select, tab</span>
        </div>

        <div class="size-control">
          <div class="size-visual">
            <div class="bars-container">
              @for (size of sizeLabels; track size.label) {
                <div
                  class="bar"
                  [class.active]="fieldSizeIndex() >= size.index"
                  [style.height.px]="12 + size.index * 6"
                ></div>
              }
            </div>
            <div class="size-labels">
              @for (size of sizeLabels; track size.label) {
                <span class="size-label">{{ size.label }}</span>
              }
            </div>
            <div class="size-values">
              @for (size of sizeLabels; track size.label) {
                <span class="size-value">{{
                  fieldSizeValues[size.index]
                }}</span>
              }
            </div>
          </div>

          <div class="size-display">
            <span class="display-label">Fields base size</span>
            <span class="display-value">{{ fieldPixels() }}</span>
            <span class="display-unit">Pixels</span>
          </div>

          <div class="slider-container">
            <input
              type="range"
              min="0"
              max="4"
              step="1"
              [ngModel]="fieldSizeIndex()"
              (ngModelChange)="setFieldSize($event)"
              class="size-slider"
            />
            <div class="slider-marks">
              @for (size of sizeLabels; track size.label) {
                <span class="mark"></span>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Selectors Size -->
      <div class="size-section">
        <div class="section-label">
          <span class="label-title">Selectors</span>
          <span class="label-hint">checkbox, toggle, badge</span>
        </div>

        <div class="size-control">
          <div class="size-visual">
            <div class="bars-container">
              @for (size of sizeLabels; track size.label) {
                <div
                  class="bar"
                  [class.active]="selectorSizeIndex() >= size.index"
                  [style.height.px]="10 + size.index * 5"
                ></div>
              }
            </div>
            <div class="size-labels">
              @for (size of sizeLabels; track size.label) {
                <span class="size-label">{{ size.label }}</span>
              }
            </div>
            <div class="size-values">
              @for (size of sizeLabels; track size.label) {
                <span class="size-value">{{
                  selectorSizeValues[size.index]
                }}</span>
              }
            </div>
          </div>

          <div class="size-display">
            <span class="display-label">Selectors base size</span>
            <span class="display-value">{{ selectorPixels() }}</span>
            <span class="display-unit">Pixels</span>
          </div>

          <div class="slider-container">
            <input
              type="range"
              min="0"
              max="4"
              step="1"
              [ngModel]="selectorSizeIndex()"
              (ngModelChange)="setSelectorSize($event)"
              class="size-slider"
            />
            <div class="slider-marks">
              @for (size of sizeLabels; track size.label) {
                <span class="mark"></span>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Border Width -->
      <div class="size-section">
        <div class="section-label">
          <span class="label-title">Border Width</span>
          <span class="label-hint">All components</span>
        </div>

        <div class="border-control">
          <div class="border-display">
            <span class="border-value">{{ borderWidth() }}</span>
          </div>

          <div class="slider-container slider-container-wide">
            <input
              type="range"
              min="0"
              max="3"
              step="1"
              [ngModel]="borderIndex()"
              (ngModelChange)="setBorder($event)"
              class="size-slider"
            />
            <div class="slider-marks slider-marks-4">
              @for (i of [0, 1, 2, 3]; track i) {
                <span class="mark"></span>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .sizes-editor {
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

      .size-section {
        margin-bottom: 2rem;
      }

      .size-section:last-child {
        margin-bottom: 0;
      }

      .section-label {
        margin-bottom: 1rem;
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

      .size-control {
        background: var(--ax-background-muted, #f8f8f8);
        border-radius: 0.75rem;
        padding: 1rem;
      }

      .size-visual {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .bars-container {
        display: flex;
        align-items: flex-end;
        gap: 0.375rem;
        height: 3rem;
      }

      .bar {
        width: 0.5rem;
        background: var(--ax-background-subtle, #e0e0e0);
        border-radius: 0.25rem;
        transition: all 0.2s ease;
      }

      .bar.active {
        background: var(--ax-text-default, #333);
      }

      .size-labels {
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
        justify-content: flex-end;
      }

      .size-label {
        font-size: 0.625rem;
        font-weight: 600;
        color: var(--ax-text-muted, #999);
      }

      .size-values {
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
        justify-content: flex-end;
      }

      .size-value {
        font-size: 0.625rem;
        color: var(--ax-text-muted, #bbb);
      }

      .size-display {
        text-align: right;
        margin-bottom: 0.75rem;
      }

      .display-label {
        display: block;
        font-size: 0.75rem;
        color: var(--ax-text-muted, #999);
      }

      .display-value {
        font-size: 2rem;
        font-weight: 700;
        color: var(--ax-text-default, #333);
        line-height: 1;
      }

      .display-unit {
        display: block;
        font-size: 0.75rem;
        color: var(--ax-text-muted, #999);
      }

      .slider-container {
        position: relative;
        padding: 0 0.25rem;
      }

      .slider-container-wide {
        max-width: 200px;
        margin: 0 auto;
      }

      .size-slider {
        width: 100%;
        height: 0.5rem;
        -webkit-appearance: none;
        background: linear-gradient(
          to right,
          var(--ax-text-default, #333) 50%,
          var(--ax-background-subtle, #e0e0e0) 50%
        );
        border-radius: 0.25rem;
        outline: none;
      }

      .size-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 1.25rem;
        height: 1.25rem;
        background: var(--ax-background-default, #fff);
        border: 2px solid var(--ax-text-default, #333);
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      }

      .slider-marks {
        display: flex;
        justify-content: space-between;
        margin-top: 0.375rem;
        padding: 0 0.5rem;
      }

      .slider-marks-4 {
        padding: 0 0.375rem;
      }

      .mark {
        width: 1px;
        height: 0.5rem;
        background: var(--ax-border-default, #ccc);
      }

      .border-control {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
      }

      .border-display {
        background: var(--ax-text-default, #333);
        color: var(--ax-background-default, #fff);
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 0.875rem;
        font-weight: 500;
      }
    `,
  ],
})
export class SizesEditorComponent {
  themeService = inject(ThemeGeneratorService);

  sizeLabels = [
    { label: 'XS', index: 0 },
    { label: 'SM', index: 1 },
    { label: 'MD', index: 2 },
    { label: 'LG', index: 3 },
    { label: 'XL', index: 4 },
  ];

  // Field sizes in rem -> display values
  fieldSizeOptions = [
    '0.125rem',
    '0.1875rem',
    '0.25rem',
    '0.3125rem',
    '0.375rem',
  ];
  fieldSizeValues = [18, 24, 30, 36, 42];

  // Selector sizes
  selectorSizeOptions = [
    '0.125rem',
    '0.1875rem',
    '0.25rem',
    '0.3125rem',
    '0.375rem',
  ];
  selectorSizeValues = [16, 20, 24, 28, 32];

  // Border options
  borderOptions = ['0', '1px', '2px', '3px'];

  fieldSizeIndex = computed(() => {
    const current = this.themeService.tokens()['size-field'];
    const index = this.fieldSizeOptions.indexOf(current);
    return index >= 0 ? index : 2; // Default MD
  });

  selectorSizeIndex = computed(() => {
    const current = this.themeService.tokens()['size-selector'];
    const index = this.selectorSizeOptions.indexOf(current);
    return index >= 0 ? index : 2; // Default MD
  });

  borderIndex = computed(() => {
    const current = this.themeService.tokens()['border'];
    const index = this.borderOptions.indexOf(current);
    return index >= 0 ? index : 1; // Default 1px
  });

  fieldPixels = computed(() =>
    this.fieldSizeValues[this.fieldSizeIndex()].toFixed(1),
  );
  selectorPixels = computed(() =>
    this.selectorSizeValues[this.selectorSizeIndex()].toFixed(1),
  );
  borderWidth = computed(() => this.borderOptions[this.borderIndex()]);

  setFieldSize(index: number): void {
    this.themeService.setToken('size-field', this.fieldSizeOptions[index]);
  }

  setSelectorSize(index: number): void {
    this.themeService.setToken(
      'size-selector',
      this.selectorSizeOptions[index],
    );
  }

  setBorder(index: number): void {
    this.themeService.setToken('border', this.borderOptions[index]);
  }
}
