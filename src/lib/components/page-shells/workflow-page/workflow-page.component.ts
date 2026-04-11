import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AxPageShellComponent } from '../../layout/page-shell/page-shell.component';
import { AxPageHeaderComponent } from '../../layout/page-header/page-header.component';
import { BreadcrumbItem } from '../../navigation/breadcrumb/breadcrumb.types';

export type AxWorkflowOrientation = 'horizontal' | 'vertical';

/**
 * AxWorkflowPage — Multi-step workflow page shell (L4 archetype).
 *
 * Used by multi-step workflows: PR creation, PO creation, receipt +
 * inspection, disposal request, stock count, setup wizard, migration
 * wizard. Composes:
 * - `<ax-page-shell>` as the base wrapper (min-h-screen + max-width +
 *   consistent gap + breadcrumb)
 * - `<ax-page-header>` for title + subtitle + actions ("Save draft" /
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
 * - `vertical` — step indicator sits on the left (260px fixed),
 *   content takes the rest, good for 5+ steps or review-heavy flows
 *
 * Projection contracts:
 *   [ax-workflow-actions]    — top-right header actions
 *   [ax-workflow-stepper]    — step indicator (horizontal or vertical)
 *   (default)                — current step's content
 *   [ax-workflow-footer]     — sticky footer actions (Back / Next)
 */
@Component({
  selector: 'ax-workflow-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AxPageShellComponent, AxPageHeaderComponent],
  template: `
    <ax-page-shell [breadcrumb]="breadcrumb()">
      <div header>
        @if (title()) {
          <ax-page-header [title]="title()" [subtitle]="subtitle()">
            <ng-content select="[ax-workflow-actions]"></ng-content>
          </ax-page-header>
        }
      </div>

      <div
        class="ax-workflow-page__body"
        [class.ax-workflow-page__body--vertical]="
          orientation() === 'vertical'
        "
      >
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
    </ax-page-shell>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      /* Body --------------------------------------------------------- */
      .ax-workflow-page__body {
        display: grid;
        grid-template-columns: 1fr;
        gap: 20px;
      }

      /* Horizontal: stepper is a row above the content */
      .ax-workflow-page__body:not(.ax-workflow-page__body--vertical)
        .ax-workflow-page__stepper:not(:has(*)) {
        display: none;
      }

      /* Vertical: stepper on the left, content on the right */
      .ax-workflow-page__body--vertical {
        grid-template-columns: 260px minmax(0, 1fr);
      }

      .ax-workflow-page__stepper {
        min-width: 0;
      }

      .ax-workflow-page__body--vertical .ax-workflow-page__stepper {
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
      }

      /* Sticky footer ------------------------------------------------- */
      .ax-workflow-page__footer {
        position: sticky;
        bottom: 0;
        margin-top: auto;
        padding: 16px 20px;
        background: var(--ax-background-default, #ffffff);
        border: 1px solid var(--ax-border-default, #e4e4e7);
        border-radius: 12px;
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        z-index: 10;
      }

      .ax-workflow-page__footer:not(:has(*)) {
        display: none;
      }

      @media (max-width: 900px) {
        .ax-workflow-page__body--vertical {
          grid-template-columns: 1fr;
        }
        .ax-workflow-page__body--vertical .ax-workflow-page__stepper {
          position: static;
        }
      }

      @media (max-width: 768px) {
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
  /** Breadcrumb items — first item should be home icon only. */
  readonly breadcrumb = input<BreadcrumbItem[]>([]);

  readonly title = input<string>('');
  readonly subtitle = input<string>('');
  readonly orientation = input<AxWorkflowOrientation>('horizontal');
}
