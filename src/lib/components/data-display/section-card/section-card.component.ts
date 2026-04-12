import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Section Card — Untitled UI-inspired "big card" for settings / profile
 * / billing-style pages.
 *
 * Anatomy:
 *
 *   ┌────────────────────────────────────────────────┐
 *   │  Title                          [header-actions]│   ← header
 *   │  Optional description                           │
 *   ├────────────────────────────────────────────────┤
 *   │  <ng-content>                                   │   ← body
 *   │  (padded by default; set [flush] when using    │
 *   │   ax-info-row so rows extend to the edges)     │
 *   ├────────────────────────────────────────────────┤
 *   │                        [Cancel]    [Save]      │   ← footer
 *   └────────────────────────────────────────────────┘
 *
 * Usage (form-style, padded body — default):
 *
 *   <ax-section-card title="Profile" description="Update your details">
 *     <form>...</form>
 *     <div footer>
 *       <button mat-stroked-button>Cancel</button>
 *       <button mat-flat-button color="primary">Save</button>
 *     </div>
 *   </ax-section-card>
 *
 * Usage (row-stack style, flush body with ax-info-row children):
 *
 *   <ax-section-card title="Payment method" [flush]="true">
 *     <button header-actions mat-stroked-button>+ Add card</button>
 *     <ax-info-row label="Card">...</ax-info-row>
 *     <ax-info-row label="Billing email">...</ax-info-row>
 *   </ax-section-card>
 */
@Component({
  selector: 'ax-section-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="ax-section-card" [class.ax-section-card--flush]="flush">
      @if (title || description) {
        <header class="ax-section-card__header">
          <div class="ax-section-card__header-text">
            @if (title) {
              <h3 class="ax-section-card__title">{{ title }}</h3>
            }
            @if (description) {
              <p class="ax-section-card__description">{{ description }}</p>
            }
          </div>
          <div class="ax-section-card__header-actions">
            <ng-content select="[header-actions]"></ng-content>
          </div>
        </header>
      }

      <div class="ax-section-card__body">
        <ng-content></ng-content>
      </div>

      <div class="ax-section-card__footer">
        <ng-content select="[footer]"></ng-content>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .ax-section-card {
        display: flex;
        flex-direction: column;
        background: var(--ax-background-default, #ffffff);
        border: 1px solid var(--ax-border-default, #e4e4e7);
        border-radius: 12px;
        box-shadow: var(--ax-shadow-xs, 0 1px 2px rgba(16, 24, 40, 0.05));
        overflow: hidden;
      }

      /* Header ------------------------------------------------------- */
      .ax-section-card__header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        padding: 20px 24px;
        border-bottom: 1px solid var(--ax-border-default, #e4e4e7);
      }

      .ax-section-card__header-text {
        flex: 1 1 auto;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .ax-section-card__title {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        line-height: 1.5;
        color: var(--ax-text-heading, #09090b);
      }

      .ax-section-card__description {
        margin: 0;
        font-size: 14px;
        line-height: 1.5;
        color: var(--ax-text-secondary, #71717a);
      }

      .ax-section-card__header-actions {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .ax-section-card__header-actions:empty {
        display: none;
      }

      /* Body --------------------------------------------------------- */
      .ax-section-card__body {
        padding: 24px;
      }

      .ax-section-card--flush .ax-section-card__body {
        padding: 0;
      }

      /* Footer ------------------------------------------------------- */
      .ax-section-card__footer {
        padding: 16px 24px;
        background: var(--ax-background-muted, #fafafa);
        border-top: 1px solid var(--ax-border-default, #e4e4e7);
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 12px;
      }

      .ax-section-card__footer:empty {
        display: none;
      }

      /* Mobile ------------------------------------------------------- */
      @media (max-width: 720px) {
        .ax-section-card__header,
        .ax-section-card__body,
        .ax-section-card__footer {
          padding-left: 20px;
          padding-right: 20px;
        }

        .ax-section-card--flush .ax-section-card__body {
          padding: 0;
        }

        .ax-section-card__header {
          flex-direction: column;
          align-items: stretch;
        }
      }
    `,
  ],
})
export class AxSectionCardComponent {
  /** Card title (rendered as h3). Hidden when empty. */
  @Input() title = '';

  /** Optional secondary description under the title. */
  @Input() description = '';

  /**
   * Remove body padding. Set to `true` when the body contains
   * `<ax-info-row>` children so the rows extend to the card edges.
   */
  @Input() flush = false;
}
