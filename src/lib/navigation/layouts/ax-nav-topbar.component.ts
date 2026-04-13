import {
  ChangeDetectionStrategy,
  Component,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AxNavService } from '../services/ax-nav.service';
import { AxNavLogoComponent } from '../shared/ax-nav-logo.component';
import { AxNavAvatarComponent } from '../shared/ax-nav-avatar.component';
import { AxNavItemComponent } from '../shared/ax-nav-item.component';
import { AxNavBadgeComponent } from '../shared/ax-nav-badge.component';
import { AppGroup, NavModule } from '../models/ax-nav.model';

@Component({
  selector: 'ax-nav-topbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIconModule,
    AxNavLogoComponent,
    AxNavAvatarComponent,
    AxNavItemComponent,
    AxNavBadgeComponent,
  ],
  template: `
    <header class="ax-nav-topbar" [attr.aria-label]="'Main navigation'">
      <!-- Left: logo + brand -->
      <div class="ax-nav-topbar__brand">
        <ax-nav-logo [size]="30" />
        <span class="ax-nav-topbar__brand-text">AegisX</span>
      </div>

      <!-- App pill -->
      <button
        type="button"
        class="ax-nav-topbar__app-pill"
        (click)="appSwitcherClick.emit()"
        [attr.aria-label]="
          'Switch app: ' + (navService.activeApp()?.labelTh ?? '')
        "
      >
        @if (navService.activeApp(); as app) {
          <div
            class="ax-nav-topbar__app-pill-icon"
            [style.background]="
              isAppDiamond(app) ? 'transparent' : app.color + '4d'
            "
            [style.color]="app.color"
          >
            <mat-icon [svgIcon]="resolveAppIcon(app)"></mat-icon>
          </div>
          <span>{{ app.labelTh || app.label }}</span>
        }
        <mat-icon class="ax-nav-topbar__chevron">expand_more</mat-icon>
      </button>

      <div class="ax-nav-topbar__divider"></div>

      <!-- Module tabs -->
      <nav class="ax-nav-topbar__tabs">
        @for (mod of navService.visibleModules(); track mod.id) {
          <ax-nav-item
            [module]="mod"
            [active]="navService.activeModuleId() === mod.id"
            [appColor]="navService.activeApp()?.color ?? '#3b82f6'"
            variant="topbar"
            [showTooltip]="false"
            [showActiveBar]="false"
            [showLabel]="true"
            [iconStyle]="navService.iconStyle()"
            [darkContext]="true"
            (moduleClick)="onModuleClick($event)"
          />
        }
      </nav>

      <!-- Right section -->
      <div class="ax-nav-topbar__right">
        <button
          type="button"
          class="ax-nav-topbar__icon-btn"
          (click)="searchClick.emit()"
          aria-label="Search"
        >
          <mat-icon>search</mat-icon>
        </button>
        <button
          type="button"
          class="ax-nav-topbar__icon-btn"
          (click)="notificationClick.emit()"
          aria-label="Notifications"
        >
          <mat-icon>notifications</mat-icon>
          @if (navService.unreadCount() > 0) {
            <ax-nav-badge
              [count]="navService.unreadCount()"
              [dot]="true"
              [borderColor]="'#0f172a'"
            />
          }
        </button>
        <div class="ax-nav-topbar__divider"></div>
        @if (navService.user(); as user) {
          <ax-nav-avatar
            [size]="32"
            [initials]="user.initials"
            [avatarUrl]="user.avatarUrl"
            [online]="user.online"
            [borderColor]="'#0f172a'"
            (avatarClick)="userMenuClick.emit()"
          />
        }
      </div>
    </header>
  `,
  styles: [
    `
      .ax-nav-topbar {
        width: 100%;
        height: var(--ax-nav-topbar-h, 56px);
        background: var(--ax-nav-topbar, #0f172a);
        display: flex;
        align-items: center;
        padding: 0 16px;
        gap: 4px;
        flex-shrink: 0;
        z-index: 30;
      }

      .ax-nav-topbar__brand {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-right: 8px;
      }

      .ax-nav-topbar__brand-text {
        font-size: 15px;
        font-weight: 700;
        color: var(--ax-nav-text-on-dark, #fff);
      }

      /* App pill */
      .ax-nav-topbar__app-pill {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 5px 12px 5px 8px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.05);
        cursor: pointer;
        margin-right: 8px;
        color: var(--ax-nav-text-on-dark, #fff);
        font-size: 12.5px;
        font-weight: 600;
        transition: all 0.15s;
      }
      .ax-nav-topbar__app-pill:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .ax-nav-topbar__app-pill-icon {
        width: 22px;
        height: 22px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .ax-nav-topbar__app-pill-icon mat-icon {
        font-size: 14px;
        width: 14px;
        height: 14px;
      }

      .ax-nav-topbar__chevron {
        font-size: 14px;
        width: 14px;
        height: 14px;
        color: rgba(255, 255, 255, 0.5);
      }

      /* Divider */
      .ax-nav-topbar__divider {
        width: 1px;
        height: 24px;
        background: rgba(255, 255, 255, 0.1);
        margin: 0 4px;
      }

      /* Module tabs */
      .ax-nav-topbar__tabs {
        display: flex;
        align-items: center;
        gap: 1px;
        flex: 1;
        overflow-x: auto;
      }
      .ax-nav-topbar__tabs::-webkit-scrollbar {
        height: 0;
      }

      /* Right section */
      .ax-nav-topbar__right {
        display: flex;
        align-items: center;
        gap: 2px;
      }

      .ax-nav-topbar__icon-btn {
        width: 34px;
        height: 34px;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        color: var(--ax-nav-icon-default, rgba(255, 255, 255, 0.4));
        transition: all 0.15s;
        position: relative;
      }
      .ax-nav-topbar__icon-btn:hover {
        background: var(--ax-nav-btn-hover, rgba(255, 255, 255, 0.06));
        color: var(--ax-nav-icon-hover, rgba(255, 255, 255, 0.8));
      }
      .ax-nav-topbar__icon-btn mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    `,
  ],
})
export class AxNavTopbarComponent {
  readonly navService = inject(AxNavService);

  @Output() appSwitcherClick = new EventEmitter<void>();
  @Output() searchClick = new EventEmitter<void>();
  @Output() notificationClick = new EventEmitter<void>();
  @Output() userMenuClick = new EventEmitter<void>();

  onModuleClick(mod: NavModule): void {
    this.navService.setActiveModule(mod.id);
  }

  isAppDiamond(app: AppGroup): boolean {
    if (app.icon.startsWith('axd:') || app.icon.startsWith('axdl:'))
      return true;
    return app.iconStyle === 'diamond';
  }

  resolveAppIcon(app: AppGroup): string {
    const icon = app.icon;
    if (icon.includes(':')) return icon;
    if (app.iconStyle === 'diamond') return `axd:${icon}`;
    return `ax:${icon}`;
  }
}
