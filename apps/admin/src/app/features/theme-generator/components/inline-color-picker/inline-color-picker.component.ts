import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OklchColor } from '../../models/theme-generator.types';
import {
  oklchToHex,
  hexToOklch,
  oklchToString,
  getContrastRatio,
  meetsWcagAA,
  meetsWcagAAA,
} from '../../utils/oklch.utils';

@Component({
  selector: 'app-inline-color-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="inline-color-picker" [class.expanded]="expanded()">
      <!-- Color Swatch Button -->
      <button
        type="button"
        class="color-trigger"
        [style.background-color]="hexColor()"
        (click)="toggle()"
      >
        <span class="trigger-label" [style.color]="labelColor()">{{
          label()
        }}</span>
      </button>

      <!-- Expanded Panel -->
      @if (expanded()) {
        <div class="picker-panel">
          <!-- Quick Palette -->
          <div class="quick-palette">
            @for (color of quickColors; track color.hex) {
              <button
                type="button"
                class="palette-color"
                [style.background-color]="color.hex"
                [class.selected]="isSelected(color)"
                (click)="selectQuickColor(color)"
                [title]="color.name"
              ></button>
            }
          </div>

          <!-- Sliders -->
          <div class="sliders">
            <!-- Lightness -->
            <div class="slider-row">
              <label>L</label>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                [ngModel]="currentColor().l"
                (ngModelChange)="updateLightness($event)"
                class="slider lightness-slider"
              />
              <span class="slider-value"
                >{{ currentColor().l | number: '1.0-0' }}%</span
              >
            </div>

            <!-- Chroma -->
            <div class="slider-row">
              <label>C</label>
              <input
                type="range"
                min="0"
                max="0.35"
                step="0.005"
                [ngModel]="currentColor().c"
                (ngModelChange)="updateChroma($event)"
                class="slider chroma-slider"
                [style.--hue]="currentColor().h"
              />
              <span class="slider-value">{{
                currentColor().c | number: '1.2-2'
              }}</span>
            </div>

            <!-- Hue -->
            <div class="slider-row">
              <label>H</label>
              <input
                type="range"
                min="0"
                max="360"
                step="1"
                [ngModel]="currentColor().h"
                (ngModelChange)="updateHue($event)"
                class="slider hue-slider"
              />
              <span class="slider-value"
                >{{ currentColor().h | number: '1.0-0' }}°</span
              >
            </div>
          </div>

          <!-- Hex Input -->
          <div class="hex-row">
            <input
              type="text"
              [ngModel]="hexColor()"
              (ngModelChange)="updateFromHex($event)"
              class="hex-input"
              maxlength="7"
              placeholder="#000000"
            />
            <button
              type="button"
              class="copy-btn"
              (click)="copyHex()"
              [title]="copied() ? 'Copied!' : 'Copy hex'"
            >
              @if (copied()) {
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              } @else {
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path
                    d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                  />
                </svg>
              }
            </button>
          </div>

          <!-- Contrast Info (if contentColor provided) -->
          @if (contrastColor()) {
            <div class="contrast-info">
              <div class="contrast-preview">
                <div
                  class="preview-box"
                  [style.background-color]="hexColor()"
                  [style.color]="contrastHex()"
                >
                  Aa
                </div>
              </div>
              <div class="contrast-scores">
                <div class="score-row">
                  <span class="score-label">Contrast:</span>
                  <span class="score-value"
                    >{{ contrastRatio() | number: '1.1-1' }}:1</span
                  >
                </div>
                <div class="wcag-badges">
                  <span
                    class="wcag-badge"
                    [class.pass]="wcagAA()"
                    [class.fail]="!wcagAA()"
                  >
                    AA {{ wcagAA() ? '✓' : '✗' }}
                  </span>
                  <span
                    class="wcag-badge"
                    [class.pass]="wcagAAA()"
                    [class.fail]="!wcagAAA()"
                  >
                    AAA {{ wcagAAA() ? '✓' : '✗' }}
                  </span>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .inline-color-picker {
        position: relative;
        display: inline-block;
      }

      .color-trigger {
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 0.75rem;
        border: 2px solid transparent;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s ease;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .color-trigger:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .inline-color-picker.expanded .color-trigger {
        border-color: var(--ax-primary, #6366f1);
        box-shadow: 0 0 0 3px
          color-mix(in oklch, var(--ax-primary, #6366f1) 25%, transparent);
      }

      .trigger-label {
        font-size: 0.875rem;
        font-weight: 600;
      }

      .picker-panel {
        position: absolute;
        top: calc(100% + 0.5rem);
        left: 0;
        z-index: 100;
        background: var(--ax-background-default, #fff);
        border-radius: 0.75rem;
        padding: 0.75rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        min-width: 220px;
        animation: slideDown 0.15s ease;
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Quick Palette */
      .quick-palette {
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        gap: 0.25rem;
        margin-bottom: 0.75rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid var(--ax-border-default, #e5e5e5);
      }

      .palette-color {
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 0.25rem;
        border: 1px solid rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: all 0.1s ease;
      }

      .palette-color:hover {
        transform: scale(1.15);
        z-index: 1;
      }

      .palette-color.selected {
        box-shadow: 0 0 0 2px var(--ax-primary, #6366f1);
      }

      /* Sliders */
      .sliders {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 0.75rem;
      }

      .slider-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .slider-row label {
        width: 1rem;
        font-size: 0.625rem;
        font-weight: 600;
        color: var(--ax-text-muted, #999);
      }

      .slider {
        flex: 1;
        height: 0.375rem;
        -webkit-appearance: none;
        border-radius: 0.25rem;
        outline: none;
      }

      .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 0.875rem;
        height: 0.875rem;
        border-radius: 50%;
        background: #fff;
        border: 2px solid var(--ax-text-default, #333);
        cursor: pointer;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      }

      .lightness-slider {
        background: linear-gradient(to right, #000, #fff);
      }

      .chroma-slider {
        background: linear-gradient(
          to right,
          oklch(65% 0 var(--hue, 0)),
          oklch(65% 0.35 var(--hue, 0))
        );
      }

      .hue-slider {
        background: linear-gradient(
          to right,
          oklch(65% 0.2 0),
          oklch(65% 0.2 60),
          oklch(65% 0.2 120),
          oklch(65% 0.2 180),
          oklch(65% 0.2 240),
          oklch(65% 0.2 300),
          oklch(65% 0.2 360)
        );
      }

      .slider-value {
        width: 2.5rem;
        font-size: 0.625rem;
        font-family: monospace;
        color: var(--ax-text-muted, #666);
        text-align: right;
      }

      /* Hex Input */
      .hex-row {
        display: flex;
        gap: 0.375rem;
      }

      .hex-input {
        flex: 1;
        padding: 0.375rem 0.5rem;
        border: 1px solid var(--ax-border-default, #e5e5e5);
        border-radius: 0.375rem;
        font-family: monospace;
        font-size: 0.75rem;
        text-transform: uppercase;
      }

      .hex-input:focus {
        outline: none;
        border-color: var(--ax-primary, #6366f1);
      }

      .copy-btn {
        padding: 0.375rem;
        border: 1px solid var(--ax-border-default, #e5e5e5);
        border-radius: 0.375rem;
        background: var(--ax-background-default, #fff);
        color: var(--ax-text-muted, #666);
        cursor: pointer;
      }

      .copy-btn:hover {
        background: var(--ax-background-muted, #f5f5f5);
        color: var(--ax-text-default, #333);
      }

      /* Contrast Info */
      .contrast-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-top: 0.75rem;
        padding-top: 0.75rem;
        border-top: 1px solid var(--ax-border-default, #e5e5e5);
      }

      .preview-box {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 0.375rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        font-weight: 600;
      }

      .contrast-scores {
        flex: 1;
      }

      .score-row {
        display: flex;
        justify-content: space-between;
        font-size: 0.6875rem;
        margin-bottom: 0.25rem;
      }

      .score-label {
        color: var(--ax-text-muted, #999);
      }

      .score-value {
        font-weight: 600;
        font-family: monospace;
      }

      .wcag-badges {
        display: flex;
        gap: 0.375rem;
      }

      .wcag-badge {
        padding: 0.125rem 0.375rem;
        border-radius: 0.25rem;
        font-size: 0.5625rem;
        font-weight: 600;
      }

      .wcag-badge.pass {
        background: color-mix(
          in oklch,
          var(--ax-success, #22c55e) 15%,
          transparent
        );
        color: var(--ax-success, #22c55e);
      }

      .wcag-badge.fail {
        background: color-mix(
          in oklch,
          var(--ax-error, #ef4444) 15%,
          transparent
        );
        color: var(--ax-error, #ef4444);
      }
    `,
  ],
})
export class InlineColorPickerComponent {
  // Inputs
  color = input.required<OklchColor>();
  label = input('');
  contrastColor = input<OklchColor | null>(null);

  // Outputs
  colorChange = output<OklchColor>();

  // State
  expanded = signal(false);
  copied = signal(false);

  // Computed
  currentColor = computed(() => this.color());
  hexColor = computed(() => oklchToHex(this.currentColor()));
  labelColor = computed(() => (this.currentColor().l > 60 ? '#000' : '#fff'));

  contrastHex = computed(() => {
    const cc = this.contrastColor();
    return cc ? oklchToHex(cc) : '#000';
  });

  contrastRatio = computed(() => {
    const cc = this.contrastColor();
    if (!cc) return 0;
    return getContrastRatio(this.currentColor(), cc);
  });

  wcagAA = computed(() => {
    const cc = this.contrastColor();
    if (!cc) return false;
    return meetsWcagAA(this.currentColor(), cc);
  });

  wcagAAA = computed(() => {
    const cc = this.contrastColor();
    if (!cc) return false;
    return meetsWcagAAA(this.currentColor(), cc);
  });

  // Quick color palette
  quickColors = [
    // Row 1: Grays
    { name: 'White', hex: '#ffffff', oklch: { l: 100, c: 0, h: 0 } },
    { name: 'Gray 100', hex: '#f5f5f5', oklch: { l: 97, c: 0, h: 0 } },
    { name: 'Gray 300', hex: '#d4d4d4', oklch: { l: 85, c: 0, h: 0 } },
    { name: 'Gray 500', hex: '#737373', oklch: { l: 55, c: 0, h: 0 } },
    { name: 'Gray 700', hex: '#404040', oklch: { l: 35, c: 0, h: 0 } },
    { name: 'Gray 900', hex: '#171717', oklch: { l: 15, c: 0, h: 0 } },
    { name: 'Black', hex: '#000000', oklch: { l: 0, c: 0, h: 0 } },
    { name: 'Transparent', hex: '#808080', oklch: { l: 60, c: 0, h: 0 } },
    // Row 2: Colors
    { name: 'Red', hex: '#ef4444', oklch: { l: 63, c: 0.24, h: 25 } },
    { name: 'Orange', hex: '#f97316', oklch: { l: 70, c: 0.2, h: 45 } },
    { name: 'Yellow', hex: '#eab308', oklch: { l: 80, c: 0.19, h: 85 } },
    { name: 'Green', hex: '#22c55e', oklch: { l: 72, c: 0.2, h: 145 } },
    { name: 'Cyan', hex: '#06b6d4', oklch: { l: 70, c: 0.15, h: 195 } },
    { name: 'Blue', hex: '#3b82f6', oklch: { l: 60, c: 0.2, h: 260 } },
    { name: 'Purple', hex: '#8b5cf6', oklch: { l: 55, c: 0.22, h: 290 } },
    { name: 'Pink', hex: '#ec4899', oklch: { l: 60, c: 0.22, h: 330 } },
  ];

  toggle(): void {
    this.expanded.update((v) => !v);
  }

  isSelected(color: { hex: string; oklch: OklchColor }): boolean {
    const current = this.currentColor();
    return (
      Math.abs(current.l - color.oklch.l) < 3 &&
      Math.abs(current.c - color.oklch.c) < 0.03 &&
      Math.abs(current.h - color.oklch.h) < 10
    );
  }

  selectQuickColor(color: { hex: string; oklch: OklchColor }): void {
    this.colorChange.emit({ ...color.oklch });
  }

  updateLightness(value: number): void {
    const current = this.currentColor();
    this.colorChange.emit({ ...current, l: value });
  }

  updateChroma(value: number): void {
    const current = this.currentColor();
    this.colorChange.emit({ ...current, c: value });
  }

  updateHue(value: number): void {
    const current = this.currentColor();
    this.colorChange.emit({ ...current, h: value });
  }

  updateFromHex(hex: string): void {
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      const color = hexToOklch(hex);
      this.colorChange.emit(color);
    }
  }

  async copyHex(): Promise<void> {
    await navigator.clipboard.writeText(this.hexColor());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1500);
  }
}
