import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * AxFormPage — Flat form page shell (L5 archetype).
 *
 * Used by settings / configuration forms without multi-step workflow:
 * hospital settings, HIS settings, role management, import-daily,
 * simple create/edit pages. Composes:
 * - Optional breadcrumb + header (title + subtitle + actions)
 * - Main content area for a stack of AxFormSection elements
 * - Sticky footer (Cancel / Save buttons)
 *
 * Use L4 (ax-workflow-page) when the form has multiple steps,
 * L5 when it's a flat form — even long ones.
 *
 * Projection contracts:
 *   [ax-form-breadcrumb] — above the header
 *   [ax-form-actions]    — top-right header actions
 *   (default)            — form sections (use <ax-form-section>)
 *   [ax-form-footer]     — sticky footer actions (Cancel / Save)
 */
@Component({
  selector: 'ax-form-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ax-form-page">
      <ng-content select="[ax-form-breadcrumb]"></ng-content>

      <header class="ax-form-page__header">
        <div class="ax-form-page__header-text">
          @if (title()) {
            <h1 class="ax-form-page__title">{{ title() }}</h1>
          }
          @if (subtitle()) {
            <p class="ax-form-page__subtitle">{{ subtitle() }}</p>
          }
        </div>
        <div class="ax-form-page__header-actions">
          <ng-content select="[ax-form-actions]"></ng-content>
        </div>
      </header>

      <section class="ax-form-page__content">
        <ng-content></ng-content>
      </section>

      <footer class="ax-form-page__footer">
        <ng-content select="[ax-form-footer]"></ng-content>
      </footer>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .ax-form-page {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 24px;
        max-width: 960px; /* narrower for forms */
        margin: 0 auto;
        min-height: 100%;
      }

      .ax-form-page__header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
      }

      .ax-form-page__header-text {
        flex: 1 1 auto;
        min-width: 0;
      }

      .ax-form-page__title {
        font-size: 22px;
        font-weight: 800;
        color: var(--ax-text-heading, #09090b);
        margin: 0;
        letter-spacing: -0.02em;
        line-height: 1.3;
      }

      .ax-form-page__subtitle {
        font-size: 13px;
        color: var(--ax-text-secondary, #71717a);
        margin: 4px 0 0;
        line-height: 1.4;
      }

      .ax-form-page__header-actions {
        display: flex;
        gap: 8px;
        flex-shrink: 0;
        align-items: center;
      }

      .ax-form-page__header-actions:not(:has(*)) {
        display: none;
      }

      .ax-form-page__content {
        background: var(--ax-background-default, #ffffff);
        border: 1px solid var(--ax-border-default, #e4e4e7);
        border-radius: 12px;
        padding: 24px 28px;
        box-shadow: var(--ax-shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
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
        box-shadow: var(--ax-shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
      }

      .ax-form-page__footer:not(:has(*)) {
        display: none;
      }

      @media (max-width: 768px) {
        .ax-form-page {
          padding: 16px;
          gap: 16px;
        }

        .ax-form-page__header {
          flex-direction: column;
          align-items: stretch;
        }

        .ax-form-page__title {
          font-size: 20px;
        }

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
  readonly title = input<string>('');
  readonly subtitle = input<string>('');
}
