import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { AxPageHeaderComponent } from '../../layout/page-header/page-header.component';

/**
 * AxListPage — Standard list page shell (L1 archetype).
 *
 * Canonical layout for all CRUD list pages. Composes:
 * - Optional breadcrumb slot
 * - Header with title + subtitle + actions slot
 * - Optional stats strip slot (for KPI cards)
 * - Bordered surface containing:
 *   - Optional toolbar slot (search + filters)
 *   - Content area (default slot) with loading / error / empty states
 *   - Optional footer slot (pagination)
 *
 * Projection contracts (select by attribute):
 *   [ax-list-breadcrumb] — above the header
 *   [ax-list-actions]    — top-right action buttons (inside header)
 *   [ax-list-stats]      — KPI strip (between header and surface)
 *   [ax-list-toolbar]    — search + filter bar (inside surface, top)
 *   [ax-list-loading]    — custom loading content (shown when loading=true)
 *   [ax-list-error]      — custom error content (shown when error=true)
 *   [ax-list-empty]      — custom empty content (shown when empty=true)
 *   [ax-list-pagination] — pagination (inside surface, bottom)
 *   (default)            — the table / grid content
 *
 * @example
 * <ax-list-page
 *   title="หมวดหมู่งบประมาณ"
 *   subtitle="จัดการหมวดหมู่งบประมาณของโรงพยาบาล"
 *   [loading]="loading()"
 *   [empty]="items().length === 0">
 *
 *   <ax-breadcrumb ax-list-breadcrumb [items]="crumbs" />
 *
 *   <div ax-list-actions>
 *     <button mat-stroked-button>Export</button>
 *     <button mat-flat-button color="primary">+ สร้างใหม่</button>
 *   </div>
 *
 *   <div ax-list-stats class="grid grid-cols-4 gap-4">
 *     <ax-stat-card ... />
 *     <ax-stat-card ... />
 *   </div>
 *
 *   <div ax-list-toolbar>
 *     <mat-form-field><input matInput placeholder="ค้นหา..." /></mat-form-field>
 *     <button mat-stroked-button>Filter</button>
 *   </div>
 *
 *   <table mat-table [dataSource]="dataSource">...</table>
 *
 *   <ax-empty-state ax-list-empty title="ยังไม่มีข้อมูล" />
 *
 *   <mat-paginator ax-list-pagination />
 * </ax-list-page>
 */
@Component({
  selector: 'ax-list-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AxPageHeaderComponent],
  template: `
    <div class="ax-list-page">
      <!-- Breadcrumb (optional slot, no wrapper) -->
      <ng-content select="[ax-list-breadcrumb]"></ng-content>

      <!-- Header: compose ax-page-header (title + subtitle + actions) -->
      @if (title()) {
        <ax-page-header [title]="title()" [subtitle]="subtitle()">
          <ng-content select="[ax-list-actions]"></ng-content>
        </ax-page-header>
      }

      <!-- Stats strip (optional slot, no wrapper) -->
      <ng-content select="[ax-list-stats]"></ng-content>

      <!-- Main bordered surface -->
      <section class="ax-list-page__surface">
        <!-- Toolbar (hidden if nothing projected) -->
        <div class="ax-list-page__toolbar">
          <ng-content select="[ax-list-toolbar]"></ng-content>
        </div>

        <!-- Body: state switching -->
        <div
          class="ax-list-page__body"
          [class.ax-list-page__body--has-state]="showState()"
        >
          @if (loading()) {
            <div class="ax-list-page__state ax-list-page__state--loading">
              <ng-content select="[ax-list-loading]"></ng-content>
            </div>
          } @else if (error()) {
            <div class="ax-list-page__state ax-list-page__state--error">
              <ng-content select="[ax-list-error]"></ng-content>
            </div>
          } @else if (empty()) {
            <div class="ax-list-page__state ax-list-page__state--empty">
              <ng-content select="[ax-list-empty]"></ng-content>
            </div>
          } @else {
            <ng-content></ng-content>
          }
        </div>

        <!-- Footer / pagination (hidden if nothing projected) -->
        <div class="ax-list-page__footer">
          <ng-content select="[ax-list-pagination]"></ng-content>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .ax-list-page {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 24px;
        max-width: 1600px;
        margin: 0 auto;
      }

      /* Surface — bordered card, subtle (no shadow, relies on border) */
      .ax-list-page__surface {
        background: var(--ax-background-default, #ffffff);
        border: 1px solid var(--ax-border-default, #e4e4e7);
        border-radius: 12px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      /* Toolbar ------------------------------------------------------ */
      .ax-list-page__toolbar {
        padding: 14px 20px;
        border-bottom: 1px solid var(--ax-border-default, #e4e4e7);
        display: flex;
        gap: 12px;
        align-items: center;
        flex-wrap: wrap;
        background: var(--ax-background-default, #ffffff);
      }

      /* Auto-hide toolbar when nothing projected */
      .ax-list-page__toolbar:not(:has(*)) {
        display: none;
      }

      /* Body --------------------------------------------------------- */
      .ax-list-page__body {
        position: relative;
        flex: 1 1 auto;
        min-width: 0;
      }

      /* When a state (loading/empty/error) is visible, give the body
         a min-height so the state is well-centered */
      .ax-list-page__body--has-state {
        min-height: 320px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .ax-list-page__state {
        padding: 48px 24px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--ax-text-secondary, #71717a);
        font-size: 14px;
      }

      /* Footer ------------------------------------------------------- */
      .ax-list-page__footer {
        border-top: 1px solid var(--ax-border-default, #e4e4e7);
        background: var(--ax-background-default, #ffffff);
      }

      .ax-list-page__footer:not(:has(*)) {
        display: none;
      }

      /* Responsive --------------------------------------------------- */
      @media (max-width: 768px) {
        .ax-list-page {
          padding: 16px;
          gap: 16px;
        }
      }
    `,
  ],
})
export class AxListPageComponent {
  /** Page title shown in the header. */
  readonly title = input<string>('');

  /** Optional subtitle shown below the title. */
  readonly subtitle = input<string>('');

  /** When true, shows the [ax-list-loading] slot instead of content. */
  readonly loading = input<boolean>(false);

  /** When true, shows the [ax-list-error] slot instead of content. */
  readonly error = input<boolean>(false);

  /** When true, shows the [ax-list-empty] slot instead of content. */
  readonly empty = input<boolean>(false);

  /** Whether any state (loading/error/empty) is currently active. */
  readonly showState = computed(
    () => this.loading() || this.error() || this.empty(),
  );
}
