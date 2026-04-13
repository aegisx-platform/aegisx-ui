import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AxNavService } from '../services/ax-nav.service';
import { AxNavLogoComponent } from '../shared/ax-nav-logo.component';
import { AxNavAvatarComponent } from '../shared/ax-nav-avatar.component';
import { AxNavItemComponent } from '../shared/ax-nav-item.component';
import { AxNavBadgeComponent } from '../shared/ax-nav-badge.component';
import { AppGroup, NavModule } from '../models/ax-nav.model';

@Component({
  selector: 'ax-nav-rail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIconModule,
    MatTooltipModule,
    AxNavLogoComponent,
    AxNavAvatarComponent,
    AxNavItemComponent,
    AxNavBadgeComponent,
  ],
  template: `
    <aside
      class="ax-nav-rail"
      [class.ax-nav-rail--dock]="dock"
      [attr.aria-label]="'Navigation'"
    >
      <!-- Logo -->
      <div class="ax-nav-rail__logo">
        <ax-nav-logo [size]="48" />
      </div>

      <!-- Hospital indicator -->
      @if (navService.activeHospital(); as hospital) {
        <button
          type="button"
          class="ax-nav-rail__hospital"
          matTooltip="Switch hospital"
          matTooltipPosition="right"
          (click)="hospitalClick.emit()"
        >
          {{ hospital.shortName }}
          <mat-icon class="ax-nav-rail__hospital-chevron">expand_more</mat-icon>
        </button>
      }

      <div class="ax-nav-rail__divider"></div>

      <!-- App Switcher -->
      <div class="ax-nav-rail__app-switcher">
        <button
          type="button"
          class="ax-nav-rail__btn"
          matTooltip="Switch App"
          matTooltipPosition="right"
          (click)="appSwitcherClick.emit()"
        >
          @if (navService.activeApp(); as app) {
            <div
              class="ax-nav-rail__app-icon"
              [class.ax-nav-rail__app-icon--diamond]="isAppDiamond(app)"
              [style.background]="
                isAppDiamond(app) ? 'transparent' : app.color + '25'
              "
              [style.color]="app.color"
            >
              <mat-icon [svgIcon]="resolveAppIcon(app)"></mat-icon>
            </div>
          }
        </button>
      </div>

      <!-- Search -->
      <button
        type="button"
        class="ax-nav-rail__search"
        matTooltip="Search (⌘K)"
        matTooltipPosition="right"
        (click)="searchClick.emit()"
      >
        <mat-icon>search</mat-icon>
      </button>

      <div class="ax-nav-rail__divider ax-nav-rail__divider--thin"></div>

      <!-- Module nav -->
      <nav class="ax-nav-rail__nav">
        @for (mod of navService.visibleModules(); track mod.id) {
          <ax-nav-item
            [module]="mod"
            [active]="navService.activeModuleId() === mod.id"
            [appColor]="navService.activeApp()?.color ?? '#3b82f6'"
            [variant]="dock ? 'dock' : 'rail'"
            [showTooltip]="!hideTooltips"
            [showActiveBar]="!dock"
            [iconStyle]="navService.iconStyle()"
            [darkContext]="true"
            (moduleClick)="onModuleClick($event)"
          />
        }
      </nav>

      <!-- Bottom section -->
      <div class="ax-nav-rail__bottom">
        <!-- Notifications -->
        <button
          type="button"
          class="ax-nav-rail__btn"
          matTooltip="Notifications"
          matTooltipPosition="right"
          (click)="notificationClick.emit()"
        >
          <mat-icon>notifications</mat-icon>
          @if (navService.unreadCount() > 0) {
            <ax-nav-badge [count]="navService.unreadCount()" [dot]="true" />
          }
        </button>

        <!-- Settings -->
        <button
          type="button"
          class="ax-nav-rail__btn"
          matTooltip="Settings"
          matTooltipPosition="right"
          (click)="settingsClick.emit()"
        >
          <mat-icon>settings</mat-icon>
        </button>

        <!-- Avatar -->
        <div class="ax-nav-rail__avatar-wrap">
          @if (navService.user(); as user) {
            <ax-nav-avatar
              [size]="38"
              [initials]="user.initials"
              [avatarUrl]="user.avatarUrl"
              [online]="user.online"
              [borderColor]="dock ? 'rgba(15,23,42,0.95)' : '#0f172a'"
              (avatarClick)="userMenuClick.emit()"
            />
          }
        </div>
      </div>
    </aside>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
        height: 100dvh;
        flex-shrink: 0;
      }

      .ax-nav-rail {
        width: 80px;
        min-width: 80px;
        height: 100%;
        box-sizing: border-box;
        overflow: hidden;
        background: var(--ax-nav-bg, #0f172a);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 16px 0 16px;
        flex-shrink: 0;
        z-index: 30;
      }

      /* Dock variant */
      .ax-nav-rail--dock {
        position: absolute;
        left: 12px;
        top: 12px;
        bottom: 12px;
        width: 80px;
        min-width: 80px;
        height: auto;
        background: rgba(15, 23, 42, 0.95);
        backdrop-filter: blur(20px) saturate(1.4);
        border-radius: 14px;
        border: 1px solid rgba(148, 163, 184, 0.1);
        box-shadow:
          0 8px 40px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(148, 163, 184, 0.08);
        z-index: 50;
      }

      .ax-nav-rail__logo {
        cursor: pointer;
        margin-bottom: 2px;
        flex-shrink: 0;
      }

      .ax-nav-rail__hospital {
        display: flex;
        align-items: center;
        gap: 2px;
        font-size: 9px;
        color: var(--ax-nav-icon-default, #64748b);
        background: none;
        border: none;
        cursor: pointer;
        padding: 2px 8px;
        border-radius: 4px;
        font-weight: 500;
        letter-spacing: 0.04em;
        transition: all 0.15s;
      }
      .ax-nav-rail__hospital:hover {
        color: var(--ax-nav-icon-hover, #94a3b8);
      }
      .ax-nav-rail__hospital-chevron {
        font-size: 14px;
        width: 14px;
        height: 14px;
      }

      .ax-nav-rail__divider {
        width: var(--ax-nav-btn-size, 46px);
        height: 1px;
        background: var(--ax-nav-divider, rgba(148, 163, 184, 0.15));
        margin: 4px 0 2px;
      }
      .ax-nav-rail__divider--thin {
        background: var(--ax-nav-divider, rgba(148, 163, 184, 0.1));
        margin: 2px 0 2px;
      }

      .ax-nav-rail__app-switcher {
        position: relative;
        margin-bottom: 2px;
        flex-shrink: 0;
      }

      .ax-nav-rail__btn {
        width: var(--ax-nav-btn-size, 46px);
        height: var(--ax-nav-btn-size, 46px);
        border-radius: var(--ax-nav-btn-radius, 14px);
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        cursor: pointer;
        background: transparent;
        color: var(--ax-nav-icon-default, #94a3b8);
        transition: all 0.15s;
        position: relative;
      }
      .ax-nav-rail__btn:hover {
        background: var(--ax-nav-btn-hover, rgba(148, 163, 184, 0.12));
        color: var(--ax-nav-icon-hover, #cbd5e1);
      }

      .ax-nav-rail__app-icon {
        width: 28px;
        height: 28px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .ax-nav-rail__app-icon mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      .ax-nav-rail__search {
        width: 46px;
        height: 34px;
        border-radius: 12px;
        border: 1px solid rgba(148, 163, 184, 0.15);
        background: rgba(148, 163, 184, 0.05);
        color: var(--ax-nav-icon-default, #94a3b8);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s;
        margin-bottom: 2px;
        flex-shrink: 0;
      }
      .ax-nav-rail__search:hover {
        background: rgba(148, 163, 184, 0.12);
        color: var(--ax-nav-icon-hover, #cbd5e1);
      }
      .ax-nav-rail__search mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      .ax-nav-rail__nav {
        flex: 1;
        min-height: 0; /* prevent flex child from overflowing — allows scroll to work */
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        width: 100%;
        overflow-y: auto;
        overflow-x: hidden;
      }
      .ax-nav-rail__nav::-webkit-scrollbar {
        width: 0;
      }

      .ax-nav-rail__bottom {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        width: 100%;
        flex-shrink: 0;
        margin-top: auto;
      }

      .ax-nav-rail__avatar-wrap {
        margin-top: 0;
      }
    `,
  ],
})
export class AxNavRailComponent {
  readonly navService = inject(AxNavService);

  @Input() dock = false;
  @Input() hideTooltips = false;

  @Output() appSwitcherClick = new EventEmitter<void>();
  @Output() searchClick = new EventEmitter<void>();
  @Output() hospitalClick = new EventEmitter<void>();
  @Output() notificationClick = new EventEmitter<void>();
  @Output() settingsClick = new EventEmitter<void>();
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
