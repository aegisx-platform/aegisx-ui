import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

/**
 * Page Header Component
 *
 * Standard page header with title, subtitle, and action buttons slot.
 * Used on every page across all 6 layout patterns (L1-L6).
 *
 * @example
 * <ax-page-header title="Drug Master" subtitle="จัดการข้อมูลยา">
 *   <button mat-flat-button color="primary">+ สร้างใหม่</button>
 * </ax-page-header>
 *
 * @example
 * // Use headingLevel to control semantic heading level
 * <ax-page-header title="Sub Section" [headingLevel]="2"></ax-page-header>
 */
@Component({
  selector: 'ax-page-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ax-page-header">
      <div class="ax-page-header-text">
        @if (title) {
          <div
            class="ax-page-header-title"
            [attr.role]="'heading'"
            [attr.aria-level]="headingLevel"
          >
            {{ title }}
          </div>
        }
        @if (subtitle) {
          <p class="ax-page-header-subtitle">{{ subtitle }}</p>
        }
      </div>
      <div class="ax-page-header-actions">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .ax-page-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 20px;
      }
      .ax-page-header-title {
        font-size: 22px;
        font-weight: 800;
        color: var(--ax-text-heading, #0f172a);
        margin: 0;
        letter-spacing: -0.02em;
        line-height: 1.3;
      }
      .ax-page-header-subtitle {
        font-size: 13px;
        color: var(--ax-text-secondary, #64748b);
        margin: 2px 0 0;
        line-height: 1.4;
      }
      .ax-page-header-actions {
        display: flex;
        gap: 8px;
        flex-shrink: 0;
      }
    `,
  ],
})
export class AxPageHeaderComponent {
  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;
  /** Semantic heading level (1-6). Defaults to 1. Adjust to avoid multiple h1 per page. */
  @Input() headingLevel: 1 | 2 | 3 | 4 | 5 | 6 = 1;
}
