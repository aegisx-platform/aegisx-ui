import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeGeneratorService } from '../../services/theme-generator.service';
import { ColorEditorComponent } from '../../components/color-editor/color-editor.component';
import { InlineColorPickerComponent } from '../../components/inline-color-picker/inline-color-picker.component';
import { RadiusEditorComponent } from '../../components/radius-editor/radius-editor.component';
import { EffectsEditorComponent } from '../../components/effects-editor/effects-editor.component';
import { SizesEditorComponent } from '../../components/sizes-editor/sizes-editor.component';
import { ContrastCheckerComponent } from '../../components/contrast-checker/contrast-checker.component';
import { SplitPreviewComponent } from '../../components/split-preview/split-preview.component';
import { CssOutputComponent } from '../../components/css-output/css-output.component';
import {
  ThemeColorSlots,
  OklchColor,
} from '../../models/theme-generator.types';

@Component({
  selector: 'app-theme-generator-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ColorEditorComponent,
    InlineColorPickerComponent,
    RadiusEditorComponent,
    EffectsEditorComponent,
    SizesEditorComponent,
    ContrastCheckerComponent,
    SplitPreviewComponent,
    CssOutputComponent,
  ],
  template: `
    <div class="theme-generator-page">
      <!-- Left Sidebar -->
      <aside class="sidebar">
        <!-- Theme Header -->
        <div class="sidebar-header">
          <div class="theme-name-section">
            <span class="name-label">Name</span>
            <input
              type="text"
              [ngModel]="themeService.currentTheme().displayName"
              (ngModelChange)="themeService.setThemeName($event)"
              class="name-input"
            />
            <button type="button" class="edit-btn" title="Edit name">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              </svg>
            </button>
          </div>

          <div class="action-buttons">
            <button
              type="button"
              class="action-btn"
              (click)="themeService.randomizeColors()"
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
                <rect x="2" y="2" width="5" height="5" rx="1" />
                <rect x="9" y="2" width="5" height="5" rx="1" />
                <rect x="16" y="2" width="5" height="5" rx="1" />
                <rect x="2" y="9" width="5" height="5" rx="1" />
                <rect x="9" y="9" width="5" height="5" rx="1" />
                <rect x="16" y="9" width="5" height="5" rx="1" />
              </svg>
              Random
            </button>
            <button
              type="button"
              class="action-btn action-btn-primary"
              [class.active]="showCssOutput()"
              (click)="showCssOutput.set(!showCssOutput())"
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
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              CSS
            </button>
          </div>
        </div>

        <!-- Scrollable Content -->
        <div class="sidebar-content">
          <!-- Colors Section -->
          <div class="sidebar-section">
            <app-color-editor (slotSelected)="openColorPicker($event)" />

            <!-- Inline Color Picker (shows below color editor when slot selected) -->
            @if (selectedSlot()) {
              <div class="inline-picker-container">
                <div class="picker-header">
                  <span class="picker-title">{{
                    formatSlotName(selectedSlot()!)
                  }}</span>
                  <button
                    type="button"
                    class="close-btn"
                    (click)="closeColorPicker()"
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
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <app-inline-color-picker
                  [color]="themeService.colors()[selectedSlot()!]"
                  [label]="getSlotLabel(selectedSlot()!)"
                  [contrastColor]="getContrastColorForSlot(selectedSlot()!)"
                  (colorChange)="onColorChange($event)"
                />
              </div>
            }
          </div>

          <!-- Contrast Checker Section -->
          <div class="sidebar-section">
            <app-contrast-checker />
          </div>

          <!-- Radius Section -->
          <div class="sidebar-section">
            <app-radius-editor />
          </div>

          <!-- Effects Section -->
          <div class="sidebar-section">
            <app-effects-editor />
          </div>

          <!-- Sizes Section -->
          <div class="sidebar-section">
            <app-sizes-editor />
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="sidebar-footer">
          <button
            type="button"
            class="footer-btn footer-btn-outline"
            (click)="themeService.resetToDefault()"
          >
            Reset
          </button>
          <button
            type="button"
            class="footer-btn footer-btn-primary"
            (click)="themeService.saveTheme()"
          >
            Save Theme
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        @if (showCssOutput()) {
          <app-css-output />
        } @else {
          <app-split-preview />
        }
      </main>
    </div>
  `,
  styles: [
    `
      .theme-generator-page {
        display: flex;
        height: 100vh;
        background: var(--ax-background-muted, #f8f8f8);
      }

      /* Sidebar */
      .sidebar {
        width: 380px;
        background: var(--ax-background-default, #fff);
        border-right: 1px solid var(--ax-border-default, #e5e5e5);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .sidebar-header {
        padding: 1rem;
        border-bottom: 1px solid var(--ax-border-default, #e5e5e5);
      }

      .theme-name-section {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      .name-label {
        font-size: 0.875rem;
        color: var(--ax-text-muted, #666);
      }

      .name-input {
        flex: 1;
        border: none;
        background: transparent;
        font-size: 1rem;
        font-weight: 600;
        color: var(--ax-text-default, #333);
        padding: 0.25rem 0;
      }

      .name-input:focus {
        outline: none;
      }

      .edit-btn {
        padding: 0.375rem;
        border: none;
        background: transparent;
        color: var(--ax-text-muted, #999);
        cursor: pointer;
        border-radius: 0.25rem;
      }

      .edit-btn:hover {
        background: var(--ax-background-muted, #f5f5f5);
        color: var(--ax-text-default, #333);
      }

      .action-buttons {
        display: flex;
        gap: 0.5rem;
      }

      .action-btn {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.625rem 1rem;
        border: 1px solid var(--ax-border-default, #e5e5e5);
        border-radius: 0.5rem;
        background: var(--ax-background-default, #fff);
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--ax-text-default, #333);
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .action-btn:hover {
        background: var(--ax-background-muted, #f5f5f5);
      }

      .action-btn-primary {
        background: var(--ax-text-default, #333);
        border-color: var(--ax-text-default, #333);
        color: var(--ax-background-default, #fff);
      }

      .action-btn-primary:hover {
        opacity: 0.9;
      }

      .action-btn-primary.active {
        background: var(--ax-primary, #6366f1);
        border-color: var(--ax-primary, #6366f1);
      }

      .sidebar-content {
        flex: 1;
        overflow-y: auto;
      }

      .sidebar-section {
        border-bottom: 1px solid var(--ax-border-default, #e5e5e5);
      }

      .sidebar-section:last-child {
        border-bottom: none;
      }

      /* Inline Color Picker Container */
      .inline-picker-container {
        background: var(--ax-background-muted, #f8f8f8);
        border-top: 1px solid var(--ax-border-default, #e5e5e5);
        padding: 1rem;
        animation: slideDown 0.2s ease;
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-0.5rem);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .picker-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.75rem;
      }

      .picker-title {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--ax-text-default, #333);
      }

      .close-btn {
        padding: 0.25rem;
        border: none;
        background: transparent;
        color: var(--ax-text-muted, #999);
        cursor: pointer;
        border-radius: 0.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .close-btn:hover {
        background: var(--ax-background-default, #fff);
        color: var(--ax-text-default, #333);
      }

      .sidebar-footer {
        padding: 1rem;
        border-top: 1px solid var(--ax-border-default, #e5e5e5);
        display: flex;
        gap: 0.5rem;
      }

      .footer-btn {
        flex: 1;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .footer-btn-outline {
        background: transparent;
        border: 1px solid var(--ax-border-default, #e5e5e5);
        color: var(--ax-text-default, #333);
      }

      .footer-btn-outline:hover {
        background: var(--ax-background-muted, #f5f5f5);
      }

      .footer-btn-primary {
        background: var(--ax-primary, #6366f1);
        border: none;
        color: #fff;
      }

      .footer-btn-primary:hover {
        opacity: 0.9;
      }

      /* Main Content */
      .main-content {
        flex: 1;
        padding: 1.5rem;
        overflow-y: auto;
      }

      /* Responsive */
      @media (max-width: 1024px) {
        .theme-generator-page {
          flex-direction: column;
          height: auto;
        }

        .sidebar {
          width: 100%;
          max-height: 60vh;
        }

        .main-content {
          min-height: 40vh;
        }
      }
    `,
  ],
})
export class ThemeGeneratorPageComponent {
  themeService = inject(ThemeGeneratorService);

