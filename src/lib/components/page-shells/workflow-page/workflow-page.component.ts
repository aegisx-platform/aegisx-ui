import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type AxWorkflowOrientation = 'horizontal' | 'vertical';

/**
 * AxWorkflowPage — Multi-step workflow page shell (L4 archetype).
 *
 * Used by multi-step workflows: PR creation, PO creation, receipt +
 * inspection, disposal request, stock count, setup wizard, migration
 * wizard. Composes:
 * - Optional breadcrumb + header (title + subtitle + "Save draft" /
 *   "Cancel" actions)
 * - Step indicator slot (horizontal or vertical) — consumer provides
 *   either mat-stepper, a custom indicator, or the AegisX progress
 *   stepper component
 * - Main content area (default slot) — the current step's form
 * - Sticky footer (back / next / submit buttons)
 *
 * Orientation:
 * - `horizontal` (default) — step indicator sits above the content,
 *   content takes full width
 * - `vertical` — step indicator sits on the left (240px fixed),
 *   content takes the rest, good for 5+ steps or review-heavy flows
 *
 * Projection contracts:
 *   [ax-workflow-breadcrumb] — above the header
 *   [ax-workflow-actions]    — top-right header actions
 *   [ax-workflow-stepper]    — step indicator (horizontal or vertical)
 *   (default)                — current step's content
 *   [ax-workflow-footer]     — sticky footer actions (Back / Next)
 */
@Component({
  selector: 'ax-workflow-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="ax-workflow-page"
      [class.ax-workflow-page--vertical]="orientation() === 'vertical'"
    >
      <ng-content select="[ax-workflow-breadcrumb]"></ng-content>

      <header class="ax-workflow-page__header">
        <div class="ax-workflow-page__header-text">
          @if (title()) {
            <h1 class="ax-workflow-page__title">{{ title() }}</h1>
          }
          @if (subtitle()) {
            <p class="ax-workflow-page__subtitle">{{ subtitle() }}</p>
          }
        </div>
        <div class="ax-workflow-page__header-actions">
          <ng-content select="[ax-workflow-actions]"></ng-content>
        </div>
      </header>

      <div class="ax-workflow-page__body">
        <nav class="ax-workflow-page__stepper" aria-label="Workflow steps">
          <ng-content select="[ax-workflow-stepper]"></ng-content>
        </nav>

        <section class="ax-workflow-page__content">
          <ng-content></ng-content>
        </section>
      </div>

      <footer class="ax-workflow-page__footer">
        <ng-content select="[ax-workflow-footer]"></ng-content>
      </footer>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .ax-workflow-page {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 24px;
        max-width: 1600px;
        margin: 0 auto;
        min-height: 100%;
      }

      /* Header ------------------------------------------------------- */
      .ax-workflow-page__header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
      }

      .ax-workflow-page__header-text {
        flex: 1 1 auto;
        min-width: 0;
      }

      .ax-workflow-page__title {
        font-size: 22px;
        font-weight: 800;
        color: var(--ax-text-heading, #09090b);
        margin: 0;
        letter-spacing: -0.02em;
        line-height: 1.3;
      }

      .ax-workflow-page__subtitle {
        font-size: 13px;
        color: var(--ax-text-secondary, #71717a);
        margin: 4px 0 0;
        line-height: 1.4;
      }

      .ax-workflow-page__header-actions {
        display: flex;
        gap: 8px;
        flex-shrink: 0;
        align-items: center;
      }

      .ax-workflow-page__header-actions:not(:has(*)) {
        display: none;
      }

      /* Body --------------------------------------------------------- */
      .ax-workflow-page__body {
        display: grid;
        grid-template-columns: 1fr;
        gap: 20px;
      }

      /* Horizontal: stepper is a row above the content */
      .ax-workflow-page:not(.ax-workflow-page--vertical)
        .ax-workflow-page__stepper:not(:has(*)) {
        display: none;
      }

      .ax-workflow-page:not(.ax-workflow-page--vertical)
        .ax-workflow-page__body {
        grid-template-columns: 1fr;
      }

      /* Vertical: stepper on the left, content on the right */
      .ax-workflow-page--vertical .ax-workflow-page__body {
        grid-template-columns: 260px minmax(0, 1fr);
      }

      .ax-workflow-page__stepper {
        min-width: 0;
      }

      .ax-workflow-page--vertical .ax-workflow-page__stepper {
        background: var(--ax-background-default, #ffffff);
        border: 1px solid var(--ax-border-default, #e4e4e7);
        border-radius: 12px;
        padding: 16px;
        align-self: start;
        position: sticky;
        top: 16px;
      }

      .ax-workflow-page__content {
        min-width: 0;
        background: var(--ax-background-default, #ffffff);
        border: 1px solid var(--ax-border-default, #e4e4e7);
        border-radius: 12px;
        padding: 24px;
        box-shadow: var(--ax-shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
      }

      /* Sticky footer ------------------------------------------------- */
      .ax-workflow-page__footer {
        position: sticky;
        bottom: 0;
        margin-top: auto; /* push to bottom in short pages */
        padding: 16px 20px;
        background: var(--ax-background-default, #ffffff);
        border: 1px solid var(--ax-border-default, #e4e4e7);
        border-radius: 12px;
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        z-index: 10;
        box-shadow: var(--ax-shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
      }

      .ax-workflow-page__footer:not(:has(*)) {
        display: none;
      }

      @media (max-width: 900px) {
        .ax-workflow-page--vertical .ax-workflow-page__body {
          grid-template-columns: 1fr;
        }
        .ax-workflow-page--vertical .ax-workflow-page__stepper {
          position: static;
        }
      }

      @media (max-width: 768px) {
        .ax-workflow-page {
          padding: 16px;
          gap: 16px;
        }

        .ax-workflow-page__header {
          flex-direction: column;
          align-items: stretch;
        }

        .ax-workflow-page__title {
          font-size: 20px;
        }

        .ax-workflow-page__content {
          padding: 16px;
        }

        .ax-workflow-page__footer {
          padding: 12px 16px;
        }
      }
    `,
  ],
})
export class AxWorkflowPageComponent {
  readonly title = input<string>('');
  readonly subtitle = input<string>('');
  readonly orientation = input<AxWorkflowOrientation>('horizontal');
}
