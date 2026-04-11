import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { AxPageShellComponent } from '../../layout/page-shell/page-shell.component';
import { AxPageHeaderComponent } from '../../layout/page-header/page-header.component';
import { BreadcrumbItem } from '../../navigation/breadcrumb/breadcrumb.types';

/**
 * AxSplitPage — Master-detail split view page shell (L6 archetype).
 *
 * Used by split-view workflows: receipt receive + inspection, vendor
 * selection (PR + matched vendors), budget allocation items, inbox-
 * style list-then-detail flows.
 *
 * For more complex master-detail layouts with resizable splitters,
 * use the lower-level <ax-master-detail> component instead. This
 * shell provides a sensible default: page header above, fixed
 * master width on the left, detail content on the right.
 *
 * Composes:
 * - `<ax-page-shell>` as the base wrapper (min-h-screen + max-width +
 *   consistent gap + breadcrumb)
 * - `<ax-page-header>` for title + subtitle + action buttons
 * - Master (list) pane on the left, detail pane on the right
 *
 * Projection contracts:
 *   [ax-split-actions]    — top-right header actions
 *   [ax-split-list]       — left pane (list, items, vendors)
 *   [ax-split-detail]     — right pane (detail of selected item)
 */
@Component({
  selector: 'ax-split-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AxPageShellComponent, AxPageHeaderComponent],
  template: `
    <ax-page-shell [breadcrumb]="breadcrumb()">
      <div header>
        @if (title()) {
          <ax-page-header [title]="title()" [subtitle]="subtitle()">
            <ng-content select="[ax-split-actions]"></ng-content>
          </ax-page-header>
        }
      </div>

      <div
        class="ax-split-page__body"
        [style.--ax-split-list-width]="listWidthPx()"
      >
        <section class="ax-split-page__list">
          <ng-content select="[ax-split-list]"></ng-content>
        </section>
        <section class="ax-split-page__detail">
          <ng-content select="[ax-split-detail]"></ng-content>
        </section>
      </div>
    </ax-page-shell>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .ax-split-page__body {
        display: grid;
        grid-template-columns: var(--ax-split-list-width, 380px) minmax(0, 1fr);
        gap: 20px;
        flex: 1 1 auto;
        min-height: 480px;
      }

      .ax-split-page__list,
      .ax-split-page__detail {
        background: var(--ax-background-default, #ffffff);
        border: 1px solid var(--ax-border-default, #e4e4e7);
        border-radius: 12px;
        overflow: auto;
        min-width: 0;
      }

      @media (max-width: 900px) {
        .ax-split-page__body {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class AxSplitPageComponent {
  /** Breadcrumb items — first item should be home icon only. */
  readonly breadcrumb = input<BreadcrumbItem[]>([]);

  readonly title = input<string>('');
  readonly subtitle = input<string>('');

  /** Width of the left (list) pane, in pixels. Defaults to 380. */
  readonly listWidth = input<number>(380);

  /** Computed CSS length string for use with the
      --ax-split-list-width custom property binding. */
  readonly listWidthPx = computed(() => `${this.listWidth()}px`);
}
