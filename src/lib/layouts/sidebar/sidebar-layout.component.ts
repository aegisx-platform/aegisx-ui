import {
  Component,
  Input,
  Output,
  EventEmitter,
  ContentChild,
  TemplateRef,
  signal,
  OnInit,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { AxLoadingBarComponent } from '../../components/feedback/loading-bar/loading-bar.component';
import { AxNavigationItem } from '../../types/ax-navigation.types';

const COLLAPSED_STORAGE_KEY = 'ax-sidebar-layout:collapsed';

/**
 * Sidebar Layout Component
 *
 * Full-height layout with a left sidebar containing vertical navigation.
 * An alternative to `ax-enterprise-layout` (top horizontal nav) for apps
 * that prefer a persistent left rail — e.g., admin dashboards, CRUD-heavy
 * modules, data-entry workflows (Linear / Notion / Slack pattern).
 *
 * Same API surface as `ax-enterprise-layout` where possible, so shells
 * can swap components without refactoring the navigation data.
 *
 * @example
 * ```html
 * <ax-sidebar-layout
 *   appName="Inventory"
 *   [navigation]="navItems"
 *   (profileClicked)="onProfile()"
 *   (logoutClicked)="onLogout()"
 * >
 *   <router-outlet></router-outlet>
 * </ax-sidebar-layout>
 * ```
 *
 * Features:
 * - Collapsible sidebar (256px expanded / 64px icon-only)
 * - LocalStorage persistence of collapsed state
 * - Keyboard shortcut support (consumer wires `Cmd/Ctrl+B` to `toggleCollapsed()`)
 * - Nested navigation (one level of children shown inline when expanded,
 *   as a popover when collapsed)
 * - Custom header actions and user menu via content projection
 * - Loading bar integration
 */
@Component({
  selector: 'ax-sidebar-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule,
    AxLoadingBarComponent,
  ],
  template: `
    <div
      class="ax-sidebar-layout"
      [class.ax-sidebar-layout--collapsed]="collapsed()"
    >
      <ax-loading-bar variant="primary" />

      <!-- Sidebar -->
      <aside class="ax-sidebar" [attr.aria-label]="appName + ' navigation'">
        <!-- Brand -->
        <div class="ax-sidebar__brand">
          @if (logoUrl) {
            <img [src]="logoUrl" [alt]="appName" class="ax-sidebar__logo" />
          } @else {
            <div class="ax-sidebar__logo-placeholder">
              <mat-icon>widgets</mat-icon>
            </div>
          }
          @if (!collapsed()) {
            <span class="ax-sidebar__brand-text">{{ appName }}</span>
          }
        </div>

        <!-- Navigation -->
        @if (navigation.length > 0) {
          <nav class="ax-sidebar__nav">
            @for (item of navigation; track item.id) {
              @if (!item.children || item.children.length === 0) {
                <a
                  [routerLink]="item.link"
                  routerLinkActive="ax-sidebar__nav-link--active"
                  [routerLinkActiveOptions]="{
                    exact: item.exactMatch ?? false,
                  }"
                  class="ax-sidebar__nav-link"
                  [class.ax-sidebar__nav-link--disabled]="item.disabled"
                  [matTooltip]="collapsed() ? item.title : ''"
                  matTooltipPosition="right"
                >
                  @if (item.icon) {
                    <mat-icon class="ax-sidebar__nav-icon">
                      {{ item.icon }}
                    </mat-icon>
                  }
                  @if (!collapsed()) {
                    <span class="ax-sidebar__nav-label">{{ item.title }}</span>
                  }
                  @if (!collapsed() && item.badge) {
                    <span
                      class="ax-sidebar__badge"
                      [class]="'badge-' + (item.badge.type || 'primary')"
                    >
                      {{ item.badge.content || item.badge.title }}
                    </span>
                  }
                </a>
              } @else {
                <!-- Parent with children -->
                @if (!collapsed()) {
                  <div class="ax-sidebar__nav-group">
                    <div class="ax-sidebar__nav-group-label">
                      @if (item.icon) {
                        <mat-icon class="ax-sidebar__nav-icon">
                          {{ item.icon }}
                        </mat-icon>
                      }
                      <span>{{ item.title }}</span>
                    </div>
                    @for (child of item.children; track child.id) {
                      <a
                        [routerLink]="child.link"
                        routerLinkActive="ax-sidebar__nav-link--active"
                        [routerLinkActiveOptions]="{
                          exact: child.exactMatch ?? false,
                        }"
                        class="ax-sidebar__nav-link ax-sidebar__nav-link--child"
                      >
                        @if (child.icon) {
                          <mat-icon class="ax-sidebar__nav-icon">
                            {{ child.icon }}
                          </mat-icon>
                        }
                        <span class="ax-sidebar__nav-label">
                          {{ child.title }}
                        </span>
                      </a>
                    }
                  </div>
                } @else {
                  <!-- Collapsed: parent icon opens menu -->
                  <button
                    type="button"
                    class="ax-sidebar__nav-link"
                    [matMenuTriggerFor]="childMenu"
                    [matTooltip]="item.title"
                    matTooltipPosition="right"
                  >
                    @if (item.icon) {
                      <mat-icon class="ax-sidebar__nav-icon">
                        {{ item.icon }}
                      </mat-icon>
                    }
                  </button>
                  <mat-menu #childMenu="matMenu">
                    @for (child of item.children; track child.id) {
                      <a mat-menu-item [routerLink]="child.link">
                        @if (child.icon) {
                          <mat-icon>{{ child.icon }}</mat-icon>
                        }
                        <span>{{ child.title }}</span>
                      </a>
                    }
                  </mat-menu>
                }
              }
            }
          </nav>
        }

        <!-- Footer: user menu + collapse toggle -->
        <div class="ax-sidebar__footer">
          @if (userMenu) {
            <ng-container [ngTemplateOutlet]="userMenu" />
          } @else if (showDefaultUserMenu) {
            <button
              type="button"
              class="ax-sidebar__user-btn"
              [matMenuTriggerFor]="defaultUserMenu"
              [matTooltip]="collapsed() ? 'Account' : ''"
              matTooltipPosition="right"
            >
              <mat-icon class="ax-sidebar__nav-icon">account_circle</mat-icon>
              @if (!collapsed()) {
                <span class="ax-sidebar__nav-label">Account</span>
              }
            </button>
            <mat-menu #defaultUserMenu="matMenu">
              <button mat-menu-item (click)="profileClicked.emit()">
                <mat-icon>person</mat-icon>
                <span>Profile</span>
              </button>
              @if (showSettingsMenuItem) {
                <button mat-menu-item (click)="settingsClicked.emit()">
                  <mat-icon>settings</mat-icon>
                  <span>Settings</span>
                </button>
              }
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logoutClicked.emit()">
                <mat-icon>logout</mat-icon>
                <span>Sign out</span>
              </button>
            </mat-menu>
          }

          <button
            type="button"
            class="ax-sidebar__collapse-btn"
            (click)="toggleCollapsed()"
            [matTooltip]="collapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
            matTooltipPosition="right"
          >
            <mat-icon>
              {{ collapsed() ? 'chevron_right' : 'chevron_left' }}
            </mat-icon>
            @if (!collapsed()) {
              <span class="ax-sidebar__collapse-label">Collapse</span>
            }
          </button>
        </div>
      </aside>

      <!-- Main area -->
      <main class="ax-sidebar-main">
        @if (headerActions) {
          <header class="ax-sidebar-main__header">
            <ng-container [ngTemplateOutlet]="headerActions" />
          </header>
        }
        <div class="ax-sidebar-main__content">
          <ng-content></ng-content>
        </div>
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

      .ax-sidebar-layout {
        display: grid;
        grid-template-columns: 256px 1fr;
        min-height: 100vh;
        background: var(--ax-background-default, #ffffff);
        transition: grid-template-columns 0.2s ease;
      }

      .ax-sidebar-layout--collapsed {
        grid-template-columns: 64px 1fr;
      }

      /* Sidebar -------------------------------------------------------- */
      .ax-sidebar {
        position: sticky;
        top: 0;
        height: 100vh;
        display: flex;
        flex-direction: column;
        background: var(--ax-background-default, #ffffff);
        border-right: 1px solid var(--ax-border-default, #e4e4e7);
        overflow: hidden;
      }

      .ax-sidebar__brand {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 20px;
        border-bottom: 1px solid var(--ax-border-default, #e4e4e7);
        flex-shrink: 0;
        height: 64px;
      }

      .ax-sidebar__logo,
      .ax-sidebar__logo-placeholder {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .ax-sidebar__logo-placeholder {
        background: var(--ax-primary, #6366f1);
        color: #ffffff;
      }

      .ax-sidebar__logo-placeholder mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      .ax-sidebar__brand-text {
        font-size: 15px;
        font-weight: 600;
        color: var(--ax-text-heading, #09090b);
        letter-spacing: -0.01em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* Nav ------------------------------------------------------------ */
      .ax-sidebar__nav {
        flex: 1 1 auto;
        overflow-y: auto;
        padding: 8px;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .ax-sidebar__nav-link {
        position: relative;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 12px;
        border-radius: 8px;
        border: none;
        background: transparent;
        color: var(--ax-text-secondary, #52525b);
        font-size: 14px;
        font-weight: 500;
        text-decoration: none;
        transition:
          background 0.15s,
          color 0.15s;
        cursor: pointer;
        text-align: left;
        width: 100%;
      }

      .ax-sidebar__nav-link:hover {
        background: var(--ax-background-subtle, #f4f4f5);
        color: var(--ax-text-default, #18181b);
      }

      .ax-sidebar__nav-link--active,
      .ax-sidebar__nav-link--active:hover {
        background: var(--ax-primary-faint, #eef2ff);
        color: var(--ax-primary, #6366f1);
        font-weight: 600;
      }

      .ax-sidebar__nav-link--active::before {
        content: '';
        position: absolute;
        left: -8px;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 20px;
        background: var(--ax-primary, #6366f1);
        border-radius: 0 2px 2px 0;
      }

      .ax-sidebar__nav-link--disabled {
        opacity: 0.4;
        pointer-events: none;
      }

      .ax-sidebar__nav-link--child {
        padding-left: 32px;
        font-size: 13px;
      }

      .ax-sidebar__nav-icon {
        flex-shrink: 0;
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      .ax-sidebar__nav-label {
        flex: 1 1 auto;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .ax-sidebar__badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 20px;
        height: 18px;
        padding: 0 6px;
        font-size: 11px;
        font-weight: 600;
        border-radius: 9999px;
        background: var(--ax-primary-faint, #eef2ff);
        color: var(--ax-primary, #6366f1);
      }

      .ax-sidebar__badge.badge-warn {
        background: var(--ax-warning-faint, #fffbeb);
        color: var(--ax-warning-default, #f59e0b);
      }

      .ax-sidebar__badge.badge-accent {
        background: var(--ax-error-faint, #fef2f2);
        color: var(--ax-error-default, #ef4444);
      }

      .ax-sidebar__badge.badge-success {
        background: var(--ax-success-faint, #f0fdf4);
        color: var(--ax-success-default, #22c55e);
      }

      .ax-sidebar__badge.badge-info {
        background: var(--ax-info-faint, #eff6ff);
        color: var(--ax-info-default, #3b82f6);
      }

      /* Nav groups */
      .ax-sidebar__nav-group {
        margin-top: 12px;
      }

      .ax-sidebar__nav-group-label {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 12px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--ax-text-subtle, #a1a1aa);
      }

      /* Footer --------------------------------------------------------- */
      .ax-sidebar__footer {
        padding: 8px;
        border-top: 1px solid var(--ax-border-default, #e4e4e7);
        display: flex;
        flex-direction: column;
        gap: 2px;
        flex-shrink: 0;
      }

      .ax-sidebar__user-btn {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 12px;
        border-radius: 8px;
        border: none;
        background: transparent;
        color: var(--ax-text-default, #18181b);
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        text-align: left;
        width: 100%;
        transition: background 0.15s;
      }

      .ax-sidebar__user-btn:hover {
        background: var(--ax-background-subtle, #f4f4f5);
      }

      .ax-sidebar__collapse-btn {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 12px;
        border-radius: 8px;
        border: none;
        background: transparent;
        color: var(--ax-text-secondary, #52525b);
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        text-align: left;
        width: 100%;
        transition: background 0.15s;
      }

      .ax-sidebar__collapse-btn:hover {
        background: var(--ax-background-subtle, #f4f4f5);
        color: var(--ax-text-default, #18181b);
      }

      .ax-sidebar__collapse-btn mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      /* Main area ------------------------------------------------------ */
      .ax-sidebar-main {
        min-width: 0;
        display: flex;
        flex-direction: column;
      }

      .ax-sidebar-main__header {
        position: sticky;
        top: 0;
        z-index: 10;
        background: var(--ax-background-default, #ffffff);
        border-bottom: 1px solid var(--ax-border-default, #e4e4e7);
        padding: 12px 24px;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .ax-sidebar-main__content {
        flex: 1 1 auto;
        min-width: 0;
      }

      /* Mobile: slide-in drawer (below 900px) */
      @media (max-width: 900px) {
        .ax-sidebar-layout {
          grid-template-columns: 1fr;
        }

        .ax-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: 256px;
          z-index: 200;
          transform: translateX(-100%);
          transition: transform 0.2s ease;
          box-shadow: 2px 0 16px -4px rgba(0, 0, 0, 0.08);
        }

        .ax-sidebar-layout--collapsed .ax-sidebar {
          transform: translateX(0);
        }
      }
    `,
  ],
})
export class AxSidebarLayoutComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);

  /** Logo image URL (optional). Falls back to a placeholder icon. */
  @Input() logoUrl?: string;

  /** App name shown next to the logo. */
  @Input() appName = 'App';

  /** Primary navigation items. Supports one level of children. */
  @Input() navigation: AxNavigationItem[] = [];

  /** Show the default user menu (profile/settings/logout). */
  @Input() showDefaultUserMenu = true;

  /** Include the Settings item in the default user menu. */
  @Input() showSettingsMenuItem = true;

  /** Optional header actions template, projected into the main area header. */
  @ContentChild('headerActions') headerActions?: TemplateRef<unknown>;

  /** Optional user menu template, replaces the default user menu button. */
  @ContentChild('userMenu') userMenu?: TemplateRef<unknown>;

  /** Emitted when the default user menu's profile item is clicked. */
  @Output() profileClicked = new EventEmitter<void>();

  /** Emitted when the default user menu's settings item is clicked. */
  @Output() settingsClicked = new EventEmitter<void>();

  /** Emitted when the default user menu's sign-out item is clicked. */
  @Output() logoutClicked = new EventEmitter<void>();

  /** Emitted whenever the sidebar collapsed state changes. */
  @Output() collapsedChange = new EventEmitter<boolean>();

  /** Current collapsed state (icon-only mode). */
  readonly collapsed = signal(false);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(COLLAPSED_STORAGE_KEY);
      if (stored === 'true') {
        this.collapsed.set(true);
      }
    }
  }

  /** Toggle the sidebar between expanded (256px) and collapsed (64px). */
  toggleCollapsed(): void {
    const next = !this.collapsed();
    this.collapsed.set(next);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(COLLAPSED_STORAGE_KEY, String(next));
    }
    this.collapsedChange.emit(next);
  }
}
