import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AxNavService } from '../services/ax-nav.service';
import { AxNavRailComponent } from '../layouts/ax-nav-rail.component';
import { AxLoadingBarComponent } from '../../components/feedback/loading-bar/loading-bar.component';

@Component({
  selector: 'ax-nav-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AxNavRailComponent, AxLoadingBarComponent],
  template: `
    <ax-loading-bar variant="primary" />
    <div
      class="ax-nav-shell"
      [class.ax-nav-shell--rail]="navService.mode() === 'rail'"
      [class.ax-nav-shell--expanded]="navService.mode() === 'expanded'"
      [class.ax-nav-shell--dock]="navService.mode() === 'dock'"
      [class.ax-nav-shell--topnav]="navService.mode() === 'topnav'"
    >
      @switch (navService.mode()) {
        @case ('rail') {
          <ax-nav-rail
            (appSwitcherClick)="onAppSwitcher()"
            (searchClick)="onSearch()"
            (hospitalClick)="onHospital()"
            (notificationClick)="onNotification()"
            (settingsClick)="onSettings()"
            (userMenuClick)="onUserMenu()"
          />
        }
        @case ('dock') {
          <ax-nav-rail
            [dock]="true"
            (appSwitcherClick)="onAppSwitcher()"
            (searchClick)="onSearch()"
            (hospitalClick)="onHospital()"
            (notificationClick)="onNotification()"
            (settingsClick)="onSettings()"
            (userMenuClick)="onUserMenu()"
          />
        }
        @case ('expanded') {
          <ax-nav-rail
            [hideTooltips]="true"
            (appSwitcherClick)="onAppSwitcher()"
            (searchClick)="onSearch()"
            (hospitalClick)="onHospital()"
            (notificationClick)="onNotification()"
            (settingsClick)="onSettings()"
            (userMenuClick)="onUserMenu()"
          />
        }
        @case ('topnav') {
          <ax-nav-rail
            (appSwitcherClick)="onAppSwitcher()"
            (searchClick)="onSearch()"
            (hospitalClick)="onHospital()"
            (notificationClick)="onNotification()"
            (settingsClick)="onSettings()"
            (userMenuClick)="onUserMenu()"
          />
        }
      }

      <main class="ax-nav-shell__main">
        <ng-content></ng-content>
      </main>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
        min-height: 100vh;
      }

      .ax-nav-shell {
        display: flex;
        min-height: 100vh;
        background: var(--ax-content-bg, #eef1f5);
        font-family:
          'IBM Plex Sans',
          'Noto Sans Thai',
          -apple-system,
          sans-serif;
      }

      .ax-nav-shell--topnav {
        flex-direction: column;
      }

      .ax-nav-shell--dock {
        position: relative;
      }

      .ax-nav-shell__main {
        flex: 1;
        min-width: 0;
        overflow: auto;
      }

      .ax-nav-shell--dock .ax-nav-shell__main {
        padding-left: 112px;
      }
    `,
  ],
})
export class AxNavShellComponent {
  readonly navService = inject(AxNavService);

  onAppSwitcher(): void {
    /* Phase 2 */
  }
  onSearch(): void {
    /* Phase 2: wire to command palette */
  }
  onHospital(): void {
    /* Phase 2 */
  }
  onNotification(): void {
    /* Phase 2 */
  }
  onSettings(): void {
    /* Phase 2 */
  }
  onUserMenu(): void {
    /* Phase 2 */
  }
}
