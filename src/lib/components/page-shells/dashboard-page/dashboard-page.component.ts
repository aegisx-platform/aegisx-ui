import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * AxDashboardPage — Dashboard page shell (L2 archetype).
 *
 * Used by KPI + chart dashboards (budget monitoring, ROP, ABC-VEN,
 * usage anomaly, procurement dashboard). Composes:
 * - Optional breadcrumb + header (title + subtitle + actions for fiscal
 *   year selector, export, filters)
 * - Optional alert banner slot (warnings, system notices)
 * - KPI strip slot (grid of stat cards — consumer provides their own grid)
 * - Optional filter bar slot (date range, dept picker, etc.)
 * - Main content area (default slot) for charts, tables, anomaly lists
 *
 * Projection contracts:
 *   [ax-dashboard-breadcrumb] — above the header
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
  template: `
    <div class="ax-dashboard-page">
      <ng-content select="[ax-dashboard-breadcrumb]"></ng-content>

      <header class="ax-dashboard-page__header">
        <div class="ax-dashboard-page__header-text">
          @if (title()) {
            <h1 class="ax-dashboard-page__title">{{ title() }}</h1>
          }
          @if (subtitle()) {
            <p class="ax-dashboard-page__subtitle">{{ subtitle() }}</p>
          }
        </div>
        <div class="ax-dashboard-page__header-actions">
          <ng-content select="[ax-dashboard-actions]"></ng-content>
        </div>
      </header>

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
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .ax-dashboard-page {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 24px;
        max-width: 1600px;
        margin: 0 auto;
      }

      .ax-dashboard-page__header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
      }

      .ax-dashboard-page__header-text {
        flex: 1 1 auto;
        min-width: 0;
      }

      .ax-dashboard-page__title {
        font-size: 22px;
        font-weight: 800;
        color: var(--ax-text-heading, #09090b);
        margin: 0;
        letter-spacing: -0.02em;
        line-height: 1.3;
      }

      .ax-dashboard-page__subtitle {
        font-size: 13px;
        color: var(--ax-text-secondary, #71717a);
        margin: 4px 0 0;
        line-height: 1.4;
      }

      .ax-dashboard-page__header-actions {
        display: flex;
        gap: 8px;
        flex-shrink: 0;
        align-items: center;
      }

      .ax-dashboard-page__header-actions:not(:has(*)) {
        display: none;
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

      @media (max-width: 768px) {
        .ax-dashboard-page {
          padding: 16px;
          gap: 16px;
        }

        .ax-dashboard-page__header {
          flex-direction: column;
          align-items: stretch;
        }

        .ax-dashboard-page__title {
          font-size: 20px;
        }
      }
    `,
  ],
})
export class AxDashboardPageComponent {
  readonly title = input<string>('');
  readonly subtitle = input<string>('');
}
