import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OklchColor } from '../../models/theme-generator.types';
import { ColorSwatchComponent } from '../color-swatch/color-swatch.component';
import { oklchToHex, hexToOklch, oklchToString } from '../../utils/oklch.utils';

type PickerMode = 'palette' | 'picker';

@Component({
  selector: 'app-color-palette-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, ColorSwatchComponent],
  template: `
    <div class="color-palette-picker">
      <!-- Header -->
      <div class="picker-header">
        <div class="color-preview">
          <app-color-swatch
            [color]="currentColor()"
            size="large"
            [label]="label()"
          />
        </div>
        <div class="picker-info">
          <span class="picker-label"
            >Pick a color for <strong>{{ slotName() }}</strong></span
          >
        </div>
        <div class="mode-toggle">
          <button
            type="button"
            [class.active]="mode() === 'palette'"
            (click)="mode.set('palette')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
            Palette
          </button>
          <button
            type="button"
            [class.active]="mode() === 'picker'"
            (click)="mode.set('picker')"
          >
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
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
            </svg>
            Picker
          </button>
        </div>
      </div>

      <!-- Palette Mode -->
      @if (mode() === 'palette') {
        <div class="palette-grid">
          @for (row of paletteRows; track row.hue) {
            <div class="palette-row">
              @for (color of row.colors; track color.h + '-' + color.l) {
                <app-color-swatch
                  [color]="color"
                  [selected]="isSelected(color)"
                  [label]="getSwatchLabel(row, color)"
                  size="small"
                  (onClick)="selectColor(color)"
                />
              }
            </div>
          }
        </div>
      }

      <!-- Picker Mode -->
      @if (mode() === 'picker') {
        <div class="picker-controls">
          <!-- Lightness -->
          <div class="slider-group">
            <label>
              <span>Lightness</span>
              <span class="value">{{ currentColor().l.toFixed(0) }}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              [ngModel]="currentColor().l"
              (ngModelChange)="updateLightness($event)"
              class="slider lightness-slider"
            />
          </div>

          <!-- Chroma -->
          <div class="slider-group">
            <label>
              <span>Chroma</span>
              <span class="value">{{ currentColor().c.toFixed(3) }}</span>
            </label>
            <input
              type="range"
              min="0"
              max="0.4"
              step="0.001"
              [ngModel]="currentColor().c"
              (ngModelChange)="updateChroma($event)"
              class="slider chroma-slider"
            />
          </div>

          <!-- Hue -->
          <div class="slider-group">
            <label>
              <span>Hue</span>
              <span class="value">{{ currentColor().h.toFixed(0) }}°</span>
            </label>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              [ngModel]="currentColor().h"
              (ngModelChange)="updateHue($event)"
              class="slider hue-slider"
            />
          </div>

          <!-- Hex Input -->
          <div class="hex-input-group">
            <label>Hex</label>
            <input
              type="text"
              [ngModel]="hexValue()"
              (ngModelChange)="updateFromHex($event)"
              class="hex-input"
              maxlength="7"
            />
          </div>
        </div>
      }

      <!-- Color Value Display -->
      <div class="color-value-display">
        <div class="value-row">
          <select
            [ngModel]="colorFormat()"
            (ngModelChange)="colorFormat.set($event)"
            class="format-select"
          >
            <option value="oklch">OKLCH</option>
            <option value="hex">HEX</option>
          </select>
          <input
            type="text"
            [value]="colorFormat() === 'oklch' ? oklchString() : hexValue()"
            readonly
            class="value-input"
          />
          <button type="button" class="copy-btn" (click)="copyValue()">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .color-palette-picker {
        background: var(--ax-background-default, #fff);
        border-radius: 0.75rem;
        padding: 1rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        min-width: 320px;
      }

      .picker-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid var(--ax-border-default, #e5e5e5);
      }

      .picker-info {
        flex: 1;
      }

      .picker-label {
        font-size: 0.875rem;
        color: var(--ax-text-muted, #666);
      }

      .picker-label strong {
        color: var(--ax-text-default, #333);
      }

      .mode-toggle {
        display: flex;
        gap: 0.25rem;
        background: var(--ax-background-muted, #f5f5f5);
        padding: 0.25rem;
        border-radius: 0.5rem;
      }

      .mode-toggle button {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.375rem 0.75rem;
        border: none;
        background: transparent;
        border-radius: 0.375rem;
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--ax-text-muted, #666);
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .mode-toggle button:hover {
        color: var(--ax-text-default, #333);
      }

      .mode-toggle button.active {
        background: var(--ax-background-default, #fff);
        color: var(--ax-text-default, #333);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      /* Palette Grid */
      .palette-grid {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        margin-bottom: 1rem;
      }

      .palette-row {
        display: flex;
        gap: 0.25rem;
        justify-content: center;
      }

      /* Picker Controls */
      .picker-controls {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .slider-group {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
      }

      .slider-group label {
        display: flex;
        justify-content: space-between;
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--ax-text-muted, #666);
      }

      .slider-group .value {
        font-family: monospace;
        color: var(--ax-text-default, #333);
      }

      .slider {
        -webkit-appearance: none;
        width: 100%;
        height: 0.5rem;
        border-radius: 0.25rem;
        outline: none;
      }

      .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        background: #fff;
        border: 2px solid var(--ax-primary, #6366f1);
        cursor: pointer;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      }

      .lightness-slider {
        background: linear-gradient(to right, #000, #fff);
      }

      .chroma-slider {
        background: linear-gradient(
          to right,
          #888,
          oklch(65% 0.3 var(--picker-hue, 264))
        );
      }

      .hue-slider {
        background: linear-gradient(
          to right,
          oklch(65% 0.25 0),
          oklch(65% 0.25 60),
          oklch(65% 0.25 120),
          oklch(65% 0.25 180),
          oklch(65% 0.25 240),
          oklch(65% 0.25 300),
          oklch(65% 0.25 360)
        );
      }

      .hex-input-group {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .hex-input-group label {
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--ax-text-muted, #666);
        min-width: 2rem;
      }

      .hex-input {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid var(--ax-border-default, #e5e5e5);
        border-radius: 0.375rem;
        font-family: monospace;
        font-size: 0.875rem;
      }

      /* Color Value Display */
      .color-value-display {
        padding-top: 0.75rem;
        border-top: 1px solid var(--ax-border-default, #e5e5e5);
      }

      .value-row {
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }

      .format-select {
        padding: 0.5rem;
        border: 1px solid var(--ax-border-default, #e5e5e5);
        border-radius: 0.375rem;
        font-size: 0.75rem;
        background: var(--ax-background-default, #fff);
      }

      .value-input {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid var(--ax-border-default, #e5e5e5);
        border-radius: 0.375rem;
        font-family: monospace;
        font-size: 0.75rem;
        background: var(--ax-background-muted, #f5f5f5);
      }

      .copy-btn {
        padding: 0.5rem;
        border: 1px solid var(--ax-border-default, #e5e5e5);
        border-radius: 0.375rem;
        background: var(--ax-background-default, #fff);
        cursor: pointer;
        color: var(--ax-text-muted, #666);
        transition: all 0.15s ease;
      }

      .copy-btn:hover {
        background: var(--ax-background-muted, #f5f5f5);
        color: var(--ax-text-default, #333);
      }
    `,
  ],
})
export class ColorPalettePickerComponent {
  // Inputs
  color = input.required<OklchColor>();
  slotName = input('color');
  label = input('');

