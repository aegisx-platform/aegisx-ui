import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AxNavAvatarComponent } from './ax-nav-avatar.component';
import { AxNavBadgeComponent } from './ax-nav-badge.component';
import { AppGroup, NavModule, NavUser } from '../models/ax-nav.model';
import { navSlideIn } from '../animations/ax-nav.animations';

@Component({
  selector: 'ax-nav-expanded-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, AxNavAvatarComponent, AxNavBadgeComponent],
  animations: [navSlideIn],
  template: `
    <div class="ax-nav-panel" @navSlideIn>
      <!-- Header -->
      <div class="ax-nav-panel__header">
        <div class="ax-nav-panel__header-left">
          <div
            class="ax-nav-panel__app-icon"
            [style.background]="app.color + '1a'"
            [style.color]="app.color"
          >
            <mat-icon [svgIcon]="app.icon"></mat-icon>
          </div>
          <span class="ax-nav-panel__app-name">{{
            app.labelTh || app.label
          }}</span>
        </div>
        <div class="ax-nav-panel__header-actions">
          <button
            type="button"
            class="ax-nav-panel__pin-btn"
            [class.ax-nav-panel__pin-btn--active]="pinned"
            (click)="pinToggle.emit()"
            [attr.aria-label]="pinned ? 'Unpin panel' : 'Pin panel open'"
          >
            <mat-icon>push_pin</mat-icon>
          </button>
          <button
            type="button"
            class="ax-nav-panel__collapse-btn"
            (click)="collapse.emit()"
            aria-label="Collapse panel"
          >
            <mat-icon>chevron_left</mat-icon>
          </button>
        </div>
      </div>

      <!-- Module list -->
      <div class="ax-nav-panel__modules">
        @for (mod of modules; track mod.id) {
          <button
            type="button"
            class="ax-nav-panel__module"
            [class.ax-nav-panel__module--active]="mod.id === activeModuleId"
            (click)="moduleSelect.emit(mod)"
          >
            <mat-icon
              class="ax-nav-panel__module-icon"
              [class.ax-nav-panel__module-icon--active]="
                mod.id === activeModuleId
              "
              [svgIcon]="mod.icon"
              [style.color]="mod.id === activeModuleId ? app.color : ''"
            ></mat-icon>
            <span class="ax-nav-panel__module-label">{{ mod.label }}</span>
            @if (mod.badge) {
              <ax-nav-badge [count]="mod.badge" />
            }
          </button>
        }
      </div>

      <!-- Bottom: user profile -->
      @if (user) {
        <div class="ax-nav-panel__footer">
          <div class="ax-nav-panel__footer-divider"></div>
          <div class="ax-nav-panel__user">
            <ax-nav-avatar
              [size]="34"
              [initials]="user.initials"
              [avatarUrl]="user.avatarUrl"
              [online]="user.online"
              [borderColor]="'#fff'"
            />
            <div class="ax-nav-panel__user-info">
              <div class="ax-nav-panel__user-name">{{ user.shortName }}</div>
              <div class="ax-nav-panel__user-role">{{ user.role }}</div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .ax-nav-panel {
        width: 240px;
        min-width: 240px;
        height: 100vh;
        background: var(--ax-nav-panel-bg, #fff);
        border-right: 1px solid var(--ax-nav-panel-border, #e5e7eb);
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        z-index: 20;
      }

      .ax-nav-panel__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px 18px 10px;
      }

      .ax-nav-panel__header-left {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .ax-nav-panel__app-icon {
        width: 28px;
        height: 28px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .ax-nav-panel__app-icon mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      .ax-nav-panel__app-name {
        font-size: 15px;
        font-weight: 700;
        color: var(--ax-nav-panel-text, #0f172a);
      }

      .ax-nav-panel__header-actions {
        display: flex;
        gap: 2px;
      }

      .ax-nav-panel__pin-btn,
      .ax-nav-panel__collapse-btn {
        width: 26px;
        height: 26px;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        color: var(--ax-nav-panel-icon-muted, #94a3b8);
        transition: all 0.15s;
      }
      .ax-nav-panel__pin-btn:hover,
      .ax-nav-panel__collapse-btn:hover {
        background: var(--ax-nav-panel-item-hover-bg, #f8fafc);
      }

      .ax-nav-panel__pin-btn {
        transform: rotate(45deg);
      }
      .ax-nav-panel__pin-btn--active {
        transform: rotate(0deg);
        background: var(--ax-primary-subtle, #eff6ff);
        color: var(--ax-primary, #3b82f6);
      }

      .ax-nav-panel__pin-btn mat-icon,
      .ax-nav-panel__collapse-btn mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      /* Module list */
      .ax-nav-panel__modules {
        flex: 1;
        overflow-y: auto;
        padding: 0 18px;
        display: flex;
        flex-direction: column;
        gap: 1px;
      }

      .ax-nav-panel__module {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 9px 12px;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        background: transparent;
        color: var(--ax-nav-panel-text-muted, #64748b);
        font-weight: 450;
        font-size: 14px;
        text-align: left;
        transition: all 0.1s;
        width: 100%;
      }
      .ax-nav-panel__module:hover {
        background: var(--ax-nav-panel-item-hover-bg, #f8fafc);
      }
      .ax-nav-panel__module--active {
        background: var(--ax-nav-panel-item-active-bg, #f1f5f9);
        color: var(--ax-nav-panel-text, #0f172a);
        font-weight: 600;
      }

      .ax-nav-panel__module-icon {
        display: flex;
        width: 18px;
        height: 18px;
        font-size: 18px;
        color: var(--ax-nav-panel-icon-muted, #94a3b8);
      }
      .ax-nav-panel__module-icon--active {
        color: var(--ax-nav-panel-icon-active, #3b82f6);
      }

      .ax-nav-panel__module-label {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* Footer */
      .ax-nav-panel__footer {
        margin-top: auto;
        padding: 0 18px 14px;
      }

      .ax-nav-panel__footer-divider {
        height: 1px;
        background: var(--ax-border-subtle, #f1f5f9);
        margin-bottom: 10px;
      }

      .ax-nav-panel__user {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 6px;
        border-radius: 10px;
        cursor: pointer;
      }

      .ax-nav-panel__user-info {
        flex: 1;
        min-width: 0;
      }

      .ax-nav-panel__user-name {
        font-size: 12.5px;
        font-weight: 600;
        color: var(--ax-nav-panel-text, #0f172a);
      }

      .ax-nav-panel__user-role {
        font-size: 11px;
        color: var(--ax-nav-panel-text-muted, #94a3b8);
      }
    `,
  ],
})
export class AxNavExpandedPanelComponent {
  @Input({ required: true }) app!: AppGroup;
  @Input({ required: true }) modules!: readonly NavModule[];
  @Input({ required: true }) activeModuleId!: string;
  @Input() pinned = false;
  @Input() user?: NavUser;

  @Output() moduleSelect = new EventEmitter<NavModule>();
  @Output() pinToggle = new EventEmitter<void>();
  @Output() collapse = new EventEmitter<void>();
}
