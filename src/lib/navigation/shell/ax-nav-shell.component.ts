import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';
import { AxNavService } from '../services/ax-nav.service';
import { AxNavShortcutsService } from '../services/ax-nav-shortcuts.service';
import { AxNavRailComponent } from '../layouts/ax-nav-rail.component';
import { AxNavExpandedComponent } from '../layouts/ax-nav-expanded.component';
import { AxNavTopbarComponent } from '../layouts/ax-nav-topbar.component';
import { AxLoadingBarComponent } from '../../components/feedback/loading-bar/loading-bar.component';
import { AxNavUserMenuComponent } from '../features/ax-nav-user-menu.component';
import {
  AxNavContextSwitcherComponent,
  ContextOption,
} from '../features/ax-nav-context-switcher.component';
import { AxNavConfigPopoverComponent } from '../features/ax-nav-config-popover.component';
import { AxNotificationPanelComponent } from '../features/ax-notification-panel.component';
import {
  AxAppSwitcherComponent,
  AppSwitcherData,
} from '../features/ax-app-switcher.component';
import { AxCommandPaletteService } from '../../components/navigation/command-palette/command-palette.service';
import { NavMode, NavNotification } from '../models/ax-nav.model';

@Component({
  selector: 'ax-nav-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AxNavRailComponent,
    AxNavExpandedComponent,
    AxNavTopbarComponent,
    AxLoadingBarComponent,
    AxNavUserMenuComponent,
    AxNavContextSwitcherComponent,
    AxNavConfigPopoverComponent,
    AxNotificationPanelComponent,
  ],
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
          <ax-nav-expanded
            (appSwitcherClick)="onAppSwitcher()"
            (searchClick)="onSearch()"
            (hospitalClick)="onHospital()"
            (notificationClick)="onNotification()"
            (settingsClick)="onSettings()"
            (userMenuClick)="onUserMenu()"
          />
        }
        @case ('topnav') {
          <ax-nav-topbar
            (appSwitcherClick)="onAppSwitcher()"
            (searchClick)="onSearch()"
            (notificationClick)="onNotification()"
            (userMenuClick)="onUserMenu()"
          />
        }
      }

      <!-- Overlays positioned relative to sidebar -->
      <div class="ax-nav-shell__overlays">
        @if (userMenuOpen()) {
          <div
            class="ax-nav-shell__overlay-anchor ax-nav-shell__overlay-anchor--bottom"
          >
            <ax-nav-user-menu
              [user]="navService.user()!"
              [hospital]="navService.activeHospital()"
              [currentMode]="navService.mode()"
              (menuAction)="onMenuAction($event)"
              (modeChange)="onModeChange($event)"
              (closed)="userMenuOpen.set(false)"
            />
          </div>
        }
        @if (hospitalOpen()) {
          <div
            class="ax-nav-shell__overlay-anchor ax-nav-shell__overlay-anchor--top"
          >
            <ax-nav-context-switcher
              [title]="'SWITCH HOSPITAL'"
              [options]="hospitalOptions()"
              [activeId]="navService.hospitalId()"
              (optionSelect)="onHospitalSelect($event)"
              (closed)="hospitalOpen.set(false)"
            />
          </div>
        }
        @if (configOpen()) {
          <div
            class="ax-nav-shell__overlay-anchor ax-nav-shell__overlay-anchor--bottom-settings"
          >
            <ax-nav-config-popover
              [currentMode]="navService.mode()"
              (modeChange)="onModeChange($event)"
              (closed)="configOpen.set(false)"
            />
          </div>
        }
      </div>

      @if (notifPanelOpen()) {
        <ax-notification-panel
          [notifications]="navService.notifications()"
          (notificationClick)="onNotifClick($event)"
          (markAllRead)="onMarkAllRead()"
          (closed)="notifPanelOpen.set(false)"
        />
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
        overflow: hidden;
      }

      .ax-nav-shell {
        display: flex;
        height: 100vh;
        height: 100dvh;
        background: var(--ax-content-bg, #eef1f5);
        font-family:
          'IBM Plex Sans',
          'Noto Sans Thai',
          -apple-system,
          sans-serif;
        position: relative;
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

      /* Overlay anchoring system */
      .ax-nav-shell__overlays {
        position: fixed;
        left: 80px;
        top: 0;
        bottom: 0;
        width: 0;
        z-index: 9998;
        pointer-events: none;
      }
      .ax-nav-shell__overlays > * {
        pointer-events: auto;
      }

      .ax-nav-shell__overlay-anchor {
        position: absolute;
      }
      .ax-nav-shell__overlay-anchor--bottom {
        bottom: 16px;
        left: 12px;
      }
      .ax-nav-shell__overlay-anchor--top {
        top: 80px;
        left: 12px;
      }
      .ax-nav-shell__overlay-anchor--bottom-settings {
        bottom: 70px;
        left: 12px;
      }

      .ax-nav-shell--topnav .ax-nav-shell__overlays {
        left: auto;
        right: 16px;
        top: 56px;
      }
    `,
  ],
})
export class AxNavShellComponent {
  private readonly dialog = inject(Dialog);
  private readonly router = inject(Router);
  private readonly shortcuts = inject(AxNavShortcutsService);
  private readonly commandPalette = inject(AxCommandPaletteService);
  readonly navService = inject(AxNavService);

  // Overlay state
  readonly userMenuOpen = signal(false);
  readonly hospitalOpen = signal(false);
  readonly configOpen = signal(false);
  readonly notifPanelOpen = signal(false);
  private readonly _appSwitcherOpen = signal(false);

  constructor() {
    this.shortcuts.initialize();
    this.shortcuts.onCommandPalette = () => this.onSearch();
    this.shortcuts.onEscape = () => this.closeAllOverlays();
  }

  // Map hospitals to ContextOption for generic switcher
  readonly hospitalOptions = computed(() =>
    this.navService.hospitals().map((h) => ({
      id: h.id,
      label: h.label,
      code: h.code,
    })),
  );

  onAppSwitcher(): void {
    if (this._appSwitcherOpen()) return;
    this.closeAllOverlays();
    this._appSwitcherOpen.set(true);
    const dialogRef = this.dialog.open<
      import('../models/ax-nav.model').AppGroup | undefined
    >(AxAppSwitcherComponent, {
      data: {
        apps: this.navService.visibleApps(),
        activeAppId: this.navService.activeAppId(),
      } satisfies AppSwitcherData,
      hasBackdrop: true,
      backdropClass: 'ax-app-switcher-backdrop',
    });
    dialogRef.closed.subscribe((app) => {
      this._appSwitcherOpen.set(false);
      if (app) {
        this.navService.setActiveApp(app.id);
      }
    });
  }

  onSearch(): void {
    this.closeAllOverlays();
    this.commandPalette.open();
  }

  onHospital(): void {
    this.closeAllOverlays();
    this.hospitalOpen.set(true);
  }

  onNotification(): void {
    this.closeAllOverlays();
    this.notifPanelOpen.set(true);
  }

  onSettings(): void {
    this.closeAllOverlays();
    this.configOpen.set(true);
  }

  onUserMenu(): void {
    this.closeAllOverlays();
    this.userMenuOpen.set(true);
  }

  onMenuAction(action: 'profile' | 'settings' | 'theme' | 'logout'): void {
    this.userMenuOpen.set(false);
    // Consumers handle these via navService event subjects
    this.navService.moduleClick$.next({
      appId: '',
      moduleId: action,
      route: `/${action}`,
    });
  }

  onModeChange(mode: NavMode): void {
    this.navService.setMode(mode);
    this.closeAllOverlays();
  }

  onHospitalSelect(opt: ContextOption): void {
    this.navService.setHospital(opt.id);
    this.hospitalOpen.set(false);
  }

  onNotifClick(notification: NavNotification): void {
    this.navService.markNotificationRead(notification.id);
    this.notifPanelOpen.set(false);
    if (notification.route) {
      this.router.navigate([notification.route]);
    }
  }

  onMarkAllRead(): void {
    this.navService.markAllNotificationsRead();
  }

  private closeAllOverlays(): void {
    this.userMenuOpen.set(false);
    this.hospitalOpen.set(false);
    this.configOpen.set(false);
    this.notifPanelOpen.set(false);
  }
}
