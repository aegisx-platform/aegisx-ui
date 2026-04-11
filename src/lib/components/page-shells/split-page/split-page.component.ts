import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

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
 * Projection contracts:
 *   [ax-split-breadcrumb] — above the header
 *   [ax-split-actions]    — top-right header actions
 *   [ax-split-list]       — left pane (list, items, vendors)
 *   [ax-split-detail]     — right pane (detail of selected item)
 */
@Component({
  selector: 'ax-split-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ax-split-page">
      <ng-content select="[ax-split-breadcrumb]"></ng-content>

      <header class="ax-split-page__header">
        <div class="ax-split-page__header-text">
          @if (title()) {
            <h1 class="ax-split-page__title">{{ title() }}</h1>
          }
          @if (subtitle()) {
            <p class="ax-split-page__subtitle">{{ subtitle() }}</p>
          }
        </div>
        <div class="ax-split-page__header-actions">
          <ng-content select="[ax-split-actions]"></ng-content>
        </div>
      </header>

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
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .ax-split-page {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 24px;
        max-width: 1600px;
        margin: 0 auto;
        height: 100%;
      }

      .ax-split-page__header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
      }

      .ax-split-page__header-text {
        flex: 1 1 auto;
        min-width: 0;
      }

      .ax-split-page__title {
        font-size: 22px;
        font-weight: 800;
        color: var(--ax-text-heading, #09090b);
        margin: 0;
        letter-spacing: -0.02em;
        line-height: 1.3;
      }

      .ax-split-page__subtitle {
        font-size: 13px;
        color: var(--ax-text-secondary, #71717a);
        margin: 4px 0 0;
        line-height: 1.4;
      }

      .ax-split-page__header-actions {
        display: flex;
        gap: 8px;
        flex-shrink: 0;
        align-items: center;
      }

      .ax-split-page__header-actions:not(:has(*)) {
        display: none;
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
        box-shadow: var(--ax-shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
        min-width: 0;
      }

      @media (max-width: 900px) {
        .ax-split-page__body {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 768px) {
        .ax-split-page {
          padding: 16px;
          gap: 16px;
        }

        .ax-split-page__header {
          flex-direction: column;
          align-items: stretch;
        }

        .ax-split-page__title {
          font-size: 20px;
        }
      }
    `,
  ],
})
export class AxSplitPageComponent {
  readonly title = input<string>('');
  readonly subtitle = input<string>('');

  /** Width of the left (list) pane, in pixels. Defaults to 380. */
  readonly listWidth = input<number>(380);

  /** Computed CSS length string for use with the
      --ax-split-list-width custom property binding. */
  readonly listWidthPx = computed(() => `${this.listWidth()}px`);
}
