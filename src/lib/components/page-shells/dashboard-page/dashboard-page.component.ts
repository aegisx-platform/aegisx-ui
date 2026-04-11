import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AxPageShellComponent } from '../../layout/page-shell/page-shell.component';
import { AxPageHeaderComponent } from '../../layout/page-header/page-header.component';
import { BreadcrumbItem } from '../../navigation/breadcrumb/breadcrumb.types';

/**
 * AxDashboardPage — Dashboard page shell (L2 archetype).
 *
 * Used by KPI + chart dashboards (budget monitoring, ROP, ABC-VEN,
 * usage anomaly, procurement dashboard). Composes:
 * - `<ax-page-shell>` as the base wrapper (min-h-screen + max-width +
 *   consistent gap + breadcrumb)
 * - `<ax-page-header>` for title + subtitle + action buttons
 *   (fiscal year selector, export, filters)
 * - Optional alert banner slot (warnings, system notices)
 * - KPI strip slot (grid of stat cards — consumer provides their own grid)
 * - Optional filter bar slot (date range, dept picker, etc.)
 * - Main content area (default slot) for charts, tables, anomaly lists
 *
 * Projection contracts:
 *   [ax-dashboard-actions]    — top-right controls (year selector, export)
 *   [ax-dashboard-alert]      — alert banner (shown above KPIs when present)
 *   [ax-dashboard-kpis]       — KPI grid (consumer owns the grid layout)
 *   [ax-dashboard-filters]    — filter bar (between KPIs and main content)
 *   (default)                 — main dashboard content
 */
@Component({
  selector: 'ax-dashboard-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AxPageShellComponent, AxPageHeaderComponent],
  template: `
    <ax-page-shell [breadcrumb]="breadcrumb()">
      <div header>
        @if (title()) {
          <ax-page-header [title]="title()" [subtitle]="subtitle()">
            <ng-content select="[ax-dashboard-actions]"></ng-content>
          </ax-page-header>
        }
      </div>

      <div class="ax-dashboard-page__alert">
        <ng-content select="[ax-dashboard-alert]"></ng-content>
      </div>

      <ng-content select="[ax-dashboard-kpis]"></ng-content>

      <div class="ax-dashboard-page__filters">
        <ng-content select="[ax-dashboard-filters]"></ng-content>
      </div>

      <div class="ax-dashboard-page__content">
        <ng-content></ng-content>
      </div>
    </ax-page-shell>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .ax-dashboard-page__alert:not(:has(*)) {
        display: none;
      }

      .ax-dashboard-page__filters:not(:has(*)) {
        display: none;
      }

      .ax-dashboard-page__content {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
    `,
  ],
})
export class AxDashboardPageComponent {
  /** Breadcrumb items — first item should be home icon only. */
  readonly breadcrumb = input<BreadcrumbItem[]>([]);

  readonly title = input<string>('');
  readonly subtitle = input<string>('');
}
