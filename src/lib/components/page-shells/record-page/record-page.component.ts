import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AxPageShellComponent } from '../../layout/page-shell/page-shell.component';
import { AxPageHeaderComponent } from '../../layout/page-header/page-header.component';
import { BreadcrumbItem } from '../../navigation/breadcrumb/breadcrumb.types';

/**
 * AxRecordPage — Detail / record view page shell (L3 archetype).
 *
 * Used by detail pages: PR/PO detail, budget request detail, receipt
 * detail, contract detail, drug return detail. Composes:
 * - `<ax-page-shell>` as the base wrapper (min-h-screen + max-width +
 *   consistent gap + breadcrumb)
 * - Record code row (code + status badge) rendered above the header
 * - `<ax-page-header>` for title + subtitle + actions (Print, Edit, More menu)
 * - Optional metadata strip (description list — vendor, amount, due date)
 * - Main content area — can be a mat-tab-group, a stack of cards, or
 *   a 2-column grid with sidebar
 * - Optional right sidebar (timeline, approval history)
 *
 * Projection contracts:
 *   [ax-record-status]     — status badge (rendered next to code above the title)
 *   [ax-record-actions]    — top-right action buttons
 *   [ax-record-metadata]   — metadata strip below header (key-value pairs)
 *   (default)              — main content (tabs, cards, sections)
 *   [ax-record-sidebar]    — right sidebar (renders only when provided)
 *
 * @example
 * <ax-record-page
 *   [breadcrumb]="breadcrumbItems"
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
  imports: [AxPageShellComponent, AxPageHeaderComponent],
  template: `
    <ax-page-shell [breadcrumb]="breadcrumb()">
      <div header>
        <div class="ax-record-page__code-row">
          @if (code()) {
            <span class="ax-record-page__code">{{ code() }}</span>
          }
          <ng-content select="[ax-record-status]"></ng-content>
        </div>
        @if (title()) {
          <ax-page-header [title]="title()" [subtitle]="subtitle()">
            <ng-content select="[ax-record-actions]"></ng-content>
          </ax-page-header>
        }
      </div>

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
    </ax-page-shell>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      /* Code row (shown above the ax-page-header title) */
      .ax-record-page__code-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 6px;
      }

      .ax-record-page__code-row:not(:has(*)) {
        display: none;
      }

      .ax-record-page__code {
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 13px;
        font-weight: 700;
        color: var(--ax-text-secondary, #71717a);
        letter-spacing: 0.02em;
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
    `,
  ],
})
export class AxRecordPageComponent {
  /** Breadcrumb items — first item should be home icon only. */
  readonly breadcrumb = input<BreadcrumbItem[]>([]);

  /** Record identifier displayed above the title (e.g. "PR-2026-00041"). */
  readonly code = input<string>('');

  /** Record title / name. */
  readonly title = input<string>('');

  /** Subtitle / metadata line below the title (e.g. "Created on ... by ..."). */
  readonly subtitle = input<string>('');
}
