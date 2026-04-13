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
import { NavModule } from '../models/ax-nav.model';

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
              [style.background]="app.color + '25'"
              [style.color]="app.color"
            >
              <mat-icon [svgIcon]="app.icon"></mat-icon>
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
            (moduleClick)="onModuleClick($event)"
          />
        }
      </nav>

      <!-- Bottom section -->
      <div class="ax-nav-rail__bottom">
        <div class="ax-nav-rail__divider"></div>

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
              [size]="42"
              [initials]="user.initials"
              [avatarUrl]="user.avatarUrl"
              [online]="user.online"
              [borderColor]="dock ? 'rgba(26,29,35,0.95)' : '#1a1d23'"
              (avatarClick)="userMenuClick.emit()"
            />
          }
        </div>
      </div>
    </aside>
  `,
  styles: [
    `
      .ax-nav-rail {
        width: 80px;
        min-width: 80px;
        height: 100vh;
        background: var(--ax-nav-bg, #1a1d23);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 14px 0;
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
        background: rgba(26, 29, 35, 0.95);
        backdrop-filter: blur(20px) saturate(1.4);
        border-radius: 14px;
        border: 1px solid rgba(255, 255, 255, 0.06);
        box-shadow:
          0 8px 40px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.06);
        z-index: 50;
      }

      .ax-nav-rail__logo {
        cursor: pointer;
        margin-bottom: 2px;
      }

      .ax-nav-rail__hospital {
        display: flex;
        align-items: center;
        gap: 2px;
        font-size: 9px;
        color: rgba(255, 255, 255, 0.3);
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
        color: rgba(255, 255, 255, 0.6);
      }
      .ax-nav-rail__hospital-chevron {
        font-size: 14px;
        width: 14px;
        height: 14px;
      }

      .ax-nav-rail__divider {
        width: 54px;
        height: 1px;
        background: rgba(255, 255, 255, 0.08);
        margin: 8px 0 6px;
      }
      .ax-nav-rail__divider--thin {
        background: rgba(255, 255, 255, 0.06);
        margin: 2px 0 4px;
      }

      .ax-nav-rail__app-switcher {
        position: relative;
        margin-bottom: 4px;
      }

      .ax-nav-rail__btn {
        width: 54px;
        height: 54px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        cursor: pointer;
        background: rgba(255, 255, 255, 0.04);
        color: rgba(255, 255, 255, 0.5);
        transition: all 0.15s;
        position: relative;
      }
      .ax-nav-rail__btn:hover {
        background: rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.8);
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
        width: 54px;
        height: 38px;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.02);
        color: rgba(255, 255, 255, 0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s;
        margin-bottom: 4px;
      }
      .ax-nav-rail__search:hover {
        background: rgba(255, 255, 255, 0.06);
        color: rgba(255, 255, 255, 0.5);
      }
      .ax-nav-rail__search mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      .ax-nav-rail__nav {
        flex: 1;
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
      }

      .ax-nav-rail__avatar-wrap {
        margin-top: 4px;
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
}
