import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AxPageShellComponent } from '../../layout/page-shell/page-shell.component';
import { AxPageHeaderComponent } from '../../layout/page-header/page-header.component';
import { BreadcrumbItem } from '../../navigation/breadcrumb/breadcrumb.types';

/**
 * AxFormPage — Flat form page shell (L5 archetype).
 *
 * Used by settings / configuration forms without multi-step workflow:
 * hospital settings, HIS settings, role management, import-daily,
 * simple create/edit pages. Composes:
 * - `<ax-page-shell>` as the base wrapper (min-h-screen + max-width +
 *   consistent gap + breadcrumb)
 * - `<ax-page-header>` for title + subtitle + action buttons
 * - Main content area for a stack of AxFormSection elements
 * - Sticky footer (Cancel / Save buttons)
 *
 * Use L4 (ax-workflow-page) when the form has multiple steps,
 * L5 when it's a flat form — even long ones.
 *
 * Projection contracts:
 *   [ax-form-actions]    — top-right header actions
 *   (default)            — form sections (use <ax-form-section>)
 *   [ax-form-footer]     — sticky footer actions (Cancel / Save)
 */
@Component({
  selector: 'ax-form-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AxPageShellComponent, AxPageHeaderComponent],
  template: `
    <ax-page-shell [breadcrumb]="breadcrumb()">
      <div header>
        @if (title()) {
          <ax-page-header [title]="title()" [subtitle]="subtitle()">
            <ng-content select="[ax-form-actions]"></ng-content>
          </ax-page-header>
        }
      </div>

      <section class="ax-form-page__content">
        <ng-content></ng-content>
      </section>

      <footer class="ax-form-page__footer">
        <ng-content select="[ax-form-footer]"></ng-content>
      </footer>
    </ax-page-shell>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .ax-form-page__content {
        background: var(--ax-background-default, #ffffff);
        border: 1px solid var(--ax-border-default, #e4e4e7);
        border-radius: 12px;
        padding: 24px 28px;
      }

      .ax-form-page__footer {
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

      .ax-form-page__footer:not(:has(*)) {
        display: none;
      }

      @media (max-width: 768px) {
        .ax-form-page__content {
          padding: 16px;
        }

        .ax-form-page__footer {
          padding: 12px 16px;
        }
      }
    `,
  ],
})
export class AxFormPageComponent {
  /** Breadcrumb items — first item should be home icon only. */
  readonly breadcrumb = input<BreadcrumbItem[]>([]);

  readonly title = input<string>('');
  readonly subtitle = input<string>('');
}
