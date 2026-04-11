import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * Section Label Component
 *
 * Uppercase section heading for visually separating content areas.
 *
 * @example
 * <ax-section-label>Phase Progress</ax-section-label>
 * <ax-section-label>Recent Batches</ax-section-label>
 */
@Component({
  selector: 'ax-section-label',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="ax-section-label"><ng-content></ng-content></div>`,
  styles: [
    `
      :host {
        display: block;
      }
      .ax-section-label {
        font-size: var(--ax-text-xs, 0.75rem);
        font-weight: 700;
        color: var(--ax-text-subtle, #94a3b8);
        letter-spacing: 0.08em;
        text-transform: uppercase;
        padding: 16px 0 6px;
      }
      :host(:first-child) .ax-section-label {
        padding-top: 0;
      }
    `,
  ],
})
export class AxSectionLabelComponent {}