  selectedSlot = signal<keyof ThemeColorSlots | null>(null);
  showCssOutput = signal(false);

  openColorPicker(slot: keyof ThemeColorSlots): void {
    this.selectedSlot.set(slot);
  }

  closeColorPicker(): void {
    this.selectedSlot.set(null);
  }

  onColorChange(color: OklchColor): void {
    const slot = this.selectedSlot();
    if (slot) {
      this.themeService.setColor(slot, color);
    }
  }

  getSlotLabel(slot: keyof ThemeColorSlots): string {
    const labels: Partial<Record<keyof ThemeColorSlots, string>> = {
      primary: 'P',
      secondary: 'S',
      accent: 'A',
      neutral: 'N',
      info: 'I',
      success: 'S',
      warning: 'W',
      error: 'E',
      'base-100': 'B1',
      'base-200': 'B2',
      'base-300': 'B3',
    };
    return labels[slot] || '';
  }

  formatSlotName(slot: string): string {
    return slot.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }

  // Get contrasting color for the selected slot (for WCAG display)
  getContrastColorForSlot(slot: keyof ThemeColorSlots): OklchColor | null {
    const colors = this.themeService.colors();

    // Map main colors to their content colors
    const contentMap: Partial<
      Record<keyof ThemeColorSlots, keyof ThemeColorSlots>
    > = {
      primary: 'primary-content',
      secondary: 'secondary-content',
      accent: 'accent-content',
      neutral: 'neutral-content',
      info: 'info-content',
      success: 'success-content',
      warning: 'warning-content',
      error: 'error-content',
      'base-100': 'base-content',
      'base-200': 'base-content',
      'base-300': 'base-content',
    };

    // Map content colors back to their background colors
    const bgMap: Partial<Record<keyof ThemeColorSlots, keyof ThemeColorSlots>> =
      {
        'primary-content': 'primary',
        'secondary-content': 'secondary',
        'accent-content': 'accent',
        'neutral-content': 'neutral',
        'info-content': 'info',
        'success-content': 'success',
        'warning-content': 'warning',
        'error-content': 'error',
        'base-content': 'base-100',
      };

    // Check if this is a main color - return its content color
    if (contentMap[slot]) {
      return colors[contentMap[slot]!];
    }

    // Check if this is a content color - return its background color
    if (bgMap[slot]) {
      return colors[bgMap[slot]!];
    }

    return null;
  }
}
