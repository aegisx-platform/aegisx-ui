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
 * AxListPage — Standard list page shell (L1 archetype).
 *
 * Canonical layout for all CRUD list pages. Composes:
 * - `<ax-page-shell>` as the base wrapper (min-h-screen + max-width +
 *   consistent gap, matches every other page in the app)
 * - `<ax-page-header>` for title + subtitle + action buttons
 * - Optional stats strip slot for KPI cards
 * - Bordered surface containing:
 *   - Optional toolbar slot (search + filters)
 *   - Content area (default slot) with loading / error / empty states
 *   - Optional footer slot (pagination)
 *
 * Projection contracts (select by attribute):
 *   [ax-list-actions]    — action buttons (top-right inside the header)
 *   [ax-list-stats]      — KPI strip (between header and surface)
 *   [ax-list-toolbar]    — search + filter bar (inside surface, top)
 *   [ax-list-loading]    — custom loading content
 *   [ax-list-error]      — custom error content
 *   [ax-list-empty]      — custom empty content
 *   [ax-list-pagination] — pagination (inside surface, bottom)
 *   (default)            — the table / grid content
 *
 * @example
 * <ax-list-page
 *   [breadcrumb]="breadcrumbItems"
 *   title="หมวดหมู่งบประมาณ"
 *   subtitle="จัดการหมวดหมู่งบประมาณของโรงพยาบาล"
 *   [loading]="loading()"
 *   [empty]="items().length === 0">
 *
 *   <div ax-list-actions class="flex items-center gap-2">
 *     <button mat-stroked-button>Export</button>
 *     <button mat-flat-button color="primary">+ สร้างใหม่</button>
 *   </div>
 *
 *   <div ax-list-stats class="grid grid-cols-4 gap-4">
 *     <ax-stat-card ... />
 *   </div>
 *
 *   <div ax-list-toolbar>
 *     <mat-form-field><input matInput placeholder="ค้นหา..." /></mat-form-field>
 *   </div>
 *
 *   <table mat-table [dataSource]="dataSource">...</table>
 *
 *   <mat-paginator ax-list-pagination />
 * </ax-list-page>
 */
@Component({
  selector: 'ax-list-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AxPageShellComponent, AxPageHeaderComponent],
  template: `
    <ax-page-shell [breadcrumb]="breadcrumb()">
      <!-- Header slot: page header + optional stats strip -->
      <div header>
        @if (title()) {
          <ax-page-header [title]="title()" [subtitle]="subtitle()">
            <ng-content select="[ax-list-actions]"></ng-content>
          </ax-page-header>
        }
        <ng-content select="[ax-list-stats]"></ng-content>
      </div>

      <!-- Main bordered surface (table card) -->
      <section class="ax-list-page__surface">
        <!-- Toolbar (auto-hide if nothing projected) -->
        <div class="ax-list-page__toolbar">
          <ng-content select="[ax-list-toolbar]"></ng-content>
        </div>

        <!-- Body: state switching -->
        <div
          class="ax-list-page__body"
          [class.ax-list-page__body--has-state]="showState()"
        >
          @if (loading()) {
            <div class="ax-list-page__state">
              <ng-content select="[ax-list-loading]"></ng-content>
            </div>
          } @else if (error()) {
            <div class="ax-list-page__state">
              <ng-content select="[ax-list-error]"></ng-content>
            </div>
          } @else if (empty()) {
            <div class="ax-list-page__state">
              <ng-content select="[ax-list-empty]"></ng-content>
            </div>
          } @else {
            <ng-content></ng-content>
          }
        </div>

        <!-- Footer / pagination (auto-hide if nothing projected) -->
        <div class="ax-list-page__footer">
          <ng-content select="[ax-list-pagination]"></ng-content>
        </div>
      </section>
    </ax-page-shell>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      /* Surface — bordered card, subtle (no shadow, 1px border only) */
      .ax-list-page__surface {
        background: var(--ax-background-default, #ffffff);
        border: 1px solid var(--ax-border-default, #e4e4e7);
        border-radius: 12px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      /* Toolbar */
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

      /* Body */
      .ax-list-page__body {
        position: relative;
        flex: 1 1 auto;
        min-width: 0;
      }

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

      /* Footer */
      .ax-list-page__footer {
        border-top: 1px solid var(--ax-border-default, #e4e4e7);
        background: var(--ax-background-default, #ffffff);
      }

      .ax-list-page__footer:not(:has(*)) {
        display: none;
      }
    `,
  ],
})
export class AxListPageComponent {
  /** Breadcrumb items — first item should be home icon only. */
  readonly breadcrumb = input<BreadcrumbItem[]>([]);

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
