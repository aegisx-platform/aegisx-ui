import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * AxRecordPage — Detail / record view page shell (L3 archetype).
 *
 * Used by detail pages: PR/PO detail, budget request detail, receipt
 * detail, contract detail, drug return detail. Composes:
 * - Optional breadcrumb + back link
 * - Record header: record code (e.g. "PR-2026-00041") + status badge
 *   + title + actions (Print, Edit, More menu)
 * - Optional metadata strip (description list — vendor, amount, due date)
 * - Main content area — can be a mat-tab-group, a stack of cards, or
 *   a 2-column grid with sidebar
 * - Optional right sidebar (timeline, approval history)
 *
 * Projection contracts:
 *   [ax-record-breadcrumb] — above the header
 *   [ax-record-status]     — status badge (rendered next to code in header)
 *   [ax-record-actions]    — top-right action buttons
 *   [ax-record-metadata]   — metadata strip below header (key-value pairs)
 *   (default)              — main content (tabs, cards, sections)
 *   [ax-record-sidebar]    — right sidebar (renders only when provided)
 *
 * @example
 * <ax-record-page
 *   code="PR-2026-00041"
 *   title="ใบขอซื้อยาเดือน เมษายน 2026"
 *   subtitle="สร้างเมื่อ 2026-04-01 โดย สมชาย">
 *   <ax-badge ax-record-status color="success">Approved</ax-badge>
 *   <div ax-record-actions>
 *     <button mat-stroked-button>พิมพ์</button>
 *     <button mat-flat-button color="primary">แก้ไข</button>
 *   </div>
 *   <dl ax-record-metadata>...</dl>
 *   <mat-tab-group>...</mat-tab-group>
 *   <div ax-record-sidebar>Timeline here</div>
 * </ax-record-page>
 */
@Component({
  selector: 'ax-record-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ax-record-page">
      <ng-content select="[ax-record-breadcrumb]"></ng-content>

      <header class="ax-record-page__header">
        <div class="ax-record-page__header-text">
          <div class="ax-record-page__code-row">
            @if (code()) {
              <span class="ax-record-page__code">{{ code() }}</span>
            }
            <ng-content select="[ax-record-status]"></ng-content>
          </div>
          @if (title()) {
            <h1 class="ax-record-page__title">{{ title() }}</h1>
          }
          @if (subtitle()) {
            <p class="ax-record-page__subtitle">{{ subtitle() }}</p>
          }
        </div>
        <div class="ax-record-page__header-actions">
          <ng-content select="[ax-record-actions]"></ng-content>
        </div>
      </header>

      <div class="ax-record-page__metadata">
        <ng-content select="[ax-record-metadata]"></ng-content>
      </div>

      <div class="ax-record-page__body">
        <main class="ax-record-page__main">
          <ng-content></ng-content>
        </main>
        <aside class="ax-record-page__sidebar">
          <ng-content select="[ax-record-sidebar]"></ng-content>
        </aside>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .ax-record-page {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 24px;
        max-width: 1600px;
        margin: 0 auto;
      }

      .ax-record-page__header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
      }

      .ax-record-page__header-text {
        flex: 1 1 auto;
        min-width: 0;
      }

      .ax-record-page__code-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 6px;
      }

      .ax-record-page__code {
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 13px;
        font-weight: 700;
        color: var(--ax-text-secondary, #71717a);
        letter-spacing: 0.02em;
      }

      .ax-record-page__title {
        font-size: 22px;
        font-weight: 800;
        color: var(--ax-text-heading, #09090b);
        margin: 0;
        letter-spacing: -0.02em;
        line-height: 1.3;
      }

      .ax-record-page__subtitle {
        font-size: 13px;
        color: var(--ax-text-secondary, #71717a);
        margin: 4px 0 0;
        line-height: 1.4;
      }

      .ax-record-page__header-actions {
        display: flex;
        gap: 8px;
        flex-shrink: 0;
        align-items: center;
      }

      .ax-record-page__header-actions:not(:has(*)) {
        display: none;
      }

      /* Metadata strip ------------------------------------------------ */
      .ax-record-page__metadata:not(:has(*)) {
        display: none;
      }

      .ax-record-page__metadata {
        padding: 16px 20px;
        background: var(--ax-background-default, #ffffff);
        border: 1px solid var(--ax-border-default, #e4e4e7);
        border-radius: 12px;
        box-shadow: var(--ax-shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
      }

      /* Body (2-column with sidebar) --------------------------------- */
      .ax-record-page__body {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 340px;
        gap: 20px;
      }

      /* When sidebar is empty, collapse to single column */
      .ax-record-page__body:not(:has(.ax-record-page__sidebar > *)) {
        grid-template-columns: 1fr;
      }

      .ax-record-page__main {
        min-width: 0;
      }

      .ax-record-page__sidebar {
        min-width: 0;
      }

      /* Hide empty sidebar entirely */
      .ax-record-page__sidebar:not(:has(*)) {
        display: none;
      }

      @media (max-width: 1100px) {
        .ax-record-page__body {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 768px) {
        .ax-record-page {
          padding: 16px;
          gap: 16px;
        }

        .ax-record-page__header {
          flex-direction: column;
          align-items: stretch;
        }

        .ax-record-page__title {
          font-size: 20px;
        }
      }
    `,
  ],
})
export class AxRecordPageComponent {
  /** Record identifier displayed above the title (e.g. "PR-2026-00041"). */
  readonly code = input<string>('');

  /** Record title / name. */
  readonly title = input<string>('');

  /** Subtitle / metadata line below the title (e.g. "Created on ... by ..."). */
  readonly subtitle = input<string>('');
}
