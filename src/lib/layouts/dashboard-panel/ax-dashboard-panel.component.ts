import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Directive,
  QueryList,
} from '@angular/core';

/**
 * Internal marker directive that lights up on any element carrying the
 * `nav` attribute inside `<ax-dashboard-panel>`. Used to detect whether
 * a nav bar was projected so the panel can hide the slot wrapper when
 * none was supplied. Consumers don't import this — they just write
 * `<div nav>...</div>` (or `<ax-nav-topbar nav theme="dark">`).
 */
@Directive({ selector: '[nav]', standalone: true })
export class AxDashboardPanelNavSlotDirective {}

/**
 * <ax-dashboard-panel>
 *
 * Dark-gradient wrapper that hosts a dashboard's "hero" region:
 * an optional nav bar at the top + a two-column body for a hero card
 * and a chart area. Part of the dashboard dark panel toolkit.
 *
 * Content projection:
 *   [nav]    — optional top bar. Typically <ax-nav-topbar theme="dark">
 *              but accepts any component. Hidden when no [nav] children.
 *   default  — panel body. Expected to contain two direct children:
 *              hero card + chart area (grid layout handles placement).
 *
 * The panel is **always dark** by design; light mode does not flip it.
 * See spec §Data Model / §Design Tokens for the full token list.
 *
 * @example
 *   <ax-dashboard-panel>
 *     <ax-nav-topbar nav theme="dark" [navigation]="nav" />
 *     <ax-hero-metric-card label="Revenue" [value]="'$356.7K'" />
 *     <ax-bar-chart-area title="General processes" [labels]="labels"
 *                        [primary]="primary" [secondary]="secondary" />
 *   </ax-dashboard-panel>
 */
@Component({
  selector: 'ax-dashboard-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (hasNav) {
      <div class="ax-dashboard-panel__nav">
        <ng-content select="[nav]" />
      </div>
    }
    <div class="ax-dashboard-panel__body">
      <ng-content />
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        background: var(
          --ax-dashboard-panel-bg,
          linear-gradient(180deg, #0b1220 0%, #0a0f1c 100%)
        );
        border-radius: var(--ax-dashboard-panel-radius, 20px);
        padding: var(--ax-dashboard-panel-padding, 22px 28px 28px);
        color: #fff;
      }

      .ax-dashboard-panel__nav {
        margin-bottom: 20px;
      }

      .ax-dashboard-panel__body {
        display: grid;
        grid-template-columns: var(--ax-dashboard-panel-body-ratio, 1.4fr 1fr);
        gap: var(--ax-dashboard-panel-body-gap, 24px);
        align-items: stretch;
      }

      @media (max-width: 900px) {
        .ax-dashboard-panel__body {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class AxDashboardPanelComponent {
  /**
   * Picks up every projected element carrying the `nav` attribute.
   * Empty → hide the slot wrapper so the hero/chart sit flush to the
   * panel top.
   */
  @ContentChildren(AxDashboardPanelNavSlotDirective)
  private readonly navSlot!: QueryList<AxDashboardPanelNavSlotDirective>;

  /** True while at least one `[nav]` child is projected. */
  get hasNav(): boolean {
    return this.navSlot?.length > 0;
  }
}
