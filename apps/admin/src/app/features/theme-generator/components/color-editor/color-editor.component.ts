import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeGeneratorService } from '../../services/theme-generator.service';
import {
  ThemeColorSlots,
  OklchColor,
} from '../../models/theme-generator.types';
import { oklchToHex } from '../../utils/oklch.utils';

@Component({
  selector: 'app-color-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="color-editor">
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
            <circle cx="13.5" cy="6.5" r="0.5" />
            <circle cx="17.5" cy="10.5" r="0.5" />
            <circle cx="8.5" cy="7.5" r="0.5" />
            <circle cx="6.5" cy="12.5" r="0.5" />
            <path
              d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"
            />
          </svg>
        </div>
        <span class="header-title">Change Colors</span>
        <div class="header-line"></div>
      </div>

      <!-- Base Colors -->
      <div class="color-row">
        <div class="color-swatches">
          @for (slot of baseSlots; track slot.key) {
            <button
              type="button"
              class="color-swatch"
              [style.background-color]="getHex(slot.key)"
              [class.selected]="selectedSlot === slot.key"
              (click)="selectSlot(slot.key)"
            >
              <span
                class="swatch-label"
                [style.color]="getLabelColor(slot.key)"
                >{{ slot.label }}</span
              >
            </button>
          }
        </div>
        <span class="row-label">base</span>
      </div>

      <!-- Primary & Secondary -->
      <div class="color-row">
        <div class="color-pair">
          @for (slot of primarySlots; track slot.key) {
            <button
              type="button"
              class="color-swatch"
              [style.background-color]="getHex(slot.key)"
              [class.selected]="selectedSlot === slot.key"
              (click)="selectSlot(slot.key)"
            >
              <span
                class="swatch-label"
                [style.color]="getLabelColor(slot.key)"
                >{{ slot.label }}</span
              >
            </button>
          }
        </div>
        <div class="color-pair">
          @for (slot of secondarySlots; track slot.key) {
            <button
              type="button"
              class="color-swatch"
              [style.background-color]="getHex(slot.key)"
              [class.selected]="selectedSlot === slot.key"
              (click)="selectSlot(slot.key)"
            >
              <span
                class="swatch-label"
                [style.color]="getLabelColor(slot.key)"
                >{{ slot.label }}</span
              >
            </button>
          }
        </div>
      </div>
      <div class="color-row-labels">
        <span>primary</span>
        <span>secondary</span>
      </div>

      <!-- Accent & Neutral -->
      <div class="color-row">
        <div class="color-pair">
          @for (slot of accentSlots; track slot.key) {
            <button
              type="button"
              class="color-swatch"
              [style.background-color]="getHex(slot.key)"
              [class.selected]="selectedSlot === slot.key"
              (click)="selectSlot(slot.key)"
            >
              <span
                class="swatch-label"
                [style.color]="getLabelColor(slot.key)"
                >{{ slot.label }}</span
              >
            </button>
          }
        </div>
        <div class="color-pair">
          @for (slot of neutralSlots; track slot.key) {
            <button
              type="button"
              class="color-swatch"
              [style.background-color]="getHex(slot.key)"
              [class.selected]="selectedSlot === slot.key"
              (click)="selectSlot(slot.key)"
            >
              <span
                class="swatch-label"
                [style.color]="getLabelColor(slot.key)"
                >{{ slot.label }}</span
              >
            </button>
          }
        </div>
      </div>
      <div class="color-row-labels">
        <span>accent</span>
        <span>neutral</span>
      </div>

      <!-- Info & Success -->
      <div class="color-row">
        <div class="color-pair">
          @for (slot of infoSlots; track slot.key) {
            <button
              type="button"
              class="color-swatch"
              [style.background-color]="getHex(slot.key)"
              [class.selected]="selectedSlot === slot.key"
              (click)="selectSlot(slot.key)"
            >
              <span
                class="swatch-label"
                [style.color]="getLabelColor(slot.key)"
                >{{ slot.label }}</span
              >
            </button>
          }
        </div>
        <div class="color-pair">
          @for (slot of successSlots; track slot.key) {
            <button
              type="button"
              class="color-swatch"
              [style.background-color]="getHex(slot.key)"
              [class.selected]="selectedSlot === slot.key"
              (click)="selectSlot(slot.key)"
            >
              <span
                class="swatch-label"
                [style.color]="getLabelColor(slot.key)"
                >{{ slot.label }}</span
              >
            </button>
          }
        </div>
      </div>
      <div class="color-row-labels">
        <span>info</span>
        <span>success</span>
      </div>

      <!-- Warning & Error -->
      <div class="color-row">
        <div class="color-pair">
          @for (slot of warningSlots; track slot.key) {
            <button
              type="button"
              class="color-swatch"
              [style.background-color]="getHex(slot.key)"
              [class.selected]="selectedSlot === slot.key"
              (click)="selectSlot(slot.key)"
            >
              <span
                class="swatch-label"
                [style.color]="getLabelColor(slot.key)"
                >{{ slot.label }}</span
              >
            </button>
          }
        </div>
        <div class="color-pair">
          @for (slot of errorSlots; track slot.key) {
            <button
              type="button"
              class="color-swatch"
              [style.background-color]="getHex(slot.key)"
              [class.selected]="selectedSlot === slot.key"
              (click)="selectSlot(slot.key)"
            >
              <span
                class="swatch-label"
                [style.color]="getLabelColor(slot.key)"
                >{{ slot.label }}</span
              >
            </button>
          }
        </div>
      </div>
      <div class="color-row-labels">
        <span>warning</span>
        <span>error</span>
      </div>
    </div>
  `,
  styles: [
    `
      .color-editor {
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

      .color-row {
        display: flex;
        gap: 1rem;
        margin-bottom: 0.5rem;
      }

      .color-swatches {
        display: flex;
        gap: 0.5rem;
      }

      .color-pair {
        display: flex;
        gap: 0.5rem;
      }

      .color-swatch {
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

      .color-swatch:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .color-swatch.selected {
        border-color: var(--ax-primary, #6366f1);
        box-shadow: 0 0 0 3px
          color-mix(in oklch, var(--ax-primary, #6366f1) 30%, transparent);
      }

      .swatch-label {
        font-size: 0.875rem;
        font-weight: 600;
      }

      .row-label {
        font-size: 0.8125rem;
        color: var(--ax-text-muted, #666);
        align-self: center;
        margin-left: 0.5rem;
      }

      .color-row-labels {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        padding-left: 0.25rem;
      }

      .color-row-labels span {
        width: calc(3.5rem * 2 + 0.5rem);
        font-size: 0.8125rem;
        color: var(--ax-text-muted, #666);
      }
    `,
  ],
})
export class ColorEditorComponent {
  private themeService = inject(ThemeGeneratorService);

  slotSelected = output<keyof ThemeColorSlots>();

  selectedSlot: keyof ThemeColorSlots | null = null;

  // Base colors (100, 200, 300, content)
  baseSlots = [
    { key: 'base-100' as keyof ThemeColorSlots, label: '100' },
    { key: 'base-200' as keyof ThemeColorSlots, label: '200' },
    { key: 'base-300' as keyof ThemeColorSlots, label: '300' },
    { key: 'base-content' as keyof ThemeColorSlots, label: 'A' },
  ];

  // Color pairs
  primarySlots = [
    { key: 'primary' as keyof ThemeColorSlots, label: '' },
    { key: 'primary-content' as keyof ThemeColorSlots, label: 'A' },
  ];

  secondarySlots = [
    { key: 'secondary' as keyof ThemeColorSlots, label: '' },
    { key: 'secondary-content' as keyof ThemeColorSlots, label: 'A' },
  ];

  accentSlots = [
    { key: 'accent' as keyof ThemeColorSlots, label: '' },
    { key: 'accent-content' as keyof ThemeColorSlots, label: 'A' },
  ];

  neutralSlots = [
    { key: 'neutral' as keyof ThemeColorSlots, label: '' },
    { key: 'neutral-content' as keyof ThemeColorSlots, label: 'A' },
  ];

  infoSlots = [
    { key: 'info' as keyof ThemeColorSlots, label: '' },
    { key: 'info-content' as keyof ThemeColorSlots, label: 'A' },
  ];

  successSlots = [
    { key: 'success' as keyof ThemeColorSlots, label: '' },
    { key: 'success-content' as keyof ThemeColorSlots, label: 'A' },
  ];

  warningSlots = [
    { key: 'warning' as keyof ThemeColorSlots, label: '' },
    { key: 'warning-content' as keyof ThemeColorSlots, label: 'A' },
  ];

  errorSlots = [
    { key: 'error' as keyof ThemeColorSlots, label: '' },
    { key: 'error-content' as keyof ThemeColorSlots, label: 'A' },
  ];

  getHex(slot: keyof ThemeColorSlots): string {
    return oklchToHex(this.themeService.colors()[slot]);
  }

  getLabelColor(slot: keyof ThemeColorSlots): string {
    const color = this.themeService.colors()[slot];
    return color.l > 60 ? '#000000' : '#ffffff';
  }

  selectSlot(slot: keyof ThemeColorSlots): void {
    this.selectedSlot = slot;
    this.slotSelected.emit(slot);
  }
}
