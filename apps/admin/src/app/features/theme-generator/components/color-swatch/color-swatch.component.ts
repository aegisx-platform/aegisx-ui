import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OklchColor } from '../../models/theme-generator.types';
import { oklchToHex, oklchToString } from '../../utils/oklch.utils';

@Component({
  selector: 'app-color-swatch',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      class="color-swatch"
      [class.selected]="selected()"
      [class.small]="size() === 'small'"
      [class.large]="size() === 'large'"
      [style.background-color]="hexColor()"
      [attr.title]="tooltip()"
      (click)="onClick.emit()"
    >
      @if (label()) {
        <span class="swatch-label" [style.color]="labelColor()">
          {{ label() }}
        </span>
      }
      @if (selected()) {
        <span class="checkmark" [style.color]="labelColor()">✓</span>
      }
    </button>
  `,
  styles: [
    `
      .color-swatch {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 0.5rem;
        border: 2px solid transparent;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s ease;
        position: relative;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }

      .color-swatch:hover {
        transform: scale(1.1);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }

      .color-swatch.selected {
        border-color: var(--ax-primary, #6366f1);
        box-shadow: 0 0 0 2px var(--ax-primary, #6366f1);
      }

      .color-swatch.small {
        width: 1.75rem;
        height: 1.75rem;
        border-radius: 0.375rem;
      }

      .color-swatch.large {
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 0.75rem;
      }

      .swatch-label {
        font-size: 0.625rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .color-swatch.large .swatch-label {
        font-size: 0.75rem;
      }

      .checkmark {
        position: absolute;
        font-size: 0.875rem;
        font-weight: bold;
      }
    `,
  ],
})
export class ColorSwatchComponent {
  // Inputs
  color = input.required<OklchColor>();
  selected = input(false);
  label = input<string>('');
  size = input<'small' | 'medium' | 'large'>('medium');

  // Outputs
  onClick = output<void>();

  // Computed
  hexColor = computed(() => oklchToHex(this.color()));

  labelColor = computed(() => {
    // Use light text on dark backgrounds, dark text on light backgrounds
    return this.color().l > 60 ? '#000000' : '#ffffff';
  });

  tooltip = computed(() => {
    const color = this.color();
    return `${oklchToString(color)}\n${this.hexColor()}`;
  });
}
