import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Info Row — a labelled row designed to live inside `<ax-section-card>`
 * with `[flush]="true"`. Used for settings / profile / billing-style
 * "label on the left, content in the middle, actions on the right".
 *
 * Anatomy:
 *
 *   ┌─────────────────┬──────────────────────┬──────────┐
 *   │  Label          │  <ng-content>        │ [actions]│
 *   │  Optional desc  │                      │          │
 *   └─────────────────┴──────────────────────┴──────────┘
 *
 * Siblings auto-divide via a `border-top` on each row except the
 * first one, so you can stack as many rows as you need without
 * manually adding dividers.
 *
 * Usage:
 *
 *   <ax-section-card title="Payment method" [flush]="true">
 *     <ax-info-row label="Card" description="Primary card on file">
 *       <div class="flex items-center gap-3">
 *         <img src="/visa.svg" alt="Visa" />
 *         <div>
 *           <div class="font-medium">Visa ending 1234</div>
 *           <div class="text-sm text-secondary">Expiry 06/2028</div>
 *         </div>
 *       </div>
 *       <button actions mat-stroked-button>Edit</button>
 *     </ax-info-row>
 *
 *     <ax-info-row label="Billing email">
 *       billing@example.com
 *       <button actions mat-icon-button aria-label="Edit email">
 *         <mat-icon>edit</mat-icon>
 *       </button>
 *     </ax-info-row>
 *   </ax-section-card>
 */
@Component({
  selector: 'ax-info-row',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ax-info-row">
      <div class="ax-info-row__label">
        @if (label) {
          <div class="ax-info-row__label-text">{{ label }}</div>
        }
        @if (description) {
          <div class="ax-info-row__label-desc">{{ description }}</div>
        }
      </div>

      <div class="ax-info-row__content">
        <ng-content></ng-content>
      </div>

      <div class="ax-info-row__actions">
        <ng-content select="[actions]"></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        border-top: 1px solid var(--ax-border-default, #e4e4e7);
      }

      /* First row inside a section-card has no top border (header
         already provides the divider). Uses :first-child rather than
         :first-of-type so it stays correct even when non-info-row
         elements are inserted before the first row. */
      :host:first-child {
        border-top: none;
      }

      .ax-info-row {
        display: grid;
        grid-template-columns: minmax(0, 240px) minmax(0, 1fr) auto;
        gap: 24px;
        padding: 20px 24px;
        align-items: flex-start;
      }

      .ax-info-row__label {
        min-width: 0;
      }

      .ax-info-row__label-text {
        font-size: 14px;
        font-weight: 500;
        line-height: 1.5;
        color: var(--ax-text-default, #3f3f46);
      }

      .ax-info-row__label-desc {
        font-size: 13px;
        line-height: 1.5;
        color: var(--ax-text-secondary, #71717a);
        margin-top: 2px;
      }

      .ax-info-row__content {
        min-width: 0;
        font-size: 14px;
        line-height: 1.5;
        color: var(--ax-text-default, #3f3f46);
      }

      .ax-info-row__actions {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .ax-info-row__actions:not(:has(*)) {
        display: none;
      }

      /* Mobile: stack label above content; actions drop to the
         content column right edge. */
      @media (max-width: 720px) {
        .ax-info-row {
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 12px 16px;
          padding: 16px 20px;
        }

        .ax-info-row__label {
          grid-column: 1 / -1;
        }
      }
    `,
  ],
})
export class AxInfoRowComponent {
  /** Left-column label text. */
  @Input() label = '';

  /** Optional secondary description shown under the label. */
  @Input() description = '';
}