  // Outputs
  colorChange = output<OklchColor>();

  // Internal state
  mode = signal<PickerMode>('palette');
  colorFormat = signal<'oklch' | 'hex'>('oklch');

  // Current color (local copy for editing)
  currentColor = computed(() => this.color());

  // Computed values
  hexValue = computed(() => oklchToHex(this.currentColor()));
  oklchString = computed(() => oklchToString(this.currentColor()));

  // Pre-defined palette (like DaisyUI)
  paletteRows = this.generatePalette();

  private generatePalette(): { hue: number; colors: OklchColor[] }[] {
    const rows: { hue: number; colors: OklchColor[] }[] = [];

    // Grayscale row
    rows.push({
      hue: 0,
      colors: [
        { l: 98, c: 0, h: 0 },
        { l: 90, c: 0, h: 0 },
        { l: 80, c: 0, h: 0 },
        { l: 70, c: 0, h: 0 },
        { l: 60, c: 0, h: 0 },
        { l: 50, c: 0, h: 0 },
        { l: 40, c: 0, h: 0 },
        { l: 30, c: 0, h: 0 },
        { l: 20, c: 0, h: 0 },
        { l: 10, c: 0, h: 0 },
        { l: 5, c: 0, h: 0 },
      ],
    });

    // Color hues (every 30 degrees)
    const hues = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
    const chromas = [0.05, 0.1, 0.15, 0.2, 0.25];
    const lightnesses = [85, 75, 65, 55, 45, 35, 25];

    for (const hue of hues) {
      const colors: OklchColor[] = [];

      // Light tints
      colors.push({ l: 95, c: 0.02, h: hue });
      colors.push({ l: 90, c: 0.05, h: hue });

      // Main colors with varying lightness and chroma
      for (const l of lightnesses) {
        const c = l > 60 ? 0.15 : l > 40 ? 0.22 : 0.18;
        colors.push({ l, c, h: hue });
      }

      // Dark shade
      colors.push({ l: 15, c: 0.08, h: hue });
      colors.push({ l: 8, c: 0.04, h: hue });

      rows.push({ hue, colors });
    }

    return rows;
  }

  getSwatchLabel(
    row: { hue: number; colors: OklchColor[] },
    color: OklchColor,
  ): string {
    // Add labels for semantic colors
    const index = row.colors.indexOf(color);
    if (row.hue === 0) return ''; // Grayscale

    // Only label key positions
    if (index === 0) return 'L';
    if (index === 4) return '';
    if (index === row.colors.length - 1) return 'D';
    return '';
  }

  isSelected(color: OklchColor): boolean {
    const current = this.currentColor();
    return (
      Math.abs(current.l - color.l) < 2 &&
      Math.abs(current.c - color.c) < 0.02 &&
      Math.abs(current.h - color.h) < 5
    );
  }

  selectColor(color: OklchColor): void {
    this.colorChange.emit({ ...color });
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

  async copyValue(): Promise<void> {
    const value =
      this.colorFormat() === 'oklch' ? this.oklchString() : this.hexValue();
    await navigator.clipboard.writeText(value);
  }
}
